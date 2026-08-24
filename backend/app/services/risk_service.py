from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.models.account import Account
from app.graph.fraud_graph import build_transaction_graph, calculate_network_risk
import datetime

def calculate_transaction_risk(db: Session, tx_id: str) -> dict:
    """
    Computes modular threat score and flag indicators for a specific transaction.
    Risk is normalized to [0, 100].
    """
    tx = db.query(Transaction).filter_by(transaction_id=tx_id).first()
    if not tx:
        return {"risk_score": 0.0, "risk_level": "LOW", "indicators": []}

    score = 0.0
    indicators = []

    # 1. Large transaction amount check
    if tx.amount >= 100000.0:
        score += 20.0
        indicators.append({"name": "Large Transaction", "score": 20})
    elif tx.amount >= 50000.0:
        score += 10.0
        indicators.append({"name": "Moderate-High Transaction", "score": 10})

    # 2. Rapid repeated transfers check (Velocity)
    # Check if this sender sent multiple transactions in the last 15 minutes
    fifteen_mins_ago = tx.timestamp - datetime.timedelta(minutes=15)
    recent_txs = db.query(Transaction).filter(
        Transaction.sender_account_id == tx.sender_account_id,
        Transaction.timestamp >= fifteen_mins_ago,
        Transaction.transaction_id != tx.transaction_id
    ).all()
    
    if len(recent_txs) >= 4:
        score += 20.0
        indicators.append({"name": "High velocity transfer sequence", "score": 20})
    elif len(recent_txs) >= 2:
        score += 10.0
        indicators.append({"name": "Rapid transfers", "score": 10})

    # 3. Shared device checks
    # Check if other accounts have accessed from this device
    if tx.device_id:
        other_device_users = db.query(Account).filter(
            Account.device_id == tx.device_id,
            Account.account_id != tx.sender_account_id
        ).count()
        if other_device_users >= 1:
            score += 15.0
            indicators.append({"name": "Shared device cluster", "score": 15})

    # 4. Unusual timing check
    # Let's say midnight to 4 AM is unusual
    tx_hour = tx.timestamp.hour
    if 0 <= tx_hour <= 4:
        score += 10.0
        indicators.append({"name": "Unusual transaction timing", "score": 10})

    # 5. Graph network risk check (Circular flow and high-risk neighbors)
    G = build_transaction_graph(db)
    net_score, net_ind = calculate_network_risk(G, tx.sender_account_id)
    if net_score > 0:
        # Scale down graph addition to match local weightings
        scaled_net_score = min(net_score, 25.0)
        score += scaled_net_score
        indicators.append({"name": "Suspicious network connection", "score": int(scaled_net_score)})

    # Clamp final score
    final_score = min(score, 100.0)
    
    if final_score >= 80:
        level = "CRITICAL"
    elif final_score >= 60:
        level = "HIGH"
    elif final_score >= 30:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "risk_score": final_score,
        "risk_level": level,
        "indicators": indicators
    }

def calculate_account_risk(db: Session, account_id: str) -> dict:
    """
    Aggregates composite account risk score by inspecting all outbound/inbound transaction risks.
    """
    account = db.query(Account).filter_by(account_id=account_id).first()
    if not account:
        return {"risk_score": 0.0, "risk_level": "LOW", "factors": []}

    # Gather all sent/received transactions
    sent_txs = db.query(Transaction).filter_by(sender_account_id=account_id).all()
    recv_txs = db.query(Transaction).filter_by(receiver_account_id=account_id).all()
    all_txs = sent_txs + recv_txs

    if not all_txs:
        return {"risk_score": account.risk_score, "risk_level": "LOW", "factors": []}

    # Find highest transaction risk
    highest_tx_risk = max([tx.risk_score for tx in all_txs]) if all_txs else 0.0
    
    # Calculate Network graph centralized risk
    G = build_transaction_graph(db)
    net_score, net_factors = calculate_network_risk(G, account_id)
    
    # Combine signals
    composite_score = min(max(highest_tx_risk, net_score), 100.0)
    
    if composite_score >= 80:
        level = "CRITICAL"
    elif composite_score >= 60:
        level = "HIGH"
    elif composite_score >= 30:
        level = "MEDIUM"
    else:
        level = "LOW"

    factors = []
    if highest_tx_risk >= 60:
        factors.append({"factor": "High-risk transaction logs", "score": int(highest_tx_risk * 0.4)})
    for factor_desc in net_factors:
        # Extract score from net_factor string like "Circular flow loop detected (+30)"
        val = 15
        if "+30" in factor_desc:
            val = 30
        elif "+15" in factor_desc:
            val = 15
        elif "+" in factor_desc:
            val = 20
        factors.append({"factor": factor_desc, "score": val})

    return {
        "risk_score": composite_score,
        "risk_level": level,
        "confidence": 0.94 if composite_score >= 70 else 0.78,
        "factors": factors
    }

def calculate_ring_risk(db: Session, accounts: list) -> float:
    """
    Calculates average composite risk score of accounts in a fraud ring.
    """
    if not accounts:
        return 0.0
    scores = []
    for acc_id in accounts:
        acc = db.query(Account).filter_by(account_id=acc_id).first()
        if acc:
            scores.append(acc.risk_score)
    return sum(scores) / len(scores) if scores else 0.0
