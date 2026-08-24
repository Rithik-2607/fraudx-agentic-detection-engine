/** Risk color and label utilities — used consistently across all components */

export const RISK_LEVELS = {
  LOW: { label: 'Low', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.25)' },
  MEDIUM: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' },
  HIGH: { label: 'High', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.25)' },
  CRITICAL: { label: 'Critical', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)' },
};

export function getRiskLevel(score) {
  if (score >= 80) return RISK_LEVELS.CRITICAL;
  if (score >= 60) return RISK_LEVELS.HIGH;
  if (score >= 40) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
}

export function getRiskLabel(score) {
  return getRiskLevel(score).label;
}

export function getRiskColor(score) {
  return getRiskLevel(score).color;
}

export const STATUS_COLORS = {
  Active: '#22d3ee',
  Investigating: '#f59e0b',
  Flagged: '#f97316',
  Cleared: '#22c55e',
  Monitoring: '#3b82f6',
  Completed: '#22c55e',
  Processing: '#22d3ee',
  Warning: '#f59e0b',
  Critical: '#ef4444',
  'Pending Approval': '#f59e0b',
  'Pending Review': '#f97316',
  Executed: '#22c55e',
  Running: '#22d3ee',
  'Evidence Gathering': '#3b82f6',
  'Risk Assessment': '#f59e0b',
  'Countermeasure Pending': '#f97316',
  Standby: '#6b7494',
  Pending: '#f59e0b',
  Ready: '#22c55e',
};

export function getStatusColor(status) {
  return STATUS_COLORS[status] || '#6b7494';
}
