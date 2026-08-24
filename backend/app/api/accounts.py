from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.account import Account
from app.models.transaction import Transaction
from app.services.risk_service import calculate_account_risk
from app.graph.fraud_graph import build_transaction_graph, find_connected_accounts, get_ring_visualization_data

router = APIRouter(prefix="/api/accounts", tags=["Accounts"])

@router.get("")
def get_accounts(db: Session = Depends(get_db)):
    return db.query(Account).all()

@router.get("/{account_id}")
def get_account(account_id: str, db: Session = Depends(get_db)):
    acc = db.query(Account).filter_by(account_id=account_id).first()
    if not acc:
        raise HTTPException(status_code=404, detail=f"Account {account_id} not found")
    return acc

@router.get("/{account_id}/transactions")
def get_account_transactions(account_id: str, db: Session = Depends(get_db)):
    txs = db.query(Transaction).filter(
        (Transaction.sender_account_id == account_id) |
        (Transaction.receiver_account_id == account_id)
    ).all()
    return txs

@router.get("/{account_id}/risk")
def get_account_risk(account_id: str, db: Session = Depends(get_db)):
    """
    Combines transaction risk, network centrality, and shared device anomalies.
    """
    return calculate_account_risk(db, account_id)

@router.get("/{account_id}/network")
def get_account_network(account_id: str, db: Session = Depends(get_db)):
    G = build_transaction_graph(db)
    connected_accs = find_connected_accounts(G, account_id)
    return get_ring_visualization_data(G, connected_accs)
