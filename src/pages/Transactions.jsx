import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Eye, ArrowLeftRight, Calendar, Landmark, Info, Smartphone, Network } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import RiskBadge from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';
import Drawer from '../components/common/Drawer';
import RiskScore from '../components/common/RiskScore';
import RiskFactors from '../components/common/RiskFactors';
import { useSimulation } from '../context/SimulationContext';
import { formatCurrency, formatFullCurrency, formatDate, formatTime } from '../utils/formatters';
import { getTransactionRiskFactors } from '../services/api';

export default function Transactions() {
  const { transactions } = useSimulation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Selected Transaction for Detail Drawer
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedTxFactors, setSelectedTxFactors] = useState([]);
  const [factorsLoading, setFactorsLoading] = useState(false);

  // Sync Search Query state with URL params
  useEffect(() => {
    const searchVal = searchParams.get('search');
    if (searchVal !== null) {
      setSearchQuery(searchVal);
    }

    const selectedId = searchParams.get('selected');
    if (selectedId) {
      const match = transactions.find(t => t.id === selectedId);
      if (match) {
        handleOpenDetail(match);
      }
    }
  }, [searchParams, transactions]);

  const handleOpenDetail = async (tx) => {
    setSelectedTx(tx);
    setFactorsLoading(true);
    try {
      const factors = await getTransactionRiskFactors(tx.id);
      setSelectedTxFactors(factors);
    } catch (err) {
      console.error(err);
    } finally {
      setFactorsLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedTx(null);
    setSelectedTxFactors([]);
    // Remove selected query param without clearing other filters
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('selected');
    setSearchParams(newParams);
  };

  // Filter Logic
  const filteredTransactions = transactions.filter((tx) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      tx.id.toLowerCase().includes(q) ||
      tx.sender.toLowerCase().includes(q) ||
      tx.receiver.toLowerCase().includes(q) ||
      tx.location.toLowerCase().includes(q) ||
      tx.device.toLowerCase().includes(q);

    const matchesRisk =
      riskFilter === 'All' ||
      (riskFilter === 'Critical' && tx.riskScore >= 80) ||
      (riskFilter === 'High' && tx.riskScore >= 60 && tx.riskScore < 80) ||
      (riskFilter === 'Medium' && tx.riskScore >= 40 && tx.riskScore < 60) ||
      (riskFilter === 'Low' && tx.riskScore < 40);

    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;

    const amt = tx.amount;
    const matchesMinAmount = !minAmount || amt >= parseFloat(minAmount);
    const matchesMaxAmount = !maxAmount || amt <= parseFloat(maxAmount);

    return matchesSearch && matchesRisk && matchesStatus && matchesMinAmount && matchesMaxAmount;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Transaction Ledger"
        subtitle="Manage, audit, and analyze system-wide transactions"
      />

      {/* Advanced Filter Bar */}
      <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5 space-y-4">
        {/* Row 1: Search & Core filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-surface-300 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by ID, account, device, or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Also update query param for search filter persistence
                const newParams = new URLSearchParams(searchParams);
                if (e.target.value) {
                  newParams.set('search', e.target.value);
                } else {
                  newParams.delete('search');
                }
                setSearchParams(newParams);
              }}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-surface-700 border border-surface-600 rounded-lg text-white placeholder-surface-300 focus:outline-none focus:border-accent-blue"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full text-xs bg-surface-700 border border-surface-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-accent-blue"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical (80+)</option>
              <option value="High">High (60-79)</option>
              <option value="Medium">Medium (40-59)</option>
              <option value="Low">Low (&lt;40)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs bg-surface-700 border border-surface-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-accent-blue"
            >
              <option value="All">All Statuses</option>
              <option value="Investigating">Investigating</option>
              <option value="Flagged">Flagged</option>
              <option value="Cleared">Cleared</option>
              <option value="Monitoring">Monitoring</option>
            </select>
          </div>
        </div>

        {/* Row 2: Amount & limits filter */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-surface-700/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-300">Min Amount (₹):</span>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="text-xs bg-surface-700 border border-surface-600 rounded px-2 py-1 text-white w-28 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-300">Max Amount (₹):</span>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="e.g. 100000"
              className="text-xs bg-surface-700 border border-surface-600 rounded px-2 py-1 text-white w-28 focus:outline-none"
            />
          </div>
          {(minAmount || maxAmount || riskFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setRiskFilter('All');
                setStatusFilter('All');
                setMinAmount('');
                setMaxAmount('');
                setSearchParams({});
              }}
              className="text-xs text-accent-red hover:underline ml-auto font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-surface-800 border border-surface-600/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-700 text-surface-300 font-semibold bg-surface-700/10">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Receiver</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/50 text-white font-medium">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-surface-300">
                    No transactions matched your filtering query.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => handleOpenDetail(tx)}
                    className="hover:bg-surface-700/20 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent-cyan">{tx.id}</td>
                    <td className="py-3.5 px-4 font-mono">{tx.sender}</td>
                    <td className="py-3.5 px-4 font-mono">{tx.receiver}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{formatCurrency(tx.amount)}</td>
                    <td className="py-3.5 px-4 font-mono text-surface-300">
                      {formatDate(tx.timestamp)} {formatTime(tx.timestamp)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-surface-300">{tx.device}</td>
                    <td className="py-3.5 px-4 text-surface-200">{tx.location}</td>
                    <td className="py-3.5 px-4">
                      <RiskBadge score={tx.riskScore} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1 text-surface-300 hover:text-white rounded hover:bg-surface-700 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Drawer */}
      {selectedTx && (
        <Drawer
          title={`Transaction details: ${selectedTx.id}`}
          onClose={handleCloseDetail}
          width="max-w-lg"
        >
          <div className="space-y-6">
            {/* Component Section: Overview */}
            <div className="bg-surface-700/20 border border-surface-600/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-surface-700/50">
                <Info className="w-4.5 h-4.5 text-accent-blue" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Transaction Overview</h3>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                <div>
                  <p className="text-surface-300 uppercase tracking-wider text-[10px]">Amount</p>
                  <p className="text-lg font-bold text-white mt-0.5">{formatFullCurrency(selectedTx.amount)}</p>
                </div>
                <div>
                  <p className="text-surface-300 uppercase tracking-wider text-[10px]">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedTx.status} />
                  </div>
                </div>
                <div>
                  <p className="text-surface-300 uppercase tracking-wider text-[10px]">Sender Account</p>
                  <p className="font-mono text-white font-semibold mt-0.5">{selectedTx.sender}</p>
                </div>
                <div>
                  <p className="text-surface-300 uppercase tracking-wider text-[10px]">Receiver Account</p>
                  <p className="font-mono text-white font-semibold mt-0.5">{selectedTx.receiver}</p>
                </div>
                <div>
                  <p className="text-surface-300 uppercase tracking-wider text-[10px]">Timestamp</p>
                  <p className="font-mono text-surface-200 mt-0.5">{formatDate(selectedTx.timestamp)} {formatTime(selectedTx.timestamp)}</p>
                </div>
                <div>
                  <p className="text-surface-300 uppercase tracking-wider text-[10px]">Location</p>
                  <p className="text-surface-200 mt-0.5">{selectedTx.location}</p>
                </div>
                <div>
                  <p className="text-surface-300 uppercase tracking-wider text-[10px]">Device ID</p>
                  <p className="font-mono text-surface-200 mt-0.5">{selectedTx.device}</p>
                </div>
                <div>
                  <p className="text-surface-300 uppercase tracking-wider text-[10px]">IP Address</p>
                  <p className="font-mono text-surface-200 mt-0.5">{selectedTx.ip}</p>
                </div>
              </div>
            </div>

            {/* Component Section: Risk Analysis */}
            <div className="bg-surface-700/20 border border-surface-600/30 rounded-xl p-5 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-surface-700/50">
                <Network className="w-4.5 h-4.5 text-accent-red" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Risk Analysis Assessment</h3>
              </div>

              <div className="flex items-center justify-around py-2">
                <RiskScore score={selectedTx.riskScore} size="lg" />
              </div>

              <div className="pt-2 border-t border-surface-700/50">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Risk Factor Breakdown</h4>
                {factorsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-5 h-5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <RiskFactors factors={selectedTxFactors} />
                )}
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
