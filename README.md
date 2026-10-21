# ShopaBlock v2

A focused Next.js app for selling one product. Live editor, private media and digital delivery, seller workspace, and an AI assistant that prepares proposals for review.

## Run

Node 24, pnpm. Install with `pnpm install`, set private environment variables, generate Prisma with `pnpm exec prisma generate`, then `pnpm dev`. Run `pnpm test`, `pnpm typecheck`, and `pnpm build` before deployment.

## Environment

- `DATABASE_URL`: Neon PostgreSQL connection string. Preview must use an isolated database branch.
- `BLOB_READ_WRITE_TOKEN`: private Vercel Blob store.
- `AI_GATEWAY_MODEL`: verified model ID (currently `anthropic/claude-haiku-5.5`). Vercel OIDC authenticates deployed requests; local use needs `AI_GATEWAY_API_KEY` or a development OIDC token.
- `KOMPIPAY_BASE_URL`: existing KompiPay service.
- `KOMPIPAY_PLATFORM_API_KEY`: **v2 platform** key. The legacy merchant `KOMPIPAY_API_KEY` is deliberately not used by v2.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for the same platform and test/live mode. A KompiPay publishable key is not interchangeable.
- Optional `RESEND_API_KEY` and `EMAIL_FROM`: verified sender for password reset emails. Missing configuration produces an honest unavailable state.

No keys belong in Git. Account and product pages are server authenticated. Receipt tokens are stored hashed. Public image access is limited to published products; download access requires a paid receipt or the asset owner.

## Database rollout

Apply `prisma/migrations/20261021230000_shopablock_v2/migration.sql` before deploying this version. It is additive and preserves existing records. Run `prisma migrate deploy` against the intended environment. The v2 preview branch is `preview/shopablock-v2`, distinct from production.

## Payment lifecycle

Checkout snapshots product details and atomically reserves one unit. Retries reuse the checkout key and provider idempotency key. Browser success never marks an order paid. Server reconciliation checks the provider's seller, amount, currency, order metadata and PaymentIntent before changing stock or unlocking files. Reconciliation is idempotent. The buyer confirmation page polls; sellers can refresh pending payments.

**Operational gates before enabling payments:** install and verify the v2 platform credentials in matching Stripe mode; complete seller onboarding; test a full test-mode payment and the KompiPay Stripe webhook. The current KompiPay v2 API has no cancellation or refund endpoint. Pending stock reservations are retained until the provider confirms cancellation or success; do not release them on a timer while payment is still possible. Provider cancellation/reconciliation is needed for abandoned-checkout cleanup before broader commercial launch. Refunds remain with the payment provider. Automatic order emails and paid subscription billing are not implemented; the UI says so.

Physical shipping is UK-only, one item per checkout, with a shared price and stock for product options. Product amounts are GBP. No automated taxes, subscriptions, discounts, refunds or international shipping are implied.

## Assistant

AI SDK ToolLoopAgent, a maximum of five steps, structured proposals, daily and minute quotas, and scoped read-only product/order tools. It cannot publish, write product data, send messages, refund, or spend money. Users apply suggestions to a draft and publish explicitly. Requests, tool actions, and results are recorded per account. Product content is untrusted input. Buyer personal details are excluded from AI tools.

## Design assets

`public/images/mug.webp` is an AI-generated illustrative ceramic mug, created for this redesign. Prompt direction: photorealistic cobalt hand-glazed ceramic mug, generous handle, soft blue studio backdrop, warm directional sunlight, premium independent maker product photograph, no text or logos. `print.svg` and `planner.svg` are original code-created illustrative artwork. All example products are labelled as examples; no fabricated customer metrics or testimonials.

## Validation

Unit tests cover exact monetary conversion, launch requirements, restricted AI proposals, payment matching/statuses and receipt-token integrity. Use the isolated preview deployment for authenticated integration tests. Do not run real charges or create test customer records in production. App legal pages describe current functionality; business identity, contact details and production policies still need owner review before commercial launch.
