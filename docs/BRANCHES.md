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

## Python extension tasks
Python source and requirements are on `main` in the `python/` directory. Bring these commits into your branch before starting:
- Branch 02: Python MySQL connector and configuration
- Branch 06: Consistent registration threshold and aggregate policy
- Branch 07: Normal distribution, regression and final graphics
- Branch 08: Statistical/script tests with synthetic rows
- Branch 09: Analyst authorization and privacy checks
- Branch 10: Python setup, methods, and final report instructions
Read `python/README.md` for instructions and scientific limitations.

## Random Forest work allocation

- Branch 07: design reviewed feature-importance graphics and visualization documentation.
- Branch 08: add synthetic ML tests, baseline metrics and leakage checks.
- Branch 09: privacy, access control, fairness and responsible-use review before any real student prediction.
- Branch 10: document Python ML setup and interpretation in the final report.
See `docs/RANDOM-FOREST.md` and `python/random_forest_demo.py` on main.
