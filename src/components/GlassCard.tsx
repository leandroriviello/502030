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
      className={`group relative overflow-hidden rounded-apple-lg border border-glass-border backdrop-blur-xl transition-all duration-300 hover:border-accent-blue/30 hover:shadow-glass-lg ${className ?? 'glass-card'}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      whileHover={{ translateY: -2, scale: 1.01 }}
      style={{
        background: 'linear-gradient(135deg, rgba(28,28,30,0.8) 0%, rgba(28,28,30,0.6) 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex h-full flex-col gap-6 p-6 md:p-8">
        {(title || action) && (
          <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              {title && (
                <h2 className="text-xl font-display font-semibold tracking-tight text-foreground md:text-2xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-base text-foreground-secondary font-text md:text-lg">
                  {description}
                </p>
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
