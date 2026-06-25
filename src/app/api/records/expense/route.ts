import axios from "axios";
import { type NextRequest, NextResponse } from 'next/server'

import { GeneralError } from "@/shared/types/global.types";
import { CreateExpensePayload, DeleteRecordPayload, EditExpensePayload, ExpenseDataResponse } from "@/shared/types/records.types";
import { getAccessToken } from "@/shared/lib/auth.lib";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken()
    const payload: CreateExpensePayload = await request.json()
    const uri = `${process.env.BACKEND_URI}/expenses-actions`
    const res = await axios.post<ExpenseDataResponse>(uri, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    const data = res?.data

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating an expense:', error);
    const message = (error as unknown as GeneralError)?.response?.data?.error?.message
    return NextResponse.json({ message }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const accessToken = await getAccessToken()
    const payload: EditExpensePayload = await request.json()
    const uri = `${process.env.BACKEND_URI}/expenses-actions`
    const res = await axios.put<ExpenseDataResponse>(uri, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    const data = res?.data

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error updating expense:', error);
    const message = (error as unknown as GeneralError)?.response?.data?.error?.message
    return NextResponse.json({ message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const accessToken = await getAccessToken()
    const payload: DeleteRecordPayload = await request.json()
    const uri = `${process.env.BACKEND_URI}/expenses-actions`
    const res = await axios.delete(uri, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      data: payload
    })
    return NextResponse.json({ data: res.data }, { status: 200 })
  } catch (error) {
    const message = (error as unknown as GeneralError)?.response?.data?.error?.message
    return NextResponse.json({ message }, { status: 400 })
  }
}