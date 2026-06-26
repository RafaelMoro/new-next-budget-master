import axios from "axios";
import { type NextRequest, NextResponse } from 'next/server'

import { getAccessToken } from "@/shared/lib/auth.lib";
import { GeneralError } from "@/shared/types/global.types";
import { CreateTransferPayload, TransferDataResponse } from "@/shared/types/records.types";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken()
    const payload: CreateTransferPayload = await request.json()
    const uri = `${process.env.BACKEND_URI}/records/transfer`
    const res = await axios.post<TransferDataResponse>(uri, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    const data = res?.data

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating a transfer:', error);
    const message = (error as unknown as GeneralError)?.response?.data?.error?.message
    return NextResponse.json({ message }, { status: 400 })
  }
}
