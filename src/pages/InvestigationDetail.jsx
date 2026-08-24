import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ShieldAlert, CheckCircle, Info, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import RiskBadge from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';
import RiskScore from '../components/common/RiskScore';
import InvestigationTimeline from '../components/common/InvestigationTimeline';
import EvidenceCard from '../components/common/EvidenceCard';
import { useSimulation } from '../context/SimulationContext';
import { formatDate } from '../utils/formatters';

export default function InvestigationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { investigations } = useSimulation();

  const inv = useMemo(() => {
    return investigations.find(i => i.id === id) || investigations[0];
  }, [id, investigations]);

  const [expandedReasonIdx, setExpandedReasonIdx] = useState(null);

  const toggleReason = (idx) => {
    setExpandedReasonIdx(expandedReasonIdx === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/investigations')}
          className="flex items-center gap-1 text-xs text-surface-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Investigations</span>
        </button>
      </div>

      {/* Page Header */}
      <PageHeader
        title={`Forensic Workspace: ${inv.id}`}
        subtitle={`Audit ledger logs for target ${inv.targetAccount}`}
      >
        <StatusBadge status={inv.status} />
      </PageHeader>

      {/* Case Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Evidence & Timeline Stepper */}
        <div className="lg:col-span-7 space-y-6">
          {/* Stepper Timeline card */}
          <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Autonomous Audit Progression</h3>
            <InvestigationTimeline timeline={inv.timeline} />
          </div>

          {/* Forensic Evidence Categorized Cards */}
          <div className="space-y-6">
            <EvidenceCard category="Transaction" items={inv.evidence.transaction} />
            <EvidenceCard category="Network" items={inv.evidence.network} />
            <EvidenceCard category="Behavioral" items={inv.evidence.behavioral} />
          </div>
        </div>

        {/* Right Column: AI Explainer Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Explanation & Hypotheses summary card */}
          <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-surface-700/50">
              <BrainCircuit className="w-5 h-5 text-accent-cyan" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Agent Investigation Summary</h3>
            </div>

            {/* Overview Dial */}
            <div className="flex items-center justify-around py-2">
              <RiskScore score={inv.riskScore} size="lg" />
              <div className="space-y-1">
                <p className="text-[10px] text-surface-300 uppercase tracking-wider">Confidence Assessment</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-white">{inv.confidence}%</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
                    High Confidence
                  </span>
                </div>
              </div>
            </div>

            {/* Hypotheses text */}
            <div className="p-4 bg-surface-700/25 border border-surface-600/30 rounded-lg text-xs leading-relaxed text-surface-200">
              <p className="font-semibold text-white mb-2">Agent Context Explanation:</p>
              {inv.summary}
            </div>

            {/* Why Flagged dropdown accordion */}
            <div className="space-y-3 pt-3 border-t border-surface-700/50">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Why was this flagged?</h4>

              <div className="space-y-2">
                {inv.flagReasons.map((reason, idx) => {
                  const isExpanded = expandedReasonIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-surface-600/40 rounded-lg overflow-hidden transition-all bg-surface-750/30"
                    >
                      <button
                        onClick={() => toggleReason(idx)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-white font-semibold hover:bg-surface-700/30 text-left transition-colors"
                      >
                        <span>{reason.reason}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-surface-300" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-surface-300" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 text-xs text-surface-200 leading-relaxed border-t border-surface-700/30 bg-surface-800/40 animate-fade-in">
                          {reason.detail}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
