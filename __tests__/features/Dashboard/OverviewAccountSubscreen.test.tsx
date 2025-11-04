import { render, screen } from "@testing-library/react"

import { DashboardStoreProvider } from "@/zustand/provider/dashboard-store-provider"
import { OverviewAccountTransactionsSubscreen } from "@/features/Dashboard/subscreens/Overview/OverviewAccountTransactionsSubscreen"
import { mockAccounts } from "../../mocks/accounts.mock"
import { recordMock } from "../../mocks/records.mock"
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock"
import { QueryProviderWrapper } from "@/app/QueryProviderWrapper"

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('AccountOverviewSubscreen', () => {
  it('Show account overview with correct data', () => {
    const push = jest.fn()
    render(
      <DashboardStoreProvider accounts={mockAccounts} records={[recordMock]} selectedAccountId={mockAccounts[0]._id}>
        <QueryProviderWrapper>
          <AppRouterContextProviderMock router={{ push }}>
            <OverviewAccountTransactionsSubscreen />
          </AppRouterContextProviderMock>
        </QueryProviderWrapper>
      </DashboardStoreProvider>
    )

    expect(screen.getByText('Santander')).toBeInTheDocument()
    expect(screen.getByText('$12,640.54')).toBeInTheDocument()
    expect(screen.getByText('Este mes')).toBeInTheDocument()
    expect(screen.getByText('Último mes')).toBeInTheDocument()
    expect(screen.getByText("Arby's burger y papas")).toBeInTheDocument()
    expect(screen.getByText('Sin pagar')).toBeInTheDocument()
  })
})