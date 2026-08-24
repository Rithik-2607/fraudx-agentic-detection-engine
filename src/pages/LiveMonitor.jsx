import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Radio, CircleDot, Eye, Filter } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import RiskBadge from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';
import { useSimulation } from '../context/SimulationContext';
import { formatCurrency, formatTime } from '../utils/formatters';

export default function LiveMonitor() {
  const { transactions } = useSimulation();
  const navigate = useNavigate();
  const [streamActive, setStreamActive] = useState(true);
  const [displayedTx, setDisplayedTx] = useState([]);
  const [riskFilter, setRiskFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Freeze/unfreeze stream handler
  useEffect(() => {
    if (!streamActive) return;
    // Set displayed transactions to update in sync with global state
    setDisplayedTx(transactions);
  }, [transactions, streamActive]);

  const filteredTx = displayedTx.filter(tx => {
    const matchesRisk =
      riskFilter === 'All' ||
      (riskFilter === 'Critical' && tx.riskScore >= 80) ||
      (riskFilter === 'High' && tx.riskScore >= 60 && tx.riskScore < 80) ||
      (riskFilter === 'Medium' && tx.riskScore >= 40 && tx.riskScore < 60) ||
      (riskFilter === 'Low' && tx.riskScore < 40);

    const matchesType = typeFilter === 'All' || tx.type === typeFilter;

    return matchesRisk && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Live Transaction Monitor"
        subtitle="Autonomous transaction stream analysis"
      >
        <div className="flex items-center gap-4 bg-surface-800 border border-surface-600/50 rounded-lg px-3 py-1.5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${streamActive ? 'bg-accent-red animate-pulse' : 'bg-surface-300'}`} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-white">LIVE STREAM</span>
          </div>

          <div className="h-4 w-px bg-surface-600" />

          <button
            onClick={() => setStreamActive(!streamActive)}
            className="flex items-center gap-1.5 text-xs text-white hover:text-accent-cyan transition-colors"
          >
            {streamActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Stream</span>
              </>
            )}
          </button>
        </div>
      </PageHeader>

      {/* Control Filter Bar */}
      <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-surface-200">
          <Filter className="w-4 h-4 text-surface-300" />
          <span className="text-xs font-semibold">Stream Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Risk Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-300">Risk Threshold:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="text-xs bg-surface-700 border border-surface-600 rounded px-2 py-1 text-white focus:outline-none"
            >
              <option value="All">All Risks</option>
              <option value="Critical">Critical (80+)</option>
              <option value="High">High (60-79)</option>
              <option value="Medium">Medium (40-59)</option>
              <option value="Low">Low (&lt;40)</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-300">Tx Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-surface-700 border border-surface-600 rounded px-2 py-1 text-white focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="transfer">Transfer</option>
              <option value="payment">Payment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Streams Table */}
      <div className="bg-surface-800 border border-surface-600/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-700 text-surface-300 font-semibold bg-surface-700/10">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Flow Sequence</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Device ID</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4">System Actions</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/50 text-white font-medium">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-surface-300">
                    No transactions captured in active buffer matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`hover:bg-surface-700/20 transition-all duration-300 ${
                      tx.riskScore >= 80 ? 'bg-accent-red/5' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono text-surface-300">
                      {formatTime(tx.timestamp)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-accent-cyan">
                      {tx.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-surface-200">
                      <span>U{tx.sender.replace(/[^0-9]/g, '')}</span>
                      <span className="text-surface-300 mx-1.5">→</span>
                      <span>U{tx.receiver.replace(/[^0-9]/g, '')}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-surface-200">
                      {tx.location}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-surface-300">
                      {tx.device}
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge score={tx.riskScore} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/transactions?selected=${tx.id}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-700 hover:bg-surface-600 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
