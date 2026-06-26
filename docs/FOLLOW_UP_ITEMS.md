# Follow-Up Items

Cross-cutting and per-feature improvements to address after the initial implementation. These are not bugs — they are intentional deferrals tracked here so they are not lost.

---

## Edit Expense PR

### UX: Graceful degradation when category/budget fetch fails in `ExpenseTemplate`

**File:** `ai-research/edit-expense.md` §Edge Cases / Categories/Budgets Fetch Failure

**What:** When `ExpenseTemplate` renders in edit mode and the category or budget fetch has failed, the form should degrade gracefully instead of just showing a toast. Specifically:
- If `detailedErrorCategories` is set, disable the category + subcategory dropdowns and show a visible inline warning (not only a toast).
- If `detailedErrorBudgets` is set, disable the budget dropdown and show a visible inline warning.
- The user should still be able to edit other fields (amount, description, date, paid status, tags, indebted people).

**Why deferred:** The current behavior (toast only) is functional for the happy path and for partial failures. The form already handles null categories/budgets. The gap only manifests when the user specifically needs to change the category or budget during an edit and the fetch already failed — a minority case.

**How to add:**
1. Add inline error state props to `ExpenseTemplate` for category and budget dropdown visibility.
2. Conditionally disable the respective dropdowns when the error is present.
3. Add a small inline warning text below each disabled dropdown.
4. No new dependencies, no new types, no route changes.

---

## Future PRs

_(Add follow-up items from other stories here as they are discovered.)_
