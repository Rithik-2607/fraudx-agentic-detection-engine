import { getRiskLevel } from '../../utils/riskColors';

export default function RiskBadge({ score, showScore = true, size = 'sm' }) {
  const risk = getRiskLevel(score);
  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses}`}
      style={{ backgroundColor: risk.bg, color: risk.color, border: `1px solid ${risk.border}` }}
    >
      {showScore && <span>{score}</span>}
      <span>{risk.label}</span>
    </span>
  );
}
