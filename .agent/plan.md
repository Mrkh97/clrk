# Receipt currency + FX plan

- Add `currency` to web receipt form state and submit flow.
- Use TRY as the form default.
- Normalize extracted currency in API extraction flow; if OCR cannot infer a valid currency, return TRY.
- Add Frankfurter client under `apps/clrk-api/src/infrastructure/external-apis/`.
- Normalize dashboard + optimizer calculations to TRY before totals are computed.
- Verify with API tests and web/API builds.

Open questions: none blocking; latest-rate conversion is acceptable for now.
