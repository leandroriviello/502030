/**
 * Definiciones tipadas de las entidades financieras que gestionará Dexie/IndexedDB.
 * Todos los comentarios están en español para facilitar el mantenimiento del equipo.
 */

export type CurrencyCode = 'ARS' | 'USD' | 'EUR' | 'BRL' | 'CLP' | 'COP' | 'BTC' | 'ETH';

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
export type FundType = 'tradicional' | 'acciones' | 'crypto';
export type InvestmentType = 'acciones' | 'bonos' | 'fondos' | 'crypto' | 'commodities' | 'efectivo';

export interface FundPosition {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  currency: CurrencyCode;
  investmentType: InvestmentType;
  location: string; // "BROKER_NAME", "BANCO_NAME", "EXCHANGE_NAME", etc.
  lastUpdated?: string;
  apiSource?: 'yahoo' | 'coinmarketcap' | 'manual';
}

export interface FundEntity extends BaseEntity {
  name: string;
  description?: string;
  fundType: FundType;
  targetAmount: number;
  currentAmount: number; // Calculado automáticamente desde posiciones
  currency: CurrencyCode; // Moneda principal del fondo
  targetDate?: string;
  accentColor?: string;
  status: FundStatus;
  positions: FundPosition[];
  autoSync: boolean; // Si debe sincronizar automáticamente con APIs
}

export type AccountType = 'corriente' | 'caja-ahorro' | 'inversion' | 'wallet';

export interface BankAccountEntity extends BaseEntity {
  name: string;
  institution: string;
  alias?: string;
  accountType: AccountType;
  currency: CurrencyCode;
  balance: number;
  autopayDay?: number;
  notes?: string;
  color?: string;
}

export interface CardEntity extends BaseEntity {
  name: string;
  issuer: string;
  lastFour?: string;
  creditLimit: number;
  currency: CurrencyCode;
  closingDay: number;
  paymentDay: number;
  bankAccountId?: string;
  notes?: string;
}

export type SubscriptionStatus = 'activa' | 'pausada' | 'cancelada';
export type SubscriptionCategory =
  | 'streaming'
  | 'ai'
  | 'videojuegos'
  | 'productividad'
  | 'educacion'
  | 'musica'
  | 'finanzas'
  | 'hogar'
  | 'otros';

export type BillingCycle = 'semanal' | 'mensual' | 'trimestral' | 'anual';

export interface SubscriptionEntity extends BaseEntity {
  name: string;
  provider: string;
  amount: number;
  currency: CurrencyCode;
  billingCycle: BillingCycle;
  billingDay: number;
  nextChargeDate: string;
  status: SubscriptionStatus;
  category: SubscriptionCategory;
  cardId?: string;
  bankAccountId?: string;
  notes?: string;
}

export type MovementType = 'ingreso' | 'egreso' | 'transferencia';

export type MovementCategory =
  | 'salario'
  | 'freelance'
  | 'venta'
  | 'inversion'
  | 'servicios'
  | 'suscripcion'
  | 'educacion'
  | 'salud'
  | 'entretenimiento'
  | 'alquiler'
  | 'alimentacion'
  | 'transporte'
  | 'deuda'
  | 'otros';

export interface MovementEntity extends BaseEntity {
  date: string;
  type: MovementType;
  description: string;
  amount: number;
  currency: CurrencyCode;
  category: MovementCategory;
  accountId?: string;
  destinationAccountId?: string;
  cardId?: string;
  fundId?: string;
  subscriptionId?: string;
  tags?: string[];
  notes?: string;
}

export type DebtStatus = 'activa' | 'pagada' | 'vencida';

export interface DebtEntity extends BaseEntity {
  creditor: string;
  description?: string;
  totalAmount: number;
  remainingAmount: number;
  currency: CurrencyCode;
  dueDate?: string;
  interestRate?: number;
  accountId?: string;
  status: DebtStatus;
  lastPaymentDate?: string;
}

export interface ReportSnapshot extends BaseEntity {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  comparisonVsPrevious?: number;
}

export interface UserConfigEntity extends BaseEntity {
  /** Salario mensual del usuario */
  monthlySalary: number;
  /** Día del mes en que cobra (1-31) */
  payday: number;
  /** Moneda principal del usuario */
  currency: CurrencyCode;
  /** Si ya completó la configuración inicial */
  setupCompleted: boolean;
  /** Regla 50/20/30 personalizada (opcional) */
  customRule?: {
    needs: number; // porcentaje para necesidades (default 50)
    savings: number; // porcentaje para ahorros (default 20)
    wants: number; // porcentaje para deseos (default 30)
  };
}

/** Mapeo entre nombre de tabla y entidad correspondiente */
export interface FinanceEntityMap {
  readonly incomes: IncomeEntity;
  readonly expenses: ExpenseEntity;
  readonly funds: FundEntity;
  readonly bankAccounts: BankAccountEntity;
  readonly cards: CardEntity;
  readonly subscriptions: SubscriptionEntity;
  readonly movements: MovementEntity;
  readonly debts: DebtEntity;
  readonly reports: ReportSnapshot;
  readonly userConfig: UserConfigEntity;
}
