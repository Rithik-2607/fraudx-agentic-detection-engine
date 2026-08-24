/** Centralized mock countermeasure data */

export const countermeasures = [
  { id: 'CM-001', account: 'U1042', riskScore: 91, action: 'Restrict Transactions', triggeredBy: 'Countermeasure Agent', status: 'Pending Approval', time: '2026-08-24T14:32:11', investigation: 'INV-1024', reason: 'High-confidence fraud ring activity.', evidence: ['5 suspicious connections', '12 rapid transactions', 'Shared device fingerprint'] },
  { id: 'CM-002', account: 'U1088', riskScore: 87, action: 'Restrict Transactions', triggeredBy: 'Countermeasure Agent', status: 'Pending Approval', time: '2026-08-24T14:31:55', investigation: 'INV-1024', reason: 'Connected to confirmed fraud ring RING-018.', evidence: ['4 suspicious connections', 'Shared device DEV-882'] },
  { id: 'CM-003', account: 'U1001', riskScore: 88, action: 'Request Verification', triggeredBy: 'Risk Assessment Agent', status: 'Executed', time: '2026-08-24T11:55:00', investigation: 'INV-1025', reason: 'Origin account of layering network.', evidence: ['Large initial transfer', 'Chain of intermediaries'] },
  { id: 'CM-004', account: 'U4001', riskScore: 65, action: 'Request Verification', triggeredBy: 'Countermeasure Agent', status: 'Executed', time: '2026-08-24T12:45:00', investigation: 'INV-1026', reason: 'Rapid transfer chain initiator.', evidence: ['Sequential high-value transfers', 'Same device fingerprint'] },
  { id: 'CM-005', account: 'U7001', riskScore: 58, action: 'Monitor', triggeredBy: 'Risk Assessment Agent', status: 'Active', time: '2026-08-23T10:20:00', investigation: 'INV-1019', reason: 'Shared device cluster with moderate risk.', evidence: ['4 accounts on same device'] },
  { id: 'CM-006', account: 'U6005', riskScore: 72, action: 'Escalate Investigation', triggeredBy: 'Forensic Report Agent', status: 'Pending Review', time: '2026-08-23T17:30:00', investigation: 'INV-1027', reason: 'Funnel network collector account.', evidence: ['Multiple source accounts', 'No outbound transactions'] },
  { id: 'CM-007', account: 'U1150', riskScore: 95, action: 'Restrict Transactions', triggeredBy: 'Countermeasure Agent', status: 'Executed', time: '2026-08-24T10:30:00', investigation: 'INV-1024', reason: 'Terminus account in circular fraud ring.', evidence: ['Return transfer to origin', 'Largest single transfer in ring'] },
  { id: 'CM-008', account: 'U1006', riskScore: 92, action: 'Generate Forensic Report', triggeredBy: 'Forensic Report Agent', status: 'Completed', time: '2026-08-24T12:00:00', investigation: 'INV-1025', reason: 'Collector account in layering network.', evidence: ['Loop-back transfer detected', 'End of chain'] },
];

export const countermeasureTypes = [
  { type: 'Monitor', description: 'Place account under enhanced surveillance for low-risk activity.', riskLevel: 'Low', color: '#22c55e', icon: 'Eye' },
  { type: 'Request Verification', description: 'Require identity or transaction verification for medium-risk activity.', riskLevel: 'Medium', color: '#f59e0b', icon: 'UserCheck' },
  { type: 'Restrict Transactions', description: 'Temporarily restrict outbound transactions for high-risk activity.', riskLevel: 'High', color: '#f97316', icon: 'Ban' },
  { type: 'Escalate Investigation', description: 'Escalate to senior fraud analyst for critical cases.', riskLevel: 'Critical', color: '#ef4444', icon: 'AlertOctagon' },
  { type: 'Generate Forensic Report', description: 'Generate comprehensive forensic report for confirmed or complex fraud.', riskLevel: 'Any', color: '#3b82f6', icon: 'FileText' },
];

export default countermeasures;
