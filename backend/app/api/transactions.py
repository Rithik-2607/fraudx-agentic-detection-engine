from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.transaction import Transaction
from app.services.risk_service import calculate_transaction_risk
from typing import Optional

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

@router.get("")
def get_transactions(
    search: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1),
    db: Session = Depends(get_db)
):
    """
    Paginated list of transactions with search and filter queries.
    """
    query = db.query(Transaction)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Transaction.transaction_id.like(search_term)) |
            (Transaction.sender_account_id.like(search_term)) |
            (Transaction.receiver_account_id.like(search_term)) |
            (Transaction.location.like(search_term)) |
            (Transaction.device_id.like(search_term))
        )
        
    if risk_level and risk_level != "All":
        query = query.filter(Transaction.risk_level == risk_level.upper())
        
    if status and status != "All":
        query = query.filter(Transaction.status == status.upper())
        
    query = query.order_by(Transaction.timestamp.desc())
    
    total = query.count()
    offset = (page - 1) * limit
    results = query.offset(offset).limit(limit).all()
    
    return [
        {
            "id": tx.transaction_id,
            "sender": tx.sender_account_id,
            "receiver": tx.receiver_account_id,
            "amount": tx.amount,
            "currency": tx.currency,
            "timestamp": tx.timestamp.isoformat(),
            "device": tx.device_id,
            "location": tx.location,
            "ip": tx.ip_address,
            "riskScore": int(tx.risk_score),
            "status": tx.status.replace("_", " ").title(),
            "type": tx.transaction_type
        } for tx in results
    ]

@router.get("/{transaction_id}")
def get_transaction_by_id(transaction_id: str, db: Session = Depends(get_db)):
    tx = db.query(Transaction).filter_by(transaction_id=transaction_id).first()
    if not tx:
        return {"detail": f"Transaction {transaction_id} not found"}
        
    return {
        "id": tx.transaction_id,
        "sender": tx.sender_account_id,
        "receiver": tx.receiver_account_id,
        "amount": tx.amount,
        "currency": tx.currency,
        "timestamp": tx.timestamp.isoformat(),
        "device": tx.device_id,
        "location": tx.location,
        "ip": tx.ip_address,
        "riskScore": int(tx.risk_score),
        "status": tx.status.replace("_", " ").title(),
        "type": tx.transaction_type
    }

@router.get("/{transaction_id}/risk")
def get_transaction_risk_factors(transaction_id: str, db: Session = Depends(get_db)):
    """
    Computes and returns the breakdown indicators of threat risk.
    """
    result = calculate_transaction_risk(db, transaction_id)
    # Map to frontend structure
    factors = []
    for ind in result["indicators"]:
        factors.append({
            "factor": ind["name"],
            "score": ind["score"],
            "description": f"Trigger multiplier: +{ind['score']}"
        })
    return factors
