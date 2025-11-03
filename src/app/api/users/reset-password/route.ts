import axios from "axios";
import { type NextRequest, NextResponse } from 'next/server'

import { GeneralError } from "@/shared/types/global.types";
import { ResetPasswordData, ResetPasswordPayload } from "@/shared/types/login.types";

export async function POST(request: NextRequest): Promise<NextResponse<ResetPasswordData | { message?: string }>> {
  try {
    const payload: ResetPasswordPayload = await request.json()
    const { slug } = payload
    const uri = `${process.env.BACKEND_URI}/users/reset-password/${slug}`
    const res = await axios.post<ResetPasswordData>(uri, { password: payload.password })
    const data = res.data

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    const message = (error as unknown as GeneralError)?.response?.data?.error?.message
    return NextResponse.json({ message }, { status: 400 })
  }
}