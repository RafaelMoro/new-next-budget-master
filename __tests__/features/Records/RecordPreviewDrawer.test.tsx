import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecordsPreviewDrawer } from '@/features/Records/RecordsPreviewDrawer';
import { useRecordPreview } from '@/shared/hooks/useRecordPreview';
import { recordMock, paidRecordMock, editExpense, transferRecordMock, editIncome } from '../../mocks/records.mock';
import { BankMovement } from '@/shared/types/records.types';
import { AppRouterContextProviderMock } from '@/shared/ui/organisms/AppRouterContextProviderMock';
import { DashboardStoreProvider } from '@/zustand/provider/dashboard-store-provider';
import { mockAccounts } from '../../mocks/accounts.mock';
import { QueryProviderWrapper } from '@/app/QueryProviderWrapper';

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

const RecordsPreviewDrawerWrapper = ({ push, recordProp = recordMock  }: { push: () => void; recordProp?: BankMovement }) => {
  const {
    openRecordDrawer,
    record,
    handleOpenRecordPreviewDrawer,
    handleCloseRecordPreviewDrawer,
  } = useRecordPreview();

  return (
    <DashboardStoreProvider accounts={mockAccounts} records={[]} selectedAccountId={mockAccounts[0]._id}>
      <div>
        <button onClick={() => handleOpenRecordPreviewDrawer(recordProp)}>Open Drawer</button>
        <QueryProviderWrapper>
          <AppRouterContextProviderMock router={{ push }}>
            <RecordsPreviewDrawer
              open={openRecordDrawer}
              handleClose={handleCloseRecordPreviewDrawer}
              record={record}
            />
          </AppRouterContextProviderMock>
        </QueryProviderWrapper>
      </div>
    </DashboardStoreProvider>
  );
};

describe('RecordsPreviewDrawer', () => {
  it('should render the drawer with record details when open', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    render(<RecordsPreviewDrawerWrapper push={push} />);

    const openButton = screen.getByText('Open Drawer');
    await user.click(openButton);

    expect(screen.getByText('Detalles de la transacción')).toBeInTheDocument();
    expect(screen.getByText('Gasto')).toBeInTheDocument();
    expect(screen.getByText(recordMock.shortName)).toBeInTheDocument();
    expect(screen.getByText(recordMock.amountFormatted)).toBeInTheDocument();

    if (recordMock.category) {
      expect(screen.getByText(recordMock.category.categoryName)).toBeInTheDocument();
    }

    expect(screen.getByText(recordMock.subCategory)).toBeInTheDocument();
    expect(screen.getByText('Estatus de pago:')).toBeInTheDocument();
    expect(screen.getByText('Sin pagar')).toBeInTheDocument();
  });

  it('should close the drawer when the close button is clicked', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    render(<RecordsPreviewDrawerWrapper push={push} />);

    const openButton = screen.getByText('Open Drawer');
    await user.click(openButton);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(screen.queryByText('Detalles de la transacción')).not.toBeInTheDocument();
  });

  it('should display the correct paid status when the record is paid', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    render(<RecordsPreviewDrawerWrapper recordProp={paidRecordMock}  push={push} />);

    const openButton = screen.getByText('Open Drawer');
    await user.click(openButton);

    expect(screen.getByText('Pagado')).toBeInTheDocument();
  });

  it('should display tags when the record has tags', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    render(<RecordsPreviewDrawerWrapper recordProp={editExpense} push={push} />);

    const openButton = screen.getByText('Open Drawer');
    await user.click(openButton);

    // Should display the tags section header
    expect(screen.getByText('Etiquetas:')).toBeInTheDocument();
    
    // Should display the tag from editExpense mock
    expect(screen.getByText('something')).toBeInTheDocument();
  });

  it('should display transfer details when the record is a transfer', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    render(<RecordsPreviewDrawerWrapper recordProp={transferRecordMock} push={push} />);

    const openButton = screen.getByText('Open Drawer');
    await user.click(openButton);

    // Should display the transfer details section header
    expect(screen.getByText('Detalle de la transferencia:')).toBeInTheDocument();
    
    // Should display "Transferencia" as the type of record
    expect(screen.getByText('Transferencia')).toBeInTheDocument();
  });

  it('should navigate to edit expense route when editing an expense record', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    render(<RecordsPreviewDrawerWrapper recordProp={recordMock} push={push} />);

    const openButton = screen.getByText('Open Drawer');
    await user.click(openButton);

    const editButton = screen.getByText('Editar');
    await user.click(editButton);

    // Should navigate to edit expense route since recordMock is an expense
    expect(push).toHaveBeenCalledWith('/edit-record/edit-expense');
  });

  it('should navigate to edit income route when editing an income record', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    render(<RecordsPreviewDrawerWrapper recordProp={editIncome} push={push} />);

    const openButton = screen.getByText('Open Drawer');
    await user.click(openButton);

    const editButton = screen.getByText('Editar');
    await user.click(editButton);

    // Should navigate to edit income route since editIncome is an income record
    expect(push).toHaveBeenCalledWith('/edit-record/edit-income');
  });
});