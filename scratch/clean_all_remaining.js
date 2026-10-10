const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('c:/VIP/Websites/App/Asgaon/frontend/src/pages');

// ==========================================
// 1. Clean MarketplacePage.tsx
// ==========================================
const marketPath = path.join(srcDir, 'MarketplacePage.tsx');
let marketContent = fs.readFileSync(marketPath, 'utf8');

// Replace from const harvestItems = [ down to end of allHousehold definitions
const marketRegex = /const harvestItems = \[[\s\S]*?const allHousehold = \[[\s\S]*?\];\s*\];/s;
const cleanMarketArrays = `const allHarvest = extraItems.filter(e => !e.category || e.category === 'harvest');
  const allLivestock = extraItems.filter(e => e.category === 'livestock').map(l => ({
    id: l.id,
    title: l.title,
    badge: 'DIRECT DAIRY / CATTLE',
    healthTag: 'Vaccinated & Verified',
    subBadge: 'Available in Village',
    price: l.price,
    priceUnit: '',
    desc: l.desc,
    location: \`\${l.seller} • \${l.sellerRole}\`,
    phone: l.phone,
    image: l.image || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80'
  }));
  const allMachinery = extraItems.filter(e => e.category === 'machinery').map(m => ({
    id: m.id,
    title: m.title,
    badge: 'AGRI EQUIPMENT',
    price: m.price,
    specs: ['Verified by Village Desk', 'Direct Farmer Settlement', 'Zero Dealer Commission'],
    location: \`\${m.seller} • \${m.sellerRole}\`,
    phone: m.phone,
    image: m.image || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
  }));
  const allHousehold = extraItems.filter(e => e.category === 'household').map(h => ({
    id: h.id,
    title: h.title,
    badge: 'VILLAGE ITEM',
    price: h.price,
    desc: h.desc,
    location: \`\${h.seller} • \${h.sellerRole}\`,
    phone: h.phone,
    image: h.image || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
  }));`;

if (marketRegex.test(marketContent)) {
  marketContent = marketContent.replace(marketRegex, cleanMarketArrays);
  fs.writeFileSync(marketPath, marketContent, 'utf8');
  console.log('MarketplacePage.tsx: Dummy arrays removed. 100% DB driven.');
} else {
  console.log('MarketplacePage.tsx: Regex did not match, inspecting manually...');
}

// ==========================================
// 2. Clean EventsPage.tsx
// ==========================================
const eventsPath = path.join(srcDir, 'EventsPage.tsx');
let eventsContent = fs.readFileSync(eventsPath, 'utf8');

// In EventsPage, remove the fallback static block : ( <> ... </> )
const eventsFallbackRegex = /\s*:\s*\(\s*<>\s*{\/\* EVENT 1: FEATURED MEGA CARD[\s\S]*?<\/>\s*\)/s;
if (eventsFallbackRegex.test(eventsContent)) {
  eventsContent = eventsContent.replace(eventsFallbackRegex, ` : (
            <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center text-[#707974]">
              No events found matching your filter.
            </div>
          )`);
  fs.writeFileSync(eventsPath, eventsContent, 'utf8');
  console.log('EventsPage.tsx: Static dummy events removed. 100% DB driven.');
} else {
  console.log('EventsPage.tsx: Fallback regex did not match.');
}

// ==========================================
// 3. Clean AnnouncementsPage.tsx
// ==========================================
const noticePath = path.join(srcDir, 'AnnouncementsPage.tsx');
let noticeContent = fs.readFileSync(noticePath, 'utf8');

// In AnnouncementsPage, remove the static notices below dynamic backend announcements
// Notice 1, 2, 3
const noticeRegex = /\s*{\/\* NOTICE 1: CRITICAL WATER PIPELINE NOTICE[\s\S]*?{\/\* NOTICE 3: CIVIC TENDER ROAD PAVING[\s\S]*?<\/div>\s*\)\s*}/s;
if (noticeRegex.test(noticeContent)) {
  noticeContent = noticeContent.replace(noticeRegex, '');
  fs.writeFileSync(noticePath, noticeContent, 'utf8');
  console.log('AnnouncementsPage.tsx: Static notices removed. 100% DB driven.');
} else {
  console.log('AnnouncementsPage.tsx: Notice regex did not match.');
}
