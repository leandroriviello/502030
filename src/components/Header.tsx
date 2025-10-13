'use client';

import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

/** Encabezado principal de cada sección con animación sutil */
export function Header({ title, subtitle, rightSlot }: HeaderProps): JSX.Element {
  return (
    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      >
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Regla 50·20·30</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-white/60 md:text-base">{subtitle}</p>}
      </motion.div>
      {rightSlot}
    </div>
  );
}
