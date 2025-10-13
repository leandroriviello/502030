'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '@/store/useFinanceStore';
import { GlassCard } from './GlassCard';
import type { CurrencyCode } from '@/lib/types';

interface SetupWizardProps {
  onComplete: () => void;
}

const CURRENCIES: { code: CurrencyCode; name: string; symbol: string }[] = [
  { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿' }
];

export function SetupWizard({ onComplete }: SetupWizardProps): JSX.Element {
  const { upsertUserConfig } = useFinanceStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    monthlySalary: '',
    payday: 1,
    currency: 'ARS' as CurrencyCode,
    customRule: {
      needs: 50,
      savings: 20,
      wants: 30
    }
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRuleChange = (field: 'needs' | 'savings' | 'wants', value: number) => {
    setFormData(prev => ({
      ...prev,
      customRule: {
        ...prev.customRule,
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      await upsertUserConfig({
        id: 'user-config-1',
        monthlySalary: Number(formData.monthlySalary),
        payday: formData.payday,
        currency: formData.currency,
        setupCompleted: true,
        customRule: {
          needs: formData.customRule.needs,
          savings: formData.customRule.savings,
          wants: formData.customRule.wants
        }
      });
      onComplete();
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  };

  const selectedCurrency = CURRENCIES.find(c => c.code === formData.currency);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-2xl p-6"
      >
        <GlassCard className="glass-card-elevated">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-display font-bold text-gradient mb-2">
                Configuración Inicial
              </h1>
              <p className="text-foreground-secondary font-text">
                Configura tu información financiera para comenzar con la regla 50/20/30
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-2 w-8 rounded-full transition-all duration-300 ${
                      step <= currentStep
                        ? 'bg-accent-blue'
                        : 'bg-glass-border'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Información básica */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    ¿Cuál es tu salario mensual?
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground-tertiary">
                      {selectedCurrency?.symbol}
                    </span>
                    <input
                      type="number"
                      value={formData.monthlySalary}
                      onChange={(e) => handleInputChange('monthlySalary', e.target.value)}
                      className="glass-input w-full pl-12 pr-4 py-3 text-lg font-display"
                      placeholder="0"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    ¿Qué día del mes cobras?
                  </label>
                  <select
                    value={formData.payday}
                    onChange={(e) => handleInputChange('payday', Number(e.target.value))}
                    className="glass-input w-full py-3 text-lg font-display"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        Día {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    Moneda principal
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value as CurrencyCode)}
                    className="glass-input w-full py-3 text-lg font-display"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 2: Regla personalizada */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    Personaliza tu regla 50/20/30
                  </h3>
                  <p className="text-foreground-secondary font-text">
                    Ajusta los porcentajes según tus necesidades (deben sumar 100%)
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    { key: 'needs' as const, label: 'Necesidades', color: 'accent-blue' },
                    { key: 'savings' as const, label: 'Ahorros', color: 'accent-green' },
                    { key: 'wants' as const, label: 'Deseos', color: 'accent-purple' }
                  ].map(({ key, label, color }) => (
                    <div key={key} className="glass-card p-4 rounded-apple">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{label}</span>
                        <span className="font-display font-bold text-foreground">
                          {formData.customRule[key]}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.customRule[key]}
                        onChange={(e) => handleRuleChange(key, Number(e.target.value))}
                        className={`w-full h-2 bg-glass-border rounded-lg appearance-none cursor-pointer slider-${color}`}
                        style={{
                          background: `linear-gradient(to right, var(--color-${color}) 0%, var(--color-${color}) ${formData.customRule[key]}%, var(--color-glass-border) ${formData.customRule[key]}%, var(--color-glass-border) 100%)`
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-sm text-foreground-tertiary">
                    Total: {formData.customRule.needs + formData.customRule.savings + formData.customRule.wants}%
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Resumen */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    Resumen de tu configuración
                  </h3>
                  <p className="text-foreground-secondary font-text">
                    Revisa la información antes de continuar
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="glass-card p-4 rounded-apple">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground-secondary">Salario mensual</span>
                      <span className="font-display font-bold text-foreground">
                        {selectedCurrency?.symbol} {Number(formData.monthlySalary).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-apple">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground-secondary">Día de pago</span>
                      <span className="font-display font-bold text-foreground">
                        Día {formData.payday}
                      </span>
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-apple">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground-secondary">Moneda</span>
                      <span className="font-display font-bold text-foreground">
                        {selectedCurrency?.name}
                      </span>
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-apple">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground-secondary">Necesidades</span>
                        <span className="font-display font-bold text-accent-blue">
                          {formData.customRule.needs}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground-secondary">Ahorros</span>
                        <span className="font-display font-bold text-accent-green">
                          {formData.customRule.savings}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground-secondary">Deseos</span>
                        <span className="font-display font-bold text-accent-purple">
                          {formData.customRule.wants}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-glass-border">
              <button
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="glass-button px-6 py-3 rounded-apple disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <button
                onClick={handleNext}
                disabled={!formData.monthlySalary || Number(formData.monthlySalary) <= 0}
                className="glass-button px-6 py-3 rounded-apple bg-accent-blue hover:bg-accent-blue/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 3 ? 'Completar' : 'Siguiente'}
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
