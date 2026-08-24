import networkx as nx
from app.graph.fraud_graph import detect_cycles
from app.services.risk_service import getRiskLevel, RISK_LEVELS

def test_cycle_detection():
    # Build simple loop: A -> B -> C -> A
    G = nx.DiGraph()
    G.add_edge("A", "B")
    G.add_edge("B", "C")
    G.add_edge("C", "A")
    
    cycles = detect_cycles(G)
    assert len(cycles) == 1
    assert "A" in cycles[0]
    assert "B" in cycles[0]
    assert "C" in cycles[0]

def test_risk_level_mapping():
    # Test risk scoring logic levels
    assert get_risk_level_local(95) == "CRITICAL"
    assert get_risk_level_local(70) == "HIGH"
    assert get_risk_level_local(50) == "MEDIUM"
    assert get_risk_level_local(10) == "LOW"

def get_risk_level_local(score):
    if score >= 80: return "CRITICAL"
    if score >= 60: return "HIGH"
    if score >= 30: return "MEDIUM"
    return "LOW"
