import { render, screen } from '@testing-library/react';
import {QueryProviderWrapper} from '@/app/QueryProviderWrapper';
import { AppRouterContextProviderMock } from '@/shared/ui/organisms/AppRouterContextProviderMock';
import { NoAccountsFoundScreen } from '@/features/Accounts/NoAccountsFoundScreen';

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
};

describe('NoAccountsFoundScreen', () => {
  it('renders the correct title for each screen', () => {
    const titles = {
      overview: 'Panorama general',
      accounts: 'Cuentas bancarias',
      transactions: 'Transacciones',
      budgets: 'Presupuestos',
    };
    (Object.keys(titles) as Array<keyof typeof titles>).forEach((screenKey) => {
      render(
        <QueryProviderWrapper>
          <AppRouterContextProviderMock router={mockRouter}>
            <NoAccountsFoundScreen screen={screenKey} />
          </AppRouterContextProviderMock>
        </QueryProviderWrapper>
      );
      expect(screen.getByRole('heading', { name: titles[screenKey] })).toBeInTheDocument();
    });
  });

  it('renders the empty accounts message and image', () => {
    render(
      <QueryProviderWrapper>
        <AppRouterContextProviderMock router={mockRouter}>
          <NoAccountsFoundScreen screen="accounts" />
        </AppRouterContextProviderMock>
      </QueryProviderWrapper>
    );
    expect(screen.getByText('Aún no tienes cuentas registradas')).toBeInTheDocument();
    expect(screen.getByText('¡Todo empieza aquí! Agrega una cuenta bancaria y empieza a organizar tus finanzas sin estrés.')).toBeInTheDocument();
    expect(screen.getByAltText('No accounts found')).toBeInTheDocument();
  });

  it('renders the CreateAccButton', () => {
    render(
      <QueryProviderWrapper>
        <AppRouterContextProviderMock router={mockRouter}>
          <NoAccountsFoundScreen screen="accounts" />
        </AppRouterContextProviderMock>
      </QueryProviderWrapper>
    );
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
  });
});