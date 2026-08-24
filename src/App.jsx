import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { SimulationProvider } from './context/SimulationContext';
import Toast from './components/common/Toast';

// Pages
import Dashboard from './pages/Dashboard';
import LiveMonitor from './pages/LiveMonitor';
import Transactions from './pages/Transactions';
import FraudRings from './pages/FraudRings';
import FraudRingDetail from './pages/FraudRingDetail';
import Investigations from './pages/Investigations';
import InvestigationDetail from './pages/InvestigationDetail';
import Agents from './pages/Agents';
import Countermeasures from './pages/Countermeasures';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  return (
    <SimulationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="live-monitor" element={<LiveMonitor />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="fraud-rings" element={<FraudRings />} />
            <Route path="fraud-rings/:id" element={<FraudRingDetail />} />
            <Route path="investigations" element={<Investigations />} />
            <Route path="investigations/:id" element={<InvestigationDetail />} />
            <Route path="agents" element={<Agents />} />
            <Route path="countermeasures" element={<Countermeasures />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/:id" element={<ReportDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toast />
    </SimulationProvider>
  );
}
