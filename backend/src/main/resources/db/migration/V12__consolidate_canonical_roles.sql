-- V12__consolidate_canonical_roles.sql
-- Consolidate roles table to 3 canonical Spring Security roles:
-- 1. ROLE_CITIZEN
-- 2. ROLE_ADMIN
-- 3. ROLE_SUPER_ADMIN
-- Remove redundant unprefixed duplicate rows (CITIZEN, ADMIN, SUPER_ADMIN)

-- 1. Ensure canonical roles exist
INSERT INTO roles (name, description) VALUES
('ROLE_CITIZEN', 'Universal resident citizen role with public service access'),
('ROLE_ADMIN', 'Gram Panchayat departmental administrator and desk officer'),
('ROLE_SUPER_ADMIN', 'Master civic coordinator and system super administrator')
ON CONFLICT (name) DO NOTHING;

-- 2. Remap users mapped to unprefixed 'CITIZEN' to 'ROLE_CITIZEN'
WITH target_role AS (SELECT id FROM roles WHERE name = 'ROLE_CITIZEN' LIMIT 1),
     source_role AS (SELECT id FROM roles WHERE name = 'CITIZEN')
UPDATE user_roles
SET role_id = (SELECT id FROM target_role)
WHERE role_id IN (SELECT id FROM source_role);

-- 3. Remap users mapped to unprefixed 'ADMIN' to 'ROLE_ADMIN'
WITH target_role AS (SELECT id FROM roles WHERE name = 'ROLE_ADMIN' LIMIT 1),
     source_role AS (SELECT id FROM roles WHERE name = 'ADMIN')
UPDATE user_roles
SET role_id = (SELECT id FROM target_role)
WHERE role_id IN (SELECT id FROM source_role);

-- 4. Remap users mapped to unprefixed 'SUPER_ADMIN' to 'ROLE_SUPER_ADMIN'
WITH target_role AS (SELECT id FROM roles WHERE name = 'ROLE_SUPER_ADMIN' LIMIT 1),
     source_role AS (SELECT id FROM roles WHERE name = 'SUPER_ADMIN')
UPDATE user_roles
SET role_id = (SELECT id FROM target_role)
WHERE role_id IN (SELECT id FROM source_role);

-- 5. Remap any remaining legacy roles to 'ROLE_CITIZEN'
WITH target_role AS (SELECT id FROM roles WHERE name = 'ROLE_CITIZEN' LIMIT 1),
     legacy_roles AS (SELECT id FROM roles WHERE name IN ('ROLE_FARMER', 'FARMER', 'ROLE_STUDENT', 'STUDENT', 'ROLE_BUSINESS_OWNER', 'BUSINESS_OWNER', 'ROLE_SELLER', 'SELLER'))
UPDATE user_roles
SET role_id = (SELECT id FROM target_role)
WHERE role_id IN (SELECT id FROM legacy_roles);

-- 6. Remove duplicate user_roles pairs caused by the remapping
DELETE FROM user_roles a USING user_roles b
WHERE a.ctid < b.ctid AND a.user_id = b.user_id AND a.role_id = b.role_id;

-- 7. Delete obsolete and duplicate role records from the roles table
DELETE FROM roles
WHERE name IN (
    'CITIZEN',
    'ADMIN',
    'SUPER_ADMIN',
    'ROLE_FARMER',
    'FARMER',
    'ROLE_STUDENT',
    'STUDENT',
    'ROLE_BUSINESS_OWNER',
    'BUSINESS_OWNER',
    'ROLE_SELLER',
    'SELLER'
);
