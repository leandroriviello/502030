import { create } from 'zustand';
import {
  clearStore,
  deleteRecord,
  getAllRecords,
  upsertRecord
} from '@/lib/db';
import type {
  CardEntity,
  ExpenseEntity,
  FundEntity,
  IncomeEntity,
  ReportSnapshot,
  SubscriptionEntity
} from '@/lib/types';

type EntityCollections = {
  incomes: IncomeEntity[];
  expenses: ExpenseEntity[];
  funds: FundEntity[];
  cards: CardEntity[];
  subscriptions: SubscriptionEntity[];
  reports: ReportSnapshot[];
};

type FinanceActions = {
  initialise: () => Promise<void>;
  addIncome: (payload: Omit<IncomeEntity, 'id'>) => Promise<void>;
  addExpense: (payload: Omit<ExpenseEntity, 'id'>) => Promise<void>;
  upsertFund: (payload: FundEntity) => Promise<void>;
  upsertCard: (payload: CardEntity) => Promise<void>;
  upsertSubscription: (payload: SubscriptionEntity) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  resetStore: () => Promise<void>;
};

export type FinanceStore = EntityCollections &
  FinanceActions & {
    ready: boolean;
  };

const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  incomes: [],
  expenses: [],
  funds: [],
  cards: [],
  subscriptions: [],
  reports: [],
  ready: false,

  initialise: async () => {
    const [incomes, expenses, funds, cards, subscriptions, reports] =
      await Promise.all([
        getAllRecords('incomes'),
        getAllRecords('expenses'),
        getAllRecords('funds'),
        getAllRecords('cards'),
        getAllRecords('subscriptions'),
        getAllRecords('reports')
      ]);

    set({
      incomes,
      expenses,
      funds,
      cards,
      subscriptions,
      reports,
      ready: true
    });
  },

  addIncome: async (payload) => {
    const record: IncomeEntity = {
      ...payload,
      id: newId()
    };

    const saved = await upsertRecord('incomes', record);
    set((state) => ({
      incomes: [...state.incomes, saved]
    }));
  },

  addExpense: async (payload) => {
    const record: ExpenseEntity = {
      ...payload,
      id: newId()
    };

    const saved = await upsertRecord('expenses', record);
    set((state) => ({
      expenses: [...state.expenses, saved]
    }));
  },

  upsertFund: async (payload) => {
    const saved = await upsertRecord('funds', {
      ...payload,
      id: payload.id ?? newId()
    });
    set((state) => ({
      funds: state.funds.some((fund) => fund.id === saved.id)
        ? state.funds.map((fund) => (fund.id === saved.id ? saved : fund))
        : [...state.funds, saved]
    }));
  },

  upsertCard: async (payload) => {
    const saved = await upsertRecord('cards', {
      ...payload,
      id: payload.id ?? newId()
    });
    set((state) => ({
      cards: state.cards.some((card) => card.id === saved.id)
        ? state.cards.map((card) => (card.id === saved.id ? saved : card))
        : [...state.cards, saved]
    }));
  },

  upsertSubscription: async (payload) => {
    const saved = await upsertRecord('subscriptions', {
      ...payload,
      id: payload.id ?? newId()
    });
    set((state) => ({
      subscriptions: state.subscriptions.some(
        (subscription) => subscription.id === saved.id
      )
        ? state.subscriptions.map((subscription) =>
            subscription.id === saved.id ? saved : subscription
          )
        : [...state.subscriptions, saved]
    }));
  },

  removeExpense: async (id) => {
    await deleteRecord('expenses', id);
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== id)
    }));
  },

  resetStore: async () => {
    await Promise.all([
      clearStore('incomes'),
      clearStore('expenses'),
      clearStore('funds'),
      clearStore('cards'),
      clearStore('subscriptions'),
      clearStore('reports')
    ]);

    set({
      incomes: [],
      expenses: [],
      funds: [],
      cards: [],
      subscriptions: [],
      reports: []
    });

    await get().initialise();
  }
}));
