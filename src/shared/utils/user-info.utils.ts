/**
 * This function calls the API to save the selected account in the cookie for client side components
 * @param accountId - string
 * @returns Promise<void>
 */
export const saveAccountApi = async (accountId: string) => {
  try {
    const res = await fetch('/api/preferences/selected-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId }),
    })
    return res
  } catch (error) {
    console.log('error while saving theme in api', error)
  }
}