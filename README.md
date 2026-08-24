# 🛡️ FraudX — Agentic Fraud Ring Detection & Countermeasure Engine

> **Hackathon Project** | Theme: **Autonomous Agentic AI**

A full-stack AI-powered platform that autonomously detects, investigates, and neutralizes financial fraud rings in real time — using a multi-agent orchestration pipeline.

---

## 🚀 Live Demo Flow

```
Transaction Data
      ↓
Transaction Detection Agent
      ↓
Suspicious Activity Detection
      ↓
Fraud Ring Investigator Agent   ←── Graph / Network Analysis
      ↓
Risk Assessment Agent
      ↓
Countermeasure Agent            ←── Account Freeze / Rate Limit
      ↓
Forensic Report Agent           ←── Auto-generated PDF Reports
```

---

## 🧠 Key Features

- **Multi-Agent Orchestration** — 5 autonomous AI agents work in a pipeline
- **Real-time WebSocket Feed** — Live agent activity streamed to UI
- **Fraud Ring Graph Visualization** — Interactive network topology with evolution timeline
- **Circular Transaction Detection** — Detects U1001→U1002→...→U1006→U1002 patterns
- **Indian Financial Context** — INR currency, Indian cities, realistic account data
- **Auto Countermeasures** — Agents autonomously recommend account restrictions
- **Forensic Reports** — Agents generate investigation reports with evidence logs

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | FastAPI (Python) + SQLAlchemy |
| Database | SQLite (auto-seeded on startup) |
| Real-time | WebSockets |
| Graph Analysis | NetworkX |
| Charts | Recharts |

---

## 📂 Project Structure

```
fraud/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/              # Route handlers (fraud_rings, transactions, etc.)
│   │   ├── agents/           # AI agent logic (transaction, ring, risk, countermeasure, forensic)
│   │   ├── core/             # Database setup, config
│   │   ├── graph/            # NetworkX graph analysis
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── seed/             # DB seed data (50 accounts, 300+ transactions)
│   │   ├── simulation/       # Orchestrator pipeline
│   │   └── websocket/        # WebSocket manager
│   └── main.py
│
└── src/                      # React frontend
    ├── components/           # Reusable UI components
    ├── context/              # SimulationContext (state management)
    ├── data/                 # Mock/fallback data
    ├── pages/                # Dashboard, FraudRings, Investigations, etc.
    └── services/             # API service layer (api.js)
```

---

## ⚙️ Setup & Running

### Prerequisites
- Python 3.11+
- Node.js 22+

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

> Database is **auto-seeded** on first startup with 50 accounts and 300+ transactions.

### Frontend

```bash
# From project root
npm install
npm run dev
```

### Access

| Service | URL |
|---------|-----|
| React App | http://localhost:5173 |
| FastAPI Backend | http://localhost:8001 |
| API Docs (Swagger) | http://localhost:8001/docs |

---

## 🎮 Demo — Running the Simulation

1. Open **http://localhost:5173**
2. Navigate to **Demo** page in sidebar
3. Click **"Run Simulation"**
4. Watch agents detect fraud in real time on the **Live Monitor** page

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Backend health check |
| GET | `/api/dashboard/summary` | KPI stats |
| GET | `/api/fraud-rings` | All fraud rings (with nodes/edges/evolution) |
| GET | `/api/fraud-rings/{id}` | Single ring detail |
| GET | `/api/transactions` | Transaction list |
| GET | `/api/investigations` | Investigation cases |
| GET | `/api/agents` | AI agents status |
| GET | `/api/countermeasures` | Applied countermeasures |
| GET | `/api/reports` | Forensic reports |
| GET | `/api/analytics` | Analytics overview |
| POST | `/api/simulation/run` | Trigger fraud simulation |
| WS | `/ws/agent-activity` | Real-time agent activity stream |

---

## 👤 Author

**Rithik** — [@Rithik-2607](https://github.com/Rithik-2607)
