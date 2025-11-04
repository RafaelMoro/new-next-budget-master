import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { DashboardStoreProvider } from "@/zustand/provider/dashboard-store-provider"
import { mockAccounts } from "../../mocks/accounts.mock"
import { QueryProviderWrapper } from "@/app/QueryProviderWrapper"
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock"
import { OlderRecordsAccordion } from "@/features/Records/Accordions/OlderRecordsAccordion"
import { mockMatchMedia, QueryMatchMedia } from "../../utils-test/record.utils-test";
import { recordMock } from "../../mocks/records.mock";
import { getDateInfo } from "@/shared/utils/getDateInfo";

const OlderRecordsAccordionWrapper = ({ push }: { push: () => void }) => {
  return (
    <DashboardStoreProvider accounts={mockAccounts} records={[]} selectedAccountId={mockAccounts[0]._id}>
      <QueryProviderWrapper>
        <AppRouterContextProviderMock router={{ push }}>
          <OlderRecordsAccordion />
        </AppRouterContextProviderMock>
      </QueryProviderWrapper>
    </DashboardStoreProvider>
  )
}

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OlderRecordsAccordion', () => {
  mockMatchMedia({
    [QueryMatchMedia.isMobileTablet]: false,
    [QueryMatchMedia.isDesktop]: false,
  });

  it('Show older records month accordion', () => {
    const push = jest.fn();
    render(<OlderRecordsAccordionWrapper push={push} />)

    expect(screen.getByText('Transacciones anteriores')).toBeInTheDocument()
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

    render(<OlderRecordsAccordionWrapper push={push} />)

    const accordion = screen.getByRole('button', { name: 'Transacciones anteriores' });
    await user.click(accordion);

    expect(screen.getByTestId('select-month-dropdown-button')).toBeInTheDocument();
    expect(screen.getByTestId('select-year-dropdown-button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
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

    render(<OlderRecordsAccordionWrapper push={push} />)

    const accordion = screen.getByRole('button', { name: 'Transacciones anteriores' });
    await user.click(accordion);

    expect(screen.getByText("Aún no has registrado movimientos este mes")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrar movimiento' })).toBeInTheDocument();
  })

  // this test also covers clearing the error message making a new search again
  it('Given a user clicking on the accordion, then change the month to the current month, then click on search, should see error message', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    const { completeMonth, beforeLastMonthComplete } = getDateInfo({ isOlderRecords: false })
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

    render(<OlderRecordsAccordionWrapper push={push} />)

    const accordion = screen.getByRole('button', { name: 'Transacciones anteriores' });
    await user.click(accordion);

    expect(screen.getByText("Arby's burger y papas")).toBeInTheDocument();
    const changeMonthDropdown = screen.getByTestId('select-month-dropdown-button');
    await user.click(changeMonthDropdown);

    const currentMonthOption = screen.getByText(completeMonth);
    await user.click(currentMonthOption);

    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    await user.click(searchButton);

    expect(screen.getByText(`Los movimientos de ${completeMonth} se muestran en la sección de "Este mes". Selecciona un mes anterior.`)).toBeInTheDocument();

    // Select the before last month and search again
    await user.click(changeMonthDropdown);
    const beforeLastMonthOption = screen.getByText(beforeLastMonthComplete);
    await user.click(beforeLastMonthOption);
    await user.click(searchButton);

    // Expect to see the records again
    expect(screen.getByText("Arby's burger y papas")).toBeInTheDocument();
  })

  it('Given a user clicking on the accordion, then change the month to the last month, then click on search, should see error message', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    const { completeLastMonth } = getDateInfo({ isOlderRecords: false })
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

    render(<OlderRecordsAccordionWrapper push={push} />)

    const accordion = screen.getByRole('button', { name: 'Transacciones anteriores' });
    await user.click(accordion);

    expect(screen.getByText("Arby's burger y papas")).toBeInTheDocument();
    const changeMonthDropdown = screen.getByTestId('select-month-dropdown-button');
    await user.click(changeMonthDropdown);

    const lastMonthOption = screen.getByText(completeLastMonth);
    await user.click(lastMonthOption);

    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    await user.click(searchButton);

    expect(screen.getByText(`Los movimientos de ${completeLastMonth} se muestran en la sección de "Último mes". Selecciona un mes anterior.`)).toBeInTheDocument();
  })
})