import React, { useState, useEffect } from 'react';
import { Bot, ArrowRight, CircleDot, Play, Cpu, Zap, Activity, Network, Shield, AlertTriangle, FileText } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import AgentCard from '../components/common/AgentCard';
import { useSimulation } from '../context/SimulationContext';
import { getAgents, getWorkflowSteps } from '../services/api';

const iconMap = {
  Activity,
  Network,
  AlertTriangle,
  Shield,
  FileText,
};

export default function Agents() {
  const { simulationRunning, simulationStep } = useSimulation();
  const [agentList, setAgentList] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const ags = await getAgents();
        const stp = await getWorkflowSteps();
        setAgentList(ags);
        setSteps(stp);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggleAgentStatus = (id) => {
    setAgentList(prev =>
      prev.map(agent =>
        agent.id === id
          ? { ...agent, status: agent.status === 'Active' ? 'Standby' : 'Active' }
          : agent
      )
    );
  };

  // Determine active workflow step from simulation activity
  const activeStepId = simulationRunning
    ? simulationStep?.toLowerCase().includes('transaction')
      ? 1
      : simulationStep?.toLowerCase().includes('ring')
      ? 2
      : simulationStep?.toLowerCase().includes('risk')
      ? 3
      : simulationStep?.toLowerCase().includes('countermeasure')
      ? 4
      : simulationStep?.toLowerCase().includes('report') || simulationStep?.toLowerCase().includes('forensic')
      ? 5
      : 1
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Agent Control Center"
        subtitle="Manage and observe autonomous cyber-investigation agents"
      />

      {/* Visual Workflow Pipeline Banner */}
      <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Agent Coordination Workflow</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${simulationRunning ? 'bg-accent-cyan animate-pulse' : 'bg-surface-400'}`} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-white">
              {simulationRunning ? 'RUNNING ORCHESTRATION' : 'IDLE STATE'}
            </span>
          </div>
        </div>

        {/* Pipeline Stepper layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative pt-2">
          {steps.map((step, idx) => {
            const isActive = activeStepId === step.id;
            const isCompleted = activeStepId > step.id;
            const StepIcon = iconMap[step.id === 1 ? 'Activity' : step.id === 2 ? 'Network' : step.id === 3 ? 'AlertTriangle' : step.id === 4 ? 'Shield' : 'FileText'];

            return (
              <div key={step.id} className="relative flex flex-col md:flex-row items-center gap-3">
                <div
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    isActive
                      ? 'border-accent-cyan bg-accent-cyan/5 text-white shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                      : isCompleted
                      ? 'border-accent-green/45 bg-accent-green/5 text-surface-200'
                      : 'border-surface-600/40 bg-surface-700/10 text-surface-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? 'bg-accent-cyan text-surface-900'
                        : isCompleted
                        ? 'bg-accent-green/20 text-accent-green'
                        : 'bg-surface-700 text-surface-300'
                    }`}
                  >
                    {StepIcon && <StepIcon className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-tight truncate">{step.agent}</p>
                    <p className="text-[9px] text-surface-300 truncate mt-0.5">{step.description}</p>
                  </div>
                </div>

                {/* Arrow connecting to next card */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-[10px] top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className={`w-4 h-4 ${isCompleted ? 'text-accent-green' : isActive ? 'text-accent-cyan' : 'text-surface-600'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Agents Control Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentList.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onToggleStatus={handleToggleAgentStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
