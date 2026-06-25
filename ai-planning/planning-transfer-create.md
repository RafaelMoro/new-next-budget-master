# Planning: Port Create-Transfer Feature to `new-budget-master`

- **Source research:** `ai-research/TRANSFER_FEATURE_RESEARCH.md`
- **Sign-off date:** 2026-06-25
- **PR label:** `minor` (new user-facing feature, no breaking change)
- **Target branch:** `develop`
- **Ponytail mode:** ultra (deletion before addition; minimum that works)

---

## Acceptance Criteria

Copied from research §1 (each traces to a concrete change below):

1. **AC1** — User can open the "Transferencia" subscreen in `/create-record` and see a create-transfer form (origin + destination dropdowns, amount, descriptions, category/subcategory, date, tags, cancel, submit).
2. **AC2** — Origin defaults to the cookie/selected account; destination dropdown excludes the origin; changing origin clears destination.
3. **AC3** — Submitting a valid transfer POSTs to the backend `POST /records/transfer` via a new BFF route `POST /api/records/transfer`, then redirects to `/dashboard`.
4. **AC4** — Validation: shortDescription required (3..50), description optional (3..300 when set), category required, subcategory required, amount > 0, **destination required** (`DESTINATION_ACC_REQUIRED`).
5. **AC5** — Editing a transfer from `RecordsPreviewDrawer` shows a toast "La edición de transferencias aún no está disponible." and does not navigate (Option A patch).
6. **AC6** — `expensesPaid`, edit-transfer page, `useEditTransfer`, and credit-destination conditional are **out of scope** (deferred per `ai-research/DEFERRED_ITEMS.md` items 4 & 5).

---

## Affected files

### `src/app/api/**`
| File | Action |
|---|---|
| `src/app/api/records/transfer/route.ts` | **Create** — `POST` BFF proxy to `${BACKEND_URI}/records/transfer` |

### `src/features/Records/**`
| File | Action |
|---|---|
| `src/features/Records/TransferTemplate.tsx` | **Create** |
| `src/features/Records/Transfer/TransferAccountsSelector.tsx` | **Create** |
| `src/features/Records/TransactionManager.tsx` | **Modify** — uncomment import + render block; add `resAccounts` prop; drop `accessToken`/`subscreen` |
| `src/features/Records/RecordsPreviewDrawer.tsx` | **Modify** — Option A toast patch for transfer edit |

### `src/shared/**`
| File | Action |
|---|---|
| `src/shared/constants/global.constants.ts` | **Modify** — add `TRANSFER_API_ENDPOINT` |
| `src/shared/utils/records.utils.ts` | **Modify** — add `createTransferCb` + `getValuesIncomeAndExpense` |
| `src/shared/hooks/useTransferBankAccounts.tsx` | **Create** — pure-state hook (no `useQuery`, no fetch) |

### `src/app/**`
| File | Action |
|---|---|
| `src/app/create-record/page.tsx` | **Modify** — add `fetchAccounts()` to `Promise.all`; pass `resAccounts` |

### `__tests__/**`
| File | Action |
|---|---|
| `__tests__/features/Records/TransferTemplate/TransferTemplate.test.tsx` | **Create** |
| `__tests__/features/Records/TransferTemplate/TransferAccountsSelector.test.tsx` | **Create** |
| `__tests__/features/Records/RecordPreviewDrawer.test.tsx` | **Modify** — flip transfer-edit assertion to no-nav |

### Docs
| File | Action |
|---|---|
| `REPO_CONTEXT.md` | **Modify** — add route row; remove from "Not yet proxied" |

---

## Phases

### Phase 1 — Plumbing: BFF route + constant + utils

Independently testable: the route handler compiles and `/api/records/transfer` exists, even with no UI consumer yet.

#### Changes Required

**`src/shared/constants/global.constants.ts`** — Modify, after line 22 (`INCOME_API_ENDPOINT`):
```ts
export const TRANSFER_API_ENDPOINT = '/api/records/transfer'
```
Ponytail: one line, mirrors the two siblings above it.

**`src/app/api/records/transfer/route.ts`** — Create. Mirror `src/app/api/records/expense/route.ts:8-26` (POST only). Structure:
- `export async function POST(request: NextRequest)`
- `await getAccessToken()`
- `const payload: CreateTransferPayload = await request.json()`
- `const uri = \`${process.env.BACKEND_URI}/records/transfer\`` (note: `records/transfer`, the newer controller — NOT `/expenses-actions`)
- `axios.post<TransferDataResponse>(uri, payload, { headers: { Authorization: \`Bearer ${accessToken}\` } })`
- success → `NextResponse.json(data, { status: 201 })`
- catch → `console.error('Error creating a transfer:', error)` → extract `error.response.data.error.message` → `NextResponse.json({ message }, { status: 400 })`

No PUT/DELETE — MVP is create-only. Don't add them "for later" (ponytail: YAGNI).

**`src/shared/utils/records.utils.ts`** — Modify.
- Add `createTransferCb` after `editIncomeCb` (line 68), mirroring `createExpenseCb:30-38`. Signature: `(payload: CreateTransferPayload) => Promise<TransferDataResponse>`. POSTs to `TRANSFER_API_ENDPOINT`. Update the type import on line 2 to include `CreateTransferPayload, TransferDataResponse`.
- Add `getValuesIncomeAndExpense` after `resetEditRecordLS` (line 76). Pure utility — no auth. Input: `{ values: CreateTransferValues, expensesSelected: ExpensePaid[] }` (for parity with old repo signature; call site always passes `[]`). Returns `{ newValuesExpense: TransferExpense, newValuesIncome: TransferIncome }`. Builds:
  - `newValuesExpense`: `{ ...values, account: values.origin, typeOfRecord: 'transfer', isPaid: true, linkedBudgets: [], indebtedPeople: [] }` (drop `origin`/`destination` keys — they are NOT in `TransferExpense`)
  - `newValuesIncome`: `{ ...values, account: values.destination, typeOfRecord: 'transfer', expensesPaid: [], indebtedPeople: [] }` (drop `origin`/`destination`)
  - Ponytail: the `expensesSelected` arg is kept for signature parity but unused in MVP → `expensesPaid: expensesSelected` (always `[]` at call site). Add `// ponytail: expensesSelected arg retained for parity; always [] in MVP, credit-destination path deferred`.

**`REPO_CONTEXT.md`** — Modify (repo convention; fold docs into this phase):
- Add row to the API route table (§`src/app/api/`): `| \`/api/records/transfer\` | \`POST\` | \`…/records/transfer/route.ts\` | BFF proxy | Create transfer (forwards to \`${BACKEND_URI}/records/transfer\`) |`
- Remove `POST /records/transfer` from the "Not yet proxied" list (§External backend reference).

#### Success Criteria
- `pnpm build` green (catches TS errors; no separate typecheck).
- `pnpm lint` green.
- Manual: `pnpm dev` → no console errors on boot; `POST /api/records/transfer` returns 400 with `{ message }` when called unauthenticated (cookie absent) — confirms the handler is wired.

#### Test Coverage
No dedicated route-handler test in MVP — the expense/income handlers have none either (no `__tests__/app/api/records/expense/route.test.ts` exists). Matching repo convention. The handler is exercised end-to-end via `TransferTemplate.test.tsx` (Phase 4), which mocks `axios` at the `createTransferCb` call boundary. Don't invent a route test the repo doesn't have (ponytail: YAGNI).

---

### Phase 2 — `useTransferBankAccounts` hook

Independently testable: the hook is a pure function of `(accounts, selectedAccountId)` → derived state. No fetch, no React Query.

#### Changes Required

**`src/shared/hooks/useTransferBankAccounts.tsx`** — Create. Signature:
```ts
export const useTransferBankAccounts = ({
  accounts, selectedAccountId
}: {
  accounts: AccountBank[]
  selectedAccountId: string | null
}) => {
  // returns: accountsFormatted, destinationAccounts, origin, destination,
  //           destinationError, updateOrigin, updateDestination
}
```

Structure (`"use client"` at top — uses `useState`):
- Map `AccountBank[]` → `AccountTransfer[]` inline (`{ accountId: a._id, name: a.title, type: a.accountType as AccountTypes }`). Ponytail: inline map beats importing `transformAccountsDisplay` if that helper does more than this — verify at impl time; reuse the helper if it already does exactly this.
- `origin` state: default = `accountsFormatted.find(a => a.accountId === selectedAccountId) ?? accountsFormatted[0] ?? null`.
- `destination` state: default `null`.
- `destinationAccounts` = `accountsFormatted.filter(a => a.accountId !== origin?.accountId)`.
- `updateOrigin(account)`: set origin, clear destination (mirror old repo behavior — changing origin invalidates destination).
- `updateDestination(account)`: set destination; clear any `destinationError`.
- `destinationError` state + `handleDestinationError` setter (the old `DESTINATION_ACC_REQUIRED` validation writes here). Ponytail: keep only if `TransferTemplate` actually consumes it for the destination-required validation — it does (AC4). Single string state.
- Do **not** expose `updateEditOrigin`/`updateEditDestination`/`isPending` (deferred — edit flow). `TransferAccountsSelector` does take `isPending` for parity but it's always `false` in MVP; supply a literal at the call site instead of threading a hook output.

#### Success Criteria
- `pnpm build` green.
- No test file (the repo has no `__tests__/shared/hooks/` tests for the equivalent `useCurrencyField`/`useCategoriesForm` either). The hook is covered transitively by `TransferTemplate.test.tsx` (Phase 4, test case 7: origin change updates destination list).

#### Test Coverage
Transitive via Phase 4. Don't add a standalone hook test (ponytail: YAGNI — repo convention doesn't test these hooks in isolation).

---

### Phase 3 — `TransferAccountsSelector` + `TransferTemplate`

Independently testable: both components render in isolation with props literal (no wiring).

#### Changes Required

**`src/features/Records/Transfer/TransferAccountsSelector.tsx`** — Create. Port old repo's 55-line file near-verbatim. Pure presentational. Props:
```ts
{
  origin: AccountTransfer | null
  destination: AccountTransfer | null
  accountsFormatted: AccountTransfer[]           // origin dropdown list (all)
  destinationAccounts: AccountTransfer[]         // destination dropdown list (excludes origin)
  destinationError: string | null
  updateOrigin: (a: AccountTransfer) => void
  updateDestination: (a: AccountTransfer) => void
  isPending: boolean                              // always false in MVP; kept for parity
}
```
Two `Dropdown` selectors (reuse the same dropdown atom the old file used — verify import path against new repo at impl time). Labels `Origen:` / `Destino:`. Render `destinationError` text when set. No `accessToken`, no auth, no fetch. `disabled={isPending}` on both dropdowns.

**`src/features/Records/TransferTemplate.tsx`** — Create. Mirror `IncomeTemplate.tsx` (the closest sibling — no budgets, no indebted people). Props:
```ts
{
  categories: Category[]
  selectedAccount: AccountsCookie | null
  resAccounts: GetAccountsResponse                // { detailedError, accounts: AccountBank[] }
  detailedErrorCategories: DetailedError | null
  editRecord: BankMovement | null                  // always null in create flow (kept for parity)
}
```

Internal structure (mirror IncomeTemplate line-for-line where the matrix below matches; diverge only where noted):

| Concern | Mirror IncomeTemplate? | Notes |
|---|---|---|
| `useRouter`, `useMediaQuery` | yes | |
| `date` state + `DateTimePicker` (capital T — `@/shared/ui/atoms/DateTimePicker`) | yes | |
| `useCurrencyField`, `useCategoriesForm`, `useManageTags` | yes | |
| `useForm` with `yupResolver(IncomeExpenseSchema)` | yes | shared schema |
| `useTransferBankAccounts({ accounts: resAccounts.accounts, selectedAccountId: selectedAccount?.accountId ?? null })` | **NEW** | replaces the account fetch |
| `<TransferAccountsSelector ... />` above `CurrencyField` | **NEW** | origin/destination dropdowns |
| `createTransfer` mutation — `useMutation<TransferDataResponse, TransferErrorResponse, CreateTransferPayload>({ mutationFn: createTransferCb, onSuccess → router.refresh(); setTimeout(router.push(DASHBOARD_ROUTE), 1000) })` | analogous | |
| `useEffect` watching `isErrorCreate` + `messageErrorCreate` → `toast.error(CREATE_EXPENSE_INCOME_ERROR)` | yes | |
| `useEffect` watching `editRecord` to prefill form | **yes (keep dead shape)** | Q2 parity: harmless when `editRecord === null` |
| `buttonText = editRecord?.shortName ? 'Editar transferencia' : 'Crear transferencia'` | yes | kept for parity; create flow always shows the latter |
| **EDIT submit branch** (`if (editRecord?.shortName) { editTransfer(...); return }`) | **STRIP** | edit callbacks `editExpenseTransferCb`/`editIncomeTransferCb` are deferred (DEFERRED #5). Keeping it would require inventing deferred callbacks → scope violation. The branch is unreachable in create flow anyway (`editRecord` is always `null`). Add `// ponytail: edit submit branch stripped — edit-transfer callbacks deferred (DEFERRED_ITEMS #5); create flow passes editRecord=null so this branch is unreachable; restore when building the edit page.` |
| `editTransfer` mutation declaration | **OMIT** | no edit callback exists; don't stub one (ponytail: YAGNI) |
| `CurrencyField`, `shortDescription`, `description`, `TransactionCategorizerDropdown`, tags | yes | identical to Income |
| Budget dropdown / `PersonalDebtManager` / `isPaid` toggle / `expensesPaid` credit-destination conditional | **OMIT** | out of scope (AC6) |
| `FurtherDetailsAccordion` | yes | tags only (same as Income) |
| `CancelButtonExpenseTemplate action="create"` | yes | |
| Submit button `Crear transferencia` | yes | |
| `<Toaster>` on error | yes | |

**`onSubmit` (MVP)** — build `CreateTransferValues` then dual payload via `getValuesIncomeAndExpense`:
```ts
const values: CreateTransferValues = {
  amount: cleanCurrencyString(currencyState),
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
Guard the submit with the same composition of checks as Income (`categoryError`, `subcategoryError`, `isAmountZero`, `errorAmount`, `date`, `subcategory`, `!openTagModal`) **plus** `destination` presence → set `destinationError` to `DESTINATION_ACC_REQUIRED` when missing. Do not block on `selectedAccount` the way Income does (transfer's `origin` replaces that role — `origin` is required via the destination-required-adjacent check; origin always has a default from the hook so no extra guard needed).

Use `cleanCurrencyString` from `@/shared/utils/currency.utils` (NOT the old `formatNumberCurrency.utils` path — research §8). Use `DateTimePicker` (capital T). Use `FurtherDetailsAccordion` (not `FurtherDetailsAccordeon`).

No `DashboardStoreProvider` — `/create-record` is outside the dashboard layout (research §8). Accounts arrive as the `resAccounts` prop only.

#### Success Criteria
- `pnpm build` green.
- Manual (after Phase 5 wires it): not separately testable in the browser until the page passes `resAccounts`.

#### Test Coverage
See Phase 4.

---

### Phase 4 — Tests

Independently testable: `pnpm test -- __tests__/features/Records/TransferTemplate/` green.

#### Changes Required

**`__tests__/features/Records/TransferTemplate/TransferAccountsSelector.test.tsx`** — Create. Pure presentational, no wrappers needed. Props literal (no `QueryProviderWrapper`, no router mock). Cases:
1. Renders both `Origen:` and `Destino:` labels.
2. `destinationAccounts` excludes the origin account from the rendered destination dropdown items.
3. `destinationError` text renders when the prop is set; absent when `null`.
4. `isPending` disables both dropdowns (assert via `disabled` query on the dropdowns — behavior, not CSS class).

**`__tests__/features/Records/TransferTemplate/TransferTemplate.test.tsx`** — Create. Pattern reference: `__tests__/features/Records/IncomeTemplate/IncomeTemplate.test.tsx`.
- Wrappers: `QueryProviderWrapper` + `AppRouterContextProviderMock` (`{ push: jest.fn(), refresh: jest.fn() }`). **No** `DashboardStoreProvider` (not a store consumer).
- `Object.defineProperty(window, 'matchMedia', ...)` mock (copy from IncomeTemplate.test:13-25).
- `jest.mock('axios')` only. Do **not** mock `@/shared/utils/*`, `useTransferBankAccounts` (the hook), `sonner`, `next/navigation`, or the component under test (hard rules).
- Props built inline: `mockCategories`, an `AccountsCookie` literal, a `GetAccountsResponse` literal built from `mockAccounts` (map to `{ detailedError: null, accounts: mockAccounts }`), `detailedErrorCategories={null}`, `editRecord={null}`.
- Cases:
  1. Renders: `Origen:`, `Destino:`, `Cantidad`, `Pequeña descripción`, `Descripción (opcional)`, `Cancelar`, `Crear transferencia`.
  2. shortDescription required (`Por favor, ingrese una pequeña descripción`).
  3. description length 3..300.
  4. category required (`Por favor, seleccione una categoría`).
  5. amount zero (`Por favor, ingrese una cantidad mayor a 0`).
  6. **destination required** — submit without selecting destination → `DESTINATION_ACC_REQUIRED`.
  7. origin changes → destination dropdown list updates (origin account no longer appears in destination list).
- Out of test scope (AC6): edit-mode tests, `expensesPaid`/credit-destination tests, `useEditTransfer` tests.

**`__tests__/features/Records/RecordPreviewDrawer.test.tsx`** — Modify. The existing transfer-edit test asserts `push('/edit-record/edit-transfer')`. Flip it: click edit on a transfer record, assert `push` was **not** called and the toast message `La edición de transferencias aún no está disponible.` appears. Mirror how the income Option-A test (added by the Income story) asserts no-nav + toast.

#### Success Criteria
- `pnpm test -- __tests__/features/Records/TransferTemplate/` green.
- `pnpm test` — full suite green (no regressions in the drawer test after the flip).
- `pnpm lint` + `pnpm build` green.

#### Test Coverage Table

| File | Coverage areas | Pattern reference |
|------|----------------|-------------------|
| `src/features/Records/Transfer/TransferAccountsSelector.tsx` | Both dropdowns render; destination list excludes origin; `destinationError` shows; `isPending` disables | No wrapper needed; render with props literal; query via `screen` |
| `src/features/Records/TransferTemplate.tsx` | Renders fields; shortDescription/description/category/amount-zero/destination-required validation; origin change updates destination list | `__tests__/features/Records/IncomeTemplate/IncomeTemplate.test.tsx` — `QueryProviderWrapper` + `AppRouterContextProviderMock` + `matchMedia` mock; `jest.mock('axios')` only; `userEvent` |
| `src/features/Records/RecordsPreviewDrawer.tsx` | Transfer edit click → no `push` call + toast appears | Existing `RecordPreviewDrawer.test.tsx` + the income Option-A assertion pattern |
| `src/app/api/records/transfer/route.ts` | (none — repo convention: no standalone handler tests; transitive via TransferTemplate) | — |
| `src/shared/hooks/useTransferBankAccounts.tsx` | (transitive via TransferTemplate test case 7) | — |

---

### Phase 5 — Wiring: TransactionManager + create-record page + drawer patch

Independently testable: `pnpm dev` → click "Transferencia" → see the form; click edit on a transfer record → see toast.

#### Changes Required

**`src/features/Records/TransactionManager.tsx`** — Modify.
- Add to props interface: `resAccounts: GetAccountsResponse`. Add import `import { GetAccountsResponse } from "@/shared/types/accounts.types"` (verify exact type location — research §3.1 says `fetchAccounts` returns `GetAccountsResponse`; confirm the type lives in `accounts.types.ts` or `dashboard.lib.ts` at impl time).
- Line 15: uncomment `import { TransferTemplate } from "./TransferTemplate"`.
- Destructure `resAccounts` in the component params (line 23).
- Lines 72-81: replace the commented block with:
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
Drop `accessToken`/`subscreen` props (they were never on the real interface — the comment block was stale).

**`src/app/create-record/page.tsx`** — Modify.
- Line 9: add `import { fetchAccounts } from "@/shared/lib/dashboard.lib"`.
- Add `resAccounts` to the `Promise.all` array (lines 17-27) — after `fetchAllBudgets()`:
```ts
const [accessToken, selectedAccountCookie, resCategories, resBudgets, resAccounts] = await Promise.all([
  getAccessToken(),
  getAccountCookie(),
  fetchCategories(),
  fetchAllBudgets(),
  fetchAccounts(),
])
```
- Pass `resAccounts={resAccounts}` to `<TransactionManager ... />` (line 32-36).
Ponytail: this adds the unconditional `fetchAccounts()` cost even if the user never opens transfer — research §8 flagged this as acceptable for MVP. Don't add `enabled: isTransfer` gating; it doesn't exist server-side and would require moving the fetch client-side (a bigger change, deferred).

**`src/features/Records/RecordsPreviewDrawer.tsx`** — Modify. Mirror the Income Option-A patch.
- In `handleEditRecord`, replace the transfer branch (research §5.9, around `:78-80`) with:
```ts
if (record.typeOfRecord === 'transfer') {
  toast.error("La edición de transferencias aún no está disponible.")
  return
}
```
- If `EDIT_TRANSFER_PAGE_ROUTE` becomes unused after the patch, remove it from the import (lint `no-unused-vars`). Verify there's no other consumer (research §8: the drawer's transfer branch is the only one). `toast` is already imported (added by the Income story) — no new import.

#### Success Criteria
- `pnpm build` + `pnpm lint` green.
- `pnpm test` — full suite green (drawer test flipped in Phase 4 stays green).
- Manual: `pnpm dev` → `/create-record` → click "Transferencia" → both account dropdowns render (origin defaults to the cookie account, destination list excludes origin); change origin → destination list updates + destination clears; fill the form → submit → redirects to `/dashboard`. Open a transfer record in the dashboard preview drawer → click edit → toast "La edición de transferencias aún no está disponible." and no navigation.

#### Test Coverage
Covered transitively by Phase 4 (the drawer test flip + TransferTemplate test). No new test files in this phase.

---

## Cross-cutting concerns

1. **No `DashboardStoreProvider` for `TransferTemplate`.** `/create-record` is outside the dashboard layout (research §8). Accounts flow as the `resAccounts` prop. Do not call `useDashboardStore` inside `TransferTemplate` or `useTransferBankAccounts`.
2. **Auth via BFF, not bearer in client.** `TransferTemplate` has no `accessToken` prop; `createTransferCb` POSTs to `/api/records/transfer` with no auth header; the route handler injects the bearer from the `jose`-signed cookie (research §4.1).
3. **Server-side accounts fetch.** `fetchAccounts()` is already a `"use server"` function in `src/shared/lib/dashboard.lib.ts`; adding it to the existing `Promise.all` reuses it verbatim. No new BFF GET route, no client-side `useQuery` (research §4.2 decision).
4. **`force-dynamic`.** The root `layout.tsx` already forces dynamic rendering; the new `fetchAccounts` call is server-side and benefits from this — no Suspense boundary needed.
5. **CI env.** Tests must not depend on `BACKEND_URI`/`SESSION_SECRET_KEY`/`FRONTEND_URI` (only `REACT_APP_LOCAL_STORAGE=BUDGET_MASTER` is set in CI). The route handler is never invoked by Jest; `createTransferCb` is mocked at the `axios` boundary.

---

## Open Questions / Out-of-scope items

### Resolved during research (recorded assumptions)
- **Q1 — backend DTO:** Option A — trust the existing `CreateTransferPayload` / `TransferExpense` / `TransferIncome` types in `records.types.ts` as the backend contract. Risk: a runtime 400 if the backend payload diverges. Acceptable per user sign-off.
- **Q2 — dead edit branch:** Keep old-repo parity (user decision). Operationalized as "keep the dead **shape**" (editRecord prop, buttonText ternary, prefill `useEffect`) but **strip the edit submit call site + omit the `useEditTransfer` mutation declaration**, because the edit callbacks (`editExpenseTransferCb`/`editIncomeTransferCb`) and `useEditTransfer` are deferred (DEFERRED_ITEMS #5, research §6.3). Building them now would drag deferred scope into this PR. See "Decisions beyond the research doc" below.

### Out of scope (tracked in `ai-research/DEFERRED_ITEMS.md`)
- Item 4 — transfer `expensesPaid` sub-feature (credit-destination conditional).
- Item 5 — edit-transfer page + `EditTransfer` wrapper + `useEditTransfer` + `editExpenseTransferCb`/`editIncomeTransferCb`.
- Research §6.4 — BFF `GET /api/accounts` (client-side refetch); `fetchAccounts` server action covers the create flow.

---

## Decisions beyond the research doc

- **Q2 operationalization (keep dead shape, strip edit submit branch).** The research left Q2 as "keep the dead branch for parity *or* strip for a smaller diff." Income's "D1 — keep" works because `editIncomeCb` *exists*; transfer's edit callbacks do **not** exist and are deferred. Keeping the full edit submit branch would force inventing `editExpenseTransferCb`/`editIncomeTransferCb`/`useEditTransfer` now → scope violation (DEFERRED_ITEMS #5). Decision: keep the harmless dead shape (editRecord prop, buttonText, prefill `useEffect` — all unreachable when `editRecord === null`), strip only the submit-side edit call. Restoring the edit path is a one-line diff when the edit page lands. Flagged with a `ponytail:` comment at the strip site.
- **No standalone route-handler test.** Repo has no `__tests__/app/api/records/expense/route.test.ts` or income equivalent; adding one for transfer would be the only one of its kind and is not required by any AC. Covered transitively by `TransferTemplate.test.tsx`. Ponytail: YAGNI.
- **No standalone `useTransferBankAccounts` test.** Repo convention doesn't unit-test `useCurrencyField`/`useCategoriesForm` in isolation; the hook is covered transitively by TransferTemplate test case 7. Ponytail: YAGNI.
- **Strip `DatetimePicker` (capital D) vs `DateTimePicker` (capital T).** Verified in `IncomeTemplate.tsx:14` — new repo uses `DateTimePicker`. Plan uses the new path.

---

## PR flow reminder

- Target branch: **`develop`** (no `main`/`master`).
- The PR must carry **exactly one** label: `major` | `minor` | `patch` — this story is **`minor`** (new user-facing feature, no breaking change). `check-label.yml` fails the PR without it.
- Do **not** manually bump `package.json` or edit `CHANGELOG.md` — `develop-pipeline.yml` does that on merge, committed by `github-actions[bot]`.
- Do **not** commit `coverage/`.