-- V8__add_business_coordinates.sql
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7) DEFAULT 20.7850000;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7) DEFAULT 79.6350000;

-- Update known Asgaon businesses with coordinates
UPDATE businesses SET latitude = 20.7858, longitude = 79.6346 WHERE slug = 'shivaji-krishi-seva-kendra';
UPDATE businesses SET latitude = 20.7842, longitude = 79.6355 WHERE slug = 'mauli-clinic-day-care';
UPDATE businesses SET latitude = 20.7865, longitude = 79.6338 WHERE slug = 'gurukrupa-tractor-hire';
UPDATE businesses SET latitude = 20.7849, longitude = 79.6362 WHERE slug = 'shree-ganesh-dairy';
UPDATE businesses SET latitude = 20.7852, longitude = 79.6351 WHERE slug = 'sai-samarth-maha-e-seva';
UPDATE businesses SET latitude = 20.7871, longitude = 79.6330 WHERE slug = 'gajanan-hardware-cement-depot';
UPDATE businesses SET latitude = 20.7845, longitude = 79.6358 WHERE slug = 'balaji-kirana-daily-needs';
UPDATE businesses SET latitude = 20.7860, longitude = 79.6340 WHERE slug = 'jai-malhar-agro-electricals';
