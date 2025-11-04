import axios from "axios";
import { type NextRequest, NextResponse } from 'next/server'

import { getAccessToken } from "@/shared/lib/auth.lib";
import { GeneralError } from "@/shared/types/global.types";
import { CreateAccountPayload, DeleteAccountPayload, EditAccountPayload } from "@/shared/types/accounts.types";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken()
    const payload: CreateAccountPayload = await request.json()
    const uri = `${process.env.BACKEND_URI}/account-actions/`
    const res = await axios.post(uri, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    const data = res?.data

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating account:', error);
    const message = (error as unknown as GeneralError)?.response?.data?.error?.message
    return NextResponse.json({ message }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const accessToken = await getAccessToken()
    const payload: EditAccountPayload = await request.json()
    const uri = `${process.env.BACKEND_URI}/account-actions/`
    const res = await axios.put(uri, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    const data = res?.data

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error updating account:', error);
    const message = (error as unknown as GeneralError)?.response?.data?.error?.message
    return NextResponse.json({ message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const accessToken = await getAccessToken()
    const payload: DeleteAccountPayload = await request.json()
    const uri = `${process.env.BACKEND_URI}/account-actions/`
    const res = await axios.delete(uri, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      data: payload
    })
    const data = res.data

    return NextResponse.json(data, { status: 201 })
  }  catch (error) {
    console.error('Error deleting account:', error);
    const message = (error as unknown as GeneralError)?.response?.data?.error?.message
    return NextResponse.json({ message }, { status: 400 })
  }
}