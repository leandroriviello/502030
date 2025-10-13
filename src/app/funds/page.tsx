'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { FundEntity, FundType, FundPosition, InvestmentType } from '@/lib/types';

const FUND_TYPES: { type: FundType; label: string; icon: string; description: string }[] = [
  { type: 'emergencia', label: 'Fondo de Emergencia', icon: '🛡️', description: 'Para imprevistos y gastos urgentes' },
  { type: 'vacaciones', label: 'Fondo de Vacaciones', icon: '✈️', description: 'Para viajes y tiempo libre' },
  { type: 'inversiones', label: 'Fondo de Inversiones', icon: '📈', description: 'Para crecimiento a largo plazo' },
  { type: 'crypto', label: 'Fondo Crypto', icon: '₿', description: 'Para inversiones en criptomonedas' },
  { type: 'personalizado', label: 'Fondo Personalizado', icon: '🎯', description: 'Para objetivos específicos' }
];

const INVESTMENT_TYPES: { type: InvestmentType; label: string }[] = [
  { type: 'acciones', label: 'Acciones' },
  { type: 'bonos', label: 'Bonos' },
  { type: 'fondos', label: 'Fondos Mutuos' },
  { type: 'crypto', label: 'Criptomonedas' },
  { type: 'commodities', label: 'Commodities' },
  { type: 'efectivo', label: 'Efectivo' }
];

const CURRENCIES = [
  { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ' }
];

export default function FundsPage(): JSX.Element {
  const { funds, upsertFund } = useFinanceStore();
  const [showCreateFund, setShowCreateFund] = useState(false);
  const [selectedFund, setSelectedFund] = useState<FundEntity | null>(null);
  const [showAddPosition, setShowAddPosition] = useState(false);

  const handleCreateFund = async (fundData: Omit<FundEntity, 'id'>) => {
    try {
      await upsertFund({
        ...fundData,
        id: `fund-${Date.now()}`
      });
      setShowCreateFund(false);
    } catch (error) {
      console.error('Error creating fund:', error);
    }
  };

  const handleAddPosition = async (positionData: Omit<FundPosition, 'id'>) => {
    if (!selectedFund) return;

    try {
      const newPosition: FundPosition = {
        ...positionData,
        id: `position-${Date.now()}`
      };

      const updatedFund = {
        ...selectedFund,
        positions: [...selectedFund.positions, newPosition]
      };

      await upsertFund(updatedFund);
      setShowAddPosition(false);
    } catch (error) {
      console.error('Error adding position:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const currencyInfo = CURRENCIES.find(c => c.code === currency);
    const symbol = currencyInfo?.symbol || currency;
    return `${symbol} ${amount.toLocaleString()}`;
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="flex min-h-screen liquid-glass-bg">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12 animate-fade-in">
        <Header
          title="Fondos"
          subtitle="Gestiona tus fondos de ahorro e inversión con seguimiento en tiempo real."
          rightSlot={
            <button
              onClick={() => setShowCreateFund(true)}
              className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Nuevo Fondo
            </button>
          }
        />

        {funds.length === 0 ? (
          <GlassCard
            title="Sin fondos creados"
            description="Crea tu primer fondo para comenzar a gestionar tus ahorros e inversiones"
            className="glass-card-elevated"
          >
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-foreground-secondary font-text mb-6 max-w-md mx-auto">
                Los fondos te permiten organizar tus ahorros por objetivos específicos y hacer seguimiento de tus inversiones.
              </p>
              <button
                onClick={() => setShowCreateFund(true)}
                className="glass-button px-8 py-4 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 text-lg font-display font-semibold"
              >
                Crear mi primer fondo
              </button>
            </div>
          </GlassCard>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {funds.map((fund, index) => {
              const progress = calculateProgress(fund.currentAmount, fund.targetAmount);
              const fundType = FUND_TYPES.find(ft => ft.type === fund.fundType);
              
              return (
                <motion.div
                  key={fund.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard
                    className="glass-card-elevated h-full cursor-pointer hover:scale-105 transition-all duration-200"
                    onClick={() => setSelectedFund(fund)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{fundType?.icon}</span>
                        <div>
                          <h3 className="font-display font-semibold text-foreground text-lg">
                            {fund.name}
                          </h3>
                          <p className="text-foreground-secondary font-text text-sm">
                            {fundType?.label}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-foreground text-xl">
                          {formatCurrency(fund.currentAmount, fund.currency)}
                        </p>
                        <p className="text-foreground-tertiary font-text text-sm">
                          de {formatCurrency(fund.targetAmount, fund.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground-secondary font-text text-sm">Progreso</span>
                        <span className="font-display font-bold text-foreground">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-glass-border rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: '#FFFFFF'
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-foreground-secondary font-text">
                        {fund.positions.length} posiciones
                      </span>
                      <span className="text-foreground-tertiary font-text">
                        {fund.autoSync ? 'Auto-sync' : 'Manual'}
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Modal para crear fondo */}
        {showCreateFund && (
          <CreateFundModal
            onClose={() => setShowCreateFund(false)}
            onSave={handleCreateFund}
          />
        )}

        {/* Modal para agregar posición */}
        {showAddPosition && selectedFund && (
          <AddPositionModal
            fund={selectedFund}
            onClose={() => setShowAddPosition(false)}
            onSave={handleAddPosition}
          />
        )}

        {/* Modal de detalle del fondo */}
        {selectedFund && !showAddPosition && (
          <FundDetailModal
            fund={selectedFund}
            onClose={() => setSelectedFund(null)}
            onAddPosition={() => setShowAddPosition(true)}
            onUpdate={upsertFund}
          />
        )}
      </main>
    </div>
  );
}

// Componente para crear nuevo fondo
function CreateFundModal({ onClose, onSave }: { onClose: () => void; onSave: (fund: Omit<FundEntity, 'id'>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fundType: 'emergencia' as FundType,
    targetAmount: '',
    currency: 'USD' as const,
    targetDate: '',
    autoSync: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      targetAmount: Number(formData.targetAmount),
      currentAmount: 0,
      status: 'en-curso',
      positions: [],
      targetDate: formData.targetDate || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg p-6"
      >
        <GlassCard className="glass-card-elevated">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Crear Nuevo Fondo
              </h2>
              <p className="text-foreground-secondary font-text">
                Configura un nuevo fondo para gestionar tus ahorros
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Nombre del fondo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Ej: Fondo de Emergencia"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Tipo de fondo
                </label>
                <select
                  value={formData.fundType}
                  onChange={(e) => setFormData(prev => ({ ...prev, fundType: e.target.value as FundType }))}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                >
                  {FUND_TYPES.map(type => (
                    <option key={type.type} value={type.type}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Monto objetivo
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as any }))}
                    className="glass-input px-4 py-3 rounded-apple"
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                    className="glass-input flex-1 px-4 py-3 rounded-apple"
                    placeholder="0"
                    min="0"
                    step="100"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="glass-button px-6 py-3 rounded-apple flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface flex-1"
                >
                  Crear Fondo
                </button>
              </div>
            </form>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

// Componente para agregar posición
function AddPositionModal({ fund, onClose, onSave }: { fund: FundEntity; onClose: () => void; onSave: (position: Omit<FundPosition, 'id'>) => void }) {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    amount: '',
    currency: fund.currency,
    investmentType: 'acciones' as InvestmentType,
    location: '',
    apiSource: 'manual' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg p-6"
      >
        <GlassCard className="glass-card-elevated">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Agregar Posición
              </h2>
              <p className="text-foreground-secondary font-text">
                Añade una nueva inversión al fondo "{fund.name}"
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    Símbolo
                  </label>
                  <input
                    type="text"
                    value={formData.symbol}
                    onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                    className="glass-input w-full px-4 py-3 rounded-apple"
                    placeholder="AAPL, BTC, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.investmentType}
                    onChange={(e) => setFormData(prev => ({ ...prev, investmentType: e.target.value as InvestmentType }))}
                    className="glass-input w-full px-4 py-3 rounded-apple"
                  >
                    {INVESTMENT_TYPES.map(type => (
                      <option key={type.type} value={type.type}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Apple Inc., Bitcoin, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="glass-input w-full px-4 py-3 rounded-apple"
                    placeholder="0"
                    min="0"
                    step="0.000001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="glass-input w-full px-4 py-3 rounded-apple"
                    placeholder="Binance, Broker, Banco"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="glass-button px-6 py-3 rounded-apple flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface flex-1"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

// Componente para ver detalles del fondo
function FundDetailModal({ fund, onClose, onAddPosition, onUpdate }: { 
  fund: FundEntity; 
  onClose: () => void; 
  onAddPosition: () => void;
  onUpdate: (fund: FundEntity) => void;
}) {
  const formatCurrency = (amount: number, currency: string) => {
    const currencyInfo = CURRENCIES.find(c => c.code === currency);
    const symbol = currencyInfo?.symbol || currency;
    return `${symbol} ${amount.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl p-6"
      >
        <GlassCard className="glass-card-elevated">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                  {fund.name}
                </h2>
                <p className="text-foreground-secondary font-text">
                  {FUND_TYPES.find(ft => ft.type === fund.fundType)?.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="glass-button px-4 py-2 rounded-apple"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-4 rounded-apple">
                <h3 className="font-display font-semibold text-foreground mb-2">Valor Actual</h3>
                <p className="text-2xl font-display font-bold text-foreground">
                  {formatCurrency(fund.currentAmount, fund.currency)}
                </p>
              </div>
              <div className="glass-card p-4 rounded-apple">
                <h3 className="font-display font-semibold text-foreground mb-2">Objetivo</h3>
                <p className="text-2xl font-display font-bold text-foreground">
                  {formatCurrency(fund.targetAmount, fund.currency)}
                </p>
              </div>
              <div className="glass-card p-4 rounded-apple">
                <h3 className="font-display font-semibold text-foreground mb-2">Posiciones</h3>
                <p className="text-2xl font-display font-bold text-foreground">
                  {fund.positions.length}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display font-semibold text-foreground">
                Posiciones ({fund.positions.length})
              </h3>
              <button
                onClick={onAddPosition}
                className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 flex items-center gap-2"
              >
                <Plus size={16} />
                Agregar Posición
              </button>
            </div>

            {fund.positions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-foreground-secondary font-text mb-6">
                  No hay posiciones en este fondo aún
                </p>
                <button
                  onClick={onAddPosition}
                  className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200"
                >
                  Agregar primera posición
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {fund.positions.map((position, index) => (
                  <motion.div
                    key={position.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-4 rounded-apple"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-display font-semibold text-foreground">
                            {position.symbol}
                          </h4>
                          <p className="text-foreground-secondary font-text text-sm">
                            {position.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-foreground">
                          {formatCurrency(position.amount, position.currency)}
                        </p>
                        <p className="text-foreground-tertiary font-text text-sm">
                          {position.location}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}