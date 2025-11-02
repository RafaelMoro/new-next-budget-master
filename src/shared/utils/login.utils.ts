import axios from "axios";
import { CreateUserData, CreateUserPayload, LoginData, LoginFormValues } from "../types/login.types";
import { CookieObject } from "../types/global.types";

export const LoginMutationCb = async (data: LoginFormValues): Promise<LoginData> => {
  try {
    const response = await axios.post('/api', data)
    return response.data
  } catch (error) {
    throw error
  }
}

export function getCookieProps(setCookieStr: string): CookieObject {
  const parts = setCookieStr.split(";").map(s => s.trim());
  const [nameValue] = parts;
  const eqIdx = nameValue.indexOf("=");
  const name = nameValue.substring(0, eqIdx);
  const value = nameValue.substring(eqIdx + 1);

  return { name, value };
}

export const createUserCb = (data: CreateUserPayload): Promise<CreateUserData> => {
  const uri = process.env.NEXT_PUBLIC_BACKEND_URI
  if (!uri) {
    throw new Error("Backend URI is not defined");
  }
  return axios.post(`${uri}/users`, data)
}