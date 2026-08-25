from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.investigation import Investigation
from app.models.countermeasure import Countermeasure
from app.models.investigation_evidence import InvestigationEvidence
from app.models.investigation_event import InvestigationEvent
from app.agents.orchestrator import run_investigation
from typing import Optional

router = APIRouter(prefix="/api/investigations", tags=["Investigations"])

@router.get("")
def get_investigations(db: Session = Depends(get_db)):
    invs = db.query(Investigation).all()
    result = []
    for inv in invs:
        result.append({
            "id": inv.investigation_id,
            "targetAccount": inv.target_account_id,
            "fraudRing": inv.fraud_ring_id,
            "assignedAgent": "Ring Investigator" if inv.risk_score >= 80 else "Transaction Agent",
            "riskScore": int(inv.risk_score),
            "status": inv.status.replace("_", " ").title(),
            "createdAt": inv.created_at.isoformat(),
            "updatedAt": inv.updated_at.isoformat(),
            "priority": "Critical" if inv.risk_score >= 80 else "High" if inv.risk_score >= 60 else "Medium"
        })
    return result

@router.get("/{investigation_id}")
def get_investigation(investigation_id: str, db: Session = Depends(get_db)):
    inv = db.query(Investigation).filter_by(investigation_id=investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
        
    timeline_steps = [
        {"step": "Transaction Detected", "time": "10:02", "status": "completed", "description": "Abnormal transfer velocity flagged."},
        {"step": "Anomaly Identified", "time": "10:05", "status": "completed", "description": "Shared device fingerprints identified."},
        {"step": "Network Analysis", "time": "10:12", "status": "completed", "description": "Ring Investigator discovered circular flow."},
        {"step": "Related Accounts Found", "time": "10:18", "status": "completed", "description": f"Accounts connected to {inv.target_account_id} linked."},
        {"step": "Risk Assessment", "time": "10:24", "status": "completed" if inv.status != "RISK_ASSESSMENT" else "in-progress", "description": f"Scoring composite risk: {inv.risk_score}/100."},
        {"step": "Countermeasure Recommendation", "time": "10:26" if inv.status == "COMPLETED" else None, "status": "completed" if inv.status == "COMPLETED" else "in-progress" if inv.status == "COUNTERMEASURE_PENDING" else "pending", "description": "Recommend outbound transaction restrictions."}
    ]

    # Pre-coded evidence packages matching what frontend expects
    evidence = {
        "transaction": [
            {"id": "EVD-001", "description": "Unusual transfer velocity deviating from account average.", "severity": "High", "confidence": 92},
            {"id": "EVD-002", "description": "Sequential rapid transfers executed in short timeline.", "severity": "Critical", "confidence": 96}
        ],
        "network": [
            {"id": "EVD-003", "description": f"Linked to suspicious fraud ring coordination {inv.fraud_ring_id or 'N/A'}.", "severity": "Critical", "confidence": 94},
            {"id": "EVD-004", "description": "Circular transaction flow detected.", "severity": "Critical", "confidence": 97}
        ],
        "behavioral": [
            {"id": "EVD-005", "description": "Unusual timing of transaction sequence.", "severity": "High", "confidence": 88},
            {"id": "EVD-006", "description": "Shared device fingerprints linked to multiple entities.", "severity": "High", "confidence": 91}
        ]
    }

    flag_reasons = [
        {"reason": "Circular fund flow pattern detected", "detail": "Funds transferred through loop cycles back to origin."},
        {"reason": "Shared device fingerprint", "detail": "Multiple accounts operating from the same hardware DEV ID."},
        {"reason": "Anomalous transaction velocity", "detail": "High-value transfers completed in rapid sequential order."}
    ]

    return {
        "id": inv.investigation_id,
        "targetAccount": inv.target_account_id,
        "fraudRing": inv.fraud_ring_id,
        "assignedAgent": "Ring Investigator" if inv.risk_score >= 80 else "Transaction Agent",
        "riskScore": int(inv.risk_score),
        "status": inv.status.replace("_", " ").title(),
        "createdAt": inv.created_at.isoformat(),
        "updatedAt": inv.updated_at.isoformat(),
        "priority": "Critical" if inv.risk_score >= 80 else "High" if inv.risk_score >= 60 else "Medium",
        "summary": inv.summary or "Forensic audit active.",
        "confidence": inv.confidence,
        "timeline": timeline_steps,
        "evidence": evidence,
        "flagReasons": flag_reasons
    }

@router.post("/{investigation_id}/run")
async def run_investigation_endpoint(investigation_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Spins up the orchestrator to run investigation steps asynchronously.
    """
    inv = db.query(Investigation).filter_by(investigation_id=investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation case not found")
        
    # Schedule orchestrator execution loop
    background_tasks.add_task(run_investigation, db, inv.target_account_id)
    return {"status": "RUNNING", "message": "Autonomous investigator agents triggered."}

@router.get("/{investigation_id}/evidence")
def get_investigation_evidence(investigation_id: str, db: Session = Depends(get_db)):
    inv = db.query(Investigation).filter_by(investigation_id=investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    evidence_count = db.query(InvestigationEvidence).filter_by(investigation_id=investigation_id).count()
    return {"investigation_id": investigation_id, "evidence_captured": evidence_count}
