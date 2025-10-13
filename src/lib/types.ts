/**
 * Definiciones tipadas de las entidades financieras que gestionará Dexie/IndexedDB.
 * Todos los comentarios están en español para facilitar el mantenimiento del equipo.
 */

export type CurrencyCode = 'ARS' | 'USD' | 'EUR' | 'BRL' | 'CLP' | 'COP' | 'BTC';

export type TransactionCategory =
  | 'necesidades'
  | 'ahorros'
  | 'deseos'
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

export interface IncomeEntity extends BaseEntity {
  date: string;
  amount: number;
  currency: CurrencyCode;
  description: string;
  tags?: string[];
}

export interface ExpenseEntity extends BaseEntity {
  date: string;
  amount: number;
  currency: CurrencyCode;
  category: TransactionCategory;
  description: string;
  tags?: string[];
  cardId?: string;
  subscriptionId?: string;
}

export type FundStatus = 'en-curso' | 'completado' | 'pausado';

export interface FundEntity extends BaseEntity {
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: CurrencyCode;
  targetDate?: string;
  accentColor?: string;
  status: FundStatus;
}

export interface CardEntity extends BaseEntity {
  issuer: string;
  lastFour: string;
  creditLimit: number;
  currentSpend: number;
  currency: CurrencyCode;
  closingDate: string;
  dueDate: string;
  lastPaymentAmount?: number;
}

export type SubscriptionStatus = 'activa' | 'pausada' | 'cancelada';

export interface SubscriptionEntity extends BaseEntity {
  name: string;
  amount: number;
  currency: CurrencyCode;
  billingIntervalDays: number;
  nextChargeDate: string;
  status: SubscriptionStatus;
  category: TransactionCategory;
  cardId?: string;
}

export interface ReportSnapshot extends BaseEntity {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  comparisonVsPrevious?: number;
}

/** Mapeo entre nombre de tabla y entidad correspondiente */
export interface FinanceEntityMap {
  readonly incomes: IncomeEntity;
  readonly expenses: ExpenseEntity;
  readonly funds: FundEntity;
  readonly cards: CardEntity;
  readonly subscriptions: SubscriptionEntity;
  readonly reports: ReportSnapshot;
}
