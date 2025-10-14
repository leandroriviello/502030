'use client';

import { useMemo, useState } from 'react';
import { Plus, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { MovementModal, type MovementFormState } from '@/components/MovementModal';
import { useFinanceStore } from '@/store/useFinanceStore';
import type { MovementEntity, MovementType } from '@/lib/types';
import { applyMovementBalance } from '@/lib/movements';

const ACTIONS: Array<{
  type: MovementType;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
}> = [
  {
    type: 'ingreso',
    label: 'Registrar ingreso',
    description: 'Sueldo, venta u otro dinero que entra',
    icon: TrendingUp,
    color: 'bg-emerald-500/20 text-emerald-100'
  },
  {
    type: 'egreso',
    label: 'Registrar gasto',
    description: 'Pago con tarjeta, débito automático, efectivo',
    icon: TrendingDown,
    color: 'bg-red-500/20 text-red-100'
  },
  {
    type: 'transferencia',
    label: 'Transferencia',
    description: 'Mover dinero entre tus cuentas',
    icon: ArrowLeftRight,
    color: 'bg-sky-500/20 text-sky-100'
  }
];

export function FloatingActionButton(): JSX.Element {
  const {
    ready,
    bankAccounts,
    cards,
    upsertMovement,
    upsertBankAccount
  } = useFinanceStore();
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<MovementType | null>(null);
  const pathname = usePathname();

  if (!ready || !pathname || pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return <></>;
  }

  const cardOptions = useMemo(
    () =>
      cards.map((card) => ({
        value: card.id,
        label: `${card.name} · ${card.issuer}${card.lastFour ? ` ****${card.lastFour}` : ''}`
      })),
    [cards]
  );

  const handleSelect = (type: MovementType) => {
    setSelectedAction(type);
    setOpen(false);
  };

  const handleCloseModal = () => {
    setSelectedAction(null);
  };

  const handleSave = async (form: MovementFormState) => {
    const movement: MovementEntity = {
      id: '',
      description: form.description.trim(),
      type: form.type,
      date: form.date,
      amount: Number(form.amount) || 0,
      currency: form.currency,
      category: form.category,
      accountId: form.accountId || undefined,
      destinationAccountId:
        form.type === 'transferencia' ? form.destinationAccountId || undefined : undefined,
      cardId: form.cardId || undefined,
      notes: form.notes.trim() || undefined
    };

    await applyMovementBalance(movement, bankAccounts, upsertBankAccount);
    await upsertMovement(movement);
    handleCloseModal();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open ? (
        <div className="glass-card-elevated rounded-3xl p-4 shadow-xl w-72 space-y-3">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.type}
                onClick={() => handleSelect(action.type)}
                className="w-full text-left flex items-start gap-3 rounded-2xl px-3 py-3 transition hover:bg-white/10"
              >
                <span className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full ${action.color}`}>
                  <Icon size={16} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{action.label}</span>
                  <span className="block text-xs text-foreground-tertiary">{action.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="glass-button h-14 w-14 rounded-full bg-foreground text-surface flex items-center justify-center shadow-2xl hover:bg-foreground-secondary transition"
        aria-label="Agregar movimiento"
      >
        <Plus size={22} />
      </button>

      {selectedAction ? (
        <MovementModal
          initialValues={{ type: selectedAction }}
          onClose={handleCloseModal}
          onSave={handleSave}
          bankAccounts={bankAccounts}
          cardsOptions={cardOptions}
        />
      ) : null}
    </div>
  );
}
