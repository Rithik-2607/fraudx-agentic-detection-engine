from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.countermeasure import Countermeasure
from app.agents.countermeasure_agent import CountermeasureAgent

router = APIRouter(prefix="/api/countermeasures", tags=["Countermeasures"])

@router.get("")
def get_countermeasures(db: Session = Depends(get_db)):
    cms = db.query(Countermeasure).all()
    result = []
    for cm in cms:
        result.append({
            "id": cm.action_id,
            "account": cm.account_id,
            "riskScore": int(cm.risk_score),
            "action": cm.action_type.replace("_", " ").title(),
            "triggeredBy": "Countermeasure Agent" if "RESTRICT" in cm.action_type else "Risk Assessment Agent",
            "status": cm.status,
            "time": cm.created_at.isoformat(),
            "investigation": cm.investigation_id,
            "reason": cm.reason,
            "evidence": ["Suspicious connection network", "Velocity pattern anomalies", "Shared device fingerprints"]
        })
    return result

@router.post("/{action_id}/confirm")
def confirm_countermeasure(action_id: str, db: Session = Depends(get_db)):
    agent = CountermeasureAgent()
    success = agent.confirm_action(db, action_id)
    if not success:
        raise HTTPException(status_code=404, detail="Countermeasure action ID not found")
    return {"status": "SUCCESS", "message": f"Countermeasure {action_id} executed successfully."}
