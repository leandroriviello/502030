import type {
  AccountType,
  BillingCycle,
  CurrencyCode,
  MovementCategory,
  MovementType,
  SubscriptionCategory
} from './types';

export type CurrencyOption = {
  code: CurrencyCode;
  name: string;
  symbol: string;
};

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ' }
];

export const ACCOUNT_TYPE_OPTIONS: Array<{ value: AccountType; label: string }> = [
  { value: 'corriente', label: 'Cuenta Corriente' },
  { value: 'caja-ahorro', label: 'Caja de Ahorro' },
  { value: 'inversion', label: 'Cuenta de Inversión' },
  { value: 'wallet', label: 'Billetera Digital' }
];

export const SUBSCRIPTION_CATEGORY_OPTIONS: Array<{
  value: SubscriptionCategory;
  label: string;
  icon: string;
}> = [
  { value: 'streaming', label: 'Streaming', icon: '📺' },
  { value: 'ai', label: 'IA', icon: '🤖' },
  { value: 'videojuegos', label: 'Videojuegos', icon: '🎮' },
  { value: 'productividad', label: 'Productividad', icon: '🗂️' },
  { value: 'educacion', label: 'Educación', icon: '📚' },
  { value: 'musica', label: 'Música', icon: '🎵' },
  { value: 'finanzas', label: 'Finanzas', icon: '💳' },
  { value: 'hogar', label: 'Hogar', icon: '🏠' },
  { value: 'otros', label: 'Otros', icon: '✨' }
];

export const BILLING_CYCLE_OPTIONS: Array<{ value: BillingCycle; label: string }> = [
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'anual', label: 'Anual' }
];

export const MOVEMENT_TYPE_OPTIONS: Array<{ value: MovementType; label: string }> = [
  { value: 'ingreso', label: 'Ingresos' },
  { value: 'egreso', label: 'Gastos' },
  { value: 'transferencia', label: 'Transferencias' }
];

export const MOVEMENT_CATEGORY_OPTIONS: Array<{ value: MovementCategory; label: string }> = [
  { value: 'salario', label: 'Salario' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'venta', label: 'Ventas' },
  { value: 'inversion', label: 'Inversiones' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'suscripcion', label: 'Suscripciones' },
  { value: 'educacion', label: 'Educación' },
  { value: 'salud', label: 'Salud' },
  { value: 'entretenimiento', label: 'Entretenimiento' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'alimentacion', label: 'Alimentación' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'deuda', label: 'Deudas' },
  { value: 'otros', label: 'Otros' }
];

export const POPULAR_SUBSCRIPTION_PROVIDERS: Array<{
  name: string;
  category: SubscriptionCategory;
}> = [
  { name: 'Netflix', category: 'streaming' },
  { name: 'Disney+', category: 'streaming' },
  { name: 'HBO Max', category: 'streaming' },
  { name: 'YouTube Premium', category: 'streaming' },
  { name: 'Spotify', category: 'musica' },
  { name: 'Apple Music', category: 'musica' },
  { name: 'Xbox Game Pass', category: 'videojuegos' },
  { name: 'PlayStation Plus', category: 'videojuegos' },
  { name: 'Nintendo Switch Online', category: 'videojuegos' },
  { name: 'Midjourney', category: 'ai' },
  { name: 'ChatGPT Plus', category: 'ai' },
  { name: 'Notion', category: 'productividad' },
  { name: 'Adobe Creative Cloud', category: 'productividad' },
  { name: 'Figma', category: 'productividad' },
  { name: 'Google Workspace', category: 'productividad' },
  { name: 'Coursera', category: 'educacion' },
  { name: 'Duolingo', category: 'educacion' },
  { name: 'Blinkist', category: 'educacion' },
  { name: 'Mercado Pago Créditos', category: 'finanzas' },
  { name: 'Amazon Prime', category: 'hogar' }
];
