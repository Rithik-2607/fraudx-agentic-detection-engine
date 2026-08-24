import React from 'react';
import { Activity, Shield, AlertTriangle, FileText, Network, HelpCircle, Eye, UserCheck, Ban, AlertOctagon } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatTime } from '../../utils/formatters';

const iconMap = {
  Activity,
  Shield,
  AlertTriangle,
  FileText,
  Network,
  Eye,
  UserCheck,
  Ban,
  AlertOctagon,
};

export default function AgentActivity({ activities, limit }) {
  const displayItems = limit ? activities.slice(0, limit) : activities;

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || HelpCircle;
    return <IconComponent className="w-4 h-4 text-white" />;
  };

  const getAgentColor = (agentName) => {
    if (agentName.includes('Transaction')) return '#3b82f6';
    if (agentName.includes('Ring')) return '#22d3ee';
    if (agentName.includes('Risk')) return '#f59e0b';
    if (agentName.includes('Countermeasure')) return '#ef4444';
    return '#22c55e';
  };

  return (
    <div className="space-y-3">
      {displayItems.map((act, index) => {
        const agentColor = getAgentColor(act.agent);
        return (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-surface-700/20 border border-surface-600/30 hover:border-surface-500/30 transition-all duration-300 animate-fade-in"
          >
            {/* Timestamp */}
            <div className="text-[10px] font-mono text-surface-300 w-12 flex-shrink-0 pt-0.5">
              {act.time}
            </div>

            {/* Icon */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${agentColor}20`, border: `1px solid ${agentColor}40` }}
            >
              <div style={{ color: agentColor }}>
                {getIcon(act.icon)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-white truncate">{act.agent}</span>
                <StatusBadge status={act.status} />
              </div>
              <p className="text-xs text-surface-200 mt-1">
                {act.action}{' '}
                {act.target && (
                  <span className="font-mono bg-surface-700/60 px-1 py-0.5 rounded text-[10px] text-accent-cyan">
                    {act.target}
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
