"use client"

import { useState } from "react"

import { AccountBank, AccountTransfer, AccountTypes } from "../types/accounts.types"

interface UseTransferBankAccountsProps {
  accounts: AccountBank[]
  selectedAccountId: string | null
}

const getOriginAccount = ({
  accountsFormatted,
  selectedAccountId,
}: {
  accountsFormatted: AccountTransfer[]
  selectedAccountId: string | null
}) => {
  return accountsFormatted.find((account) => account.accountId === selectedAccountId) ?? accountsFormatted[0] ?? null
}

export const useTransferBankAccounts = ({ accounts, selectedAccountId }: UseTransferBankAccountsProps) => {
  // ponytail: inline map - transformAccountsDisplay returns 7 fields, AccountTransfer needs 3.
  const accountsFormatted: AccountTransfer[] = accounts.map((account) => ({
    accountId: account._id,
    name: account.title,
    type: account.accountType as AccountTypes,
  }))

  const [origin, setOrigin] = useState<AccountTransfer | null>(() => getOriginAccount({ accountsFormatted, selectedAccountId }))
  const [destination, setDestination] = useState<AccountTransfer | null>(null)
  const [destinationError, setDestinationError] = useState<string | null>(null)

  const destinationAccounts = accountsFormatted.filter((account) => account.accountId !== origin?.accountId)

  const updateOrigin = (account: AccountTransfer) => {
    setOrigin(account)
    setDestination(null)
    setDestinationError(null)
  }

  const updateDestination = (account: AccountTransfer) => {
    setDestination(account)
    setDestinationError(null)
  }

  const handleDestinationError = (error: string) => {
    setDestinationError(error)
  }

  return {
    accountsFormatted,
    origin,
    destination,
    destinationError,
    destinationAccounts,
    updateOrigin,
    updateDestination,
    handleDestinationError,
  }
}
