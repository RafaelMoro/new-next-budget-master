import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateAccountButton } from '@/features/Accounts/CreateAccountButton';
import { AppRouterContextProviderMock } from '@/shared/ui/organisms/AppRouterContextProviderMock';
import {QueryProviderWrapper} from '@/app/QueryProviderWrapper';

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
};

describe('CreateAccButton', () => {
  it('renders the Crear cuenta button', () => {
    render(
      <QueryProviderWrapper>
        <AppRouterContextProviderMock router={mockRouter}>
          <CreateAccountButton />
        </AppRouterContextProviderMock>
      </QueryProviderWrapper>
    );
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
  });

  it('opens modal with CreateAccount when button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <QueryProviderWrapper>
        <AppRouterContextProviderMock router={mockRouter}>
          <CreateAccountButton />
        </AppRouterContextProviderMock>
      </QueryProviderWrapper>
    );
    const button = screen.getByRole('button', { name: /crear cuenta/i });
    await user.click(button);
    // Check for the CreateAccount modal heading
    expect(screen.getByRole('heading', { name: /crear cuenta/i })).toBeInTheDocument();
  });
});
