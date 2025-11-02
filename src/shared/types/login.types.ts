import { object, ObjectSchema, string } from "yup";
import type { AxiosError, AxiosResponse } from "axios";

import { ERROR_INVALID_EMAIL, ERROR_EMAIL_REQUIRED, ERROR_PASSWORD_REQUIRED } from "../constants/login.constants";

export type LoginFormValues = {
  email: string;
  password: string;
}

export type InputsPersonalInformation = {
  firstName: string
  middleName?: string
  lastName: string
}

//#region Data interfaces
export interface LoginData {
  data: {
    user: {
      email: string;
      firstName: string;
      lastName: string;
      middleName: string;
      _id: string
      __v: number
    }
  }
  error: null;
  message: null;
  success: boolean;
  version: string;
}

export interface LoginError extends Omit<AxiosError, 'response'> {
  response: AxiosResponse<{
    message: string;
  }>;
}

//#region Form schemas
const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

const emailValidation = string().email(ERROR_INVALID_EMAIL).required(ERROR_EMAIL_REQUIRED).matches(emailRegex, ERROR_INVALID_EMAIL);

export const LoginSchema: ObjectSchema<LoginFormValues> = object().shape({
  email: emailValidation,
  password: string().required(ERROR_PASSWORD_REQUIRED)
})

export const PersonalInformationSchema: ObjectSchema<InputsPersonalInformation> = object().shape({
  firstName: string().required('Nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
  middleName: string().optional(),
  lastName: string().required('Apellido es requerido').min(2, 'El apellido debe tener al menos 2 caracteres')
})