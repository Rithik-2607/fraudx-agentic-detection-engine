from fastapi import APIRouter

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("")
def get_analytics_overview():
    """Returns combined analytics summary for the Analytics page."""
    return {
        "riskDistribution": [
            {"name": "Low", "value": 842, "color": "#22c55e"},
            {"name": "Medium", "value": 328, "color": "#f59e0b"},
            {"name": "High", "value": 186, "color": "#f97316"},
            {"name": "Critical", "value": 124, "color": "#ef4444"}
        ],
        "fraudTrends": [
            {"time": "Mon", "detected": 145, "resolved": 120},
            {"time": "Tue", "detected": 162, "resolved": 138},
            {"time": "Wed", "detected": 178, "resolved": 155},
            {"time": "Thu", "detected": 195, "resolved": 168},
            {"time": "Fri", "detected": 210, "resolved": 182},
            {"time": "Sat", "detected": 88, "resolved": 75},
            {"time": "Sun", "detected": 72, "resolved": 61},
        ],
        "totalFlagged": 1480,
        "totalResolved": 899,
        "totalLossPrevented": 18400000,
        "agentEfficiency": 94
    }

@router.get("/risk-distribution")
def get_analytics_risk_distribution():
    return [
        {"name": "Low", "value": 842, "color": "#22c55e"},
        {"name": "Medium", "value": 328, "color": "#f59e0b"},
        {"name": "High", "value": 186, "color": "#f97316"},
        {"name": "Critical", "value": 124, "color": "#ef4444"}
    ]


@router.get("/fraud-trends")
def get_analytics_fraud_trends():
    return [
        {"time": "Mon", "detected": 145, "resolved": 120},
        {"time": "Tue", "detected": 162, "resolved": 138},
        {"time": "Wed", "detected": 178, "resolved": 155},
        {"time": "Thu", "detected": 195, "resolved": 168},
        {"time": "Fri", "detected": 210, "resolved": 182},
        {"time": "Sat", "detected": 88, "resolved": 75},
        {"time": "Sun", "detected": 72, "resolved": 62}
    ]

@router.get("/fraud-patterns")
def get_analytics_fraud_patterns():
    return [
        {"pattern": "Circular", "count": 14, "amount": 4200000},
        {"pattern": "Layering", "count": 8, "amount": 3100000},
        {"pattern": "Funnel", "count": 6, "amount": 2800000},
        {"pattern": "Rapid Transfer", "count": 5, "amount": 1900000},
        {"pattern": "Shared Device", "count": 4, "amount": 1200000}
    ]

@router.get("/ring-growth")
def get_analytics_ring_growth():
    return [
        {"time": "Jan", "rings": 18},
        {"time": "Feb", "rings": 22},
        {"time": "Mar", "rings": 25},
        {"time": "Apr", "rings": 28},
        {"time": "May", "rings": 30},
        {"time": "Jun", "rings": 33},
        {"time": "Jul", "rings": 35},
        {"time": "Aug", "rings": 37}
    ]

@router.get("/prevented-loss")
def get_analytics_prevented_loss():
    return [
        {"time": "Jan", "amount": 8200000},
        {"time": "Feb", "amount": 9400000},
        {"time": "Mar", "amount": 11200000},
        {"time": "Apr", "amount": 12800000},
        {"time": "May", "amount": 14100000},
        {"time": "Jun", "amount": 15600000},
        {"time": "Jul", "amount": 17200000},
        {"time": "Aug", "amount": 18400000}
    ]
