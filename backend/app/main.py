from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import engine, Base, get_db
from app.websocket.manager import manager
from app.seed.seed_data import seed_db

# Import API routers
from app.api import (
    dashboard,
    transactions,
    accounts,
    fraud_rings,
    investigations,
    agents,
    countermeasures,
    reports,
    analytics,
    notifications,
    simulation
)

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app.main")

# Keep local development convenient; Supabase schema is created by the SQL migration.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Agentic Fraud Ring Detection and Countermeasure Engine",
    description="Backend API exposing autonomous cyber security investigator agents.",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach API routers
app.include_router(dashboard.router)
app.include_router(transactions.router)
app.include_router(accounts.router)
app.include_router(fraud_rings.router)
app.include_router(investigations.router)
app.include_router(agents.router)
app.include_router(countermeasures.router)
app.include_router(reports.router)
app.include_router(analytics.router)
app.include_router(notifications.router)
app.include_router(simulation.router)

@app.on_event("startup")
def startup_event():
    """
    Checks if database needs initial seeding on startup.
    """
    logger.info("Starting up FastAPI Fraud Engine...")
    db = next(get_db())
    from app.models.account import Account
    try:
        # Check if table is empty
        if settings.SEED_DATABASE and not db.query(Account).first():
            logger.info("Database is empty. Auto seeding data...")
            seed_db()
    except Exception as e:
        logger.error(f"Error during auto-seeding: {e}")
    finally:
        db.close()

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    Endpoint verifying application health and SQLite connectivity.
    """
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception:
        db_status = "unreachable"

    return {
        "status": "healthy" if db_status == "healthy" else "unhealthy",
        "service": "Agentic Fraud Detection Backend",
        "database": db_status
    }

@app.websocket("/ws/agent-activity")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint broadcasting autonomous agent activity events.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive by receiving messages
            data = await websocket.receive_text()
            # Respond or ignore as required (mostly unidirectional broadcast)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
