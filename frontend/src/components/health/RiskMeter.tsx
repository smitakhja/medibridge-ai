import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { RiskLevel } from '../../types';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const levelConfig = {
  low:      { label: 'Low Risk',      color: '#16A34A', bg: '#DCFCE7', border: '#86EFAC', textClass: 'text-green-700' },
  moderate: { label: 'Moderate Risk', color: '#D97706', bg: '#FEF3C7', border: '#FCD34D', textClass: 'text-amber-700' },
  high:     { label: 'High Risk',     color: '#EA580C', bg: '#FFF7ED', border: '#FDBA74', textClass: 'text-orange-700' },
  urgent:   { label: 'Emergency',     color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5', textClass: 'text-red-700' },
};

const sizeConfig = {
  sm: { r: 60, stroke: 8, viewBox: 140, fontSize: 'text-xl', labelSize: 'text-xs' },
  md: { r: 80, stroke: 10, viewBox: 180, fontSize: 'text-3xl', labelSize: 'text-sm' },
  lg: { r: 100, stroke: 12, viewBox: 220, fontSize: 'text-4xl', labelSize: 'text-base' },
};

function CountUp({ target }: { target: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (target === 0) { setCurrent(0); return; }
    let step = 0;
    const steps = 60;
    const increment = target / steps;
    const timer = setInterval(() => {
      step++;
      setCurrent(Math.min(Math.round(increment * step), target));
      if (step >= steps) clearInterval(timer);
    }, 1200 / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <>{current}</>;
}

export default function RiskMeter({ score, level, size = 'md', animated = true }: RiskMeterProps) {
  const config = levelConfig[level] || levelConfig.low;
  const sz = sizeConfig[size];
  const cx = sz.viewBox / 2;
  const cy = sz.viewBox / 2;
  const circumference = 2 * Math.PI * sz.r;
  const arcLength = circumference * 0.75; // 270° arc
  const filledLength = (score / 100) * arcLength;
  const dashArray = `${filledLength} ${circumference}`;
  const dashOffset = circumference * 0.125; // start at ~bottom-left

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg
          width={sz.viewBox}
          height={sz.viewBox}
          viewBox={`0 0 ${sz.viewBox} ${sz.viewBox}`}
          className="transform -rotate-[135deg]"
        >
          {/* Background arc */}
          <circle
            cx={cx} cy={cy} r={sz.r}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={sz.stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={-dashOffset}
          />
          {/* Filled arc */}
          <motion.circle
            cx={cx} cy={cy} r={sz.r}
            fill="none"
            stroke={config.color}
            strokeWidth={sz.stroke}
            strokeLinecap="round"
            strokeDasharray={animated ? `0 ${circumference}` : dashArray}
            strokeDashoffset={-dashOffset}
            animate={animated ? { strokeDasharray: dashArray } : undefined}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${config.color}60)` }}
          />
          {/* Tick marks at 0, 25, 50, 75, 100 */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = (tick / 100) * 270 - 135;
            const rad = (angle * Math.PI) / 180;
            const innerR = sz.r - sz.stroke / 2 - 4;
            const outerR = sz.r + sz.stroke / 2 + 2;
            return (
              <line key={tick}
                x1={cx + innerR * Math.cos(rad)} y1={cy + innerR * Math.sin(rad)}
                x2={cx + outerR * Math.cos(rad)} y2={cy + outerR * Math.sin(rad)}
                stroke="#D1D5DB" strokeWidth={2} strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${sz.fontSize} font-display font-bold`}
            style={{ color: config.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {animated ? <CountUp target={score} /> : score}
          </motion.span>
          <span className="text-gray-400 text-xs font-medium">/100</span>
        </div>
      </div>

      {/* Risk badge */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full border font-semibold"
        style={{ background: config.bg, borderColor: config.border, color: config.color }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: config.color }} />
        <span className={sz.labelSize}>{config.label}</span>
      </motion.div>
    </div>
  );
}
