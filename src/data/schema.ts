import type { FinanceStoreName, StoreIndexConfig } from './models';

/** Nombre único de la base de datos IndexedDB */
export const FINANCE_DB_NAME = 'regla-502030-db';

/** Versión actual del esquema de la base de datos */
export const FINANCE_DB_VERSION = 1;

/** Configuración de almacenes y sus índices secundarios */
export const STORE_DEFINITIONS: Record<
  FinanceStoreName,
  {
    readonly keyPath: string;
    readonly autoIncrement: boolean;
    readonly indices: readonly StoreIndexConfig[];
  }
> = {
  transactions: {
    keyPath: 'id',
    autoIncrement: false,
    indices: [
      { name: 'by-date', keyPath: 'date' },
      { name: 'by-type', keyPath: 'type' },
      { name: 'by-category', keyPath: 'category' },
      { name: 'by-cardId', keyPath: 'cardId', options: { unique: false } },
      { name: 'by-subscriptionId', keyPath: 'subscriptionId', options: { unique: false } }
    ]
  },
  funds: {
    keyPath: 'id',
    autoIncrement: false,
    indices: [
      { name: 'by-status', keyPath: 'status' },
      { name: 'by-ratioBucket', keyPath: 'ratioBucket' }
    ]
  },
  cards: {
    keyPath: 'id',
    autoIncrement: false,
    indices: [{ name: 'by-issuer', keyPath: 'issuer' }]
  },
  subscriptions: {
    keyPath: 'id',
    autoIncrement: false,
    indices: [
      { name: 'by-status', keyPath: 'status' },
      { name: 'by-category', keyPath: 'category' },
      { name: 'by-cardId', keyPath: 'cardId', options: { unique: false } }
    ]
  }
};
