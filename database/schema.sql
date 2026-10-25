-- Run this against your RDS MySQL instance to set up the database.
--
-- Example (from your EC2 box or local machine with the mysql client):
--   mysql -h <RDS_ENDPOINT> -P 3306 -u admin -p < schema.sql

CREATE DATABASE IF NOT EXISTS crud_app;
USE crud_app;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional seed data so the UI isn't empty on first run.
INSERT INTO tasks (title, description, completed) VALUES
  ('Set up EC2 instance', 'Launch an Amazon Linux 2023 t2.micro instance', TRUE),
  ('Create RDS MySQL database', 'Provision a db.t3.micro MySQL instance', FALSE),
  ('Configure GitHub Actions', 'Add CI/CD workflow to auto-deploy on push', FALSE);
