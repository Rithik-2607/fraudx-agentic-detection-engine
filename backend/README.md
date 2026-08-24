# FraudX Backend — Autonomous Fraud Ring Detection and Countermeasure Engine

FastAPI backend mapping autonomous investigator agents and NetworkX graph cycle traversal.

## 1. Setup Instructions

### Create Virtual Environment
```bash
python -m venv .venv
```

### Activate Virtual Environment
- **Windows PowerShell:**
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
- **macOS/Linux:**
  ```bash
  source .venv/bin/activate
  ```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Configure Environment Variables
Create `.env` containing:
```
DATABASE_URL=sqlite:///./fraud_engine.db
FRONTEND_URL=http://localhost:5173
PORT=8000
HOST=127.0.0.1
```

### Seed Database
Seeding happens automatically on FastAPI startup if the database is empty. You can also run it manually:
```bash
python -m app.seed.seed_data
```

### Start FastAPI Application
```bash
uvicorn app.main:app --reload
```

---

## 2. API & Endpoint Documentation
- **Interactive Swagger Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check Endpoint:** [http://localhost:8000/health](http://localhost:8000/health)
- **WebSocket Activity Stream:** `ws://localhost:8000/ws/agent-activity`
