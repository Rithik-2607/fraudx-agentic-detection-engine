import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, ShieldAlert, AlertTriangle, Users, ArrowRight, TrendingUp } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import RiskBadge from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';
import { useSimulation } from '../context/SimulationContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function FraudRings() {
  const { fraudRings } = useSimulation();
  const navigate = useNavigate();

  // Metrics derived from active rings
  const activeRingsCount = fraudRings.filter(r => r.status === 'Active').length;
  const criticalRingsCount = fraudRings.filter(r => r.riskScore >= 80).length;
  const accountsUnderInvestigation = fraudRings.reduce((acc, r) => acc + r.accountCount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Fraud Ring Intelligence"
        subtitle="Discover and analyze coordinated financial networks"
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Rings"
          value={activeRingsCount}
          subtitle="Currently monitored"
          icon={Network}
          trend="up"
          color="#ef4444"
        />
        <StatCard
          title="Newly Detected"
          value={1}
          subtitle="Flagged today"
          icon={TrendingUp}
          trend="up"
          color="#22d3ee"
        />
        <StatCard
          title="High Severity"
          value={criticalRingsCount}
          subtitle="Score above 80"
          icon={ShieldAlert}
          trend="up"
          color="#f97316"
        />
        <StatCard
          title="Accounts Linked"
          value={accountsUnderInvestigation}
          subtitle="Under observation"
          icon={Users}
          trend="up"
          color="#3b82f6"
        />
      </div>

      {/* Fraud Ring List */}
      <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Fraud Rings</h2>
            <p className="text-xs text-surface-200 mt-0.5">Coordinated multi-account transaction cycles tracked by Ring Investigators</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-700 text-surface-300 font-semibold bg-surface-700/10">
                <th className="py-3 px-4">Ring ID</th>
                <th className="py-3 px-4">Accounts Involved</th>
                <th className="py-3 px-4">Total Transactions</th>
                <th className="py-3 px-4">Fund Flow Value</th>
                <th className="py-3 px-4">Coordinated Pattern</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Detected Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/50 text-white font-medium">
              {fraudRings.map((ring) => (
                <tr
                  key={ring.id}
                  onClick={() => navigate(`/fraud-rings/${ring.id}`)}
                  className="hover:bg-surface-700/20 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-accent-cyan">{ring.id}</td>
                  <td className="py-3.5 px-4 text-surface-200">
                    <span className="font-semibold text-white">{ring.accountCount}</span> accounts
                  </td>
                  <td className="py-3.5 px-4 text-surface-200">
                    <span className="font-semibold text-white">{ring.transactionCount}</span> transfers
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {formatCurrency(ring.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-accent-cyan font-semibold">
                    {ring.pattern}
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge score={ring.riskScore} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-surface-300">
                    {formatDate(ring.detectedAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={ring.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-700 hover:bg-surface-600 transition-colors font-semibold">
                      <span>Investigate</span>
                      <ArrowRight className="w-3.5 h-3.5 text-accent-cyan" />
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
