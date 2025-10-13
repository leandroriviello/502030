'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from 'react';
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
  SubscriptionEntity,
  UserConfigEntity
} from '@/lib/types';

type EntityCollections = {
  incomes: IncomeEntity[];
  expenses: ExpenseEntity[];
  funds: FundEntity[];
  cards: CardEntity[];
  subscriptions: SubscriptionEntity[];
  reports: ReportSnapshot[];
  userConfig: UserConfigEntity[];
};

type FinanceActions = {
  initialise: () => Promise<void>;
  addIncome: (payload: Omit<IncomeEntity, 'id'>) => Promise<void>;
  addExpense: (payload: Omit<ExpenseEntity, 'id'>) => Promise<void>;
  upsertFund: (payload: FundEntity) => Promise<void>;
  upsertCard: (payload: CardEntity) => Promise<void>;
  upsertSubscription: (payload: SubscriptionEntity) => Promise<void>;
  upsertUserConfig: (payload: UserConfigEntity) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  resetStore: () => Promise<void>;
};

export type FinanceStore = EntityCollections &
  FinanceActions & {
    ready: boolean;
    isSetupCompleted: boolean;
    getUserConfig: () => UserConfigEntity | undefined;
  };

const FinanceStoreContext = createContext<FinanceStore | null>(null);

const createId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

export function FinanceStoreProvider({
  children
}: PropsWithChildren): JSX.Element {
  const [state, setState] = useState<EntityCollections>({
    incomes: [],
    expenses: [],
    funds: [],
    cards: [],
    subscriptions: [],
    reports: [],
    userConfig: []
  });
  const [ready, setReady] = useState(false);

  const initialise = useCallback(async () => {
    const [incomes, expenses, funds, cards, subscriptions, reports, userConfig] =
      await Promise.all([
        getAllRecords('incomes'),
        getAllRecords('expenses'),
        getAllRecords('funds'),
        getAllRecords('cards'),
        getAllRecords('subscriptions'),
        getAllRecords('reports'),
        getAllRecords('userConfig')
      ]);

    setState({
      incomes,
      expenses,
      funds,
      cards,
      subscriptions,
      reports,
      userConfig
    });
    setReady(true);
  }, []);

  useEffect(() => {
    void initialise();
  }, [initialise]);

  const addIncome = useCallback<FinanceActions['addIncome']>(async (payload) => {
    const record: IncomeEntity = {
      ...payload,
      id: createId()
    };
    const saved = await upsertRecord('incomes', record);
    setState((prev) => ({
      ...prev,
      incomes: [...prev.incomes, saved]
    }));
  }, []);

  const addExpense = useCallback<FinanceActions['addExpense']>(
    async (payload) => {
      const record: ExpenseEntity = {
        ...payload,
        id: createId()
      };
      const saved = await upsertRecord('expenses', record);
      setState((prev) => ({
        ...prev,
        expenses: [...prev.expenses, saved]
      }));
    },
    []
  );

  const upsertFund = useCallback<FinanceActions['upsertFund']>(async (payload) => {
    const saved = await upsertRecord('funds', {
      ...payload,
      id: payload.id ?? createId()
    });
    setState((prev) => ({
      ...prev,
      funds: prev.funds.some((fund) => fund.id === saved.id)
        ? prev.funds.map((fund) => (fund.id === saved.id ? saved : fund))
        : [...prev.funds, saved]
    }));
  }, []);

  const upsertCard = useCallback<FinanceActions['upsertCard']>(async (payload) => {
    const saved = await upsertRecord('cards', {
      ...payload,
      id: payload.id ?? createId()
    });
    setState((prev) => ({
      ...prev,
      cards: prev.cards.some((card) => card.id === saved.id)
        ? prev.cards.map((card) => (card.id === saved.id ? saved : card))
        : [...prev.cards, saved]
    }));
  }, []);

  const upsertSubscription = useCallback<FinanceActions['upsertSubscription']>(
    async (payload) => {
      const saved = await upsertRecord('subscriptions', {
        ...payload,
        id: payload.id ?? createId()
      });
      setState((prev) => ({
        ...prev,
        subscriptions: prev.subscriptions.some(
          (subscription) => subscription.id === saved.id
        )
          ? prev.subscriptions.map((subscription) =>
              subscription.id === saved.id ? saved : subscription
            )
          : [...prev.subscriptions, saved]
      }));
    },
    []
  );

  const upsertUserConfig = useCallback<FinanceActions['upsertUserConfig']>(async (payload) => {
    const saved = await upsertRecord('userConfig', {
      ...payload,
      id: payload.id ?? createId()
    });
    setState((prev) => ({
      ...prev,
      userConfig: prev.userConfig.some((config) => config.id === saved.id)
        ? prev.userConfig.map((config) => (config.id === saved.id ? saved : config))
        : [...prev.userConfig, saved]
    }));
  }, []);

  const removeExpense = useCallback<FinanceActions['removeExpense']>(async (id) => {
    await deleteRecord('expenses', id);
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((expense) => expense.id !== id)
    }));
  }, []);

  const resetStore = useCallback<FinanceActions['resetStore']>(async () => {
    await Promise.all([
      clearStore('incomes'),
      clearStore('expenses'),
      clearStore('funds'),
      clearStore('cards'),
      clearStore('subscriptions'),
      clearStore('reports'),
      clearStore('userConfig')
    ]);

    setState({
      incomes: [],
      expenses: [],
      funds: [],
      cards: [],
      subscriptions: [],
      reports: [],
      userConfig: []
    });
    setReady(false);
    await initialise();
  }, [initialise]);

  const getUserConfig = useCallback((): UserConfigEntity | undefined => {
    return state.userConfig[0]; // Solo debe haber una configuración por usuario
  }, [state.userConfig]);

  const isSetupCompleted = useMemo(() => {
    const config = getUserConfig();
    return config?.setupCompleted ?? false;
  }, [getUserConfig]);

  const value = useMemo<FinanceStore>(
    () => ({
      ...state,
      ready,
      isSetupCompleted,
      getUserConfig,
      initialise,
      addIncome,
      addExpense,
      upsertFund,
      upsertCard,
      upsertSubscription,
      upsertUserConfig,
      removeExpense,
      resetStore
    }),
    [
      state,
      ready,
      isSetupCompleted,
      getUserConfig,
      initialise,
      addIncome,
      addExpense,
      upsertFund,
      upsertCard,
      upsertSubscription,
      upsertUserConfig,
      removeExpense,
      resetStore
    ]
  );

  return (
    <FinanceStoreContext.Provider value={value}>
      {children}
    </FinanceStoreContext.Provider>
  );
}

export const useFinanceStore = (): FinanceStore => {
  const context = useContext(FinanceStoreContext);
  if (!context) {
    throw new Error(
      'useFinanceStore debe utilizarse dentro de un FinanceStoreProvider.'
    );
  }
  return context;
};
