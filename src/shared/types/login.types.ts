import { object, ObjectSchema, string, ref } from "yup";
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

export type InputsUserPassword = {
  email: string
  password: string
  confirmPassword: string
}

export type ForgotPasswordFormValues= {
  email: string;
}
export type ResetPasswordFormValues = {
  password: string
  confirmPassword: string
}
export type ResetPasswordPayload = {
  password: string
}

export type UserPasswordPayload = {
  email: string
  password: string
}

export type FormDataRegister = {
  personalInformation: InputsPersonalInformation
  userPasswordInfo: UserPasswordPayload
}

export type CreateUserPayload = {
  firstName: string
  middleName: string
  lastName: string
  email: string
  password: string
}

export type ResetPasswordStatus = "idle" | "success" | "error"
export type MessageCardState = {
  show: boolean;
  status: ResetPasswordStatus;
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

export interface CreateUserData {
  data: {
    userCreated: {
			email: string;
			firstName: string;
      middleName: string;
      lastName: string;
		}
  }
  error: null;
  message: null;
  success: boolean;
  version: string;
}

export interface ForgotPasswordData {
  data: null
  error: null;
  message: 'Email Sent';
  success: boolean;
  version: string;
}

export interface CreateUserError extends Omit<AxiosError, 'response'> {
  response: AxiosResponse<{
    error: {
      error: string
    }
  }>;
}

//#region Form schemas
const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

const emailValidation = string().email(ERROR_INVALID_EMAIL).required(ERROR_EMAIL_REQUIRED).matches(emailRegex, ERROR_INVALID_EMAIL);

const passwordValidation = (requiredMessage: string, onlyRequired = false) => {
  if (onlyRequired) return string().required(requiredMessage);
  return string()
    .required(requiredMessage)
    .min(16, 'La contraseña debe tener al menos 16 caracteres. Ingrese más caracteres')
    .max(40, 'La contraseña puede tener un máximo de 40 caracteres. Ha excedido los 40 caracteres')
    .matches(/[A-Z]+/, 'La contraseña debe contener al menos 1 mayúscula')
    .matches(/[a-z]+/, 'La contraseña debe contener al menos 1 minúscula')
    .matches(/[0-9]+/, 'La contraseña debe contener al menos 1 número')
    .matches(/^\S*$/, 'La contraseña no debe contener espacios en blanco.')
    .matches(
      /[!@#$%^&*()[\]{}+*\-_.,;:/<>?=`~\\|']+/,
      'La contraseña debe contener al menos 1 caracter especial como !@#$%^&*()[]{}+*-_.,;:/<>?=`~|\\|',
    );
};

const confirmPasswordValidation = string()
  .required('Por favor, ingrese su contraseña nuevamente')
  .oneOf([ref('password')], 'Contraseña y confirmar contraseña deben ser iguales.');

export const LoginSchema: ObjectSchema<LoginFormValues> = object().shape({
  email: emailValidation,
  password: string().required(ERROR_PASSWORD_REQUIRED)
})

export const PersonalInformationSchema: ObjectSchema<InputsPersonalInformation> = object().shape({
  firstName: string().required('Nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
  middleName: string().optional(),
  lastName: string().required('Apellido es requerido').min(2, 'El apellido debe tener al menos 2 caracteres')
})

export const UserAndPasswordSchema = object().shape({
  email: emailValidation,
  password: passwordValidation('Por favor, ingrese una contraseña'),
  confirmPassword: confirmPasswordValidation,
});

export const ForgotPasswordSchema: ObjectSchema<ForgotPasswordFormValues> = object().shape({
  email: emailValidation
})

export const ResetPasswordSchema = object().shape({
  password: passwordValidation('Por favor, ingrese una contraseña'),
  confirmPassword: confirmPasswordValidation,
})