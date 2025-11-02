"use client"
import { useRef } from "react";

import { useAnimateBox } from "@/shared/hooks/useAnimateBox";
import { Stepper } from "@/shared/ui/atoms/Stepper";
import { PersonalInformation } from "./PersonalInformation";
import { CreateUserPayload, FormDataRegister, InputsPersonalInformation, InputsUserPassword, UserPasswordPayload } from "@/shared/types/login.types";
import { UserRegistrationForm } from "./UserRegistration";

export const Register = () => {
  const steps = new Set(["Información Personal", "Usuario y contraseña", "Resultado"])
  const {
    direction, step, goPreviousView, goNextView, resetCounterView,
  } = useAnimateBox({ firstStep: 1, lastStepNumber: 3 });

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
      // createUserMutation(payload)
    } catch (error) {
      console.log('error when registering user', error)
    }
  }

  return (
    <>
      <Stepper steps={steps} currentStep={step} />
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
            isLoading={false}
          />
        )}
      </div>
    </>
  )
}