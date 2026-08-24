import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight, ShieldAlert, Network, AlertOctagon, Landmark,
  Play, CircleDot, RefreshCw, Eye
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import AgentActivity from '../components/common/AgentActivity';
import FraudNetwork from '../components/common/FraudNetwork';
import RiskBadge from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';
import { useSimulation } from '../context/SimulationContext';
import { formatNumber, formatCurrency, formatDate } from '../utils/formatters';

export default function Dashboard() {
  const { kpis, activities, investigations, fraudRings, runSimulation, simulationRunning, simulationStep } = useSimulation();
  const navigate = useNavigate();
  const [refreshTime, setRefreshTime] = useState(new Date());

  // Pie chart risk distribution data
  const riskPieData = [
    { name: 'Low', value: 842, color: '#22c55e' },
    { name: 'Medium', value: 328, color: '#f59e0b' },
    { name: 'High', value: 186, color: '#f97316' },
    { name: 'Critical', value: 124, color: '#ef4444' },
  ];

  // Trend lines
  const trendData = [
    { time: '00:00', detected: 12, resolved: 8 },
    { time: '04:00', detected: 8, resolved: 6 },
    { time: '08:00', detected: 24, resolved: 18 },
    { time: '12:00', detected: 42, resolved: 30 },
    { time: '16:00', detected: 38, resolved: 28 },
    { time: '20:00', detected: 22, resolved: 15 },
  ];

  const handleRefresh = () => {
    setRefreshTime(new Date());
  };

  // Extract a mini version of RING-018 nodes and edges for the dashboard graph
  const ring18 = fraudRings.find(r => r.id === 'RING-018') || { nodes: [], edges: [] };
  const ring18Nodes = ring18.nodes || [];
  const ring18Edges = ring18.edges || [];
  const graphNodes = ring18Nodes.map((n, i) => ({
    id: n.id,
    risk: n.risk,
    role: n.role,
    // circular position helper
    position: {
      x: 150 + 130 * Math.sin((2 * Math.PI * i) / (ring18Nodes.length || 1)),
      y: 150 + 130 * Math.cos((2 * Math.PI * i) / (ring18Nodes.length || 1)),
    },
  }));

  return (
    <div className="space-y-6">
      {/* Simulation status bar if running */}
      {simulationRunning && (
        <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl px-4 py-3 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <CircleDot className="w-4.5 h-4.5 text-accent-cyan animate-pulse-dot" />
            <span className="text-sm font-semibold text-white">Simulation Active:</span>
            <span className="text-xs font-medium text-accent-cyan">{simulationStep}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-surface-200 bg-surface-700/60 px-2.5 py-1 rounded">
            Agent Workflow
          </span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Fraud Intelligence Dashboard"
        subtitle="Autonomous monitoring and investigation of transaction networks"
      >
        <div className="flex items-center gap-3 text-xs text-surface-300">
          <span>Refreshed: {refreshTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded hover:bg-surface-700 text-surface-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          onClick={runSimulation}
          disabled={simulationRunning}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-accent-blue hover:bg-accent-blue/90 rounded-lg disabled:opacity-50 transition-colors shadow-lg shadow-accent-blue/15"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Run Fraud Simulation</span>
        </button>
      </PageHeader>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Transactions"
          value={formatNumber(kpis.totalTransactions)}
          subtitle="+12.4% today"
          icon={ArrowLeftRight}
          trend="up"
          color="#3b82f6"
        />
        <StatCard
          title="Suspicious Transactions"
          value={formatNumber(kpis.suspiciousTransactions)}
          subtitle="+8.2%"
          icon={ShieldAlert}
          trend="up"
          color="#f59e0b"
        />
        <StatCard
          title="Active Fraud Rings"
          value={kpis.activeFraudRings}
          subtitle="+5 detected today"
          icon={Network}
          trend="up"
          color="#ef4444"
        />
        <StatCard
          title="High Risk Accounts"
          value={kpis.highRiskAccounts}
          subtitle="18 require immediate action"
          icon={AlertOctagon}
          trend="up"
          color="#f97316"
        />
        <StatCard
          title="Prevented Loss"
          value={`₹${(kpis.preventedLoss / 1000000).toFixed(1)}M`}
          subtitle="This month"
          icon={Landmark}
          trend="up"
          color="#22c55e"
        />
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fraud Network Visualization */}
        <div className="lg:col-span-8 bg-surface-800 border border-surface-600/50 rounded-xl p-5 flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Fraud Network (RING-018)</h2>
              <p className="text-xs text-surface-200 mt-0.5">Click accounts to inspect transactions or review network topology</p>
            </div>
            <button
              onClick={() => navigate('/fraud-rings/RING-018')}
              className="text-xs text-accent-cyan hover:underline"
            >
              Analyze Ring Detail
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <FraudNetwork
              nodes={graphNodes}
              edges={ring18Edges}
              onNodeClick={(id) => navigate(`/transactions?search=${id}`)}
            />
          </div>
        </div>

        {/* Live Agent Activity Feed */}
        <div className="lg:col-span-4 bg-surface-800 border border-surface-600/50 rounded-xl p-5 flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Autonomous Agent Activity</h2>
              <p className="text-xs text-surface-200 mt-0.5">Real-time threat investigation log</p>
            </div>
            <button
              onClick={() => navigate('/agents')}
              className="text-xs text-accent-cyan hover:underline"
            >
              View Agent Control Center
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <AgentActivity activities={activities} limit={5} />
          </div>
        </div>
      </div>

      {/* Analytics & Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Distribution Chart */}
        <div className="lg:col-span-4 bg-surface-800 border border-surface-600/50 rounded-xl p-5 h-[320px] flex flex-col">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Risk Distribution</h3>
          <div className="flex-1 min-h-0 flex items-center justify-between">
            <div className="w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 pl-4 space-y-2">
              {riskPieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-surface-200">{item.name}</span>
                  </div>
                  <span className="font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fraud Detection Trend Line */}
        <div className="lg:col-span-8 bg-surface-800 border border-surface-600/50 rounded-xl p-5 h-[320px] flex flex-col">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Fraud Detection Trend (Last 24 hours)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="time" stroke="#4a5478" fontSize={10} tickLine={false} />
                <YAxis stroke="#4a5478" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f1424', borderColor: '#323b5a', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="detected" name="Detected" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Investigations Table */}
      <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Investigations</h2>
            <p className="text-xs text-surface-200 mt-0.5">Active cases currently being compiled by forensic agents</p>
          </div>
          <button
            onClick={() => navigate('/investigations')}
            className="text-xs text-accent-cyan hover:underline"
          >
            Manage Investigations
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-700 text-surface-300 font-semibold">
                <th className="py-3 px-4">Investigation ID</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Fraud Ring</th>
                <th className="py-3 px-4">Agent Status</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/50 text-white">
              {investigations.slice(0, 5).map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-700/20 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-accent-cyan">{inv.id}</td>
                  <td className="py-3 px-4 font-mono">{inv.targetAccount}</td>
                  <td className="py-3 px-4">
                    <RiskBadge score={inv.riskScore} />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-surface-200 font-semibold">{inv.fraudRing || '—'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-3 px-4 text-surface-200">{inv.assignedAgent}</td>
                  <td className="py-3 px-4 text-surface-300 font-mono">
                    {new Date(inv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/investigations/${inv.id}`)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-700 hover:bg-surface-600 font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
