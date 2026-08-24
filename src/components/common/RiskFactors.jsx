import React from 'react';
import { getRiskColor } from '../../utils/riskColors';

export default function RiskFactors({ factors }) {
  if (!factors || factors.length === 0) {
    return (
      <div className="text-xs text-surface-300">
        No specific risk multipliers logged for this transaction.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {factors.map((factor, index) => {
        const factorColor = getRiskColor(factor.score * 4); // Scale up to map to colors
        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">{factor.factor}</span>
              <span className="font-mono text-surface-200 font-bold">+{factor.score}</span>
            </div>
            <div className="relative w-full h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(factor.score / 30) * 100}%`,
                  backgroundColor: factorColor,
                }}
              />
            </div>
            {factor.description && (
              <p className="text-[10px] text-surface-300">{factor.description}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
