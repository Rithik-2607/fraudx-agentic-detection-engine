import React, { useState } from 'react';
import { Shield, Ban, Eye, UserCheck, AlertOctagon, FileText, CheckCircle } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import RiskBadge from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useSimulation } from '../context/SimulationContext';
import { formatDate, formatTime } from '../utils/formatters';

const iconMap = {
  Monitor: Eye,
  'Request Verification': UserCheck,
  'Restrict Transactions': Ban,
  'Escalate Investigation': AlertOctagon,
  'Generate Forensic Report': FileText,
};

export default function Countermeasures() {
  const { countermeasures, setCountermeasures, showToast } = useSimulation();
  const [selectedCM, setSelectedCM] = useState(null);

  const handleOpenConfirm = (cm) => {
    setSelectedCM(cm);
  };

  const handleCloseConfirm = () => {
    setSelectedCM(null);
  };

  const handleExecuteCountermeasure = () => {
    if (!selectedCM) return;

    // Update Countermeasures state to approved/executed in local store
    setCountermeasures(prev =>
      prev.map(c =>
        c.id === selectedCM.id
          ? { ...c, status: 'Executed' }
          : c
      )
    );

    showToast(`Countermeasure executed for account ${selectedCM.account}`, 'success');
    setSelectedCM(null);
  };

  const countermeasureTypes = [
    { type: 'Monitor', desc: 'Enhanced observation for low-risk actions.', risk: 'Low', color: '#22c55e' },
    { type: 'Request Verification', desc: 'Prompt verification challenge for medium-risk.', risk: 'Medium', color: '#f59e0b' },
    { type: 'Restrict Transactions', desc: 'Hold outbound funds velocity for high-risk.', risk: 'High', color: '#f97316' },
    { type: 'Escalate Investigation', desc: 'Transfer ledger history to senior analysts.', risk: 'Critical', color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Autonomous Countermeasures"
        subtitle="Protect accounts based on investigation confidence and risk"
      />

      {/* Action types cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {countermeasureTypes.map((t, idx) => {
          const Icon = iconMap[t.type] || Shield;
          return (
            <div
              key={idx}
              className="bg-surface-800 border border-surface-600/50 rounded-xl p-5 hover:border-surface-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${t.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: t.color }} />
                </div>
                <span
                  className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${t.color}15`, color: t.color }}
                >
                  {t.risk} Risk
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{t.type}</h3>
              <p className="text-xs text-surface-200 leading-relaxed">{t.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Countermeasures Table */}
      <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Actions Ledger</h2>
            <p className="text-xs text-surface-200 mt-0.5">Countermeasure recommendation history and approval pipeline</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-700 text-surface-300 font-semibold bg-surface-700/10">
                <th className="py-3 px-4">Action ID</th>
                <th className="py-3 px-4">Target Account</th>
                <th className="py-3 px-4">Risk score</th>
                <th className="py-3 px-4">Recommended Action</th>
                <th className="py-3 px-4">Triggered By</th>
                <th className="py-3 px-4">Time Logged</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/50 text-white font-medium">
              {countermeasures.map((cm) => (
                <tr key={cm.id} className="hover:bg-surface-700/20 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-accent-cyan">{cm.id}</td>
                  <td className="py-3.5 px-4 font-mono">{cm.account}</td>
                  <td className="py-3.5 px-4">
                    <RiskBadge score={cm.riskScore} />
                  </td>
                  <td className="py-3.5 px-4 text-surface-200">
                    <span className="font-semibold text-white">{cm.action}</span>
                  </td>
                  <td className="py-3.5 px-4 text-surface-300">{cm.triggeredBy}</td>
                  <td className="py-3.5 px-4 font-mono text-surface-300">
                    {formatDate(cm.time)} {formatTime(cm.time)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={cm.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {cm.status.toLowerCase().includes('pending') ? (
                      <button
                        onClick={() => handleOpenConfirm(cm)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-accent-blue/85 hover:bg-accent-blue text-white font-bold transition-all text-[11px]"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-accent-green font-semibold pr-2">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedCM && (
        <Modal
          title="Confirm Countermeasure Execution"
          onClose={handleCloseConfirm}
          onConfirm={handleExecuteCountermeasure}
          confirmLabel="Execute Countermeasure"
          confirmColor="#ef4444"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-surface-200 leading-relaxed">
              Verify the following autonomous agent recommendation details before authorizing the countermeasure:
            </p>

            <div className="p-4 bg-surface-700/30 rounded-lg border border-surface-600/40 space-y-3">
              <div className="flex justify-between">
                <span className="text-surface-300">Target Account:</span>
                <span className="font-mono text-white font-bold">{selectedCM.account}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-300">Risk Assessment:</span>
                <RiskBadge score={selectedCM.riskScore} />
              </div>
              <div className="flex justify-between">
                <span className="text-surface-300">Trigger Reason:</span>
                <span className="font-semibold text-white">{selectedCM.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-300">Recommended Action:</span>
                <span className="font-semibold text-accent-cyan uppercase tracking-wider">{selectedCM.action}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Evidence Logs</h4>
              <ul className="list-disc pl-4 space-y-1 text-surface-200">
                {selectedCM.evidence.map((ev, idx) => (
                  <li key={idx}>{ev}</li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
