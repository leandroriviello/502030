'use client';

import { useMemo } from 'react';
import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';
import { useFinanceStore } from '@/store/useFinanceStore';
import { CURRENCY_OPTIONS, MOVEMENT_CATEGORY_OPTIONS } from '@/lib/constants';
import type { BillingCycle, MovementCategory } from '@/lib/types';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const getMonthlyEquivalent = (cycle: BillingCycle): number => {
  switch (cycle) {
    case 'semanal':
      return 4;
    case 'trimestral':
      return 1 / 3;
    case 'anual':
      return 1 / 12;
    default:
      return 1;
  }
};

export default function ReportsPage(): JSX.Element {
  const { movements, subscriptions, getUserConfig } = useFinanceStore();
  const userConfig = getUserConfig();
  const mainCurrency = userConfig?.currency ?? 'ARS';
  const currencyInfo = CURRENCY_OPTIONS.find(option => option.code === mainCurrency);
  const currencySymbol = currencyInfo?.symbol ?? '$';

  const monthlyAggregates = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    movements.forEach((movement) => {
      if (movement.currency !== mainCurrency) return;
      const date = new Date(movement.date);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!map.has(key)) {
        map.set(key, { income: 0, expense: 0 });
      }
      const current = map.get(key)!;
      if (movement.type === 'ingreso') {
        current.income += movement.amount;
      }
      if (movement.type === 'egreso') {
        current.expense += movement.amount;
      }
    });
    return Array.from(map.entries())
      .map(([key, value]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          year,
          month,
          label: `${MONTHS[month]} ${String(year).slice(-2)}`,
          ...value
        };
      })
      .sort((a, b) => b.year - a.year || b.month - a.month)
      .slice(0, 6)
      .reverse();
  }, [movements, mainCurrency]);

  const categoryTotals = useMemo(() => {
    const totals = new Map<MovementCategory, number>();
    movements
      .filter((movement) => movement.currency === mainCurrency && movement.type === 'egreso')
      .forEach((movement) => {
        totals.set(movement.category, (totals.get(movement.category) ?? 0) + movement.amount);
      });
    return Array.from(totals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [movements, mainCurrency]);

  const subscriptionsTotal = useMemo(() => {
    return subscriptions
      .filter((subscription) => subscription.status === 'activa' && subscription.currency === mainCurrency)
      .reduce((acc, subscription) => acc + subscription.amount * getMonthlyEquivalent(subscription.billingCycle), 0);
  }, [subscriptions, mainCurrency]);

  const totalIncome = monthlyAggregates.reduce((acc, item) => acc + item.income, 0);
  const totalExpenses = monthlyAggregates.reduce((acc, item) => acc + item.expense, 0);

  return (
    <div className="flex min-h-screen liquid-glass-bg">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12 animate-fade-in">
        <Header
          title="Reportes y proyecciones"
          subtitle={`Resumen financiero en ${currencySymbol}`} 
        />

        <div className="grid gap-6 md:grid-cols-3">
          <GlassCard className="glass-card-elevated">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground-tertiary">Ingresos acumulados</p>
            <p className="mt-3 text-3xl font-display font-bold text-foreground">
              {currencySymbol} {totalIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-foreground-secondary">Últimos {monthlyAggregates.length} meses</p>
          </GlassCard>
          <GlassCard className="glass-card-elevated">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground-tertiary">Gastos acumulados</p>
            <p className="mt-3 text-3xl font-display font-bold text-red-200">
              {currencySymbol} {totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-foreground-secondary">Incluye movimientos registrados</p>
          </GlassCard>
          <GlassCard className="glass-card-elevated">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground-tertiary">Suscripciones activas</p>
            <p className="mt-3 text-3xl font-display font-bold text-foreground">
              {currencySymbol} {subscriptionsTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-foreground-secondary">Monto mensual comprometido</p>
          </GlassCard>
        </div>

        <GlassCard
          title="Evolución mensual"
          description="Comparativa de ingresos vs gastos (últimos 6 meses)."
          className="glass-card"
        >
          {monthlyAggregates.length === 0 ? (
            <p className="py-8 text-center text-sm text-foreground-tertiary">
              Aún no hay movimientos registrados para generar reportes.
            </p>
          ) : (
            <div className="space-y-4">
              {monthlyAggregates.map((item) => {
                const total = Math.max(item.income, item.expense, 1);
                const incomePercent = Math.min((item.income / total) * 100, 100);
                const expensePercent = Math.min((item.expense / total) * 100, 100);
                return (
                  <div key={`${item.year}-${item.month}`} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-foreground-tertiary">
                      <span>{item.label}</span>
                      <span>
                        <strong className="text-foreground">{currencySymbol} {item.income.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                        {' '}ingresos · {currencySymbol} {item.expense.toLocaleString(undefined, { maximumFractionDigits: 0 })} gastos
                      </span>
                    </div>
                    <div className="grid gap-2">
                      <div className="h-2 rounded-full bg-emerald-500/20">
                        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${incomePercent}%` }} />
                      </div>
                      <div className="h-2 rounded-full bg-red-500/20">
                        <div className="h-full rounded-full bg-red-400" style={{ width: `${expensePercent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard
            title="Top categorías de gasto"
            description="En qué estás destinando más presupuesto."
            className="glass-card"
          >
            {categoryTotals.length === 0 ? (
              <p className="py-6 text-center text-sm text-foreground-tertiary">
                Todavía no hay gastos categorizados.
              </p>
            ) : (
              <ul className="space-y-3 text-sm">
                {categoryTotals.map(([category, amount]) => {
                  const label = MOVEMENT_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
                  return (
                    <li key={category} className="flex items-center justify-between rounded-apple bg-white/5 px-4 py-3">
                      <span className="text-foreground">{label}</span>
                      <span className="font-display text-foreground-secondary">
                        {currencySymbol} {amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </GlassCard>

          <GlassCard
            title="Relación ingresos/gastos"
            description="Promedio mensual considerando los movimientos registrados."
            className="glass-card"
          >
            {monthlyAggregates.length === 0 ? (
              <p className="py-6 text-center text-sm text-foreground-tertiary">
                Registra movimientos para ver la tendencia.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {monthlyAggregates.map((item) => {
                  const delta = item.income - item.expense;
                  return (
                    <div key={`delta-${item.year}-${item.month}`} className="rounded-apple bg-white/5 px-4 py-3 text-sm">
                      <div className="flex items-center justify-between text-foreground">
                        <span>{item.label}</span>
                        <span className={delta >= 0 ? 'text-emerald-200' : 'text-red-200'}>
                          {delta >= 0 ? '+' : ''}{currencySymbol} {delta.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-foreground-tertiary">
                        Ingresos: {currencySymbol} {item.income.toLocaleString(undefined, { maximumFractionDigits: 0 })} ·
                        Gastos: {currencySymbol} {item.expense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
