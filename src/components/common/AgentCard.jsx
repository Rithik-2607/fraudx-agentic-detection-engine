import React from 'react';
import { Bot, Play, Pause, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatNumber } from '../../utils/formatters';

export default function AgentCard({ agent, onToggleStatus }) {
  const getAgentMetricLabel = (key) => {
    switch (key) {
      case 'transactionsAnalyzed':
        return 'Tx Analyzed';
      case 'anomaliesDetected':
        return 'Anomalies';
      case 'accuracy':
        return 'Accuracy';
      case 'avgResponseTime':
        return 'Latency';
      case 'networksAnalyzed':
        return 'Graphs Mapped';
      case 'ringsDetected':
        return 'Rings Found';
      case 'accountsLinked':
        return 'Accounts Linked';
      case 'assessmentsCompleted':
        return 'Assessments';
      case 'highRiskIdentified':
        return 'High Risk Accounts';
      case 'avgConfidence':
        return 'Avg Confidence';
      case 'actionsRecommended':
        return 'CM Recommended';
      case 'actionsExecuted':
        return 'CM Executed';
      case 'preventedLoss':
        return 'Loss Prevented';
      case 'reportsGenerated':
        return 'Reports Created';
      case 'pendingReports':
        return 'Pending Reports';
      default:
        return key;
    }
  };

  const getMetricValue = (key, value) => {
    if (key === 'preventedLoss') {
      return `₹${formatNumber(value)}`;
    }
    if (key === 'accuracy' || key === 'avgConfidence') {
      return `${value}%`;
    }
    if (typeof value === 'number') {
      return formatNumber(value);
    }
    return value;
  };

  return (
    <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5 hover:border-surface-500/50 transition-colors flex flex-col justify-between">
      <div>
        {/* Title */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-700"
              style={{ borderLeft: `3px solid ${agent.color || '#3b82f6'}` }}
            >
              <Bot className="w-5 h-5 text-white" style={{ color: agent.color }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{agent.name}</h3>
              <p className="text-[10px] text-surface-300 font-mono mt-0.5">{agent.id}</p>
            </div>
          </div>
          <StatusBadge status={agent.status} />
        </div>

        {/* Description */}
        <p className="text-xs text-surface-200 leading-relaxed mb-6">{agent.description}</p>
      </div>

      <div>
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-surface-700/30 rounded-lg mb-4">
          {Object.entries(agent.metrics).slice(0, 4).map(([key, val]) => (
            <div key={key}>
              <p className="text-[10px] text-surface-300 uppercase tracking-wider">{getAgentMetricLabel(key)}</p>
              <p className="text-xs font-semibold text-white mt-0.5">{getMetricValue(key, val)}</p>
            </div>
          ))}
        </div>

        {/* Action controls */}
        <div className="flex items-center justify-between border-t border-surface-700/50 pt-3">
          <span className="text-[10px] text-surface-300">
            Last seen: {new Date(agent.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={() => onToggleStatus && onToggleStatus(agent.id)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-surface-700 hover:bg-surface-600 text-white transition-colors"
          >
            {agent.status === 'Active' ? (
              <>
                <Pause className="w-3 h-3 text-accent-yellow" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-accent-green" />
                <span>Activate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
