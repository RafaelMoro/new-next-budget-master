import { EmptyAccordionResult } from "@/features/Records/Accordions/EmptyAccordionResult"
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock";
import { DashboardStoreProvider } from "@/zustand/provider/dashboard-store-provider";
import { render, screen } from "@testing-library/react"
import { mockAccounts } from "../../mocks/accounts.mock";

describe('EmptyAccordionResult', () => {
  it('Show Empty accordion result', () => {
    const push = jest.fn();
    render(
      <DashboardStoreProvider accounts={mockAccounts} records={[]} selectedAccountId={mockAccounts[0]._id}>
        <AppRouterContextProviderMock router={{ push }}>
          <EmptyAccordionResult />
        </AppRouterContextProviderMock>
      </DashboardStoreProvider>
  )

    expect(screen.getByTestId('empty-accordion-result')).toBeInTheDocument()
    expect(screen.getByText('Aún no has registrado movimientos este mes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrar movimiento' })).toBeInTheDocument()
  })
})