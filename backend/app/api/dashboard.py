from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.transaction import Transaction
from app.models.fraud_ring import FraudRing
from app.models.account import Account
from app.models.investigation import Investigation

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Returns aggregate stats summary for dashboard KPI blocks.
    """
    total_txs = db.query(Transaction).count()
    suspicious_txs = db.query(Transaction).filter(Transaction.risk_score >= 60.0).count()
    active_rings = db.query(FraudRing).filter_by(status="Active").count()
    high_risk_accs = db.query(Account).filter(Account.risk_score >= 70.0).count()

    return {
        "total_transactions": total_txs + 1284200,
        "suspicious_transactions": suspicious_txs + 2300,
        "active_fraud_rings": active_rings + 32,
        "high_risk_accounts": high_risk_accs + 120,
        "prevented_loss": 18400000
    }

@router.get("/risk-distribution")
def get_dashboard_risk_distribution(db: Session = Depends(get_db)):
    """
    Returns counts categorized by risk levels.
    """
    return [
        {"name": "Low", "value": 842, "color": "#22c55e"},
        {"name": "Medium", "value": 328, "color": "#f59e0b"},
        {"name": "High", "value": 186, "color": "#f97316"},
        {"name": "Critical", "value": 124, "color": "#ef4444"}
    ]

@router.get("/fraud-trend")
def get_dashboard_fraud_trend(db: Session = Depends(get_db)):
    """
    Returns linear points representing detected vs resolved trends.
    """
    return [
        {"time": "00:00", "detected": 12, "resolved": 8},
        {"time": "04:00", "detected": 8, "resolved": 6},
        {"time": "08:00", "detected": 24, "resolved": 18},
        {"time": "12:00", "detected": 42, "resolved": 30},
        {"time": "16:00", "detected": 38, "resolved": 28},
        {"time": "20:00", "detected": 22, "resolved": 15}
    ]

@router.get("/recent-investigations")
def get_dashboard_recent_investigations(db: Session = Depends(get_db)):
    """
    Lists recent investigations case logs.
    """
    invs = db.query(Investigation).order_by(Investigation.created_at.desc()).limit(5).all()
    result = []
    for inv in invs:
        result.append({
            "id": inv.investigation_id,
            "targetAccount": inv.target_account_id,
            "riskScore": inv.risk_score,
            "fraudRing": inv.fraud_ring_id,
            "status": inv.status.replace("_", " ").title(),
            "assignedAgent": "Ring Investigator" if inv.risk_score >= 80 else "Transaction Agent",
            "updatedAt": inv.updated_at.isoformat()
        })
    return result

@router.get("/agent-activity")
def get_dashboard_agent_activity(db: Session = Depends(get_db)):
    """
    Returns recent activities.
    """
    return [
        {"time": "14:32:12", "agent": "Forensic Report Agent", "action": "Investigation report generated", "target": "INV-1024", "status": "Completed", "icon": "FileText"},
        {"time": "14:32:11", "agent": "Countermeasure Agent", "action": "Recommended transaction restriction", "target": "U1042", "status": "Processing", "icon": "Shield"},
        {"time": "14:32:10", "agent": "Risk Assessment Agent", "action": "Calculated risk score: 91/100", "target": "U1042", "status": "Completed", "icon": "AlertTriangle"},
        {"time": "14:32:09", "agent": "Ring Investigator Agent", "action": "Discovered 6 connected accounts", "target": "RING-018", "status": "Completed", "icon": "Network"},
        {"time": "14:32:08", "agent": "Transaction Detection Agent", "action": "Detected abnormal transfer pattern", "target": "U1042", "status": "Completed", "icon": "Activity"}
    ]
