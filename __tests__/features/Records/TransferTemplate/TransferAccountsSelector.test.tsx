import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TransferAccountsSelector } from "@/features/Records/Transfer/TransferAccountsSelector"
import { AccountTransfer } from "@/shared/types/accounts.types"

const santander: AccountTransfer = {
  accountId: "1",
  name: "Santander",
  type: "Crédito",
}

const hsbc: AccountTransfer = {
  accountId: "2",
  name: "HSBC oro",
  type: "Crédito",
}

describe("TransferAccountsSelector", () => {
  it("renders both account dropdowns", () => {
    render(
      <TransferAccountsSelector
        accountsFormatted={[santander, hsbc]}
        destinationAccounts={[hsbc]}
        destination={null}
        destinationError={null}
        isPending={false}
        origin={santander}
        updateDestination={jest.fn()}
        updateOrigin={jest.fn()}
      />
    )

    expect(screen.getByText(/Origen: Santander/i)).toBeInTheDocument()
    expect(screen.getByText(/Destino:/i)).toBeInTheDocument()
  })

  it("destination dropdown excludes the origin account", async () => {
    const user = userEvent.setup()

    render(
      <TransferAccountsSelector
        accountsFormatted={[santander, hsbc]}
        destinationAccounts={[hsbc]}
        destination={null}
        destinationError={null}
        isPending={false}
        origin={santander}
        updateDestination={jest.fn()}
        updateOrigin={jest.fn()}
      />
    )

    await user.click(screen.getByTestId("select-destination-dropdown-button"))

    expect(screen.getByText("HSBC oro")).toBeInTheDocument()
    expect(screen.queryByText("Santander")).not.toBeInTheDocument()
  })

  it("renders destination error when provided", () => {
    render(
      <TransferAccountsSelector
        accountsFormatted={[santander, hsbc]}
        destinationAccounts={[hsbc]}
        destination={null}
        destinationError="Por favor, seleccione una cuenta de destino."
        isPending={false}
        origin={santander}
        updateDestination={jest.fn()}
        updateOrigin={jest.fn()}
      />
    )

    expect(screen.getByText(/Por favor, seleccione una cuenta de destino./i)).toBeInTheDocument()
  })

  it("disables both dropdowns while pending", () => {
    render(
      <TransferAccountsSelector
        accountsFormatted={[santander, hsbc]}
        destinationAccounts={[hsbc]}
        destination={null}
        destinationError={null}
        isPending
        origin={santander}
        updateDestination={jest.fn()}
        updateOrigin={jest.fn()}
      />
    )

    expect(screen.getByTestId("select-origin-dropdown-button")).toBeDisabled()
    expect(screen.getByTestId("select-destination-dropdown-button")).toBeDisabled()
  })
})
