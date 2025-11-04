import { render, screen } from '@testing-library/react';
import { OverviewStatisticsSubscreen } from '@/features/Dashboard/subscreens/Overview/OverviewStatisticsSubscreen';
import { DashboardStoreProvider } from '@/zustand/provider/dashboard-store-provider';
import { mockAccounts } from '../../mocks/accounts.mock';
import { recordMock } from '../../mocks/records.mock';
import { AppRouterContextProviderMock } from '@/shared/ui/organisms/AppRouterContextProviderMock';
import { BankMovement } from '@/shared/types/records.types';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

const StatisticsSubscreenWrapper = ({ push, records = [] }: { push: () => void, records?: BankMovement[] }) => {
  return (
    <DashboardStoreProvider accounts={mockAccounts} records={[...records]} selectedAccountId={mockAccounts[0]._id}>
        <AppRouterContextProviderMock router={{ push }}>
          <OverviewStatisticsSubscreen />
        </AppRouterContextProviderMock>
      </DashboardStoreProvider>
  )
}

describe('StatisticsSubscreen', () => {
  it('Show no transactions messaging if there are no records', () => {
    render(
      <StatisticsSubscreenWrapper push={jest.fn()} />
    );
    expect(screen.getByText(/Sin transacciones, sin gráficas/)).toBeInTheDocument();
    expect(screen.getByText(/Registrar movimiento/i)).toBeInTheDocument();
  });

  it('Show statistics if there are records', () => {
    render(
      <StatisticsSubscreenWrapper push={jest.fn()} records={[recordMock]} />
    );
    expect(screen.getByText(/Ingresos vs Gastos/)).toBeInTheDocument();
  });
});
