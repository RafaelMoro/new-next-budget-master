"use client"
import { useState } from "react"

import { MessageCardState, ResetPasswordStatus } from "@/shared/types/login.types"
import { ResetPasswordForm } from "./ResetPasswordForm"
import { PasswordResetStatusCard } from "./ResetPasswordStatusCard"

export const ResetPassword = ({ slug }: { slug: string }) => {
  const [messageCardState, setmessageCardState] = useState<MessageCardState>({
    show: false,
    status: "idle"
  })
  const toggleMessageCardState = (state: ResetPasswordStatus) => {
    setmessageCardState({ show: true, status: state })
  }
  return (
    <>
      { !messageCardState.show && (
        <h1 className="text-4xl text-center font-bold">
          Estás a un paso de volver
        </h1>
      ) }
      { messageCardState.show && (
        <h1 className="text-4xl text-center font-bold">
          { messageCardState.status === "success" ? "🟢 ¡Contraseña cambiada con éxito!" : "🚫 No pudimos restablecer tu contraseña"}
        </h1>
      ) }
      { !messageCardState.show && (<ResetPasswordForm slug={slug} toggleMessageCardState={toggleMessageCardState} />) }
      { messageCardState.show && (<PasswordResetStatusCard status={messageCardState.status} />) }
    </>
  )
}