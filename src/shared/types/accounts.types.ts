import { object, string } from "yup";
import { DetailedError } from "./global.types";
import { AxiosError, AxiosResponse } from "axios";
import { BankMovement } from './records.types'

export type AccountBank = {
  _id: string;
  title: string;
  accountType: string;
  backgroundColor: string;
  color: string;
  amount: number;
  sub: string;
  accountProvider?: string;
  terminationFourDigits?: number;
  alias?: string;
}

export type AccountProvider = "mastercard" | "visa" | "american-express"
export type AccountProviderDisplay = 'Mastercard' | 'Visa' | 'American Express'
export type AccountTypes = 'Crédito' | 'Débito' | 'Vales de comida' | 'Vales de restaurante' | 'Cuenta de ahorro'
export const CREDIT_ACCOUNT_TYPE: AccountTypes = 'Crédito'
export type AccountModalAction = 'edit' | 'view' | 'delete'

export const TYPE_OF_ACCOUNTS: readonly AccountTypes[] = ['Crédito', 'Débito', 'Vales de comida', 'Vales de restaurante', 'Cuenta de ahorro'] as const;
export const ACCOUNT_PROVIDERS: readonly AccountProvider[] = ['mastercard', 'visa', 'american-express'] as const;

export type AccountsDisplay = {
  accountId: string;
  name: string;
  amount: string;
  type: AccountTypes;
  accountProvider?: AccountProvider;
  terminationFourDigits?: number;
  terminationFourDigitsTransformed?: string;
  alias?: string;
}

/**
 * This type of account is just to save the neccessary info of the account without exposing sensitive data
 */
export type AccountsCookie = {
  accountId: string;
  name: string;
  type: AccountTypes;
}

export type AccountTransfer = {
  accountId: string
  name: string
  type: AccountTypes;
}

//#region Data interfaces

export type EditAccountPayload = {
  accountId: string
  title: string;
  alias: string;
  accountType: string;
  accountProvider: AccountProvider;
  amount: number;
  terminationFourDigits: string;
  backgroundColor: string;
  color: string;
}

export interface OperationAccountError extends Omit<AxiosError, 'response'> {
  response: AxiosResponse<{
    error: {
      message: string | string[];
      statusCode: number
    }
  }>;
}

export type CreateAccountPayload = Omit<EditAccountPayload, 'accountId'>

export type DeleteAccountPayload = {
  accountId: string
}

export interface EditAccountData {
  data: {
    account: AccountBank;
  }
  error: null;
  message: null;
  success: boolean;
  version: string;
}

export interface CreateAccountData extends Omit<EditAccountData, 'message'> {
  message: "Account created"
}

export interface DeleteAccountData {
  data: {
    accountDeleted: AccountBank;
  }
  error: null;
  message: "Account Deleted";
  success: boolean;
  version: string;
}

// Response from backend
export type FetchAccountsResponse = {
  data: {
    accounts: AccountBank[];
  }
}

export type FetchRecordsResponse = {
  data: {
    records: BankMovement[];
  }
}

// Response from the function getAccounts
export type GetAccountsResponse = {
  detailedError: DetailedError | null;
  accounts: AccountBank[];
}

//#region Validations

export type AccountFormData = {
  title: string;
  terminationFourDigits?: string | null | undefined
  alias?: string | null | undefined
}

// Excluding amount as it can't be empty
export const AccountFormSchema = object().shape({
  title: string()
    .required("Por favor, ingrese el título de la cuenta")
    .min(2, "El título debe tener al menos 2 caracteres")
    .max(50, "El título no puede exceder los 50 caracteres"),
  alias: string()
    .nullable()
    .notRequired()
    .when('alias', {
      is: (value: string) => value?.length,
      then: (rule) => rule.min(2, "El título debe tener al menos 2 caracteres").max(30, "El título no puede exceder los 30 caracteres"),
    }),
  terminationFourDigits: string()
    .nullable()
    .notRequired()
    .when('terminationFourDigits', {
      is: (value: string) => value?.length,
      then: (rule) => {
        return rule.matches(/^\d+$/, { excludeEmptyString: true, message: "La terminación solo puede contener dígitos" })
          .min(4, "La terminación no puede tener menos de 4 dígitos")
          .max(4, "La terminación no puede tener más de 4 dígitos")
      },
    })
}, [
  ["alias", "alias"],
  ["terminationFourDigits", "terminationFourDigits"]
])