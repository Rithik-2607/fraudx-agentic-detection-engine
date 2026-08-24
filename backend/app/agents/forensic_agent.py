from sqlalchemy.orm import Session
from app.models.report import Report
from app.models.account import Account
from app.models.transaction import Transaction
from app.models.fraud_ring import FraudRing
import json
import datetime
import uuid

class ForensicReportAgent:
    def __init__(self):
        self.agent_id = "AGENT-005"
        self.name = "Forensic Report Agent"
        self.description = "Generates comprehensive investigation reports with evidence summaries, risk analysis, and recommended actions."

    def generate_report(self, db: Session, target_account_id: str, investigation_id: str, risk_score: float, fraud_ring_id: str = None) -> dict:
        """
        Compiles all findings and saves a report to SQLite.
        """
        # Find target account details
        account = db.query(Account).filter_by(account_id=target_account_id).first()
        acc_name = account.name if account else "Unknown Target"
        
        # Predefined mapping for demo scenario consistency
        report_id = f"RPT-{str(uuid.uuid4())[:8].upper()}"
        if target_account_id == "U1001":
            report_id = "RPT-002"
        elif target_account_id == "U1042":
            report_id = "RPT-001"

        # Check if report already exists
        existing_report = db.query(Report).filter_by(investigation_id=investigation_id).first()
        if existing_report:
            return {
                "report_id": existing_report.report_id,
                "title": existing_report.title,
                "status": "Report retrieved"
            }

        # Structure report parts
        title = f"Forensic Audit Investigation Report — {target_account_id}"
        
        # Dynamic template builder
        summary = (
            f"Autonomous forensic audit report initialized for target account {target_account_id} ({acc_name}). "
            f"The risk score is calculated as {risk_score}/100. "
        )
        if fraud_ring_id:
            summary += f"The account is linked to suspicious coordination network {fraud_ring_id}. "

        # Connected Accounts
        connected_accs = [target_account_id]
        if fraud_ring_id:
            ring = db.query(FraudRing).filter_by(ring_id=fraud_ring_id).first()
            if ring:
                # Find other transactions linked to the ring
                txs = db.query(Transaction).filter(
                    (Transaction.sender_account_id == target_account_id) | 
                    (Transaction.receiver_account_id == target_account_id)
                ).all()
                for tx in txs:
                    connected_accs.append(tx.sender_account_id)
                    connected_accs.append(tx.receiver_account_id)
                connected_accs = list(set(connected_accs))

        # Build full JSON content schema expected by detail router
        content = {
            "executiveSummary": (
                f"This report documents a coordinated threat audit involving account {target_account_id}. "
                f"Composite risk score assessment completed at {risk_score}/100 (CRITICAL). "
                "Coordinated fund flows and shared device patterns were identified by autonomous investigators. "
                "Immediate countermeasures are pending review."
            ),
            "riskAssessment": f"Overall Risk Score: {risk_score}/100. Threat vectors include rapid money transfer velocities and shared device fingerprints.",
            "fraudRingAnalysis": f"Account {target_account_id} belongs to active network {fraud_ring_id or 'N/A'}. Graph analysis reveals topological loop cycles.",
            "transactionEvidence": f"Unusual fund flow sequences detected across linked nodes.",
            "connectedAccounts": ", ".join(connected_accs),
            "agentFindings": "Transaction Agent: Flagged velocity anomaly. Ring Investigator: Mapped cycles. Risk Agent: Completed scoring assessment.",
            "recommendedCountermeasures": "Apply transaction restrictions immediately. Escalate to senior audit specialists.",
            "investigationTimeline": "System flagged → Graph component built → Scored → Restricted.",
            "confidenceScore": 94 if risk_score >= 80 else 78
        }

        new_report = Report(
            report_id=report_id,
            investigation_id=investigation_id,
            report_type="FRAUD_INVESTIGATION" if risk_score >= 80 else "RISK_ASSESSMENT",
            title=title,
            summary=summary,
            risk_score=risk_score,
            confidence=94.0 if risk_score >= 80 else 78.0,
            content=json.dumps(content)
        )
        db.add(new_report)

        # Update Agent Metrics in DB
        from app.models.agent import Agent
        agent_record = db.query(Agent).filter_by(agent_id=self.agent_id).first()
        if agent_record:
            agent_record.items_analyzed += 1
            agent_record.tasks_completed += 1
            agent_record.last_activity = datetime.datetime.utcnow()

        db.commit()
        return {
            "report_id": report_id,
            "title": title,
            "status": "Forensic Report compiled successfully"
        }
