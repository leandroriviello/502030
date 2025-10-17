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
  BankAccountEntity,
  CardEntity,
  DebtEntity,
  ExpenseEntity,
  FundEntity,
  IncomeEntity,
  MovementEntity,
  ReportSnapshot,
  SubscriptionEntity,
  UserConfigEntity
} from '@/lib/types';

type EntityCollections = {
  incomes: IncomeEntity[];
  expenses: ExpenseEntity[];
  funds: FundEntity[];
  bankAccounts: BankAccountEntity[];
  cards: CardEntity[];
  subscriptions: SubscriptionEntity[];
  movements: MovementEntity[];
  debts: DebtEntity[];
  reports: ReportSnapshot[];
  userConfig: UserConfigEntity[];
};

type FinanceActions = {
  initialise: () => Promise<void>;
  addIncome: (payload: Omit<IncomeEntity, 'id'>) => Promise<void>;
  addExpense: (payload: Omit<ExpenseEntity, 'id'>) => Promise<void>;
  upsertFund: (payload: FundEntity) => Promise<void>;
  upsertBankAccount: (payload: BankAccountEntity) => Promise<void>;
  removeBankAccount: (id: string) => Promise<void>;
  upsertCard: (payload: CardEntity) => Promise<void>;
  removeCard: (id: string) => Promise<void>;
  upsertSubscription: (payload: SubscriptionEntity) => Promise<void>;
  removeSubscription: (id: string) => Promise<void>;
  upsertMovement: (payload: MovementEntity) => Promise<void>;
  removeMovement: (id: string) => Promise<void>;
  upsertDebt: (payload: DebtEntity) => Promise<void>;
  removeDebt: (id: string) => Promise<void>;
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

const createId = (): string => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (error) {
    console.warn('crypto.randomUUID() failed, using fallback:', error);
  }
  // Fallback más robusto
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export function FinanceStoreProvider({
  children
}: PropsWithChildren): JSX.Element {
  const [state, setState] = useState<EntityCollections>({
    incomes: [],
    expenses: [],
    funds: [],
    bankAccounts: [],
    cards: [],
    subscriptions: [],
    movements: [],
    debts: [],
    reports: [],
    userConfig: []
  });
  const [ready, setReady] = useState(false);

  const initialise = useCallback(async () => {
    try {
      const [incomes, expenses, funds, bankAccounts, cards, subscriptions, movements, debts, reports, userConfig] =
        await Promise.all([
          getAllRecords('incomes').catch(() => []),
          getAllRecords('expenses').catch(() => []),
          getAllRecords('funds').catch(() => []),
          getAllRecords('bankAccounts').catch(() => []),
          getAllRecords('cards').catch(() => []),
          getAllRecords('subscriptions').catch(() => []),
          getAllRecords('movements').catch(() => []),
          getAllRecords('debts').catch(() => []),
          getAllRecords('reports').catch(() => []),
          getAllRecords('userConfig').catch(() => [])
        ]);

      setState({
        incomes,
        expenses,
        funds,
        bankAccounts,
        cards,
        subscriptions,
        movements,
        debts,
        reports,
        userConfig
      });
      setReady(true);
    } catch (error) {
      console.error('Error initializing finance store:', error);
      // Inicializar con arrays vacíos en caso de error
      setState({
        incomes: [],
        expenses: [],
        funds: [],
        bankAccounts: [],
        cards: [],
        subscriptions: [],
        movements: [],
        debts: [],
        reports: [],
        userConfig: []
      });
      setReady(true);
    }
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

  const upsertBankAccount = useCallback<FinanceActions['upsertBankAccount']>(async (payload) => {
    const saved = await upsertRecord('bankAccounts', {
      ...payload,
      id: payload.id ?? createId()
    });
    setState((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.some((account) => account.id === saved.id)
        ? prev.bankAccounts.map((account) => (account.id === saved.id ? saved : account))
        : [...prev.bankAccounts, saved]
    }));
  }, []);

  const removeBankAccount = useCallback<FinanceActions['removeBankAccount']>(async (id) => {
    await deleteRecord('bankAccounts', id);
    setState((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((account) => account.id !== id)
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

  const removeCard = useCallback<FinanceActions['removeCard']>(async (id) => {
    await deleteRecord('cards', id);
    setState((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== id)
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

  const removeSubscription = useCallback<FinanceActions['removeSubscription']>(async (id) => {
    await deleteRecord('subscriptions', id);
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((subscription) => subscription.id !== id)
    }));
  }, []);

  const upsertMovement = useCallback<FinanceActions['upsertMovement']>(async (payload) => {
    const saved = await upsertRecord('movements', {
      ...payload,
      id: payload.id ?? createId()
    });
    setState((prev) => ({
      ...prev,
      movements: prev.movements.some((movement) => movement.id === saved.id)
        ? prev.movements.map((movement) => (movement.id === saved.id ? saved : movement))
        : [...prev.movements, saved]
    }));
  }, []);

  const removeMovement = useCallback<FinanceActions['removeMovement']>(async (id) => {
    await deleteRecord('movements', id);
    setState((prev) => ({
      ...prev,
      movements: prev.movements.filter((movement) => movement.id !== id)
    }));
  }, []);

  const upsertDebt = useCallback<FinanceActions['upsertDebt']>(async (payload) => {
    const saved = await upsertRecord('debts', {
      ...payload,
      id: payload.id ?? createId()
    });
    setState((prev) => ({
      ...prev,
      debts: prev.debts.some((debt) => debt.id === saved.id)
        ? prev.debts.map((debt) => (debt.id === saved.id ? saved : debt))
        : [...prev.debts, saved]
    }));
  }, []);

  const removeDebt = useCallback<FinanceActions['removeDebt']>(async (id) => {
    await deleteRecord('debts', id);
    setState((prev) => ({
      ...prev,
      debts: prev.debts.filter((debt) => debt.id !== id)
    }));
  }, []);

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
      clearStore('bankAccounts'),
      clearStore('cards'),
      clearStore('subscriptions'),
      clearStore('movements'),
      clearStore('debts'),
      clearStore('reports'),
      clearStore('userConfig')
    ]);

    setState({
      incomes: [],
      expenses: [],
      funds: [],
      bankAccounts: [],
      cards: [],
      subscriptions: [],
      movements: [],
      debts: [],
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
      upsertBankAccount,
      removeBankAccount,
      upsertCard,
      removeCard,
      upsertSubscription,
      removeSubscription,
      upsertMovement,
      removeMovement,
      upsertDebt,
      removeDebt,
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
      upsertBankAccount,
      removeBankAccount,
      upsertCard,
      removeCard,
      upsertSubscription,
      removeSubscription,
      upsertMovement,
      removeMovement,
      upsertDebt,
      removeDebt,
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