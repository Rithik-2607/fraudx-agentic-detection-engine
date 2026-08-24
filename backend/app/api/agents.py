from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.agent import Agent

router = APIRouter(prefix="/api/agents", tags=["Agents"])

@router.get("")
def get_agents(db: Session = Depends(get_db)):
    agents = db.query(Agent).all()
    result = []
    for agent in agents:
        # Format response expected by react frontend
        metrics = {}
        if agent.agent_id == "AGENT-001":
            metrics = {"transactionsAnalyzed": agent.items_analyzed, "anomaliesDetected": agent.tasks_completed, "accuracy": 97.3, "avgResponseTime": "< 50ms"}
        elif agent.agent_id == "AGENT-002":
            metrics = {"networksAnalyzed": agent.items_analyzed, "ringsDetected": agent.tasks_completed, "accountsLinked": 248, "avgResponseTime": "< 200ms"}
        elif agent.agent_id == "AGENT-003":
            metrics = {"assessmentsCompleted": agent.items_analyzed, "highRiskIdentified": agent.tasks_completed, "avgConfidence": 91.4, "avgResponseTime": "< 100ms"}
        elif agent.agent_id == "AGENT-004":
            metrics = {"actionsRecommended": agent.items_analyzed, "actionsExecuted": agent.tasks_completed, "preventedLoss": 18400000, "avgResponseTime": "< 150ms"}
        else:
            metrics = {"reportsGenerated": agent.items_analyzed, "pendingReports": 8, "avgResponseTime": "< 3s"}

        result.append({
            "id": agent.agent_id,
            "name": agent.name,
            "status": agent.status,
            "description": agent.description,
            "metrics": metrics,
            "lastActivity": agent.last_activity.isoformat(),
            "color": "#3b82f6" if "Transaction" in agent.name else "#22d3ee" if "Ring" in agent.name else "#f59e0b" if "Risk" in agent.name else "#ef4444" if "Countermeasure" in agent.name else "#22c55e"
        })
    return result

@router.get("/activity")
def get_agent_activities():
    return [
        {"time": "14:32:12", "agent": "Forensic Report Agent", "action": "Investigation report generated", "target": "INV-1024", "status": "Completed", "icon": "FileText"},
        {"time": "14:32:11", "agent": "Countermeasure Agent", "action": "Recommended transaction restriction", "target": "U1042", "status": "Processing", "icon": "Shield"},
        {"time": "14:32:10", "agent": "Risk Assessment Agent", "action": "Calculated risk score: 91/100", "target": "U1042", "status": "Completed", "icon": "AlertTriangle"},
        {"time": "14:32:09", "agent": "Ring Investigator Agent", "action": "Discovered 6 connected accounts", "target": "RING-018", "status": "Completed", "icon": "Network"},
        {"time": "14:32:08", "agent": "Transaction Detection Agent", "action": "Detected abnormal transfer pattern", "target": "U1042", "status": "Completed", "icon": "Activity"}
    ]
