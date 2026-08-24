from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.models.account import Account
from app.services.risk_service import calculate_transaction_risk
import datetime

class TransactionAgent:
    def __init__(self):
        self.agent_id = "AGENT-001"
        self.name = "Transaction Detection Agent"
        self.description = "Monitors and analyzes incoming transactions in real-time to detect abnormal patterns, unusual amounts, and suspicious behavior."

    def analyze_transaction(self, db: Session, transaction_id: str) -> dict:
        """
        Processes a transaction and calculates risk scores.
        Updates transaction status and flags it if high risk.
        """
        tx = db.query(Transaction).filter_by(transaction_id=transaction_id).first()
        if not tx:
            return {"error": "Transaction not found"}

        # Perform risk engine audit
        result = calculate_transaction_risk(db, transaction_id)
        
        # Update transaction object
        tx.risk_score = result["risk_score"]
        tx.risk_level = result["risk_level"]
        
        if result["risk_score"] >= 80.0:
            tx.status = "FLAGGED"
        elif result["risk_score"] >= 60.0:
            tx.status = "SUSPICIOUS"
            
        # Update agent metrics in DB
        from app.models.agent import Agent
        agent_record = db.query(Agent).filter_by(agent_id=self.agent_id).first()
        if agent_record:
            agent_record.items_analyzed += 1
            if tx.status in ["FLAGGED", "SUSPICIOUS"]:
                agent_record.tasks_completed += 1
            agent_record.last_activity = datetime.datetime.utcnow()

        db.commit()
        return {
            "transaction_id": transaction_id,
            "risk_score": tx.risk_score,
            "risk_level": tx.risk_level,
            "status": tx.status,
            "indicators": result["indicators"]
        }
