-- Create SyncFlow Database
-- Run this with: psql -U postgres -f create-db.sql

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE syncflow'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'syncflow')\gexec

-- Connect to the new database
\c syncflow

-- Display success message
SELECT 'Database syncflow created successfully!' AS message;

