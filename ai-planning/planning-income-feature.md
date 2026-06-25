# Planning — Port Income (MVP create-only) to `new-budget-master`

- **Source research:** `ai-research/INCOME_FEATURE_RESEARCH.md` (signed off; §10 Resolved → Option A)
- **Sign-off date:** 2026-06-25
- **PR label:** `minor` (new user-facing feature, no breaking change)
- **Scope reminder:** MVP create-only. `expensesPaid` sub-feature, edit-income page, and transfer feature are explicitly **out of scope** (tracked in `ai-research/DEFERRED_ITEMS.md`).

---

## Acceptance Criteria

ACs copied from the research doc (§1) and the §10 decision.

1. **AC1 — Income create BFF works.** `POST /api/records/income` forwards to `${BACKEND_URI}/incomes-actions` with the session-derived bearer token and returns the upstream body (status 201 on success, 400-with-message on upstream error). Mirrors `src/app/api/records/expense/route.ts`.
2. **AC2 — Income create client callback exists.** `createIncomeCb` (and a parity `editIncomeCb`, declared but unused) live in `src/shared/utils/records.utils.ts`, POST/PUT to `INCOME_API_ENDPOINT` with no auth header (BFF handles auth).
3. **AC3 — "Crear Ingreso" subscreen renders and creates.** Selecting "Ingreso" in `TransactionManager` renders `IncomeTemplate`, which mirrors `ExpenseTemplate` minus budgets/indebted-people/isPaid. Submitting a valid form POSTs via `createIncome`; on success it refreshes and routes to `/dashboard`; on error it toasts `CREATE_EXPENSE_INCOME_ERROR`.
4. **AC4 — Broken income edit path is blocked.** `RecordsPreviewDrawer.handleEditRecord`, when `record.typeOfRecord === 'income'`, shows `toast.error("La edición de ingresos aún no está disponible.")` and does **not** navigate to `/edit-record/edit-income` (Option A from research §10).
5. **AC5 — Tests cover new behavior** per repo conventions (`AGENTS.md`, `.github/copilot-instructions.md`): `IncomeTemplate` render/validation/success/error; updated `RecordsPreviewDrawer` test reflecting the income-edit block.

---

## Affected files (inventory by area)

### `src/app/api/**`
- `src/app/api/records/income/route.ts` — **Modify**. Add `POST` and `PUT` handlers next to the existing `DELETE`.

### `src/shared/**`
- `src/shared/utils/records.utils.ts` — **Modify**. Add `createIncomeCb` + `editIncomeCb`.

### `src/features/Records/**`
- `src/features/Records/IncomeTemplate/IncomeTemplate.tsx` — **Create**.
- `src/features/Records/TransactionManager.tsx` — **Modify**. Uncomment `IncomeTemplate` import + render block; drop `accessToken` prop.
- `src/features/Records/RecordsPreviewDrawer.tsx` — **Modify**. Block income-edit navigation with a toast (Option A).

### `__tests__/**`
- `__tests__/features/Records/IncomeTemplate/IncomeTemplate.test.tsx` — **Create**.
- `__tests__/features/Records/RecordPreviewDrawer.test.tsx` — **Modify**. The existing "should navigate to edit income route when editing an income record" test (lines 145-158) asserts `push('/edit-record/edit-income')`; under AC4 this path no longer navigates and must **not** call `push`. Replace it with the new expectation.

### Not touched (deliberate)
- `src/app/api/records/expense/route.ts` — template only, no change.
- `src/shared/types/records.types.ts`, `src/shared/constants/*`, `src/shared/constants/global.constants.ts` — all income types/constants already exist (research §3.1). No new constants; the toast copy for Option A is inlined (see Decision D2).
- `package.json` — no new deps; axios / sonner / flowbite-react / react-hook-form / yup / TanStack Query all present.
- `REPO_CONTEXT.md` — **minor update** to the API route table: `/api/records/income` currently listed as `POST` only (row at line 86 is stale — the handler actually only had `DELETE` before this work). After AC1 it will be `POST`, `PUT`, `DELETE`. One-line table-cell edit. (Required by REPO_CONTEXT.md "Adding new code".)

---

## Phases

### Phase 1 — BFF + client callback (AC1, AC2)

Make the create round-trip possible end-to-end before any UI consumes it.

#### Changes Required
**`src/app/api/records/income/route.ts` — Modify**
Add `POST` and `PUT` exports above the existing `DELETE`, mirroring `src/app/api/records/expense/route.ts:8-46`.
- `POST(request)`:
  - `await getAccessToken()`
  - `const payload: CreateIncomePayload = await request.json()`
  - `uri = \`${process.env.BACKEND_URI}/incomes-actions\``
  - `axios.post<IncomeDataResponse>(uri, payload, { headers: { Authorization: \`Bearer ${accessToken}\` } })`
  - return `NextResponse.json(res.data, { status: 201 })`
  - catch → `console.error('Error creating an income:', error)` → extract `error.response.data.error.message` → `NextResponse.json({ message }, { status: 400 })`
- `PUT(request)`: identical structure, `axios.put`, `EditIncomePayload` type, same `console.error` prefix "Error updating an income:".
- Import `CreateIncomePayload, EditIncomePayload, IncomeDataResponse` from `@/shared/types/records.types` (extend the existing import line).

> Note on BFF error convention: returning `400 { message }` is the project convention (REPO_CONTEXT.md "Conventions and gotchas"); do **not** introduce status passthrough in this PR — out of scope.

**`src/shared/utils/records.utils.ts` — Modify**
Add after `editExpenseCb` (after line 48), mirroring `createExpenseCb:30` / `editExpenseCb:40`:
- Import `CreateIncomePayload, EditExpensePayload already imported` → extend the import to add `CreateIncomePayload, EditIncomePayload, IncomeDataResponse`.
- `createIncomeCb = async (payload: CreateIncomePayload): Promise<IncomeDataResponse>` → `axios.post<IncomeDataResponse>(INCOME_API_ENDPOINT, payload)` → return `data`. Wrap in the same `try/catch (throw error)` shape used by the expense callbacks (research §5.2 simplification is fine, but match the file's existing style for consistency).
- `editIncomeCb = async (payload: EditIncomePayload): Promise<IncomeDataResponse>` → `axios.put(...)`.
- `INCOME_API_ENDPOINT` is already imported (used by `deleteIncomeCb`).

**`REPO_CONTEXT.md` — Modify** (one-line)
Row for `/api/records/income` in the [API route handlers table](#srcappapi--route-handlers-bff--cookie-layer): change Methods cell from `POST` to `POST`, `PUT`, `DELETE`. (Current entry is stale — only `DELETE` exists today.)

#### Success Criteria
- `pnpm build` passes (`next build` is the de-facto typecheck).
- `pnpm lint` passes.
- Manual (post-Phase-3): not testable in isolation — verified end-to-end in Phase 3.

#### Test Coverage
No dedicated route-handler test (research §3.2 item 5 lists only the `IncomeTemplate` test; matches repo pattern — there is no `__tests__/app/api/records/expense/route.test.ts` either). The round-trip is covered behaviorally by the Phase 3 `IncomeTemplate` test, which mocks `axios` and asserts the create path.

---

### Phase 2 — IncomeTemplate component (AC3)

Create the form subscreen mirroring `ExpenseTemplate`, minus the out-of-scope features.

#### Changes Required
**`src/features/Records/IncomeTemplate/IncomeTemplate.tsx` — Create**

Top of file: `"use client"`.

Imports — start from `ExpenseTemplate.tsx:1-38`, then **remove**:
- `ToggleSwitch` from the flowbite import (no `isPaid`),
- `useIndebtedPeople`, `PersonalDebtManager`, `useHandleBudgets`, `SelectBudgetDropdown`, `Budget/SelectBudget` budget types, `BUDGETS_FETCH_ERROR`, `detailedErrorBudgets`-related bits,
- `useMediaQuery` **stays** (used for the tags accordion layout — same as expense).

Keep:
- `useForm` + `yupResolver(IncomeExpenseSchema)` (shared schema, reuse as-is),
- `useCurrencyField({ amount: null })`, `useCategoriesForm({ categories })`, `useManageTags()`,
- `createIncomeCb`, `editIncomeCb`, `resetEditRecordLS` (import alongside; `editIncome` mutation declared for parity but the create-only branch never calls it — research §5.3 "Mutations"),
- `BankMovement, IncomeDataResponse, IncomeErrorResponse, CreateIncomeDataForm, CreateIncomePayload, EditIncomePayload, IncomeExpenseSchema` from `@/shared/types/records.types`,
- `Category, CategoryShown` from `@/shared/types/categories.types`,
- `AccountsCookie` from `@/shared/types/accounts.types`,
- `CREATE_EXPENSE_INCOME_ERROR, CURRENCY_ZERO_ERROR` from `records.constants`; `CATEGORY_REQUIRED, SUBCATEGORY_REQUIRED, CATEGORY_FETCH_ERROR` from `categories.constants`,
- `DASHBOARD_ROUTE` from `global.constants`,
- `CancelButtonExpenseTemplate` from `../ExpenseTemplate/CancelButtonExpenseTemplate` (reuse with `action="create"`).

Props interface (research §5.3):
```ts
interface IncomeTemplateProps {
  categories: Category[]
  selectedAccount: AccountsCookie | null
  detailedErrorCategories: DetailedError | null
  editRecord: BankMovement | null
}
```
(No `budgetsFetched`, no `detailedErrorBudgets`.)

Body structure (mirror `ExpenseTemplate.tsx:49-342`, apply the research §5.3 difference matrix):
- `const buttonText = editRecord?.shortName ? 'Editar ingreso' : 'Crear ingreso'` (create-only flow always uses `'Crear ingreso'`).
- Drop: `isPaid` state, `toggleDebtPaid`, `isCredit`, the `ToggleSwitch` render, `SelectBudgetDropdown` render, both `PersonalDebtManager` renders (mobile accordion + desktop aside), `useIndebtedPeople` family, `useHandleBudgets` family.
- Keep: `DateTimePicker`, `CurrencyField`, `shortDescription` `TextInput`, `description` `Textarea`, `TransactionCategorizerDropdown`, `ManageTagsModal` (tags only), `FurtherDetailsAccordion` containing only `ManageTagsModal` on mobile.
- `useCurrencyField({ amount: null })` — same shape.
- `useCategoriesForm({ categories })` — unfiltered shared list (research §1 Categories row).
- `useForm({ resolver: yupResolver(IncomeExpenseSchema) })` — shared schema.
- Mutations: declare both `createIncome` (`useMutation<IncomeDataResponse, IncomeErrorResponse, CreateIncomePayload>`) and `editIncome` (EditIncomePayload), mirroring `ExpenseTemplate.tsx:94-123`. The `editIncome` declaration is kept for parity only (research §5.3); the create-only `onSubmit` never calls it.
  - `createIncome.onSuccess`: `router.refresh(); setTimeout(() => router.push(DASHBOARD_ROUTE), 1000)` (same as expense create).
  - `createIncome.onError`: no inline handler; handled in a `useEffect` watching `isErrorCreate` + `messageErrorCreate` → `toast.error(CREATE_EXPENSE_INCOME_ERROR)` (mirror `ExpenseTemplate.tsx:164-169`).
  - `editIncome` onError/onSuccess: mirror the expense edit callbacks site verbatim (`resetEditRecordLS()` + `router.push(DASHBOARD_ROUTE)`); dead code in create-only but harmless and consistent.
- `detailedErrorCategories` `useEffect` (mirror `ExpenseTemplate.tsx:178-186` but **drop** the `detailedErrorBudgets` branches): connection → `'Error de conexión. Por favor, inténtalo más tarde.'`, else `CATEGORY_FETCH_ERROR`.
- `onSubmit: SubmitHandler<CreateIncomeDataForm>` (research §5.3 payload):
  - Guard order identical to expense: validate `categorySelected`/`subcategory`/amount zero, then build payload.
  - `payload: CreateIncomePayload = { account, amount: cleanCurrencyString(currencyState), budgets: [], category, date, description, expensesPaid: [], indebtedPeople: [], shortName: data.shortDescription, subCategory: subcategory, tag: tags.current, typeOfRecord: 'income' }`.
  - `if (editRecord?.shortName) { editIncome({ ...payload, recordId: editRecord._id }); return }` — **dead in create-only** (TransactionManager always passes `editRecord={null}`) but kept for parity so the file compiles and the future edit flow slots in. **Decision D1** below documents this trade-off.
  - `createIncome(payload)`.
- Submit button: same `disabled` logic (`isPending || isSuccess || openTagModal`), same `Spinner`/`CheckIcon`/`buttonText` ternary.
- `Toaster` `<Toaster position="top-center" />` rendered when `isError || detailedErrorCategories?.message` (mirror expense; the dashboard doesn't guarantee a mounted Toaster for this subscreen because `/create-record` is a separate route).

**`src/features/Records/TransactionManager.tsx` — Modify**
- Uncomment the import at line 14: `import { IncomeTemplate } from "./IncomeTemplate"` — adjust path to `"./IncomeTemplate/IncomeTemplate"` (the new folder layout). Keep `// import { TransferTemplate }` commented (out of scope).
- Uncomment the render block at lines 64-72, then **delete the `accessToken={accessToken}` line** (no such variable in scope; research §4 / §7 risk #1). Also **remove the surrounding `{/* */}` comment wrappers** so it renders, and drop the trailing `transfer` block's comment? No — leave the `transfer` block commented (out of scope). Final active block:
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
  Keep the existing transfer comment block as-is.

#### Success Criteria
- `pnpm build` passes (TS strict).
- `pnpm lint` passes.
- Manual: `pnpm dev` → `/create-record` → click "Ingreso" → form renders with: `Cantidad`, `Pequeña descripción`, `Descripción (opcional)`, category dropdown, subcategory dropdown, `Cancelar`, `Crear ingreso`. No budgets dropdown, no "Pagado" toggle, no PersonalDebtManager section.

#### Test Coverage
See Phase 3 (tests are written against the assembled component + wiring to verify end-to-end; phasing them together avoids a flaky intermediate state).

---

### Phase 3 — Wire-up test + RecordsPreviewDrawer patch (AC4, AC5)

Block the broken income-edit path and add the test coverage.

#### Changes Required
**`src/features/Records/RecordsPreviewDrawer.tsx` — Modify**
- Add to the sonner import: the file currently does **not** import `toast`. Add `import { toast } from "sonner"` (only `toast`; the dashboard parent already mounts `<Toaster>` so no local Toaster needed — verified via grep: `Dashboard.tsx:93,109`).
- In `handleEditRecord` (lines 71-82), change the income branch:
  ```ts
  if (record.typeOfRecord === 'income') {
    toast.error("La edición de ingresos aún no está disponible.")
    return
  }
  ```
  Drop `router.push(EDIT_INCOME_PAGE_ROUTE)` here. The `manageSelectedAccountCookie()` call at the top of the function stays (minimal diff; it's harmless). `EDIT_INCOME_PAGE_ROUTE` import at line 15 becomes unused — **remove it** from the import to keep `pnpm lint`/`next build` clean (`no-unused-vars` under `next/typescript`).
  > **Decision D2:** toast copy is a one-off string inlined at the call site. Research §10 didn't specify a constant. Not promoted to `records.constants.ts` because it is a single use tied to a temporary limitation (`expensesPaid`/edit page are deferred — `ai-research/DEFERRED_ITEMS.md`); when the edit page ships, this branch is deleted entirely, so a constant would be dead code.

**`__tests__/features/Records/IncomeTemplate/IncomeTemplate.test.tsx` — Create**

Pattern reference: `__tests__/features/Records/DeleteRecordModal.test.tsx` (uses `jest.mock('axios')` + `userEvent` + `QueryProviderWrapper` + `AppRouterContextProviderMock`) and `RecordPreviewDrawer.test.tsx` (window.matchMedia mock).
- Wrappers:
  - `QueryProviderWrapper` (TanStack Query; mutation present).
  - `AppRouterContextProviderMock` with `router={{ push: jest.fn(), refresh: jest.fn() }}`.
  - **No** `DashboardStoreProvider` — `IncomeTemplate` does not call `useDashboardStore` (research §5.5).
  - `Object.defineProperty(window, 'matchMedia', ...)` mock — needed because `useMediaQuery` calls it (mirror `RecordPreviewDrawer.test.tsx:12-24`).
- Mocks:
  - `jest.mock('axios')` — the `createIncomeCb` POST resolves.
  - **Do not** mock `@/shared/utils/*`, custom hooks, `sonner`, or `next/navigation` (hard rules).
  - Build props inline from `mockCategories` (`__tests__/mocks/categories.mock.ts`) and an `AccountsCookie` literal; `editRecord={null}`; `detailedErrorCategories={null}`.
- Test cases (describe what to assert, not code):
  1. **Renders fields** — `Cantidad` (CurrencyField), `Pequeña descripción`, `Descripción (opcional)`, category dropdown, subcategory dropdown, `Cancelar`, `Crear ingreso`.
  2. **Validation — shortDescription required** — submit empty → error message for `shortDescription`; type value → error clears.
  3. **Validation — description length** — type a 1-2 char description → min-length error; over 300 chars → max-length error; 3..300 chars → no error. (Mirrors `IncomeExpenseSchema` `descriptionValidation`.)
  4. **Validation — category required** — submit without picking a category → `CATEGORY_REQUIRED` shown.
  5. **Validation — subcategory required** — pick category, no subcategory → `SUBCATEGORY_REQUIRED`.
  6. **Validation — amount zero** — submit with empty/zero amount → `CURRENCY_ZERO_ERROR`.
  7. **Successful create** — fill valid form, `mockedAxios.post.mockResolvedValue(<IncomeDataResponse>), click `Crear ingreso` → spinner → `check-icon` test-id → `waitFor` `push` called with `DASHBOARD_ROUTE`.
  8. **Error path** — `mockedAxios.post.mockRejectedValue(<AxiosError-like shape>)` → `toast.error(CREATE_EXPENSE_INCOME_ERROR)`. (Per copilot-instructions, do not mock `sonner`; the toast text surfaces via the real Toaster rendered by the component.)
- Out of test scope: edit-mode tests, `expensesPaid` tests (research §5.5).

**`__tests__/features/Records/RecordPreviewDrawer.test.tsx` — Modify**
- Existing test "should navigate to edit income route when editing an income record" (lines 145-158) currently asserts `push` called with `/edit-record/edit-income`. Under AC4 this path no longer navigates.
  - Rename it to "should not navigate to edit income route and show toast when editing an income record" (or equivalent).
  - Assert `push` is **not** called.
  - Assert `toast.error` copy is visible (`screen.getByText(/La edición de ingresos aún no está disponible./i)`). The `Dashboard.tsx` parent in the existing wrapper already mounts a `<Toaster>`, and the drawer now imports `toast` — the real sonner Toaster from the dashboard wrapper surfaces the message. **Do not mock `sonner`.**
- All other tests in the file are unaffected (expense/transfer edit paths unchanged).

#### Success Criteria
- `pnpm test -- __tests__/features/Records/IncomeTemplate/IncomeTemplate.test.tsx` passes (coverage written to `coverage/`).
- `pnpm test -- __tests__/features/Records/RecordPreviewDrawer.test.tsx` passes.
- `pnpm test` (full suite) green — no regressions in `DeleteRecordModal`/other records tests.
- `pnpm build` + `pnpm lint` green.
- Manual: dashboard → open an income record's drawer → click "Editar" → toast "La edición de ingresos aún no está disponible." appears, URL does not change. Manual: opening an **expense** drawer and clicking edit still routes to `/edit-record/edit-expense`.

#### Test Coverage
| File | Coverage areas | Pattern reference |
|------|----------------|-------------------|
| `src/app/api/records/income/route.ts` | (No unit test — behavior covered by `IncomeTemplate` axios-mock test round-trip) | n/a (matches absence of `expense/route.test.ts`) |
| `src/features/Records/IncomeTemplate/IncomeTemplate.tsx` | Field render, yup validation (5 cases), successful create → routing, error toast | `__tests__/features/Records/DeleteRecordModal.test.tsx` (axios mock + userEvent + QueryProviderWrapper + AppRouterContextProviderMock); `RecordPreviewDrawer.test.tsx` (matchMedia) |
| `src/features/Records/RecordsPreviewDrawer.tsx` | Income-edit branch: no navigation + toast; expense path unchanged | `RecordPreviewDrawer.test.tsx` (existing wrapper reuse) |

---

## Cross-cutting concerns

- **Auth**: the new handlers funnel through `getAccessToken()` like every other BFF route — no per-route auth code.
- **SSR/client split**: `IncomeTemplate.tsx` carries `"use client"` (uses hooks, mutation, router). The page that renders it (`src/app/create-record/page.tsx`) already sets up the client boundary; no layout change.
- **`force-dynamic`**: no interaction — the create-record route is dynamic already; we are adding a client subscreen, nothing static.
- **Toaster availability**: `IncomeTemplate` renders its own `<Toaster>` (mirroring expense) because `/create-record` is not under the dashboard layout. `RecordsPreviewDrawer`'s toast is surfaced by the **dashboard's** already-mounted `<Toaster>` — verified; no new Toaster added there.
- **i18n**: UI strings are hardcoded Spanish, consistent with the rest of the repo and `<html lang="es">`. No new abstraction.

---

## Open Questions / Out-of-scope items

None unresolved for this PR (research §10 is resolved). Items deliberately refused (scope discipline):

- **Edit-income page** (`/edit-record/edit-income/page.tsx` + `EditIncome`) — deferred; `ai-research/DEFERRED_ITEMS.md` tracks it. Restoring the edit path is what reverts the Phase-3 drawer patch.
- **`expensesPaid` sub-feature** — deferred; tracked.
- **Transfer feature** — out of scope; left fully commented.
- **Refactor of `createIncomeCb`/`editIncomeCb` to drop the `try/catch (throw error)` wrapper** — the existing expense callbacks use that shape; matching it is a smaller diff than "fixing" one and not the others. Not a story for this PR.
- **Promoting the Option-A toast copy to a constant** — single use, temporary, deleted on follow-up. Not promoted (Decision D2).
- **Adding status passthrough for BFF errors** — repo-wide open question in REPO_CONTEXT.md, not this story.
- **Dedicated route-handler unit test for `/api/records/income`** — no precedent (expense route has none); the HTTP contract is behaviorally tested through the `IncomeTemplate` test. Not added.
- **Backend changes** — none required; `/incomes-actions` already accepts the legacy create payload (research relied on the BFF expense route as the proxy template; no backend delegation was needed because the income endpoint pre-exists and `deleteIncomeCb`/`deleteIncomeCb` already drive DELETE against it successfully).

---

## Assumptions made

- A1 — `POST ${BACKEND_URI}/incomes-actions` accepts the `CreateIncomePayload` shape unchanged (the legacy income controller is the one already DELETE'd by `deleteIncomeCb`; the same DTO family applies). Confirmed indirectly by the old repo's `records.utils.ts` create callbacks (research §2.1).
- A2 — Backend returns an `IncomeDataResponse` envelope (`{ data: { income }, error: null, message: [], success, version }`) on success, matching the typed `IncomeDataResponse` already in this repo's `records.types.ts:204-212`.
- A3 — The dashboard's mounted `<Toaster>` renders toasts emitted from the drawer (sonner uses a single portal; the dashboard `RecordsPreviewDrawer` is rendered inside `Dashboard.tsx`). Verified by grep — `Dashboard.tsx:93,109`.
- A4 — `EDIT_INCOME_PAGE_ROUTE` becomes unused after AC4 and removing it from the import keeps `next lint` happy. (If `noUnusedLocals` complains, the import line is the only one to touch.)

---

## Decisions beyond the research doc

- **D1** — `IncomeTemplate` keeps the `editIncome` mutation and the `if (editRecord?.shortName)` branch in `onSubmit` as **dead-but-compiling** code. Research §5.3 says "keep for parity / future edit flow". Trade-off: a few unused lines vs. a future edit-PR diff that's purely additive on the form. Accepted: the story intent is create-only shipping, but the file mirroring expense keeps the edit future cheap. Flag for review — if you'd rather strip the dead `editIncome` mutation entirely, Phase 2 shrinks by ~15 lines.
- **D2** — Option-A toast copy `"La edición de ingresos aún no está disponible."` is inlined at the call site, not added to `records.constants.ts`. Reason: single use, temporary (removed when the edit page ships). Captured here so the implementer doesn't second-guess it.
- **D3** — `REPO_CONTEXT.md` route table gets a one-line Methods cell update (`/api/records/income`: `POST` → `POST`, `PUT`, `DELETE`). The research doc didn't call this out, but REPO_CONTEXT.md's own "Adding new code" section requires it and the current entry is stale (it claims `POST` while the file currently only had `DELETE`).

---

## PR flow reminder

- Target branch: **`develop`**.
- The PR must carry **exactly one** label: `major` | `minor` | `patch` → use **`minor`** (new feature, no breaking change).
- Do **not** edit `CHANGELOG.md` or bump `package.json` version — `develop-pipeline.yml` does that on merge.

---

## Phase summary

- **Phase 1** — BFF + client callback: `POST`/`PUT` on `/api/records/income`, `createIncomeCb`/`editIncomeCb`, REPO_CONTEXT row update.
- **Phase 2** — `IncomeTemplate` component + `TransactionManager` wiring: new form subscreen (no budgets/isPaid/indebted-people), uncomment & drop `accessToken`.
- **Phase 3** — Tests + drawer patch: `IncomeTemplate.test.tsx`, update `RecordPreviewDrawer.test.tsx`, block income-edit navigation with a toast (Option A).