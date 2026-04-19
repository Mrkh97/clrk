# clrk-web Forms Migration Plan

## Goal
- [x] Migrate `apps/clrk-web` true forms to the shadcn/ui + TanStack Form pattern.
- [x] Scope: `src/routes/login.tsx`, `src/routes/register.tsx`, `src/features/receipt/presentations/components/ReceiptForm.tsx`, and the filter cluster in `src/features/receipt/presentations/components/ReceiptList.tsx`.
- [x] Keep `src/lib/auth-client.ts` auth flows and `src/features/receipt/hooks/useReceipts.ts` mutation/query behavior intact unless payload typing forces a tiny adjustment.

## Dependencies
- [x] Change `apps/clrk-web/package.json` to add `@tanstack/react-form`.
- [x] Reuse existing `zod`.
- [x] Do not add a separate Zod adapter package; current TanStack Form accepts Zod schemas directly in `validators`.

## Shared Form Layer
- [x] Add `apps/clrk-web/src/components/ui/form.tsx` as the minimal shared wrapper file for the shadcn/TanStack pattern.
- [x] Keep it presentation-focused: `Field`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError`, and any tiny helpers needed to map TanStack field meta to `data-invalid` and error text.
- [x] Reuse existing `Input`, `Label`, `Select`, `Textarea`, `DatePicker`, and `Button`; do not create a second set of input primitives.

## Runtime Enums For Schemas
- [x] Change `apps/clrk-web/src/features/receipt/types/index.ts` to export runtime tuples/constants for receipt categories and payment methods so `z.enum(...)` can be shared instead of re-declaring values inside `ReceiptForm.tsx`.
- [x] Keep existing exported types intact and derive unions from the runtime tuples if possible.

## Auth Forms
- [x] Change `apps/clrk-web/src/routes/login.tsx` to replace local `useState` form state with `useForm`.
- [x] Keep existing search-param validation and redirect logic unchanged.
- [x] Add a local `loginFormSchema`: `email` valid email, `password` non-empty string.
- [x] Use async `onSubmit` to preserve current `signIn.email -> getSession -> resend verification if needed -> redirect` flow.
- [x] Render fields through `form.Field` plus the new `ui/form.tsx` wrappers and existing `Input/Button`.

- [x] Change `apps/clrk-web/src/routes/register.tsx` to replace local `useState` form state with `useForm`.
- [x] Keep existing search-param validation and redirect logic unchanged.
- [x] Add a local `registerFormSchema`: `name` trimmed non-empty string, `email` valid email, `password` min length `8`.
- [x] Use async `onSubmit` to preserve current `signUp.email(...callbackURL) -> redirect to confirm-email` flow.
- [x] Render fields through `form.Field` plus the new wrappers and existing `Input/Button`.

## Receipt Form
- [x] Change `apps/clrk-web/src/features/receipt/presentations/components/ReceiptForm.tsx` to replace local `useState` form state with `useForm`.
- [x] Keep the current create vs edit split, `useAddReceipt`, `useUpdateReceipt`, `useReceiptStore`, and post-success reset behavior.
- [x] Move the local category/payment method arrays to shared runtime exports from `src/features/receipt/types/index.ts`.
- [x] Add a receipt form schema shaped like current `ReceiptFormValues`:
- [x] `merchant`: trimmed non-empty string.
- [x] `amount`: string refined to a finite positive number.
- [x] `currency`: non-empty string, not restricted to `COMMON_RECEIPT_CURRENCIES`, because extracted receipts may surface non-common currencies.
- [x] `date`: valid `YYYY-MM-DD` string.
- [x] `category`: `z.enum(receipt categories)`.
- [x] `paymentMethod`: `z.enum(payment methods)`.
- [x] `notes`: string default `''`.
- [x] Preserve AI-extracted prefills by resetting or patching TanStack form values when `extractedReceipt` changes.
- [x] Preserve edit-mode prefills by resetting form state when `selectedReceipt` changes.
- [x] Keep submit payload shape compatible with current receipt hooks so `useReceipts.ts` does not need churn unless typing requires a tiny follow-up.

## Receipt Filters
- [x] Change `apps/clrk-web/src/features/receipt/presentations/components/ReceiptList.tsx` so the filter cluster uses TanStack Form state instead of three separate `useState` calls.
- [x] Treat it as a lightweight non-submit form: derive `useReceipts` filters from subscribed form values and clear with `form.reset()`.
- [x] Add a small filter schema:
- [x] `from`: optional valid date string.
- [x] `to`: optional valid date string.
- [x] `category`: `'all' | ReceiptCategory`.
- [ ] Optional cross-field refine: if both dates exist, `from <= to`.
- [x] Keep delete dialog and delete mutation logic unchanged.

## Likely No-Change Files
- [x] Leave `apps/clrk-web/src/lib/auth-client.ts` unchanged.
- [x] Leave `apps/clrk-web/src/features/receipt/hooks/useReceipts.ts` unchanged unless schema/output typing makes a tiny payload-normalization adjustment necessary.
- [x] Do not broaden scope into upload zone or optimizer controls.

## Verification
- [x] From `apps/clrk-web`, run `pnpm test`.
- [x] From `apps/clrk-web`, run `pnpm build`.
- [x] From `apps/clrk-web`, run `pnpm exec tsc --noEmit`.

## Execution Order
- [x] 1. Add TanStack Form dependency and shared `ui/form.tsx`.
- [x] 2. Migrate login and register.
- [x] 3. Add receipt runtime enums/schema support.
- [x] 4. Migrate receipt form.
- [x] 5. Migrate receipt filters.
- [x] 6. Full test + build verification.
