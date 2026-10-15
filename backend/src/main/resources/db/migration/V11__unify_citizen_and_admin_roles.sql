-- V11__unify_citizen_and_admin_roles.sql
-- Unify Citizen Role Architecture & Establish Clean Admin/Super Admin Hierarchy

-- 1. Add occupation column to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS occupation VARCHAR(100) DEFAULT 'Citizen / Resident';

-- 2. Ensure canonical 3-tier roles exist
INSERT INTO roles (name, description) VALUES
('ROLE_CITIZEN', 'Universal resident citizen role with access to public services'),
('CITIZEN', 'Universal resident citizen role without prefix'),
('ROLE_ADMIN', 'Gram Panchayat departmental administrator and desk officer'),
('ADMIN', 'Gram Panchayat administrator without prefix'),
('ROLE_SUPER_ADMIN', 'Master civic coordinator and system super administrator'),
('SUPER_ADMIN', 'Master civic coordinator without prefix')
ON CONFLICT (name) DO NOTHING;

-- 3. Populate occupation for users based on legacy roles before remapping
UPDATE users u
SET occupation = 'Farmer / Cultivator'
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
WHERE u.id = ur.user_id AND r.name IN ('ROLE_FARMER', 'FARMER') AND (u.occupation IS NULL OR u.occupation = 'Citizen / Resident');

UPDATE users u
SET occupation = 'Student / Scholar'
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
WHERE u.id = ur.user_id AND r.name IN ('ROLE_STUDENT', 'STUDENT') AND (u.occupation IS NULL OR u.occupation = 'Citizen / Resident');

UPDATE users u
SET occupation = 'Local Merchant / Business'
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
WHERE u.id = ur.user_id AND r.name IN ('ROLE_BUSINESS_OWNER', 'BUSINESS_OWNER') AND (u.occupation IS NULL OR u.occupation = 'Citizen / Resident');

UPDATE users u
SET occupation = 'Seller / Vendor'
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
WHERE u.id = ur.user_id AND r.name IN ('ROLE_SELLER', 'SELLER') AND (u.occupation IS NULL OR u.occupation = 'Citizen / Resident');

-- 4. Remap all legacy non-admin roles in user_roles to ROLE_CITIZEN
WITH citizen_role AS (
    SELECT id FROM roles WHERE name = 'ROLE_CITIZEN' LIMIT 1
)
UPDATE user_roles ur
SET role_id = (SELECT id FROM citizen_role)
FROM roles r
WHERE ur.role_id = r.id 
  AND r.name IN ('ROLE_FARMER', 'FARMER', 'ROLE_STUDENT', 'STUDENT', 'ROLE_BUSINESS_OWNER', 'BUSINESS_OWNER', 'ROLE_SELLER', 'SELLER');

-- Delete duplicate user_roles mappings that might have been created by the update
DELETE FROM user_roles a USING user_roles b
WHERE a.ctid < b.ctid AND a.user_id = b.user_id AND a.role_id = b.role_id;

-- 5. Delete legacy obsolete roles from roles table
DELETE FROM roles 
WHERE name IN ('ROLE_FARMER', 'FARMER', 'ROLE_STUDENT', 'STUDENT', 'ROLE_BUSINESS_OWNER', 'BUSINESS_OWNER', 'ROLE_SELLER', 'SELLER');

-- 6. Ensure default Super Admin account exists in users table
INSERT INTO users (id, full_name, phone, email, password_hash, village_name, ward_number, preferred_language, is_verified, is_active, occupation)
VALUES (
    gen_random_uuid(),
    'Chief Super Admin (मुख्य प्रशासक)',
    '9999999999',
    'superadmin@asgaon.in',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/kRz8UaLq9s6lZk8F0L0Nl5K0XgKe',
    'Asgaon',
    'Gram Sachivalaya',
    'mr',
    true,
    true,
    'Chief Super Administrator'
)
ON CONFLICT (phone) DO UPDATE 
SET full_name = EXCLUDED.full_name,
    occupation = EXCLUDED.occupation;

-- Link Super Admin role to 9999999999
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.phone = '9999999999' AND r.name = 'ROLE_SUPER_ADMIN'
ON CONFLICT DO NOTHING;

-- 7. Ensure default Gram Sevak Admin account exists in users table
INSERT INTO users (id, full_name, phone, email, password_hash, village_name, ward_number, preferred_language, is_verified, is_active, occupation)
VALUES (
    gen_random_uuid(),
    'ग्रामसेवक एस. एन. जाधव',
    '9604331589',
    'gramsevak@asgaon.gov.in',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/kRz8UaLq9s6lZk8F0L0Nl5K0XgKe',
    'Asgaon',
    'Ward 2 (Gaothan)',
    'mr',
    true,
    true,
    'Gram Panchayat Administrator'
)
ON CONFLICT (phone) DO UPDATE 
SET full_name = EXCLUDED.full_name,
    occupation = EXCLUDED.occupation;

-- Link Admin role to 9604331589
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.phone = '9604331589' AND r.name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;
