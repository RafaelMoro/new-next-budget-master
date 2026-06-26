# Edit Expense Research

## Story Definition

### Story Title

Implement edit expense feature.

### Story Description

Enable users to edit an existing expense record from the record preview drawer.

The feature should reuse the existing expense form, existing BFF route handler, and existing mutation utility in this repository. The old repository contains the missing page/component wiring and localStorage handoff pattern, but the new repository already moved expense mutations behind `/api/records/expense`, so old direct-backend access-token props should not be copied.

### Story Type

Single story.

### Scope

Expense editing only.

Income editing and transfer editing remain out of scope. Current UI behavior already shows unavailable toasts for income and transfer editing in `RecordsPreviewDrawer`.

### Acceptance Criteria

1. A user can open an expense in the record preview drawer and click `Editar`.

2. The selected expense is saved before navigation and the app navigates to `/edit-record/edit-expense`.

3. The edit expense page loads categories, budgets, selected account, and the saved expense, then renders the expense form in edit mode.

4. The form pre-fills the saved expense fields, including amount, short description, description, category, subcategory, tags, indebted people, linked budget, date, and paid state where available.

5. Submitting the form sends an edit payload through `PUT /api/records/expense` with the original expense `_id` as `recordId`, clears the edit record from localStorage on completion, refreshes data, and returns to `/dashboard`.

### Task Breakdown

1. Add the missing edit expense route page under `src/app/edit-record/edit-expense/page.tsx`.

2. Add the missing client wrapper under `src/features/Records/EditExpense.tsx`.

3. Persist the selected expense before routing from `src/features/Records/RecordsPreviewDrawer.tsx`.

4. Add focused tests for the edit handoff and edit form behavior.

5. Run the smallest relevant test command after implementation.

### Epic Structure

Not an epic.

This should not be split into multiple stories because the repo already has most edit expense pieces. The missing work is route/component wiring plus one localStorage handoff.

## Technical Research

### Repository Context

This is a Next.js 14 App Router app using React 18, TypeScript, Zustand, TanStack Query, Tailwind v4, flowbite-react, axios, `react-hook-form`, and `yup`.

The app proxies backend calls through route handlers under `src/app/api/**`. Auth uses an httpOnly session cookie and `getAccessToken()` in server-side BFF code.

The root layout in `src/app/layout.tsx` exports `dynamic = 'force-dynamic'`, so routes render dynamically.

Tests live under `__tests__/`, mirroring `src/`. Shared fixtures live under `__tests__/mocks/`, which are ignored by the test runner.

### Old Repository Compared

The user referenced `budget-master/old-budget-master`, but the actual sibling directory is:

`/home/rafael/projects/budget-master/old-next-budget-master`

Relevant old files:

1. `old-next-budget-master/src/app/edit-record/edit-expense/page.tsx`

2. `old-next-budget-master/src/features/Records/EditExpense.tsx`

3. `old-next-budget-master/src/features/Records/RecordsPreviewDrawer.tsx`

4. `old-next-budget-master/src/shared/utils/records.utils.ts`

5. `old-next-budget-master/__tests__/feature/Records/ExpenseTemplate.test.tsx`

Old implementation details worth reusing:

1. The edit page fetches selected account, categories, and budgets before rendering the edit component.

2. The edit component reads `edit-record` from localStorage and passes it as `editRecord` to `ExpenseTemplate`.

3. `RecordsPreviewDrawer` saves the selected record before navigating to the edit route.

4. Old tests already cover edit-mode prefilling and submit behavior.

Old implementation details not to copy directly:

1. Old code passes `accessToken` to client components and client utilities.

2. Old code calls backend URLs directly from client utilities.

3. Old code uses `NEXT_PUBLIC_BACKEND_URI` for some backend access.

4. Old code has `selectedAccLS`; the new repo uses `AccountsCookie` from the selected account cookie.

### Current New Repository State

#### Route/Page State

Current new repo has no edit expense page:

`src/app/edit-record/edit-expense/page.tsx` is missing.

Current new repo has create record page:

`src/app/create-record/page.tsx`

The create page pattern fetches:

1. `getAccessToken()` from `src/shared/lib/auth.lib.ts`

2. `getAccountCookie()` from `src/shared/lib/preferences.lib.ts`

3. `fetchCategories()` from `src/shared/lib/categories.lib.ts`

4. `fetchAllBudgets()` from `src/shared/lib/budgets.lib.ts`

5. `fetchAccounts()` for transfer create flow only

For edit expense, `fetchAccounts()` is not needed because the expense form does not require the full accounts list.

The page should likely include `LoginRequiredModal`, matching the authenticated create-record page.

#### Feature UI State

Current new repo has no client edit wrapper:

`src/features/Records/EditExpense.tsx` is missing.

Current reusable expense form exists:

`src/features/Records/ExpenseTemplate/ExpenseTemplate.tsx`

`ExpenseTemplate` already accepts:

1. `categories: Category[]`

2. `budgetsFetched: Budget[]`

3. `selectedAccount: AccountsCookie | null`

4. `editRecord: BankMovement | null`

5. `detailedErrorCategories: DetailedError | null`

6. `detailedErrorBudgets: DetailedError | null`

`ExpenseTemplate` already determines edit mode with `editRecord?.shortName`.

`ExpenseTemplate` already uses button text `Editar gasto` in edit mode.

`ExpenseTemplate` already builds an `EditExpensePayload` with `recordId: editRecord._id`.

`ExpenseTemplate` already calls `editExpenseCb(data)` through TanStack Query.

`ExpenseTemplate` already clears edit localStorage through `resetEditRecordLS()` on edit success or error.

#### Drawer Handoff State

Current new file:

`src/features/Records/RecordsPreviewDrawer.tsx`

Current behavior:

1. Calls `manageSelectedAccountCookie()`.

2. Shows unavailable toast for income.

3. Shows unavailable toast for transfer.

4. Routes expenses to `EDIT_EXPENSE_PAGE_ROUTE`.

Missing behavior:

1. It does not save the selected `record` into localStorage before navigating.

Without this, the edit page cannot load the chosen expense.

The old repo did this through `saveEditRecordLS(record)`.

The new repo does not currently have `saveEditRecordLS`, only `resetEditRecordLS`.

Minimal options:

1. Add `saveEditRecordLS(record)` next to `resetEditRecordLS()` in `src/shared/utils/records.utils.ts` and reuse it in the drawer.

2. Call `addToLocalStorage({ prop: "edit-record", newInfo: { record } })` directly in the drawer.

The helper is slightly cleaner because the old repo already has it and it keeps localStorage error handling with record utilities. It is still small and not a new abstraction with speculative scope because it mirrors an existing pair: save and reset edit record.

#### BFF/API State

Current file:

`src/app/api/records/expense/route.ts`

Current methods:

1. `POST` creates expense.

2. `PUT` edits expense.

3. `DELETE` deletes expense.

The `PUT` handler:

1. Reads access token with `getAccessToken()`.

2. Reads `EditExpensePayload` from `request.json()`.

3. Sends `axios.put<ExpenseDataResponse>(`${process.env.BACKEND_URI}/expenses-actions`, payload, { Authorization })`.

4. Returns `NextResponse.json(data, { status: 201 })`.

5. Returns `{ message }` with status `400` on error.

This means no new route handler is needed for edit expense.

#### Client Mutation State

Current file:

`src/shared/utils/records.utils.ts`

Current function:

`editExpenseCb(payload: EditExpensePayload)` sends `axios.put<ExpenseDataResponse>(EXPENSE_API_ENDPOINT, payload)`.

`EXPENSE_API_ENDPOINT` is `/api/records/expense` in `src/shared/constants/global.constants.ts`.

This is already the correct new-repo pattern.

#### Constants State

Current file:

`src/shared/constants/global.constants.ts`

Relevant constants already exist:

1. `EDIT_EXPENSE_PAGE_ROUTE = '/edit-record/edit-expense'`

2. `EXPENSE_API_ENDPOINT = '/api/records/expense'`

No new route constant is needed.

#### Types State

Current file:

`src/shared/types/records.types.ts`

Relevant types already exist:

1. `BankMovement`

2. `CreateExpensePayload`

3. `EditExpensePayload`

4. `ExpenseDataResponse`

5. `ExpenseErrorResponse`

No new type is needed.

Current file:

`src/shared/types/global.types.ts`

Relevant type already exists:

`BudgetMasterLocalStorage` has `'edit-record': { record: BankMovement }`.

No new localStorage type is needed.

### Affected Areas

#### Routes / Pages

Add:

`src/app/edit-record/edit-expense/page.tsx`

Likely page responsibilities:

1. Fetch access token for auth check.

2. Fetch selected account cookie.

3. Fetch categories.

4. Fetch budgets.

5. Render `LoginRequiredModal`.

6. Render `EditExpense`.

This follows `src/app/create-record/page.tsx` and old edit expense page.

#### API Route Handlers

No new API route is needed.

Existing file:

`src/app/api/records/expense/route.ts`

This already proxies edit expense to the backend with `PUT`.

#### Feature UI

Add:

`src/features/Records/EditExpense.tsx`

Update:

`src/features/Records/RecordsPreviewDrawer.tsx`

Reuse:

`src/features/Records/ExpenseTemplate/ExpenseTemplate.tsx`

Reuse:

`src/features/Records/ExpenseTemplate/CancelButtonExpenseTemplate.tsx`

#### Shared UI

No shared UI changes are needed.

Existing shared component likely reused by `EditExpense`:

`src/shared/ui/organisms/Header.tsx`

#### Shared Hooks

No new shared hook is needed.

Existing hooks already used by `ExpenseTemplate`:

1. `useCurrencyField`

2. `useCategoriesForm`

3. `useManageTags`

4. `useIndebtedPeople`

5. `useMediaQuery`

6. `useHandleBudgets`

#### Shared Utils

Likely update:

`src/shared/utils/records.utils.ts`

Potential addition:

`saveEditRecordLS(record: BankMovement)`.

Existing function:

`resetEditRecordLS()`.

Alternative minimal change:

Import `addToLocalStorage` directly in `RecordsPreviewDrawer` and skip adding the helper.

Preferred lazy path:

Add the tiny helper because it pairs with existing `resetEditRecordLS()` and copies a proven old-repo pattern.

#### Shared Constants

No constants are required.

Potential optional improvement:

Add an `EDIT_RECORD_KEY` constant only if the repo already has localStorage constants.

Current new repo does not appear to have `src/shared/constants/local-storage.constants.ts`, so adding that file is unnecessary.

Use the existing string key or the existing `BudgetMasterLocalStorage` key type.

#### State

No Zustand changes are needed.

`RecordsPreviewDrawer` already uses `useDashboard()`, which depends on `DashboardStoreProvider`.

No server state cache changes are needed.

TanStack Query is already used in `ExpenseTemplate`.

#### Tests

Existing relevant test:

`__tests__/features/Records/RecordPreviewDrawer.test.tsx`

This already asserts expense edit navigation to `/edit-record/edit-expense`.

Missing tests:

1. Edit drawer saves `edit-record` before navigation.

2. Expense form pre-fills from `editRecord`.

3. Expense form edit submit calls `PUT` and redirects.

Old test reference:

`old-next-budget-master/__tests__/feature/Records/ExpenseTemplate.test.tsx`

Old tests include useful cases:

1. `Given a user with a edit expense, the fields should have the record values`

2. `Given a user filling correctly the form to edit an expense, it should see the tick in the button`

New repo currently has no `ExpenseTemplate` test file.

### Existing Patterns To Follow

#### Feature-Sliced Layout

Expense edit UI belongs in `src/features/Records/`.

Route page belongs in `src/app/edit-record/edit-expense/page.tsx`.

No cross-cutting feature should be introduced.

#### BFF/Auth Pattern

Do not pass backend access tokens into client code.

Client code should call `/api/records/expense`.

Route handlers should call backend with `getAccessToken()`.

The existing `PUT` BFF already follows this pattern.

#### Form Pattern

Use the existing `ExpenseTemplate`.

Do not create a separate edit form.

Do not duplicate form validation.

`ExpenseTemplate` already uses `react-hook-form`, `yup`, `DateTimePicker`, `CurrencyField`, category dropdown, tag modal, indebted people manager, budget dropdown, and paid toggle.

#### Navigation Pattern

Use `next/navigation` router in client components.

Use existing constants from `src/shared/constants/global.constants.ts`.

#### Testing Pattern

Use `userEvent`, not `fireEvent`.

Use `screen`, not `container` or `querySelector`.

Do not mock custom hooks.

Do not mock utilities.

Do not mock `sonner`.

Do not mock `next/navigation`.

Use `AppRouterContextProviderMock` for router context.

Use `QueryProviderWrapper` for TanStack Query.

Use `DashboardStoreProvider` for components using `useDashboardStore`.

### Dependencies / Integration Points

No new dependency is needed.

Already-installed dependencies cover the work:

1. `axios`

2. `@tanstack/react-query`

3. `react-hook-form`

4. `yup`

5. `flowbite-react`

6. `sonner`

7. `motion`

8. `@testing-library/react`

9. `@testing-library/user-event`

Environment variables already involved:

1. `BACKEND_URI` for BFF route handler.

2. `SESSION_SECRET_KEY` for auth cookie decoding.

3. `NEXT_PUBLIC_LOCAL_STORAGE` for localStorage namespace.

4. `FRONTEND_URI` is not directly relevant.

CI only sets `REACT_APP_LOCAL_STORAGE=BUDGET_MASTER`, so tests touching localStorage may need to provide or avoid depending on `NEXT_PUBLIC_LOCAL_STORAGE` behavior.

### Backend Contract

Current BFF `PUT /api/records/expense` sends to backend path:

`/expenses-actions`

The known payload shape is:

1. `account: string`

2. `amount: number`

3. `budgets: string[]`

4. `category: string`

5. `date: Date`

6. `description: string`

7. `indebtedPeople: IndebtedPeople[]`

8. `isPaid: boolean`

9. `linkedBudgets: string[]`

10. `shortName: string`

11. `subCategory: string`

12. `tag: string[]`

13. `typeOfRecord: 'expense'`

14. `recordId: string`

Backend details from `REPO_CONTEXT.md` confirm that `/expenses-actions` is a legacy expense layer and that this app already proxies it.

No backend repo exploration is allowed from this workspace.

No backend delegation is needed at this research stage because the BFF already implements the endpoint and the UI type already matches it.

If implementation or manual testing shows a backend DTO mismatch, use the backend delegation prompt from `.opencode/command/backend-research.md` and ask specifically about `PUT /expenses-actions`.

### Edge Cases And Constraints

#### Missing Edit Record

Direct navigation to `/edit-record/edit-expense` can happen without localStorage.

Decision: show a blocking modal — the same `LoginRequiredModal` pattern used on the dashboard and create-record pages — rather than silently redirecting to dashboard. The modal should display when no `edit-record` is found in localStorage, telling the user they must select a record from the drawer to edit it.

This means `EditExpense` reads localStorage, finds no `edit-record`, and renders `LoginRequiredModal` with a message tailored to this case instead of the auth-expired copy. Alternatively, a dedicated `RecordRequiredModal` can be created in `src/shared/ui/organisms/` if the message diverges enough from `LoginRequiredModal` — lazy default is reusing the existing modal with a prop or a shared wrapper if both cases are similar enough to justify it.

#### Selected Account Missing

`ExpenseTemplate` requires `selectedAccount` to submit.

`RecordsPreviewDrawer` calls `manageSelectedAccountCookie()` before navigation.

Edit page should also read the selected account cookie.

If selected account is null, the form can render but submit will not proceed.

#### Auth Missing

The create page uses `LoginRequiredModal accessToken={accessToken}`.

Edit page should mirror this.

#### Categories/Budgets Fetch Failure

`ExpenseTemplate` already accepts `detailedErrorCategories` and `detailedErrorBudgets`.

It already shows toasts for category and budget fetch failures.

#### Credit Account Paid Toggle

`ExpenseTemplate` shows paid toggle only for credit accounts using `selectedAccount?.type === CREDIT_ACCOUNT_TYPE`.

This differs from old repo, which used localStorage selected account info.

New repo should keep current selected account cookie behavior.

#### Date Handling

`ExpenseTemplate` initializes edit date with `new Date(editRecord.date)`.

No date dependency change is needed.

#### LocalStorage Env

`getLocalStorageInfo()` throws if `NEXT_PUBLIC_LOCAL_STORAGE` is missing.

Tests that exercise localStorage must account for this.

#### Coverage

`pnpm test` always writes coverage.

Use focused tests during implementation to avoid unnecessary full-suite runtime.

### Suggested Verification

Smallest useful checks after implementation:

1. `pnpm test -- __tests__/features/Records/RecordPreviewDrawer.test.tsx`

2. `pnpm test -- __tests__/features/Records/ExpenseTemplate/ExpenseTemplate.test.tsx` if that test file is added.

If only one test file is added, run that file and the drawer test.

No build is required during research.

## Open Questions

1. Should direct navigation to `/edit-record/edit-expense` without an `edit-record` in localStorage redirect to dashboard, or show a message?

2. Should edit failure clear `edit-record` from localStorage? Current `ExpenseTemplate` already does this.

3. Should the edit page include `LoginRequiredModal`, matching create-record? Assumption is yes.

4. Should a failed category or budget fetch block editing, or allow editing fields that do not depend on those lists? Current `ExpenseTemplate` shows toasts and still renders.

5. Is backend `PUT /expenses-actions` still guaranteed to accept `linkedBudgets` and deprecated `budgets: []`? Current code assumes yes.

## Assumptions

1. Expense edit should reuse `ExpenseTemplate` instead of creating a new edit form.

2. Income and transfer editing remain unavailable.

3. The selected expense can be temporarily handed off through localStorage, matching old repo behavior.

4. `PUT /api/records/expense` is already the intended BFF endpoint for expense edits.

5. No new dependency is needed.

6. No backend delegation is required unless implementation reveals a mismatch.

7. Tests should remain behavior-focused and follow the repo's Testing Library rules.

## Non-Obvious Findings

1. The old repo page/component is useful, but its access-token props are obsolete in the new repo.

2. The new repo already has the backend proxy for edit expense, so adding an `/api/edit-record/edit-expense` route would be duplicate work.

3. The current blocker is not mutation logic; it is the missing edit page and missing localStorage save before navigation.

4. `RecordsPreviewDrawer` has a test that confirms navigation, but not that the record is available to the destination page.

5. The old repo had `saveEditRecordLS`; the new repo kept `resetEditRecordLS` but dropped the save side.

## Implementation Boundaries For Next Phase

Do not add new backend routes.

Do not add new dependencies.

Do not implement income edit.

Do not implement transfer edit.

Do not rewrite `ExpenseTemplate`.

Do not introduce a new store for edit state.

Do not use URL query params for the full record unless localStorage handoff is rejected.

## PR Reminder

PRs target `develop`.

Every PR must carry exactly one label: `major`, `minor`, or `patch`.

Do not manually bump `package.json` version.

Do not manually edit `CHANGELOG.md`.
