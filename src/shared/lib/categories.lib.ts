"use server"

import { FetchCategoriesResponse, GetCategoriesResponse } from "../types/categories.types"
import { ErrorCatched } from "../types/global.types"
import { getAccessToken } from "./auth.lib"

export const fetchCategories = async (): Promise<GetCategoriesResponse> => {
  try {
    const accessToken = await getAccessToken()
    if (!accessToken) {
      return {
        detailedError: {
         message: 'No access token provided'
        },
        categories: []
      }
    }
    const uri = process.env.NEXT_PUBLIC_BACKEND_URI
    if (!uri) {
      throw new Error("Backend URI is not defined");
    }

    const res = await fetch(`${uri}/categories`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    })
    const data: FetchCategoriesResponse = await res.json()
    const { data: { categories } } = data;
    return {
      detailedError: null,
      categories
    }
  } catch (error: unknown) {
    console.error('Error fetching categories:', error);
    if ((error as ErrorCatched)?.cause?.code) {
      return {
        detailedError: {
          message: (error as ErrorCatched)?.message,
          cause: (error as ErrorCatched)?.cause?.code
        },
        categories: []
      }
    }

    return {
      detailedError: {
        message: (error as ErrorCatched)?.message
      },
      categories: []
    }
  }
}