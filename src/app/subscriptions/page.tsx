'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, PlayCircle, Pencil, Trash2 } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';
import { GlassSelect } from '@/components/GlassSelect';
import { useFinanceStore } from '@/store/useFinanceStore';
import type {
  BillingCycle,
  CurrencyCode,
  SubscriptionCategory,
  SubscriptionEntity,
  SubscriptionStatus
} from '@/lib/types';
import {
  BILLING_CYCLE_OPTIONS,
  CURRENCY_OPTIONS,
  POPULAR_SUBSCRIPTION_PROVIDERS,
  SUBSCRIPTION_CATEGORY_OPTIONS
} from '@/lib/constants';

type SubscriptionFormState = {
  name: string;
  provider: string;
  amount: string;
  currency: CurrencyCode;
  category: SubscriptionCategory;
  billingCycle: BillingCycle;
  billingDay: string;
  nextChargeDate: string;
  cardId: string;
  bankAccountId: string;
  status: SubscriptionStatus;
  notes: string;
};

export default function SubscriptionsPage(): JSX.Element {
  const { subscriptions, cards, bankAccounts, upsertSubscription, removeSubscription } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionEntity | null>(null);

  const monthlySpend = useMemo(() => {
    return subscriptions
      .filter((subscription) => subscription.status === 'activa')
      .reduce<Record<string, number>>((acc, subscription) => {
        const multiplier = getMonthlyEquivalent(subscription.billingCycle);
        const amount = subscription.amount * multiplier;
        acc[subscription.currency] = (acc[subscription.currency] ?? 0) + amount;
        return acc;
      }, {});
  }, [subscriptions]);

  const handleCreate = () => {
    setEditingSubscription(null);
    setShowModal(true);
  };

  const handleEdit = (subscription: SubscriptionEntity) => {
    setEditingSubscription(subscription);
    setShowModal(true);
  };

  const handleDelete = async (subscription: SubscriptionEntity) => {
    if (confirm(`¿Eliminar la suscripción "${subscription.name}"?`)) {
      await removeSubscription(subscription.id);
    }
  };

  const handleSave = async (data: SubscriptionFormState) => {
    const payload: SubscriptionEntity = {
      id: editingSubscription?.id ?? '',
      name: data.name.trim(),
      provider: data.provider.trim(),
      amount: Number(data.amount) || 0,
      currency: data.currency,
      category: data.category,
      billingCycle: data.billingCycle,
      billingDay: Number(data.billingDay) || 1,
      nextChargeDate: data.nextChargeDate,
      status: data.status,
      cardId: data.cardId || undefined,
      bankAccountId: data.bankAccountId || undefined,
      notes: data.notes.trim() || undefined
    };

    await upsertSubscription(payload);
    setShowModal(false);
    setEditingSubscription(null);
  };

  return (
    <div className="flex min-h-screen liquid-glass-bg">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12 animate-fade-in">
        <Header
          title="Suscripciones"
          subtitle="Organiza tus servicios recurrentes, tarjetas de pago y fechas de cobro."
          rightSlot={
            <button
              onClick={handleCreate}
              className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Nueva suscripción
            </button>
          }
        />

        {subscriptions.length === 0 ? (
          <GlassCard
            title="Sin suscripciones registradas"
            description="Agrega tus servicios recurrentes para conocer su impacto mensual."
            className="glass-card-elevated"
          >
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📺</div>
              <p className="text-foreground-secondary font-text mb-6 max-w-md mx-auto">
                Lleva un control de tus suscripciones de Streaming, IA, videojuegos y más. Asocia cada una a la tarjeta correcta para evitar sorpresas.
              </p>
              <button
                onClick={handleCreate}
                className="glass-button px-8 py-4 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 text-lg font-display font-semibold"
              >
                Registrar suscripción
              </button>
            </div>
          </GlassCard>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(monthlySpend).map(([currency, amount]) => {
                const info = CURRENCY_OPTIONS.find(option => option.code === currency);
                return (
                  <GlassCard key={currency} className="glass-card-elevated">
                    <p className="text-sm text-foreground-tertiary uppercase tracking-wide">
                      Gasto mensual estimado
                    </p>
                    <h3 className="mt-2 text-3xl font-display font-bold text-foreground">
                      {info?.symbol ?? ''} {amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </h3>
                    <p className="text-sm text-foreground-secondary">{info?.name ?? currency}</p>
                  </GlassCard>
                );
              })}
            </div>

            <div className="space-y-4">
              {subscriptions.map((subscription, index) => {
                const currencyInfo = CURRENCY_OPTIONS.find(option => option.code === subscription.currency);
                const categoryInfo = SUBSCRIPTION_CATEGORY_OPTIONS.find(option => option.value === subscription.category);
                const card = subscription.cardId ? cards.find(c => c.id === subscription.cardId) : undefined;
                const account = subscription.bankAccountId
                  ? bankAccounts.find(acc => acc.id === subscription.bankAccountId)
                  : card?.bankAccountId
                  ? bankAccounts.find(acc => acc.id === card.bankAccountId)
                  : undefined;

                return (
                  <motion.div
                    key={subscription.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card-elevated rounded-apple px-6 py-5 flex flex-col gap-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">
                          {categoryInfo?.icon ?? '🧾'}
                        </span>
                        <div>
                          <h3 className="text-lg font-display font-semibold text-foreground">
                            {subscription.name}
                          </h3>
                          <p className="text-sm text-foreground-tertiary">
                            {subscription.provider} · {categoryInfo?.label ?? subscription.category}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-4 text-xs text-foreground-secondary">
                            <span>{formatBillingCycle(subscription.billingCycle, subscription.billingDay)}</span>
                            <span>Próximo cobro: {formatDate(subscription.nextChargeDate)}</span>
                            <span>Estado: <StatusBadge status={subscription.status} /></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(subscription)}
                          className="glass-button px-2 py-2 rounded-full"
                          aria-label={`Editar ${subscription.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(subscription)}
                          className="glass-button px-2 py-2 rounded-full hover:bg-red-500/20 hover:text-red-200"
                          aria-label={`Eliminar ${subscription.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="text-sm text-foreground">
                        <p className="text-2xl font-display font-bold">
                          {currencyInfo?.symbol ?? ''} {subscription.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-foreground-tertiary">
                          {subscription.billingCycle === 'mensual'
                            ? 'Cobro mensual'
                            : `Equivalente mensual: ${(subscription.amount * getMonthlyEquivalent(subscription.billingCycle)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                        </p>
                      </div>
                      <div className="flex flex-col text-sm text-foreground-secondary">
                        {card ? (
                          <span>
                            Tarjeta: <strong className="text-foreground">{card.name}</strong>
                          </span>
                        ) : (
                          <span className="text-amber-200">
                            Asigna una tarjeta para registrar el pago automáticamente.
                          </span>
                        )}
                        {account ? (
                          <span>
                            Cuenta de débito: <strong className="text-foreground">{account.name}</strong>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {subscription.notes ? (
                      <p className="text-xs text-foreground-tertiary italic">
                        {subscription.notes}
                      </p>
                    ) : null}
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {showModal ? (
        <SubscriptionModal
          initialData={editingSubscription}
          onClose={() => {
            setShowModal(false);
            setEditingSubscription(null);
          }}
          onSave={handleSave}
          cardsOptions={cards.map(card => ({
            value: card.id,
            label: `${card.name} · ${card.issuer}${card.lastFour ? ` ****${card.lastFour}` : ''}`
          }))}
          bankAccountOptions={bankAccounts.map(account => ({
            value: account.id,
            label: `${account.name} · ${account.institution}`
          }))}
        />
      ) : null}
    </div>
  );
}

function SubscriptionModal({
  initialData,
  onClose,
  onSave,
  cardsOptions,
  bankAccountOptions
}: {
  initialData: SubscriptionEntity | null;
  onClose: () => void;
  onSave: (data: SubscriptionFormState) => Promise<void>;
  cardsOptions: Array<{ value: string; label: string }>;
  bankAccountOptions: Array<{ value: string; label: string }>;
}): JSX.Element {
  const [form, setForm] = useState<SubscriptionFormState>({
    name: initialData?.name ?? '',
    provider: initialData?.provider ?? '',
    amount: initialData ? String(initialData.amount) : '',
    currency: initialData?.currency ?? 'ARS',
    category: initialData?.category ?? 'streaming',
    billingCycle: initialData?.billingCycle ?? 'mensual',
    billingDay: initialData ? String(initialData.billingDay) : '1',
    nextChargeDate: initialData?.nextChargeDate ?? '',
    cardId: initialData?.cardId ?? '',
    bankAccountId: initialData?.bankAccountId ?? '',
    status: initialData?.status ?? 'activa',
    notes: initialData?.notes ?? ''
  });
  const [loading, setLoading] = useState(false);

  const providerSuggestions = useMemo(() => {
    return POPULAR_SUBSCRIPTION_PROVIDERS; // Simplified - return all providers
  }, []);

  const handleChange = <Key extends keyof SubscriptionFormState>(key: Key, value: SubscriptionFormState[Key]) => {
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
        className="w-full max-w-2xl p-6"
      >
        <GlassCard className="glass-card-elevated">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                {initialData ? 'Editar suscripción' : 'Registrar suscripción'}
              </h2>
              <p className="text-sm text-foreground-secondary">
                Define importe, frecuencia y método de pago para evitar sorpresas en tu presupuesto.
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
                  Nombre
                </label>
                <input
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Suscripción personal"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Proveedor
                </label>
                <input
                  list="subscription-provider"
                  value={form.provider}
                  onChange={(event) => handleChange('provider', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Netflix, Spotify, Midjourney..."
                  required
                />
                <datalist id="subscription-provider">
                  {providerSuggestions.map((provider) => (
                    <option key={provider} value={provider} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Categoría
                </label>
                <GlassSelect<SubscriptionCategory>
                  value={form.category}
                  onChange={(value) => handleChange('category', value)}
                  options={SUBSCRIPTION_CATEGORY_OPTIONS.map(option => ({
                    value: option.value,
                    label: `${option.icon} ${option.label}`
                  }))}
                  placeholder="Selecciona categoría"
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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Importe
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => handleChange('amount', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Frecuencia
                </label>
                <GlassSelect<BillingCycle>
                  value={form.billingCycle}
                  onChange={(value) => handleChange('billingCycle', value)}
                  options={BILLING_CYCLE_OPTIONS.map(option => ({
                    value: option.value,
                    label: option.label
                  }))}
                  placeholder="Selecciona frecuencia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Día de cobro
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={form.billingDay}
                  onChange={(event) => handleChange('billingDay', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Próximo cobro
                </label>
                <input
                  type="date"
                  value={form.nextChargeDate}
                  onChange={(event) => handleChange('nextChargeDate', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Estado
                </label>
                <GlassSelect<SubscriptionStatus>
                  value={form.status}
                  onChange={(value) => handleChange('status', value)}
                  options={[
                    { value: 'activa', label: 'Activa' },
                    { value: 'pausada', label: 'Pausada' },
                    { value: 'cancelada', label: 'Cancelada' }
                  ]}
                  placeholder="Estado actual"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Tarjeta de pago
                </label>
                <GlassSelect<string>
                  value={form.cardId}
                  onChange={(value) => handleChange('cardId', value)}
                  options={[{ value: '', label: 'Selecciona una tarjeta' }, ...cardsOptions]}
                  placeholder="Tarjeta de crédito"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Cuenta asociada
                </label>
                <GlassSelect<string>
                  value={form.bankAccountId}
                  onChange={(value) => handleChange('bankAccountId', value)}
                  options={[{ value: '', label: 'Selecciona una cuenta' }, ...bankAccountOptions]}
                  placeholder="Cuenta bancaria"
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
                placeholder="Claves, recordatorios o beneficios"
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
                {loading ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear suscripción'}
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function getMonthlyEquivalent(cycle: BillingCycle): number {
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
}

function formatBillingCycle(cycle: BillingCycle, day: number): string {
  const cycleLabel = BILLING_CYCLE_OPTIONS.find(option => option.value === cycle)?.label ?? cycle;
  return `${cycleLabel} · día ${day}`;
}

function formatDate(value: string): string {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
}

function StatusBadge({ status }: { status: SubscriptionStatus }): JSX.Element {
  const color =
    status === 'activa'
      ? 'bg-emerald-500/20 text-emerald-200'
      : status === 'pausada'
      ? 'bg-amber-500/20 text-amber-200'
      : 'bg-red-500/20 text-red-200';

  const label =
    status === 'activa' ? 'Activa' : status === 'pausada' ? 'Pausada' : 'Cancelada';

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
