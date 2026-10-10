-- V5__seed_admin_roles.sql - Seed Administrator Roles and Base Permissions

INSERT INTO roles (name, description) VALUES
('ROLE_SUPER_ADMIN', 'Master civic coordinator and system administrator'),
('SUPER_ADMIN', 'Super administrator without role prefix'),
('ROLE_ADMIN', 'Gram Panchayat administrator and desk officer'),
('ADMIN', 'Gram admin without role prefix')
ON CONFLICT (name) DO NOTHING;
