import Dexie, { Table } from 'dexie';
import type { FinanceEntityMap } from './types';

/** Nombre de la base IndexedDB gestionada por Dexie */
const DATABASE_NAME = 'regla-502030-db';

/** Versión del esquema Dexie (incrementar cuando cambie la estructura) */
const DATABASE_VERSION = 3;

class FinanceDatabase extends Dexie {
  incomes!: Table<FinanceEntityMap['incomes'], string>;
  expenses!: Table<FinanceEntityMap['expenses'], string>;
  funds!: Table<FinanceEntityMap['funds'], string>;
  bankAccounts!: Table<FinanceEntityMap['bankAccounts'], string>;
  cards!: Table<FinanceEntityMap['cards'], string>;
  subscriptions!: Table<FinanceEntityMap['subscriptions'], string>;
  movements!: Table<FinanceEntityMap['movements'], string>;
  debts!: Table<FinanceEntityMap['debts'], string>;
  reports!: Table<FinanceEntityMap['reports'], string>;
  userConfig!: Table<FinanceEntityMap['userConfig'], string>;

  constructor() {
    super(DATABASE_NAME);

    this.version(DATABASE_VERSION).stores({
      incomes: 'id, date, amount',
      expenses: 'id, date, category, cardId, subscriptionId',
      funds: 'id, status',
      bankAccounts: 'id, institution, currency',
      cards: 'id, issuer, bankAccountId',
      subscriptions: 'id, status, category, cardId, bankAccountId',
      movements: 'id, date, type, accountId, cardId',
      debts: 'id, status, accountId',
      reports: 'id, month',
      userConfig: 'id, setupCompleted'
    });
  }
}

export const db = new FinanceDatabase();

/** Devuelve la tabla Dexie asociada al almacén solicitado */
const getTable = <Store extends keyof FinanceEntityMap>(
  store: Store
): Table<FinanceEntityMap[Store], string> => {
  return db[store] as Table<FinanceEntityMap[Store], string>;
};

/** Inserta o actualiza un registro conservando metadatos */
export const upsertRecord = async <
  Store extends keyof FinanceEntityMap,
  Entity extends FinanceEntityMap[Store]
>(
  store: Store,
  payload: Entity
): Promise<Entity> => {
  const table = getTable(store);
  const now = new Date().toISOString();
  const existing = await table.get(payload.id);

  const record: Entity = {
    ...payload,
    createdAt: existing?.createdAt ?? payload.createdAt ?? now,
    updatedAt: now
  };

  await table.put(record);
  return record;
};

/** Obtiene todos los registros almacenados en la tabla indicada */
export const getAllRecords = async <Store extends keyof FinanceEntityMap>(
  store: Store
): Promise<Array<FinanceEntityMap[Store]>> => {
  const table = getTable(store);
  return table.toArray();
};

/** Obtiene un registro por ID */
export const getRecordById = async <
  Store extends keyof FinanceEntityMap,
  Entity extends FinanceEntityMap[Store]
>(
  store: Store,
  id: string
): Promise<Entity | undefined> => {
  const table = getTable(store);
  return (await table.get(id)) as Entity | undefined;
};

/** Elimina un registro de la tabla solicitada */
export const deleteRecord = async <Store extends keyof FinanceEntityMap>(
  store: Store,
  id: string
): Promise<void> => {
  const table = getTable(store);
  await table.delete(id);
};

/** Limpia completamente la tabla requerida */
export const clearStore = async (store: keyof FinanceEntityMap): Promise<void> => {
  const table = getTable(store);
  await table.clear();
};
