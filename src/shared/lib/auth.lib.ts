"use server"
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from "jose";
import { ACCOUNT_COOKIE_KEY, DASHBOARD_SCREEN_KEY, OVERVIEW_SUBSCREEN_KEY, SESSION_COOKIE_KEY } from '../constants/global.constants';
import { JWT_ERROR_VERIFY } from '../constants/login.constants';
import { deleteThemeCookie, removePreferenceCookie } from './preferences.lib';

export const saveSessionCookie = async (session: string): Promise<void> => {
  try {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_KEY, session, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 5 // 5 days
    })
  } catch (error) {
    console.error('Error saving session cookie:', error)
  }
}

export const encodeAccessToken = async (cookieValue: string): Promise<string> => {
  const secretKey = process.env.SESSION_SECRET_KEY!
  const encodedKey = new TextEncoder().encode(secretKey)
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await new SignJWT({ accessToken: cookieValue })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiredAt)
    .sign(encodedKey)
  return session
}

export const getAccessToken = async () => {
  try {
    const secretKey = process.env.SESSION_SECRET_KEY!
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE_KEY)?.value
    if (!session) {
      return ''
    }
  
    const encodedKey = new TextEncoder().encode(secretKey)
    const jwtDecoded = await jwtVerify(session, encodedKey)
    const accessToken = jwtDecoded?.payload?.accessToken as string
    return accessToken
  } catch (error) {
    if (error instanceof Error && error.message === JWT_ERROR_VERIFY) {
      return ''
    }
    return ''
  }
}

export const deleteSession = async () => {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_KEY)
  } catch (error) {
    console.log('error deleting session', error)
  }
}

export const signOut = async () => {
  await deleteSession()
  await removePreferenceCookie(ACCOUNT_COOKIE_KEY)
  await removePreferenceCookie(OVERVIEW_SUBSCREEN_KEY)
  await removePreferenceCookie(DASHBOARD_SCREEN_KEY)
  await deleteThemeCookie()
}