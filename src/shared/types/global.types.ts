import { AxiosError, AxiosResponse } from "axios";
import { BankMovement } from "./records.types";

export type ThemeMode = 'light' | 'dark';

export type BudgetMasterLocalStorage = {
  'edit-record': {
    record: BankMovement
  }
}

export type ErrorCatched = {
  message: string;
  cause?: {
    code: string
  }
}

export type CookieObject = {
  name: string;
  value: string;
};

export type GeneralError = {
  response: {
    data: {
      error: {
        message: string;
      }
    }
  }
}

export interface GeneralApiError extends Omit<AxiosError, 'response'> {
  response: AxiosResponse<{
    message: string;
  }>;
}

export interface YupError {
  message: string;
}

export type DetailedError = {
  message: string;
  cause?: string;
}

export const ABBREVIATED_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
export type AbbreviatedMonthsType = typeof ABBREVIATED_MONTHS[number];
export const abbreviatedMonthsCompleteMonthsDict: Record<CompleteMonthsType, AbbreviatedMonthsType> = {
  Enero: 'Jan',
  Febrero: 'Feb',
  Marzo: 'Mar',
  Abril: 'Apr',
  Mayo: 'May',
  Junio: 'Jun',
  Julio: 'Jul',
  Agosto: 'Aug',
  Septiembre: 'Sep',
  Octubre: 'Oct',
  Noviembre: 'Nov',
  Diciembre: 'Dec',
}

export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const;
export type CompleteMonthsType = typeof MONTHS[number];