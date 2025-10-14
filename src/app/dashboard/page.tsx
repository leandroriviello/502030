'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { GlassCard } from '@/components/GlassCard';
import { PieChart502030 } from '@/components/PieChart502030';
import { ProgressCircle } from '@/components/ProgressCircle';
import { SetupWizard } from '@/components/SetupWizard';
import { useFinanceStore } from '@/store/useFinanceStore';
import { CURRENCY_OPTIONS, MOVEMENT_CATEGORY_OPTIONS } from '@/lib/constants';
import type { MovementCategory, BillingCycle } from '@/lib/types';

const CATEGORY_GROUP: Record<MovementCategory, 'necesidades' | 'ahorros' | 'deseos'> = {
  salario: 'ahorros',
  freelance: 'ahorros',
  venta: 'ahorros',
  inversion: 'ahorros',
  servicios: 'necesidades',
  suscripcion: 'deseos',
  educacion: 'necesidades',
  salud: 'necesidades',
  entretenimiento: 'deseos',
  alquiler: 'necesidades',
  alimentacion: 'necesidades',
  transporte: 'necesidades',
  deuda: 'necesidades',
  otros: 'deseos'
};

const ACCENT_COLORS = ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.35)'];

const formatCurrencyValue = (amount: number, currency: string) =>
  `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

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

export default function DashboardPage(): JSX.Element {
  const {
    isSetupCompleted,
    ready,
    getUserConfig,
    movements,
    funds,
    subscriptions
  } = useFinanceStore();
  const [showSetupWizard, setShowSetupWizard] = useState(false);

  // Mostrar wizard si no está completado y el store está listo
  useEffect(() => {
    if (ready && !isSetupCompleted) {
      setShowSetupWizard(true);
    }
  }, [ready, isSetupCompleted]);

  const handleSetupComplete = () => {
    setShowSetupWizard(false);
  };

  const userConfig = getUserConfig();
  const mainCurrency = userConfig?.currency ?? 'ARS';
  const currencyInfo = CURRENCY_OPTIONS.find(option => option.code === mainCurrency);
  const currencySymbol = currencyInfo?.symbol ?? '$';

  const currentMonthKey = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}`;
  }, []);

  const monthMovements = useMemo(() => {
    return movements.filter((movement) => {
      const date = new Date(movement.date);
      if (Number.isNaN(date.getTime())) return false;
      return `${date.getFullYear()}-${date.getMonth()}` === currentMonthKey && movement.currency === mainCurrency;
    });
  }, [movements, currentMonthKey, mainCurrency]);

  const incomesTotal = useMemo(
    () =>
      monthMovements
        .filter((movement) => movement.type === 'ingreso')
        .reduce((acc, movement) => acc + movement.amount, 0),
    [monthMovements]
  );

  const expenses = useMemo(
    () => monthMovements.filter((movement) => movement.type === 'egreso'),
    [monthMovements]
  );

  const expensesTotal = useMemo(
    () => expenses.reduce((acc, movement) => acc + movement.amount, 0),
    [expenses]
  );

  const distribution = useMemo(() => {
    if (expenses.length === 0) {
      return {
        necesidades: 1 / 3,
        ahorros: 1 / 3,
        deseos: 1 / 3
      };
    }

    const totals = expenses.reduce(
      (acc, movement) => {
        const group = CATEGORY_GROUP[movement.category] ?? 'deseos';
        acc[group] += movement.amount;
        return acc;
      },
      { necesidades: 0, ahorros: 0, deseos: 0 }
    );

    const total = totals.necesidades + totals.ahorros + totals.deseos || 1;
    return {
      necesidades: totals.necesidades / total,
      ahorros: totals.ahorros / total,
      deseos: totals.deseos / total
    };
  }, [expenses]);

  const categoryBreakdown = useMemo(() => {
    const totalsMap = new Map<MovementCategory, number>();
    expenses.forEach((movement) => {
      totalsMap.set(movement.category, (totalsMap.get(movement.category) ?? 0) + movement.amount);
    });
    return Array.from(totalsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [expenses]);

  const upcomingSubscriptions = useMemo(() => {
    const today = new Date();
    const active = subscriptions.filter((subscription) => subscription.status === 'activa');
    const withDates = active
      .map((subscription) => ({
        subscription,
        date: new Date(subscription.nextChargeDate)
      }))
      .filter((item) => !Number.isNaN(item.date.getTime()))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3);
    return withDates;
  }, [subscriptions]);

  const monthlySubscriptions = useMemo(() => {
    return subscriptions
      .filter((subscription) => subscription.status === 'activa' && subscription.currency === mainCurrency)
      .reduce((acc, subscription) => {
        const equivalent = subscription.amount * getMonthlyEquivalent(subscription.billingCycle);
        return acc + equivalent;
      }, 0);
  }, [subscriptions, mainCurrency]);

  const fundsSummary = useMemo(() => {
    return funds.slice(0, 3).map((fund, index) => ({
      id: fund.id,
      name: fund.name,
      progress: fund.targetAmount > 0 ? Math.min(fund.currentAmount / fund.targetAmount, 1) : 0,
      currentAmount: fund.currentAmount,
      targetAmount: fund.targetAmount,
      accent: ACCENT_COLORS[index % ACCENT_COLORS.length]
    }));
  }, [funds]);

  const netBalance = useMemo(
    () => incomesTotal - expensesTotal - monthlySubscriptions,
    [incomesTotal, expensesTotal, monthlySubscriptions]
  );

  return (
    <div className="flex min-h-screen liquid-glass-bg">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12 animate-fade-in">
        <Header
          title="Panel de control"
          subtitle="Visualiza tus ingresos, gastos y progreso en una única vista."
        />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] animate-slide-up">
          <GlassCard
            title="Presupuesto mensual"
            description="Distribución real de tus gastos en el mes actual."
            className="h-full glass-card-elevated"
          >
            <PieChart502030
              distribution={distribution}
              centerSubtitle="Gasto mensual"
              centerTitle={`${currencySymbol} ${expensesTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              legendLabels={{
                necesidades: 'Necesidades',
                ahorros: 'Ahorros / Inversión',
                deseos: 'Deseos'
              }}
            />
          </GlassCard>
          <GlassCard
            title="Resumen rápido"
            description={`Totales del mes en ${currencySymbol}`}
            className="flex h-full flex-col justify-center glass-card"
          >
            <ul className="grid gap-4 text-foreground-secondary">
              <li className="flex items-center justify-between glass-card px-6 py-4 text-sm rounded-apple">
                <span className="font-text">Ingresos del mes</span>
                <span className="font-semibold text-foreground font-display">
                  {formatCurrencyValue(incomesTotal, currencySymbol)}
                </span>
              </li>
              <li className="flex items-center justify-between glass-card px-6 py-4 text-sm rounded-apple">
                <span className="font-text">Gastos registrados</span>
                <span className="font-semibold text-foreground font-display">
                  {formatCurrencyValue(expensesTotal, currencySymbol)}
                </span>
              </li>
              <li className="flex items-center justify-between glass-card px-6 py-4 text-sm rounded-apple">
                <span className="font-text">Suscripciones (prorrateado)</span>
                <span className="font-semibold text-foreground font-display">
                  {formatCurrencyValue(monthlySubscriptions, currencySymbol)}
                </span>
              </li>
              <li className="flex items-center justify-between glass-card px-6 py-4 text-sm rounded-apple">
                <span className="font-text">Balance neto</span>
                <span className={`font-semibold font-display ${netBalance >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                  {formatCurrencyValue(netBalance, currencySymbol)}
                </span>
              </li>
            </ul>
          </GlassCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <GlassCard
            title="Gastos por categoría"
            description="Las 5 categorías con mayor impacto en el mes."
            className="glass-card"
          >
            {expenses.length === 0 ? (
              <p className="text-sm text-foreground-tertiary py-6 text-center">
                Aún no tienes gastos registrados este mes.
              </p>
            ) : (
              <ul className="space-y-3 text-sm">
                {categoryBreakdown.map(([category, amount]) => {
                  const label = MOVEMENT_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
                  return (
                    <li key={category} className="flex items-center justify-between rounded-apple bg-white/5 px-4 py-3">
                      <span className="text-foreground">{label}</span>
                      <span className="font-display text-foreground-secondary">
                        {formatCurrencyValue(amount, currencySymbol)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </GlassCard>

          <GlassCard
            title="Próximos cobros"
            description="Suscripciones activas y su fecha de cargo."
            className="glass-card"
          >
            {upcomingSubscriptions.length === 0 ? (
              <p className="text-sm text-foreground-tertiary py-6 text-center">
                No hay cobros próximos en tu agenda.
              </p>
            ) : (
              <ul className="space-y-3 text-sm text-foreground-secondary">
                {upcomingSubscriptions.map(({ subscription, date }) => (
                  <li key={subscription.id} className="flex items-center justify-between rounded-apple bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-foreground font-medium">{subscription.name}</p>
                      <p className="text-xs text-foreground-tertiary">
                        {subscription.provider} · {date.toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </p>
                    </div>
                    <span className="font-display text-foreground">
                      {formatCurrencyValue(subscription.amount, subscription.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>

        <GlassCard
          title="Fondos personales"
          description="Seguimiento del avance de tus metas de ahorro."
          className="glass-card animate-scale-in"
        >
          {fundsSummary.length === 0 ? (
            <p className="py-6 text-center text-sm text-foreground-tertiary">
              Crea tus primeros fondos para visualizar su progreso aquí.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {fundsSummary.map((fund, index) => (
                <div key={fund.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProgressCircle label={fund.name} progress={fund.progress} accent={fund.accent} />
                  <p className="mt-3 text-xs text-foreground-tertiary text-center">
                    {formatCurrencyValue(fund.currentAmount, currencySymbol)} /{' '}
                    {fund.targetAmount > 0
                      ? formatCurrencyValue(fund.targetAmount, currencySymbol)
                      : 'Objetivo no definido'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </main>

      {showSetupWizard && <SetupWizard onComplete={handleSetupComplete} />}
    </div>
  );
}
