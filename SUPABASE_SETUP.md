# FraudX Supabase Setup

## Architecture

The browser never connects to Supabase directly:

```text
User -> React -> FastAPI API -> Fraud/Agent Logic -> Supabase PostgreSQL -> FastAPI response -> React dashboard
```

The Supabase service-role key is used only by the backend environment. Do not put it in `src`, a `VITE_*` variable, or a browser bundle.

## 1. Get the Supabase connection details

In the Supabase dashboard:

1. Open the project.
2. Open **Project Settings -> Database**.
3. Copy a PostgreSQL connection URI from **Connect**.
4. Prefer the session pooler URI when direct database connections are unavailable.
5. Replace its driver prefix with `postgresql+psycopg://` if needed.
6. URL-encode special characters in the database password.

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are project API credentials. SQLAlchemy also needs `DATABASE_URL`; the project URL and service key cannot be used as a PostgreSQL connection URI.

## 2. Configure the backend

Copy the template:

```powershell
cd backend
Copy-Item .env.example .env
```

Keep the existing secret values if `.env` already exists. Set these values in `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql+psycopg://postgres:your-db-password@db.your-project.supabase.co:5432/postgres?sslmode=require
FRONTEND_URL=http://localhost:5173
HOST=127.0.0.1
PORT=8001
SEED_DATABASE=false
```

The `.env` file is ignored by Git. Never commit it.

## 3. Create the schema

Open **Supabase Dashboard -> SQL Editor**, paste the contents of:

```text
backend/migrations/001_supabase_schema.sql
```

Run the SQL once. It is idempotent and creates the existing application entities plus the persistence tables needed for graph membership, evidence, timeline events, agent activity, and simulation runs.

## 4. Install and seed

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
$env:SEED_DATABASE = "true"
python -m app.seed.seed_data
Remove-Item Env:SEED_DATABASE
```

Seeding is destructive by design for this fictional hackathon dataset: it clears the application tables and recreates demo data. Do not run it against real production data. The seed contains fictional accounts, 300+ transactions, three rings, investigations, evidence, events, 20+ activity records, notifications, reports, and a completed simulation run.

FastAPI startup does not reseed an existing database. It only auto-seeds an empty database when `SEED_DATABASE=true`.

## 5. Start the services

Backend terminal:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Frontend terminal:

```powershell
npm run dev
```

Open:

- React: http://localhost:5173
- Backend health: http://localhost:8001/health
- Swagger: http://localhost:8001/docs

## 6. Test the API

```powershell
Invoke-RestMethod http://localhost:8001/health
Invoke-RestMethod http://localhost:8001/api/transactions
Invoke-RestMethod http://localhost:8001/api/fraud-rings
Invoke-RestMethod http://localhost:8001/api/investigations
Invoke-RestMethod http://localhost:8001/api/reports
Invoke-RestMethod http://localhost:8001/api/countermeasures
Invoke-RestMethod http://localhost:8001/api/notifications
Invoke-RestMethod -Method Post http://localhost:8001/api/simulation/run
```

The simulation response is immediate. Its agent stages run in a FastAPI background task, write to Supabase, and broadcast through `ws://localhost:8001/ws/agent-activity`.

## 7. Verify Supabase records

In Supabase **Table Editor**, inspect `accounts`, `transactions`, `fraud_rings`, `fraud_ring_members`, `fraud_ring_edges`, `investigations`, `investigation_evidence`, `investigation_events`, `countermeasures`, `agent_activity`, `notifications`, `reports`, and `simulation_runs`.

After running the simulation, confirm that the latest investigation, agent activity rows, countermeasure recommendations, notification, report, and completed simulation run remain present after refreshing the React page.

## Security notes

- Authentication is intentionally not implemented yet.
- FastAPI is the only application data API used by React.
- `SUPABASE_SERVICE_ROLE_KEY` must exist only in `backend/.env` or the backend deployment secret store.
- Never expose it in frontend source, `VITE_*` variables, logs, or error responses.
