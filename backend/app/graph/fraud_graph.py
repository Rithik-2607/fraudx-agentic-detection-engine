import networkx as nx
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.models.account import Account

def build_transaction_graph(db: Session) -> nx.DiGraph:
    """
    Builds a NetworkX directed graph from transaction database records.
    Accounts are Nodes. Transactions are Directed Edges.
    """
    G = nx.DiGraph()
    txs = db.query(Transaction).all()
    for tx in txs:
        # Add nodes with their latest known attributes if not already added
        if not G.has_node(tx.sender_account_id):
            sender_acc = db.query(Account).filter_by(account_id=tx.sender_account_id).first()
            risk_score = sender_acc.risk_score if sender_acc else tx.risk_score
            G.add_node(tx.sender_account_id, risk_score=risk_score)
        
        if not G.has_node(tx.receiver_account_id):
            receiver_acc = db.query(Account).filter_by(account_id=tx.receiver_account_id).first()
            risk_score = receiver_acc.risk_score if receiver_acc else tx.risk_score
            G.add_node(tx.receiver_account_id, risk_score=risk_score)

        # Add directed edge representing transaction flow
        G.add_edge(
            tx.sender_account_id,
            tx.receiver_account_id,
            transaction_id=tx.transaction_id,
            amount=tx.amount,
            timestamp=tx.timestamp,
            risk_score=tx.risk_score
        )
    return G

def detect_cycles(G: nx.DiGraph) -> List[List[str]]:
    """
    Finds simple directed cycles (circular fund loops) within the graph.
    """
    try:
        return list(nx.simple_cycles(G))
    except Exception:
        return []

def find_connected_accounts(G: nx.DiGraph, node_id: str) -> List[str]:
    """
    Finds all accounts connected to a specific node, ignoring edge direction.
    """
    undirected_G = G.to_undirected()
    if not undirected_G.has_node(node_id):
        return [node_id]
    return list(nx.node_connected_component(undirected_G, node_id))

def find_suspicious_clusters(G: nx.DiGraph, threshold: float = 60.0) -> List[List[str]]:
    """
    Finds clusters of connected nodes where at least one node has high risk.
    """
    undirected_G = G.to_undirected()
    components = list(nx.connected_components(undirected_G))
    suspicious_clusters = []
    
    for comp in components:
        has_high_risk = any(G.nodes[node].get("risk_score", 0) >= threshold for node in comp)
        if has_high_risk and len(comp) > 1:
            suspicious_clusters.append(list(comp))
            
    return suspicious_clusters

def calculate_network_risk(G: nx.DiGraph, node_id: str) -> Tuple[float, List[str]]:
    """
    Calculates network risk impact based on connections to other high-risk nodes.
    Returns: (Risk multiplier score, List of contributing threat indicators)
    """
    indicators = []
    risk_addition = 0.0

    if not G.has_node(node_id):
        return 0.0, []

    # Check if node is part of any cycles (circular flow)
    cycles = detect_cycles(G)
    in_cycle = False
    for cycle in cycles:
        if node_id in cycle:
            in_cycle = True
            break
    
    if in_cycle:
        risk_addition += 30.0
        indicators.append("Circular flow loop detected (+30)")

    # Check degree centrality (hubs)
    degree = G.degree(node_id)
    if degree >= 5:
        risk_addition += 15.0
        indicators.append(f"Highly connected hub node with {degree} edges (+15)")

    # Check neighborhood risk
    neighbors = list(G.neighbors(node_id)) + list(G.predecessors(node_id))
    high_risk_neighbors = 0
    for n in neighbors:
        if G.nodes[n].get("risk_score", 0) >= 70.0:
            high_risk_neighbors += 1

    if high_risk_neighbors > 0:
        added = min(high_risk_neighbors * 10.0, 25.0)
        risk_addition += added
        indicators.append(f"Connected to {high_risk_neighbors} high-risk neighbors (+{added:.0f})")

    return min(risk_addition, 60.0), indicators

def get_ring_visualization_data(G: nx.DiGraph, accounts_list: List[str]) -> Dict[str, Any]:
    """
    Converts a subgraph containing a list of accounts into a format compatible with React Flow nodes & edges.
    """
    nodes = []
    edges = []
    
    # Extract nodes
    for acc_id in accounts_list:
        if G.has_node(acc_id):
            risk = G.nodes[acc_id].get("risk_score", 0)
            if risk >= 80:
                level = "CRITICAL"
            elif risk >= 60:
                level = "HIGH"
            elif risk >= 30:
                level = "MEDIUM"
            else:
                level = "LOW"
                
            nodes.append({
                "id": acc_id,
                "label": acc_id,
                "risk_score": risk,
                "risk_level": level
            })
            
    # Extract edges between these nodes
    subG = G.subgraph(accounts_list)
    for u, v, data in subG.edges(data=True):
        edges.append({
            "source": u,
            "target": v,
            "transaction_id": data.get("transaction_id", ""),
            "amount": data.get("amount", 0.0),
            "timestamp": str(data.get("timestamp", ""))
        })
        
    return {"nodes": nodes, "edges": edges}
