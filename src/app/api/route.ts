import axios from "axios";
import { type NextRequest, NextResponse } from 'next/server'

import { getCookieProps } from "@/shared/utils/login.utils";
import { encodeAccessToken, saveSessionCookie } from "@/shared/lib/auth.lib";
import { GeneralError } from "@/shared/types/global.types";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const uri = `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/`
    const res = await axios.post(uri, payload)
    const cookiesReceived = res.headers['set-cookie']

    if (cookiesReceived) {
      const [cookie] = cookiesReceived
      const { value: cookieValue } = getCookieProps(cookie)
      const session = await encodeAccessToken(cookieValue)
      await saveSessionCookie(session)
      
      const response = NextResponse.json({ data: res.data }, { status: 201 })
      response.cookies.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 5 // 5 days
      });
      return response
    }

    return NextResponse.json({ message: 'missing cookie' }, { status: 400 })
  } catch (error) {
    const message = (error as unknown as GeneralError)?.response?.data?.error?.message
    return NextResponse.json({ message }, { status: 400 })
  }
}