import { NextRequest, NextResponse } from "next/server"

import { saveThemeCookie } from "@/shared/lib/preferences.lib"
import { ErrorCatched, ThemeMode } from "@/shared/types/global.types"
import { THEME_COOKIE_KEY } from "@/shared/constants/global.constants"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const theme: ThemeMode = payload?.theme
    if (!theme) {
      return NextResponse.json({ message: 'Theme is required' }, { status: 400 })
    }

    await saveThemeCookie(theme)
    const response = NextResponse.json({ success: true, themeChangedTo: theme }, { status: 201 })
    response.cookies.set(THEME_COOKIE_KEY, theme, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return response
  } catch (error: unknown) {
    const currentError = error as ErrorCatched
    return NextResponse.json({ message: currentError.message }, { status: 400 })
  }
}