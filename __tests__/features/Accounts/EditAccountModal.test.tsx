import { useState } from "react"
import { Modal } from "flowbite-react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import {QueryProviderWrapper} from "@/app/QueryProviderWrapper"
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock"
import { EditAccountModal } from "@/features/Accounts/EditAccountModal";
import { AccountModalAction, AccountsDisplay } from "@/shared/types/accounts.types"

const EditAccountWrapper = ({
  closeModal,
  updateAccAction,
  push
}: {
  closeModal: () => void
  updateAccAction: (acc: AccountModalAction) => void
  push: () => void
}) => {
  const [openAccModal, setOpenAccModal] = useState<boolean>(true)
  const toggleAccModal = () => setOpenAccModal((prev) => !prev)

  const account: AccountsDisplay = {
    accountId: "12345",
    name: "HSBC clasica",
    amount: "$1,000.00",
    type: "Crédito",
    alias: "Ahorros",
    terminationFourDigits: 1234,
    terminationFourDigitsTransformed: "**1234",
    accountProvider: "visa"
  }

  return (
    <QueryProviderWrapper>
      <AppRouterContextProviderMock router={{ push }}>
        <Modal show={openAccModal} onClose={toggleAccModal}>
          <EditAccountModal
            account={account}
            closeModal={closeModal}
            updateAccAction={updateAccAction}
          />
        </Modal>
      </AppRouterContextProviderMock>
    </QueryProviderWrapper>
  )
}

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EditAccount', () => {
  it('Show edit account', () => {
    const push = jest.fn()
    const closeModal = jest.fn()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateAccAction = jest.fn((_acc: AccountModalAction) => {})

    render(<EditAccountWrapper closeModal={closeModal} updateAccAction={updateAccAction} push={push} />)

    expect(screen.getByText(/HSBC clasica/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Volver/i })).toBeInTheDocument()
    expect(screen.getByLabelText('Titulo de la cuenta')).toBeInTheDocument()
    expect(screen.getByLabelText('Alias (opcional)')).toBeInTheDocument()
    expect(screen.getByTestId('terminationNumber')).toBeInTheDocument()
    expect(screen.getByLabelText('Saldo de la cuenta')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tipo de cuenta: Crédito' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Proveedor: Visa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument()
  })

  it('Given a user clicking on cancel button, the modal should be closed', async () => {
    const user = userEvent.setup();
    const push = jest.fn()
    const closeModal = jest.fn()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateAccAction = jest.fn((_acc: AccountModalAction) => {})
    render(<EditAccountWrapper closeModal={closeModal} updateAccAction={updateAccAction} push={push} />)

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i })
    await user.click(cancelButton)
    expect(closeModal).toHaveBeenCalled()
  })

  it('Given a user clicking on go back button, the modal action should be view', async () => {
    const user = userEvent.setup();
    const push = jest.fn()
    const closeModal = jest.fn()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateAccAction = jest.fn((_acc: AccountModalAction) => {})
    render(<EditAccountWrapper closeModal={closeModal} updateAccAction={updateAccAction} push={push} />)

    const goBackButton = screen.getByRole('button', { name: /Volver/i })
    await user.click(goBackButton)
    expect(updateAccAction).toHaveBeenCalledWith('view')
  })

  describe('Form Validations', () => {
    beforeEach(() => {
      const push = jest.fn()
      const closeModal = jest.fn()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updateAccAction = jest.fn((_acc: AccountModalAction) => {})
      render(<EditAccountWrapper closeModal={closeModal} updateAccAction={updateAccAction} push={push} />)
    })

    it('Given a user deleting the title, clicks on edit, then show an error message', async () => {
      const user = userEvent.setup();

      const titleInput = screen.getByLabelText('Titulo de la cuenta')
      const button = screen.getByRole('button', { name: /Editar/i })
      await user.clear(titleInput)
      await user.click(button)

      expect(screen.getByText(/Por favor, ingrese el título de la cuenta/i)).toBeInTheDocument()
    })

    it('Given a user deleting the account termination number, typing 1 number, clicks on edit, then show an error message', async () => {
      const user = userEvent.setup();

      const accountTerminationInput = screen.getByTestId('terminationNumber')
      const button = screen.getByRole('button', { name: /Editar/i })
      await user.type(accountTerminationInput, '{backspace}{backspace}{backspace}{backspace}')
      await user.type(accountTerminationInput, '1')
      await user.click(button)

      expect(await screen.findByText(/La terminación no puede tener menos de 4 dígitos/i)).toBeInTheDocument()
    })

    it('Given a user entering a number less than 4 digits, clicks on edit, then show an error message', async () => {
      const user = userEvent.setup();

      const accountTerminationInput = screen.getByTestId('terminationNumber')
      const button = screen.getByRole('button', { name: /Editar/i })
      await user.clear(accountTerminationInput)
      await user.type(accountTerminationInput, '123')
      await user.click(button)

      expect(await screen.findByText('La terminación no puede tener menos de 4 dígitos')).toBeInTheDocument()
    })

    it('Given a user deleting the alias, typing 1 character, clicks on edit, then show an error message', async () => {
      const user = userEvent.setup();

      const aliasInput = screen.getByTestId('alias')
      await user.clear(aliasInput)
      await user.type(aliasInput, 'a')
      const button = screen.getByRole('button', { name: /Editar/i })
      await user.click(button)

      expect(await screen.findByText(/El título debe tener al menos 2 caracteres/i)).toBeInTheDocument()
    })
  })

  describe('Form submission', () => {
    it('Given a user editing correctly the account, the modal should be closed and the tick should appear in the submit button', async () => {
      const user = userEvent.setup();
      const push = jest.fn()
      const closeModal = jest.fn()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updateAccAction = jest.fn((_acc: AccountModalAction) => {})

      mockedAxios.put.mockResolvedValue({
        error: null,
        message: 'Account updated',
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

      render(<EditAccountWrapper closeModal={closeModal} updateAccAction={updateAccAction} push={push} />)

      const titleInput = screen.getByLabelText('Titulo de la cuenta')
      const button = screen.getByRole('button', { name: /Editar/i })

      await user.clear(titleInput)
      await user.type(titleInput, 'Cuenta modificada')
      await user.click(button)

      await waitFor(() => {
        expect(closeModal).toHaveBeenCalled()
        expect(screen.getByTestId('success-button')).toBeInTheDocument()
      }, { timeout: 2000})
    })

    it('Given a user editing correctly the account, then something went wrong, should show error message', async () => {
      const user = userEvent.setup();
      const push = jest.fn()
      const closeModal = jest.fn()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updateAccAction = jest.fn((_acc: AccountModalAction) => {})

      mockedAxios.put.mockRejectedValue({
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

      render(<EditAccountWrapper closeModal={closeModal} updateAccAction={updateAccAction} push={push} />)

      const titleInput = screen.getByLabelText('Titulo de la cuenta')
      const button = screen.getByRole('button', { name: /Editar/i })

      await user.clear(titleInput)
      await user.type(titleInput, 'Cuenta modificada')
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('modal-overlay')).toBeInTheDocument()
      }, { timeout: 3000})
    })
  })
})