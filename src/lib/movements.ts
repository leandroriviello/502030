import type { BankAccountEntity, MovementEntity } from './types';

export async function applyMovementBalance(
  movement: MovementEntity,
  bankAccounts: BankAccountEntity[],
  upsertBankAccount: (payload: BankAccountEntity) => Promise<void>
): Promise<void> {
  if (movement.type === 'transferencia') {
    if (movement.accountId) {
      const origin = bankAccounts.find((account) => account.id === movement.accountId);
      if (origin) {
        await upsertBankAccount({ ...origin, balance: origin.balance - movement.amount });
      }
    }
    if (movement.destinationAccountId) {
      const target = bankAccounts.find((account) => account.id === movement.destinationAccountId);
      if (target) {
        await upsertBankAccount({ ...target, balance: target.balance + movement.amount });
      }
    }
    return;
  }

  if (!movement.accountId) return;
  const account = bankAccounts.find((item) => item.id === movement.accountId);
  if (!account) return;

  const delta = movement.type === 'ingreso' ? movement.amount : -movement.amount;
  await upsertBankAccount({ ...account, balance: account.balance + delta });
}

export async function revertMovementBalance(
  movement: MovementEntity,
  bankAccounts: BankAccountEntity[],
  upsertBankAccount: (payload: BankAccountEntity) => Promise<void>
): Promise<void> {
  if (movement.type === 'transferencia') {
    if (movement.accountId) {
      const origin = bankAccounts.find((account) => account.id === movement.accountId);
      if (origin) {
        await upsertBankAccount({ ...origin, balance: origin.balance + movement.amount });
      }
    }
    if (movement.destinationAccountId) {
      const target = bankAccounts.find((account) => account.id === movement.destinationAccountId);
      if (target) {
        await upsertBankAccount({ ...target, balance: target.balance - movement.amount });
      }
    }
    return;
  }

  if (!movement.accountId) return;
  const account = bankAccounts.find((item) => item.id === movement.accountId);
  if (!account) return;

  const delta = movement.type === 'ingreso' ? -movement.amount : movement.amount;
  await upsertBankAccount({ ...account, balance: account.balance + delta });
}
