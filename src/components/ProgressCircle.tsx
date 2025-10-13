'use client';

import { motion } from 'framer-motion';

interface ProgressCircleProps {
  label: string;
  progress: number;
  accent?: string;
}

/** Indicador circular animado para metas de fondos personales */
export function ProgressCircle({
  label,
  progress,
  accent = 'rgba(16,242,170,0.8)'
}: ProgressCircleProps): JSX.Element {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 150, damping: 16 }}
    >
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        className="drop-shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
      >
        <circle
          cx="90"
          cy="90"
          r="70"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="18"
          fill="transparent"
        />
        <motion.circle
          cx="90"
          cy="90"
          r="70"
          stroke={accent}
          strokeWidth="18"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </svg>
      <div className="text-center">
        <p className="text-2xl font-semibold text-foreground">{Math.round(clamped * 100)}%</p>
        <p className="text-sm text-foreground-secondary">{label}</p>
      </div>
    </motion.div>
  );
}
