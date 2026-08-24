import React from 'react';
import { getRiskLevel } from '../../utils/riskColors';

export default function RiskScore({ score, size = 'md' }) {
  const risk = getRiskLevel(score);
  const percentage = Math.min(Math.max(score, 0), 100);

  // SVG parameters for radial gauge
  const radius = 40;
  const strokeWidth = size === 'lg' ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-24 h-24 text-lg',
    lg: 'w-36 h-36 text-2xl',
  };

  const textSizes = {
    sm: { score: 'text-base', label: 'text-[8px]' },
    md: { score: 'text-xl', label: 'text-[10px]' },
    lg: { score: 'text-3xl', label: 'text-xs' },
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      {/* SVG Background Circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="var(--color-surface-700)"
          strokeWidth={strokeWidth}
        />
        {/* SVG Progress Circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={risk.color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Internal Value Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`font-extrabold text-white leading-none ${textSizes[size].score}`}>
          {score}
        </span>
        <span
          className={`font-semibold tracking-wider uppercase mt-1 ${textSizes[size].label}`}
          style={{ color: risk.color }}
        >
          {risk.label}
        </span>
      </div>
    </div>
  );
}
