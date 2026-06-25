# /backend-research - Delegate a research question to the BE_Personal_Finances agent

You are running a **delegated research question** against the `BE_Personal_Finances` backend (git@github.com:RafaelMoro/BE_Personal_Finances.git, package `be_personal_finances`, NestJS 11 + MongoDB on AWS Lambda). The agent asking you this question is working on the **BFF** in `clean-next-budget-master` (Next.js 14 + TS + Zustand + TanStack Query) and needs concrete information it cannot infer from its own codebase.

This prompt is a **template**. The BFF agent (or the user) fills in the `{VARIABLE}` placeholders before handing it to you. If a placeholder is left empty, infer the most reasonable value from the context sections below and call it out in your response.

---

## Inputs

- **Task being researched on the BFF side:** {TASK_DESCRIPTION}
  - Example: "Add a BFF route handler for `POST /api/categories` to support a new Categories feature in the FE."
- **Endpoints of interest on the backend:** {ENDPOINTS_OF_INTEREST}
  - Example: "POST /categories, GET /categories, POST /categories/create-local-categories"
- **Specific questions:** {SPECIFIC_QUESTIONS}
  - Example: "What is the request DTO? What is the response shape? Are any of these @Public() or all JwtAuthGuard? Does create-local-categories require a body?"
- **Known backend context the BFF already has:** {KNOWN_BACKEND_CONTEXT}
  - Default (use this verbatim if the BFF agent provides nothing): "NestJS 11 + Mongoose 8 / MongoDB Atlas on AWS Lambda + API Gateway. Auth: @nestjs/jwt + passport-jwt. accessToken cookie (httpOnly, sameSite: 'strict', secure in prod, 5d maxAge). JwtAuthGuard is global; routes opt out with @Public(). No URL versioning. Responses wrapped in GeneralResponse { version, success, message, data, error }. No Swagger / OpenAPI — the contract is the class-validator DTOs under each module's *.dto.ts. Some endpoints (Budget, Category, expenses-actions, incomes-actions, budget-history) are not yet proxied by the BFF."
- **Output destination:** {OUTPUT_DESTINATION}
  - Example: "A markdown section to be dropped into `ai-research/{story}.md` under `## Backend reference`."

---

## Your job

1. **Verify scope.** Confirm the endpoints of interest exist in this backend. If any don't, say so explicitly and propose the closest match.
2. **Read the source of truth.** For each endpoint, read the **DTO first** (`src/<module>/dtos/*.dto.ts`) — that's the contract. Then read the **controller** (`src/<module>/controllers/<module>.controller.ts`) for method, path, guards, and any cross-cutting decorators (`@Public()`, `@Roles()`, etc.). Cite file + line numbers in your response.
3. **Cover the specific questions.** Answer every numbered question, in order. If a question cannot be answered from the code, say "Not determinable from code — needs human confirmation" and suggest who to ask.
4. **Flag side effects.** If the requested change on the BFF side implies a breaking change in the backend (e.g. adding a required field, removing a field, changing a status code), call it out. There is no URL versioning, so any breaking change affects all clients at once.
5. **Flag cross-cutting concerns.** Anything that touches:
   - **CORS** (the allow-list is `[FRONTEND_URI, TEST_FRONTEND_URI, DOMAIN_URI]` in `src/main.ts`)
   - **Auth** (cookie flags, token expiry, refresh strategy — there is none)
   - **Response envelope** (`GeneralResponse`)
   - **The dual income/expense layer** (legacy `/expenses-actions` + `/incomes-actions` controllers vs. the newer `AccountRecord` schema under `/records`)
   - **Validation** (class-validator DTOs; the FE should mirror these)

---

## Output format

Return a single markdown section ready to paste into the BFF's research doc, structured like this:

```markdown
## Backend reference

> Sourced from `BE_Personal_Finances` (commit: {COMMIT_SHA_OR_BRANCH}, fetched: {YYYY-MM-DD}).

### Endpoint: {METHOD} {PATH}

- **File:** `src/<module>/controllers/<module>.controller.ts:{LINE}`
- **Guard:** {JwtAuthGuard | @Public() | @Roles(...)}
- **Request DTO:** `src/<module>/dtos/<file>.dto.ts:{LINE}` (paste the class + class-validator decorators)
- **Response envelope:** GeneralResponse (success / error variants)
- **Notes:** {any caveats, dual-layer implications, side effects}

### Answers to specific questions

1. ...
2. ...

### Open items for the backend owner

- ...
```

Be concrete. Cite file paths and line numbers. Do not invent fields or endpoints.

---

## Don'ts

- Don't recommend the BFF clone this repo — it can't and shouldn't.
- Don't propose changes to the backend unless the BFF agent explicitly asked for them.
- Don't omit the line numbers — the BFF agent will need them to verify your answer.
- Don't speculate on intent. If the code is ambiguous, quote the relevant lines and say "ambiguous — needs human input."
- Don't re-state the BFF's tech stack unless it directly affects the answer. Focus on the backend.
