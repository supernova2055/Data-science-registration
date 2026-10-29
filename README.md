# Data Science Registration

A small **Node.js 20+ / Express / MySQL 8+** learning project for registering student demographics and analyzing aggregated data **after at least 11 students** have registered.

> **Status:** Starter implementation is committed to `main`; 10 feature branches exist for organized development. This does **not** mean a live MySQL server, hosted website, production security, or end-to-end testing has been completed. The GitHub repository was public when last checked; **do not commit real student records or passwords**.

## Project workflow and example graphs

The diagrams below render directly inside GitHub README. **All four graphs show made-up demonstration values, not actual registered students.** Real charts must be generated locally from authorized data after 11 registrations and privacy review.

```mermaid
flowchart TD
    A["Student enters registration"] --> B["Node.js + Express validates"]
    B --> C[("MySQL students table")]
    C --> D{"Total students > 10?"}
    D -->|No| E["Continue registration"]
    D -->|Yes| F["Python analysis"]
    F --> G["Linear regression"]
    F --> H["Distribution checks"]
    F --> I["Demographic charts"]
    G --> J["Reviewed final report"]
    H --> J
    I --> J
```

### 1. Age distribution (illustration)

![Synthetic age distribution bar chart](docs/graphs/age-distribution.svg)

Use `python/analyze.py` to generate the real local histogram at `python/output/age_histogram.png`. The demo bar chart above is synthetic; it is not a statistical result from MySQL.

### 2. Normal distribution (illustration)

![Synthetic normal distribution bell curve](docs/graphs/normal-distribution.svg)

A normal reference curve can be compared to the real age histogram; the Python script also reports a normality test. A bell-shaped curve or large p-value alone does **not** establish that ages are normally distributed.

### 3. Linear regression (illustration)

![Synthetic regression scatterplot with trend line](docs/graphs/linear-regression.svg)

The Python script generates `python/output/linear_regression.png`, and reports the slope and R². Its current predictor—registration order—is **educational only** and cannot support a useful substantive conclusion. Select a meaningful numeric predictor and outcome, with proper consent, before making scientific claims.

### 4. Student demographics (illustration)

![Synthetic education demographics counts](docs/graphs/demographics.svg)

The script also saves gender and education counts when enough records exist. Its local plots suppress categories under five; any externally shared graphs need a separate privacy review.

### Full step-by-step: getting your real graphs

1. **Clone** the repo: `git clone https://github.com/sureshkhaniya/Data-science-registration.git`, then `cd Data-science-registration`.
2. **Install** Node.js 20+, MySQL 8+ and Python 3.10+ (3.11+ recommended).
3. **Create database** by executing `sql/schema.sql` in MySQL Workbench or using `mysql -u root -p < sql/schema.sql`.
4. **Create least-privilege MySQL user** using `sql/admin-setup.example.sql` with a strong local password.
5. **Configure MySQL** by copying `.env.example` to `.env`; set the database host, user, password, port and database name. Never commit `.env`.
6. **Install and run registration server:** `npm install` and `npm start`. Visit `http://localhost:3000`.
7. **Register at least 11 synthetic sample students** for testing with distinct project codes, or use a separate authorized dataset after consent and security review. Verify `GET /api/stats` shows `analytics_ready: true`.
8. **Create Python virtual environment:** `python -m venv .venv`. Activate using `source .venv/bin/activate` on macOS/Linux or `.venv\\Scripts\\Activate.ps1` in PowerShell.
9. **Install Python packages:** `python -m pip install -r python/requirements.txt`.
10. **Generate graphs:** `python python/analyze.py`.
11. **Find locally generated charts** in `python/output/`, including age histogram, normal reference and regression plots. The folder is gitignored to prevent accidental uploads.
12. **Prepare the final report** with the research question, methods, sample size, charts, descriptive results, model limitations and consent/privacy considerations. Use only synthetic or explicitly cleared aggregated charts for GitHub/other public sharing.

**Why the README uses demonstration charts:** GitHub cannot connect to your running local MySQL service. Publishing real student-derived PNGs straight to a repository could reveal information; replace examples only with ethically approved, privacy-reviewed aggregate visuals.

## Final local setup and test checklist

See [**Final setup instructions**](docs/FINAL-SETUP.md) for Apple Silicon, MySQL user configuration, Node.js tests, local registration, 11-student analytics and Python graphs.

Run `npm test` to execute automated input-validation and analytics-threshold tests. **These are unit tests, not a full MySQL integration test.**

## Project goals

1. Collect a voluntary student demographic registration using a browser form.
2. Validate inputs in an Express API and save rows to a MySQL `students` table.
3. Show a registration count without revealing individual records.
4. Block the analytics endpoint until `COUNT(*) > 10`.
5. Once eligible, compute aggregate counts by gender, education level and country, plus basic age statistics.
6. Develop, review and merge improvements through the 10 work branches.

## Tech stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| UI | HTML, CSS, vanilla JavaScript | Student registration and basic analytics result viewer |
| Backend | Node.js, Express | Registration, status and aggregate analytics endpoints |
| Database | MySQL 8+, `mysql2/promise` | Durable storage, pooled connections and aggregate SQL |
| Configuration | `dotenv` | Local environment settings (never commit secrets) |
| Baseline HTTP protection | `helmet`, `express-rate-limit` | Headers and API rate limiting |
| Version control | Git and GitHub | Branch-based task organization |

## Repository map

```text
.
├── .env.example                  # MySQL and port settings template
├── .gitignore                    # Excludes .env, node_modules, logs
├── package.json                  # Dependencies and npm commands
├── README.md                     # Start here
├── sql/
│   ├── schema.sql                # Creates database and students table
│   └── admin-setup.example.sql   # Example restricted MySQL account
├── src/
│   ├── db.js                     # MySQL connection pool
│   └── server.js                 # Express endpoints and static files
├── public/
│   ├── index.html                # Form and basic analytics UI
│   ├── style.css                 # Styles
│   └── script.js                 # Browser-side fetch requests
└── docs/
    └── BRANCHES.md               # Branch plan
```

## Quick start — run on your computer

### Prerequisites

- Git installed.
- Node.js **20 or newer** and npm.
- MySQL **8 or newer** with administrator access to initialize a database.
- A terminal and browser. You do **not** need to enter your MySQL credentials on GitHub.

### 1. Clone and install

```bash
git clone https://github.com/sureshkhaniya/Data-science-registration.git
cd Data-science-registration
npm install
```

### 2. Create database and table

In MySQL Workbench, open and run `sql/schema.sql`. Alternatively, from a terminal with the MySQL command-line client:

```bash
mysql -u root -p < sql/schema.sql
```

That creates the `student_demographics` database and `students` table. The table includes:

| Column | Description |
| --- | --- |
| `id` | Auto-increment primary key |
| `student_code` | Unique project code; avoid a real student ID |
| `age` | Integer age (13–120 in this starter) |
| `gender` | Female / Male / Non-binary / Prefer not to say / Self-describe |
| `gender_description` | Optional description for self-described gender |
| `city` | Required city |
| `state_region` | Optional state or region |
| `country` | Required country |
| `education_level` | High school / Undergraduate / Graduate / Other |
| `field_of_study` | Optional |
| `registered_at` | Automatic registration timestamp |

Avoid collecting names, emails, dates of birth or government IDs without a real need and proper protections.

### 3. Create the application database account

Review `sql/admin-setup.example.sql`. Replace **CHOOSE_A_STRONG_PASSWORD** locally, not in GitHub. Run that SQL as a MySQL administrator. The sample user is `'student_app'@'localhost'` and has `SELECT` and `INSERT` access only to the project database. If your MySQL server runs on a different host, adjust the MySQL user host and grants appropriately.

### 4. Configure environment variables

Copy `.env.example` to `.env` (which is gitignored), and edit it:

```dotenv
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=student_app
DB_PASSWORD=YOUR_LOCAL_PASSWORD
DB_NAME=student_demographics
```

**Do not put real passwords, `.env`, or a SQL export containing student rows into your repository.** The sample SQL user host may need adjustment if localhost and 127.0.0.1 resolve differently in your setup.

### 5. Launch

```bash
npm start
```

Open **http://localhost:3000**. For development with automatic restart, run `npm run dev`.

### 6. Test the workflow locally

1. Complete the form using **synthetic data**, such as project-only codes `TEST_001` through `TEST_011`.
2. Verify the counter increases after each registration.
3. With 1–10 rows, `GET /api/analytics` must return HTTP **403**.
4. With 11 or more rows, the endpoint must return aggregated statistics.
5. Verify a duplicate `student_code` is rejected and bad inputs return HTTP **400**.
6. In MySQL, verify your test count using `SELECT COUNT(*) FROM student_demographics.students;`.

The starter UI shows the analytics response as formatted JSON. Charts and a polished dashboard are future work in branch 07.

## API reference

### POST `/api/students`

Example:

```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"student_code":"TEST_001","age":21,"gender":"Prefer not to say","city":"Fargo","state_region":"ND","country":"United States","education_level":"Undergraduate","field_of_study":"Computer Science"}'
```

Required JSON fields: `student_code`, `age`, `gender`, `city`, `country`, `education_level`. Optional: `gender_description` (required when gender is `Self-describe`), `state_region`, `field_of_study`. Returns **201** on success, **400** for invalid data and **409** for a duplicate code.

### GET `/api/stats`

Returns `total`, `analytics_ready`, and `required: 11`. This is the count/status endpoint.

### GET `/api/analytics`

Returns **403** until `total > 10`. Afterwards returns `total`, `overview` (`average_age`, `minimum_age`, `maximum_age`), and `groups` (gender, education, country). Categories with fewer than **5** records are omitted from output. **Important:** small-cell suppression by itself is not a full privacy guarantee; age min/max and combinations of aggregates require review before using real data. The endpoint currently has no user authentication.

## 10 branches: specific jobs and definition of done

These branches were created from `main` as separate starting points. **Branch creation does not mean the listed feature work is finished.** Complete the tasks in each branch, test them, then submit a pull request into `main`.

| # | Branch | Work to do | Definition of done |
| --- | --- | --- | --- |
| 1 | `feature/01-database-schema` | Review required fields, SQL types, primary/unique keys, age constraint, indexes; add a repeatable migration method and sample synthetic data script. | A fresh MySQL instance can initialize the schema repeatedly; duplicate code and age constraints are tested. |
| 2 | `feature/02-mysql-connection` | Test `mysql2` pool, DB health reporting, failed-password and DB-down behavior, least-privilege account and config documentation. | App connects using only local environment secrets; clear errors and no password exposure. |
| 3 | `feature/03-registration-api` | Refine `POST /api/students`, validation/status responses, duplicate handling and database queries. | Valid registrations save once; bad/duplicate requests return correct HTTP codes. |
| 4 | `feature/04-registration-ui` | Improve form labels, mobile layout, loading state, field errors, success feedback and clear consent wording. | Usable with keyboard/mobile, registration succeeds and actionable errors display. |
| 5 | `feature/05-input-validation` | Add explicit server-side rules for lengths, enums, required values, age and optional text; add tests and prevent overly permissive truncation. | Automated tests cover valid, empty, invalid, oversized and duplicate data. |
| 6 | `feature/06-analytics-api` | Verify analytics unlocks at 11, SQL aggregates, empty categories, consistent counts and privacy suppression; assess re-identification risk. | Automated 10-vs-11 boundary tests pass; queries return no raw student rows. |
| 7 | `feature/07-dashboard` | Replace raw JSON presentation with charts/cards, privacy-safe labels, loading and locked states. | Dashboard shows clear aggregates only at 11+, remains usable on mobile. |
| 8 | `feature/08-testing` | Introduce test runner and repeatable integration tests with synthetic database fixtures and clean-up instructions. | `npm test` exists and all tests pass on a clean setup. |
| 9 | `feature/09-privacy-security` | Add informed consent, authentication/authorization for analytics, HTTPS deployment rules, retention/deletion policy, audit of small cohorts and threat model. | No unauthenticated sensitive analytics exposure; documented privacy safeguards and security checks. |
| 10 | `feature/10-documentation-deployment` | Document installation, branch workflow, screenshots, troubleshooting, CI and an explicit deployment process for a MySQL-backed Node server. | New developer can run locally from README and CI checks pass before merge. |

### Working on one branch

```bash
git fetch origin
git switch feature/01-database-schema
# make changes for this workstream
git add .
git commit -m "Improve schema constraints and migration notes"
git push -u origin feature/01-database-schema
```

Then open a pull request **from that feature branch to `main`** on GitHub. Review changes, run tests, and merge. Repeat for the next branch. If multiple branches edit the same files, merge and rebase or synchronize them carefully to resolve conflicts.

**Suggested order:** database → DB connection → registration API → validation → UI → analytics API → testing → dashboard → privacy/security → deployment. Security and privacy must be addressed **before** collecting real student data, even if their work branch is numbered 09.

## Known limitations and next improvements

- **No hosted MySQL database or live deployment configured.** GitHub stores source code, not a running MySQL service.
- **No automated tests or CI yet.** The app needs full integration verification on a real MySQL installation.
- **No authentication or consent workflow yet.** Local demo only until these are implemented.
- **Age minimum/maximum and other aggregate outputs require privacy review** before production.
- **Potential duplicate enrollment by using new codes:** a unique code prevents reuse of the same code but does not verify student identity.
- **Race conditions, error handling and security hardening** should be independently tested.
- **Project branches are task workspaces**, not 10 separately completed versions.

## Success checklist

- [ ] MySQL installed and `sql/schema.sql` executed
- [ ] Least-privilege database user configured
- [ ] Local `.env` created and kept out of Git
- [ ] `npm install` and `npm start` succeed
- [ ] Registration inserts synthetic student records
- [ ] Duplicate/invalid submissions rejected
- [ ] Analytics blocked with 10 records
- [ ] Analytics enabled with 11 records
- [ ] All 10 feature branches tested, reviewed and merged as appropriate
- [ ] Authentication, consent, data retention and privacy review completed **before production**

## Troubleshooting

- **`ECONNREFUSED`**: Start MySQL and check `DB_HOST`/`DB_PORT`.
- **`ER_ACCESS_DENIED_ERROR`**: Verify user, password, host matching and privileges.
- **`ER_BAD_DB_ERROR`**: Execute `sql/schema.sql` and confirm `DB_NAME`.
- **Table missing**: Confirm you initialized `student_demographics.students`.
- **Port 3000 in use**: Set another `PORT` in `.env`.
- **Analytics says locked**: Confirm 11 valid rows exist in the same configured database.

## Repository links

- [Code](https://github.com/sureshkhaniya/Data-science-registration)
- [Branches](https://github.com/sureshkhaniya/Data-science-registration/branches)
- [Branch task plan](docs/BRANCHES.md)

**License:** No license file has been added; do not assume reuse permissions.

## Python data science and final visualization

The application now includes a companion **Python analytics script** that connects to the same MySQL database as Node.js. **Node.js** collects student registrations; **MySQL** stores them; **Python** performs offline exploratory analysis and saves graph images. See [Python instructions](python/README.md) and [Python code](python/analyze.py).

### Set up Python

From your cloned repository root after MySQL has been configured and your local `.env` exists:

```bash
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS / Linux: source .venv/bin/activate
python -m pip install -r python/requirements.txt
python python/analyze.py
```

Python uses `pandas`, `numpy`, `matplotlib`, `scipy`, `scikit-learn`, `mysql-connector-python` and `python-dotenv`. It requires **at least 11 student records** and creates files locally in `python/output/` (ignored by Git): `age_histogram.png`, `normal_reference.png`, `linear_regression.png`, and demographic bar charts when enough observations are present.

### Statistical analysis work to complete

| Analysis | Python library | What to produce / explain |
| --- | --- | --- |
| Descriptive statistics | pandas, numpy | Count, mean, standard deviation, education/gender frequencies |
| Normal distribution | scipy, matplotlib | Normal reference curve, age histogram and Shapiro–Wilk normality assessment; distinguish fit from proof |
| Linear regression | scikit-learn | A fitted line, slope, R² and limitations; example uses age versus registration order **for demonstration only**, not as a useful predictor |
| Demographic graphs | pandas, matplotlib | Aggregated bar charts; suppress groups with fewer than 5 students |
| Final presentation | matplotlib plus written report | Explain the research question, collection method, sample size, plots, assumptions, limits and conclusions |

**Scientific caution:** registration order is an arbitrary example feature, not a legitimate causal explanation of student age. A meaningful regression needs an ethically collected numeric predictor and a clearly stated research question. A sample of 11 is not inherently statistically sufficient. The current Python script reads individual ages locally, so restrict analyst access and never publish raw rows or private data.

### Assign Python tasks to existing 10 branches

- `feature/02-mysql-connection`: Verify Python can read the same MySQL database through its own connector.
- `feature/06-analytics-api`: Align aggregate definitions and the >10 restriction between Node.js and Python.
- `feature/07-dashboard`: Build reviewed regression, distribution and demographic visualizations for the final project.
- `feature/08-testing`: Add synthetic-data regression/normality tests and verify graph creation.
- `feature/09-privacy-security`: Review analyst access, small-cell suppression and graph disclosure risks.
- `feature/10-documentation-deployment`: Document Python installation, reproducibility, methods and report results.

The Python files have been added to `main`. Existing feature branches must sync with `main` to receive them.

## Live analytics dashboard (new)

After **11** registrations, open `http://localhost:3000` and click **View Analysis & Graphs**. The website now renders SVG graphs directly in the browser without extra chart packages: age histogram (10-year bands), fitted normal reference, educational linear regression, and demographic bar charts for gender, education and country. The API `/api/analytics` also returns `age_bands`, `overview.standard_deviation` and `regression` fields.

**Local update commands:** `git pull origin main`, then stop the existing Node process with Ctrl+C and run `npm test && npm start`. Refresh the website. The existing 11 registrations in your local MySQL database remain in place; Git pulls do not overwrite local databases.

**Interpretation:** the regression models *age by registration order* solely to demonstrate linear regression. Registration order does not scientifically predict age. The normal curve is a reference, not proof of normality. Groups of fewer than five observations are suppressed in bar charts, but aggregate statistics can still disclose sensitive information; this starter requires additional access controls and privacy review before collecting actual students' details.

## Box plot and histogram update

The live dashboard now includes **an age histogram** (10-year grouped counts) and **an age box plot** showing minimum, Q1, median, Q3 and maximum, calculated from the same saved MySQL registrations. No re-registration is necessary. With small cohorts, the five-number summary could reveal student ages, so use this dashboard only for local synthetic-data demos until privacy controls are implemented.

Update your Mac checkout with `git pull origin main`. Stop the running server with Ctrl+C, then execute `npm test` and `npm start`; refresh `http://localhost:3000` and click **View Analysis & Graphs**. A GitHub commit cannot directly restart the Node.js process on your computer.

## Random Forest machine learning (Python)

A new educational [Random Forest module](docs/RANDOM-FOREST.md) is available at [`python/random_forest_demo.py`](python/random_forest_demo.py). It uses the same MySQL connection and checks the existing registration count; **you do not need to register another 11 students**. At 11–19 registrations it demonstrates Random Forest on clearly labeled synthetic examples, because such a small dataset is unsuitable for meaningful prediction. It generates a feature-importance chart locally.

```bash
python -m pip install -r python/requirements.txt
python python/random_forest_demo.py
```

Random Forest is not added to the public student dashboard: the output is local-only until adequate data, research design, authentication and privacy review exist.
