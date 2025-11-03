import { AccountBank, AccountProvider, AccountTypes } from "../types/accounts.types"
import { formatNumberToCurrency } from "./global.utils";

export function getTerminationFormatted(terminationNumber: number | undefined) {
  if (terminationNumber) {
    return `**${terminationNumber}`
  }
  return "**XXXX";
}

export function getAccountProvider(provider: string | undefined): AccountProvider {
  return (
    provider === "mastercard" ||
    provider === "visa" ||
    provider === "american-express"
  )
    ? provider as AccountProvider
    : "mastercard";
}

export const transformAccountsDisplay = ({ accounts }: { accounts: AccountBank[] }) => {
  return accounts.map((account) => ({
    accountId: account._id,
    name: account.title,
    amount: formatNumberToCurrency(account.amount),
    // We're sure the account type is not other string than type AccountTypes
    type: (account.accountType as AccountTypes),
    alias: account.alias,
    terminationFourDigits: account.terminationFourDigits,
    terminationFourDigitsTransformed: getTerminationFormatted(account.terminationFourDigits),
    accountProvider: getAccountProvider(account.accountProvider) // Default to mastercard if not provided
  }))
}