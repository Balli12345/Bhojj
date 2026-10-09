# Bhojj Production Backend

1. Create a Hostinger MySQL database.
2. Import `database/schema.sql`, then `database/seed.sql` once.
3. Configure server environment variables from `.env.example` (or your Hostinger PHP config).
4. Point `api.bhojj.in` to this `api/` directory, or keep it under `/api`.
5. Change seeded demo passwords immediately; seed password is `password`.
6. Set `BHOJJ_ALLOWED_ORIGINS` to your exact HTTPS frontend origins.
7. Keep database credentials outside public_html when possible.

Health check: `/api/health`.


## Phase 2 native integration notes
- The React UI remains the design authority; do not use the legacy vanilla `www/` shells as the app UI.
- Native apps should call this API over HTTPS and preserve the existing session/CSRF contract.
- `POST /riders/location` stores the latest delivery-partner location.
- `POST /riders/telemetry` validates that the rider owns the order before storing telemetry.
- `POST /orders/{id}/auto-assign` selects the nearest verified, online rider with a fresh location when delivery coordinates exist.
- Order status transitions are now role/state constrained instead of accepting arbitrary status changes.
- Background location is not implied by the API; Android foreground/background policy must be implemented and tested separately.
