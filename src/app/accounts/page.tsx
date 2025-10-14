'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';
import { GlassSelect } from '@/components/GlassSelect';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { AccountType, BankAccountEntity, CurrencyCode } from '@/lib/types';
import { ACCOUNT_TYPE_OPTIONS, CURRENCY_OPTIONS } from '@/lib/constants';

type AccountFormState = {
  name: string;
  institution: string;
  alias: string;
  accountType: AccountType;
  currency: CurrencyCode;
  balance: string;
  autopayDay: string;
  notes: string;
  color?: string;
};

export default function AccountsPage(): JSX.Element {
  const { bankAccounts, upsertBankAccount, removeBankAccount } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccountEntity | null>(null);

  const totalBalance = useMemo(() => {
    return bankAccounts.reduce<Record<string, number>>((acc, account) => {
      acc[account.currency] = (acc[account.currency] ?? 0) + account.balance;
      return acc;
    }, {});
  }, [bankAccounts]);

  const handleCreate = () => {
    setEditingAccount(null);
    setShowModal(true);
  };

  const handleEdit = (account: BankAccountEntity) => {
    setEditingAccount(account);
    setShowModal(true);
  };

  const handleDelete = async (account: BankAccountEntity) => {
    if (confirm(`¿Eliminar la cuenta "${account.name}"?`)) {
      await removeBankAccount(account.id);
    }
  };

  const handleSave = async (data: AccountFormState) => {
    const payload: BankAccountEntity = {
      id: editingAccount?.id ?? '',
      name: data.name.trim(),
      institution: data.institution.trim(),
      alias: data.alias.trim() || undefined,
      accountType: data.accountType,
      currency: data.currency,
      balance: Number(data.balance) || 0,
      autopayDay: data.autopayDay ? Number(data.autopayDay) : undefined,
      notes: data.notes.trim() || undefined,
      color: editingAccount?.color
    };

    await upsertBankAccount(payload);
    setShowModal(false);
    setEditingAccount(null);
  };

  return (
    <div className="flex min-h-screen liquid-glass-bg">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12 animate-fade-in">
        <Header
          title="Cuentas bancarias"
          subtitle="Administra todas las cuentas donde se debitan tus gastos y recibís ingresos."
          rightSlot={
            <button
              onClick={handleCreate}
              className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Nueva cuenta
            </button>
          }
        />

        {bankAccounts.length === 0 ? (
          <GlassCard
            title="Sin cuentas registradas"
            description="Agrega tu primera cuenta bancaria para centralizar tus movimientos."
            className="glass-card-elevated"
          >
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🏦</div>
              <p className="text-foreground-secondary font-text mb-6 max-w-md mx-auto">
                Vincula tus cuentas corrientes, cajas de ahorro o billeteras digitales para seguir tus saldos y pagos automáticos.
              </p>
              <button
                onClick={handleCreate}
                className="glass-button px-8 py-4 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 text-lg font-display font-semibold"
              >
                Agregar cuenta
              </button>
            </div>
          </GlassCard>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(totalBalance).map(([currency, amount]) => {
                const info = CURRENCY_OPTIONS.find(option => option.code === currency);
                return (
                  <GlassCard key={currency} className="glass-card-elevated">
                    <p className="text-sm text-foreground-tertiary uppercase tracking-wide">Saldo total</p>
                    <h3 className="mt-2 text-3xl font-display font-bold text-foreground">
                      {info?.symbol ?? ''} {amount.toLocaleString()}
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      {info?.name ?? currency}
                    </p>
                  </GlassCard>
                );
              })}
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {bankAccounts.map((account, index) => {
                const currencyInfo = CURRENCY_OPTIONS.find(option => option.code === account.currency);
                const accountType = ACCOUNT_TYPE_OPTIONS.find(option => option.value === account.accountType);
                return (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <GlassCard className="glass-card-elevated h-full flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🏦</span>
                          <div>
                            <h3 className="text-lg font-display font-semibold text-foreground">
                              {account.name}
                            </h3>
                            <p className="text-sm text-foreground-tertiary">
                              {account.institution}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(account)}
                            className="glass-button px-2 py-2 rounded-full"
                            aria-label={`Editar ${account.name}`}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(account)}
                            className="glass-button px-2 py-2 rounded-full hover:bg-red-500/20 hover:text-red-200"
                            aria-label={`Eliminar ${account.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground-tertiary">Tipo</span>
                          <span className="font-medium text-foreground">
                            {accountType?.label ?? account.accountType}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground-tertiary">Saldo</span>
                          <span className="font-display text-xl text-foreground">
                            {currencyInfo?.symbol ?? ''} {account.balance.toLocaleString()}
                          </span>
                        </div>
                        {account.autopayDay ? (
                          <div className="flex items-center justify-between">
                            <span className="text-foreground-tertiary">Débito automático</span>
                            <span className="font-medium text-foreground">
                              Día {account.autopayDay}
                            </span>
                          </div>
                        ) : null}
                        {account.alias ? (
                          <div className="flex items-center justify-between">
                            <span className="text-foreground-tertiary">Alias</span>
                            <span className="font-mono text-sm text-foreground">{account.alias}</span>
                          </div>
                        ) : null}
                        {account.notes ? (
                          <p className="text-xs text-foreground-tertiary italic">
                            {account.notes}
                          </p>
                        ) : null}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {showModal ? (
        <AccountModal
          initialData={editingAccount}
          onClose={() => {
            setShowModal(false);
            setEditingAccount(null);
          }}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}

function AccountModal({
  initialData,
  onClose,
  onSave
}: {
  initialData: BankAccountEntity | null;
  onClose: () => void;
  onSave: (values: AccountFormState) => Promise<void>;
}): JSX.Element {
  const [form, setForm] = useState<AccountFormState>({
    name: initialData?.name ?? '',
    institution: initialData?.institution ?? '',
    alias: initialData?.alias ?? '',
    accountType: initialData?.accountType ?? 'caja-ahorro',
    currency: initialData?.currency ?? 'ARS',
    balance: initialData ? String(initialData.balance) : '',
    autopayDay: initialData?.autopayDay ? String(initialData.autopayDay) : '',
    notes: initialData?.notes ?? '',
    color: initialData?.color
  });
  const [loading, setLoading] = useState(false);

  const handleChange = <Key extends keyof AccountFormState>(key: Key, value: AccountFormState[Key]) => {
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
                {initialData ? 'Editar cuenta' : 'Nueva cuenta bancaria'}
              </h2>
              <p className="text-sm text-foreground-secondary">
                Define los datos principales para organizar tus pagos automáticos.
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
                  Nombre de la cuenta
                </label>
                <input
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Cuenta sueldo, Billetera, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Banco o proveedor
                </label>
                <input
                  value={form.institution}
                  onChange={(event) => handleChange('institution', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Banco Nación, Mercado Pago, etc."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Alias / CBU
                </label>
                <input
                  value={form.alias}
                  onChange={(event) => handleChange('alias', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple font-mono"
                  placeholder="ALIAS.CUENTA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Tipo de cuenta
                </label>
                <GlassSelect<AccountType>
                  value={form.accountType}
                  onChange={(value) => handleChange('accountType', value)}
                  options={ACCOUNT_TYPE_OPTIONS.map(option => ({
                    value: option.value,
                    label: option.label
                  }))}
                  placeholder="Selecciona el tipo"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Saldo actual
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.balance}
                  onChange={(event) => handleChange('balance', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Día de débito automático
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={form.autopayDay}
                  onChange={(event) => handleChange('autopayDay', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">
                  Notas
                </label>
                <input
                  value={form.notes}
                  onChange={(event) => handleChange('notes', event.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-apple"
                  placeholder="Información adicional"
                />
              </div>
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
                {loading ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
