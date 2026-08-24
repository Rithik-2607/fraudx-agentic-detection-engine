import asyncio
from sqlalchemy.orm import Session
from app.models.investigation import Investigation
from app.models.notification import Notification
from app.agents.transaction_agent import TransactionAgent
from app.agents.ring_investigator import RingInvestigator
from app.agents.risk_agent import RiskAssessmentAgent
from app.agents.countermeasure_agent import CountermeasureAgent
from app.agents.forensic_agent import ForensicReportAgent
from app.websocket.manager import manager
import datetime
import uuid
import logging

logger = logging.getLogger("app.orchestrator")

async def run_investigation(db: Session, account_id: str) -> dict:
    """
    Coordinates and drives the multi-agent investigation workflow loop.
    Broadcasts step updates to client WebSockets.
    """
    logger.info(f"Orchestration starting for target account: {account_id}")
    
    # 1. Initialize investigation case in database
    investigation_id = f"INV-1025" if account_id == "U1001" else f"INV-1024" if account_id == "U1042" else f"INV-{str(uuid.uuid4())[:8].upper()}"
    
    existing_inv = db.query(Investigation).filter_by(target_account_id=account_id).first()
    if existing_inv:
        investigation_id = existing_inv.investigation_id

    # Instantiate Agents
    tx_agent = TransactionAgent()
    ring_agent = RingInvestigator()
    risk_agent = RiskAssessmentAgent()
    cm_agent = CountermeasureAgent()
    forensic_agent = ForensicReportAgent()

    # Helper broadcast function
    async def send_agent_event(agent: str, action: str, status: str, target: str):
        event = {
            "time": datetime.datetime.utcnow().strftime("%H:%M:%S"),
            "agent": agent,
            "action": action,
            "target": target,
            "status": status,
            "icon": "Activity" if "Transaction" in agent else "Network" if "Ring" in agent else "AlertTriangle" if "Risk" in agent else "Shield" if "Countermeasure" in agent else "FileText"
        }
        await manager.broadcast(event)
        await asyncio.sleep(1.0) # Yield control and simulate latency delay

    # STEP 1: Transaction Agent Flags Sender
    await send_agent_event(tx_agent.name, "Initiated transaction audit scan", "Processing", account_id)
    
    # Gather transactions to audit
    from app.models.transaction import Transaction
    from app.models.account import Account
    
    # Get highest value sent transaction
    first_tx = db.query(Transaction).filter_by(sender_account_id=account_id).order_by(Transaction.amount.desc()).first()
    if first_tx:
        tx_agent.analyze_transaction(db, first_tx.transaction_id)
        
    await send_agent_event(tx_agent.name, "Flagged suspicious money transfer velocity anomalies", "Completed", account_id)

    # STEP 2: Ring Investigator traces graph connections
    await send_agent_event(ring_agent.name, "Initiating NetworkX cycle traversal checks", "Processing", account_id)
    
    ring_res = ring_agent.investigate_account(db, account_id)
    ring_id = ring_res["ring_id"]
    
    await send_agent_event(ring_agent.name, f"Identified multi-node coordination cluster: {ring_id}", "Completed", ring_id)

    # Create investigation case if not exist
    investigation = db.query(Investigation).filter_by(investigation_id=investigation_id).first()
    if not investigation:
        investigation = Investigation(
            investigation_id=investigation_id,
            target_account_id=account_id,
            fraud_ring_id=ring_id,
            risk_score=0.0,
            status="EVIDENCE_GATHERING",
            summary="",
            confidence=0.0
        )
        db.add(investigation)
        db.commit()

    # STEP 3: Risk Agent calculates score
    await send_agent_event(risk_agent.name, "Assessing composite threat multipliers", "Processing", account_id)
    
    risk_res = risk_agent.assess_risk(db, account_id)
    investigation.risk_score = risk_res["risk_score"]
    investigation.confidence = int(risk_res["confidence"] * 100)
    investigation.status = "RISK_ASSESSMENT"
    db.commit()
    
    await send_agent_event(risk_agent.name, f"Calculated composite account risk score: {investigation.risk_score}/100", "Completed", account_id)

    # STEP 4: Countermeasure Agent recommends protection
    await send_agent_event(cm_agent.name, "Determining protective security recommendations", "Processing", account_id)
    
    cm_res = cm_agent.recommend_action(db, account_id, investigation.risk_score, investigation_id)
    investigation.status = "COUNTERMEASURE_PENDING"
    db.commit()

    # Create notifications
    notif_id = f"NOTIF-{str(uuid.uuid4())[:8].upper()}"
    if account_id == "U1001":
        notif_id = "NOTIF-004"
    elif account_id == "U1042":
        notif_id = "NOTIF-002"
        
    new_notif = Notification(
        notification_id=notif_id,
        title=f"Critical threat alert: {account_id}",
        message=f"Autonomous agents detected coordination flags. Risk score: {investigation.risk_score}/100.",
        severity="CRITICAL" if investigation.risk_score >= 80 else "WARNING",
        read=False
    )
    db.add(new_notif)
    db.commit()
    
    await send_agent_event(cm_agent.name, f"Recommended protective actions: {', '.join(cm_res['recommended_actions'])}", "Completed", account_id)

    # STEP 5: Forensic Agent compiles findings
    await send_agent_event(forensic_agent.name, "Compiling agent audit evidence summaries", "Processing", investigation_id)
    
    forensic_agent.generate_report(db, account_id, investigation_id, investigation.risk_score, ring_id)
    
    investigation.summary = (
        f"The system identified a coordinated transaction pattern involving {ring_res['accounts']} accounts. "
        "Funds moved rapidly through multiple intermediary accounts. "
        "Confidence is high due to shared device fingerprints and loop cycles."
    )
    investigation.status = "COMPLETED"
    db.commit()

    await send_agent_event(forensic_agent.name, "Forensic audit report generated and saved", "Completed", investigation_id)

    # Final notification update broadcast
    await manager.broadcast({
        "type": "SIMULATION_COMPLETE",
        "investigation_id": investigation_id,
        "target_account_id": account_id,
        "risk_score": investigation.risk_score
    })

    return {
        "investigation_id": investigation_id,
        "status": "COMPLETED",
        "risk_score": investigation.risk_score,
        "confidence": investigation.confidence
    }
