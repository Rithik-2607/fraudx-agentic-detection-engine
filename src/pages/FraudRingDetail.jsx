import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Network, ArrowLeft, Calendar, ShieldAlert, Award, ChevronRight, Play, Pause, RefreshCw } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import RiskBadge from '../components/common/RiskBadge';
import RiskScore from '../components/common/RiskScore';
import FraudNetwork from '../components/common/FraudNetwork';
import StatusBadge from '../components/common/StatusBadge';
import { useSimulation } from '../context/SimulationContext';
import { formatCurrency, formatFullCurrency, formatDate } from '../utils/formatters';

export default function FraudRingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fraudRings } = useSimulation();

  const ring = useMemo(() => {
    return fraudRings.find(r => r.id === id) || fraudRings[0];
  }, [id, fraudRings]);

  // Evolution slider state
  const [evolutionStep, setEvolutionStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const ringEvolution = ring.evolution || [];
  const ringNodes = ring.nodes || [];
  const ringEdges = ring.edges || [];

  useEffect(() => {
    // Reset slider when ring ID changes
    setEvolutionStep(Math.max(0, ringEvolution.length - 1));
    setIsPlaying(false);
  }, [id, ring, ringEvolution.length]);

  // Evolution player effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setEvolutionStep((prev) => {
        if (prev >= ringEvolution.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, ringEvolution.length]);

  // Filter nodes & edges for selected evolution step
  const currentEvolution = ringEvolution[evolutionStep] || ringEvolution[0] || { accounts: [], edges: [] };

  const currentNodes = useMemo(() => {
    const activeAccounts = currentEvolution.accounts || [];
    return ringNodes
      .filter((node) => activeAccounts.includes(node.id))
      .map((node, i) => {
        const angle = (2 * Math.PI * i) / (activeAccounts.length || 1);
        return {
          ...node,
          position: {
            x: 200 + 150 * Math.sin(angle),
            y: 200 + 150 * Math.cos(angle),
          },
        };
      });
  }, [ringNodes, currentEvolution]);

  const currentEdges = useMemo(() => {
    const activeAccounts = currentEvolution.accounts || [];
    return ringEdges.filter(
      (edge) =>
        activeAccounts.includes(edge.source) &&
        activeAccounts.includes(edge.target)
    );
  }, [ringEdges, currentEvolution]);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs / Back button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/fraud-rings')}
          className="flex items-center gap-1 text-xs text-surface-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fraud Rings</span>
        </button>
      </div>

      {/* Page Header */}
      <PageHeader
        title={`Fraud Ring Investigation Workspace: ${ring.id}`}
        subtitle={`Investigate network pattern "${ring.pattern}"`}
      >
        <StatusBadge status={ring.status} />
      </PageHeader>

      {/* Ring Meta Stats Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-surface-800 border border-surface-600/50 rounded-xl p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ring Metadata Assessment</h3>
            <div className="flex justify-center py-4">
              <RiskScore score={ring.riskScore} size="lg" />
            </div>

            <div className="space-y-3 pt-3 border-t border-surface-700/50 text-xs">
              <div className="flex justify-between">
                <span className="text-surface-300">Nodes/Accounts:</span>
                <span className="font-bold text-white">{ring.accountCount} Accounts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-300">Total Transactions:</span>
                <span className="font-bold text-white">{ring.transactionCount} Cycles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-300">Fund Flow Value:</span>
                <span className="font-bold text-white">{formatFullCurrency(ring.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-300">Detected:</span>
                <span className="font-mono text-surface-200">{formatDate(ring.detectedAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-700/20 border border-surface-600/20 rounded-lg p-3 text-xs leading-relaxed text-surface-200">
            <span className="font-bold text-white">System Hypothesis:</span> {ring.description}
          </div>
        </div>

        {/* Graph representation */}
        <div className="lg:col-span-8 bg-surface-800 border border-surface-600/50 rounded-xl p-5 flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Interactive Network Topology</h3>
              <p className="text-xs text-surface-200">Drag, zoom, and select accounts in the active graph</p>
            </div>
            <button
              onClick={() => setEvolutionStep(Math.max(0, ringEvolution.length - 1))}
              className="p-1 rounded hover:bg-surface-700 text-surface-200 transition-colors"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <FraudNetwork
              nodes={currentNodes}
              edges={currentEdges}
              onNodeClick={(id) => navigate(`/transactions?search=${id}`)}
            />
          </div>
        </div>
      </div>

      {/* Evolution Timeline Slider */}
      <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Fraud Ring Evolution</h3>
            <p className="text-xs text-surface-200 mt-0.5">Visualize the historical expansion steps of the coordination ring</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-surface-700 hover:bg-surface-600 rounded-lg transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Playback</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Evolution</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Timeline Slider element */}
        <div className="space-y-4">
          <input
            type="range"
            min={0}
            max={Math.max(0, ringEvolution.length - 1)}
            value={evolutionStep}
            onChange={(e) => {
              setEvolutionStep(parseInt(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full h-1.5 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
          />

          {/* Stepper display steps */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {ringEvolution.map((evo, index) => (
              <button
                key={index}
                onClick={() => {
                  setEvolutionStep(index);
                  setIsPlaying(false);
                }}
                className={`p-3 text-left border rounded-lg transition-all ${
                  index === evolutionStep
                    ? 'border-accent-cyan bg-accent-cyan/5 text-white'
                    : 'border-surface-600/40 bg-surface-700/10 text-surface-300 hover:border-surface-500'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-[9px] font-bold text-accent-cyan">{evo.time}</span>
                  {index <= evolutionStep && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                  )}
                </div>
                <p className="text-[10px] leading-tight font-medium break-words">
                  {evo.event}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
