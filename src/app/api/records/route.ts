import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

import { getAccessToken } from "@/shared/lib/auth.lib"
import { GeneralError } from "@/shared/types/global.types"
import { GET_EXPENSES_AND_INCOMES_BY_MONTH_ROUTE } from "@/shared/constants/records.constants"
import { GetAccountPayload } from "@/shared/types/records.types"

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken()
    const payload: GetAccountPayload = await request.json()
    const { accountId, month, year } = payload
    const uri = `${process.env.BACKEND_URI}${GET_EXPENSES_AND_INCOMES_BY_MONTH_ROUTE}/${accountId}/${month}/${year}`
    const res = await axios.get(uri, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    return NextResponse.json(res.data, { status: 200 })
  } catch (error) {
    console.error('Error fetching records:', error);
    const message = (error as unknown as GeneralError)?.response?.data?.error?.message
    return NextResponse.json({ message }, { status: 400 })
  }
}