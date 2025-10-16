'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard, Pencil, Trash2 } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';
import { GlassSelect } from '@/components/GlassSelect';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { CardEntity, CurrencyCode } from '@/lib/types';
import { CURRENCY_OPTIONS } from '@/lib/constants';

type CardFormState = {
  name: string;
  issuer: string;
  lastFour: string;
  creditLimit: string;
  currency: CurrencyCode;
  closingDay: string;
  paymentDay: string;
  bankAccountId: string;
  notes: string;
};

export default function CardsPage(): JSX.Element {
  const { cards, bankAccounts, upsertCard, removeCard } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState<CardEntity | null>(null);

  // Simplified - no movements data available yet
  const spendByCard = useMemo(() => {
    return {} as Record<string, number>; // Will be populated when movements are implemented
  }, []);

  const handleCreate = () => {
    setEditingCard(null);
    setShowModal(true);
  };

  const handleEdit = (card: CardEntity) => {
    setEditingCard(card);
    setShowModal(true);
  };

  const handleDelete = async (card: CardEntity) => {
    if (confirm(`¿Eliminar la tarjeta "${card.name}"?`)) {
      await removeCard(card.id);
    }
  };

  const handleSave = async (data: CardFormState) => {
    const payload: CardEntity = {
      id: editingCard?.id ?? '',
      name: data.name.trim(),
      issuer: data.issuer.trim(),
      lastFour: data.lastFour.trim() || undefined,
      creditLimit: Number(data.creditLimit) || 0,
      currency: data.currency,
      closingDay: Number(data.closingDay) || 1,
      paymentDay: Number(data.paymentDay) || 1,
      bankAccountId: data.bankAccountId || undefined,
      notes: data.notes.trim() || undefined
    };
    await upsertCard(payload);
    setShowModal(false);
    setEditingCard(null);
  };

  return (
    <div className="flex min-h-screen liquid-glass-bg">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12 animate-fade-in">
        <Header
          title="Tarjetas de crédito"
          subtitle="Administra límites, fechas de corte y las cuentas desde donde se pagan."
          rightSlot={
            <button
              onClick={handleCreate}
              className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Nueva tarjeta
            </button>
          }
        />

        {cards.length === 0 ? (
          <GlassCard
            title="Sin tarjetas registradas"
            description="Carga tus tarjetas para seguir consumos, límites y fechas de pago."
            className="glass-card-elevated"
          >
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💳</div>
              <p className="text-foreground-secondary font-text mb-6 max-w-md mx-auto">
                Registra tus tarjetas y podrás ver cuánto consumiste, cuándo vence y con qué cuenta se paga.
              </p>
              <button
                onClick={handleCreate}
                className="glass-button px-8 py-4 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 text-lg font-display font-semibold"
              >
                Registrar tarjeta
              </button>
            </div>
          </GlassCard>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {cards.map((card, index) => {
              const currencyInfo = CURRENCY_OPTIONS.find(option => option.code === card.currency);
              const totalSpend = spendByCard[card.id] ?? 0;
              const utilisation = card.creditLimit > 0 ? Math.min((totalSpend / card.creditLimit) * 100, 100) : 0;
              const bankAccount = card.bankAccountId
                ? bankAccounts.find(account => account.id === card.bankAccountId)
                : undefined;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <GlassCard className="glass-card-elevated h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-9 w-9 text-white/70" />
                        <div>
                          <h3 className="text-lg font-display font-semibold text-foreground">
                            {card.name}
                          </h3>
                          <p className="text-sm text-foreground-tertiary">
                            {card.issuer} {card.lastFour ? `· ****${card.lastFour}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(card)}
                          className="glass-button px-2 py-2 rounded-full"
                          aria-label={`Editar ${card.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(card)}
                          className="glass-button px-2 py-2 rounded-full hover:bg-red-500/20 hover:text-red-200"
                          aria-label={`Eliminar ${card.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm text-foreground-tertiary">
                          <span>Consumido</span>
                          <span>{Math.round(utilisation)}%</span>
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full bg-foreground transition-all duration-300"
                            style={{ width: `${utilisation}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-apple bg-white/5 px-4 py-3">
                          <p className="text-foreground-tertiary">Disponible</p>
                          <p className="mt-1 text-lg font-display text-foreground">
                            {currencyInfo?.symbol ?? ''} {(card.creditLimit - totalSpend).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="rounded-apple bg-white/5 px-4 py-3">
                          <p className="text-foreground-tertiary">Límite</p>
                          <p className="mt-1 text-lg font-display text-foreground">
                            {currencyInfo?.symbol ?? ''} {card.creditLimit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-foreground-tertiary">Cierre</p>
                          <p className="font-medium text-foreground">Día {card.closingDay}</p>
                        </div>
                        <div>
                          <p className="text-foreground-tertiary">Vencimiento</p>
                          <p className="font-medium text-foreground">Día {card.paymentDay}</p>
                        </div>
                      </div>
                      {bankAccount ? (
                        <div className="text-sm text-foreground-secondary">
                          <p>Se paga con <span className="font-medium text-foreground">{bankAccount.name}</span></p>
                          <p className="text-xs text-foreground-tertiary">{bankAccount.institution}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-amber-200">
                          Asigna una cuenta bancaria para automatizar el seguimiento del pago.
                        </p>
                      )}
                      {card.notes ? (
                        <p className="text-xs text-foreground-tertiary italic">{card.notes}</p>
                      ) : null}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {showModal ? (
        <CardModal
          initialData={editingCard}
          onClose={() => {
            setShowModal(false);
            setEditingCard(null);
          }}
          onSave={handleSave}
          bankAccountOptions={bankAccounts.map(account => ({
            value: account.id,
            label: `${account.name} · ${account.institution}`
          }))}
        />
      ) : null}
    </div>
  );
}

function CardModal({
  initialData,
  onClose,
  onSave,
  bankAccountOptions
}: {
  initialData: CardEntity | null;
  onClose: () => void;
  onSave: (data: CardFormState) => Promise<void>;
  bankAccountOptions: Array<{ value: string; label: string }>;
}): JSX.Element {
  const [form, setForm] = useState<CardFormState>({
    name: initialData?.name ?? '',
    issuer: initialData?.issuer ?? '',
    lastFour: initialData?.lastFour ?? '',
    creditLimit: initialData ? String(initialData.creditLimit) : '',
    currency: initialData?.currency ?? 'ARS',
    closingDay: initialData ? String(initialData.closingDay) : '1',
    paymentDay: initialData ? String(initialData.paymentDay) : '1',
    bankAccountId: initialData?.bankAccountId ?? '',
    notes: initialData?.notes ?? ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = <Key extends keyof CardFormState>(key: Key, value: CardFormState[Key]) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg p-6"
      >
        <GlassCard className="glass-card-elevated">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                {initialData ? 'Editar tarjeta' : 'Nueva tarjeta de crédito'}
              </h2>
              <p className="text-sm text-foreground-secondary">
                Registra la tarjeta para controlar límites, gastos y fechas de pago.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="glass-button px-3 py-2 rounded-apple"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Nombre interno
                </label>
                <input
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Visa banco, Master platinum, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Emisora
                </label>
                <input
                  value={form.issuer}
                  onChange={(event) => handleChange('issuer', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Visa, MasterCard, Amex..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Últimos 4 dígitos
                </label>
                <input
                  value={form.lastFour}
                  onChange={(event) => handleChange('lastFour', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="1234"
                  maxLength={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Moneda
                </label>
                <GlassSelect<CurrencyCode>
                  value={form.currency}
                  onChange={(value) => handleChange('currency', value)}
                  options={CURRENCY_OPTIONS.map(option => ({
                    value: option.code,
                    label: `${option.symbol} ${option.code}`,
                    description: option.name
                  }))}
                  placeholder="Selecciona moneda"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Límite de crédito
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.creditLimit}
                  onChange={(event) => handleChange('creditLimit', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Cuenta donde se paga
                </label>
                <GlassSelect<string>
                  value={form.bankAccountId}
                  onChange={(value) => handleChange('bankAccountId', value)}
                  options={[
                    { value: '', label: 'Selecciona una cuenta' },
                    ...bankAccountOptions
                  ]}
                  placeholder="Selecciona una cuenta"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Día de cierre
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={form.closingDay}
                  onChange={(event) => handleChange('closingDay', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Día de vencimiento
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={form.paymentDay}
                  onChange={(event) => handleChange('paymentDay', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground-secondary mb-2">
                Notas
              </label>
              <textarea
                value={form.notes}
                onChange={(event) => handleChange('notes', event.target.value)}
                className="glass-input w-full rounded-apple px-4 py-3 min-h-[80px]"
                placeholder="Observaciones adicionales (cierre alternativo, beneficios, etc.)"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="glass-button flex-1 rounded-apple px-4 py-3"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="glass-button flex-1 rounded-apple bg-foreground px-4 py-3 text-surface font-display font-semibold hover:bg-foreground-secondary disabled:cursor-not-allowed disabled:bg-white/10"
              >
                {loading ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear tarjeta'}
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
