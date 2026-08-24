import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = '#3b82f6' }) {
  const trendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const TrendIcon = trendIcon;

  return (
    <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-5 hover:border-surface-500/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          {Icon && <Icon className="w-5 h-5" style={{ color }} />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-accent-green' : trend === 'down' ? 'text-accent-red' : 'text-surface-300'}`}>
            <TrendIcon className="w-3 h-3" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-surface-300">{subtitle || title}</p>
    </div>
  );
}
