-- Migration V10: Remove sponsoring_agency and deadline_text from schemes table
ALTER TABLE schemes DROP COLUMN IF EXISTS sponsoring_agency;
ALTER TABLE schemes DROP COLUMN IF EXISTS deadline_text;
