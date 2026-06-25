import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { QueryProviderWrapper } from "@/app/QueryProviderWrapper";
import { AppRouterContextProviderMock } from "@/shared/ui/organisms/AppRouterContextProviderMock";
import { IncomeTemplate } from "@/features/Records/IncomeTemplate/IncomeTemplate";
import { mockCategories } from "../../../mocks/categories.mock";
import { AccountsCookie } from "@/shared/types/accounts.types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
});

const mockAccount: AccountsCookie = {
  accountId: "6579221448b3dbd136ce2988",
  name: "Santander",
  type: "Débito",
};

function IncomeTemplateTestWrapper() {
  return (
    <QueryProviderWrapper>
      <AppRouterContextProviderMock router={{ push: jest.fn(), refresh: jest.fn() }}>
        <IncomeTemplate
          categories={mockCategories}
          selectedAccount={mockAccount}
          detailedErrorCategories={null}
          editRecord={null}
        />
      </AppRouterContextProviderMock>
    </QueryProviderWrapper>
  );
}

describe("IncomeTemplate", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<IncomeTemplateTestWrapper />);
    expect(screen.getByText("Cantidad")).toBeInTheDocument();
    expect(screen.getByText("Pequeña descripción")).toBeInTheDocument();
    expect(screen.getByText("Descripción (opcional)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Crear ingreso/i })).toBeInTheDocument();
  });

  it("shows shortDescription required error when submitting empty", async () => {
    const user = userEvent.setup();
    render(<IncomeTemplateTestWrapper />);
    await user.click(screen.getByRole("button", { name: /Crear ingreso/i }));
    expect(await screen.findByText(/Por favor, ingrese una pequeña descripción/i)).toBeInTheDocument();
  });

  it("clears shortDescription error when user types", async () => {
    const user = userEvent.setup();
    render(<IncomeTemplateTestWrapper />);
    await user.click(screen.getByRole("button", { name: /Crear ingreso/i }));
    expect(await screen.findByText(/Por favor, ingrese una pequeña descripción/i)).toBeInTheDocument();
    await user.type(screen.getByTestId("shortDescription"), "Test income");
    expect(screen.queryByText(/Por favor, ingrese una pequeña descripción/i)).not.toBeInTheDocument();
  });

  it("shows description length error when description is too short", async () => {
    const user = userEvent.setup();
    render(<IncomeTemplateTestWrapper />);
    await user.type(screen.getByTestId("shortDescription"), "Test income");
    await user.type(screen.getByRole("textbox", { name: /descripción \(opcional\)/i }), "ab");
    await user.click(screen.getByRole("button", { name: /Crear ingreso/i }));
    expect(await screen.findByText(/Por favor, ingrese una descripción de más de 3 caracteres/i)).toBeInTheDocument();
  });

  it("does not show description error when description is valid length", async () => {
    const user = userEvent.setup();
    render(<IncomeTemplateTestWrapper />);
    await user.type(screen.getByTestId("shortDescription"), "Test income");
    await user.type(screen.getByRole("textbox", { name: /descripción \(opcional\)/i }), "Test description longer than 3 chars");
    await user.click(screen.getByRole("button", { name: /Crear ingreso/i }));
    expect(screen.queryByText(/más de 3 caracteres/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/menos de 300 caracteres/i)).not.toBeInTheDocument();
  });

  it("shows category required error when submitting without category", async () => {
    const user = userEvent.setup();
    render(<IncomeTemplateTestWrapper />);
    await user.type(screen.getByTestId("shortDescription"), "Test income");
    await user.click(screen.getByRole("button", { name: /Crear ingreso/i }));
    expect(await screen.findByText(/Por favor, seleccione una categoría/i)).toBeInTheDocument();
  });

  it("shows CURRENCY_ZERO_ERROR when amount is zero", async () => {
    const user = userEvent.setup();
    render(<IncomeTemplateTestWrapper />);
    await user.type(screen.getByTestId("shortDescription"), "Test income");
    await user.click(screen.getByRole("button", { name: /Crear ingreso/i }));
    expect(await screen.findByText(/Por favor, ingrese una cantidad mayor a 0/i)).toBeInTheDocument();
  });
});
