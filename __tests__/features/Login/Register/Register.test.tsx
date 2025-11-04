import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { Register } from "@/features/Login/Register/Register";
import { QueryProviderWrapper } from "@/app/QueryProviderWrapper";
import { CREATE_USER_API_ENDPOINT } from "@/shared/constants/global.constants";
import {
  ERROR_CREATE_USER_TITLE,
  ERROR_CREATE_USER_MESSAGE,
  ERROR_EMAIL_IN_USE,
  ERROR_TRY_DIFFERENT_EMAIL,
} from "@/shared/constants/login.constants";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const RegisterWithProviders = () => (
  <QueryProviderWrapper>
    <Register />
  </QueryProviderWrapper>
);

describe('Register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the stepper and first step (Personal Information)', () => {
    render(<RegisterWithProviders />);

    expect(screen.getByText('Información Personal')).toBeInTheDocument();
    expect(screen.getByText('Usuario y contraseña')).toBeInTheDocument();
    expect(screen.getByText('Resultado')).toBeInTheDocument();

    // Check first step is active
    expect(screen.getByTestId('firstName')).toBeInTheDocument();
    expect(screen.getByTestId('middleName')).toBeInTheDocument();
    expect(screen.getByLabelText('Apellido')).toBeInTheDocument();
  });

  it('navigates from step 1 to step 2 when form is valid', async () => {
    const user = userEvent.setup();
    render(<RegisterWithProviders />);

    // Fill step 1
    await user.type(screen.getByTestId('firstName'), 'John');
    await user.type(screen.getByTestId('middleName'), 'Paul');
    await user.type(screen.getByLabelText('Apellido'), 'Doe');
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));

    // Check step 2 is rendered
    await waitFor(() => {
      expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
      expect(screen.getAllByLabelText(/Contraseña/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeInTheDocument();
    });
  });

  it('navigates back from step 2 to step 1', async () => {
    const user = userEvent.setup();
    render(<RegisterWithProviders />);

    // Navigate to step 2
    await user.type(screen.getByTestId('firstName'), 'John');
    await user.type(screen.getByLabelText('Apellido'), 'Doe');
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    });

    // Go back
    await user.click(screen.getByRole('button', { name: /Regresar/i }));

    // Check step 1 is rendered again
    await waitFor(() => {
      expect(screen.getByTestId('firstName')).toBeInTheDocument();
    });
  });

  it('submits the form successfully and shows success result', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<RegisterWithProviders />);

    // Step 1: Fill personal information
    await user.type(screen.getByTestId('firstName'), 'John');
    await user.type(screen.getByTestId('middleName'), 'Paul');
    await user.type(screen.getByLabelText('Apellido'), 'Doe');
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));

    // Step 2: Fill user registration
    await waitFor(() => {
      expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInputs = screen.getAllByLabelText(/Contraseña/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'ValidPassword1234!');
    await user.type(confirmPasswordInput, 'ValidPassword1234!');
    await user.click(screen.getByRole('button', { name: /Crear cuenta/i }));

    // Check API was called with correct payload
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        CREATE_USER_API_ENDPOINT,
        {
          firstName: 'John',
          middleName: 'Paul',
          lastName: 'Doe',
          email: 'test@example.com',
          password: 'ValidPassword1234!',
        }
      );
    });

    // Check success result is shown
    await waitFor(() => {
      expect(screen.getByText('¡Bienvenido!')).toBeInTheDocument();
      expect(screen.getByText('Tu cuenta ya está lista')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /regresar al inicio/i })).toBeInTheDocument();
    });
  });

  it('handles API error and shows error result with generic message', async () => {
    const user = userEvent.setup();
    const mockError = {
      response: {
        data: {
          message: 'Something went wrong',
        },
      },
    };

    mockedAxios.post.mockRejectedValueOnce(mockError);

    render(<RegisterWithProviders />);

    // Step 1: Fill personal information
    await user.type(screen.getByTestId('firstName'), 'John');
    await user.type(screen.getByLabelText('Apellido'), 'Doe');
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));

    // Step 2: Fill user registration
    await waitFor(() => {
      expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInputs = screen.getAllByLabelText(/Contraseña/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'ValidPassword1234!');
    await user.type(confirmPasswordInput, 'ValidPassword1234!');
    await user.click(screen.getByRole('button', { name: /Crear cuenta/i }));

    // Check error result is shown
    await waitFor(() => {
      expect(screen.getByText(ERROR_CREATE_USER_TITLE)).toBeInTheDocument();
      expect(screen.getByText(ERROR_CREATE_USER_MESSAGE)).toBeInTheDocument();
    });
  });

  it('handles email in use error and shows specific error message', async () => {
    const user = userEvent.setup();
    const mockError = {
      response: {
        data: {
          message: ERROR_EMAIL_IN_USE,
        },
      },
    };

    mockedAxios.post.mockRejectedValueOnce(mockError);

    render(<RegisterWithProviders />);

    // Step 1: Fill personal information
    await user.type(screen.getByTestId('firstName'), 'John');
    await user.type(screen.getByLabelText('Apellido'), 'Doe');
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));

    // Step 2: Fill user registration
    await waitFor(() => {
      expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInputs = screen.getAllByLabelText(/Contraseña/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i);

    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, 'ValidPassword1234!');
    await user.type(confirmPasswordInput, 'ValidPassword1234!');
    await user.click(screen.getByRole('button', { name: /Crear cuenta/i }));

    // Check specific email error message is shown
    await waitFor(() => {
      expect(screen.getByText(ERROR_CREATE_USER_TITLE)).toBeInTheDocument();
      expect(screen.getByText(ERROR_TRY_DIFFERENT_EMAIL)).toBeInTheDocument();
    });
  });

  it('resets to step 1 when retry button is clicked after error', async () => {
    const user = userEvent.setup();
    const mockError = {
      response: {
        data: {
          message: 'Error',
        },
      },
    };

    mockedAxios.post.mockRejectedValueOnce(mockError);

    render(<RegisterWithProviders />);

    // Navigate through steps and trigger error
    await user.type(screen.getByTestId('firstName'), 'John');
    await user.type(screen.getByLabelText('Apellido'), 'Doe');
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInputs = screen.getAllByLabelText(/Contraseña/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'ValidPassword1234!');
    await user.type(confirmPasswordInput, 'ValidPassword1234!');
    await user.click(screen.getByRole('button', { name: /Crear cuenta/i }));

    // Wait for error result
    await waitFor(() => {
      expect(screen.getByText(ERROR_CREATE_USER_TITLE)).toBeInTheDocument();
    });

    // Click retry button
    await user.click(screen.getByRole('button', { name: /volver a intentar/i }));

    // Check we're back at step 1
    await waitFor(() => {
      expect(screen.getByTestId('firstName')).toBeInTheDocument();
      expect(screen.getByTestId('middleName')).toBeInTheDocument();
      expect(screen.getByLabelText('Apellido')).toBeInTheDocument();
    });
  });

  it('persists form data when navigating between steps', async () => {
    const user = userEvent.setup();
    render(<RegisterWithProviders />);

    // Fill step 1
    await user.type(screen.getByTestId('firstName'), 'John');
    await user.type(screen.getByTestId('middleName'), 'Paul');
    await user.type(screen.getByLabelText('Apellido'), 'Doe');
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));

    // Go to step 2
    await waitFor(() => {
      expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    });

    // Go back
    await user.click(screen.getByRole('button', { name: /Regresar/i }));

    // Check data is still there
    await waitFor(() => {
      expect(screen.getByTestId('firstName')).toHaveValue('John');
      expect(screen.getByTestId('middleName')).toHaveValue('Paul');
      expect(screen.getByLabelText('Apellido')).toHaveValue('Doe');
    });
  });

  it('updates stepper to show current step progress', async () => {
    const user = userEvent.setup();
    render(<RegisterWithProviders />);

    // Check step 1 is active (blue)
    const step1Circle = screen.getByText('1').closest('div');
    expect(step1Circle).toHaveClass('bg-blue-800');

    // Navigate to step 2
    await user.type(screen.getByTestId('firstName'), 'John');
    await user.type(screen.getByLabelText('Apellido'), 'Doe');
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    });

    // Check step 2 is active
    const step2Circle = screen.getByText('2').closest('div');
    expect(step2Circle).toHaveClass('bg-blue-800');
  });
});
