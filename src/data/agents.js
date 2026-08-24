/** Centralized mock agent data */

export const agents = [
  {
    id: 'AGENT-001',
    name: 'Transaction Detection Agent',
    status: 'Active',
    description: 'Monitors and analyzes incoming transactions in real-time to detect abnormal patterns, unusual amounts, and suspicious behavior.',
    metrics: {
      transactionsAnalyzed: 1284392,
      anomaliesDetected: 2481,
      accuracy: 97.3,
      avgResponseTime: '< 50ms',
    },
    lastActivity: '2026-08-24T14:32:08',
    color: '#3b82f6',
  },
  {
    id: 'AGENT-002',
    name: 'Ring Investigator Agent',
    status: 'Active',
    description: 'Discovers connected fraud networks by analyzing transaction graphs, identifying clusters, and tracing circular fund flows.',
    metrics: {
      networksAnalyzed: 892,
      ringsDetected: 37,
      accountsLinked: 248,
      avgResponseTime: '< 200ms',
    },
    lastActivity: '2026-08-24T14:32:09',
    color: '#22d3ee',
  },
  {
    id: 'AGENT-003',
    name: 'Risk Assessment Agent',
    status: 'Active',
    description: 'Calculates fraud probability and severity scores based on transaction patterns, network topology, and behavioral signals.',
    metrics: {
      assessmentsCompleted: 4218,
      highRiskIdentified: 124,
      avgConfidence: 91.4,
      avgResponseTime: '< 100ms',
    },
    lastActivity: '2026-08-24T14:32:10',
    color: '#f59e0b',
  },
  {
    id: 'AGENT-004',
    name: 'Countermeasure Agent',
    status: 'Standby',
    description: 'Recommends and initiates appropriate protective actions based on investigation confidence and risk severity.',
    metrics: {
      actionsRecommended: 186,
      actionsExecuted: 142,
      preventedLoss: 18400000,
      avgResponseTime: '< 150ms',
    },
    lastActivity: '2026-08-24T14:32:11',
    color: '#ef4444',
  },
  {
    id: 'AGENT-005',
    name: 'Forensic Report Agent',
    status: 'Active',
    description: 'Generates comprehensive investigation reports with evidence summaries, risk analysis, and recommended actions.',
    metrics: {
      reportsGenerated: 312,
      pendingReports: 8,
      avgGenerationTime: '< 5s',
      avgResponseTime: '< 3s',
    },
    lastActivity: '2026-08-24T14:32:12',
    color: '#22c55e',
  },
];

export const agentActivity = [
  { time: '14:32:12', agent: 'Forensic Report Agent', action: 'Investigation report generated', target: 'INV-1024', status: 'Completed', icon: 'FileText' },
  { time: '14:32:11', agent: 'Countermeasure Agent', action: 'Recommended transaction restriction', target: 'U1042', status: 'Processing', icon: 'Shield' },
  { time: '14:32:10', agent: 'Risk Assessment Agent', action: 'Calculated risk score: 91/100', target: 'U1042', status: 'Completed', icon: 'AlertTriangle' },
  { time: '14:32:09', agent: 'Ring Investigator Agent', action: 'Discovered 6 connected accounts', target: 'RING-018', status: 'Completed', icon: 'Network' },
  { time: '14:32:08', agent: 'Transaction Detection Agent', action: 'Detected abnormal transfer pattern', target: 'U1042', status: 'Completed', icon: 'Activity' },
  { time: '14:31:55', agent: 'Transaction Detection Agent', action: 'Flagged rapid transfer sequence', target: 'U1088', status: 'Completed', icon: 'Activity' },
  { time: '14:31:42', agent: 'Risk Assessment Agent', action: 'Calculated risk score: 87/100', target: 'U1088', status: 'Completed', icon: 'AlertTriangle' },
  { time: '14:31:30', agent: 'Ring Investigator Agent', action: 'Analyzing network topology', target: 'RING-019', status: 'Processing', icon: 'Network' },
  { time: '14:31:18', agent: 'Transaction Detection Agent', action: 'Monitoring account activity', target: 'U4001', status: 'Processing', icon: 'Activity' },
  { time: '14:31:05', agent: 'Forensic Report Agent', action: 'Generating ring analysis report', target: 'RING-022', status: 'Processing', icon: 'FileText' },
  { time: '14:30:52', agent: 'Countermeasure Agent', action: 'Enhanced monitoring applied', target: 'U7001', status: 'Completed', icon: 'Shield' },
  { time: '14:30:40', agent: 'Risk Assessment Agent', action: 'Assessed funnel network risk', target: 'RING-021', status: 'Completed', icon: 'AlertTriangle' },
];

/** Workflow steps for the agentic pipeline */
export const workflowSteps = [
  { id: 1, agent: 'Transaction Detection Agent', status: 'active', description: 'Real-time transaction monitoring and anomaly detection' },
  { id: 2, agent: 'Ring Investigator Agent', status: 'active', description: 'Network graph analysis and fraud ring discovery' },
  { id: 3, agent: 'Risk Assessment Agent', status: 'active', description: 'Probability scoring and severity classification' },
  { id: 4, agent: 'Countermeasure Agent', status: 'standby', description: 'Protective action recommendation and execution' },
  { id: 5, agent: 'Forensic Report Agent', status: 'active', description: 'Evidence compilation and report generation' },
];

export default agents;
