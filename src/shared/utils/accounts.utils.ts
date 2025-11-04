import axios from "axios";

import { AccountBank, AccountProvider, AccountTypes, CreateAccountData, CreateAccountPayload, DeleteAccountData, DeleteAccountPayload, EditAccountData, EditAccountPayload } from "../types/accounts.types"
import { formatNumberToCurrency } from "./currency.utils";
import { ACCOUNT_API_ENDPOINT } from "../constants/global.constants";

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

export const createBankAccountCb = async (payload: CreateAccountPayload): Promise<CreateAccountData> => {
  try {
    const response = await axios.post<CreateAccountData>(ACCOUNT_API_ENDPOINT, payload)
    const data = response.data
    return data
  } catch (error) {
    throw error
  }
}

export const editBankAccountCb = async (payload: EditAccountPayload): Promise<EditAccountData> => {
  try {
    const response = await axios.put<EditAccountData>(ACCOUNT_API_ENDPOINT, payload)
    const data = response.data
    return data
  } catch (error) {
    throw error
  }
}

export const deleteBankAccountCb = async (payload: DeleteAccountPayload): Promise<DeleteAccountData> => {
  try {
    const response = await axios.delete<DeleteAccountData>(ACCOUNT_API_ENDPOINT, {
      data: payload,
    })
    const data = response.data
    return data
  } catch (error) {
    throw error
  }
}