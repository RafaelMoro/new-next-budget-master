import '@testing-library/jest-dom'
import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ForgotPasswordPage from '@/app/forgot-password/page';
import { QueryProviderWrapper } from '@/app/QueryProviderWrapper';
import { AppRouterContextProviderMock } from '@/shared/ui/organisms/AppRouterContextProviderMock';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'mocked-theme' })),
    set: jest.fn(),
  })),
}));

const ForgotPassword = ({ push }: { push: () => void }) => {
  return (
    <QueryProviderWrapper>
      <AppRouterContextProviderMock router={{ push }}>
        <ForgotPasswordPage />
      </AppRouterContextProviderMock>
    </QueryProviderWrapper>
  )
}

describe('ForgotPasswordPage', () => {
  it('should render the forgot password page', () => {
    const push = jest.fn();
    render(
      <ForgotPassword push={push} />
    )
    expect(screen.getByRole('heading', { name: /recupera tu cuenta en un momento/i })).toBeInTheDocument()
    expect(screen.getByText(/te mandaremos un enlace seguro/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /volver/i })).toBeInTheDocument()
  })

  describe('Form validation', () => {
    it ('Given a user leaving the email input empty, show error', async () => {
      const user = userEvent.setup()
      const push = jest.fn();
      render(
        <ForgotPassword push={push} />
      )

      const button = screen.getByRole('button', { name: /enviar/i })
      await user.click(button)

      expect(await screen.findByText(/Por favor, ingrese su correo electrónico/i)).toBeInTheDocument()
    })

    it ('Given a user leaving the email input empty, show error', async () => {
      const user = userEvent.setup()
      const push = jest.fn();
      render(
        <ForgotPassword push={push} />
      )

      const button = screen.getByRole('button', { name: /enviar/i })
      const email = screen.getByLabelText(/correo electrónico/i)
      await user.type(email, 'a@a')
      await user.click(button)

      expect(await screen.findByText(/Correo electrónico inválido/i)).toBeInTheDocument()
    })
  })
  describe('Send form data', () => {
    it('Given a user entering a correct email, redirect to home', async () => {
      const user = userEvent.setup()
      const push = jest.fn();
      mockedAxios.post.mockResolvedValue({
        error: null,
        message: 'Email sent',
        success: true,
        version: "v1.2.0",
        data: null,
      })
      render(
        <ForgotPassword push={push} />
      )
  
      const button = screen.getByRole('button', { name: /enviar/i })
      const email = screen.getByLabelText(/correo electrónico/i)
      await user.type(email, 'example@example.com')
      await user.click(button)
  
      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/')
      }, { timeout: 2000 })
    })

    it('Given a user entering a correct email, and something goes wrong, show error message', async () => {
      const user = userEvent.setup()
      const push = jest.fn();
      mockedAxios.post.mockRejectedValue({
        response: {
          data: {
            message: 'Something went wrong.'
          }
        }
      })
      render(
        <ForgotPassword push={push} />
      )
  
      const button = screen.getByRole('button', { name: /enviar/i })
      const email = screen.getByLabelText(/correo electrónico/i)
      await user.type(email, 'example@example.com')
      await user.click(button)
  
      expect(await screen.findByText(/Oops! Algo no salió como esperabamos./i)).toBeInTheDocument()
    })
  })
})