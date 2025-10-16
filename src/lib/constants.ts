import type { AccountType, CurrencyCode, TransactionCategory, TransactionType } from './types';

export const ACCOUNT_TYPE_OPTIONS = [
  { value: 'corriente' as AccountType, label: 'Cuenta Corriente' },
  { value: 'caja-ahorro' as AccountType, label: 'Caja de Ahorro' },
  { value: 'inversion' as AccountType, label: 'Cuenta de Inversión' },
  { value: 'wallet' as AccountType, label: 'Billetera Digital' }
];

export const CURRENCY_OPTIONS = [
  { code: 'ARS' as CurrencyCode, name: 'Peso Argentino', symbol: '$' },
  { code: 'USD' as CurrencyCode, name: 'Dólar Estadounidense', symbol: '$' },
  { code: 'EUR' as CurrencyCode, name: 'Euro', symbol: '€' },
  { code: 'BRL' as CurrencyCode, name: 'Real Brasileño', symbol: 'R$' },
  { code: 'CLP' as CurrencyCode, name: 'Peso Chileno', symbol: '$' },
  { code: 'COP' as CurrencyCode, name: 'Peso Colombiano', symbol: '$' },
  { code: 'BTC' as CurrencyCode, name: 'Bitcoin', symbol: '₿' },
  { code: 'ETH' as CurrencyCode, name: 'Ethereum', symbol: 'Ξ' }
];

export const MOVEMENT_TYPE_OPTIONS = [
  { value: 'ingreso' as const, label: 'Ingreso', icon: '💰' },
  { value: 'egreso' as const, label: 'Gasto', icon: '💸' }
];

export const MOVEMENT_CATEGORY_OPTIONS = [
  { value: 'salario' as const, label: 'Salario', icon: '💰' },
  { value: 'freelance' as const, label: 'Freelance', icon: '💼' },
  { value: 'venta' as const, label: 'Venta', icon: '🛒' },
  { value: 'inversion' as const, label: 'Inversión', icon: '📈' },
  { value: 'servicios' as const, label: 'Servicios', icon: '🔧' },
  { value: 'suscripcion' as const, label: 'Suscripción', icon: '📱' },
  { value: 'educacion' as const, label: 'Educación', icon: '📚' },
  { value: 'salud' as const, label: 'Salud', icon: '🏥' },
  { value: 'entretenimiento' as const, label: 'Entretenimiento', icon: '🎬' },
  { value: 'alquiler' as const, label: 'Alquiler', icon: '🏠' },
  { value: 'alimentacion' as const, label: 'Alimentación', icon: '🍽️' },
  { value: 'transporte' as const, label: 'Transporte', icon: '🚗' },
  { value: 'deuda' as const, label: 'Deuda', icon: '📋' },
  { value: 'otros' as const, label: 'Otros', icon: '🔧' }
];

export const SUBSCRIPTION_CATEGORY_OPTIONS = [
  { value: 'streaming' as const, label: 'Streaming', icon: '📺' },
  { value: 'software' as const, label: 'Software', icon: '💻' },
  { value: 'fitness' as const, label: 'Fitness', icon: '🏃‍♂️' },
  { value: 'music' as const, label: 'Música', icon: '🎵' },
  { value: 'news' as const, label: 'Noticias', icon: '📰' },
  { value: 'productivity' as const, label: 'Productividad', icon: '⚡' },
  { value: 'gaming' as const, label: 'Gaming', icon: '🎮' },
  { value: 'education' as const, label: 'Educación', icon: '📚' },
  { value: 'cloud' as const, label: 'Cloud Storage', icon: '☁️' },
  { value: 'other' as const, label: 'Otro', icon: '🔧' }
];

export const POPULAR_SUBSCRIPTION_PROVIDERS = [
  'Netflix', 'Spotify', 'Apple Music', 'YouTube Premium', 'Disney+',
  'Amazon Prime', 'Microsoft 365', 'Adobe Creative Cloud', 'Figma',
  'Notion', 'Dropbox', 'Google Drive', 'iCloud', 'GitHub', 'Canva'
];

export const BILLING_CYCLE_OPTIONS = [
  { value: 'semanal' as const, label: 'Semanal', icon: '📆' },
  { value: 'mensual' as const, label: 'Mensual', icon: '📅' },
  { value: 'trimestral' as const, label: 'Trimestral', icon: '📊' },
  { value: 'anual' as const, label: 'Anual', icon: '🗓️' }
];