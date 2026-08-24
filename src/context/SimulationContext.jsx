import React, { createContext, useContext, useState, useEffect } from 'react';
import initialTransactions from '../data/transactions';
import initialFraudRings from '../data/fraudRings';
import initialInvestigations from '../data/investigations';
import { agentActivity as initialActivities } from '../data/agents';
import initialNotifications from '../data/notifications';
import initialReports from '../data/reports';
import initialCountermeasures from '../data/countermeasures';
import {
  getTransactions,
  getFraudRings,
  getInvestigations,
  getReports,
  getCountermeasures,
  getNotifications,
  runSimulationOnBackend
} from '../services/api';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [fraudRings, setFraudRings] = useState(initialFraudRings);
  const [investigations, setInvestigations] = useState(initialInvestigations);
  const [activities, setActivities] = useState(initialActivities);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [reports, setReports] = useState(initialReports);
  const [countermeasures, setCountermeasures] = useState(initialCountermeasures);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationStep, setSimulationStep] = useState(null);
  const [toast, setToast] = useState(null);

  // Merge helper: backend items override local by ID, local-only items are preserved
  const mergeById = (localItems, backendItems) => {
    if (!backendItems || !Array.isArray(backendItems)) return localItems;
    const backendIds = new Set(backendItems.map(item => item.id));
    const localOnlyItems = localItems.filter(item => !backendIds.has(item.id));
    return [...backendItems, ...localOnlyItems];
  };

  // Sync with backend on mount
  const syncWithBackend = async () => {
    try {
      const txs = await getTransactions();
      const rings = await getFraudRings();
      const invs = await getInvestigations();
      const rpts = await getReports();
      const cms = await getCountermeasures();
      const notifs = await getNotifications();

      if (txs && Array.isArray(txs)) setTransactions(prev => mergeById(prev, txs));
      if (rings && Array.isArray(rings)) setFraudRings(prev => mergeById(prev, rings));
      if (invs && Array.isArray(invs)) setInvestigations(prev => mergeById(prev, invs));
      if (rpts && Array.isArray(rpts)) setReports(prev => mergeById(prev, rpts));
      if (cms && Array.isArray(cms)) setCountermeasures(prev => mergeById(prev, cms));
      if (notifs && Array.isArray(notifs)) setNotifications(prev => mergeById(prev, notifs));
    } catch (err) {
      console.warn("Unable to sync data with FastAPI backend. Running in offline/mock mode.", err);
    }
  };

  useEffect(() => {
    syncWithBackend();
  }, []);

  // WebSocket connection for real-time agent updates
  useEffect(() => {
    let ws = null;
    let reconnectTimeout = null;

    const connectWS = () => {
      ws = new WebSocket('ws://localhost:8001/ws/agent-activity');

      ws.onopen = () => {
        console.log('Connected to FraudX Agent WebSocket.');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'SIMULATION_COMPLETE') {
            setSimulationRunning(false);
            setSimulationStep(null);
            showToastMessage('Fraud Simulation Complete: RING-019 fully investigated.', 'success');
            // Refresh data listings from backend
            syncWithBackend();
          } else {
            // Append incoming agent activity logs
            setActivities(prev => [data, ...prev]);
            setSimulationStep(`${data.agent}: ${data.action}`);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message', err);
        }
      };

      ws.onclose = () => {
        console.warn('Agent WebSocket closed. Reconnecting...');
        reconnectTimeout = setTimeout(connectWS, 5000);
      };

      ws.onerror = (err) => {
        console.error('Agent WebSocket error', err);
        ws.close();
      };
    };

    connectWS();

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  // Auto live monitor transaction streamer (adds random mock clean transactions periodically if simulation is not running)
  useEffect(() => {
    if (simulationRunning) return;

    const interval = setInterval(() => {
      const locations = ['Bangalore', 'Mumbai', 'Chennai', 'Delhi', 'Jaipur', 'Kolkata'];
      const devices = ['DEV-112', 'DEV-322', 'DEV-556', 'DEV-901', 'DEV-445'];
      const randSenderNum = Math.floor(Math.random() * 9000) + 1000;
      const randRecvNum = Math.floor(Math.random() * 9000) + 1000;
      const randAmount = Math.floor(Math.random() * 12000) + 500;
      const newTxId = `TX-${Math.floor(Math.random() * 90000) + 10000}`;

      const newTx = {
        id: newTxId,
        sender: `U${randSenderNum}`,
        receiver: `U${randRecvNum}`,
        amount: randAmount,
        currency: '₹',
        timestamp: new Date().toISOString(),
        device: devices[Math.floor(Math.random() * devices.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        ip: `192.168.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`,
        riskScore: Math.floor(Math.random() * 25), // Clean transaction
        status: 'Cleared',
        type: 'transfer',
      };

      setTransactions(prev => [newTx, ...prev]);
    }, 8000);

    return () => clearInterval(interval);
  }, [simulationRunning]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const runSimulation = async () => {
    if (simulationRunning) return;
    setSimulationRunning(true);
    setSimulationStep('Simulation Started');
    showToastMessage('Fraud Simulation Triggered', 'info');

    // Trigger simulation run on backend API
    const res = await runSimulationOnBackend();
    if (!res || res.status !== 'STARTED') {
      // Local fallback simulation if backend is down
      runLocalFallbackSimulation();
    }
  };

  const runLocalFallbackSimulation = async () => {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const timestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    // Step 1: Flag U1001
    await wait(2000);
    setSimulationStep('Transaction Agent: Suspicious transaction detected');
    setActivities(prev => [{
      time: timestamp(),
      agent: 'Transaction Detection Agent',
      action: 'Flagged suspicious money laundering flow',
      target: 'U1001',
      status: 'Critical',
      icon: 'Activity'
    }, ...prev]);

    // Step 2: Trace network
    await wait(3000);
    setSimulationStep('Ring Investigator: Connected accounts discovered');
    setActivities(prev => [{
      time: timestamp(),
      agent: 'Ring Investigator Agent',
      action: 'Discovered money laundering layering chain (RING-019)',
      target: 'RING-019',
      status: 'Critical',
      icon: 'Network'
    }, ...prev]);

    // Step 3: Score risk
    await wait(3000);
    setSimulationStep('Risk Agent: Calculating risk score');
    setActivities(prev => [{
      time: timestamp(),
      agent: 'Risk Assessment Agent',
      action: 'Assessed RING-019 Composite Risk Score: 94/100',
      target: 'RING-019',
      status: 'Completed',
      icon: 'AlertTriangle'
    }, ...prev]);

    // Step 4: Recommend restriction
    await wait(3000);
    setSimulationStep('Countermeasure Agent: Restrictions recommended');
    setActivities(prev => [{
      time: timestamp(),
      agent: 'Countermeasure Agent',
      action: 'Recommended transaction restrictions for U1001–U1006',
      target: 'RING-019',
      status: 'Warning',
      icon: 'Shield'
    }, ...prev]);

    // Step 5: Report compilation
    await wait(3000);
    setSimulationStep('Forensic Agent: Report compiled');
    setActivities(prev => [{
      time: timestamp(),
      agent: 'Forensic Report Agent',
      action: 'Generated comprehensive forensic report for RING-019',
      target: 'RPT-002',
      status: 'Completed',
      icon: 'FileText'
    }, ...prev]);

    await wait(2000);
    setSimulationRunning(false);
    setSimulationStep(null);
    showToastMessage('Fraud Simulation Complete: RING-019 fully investigated.', 'success');
  };

  // KPIs dynamically computed from status
  const kpis = {
    totalTransactions: transactions.length + 1284200,
    suspiciousTransactions: transactions.filter(t => t.riskScore >= 60).length + 2300,
    activeFraudRings: fraudRings.length + 32,
    highRiskAccounts: investigations.filter(i => i.riskScore >= 75).length + 120,
    preventedLoss: 18400000,
  };

  return (
    <SimulationContext.Provider
      value={{
        transactions,
        setTransactions,
        fraudRings,
        setFraudRings,
        investigations,
        setInvestigations,
        activities,
        setActivities,
        notifications,
        setNotifications,
        reports,
        setReports,
        countermeasures,
        setCountermeasures,
        simulationRunning,
        simulationStep,
        runSimulation,
        kpis,
        toast,
        showToast: showToastMessage,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
