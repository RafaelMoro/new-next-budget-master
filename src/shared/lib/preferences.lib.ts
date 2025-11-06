"use server"
import { cookies } from 'next/headers'

import { ACCOUNT_COOKIE_KEY, DASHBOARD_SCREEN_KEY, THEME_COOKIE_KEY } from '../constants/global.constants'
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

export const getAccountCookie = async () => {
  try {
    const cookieStore = await cookies()
    const account = cookieStore.get(ACCOUNT_COOKIE_KEY)?.value
    if (!account) {
      // Return default
      return null
    }
    return account
  } catch (error) {
    console.error('Error deleting theme preference:', error)
  }
}

/**
 * This function saves the dashboard subscreen selection into the cookie
 * @param dashboardScreen - The dashboard subscreen
 * @returns Promise<void>
 */
export const saveDashboardScreen = async (dashboardScreen: string): Promise<void> => {
  try {
    const cookieStore = await cookies()
    cookieStore.set(DASHBOARD_SCREEN_KEY, dashboardScreen, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  })
  } catch (error) {
    console.error('Error saving dashboard preference:', error)
  }
}

/**
 * This function gets the value of the dashboard screen in the cookie.
 * @returns string or null if not found
 */
export const getDashboardScreen = async () => {
  try {
    const cookieStore = await cookies()
    const dashboardScreen = cookieStore.get(DASHBOARD_SCREEN_KEY)?.value
    if (!dashboardScreen) {
      // Return default
      return null
    }
    return dashboardScreen
  } catch (error) {
    console.error('Error getting dashboard screen preference:', error)
  }
}

export const removePreferenceCookie = async (cookieKey: string) => {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(cookieKey)
  } catch (error) {
    console.log(`error deleting ${cookieKey} cookie`, error)
  }
}

export const getPreferencesCookie = async (cookie: string) => {
  try {
    const cookieStore = await cookies()
    const cookieValue = cookieStore.get(cookie)?.value
    if (!cookieValue) {
      // Return default
      return null
    }
    return cookieValue
  } catch (error) {
    console.error(`Error getting ${cookie} preference:`, error)
  }
}

export const savePreferenceCookie = async ({ cookieKey, cookieValue }: { cookieKey: string, cookieValue: string }) => {
  try {
    const cookieStore = await cookies()
    cookieStore.set(cookieKey, cookieValue, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })
  } catch (error) {
    console.error(`Error saving cookie ${cookieKey}:`, error)
  }
}