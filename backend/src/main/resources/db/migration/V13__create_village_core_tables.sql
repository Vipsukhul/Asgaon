-- V13__create_village_core_tables.sql
-- Complete schema and seed data for Education, Transport, Gallery, Banners, Water Schedule, Village Contacts, and Citizen Reviews

-- 1. Schools & Educational Institutes
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(250) NOT NULL,
    badge VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    grades VARCHAR(100),
    medium VARCHAR(100),
    description TEXT,
    tags TEXT,
    principal_name VARCHAR(150),
    contact_phone VARCHAR(50),
    address VARCHAR(300),
    image_url VARCHAR(500),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Scholarships
CREATE TABLE IF NOT EXISTS scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(250) NOT NULL,
    badge VARCHAR(150),
    deadline VARCHAR(100),
    description TEXT,
    benefit VARCHAR(250),
    income_limit VARCHAR(100),
    department VARCHAR(200),
    official_url VARCHAR(500),
    eligibility TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Study Centers & Tutors (Abhyasika & Coaching)
CREATE TABLE IF NOT EXISTS study_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(250) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'LIBRARY' or 'TUTOR'
    category VARCHAR(100),
    subjects TEXT,
    timing VARCHAR(150),
    phone VARCHAR(50),
    address VARCHAR(300),
    fees_info VARCHAR(150),
    total_desks INT DEFAULT 40,
    available_desks INT DEFAULT 15,
    wifi_speed VARCHAR(100),
    book_count VARCHAR(100),
    caretaker_name VARCHAR(150),
    caretaker_role VARCHAR(150),
    notice_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Transport Bus Schedules
CREATE TABLE IF NOT EXISTS transport_buses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_number VARCHAR(50),
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    source_marathi VARCHAR(100),
    destination_marathi VARCHAR(100),
    via TEXT,
    via_marathi TEXT,
    departure_time VARCHAR(50) NOT NULL,
    departure_time_24 VARCHAR(20),
    approx_arrival_time VARCHAR(50),
    duration_minutes INT DEFAULT 30,
    bus_type VARCHAR(50) DEFAULT 'Lalpari',
    bus_type_marathi VARCHAR(50),
    depot VARCHAR(100),
    depot_marathi VARCHAR(100),
    fare_general INT DEFAULT 20,
    fare_mahila INT DEFAULT 10,
    fare_senior INT DEFAULT 0,
    frequency VARCHAR(100) DEFAULT 'Daily',
    frequency_marathi VARCHAR(100),
    boarding_point_at_asgaon VARCHAR(150),
    boarding_point_marathi VARCHAR(150),
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Auto Drivers & Stands
CREATE TABLE IF NOT EXISTS auto_drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    name_marathi VARCHAR(150),
    vehicle_number VARCHAR(50),
    vehicle_type VARCHAR(100),
    phone VARCHAR(50) NOT NULL,
    stand_location VARCHAR(200),
    stand_location_marathi VARCHAR(200),
    primary_route VARCHAR(200),
    primary_route_marathi VARCHAR(200),
    estimated_fare VARCHAR(100),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Depot Contacts
CREATE TABLE IF NOT EXISTS depot_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    depot_name VARCHAR(150) NOT NULL,
    depot_name_marathi VARCHAR(150),
    phone VARCHAR(50) NOT NULL,
    controller_desk VARCHAR(50),
    address VARCHAR(300),
    address_marathi VARCHAR(300),
    distance_from_asgaon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Hero Banners (Homepage Carousel)
CREATE TABLE IF NOT EXISTS hero_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slide_type VARCHAR(50) DEFAULT 'custom',
    image_url VARCHAR(500),
    show_text_overlay BOOLEAN DEFAULT true,
    badge_marathi VARCHAR(150),
    badge_english VARCHAR(150),
    title_marathi VARCHAR(250),
    title_english VARCHAR(250),
    subtitle_marathi TEXT,
    subtitle_english TEXT,
    cta_text_marathi VARCHAR(100),
    cta_text_english VARCHAR(100),
    cta_link VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Village Gallery Images
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url VARCHAR(500) NOT NULL,
    title_marathi VARCHAR(250) NOT NULL,
    title_english VARCHAR(250),
    category VARCHAR(50) NOT NULL,
    description_marathi TEXT,
    description_english TEXT,
    location VARCHAR(150),
    event_date VARCHAR(100),
    credit VARCHAR(150),
    is_featured BOOLEAN DEFAULT true,
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Water Supply Schedules
CREATE TABLE IF NOT EXISTS water_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward VARCHAR(200) NOT NULL,
    morning_time VARCHAR(100) NOT NULL,
    evening_time VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'NORMAL',
    tank_level_percent INT DEFAULT 85,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Village Administrative & Emergency Contacts
CREATE TABLE IF NOT EXISTS village_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    office_hours VARCHAR(200),
    address VARCHAR(250),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Citizen Reviews & Public Ratings
CREATE TABLE IF NOT EXISTS citizen_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id VARCHAR(100),
    business_name VARCHAR(200) NOT NULL,
    business_slug VARCHAR(200),
    user_name VARCHAR(150) NOT NULL,
    ward_or_area VARCHAR(150),
    rating INT NOT NULL,
    comment TEXT NOT NULL,
    verified_citizen BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'APPROVED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- SEED DATA
-- =========================================================================

-- Seed Schools
INSERT INTO schools (name, badge, category, grades, medium, description, tags, principal_name, contact_phone, address, image_url, latitude, longitude)
VALUES
('Zilla Parishad High School & Junior College, Asgaon', 'Govt Approved', 'High School & Jr College', '1st – 12th', 'Marathi & Semi-English Medium', 'Co-educational • Marathi & Semi-English Medium • Arts, Science & Commerce Streams available.', 'Total Enrollment: 642, Mid-Day Meal: PM POSHAN, Girls Free Bicycle Scheme, 94.2% Pass Percentage (10th/12th)', 'Shri. R. V. Gaikwad', '9422811204', 'Near Gram Panchayat Office, Asgaon', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80', 20.7858, 79.6345),
('Saraswati Vidya Mandir Primary School', 'Primary School', 'Primary School', 'Balwadi to 7th Standard', 'Marathi Medium', 'Child-centric foundational classes with dedicated Anganwadi connection, smart projector classroom, and eco-purified drinking water plant.', 'Government Aided, Smart Projector Classroom, Nutritious Diet, Sports & Yoga', 'Smt. S. P. Meshram', '9822104500', 'Tembhurne Ward No. 3, Near Old Talav, Asgaon', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80', 20.7842, 79.6360),
('Govt Industrial Training Institute (ITI), Pauni', 'Technical Government', 'Technical & ITI', 'Post 10th (1 to 2 Years)', 'Marathi / English Tech', 'Fitter, Electrician, Wireman, Welder, COPA (Computer Operator & Programming Assistant). In partnership with Nagpur MIDC & Balharshah.', 'Centralized DVET Admissions, Apprenticeship Linked, Nagpur MIDC Tie-up, Free Tools Kit', 'Principal ITI Pauni', '07185222019', 'Pauni Bypass Road, Pauni (2.8 km from Asgaon)', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', 20.7910, 79.6395),
('Dr. Babasaheb Ambedkar Social Welfare Hostel', 'Social Welfare Hostel', 'Hostel & Lodging', 'College & Degree Students', 'Residential Facility', 'Free residential lodgings, balanced nutritious meals, and reading room for SC/ST/OBC college boys & girls enrolled in Pauni/Bhandara degree colleges.', 'Capacity: 120 Beds, Zero Fees for Eligible Wards, Mess & Nutritious Meals, In-house Study Library', 'Warden Shri. D. N. Kamble', '07185223300', 'Samaj Kalyan Sankul, Pauni Road', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80', 20.7950, 79.6380);

-- Seed Scholarships
INSERT INTO scholarships (title, badge, deadline, description, benefit, income_limit, department, official_url, eligibility)
VALUES
('MahaDBT Post-Matric Scholarship for SC/ST/VJNT/OBC/SBC', 'POST-MATRIC (11th & Higher)', '15 Nov 2026', 'Provides comprehensive financial support for college fees, professional, and general university degree streams.', '100% Fee Waiver + ₹1,200/mo', '≤ ₹2,50,000 / year', 'Social Justice & Tribal Dev', 'https://mahadbt.maharashtra.gov.in', 'Aadhaar-seeded bank account, Caste Validity, Family Income Certificate'),
('Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti', 'GENERAL / EWS (Open Category)', '30 Nov 2026', 'Reimbursement of tuition and exam fees for economically backward class students admitted to diploma, degree, and PG courses.', '50% Tuition Fee Reimbursement', '≤ ₹8,00,000 / year', 'Higher & Technical Education', 'https://mahadbt.maharashtra.gov.in', 'CAP round admission, Maharashtra domicile, Non-Creamy Layer / Income proof'),
('Savitribai Phule Kanya Dattak Yojana & Stipend', 'GIRLS EDUCATION ENCOURAGEMENT', 'Ongoing (Through School)', 'Special state incentive to prevent drop-outs of female students studying in Std 8th to 10th in rural Zilla Parishad schools.', '₹1,000 / year + Free Uniforms & Bicycle', 'BPL / Single Parent Wards', 'School Education & Sports Dept', 'https://education.maharashtra.gov.in', 'Girls enrolled in Zilla Parishad schools from Std 8 to 10'),
('National Means-cum-Merit Scholarship (NMMS)', 'MERIT BASED SCHOLARSHIP (EXAM)', 'December 2026 Assessment', 'Prestigious master-exam grants for academically gifted students clearing the state NMMS assessment in Class VIII.', '₹12,000 / year (till 12th Std)', '≤ ₹3,50,000 / year', 'Ministry of Education (Govt of India)', 'https://scholarships.gov.in', 'Class 8 students appearing for MAT & SAT state evaluation');

-- Seed Study Center & Tutors
INSERT INTO study_centers (name, type, category, subjects, timing, phone, address, fees_info, total_desks, available_desks, wifi_speed, book_count, caretaker_name, caretaker_role, notice_text)
VALUES
('Dr. APJ Abdul Kalam Gram Panchayat Abhyasika', 'LIBRARY', 'Public Study Center', 'MPSC, UPSC, Banking, SSC, Police Bharti, ZP High School Study', '06:00 AM – 11:00 PM (All 7 Days)', '9822104501', 'Gram Panchayat Bhavan, 1st Floor, Asgaon', 'Free for all village residents', 40, 14, '100 Mbps BSNL Optical Fiber', '3,200+ Books & Journals', 'Shri. Nilkanth Meshram', 'Gram Panchayat Office Peon & Library In-Charge', 'Free entry for all Asgaon students with smart card. Silence strictly observed in cubicles.'),
('Dnyandeep Coaching Classes', 'TUTOR', 'Class 5th to 10th', 'Mathematics, Science, and English specialty. Weekly mock tests.', '06:30 AM - 08:30 AM & 05:00 PM - 07:00 PM', '9822100111', 'Near Pauni Bus Stand, Ward 2', '₹400 / month', 0, 0, NULL, NULL, 'Prof. S. R. Dnyandeep', 'Founder & Head Tutor', NULL),
('PM Kaushal Vikas Kendra (PMKVY)', 'TUTOR', '100% Govt Sponsored Skill', 'Solar Panel Technician, Tally Prime Financial Accounting, Electrician.', '10:00 AM - 04:00 PM (Mon to Fri)', '07185224410', 'Pauni Main Road, Near Tahsil Karyalaya', 'Free + Stipend Provided', 0, 0, NULL, NULL, 'Centre Coordinator', 'Skill Training Officer', NULL),
('Spoken English & Coding Club', 'TUTOR', 'Youth Self Help', 'Every Saturday 2 hrs: Basic python coding, resume building & soft skills.', 'Every Saturday 03:00 PM - 05:00 PM', '9422811204', 'Conducted at ZP School Science Room', 'Free Community Initiative', 0, 0, NULL, NULL, 'Youth Volunteer Wing', 'Coordinator', NULL);

-- Seed Buses
INSERT INTO transport_buses (bus_number, source, destination, source_marathi, destination_marathi, via, via_marathi, departure_time, departure_time_24, approx_arrival_time, duration_minutes, bus_type, bus_type_marathi, depot, depot_marathi, fare_general, fare_mahila, fare_senior, frequency, frequency_marathi, boarding_point_at_asgaon, boarding_point_marathi, is_popular)
VALUES
('MH40-Y-5412', 'Asgaon', 'Pauni', 'आसगाव', 'पवनी', 'Asgaon Phata, Kondha, Pauni Bus Stand', 'आसगाव फाटा, कोंढा, पवनी बस स्थानक', '06:45 AM', '06:45', '07:20 AM', 35, 'Lalpari', 'साधी लालपरी', 'Pauni Depot', 'पवनी आगार', 20, 10, 0, 'Daily', 'दररोज', 'Asgaon Gram Panchayat Chowk', 'आसगाव ग्रामपंचायत चौक', true),
('MH36-AA-1209', 'Asgaon', 'Bhandara', 'आसगाव', 'भंडारा', 'Kondha Phata, Pauni Bypass, Bela, Kardi, Bhandara ST Stand', 'कोंढा फाटा, पवनी बायपास, बेला, कार्डी, भंडारा बस स्थानक', '07:15 AM', '07:15', '08:30 AM', 75, 'Lalpari', 'साधी लालपरी', 'Bhandara Depot', 'भंडारा आगार', 50, 25, 0, 'Daily', 'दररोज (शाळा/कॉलेज विशेष)', 'Asgaon Bus Stand', 'आसगाव मुख्य बस स्थानक', true),
('MH40-AQ-8840', 'Asgaon', 'Nagpur', 'आसगाव', 'नागपूर (गणेशपेठ)', 'Pauni Stand, Umred, Dighori, Nagpur Ganeshpeth', 'पवनी स्थानक, उमरेड, दिघोरी, नागपूर गणेशपेठ', '08:00 AM', '08:00', '10:30 AM', 150, 'Asiad', 'निमआराम एक्सप्रेस', 'Pauni Depot', 'पवनी आगार', 135, 68, 0, 'Daily', 'दररोज', 'Asgaon Phata', 'आसगाव फाटा', true),
('MH36-F-7744', 'Asgaon', 'Sakoli', 'आसगाव', 'साकोली', 'Pauni, Lakhandur, Sakoli Stand', 'पवनी, लाखांदूर, साकोली बस स्थानक', '09:00 AM', '09:00', '10:45 AM', 105, 'Lalpari', 'साधी लालपरी', 'Sakoli Depot', 'साकोली आगार', 65, 33, 0, 'Daily', 'दररोज', 'Asgaon Bus Stand', 'आसगाव मुख्य बस स्थानक', false),
('MH40-Y-6621', 'Asgaon', 'Pauni', 'आसगाव', 'पवनी (कोर्ट/तहसील)', 'Asgaon Phata, Nilaj, Pauni Court', 'आसगाव फाटा, निळाज, पवनी कोर्ट', '10:30 AM', '10:30', '11:05 AM', 35, 'Ordinary', 'स्थानिक फेरी', 'Pauni Depot', 'पवनी आगार', 20, 10, 0, 'Daily', 'दररोज (तहसील/बाजार फेरी)', 'Asgaon Gram Panchayat Chowk', 'आसगाव ग्रामपंचायत चौक', false),
('MH40-Y-9912', 'Asgaon', 'Nagpur', 'आसगाव', 'नागपूर (रात्रीची बस)', 'Pauni Stand, Umred, Nagpur Ganeshpeth', 'पवनी स्थानक, उमरेड, नागपूर गणेशपेठ', '08:15 PM', '20:15', '10:45 PM', 150, 'Shivshahi', 'शिवशाही (AC / आरामशीर)', 'Pauni Depot', 'पवनी आगार', 180, 90, 90, 'Daily', 'दररोज (रात्रीची फेरी)', 'Asgaon Phata', 'आसगाव फाटा', true),
('MH40-Y-2211', 'Pauni', 'Asgaon', 'पवनी', 'आसगाव (आगमन)', 'Pauni Stand, Kondha, Asgaon Phata', 'पवनी स्थानक, कोंढा, आसगाव फाटा', '08:15 AM', '08:15', '08:50 AM', 35, 'Ordinary', 'स्थानिक फेरी', 'Pauni Depot', 'पवनी आगार', 20, 10, 0, 'Daily', 'दररोज', 'Pauni Stand Platform 3', 'पवनी बस स्थानक फलाट ३', false),
('MH36-AA-6523', 'Bhandara', 'Asgaon', 'भंडारा', 'आसगाव (आगमन)', 'Bhandara ST Stand, Bela, Pauni Bypass, Asgaon', 'भंडारा स्थानक, बेला, पवनी बायपास, आसगाव', '01:30 PM', '13:30', '02:45 PM', 75, 'Lalpari', 'साधी लालपरी', 'Bhandara Depot', 'भंडारा आगार', 50, 25, 0, 'Daily', 'दररोज', 'Bhandara Stand Platform 5', 'भंडारा बस स्थानक फलाट ५', true);

-- Seed Auto Drivers
INSERT INTO auto_drivers (name, name_marathi, vehicle_number, vehicle_type, phone, stand_location, stand_location_marathi, primary_route, primary_route_marathi, estimated_fare, is_available)
VALUES
('Sanjay Meshram', 'संजय मेश्राम', 'MH36-V-4182', 'Auto Rickshaw', '+919822341029', 'Asgaon Main Bus Stand Chowk', 'आसगाव मुख्य बस स्टँड चौक', 'Asgaon ⇄ Pauni (Shared / Special)', 'आसगाव ⇄ पवनी (शेअरिंग किंवा स्पेशल)', '₹30 प्रति सीट (शेअरिंग) / ₹180 (स्पेशल)', true),
('Rameshwar Wankhede', 'रामेश्वर वानखेडे', 'MH36-E-9041', 'Auto Rickshaw', '+919423871142', 'Gram Panchayat Office Stop', 'ग्रामपंचायत कार्यालय थांबा', 'Asgaon ⇄ Kondha Phata & Pauni', 'आसगाव ⇄ कोंढा फाटा व पवनी', '₹30 प्रति सीट / ₹170 स्पेशल', true),
('Pravin Tembhurne (Eco Van)', 'प्रविण टेंभुर्णे (इको व्हॅन)', 'MH36-AC-3105', 'Eco Van', '+919921456201', 'Weekly Bazaar Square', 'आठवडी बाजार चौक, आसगाव', 'Asgaon ⇄ Bhandara / Nagpur (Special Booking)', 'आसगाव ⇄ भंडारा / नागपूर (फॅमिली व लग्न स्पेशल)', '₹12 प्रति कि.मी. (स्पेशल गाडी)', true),
('Vilas Bhoyar', 'विलास भोयर', 'MH36-T-8871', 'Auto Rickshaw', '+919765431890', 'Asgaon Phata', 'आसगाव फाटा', 'Asgaon ⇄ Pauni Court & Rural Hospital', 'आसगाव ⇄ पवनी कोर्ट व ग्रामीण रुग्णालय', '₹30 प्रति सीट (शेअरिंग)', true);

-- Seed Depot Contacts
INSERT INTO depot_contacts (depot_name, depot_name_marathi, phone, controller_desk, address, address_marathi, distance_from_asgaon)
VALUES
('Pauni MSRTC Bus Depot', 'पवनी एसटी बस आगार', '07185-255342', '07185-255342', 'Near Pauni Fort, Old ST Stand Road, Pauni, Dist. Bhandara 441910', 'पवनी किल्ला परिसर, जुना एसटी स्टँड रोड, पवनी, जि. भंडारा ४४१९१०', '१४ कि.मी.'),
('Bhandara Central MSRTC Depot', 'भंडारा मध्यवर्ती एसटी आगार', '07184-252431', '07184-252432', 'National Highway 53, Bus Stand Complex, Bhandara 441904', 'राष्ट्रीय महामार्ग ५३, बस स्थानक परिसर, भंडारा ४४१९०४', '३६ कि.मी.'),
('MSRTC Maharashtra State Helpline', 'एसटी महामंडळ २४×७ मदत केंद्र (टोल फ्री)', '1800-22-1250', '022-23075252', 'Maharashtra State Road Transport Corp, Central Office, Mumbai', 'महाराष्ट्र राज्य मार्ग परिवहन महामंडळ, मध्यवर्ती कार्यालय, मुंबई', 'राज्यस्तरीय');

-- Seed Hero Banners
INSERT INTO hero_banners (slide_type, image_url, show_text_overlay, badge_marathi, badge_english, title_marathi, title_english, subtitle_marathi, subtitle_english, cta_text_marathi, cta_text_english, cta_link, is_active, display_order)
VALUES
('welcome', NULL, true, 'डिजिटल ग्रामपंचायत', 'Digital Gram Panchayat', 'आपले गाव, डिजिटल आसगाव', 'Welcome to Asgaon Digital Portal', '१००% पारदर्शक प्रशासन, २४×७ नागरी सेवा, थेट शासकीय योजना आणि शेती बाजारभाव एकाच ठिकाणी.', '100% Transparent Governance, 24x7 Citizen Services, Direct Welfare Schemes & Mandi Rates.', 'नागरी सेवा पहा', 'Explore Services', 'citizen-services', true, 1),
('custom', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80', true, 'कृषी व जलसिंचन प्रकल्प', 'Irrigation & Agriculture', 'गोसीखुर्द धरण व समृद्ध आसगाव शिवार', 'Gosikhurd Project & Lush Green Asgaon', 'पवनी तालुक्यातील बागायती शेती • मुबलक पाणी पुरवठा व आधुनिक कृषी योजनांचा थेट लाभ.', 'Perennial irrigation, bountiful harvest, and direct DBT farmer support.', 'कृषी योजना व दर पहा', 'Explore Krishi Desk', 'krishi', true, 2),
('custom', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80', true, 'ग्राम संस्कृती व उत्सव', 'Culture & Heritage', 'ग्रामदैवत खंडोबा व आसगाव ग्रामसंस्कृती', 'Heritage & Gramotsav Celebrations', 'पारंपरिक वारसा, वार्षिक जत्रा आणि सामाजिक ऐक्य • गावातील सर्व चालू कार्यक्रम पहा.', 'Rich cultural legacy, folk celebrations, and community harmony.', 'गावातील कार्यक्रम पहा', 'View Events', 'events', true, 3);

-- Seed Gallery Images
INSERT INTO gallery_images (image_url, title_marathi, title_english, category, description_marathi, description_english, location, event_date, credit, is_featured, display_order)
VALUES
('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80', 'गोसीखुर्द कालवा व आसगाव हरित शिवार', 'Gosikhurd Canal & Lush Green Asgaon', 'agriculture', 'पवनी तालुक्यातील बारमाही कालवा आवर्तन. रब्बी आणि खरीप हंगामासाठी मुबलक जलसिंचन व बागायती शेतीची समृद्धी.', 'Perennial irrigation release from Khadakwasla / Gosikhurd canals empowering double-crop farming across Asgaon.', 'आसगाव शिवार, सेक्टर २', 'जानेवारी २०२६', 'ग्रामपंचायत संकलन', true, 1),
('https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80', 'वार्षिक खंडोबा यात्रा व सांस्कृतिक महोत्सव', 'Annual Khandoba Yatra & Cultural Festival', 'festival', 'गावातील शतकानुशतके चालत आलेली पारंपरिक यात्रा, लोककला, भजन कीर्तन आणि सामाजिक एकात्मतेचा भव्य सोहळा.', 'Centuries-old village temple fair celebrating regional folk culture, bhajans, and community solidarity.', 'ग्रामदैवत खंडोबा मंदिर परिसर', 'डिसेंबर २०२५', 'ग्राम सांस्कृतिक समिती', true, 2),
('https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80', 'आधुनिक ग्राम सचिवालय व नागरी सुविधा केंद्र', 'Modern Gram Sachivalaya & CSC Hub', 'development', 'सौर ऊर्जेवर चालणारी संगणकीकृत इमारत, डिजिटल ७/१२ दाखले, हाय-स्पीड वायफाय व वातानुकूलित अभ्यासिका कक्ष.', 'Solar-powered smart Panchayat Bhavan providing 100% digital citizen certs, Wi-Fi, and public e-library.', 'मध्यवर्ती चौक, आसगाव', 'ऑक्टोबर २०२५', 'ग्रामविकास विभाग', true, 3),
('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80', 'सुवर्ण धान्याची कापणी व समृद्ध शेतकरी', 'Golden Paddy Harvest Season', 'agriculture', 'पवनी परिसरातील उच्च प्रतीचा वाण भात व हरभरा पीक. आधुनिक यंत्रसामग्रीद्वारे सामुदायिक कापणीची लगबग.', 'High-yield aromatic rice and grain cultivation harvested using modern tractor and combine harvester machinery.', 'पूर्वेकडील शिवार', 'नोव्हेंबर २०२५', 'कृषी सहाय्यक केंद्र', true, 4),
('https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80', 'जिल्हा परिषद डिजिटल स्मार्ट प्राथमिक शाळा', 'Zilla Parishad Digital Smart School', 'community', 'इंटरॅक्टिव्ह स्मार्ट बोर्ड, सौर ऊर्जा, क्रीडांगण व मोफत संगणक शिक्षणाने सुसज्ज असलेली आसगावची आदर्श शाळा.', 'Interactive smart boards, green playground, and digital education desk empowering young village students.', 'शाळा परिसर, वॉर्ड क्र. १', 'फेब्रुवारी २०२६', 'शिक्षण समिती आसगाव', true, 5),
('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=80', 'वैनगंगा खोऱ्यातील विहंगम सायंकाळ व निसर्ग', 'Wainganga Basin Scenic Sunset & Nature', 'nature', 'आसगावच्या सीमेवरून वाहणाऱ्या वैनगंगा नदीचे पाणलोट क्षेत्र व विहंगम निसर्गसौंदर्य. शांत व निसर्गरम्य परिसर.', 'Tranquil evening sunset over the natural wetlands and river basin flanking the scenic boundary of Asgaon.', 'वैनगंगा पाणलोट क्षेत्र', 'जानेवारी २०२६', 'निसर्ग मित्र मंडळ', true, 6);

-- Seed Water Schedules
INSERT INTO water_schedules (ward, morning_time, evening_time, status, tank_level_percent, notes)
VALUES
('वॉर्ड क्र. १ (बाजार पेठ व विठ्ठल मंदिर परिसर)', '०६:३० AM - ०८:०० AM', '०५:३० PM - ०६:३० PM', 'NORMAL', 85, 'नियमित सुरळीत पाणीपुरवठा चालू आहे'),
('वॉर्ड क्र. २ (गावठाण व शाळा परिसर)', '०८:०० AM - ०९:३० AM', '०६:३० PM - ०७:३० PM', 'NORMAL', 85, 'सर्व नळांना चांगला दाब उपलब्ध'),
('वॉर्ड क्र. ३ (हनुमान नगर व पूर्व वस्ती)', '०६:०० AM - ०७:३० AM', '०५:०० PM - ०६:०० PM', 'LOW_PRESSURE', 60, 'मुख्य व्हॉल्व्ह तपासणी चालू असल्याने मध्यम दाब'),
('वॉर्ड क्र. ४ (नवीन कॉलनी व शेतवस्ती)', '०९:३० AM - ११:०० AM', '०७:३० PM - ०८:३० PM', 'NORMAL', 85, 'टँकर राखीव व्यवस्था उपलब्ध (संपर्क: ९८२२०८११००)');

-- Seed Village Contacts
INSERT INTO village_contacts (name, designation, phone, category, office_hours, address)
VALUES
('श्री. एस. एन. जाधव', 'ग्रामसेवक', '9822104501', 'Administration', 'सकाळी १० ते दुपारी २ (सोमवार ते शुक्रवार)', 'ग्रामपंचायत कार्यालय, आसगाव'),
('सौ. सरिताताई पाटील', 'सरपंच', '9822104502', 'Administration', 'सकाळी ९ ते ११ व दुपारी ४ ते ६', 'वॉर्ड २, मुख्य चौक, आसगाव'),
('श्री. रमेश बोरकर', 'तलाठी (महसूल विभाग)', '9822104503', 'Administration', 'मंगळवार व गुरुवार: सकाळी ११ ते दुपारी ३', 'सजा कार्यालय, आसगाव'),
('श्री. विष्णू कांबळे', 'पाणी पुरवठा व्यवस्थापक', '9822081100', 'Water & Power', 'सकाळी ६ ते १० व संध्याकाळी ४ ते ८', 'मुख्य जलकुंभ, आसगाव'),
('श्री. गजानन म्हात्रे', 'महावितरण वायरमन', '9422998877', 'Water & Power', '२४ तास ऑन-कॉल (आपत्कालीन वीज सेवा)', 'महावितरण सब-स्टेशन, पवनी रोड'),
('डॉ. स्नेहल झाळके', 'वैद्यकीय अधिकारी (प्रा. आ. केंद्र)', '9422001102', 'Health & Anganwadi', 'सकाळी १० ते २ व संध्याकाळी ५ ते ९', 'प्राथमिक आरोग्य केंद्र, शाळा शेजारी'),
('सौ. छायाबाई वाघमारे', 'आशा स्वयंसेविका', '9765432111', 'Health & Anganwadi', 'सकाळी ९ ते दुपारी ३', 'वॉर्ड १, आसगाव'),
('श्री. नितीन देशमुख', 'कृषी सहाय्यक', '9822334455', 'Agriculture', 'सोमवार व बुधवार: सकाळी १० ते दुपारी २', 'कृषी सेवा केंद्र शेजारी');

-- Seed Citizen Reviews
INSERT INTO citizen_reviews (business_id, business_name, business_slug, user_name, ward_or_area, rating, comment, verified_citizen, status)
VALUES
('1', 'खडके किराणा आणि जनरल स्टोअर्स', 'khadke-kirana', 'रमेश पाटील', 'वॉर्ड २ (गावठाण)', 5, 'उत्कृष्ट सेवा आणि वाजवी दर. वेळेवर सर्व धान्य व किराणा माल उपलब्ध असतो. गावातच अशी दर्जेदार सोय असल्याने पवनीला जाण्याची गरज भासत नाही.', true, 'APPROVED'),
('2', 'पाटील कृषी केंद्र', 'patil-krishi-kendra', 'सुनीता झाळके', 'आंबेडकर वॉर्ड १', 5, 'अतिशय नम्र बोलणे आणि खात्रीशीर बियाणे. रासायनिक व सेंद्रिय खतांचा योग्य सल्ला देतात. सर्व शेतकरी बांधवांना नक्की शिफारस करतो.', true, 'APPROVED'),
('3', 'सोनवणे मेडिकल व क्लिनिक', 'sonone-medical', 'विठ्ठल मेश्राम', 'विठ्ठल मंदिर परिसर वॉर्ड ३', 5, 'तातडीच्या वेळी रात्रीही आवश्यक औषधे उपलब्ध करून दिली. बीपी व शुगर तपासणी मोफत केली जाते. अतिशय तत्पर सेवा.', true, 'APPROVED'),
('4', 'गायत्री झेरॉक्स व सीएससी केंद्र', 'gayatri-csc', 'प्रशांत चौधरी', 'वॉर्ड ४ (शिवार)', 4, 'लाडकी बहीण योजना व पीएम किसान ई-केवायसीचे काम अगदी कमी वेळेत करून दिले. डिजिटल प्रिंटिंगची सोय उत्तम आहे.', true, 'APPROVED'),
('1', 'खडके किराणा आणि जनरल स्टोअर्स', 'khadke-kirana', 'संजय कापसे', 'गावठाण वॉर्ड २', 5, 'स्वच्छ किराणा, डिजिटल यूपीआय पेमेंट व घरपोच सेवा. आसगावमधील सर्वात विश्वासू दुकान!', true, 'APPROVED'),
('5', 'माऊली ट्रॅक्टर व कृषी अवजारे', 'mauli-tractors', 'अनिल भोंगाडे', 'वॉर्ड ३ (मंदिर चौक)', 5, 'नांगरणी व रोटाव्हेटरचे काम वेळेत पूर्ण केले. डिझेलचे दर आणि अवजारांचे भाडे अतिशय वाजवी आहे.', true, 'APPROVED');
