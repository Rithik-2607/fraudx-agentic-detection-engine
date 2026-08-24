import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bot, Bell, ShieldCheck, Save } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import { useSimulation } from '../context/SimulationContext';

export default function Settings() {
  const { showToast } = useSimulation();

  // Settings State
  const [riskThreshold, setRiskThreshold] = useState(75);
  const [autoInvestigation, setAutoInvestigation] = useState(true);
  const [realtimeMonitoring, setRealtimeMonitoring] = useState(true);

  const [agentLogging, setAgentLogging] = useState(true);
  const [autonomousMode, setAutonomousMode] = useState(false);
  const [humanApproval, setHumanApproval] = useState(true);

  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [investigationAlerts, setInvestigationAlerts] = useState(true);
  const [countermeasureAlerts, setCountermeasureAlerts] = useState(true);

  const handleSave = () => {
    showToast('Settings saved successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="System Settings"
        subtitle="Manage and configure autonomous threat detection metrics & constraints"
      >
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-accent-blue hover:bg-accent-blue/90 rounded-lg transition-all shadow-lg shadow-accent-blue/15"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </PageHeader>

      <div className="space-y-6">
        {/* Detection settings card */}
        <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-700/50">
            <Shield className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Detection Settings</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Risk Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Risk Flag Threshold</span>
                <span className="font-mono text-accent-cyan font-bold">{riskThreshold}/100</span>
              </div>
              <input
                type="range"
                min={10}
                max={95}
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                className="w-full h-1.5 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
              />
              <p className="text-[10px] text-surface-300">Minimum risk score computed by risk agent to automatically flag accounts.</p>
            </div>

            {/* Auto Investigation toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-white">Auto Investigation</p>
                <p className="text-[10px] text-surface-300">Automatically spin up investigators on flagged anomalies.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoInvestigation}
                  onChange={(e) => setAutoInvestigation(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-200 after:border-surface-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue"></div>
              </label>
            </div>

            {/* Realtime Monitoring toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-white">Real-time Stream Inspection</p>
                <p className="text-[10px] text-surface-300">Continuously capture transaction buffers in real-time monitor feeds.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={realtimeMonitoring}
                  onChange={(e) => setRealtimeMonitoring(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-200 after:border-surface-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Agent settings card */}
        <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-700/50">
            <Bot className="w-5 h-5 text-accent-yellow" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Autonomous Agent Constraints</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Logging toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Agent Coordination Logging</p>
                <p className="text-[10px] text-surface-300">Store verbose execution traces from running agent workflow loops.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agentLogging}
                  onChange={(e) => setAgentLogging(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-200 after:border-surface-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue"></div>
              </label>
            </div>

            {/* Autonomous countermeasure execution */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-white">Fully Autonomous Execution Mode</p>
                <p className="text-[10px] text-surface-300">Allow countermeasures to execute automatically without requiring human confirmation.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autonomousMode}
                  onChange={(e) => setAutonomousMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-200 after:border-surface-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue"></div>
              </label>
            </div>

            {/* Human in the loop toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-white">Human-In-The-Loop Approval</p>
                <p className="text-[10px] text-surface-300">Require supervisor approvals for restrictions of high value flows.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={humanApproval}
                  onChange={(e) => setHumanApproval(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-200 after:border-surface-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification settings card */}
        <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-700/50">
            <Bell className="w-5 h-5 text-accent-red" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Alert & Signal Notifications</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Critical Alert toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Critical Alert Dispatch</p>
                <p className="text-[10px] text-surface-300">Send notifications for detection of critical fraud rings.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={criticalAlerts}
                  onChange={(e) => setCriticalAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-200 after:border-surface-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue"></div>
              </label>
            </div>

            {/* Investigation Alert toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-white">Investigation Status Updates</p>
                <p className="text-[10px] text-surface-300">Notify when case transitions between agent phases.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={investigationAlerts}
                  onChange={(e) => setInvestigationAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-200 after:border-surface-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue"></div>
              </label>
            </div>

            {/* Countermeasure alert toggle */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-white">Countermeasure Action Requests</p>
                <p className="text-[10px] text-surface-300">Notify when countermeasure execution pending authorization reviews.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={countermeasureAlerts}
                  onChange={(e) => setCountermeasureAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-200 after:border-surface-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
