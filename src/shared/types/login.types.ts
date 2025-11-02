import { object, ObjectSchema, string } from "yup";
import { ERROR_INVALID_EMAIL, ERROR_EMAIL_REQUIRED, ERROR_PASSWORD_REQUIRED } from "../constants/login.constants";

export type LoginFormValues = {
  email: string;
  password: string;
}

//#region Form schemas
const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

const emailValidation = string().email(ERROR_INVALID_EMAIL).required(ERROR_EMAIL_REQUIRED).matches(emailRegex, ERROR_INVALID_EMAIL);

export const LoginSchema: ObjectSchema<LoginFormValues> = object().shape({
  email: emailValidation,
  password: string().required(ERROR_PASSWORD_REQUIRED)
})