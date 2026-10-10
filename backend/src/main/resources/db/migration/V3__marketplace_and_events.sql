-- V3__marketplace_and_events.sql - Asgaon Marketplace and Events Schema & Seed

CREATE TABLE IF NOT EXISTS marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- harvest, livestock, machinery, household
    price VARCHAR(100) NOT NULL,
    seller_name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    village_location VARCHAR(150) DEFAULT 'Asgaon',
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS village_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(250) NOT NULL,
    category VARCHAR(50) NOT NULL, -- religious, health, agriculture, sports
    event_date VARCHAR(100) NOT NULL,
    event_time VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    organizer VARCHAR(150) NOT NULL,
    badge VARCHAR(100),
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Marketplace Listings
INSERT INTO marketplace_listings (title, category, price, seller_name, contact_phone, village_location, description, image_url, status)
VALUES
('Yellow Soybean (JS 335)', 'harvest', '₹4,850 / Quintal', 'Sunil Ramesh Jadhav', '9876543210', 'Asgaon West 1.4 km', 'Total 140 qtl fresh 2026 harvest stock stored in aerated godown. Test report available on boat.', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80', 'ACTIVE'),
('Gir Cow Pure A2 Raw Milk', 'harvest', '₹65 / Litre', 'Rameshbwar Dairy Farm', '9822334455', 'Asgaon Ward 2', 'Unadulterated raw morning milk from free-range indigenous Gir cows. Tested Fat 4.8-5.0% and SNF 8.9%.', 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=600&q=80', 'ACTIVE'),
('Export Quality Pomegranate (भगवा डाळिंब)', 'harvest', '₹110 / Kg', 'Shivneri Agro Orchards', '9765412389', 'G-17 Pauni Road, 3.2 km', 'Uniform 300g+ size, deep ruby red arils, blemish-free, harvested this week. Minimum bulk order 50 KG.', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', 'ACTIVE'),
('Organic Jaggery (सेंद्रिय गूळ)', 'harvest', '₹65 / Kg', 'Kisan Gurhal Kendra', '9422003344', 'Bypass Mill Store, 2.1 km', 'Prepared traditionally using sugarcane juice clarified with bhendi plant extract. Zero sodium hydrosulphite.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', 'ACTIVE'),
('Murrah Milking Buffalo', 'livestock', '₹82,000', 'Ghadge Patil', '9822119988', 'Near Vithal Mandir (0.4 km)', 'Calf is female and completely vaccinated. Very docile temperament. Milk recorded 3 mornings.', 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80', 'ACTIVE'),
('Mahindra 275 DI Sarpanch', 'machinery', '₹3,10,000', 'Pawar Farm', '9822104500', 'Khed Shivapur Road', 'Single engine: 1,840 Running Hours. Front tyres 80%, rear tyres 65%. Insurance active till Nov 2026.', 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80', 'ACTIVE');

-- Seed Initial Village Events
INSERT INTO village_events (title, category, event_date, event_time, location, organizer, badge, description, image_url)
VALUES
('Shri Khandoba & Bhavani Mata Annual Village Fair', 'religious', '14 to 18 December 2024', 'All Day', 'Khandoba Mandir Devasthan Grounds, Asgaon', 'Shri Khandoba Devasthan Trust', 'Annual Village Jatra', 'Sacred 5-day annual fair featuring traditional Palkhi procession, State-level Kabaddi, and Krishi exhibition.', 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80'),
('Free Eye Checkup, Cataract Screening & Specs Distribution', 'health', 'Sunday, 17 Nov 2024', '09:30 AM — 03:30 PM', 'Gram Panchayat Community Hall, Asgaon', 'Lions Club of Pauni & District Civil Hospital', 'Free Medical Camp', 'Comprehensive vision testing, cataract detection, free prescription glasses, and surgery booking.', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'),
('Zilla Krishi Melawa & Rabi Crop High-Yield Seminar', 'agriculture', 'Sunday, 10 Nov 2024', '11:00 AM — 02:00 PM', 'Shivaji Vidyalaya Ground, Pauni Road', 'KVK Sakoli & Pauni Taluka Agriculture Office', 'Krishi Seminar', 'Practical live demonstration on moisture retention, bio-fertilizers, and high-yield chickpea cultivation.', 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80');
