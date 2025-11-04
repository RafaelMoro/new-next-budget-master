import { FetchExpensesDateResponse } from "../types/records.types";

export const GET_EXPENSES_AND_INCOMES_BY_MONTH_ROUTE = '/records/expenses-and-incomes';
export const EXPENSE_ROUTE = '/expenses-actions';
export const INCOME_ROUTE = '/incomes-actions';
export const GET_EXPENSES = '/expenses-actions';
export const TRANSFER_ROUTE = 'records/transfer';

export const NO_RECORDS_FOUND = 'No incomes or expenses found.'

export const CREATE_EXPENSE_INCOME_ERROR = 'Oops! No pudimos registrar el movimiento. Intenta más tarde.'
export const EDIT_EXPENSE_INCOME_ERROR = 'Oops! No pudimos editar esta transacción. Intenta más tarde.'
export const DELETE_RECORD_ERROR = 'Oops! No pudimos eliminar esta transacción. Intenta más tarde.'

export const TAG_REQUIRED_ERROR = 'Por favor, ingrese una etiqueta'
export const TAG_MIN_LENGTH_ERROR = 'Por favor, ingrese una etiqueta de más de 2 caracteres'
export const TAG_MAX_LENGTH_ERROR = 'Por favor, ingrese una etiqueta con menos de 50 caracteres.'
export const TAG_REPEATED_ERROR = 'La etiqueta ya existe. Por favor, ingrese una etiqueta diferente.'
export const CURRENCY_ZERO_ERROR = 'Por favor, ingrese una cantidad mayor a 0.'

export const DESTINATION_ACC_REQUIRED = 'Por favor, seleccione un cuenta de destino.';

export const defaultResFetchExpenses: FetchExpensesDateResponse = {
  data: {
    expenses: []
  },
  error: null,
  message: null,
  success: false,
  version: null,
}