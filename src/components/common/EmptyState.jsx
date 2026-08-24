import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function EmptyState({ title, description, icon: Icon = AlertCircle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-surface-600/40 rounded-xl bg-surface-800/30 min-h-[250px]">
      <div className="w-12 h-12 rounded-xl bg-surface-700/50 flex items-center justify-center text-surface-300 mb-4">
        <Icon className="w-6 h-6 text-surface-300" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-surface-200 max-w-sm mb-6">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
