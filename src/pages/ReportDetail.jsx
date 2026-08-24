import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Share2, FileText, CheckCircle, BrainCircuit } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import RiskBadge from '../components/common/RiskBadge';
import RiskScore from '../components/common/RiskScore';
import { useSimulation } from '../context/SimulationContext';
import { formatDate } from '../utils/formatters';

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reports, showToast } = useSimulation();

  const rpt = useMemo(() => {
    return reports.find(r => r.id === id) || reports[0];
  }, [id, reports]);

  const handlePrint = () => {
    window.print();
  };

  const handleAction = (type) => {
    showToast(`Forensic file ${rpt.id} ${type} successfully`, 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Back to Reports */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-1 text-xs text-surface-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Report Center</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction('downloaded')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-850 hover:bg-surface-700 text-xs font-semibold text-white border border-surface-600 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-850 hover:bg-surface-700 text-xs font-semibold text-white border border-surface-600 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={() => handleAction('shared')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-850 hover:bg-surface-700 text-xs font-semibold text-white border border-surface-600 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Page Header */}
      <PageHeader
        title={rpt.title}
        subtitle={`Audit ID: ${rpt.investigation} • Compiled by: ${rpt.generatedBy}`}
      />

      {/* Report Canvas Document */}
      <div className="bg-[#0f1424] border border-surface-650/45 rounded-xl shadow-2xl overflow-hidden p-8 space-y-8 text-xs leading-relaxed text-surface-200">
        {/* Document Header banner */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-surface-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-accent-blue/15 flex items-center justify-center text-accent-blue">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">FRAUDX Cyber-Intelligence</h2>
              <p className="text-[10px] text-surface-300 font-mono mt-0.5">Autonomous Forensic Report System</p>
            </div>
          </div>

          <div className="text-right sm:text-left">
            <p className="text-[10px] uppercase text-surface-300">Generated Date</p>
            <p className="font-mono text-white mt-0.5">{formatDate(rpt.date)}</p>
          </div>
        </div>

        {/* Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-700/10 p-5 rounded-lg border border-surface-600/20">
          <div className="flex items-center gap-4">
            <RiskScore score={rpt.riskScore} size="md" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Threat Assessment</h3>
              <p className="text-surface-200 mt-1">Status: Flagged for Countermeasure Restrictions</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6 md:border-l border-surface-750">
            <BrainCircuit className="w-10 h-10 text-accent-cyan" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Agent Confidence</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-extrabold text-white">{rpt.sections.confidenceScore}%</span>
                <span className="px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan font-semibold border border-accent-cyan/20">
                  Critical Confidence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sections content */}
        <div className="space-y-6 divide-y divide-surface-700/30">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">1. Executive Summary</h3>
            <p className="text-surface-200 leading-relaxed">{rpt.sections.executiveSummary}</p>
          </div>

          <div className="space-y-2 pt-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">2. Risk Assessment Breakdown</h3>
            <p className="text-surface-200 leading-relaxed">{rpt.sections.riskAssessment}</p>
          </div>

          <div className="space-y-2 pt-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">3. Fraud Ring Topology Analysis</h3>
            <p className="text-surface-200 leading-relaxed">{rpt.sections.fraudRingAnalysis}</p>
          </div>

          <div className="space-y-2 pt-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">4. Transaction Evidence Logs</h3>
            <p className="text-surface-200 leading-relaxed">{rpt.sections.transactionEvidence}</p>
          </div>

          <div className="space-y-2 pt-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">5. Connected Accounts Ledger</h3>
            <p className="text-surface-200 leading-relaxed font-mono">{rpt.sections.connectedAccounts}</p>
          </div>

          <div className="space-y-2 pt-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">6. Autonomous Agent Findings</h3>
            <p className="text-surface-200 leading-relaxed">{rpt.sections.agentFindings}</p>
          </div>

          <div className="space-y-2 pt-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">7. Recommended Countermeasures</h3>
            <p className="text-surface-200 leading-relaxed font-semibold text-accent-cyan">{rpt.sections.recommendedCountermeasures}</p>
          </div>

          <div className="space-y-2 pt-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">8. Investigation Sequence Timeline</h3>
            <p className="text-surface-200 leading-relaxed">{rpt.sections.investigationTimeline}</p>
          </div>
        </div>

        {/* Verification stamp */}
        <div className="flex items-center justify-between pt-6 border-t border-surface-700/60 text-[10px] text-surface-300">
          <span>Verification stamp: <strong>SECURED-AUTONOMOUS-LOCK</strong></span>
          <div className="flex items-center gap-1 text-accent-green font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Agent Audited</span>
          </div>
        </div>
      </div>
    </div>
  );
}
