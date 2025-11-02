"use server"
import { cookies } from 'next/headers'

import { THEME_COOKIE_KEY } from '../constants/global.constants'
import { ThemeMode } from '../types/global.types'

/**
 * This function gets the value of the theme in the cookie. It sets the cookie if it doesn't exist
 * @returns string. If not found, return default 'dark'
 */
export const getThemePreference = async () => {
  try {
    const cookieStore = await cookies()
    const theme = cookieStore.get(THEME_COOKIE_KEY)?.value
    if (!theme) {
      // Return default
      return 'dark'
    }
    return theme
  } catch {
    // During static generation, cookies are not available
    // Return default theme
    return 'dark'
  }
}

/**
 * This function saves the theme in the cookie
 * @param theme - The theme mode to save
 * @returns Promise<void>
 */
export const saveThemeCookie = async (theme: ThemeMode): Promise<void> => {
  try {
    const cookieStore = await cookies()
    cookieStore.set(THEME_COOKIE_KEY, theme, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })
  } catch (error) {
    console.error('Error saving theme preference:', error)
  }
}

export const deleteThemeCookie = async () => {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(THEME_COOKIE_KEY)
  } catch (error) {
    console.error('Error deleting theme preference:', error)
  }
}