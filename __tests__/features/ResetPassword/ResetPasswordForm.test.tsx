import { QueryProviderWrapper } from '@/app/QueryProviderWrapper';
import { ResetPasswordForm } from '@/features/Login/ResetPassword/ResetPasswordForm';
import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ResetPasswordCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  })

  it('Show reset password card', () => {
    const mockToggleMessageCardState = jest.fn()
    const mockSlug = 'test-slug'
    render(
      <QueryProviderWrapper>
        <ResetPasswordForm slug={mockSlug} toggleMessageCardState={mockToggleMessageCardState}  />
      </QueryProviderWrapper>
    )
    expect(screen.getByText(/Ingresa tu nueva contraseña para reestablecer tu contraseña y continuar con el acceso seguro a tu cuenta./i)).toBeInTheDocument()
    expect(screen.getByTestId('password')).toBeInTheDocument()
    expect(screen.getByTestId('confirmPassword')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reestablecer contraseña/i })).toBeInTheDocument()
  })
})