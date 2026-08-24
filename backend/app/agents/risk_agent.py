from sqlalchemy.orm import Session
from app.services.risk_service import calculate_account_risk
import datetime

class RiskAssessmentAgent:
    def __init__(self):
        self.agent_id = "AGENT-003"
        self.name = "Risk Assessment Agent"
        self.description = "Calculates fraud probability and severity scores based on transaction patterns, network topology, and behavioral signals."

    def assess_risk(self, db: Session, target_account_id: str) -> dict:
        """
        Executes multi-factor risk checks for an account.
        """
        result = calculate_account_risk(db, target_account_id)
        
        # Update account risk score in DB
        from app.models.account import Account
        acc = db.query(Account).filter_by(account_id=target_account_id).first()
        if acc:
            acc.risk_score = result["risk_score"]
            
        # Update Agent Metrics in DB
        from app.models.agent import Agent
        agent_record = db.query(Agent).filter_by(agent_id=self.agent_id).first()
        if agent_record:
            agent_record.items_analyzed += 1
            agent_record.tasks_completed += 1
            agent_record.last_activity = datetime.datetime.utcnow()

        db.commit()
        return {
            "account_id": target_account_id,
            "risk_score": result["risk_score"],
            "risk_level": result["risk_level"],
            "confidence": result["confidence"],
            "factors": result["factors"]
        }
