"use client"
import { useDashboardStore } from '@/zustand/provider/dashboard-store-provider'
import { useRouter } from 'next/navigation'
import { getAccountCookie } from '../lib/preferences.lib'
import { saveAccountApi } from '../utils/user-info.utils'
import { CREATE_RECORD_ROUTE, LOGIN_ROUTE } from '../constants/global.constants'
import { AccountsCookie } from '../types/accounts.types'

export const useDashboard = () => {
  const router = useRouter()
  const selectedAccountId = useDashboardStore(
    (state) => state.selectedAccount?._id
  )
  const selectedAccountDisplay = useDashboardStore(
    state => state.selectedAccountDisplay
  )
  const accountsDisplay = useDashboardStore(
    (state) => state.accountsDisplay
  )

  // Function that checks if the select cookie exists and set it if not,
  // This way we avoid on having null selected account in create record on first log in
  const manageSelectedAccountCookie = async () => {
    try {
      const selectedAccountCookie = await getAccountCookie()
      if (!selectedAccountCookie && selectedAccountId && selectedAccountDisplay) {
        const accountCookie: AccountsCookie = {
          accountId: selectedAccountDisplay.accountId,
          name: selectedAccountDisplay.name,
          type: selectedAccountDisplay.type
        }
        await saveAccountApi(accountCookie)
      }
    } catch (error) {
      console.error('Error managing selected account cookie:', error)
    }
  }

  const handleGoCreateRecordRoute = async () => {
    try {
      await manageSelectedAccountCookie()
      router.push(CREATE_RECORD_ROUTE)
    } catch (error) {
      console.error('Error redirecting create record:', error)
    }
  }

  const redirectLogin = () => router.push(LOGIN_ROUTE)

  return {
    handleGoCreateRecordRoute,
    manageSelectedAccountCookie,
    redirectLogin,
    accountsDisplay,
  }
}