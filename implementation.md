# Implementation Plan

## Step 1 - Project bootstrap and tooling

- Initialize a Next.js 14 App Router project with TypeScript (`npx create-next-app@latest`), enable Tailwind CSS (or preferred component library), and remove boilerplate routes.
- Install shared dependencies: `@clerk/nextjs` for auth, `@supabase/supabase-js` and `@supabase/auth-helpers-nextjs` for data access, `cashfree-pg` SDK, `zod` plus `react-hook-form` for validation, and UI primitives (for example `@radix-ui/react-*` or a shadcn kit).
- Configure absolute module aliases in `tsconfig.json`, shared ESLint/Prettier settings, and optional Husky pre-commit hook that runs `lint` and `type-check`.
- Document runtime prerequisites via `.nvmrc` (or `.node-version`) and scaffold `.env.example` with all required secrets.

## Step 2 - Environment variables and secrets

- Define environment variable contract (`env.mjs` or `next.config.js`): `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_ENV`, webhook signing secrets, and domain URLs.
- Configure Vercel (or chosen host) project settings to mirror `.env.example`, and add local fallbacks via `.env.local`.
- Store service-role keys securely (never expose them in client bundles); use Next.js server-only modules (for example `cookies()` helper) to access them.

## Step 3 - Supabase project alignment

- Apply `schema.md` migration to Supabase (via SQL editor or `supabase db push`) and confirm all tables, indexes, triggers, and RLS policies exist.
- Generate typed Supabase definitions (`supabase gen types typescript --project-id <project-id>`) and commit them to `types/supabase.ts` for end-to-end type safety.
- Create two Supabase client factories: one server-side using the service role (for trusted API routes) and one edge-safe client using the anon key plus Clerk JWT for user-facing queries.
- Seed basic data (sample hackathon and sponsor) using SQL scripts to validate triggers such as `increment_participant_count`.

## Step 4 - Clerk authentication integration

- Wrap the App Router entry (`app/layout.tsx`) with `ClerkProvider`, configure `metadata` for theme, and expose `SignIn`, `SignUp`, and `UserButton` routes under `app/(auth)/`.
- Add `middleware.ts` with `ClerkMiddleware` to guard protected routes and expose public path matchers for landing and hackathon listings.
- Implement a post-auth sync: on Clerk user creation or update call a server action (via Clerk webhooks or a Next.js API route) that upserts the user into the Supabase `users` table with metadata (name, email, avatar, phone, college, role).
- Provide reusable helper (`requireUserProfile`) that fetches the Supabase user record, ensuring participants have completed profile fields before checkout.

## Step 5 - Data access layer and validation

- Create `lib/supabase/server.ts` and `lib/supabase/client.ts` factories that attach the Clerk auth token to Supabase headers (`{ Authorization: 'Bearer ' + clerkToken }`).
- Model domain-specific repositories (for example `lib/repos/hackathons.ts`, `participants.ts`, `payments.ts`) encapsulating Supabase queries and enforcing RLS-compatible filters.
- Define shared Zod schemas for hackathon payloads, participant registration, and payment updates to reuse across Postman APIs and frontend forms.
- Add error handling utilities that map Supabase errors to typed `AppError` responses for consistent API behavior.

## Step 6 - Hackathon management API (Postman-driven)

- Build App Router endpoints (`app/api/hackathons/route.ts`, `app/api/hackathons/[id]/route.ts`) that support `POST`, `PATCH`, `GET`, and `DELETE` using the Supabase service client; they will be invoked via Postman while an admin dashboard is deferred.
- Require an admin-only token (for example `X-ADMIN-KEY` stored in env) or a Clerk admin session inside these routes before mutating data to honor RLS.
- Support slug auto-generation, theme normalization, and schedule validation at this layer to keep the database consistent.

## Step 7 - Public hackathon surfaces

- Create a marketing landing page (`app/page.tsx`) showcasing upcoming hackathon highlights, sponsors, testimonials, and a call-to-action to browse hackathons.
- Implement `app/hackathons/page.tsx` to list published and ongoing hackathons with filters (location type, themes) and server-side data fetching for SEO.
- Build `app/hackathons/[slug]/page.tsx` to display full details (timeline, prize breakdown, team rules), surfaced from Supabase along with sponsor logos and FAQ blocks.
- Add static revalidation (ISR) so updates from Postman propagate quickly while keeping runtime cost low.

## Step 8 - Participant registration experience

- Gate the registration call-to-action with Clerk: unauthenticated users are redirected to sign in; authenticated users load a wizard built with `react-hook-form`.
- Prefill profile fields from the Supabase `users` table; force completion of missing metadata (college, branch, phone) before proceeding and persist updates.
- Validate registration window (`registration_start` and `registration_end`), team size limits, and existing participation (unique constraint) before creating records.
- Upsert a `participants` row with `payment_status = 'pending'`, storing provisional team details and linking to the selected hackathon.

## Step 9 - Cashfree payment initiation

- Implement `app/api/payments/create-order/route.ts` that receives the participant id, verifies eligibility, and creates a Cashfree order (amount INR 99, currency INR) using the Cashfree PG SDK or REST API.
- Persist a `payments` row with `status = 'initiated'`, `order_id`, request payload snapshot, and tie it to the participant plus hackathon.
- Return the Cashfree `payment_session_id` (or equivalent token) to the frontend, plus success and failure redirect URLs derived from environment config.
- Load Cashfree Drop Checkout or SDK on the client side, preconfiguring customer info and order amount pulled from the participant record.

## Step 10 - Frontend payment handling and confirmation

- Handle Cashfree callbacks on the client (success, failure, close) and call a Next.js API route (`/api/payments/verify`) to confirm the transaction status server-side.
- On success, mark `payments.status = 'success'`, set `payment_id`, store the gateway response JSON, and update `participants.payment_status = 'paid'` plus `submitted_at` when relevant.
- On failure or cancellation, update statuses accordingly and keep the participant eligible for a retry within the registration window.
- Redirect the user to dedicated `success` and `failure` routes that summarize the registration, provide invoice or instructions, and prompt them to join communication channels (Slack or Discord).

## Step 11 - Webhooks and reconciliation

- Expose a secure webhook endpoint (`app/api/webhooks/cashfree/route.ts`) to receive asynchronous Cashfree events; verify signatures using `CASHFREE_WEBHOOK_SECRET`.
- Reconcile webhook payloads with Supabase records (idempotent updates), ensuring late notifications still mark payments as `success` or `failed` correctly.
- Leverage the `increment_participant_count` trigger for paid participants and add compensating logic if a payment is refunded (decrement count and mark participant as `refunded`).
- Log webhook activity (Supabase `logs` table or an external tool) for auditability.

## Step 12 - Notifications and communication touchpoints

- Insert rows into the Supabase `notifications` table on key events (registration success, payment failure, schedule updates) and surface them in-app via a notifications dropdown or page.
- Send transactional emails using Resend when payments succeed.
- Provide in-app banners reminding unpaid participants to finish checkout before the deadline.

## Step 13 - Quality assurance, monitoring, and deployment

- Write unit tests for repositories and server actions (using Vitest or Jest with a Supabase test client) and integration specs for API routes.
- Add end-to-end tests with Playwright covering login, hackathon browse, registration, and mocked payment completion flows.
- Instrument server actions with structured logging (for example `pino`) and connect Vercel logs plus Supabase Logflare for observability.
- Configure a CI pipeline (GitHub Actions) to run lint, type-check, tests, and optionally Supabase schema diff; deploy to Vercel with preview environments per PR.
- Post-deployment, monitor payment success rates, participant counts, and review RLS access logs to ensure there is no unauthorized data exposure.
