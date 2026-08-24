import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CheckCircle, Info, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function Toast() {
  const { toast } = useSimulation();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-accent-green" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-accent-yellow" />;
      case 'error':
        return <AlertOctagon className="w-5 h-5 text-accent-red" />;
      default:
        return <Info className="w-5 h-5 text-accent-blue" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border border-surface-600/50 bg-surface-800 shadow-2xl animate-fade-in">
      <div className="flex-shrink-0">{getIcon()}</div>
      <p className="text-sm font-semibold text-white">{toast.message}</p>
    </div>
  );
}
