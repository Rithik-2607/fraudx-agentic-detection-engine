import React from 'react';
import { AlertCircle, ShieldAlert, Award, Layers } from 'lucide-react';

export default function EvidenceCard({ category, items }) {
  if (!items || items.length === 0) return null;

  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case 'transaction':
        return <Layers className="w-4 h-4 text-accent-blue" />;
      case 'network':
        return <Award className="w-4 h-4 text-accent-red" />;
      default:
        return <AlertCircle className="w-4 h-4 text-accent-yellow" />;
    }
  };

  return (
    <div className="bg-surface-800 border border-surface-600/40 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        {getCategoryIcon()}
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          {category} Evidence
        </h3>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-surface-700/20 border border-surface-600/20 rounded-lg hover:border-surface-500/20 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-[9px] font-mono bg-surface-700 px-1 py-0.5 rounded text-surface-200">
                {item.id}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  item.severity === 'Critical'
                    ? 'bg-accent-red/10 text-accent-red border border-accent-red/20'
                    : item.severity === 'High'
                    ? 'bg-accent-orange/10 text-accent-orange border border-accent-orange/20'
                    : 'bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20'
                }`}
              >
                {item.severity}
              </span>
            </div>
            <p className="text-xs text-white leading-relaxed">{item.description}</p>
            <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-surface-600/30 text-[10px] text-surface-300">
              <ShieldAlert className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Confidence Agent Assessment: <strong className="text-white">{item.confidence}%</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
