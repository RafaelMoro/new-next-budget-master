import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from 'axios';

import { DeleteRecordModal } from "@/features/Records/DeleteRecordModal";
import { QueryProviderWrapper } from "@/app/QueryProviderWrapper";
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock";
import { useState } from "react";
import { recordMock } from "../../mocks/records.mock";
import { BankMovement } from "@/shared/types/records.types";

function DeleteRecordModalTestWrapper({
  push,
  refresh,
  handleCloseDrawer,
  record = null
}: {
  push: () => void
  refresh: () => void
  handleCloseDrawer?: () => void;
  record?: BankMovement | null
}) {
  const [openDeleteRecordModal, setOpenDeleteRecordModal] = useState(true);
  const toggleDeleteRecordModal = () => setOpenDeleteRecordModal((prev) => !prev)
  const mockRecord = record || recordMock

  const handleCloseDrawerMock = handleCloseDrawer || jest.fn();
  return (
    <QueryProviderWrapper>
      <AppRouterContextProviderMock router={{ push, refresh }}>
        <DeleteRecordModal
          open={openDeleteRecordModal}
          toggleModal={toggleDeleteRecordModal}
          record={mockRecord}
          handleCloseDrawer={handleCloseDrawerMock}
        />
      </AppRouterContextProviderMock>
    </QueryProviderWrapper>
  );
}

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe("DeleteRecordModal", () => {
  const push = jest.fn();
  const refresh = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Show modal to delete record", () => {
    render(<DeleteRecordModalTestWrapper push={push} refresh={refresh} />);
    expect(screen.getByRole("heading", { name: /Eliminar/i })).toBeInTheDocument();
    expect(screen.getByText(/¿Estás seguro de que deseas eliminar esta transacción/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Eliminar$/i })).toBeInTheDocument();
  });

  it("Close modal when the button Cancelar is clicked", async () => {
    render(<DeleteRecordModalTestWrapper push={push} refresh={refresh} />);
    await userEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(screen.queryByRole("heading", { name: /Eliminar/i })).not.toBeInTheDocument();
  });

  it("Show success icon after deletion of an expense", async () => {
    mockedAxios.delete.mockResolvedValue({
      error: null,
      message: ['Expense deleted', 'Account updated'],
      success: true,
      version: "v1.2.0",
      data: {
        expense: recordMock
      },
    })
    render(<DeleteRecordModalTestWrapper push={push} refresh={refresh} />);
    await userEvent.click(screen.getByRole("button", { name: /^Eliminar$/i }));
    expect(await screen.findByTestId("check-icon")).toBeInTheDocument();
    await waitFor(() => {
      expect(refresh).toHaveBeenCalled()
    });
  });

  it("Show success icon after deletion of an income", async () => {
    const mockIncome: BankMovement = {
      ...recordMock,
      typeOfRecord: 'income'
    }
    mockedAxios.delete.mockResolvedValue({
      error: null,
      message: ['Income deleted', 'Account updated'],
      success: true,
      version: "v1.2.0",
      data: {
        income: mockIncome
      },
    })

    render(<DeleteRecordModalTestWrapper push={push} refresh={refresh} record={mockIncome} />);
    await userEvent.click(screen.getByRole("button", { name: /^Eliminar$/i }));
    expect(await screen.findByTestId("check-icon")).toBeInTheDocument();
    await waitFor(() => {
      expect(refresh).toHaveBeenCalled()
    });
  });

  it("Show success icon after deletion of a transfer expense", async () => {
    const mockIncome: BankMovement = {
      ...recordMock,
      isPaid: true,
      typeOfRecord: 'transfer',
      transferRecord: {
        transferId: 'transfer-id',
        account: 'transfer-account',
      }
    }
    mockedAxios.delete.mockResolvedValue({
      error: null,
      message: ['Expense deleted', 'Account updated'],
      success: true,
      version: "v1.2.0",
      data: {
        expense: recordMock
      },
    })
    mockedAxios.delete.mockResolvedValue({
      error: null,
      message: ['Income deleted', 'Account updated'],
      success: true,
      version: "v1.2.0",
      data: {
        income: mockIncome
      },
    })

    render(<DeleteRecordModalTestWrapper push={push} refresh={refresh} record={mockIncome} />);
    await userEvent.click(screen.getByRole("button", { name: /^Eliminar$/i }));
    expect(await screen.findByTestId("check-icon")).toBeInTheDocument();
    await waitFor(() => {
      expect(refresh).toHaveBeenCalled()
    });
  });

  it("Show success icon after deletion of a transfer income", async () => {
    const mockIncome: BankMovement = {
      ...recordMock,
      isPaid: undefined,
      typeOfRecord: 'transfer',
      transferRecord: {
        transferId: 'transfer-id',
        account: 'transfer-account',
      }
    }
    mockedAxios.delete.mockResolvedValue({
      error: null,
      message: ['Expense deleted', 'Account updated'],
      success: true,
      version: "v1.2.0",
      data: {
        expense: recordMock
      },
    })
    mockedAxios.delete.mockResolvedValue({
      error: null,
      message: ['Income deleted', 'Account updated'],
      success: true,
      version: "v1.2.0",
      data: {
        income: mockIncome
      },
    })

    render(<DeleteRecordModalTestWrapper push={push} refresh={refresh} record={mockIncome} />);
    await userEvent.click(screen.getByRole("button", { name: /^Eliminar$/i }));
    expect(await screen.findByTestId("check-icon")).toBeInTheDocument();
    await waitFor(() => {
      expect(refresh).toHaveBeenCalled()
    });
  });

  // Test not completely working as it does not shows the state of the toast in the UI
  it("Show error when deletion fails", async () => {
    mockedAxios.delete.mockRejectedValue({
        code: 'ERR_BAD_REQUEST',
        config: null,
        message: 'Request failed with status code 401',
        name: 'AxiosError',
        request: null,
        response: {
          config: null,
          data: {
            data: null,
            error: {
              error: 'Bad Request',
              message: 'Something went wrong.',
              statusCode: 403
            },
            message: null,
            success: false,
            version: '1.2.0'
          }
        }
      })
    const handleCloseDrawer = jest.fn();
    render(<DeleteRecordModalTestWrapper push={push} refresh={refresh} handleCloseDrawer={handleCloseDrawer} />);
    await userEvent.click(screen.getByRole("button", { name: /^Eliminar$/i }));
  });
});
