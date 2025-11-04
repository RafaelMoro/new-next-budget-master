import { UserRegistrationForm } from '@/features/Login/Register/UserRegistration' 
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('UserRegistrationForm', () => {
  it('should render the form fields and buttons', () => {
    const goBack = jest.fn()
    const updateUserPassword = jest.fn()
    const handleSubmit = jest.fn()
    const isPending = false

    render(
      <UserRegistrationForm
        direction={1}
        goBack={goBack}
        updateUserPasswordInfo={updateUserPassword}
        submitForm={handleSubmit}
        isLoading={isPending}
      />)

    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument()
    // Use getAllByLabelText for Contraseña since there are two fields with similar label
    expect(screen.getAllByLabelText(/Contraseña/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Regresar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Crear cuenta/i })).toBeInTheDocument()
  })

  it('should allow typing in the input fields', async () => {
    const user = userEvent.setup()
    const goBack = jest.fn()
    const updateUserPassword = jest.fn()
    const handleSubmit = jest.fn()
    const isPending = false

    render(
      <UserRegistrationForm
        direction={1}
        goBack={goBack}
        updateUserPasswordInfo={updateUserPassword}
        submitForm={handleSubmit}
        isLoading={isPending}
      />)
  
    const emailInput = screen.getByLabelText(/Correo electrónico/i)
    // Use getAllByLabelText for Contraseña
    const passwordInputs = screen.getAllByLabelText(/Contraseña/i)
    const passwordInput = passwordInputs[0]
    const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i)
  
    await user.type(emailInput, 'testuser@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')

    expect(emailInput).toHaveValue('testuser@example.com')
    expect(passwordInput).toHaveValue('password123')
    expect(confirmPasswordInput).toHaveValue('password123')
  })

  it('should call goBack when Regresar button is clicked', async () => {
    const user = userEvent.setup()
    const goBack = jest.fn()
    const updateUserPassword = jest.fn()
    const handleSubmit = jest.fn()
    const isPending = false

    render(
      <UserRegistrationForm
        direction={1}
        goBack={goBack}
        updateUserPasswordInfo={updateUserPassword}
        submitForm={handleSubmit}
        isLoading={isPending}
      />)
  
    const backButton = screen.getByRole('button', { name: /Regresar/i })
    await user.click(backButton)
    expect(goBack).toHaveBeenCalled()
  })
})
