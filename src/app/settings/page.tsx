'use client';

import { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';
import { SetupWizard } from '@/components/SetupWizard';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { CurrencyCode } from '@/lib/types';

const CURRENCIES: { code: CurrencyCode; name: string; symbol: string }[] = [
  { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿' }
];

export default function SettingsPage(): JSX.Element {
  const { getUserConfig, upsertUserConfig } = useFinanceStore();
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  
  const userConfig = getUserConfig();
  const selectedCurrency = CURRENCIES.find(c => c.code === userConfig?.currency);

  const handleEditConfig = () => {
    setShowSetupWizard(true);
  };

  const handleSetupComplete = () => {
    setShowSetupWizard(false);
  };

  return (
    <div className="flex min-h-screen liquid-glass-bg">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12 animate-fade-in">
        <Header
          title="Ajustes"
          subtitle="Configura tu información financiera y personaliza la regla 50/20/30."
        />
        
        {userConfig ? (
          <div className="grid gap-6">
            <GlassCard
              title="Configuración Actual"
              description="Tu información financiera personalizada"
              className="glass-card-elevated"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass-card p-4 rounded-apple">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-secondary font-text">Salario mensual</span>
                    <span className="font-display font-bold text-foreground">
                      {selectedCurrency?.symbol} {userConfig.monthlySalary.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-apple">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-secondary font-text">Día de pago</span>
                    <span className="font-display font-bold text-foreground">
                      Día {userConfig.payday}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-apple">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-secondary font-text">Moneda</span>
                    <span className="font-display font-bold text-foreground">
                      {selectedCurrency?.name}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-apple">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground-secondary font-text">Regla personalizada</span>
                    <span className="font-display font-bold text-foreground">
                      {userConfig.customRule?.needs || 50}/{userConfig.customRule?.savings || 20}/{userConfig.customRule?.wants || 30}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-glass-border">
                <button
                  onClick={handleEditConfig}
                  className="glass-button px-6 py-3 rounded-apple bg-accent-blue hover:bg-accent-blue/80 transition-all duration-200"
                >
                  Editar Configuración
                </button>
              </div>
            </GlassCard>

            <GlassCard
              title="Distribución de Gastos"
              description="Basado en tu regla personalizada"
              className="glass-card"
            >
              <div className="grid gap-4">
                {[
                  { key: 'needs', label: 'Necesidades', color: 'accent-blue', percentage: userConfig.customRule?.needs || 50 },
                  { key: 'savings', label: 'Ahorros', color: 'accent-green', percentage: userConfig.customRule?.savings || 20 },
                  { key: 'wants', label: 'Deseos', color: 'accent-purple', percentage: userConfig.customRule?.wants || 30 }
                ].map(({ key, label, color, percentage }) => (
                  <div key={key} className="glass-card p-4 rounded-apple">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-text font-medium text-foreground">{label}</span>
                      <span className="font-display font-bold text-foreground">
                        {percentage}% • {selectedCurrency?.symbol} {Math.round(userConfig.monthlySalary * percentage / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-glass-border rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-${color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        ) : (
          <GlassCard title="Configuración Pendiente" description="Necesitas completar la configuración inicial">
            <div className="text-center py-8">
              <p className="text-foreground-secondary font-text mb-6">
                Para usar la aplicación necesitas configurar tu información financiera básica.
              </p>
              <button
                onClick={handleEditConfig}
                className="glass-button px-8 py-4 rounded-apple bg-accent-blue hover:bg-accent-blue/80 transition-all duration-200 text-lg font-display font-semibold"
              >
                Comenzar Configuración
              </button>
            </div>
          </GlassCard>
        )}
      </main>

      {showSetupWizard && <SetupWizard onComplete={handleSetupComplete} />}
    </div>
  );
}
