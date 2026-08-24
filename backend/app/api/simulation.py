from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.agents.orchestrator import run_investigation

router = APIRouter(prefix="/api/simulation", tags=["Simulation"])

@router.post("/run")
def run_simulation(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Triggers the predefined circular money laundering scenario (U1001 -> U1002 -> ... -> U1006 -> U1002).
    Coordinates via background tasks and broadcasts WebSocket progress updates.
    """
    # Start investigation for U1001
    background_tasks.add_task(run_investigation, db, "U1001")
    return {
        "status": "STARTED",
        "message": "Fraud simulation scenario (RING-019) initiated in background."
    }
