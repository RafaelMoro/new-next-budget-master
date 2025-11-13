import axios from "axios";
import { CreateExpensePayload, DeleteExpenseDataResponse, DeleteIncomeDataResponse, DeleteRecordPayload, EditExpensePayload, ExpenseDataResponse } from "../types/records.types";
import { EXPENSE_API_ENDPOINT, INCOME_API_ENDPOINT } from "../constants/global.constants";

export const deleteExpenseCb = async (payload: DeleteRecordPayload): Promise<DeleteExpenseDataResponse> => {
  try {
    const response = await axios.delete<DeleteExpenseDataResponse>(EXPENSE_API_ENDPOINT, {
      data: payload,
    })
    const data = response.data
    return data
  } catch (error) {
    throw error
  }
}

export const deleteIncomeCb = async (payload: DeleteRecordPayload): Promise<DeleteIncomeDataResponse> => {
  try {
    const response = await axios.delete<DeleteIncomeDataResponse>(INCOME_API_ENDPOINT, {
      data: payload,
    })
    const data = response.data
    return data
  } catch (error) {
    throw error
  }
}

export const createExpenseCb = async (payload: CreateExpensePayload): Promise<ExpenseDataResponse> => {
  try {
    const response = await axios.post<ExpenseDataResponse>(EXPENSE_API_ENDPOINT, payload)
    const data = response.data
    return data
  } catch (error) {
    throw error
  }
}

export const editExpenseCb = async (payload: EditExpensePayload): Promise<ExpenseDataResponse> => {
  try {
    const response = await axios.put<ExpenseDataResponse>(EXPENSE_API_ENDPOINT, payload)
    const data = response.data
    return data
  } catch (error) {
    throw error
  }
}