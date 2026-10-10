-- V2__seed_asgaon_data.sql - Asgaon Asgaon Seed Data

-- Roles
INSERT INTO roles (name, description) VALUES
('ROLE_CITIZEN', 'General resident of the village'),
('ROLE_FARMER', 'Registered cultivator with access to Krishi modules'),
('ROLE_STUDENT', 'Youth and scholars with access to Shiksha & scholarships'),
('ROLE_BUSINESS_OWNER', 'Local merchant, vendor, or workshop operator'),
('ROLE_SELLER', 'Community haat and agricultural equipment seller'),
('ROLE_ADMIN', 'Gram Panchayat administrator and desk officer'),
('ROLE_SUPER_ADMIN', 'Master civic coordinator')
ON CONFLICT (name) DO NOTHING;

-- Business Categories
INSERT INTO business_categories (name, slug, icon_name, display_order) VALUES
('Krishi & Agro Stores', 'krishi-agro', 'agriculture', 1),
('Clinics & Pharmacies', 'medical-clinics', 'local_hospital', 2),
('Tractor & Machinery Rental', 'tractor-rental', 'agriculture', 3),
('Dairy & Animal Husbandry', 'dairy-husbandry', 'egg', 4),
('Kirana & General Stores', 'kirana-general', 'storefront', 5),
('Electrical & Solar Tech', 'electrical-solar', 'bolt', 6),
('Building & Hardware', 'hardware-building', 'construction', 7),
('Tailoring & Textiles', 'tailoring-textiles', 'content_cut', 8)
ON CONFLICT (slug) DO NOTHING;

-- Featured Businesses (as featured in the UI mockup)
INSERT INTO businesses (name, slug, category_id, description, address, landmark, phone, whatsapp, opening_hours, image_url, is_verified, verification_badge) VALUES
('Shivaji Krishi Seva Kendra', 'shivaji-krishi-seva-kendra', 1, 'Government licensed seed distributor, Mahabeej certified fertilizer & pesticide depot.', 'Shop 4, Market Yard Road, Asgaon', '0.4 km from Main Chowk', '9822104500', '9822104500', '7:00 AM - 8:30 PM (All 7 Days)', 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=600&q=80', true, 'Verified Merchant'),

('Mauli Clinic & Day Care', 'mauli-clinic-day-care', 2, 'Dr. Snehal M. Zalke  (MBBS, DCH) - Pediatric, emergency OPD, and subsidized generic pharmacy.', 'Near ZP Primary School, Ward 2, Asgaon', 'Near ZP Primary School', '9422001102', '9422001102', '10:00 AM to 2:00 PM & 5:00 PM to 9:00 PM', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80', true, '24/7 On-Call'),

('Gurukrupa Tractor Hire & Implements', 'gurukrupa-tractor-hire', 3, 'Mahindra 575 DI, John Deere harvesters, rotavators, laser levellers with skilled drivers.', 'Highway Bypass Road, Plot 12, Asgaon', 'Highway Bypass Road', '9765432100', '9765432100', '6:00 AM - 9:00 PM', 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80', true, 'Verified Merchant'),

('Shree Ganesh Dairy & Sweets', 'shree-ganesh-dairy', 4, 'Pure Gir Cow A2 Ghee, fresh paneer, morning buffalo milk, shrikhand & buttermilk.', 'Shivapur Talav Road, Asgaon', 'Shivapur Talav Road', '9158765432', '9158765432', '6:00 AM - 1:00 PM & 4:30 PM - 9:00 PM', 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80', true, 'FSSAI Certified')
ON CONFLICT (slug) DO NOTHING;

-- Jobs
INSERT INTO jobs (title, slug, employer_name, employment_type, salary_range, location, description, requirements, contact_phone, status, expires_at) VALUES
('Harvester & Tractor Driver', 'harvester-tractor-driver-patil-agro', 'Patil Agro Farms - Khed Shivapur South', 'Daily Wage', '₹850 / Day', 'Asgaon (South Fields)', 'Urgent need heavy tractor driver with minimum 1-year experience harvesting sugarcane & paddy. Free food and tea provided on site.', 'Valid commercial driving license, ability to operate rotary tiller.', '9822104500', 'ACTIVE', CURRENT_DATE + INTERVAL '14 days'),

('Pharmacy Billing Assistant', 'pharmacy-billing-assistant-bhavani', 'Bhavani Medical & General Stores', 'Full-Time Staff', '₹14,000 / Mo', 'Asgaon Main Market', '12th pass minimum. Basic computer knowledge & Marathi reading required. Dispensing assistance & inventory records. Suitable for village youth.', '12th standard pass, basic English & computer typing.', '9422001102', 'ACTIVE', CURRENT_DATE + INTERVAL '30 days'),

('Solar Pump Installation Technician', 'solar-pump-tech-kisan-urja', 'Kisan Urja Solar Infrastructure (ZP Contractor)', 'Contract / Technical', '₹18,000 / Mo', 'Asgaon & Surrounding Wards', 'ITI Electrical or Wireman certified. 1 year preferred. Immediate rollout of MNRE/KUSUM solar agricultural pump sets across Haveli taluka.', 'ITI Wireman / Electrician certificate, two-wheeler required.', '9765432100', 'ACTIVE', CURRENT_DATE + INTERVAL '21 days')
ON CONFLICT (slug) DO NOTHING;

-- Government Schemes
INSERT INTO schemes (title, slug, category, sponsoring_agency, deadline_text, description, benefits, eligibility, documents_required, official_url, action_label) VALUES
('PM-Kisan 17th Installment Direct Benefit', 'pm-kisan-17th-installment', 'Farmer', 'Ministry of Agriculture & Farmers Welfare, Govt of India', 'e-KYC Deadline: 31 Oct', 'Direct DBT release of ₹2,000 to eligible farmer bank accounts. Mandatory biometric / Aadhaar OTP verification.', '₹6,000 annual income support in 3 equal installments credited directly into bank account.', 'Small and marginal landholding farmer families with cultivable land in their name.', 'Aadhaar Card, Updated 7/12 & 8A Land Record, NPCI Active Bank Account Passbook.', 'https://pmkisan.gov.in', 'Check Status on Portal'),

('MahaDBT Post-Matric Scholarship', 'mahadbt-post-matric-scholarship', 'Student', 'Social Justice & Special Assistance Dept, Govt of Maharashtra', 'Apply Before: 15 Oct', 'Tuition fee reimbursement and hostel maintenance allowance for SC/ST/OBC/SEBC students enrolled in Junior College and ITI/Degree courses.', '100% tuition waiver for eligible government seats + monthly living allowance.', 'Domicile of Maharashtra, family annual income under ₹2.5 Lakhs (or ₹8 Lakhs for OBC non-creamy).', 'Tehsildar Income Certificate, Caste Certificate & Validity, College Allotment Letter, Ration Card.', 'https://mahadbt.maharashtra.gov.in', 'MahaDBT Portal'),

('Kusum-B 90% Govt Subsidy Solar Agri Pump', 'kusum-b-solar-agri-pump', 'Solar', 'MahaVitaran (MSEDCL) & MEDA', 'Phase 3 Enrolment Active', 'Off-grid solar irrigation pump (3 HP, 5 HP, 7.5 HP) for farmers without conventional farm electricity connections. Daytime water access guaranteed.', '90% capital cost covered by Central + State subsidy. Farmer contributes only 10%.', 'Valid farm land holding, confirmed well or borewell water source, no existing electrical grid pump.', 'Well / Borewell Water Source Proof, Aadhaar Card, 7/12 Land Record, Cancelled Cheque.', 'https://www.mahadiscom.in/solar-kusum-b', 'Apply Solar Pump')
ON CONFLICT (slug) DO NOTHING;

-- Mandi Prices (Live APMC)
INSERT INTO mandi_prices (commodity_name, variety, market_name, min_price, max_price, modal_price, unit, price_change, price_date) VALUES
('Soybean (सोयाबीन)', 'Standard Yellow', 'Haveli - Pune APMC', 4750.00, 4890.00, 4820.00, 'Quintal', 45.00, CURRENT_DATE),
('Red Onion (लाल कांदा)', 'Superior Quality', 'Haveli - Pune APMC', 2400.00, 2950.00, 2850.00, 'Quintal', -80.00, CURRENT_DATE),
('Cotton (कापूस)', 'लांब धागा - Medium', 'Baramati Sub-Market', 7200.00, 7550.00, 7400.00, 'Quintal', 0.00, CURRENT_DATE),
('Cow Milk (गाय दूध)', 'A2 Gir, 4% Fat', 'Asgaon Dairy Union', 40.00, 42.00, 41.50, 'Litre', 1.50, CURRENT_DATE);

-- Public Grievances
INSERT INTO complaints (tracking_number, category, title, description, ward_or_area, contact_phone, status, resolution_note, resolved_at) VALUES
('KS-6181', 'Street Light / Electrical Breakdown', 'Streetlight Fault Repair at Ward No. 3', 'LED transformer line short occurred near Vitthal Mandir Chowk. Lineman Ashok Kamble verified and restored operation at 8:30 PM yesterday.', 'Ward No. 3 (Vitthal Mandir)', '9822100000', 'RESOLVED', 'New transformer fuse replaced; light fully functional.', CURRENT_TIMESTAMP - INTERVAL '1 day'),

('KS-4920', 'Drinking Water / Pipeline Leakage', 'Drinking Water Pipeline Leak at Gaothan', 'Main 4-inch PVC supply pipe burst near Old Well East Water Storage Tank. Excavation completed; valve replacement scheduled for 3 PM today.', 'Ward No. 4 (Gaothan)', '9822200000', 'IN_PROGRESS', 'Excavation completed, technician team on site.', NULL),

('KS-9102', 'Garbage Collection & Cleanliness', 'Weekly Bazaar Ground Waste Clearance', 'Solid waste clearing and bleaching powder sanitation carried out post-Sunday Weekly Bazaar. Tractor-trolley disposal rerouted to vermicompost pit.', 'Ward No. 1 (Bazaar Maidan)', '9822300000', 'RESOLVED', 'Disposal complete and certified by Gram Sevak.', CURRENT_TIMESTAMP - INTERVAL '2 days')
ON CONFLICT (tracking_number) DO NOTHING;

-- Official Announcement / Gazettes
INSERT INTO announcements (title, slug, category, priority, message, author_name, is_active) VALUES
('Canal Irrigation Water Release & Free Pulse Polio Camp', 'canal-irrigation-water-release-polio-camp', 'Emergency Alert', 'URGENT', 'Canal Irrigation Water Release scheduled for South Block on Thursday, 8:00 AM • Free Pulse Polio & General Health Camp at ZP High School this Saturday (9 AM - 4 PM)', 'Gram Sevak Office & Talathi', true)
ON CONFLICT (slug) DO NOTHING;
