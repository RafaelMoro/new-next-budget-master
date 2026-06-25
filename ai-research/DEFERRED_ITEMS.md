# Deferred Items — Income Feature

Items intentionally left out of the initial Income port. Track here, address in follow-up PRs.

Source: `ai-research/INCOME_FEATURE_RESEARCH.md` §6.

## 1. `expensesPaid` sub-feature
- **What:** `useSelectExpensesPaid` hook + `SelectPaidSection` + `SelectPaidDrawer` + fetch-expenses-by-date endpoint
- **Old repo:** `old-budget-master/src/features/Records/ExpensesPaid/`, `old-budget-master/src/shared/hooks/useSelectExpensesPaid.tsx`
- **Status:** `IncomeRecord.expensesPaid` stays `[]` in MVP
- **Add when:** User requests income→expense linking

## 2. Edit-income page
- **What:** `src/app/edit-record/edit-income/page.tsx` + `EditIncome` wrapper (reads record from localStorage)
- **Status:** `RecordsPreviewDrawer` patched to toast on edit attempt (see research §10). Edit route is unreachable until the page exists.
- **Add when:** Edit flow is needed — **must** also revert the drawer patch at the same time
- **Old repo:** `old-budget-master/src/features/Records/EditIncome.tsx`, `old-budget-master/src/app/edit-record/`

## 3. Transfer feature — CREATE (IN SCOPE)
- **What:** `TransferTemplate` + `TransferAccountsSelector` + `useTransferBankAccounts` + BFF `POST /api/records/transfer` + `createTransferCb`
- **Status:** This PR implements create-only transfer MVP
- **See:** `ai-research/TRANSFER_FEATURE_RESEARCH.md`

## 4. Transfer `expensesPaid` sub-feature
- **What:** `destination?.type === 'Crédito'` → `SelectPaidSection` + `SelectPaidDrawer` + fetch-expenses-by-date endpoint
- **Status:** Deferred — `TransferIncome.expensesPaid` stays `[]` in MVP
- **Add when:** User requests transfer→expense linking

## 5. Edit-transfer page
- **What:** `src/app/edit-record/edit-transfer/page.tsx` + `EditTransfer` wrapper
- **Status:** Deferred — `RecordsPreviewDrawer` patched to toast on transfer edit attempt
- **Add when:** Edit transfer flow is needed — **must** also revert the drawer patch at the same time
- **Old repo:** `old-budget-master/src/features/Records/EditTransfer.tsx`, `old-budget-master/src/app/edit-record/`
