# Data Science Registration

Node.js + Express + MySQL student-demographics registration and a small analytics API.

## Setup
1. Install Node.js 20+ and MySQL 8+.
2. Run `sql/schema.sql` as a database administrator.
3. Review and adapt `sql/admin-setup.example.sql` to create a minimally privileged MySQL user. Do not commit credentials.
4. Copy `.env.example` to `.env` and fill in the database login.
5. Run `npm install` and `npm start`.
6. Visit http://localhost:3000.

## API
- `POST /api/students`: save one registration, requires student_code, age, gender, city, country and education_level.
- `GET /api/stats`: registration count and analytics eligibility.
- `GET /api/analytics`: aggregate results only when total students > 10.

## Data handling
Do not upload student records or passwords to GitHub. The repository is currently public. Obtain informed consent and follow your school's rules before collecting data. This starter is intended for local development; add authentication and stronger privacy review before public deployment. Groups with fewer than five students are hidden, but this alone is not a complete privacy guarantee.

## Work branches
See `docs/BRANCHES.md` for the 10 feature branches, their scope and suggested work.
