# Final setup and testing checklist (macOS Apple Silicon / WSL)

**Never publish or share the local .env password.** If a password appears in a screenshot, change it in MySQL and update the local .env.

## Requirements
- Node.js 20+ with npm: `node --version && npm --version`
- MySQL 8+: `mysql --version`. The MySQL server must be running.
- Python 3.10+ for optional offline graphs.
- Run commands from the folder containing `package.json`.

## Initialize MySQL
1. Check the server: `/usr/local/mysql/bin/mysql -h 127.0.0.1 -u root -p` for official macOS installations; other installations may use `mysql`.
2. Run `sql/schema.sql` using MySQL Workbench or:
   `/usr/local/mysql/bin/mysql -h 127.0.0.1 -u root -p < sql/schema.sql`
3. Create a dedicated user in MySQL as administrator (replace the placeholder with a **new secret**):
```sql
CREATE USER IF NOT EXISTS 'student_app'@'localhost' IDENTIFIED BY 'REPLACE_WITH_NEW_SECRET';
ALTER USER 'student_app'@'localhost' IDENTIFIED BY 'REPLACE_WITH_NEW_SECRET';
GRANT SELECT, INSERT ON student_demographics.* TO 'student_app'@'localhost';
```
4. Test the restricted account over TCP; MySQL account host matching can depend on local setup:
   `/usr/local/mysql/bin/mysql -h 127.0.0.1 -u student_app -p student_demographics`

## Node.js setup
```bash
cp .env.example .env
# Edit .env locally: DB_HOST=127.0.0.1, DB_PORT=3306, DB_USER=student_app, DB_PASSWORD=<new secret>, DB_NAME=student_demographics
npm install
npm test
npm start
```
Open http://localhost:3000. Note: the server can start without a working DB; verify `/api/stats` returns JSON successfully.

## Verify end-to-end with synthetic data only
- Submit registrations with unique codes `TEST_001` through `TEST_011`.
- Verify 10 registrations yield 403 at `/api/analytics`, and 11 yield aggregate JSON.
- Duplicate student code should yield 409 and invalid input 400.
- `/api/stats` should report the current count.
- Do not test with real student records until access controls, consent and privacy review are in place.

## Python analysis
```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r python/requirements.txt
python python/analyze.py
```
Output PNGs appear in `python/output/` locally. The regression against registration order is an educational illustration, not a meaningful predictive model. With only 11 students, normality and regression inference are not automatically reliable.

## Team collaboration
```bash
git fetch origin
git switch feature/07-dashboard
git merge --ff-only origin/main
# Make changes, test, commit, push and open a PR into main.
```

## Deployment readiness
Not yet production-ready: authentication, consent, privacy retention controls, HTTPS, managed DB, backups, and deployment testing are still required. GitHub does not host MySQL by itself.
