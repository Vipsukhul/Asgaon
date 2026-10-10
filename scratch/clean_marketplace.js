const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('c:/VIP/Websites/App/Asgaon/frontend/src/pages');

// Clean MarketplacePage.tsx
const marketPath = path.join(srcDir, 'MarketplacePage.tsx');
let marketContent = fs.readFileSync(marketPath, 'utf8');

const startMarker = '  const harvestItems = [';
const endMarker = '    ...householdItems.filter(hi => !liveHousehold.some(lh => lh.title.toLowerCase() === hi.title.toLowerCase()))\n  ];';

const startIndex = marketContent.indexOf(startMarker);
const endIndex = marketContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `  const allHarvest = extraItems.filter(e => !e.category || e.category === 'harvest');
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

  marketContent = marketContent.substring(0, startIndex) + replacement + marketContent.substring(endIndex + endMarker.length);
  fs.writeFileSync(marketPath, marketContent, 'utf8');
  console.log('MarketplacePage.tsx cleaned: 100% dynamic from DB.');
} else {
  console.log('MarketplacePage markers not found:', startIndex, endIndex);
}
