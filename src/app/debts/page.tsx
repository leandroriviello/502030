'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';
import { GlassSelect } from '@/components/GlassSelect';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { CurrencyCode, DebtEntity } from '@/lib/types';
import { CURRENCY_OPTIONS } from '@/lib/constants';

interface DebtFormState {
  creditor: string;
  description: string;
  totalAmount: string;
  remainingAmount: string;
  currency: CurrencyCode;
  dueDate: string;
  interestRate: string;
  accountId: string;
  status: DebtEntity['status'];
}

export default function DebtsPage(): JSX.Element {
  const { debts, bankAccounts, upsertDebt, removeDebt } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [editingDebt, setEditingDebt] = useState<DebtEntity | null>(null);

  const totals = useMemo(() => {
    return debts.reduce(
      (acc, debt) => {
        acc.original += debt.totalAmount;
        acc.remaining += debt.remainingAmount;
        return acc;
      },
      { original: 0, remaining: 0 }
    );
  }, [debts]);

  const handleCreate = () => {
    setEditingDebt(null);
    setShowModal(true);
  };

  const handleEdit = (debt: DebtEntity) => {
    setEditingDebt(debt);
    setShowModal(true);
  };

  const handleDelete = async (debt: DebtEntity) => {
    if (confirm(`¿Eliminar la deuda con ${debt.creditor}?`)) {
      await removeDebt(debt.id);
    }
  };

  const handleSave = async (form: DebtFormState) => {
    const payload: DebtEntity = {
      id: editingDebt?.id ?? '',
      creditor: form.creditor.trim(),
      description: form.description.trim() || undefined,
      totalAmount: Number(form.totalAmount) || 0,
      remainingAmount: Number(form.remainingAmount || form.totalAmount) || 0,
      currency: form.currency,
      dueDate: form.dueDate || undefined,
      interestRate: form.interestRate ? Number(form.interestRate) : undefined,
      accountId: form.accountId || undefined,
      status: form.status,
      lastPaymentDate: editingDebt?.lastPaymentDate
    };

    await upsertDebt(payload);
    setShowModal(false);
    setEditingDebt(null);
  };

  return (
    <div className="flex min-h-screen liquid-glass-bg">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12 animate-fade-in">
        <Header
          title="Deudas"
          subtitle="Lleva registro de lo que debes, a quién y cuánto falta por pagar."
          rightSlot={
            <button
              onClick={handleCreate}
              className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Nueva deuda
            </button>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="glass-card-elevated">
            <p className="text-sm text-foreground-tertiary uppercase tracking-wide">Monto original</p>
            <h3 className="mt-2 text-3xl font-display font-bold text-foreground">
              $ {totals.original.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </h3>
          </GlassCard>
          <GlassCard className="glass-card-elevated">
            <p className="text-sm text-foreground-tertiary uppercase tracking-wide">Saldo pendiente</p>
            <h3 className="mt-2 text-3xl font-display font-bold text-red-200">
              $ {totals.remaining.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </h3>
          </GlassCard>
          <GlassCard className="glass-card-elevated">
            <p className="text-sm text-foreground-tertiary uppercase tracking-wide">Progreso</p>
            <h3 className="mt-2 text-3xl font-display font-bold text-emerald-200">
              {totals.original === 0
                ? '0%'
                : `${Math.round(((totals.original - totals.remaining) / Math.max(totals.original, 1)) * 100)}%`}
            </h3>
          </GlassCard>
        </div>

        {debts.length === 0 ? (
          <GlassCard
            title="Sin deudas registradas"
            description="Carga préstamos, cuotas o compromisos para visualizar cuánto resta pagar."
            className="glass-card-elevated"
          >
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧾</div>
              <p className="text-foreground-secondary font-text mb-6 max-w-md mx-auto">
                Lleva el control de todas tus obligaciones financieras y evita vencimientos inesperados.
              </p>
              <button
                onClick={handleCreate}
                className="glass-button px-8 py-4 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 text-lg font-display font-semibold"
              >
                Registrar deuda
              </button>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {debts.map((debt, index) => {
              const currencyInfo = CURRENCY_OPTIONS.find(option => option.code === debt.currency);
              const account = debt.accountId
                ? bankAccounts.find(acc => acc.id === debt.accountId)
                : undefined;
              const progress = debt.totalAmount > 0
                ? Math.min(((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100, 100)
                : 0;

              return (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card-elevated rounded-apple px-6 py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-display font-semibold text-foreground">
                        {debt.creditor}
                      </h3>
                      <p className="text-sm text-foreground-tertiary">
                        {debt.description ?? 'Sin descripción'}
                      </p>
                      {debt.dueDate ? (
                        <p className="mt-2 text-xs text-foreground-secondary flex items-center gap-2">
                          <AlertTriangle size={14} />
                          Vence el {new Date(debt.dueDate).toLocaleDateString('es-AR')}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(debt)}
                        className="glass-button px-2 py-2 rounded-full"
                        aria-label={`Editar deuda con ${debt.creditor}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(debt)}
                        className="glass-button px-2 py-2 rounded-full hover:bg-red-500/20 hover:text-red-200"
                        aria-label={`Eliminar deuda con ${debt.creditor}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase text-foreground-tertiary">Saldo pendiente</p>
                      <p className="text-2xl font-display font-bold text-foreground">
                        {currencyInfo?.symbol ?? ''} {debt.remainingAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-foreground-tertiary">
                        Total original: {currencyInfo?.symbol ?? ''} {debt.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-xs uppercase text-foreground-tertiary">Progreso de pago</p>
                        <div className="mt-2 h-2 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full bg-emerald-300 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-foreground-secondary">{Math.round(progress)}% pagado</p>
                      </div>
                      {account ? (
                        <p className="text-xs text-foreground-secondary">
                          Pagos desde <span className="font-medium text-foreground">{account.name}</span>
                        </p>
                      ) : null}
                      {debt.interestRate ? (
                        <p className="text-xs text-foreground-secondary">Interés: {debt.interestRate}%</p>
                      ) : null}
                      {debt.status === 'pagada' ? (
                        <p className="flex items-center gap-2 text-xs text-emerald-200">
                          <CheckCircle2 size={14} /> Cancelada
                        </p>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {showModal ? (
        <DebtModal
          initialData={editingDebt}
          onClose={() => {
            setShowModal(false);
            setEditingDebt(null);
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

function DebtModal({
  initialData,
  onClose,
  onSave,
  bankAccountOptions
}: {
  initialData: DebtEntity | null;
  onClose: () => void;
  onSave: (values: DebtFormState) => Promise<void>;
  bankAccountOptions: Array<{ value: string; label: string }>;
}): JSX.Element {
  const [form, setForm] = useState<DebtFormState>({
    creditor: initialData?.creditor ?? '',
    description: initialData?.description ?? '',
    totalAmount: initialData ? String(initialData.totalAmount) : '',
    remainingAmount: initialData ? String(initialData.remainingAmount) : '',
    currency: initialData?.currency ?? 'ARS',
    dueDate: initialData?.dueDate ?? '',
    interestRate: initialData?.interestRate ? String(initialData.interestRate) : '',
    accountId: initialData?.accountId ?? '',
    status: initialData?.status ?? 'activa'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = <Key extends keyof DebtFormState>(key: Key, value: DebtFormState[Key]) => {
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl p-6">
        <GlassCard className="glass-card-elevated">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                {initialData ? 'Editar deuda' : 'Registrar deuda'}
              </h2>
              <p className="text-sm text-foreground-secondary">
                Guarda los datos principales de la deuda para planificar tus pagos.
              </p>
            </div>
            <button type="button" onClick={onClose} className="glass-button px-3 py-2 rounded-apple">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Acreedor</label>
                <input
                  value={form.creditor}
                  onChange={(event) => handleChange('creditor', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Banco, persona, servicio"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Descripción</label>
                <input
                  value={form.description}
                  onChange={(event) => handleChange('description', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Préstamo personal, crédito, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Monto original</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.totalAmount}
                  onChange={(event) => handleChange('totalAmount', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Saldo pendiente</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.remainingAmount}
                  onChange={(event) => handleChange('remainingAmount', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Moneda</label>
                <GlassSelect<CurrencyCode>
                  value={form.currency}
                  onChange={(value) => handleChange('currency', value)}
                  options={CURRENCY_OPTIONS.map(option => ({
                    value: option.code,
                    label: `${option.symbol} ${option.code}`,
                    description: option.name
                  }))}
                  placeholder="Selecciona"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Fecha de vencimiento</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => handleChange('dueDate', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Tasa de interés (%)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.interestRate}
                  onChange={(event) => handleChange('interestRate', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Cuenta desde donde pagas</label>
                <GlassSelect<string>
                  value={form.accountId}
                  onChange={(value) => handleChange('accountId', value)}
                  options={[{ value: '', label: 'Selecciona una cuenta' }, ...bankAccountOptions]}
                  placeholder="Cuenta bancaria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Estado</label>
                <GlassSelect<DebtEntity['status']>
                  value={form.status}
                  onChange={(value) => handleChange('status', value)}
                  options={[
                    { value: 'activa', label: 'Activa' },
                    { value: 'pagada', label: 'Pagada' },
                    { value: 'vencida', label: 'Vencida' }
                  ]}
                  placeholder="Estado"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="glass-button flex-1 rounded-apple px-4 py-3">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="glass-button flex-1 rounded-apple bg-foreground px-4 py-3 text-surface font-display font-semibold hover:bg-foreground-secondary disabled:cursor-not-allowed disabled:bg-white/10"
              >
                {loading ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear deuda'}
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
