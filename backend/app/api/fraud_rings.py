from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.fraud_ring import FraudRing
from app.models.transaction import Transaction
from app.models.account import Account
from app.graph.fraud_graph import build_transaction_graph, get_ring_visualization_data

router = APIRouter(prefix="/api/fraud-rings", tags=["Fraud Rings"])

# Static ring account mapping
RING_ACCOUNTS_MAP = {
    "RING-018": ["U1042", "U1088", "U1091", "U1102", "U1132", "U1150"],
    "RING-019": ["U1001", "U1002", "U1003", "U1004", "U1005", "U1006"],
    "RING-020": ["U4001", "U4012", "U4028"]
}

# Pre-built nodes/edges matching frontend mock shape exactly
RING_NODES = {
    "RING-018": [
        {"id": "U1042", "risk": 91, "transactions": 12, "amount": 176500, "role": "Hub"},
        {"id": "U1088", "risk": 87, "transactions": 8, "amount": 144000, "role": "Intermediary"},
        {"id": "U1091", "risk": 78, "transactions": 6, "amount": 130000, "role": "Intermediary"},
        {"id": "U1102", "risk": 82, "transactions": 7, "amount": 123000, "role": "Intermediary"},
        {"id": "U1132", "risk": 74, "transactions": 5, "amount": 103000, "role": "Intermediary"},
        {"id": "U1150", "risk": 95, "transactions": 5, "amount": 137000, "role": "Terminus"},
    ],
    "RING-019": [
        {"id": "U1001", "risk": 88, "transactions": 10, "amount": 300000, "role": "Origin"},
        {"id": "U1002", "risk": 85, "transactions": 9, "amount": 284000, "role": "Layer 1"},
        {"id": "U1003", "risk": 79, "transactions": 7, "amount": 276000, "role": "Layer 2"},
        {"id": "U1004", "risk": 76, "transactions": 5, "amount": 268000, "role": "Layer 3"},
        {"id": "U1005", "risk": 71, "transactions": 4, "amount": 250000, "role": "Layer 4"},
        {"id": "U1006", "risk": 92, "transactions": 3, "amount": 236000, "role": "Collector"},
    ],
    "RING-020": [
        {"id": "U4001", "risk": 65, "transactions": 5, "amount": 500000, "role": "Initiator"},
        {"id": "U4012", "risk": 68, "transactions": 4, "amount": 490000, "role": "Pass-through"},
        {"id": "U4028", "risk": 62, "transactions": 3, "amount": 480000, "role": "Receiver"},
    ]
}

RING_EDGES = {
    "RING-018": [
        {"source": "U1042", "target": "U1088", "transactions": 4, "amount": 84500},
        {"source": "U1088", "target": "U1091", "transactions": 3, "amount": 72000},
        {"source": "U1091", "target": "U1102", "transactions": 3, "amount": 65000},
        {"source": "U1102", "target": "U1132", "transactions": 2, "amount": 58000},
        {"source": "U1132", "target": "U1150", "transactions": 2, "amount": 45000},
        {"source": "U1150", "target": "U1042", "transactions": 3, "amount": 92000},
    ],
    "RING-019": [
        {"source": "U1001", "target": "U1002", "transactions": 5, "amount": 150000},
        {"source": "U1002", "target": "U1003", "transactions": 4, "amount": 142000},
        {"source": "U1003", "target": "U1004", "transactions": 3, "amount": 138000},
        {"source": "U1004", "target": "U1005", "transactions": 3, "amount": 130000},
        {"source": "U1005", "target": "U1006", "transactions": 2, "amount": 125000},
        {"source": "U1006", "target": "U1002", "transactions": 2, "amount": 118000},
    ],
    "RING-020": [
        {"source": "U4001", "target": "U4012", "transactions": 3, "amount": 250000},
        {"source": "U4012", "target": "U4028", "transactions": 3, "amount": 245000},
    ]
}

# Full evolution timelines with edges included (frontend needs edges per step)
RING_EVOLUTIONS = {
    "RING-018": [
        {"time": "10:00", "event": "Initial suspicious account U1042 detected", "accounts": ["U1042"], "edges": []},
        {"time": "10:05", "event": "U1088 connected via rapid transfer", "accounts": ["U1042", "U1088"], "edges": [{"source": "U1042", "target": "U1088"}]},
        {"time": "10:12", "event": "U1091 linked through shared device DEV-882", "accounts": ["U1042", "U1088", "U1091"], "edges": [{"source": "U1042", "target": "U1088"}, {"source": "U1088", "target": "U1091"}]},
        {"time": "10:18", "event": "Money flow expanded to U1102 and U1132", "accounts": ["U1042", "U1088", "U1091", "U1102", "U1132"], "edges": [{"source": "U1042", "target": "U1088"}, {"source": "U1088", "target": "U1091"}, {"source": "U1091", "target": "U1102"}, {"source": "U1102", "target": "U1132"}]},
        {"time": "10:24", "event": "Circular pattern detected — U1150 sends funds back to U1042", "accounts": ["U1042", "U1088", "U1091", "U1102", "U1132", "U1150"], "edges": [{"source": "U1042", "target": "U1088"}, {"source": "U1088", "target": "U1091"}, {"source": "U1091", "target": "U1102"}, {"source": "U1102", "target": "U1132"}, {"source": "U1132", "target": "U1150"}, {"source": "U1150", "target": "U1042"}]},
        {"time": "10:26", "event": "Fraud ring RING-018 confirmed — 6 accounts, 43 transactions", "accounts": ["U1042", "U1088", "U1091", "U1102", "U1132", "U1150"], "edges": [{"source": "U1042", "target": "U1088"}, {"source": "U1088", "target": "U1091"}, {"source": "U1091", "target": "U1102"}, {"source": "U1102", "target": "U1132"}, {"source": "U1132", "target": "U1150"}, {"source": "U1150", "target": "U1042"}]},
    ],
    "RING-019": [
        {"time": "11:30", "event": "Large transfer from U1001 flagged", "accounts": ["U1001"], "edges": []},
        {"time": "11:35", "event": "U1002 identified as immediate receiver", "accounts": ["U1001", "U1002"], "edges": [{"source": "U1001", "target": "U1002"}]},
        {"time": "11:42", "event": "Chain extends through U1003 and U1004", "accounts": ["U1001", "U1002", "U1003", "U1004"], "edges": [{"source": "U1001", "target": "U1002"}, {"source": "U1002", "target": "U1003"}, {"source": "U1003", "target": "U1004"}]},
        {"time": "11:50", "event": "Full layering chain discovered", "accounts": ["U1001", "U1002", "U1003", "U1004", "U1005", "U1006"], "edges": [{"source": "U1001", "target": "U1002"}, {"source": "U1002", "target": "U1003"}, {"source": "U1003", "target": "U1004"}, {"source": "U1004", "target": "U1005"}, {"source": "U1005", "target": "U1006"}]},
        {"time": "11:55", "event": "Loop back to U1002 detected — ring confirmed", "accounts": ["U1001", "U1002", "U1003", "U1004", "U1005", "U1006"], "edges": [{"source": "U1001", "target": "U1002"}, {"source": "U1002", "target": "U1003"}, {"source": "U1003", "target": "U1004"}, {"source": "U1004", "target": "U1005"}, {"source": "U1005", "target": "U1006"}, {"source": "U1006", "target": "U1002"}]},
    ],
    "RING-020": [
        {"time": "12:15", "event": "Rapid transfers flagged from U4001", "accounts": ["U4001"], "edges": []},
        {"time": "12:20", "event": "Pass-through to U4012 identified", "accounts": ["U4001", "U4012"], "edges": [{"source": "U4001", "target": "U4012"}]},
        {"time": "12:28", "event": "Chain confirmed with U4028", "accounts": ["U4001", "U4012", "U4028"], "edges": [{"source": "U4001", "target": "U4012"}, {"source": "U4012", "target": "U4028"}]},
    ]
}

RING_DESCRIPTIONS = {
    "RING-018": "Coordinated circular fund transfer pattern detected across 6 accounts with shared device fingerprints.",
    "RING-019": "Layered fund movement through multiple intermediary accounts to obscure origin.",
    "RING-020": "Rapid sequential transfers between three accounts within a short time window.",
}

def build_ring_response(ring, include_detail=False):
    """Build a fraud ring response object matching the frontend data shape."""
    ring_id = ring.ring_id
    resp = {
        "id": ring_id,
        "accounts": RING_ACCOUNTS_MAP.get(ring_id, []),
        "accountCount": ring.account_count,
        "transactionCount": ring.transaction_count,
        "totalAmount": ring.total_amount,
        "currency": "₹",
        "riskScore": int(ring.risk_score),
        "pattern": ring.pattern_type.replace("_", " ").title(),
        "status": ring.status,
        "detectedAt": ring.detected_at.isoformat(),
        "severity": ring.severity,
        "description": RING_DESCRIPTIONS.get(ring_id, f"Coordinated suspicious pattern ({ring.pattern_type}) detected."),
        "nodes": RING_NODES.get(ring_id, []),
        "edges": RING_EDGES.get(ring_id, []),
        "evolution": RING_EVOLUTIONS.get(ring_id, []),
    }
    return resp


@router.get("")
def get_fraud_rings(db: Session = Depends(get_db)):
    rings = db.query(FraudRing).all()
    return [build_ring_response(ring) for ring in rings]


@router.get("/{ring_id}")
def get_fraud_ring(ring_id: str, db: Session = Depends(get_db)):
    ring = db.query(FraudRing).filter_by(ring_id=ring_id).first()
    if not ring:
        raise HTTPException(status_code=404, detail="Fraud Ring not found")
    return build_ring_response(ring, include_detail=True)


@router.get("/{ring_id}/accounts")
def get_ring_accounts(ring_id: str, db: Session = Depends(get_db)):
    ring = db.query(FraudRing).filter_by(ring_id=ring_id).first()
    if not ring:
        raise HTTPException(status_code=404, detail="Fraud Ring not found")
    acc_ids = RING_ACCOUNTS_MAP.get(ring_id, [])
    return db.query(Account).filter(Account.account_id.in_(acc_ids)).all()


@router.get("/{ring_id}/transactions")
def get_ring_transactions(ring_id: str, db: Session = Depends(get_db)):
    ring = db.query(FraudRing).filter_by(ring_id=ring_id).first()
    if not ring:
        raise HTTPException(status_code=404, detail="Fraud Ring not found")
    acc_ids = RING_ACCOUNTS_MAP.get(ring_id, [])
    return db.query(Transaction).filter(
        (Transaction.sender_account_id.in_(acc_ids)) &
        (Transaction.receiver_account_id.in_(acc_ids))
    ).all()


@router.get("/{ring_id}/network")
def get_ring_network(ring_id: str, db: Session = Depends(get_db)):
    """Returns NetworkX generated nodes and edges formatted for React Flow."""
    ring = db.query(FraudRing).filter_by(ring_id=ring_id).first()
    if not ring:
        raise HTTPException(status_code=404, detail="Fraud Ring not found")
    acc_ids = RING_ACCOUNTS_MAP.get(ring_id, [])
    G = build_transaction_graph(db)
    return get_ring_visualization_data(G, acc_ids)


@router.get("/{ring_id}/evolution")
def get_ring_evolution(ring_id: str):
    """Returns the growth evolution sequence timeline data."""
    return {
        "ring_id": ring_id,
        "timeline": RING_EVOLUTIONS.get(ring_id, [])
    }
