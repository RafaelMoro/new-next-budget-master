import HomePage from "@/app/page";
import { QueryProviderWrapper } from "@/app/QueryProviderWrapper";
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock";
import { render, screen } from "@testing-library/react";

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
})