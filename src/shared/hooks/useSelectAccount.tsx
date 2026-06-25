import { useDashboardStore } from "@/zustand/provider/dashboard-store-provider"
import { useEffect, useState } from "react"
import { AccountsCookie, AccountsDisplay } from "../types/accounts.types"
import { saveAccountApi } from "../utils/user-info.utils"
import { fetchRecordsCurrentMonth } from "../lib/dashboard.lib"

interface SelectAccountProps {
  limit10Accounts?: boolean;
  closeModal?: () => void;
}

export const useSelectAccount = ({ limit10Accounts = false, closeModal }: SelectAccountProps) => {
  const { accounts, accountsDisplay, selectedAccountDisplay, updateRecords, updateSelectedAccount } = useDashboardStore(
    (state) => state
  )
  const [accountsOptions, setAccountsOptions] = useState<AccountsDisplay[]>([])
  const hasMore10Accounts = accountsDisplay.length > 10

  useEffect(() => {
    if (selectedAccountDisplay) {
      const options = accountsDisplay
        .filter(acc => acc.accountId !== selectedAccountDisplay.accountId)
        .slice(0, limit10Accounts ? 10 : accountsDisplay.length); // Limit to 10 accounts if specified
      setAccountsOptions(options);
    }
  }, [accountsDisplay, limit10Accounts, selectedAccountDisplay])

  const handleSelectAccount = async (accountId: string) => {
    const selectedAccDisplay = accountsOptions.find(acc => acc.accountId === accountId)
    const selectedAcc = accounts.find(acc => acc._id === accountId)
    if (!selectedAccDisplay || !selectedAcc) {
      console.warn('Account not found in options:', accountId);
      return;
    }
    const newOptions = accountsDisplay.filter(acc => acc.accountId !== accountId)

    const accountCookie: AccountsCookie = {
      accountId: selectedAccDisplay.accountId,
      name: selectedAccDisplay.name,
      type: selectedAccDisplay.type
    }
    // Save the account selected into the cookie
    await saveAccountApi(accountCookie)
    setAccountsOptions(newOptions)
    // This updates select account display and selected account
    updateSelectedAccount(selectedAcc)

    // Fetch new records of the selected account
    const { records } = await fetchRecordsCurrentMonth({ accountId: selectedAccDisplay.accountId });
    updateRecords(records);
    if (closeModal) closeModal()
  }

  return {
    accountsOptions,
    selectedAccountDisplay,
    hasMore10Accounts,
    handleSelectAccount
  }
}