'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  PiggyBank,
  CreditCard,
  Receipt,
  BarChart3,
  Settings
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

const items: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Fondos', href: '/funds', icon: PiggyBank },
  { label: 'Tarjetas', href: '/cards', icon: CreditCard },
  { label: 'Suscripciones', href: '/subscriptions', icon: Receipt },
  { label: 'Reportes', href: '/reports', icon: BarChart3 },
  { label: 'Ajustes', href: '/settings', icon: Settings }
];

/** Barra de navegación lateral con estilo glass y microinteracciones */
export function NavBar(): JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="hidden min-h-screen w-64 flex-col gap-2 border-r border-white/10 bg-black/40 p-6 backdrop-blur-2xl lg:flex">
      <div className="mb-6 text-sm font-semibold uppercase tracking-[0.4em] text-white/40">
        502030
      </div>
      <ul className="flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link href={item.href} className="group relative block">
                <motion.span
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors duration-200 ${
                    active
                      ? 'bg-white/10 text-white shadow-glass-inner'
                      : 'text-white/60 hover:text-white'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active ? 'text-white' : 'text-white/50 group-hover:text-white'
                    }`}
                  />
                  {item.label}
                </motion.span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
