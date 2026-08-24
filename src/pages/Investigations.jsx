import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldAlert, AlertOctagon, BarChart3, FileSearch, Eye, Plus } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import RiskBadge from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';
import { useSimulation } from '../context/SimulationContext';
import { formatDate } from '../utils/formatters';

export default function Investigations() {
  const { investigations } = useSimulation();
  const navigate = useNavigate();

  // Metrics summary
  const activeCount = investigations.filter(i => i.status !== 'Completed').length;
  const criticalCount = investigations.filter(i => i.riskScore >= 80).length;
  const completedCount = investigations.filter(i => i.status === 'Completed').length;
  const awaitingReviewCount = investigations.filter(i => i.status === 'Countermeasure Pending' || i.status === 'Pending Review').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Investigation Workspace"
        subtitle="Forensic investigations of threat networks initialized by agents"
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Cases"
          value={activeCount}
          subtitle="Awaiting resolution"
          icon={FileSearch}
          trend="up"
          color="#3b82f6"
        />
        <StatCard
          title="Critical Cases"
          value={criticalCount}
          subtitle="Score above 80"
          icon={ShieldAlert}
          trend="up"
          color="#ef4444"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          subtitle="Resolved case logs"
          icon={BarChart3}
          trend="down"
          color="#22c55e"
        />
        <StatCard
          title="Awaiting Review"
          value={awaitingReviewCount}
          subtitle="Pending action decisions"
          icon={AlertOctagon}
          trend="up"
          color="#f97316"
        />
      </div>

      {/* Investigations Ledger */}
      <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Investigation Cases</h2>
            <p className="text-xs text-surface-200 mt-0.5">Manage agentic audits and inspect supporting data logs</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-700 text-surface-300 font-semibold bg-surface-700/10">
                <th className="py-3 px-4">Investigation ID</th>
                <th className="py-3 px-4">Target Account</th>
                <th className="py-3 px-4">Associated Ring</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Composite Risk</th>
                <th className="py-3 px-4">Case Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/50 text-white font-medium">
              {investigations.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => navigate(`/investigations/${inv.id}`)}
                  className="hover:bg-surface-700/20 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-accent-cyan">{inv.id}</td>
                  <td className="py-3.5 px-4 font-mono">{inv.targetAccount}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-surface-200 font-semibold">{inv.fraudRing || '—'}</span>
                  </td>
                  <td className="py-3.5 px-4 text-surface-200">{inv.assignedAgent}</td>
                  <td className="py-3.5 px-4">
                    <RiskBadge score={inv.riskScore} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-surface-300">
                    {formatDate(inv.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-700 hover:bg-surface-600 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
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
