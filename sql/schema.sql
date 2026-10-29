CREATE DATABASE IF NOT EXISTS student_demographics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE student_demographics;

CREATE TABLE IF NOT EXISTS students (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_code VARCHAR(40) NOT NULL,
  age TINYINT UNSIGNED NOT NULL,
  gender ENUM('Female','Male','Non-binary','Prefer not to say','Self-describe') NOT NULL,
  gender_description VARCHAR(100) NULL,
  city VARCHAR(100) NOT NULL,
  state_region VARCHAR(100) NULL,
  country VARCHAR(100) NOT NULL,
  education_level ENUM('High school','Undergraduate','Graduate','Other') NOT NULL,
  field_of_study VARCHAR(100) NULL,
  registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_student_code (student_code),
  INDEX idx_country (country),
  INDEX idx_education (education_level),
  CONSTRAINT chk_age CHECK (age BETWEEN 13 AND 120)
);
