"use client"
import { useRef } from "react";

import { useAnimateBox } from "@/shared/hooks/useAnimateBox";
import { Stepper } from "@/shared/ui/atoms/Stepper";
import { PersonalInformation } from "./PersonalInformation";
import { FormDataRegister, InputsPersonalInformation } from "@/shared/types/login.types";

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
      </div>
    </>
  )
}