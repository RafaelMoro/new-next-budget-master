import { render, screen } from "@testing-library/react"
import { PasswordResetStatusCard } from "@/features/Login/ResetPassword/ResetPasswordStatusCard"

describe('PasswordResetStatusCard', () => {
  it('Show Password reset status card success', () => {
    render(<PasswordResetStatusCard status="success" />)

    expect(screen.getByText("Tu nueva contraseña ya está activa.")).toBeInTheDocument()
    expect(screen.getByText("Inicia sesión y sigue conquistando tus finanzas.")).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Regresar al inicio/i })).toBeInTheDocument()
  })

  it('Show Password reset status card error', () => {
    render(<PasswordResetStatusCard status="error" />)

    expect(screen.getByText("Parece que hubo un problema.")).toBeInTheDocument()
    expect(screen.getByText("Vuelve a iniciar el proceso desde “Olvidé mi contraseña” y lo resolvemos en segundos.")).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Regresar al inicio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ir a olvidé mi contraseña/i })).toBeInTheDocument()
  })
})