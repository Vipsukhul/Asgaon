-- V14__add_user_allowed_modules.sql
-- Add allowed_modules column to users table for dynamic admin page access control

ALTER TABLE users ADD COLUMN IF NOT EXISTS allowed_modules TEXT;

-- Give default full access to Super Admin
UPDATE users 
SET allowed_modules = 'overview,admin_management,users,transparency,logs,complaints,businesses,reviews,water,schemes,shiksha,transport,contacts,projects,broadcast,notices,events,blogs,gallery,banners'
WHERE phone = '7507732821';

-- Set standard default permissions for existing Gram Sevak admin
UPDATE users 
SET allowed_modules = 'overview,reviews,notices,water,schemes,complaints,contacts,projects,broadcast'
WHERE phone IN ('9822104500', '9604331589') AND allowed_modules IS NULL;
