'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { GlassSelect } from '@/components/GlassSelect';
import type {
  BankAccountEntity,
  MovementCategory,
  MovementType,
  CurrencyCode
} from '@/lib/types';
import {
  CURRENCY_OPTIONS,
  MOVEMENT_CATEGORY_OPTIONS,
  MOVEMENT_TYPE_OPTIONS
} from '@/lib/constants';

export interface MovementFormState {
  description: string;
  type: MovementType;
  date: string;
  amount: string;
  currency: CurrencyCode;
  category: MovementCategory;
  accountId: string;
  destinationAccountId: string;
  cardId: string;
  notes: string;
}

interface MovementModalProps {
  initialValues?: Partial<MovementFormState>;
  onClose: () => void;
  onSave: (values: MovementFormState) => Promise<void>;
  bankAccounts: BankAccountEntity[];
  cardsOptions: Array<{ value: string; label: string }>;
}

export function MovementModal({
  initialValues,
  onClose,
  onSave,
  bankAccounts,
  cardsOptions
}: MovementModalProps): JSX.Element {
  const [form, setForm] = useState<MovementFormState>({
    description: initialValues?.description ?? '',
    type: initialValues?.type ?? 'egreso',
    date: initialValues?.date ?? new Date().toISOString().slice(0, 10),
    amount: initialValues?.amount ?? '',
    currency: initialValues?.currency ?? 'ARS',
    category: initialValues?.category ?? 'otros',
    accountId: initialValues?.accountId ?? '',
    destinationAccountId: initialValues?.destinationAccountId ?? '',
    cardId: initialValues?.cardId ?? '',
    notes: initialValues?.notes ?? ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = <Key extends keyof MovementFormState>(key: Key, value: MovementFormState[Key]) => {
    setForm((prev) => ({
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

  const availableAccounts = bankAccounts.map((account) => ({
    value: account.id,
    label: `${account.name} · ${account.institution}`
  }));

  const requiresDestination = form.type === 'transferencia';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl p-6">
        <GlassCard className="glass-card-elevated">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Registrar movimiento</h2>
              <p className="text-sm text-foreground-secondary">
                Define el tipo, cuenta afectada y monto para mantener tus saldos actualizados.
              </p>
            </div>
            <button type="button" onClick={onClose} className="glass-button px-3 py-2 rounded-apple">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Tipo de movimiento
                </label>
                <GlassSelect<MovementType>
                  value={form.type}
                  onChange={(value) => handleChange('type', value)}
                  options={MOVEMENT_TYPE_OPTIONS.map((option) => ({
                    value: option.value,
                    label: option.label
                  }))}
                  placeholder="Selecciona tipo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Fecha</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => handleChange('date', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Descripción</label>
                <input
                  value={form.description}
                  onChange={(event) => handleChange('description', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Pago de factura, sueldo, compra, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Categoría</label>
                <GlassSelect<MovementCategory>
                  value={form.category}
                  onChange={(value) => handleChange('category', value)}
                  options={MOVEMENT_CATEGORY_OPTIONS.map((option) => ({
                    value: option.value,
                    label: option.label
                  }))}
                  placeholder="Selecciona categoría"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Monto</label>
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
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Moneda</label>
                <GlassSelect<CurrencyCode>
                  value={form.currency}
                  onChange={(value) => handleChange('currency', value)}
                  options={CURRENCY_OPTIONS.map((option) => ({
                    value: option.code,
                    label: `${option.symbol} ${option.code}`,
                    description: option.name
                  }))}
                  placeholder="Moneda"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Tarjeta (opcional)</label>
                <GlassSelect<string>
                  value={form.cardId}
                  onChange={(value) => handleChange('cardId', value)}
                  options={[{ value: '', label: 'Sin tarjeta' }, ...cardsOptions]}
                  placeholder="Tarjeta asociada"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Cuenta origen
                </label>
                <GlassSelect<string>
                  value={form.accountId}
                  onChange={(value) => handleChange('accountId', value)}
                  options={[{ value: '', label: 'Selecciona una cuenta' }, ...availableAccounts]}
                  placeholder="Cuenta principal"
                />
              </div>
              {requiresDestination ? (
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">
                    Cuenta destino
                  </label>
                  <GlassSelect<string>
                    value={form.destinationAccountId}
                    onChange={(value) => handleChange('destinationAccountId', value)}
                    options={[{ value: '', label: 'Selecciona una cuenta' }, ...availableAccounts]}
                    placeholder="Cuenta destino"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-2">Notas</label>
                  <input
                    value={form.notes}
                    onChange={(event) => handleChange('notes', event.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-apple"
                    placeholder="Opcional"
                  />
                </div>
              )}
            </div>

            {requiresDestination ? (
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Notas</label>
                <input
                  value={form.notes}
                  onChange={(event) => handleChange('notes', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Opcional"
                />
              </div>
            ) : null}

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="glass-button flex-1 rounded-apple px-4 py-3">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="glass-button flex-1 rounded-apple bg-foreground px-4 py-3 text-surface font-display font-semibold hover:bg-foreground-secondary disabled:cursor-not-allowed disabled:bg-white/10"
              >
                {loading ? 'Guardando...' : 'Registrar movimiento'}
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
