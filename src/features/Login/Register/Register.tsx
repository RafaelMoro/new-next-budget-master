"use client"
import { useAnimateBox } from "@/shared/hooks/useAnimateBox";
import { Stepper } from "@/shared/ui/atoms/Stepper";

export const Register = () => {
  const steps = new Set(["Información Personal", "Usuario y contraseña", "Resultado"])
  const {
    direction, step, goPreviousView, goNextView, resetCounterView,
  } = useAnimateBox({ firstStep: 1, lastStepNumber: 3 });

  return (
    <>
      <Stepper steps={steps} currentStep={step} />
      <div className="flex-1 flex justify-center items-center">
        
      </div>
    </>
  )
}