"use server"
import axios from "axios";

import { FetchAccountsResponse, GetAccountsResponse } from "../types/accounts.types";
import { ErrorCatched } from "../types/global.types";
import { GetCurrentMonthRecordsResponse, GetRecordsResponse } from "../types/records.types";
import { getRecordsCurrentMonthError } from "../utils/dashboard.utils";
import { getDateInfo } from "../utils/getDateInfo";
import { getAccessToken } from "./auth.lib";
import { GET_EXPENSES_AND_INCOMES_BY_MONTH_ROUTE, NO_RECORDS_FOUND } from "../constants/records.constants";

export const fetchAccounts = async (): Promise<GetAccountsResponse> => {
  try {
    const accessToken = await getAccessToken()
    if (!accessToken) {
      return {
        detailedError: {
         message: 'No access token provided'
        },
        accounts: []
      }
    }
    const uri = process.env.BACKEND_URI
    if (!uri) {
      throw new Error("Backend URI is not defined");
    }

    const res = await fetch(`${uri}/account-actions`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    })
    const data: FetchAccountsResponse = await res.json()
    const { data: { accounts } } = data;
    return {
      detailedError: null,
      accounts
    }
  } catch (error: unknown) {
    console.error('Error fetching accounts:', error);
    if ((error as ErrorCatched)?.cause?.code) {
      return {
        detailedError: {
          message: (error as ErrorCatched)?.message,
          cause: (error as ErrorCatched)?.cause?.code
        },
        accounts: []
      }
    }

    return {
      detailedError: {
        message: (error as ErrorCatched)?.message
      },
      accounts: []
    }
  }
}

export const fetchRecordsCurrentMonth = async ({ accountId }: { accountId: string | null }): Promise<GetCurrentMonthRecordsResponse> => {
  try {
    if (!accountId) {
      return getRecordsCurrentMonthError('Account ID is required to fetch records for the current month');
    }
    const uri = process.env.BACKEND_URI
    if (!uri) {
      return getRecordsCurrentMonthError('Backend URI is not defined');
    }
    const accessToken = await getAccessToken()
    if (!accessToken) {
      return getRecordsCurrentMonthError('No access token provided');
    }

    const {
      month, year,
    } = getDateInfo();
    const res: GetRecordsResponse = await axios.get(`${uri}${GET_EXPENSES_AND_INCOMES_BY_MONTH_ROUTE}/${accountId}/${month}/${year}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    if (res?.data?.message === NO_RECORDS_FOUND) {
      return {
        detailedError: null,
        message: NO_RECORDS_FOUND,
        records: []
      }
    }
    const records = res?.data.data.records
    return {
      detailedError: null,
      message: null,
      records
    }
  } catch (error: unknown) {
    console.error('Error fetching records:', error);
    if ((error as ErrorCatched)?.cause?.code) {
      return {
        detailedError: {
          message: (error as ErrorCatched)?.message,
          cause: (error as ErrorCatched)?.cause?.code
        },
        message: null,
        records: []
      }
    }

    return {
      detailedError: {
        message: (error as ErrorCatched)?.message
      },
      message: null,
      records: []
    }
  }
}