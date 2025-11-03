import { createContext } from 'react';
import { createStore } from 'zustand/vanilla'
import { AccountBank, AccountsDisplay } from '../../shared/types/accounts.types';
import { BankMovement } from '../../shared/types/records.types';
import { transformAccountsDisplay as transformAccountsDisplayUtil } from '../../shared/utils/accounts.utils';

export type DashboardState = {
  accounts: AccountBank[];
  accountsDisplay: AccountsDisplay[];
  selectedAccount: AccountBank | null;
  selectedAccountDisplay: AccountsDisplay | null;
  records: BankMovement[]
}

export type DashboardActions = {
  transformAccountsDisplay: (accounts: AccountBank[]) => void
  updateSelectedAccountDisplay: (account: AccountsDisplay) => void
  updateRecords: (records: BankMovement[]) => void
  updateAccounts: (accounts: AccountBank[]) => void
  updateSelectedAccount: (account: AccountBank) => void
}

export type DashboardStore = DashboardState & DashboardActions

export const initDashboardStore = ({
  accounts, records, selectedAccountId
}: {
  accounts: AccountBank[]
  records: BankMovement[]
  selectedAccountId: string
}): DashboardState => {
  const newAccountsDisplay = transformAccountsDisplayUtil({ accounts })
  const newSelectedAccount = accounts.find(account => account._id === selectedAccountId) || null
  const newSelectedAccountDisplay = newAccountsDisplay.find(account => account.accountId ===selectedAccountId) || null;

  return {
    accounts,
    records,
    selectedAccount: newSelectedAccount,
    selectedAccountDisplay: newSelectedAccountDisplay,
    accountsDisplay: newAccountsDisplay
  }
}

export const defaultInitState: DashboardState = {
  accounts: [],
  accountsDisplay: [],
  selectedAccount: null,
  selectedAccountDisplay: null,
  records: []
}

export const createDashboardStore = (
  initState: DashboardState = defaultInitState,
) => {
  return createStore<DashboardStore>()((set) => ({
    ...initState,
    transformAccountsDisplay: () => set((state) => {
      const accountsTransformed = transformAccountsDisplayUtil({  accounts: state.accounts });
      return {
        ...state,
        accountsDisplay: accountsTransformed,
      }
    }),

    updateSelectedAccountDisplay: (account) => set((state) => {
      return {
        ...state,
        selectedAccountDisplay: account,
      }}),

      updateRecords: (records) => set((state) => {
        return {
          ...state,
          records,
        }
      }),

      updateAccounts: (accounts) => set((state) => {
        const accountsTransformed = transformAccountsDisplayUtil({ accounts });
        const selectedAccount = accounts.find(account => account._id === state.selectedAccount?._id) || null;
        const selectedAccountDisplay = accountsTransformed.find(account => account.accountId === state.selectedAccount?._id) || null;

        return {
          ...state,
          accounts: accounts,
          accountsDisplay: accountsTransformed,
          selectedAccount: selectedAccount,
          selectedAccountDisplay: selectedAccountDisplay,
        }
      }),

      updateSelectedAccount: (account) => set((state) => {
        const selectedAccountDisplay = state.accountsDisplay.find(acc => acc.accountId === account._id) || null;
        return {
          ...state,
          selectedAccount: account,
          selectedAccountDisplay: selectedAccountDisplay,
        }
      })
  }))
}

export type DashboardStoreApi = ReturnType<typeof createDashboardStore>
export const DashboardStoreContext = createContext<DashboardStoreApi | undefined>(
  undefined,
)