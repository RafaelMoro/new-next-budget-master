import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import axios from 'axios';

import HomePage from "@/app/page";
import { QueryProviderWrapper } from "@/app/QueryProviderWrapper";
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock jose library to avoid ESM issues
// jest.mock('jose', () => ({
//   SignJWT: jest.fn().mockImplementation(() => ({
//     setProtectedHeader: jest.fn().mockReturnThis(),
//     setIssuedAt: jest.fn().mockReturnThis(),
//     setExpirationTime: jest.fn().mockReturnThis(),
//     sign: jest.fn().mockResolvedValue('mocked-jwt-token'),
//   })),
//   jwtVerify: jest.fn().mockResolvedValue({
//     payload: { accessToken: '' }
//   }),
// }));

// Mock getAccessToken since it's called in the page component
jest.mock('../src/shared/lib/auth.lib', () => ({
  getAccessToken: jest.fn(() => Promise.resolve('')),
  saveSessionCookie: jest.fn(),
  encodeAccessToken: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const Home = async ({ push }: { push: () => void }) => {
  const Page = await HomePage()
  return (
    <QueryProviderWrapper>
      <AppRouterContextProviderMock router={{ push }}>
        {Page}
      </AppRouterContextProviderMock>
    </QueryProviderWrapper>
  )
}

describe('Login', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  })

  it('Show the login page', async () => {
    const push = jest.fn();
    render(await Home({ push }))
 
    expect(screen.getByRole('heading', { name: /bienvenido de vuelta/i })).toBeInTheDocument()
    expect(screen.getByText(/ingrese sus credenciales para entrar a su cuenta\./i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  describe('Validation form', () => {
    it('Given the email being empty, show an error to the user', async () => {
      const user = userEvent.setup()
      const push = jest.fn();
      render(await Home({ push }))
    
      const signInButton = screen.getByRole('button', { name: /iniciar sesión/i })
      const pwdInput = screen.getByLabelText(/contraseña/i)
      await user.type(pwdInput, '1')
      await user.click(signInButton)
      expect(await screen.findByText(/Por favor, ingrese su correo electrónico/i))
    })

    it('Given a user filling the email wrong, show invalid email error ', async () => {
      const user = userEvent.setup()
      const push = jest.fn();
      render(await Home({ push }))
    
      const pwdInput = screen.getByLabelText(/contraseña/i)
      await user.type(pwdInput, '1')
      const emailInput = screen.getByLabelText(/correo electrónico/i)
      await user.type(emailInput, 'correo-electronico@a')
      const signInButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(signInButton)
      expect(await screen.findByText(/Correo electrónico inválido/i))
    })

    it('Given a user leaving the password empty, show password required error', async () => {
      const user = userEvent.setup()
      const push = jest.fn();
      render(await Home({ push }))
    
      const signInButton = screen.getByRole('button', { name: /iniciar sesión/i })
      await user.click(signInButton)
      expect(await screen.findByText(/Por favor, ingrese su contraseña/i))
    })
  })
})