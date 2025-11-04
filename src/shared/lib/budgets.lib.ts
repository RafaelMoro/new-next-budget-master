"use server"

import { FetchBudgetsResponse, GetBudgetsResponse } from "../types/budgets.types"
import { ErrorCatched } from "../types/global.types"
import { getAccessToken } from "./auth.lib"

export const fetchAllBudgets = async (): Promise<GetBudgetsResponse> => {
  try {
    const accessToken = await getAccessToken()
    if (!accessToken) {
      return {
        detailedError: {
         message: 'No access token provided'
        },
        budgets: []
      }
    }
    const uri = process.env.BACKEND_URI
    if (!uri) {
      throw new Error("Backend URI is not defined");
    }

    const res = await fetch(`${uri}/budgets`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    })
    const data: FetchBudgetsResponse = await res.json()
    const { data: { budgets } } = data;
    return {
      detailedError: null,
      budgets
    }
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    if ((error as ErrorCatched)?.cause?.code) {
      return {
        detailedError: {
          message: (error as ErrorCatched)?.message,
          cause: (error as ErrorCatched)?.cause?.code
        },
        budgets: []
      }
    }

    return {
      detailedError: {
        message: (error as ErrorCatched)?.message
      },
      budgets: []
    }
  }
}