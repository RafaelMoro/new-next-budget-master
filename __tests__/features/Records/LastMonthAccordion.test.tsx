import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { LastMonthAccordion } from "@/features/Records/Accordions/LastMonthAccordion"
import { DashboardStoreProvider } from "@/zustand/provider/dashboard-store-provider"
import { mockAccounts } from "../../mocks/accounts.mock"
import { QueryProviderWrapper } from "@/app/QueryProviderWrapper"
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock"
import { mockMatchMedia, QueryMatchMedia } from "../../utils-test/record.utils-test"
import { recordMock } from "../../mocks/records.mock";

const LastMonthAccordionWrapper = ({ push }: { push: () => void }) => {
  return (
    <DashboardStoreProvider accounts={mockAccounts} records={[]} selectedAccountId={mockAccounts[0]._id}>
      <QueryProviderWrapper>
        <AppRouterContextProviderMock router={{ push }}>
          <LastMonthAccordion />
        </AppRouterContextProviderMock>
      </QueryProviderWrapper>
    </DashboardStoreProvider>
  )
}

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LastMonthAccordion', () => {
  mockMatchMedia({
    [QueryMatchMedia.isMobileTablet]: false,
    [QueryMatchMedia.isDesktop]: false,
  });

  it('Show last month accordion', () => {
    const push = jest.fn();
    render(<LastMonthAccordionWrapper push={push} />)

    expect(screen.getByText('Último mes')).toBeInTheDocument()
  })

  it('Given a user clicking on the accordion, show records', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    mockedAxios.post.mockResolvedValue({
      error: null,
      message: null,
      success: true,
      version: "v1.2.0",
      data: {
        data: {
          records: [recordMock]
        }
      },
    })

    render(<LastMonthAccordionWrapper push={push} />)

    const accordion = screen.getByRole('button', { name: 'Último mes' });
    await user.click(accordion);

    expect(screen.getByText("Arby's burger y papas")).toBeInTheDocument();
  })

  it('Given a user clicking on the accordion, and there are no records, show empty accordion UI', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    mockedAxios.post.mockResolvedValue({
      error: null,
      message: null,
      success: true,
      version: "v1.2.0",
      data: {
        data: {
          records: []
        }
      },
    })

    render(<LastMonthAccordionWrapper push={push} />)

    const accordion = screen.getByRole('button', { name: 'Último mes' });
    await user.click(accordion);

    expect(screen.getByText("Aún no has registrado movimientos este mes")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrar movimiento' })).toBeInTheDocument();
  })
})