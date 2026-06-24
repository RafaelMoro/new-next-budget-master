# AGENTS.md

Compact guide for OpenCode sessions working in this repo. Verify against the codebase before trusting; see the referenced files for details.

## Toolchain

- Package manager: **pnpm** (`pnpm install`). Node `>=22.15.1`, pnpm `>=10.11.0`.
- Next.js 14 (App Router) + React 18 + TypeScript (strict). Path alias `@/*` → `./src/*`.
- Tailwind v4 via `@tailwindcss/postcss`; `next.config.mjs` is wrapped by the flowbite-react plugin.
- State: Zustand (`src/zustand/`) with a React context provider, plus TanStack Query.

## Commands

- `pnpm dev` – dev server on :3000
- `pnpm build` / `pnpm start`
- `pnpm lint` – `next lint` (ESLint config: `next/core-web-vitals` + `next/typescript`).
- `pnpm test` – Jest. **Coverage is always collected** (`collectCoverage: true`), so every run writes to `coverage/`.
- Single test: `pnpm test -- __tests__/features/Accounts/CreateAccountButton.test.tsx`
- Watch: `pnpm test:watch`

There is no separate `typecheck` script; rely on `next build` / editor TS for type errors.

## Architecture

- `src/app/` – App Router root. `layout.tsx` sets `export const dynamic = 'force-dynamic'` and wraps children in `QueryProviderWrapper` (TanStack Query).
- `src/app/api/` – Next route handlers that proxy to a backend via axios using `process.env.BACKEND_URI`. Auth uses `jose` to encode an access token into an httpOnly session cookie.
- `src/features/<Domain>/` – domain UI (Accounts, Budgets, Categories, Charts, Dashboard, Login, Records).
- `src/shared/{ui,hooks,lib,utils,constants,types}` – cross-cutting code. UI is split into `atoms/molecules/organisms` plus `tremor` and `icons` dirs (the latter two are **excluded from coverage**).
- `src/zustand/store/` holds stores; `src/zustand/provider/` holds the React context providers. A component using `useDashboardStore` **must** be rendered inside `DashboardStoreProvider` (from `src/zustand/provider/dashboard-store-provider.tsx`).

## Environment

- Required env vars: `BACKEND_URI`, `SESSION_SECRET_KEY`, `NEXT_PUBLIC_LOCAL_STORAGE`, `FRONTEND_URI` (see `.env-example` and `.env.local`). `.env.test` is loaded by Jest via `next/jest` (`dir: './'`).
- CI (`unit-tests.yml`) creates `.env` with only `REACT_APP_LOCAL_STORAGE=BUDGET_MASTER` before running tests — do not rely on other env vars being set in CI.

## Testing conventions (enforced)

Repo has strong test conventions in `.github/copilot-instructions.md` — read it before writing tests. Key rules (corrected paths):

- Tests live under `__tests__/` mirroring `src/` (e.g. `__tests__/features/Accounts/`, `__tests__/features/Dashboard/`). `__tests__/mocks/` and `__tests__/utils-test/` are **ignored by the test runner** (`testPathIgnorePatterns`); use them for shared fixtures/helpers only.
- Reference wrappers/providers:
  - `AppRouterContextProviderMock` at `src/shared/ui/organisms/AppRouterContextProviderMock.tsx` — wrap components that use `next/navigation` router; add `push: jest.fn()`.
  - `QueryProviderWrapper` at `src/app/QueryProviderWrapper.tsx` — wrap components using TanStack Query (`useQuery`/`useMutation`).
  - `DashboardStoreProvider` + `mockAccounts` from `__tests__/mocks/accounts.mock.ts` — for components using `useDashboardStore`.
- `__tests__/home.test.tsx` shows cookie mocking (`jest.mock('next/headers', ...)`) and the router/query wrappers; use it as a template for those errors.
- Freeze/ResizeObserver errors: see `__tests__/features/Dashboard/StatisticsSubscreen.test.tsx` for the mock pattern.
- **Do not**: mock the component under test, mock custom hooks, mock utilities (e.g. `@/shared/utils/*`), mock `sonner`, mock `next/navigation`, use `require()`, use `fireEvent` (use `userEvent`), assert on CSS classes/styles, or extract `container`/use `querySelector`. Always query via `screen`.

## Branch / release flow

- Integration branch is **`develop`** (no `main`/`master`). PRs target `develop`.
- Every PR must carry exactly one label: `major`, `minor`, or `patch` — `check-label.yml` fails the PR without one.
- On merge to `develop`, `develop-pipeline.yml` runs unit tests, bumps `package.json` version via `npm version`, creates a `v<version>` git tag, and prepends an entry to `CHANGELOG.md` (committed by `github-actions[bot]`). Do not version-bump or edit `CHANGELOG.md` manually on PRs.