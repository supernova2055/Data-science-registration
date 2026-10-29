# Work plan — 10 branches

All 10 branches are based on main and can be developed independently. Open a pull request to main when a task has been tested.

1. `feature/01-database-schema` — Design students table, constraints, indexes and migration workflow.
2. `feature/02-mysql-connection` — MySQL pool, environment configuration and connection troubleshooting.
3. `feature/03-registration-api` — POST /api/students, query parameters and error responses.
4. `feature/04-registration-ui` — Responsive HTML registration form, accessibility and success states.
5. `feature/05-input-validation` — Validation tests, length limits, duplicate codes and error handling.
6. `feature/06-analytics-api` — COUNT gate > 10, aggregate SQL and privacy-safe categories.
7. `feature/07-dashboard` — Charts for aggregate analytics (no identifiable student rows).
8. `feature/08-testing` — API, integration and database tests using synthetic records.
9. `feature/09-privacy-security` — Consent, authentication, authorization, data retention and anti-abuse.
10. `feature/10-documentation-deployment` — Setup docs, deployment instructions and CI.

## Next milestones
- Configure local MySQL and confirm schema exists.
- Register 11 synthetic test students locally.
- Test that analytics is locked for the first 10 and unlocked at 11.
- Review data protection and secure the analytics endpoint before production.
