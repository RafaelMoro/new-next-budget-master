import { NextRequest, NextResponse } from "next/server"
import { savePreferenceCookie } from "@/shared/lib/preferences.lib"
import { ErrorCatched } from "@/shared/types/global.types"
import { ACCOUNT_COOKIE_KEY } from "@/shared/constants/global.constants"
import { AccountsCookie } from "@/shared/types/accounts.types"

/**
 * Saves the account selected of type AccountsDisplay in a cookie
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const account: AccountsCookie = payload?.account
    if (!account) {
      return NextResponse.json({ message: 'Account is required' }, { status: 400 })
    }

    const accountParsed = JSON.stringify(account)
    await savePreferenceCookie({ cookieKey: ACCOUNT_COOKIE_KEY, cookieValue: accountParsed })
    return NextResponse.json({ success: true, selectedAccount: account }, { status: 201 })
  } catch (error: unknown) {
    const currentError = error as ErrorCatched
    return NextResponse.json({ message: currentError.message }, { status: 400 })
  }
}