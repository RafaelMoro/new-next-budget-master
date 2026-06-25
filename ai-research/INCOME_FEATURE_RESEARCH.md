# Research: Port Income Feature to `new-budget-master`

## 1. Feature scope (per stakeholder decisions)

| Decision | Value |
|---|---|
| Feature scope | **MVP** — core income create only; **`expensesPaid` sub-feature is out of scope** (see Open Items) |
| Edit flow | **Create only** — wire up the "Crear Ingreso" subscreen in `TransactionManager`. Edit page left unbuilt (see Open Items) |
| Folder structure | Mirror `ExpenseTemplate` → `src/features/Records/IncomeTemplate/IncomeTemplate.tsx` |
| Categories | Show the shared unfiltered list (same as old repo behavior) |
| Cancel button | Reuse existing `CancelButtonExpenseTemplate` with `action="create"` (it is action-driven and generic) |

## 2. Source / target mapping

### 2.1 Source — `old-budget-master` reference files (read-only)

| Concern | Old repo path |
|---|---|
| IncomeTemplate component | `old-budget-master/src/features/Records/IncomeTemplate.tsx` (320 lines) |
| Subscreen switcher | `old-budget-master/src/features/Records/TransactionManager.tsx` |
| Button group (3-way toggle) | `old-budget-master/src/features/Records/TransactionManagerGroupButton.tsx` |
| Categories dropdown (shared) | `old-budget-master/src/features/Categories/TransactionCategorizerDropdown.tsx` |
| Records utils (axios callbacks) | `old-budget-master/src/shared/utils/records.utils.ts` |
| Records types (income) | `old-budget-master/src/shared/types/records.types.ts` |
| Categories types | `old-budget-master/src/shared/types/categories.types.ts` |
| Yup schema (shared with expense) | `IncomeExpenseSchema` in `records.types.ts:219-224` |
| Records constants | `old-budget-master/src/shared/constants/records.constants.ts` |
| Create-record page | `old-budget-master/src/app/create-record/page.tsx` |
| Income test suite (reference) | `old-budget-master/__tests__/feature/Records/IncomeTemplate.test.tsx` (386 lines) |
| EditIncome wrapper | `old-budget-master/src/features/Records/EditIncome.tsx` |

### 2.2 Target — `new-budget-master` files to create/modify

| # | File | Action |
|---|---|---|
| 1 | `src/app/api/records/income/route.ts` | **Edit** — add `POST` and `PUT` handlers (only `DELETE` exists today) |
| 2 | `src/shared/utils/records.utils.ts` | **Edit** — add `createIncomeCb` (POST) and `editIncomeCb` (PUT) |
| 3 | `src/features/Records/IncomeTemplate/IncomeTemplate.tsx` | **Create** |
| 4 | `src/features/Records/TransactionManager.tsx` | **Edit** — uncomment IncomeTemplate import + render block; remove `accessToken` prop |
| 5 | `__tests__/features/Records/IncomeTemplate/IncomeTemplate.test.tsx` | **Create** |

## 3. Current state of `new-budget-master` (what already exists vs. gaps)

### 3.1 Already present — no work needed

- `TransactionScreens` includes `'income'` — `src/shared/types/dashboard.types.ts:3`.
- `TransactionManagerGroupButton` already renders the live "Ingreso" button + active highlight — `src/features/Records/TransactionManagerGroupButton.tsx`.
- Income **types** are fully defined in `src/shared/types/records.types.ts`:
  - `TypeOfRecord` — `:8`
  - `IncomeRecord` — `:54-56` (`AccountRecord & { expensesPaid: ExpensePaid[] }`)
  - `CreateIncomePayload` — `:122-135`
  - `EditIncomePayload` — `:137-139`
  - `IncomeDataResponse` — `:204-212`
  - `IncomeErrorResponse` — `:269-275`
  - `CreateIncomeDataForm` — `:314-317`
  - `IncomeExpenseSchema` (shared with expense) — `:335-340`
- `INCOME_API_ENDPOINT = '/api/records/income'` — `src/shared/constants/global.constants.ts:22`.
- `INCOME_ROUTE = '/incomes-actions'` (backend) — `src/shared/constants/records.constants.ts:5`.
- `EDIT_INCOME_PAGE_ROUTE = '/edit-record/edit-income'` — `src/shared/constants/global.constants.ts:12`. `RecordsPreviewDrawer.tsx:73-74` already routes income edits there.
- `deleteIncomeCb` exists — `src/shared/utils/records.utils.ts:18` (DELETE only).
- Test fixtures: `editIncome` mock + `ExpensePaid` mocks in `__tests__/mocks/records.mock.ts`; `mockCategories` in `__tests__/mocks/categories.mock.ts`; `mockAccounts` in `__tests__/mocks/accounts.mock.ts`.
- `Header` (`src/shared/ui/organisms/Header.tsx`) and `LinkButton` (`src/shared/ui/atoms/LinkButton.tsx`) are already imported in `TransactionManager.tsx`.

### 3.2 Gaps — must be built

1. `createIncomeCb` and `editIncomeCb` in `src/shared/utils/records.utils.ts` — missing.
2. `POST` and `PUT` handlers in `src/app/api/records/income/route.ts` — only `DELETE` exists today.
3. `src/features/Records/IncomeTemplate/IncomeTemplate.tsx` — does not exist (only commented-out references in `TransactionManager.tsx:14,64-72`).
4. Uncomment + adjust the `IncomeTemplate` import and render block in `src/features/Records/TransactionManager.tsx:14,64-72`.
5. Tests at `__tests__/features/Records/IncomeTemplate/IncomeTemplate.test.tsx`.

## 4. Architectural difference between old and new repo (critical)

The old `IncomeTemplate` receives `accessToken: string` and calls the backend directly via axios:

```ts
// old: src/shared/utils/records.utils.ts
axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URI}/incomes-actions`, data, {
  headers: { Authorization: `Bearer ${accessToken}` },
})
```

The new repo uses a **BFF pattern** — client components never see the access token. The session cookie (`jose`-encoded, httpOnly) is read by Next.js route handlers in `src/app/api/...`, which proxy to the backend. `ExpenseTemplate` accordingly takes **no `accessToken` prop** and its mutations POST to `/api/records/expense`.

➡ **IncomeTemplate must mirror ExpenseTemplate**: no `accessToken` prop; `createIncomeCb` POSTs to `INCOME_API_ENDPOINT` (`/api/records/income`) with no auth header (the route handler injects it from the session cookie). The commented-out block in `TransactionManager.tsx:64-72` still shows an `accessToken` prop — **drop it**; that prop does not exist on `TransactionManager` in the new repo.

## 5. Implementation plan

### 5.1 `src/app/api/records/income/route.ts` (Edit)

Add `POST` and `PUT` mirroring `src/app/api/records/expense/route.ts`. The existing `DELETE` handler is the template. Required behavior:
- Read the access token from the session cookie (same helper used by the expense route).
- For `POST`: forward JSON body to `${BACKEND_URI}/incomes-actions` and return the upstream response.
- For `PUT`: same, with PUT verb.
- Return 401 if no session, 5xx passthrough on upstream errors.

### 5.2 `src/shared/utils/records.utils.ts` (Edit)

Add two functions mirroring `createExpenseCb:30` and `editExpenseCb:40`:

```ts
import { CreateIncomePayload, EditIncomePayload, IncomeDataResponse } from "@/shared/types/records.types"

export const createIncomeCb = (data: CreateIncomePayload): Promise<IncomeDataResponse> => {
  return axios.post<IncomeDataResponse>(INCOME_API_ENDPOINT, data)
}

export const editIncomeCb = (data: EditIncomePayload): Promise<IncomeDataResponse> => {
  return axios.put<IncomeDataResponse>(INCOME_API_ENDPOINT, data)
}
```

(No `accessToken` argument; no `Authorization` header — the BFF handles auth.)

### 5.3 `src/features/Records/IncomeTemplate/IncomeTemplate.tsx` (Create)

Mirror the structure of `src/features/Records/ExpenseTemplate/ExpenseTemplate.tsx:1-342`. Use the same imports and conventions. Difference matrix:

| Aspect | `ExpenseTemplate` | `IncomeTemplate` (this work) |
|---|---|---|
| Props | `categories`, `budgetsFetched`, `selectedAccount`, `editRecord`, `detailedErrorCategories`, `detailedErrorBudgets` | `categories`, `selectedAccount`, `editRecord`, `detailedErrorCategories` (**drop `budgetsFetched` and `detailedErrorBudgets`**) |
| Hooks | `useCurrencyField`, `useCategoriesForm`, `useManageTags`, `useHandleBudgets`, `useIndebtedPeople`, `useMediaQuery` | `useCurrencyField`, `useCategoriesForm`, `useManageTags`, `useMediaQuery` (**drop `useHandleBudgets` and `useIndebtedPeople`**) |
| Mutation callbacks | `createExpenseCb` / `editExpenseCb` | `createIncomeCb` / `editIncomeCb` |
| Response types | `ExpenseDataResponse` / `ExpenseErrorResponse` | `IncomeDataResponse` / `IncomeErrorResponse` |
| Credit account "Pagado" toggle | `isCredit` → `ToggleSwitch` for `isPaid` | **Drop** (income has no `isPaid`) |
| Budget dropdown | `SelectBudgetDropdown` | **Drop** (income has no `linkedBudgets`) |
| `PersonalDebtManager` | Yes | **Drop** (`indebtedPeople: []`) |
| `FurtherDetailsAccordion` contents | Tags + PersonalDebtManager | Tags only |
| `buttonText` | `'Editar gasto'` / `'Crear gasto'` | `'Editar ingreso'` (unused in MVP) / `'Crear ingreso'` |
| Cancel button | `CancelButtonExpenseTemplate` | **Reuse** `CancelButtonExpenseTemplate` with `action="create"` |
| `typeOfRecord` in payload | `'expense'` | `'income'` |
| Payload fields | `isPaid`, `linkedBudgets`, `indebtedPeople` | `expensesPaid: []`, `indebtedPeople: []`, `budgets: []` (deprecated) |
| Validation schema | `IncomeExpenseSchema` (shared) | `IncomeExpenseSchema` (shared) — reuse as-is |
| Error toasts | `CREATE_EXPENSE_INCOME_ERROR`, `EDIT_EXPENSE_INCOME_ERROR` (reuse — names already cover both) | Same |
| Categories | `useCategoriesForm({ categories })` shared list, no filter | **Same** — full shared list |

#### Props interface

```ts
interface IncomeTemplateProps {
  categories: Category[]
  selectedAccount: AccountsCookie | null
  detailedErrorCategories: DetailedError | null
  editRecord: BankMovement | null   // create-only flow always passes null; kept for parity
}
```

#### `onSubmit` payload (MVP)

```ts
const payload: CreateIncomePayload = {
  account: selectedAccount.accountId,
  amount: amountNumber,                          // via cleanCurrencyString(currencyState)
  budgets: [],                                    // deprecated, kept empty
  category: categorySelected.categoryId,
  date,
  description: data.description ?? '',
  expensesPaid: [],                               // MVP: none
  indebtedPeople: [],                             // income always empty
  shortName: data.shortDescription,
  subCategory: subcategory,
  tag: tags.current,
  typeOfRecord: 'income'
}
createIncome(payload)   // edit branch intentionally omitted (create-only)
```

#### Validation (no change from shared schema)

Reuse `IncomeExpenseSchema` from `src/shared/types/records.types.ts:335-340`. Same custom checks as `ExpenseTemplate.onSubmit`:
- `CATEGORY_REQUIRED` / `SUBCATEGORY_REQUIRED` (`src/shared/constants/categories.constants.ts`)
- `validateZeroAmount` + `isZeroCurrency()` → `CURRENCY_ZERO_ERROR` (`src/shared/constants/records.constants.ts:18`)
- `CREATE_EXPENSE_INCOME_ERROR` toast on mutation error

#### Mutations

Mirror `ExpenseTemplate.tsx:94-123`:
- `createIncome` → `useMutation({ mutationFn: (data: CreateIncomePayload) => createIncomeCb(data), onSuccess: () => { router.refresh(); setTimeout(() => router.push(DASHBOARD_ROUTE), 1000) }, onError: () => toast.error(CREATE_EXPENSE_INCOME_ERROR) })`
- `editIncome` declared but unused in MVP (keep for parity / future edit flow).

### 5.4 `src/features/Records/TransactionManager.tsx` (Edit)

- **Uncomment** the import at `:14`: `import { IncomeTemplate } from "./IncomeTemplate"`.
- **Uncomment** the render block at `:64-72`, then **remove the `accessToken` prop** (it is not part of the new architecture and is not in `TransactionManager`'s scope). Final block:

```tsx
{ subscreen === 'income' && (
  <IncomeTemplate
    categories={categories}
    selectedAccount={selectedAccount}
    detailedErrorCategories={errorCategories}
    editRecord={null}
  />
)}
```

The `transfer` block at `:73-82` stays commented (out of scope).

### 5.5 `__tests__/features/Records/IncomeTemplate/IncomeTemplate.test.tsx` (Create)

Mirror the structure of `__tests__/features/Records/RecordPreviewDrawer.test.tsx` and `__tests__/features/Records/DeleteRecordModal.test.tsx` (the latter uses `jest.mock('axios')` and `userEvent`).

**Wrappers (per `AGENTS.md`):**
- `QueryProviderWrapper` from `src/app/QueryProviderWrapper.tsx` (TanStack Query).
- `AppRouterContextProviderMock` from `src/shared/ui/organisms/AppRouterContextProviderMock.tsx` with `push: jest.fn()`.
- `DashboardStoreProvider` is **not required** — `IncomeTemplate` does not call `useDashboardStore` (mirroring `ExpenseTemplate`).

**Mocks (per `AGENTS.md`):**
- `jest.mock('axios')` for the BFF call.
- `jest.mock('next/headers', ...)` if cookie access is needed.
- Do **not** mock the component under test, custom hooks, `@/shared/utils/*`, `sonner`, or `next/navigation`.

**Test cases to cover:**
- Field render: `Cantidad` (CurrencyField), `Pequeña descripción` (TextInput), `Descripción (opcional)` (Textarea), category dropdown, subcategory dropdown, `Cancelar`, `Crear ingreso`.
- Yup validation: `shortDescription` required, `description` length 3..300, category required, subcategory required, amount > 0 via `CURRENCY_ZERO_ERROR`; errors clear on input.
- Successful create: click `Crear ingreso` → loading → check-icon → `push(DASHBOARD_ROUTE)`.
- Error path: axios rejects → `CREATE_EXPENSE_INCOME_ERROR` toast.

**Out of test scope (per feature scope decisions):**
- Edit-mode tests (create-only).
- `expensesPaid` tests (MVP).
- `useSelectExpensesPaid` / `SelectPaidSection` / `SelectPaidDrawer` (not built).

## 6. Open items / follow-ups (NOT in this scope)

1. **`expensesPaid` sub-feature** — `useSelectExpensesPaid` hook + `SelectPaidSection` + `SelectPaidDrawer` + fetch-expenses-by-date endpoint. `IncomeRecord.expensesPaid` field stays `[]` for now. Source files in old repo: `src/features/Records/ExpensesPaid/SelectPaidSection.tsx`, `src/features/Records/ExpensesPaid/SelectPaidDrawer.tsx`, `src/shared/hooks/useSelectExpensesPaid.tsx`.
2. **Edit-income page** — `src/app/edit-record/edit-income/page.tsx` + `EditIncome` wrapper reading record from localStorage. **Not built now.** Side effect: `RecordsPreviewDrawer.tsx:74` already pushes income records to `EDIT_INCOME_PAGE_ROUTE` on edit; until that page exists, the edit button leads to a 404. See **§10 Open Question** for the pending decision.
3. **Transfer feature** — out of scope; `TransferTemplate` remains fully commented out in `TransactionManager.tsx`.

## 10. Open question (pending answer — to be resolved before implementation)

**Q:** Since the scope is **create-only** and the `/edit-record/edit-income` page is **not** being built in this PR, `RecordsPreviewDrawer.handleEditRecord` will currently push income records to a 404 route. How should this be handled in this PR?

### Option A — Patch the drawer in this PR (Recommended)
Modify `src/features/Records/RecordsPreviewDrawer.tsx:63-72` so that when `record.typeOfRecord === 'income'`, the edit button either:
- shows a `toast.error("La edición de ingresos aún no está disponible.")` and does not navigate, or
- is disabled / hidden for income records.

This avoids shipping a broken route and clearly signals the limitation. The edit flow is restored in the follow-up that also adds the edit page.

### Option B — Leave the drawer as-is
Accept the broken 404 on income edit attempts until the edit page is built in a follow-up. Smaller diff in this PR but ships a known-broken user path.

**Status:** ⏳ Awaiting stakeholder decision. Will be recorded in `CHANGELOG.md` by the bot on merge; please confirm the chosen option before opening the PR.

## 7. Risks / gotchas

- `TransactionManager` does not destructure `accessToken` in its props — the commented block would not compile if uncommented as-is. Removing the `accessToken` prop is required.
- `IncomeDataResponse.error` is typed `null` (non-optional) in the old types; the new repo's `IncomeErrorResponse` (`records.types.ts:269-275`) is the axios-error shape. Mirror `ExpenseTemplate`'s `onError` handling: check for axios error shape and toast the shared `CREATE_EXPENSE_INCOME_ERROR`.
- `AGENTS.md` test conventions are strict: no `fireEvent` (use `userEvent`), no mocking the component under test, no mocking custom hooks, no mocking `@/shared/utils/*`, no mocking `sonner` or `next/navigation`, no `require()`, no `querySelector`/`container` extraction — always query via `screen`. New test must follow `RecordPreviewDrawer.test.tsx` / `DeleteRecordModal.test.tsx` patterns.
- CI `.env` only sets `REACT_APP_LOCAL_STORAGE=BUDGET_MASTER` — tests should not depend on other env vars.
- `pnpm test` always collects coverage (`collectCoverage: true` in `jest.config.ts`), so every run writes to `coverage/`. This is expected.
- There is no `typecheck` script; rely on `next build` / editor TS for type errors.
- `pnpm test` does not load `.env.local`; it loads `.env` (only `REACT_APP_LOCAL_STORAGE` in CI). The test must not depend on `BACKEND_URI`, `SESSION_SECRET_KEY`, or `FRONTEND_URI` being set.

## 8. Verification plan (after implementation)

1. `pnpm lint` — ESLint (`next/core-web-vitals` + `next/typescript`).
2. `pnpm build` — there is no `typecheck` script; rely on `next build` for TS errors.
3. `pnpm test -- __tests__/features/Records/IncomeTemplate/IncomeTemplate.test.tsx` — records coverage to `coverage/`.
4. Manual: `pnpm dev`, visit `/create-record`, click "Ingreso", verify form renders, validation triggers, and a successful create redirects to `/dashboard`.

## 9. Reference: full file paths (absolute)

### Old repo
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/features/Records/IncomeTemplate.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/features/Records/TransactionManager.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/features/Records/TransactionManagerGroupButton.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/features/Records/EditIncome.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/features/Records/RecordsPreviewDrawer.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/features/Categories/TransactionCategorizerDropdown.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/features/Records/ExpensesPaid/SelectPaidSection.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/features/Records/ExpensesPaid/SelectPaidDrawer.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/types/records.types.ts`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/types/categories.types.ts`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/types/dashboard.types.ts`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/utils/records.utils.ts`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/hooks/useSelectExpensesPaid.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/hooks/useCategoriesForm.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/hooks/useManageTags.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/constants/records.constants.ts`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/constants/Global.constants.ts`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/app/create-record/page.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/__tests__/feature/Records/IncomeTemplate.test.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/__tests__/mocks/records.mock.ts`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/__tests__/mocks/categories.mock.ts`

### New repo (relevant existing files)
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/features/Records/TransactionManager.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/features/Records/TransactionManagerGroupButton.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/features/Records/ExpenseTemplate/ExpenseTemplate.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/features/Records/ExpenseTemplate/CancelButtonExpenseTemplate.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/features/Records/RecordsPreviewDrawer.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/features/Categories/TransactionCategorizerDropdown.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/types/records.types.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/types/dashboard.types.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/types/categories.types.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/types/accounts.types.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/types/budgets.types.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/utils/records.utils.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/constants/records.constants.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/constants/global.constants.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/constants/categories.constants.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/zustand/store/dashboard.store.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/zustand/provider/dashboard-store-provider.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/app/QueryProviderWrapper.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/app/api/records/income/route.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/app/api/records/expense/route.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/app/create-record/page.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/ui/organisms/AppRouterContextProviderMock.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/__tests__/features/Records/RecordPreviewDrawer.test.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/__tests__/features/Records/DeleteRecordModal.test.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/__tests__/mocks/records.mock.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/__tests__/mocks/categories.mock.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/__tests__/mocks/accounts.mock.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/__tests__/home.test.tsx`
