'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { GlassCard } from '@/components/GlassCard';
import { PieChart502030 } from '@/components/PieChart502030';
import { ProgressCircle } from '@/components/ProgressCircle';
import { SetupWizard } from '@/components/SetupWizard';
import { useFinanceStore } from '@/store/useFinanceStore';

const sampleDistribution = {
  necesidades: 0.5,
  ahorros: 0.2,
  deseos: 0.3
};

const sampleFunds = [
  { label: 'Fondo de emergencia', progress: 0.62, accent: 'rgba(255,255,255,0.8)' },
  { label: 'Vacaciones', progress: 0.35, accent: 'rgba(255,255,255,0.6)' },
  { label: 'Inversiones', progress: 0.48, accent: 'rgba(255,255,255,0.4)' }
];

export default function DashboardPage(): JSX.Element {
  const { isSetupCompleted, ready, getUserConfig } = useFinanceStore();
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

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      'ARS': '$',
      'USD': '$',
      'EUR': '€',
      'BRL': 'R$',
      'CLP': '$',
      'COP': '$',
      'BTC': '₿',
      'ETH': 'Ξ'
    };
    const symbol = symbols[currency] || currency;
    return `${symbol} ${amount.toLocaleString()}`;
  };

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
            title="Balance 50/20/30"
            description="Distribución actual de tus gastos frente a la regla."
            className="h-full glass-card-elevated"
          >
            <PieChart502030 distribution={sampleDistribution} />
          </GlassCard>
          
          <GlassCard
            title="Resumen rápido"
            description="Totales mensuales estimados"
            className="flex h-full flex-col justify-center glass-card"
          >
            <ul className="grid gap-4 text-foreground-secondary">
              <li className="flex items-center justify-between glass-card px-6 py-4 text-sm rounded-apple">
                <span className="font-text">Ingresos del mes</span>
                <span className="font-semibold text-foreground font-display">
                  {userConfig ? formatCurrency(userConfig.monthlySalary, userConfig.currency) : '$ 2.450.000'}
                </span>
              </li>
              <li className="flex items-center justify-between glass-card px-6 py-4 text-sm rounded-apple">
                <span className="font-text">Gastos totales</span>
                <span className="font-semibold text-foreground font-display">$ 1.540.000</span>
              </li>
              <li className="flex items-center justify-between glass-card px-6 py-4 text-sm rounded-apple">
                <span className="font-text">Ahorro proyectado</span>
                <span className="font-semibold text-foreground-secondary font-display">
                  {userConfig ? formatCurrency(Math.round(userConfig.monthlySalary * (userConfig.customRule?.savings || 20) / 100), userConfig.currency) : '$ 380.000'}
                </span>
              </li>
            </ul>
          </GlassCard>
        </div>

        <GlassCard
          title="Fondos personales"
          description="Progreso estimado en cada meta. Datos reales se poblarán desde IndexedDB."
          className="glass-card animate-scale-in"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {sampleFunds.map((fund, index) => (
              <div key={fund.label} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProgressCircle
                  label={fund.label}
                  progress={fund.progress}
                  accent={fund.accent}
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </main>

      {showSetupWizard && <SetupWizard onComplete={handleSetupComplete} />}
    </div>
  );
}