import { render, screen } from "@testing-library/react"
import { Modal } from "flowbite-react"
import userEvent from '@testing-library/user-event'

import { AccountActionsModal } from "@/features/Accounts/AccountActionsModal"
import { useAccountModal } from "@/shared/hooks/useAccountModal"
import { AccountsDisplay } from "@/shared/types/accounts.types"

const mockAccount: AccountsDisplay = {
  accountId: '1',
  name: 'Test Account',
  amount: '1000',
  type: 'Crédito',
  accountProvider: 'visa',
  terminationFourDigits: 1234,
  terminationFourDigitsTransformed: '**1234',
  alias: 'Ahorros'
}

const AccountDialogWrapper = ({
  useAccNull = false
}: {
  useAccNull?: boolean
}) => {
  const {
    openAccModal,
    accDetails,
    accAction,
    openModal,
    closeModal,
    updateAccAction
  } = useAccountModal()
  const accountDetails = useAccNull ? null : accDetails
  return (
    <>
      <button onClick={() => openModal(mockAccount)}>Open</button>
      <Modal show={openAccModal} onClose={closeModal}>
        <AccountActionsModal
          accDetails={accountDetails}
          openAccModal={openAccModal}
          accAction={accAction}
          closeModal={closeModal}
          updateAccAction={updateAccAction}
        />
      </Modal>
    </>
  )
}

describe('AccountsDialog', () => {
  it('Show account dialog', async () => {
    const user = userEvent.setup()
    render(<AccountDialogWrapper />)

    const openButton = screen.getByRole('button', { name: /open/i })
    await user.click(openButton)

    expect(screen.getByRole('heading', { name: /Test account/i })).toBeInTheDocument()
    expect(screen.getByText(/Balance: 1000/i)).toBeInTheDocument()
    expect(screen.getByText(/Tipo de cuenta: Crédito/i)).toBeInTheDocument()
    expect(screen.getByText(/Terminación: \*\*1234/i)).toBeInTheDocument()
    expect(screen.getByText(/Alias: Ahorros/i)).toBeInTheDocument()
    expect(screen.getByText(/Tarjeta emitida por: Visa/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Eliminar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument()
  })

  it('Do not show modal if account is null', async () => {
    const user = userEvent.setup()
    render(<AccountDialogWrapper useAccNull />)

    const openButton = screen.getByRole('button', { name: /open/i })
    await user.click(openButton)

    expect(screen.queryByRole('heading', { name: /Test account/i })).not.toBeInTheDocument()
  })
})