import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { ResetPassword } from "@/features/Login/ResetPassword/ResetPassword";
import { QueryProviderWrapper } from "@/app/QueryProviderWrapper";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const ResetPasswordWithProviders = ({ slug }: { slug: string }) => (
  <QueryProviderWrapper>
    <ResetPassword slug={slug} />
  </QueryProviderWrapper>
);

describe('ResetPassword', () => {
  const mockSlug = 'test-slug-123';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the initial state with form and heading', () => {
    render(<ResetPasswordWithProviders slug={mockSlug} />);

    expect(screen.getByRole('heading', { name: /estás a un paso de volver/i })).toBeInTheDocument();
    expect(screen.getByText(/ingresa tu nueva contraseña para reestablecer tu contraseña/i)).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPassword')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reestablecer contraseña/i })).toBeInTheDocument();
  });

  it('does not show the status card initially', () => {
    render(<ResetPasswordWithProviders slug={mockSlug} />);

    expect(screen.queryByText(/tu nueva contraseña ya está activa/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/parece que hubo un problema/i)).not.toBeInTheDocument();
  });

  it('shows success status card after successful password reset', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValue({
      error: null,
      message: 'Reset Password Successfully',
      success: true,
      version: "v1.2.0",
      data: null,
    });

    render(<ResetPasswordWithProviders slug={mockSlug} />);

    const pwdInput = screen.getByTestId('password');
    const confirmPwdInput = screen.getByTestId('confirmPassword');
    const resetButton = screen.getByRole('button', { name: /reestablecer contraseña/i });

    await user.type(pwdInput, 'ValidPassword1234@');
    await user.type(confirmPwdInput, 'ValidPassword1234@');
    await user.click(resetButton);

    // Wait for success status card to appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /contraseña cambiada con éxito/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/tu nueva contraseña ya está activa/i)).toBeInTheDocument();
    expect(screen.getByText(/inicia sesión y sigue conquistando tus finanzas/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /regresar al inicio/i })).toBeInTheDocument();
  });

  it('shows error status card after failed password reset', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockRejectedValue({
      response: {
        data: {
          message: 'Something went wrong',
        },
      },
    });

    render(<ResetPasswordWithProviders slug={mockSlug} />);

    const pwdInput = screen.getByTestId('password');
    const confirmPwdInput = screen.getByTestId('confirmPassword');
    const resetButton = screen.getByRole('button', { name: /reestablecer contraseña/i });

    await user.type(pwdInput, 'ValidPassword1234@');
    await user.type(confirmPwdInput, 'ValidPassword1234@');
    await user.click(resetButton);

    // Wait for error status card to appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /no pudimos restablecer tu contraseña/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/parece que hubo un problema/i)).toBeInTheDocument();
    expect(screen.getByText(/vuelve a iniciar el proceso desde/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /regresar al inicio/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ir a olvidé mi contraseña/i })).toBeInTheDocument();
  });

  it('hides the form when success status card is shown', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValue({
      error: null,
      message: 'Reset Password Successfully',
      success: true,
      version: "v1.2.0",
      data: null,
    });

    render(<ResetPasswordWithProviders slug={mockSlug} />);

    const pwdInput = screen.getByTestId('password');
    const confirmPwdInput = screen.getByTestId('confirmPassword');
    const resetButton = screen.getByRole('button', { name: /reestablecer contraseña/i });

    await user.type(pwdInput, 'ValidPassword1234@');
    await user.type(confirmPwdInput, 'ValidPassword1234@');
    await user.click(resetButton);

    // Wait for success status card to appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /contraseña cambiada con éxito/i })).toBeInTheDocument();
    });

    // Verify form is not visible
    expect(screen.queryByTestId('password')).not.toBeInTheDocument();
    expect(screen.queryByTestId('confirmPassword')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reestablecer contraseña/i })).not.toBeInTheDocument();
  });

  it('hides the form when error status card is shown', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockRejectedValue({
      response: {
        data: {
          message: 'Something went wrong',
        },
      },
    });

    render(<ResetPasswordWithProviders slug={mockSlug} />);

    const pwdInput = screen.getByTestId('password');
    const confirmPwdInput = screen.getByTestId('confirmPassword');
    const resetButton = screen.getByRole('button', { name: /reestablecer contraseña/i });

    await user.type(pwdInput, 'ValidPassword1234@');
    await user.type(confirmPwdInput, 'ValidPassword1234@');
    await user.click(resetButton);

    // Wait for error status card to appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /no pudimos restablecer tu contraseña/i })).toBeInTheDocument();
    });

    // Verify form is not visible
    expect(screen.queryByTestId('password')).not.toBeInTheDocument();
    expect(screen.queryByTestId('confirmPassword')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reestablecer contraseña/i })).not.toBeInTheDocument();
  });

  it('changes heading from initial to success state', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValue({
      error: null,
      message: 'Reset Password Successfully',
      success: true,
      version: "v1.2.0",
      data: null,
    });

    render(<ResetPasswordWithProviders slug={mockSlug} />);

    // Check initial heading
    expect(screen.getByRole('heading', { name: /estás a un paso de volver/i })).toBeInTheDocument();

    const pwdInput = screen.getByTestId('password');
    const confirmPwdInput = screen.getByTestId('confirmPassword');
    const resetButton = screen.getByRole('button', { name: /reestablecer contraseña/i });

    await user.type(pwdInput, 'ValidPassword1234@');
    await user.type(confirmPwdInput, 'ValidPassword1234@');
    await user.click(resetButton);

    // Check heading changed to success
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /contraseña cambiada con éxito/i })).toBeInTheDocument();
    });

    // Initial heading should not be visible
    expect(screen.queryByRole('heading', { name: /estás a un paso de volver/i })).not.toBeInTheDocument();
  });

  it('changes heading from initial to error state', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockRejectedValue({
      response: {
        data: {
          message: 'Something went wrong',
        },
      },
    });

    render(<ResetPasswordWithProviders slug={mockSlug} />);

    // Check initial heading
    expect(screen.getByRole('heading', { name: /estás a un paso de volver/i })).toBeInTheDocument();

    const pwdInput = screen.getByTestId('password');
    const confirmPwdInput = screen.getByTestId('confirmPassword');
    const resetButton = screen.getByRole('button', { name: /reestablecer contraseña/i });

    await user.type(pwdInput, 'ValidPassword1234@');
    await user.type(confirmPwdInput, 'ValidPassword1234@');
    await user.click(resetButton);

    // Check heading changed to error
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /no pudimos restablecer tu contraseña/i })).toBeInTheDocument();
    });

    // Initial heading should not be visible
    expect(screen.queryByRole('heading', { name: /estás a un paso de volver/i })).not.toBeInTheDocument();
  });

  it('passes the slug prop to the form component', async () => {
    const user = userEvent.setup();
    const customSlug = 'custom-slug-456';
    
    mockedAxios.post.mockResolvedValue({
      error: null,
      message: 'Reset Password Successfully',
      success: true,
      version: "v1.2.0",
      data: null,
    });

    render(<ResetPasswordWithProviders slug={customSlug} />);

    const pwdInput = screen.getByTestId('password');
    const confirmPwdInput = screen.getByTestId('confirmPassword');
    const resetButton = screen.getByRole('button', { name: /reestablecer contraseña/i });

    await user.type(pwdInput, 'ValidPassword1234@');
    await user.type(confirmPwdInput, 'ValidPassword1234@');
    await user.click(resetButton);

    // Verify the API was called with the custom slug
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          slug: customSlug,
          password: 'ValidPassword1234@',
        })
      );
    });
  });
});
