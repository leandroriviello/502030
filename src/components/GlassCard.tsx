'use client';

import type { PropsWithChildren, ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface GlassCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Contenedor reusable con estética Liquid Glass y animación suave */
export function GlassCard({
  title,
  description,
  action,
  className,
  children
}: PropsWithChildren<GlassCardProps>): JSX.Element {
  return (
    <motion.section
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-glass shadow-glass backdrop-blur-2xl transition-all duration-300 hover:border-white/20 ${className ?? ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      whileHover={{ translateY: -4 }}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60" />
      <div className="relative flex h-full flex-col gap-4 p-6 md:p-8">
        {(title || action) && (
          <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              {title && (
                <h2 className="text-lg font-semibold tracking-tight text-white md:text-xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-white/60 md:text-base">{description}</p>
              )}
            </div>
            {action}
          </header>
        )}
        <div className="relative flex-1">{children}</div>
      </div>
    </motion.section>
  );
}
