import { useState } from "react"
import { render, screen } from "@testing-library/react"
import { Modal } from "flowbite-react"
import userEvent from '@testing-library/user-event';

import { AccountDetailsModal } from "@/features/Accounts/AccountDetailsModal";
import { AccountModalAction, AccountsDisplay } from "@/shared/types/accounts.types"

const AccountDetailsWrapper = ({
  updateAccAction
}: {
  updateAccAction: (acc: AccountModalAction) => void
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
    accountProvider: "mastercard"
  }

  return (
    <Modal show={openAccModal} onClose={toggleAccModal}>
      <AccountDetailsModal
        account={account}
        updateAccAction={updateAccAction}
      />
    </Modal>
  )
}

describe('AccountDetails', () => {
  it('Show account details', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateAccAction = jest.fn((_acc: AccountModalAction) => {})
    render(<AccountDetailsWrapper updateAccAction={updateAccAction} />)

    expect(screen.getByRole('heading', { name: /HSBC clasica/i })).toBeInTheDocument()
    expect(screen.getByText(/Balance: \$1,000.00/i)).toBeInTheDocument()
    expect(screen.getByText(/Tipo de cuenta: Crédito/i)).toBeInTheDocument()
    expect(screen.getByText(/Terminación: \*\*1234/i)).toBeInTheDocument()
    expect(screen.getByText(/Alias: Ahorros/i)).toBeInTheDocument()
    expect(screen.getByText(/Tarjeta emitida por: Mastercard/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Eliminar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument()
  })

  it('Given a user clicking on edit button, expect the function being called with edit action', async () => {
    const user = userEvent.setup();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateAccAction = jest.fn((_acc: AccountModalAction) => {})
    render(<AccountDetailsWrapper updateAccAction={updateAccAction} />)

    const editButton = screen.getByRole('button', { name: /Editar/i })
    await user.click(editButton)
    expect(updateAccAction).toHaveBeenCalledWith('edit')
  })
})