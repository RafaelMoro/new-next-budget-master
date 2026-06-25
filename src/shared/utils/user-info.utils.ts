import { SAVE_SELECTED_ACCOUNT_API_ENDPOINT } from "../constants/global.constants"
import { AccountsCookie } from "../types/accounts.types"

/**
 * This function calls the API to save the selected account in the cookie for client side components
 * @param accountId - AccountDisplay
 * @returns Promise<void>
 */
export const saveAccountApi = async (account: AccountsCookie) => {
  try {
    const res = await fetch(SAVE_SELECTED_ACCOUNT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ account }),
    })
    return res
  } catch (error) {
    console.log('error while saving theme in api', error)
  }
}