/**
 * Definiciones tipadas de las entidades financieras que gestionará IndexedDB.
 * Todos los comentarios están en español para facilitar el mantenimiento del equipo.
 */

export type CurrencyCode = 'ARS' | 'USD' | 'EUR' | 'BRL' | 'CLP';

export type TransactionCategory =
  | 'ingreso'
  | 'esencial'
  | 'objetivo'
  | 'lifestyle'
  | 'ahorro'
  | 'inversion'
  | 'deuda';

export type TransactionType = 'entrada' | 'salida';

export interface BaseEntity {
  /** Identificador único de la entidad */
  id: string;
  /** Fecha de creación para auditoría */
  createdAt?: string;
  /** Fecha de última actualización para sincronización */
  updatedAt?: string;
}

export interface TransactionEntity extends BaseEntity {
  /** Fecha efectiva de la transacción */
  date: string;
  /** Monto de la transacción en la moneda definida */
  amount: number;
  /** Moneda asociada al monto */
  currency: CurrencyCode;
  /** Tipo de movimiento, entrada o salida */
  type: TransactionType;
  /** Categoría según la regla 50/20/30 */
  category: TransactionCategory;
  /** Descripción corta para mostrar en UI */
  description: string;
  /** Etiquetas opcionales para filtrado */
  tags?: string[];
  /** Identificador de tarjeta asociada, si aplica */
  cardId?: string;
  /** Identificador de suscripción asociada, si aplica */
  subscriptionId?: string;
}

export type FundStatus = 'en-curso' | 'completado' | 'pausado';

export interface FundEntity extends BaseEntity {
  /** Nombre de la meta de ahorro o fondo */
  name: string;
  /** Meta monetaria a alcanzar */
  targetAmount: number;
  /** Progreso acumulado */
  currentAmount: number;
  /** Moneda de referencia */
  currency: CurrencyCode;
  /** Fecha objetivo para alcanzar la meta */
  targetDate?: string;
  /** Color hexadecimal para personalizar el anillo UI */
  accentColor?: string;
  /** Estado del fondo para informar en la UI */
  status: FundStatus;
  /** Porcentaje recomendado (50/20/30) que alimenta este fondo */
  ratioBucket: '50' | '20' | '30';
}

export interface CardEntity extends BaseEntity {
  /** Nombre del emisor de la tarjeta */
  issuer: string;
  /** Últimos cuatro dígitos para identificación rápida */
  lastFour: string;
  /** Límite total de la tarjeta */
  creditLimit: number;
  /** Gasto acumulado en el período actual */
  currentSpend: number;
  /** Moneda de la tarjeta */
  currency: CurrencyCode;
  /** Día de corte del estado de cuenta en formato ISO */
  closingDate: string;
  /** Fecha de vencimiento del pago mínimo */
  dueDate: string;
  /** Total pagado en el último período */
  lastPaymentAmount?: number;
}

export type SubscriptionStatus = 'activa' | 'pausada' | 'cancelada';

export interface SubscriptionEntity extends BaseEntity {
  /** Nombre del servicio contratado */
  name: string;
  /** Monto recurrente */
  amount: number;
  /** Moneda del servicio */
  currency: CurrencyCode;
  /** Frecuencia de cobro expresada en días */
  billingIntervalDays: number;
  /** Fecha del próximo cobro */
  nextChargeDate: string;
  /** Estado actual de la suscripción */
  status: SubscriptionStatus;
  /** Categoría recomendada (esencial/lifestyle, etc.) */
  category: TransactionCategory;
  /** Identificador de tarjeta asociada */
  cardId?: string;
}

/** Nombre de cada almacén de objetos dentro de IndexedDB */
export type FinanceStoreName =
  | 'transactions'
  | 'funds'
  | 'cards'
  | 'subscriptions';

/** Mapeo entre nombre de almacén y la entidad que contiene */
export interface FinanceEntityMap {
  readonly transactions: TransactionEntity;
  readonly funds: FundEntity;
  readonly cards: CardEntity;
  readonly subscriptions: SubscriptionEntity;
}

/** Índices clave que se crean por almacén para optimizar consultas */
export interface StoreIndexConfig {
  readonly name: string;
  readonly keyPath: string | string[];
  readonly options?: IDBIndexParameters;
}
