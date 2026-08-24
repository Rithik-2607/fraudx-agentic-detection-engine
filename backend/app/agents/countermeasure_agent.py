from sqlalchemy.orm import Session
from app.models.countermeasure import Countermeasure
import datetime
import uuid

class CountermeasureAgent:
    def __init__(self):
        self.agent_id = "AGENT-004"
        self.name = "Countermeasure Agent"
        self.description = "Recommends and initiates appropriate protective actions based on investigation confidence and risk severity."

    def recommend_action(self, db: Session, target_account_id: str, risk_score: float, investigation_id: str = None) -> dict:
        """
        Creates simulated protective action cards in the countermeasures database.
        """
        # Determine countermeasure type based on risk score
        actions_to_take = []
        if risk_score >= 80.0:
            actions_to_take = ["RESTRICT_TRANSACTIONS", "ESCALATE_INVESTIGATION", "GENERATE_FORENSIC_REPORT"]
        elif risk_score >= 60.0:
            actions_to_take = ["RESTRICT_TRANSACTIONS"]
        elif risk_score >= 30.0:
            actions_to_take = ["REQUEST_VERIFICATION"]
        else:
            actions_to_take = ["MONITOR"]

        recommendations = []
        for action in actions_to_take:
            action_id = f"CM-{str(uuid.uuid4())[:8].upper()}"
            # Specific ID override for simulation scenario
            if target_account_id == "U1001" and action == "RESTRICT_TRANSACTIONS":
                action_id = "CM-003"
            elif target_account_id == "U1042" and action == "RESTRICT_TRANSACTIONS":
                action_id = "CM-001"
                
            reason = "High-confidence fraud ring activity detected." if risk_score >= 80.0 else "Elevated behavioral risk flags."
            
            # Check if this countermeasure already exists to prevent duplicate entries
            existing_cm = db.query(Countermeasure).filter_by(
                account_id=target_account_id,
                action_type=action,
                investigation_id=investigation_id
            ).first()

            if not existing_cm:
                new_cm = Countermeasure(
                    action_id=action_id,
                    account_id=target_account_id,
                    investigation_id=investigation_id,
                    action_type=action,
                    reason=reason,
                    risk_score=risk_score,
                    status="Pending Approval" if action == "RESTRICT_TRANSACTIONS" else "Executed"
                )
                db.add(new_cm)
                recommendations.append(new_cm)
            else:
                recommendations.append(existing_cm)

        # Update Agent Metrics in DB
        from app.models.agent import Agent
        agent_record = db.query(Agent).filter_by(agent_id=self.agent_id).first()
        if agent_record:
            agent_record.items_analyzed += len(actions_to_take)
            agent_record.tasks_completed += len(actions_to_take)
            agent_record.last_activity = datetime.datetime.utcnow()

        db.commit()
        return {
            "account_id": target_account_id,
            "recommended_actions": actions_to_take,
            "requires_human_review": any(a == "RESTRICT_TRANSACTIONS" for a in actions_to_take),
            "recommendations": [{"action_id": r.action_id, "action": r.action_type, "status": r.status} for r in recommendations]
        }
    
    def confirm_action(self, db: Session, action_id: str) -> bool:
        """
        Confirms a pending countermeasure. Updates target account status accordingly.
        """
        cm = db.query(Countermeasure).filter_by(action_id=action_id).first()
        if not cm:
            return False
            
        cm.status = "Executed"
        
        # If it's a restriction, update account status
        if cm.action_type == "RESTRICT_TRANSACTIONS":
            from app.models.account import Account
            acc = db.query(Account).filter_by(account_id=cm.account_id).first()
            if acc:
                acc.account_status = "RESTRICTED"
                
        db.commit()
        return True
