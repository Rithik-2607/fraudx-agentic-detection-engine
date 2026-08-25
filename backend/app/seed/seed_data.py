from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.account import Account
from app.models.transaction import Transaction
from app.models.fraud_ring import FraudRing
from app.models.agent import Agent
from app.models.investigation import Investigation
from app.models.countermeasure import Countermeasure
from app.models.report import Report
from app.models.notification import Notification
from app.models.fraud_ring_member import FraudRingMember
from app.models.fraud_ring_edge import FraudRingEdge
from app.models.investigation_evidence import InvestigationEvidence
from app.models.investigation_event import InvestigationEvent
from app.models.agent_activity import AgentActivity
from app.models.simulation_run import SimulationRun
from app.core.config import settings

import random
import datetime

# Create tables
Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()

    if db.query(Account).first() and not settings.SEED_DATABASE:
        print("Database already contains data. Set SEED_DATABASE=true to reseed.")
        db.close()
        return
    
    # 1. Clear database first to allow clean re-run seeding
    db.query(AgentActivity).delete()
    db.query(InvestigationEvent).delete()
    db.query(InvestigationEvidence).delete()
    db.query(FraudRingEdge).delete()
    db.query(FraudRingMember).delete()
    db.query(SimulationRun).delete()
    db.query(Countermeasure).delete()
    db.query(Report).delete()
    db.query(Notification).delete()
    db.query(Transaction).delete()
    db.query(Investigation).delete()
    db.query(FraudRing).delete()
    db.query(Agent).delete()
    db.query(Account).delete()
    db.commit()

    locations = ["Chennai", "Bengaluru", "Mumbai", "Hyderabad", "Delhi", "Coimbatore", "Trichy"]
    devices = ["DEV-882", "DEV-903", "DEV-771", "DEV-112", "DEV-445", "DEV-551", "DEV-662", "DEV-773"]
    names = [
        "Aarav Sharma", "Aditya Patel", "Karan Malhotra", "Rohan Mehta", "Vivek Sen",
        "Ishaan Nair", "Ananya Iyer", "Diya Reddy", "Kavya Pillai", "Sneha Rao",
        "Rahul Krishnan", "Neha Deshmukh", "Abhishek Gupta", "Priya Verma", "Arjun Joshi",
        "Siddharth Shah", "Deepa Nair", "Ramesh Kumar", "Suresh Balan", "Karthik Subramanian"
    ]

    # Seed Agents
    agents_list = [
        Agent(agent_id="AGENT-001", name="Transaction Detection Agent", agent_type="DETECTION", status="Active", description="Monitors and analyzes incoming transactions in real-time to detect abnormal patterns.", tasks_completed=2481, items_analyzed=1284392),
        Agent(agent_id="AGENT-002", name="Ring Investigator Agent", agent_type="INVESTIGATION", status="Active", description="Discovers connected fraud networks by analyzing transaction graphs, clusters and loops.", tasks_completed=37, items_analyzed=892),
        Agent(agent_id="AGENT-003", name="Risk Assessment Agent", agent_type="SCORING", status="Active", description="Calculates fraud probability and severity scores based on behavioral metrics.", tasks_completed=124, items_analyzed=4218),
        Agent(agent_id="AGENT-004", name="Countermeasure Agent", agent_type="PROTECTION", status="Standby", description="Recommends and initiates appropriate protective actions.", tasks_completed=142, items_analyzed=186),
        Agent(agent_id="AGENT-005", name="Forensic Report Agent", agent_type="REPORTING", status="Active", description="Generates comprehensive investigation reports with evidence summaries.", tasks_completed=312, items_analyzed=320)
    ]
    db.add_all(agents_list)
    db.commit()

    # Seed Accounts (At least 50 accounts)
    accounts = []
    
    # Pre-defined accounts for the demo scenarios
    demo_accounts = [
        # RING-019 (U1001 - U1006)
        ("U1001", "Aarav Sharma", "ACTIVE", 88.0, "DEV-551"),
        ("U1002", "Aditya Patel", "UNDER_INVESTIGATION", 85.0, "DEV-551"),
        ("U1003", "Karan Malhotra", "UNDER_INVESTIGATION", 79.0, "DEV-662"),
        ("U1004", "Rohan Mehta", "UNDER_INVESTIGATION", 76.0, "DEV-662"),
        ("U1005", "Vivek Sen", "UNDER_INVESTIGATION", 71.0, "DEV-773"),
        ("U1006", "Ishaan Nair", "UNDER_INVESTIGATION", 92.0, "DEV-773"),
        
        # RING-018 (U1042, U1088, U1091, U1102, U1132, U1150)
        ("U1042", "Ananya Iyer", "UNDER_INVESTIGATION", 91.0, "DEV-882"),
        ("U1088", "Diya Reddy", "UNDER_INVESTIGATION", 87.0, "DEV-882"),
        ("U1091", "Kavya Pillai", "UNDER_INVESTIGATION", 78.0, "DEV-903"),
        ("U1102", "Sneha Rao", "UNDER_INVESTIGATION", 82.0, "DEV-903"),
        ("U1132", "Rahul Krishnan", "UNDER_INVESTIGATION", 74.0, "DEV-771"),
        ("U1150", "Neha Deshmukh", "UNDER_INVESTIGATION", 95.0, "DEV-771"),
    ]

    for acc_id, name, status, risk, dev in demo_accounts:
        acc = Account(
            account_id=acc_id,
            name=name,
            email=f"{name.lower().replace(' ', '')}@fictionalbank.co.in",
            phone=f"+91 {random.randint(90000, 99999)} {random.randint(10000, 99999)}",
            location=random.choice(locations),
            device_id=dev,
            ip_address=f"103.{random.randint(10, 99)}.{random.randint(10, 99)}.{random.randint(1, 254)}",
            account_status=status,
            risk_score=risk
        )
        accounts.append(acc)
        db.add(acc)

    # Add remaining 38 random accounts
    for i in range(1, 39):
        name = random.choice(names) + f" {i}"
        acc_id = f"U{2000 + i}"
        acc = Account(
            account_id=acc_id,
            name=name,
            email=f"{name.lower().replace(' ', '')}@fictionalbank.co.in",
            phone=f"+91 {random.randint(90000, 99999)} {random.randint(10000, 99999)}",
            location=random.choice(locations),
            device_id=random.choice(devices),
            ip_address=f"103.{random.randint(10, 99)}.{random.randint(10, 99)}.{random.randint(1, 254)}",
            account_status="ACTIVE",
            risk_score=random.uniform(5.0, 35.0)
        )
        accounts.append(acc)
        db.add(acc)
    db.commit()

    # Seed Fraud Rings
    rings = [
        FraudRing(ring_id="RING-018", name="RING-018 Circular Flow", risk_score=94.0, severity="CRITICAL", account_count=6, transaction_count=43, total_amount=2800000.0, pattern_type="CIRCULAR_FLOW", status="Active"),
        FraudRing(ring_id="RING-019", name="RING-019 Money Layering", risk_score=88.0, severity="CRITICAL", account_count=6, transaction_count=38, total_amount=2450000.0, pattern_type="LAYERING", status="Active"),
        FraudRing(ring_id="RING-020", name="RING-020 Rapid Transfer Chain", risk_score=65.0, severity="HIGH", account_count=3, transaction_count=12, total_amount=890000.0, pattern_type="RAPID_TRANSFER_CHAIN", status="Active")
    ]
    db.add_all(rings)
    db.commit()

    # Seed Transactions (At least 300 transactions)
    # 1. Main Demo circular flow loop (RING-018)
    # U1042 -> U1088 -> U1091 -> U1102 -> U1132 -> U1150 -> U1042
    ring18_flow = [
        ("TX-82931", "U1042", "U1088", 84500.0),
        ("TX-82932", "U1088", "U1091", 72000.0),
        ("TX-82933", "U1091", "U1102", 65000.0),
        ("TX-82934", "U1102", "U1132", 58000.0),
        ("TX-82935", "U1132", "U1150", 45000.0),
        ("TX-82936", "U1150", "U1042", 92000.0)
    ]
    for tx_id, sender, receiver, amount in ring18_flow:
        tx = Transaction(
            transaction_id=tx_id,
            sender_account_id=sender,
            receiver_account_id=receiver,
            amount=amount,
            currency="₹",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(minutes=random.randint(2, 30)),
            location="Chennai",
            device_id="DEV-882",
            ip_address="103.21.58.14",
            transaction_type="transfer",
            status="FLAGGED" if amount > 80000.0 else "SUSPICIOUS",
            risk_score=91.0 if tx_id == "TX-82931" else 85.0
        )
        db.add(tx)

    # 2. Layering Flow loop (RING-019)
    # U1001 -> U1002 -> U1003 -> U1004 -> U1005 -> U1006 -> U1002
    ring19_flow = [
        ("TX-82939", "U1001", "U1002", 150000.0),
        ("TX-82940", "U1002", "U1003", 142000.0),
        ("TX-82941", "U1003", "U1004", 138000.0),
        ("TX-82942", "U1004", "U1005", 130000.0),
        ("TX-82943", "U1005", "U1006", 125000.0),
        ("TX-82944", "U1006", "U1002", 118000.0)
    ]
    for tx_id, sender, receiver, amount in ring19_flow:
        tx = Transaction(
            transaction_id=tx_id,
            sender_account_id=sender,
            receiver_account_id=receiver,
            amount=amount,
            currency="₹",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(minutes=random.randint(60, 180)),
            location="Pune",
            device_id="DEV-551",
            ip_address="115.96.12.77",
            transaction_type="transfer",
            status="FLAGGED" if amount > 130000.0 else "SUSPICIOUS",
            risk_score=88.0 if tx_id == "TX-82939" else 82.0
        )
        db.add(tx)

    # Add 290 clean transactions to make total > 300
    for i in range(1, 290):
        sender = random.choice(accounts)
        receiver = random.choice(accounts)
        while sender.account_id == receiver.account_id:
            receiver = random.choice(accounts)
        
        amount = random.uniform(500, 25000)
        tx_id = f"TX-{83000 + i}"
        
        tx = Transaction(
            transaction_id=tx_id,
            sender_account_id=sender.account_id,
            receiver_account_id=receiver.account_id,
            amount=amount,
            currency="₹",
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=random.randint(1, 24)),
            location=random.choice(locations),
            device_id=sender.device_id,
            ip_address=sender.ip_address,
            transaction_type="payment" if i % 3 == 0 else "transfer",
            status="NORMAL",
            risk_score=random.uniform(5.0, 25.0)
        )
        db.add(tx)
    db.commit()

    # Seed Investigations
    invs = [
        Investigation(
            investigation_id="INV-1024",
            target_account_id="U1042",
            fraud_ring_id="RING-018",
            risk_score=91.0,
            status="COUNTERMEASURE_PENDING",
            summary="Coordinated circular fund transfers mapping completed for U1042 across 6 accounts.",
            confidence=94.0
        ),
        Investigation(
            investigation_id="INV-1025",
            target_account_id="U1001",
            fraud_ring_id="RING-019",
            risk_score=88.0,
            status="RISK_ASSESSMENT",
            summary="Layering fund flow identified through 6 accounts.",
            confidence=89.0
        )
    ]
    db.add_all(invs)
    db.commit()

    # Seed Countermeasure recommendations
    cms = [
        Countermeasure(action_id="CM-001", account_id="U1042", investigation_id="INV-1024", action_type="RESTRICT_TRANSACTIONS", reason="Critical circular ring activity.", risk_score=91.0, status="Pending Approval"),
        Countermeasure(action_id="CM-002", account_id="U1088", investigation_id="INV-1024", action_type="RESTRICT_TRANSACTIONS", reason="Linked to RING-018.", risk_score=87.0, status="Pending Approval"),
        Countermeasure(action_id="CM-003", account_id="U1001", investigation_id="INV-1025", action_type="RESTRICT_TRANSACTIONS", reason="Linear layering originator.", risk_score=88.0, status="Pending Approval")
    ]
    db.add_all(cms)
    db.commit()

    # Seed Reports
    r1_content = {
        "executiveSummary": "Circular fund flow mapped across 6 accounts totaling INR 2.8M.",
        "riskAssessment": "Overall composite score: 91/100 (CRITICAL).",
        "fraudRingAnalysis": "Active circular flow RING-018.",
        "transactionEvidence": "Unusual high velocity transfers.",
        "connectedAccounts": "U1042, U1088, U1091, U1102, U1132, U1150",
        "agentFindings": "Mapped component loops.",
        "recommendedCountermeasures": "Hold outbound fund transfers.",
        "investigationTimeline": "MAPPED",
        "confidenceScore": 94
    }
    r2_content = {
        "executiveSummary": "Money laundering layering chain mapped across 6 accounts.",
        "riskAssessment": "Composite score: 88/100 (CRITICAL).",
        "fraudRingAnalysis": "Active layering network RING-019.",
        "transactionEvidence": "Funnels decreasing amounts.",
        "connectedAccounts": "U1001, U1002, U1003, U1004, U1005, U1006",
        "agentFindings": "Linear layering trace.",
        "recommendedCountermeasures": "Request identity verification challenges.",
        "investigationTimeline": "EVALUATED",
        "confidenceScore": 89
    }

    rpts = [
        Report(report_id="RPT-001", investigation_id="INV-1024", report_type="FRAUD_INVESTIGATION", title="Forensic Investigation Report — RING-018", summary="Circular flow ring RING-018", risk_score=91.0, confidence=94.0, content=json.dumps(r1_content)),
        Report(report_id="RPT-002", investigation_id="INV-1025", report_type="RING_ANALYSIS", title="Ring Analysis Report — RING-019", summary="Layering flow ring RING-019", risk_score=88.0, confidence=89.0, content=json.dumps(r2_content))
    ]
    db.add_all(rpts)
    db.commit()

    # Seed Notifications
    notifs = [
        Notification(notification_id="NOTIF-001", title="Critical fraud ring detected", message="RING-018 — 6 accounts, circular flow pattern", severity="CRITICAL", read=False),
        Notification(notification_id="NOTIF-002", title="High-risk account identified", message="U1042 — Risk score 91/100", severity="CRITICAL", read=False),
        Notification(notification_id="NOTIF-003", title="Countermeasure requires approval", message="Restrict transactions for U1042", severity="WARNING", read=False)
    ]
    db.add_all(notifs)
    db.commit()

    # Persist graph membership, edge summaries, investigation evidence/timeline,
    # and historical agent activity used by the dashboard.
    ring_members = {
        "RING-018": [("U1042", "MASTER"), ("U1088", "INTERMEDIARY"), ("U1091", "MULE"), ("U1102", "MULE"), ("U1132", "INTERMEDIARY"), ("U1150", "BENEFICIARY")],
        "RING-019": [("U1001", "MASTER"), ("U1002", "INTERMEDIARY"), ("U1003", "MULE"), ("U1004", "MULE"), ("U1005", "INTERMEDIARY"), ("U1006", "BENEFICIARY")],
        "RING-020": [("U4001", "MASTER"), ("U4012", "INTERMEDIARY"), ("U4028", "BENEFICIARY")],
    }
    for ring_id, members in ring_members.items():
        for account_id, role in members:
            account = db.query(Account).filter_by(account_id=account_id).first()
            db.add(FraudRingMember(ring_id=ring_id, account_id=account_id, role=role, risk_score=account.risk_score if account else 0))

    ring_edges = [
        ("RING-018", "U1042", "U1088", 4, 84500), ("RING-018", "U1088", "U1091", 3, 72000),
        ("RING-018", "U1091", "U1102", 3, 65000), ("RING-018", "U1102", "U1132", 2, 58000),
        ("RING-018", "U1132", "U1150", 2, 45000), ("RING-018", "U1150", "U1042", 3, 92000),
        ("RING-019", "U1001", "U1002", 5, 150000), ("RING-019", "U1002", "U1003", 4, 142000),
        ("RING-019", "U1003", "U1004", 3, 138000), ("RING-019", "U1004", "U1005", 3, 130000),
        ("RING-019", "U1005", "U1006", 2, 125000), ("RING-019", "U1006", "U1002", 2, 118000),
        ("RING-020", "U4001", "U4012", 3, 250000), ("RING-020", "U4012", "U4028", 3, 245000),
    ]
    db.add_all([FraudRingEdge(ring_id=r, source_account_id=s, target_account_id=t, transaction_count=c, total_amount=a) for r, s, t, c, a in ring_edges])

    evidence_rows = [
        ("INV-1024", "transaction", "Unusual transfer velocity deviating from account average.", "HIGH", 92),
        ("INV-1024", "network", "Circular transaction flow detected across RING-018.", "CRITICAL", 97),
        ("INV-1024", "behavioral", "Shared device fingerprints link multiple accounts.", "HIGH", 91),
        ("INV-1025", "transaction", "Large initial transfer followed by decreasing amounts.", "HIGH", 87),
        ("INV-1025", "network", "Layering chain includes a loop-back transfer.", "CRITICAL", 91),
        ("INV-1025", "behavioral", "Accounts show coordinated timing patterns.", "MEDIUM", 78),
    ]
    db.add_all([InvestigationEvidence(evidence_id=f"EVD-SEED-{index:03d}", investigation_id=inv, category=cat, description=desc, severity=sev, confidence=confidence) for index, (inv, cat, desc, sev, confidence) in enumerate(evidence_rows, 1)])

    for inv, event_type, description, status in [
        ("INV-1024", "TRANSACTION_DETECTED", "Abnormal transfer velocity flagged.", "completed"),
        ("INV-1024", "NETWORK_ANALYSIS", "Circular flow ring mapped.", "completed"),
        ("INV-1024", "RISK_ASSESSMENT", "Composite risk scored at 91/100.", "completed"),
        ("INV-1024", "COUNTERMEASURE", "Restriction recommendation created.", "in-progress"),
        ("INV-1025", "TRANSACTION_DETECTED", "Layering origin transfer flagged.", "completed"),
        ("INV-1025", "NETWORK_ANALYSIS", "Six-account chain discovered.", "completed"),
        ("INV-1025", "RISK_ASSESSMENT", "Composite risk scored at 88/100.", "in-progress"),
    ]:
        db.add(InvestigationEvent(investigation_id=inv, event_type=event_type, description=description, status=status))

    activity_templates = [
        ("AGENT-001", "Transaction Detection Agent", "Detected abnormal transfer pattern", "U1042", "Completed", "Activity"),
        ("AGENT-002", "Ring Investigator Agent", "Discovered connected accounts", "RING-018", "Completed", "Network"),
        ("AGENT-003", "Risk Assessment Agent", "Calculated composite risk score", "U1042", "Completed", "AlertTriangle"),
        ("AGENT-004", "Countermeasure Agent", "Recommended transaction restriction", "U1042", "Processing", "Shield"),
        ("AGENT-005", "Forensic Report Agent", "Investigation report generated", "INV-1024", "Completed", "FileText"),
    ]
    for index in range(4):
        for agent_id, agent_name, action, target, status, icon in activity_templates:
            db.add(AgentActivity(agent_id=agent_id, investigation_id="INV-1024", agent_name=agent_name, action=action, target=target, status=status, icon=icon))

    db.add(SimulationRun(run_id="SIM-SEED-001", target_account_id="U1042", investigation_id="INV-1024", status="COMPLETED", risk_score=91.0, completed_at=datetime.datetime.utcnow()))
    db.commit()

    print("Database seeding completed successfully.")
    db.close()

if __name__ == "__main__":
    import json
    seed_db()
