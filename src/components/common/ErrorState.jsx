import React from 'react';
import { AlertOctagon } from 'lucide-react';

export default function ErrorState({ message = 'Unable to load investigation data.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-accent-red/20 rounded-xl bg-accent-red/5 min-h-[250px]">
      <div className="w-12 h-12 rounded-xl bg-accent-red/10 flex items-center justify-center text-accent-red mb-4">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">System Error</h3>
      <p className="text-sm text-surface-200 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-white bg-accent-red/80 hover:bg-accent-red rounded-lg transition-colors shadow-lg shadow-accent-red/15"
        >
          Try again
        </button>
      )}
    </div>
  );
}
