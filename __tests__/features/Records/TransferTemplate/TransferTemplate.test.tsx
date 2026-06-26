import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axios from "axios"

import { QueryProviderWrapper } from "@/app/QueryProviderWrapper"
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock"
import { TransferTemplate } from "@/features/Records/TransferTemplate"
import { mockCategories } from "../../../mocks/categories.mock"
import { mockAccounts } from "../../../mocks/accounts.mock"
import { AccountsCookie, GetAccountsResponse } from "@/shared/types/accounts.types"
import { DESTINATION_ACC_REQUIRED } from "@/shared/constants/records.constants"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const mockAccount: AccountsCookie = {
  accountId: "1",
  name: "Santander",
  type: "Crédito",
}

const resAccounts: GetAccountsResponse = {
  detailedError: null,
  accounts: mockAccounts,
}

function TransferTemplateTestWrapper() {
  return (
    <QueryProviderWrapper>
      <AppRouterContextProviderMock router={{ push: jest.fn(), refresh: jest.fn() }}>
        <TransferTemplate
          categories={mockCategories}
          selectedAccount={mockAccount}
          resAccounts={resAccounts}
          detailedErrorCategories={null}
          editRecord={null}
        />
      </AppRouterContextProviderMock>
    </QueryProviderWrapper>
  )
}

describe("TransferTemplate", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders all form fields", () => {
    render(<TransferTemplateTestWrapper />)

    expect(screen.getByText(/Origen: Santander/i)).toBeInTheDocument()
    expect(screen.getByText(/Destino:/i)).toBeInTheDocument()
    expect(screen.getByText("Cantidad")).toBeInTheDocument()
    expect(screen.getByText("Pequeña descripción")).toBeInTheDocument()
    expect(screen.getByText("Descripción (opcional)")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /cancelar/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Crear transferencia/i })).toBeInTheDocument()
  })

  it("shows shortDescription required error when submitting empty", async () => {
    const user = userEvent.setup()
    render(<TransferTemplateTestWrapper />)

    await user.click(screen.getByRole("button", { name: /Crear transferencia/i }))

    expect(await screen.findByText(/Por favor, ingrese una pequeña descripción/i)).toBeInTheDocument()
  })

  it("shows description length error when description is too short", async () => {
    const user = userEvent.setup()
    render(<TransferTemplateTestWrapper />)

    await user.type(screen.getByTestId("shortDescription"), "Test transfer")
    await user.type(screen.getByRole("textbox", { name: /descripción \(opcional\)/i }), "ab")
    await user.click(screen.getByRole("button", { name: /Crear transferencia/i }))

    expect(await screen.findByText(/Por favor, ingrese una descripción de más de 3 caracteres/i)).toBeInTheDocument()
  })

  it("shows category required error when submitting without category", async () => {
    const user = userEvent.setup()
    render(<TransferTemplateTestWrapper />)

    await user.type(screen.getByTestId("shortDescription"), "Test transfer")
    await user.click(screen.getByRole("button", { name: /Crear transferencia/i }))

    expect(await screen.findByText(/Por favor, seleccione una categoría/i)).toBeInTheDocument()
  })

  it("shows amount zero error when amount stays at zero", async () => {
    const user = userEvent.setup()
    render(<TransferTemplateTestWrapper />)

    await user.type(screen.getByTestId("shortDescription"), "Test transfer")
    await user.click(screen.getByRole("button", { name: /Crear transferencia/i }))

    expect(await screen.findByText(/Por favor, ingrese una cantidad mayor a 0/i)).toBeInTheDocument()
  })

  it("shows destination required error when submitting without destination", async () => {
    const user = userEvent.setup()
    render(<TransferTemplateTestWrapper />)

    await user.type(screen.getByTestId("shortDescription"), "Test transfer")
    await user.type(screen.getByTestId("amount"), "1")
    await user.click(screen.getByTestId("category-dropdown"))
    await user.click(screen.getByText("Comida y Bebida"))
    await user.click(screen.getByTestId("subcategory-dropdown"))
    await user.click(screen.getByText("Bar"))
    await user.click(screen.getByRole("button", { name: /Crear transferencia/i }))

    expect(await screen.findByText(DESTINATION_ACC_REQUIRED)).toBeInTheDocument()
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  it("updates destination options when origin changes", async () => {
    const user = userEvent.setup()
    render(<TransferTemplateTestWrapper />)

    await user.click(screen.getByTestId("select-origin-dropdown-button"))
    await user.click(screen.getByText("HSBC oro"))
    expect(screen.getByText(/Origen: HSBC oro/i)).toBeInTheDocument()

    await user.click(screen.getByTestId("select-destination-dropdown-button"))

    expect(screen.getByText("Santander")).toBeInTheDocument()
    expect(screen.queryByText(/^HSBC oro$/)).not.toBeInTheDocument()
  })
})
