# Research: Port Create-Transfer Feature to `new-budget-master`

## 1. Feature scope (per stakeholder decisions)

| Decision | Value |
|---|---|
| Feature scope | **MVP** — create transfer only; **edit-transfer page is out of scope** (see Open Items) |
| Edit flow | **Create only** — wire up the "Crear Transferencia" subscreen in `TransactionManager`. Edit page left unbuilt (see Open Items) |
| Folder structure | Mirror old repo → `src/features/Records/TransferTemplate.tsx` + `src/features/Records/Transfer/TransferAccountsSelector.tsx` |
| Account selection | **Two dropdowns (pick both origin and destination)** — origin defaults to the cookie/selected account; user may change it; destination excludes the origin |
| `expensesPaid` sub-feature | **Out of scope** — the credit-destination "select paid expenses" drawer/section/useSelectExpensesPaid hook are deferred (consistent with Income MVP) |
| Cancel button | Reuse existing `CancelButtonExpenseTemplate` with `action="create"` |
| Edit drawer | **Option A patch** — toast "La edición de transferencias aún no está disponible.", no navigation |

## 2. Source / target mapping

### 2.1 Source — `old-budget-master` reference files (`develop` branch, read-only)

The old repo has a **complete, finished** `TransferTemplate.tsx` (333 lines) plus supporting files on `develop`:

| Concern | Old repo path |
|---|---|
| TransferTemplate component (create + edit wiring) | `old-budget-master/src/features/Records/TransferTemplate.tsx` (333 lines) |
| Account selector (origin/destination dropdowns) | `old-budget-master/src/features/Records/Transfer/TransferAccountsSelector.tsx` (55 lines) |
| Edit-transfer wrapper | `old-budget-master/src/features/Records/Transfer/EditTransfer.tsx` |
| Transfer bank-accounts hook (fetch + state) | `old-budget-master/src/shared/hooks/useTransferBankAccounts.tsx` (92 lines) |
| Edit-transfer hook | `old-budget-master/src/shared/hooks/useEditTransfer.tsx` |
| Records utils (createTransferCb + getValuesIncomeAndExpense + getOriginAccountForEdit) | `old-budget-master/src/shared/utils/records.utils.ts:110-123, 175-210` |
| Transfer types | `old-budget-master/src/shared/types/records.types.ts` |
| Edit-transfer page | `old-budget-master/src/app/edit-record/edit-transfer/page.tsx` |
| TransactionManager render block | `old-budget-master/src/features/Records/TransactionManager.tsx:86-93` |
| Transfer test suite (reference) | `old-budget-master/__tests__/feature/Records/TransferTemplate.test.tsx` + `Transfer/TransferAccountsSelector.test.tsx` |

### 2.2 Target — `new-budget-master` files to create/modify

| # | File | Action |
|---|---|---|
| 1 | `src/app/api/records/transfer/route.ts` | **Create** — new BFF route handler with `POST` |
| 2 | `src/shared/utils/records.utils.ts` | **Edit** — add `createTransferCb` (POST) + `getValuesIncomeAndExpense` utility |
| 3 | `src/shared/hooks/useTransferBankAccounts.tsx` | **Create** — BFF-adapted version (no `accessToken` prop) |
| 4 | `src/features/Records/TransferTemplate.tsx` | **Create** |
| 5 | `src/features/Records/Transfer/TransferAccountsSelector.tsx` | **Create** |
| 6 | `src/features/Records/TransactionManager.tsx` | **Edit** — uncomment `TransferTemplate` import + render block; add `resAccounts` prop; drop `accessToken` |
| 7 | `src/app/create-record/page.tsx` | **Edit** — add `fetchAccounts()` call so the accounts list reaches `TransactionManager` |
| 8 | `src/features/Records/RecordsPreviewDrawer.tsx` | **Edit** — block transfer edit with toast (Option A) |
| 9 | `src/shared/constants/global.constants.ts` | **Edit** — add `TRANSFER_API_ENDPOINT = '/api/records/transfer'` |
| 10 | `__tests__/features/Records/TransferTemplate/TransferTemplate.test.tsx` | **Create** |
| 11 | `__tests__/features/Records/TransferTemplate/TransferAccountsSelector.test.tsx` | **Create** |
| 12 | `__tests__/features/Records/RecordPreviewDrawer.test.tsx` | **Edit** — update transfer-edit test to assert no-nav |
| 13 | `REPO_CONTEXT.md` | **Edit** — add `/api/records/transfer` row + remove from "Not yet proxied" |

## 3. Current state of `new-budget-master` (what already exists vs. gaps)

### 3.1 Already present — no work needed
- `TransactionScreens` includes `'transfer'` (`src/shared/types/dashboard.types.ts:3`).
- `TransactionManagerGroupButton` already renders the "Transferencia" button with active state (`src/features/Records/TransactionManagerGroupButton.tsx`).
- Transfer **types** fully defined in `src/shared/types/records.types.ts`:
  - `CreateTransferValues` — `:145-156` (`origin`, `destination`, plus the standard `amount/budgets/category/date/description/shortName/subCategory/tag` payload)
  - `TransferExpense` — `:158-172` (`account`, `typeOfRecord: 'transfer'`, `isPaid`, `linkedBudgets: never[]`, `indebtedPeople: never[]`)
  - `TransferIncome` — `:174-187` (`account`, `expensesPaid`, `indebtedPeople: never[]`)
  - `CreateTransferPayload` — `:189-192` (`{ expense: TransferExpense, income: TransferIncome }`)
  - `TransferDataResponse` — `:214-223` (`{ data: { expense, income }, error, message, success, version }`)
  - `TransferErrorResponse` — `:277-283`
  - `TransferRecord` — `:11-14` (`transferId`, `account`)
  - `AccountTransfer` — `src/shared/types/accounts.types.ts:48`
- `EDIT_TRANSFER_PAGE_ROUTE = '/edit-record/edit-transfer'` — `src/shared/constants/global.constants.ts:13`. `RecordsPreviewDrawer.tsx:79` already routes transfer edits there.
- `DESTINATION_ACC_REQUIRED` — `src/shared/constants/records.constants.ts:21` (already exists).
- `IncomeExpenseSchema` (shared validation) — `records.types.ts:335-340`.
- `CancelButtonExpenseTemplate` — already used by `ExpenseTemplate` and `IncomeTemplate`.
- `useCurrencyField`, `useCategoriesForm`, `useManageTags`, `useMediaQuery`, `TransactionCategorizerDropdown` — all present and reused verbatim from Expense/Income templates.
- `fetchAccounts` server action — `src/shared/lib/dashboard.lib.ts:12` (returns `GetAccountsResponse = { detailedError, accounts: AccountBank[] }`).
- Test fixtures: `transferRecordMock`, `editTransfer` in `__tests__/mocks/records.mock.ts`; `mockCategories`, `mockAccounts`.
- The `transfer` edit branches already exist in `RecordsPreviewDrawer.tsx:78-80` and `DeleteRecordModal.tsx:66-75`.

### 3.2 Gaps — must be built

1. **`POST /api/records/transfer` BFF route handler** — does not exist (no `/src/app/api/records/transfer/` folder).
2. **`createTransferCb` client callback** — does not exist in `records.utils.ts`.
3. **`getValuesIncomeAndExpense` utility** — does not exist (builds the dual `{ expense, income }` payload from a single `CreateTransferValues`).
4. **`useTransferBankAccounts` hook** — does not exist. The old version uses `getAccountsCb(accessToken)` (direct axios with bearer); the BFF version must fetch accounts via the existing `fetchAccounts` server action **server-side** and pass the accounts list down, OR add a GET BFF route / client-side `useQuery`. See §4 for the chosen approach.
5. **`TransferTemplate.tsx`** — does not exist (only a commented-out block in `TransactionManager.tsx:72-81`).
6. **`TransferAccountsSelector.tsx`** — does not exist.
7. **`TRANSFER_API_ENDPOINT`** constant — does not exist in `global.constants.ts`.
8. **`TransactionManager` wiring** — needs an `resAccounts` prop so TransferTemplate can render the account dropdowns without its own fetch.
9. **`/create-record/page.tsx`** — needs to call `fetchAccounts()` and pass `resAccounts` through `TransactionManager`.
10. **`RecordsPreviewDrawer` Option-A patch** for transfers — transfer edit currently pushes to a 404.
11. **Tests** under `__tests__/features/Records/TransferTemplate/`.

## 4. Architectural difference between old and new repo (critical)

### 4.1 BFF pattern (auth + token)
The old `TransferTemplate` receives `accessToken: string` and calls the backend directly via axios with a bearer header. The new repo uses a **BFF pattern** — client components never see the access token. Route handlers in `src/app/api/**` inject it from the `jose`-signed httpOnly session cookie.

➡ **TransferTemplate must mirror Expense/Income**: no `accessToken` prop; `createTransferCb` POSTs to `TRANSFER_API_ENDPOINT` (`/api/records/transfer`) with no auth header. The route handler injects it from the session cookie, mirroring `src/app/api/records/expense/route.ts`.

### 4.2 Accounts availability — the `useTransferBankAccounts` question
The old `useTransferBankAccounts` uses `useQuery({ queryKey: ['accounts'], queryFn: () => getAccountsCb(accessToken) })` — a **client-side** fetch against `${BACKEND_URI}/account-actions` with a bearer. In the BFF architecture there is no client-side `getAccountsCb` and `/api/accounts/route.ts` only exposes `POST|PUT|DELETE` (no `GET`).

**Decision: server-side fetch, no new BFF GET route.** Add `fetchAccounts()` to the existing server-side pipeline in `/create-record/page.tsx` (it already `Promise.all`'s `getAccessToken()`, `getAccountCookie()`, `fetchCategories()`, `fetchAllBudgets()`), then pass `resAccounts: GetAccountsResponse` down through `TransactionManager` to `TransferTemplate`. This:
- Reuses the existing `"use server"` `fetchAccounts` in `dashboard.lib.ts` (which already reads the session cookie via `getAccessToken()`)
- Mirrors how categories and budgets already flow into `TransactionManager`
- Avoids a new BFF route + a new `getAccountsCb` client callback + a new `useQuery` (one fewer file, no duplicate network round-trip)
- Keeps `TransferTemplate` pure-presentational w.r.t. accounts (no fetch inside the template)

➡ `useTransferBankAccounts` becomes a **pure state hook** (no `useQuery`): it takes `accounts: AccountBank[]` and `selectedAccount: string | null` as args, derives `accountsFormatted`/`destinationAccounts`/`origin`/`destination`, and exposes the setters. This is a much smaller hook than the old one.

### 4.3 The `expensesPaid` credit-destination branch
The old `TransferTemplate` conditionally renders `SelectPaidSection`/`SelectPaidDrawer` only when `destination?.type === 'Crédito'`. Those components (and `useSelectExpensesPaid`) do **not** exist in the new repo and were deferred by the Income research. For the transfer MVP:
- **Drop the credit-destination conditional** entirely from the create flow.
- `getValuesIncomeAndExpense` always builds the income-side `expensesPaid` as `[]` (call site passes `[]` and the props get pruned).
- This keeps `TransferIncome.expensesPaid: []` consistent with the Income MVP.

## 5. Implementation plan (high level)

### 5.1 `src/app/api/records/transfer/route.ts` (Create)
Mirror `src/app/api/records/expense/route.ts:8-26` (POST only for MVP):
- `POST(request)`:
  - `await getAccessToken()`
  - `const payload: CreateTransferPayload = await request.json()`
  - `uri = \`${BACKEND_URI}/records/transfer\``  (note: NOT `/incomes-actions` — this is the newer `records` controller; see `records.constants.ts:7` `TRANSFER_ROUTE = 'records/transfer'`)
  - `axios.post<TransferDataResponse>(uri, payload, { headers: { Authorization: \`Bearer ${accessToken}\` } })`
  - return `NextResponse.json(data, { status: 201 })`
  - catch → `console.error('Error creating a transfer:', error)` → `error.response.data.error.message` → `NextResponse.json({ message }, { status: 400 })`

### 5.2 `src/shared/utils/records.utils.ts` (Edit)

Add `createTransferCb` after `editIncomeCb`, mirroring `createExpenseCb`:

```ts
export const createTransferCb = async (payload: CreateTransferPayload): Promise<TransferDataResponse> => {
  try {
    const response = await axios.post<TransferDataResponse>(TRANSFER_API_ENDPOINT, payload)
    const data = response.data
    return data
  } catch (error) { throw error }
}
```

Add `getValuesIncomeAndExpense` after `resetEditRecordLS` (port verbatim from old `records.utils.ts:175-196`, no auth changes — pure utility). MVP simplification: drop the `expensesSelected` arg, always emits `expensesPaid: []`.

### 5.3 `src/shared/constants/global.constants.ts` (Edit)
Add:
```ts
export const TRANSFER_API_ENDPOINT = '/api/records/transfer'
```
(alongside `EXPENSE_API_ENDPOINT`/`INCOME_API_ENDPOINT`)

### 5.4 `src/shared/hooks/useTransferBankAccounts.tsx` (Create)
BFF-adapted pure-state version — no `useQuery`, no `accessToken`, no fetch. Signature:

```ts
export const useTransferBankAccounts = ({
  accounts, selectedAccountId
}: {
  accounts: AccountBank[]
  selectedAccountId: string | null
}) => {
  // ... derive accountsFormatted (AccountTransfer[]), origin, destination, destinationAccounts
  // updateOrigin(account) → filters destination list + clears destination
  // updateDestination(account)
  // handleDestinationError(error)
}
```

- Convert `AccountBank[]` → `AccountTransfer[]` (`{ accountId, name, type }`) using `transformAccountsDisplay` from `accounts.utils` or inline mapping (`accountId: account._id, name: account.title, type: account.accountType as AccountTypes`).
- Default origin = matching `selectedAccountId` (or first account if not found).
- Default `destinationAccounts` = all accounts except origin.
- Expose `updateEditOrigin`/`updateEditDestination` only if the edit flow needs them — **defer** for create-only MVP.

### 5.5 `src/features/Records/Transfer/TransferAccountsSelector.tsx` (Create)
Port the old file near-verbatim (55 lines). It takes `origin`, `destination`, `accountsFormatted`, `destinationAccounts`, `destinationError`, `updateOrigin`, `updateDestination`, `isPending`. No `accessToken`, no auth — pure presentational. The `isPending` prop falls away once the accounts are pre-fetched server-side (always `false` in MVP), but keep it on the interface for parity.

### 5.6 `src/features/Records/TransferTemplate.tsx` (Create)
Mirror `ExpenseTemplate.tsx` with these changes from the difference matrix:

| Aspect | `ExpenseTemplate` | `TransferTemplate` (this work) |
|---|---|---|
| Props | `categories`, `budgetsFetched`, `selectedAccount`, `editRecord`, `detailedErrorCategories`, `detailedErrorBudgets` | `categories`, `selectedAccount`, `resAccounts` (`GetAccountsResponse`), `detailedErrorCategories`, `editRecord` (**drop `budgetsFetched`/`detailedErrorBudgets`**) |
| Hooks | `useCurrencyField`, `useCategoriesForm`, `useManageTags`, `useHandleBudgets`, `useIndebtedPeople`, `useMediaQuery` | `useCurrencyField`, `useCategoriesForm`, `useManageTags`, `useMediaQuery`, **+ `useTransferBankAccounts`** (**drop budget/indebted-people hooks**) |
| Account selector | — | **`TransferAccountsSelector`** (new) |
| Mutation callbacks | `createExpenseCb` / `editExpenseCb` | `createTransferCb` |
| Response types | `ExpenseDataResponse` / `ExpenseErrorResponse` | `TransferDataResponse` / `TransferErrorResponse` |
| Yup schema | `IncomeExpenseSchema` (shared) | `IncomeExpenseSchema` (shared) — reuse as-is |
| `typeOfRecord` | `'expense'` | n/a — payload uses `CreateTransferValues` then `getValuesIncomeAndExpense` builds both sides with `typeOfRecord: 'transfer'` |
| `buttonText` | `'Editar gasto'` / `'Crear gasto'` | `'Editar transferencia'` (unused in MVP) / `'Crear transferencia'` |
| Categories | full shared list | Same |
| Cancel button | `CancelButtonExpenseTemplate` | `CancelButtonExpenseTemplate` with `action="create"` |
| Budget dropdown | `SelectBudgetDropdown` | **Drop** |
| `PersonalDebtManager` | Yes | **Drop** |
| `isPaid` toggle | Yes (credit) | **Drop** |
| `expensesPaid`/credit-destination branch | n/a | **Drop** (MVP) |
| `FurtherDetailsAccordion` contents | Tags + PersonalDebtManager | Tags only |
| Validation extra checks | category/subcategory/amount-zero | category/subcategory/amount-zero **+ destination-required** (`DESTINATION_ACC_REQUIRED`) |
| Error toast | `CREATE_EXPENSE_INCOME_ERROR` | `CREATE_EXPENSE_INCOME_ERROR` (reuse — name already covers all three record types) |

#### `onSubmit` payload (MVP)

```ts
const values: CreateTransferValues = {
  amount: amountNumber,                  // cleanCurrencyString(currencyState)
  budgets: [],
  category: categorySelected.categoryId,
  date,
  description: data.description ?? '',
  shortName: data.shortDescription,
  subCategory: subcategory,
  origin: origin?.accountId ?? '',
  destination: destination?.accountId ?? '',
  tag: tags.current,
}
const { newValuesExpense, newValuesIncome } = getValuesIncomeAndExpense({ values, expensesSelected: [] })
createTransfer({ expense: newValuesExpense, income: newValuesIncome })
```

(the `editRecord` branch + `useEditTransfer` are deferred for MVP — the create-only flow never calls them; keep the dead branch out to minimize the diff, or keep for parity, per planning decision.)

#### Mutations
`createTransfer` → `useMutation<TransferDataResponse, TransferErrorResponse, CreateTransferPayload>({
  mutationFn: createTransferCb,
  onSuccess: () => { router.refresh(); setTimeout(() => router.push(DASHBOARD_ROUTE), 1000) },
}));
onError handled via `useEffect` watching `isErrorCreate` + `messageErrorCreate` → `toast.error(CREATE_EXPENSE_INCOME_ERROR)`. Mirror `ExpenseTemplate.tsx:94-123, 164-169`.

### 5.7 `src/features/Records/TransactionManager.tsx` (Edit)
- Add `resAccounts: GetAccountsResponse` to the props interface.
- Uncomment the import: `import { TransferTemplate } from "./TransferTemplate"`.
- Uncomment + fix the render block at `:72-81`, drop `accessToken`/`subscreen` props, pass `resAccounts`:
  ```tsx
  { subscreen === 'transfer' && (
    <TransferTemplate
      categories={categories}
      selectedAccount={selectedAccount}
      resAccounts={resAccounts}
      detailedErrorCategories={errorCategories}
      editRecord={null}
    />
  )}
  ```
- Destructure `resAccounts` at the top: `const { accounts, detailedError: errorAccounts } = resAccounts` (optional — only `accounts` is consumed by `TransferTemplate`).

### 5.8 `src/app/create-record/page.tsx` (Edit)
Add `resAccounts = await fetchAccounts()` to the existing `Promise.all` and pass it through:
```tsx
<TransactionManager ... resAccounts={resAccounts} />
```
No other changes — the existing `Promise.all` already awaits `fetchCategories`, `fetchAllBudgets`, etc.

### 5.9 `src/features/Records/RecordsPreviewDrawer.tsx` (Edit)
Mirror the Income Option-A patch:
- Change the transfer branch in `handleEditRecord` (`:78-80`):
  ```ts
  if (record.typeOfRecord === 'transfer') {
    toast.error("La edición de transferencias aún no está disponible.")
    return
  }
  ```
- Remove `EDIT_TRANSFER_PAGE_ROUTE` from the import if it becomes unused (`no-unused-vars`).
- `toast` is already imported (added by the Income story); no new import.

### 5.10 `__tests__/features/Records/TransferTemplate/TransferTemplate.test.tsx` (Create)
Pattern reference: `__tests__/features/Records/IncomeTemplate/IncomeTemplate.test.tsx`.
- Wrappers: `QueryProviderWrapper` + `AppRouterContextProviderMock` (`push`/`refresh`). **No** `DashboardStoreProvider` (TransferTemplate does not call `useDashboardStore`).
- `Object.defineProperty(window, 'matchMedia', ...)` mock (same as Income).
- Mocks: `jest.mock('axios')`. **Do not** mock `@/shared/utils/*`, hooks, `sonner`, `next/navigation`.
- Build props inline: `mockAccounts` (mapped to `AccountBank[]` or `GetAccountsResponse`), `mockCategories`, `AccountsCookie` literal, `detailedErrorCategories={null}`, `editRecord={null}`.
- Test cases:
  1. Renders: `Origen:`, `Destino:`, `Cantidad`, `Pequeña descripción`, `Descripción (opcional)`, category/subcategory dropdowns, `Cancelar`, `Crear transferencia`.
  2. shortDescription required.
  3. description length 3..300.
  4. category required.
  5. amount zero.
  6. **destination required** — submit without destination → `DESTINATION_ACC_REQUIRED`.
  7. origin changes → destination list updates (destination excludes origin).
- **Out of test scope** (per §4.3 + §1): edit-mode tests, `expensesPaid` tests, `useEditTransfer` tests, `SelectPaidDrawer` tests.

### 5.11 `__tests__/features/Records/TransferTemplate/TransferAccountsSelector.test.tsx` (Create)
Pure-presentational. Render with props literal, assert the two dropdowns render, `destinationError` shows when set, dropdown items list excludes the origin.

### 5.12 `__tests__/features/Records/RecordPreviewDrawer.test.tsx` (Edit)
Update the existing transfer-edit test (it currently asserts `push('/edit-record/edit-transfer')`) to assert `push` is NOT called.

### 5.13 `REPO_CONTEXT.md` (Edit)
- Add a row to the API route table: `| \`/api/records/transfer\` | \`POST\` | \`…/records/transfer/route.ts\` | BFF proxy | Create transfer (forwards to \`${BACKEND_URI}/records/transfer\`) |`
- Remove `POST /records/transfer` from the "Not yet proxied" list.

## 6. Open items / follow-ups (NOT in this scope)

1. **Edit-transfer page** — `src/app/edit-record/edit-transfer/page.tsx` + `EditTransfer` wrapper + `useEditTransfer` hook. **Not built now.** Side effect: `RecordsPreviewDrawer` currently routes transfers to `EDIT_TRANSFER_PAGE_ROUTE`; until that page exists, the edit button is patched (Option A) to toast. Restoring the edit path is what reverts the drawer patch.
2. **`expensesPaid` sub-feature** — `useSelectExpensesPaid` + `SelectPaidSection` + `SelectPaidDrawer` + fetch-expenses-by-date endpoint + the credit-destination conditional in `TransferTemplate`. `TransferIncome.expensesPaid` stays `[]` in MVP. Source files in old repo: `src/features/Records/ExpensesPaid/*`, `src/shared/hooks/useSelectExpensesPaid.tsx`. Tracked in `ai-research/DEFERRED_ITEMS.md`.
3. **`useEditTransfer` + edit callbacks** (`editExpenseTransferCb`/`editIncomeTransferCb`) — deferred alongside the edit page.
4. **BFF GET on `/api/accounts`** — deferred; `fetchAccounts` server action covers the create-record flow. Revisit if a client-side accounts refetch is ever needed (e.g. after creating an account mid-flow).

## 7. Open questions (pending answer — to be resolved before planning)

**Q1:** The backend `POST /records/transfer` endpoint is listed in `REPO_CONTEXT.md` → "Not yet proxied" as a real backend route, and `CreateTransferPayload` (`{ expense: TransferExpense, income: TransferIncome }`) is already typed in `records.types.ts`. Is the existing typed payload trusted as the backend DTO, or should I draft the backend-research delegation prompt (`.opencode/command/backend-research.md`) so you can confirm the DTO with the backend agent before planning?

- **Option A** — Trust the existing types (fastest; risks a runtime 400 if the backend payload diverges).
- **Option B** — Draft the delegation prompt and wait (safer; aligns with REPO_CONTEXT.md's "read the backend DTO first" rule).

**Q2:** The dual `editRecord` dead branch — keep the `useEditTransfer` mutation declaration + the `if (editRecord)` branch in `onSubmit` for parity with the old repo (and easier future edit-PR), or strip them for a smaller create-only diff? (Income kept them — D1.)

## 8. Risks / gotchas

- `/create-record` is **outside** the dashboard layout, so `useDashboardStore` is NOT available to `TransferTemplate`. Accounts must flow as props from `/create-record/page.tsx` → `TransactionManager` → `TransferTemplate` (decision §4.2). Do not call `useDashboardStore` inside `TransferTemplate`.
- `useTransferBankAccounts` becomes a **pure-state hook** in the BFF version (no `useQuery`). Tests that imported `useTransferBankAccounts` to spy on a fetch will need adjustment — none exist yet, so this is a clean slate. Per `.github/copilot-instructions.md`, do not mock this hook in component tests; instead pass mock `accounts` as a prop.
- The `RecordsPreviewDrawer` income Option-A patch (from the Income story) already added `toast` import and removed `EDIT_INCOME_PAGE_ROUTE`. Confirm `EDIT_TRANSFER_PAGE_ROUTE` removal is safe — the drawer's only consumer of `EDIT_TRANSFER_PAGE_ROUTE` is the transfer branch; once that's patched, the import is unused.
- `$ "./src/shared/utils/formatNumberCurrency.utils"` — old repo path; new repo has `@/shared/utils/currency.utils` (`cleanCurrencyString`). Use the new path.
- `DatetimePicker` import — old repo has `@/shared/ui/atoms/DatetimePicker`; new repo has `@/shared/ui/atoms/DateTimePicker` (capital T). Verify in the source before planning.
- `FurtherDetailsAccordeon` (old) → `FurtherDetailsAccordion` (new). The Income story already used the new name.
- The `useQuery` for accounts in the old `useTransferBankAccounts` had `enabled: isTransfer` — gating the fetch on the transfer subscreen. The server-side fetch runs unconditionally now; cost is one extra `fetchAccounts()` call per `/create-record` page load even if the user never opens the transfer subscreen. Acceptable for MVP.
- `pnpm test` always collects coverage; the new test files will write to `coverage/`.
- CI `.env` only sets `REACT_APP_LOCAL_STORAGE=BUDGET_MASTER` — tests must not depend on `BACKEND_URI`/`SESSION_SECRET_KEY`/`FRONTEND_URI`.

## 9. Verification plan (after implementation)

1. `pnpm lint` — ESLint (`next/core-web-vitals` + `next/typescript`).
2. `pnpm build` — there is no `typecheck` script; rely on `next build` for TS errors.
3. `pnpm test -- __tests__/features/Records/TransferTemplate/` — targeted.
4. `pnpm test` — full suite must stay green.
5. Manual: `pnpm dev`, visit `/create-record`, click "Transferencia", verify both account dropdowns render (origin defaults, destination excludes origin), validation triggers, a successful create redirects to `/dashboard`.

## 10. Reference: full file paths (absolute)

### Old repo (develop branch — the correct, finished reference)
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/features/Records/TransferTemplate.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/features/Records/Transfer/TransferAccountsSelector.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/features/Records/Transfer/EditTransfer.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/hooks/useTransferBankAccounts.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/hooks/useEditTransfer.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/shared/utils/records.utils.ts`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/src/app/edit-record/edit-transfer/page.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/__tests__/feature/Records/TransferTemplate.test.tsx`
- `/Users/rafaelmorog/projects/budget-master/old-budget-master/__tests__/feature/Records/Transfer/TransferAccountsSelector.test.tsx`

### New repo (relevant existing files)
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/features/Records/TransactionManager.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/features/Records/ExpenseTemplate/ExpenseTemplate.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/features/Records/IncomeTemplate/IncomeTemplate.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/features/Records/RecordsPreviewDrawer.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/app/api/records/expense/route.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/app/api/accounts/route.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/app/create-record/page.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/lib/dashboard.lib.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/utils/accounts.utils.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/utils/records.utils.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/types/records.types.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/types/accounts.types.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/constants/global.constants.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/shared/constants/records.constants.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/src/zustand/store/dashboard.store.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/__tests__/mocks/records.mock.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/__tests__/mocks/accounts.mock.ts`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/__tests__/features/Records/RecordPreviewDrawer.test.tsx`
- `/Users/rafaelmorog/projects/budget-master/new-budget-master/__tests__/features/Records/IncomeTemplate/IncomeTemplate.test.tsx`