import axios from "axios";
import { CreateUserData, CreateUserPayload, ForgotPasswordData, ForgotPasswordFormValues, LoginData, LoginFormValues } from "../types/login.types";
import { CookieObject } from "../types/global.types";
import { CREATE_USER_API_ENDPOINT, FORGOT_PASSWORD_API_ENDPOINT, LOGIN_API_ENDPOINT } from "../constants/global.constants";

export const LoginMutationCb = async (data: LoginFormValues): Promise<LoginData> => {
  try {
    const response = await axios.post(LOGIN_API_ENDPOINT, data)
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

export const createUserCb = async (payload: CreateUserPayload): Promise<CreateUserData> => {
  try {
    const response = await axios.post<CreateUserData>(CREATE_USER_API_ENDPOINT, payload)
    const data = response.data
    return data
  } catch (error) {
    throw error
  }
}

export const forgotPasswordCb = async (payload: ForgotPasswordFormValues): Promise<ForgotPasswordData> => {
  try {
    const response = await axios.post<ForgotPasswordData>(FORGOT_PASSWORD_API_ENDPOINT, payload)
    const data = response.data
    return data
  } catch (error) {
    throw error
  }
}