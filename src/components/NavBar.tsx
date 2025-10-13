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
  Settings,
  LogOut
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

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
  const { data: session, status } = useSession();
  const user = session?.user;

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
      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-base font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() ??
              user?.username?.charAt(0)?.toUpperCase() ??
              'U'}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{user?.name ?? user?.username ?? 'Usuario'}</span>
            <span className="text-xs text-white/50">
              {user?.email ?? (status === 'authenticated' ? user?.username : 'Iniciando...')}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
