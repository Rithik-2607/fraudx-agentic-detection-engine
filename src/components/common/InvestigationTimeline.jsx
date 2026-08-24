import React from 'react';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { getStatusColor } from '../../utils/riskColors';

export default function InvestigationTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="relative border-l border-surface-600 ml-3 pl-6 space-y-6 py-1">
      {timeline.map((step, index) => {
        const isCompleted = step.status === 'completed';
        const isInProgress = step.status === 'in-progress';

        return (
          <div key={index} className="relative">
            {/* Step Icon Indicator */}
            <div className="absolute -left-[35px] top-0.5 bg-surface-900 rounded-full p-0.5 z-10">
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-accent-green" />
              ) : isInProgress ? (
                <PlayCircle className="w-5 h-5 text-accent-cyan animate-pulse" />
              ) : (
                <Circle className="w-5 h-5 text-surface-400 fill-surface-900" />
              )}
            </div>

            {/* Content info */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className={`text-xs font-bold ${isInProgress ? 'text-accent-cyan' : isCompleted ? 'text-white' : 'text-surface-300'}`}>
                  {step.step}
                </h4>
                {step.time && (
                  <span className="text-[10px] font-mono text-surface-300 bg-surface-700/50 px-1.5 py-0.5 rounded">
                    {step.time}
                  </span>
                )}
              </div>
              {step.description && (
                <p className="text-xs text-surface-200 mt-1 leading-relaxed">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
