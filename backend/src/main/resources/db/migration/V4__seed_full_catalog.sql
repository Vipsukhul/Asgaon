-- V4__seed_full_catalog.sql - Asgaon Complete Real Database Seed

-- 1. Businesses Catalog
INSERT INTO businesses (name, slug, category_id, description, address, landmark, phone, whatsapp, opening_hours, image_url, is_verified, verification_badge, rating, rating_count) VALUES
('Sai Samarth Maha-e-Seva Kendra & CSC Village Kiosk', 'sai-samarth-maha-e-seva', 5, 'CSC ID: MH-2019-9182. 7/12 Land Records, Aadhaar Card updates, Pan Card, e-KYC, Caste & Income Certificates.', 'Near Gram Panchayat Office, Gaothan', 'Panchayat Chowk', '9822998877', '9822998877', '8:00 AM - 8:00 PM', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80', true, 'Authorized CSC', 4.8, 210),

('Gajanan Hardware & Cement Depot', 'gajanan-hardware-cement-depot', 7, 'UltraTech & ACC cement dealer, PVC pipelines, Supreme drip fittings, steel bars, TMT rebars, and paints.', 'Asgaon-Pauni Main Road, Ward 3', 'Pauni Road Corner', '9822445566', '9822445566', '7:30 AM - 8:30 PM', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80', true, 'Verified Merchant', 4.7, 88),

('Balaji Kirana & Daily Needs', 'balaji-kirana-daily-needs', 5, 'Daily fresh groceries, ration, cold-pressed cooking oil, local spices, grains, and household essentials.', 'Gaothan Central Chowk, Asgaon', 'Central Chowk', '9822332211', '9822332211', '6:30 AM - 10:00 PM', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80', true, 'Verified Merchant', 4.9, 154),

('Jai Malhar Agro Electricals & Motor Rewinding', 'jai-malhar-agro-electricals', 6, 'Submersible farm pump repair, motor winding, copper coils, solar invertors, capacitor banks, and starter boxes.', 'Near Electric Substation, Bypass Road', 'Bypass Substation', '9822776655', '9822776655', '8:00 AM - 8:00 PM', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', true, 'Certified Technician', 4.8, 92)
ON CONFLICT (slug) DO NOTHING;

-- 2. Jobs Catalog
INSERT INTO jobs (title, slug, employer_name, employment_type, salary_range, location, description, requirements, contact_phone, status, expires_at) VALUES
('Organic Farm Supervisor & Drip Operator', 'organic-farm-supervisor-sahyadri', 'Sahyadri Agro Orchards & Pomegranate Farm', 'Full-Time Staff', '₹15,000 / Mo', 'Asgaon South Fields', 'Minimum 2+ years experience in perennial drip lines, sand filter backwashing, and organic fertigation for 12-acre pomegranate plantation. Free farm quarters.', 'B.Sc. Agriculture or 3+ Yrs Exp in drip irrigation', '9822104500', 'ACTIVE', CURRENT_DATE + INTERVAL '28 days'),

('Primary English & Math Tuition Teacher', 'tuition-teacher-dnyanpeeth', 'Dnyanpeeth Coaching & ZP Study Center', 'Contract / Technical', '₹8,000 / Mo', 'Ward 2, Next to Hanuman Mandir', 'Daily 3.5 hours evening tuition (3:30 PM to 7:00 PM). Teaching village children foundational literacy and numeracy. Ideal for educated youth & women.', 'D.Ed, B.Ed, or graduate degree holder', '9822000000', 'ACTIVE', CURRENT_DATE + INTERVAL '25 days'),

('Water Pipeline Maintenance Workman', 'pipeline-workman-gram-panchayat', 'Asgaon Gram Panchayat Civil Works Committee', 'Daily Wage', '₹650 / Day', 'Asgaon Gaothan Ward 4', 'Physical labor involving trench digging, PVC pipeline joining, valve servicing, and sewer leakage repair in Gaothan area. Village Job Card holders given priority.', 'Physical fitness, experience in trenching/PVC pipe joining', '9822104500', 'ACTIVE', CURRENT_DATE + INTERVAL '15 days')
ON CONFLICT (slug) DO NOTHING;

-- 3. Government Schemes
INSERT INTO schemes (title, slug, category, sponsoring_agency, deadline_text, description, benefits, eligibility, documents_required, official_url, action_label) VALUES
('Magel Tyala Shettale (मागेल त्याला शेततळे)', 'magel-tyala-shettale', 'Farmer', 'Department of Agriculture, Govt of Maharashtra', 'Open all year round', 'Permanent farm pond construction subsidy to ensure protective irrigation during dry spells. Direct DBT subsidy release after GPS verification of pond excavation.', 'Financial subsidy up to ₹50,000 transferred directly to bank account upon excavation verification.', 'Farmer must possess minimum 0.60 Hectare cultivable land in 7/12 extract and confirmed pond feasibility site.', '7/12 & 8A Land Extract, Caste Certificate (if SC/ST), Bank Passbook, Self-Declaration Form.', 'https://mahadbt.maharashtra.gov.in', 'Apply on MahaDBT'),

('Pradhan Mantri Awas Yojana - Gramin (PMAY-G)', 'pmay-gramin-housing', 'Rural Housing', 'Ministry of Rural Development & Zilla Parishad', 'Gram Sabha Phase 4 Active', 'Pukka house construction financial grant for houseless families and families living in kutcha/dilapidated homes in rural village areas.', 'Direct financial grant of ₹1,20,000 in 3 installments + 90 days MGNREGA unskilled labor wages (₹25,000) + ₹12,000 toilet incentive.', 'Families listed in SECC-2011 permanent waitlist without permanent pukka house anywhere in India.', 'Aadhaar Card, SECC Verification Certificate, Job Card, Bank Account linked with Aadhaar.', 'https://pmayg.nic.in', 'Check Beneficiary List'),

('Umed — Maharashtra Rural Livelihoods Mission (MSRLM)', 'umed-msrlm-shg-fund', 'Women', 'Rural Development Dept, Govt of Maharashtra', 'Continuous Enrolment', 'Community Investment Fund and revolving credit linkage for Mahila Bachat Gat (SHGs) to establish micro-enterprises like dairy, poultry, and village tailoring.', '₹15,000 Revolving Fund + ₹1,10,000 Community Investment Fund at subsidized 3-4% interest + bank credit up to ₹10 Lakhs.', 'Formed Mahila Bachat Gat adhering to Panchasutra principles for minimum 6 months.', 'SHG Joint Bank Passbook, Aadhaar Cards of all members, Resolution Minutes Book.', 'https://umed.maharashtra.gov.in', 'Register SHG Group')
ON CONFLICT (slug) DO NOTHING;

-- 4. Marketplace Listings
INSERT INTO marketplace_listings (title, category, price, seller_name, contact_phone, village_location, description, image_url, status) VALUES
('Submersible Pump 5HP & Starter Box', 'machinery', '₹16,500', 'Sambhaji Waghmare', '9422001102', 'Pauni Naka (0.8 km)', '10-stage water submersible pump with complete automatic control panel box. Rewound copper coils, tested high flow rate.', 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f6?auto=format&fit=crop&w=600&q=80', 'ACTIVE'),

('Solar Inverter + 150Ah Tubular Battery', 'household', '₹18,000', 'Balkrushna Gore', '9822338877', 'Pauni Gate (1.2 km)', 'Luminous 1100VA Pure Sine Wave Inverter paired with 150Ah Tall Tubular Battery. 1.5 years remaining on warranty. Excellent backup.', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80', 'ACTIVE'),

('Usha Sewing Tailoring Machine with Table Stand', 'household', '₹4,200', 'Seema Tai Deshmukh', '9766554433', 'Shanti Chawl (0.6 km)', 'Domestic tailoring machine with smooth foot pedal stand and wooden table. Regularly oiled, running flawlessly. 5 stitching accessories included.', 'https://images.unsplash.com/photo-1528458876885-5b6feed420f8?auto=format&fit=crop&w=600&q=80', 'ACTIVE');

-- 5. Village Events
INSERT INTO village_events (title, category, event_date, event_time, location, organizer, badge, description, image_url) VALUES
('Asgaon Budhwar Haat (Weekly Village Bazaar)', 'agriculture', 'Every Friday Recurring', '06:00 AM — 02:00 PM', 'Bazaar Maidan, Ward 1, Asgaon', 'Gram Panchayat Bazaar Committee', 'Weekly Farmers Market', 'Traditional weekly village market where over 60 local farmers and sellers gather to sell fresh vegetables, fruits, dairy, and farm implements.', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80'),

('Gram Sabha Bi-Annual Development & Tax Review', 'religious', 'Sunday, 24 Nov 2024', '10:00 AM — 01:30 PM', 'Gram Panchayat Community Hall, Asgaon', 'Sarpanch & Gram Sevak Office', 'Official Gram Sabha', 'Statutory village assembly to approve village development budget, water pipeline works, and MGNREGA annual master plan.', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80');

-- 6. Official Announcements
INSERT INTO announcements (title, slug, category, priority, message, author_name, is_active) VALUES
('Gram Sabha Bi-Annual General Meeting on Sunday 24 Nov', 'gram-sabha-bi-annual-meeting-nov', 'Resolution', 'HIGH', 'Notice is hereby given that the general Gram Sabha will convene at the Samaj Mandir Community Hall this Sunday at 10:00 AM. Agenda: Pipeline repair sanction, Streetlight tender, and MGNREGA muster approval.', 'Gram Sevak & Sarpanch', true),

('Tender Notice: Concrete Road Paving in Gaothan Ward 2', 'tender-notice-concrete-road-ward-2', 'Tenders', 'NORMAL', 'Gram Panchayat invites competitive sealed bids from registered civil contractors for cement concrete paving and side storm drain construction along Ward 2 main stretch. Tender forms available at GP office.', 'Gram Panchayat Civil Works Desk', true),

('Pulse Polio & Maternal Health Special Camp this Saturday', 'pulse-polio-maternal-health-camp', 'Health', 'URGENT', 'Free Pulse Polio Immunization for all children under 5 years, along with Hb hemoglobin screening and calcium/iron supplements for pregnant women at ZP Primary Health Sub-Center.', 'Medical Officer, PHC Pauni', true)
ON CONFLICT (slug) DO NOTHING;
