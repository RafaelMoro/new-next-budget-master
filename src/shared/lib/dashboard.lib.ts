import { FetchAccountsResponse, GetAccountsResponse } from "../types/accounts.types";
import { ErrorCatched } from "../types/global.types";
import { getAccessToken } from "./auth.lib";

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