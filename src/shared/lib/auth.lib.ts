import { cookies } from 'next/headers'
import { SignJWT } from "jose";
import { SESSION_COOKIE_KEY } from '../constants/global.constants';

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