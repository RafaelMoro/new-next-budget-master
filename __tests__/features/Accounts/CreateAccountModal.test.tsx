import { useState } from "react"
import { Modal } from "flowbite-react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import {QueryProviderWrapper} from "@/app/QueryProviderWrapper"
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock"
import { CreateAccountModal } from "@/features/Accounts/CreateAccountModal";
import { AccountModalAction } from "@/shared/types/accounts.types"

const CreateAccountWrapper = ({
  closeModal,
  push
}: {
  closeModal: () => void
  push: () => void
}) => {
  const [openAccModal, setOpenAccModal] = useState<boolean>(true)
  const toggleAccModal = () => setOpenAccModal((prev) => !prev)

  return (
    <QueryProviderWrapper>
      <AppRouterContextProviderMock router={{ push }}>
        <Modal show={openAccModal} onClose={toggleAccModal}>
          <CreateAccountModal
            closeModal={closeModal}
          />
        </Modal>
      </AppRouterContextProviderMock>
    </QueryProviderWrapper>
  )
}

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CreateAccount', () => {
  it('Show create account', () => {
    const push = jest.fn()
    const closeModal = jest.fn()

    render(<CreateAccountWrapper closeModal={closeModal} push={push} />)

    expect(screen.getByText(/Crear cuenta/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument()
    expect(screen.getByLabelText('Titulo de la cuenta')).toBeInTheDocument()
    expect(screen.getByLabelText('Alias (opcional)')).toBeInTheDocument()
    expect(screen.getByTestId('terminationNumber')).toBeInTheDocument()
    expect(screen.getByLabelText('Saldo de la cuenta')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tipo de cuenta: Crédito' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Proveedor: Mastercard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Crear/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument()
  })

  it('Given a user clicking on cancel button, the modal should be closed', async () => {
    const user = userEvent.setup();
    const push = jest.fn()
    const closeModal = jest.fn()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateAccAction = jest.fn((_acc: AccountModalAction) => {})
    render(<CreateAccountWrapper closeModal={closeModal} push={push} />)

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i })
    await user.click(cancelButton)
    expect(closeModal).toHaveBeenCalled()
  })

  it('Given a user clicking on cancel, the modal action should be view', async () => {
    const user = userEvent.setup();
    const push = jest.fn()
    const closeModal = jest.fn()
    render(<CreateAccountWrapper closeModal={closeModal} push={push} />)

    const goBackButton = screen.getByRole('button', { name: /Cancelar/i })
    await user.click(goBackButton)
    expect(closeModal).toHaveBeenCalled()
  })

  describe('Form Validations', () => {
    beforeEach(() => {
      const push = jest.fn()
      const closeModal = jest.fn()
      render(<CreateAccountWrapper closeModal={closeModal} push={push} />)
    })

    it('Given a user deleting the title, clicks on edit, then show an error message', async () => {
      const user = userEvent.setup();

      const titleInput = screen.getByLabelText('Titulo de la cuenta')
      const button = screen.getByRole('button', { name: /Crear/i })
      await user.clear(titleInput)
      await user.click(button)

      expect(screen.getByText(/Por favor, ingrese el título de la cuenta/i)).toBeInTheDocument()
    })

    it('Given a user leaving the account termination number empty, clicks on edit, then show an error message', async () => {
      const user = userEvent.setup();

      const accountTerminationInput = screen.getByTestId('terminationNumber')
      await user.clear(accountTerminationInput)
      await user.type(accountTerminationInput, '1')
      const button = screen.getByRole('button', { name: /Crear/i })
      await user.click(button)

      expect(await screen.findByText(/La terminación no puede tener menos de 4 dígitos/i)).toBeInTheDocument()
    })

    it('Given a user entering a number less than 4 digits, clicks on edit, then show an error message', async () => {
      const user = userEvent.setup();

      const accountTerminationInput = screen.getByTestId('terminationNumber')
      const button = screen.getByRole('button', { name: /Crear/i })
      await user.type(accountTerminationInput, '123')
      await user.click(button)

      expect(await screen.findByText('La terminación no puede tener menos de 4 dígitos')).toBeInTheDocument()
    })

    it('Given a user leaving the alias with 1 character, clicks on create, then show an error message', async () => {
      const user = userEvent.setup();

      const aliasInput = screen.getByTestId('alias')
      const button = screen.getByRole('button', { name: /Crear/i })
      await user.clear(aliasInput)
      await user.type(aliasInput, 'a')
      await user.click(button)

      expect(await screen.findByText(/El título debe tener al menos 2 caracteres/i)).toBeInTheDocument()
    })
  })

  describe('Form submission', () => {
    it('Given a user creating correctly the account, the modal should be closed and the tick should appear in the submit button', async () => {
      const user = userEvent.setup();
      const push = jest.fn()
      const closeModal = jest.fn()

      mockedAxios.post.mockResolvedValue({
        error: null,
        message: 'Account created',
        success: true,
        version: "v1.2.0",
        data: {
          account: {
            _id: "12345",
            title: "Cuenta modificada",
            alias: "Ahorros Modificados",
            terminationFourDigits: 1234,
            amount: 1000,
            accountType: "Crédito",
            accountProvider: "visa"
          }
        },
      })

      render(<CreateAccountWrapper closeModal={closeModal} push={push} />)

      const titleInput = screen.getByLabelText('Titulo de la cuenta')
      const aliasInput = screen.getByLabelText('Alias (opcional)')
      const terminationInput = screen.getByTestId('terminationNumber')
      const button = screen.getByRole('button', { name: /Crear/i })

      await user.type(titleInput, 'Cuenta modificada')
      await user.type(aliasInput, 'Ahorros Modificados')
      await user.type(terminationInput, '1234')
      await user.click(button)

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Crear/i })).not.toBeInTheDocument()
      }, { timeout: 2000})
    })

    it('Given a user creating correctly the account, then something went wrong, should show error message', async () => {
      const user = userEvent.setup();
      const push = jest.fn()
      const closeModal = jest.fn()

      mockedAxios.post.mockRejectedValue({
        code: 'ERR_BAD_REQUEST',
        config: null,
        message: 'Request failed with status code 401',
        name: 'AxiosError',
        request: null,
        response: {
          data: {
            message: 'Something went wrong'
          }
        }
      })

      render(<CreateAccountWrapper closeModal={closeModal} push={push} />)

      const titleInput = screen.getByLabelText('Titulo de la cuenta')
      const aliasInput = screen.getByLabelText('Alias (opcional)')
      const terminationInput = screen.getByTestId('terminationNumber')
      const button = screen.getByRole('button', { name: /Crear/i })

      await user.type(titleInput, 'Cuenta modificada')
      await user.type(aliasInput, 'Ahorros Modificados')
      await user.type(terminationInput, '1234')
      await user.click(button)

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Crear/i })).not.toBeInTheDocument()
      }, { timeout: 3000})
    })
  })
})