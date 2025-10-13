import type { ExpenseEntity, IncomeEntity } from './types';

/** Calcula totales mensuales de ingresos y gastos para reportes rápidos */
export const calculateMonthlySummary = (
  incomes: IncomeEntity[],
  expenses: ExpenseEntity[]
): {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
} => {
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses
  };
};

/** Retorna el porcentaje de distribución frente a la regla 50/20/30 */
export const calculateRuleDistribution = (
  expenses: ExpenseEntity[]
): {
  necesidades: number;
  ahorros: number;
  deseos: number;
} => {
  const totals = expenses.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.amount;
    return acc;
  }, {});

  const necesidades = totals.necesidades ?? 0;
  const ahorros = totals.ahorros ?? 0;
  const deseos = totals.deseos ?? 0;
  const total = necesidades + ahorros + deseos || 1;

  return {
    necesidades: necesidades / total,
    ahorros: ahorros / total,
    deseos: deseos / total
  };
};
