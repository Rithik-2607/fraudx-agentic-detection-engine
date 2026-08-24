from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.report import Report
import json

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("")
def get_reports(db: Session = Depends(get_db)):
    rpts = db.query(Report).all()
    result = []
    for rpt in rpts:
        result.append({
            "id": rpt.report_id,
            "investigation": rpt.investigation_id,
            "type": rpt.report_type.replace("_", " ").title(),
            "riskScore": int(rpt.risk_score),
            "generatedBy": "Forensic Report Agent",
            "date": rpt.created_at.isoformat(),
            "status": "Ready",
            "title": rpt.title
        })
    return result

@router.get("/{report_id}")
def get_report(report_id: str, db: Session = Depends(get_db)):
    rpt = db.query(Report).filter_by(report_id=report_id).first()
    if not rpt:
        raise HTTPException(status_code=404, detail="Report not found")
        
    # Content is stored as a JSON string in report model
    content_data = {}
    try:
        content_data = json.loads(rpt.content)
    except Exception:
        content_data = {
            "executiveSummary": rpt.summary,
            "riskAssessment": f"Overall Risk Score: {rpt.risk_score}/100",
            "fraudRingAnalysis": "Investigation case logs mapped.",
            "transactionEvidence": "Audit evidence compiled.",
            "connectedAccounts": "Target account analysis.",
            "agentFindings": "Autonomous investigator agents triggered.",
            "recommendedCountermeasures": "Hold outbound fund transactions.",
            "investigationTimeline": "Completed",
            "confidenceScore": int(rpt.confidence)
        }

    return {
        "id": rpt.report_id,
        "investigation": rpt.investigation_id,
        "type": rpt.report_type.replace("_", " ").title(),
        "riskScore": int(rpt.risk_score),
        "generatedBy": "Forensic Report Agent",
        "date": rpt.created_at.isoformat(),
        "status": "Ready",
        "title": rpt.title,
        "sections": content_data
    }

@router.post("/generate")
def generate_report_manually(investigation_id: str, db: Session = Depends(get_db)):
    """
    Triggers forensic agent report compilation.
    """
    from app.models.investigation import Investigation
    from app.agents.forensic_agent import ForensicReportAgent
    
    inv = db.query(Investigation).filter_by(investigation_id=investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation case not found")
        
    agent = ForensicReportAgent()
    res = agent.generate_report(db, inv.target_account_id, inv.investigation_id, inv.risk_score, inv.fraud_ring_id)
    
    return {"status": "SUCCESS", "report_id": res["report_id"]}
