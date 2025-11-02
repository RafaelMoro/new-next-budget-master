import HomePage from "@/app/page";
import { QueryProviderWrapper } from "@/app/QueryProviderWrapper";
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock";
import { render, screen } from "@testing-library/react";

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