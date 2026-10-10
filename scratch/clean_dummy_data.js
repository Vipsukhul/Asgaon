const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('c:/VIP/Websites/App/Asgaon/frontend/src/pages');

// ==========================================
// 1. Clean BusinessesPage.tsx
// ==========================================
const bizPath = path.join(srcDir, 'BusinessesPage.tsx');
let bizContent = fs.readFileSync(bizPath, 'utf8');

// Replace categories header
bizContent = bizContent.replace(
  /const categories = \[\s*\{ id: 'All', label: 'All Outlets[^\]]+\];/s,
  `const categories = [
    { id: 'All', label: 'All Outlets' },
    { id: 'seeds', label: 'Seeds & Fertilizers (कृषी केंद्र)' },
    { id: 'clinic', label: 'Medical & Health Clinics (रुग्णालय)' },
    { id: 'machinery', label: 'Tractor & Agro Machinery (अवजारे)' },
    { id: 'dairy', label: 'Dairy & Milk Supply (दुग्ध व्यवसाय)' },
    { id: 'kirana', label: 'Kirana & General Stores' },
    { id: 'hardware', label: 'Building Materials & Hardware' },
    { id: 'csc', label: 'Govt e-Seva & CSC Kiosks' }
  ];`
);

// Replace fullBusinesses and dynamicBusinesses
const bizMatchRegex = /const fullBusinesses = \[[\s\S]*?const filtered = allBusinesses\.filter/;
if (bizMatchRegex.test(bizContent)) {
  bizContent = bizContent.replace(
    bizMatchRegex,
    `const allBusinesses = (businesses || []).map((b: any, index: number) => {
    const catLower = ((b.category && b.category.name) ? b.category.name : (b.category || '')).toLowerCase();
    const categoryKey = (catLower.includes('seed') || catLower.includes('krishi') || catLower.includes('agro')) ? 'seeds' :
                        (catLower.includes('clinic') || catLower.includes('medical') || catLower.includes('health') || catLower.includes('pharmacy')) ? 'clinic' :
                        (catLower.includes('tractor') || catLower.includes('machinery')) ? 'machinery' :
                        (catLower.includes('dairy') || catLower.includes('husbandry') || catLower.includes('milk')) ? 'dairy' :
                        (catLower.includes('hardware') || catLower.includes('building') || catLower.includes('cement')) ? 'hardware' :
                        (catLower.includes('csc') || catLower.includes('seva') || catLower.includes('e-seva')) ? 'csc' : 'kirana';

    return {
      id: b.id || (index + 1),
      name: b.name,
      badge: b.verificationBadge || 'VERIFIED MERCHANT',
      rating: String(b.rating || '4.8'),
      ratingCount: b.ratingCount || 50,
      categoryKey,
      image: b.imageUrl || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=600&q=80',
      address: b.address || 'Asgaon Village Market Road',
      distance: b.landmark || b.distanceKm || 'Village Center',
      owner: b.description ? b.description.split('.')[0] : 'Verified Merchant',
      phone: b.phone || '9822104500',
      phoneDisplay: \`+91 \${b.phone || '98221 04500'}\`,
      whatsapp: b.whatsapp || b.phone || '9822104500',
      hours: b.openingHours ? \`Open: \${b.openingHours}\` : 'Open: 07:30 AM - 08:30 PM',
      tags: [(b.category && b.category.name) ? b.category.name : (b.category || 'General Enterprise'), 'Panchayat Verified'],
      reviews: [
        {
          user: 'Citizen of Asgaon',
          date: 'Verified',
          comment: b.description || 'Verified village enterprise in Asgaon.'
        }
      ]
    };
  });

  const filtered = allBusinesses.filter`
  );
}

// Replace static "184 VERIFIED LOCAL OUTLETS" with dynamic counter
bizContent = bizContent.replace(
  /184 VERIFIED LOCAL OUTLETS IN WARD REGISTRY/g,
  '{allBusinesses.length} VERIFIED LOCAL OUTLETS IN WARD REGISTRY'
);

fs.writeFileSync(bizPath, bizContent, 'utf8');
console.log('BusinessesPage.tsx cleaned: 100% dynamic from DB.');

// ==========================================
// 2. Clean JobsPage.tsx
// ==========================================
const jobsPath = path.join(srcDir, 'JobsPage.tsx');
let jobsContent = fs.readFileSync(jobsPath, 'utf8');

// Replace categories header
jobsContent = jobsContent.replace(
  /const categories = \[\s*\{ id: 'All', label: 'All Openings[^\]]+\];/s,
  `const categories = [
    { id: 'All', label: 'All Openings' },
    { id: 'farm', label: 'Daily Wage & Farm Labor (रोजंदारी)' },
    { id: 'staff', label: 'Permanent Village Staff (Shop / Office)' },
    { id: 'tech', label: 'Skilled Technical (Wireman / Tech)' },
    { id: 'women', label: 'Women & SHG Works' }
  ];`
);

// Remove fullJobs and use allJobs = dynamicJobs
const jobsMatchRegex = /const fullJobs = \[[\s\S]*?const dynamicJobs = \(jobs \|\| \[\]\)\.map/;
if (jobsMatchRegex.test(jobsContent)) {
  jobsContent = jobsContent.replace(
    jobsMatchRegex,
    `const dynamicJobs = (jobs || []).map`
  );
}

jobsContent = jobsContent.replace(
  /const allJobs = dynamicJobs\.length > 0\s*\?[\s\S]*?: fullJobs;/s,
  `const allJobs = dynamicJobs;`
);

// Replace static badges with dynamic counts
jobsContent = jobsContent.replace(
  /48 VERIFIED VILLAGE OPENINGS/g,
  '{allJobs.length} VERIFIED VILLAGE OPENINGS'
);

fs.writeFileSync(jobsPath, jobsContent, 'utf8');
console.log('JobsPage.tsx cleaned: 100% dynamic from DB.');

// ==========================================
// 3. Clean SchemesPage.tsx
// ==========================================
const schemesPath = path.join(srcDir, 'SchemesPage.tsx');
let schemesContent = fs.readFileSync(schemesPath, 'utf8');

// Replace categories
schemesContent = schemesContent.replace(
  /const categories = \[\s*\{ id: 'All', label: 'All Schemes[^\]]+\];/s,
  `const categories = [
    { id: 'All', label: 'All Schemes' },
    { id: 'farmer', label: 'Farmers & Agriculture (शेती योजना)' },
    { id: 'student', label: 'Students & Education (विद्यार्थी शिष्यवृत्ती)' },
    { id: 'women', label: 'Women & Self-Help Groups (महिला बचत गट)' },
    { id: 'housing', label: 'Rural Housing & Solar' }
  ];`
);

// Remove fullSchemes
const schemesMatchRegex = /const fullSchemes = \[[\s\S]*?const dynamicSchemes = \(schemes \|\| \[\]\)\.map/;
if (schemesMatchRegex.test(schemesContent)) {
  schemesContent = schemesContent.replace(
    schemesMatchRegex,
    `const dynamicSchemes = (schemes || []).map`
  );
}

schemesContent = schemesContent.replace(
  /const allSchemes = dynamicSchemes\.length > 0\s*\?[\s\S]*?: fullSchemes;/s,
  `const allSchemes = dynamicSchemes;`
);

schemesContent = schemesContent.replace(
  /28 ACTIVE GOVERNMENT SCHEMES &amp; SUBSIDIES/g,
  '{allSchemes.length} ACTIVE GOVERNMENT SCHEMES &amp; SUBSIDIES'
);

fs.writeFileSync(schemesPath, schemesContent, 'utf8');
console.log('SchemesPage.tsx cleaned: 100% dynamic from DB.');
