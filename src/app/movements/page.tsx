'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Plus, Trash2 } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { Header } from '@/components/Header';
import { GlassCard } from '@/components/GlassCard';
import { MovementModal } from '@/components/MovementModal';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { MovementEntity, MovementType, BankAccountEntity } from '@/lib/types';
import {
  CURRENCY_OPTIONS,
  MOVEMENT_CATEGORY_OPTIONS,
  MOVEMENT_TYPE_OPTIONS
} from '@/lib/constants';
import { applyMovementBalance, revertMovementBalance } from '@/lib/movements';

export default function MovementsPage(): JSX.Element {
  const {
    movements,
    bankAccounts,
    cards,
    upsertMovement,
    removeMovement,
    upsertBankAccount
  } = useFinanceStore();
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<MovementType | 'todos'>('todos');

  const sortedMovements = useMemo(() => {
    let list = [...movements];
    if (filterType !== 'todos') {
      list = list.filter((movement) => movement.type === filterType);
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [movements, filterType]);

  const totals = useMemo(() => {
    return movements.reduce(
      (acc, movement) => {
        if (movement.type === 'ingreso') {
          acc.income += movement.amount;
        } else if (movement.type === 'egreso') {
          acc.expense += movement.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [movements]);

  const handleDelete = async (movement: MovementEntity) => {
    if (!confirm('¿Eliminar este movimiento?')) return;
    await revertMovementBalance(movement, bankAccounts, upsertBankAccount);
    await removeMovement(movement.id);
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen liquid-glass-bg">
      <NavBar />
      <main className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-12 animate-fade-in">
        <Header
          title="Movimientos"
          subtitle="Registra ingresos, gastos y transferencias para mantener tus saldos al día."
          rightSlot={
            <button
              onClick={handleCreate}
              className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Nuevo movimiento
            </button>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="glass-card-elevated">
            <p className="text-sm text-foreground-tertiary uppercase tracking-wide">Ingresos</p>
            <h3 className="mt-2 text-3xl font-display font-bold text-emerald-200">
              $ {totals.income.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </h3>
          </GlassCard>
          <GlassCard className="glass-card-elevated">
            <p className="text-sm text-foreground-tertiary uppercase tracking-wide">Gastos</p>
            <h3 className="mt-2 text-3xl font-display font-bold text-red-200">
              $ {totals.expense.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </h3>
          </GlassCard>
          <GlassCard className="glass-card-elevated">
            <p className="text-sm text-foreground-tertiary uppercase tracking-wide">Balance</p>
            <h3 className="mt-2 text-3xl font-display font-bold text-foreground">
              $ {(totals.income - totals.expense).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </h3>
          </GlassCard>
        </div>

        <div className="glass-card-elevated rounded-apple p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-foreground-tertiary">
              <Filter size={14} />
              Filtrar por tipo
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilterType('todos')}
                className={`px-3 py-1 rounded-full text-sm ${filterType === 'todos' ? 'bg-foreground text-surface' : 'bg-white/5 text-foreground-secondary hover:text-foreground'}`}
              >
                Todos
              </button>
              {MOVEMENT_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilterType(option.value)}
                  className={`px-3 py-1 rounded-full text-sm ${filterType === option.value ? 'bg-foreground text-surface' : 'bg-white/5 text-foreground-secondary hover:text-foreground'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {sortedMovements.length === 0 ? (
            <p className="text-sm text-foreground-tertiary py-6 text-center">
              Aún no registraste movimientos.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-foreground-tertiary uppercase text-xs">
                  <tr>
                    <th className="py-3 pr-4 font-medium">Fecha</th>
                    <th className="py-3 pr-4 font-medium">Descripción</th>
                    <th className="py-3 pr-4 font-medium">Tipo</th>
                    <th className="py-3 pr-4 font-medium">Categoría</th>
                    <th className="py-3 pr-4 font-medium">Cuenta/Tarjeta</th>
                    <th className="py-3 pr-4 font-medium text-right">Monto</th>
                    <th className="py-3 pl-4 text-right" />
                  </tr>
                </thead>
                <tbody>
                  {sortedMovements.map((movement) => {
                    const currencyInfo = CURRENCY_OPTIONS.find(option => option.code === movement.currency);
                    const account = movement.accountId
                      ? bankAccounts.find(acc => acc.id === movement.accountId)
                      : undefined;
                    const destination = movement.destinationAccountId
                      ? bankAccounts.find(acc => acc.id === movement.destinationAccountId)
                      : undefined;
                    const card = movement.cardId
                      ? cards.find(cardItem => cardItem.id === movement.cardId)
                      : undefined;
                    const amountSign = movement.type === 'egreso' ? '-' : movement.type === 'ingreso' ? '+' : '↔';

                    return (
                      <tr key={movement.id} className="border-t border-white/5">
                        <td className="py-3 pr-4 whitespace-nowrap text-foreground-secondary">
                          {new Date(movement.date).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3 pr-4 text-foreground">{movement.description}</td>
                        <td className="py-3 pr-4">
                          <MovementTypeBadge type={movement.type} />
                        </td>
                        <td className="py-3 pr-4 text-foreground-secondary">
                          {MOVEMENT_CATEGORY_OPTIONS.find(option => option.value === movement.category)?.label ?? movement.category}
                        </td>
                        <td className="py-3 pr-4 text-foreground-secondary">
                          {movement.type === 'transferencia' && destination
                            ? `${account?.name ?? 'Cuenta'} → ${destination.name}`
                            : card
                            ? `${card.name}`
                            : account?.name ?? '-'}
                        </td>
                        <td className="py-3 pr-4 text-right font-display text-foreground">
                          {amountSign} {currencyInfo?.symbol ?? ''}{' '}
                          {movement.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <button
                            type="button"
                            onClick={() => void handleDelete(movement)}
                            className="glass-button px-2 py-2 rounded-full hover:bg-red-500/20 hover:text-red-200"
                            aria-label="Eliminar movimiento"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showModal ? (
        <MovementModal
          onClose={() => setShowModal(false)}
          onSave={async (form) => {
            const movement: MovementEntity = {
              id: '',
              description: form.description.trim(),
              type: form.type,
              date: form.date,
              amount: Number(form.amount) || 0,
              currency: form.currency,
              category: form.category,
              accountId: form.accountId || undefined,
              destinationAccountId: form.type === 'transferencia' ? form.destinationAccountId || undefined : undefined,
              cardId: form.cardId || undefined,
              notes: form.notes.trim() || undefined
            };

            await applyMovementBalance(movement, bankAccounts, upsertBankAccount);
            await upsertMovement(movement);
            setShowModal(false);
          }}
          bankAccounts={bankAccounts}
          cardsOptions={cards.map(card => ({
            value: card.id,
            label: `${card.name} · ${card.issuer}${card.lastFour ? ` ****${card.lastFour}` : ''}`
          }))}
        />
      ) : null}
    </div>
  );
}

function MovementTypeBadge({ type }: { type: MovementType }): JSX.Element {
  const config =
    type === 'ingreso'
      ? { label: 'Ingreso', className: 'bg-emerald-500/20 text-emerald-200' }
      : type === 'egreso'
      ? { label: 'Gasto', className: 'bg-red-500/20 text-red-200' }
      : { label: 'Transferencia', className: 'bg-sky-500/20 text-sky-200' };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
