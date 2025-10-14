'use client';

import { motion } from 'framer-motion';

interface PieChartProps {
  distribution: {
    necesidades: number;
    ahorros: number;
    deseos: number;
  };
  centerTitle?: string;
  centerSubtitle?: string;
  legendLabels?: {
    necesidades?: string;
    ahorros?: string;
    deseos?: string;
  };
}

/** Pie chart minimalista utilizando conic-gradient para la regla 50/20/30 */
export function PieChart502030({ distribution, centerTitle, centerSubtitle, legendLabels }: PieChartProps): JSX.Element {
  const necesidades = Math.round(distribution.necesidades * 100);
  const ahorros = Math.round(distribution.ahorros * 100);
  const deseos = Math.round(distribution.deseos * 100);

  const conicGradient = `conic-gradient(
    rgba(255,255,255,0.8) 0deg ${3.6 * necesidades}deg,
    rgba(255,255,255,0.6) ${3.6 * necesidades}deg ${3.6 * (necesidades + ahorros)}deg,
    rgba(255,255,255,0.4) ${3.6 * (necesidades + ahorros)}deg 360deg
  )`;

  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
    >
      <div className="relative flex h-48 w-48 items-center justify-center">
        <div
          className="h-full w-full rounded-full shadow-glass-inner"
          style={{ backgroundImage: conicGradient }}
        />
        <div className="absolute inset-10 rounded-full bg-black/70 backdrop-blur-xl" />
        <div className="absolute inset-12 flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-foreground-tertiary">
            {centerSubtitle ?? 'Meta'}
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {centerTitle ?? '50 · 20 · 30'}
          </p>
        </div>
      </div>
      <ul className="flex gap-6 text-sm text-foreground-secondary">
        <li className="flex items-center gap-2">
          <span className="h-2 w-8 rounded-full bg-foreground" />
          {legendLabels?.necesidades ?? 'Necesidades'} {necesidades}%
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-8 rounded-full bg-foreground-secondary" />
          {legendLabels?.ahorros ?? 'Ahorros'} {ahorros}%
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-8 rounded-full bg-foreground-tertiary" />
          {legendLabels?.deseos ?? 'Deseos'} {deseos}%
        </li>
      </ul>
    </motion.div>
  );
}
