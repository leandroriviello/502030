import type { AccountType, CurrencyCode } from './types';

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