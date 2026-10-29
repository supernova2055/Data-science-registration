-- Run schema.sql first as a MySQL administrator.
-- Replace placeholder with a unique strong password; NEVER commit real credentials.
CREATE USER IF NOT EXISTS 'student_app'@'localhost' IDENTIFIED BY 'CHOOSE_A_STRONG_PASSWORD';
GRANT SELECT, INSERT ON student_demographics.* TO 'student_app'@'localhost';
