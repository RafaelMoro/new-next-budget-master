"use client"

import { ReactNode, useRef, useContext  } from "react"
import {
  createDashboardStore, DashboardStoreApi, DashboardStoreContext, initDashboardStore, type DashboardStore
} from "../store/dashboard.store"
import { useStore } from "zustand"
import { AccountBank } from "@/shared/types/accounts.types"
import { BankMovement } from "@/shared/types/records.types"

interface DashboardStoreProviderProps {
  children: ReactNode
  accounts: AccountBank[];
  records: BankMovement[];
  selectedAccountId: string
}

export const DashboardStoreProvider = ({ children, accounts, records, selectedAccountId }: DashboardStoreProviderProps) => {
  const storeRef = useRef<DashboardStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createDashboardStore(initDashboardStore({ accounts, records, selectedAccountId }))
  }

  return (
    <DashboardStoreContext.Provider value={storeRef.current}>
      {children}
    </DashboardStoreContext.Provider>
  )
}

export const useDashboardStore = <T,>(
  selector: (store: DashboardStore) => T,
): T => {
  const dashboardStoreContext = useContext(DashboardStoreContext)

  if (!dashboardStoreContext) {
    throw new Error(`useDashboardStore must be used within DashboardStoreContext`)
  }

  return useStore(dashboardStoreContext, selector)
}