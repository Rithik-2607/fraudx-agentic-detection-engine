/**
 * API service abstraction layer.
 * Communicates with the FastAPI backend at http://localhost:8000.
 * Falls back to local mock data if the backend is offline.
 */

import initialTransactions, { riskFactors } from '../data/transactions';
import initialFraudRings from '../data/fraudRings';
import initialInvestigations from '../data/investigations';
import initialAgents, { agentActivity, workflowSteps } from '../data/agents';
import initialCountermeasures, { countermeasureTypes } from '../data/countermeasures';
import initialNotifications from '../data/notifications';
import initialReports from '../data/reports';

const API_BASE_URL = 'http://localhost:8001/api';

async function fetchFromBackend(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`Backend unreachable on endpoint: ${endpoint}. Falling back to mock data.`, err);
    return null;
  }
}

// --- Transactions ---
export async function getTransactions(params = {}) {
  let queryString = '';
  if (params.search) queryString += `?search=${params.search}`;
  const data = await fetchFromBackend(`/transactions${queryString}`);
  return data || initialTransactions;
}

export async function getTransaction(id) {
  const data = await fetchFromBackend(`/transactions/${id}`);
  return data || initialTransactions.find(t => t.id === id) || null;
}

export async function getTransactionRiskFactors(id) {
  const data = await fetchFromBackend(`/transactions/${id}/risk`);
  return data || riskFactors[id] || [];
}

// --- Fraud Rings ---
export async function getFraudRings() {
  const data = await fetchFromBackend('/fraud-rings');
  return data || initialFraudRings;
}

export async function getFraudRing(id) {
  const data = await fetchFromBackend(`/fraud-rings/${id}`);
  return data || initialFraudRings.find(r => r.id === id) || null;
}

// --- Investigations ---
export async function getInvestigations() {
  const data = await fetchFromBackend('/investigations');
  return data || initialInvestigations;
}

export async function getInvestigation(id) {
  const data = await fetchFromBackend(`/investigations/${id}`);
  return data || initialInvestigations.find(i => i.id === id) || null;
}

export async function runInvestigation(id) {
  const data = await fetchFromBackend(`/investigations/${id}/run`, { method: 'POST' });
  return data || { status: 'SUCCESS' };
}

// --- Agents ---
export async function getAgents() {
  const data = await fetchFromBackend('/agents');
  return data || initialAgents;
}

export async function getAgentActivity() {
  const data = await fetchFromBackend('/agents/activity');
  return data || agentActivity;
}

export async function getWorkflowSteps() {
  return workflowSteps;
}

// --- Countermeasures ---
export async function getCountermeasures() {
  const data = await fetchFromBackend('/countermeasures');
  return data || initialCountermeasures;
}

export async function getCountermeasureTypes() {
  return countermeasureTypes;
}

export async function confirmCountermeasure(actionId) {
  const data = await fetchFromBackend(`/countermeasures/${actionId}/confirm`, { method: 'POST' });
  return data || { status: 'SUCCESS' };
}

// --- Notifications ---
export async function getNotifications() {
  const data = await fetchFromBackend('/notifications');
  return data || initialNotifications;
}

export async function markNotificationRead(id) {
  const data = await fetchFromBackend(`/notifications/${id}/read`, { method: 'PATCH' });
  return data || { status: 'SUCCESS' };
}

// --- Reports ---
export async function getReports() {
  const data = await fetchFromBackend('/reports');
  return data || initialReports;
}

export async function getReport(id) {
  const data = await fetchFromBackend(`/reports/${id}`);
  return data || initialReports.find(r => r.id === id) || null;
}

export async function generateReport(investigationId) {
  const data = await fetchFromBackend(`/reports/generate?investigation_id=${investigationId}`, { method: 'POST' });
  return data || { status: 'SUCCESS' };
}

// --- Simulation Trigger ---
export async function runSimulationOnBackend() {
  const data = await fetchFromBackend('/simulation/run', { method: 'POST' });
  return data || { status: 'STARTED' };
}

// --- Dashboard KPIs ---
export async function getDashboardKPIs() {
  const data = await fetchFromBackend('/dashboard/summary');
  if (data) {
    return {
      totalTransactions: { value: data.total_transactions, trend: '+12.4% today' },
      suspiciousTransactions: { value: data.suspicious_transactions, trend: '+8.2%' },
      activeFraudRings: { value: data.active_fraud_rings, trend: '+5 detected today' },
      highRiskAccounts: { value: data.high_risk_accounts, trend: '18 require immediate action' },
      preventedLoss: { value: data.prevented_loss, trend: 'This month' },
    };
  }
  return {
    totalTransactions: { value: 1284392, trend: '+12.4% today' },
    suspiciousTransactions: { value: 2481, trend: '+8.2%' },
    activeFraudRings: { value: 37, trend: '+5 detected today' },
    highRiskAccounts: { value: 124, trend: '18 require immediate action' },
    preventedLoss: { value: 18400000, trend: 'This month' },
  };
}

// --- Analytics ---
export async function getAnalyticsData(period = '7d') {
  const trend = await fetchFromBackend('/analytics/fraud-trends');
  const patterns = await fetchFromBackend('/analytics/fraud-patterns');
  const growth = await fetchFromBackend('/analytics/ring-growth');
  const loss = await fetchFromBackend('/analytics/prevented-loss');
  const distribution = await fetchFromBackend('/analytics/risk-distribution');

  if (trend && patterns && growth && loss && distribution) {
    return {
      fraudByPattern: patterns,
      riskDistribution: distribution,
      fraudRingGrowth: growth,
      preventedLoss: loss,
      detectionTrend: trend,
    };
  }

  // Fallback to local analytics mock
  return {
    fraudByPattern: [
      { pattern: 'Circular', count: 14, amount: 4200000 },
      { pattern: 'Layering', count: 8, amount: 3100000 },
      { pattern: 'Funnel', count: 6, amount: 2800000 },
      { pattern: 'Rapid Transfer', count: 5, amount: 1900000 },
      { pattern: 'Shared Device', count: 4, amount: 1200000 },
    ],
    riskDistribution: [
      { name: 'Low', value: 842, color: '#22c55e' },
      { name: 'Medium', value: 328, color: '#f59e0b' },
      { name: 'High', value: 186, color: '#f97316' },
      { name: 'Critical', value: 124, color: '#ef4444' },
    ],
    fraudRingGrowth: [
      { time: 'Jan', rings: 18 },
      { time: 'Feb', rings: 22 },
      { time: 'Mar', rings: 25 },
      { time: 'Apr', rings: 28 },
      { time: 'May', rings: 30 },
      { time: 'Jun', rings: 33 },
      { time: 'Jul', rings: 35 },
      { time: 'Aug', rings: 37 },
    ],
    preventedLoss: [
      { time: 'Jan', amount: 8200000 },
      { time: 'Feb', amount: 9400000 },
      { time: 'Mar', amount: 11200000 },
      { time: 'Apr', amount: 12800000 },
      { time: 'May', amount: 14100000 },
      { time: 'Jun', amount: 15600000 },
      { time: 'Jul', amount: 17200000 },
      { time: 'Aug', amount: 18400000 },
    ],
    detectionTrend: [
      { time: 'Mon', detected: 145, resolved: 120 },
      { time: 'Tue', detected: 162, resolved: 138 },
      { time: 'Wed', detected: 178, resolved: 155 },
      { time: 'Thu', detected: 195, resolved: 168 },
      { time: 'Fri', detected: 210, resolved: 182 },
      { time: 'Sat', detected: 88, resolved: 75 },
      { time: 'Sun', detected: 72, resolved: 62 },
    ],
  };
}

// --- Search ---
export async function searchAll(query) {
  if (!query || query.trim().length === 0) return { accounts: [], transactions: [], investigations: [], fraudRings: [] };
  
  // Reuse getTransactions search endpoint
  const txs = await getTransactions({ search: query });
  const rings = await getFraudRings();
  const invs = await getInvestigations();

  const q = query.toLowerCase();

  const matchedAccounts = [
    ...new Set([
      ...txs.filter(t => t.sender.toLowerCase().includes(q)).map(t => t.sender),
      ...txs.filter(t => t.receiver.toLowerCase().includes(q)).map(t => t.receiver),
    ]),
  ].slice(0, 5).map(id => {
    const tx = txs.find(t => t.sender === id || t.receiver === id);
    const inv = invs.find(i => i.targetAccount === id);
    return { id, riskScore: inv?.riskScore || tx?.riskScore || 0, fraudRing: inv?.fraudRing || null };
  });

  return {
    accounts: matchedAccounts,
    transactions: txs.filter(t => t.id.toLowerCase().includes(q)).slice(0, 5),
    investigations: invs.filter(i => i.id.toLowerCase().includes(q) || i.targetAccount.toLowerCase().includes(q)).slice(0, 5),
    fraudRings: rings.filter(r => r.id.toLowerCase().includes(q) || r.pattern.toLowerCase().includes(q)).slice(0, 5),
  };
}
