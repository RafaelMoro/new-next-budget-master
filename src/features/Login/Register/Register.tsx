"use client"
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { useAnimateBox } from "@/shared/hooks/useAnimateBox";
import { Stepper } from "@/shared/ui/atoms/Stepper";
import { PersonalInformation } from "./PersonalInformation";
import { CreateUserData, CreateUserError, CreateUserPayload, FormDataRegister, InputsPersonalInformation, InputsUserPassword, UserPasswordPayload } from "@/shared/types/login.types";
import { UserRegistrationForm } from "./UserRegistration";
import { createUserCb } from "@/shared/utils/login.utils";
import { ResultCard } from "./ResultCard";
import { ERROR_CREATE_USER_MESSAGE, ERROR_CREATE_USER_TITLE, ERROR_EMAIL_IN_USE, ERROR_TRY_DIFFERENT_EMAIL, SUCCESS_CREATE_USER_MESSAGE, SUCCESS_CREATE_USER_TITLE } from "@/shared/constants/login.constants";
import { GeneralApiError, GeneralError } from "@/shared/types/global.types";

export const Register = () => {
  const steps = new Set(["Información Personal", "Usuario y contraseña", "Resultado"])
  const {
    direction, step, goPreviousView, goNextView, resetCounterView,
  } = useAnimateBox({ firstStep: 1, lastStepNumber: 3 });

  const {
      mutate: createUserMutation,
      isError,
      isPending,
      isSuccess,
      error
    } = useMutation<CreateUserData, GeneralApiError, CreateUserPayload>({
    mutationFn: createUserCb,
    onError: () => {
      goNextView()
    },
    onSuccess: () => {
      goNextView()
    }
  })
  const currentMessageError = error?.response?.data?.message
  const messageError = currentMessageError === ERROR_EMAIL_IN_USE ? ERROR_TRY_DIFFERENT_EMAIL : ERROR_CREATE_USER_MESSAGE

  const formData = useRef<FormDataRegister>({
    personalInformation: {
      firstName: "",
      middleName: "",
      lastName: ""
    },
    userPasswordInfo: {
      email: "",
      password: ""
    }
  })

  const updatePersonalInformation = (data: InputsPersonalInformation) => {
    formData.current.personalInformation = data
  }
  const updateUserPassword = (data: InputsUserPassword) => {
    const payload: UserPasswordPayload = {
      email: data.email,
      password: data.password
    }
    formData.current.userPasswordInfo = payload
  }

  const handleSubmit = async () => {
    try {
      const payload: CreateUserPayload = {
        firstName: formData.current.personalInformation.firstName,
        middleName: formData.current.personalInformation.middleName ?? '',
        lastName: formData.current.personalInformation.lastName,
        email: formData.current.userPasswordInfo.email,
        password: formData.current.userPasswordInfo.password,
      }
      createUserMutation(payload)
    } catch (error) {
      console.log('error when registering user', error)
    }
  }

  return (
    <>
      <div className="w-full flex justify-center">
        <Stepper steps={steps} currentStep={step} />
      </div>
      <div className="flex-1 flex justify-center items-center">
        { step === 1 && (
          <PersonalInformation
            nextCb={goNextView}
            direction={direction}
            personalInformation={formData.current.personalInformation}
            updatePersonalInformation={updatePersonalInformation}
          />
        )}
        { step === 2 && (
          <UserRegistrationForm
            direction={direction}
            goBack={goPreviousView}
            updateUserPasswordInfo={updateUserPassword}
            submitForm={handleSubmit}
            isLoading={isPending}
          />
        )}
        { (step === 3 && isError) && (
          <ResultCard
            direction={direction}
            isError={isError}
            title={ERROR_CREATE_USER_TITLE}
            message={messageError}
            resetStep={resetCounterView}
          />
        )}
        { (step === 3 && isSuccess) && (
          <ResultCard
            direction={direction}
            isError={isError}
            title={SUCCESS_CREATE_USER_TITLE}
            message={SUCCESS_CREATE_USER_MESSAGE}
            resetStep={resetCounterView}
          />
        )}
      </div>
    </>
  )
}