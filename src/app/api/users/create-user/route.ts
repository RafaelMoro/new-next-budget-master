import axios from "axios";
import { type NextRequest, NextResponse } from 'next/server'

import { GeneralError } from "@/shared/types/global.types";
import { CreateUserData, CreateUserPayload } from "@/shared/types/login.types";

export async function POST(request: NextRequest): Promise<NextResponse<CreateUserData | { message?: string }>> {
  try {
    const payload: CreateUserPayload = await request.json()
    const uri = `${process.env.BACKEND_URI}/users`
    const res = await axios.post<CreateUserData>(uri, payload)
    const data = res.data

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    const message = (error as unknown as GeneralError)?.response?.data?.error?.message
    return NextResponse.json({ message }, { status: 400 })
  }
}