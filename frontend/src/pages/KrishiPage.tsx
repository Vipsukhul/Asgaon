import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

export interface KrishiPageProps {
  mandiPrices?: any[];
  onNavigateHome?: () => void;
}

export const KrishiPage: React.FC<KrishiPageProps> = ({ mandiPrices = [], onNavigateHome }) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'mandi' | 'machinery' | 'soil' | 'pest'>('mandi');
  const [dbMachinery, setDbMachinery] = useState<any[]>([]);

  useEffect(() => {
    api.getMarketplaceListings('machinery')
      .then((listings) => {
        if (listings && listings.length > 0) {
          setDbMachinery(listings.map((item: any, idx: number) => ({
            id: item.id || `db-mach-${idx}`,
            name: item.title,
            badge: 'Verified Farm Implement',
            price: item.price || 'Contact for Rate',
            desc: item.description,
            owner: item.sellerName || 'Local Farmer',
            phone: item.contactPhone || '9822104500',
            image: item.imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
          })));
        }
      })
      .catch((err) => console.log('Machinery listings notice:', err.message));
  }, []);

  const mandiCommodities = [
    {
      id: 1,
      name: 'Soybean (सोयाबीन - JS 335)',
      badge: '+₹45',
      badgeColor: 'bg-[#bbf7d0] text-[#002117]',
      price: '₹4,820',
      unit: '/ Quintal (Mandi)',
      msp: 'Pauni Mandi MSP: ₹4,892',
      arrival: 'Daily Arrival: 420 qtl',
      note: 'Harvest season arrival surge',
      trend: 'up'
    },
    {
      id: 2,
      name: 'Cotton (कापूस - Med. Staple)',
      badge: '+₹120',
      badgeColor: 'bg-[#bbf7d0] text-[#002117]',
      price: '₹7,400',
      unit: '/ Quintal (Mandi)',
      msp: 'Govt MSP: ₹7,121',
      arrival: 'Moisture: 10% - 11.5%',
      note: 'CCI Procurement Active now',
      trend: 'up'
    },
    {
      id: 3,
      name: 'Red Onion (कांदा - Nashik)',
      badge: '-₹80',
      badgeColor: 'bg-[#fef3c7] text-[#93000a]',
      price: '₹2,850',
      unit: '/ Quintal (Mandi)',
      msp: 'Arrivals: 180 Quintals',
      arrival: 'Storage Quality: Grade A',
      note: 'Fair Market Demand',
      trend: 'down'
    },
    {
      id: 4,
      name: 'Cow Milk (गाय दूध - Gir A2)',
      badge: '+₹1.50',
      badgeColor: 'bg-[#bbf7d0] text-[#002117]',
      price: '₹41.50',
      unit: '/ Litre (Dairy)',
      msp: 'Asgaon Dairy Union MSP: ₹40.00',
      arrival: 'Daily Batch: 120 L',
      note: '4% Fat Certified',
      trend: 'up'
    }
  ];

  const dynamicCommodities = (mandiPrices && mandiPrices.length > 0)
    ? mandiPrices.map((p: any, idx: number) => ({
        id: p.id || idx + 1,
        name: p.commodityName || 'Produce',
        badge: (p.priceChange !== undefined && p.priceChange !== 0) ? `${p.priceChange > 0 ? '+' : ''}₹${p.priceChange}` : 'Official Rate',
        badgeColor: (p.trend === 'up' || (p.priceChange && p.priceChange > 0)) ? 'bg-[#bbf7d0] text-[#002117]' : (p.trend === 'down' || (p.priceChange && p.priceChange < 0)) ? 'bg-[#fef3c7] text-[#93000a]' : 'bg-[#f3ede4] text-[#404945]',
        price: `₹${Number(p.modalPrice || p.price || 4500).toLocaleString('en-IN')}`,
        unit: `/ ${p.unit || 'Quintal'} (Mandi)`,
        msp: `${p.marketName || 'Pauni APMC'} • Variety: ${p.variety || 'Standard'}`,
        arrival: `Daily Arrival Active • Grade A`,
        note: `Market: ${p.marketName || 'Pauni Mandi'}`,
        trend: p.trend || 'stable'
      }))
    : mandiCommodities;

  const machineryList = [
    {
      id: 1,
      name: 'Mahindra 575 DI Tractor with Rotavator',
      badge: '12 Available Today',
      price: '₹950 / Hour (Rotavator)',
      desc: '45 HP tractor with heavy 42-blade Shaktiman rotavator. Ideal for quick field seedbed preparation.',
      owner: 'Babanrao Thorat (Asgaon West, 1.2 km away)',
      phone: '9822104500',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'Agri Spraying Drone (10L Tank Capacity)',
      badge: '48-Hr Advance Booking',
      price: '₹350 / Acre (Chemical + Pilot)',
      desc: 'Covers 1 Acre in just 7 mins with uniform micron droplet penetration. Saves 90% water & 50% chemical waste.',
      owner: 'Operated by: Asgaon Youth Krishi DAK Hub (Certified DGCA Pilot)',
      phone: '9765432100',
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'John Deere 5050 D Combined Harvester',
      badge: '72 Hr Prior Booking',
      price: '₹2,200 / Acre',
      desc: 'Multi-crop grain cutter (Soybean, Paddy, Wheat). Perfect straw harvest for livestock. 0% grain spillage guarantee.',
      owner: 'Patil Farm Services (Pauni Bypass, 2.5 km)',
      phone: '9822100000',
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      name: 'Laser Land Leveler (लेझर लँड लेव्हलर)',
      badge: 'Precision Irrigation',
      price: '₹1,100 / Hour',
      desc: 'Dual-slope precision leveling reduces irrigation water requirement by 35% and increases crop yields.',
      owner: 'Kisan Tractor Co-op Machinery Bank',
      phone: '9422001102',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f6?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* 1. Canal Irrigation Top Notice Banner */}
      <div className="w-full bg-amber-50 text-amber-950 py-2.5 px-4 rounded-xl shadow-xs border border-amber-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[20px] text-amber-700 shrink-0">water_drop</span>
          <span className="text-[13px] font-semibold truncate">
            <strong>Canal Irrigation Alert:</strong> Rotational irrigation release commences tomorrow 06:00 AM for Sector 3 &amp; 4.
          </span>
        </div>
        <button
          onClick={() => alert('Viewing Sector 3 & 4 Canal Roster.')}
          className="text-amber-900 text-[12px] font-bold underline shrink-0 cursor-pointer"
        >
          View Roster ↗
        </button>
      </div>

      {/* 2. Breadcrumbs & Accredited Badge */}
      <Breadcrumb
        items={[
          { label: t('nav_home'), onClick: onNavigateHome },
          { label: lang === 'MR' ? 'कृषी व शेती केंद्र' : 'Krishi', active: true }
        ]}
        rightBadge={
          <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[15px] text-emerald-700">verified</span>
            <span>{lang === 'MR' ? 'जि. प. कृषी विभाग अधिकृत' : 'ZP Agriculture Directorate Accredited'}</span>
          </div>
        }
      />

      {/* 3. Hero Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#efe7dc] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="font-heading font-extrabold text-[26px] sm:text-[32px] text-emerald-950 leading-tight mb-2">
            {lang === 'MR' ? 'कृषी व शेती केंद्र — बाजारभाव व अवजारे' : 'Krishi & Agriculture Hub — Mandi & Tools'}
          </h1>
          <p className="text-[13px] text-stone-600 leading-relaxed">
            {lang === 'MR'
              ? 'थेट एपीएमसी बाजारभाव, माती परीक्षण मार्गदर्शन, ट्रॅक्टर व हार्वेस्टर भाडे आणि आसगावच्या शेतकऱ्यांसाठी शासकीय अनुदानित सेवा.'
              : 'Live APMC Mandi rates, soil health guidance, crop disease diagnostics, tractor & harvester rental pool, and subsidized agricultural inputs for Asgaon farmers.'}
          </p>
        </div>

        {/* Right Kisan Call Center Badge */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-4 rounded-2xl border border-emerald-950 shadow-sm flex items-center justify-between gap-4 w-full lg:w-72 shrink-0">
          <div>
            <div className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">
              {lang === 'MR' ? 'किसान कॉल सेंटर (२४/७)' : 'KISAN CALL CENTER (24x7)'}
            </div>
            <div className="font-heading font-extrabold text-[17px] text-white mt-0.5">1800-180-1551</div>
          </div>
          <a
            href="tel:18001801551"
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-[12px] font-extrabold transition-colors shadow-xs"
          >
            {lang === 'MR' ? 'मोफत कॉल' : 'Toll-Free Call'}
          </a>
        </div>
      </div>

      {/* 4. Four Quick Filter Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('mandi')}
          className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
            activeTab === 'mandi'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
              : 'bg-white text-stone-900 border-[#efe7dc] hover:bg-[#faf6ee]'
          }`}
        >
          <div>
            <div className={`text-[10px] font-bold uppercase ${activeTab === 'mandi' ? 'text-emerald-200' : 'text-stone-500'}`}>
              {lang === 'MR' ? 'थेट बाजारभाव' : 'APMC Live Rates'}
            </div>
            <div className="font-heading font-bold text-[14px]">
              {lang === 'MR' ? 'मंडी बाजार भाव' : 'Mandi Bhaav'}
            </div>
          </div>
          <span className="material-symbols-outlined text-[22px]">trending_up</span>
        </button>

        <button
          onClick={() => setActiveTab('machinery')}
          className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
            activeTab === 'machinery'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
              : 'bg-white text-stone-900 border-[#efe7dc] hover:bg-[#faf6ee]'
          }`}
        >
          <div>
            <div className={`text-[10px] font-bold uppercase ${activeTab === 'machinery' ? 'text-emerald-200' : 'text-stone-500'}`}>
              {lang === 'MR' ? 'अवजारे भाडे' : 'Rent Machinery'}
            </div>
            <div className="font-heading font-bold text-[14px]">
              {lang === 'MR' ? 'ट्रॅक्टर व हार्वेस्टर' : 'Tractor & Pool'}
            </div>
          </div>
          <span className="material-symbols-outlined text-[22px]">agriculture</span>
        </button>

        <button
          onClick={() => setActiveTab('soil')}
          className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
            activeTab === 'soil'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
              : 'bg-white text-stone-900 border-[#efe7dc] hover:bg-[#faf6ee]'
          }`}
        >
          <div>
            <div className={`text-[10px] font-bold uppercase ${activeTab === 'soil' ? 'text-emerald-200' : 'text-stone-500'}`}>
              {lang === 'MR' ? 'माती परीक्षण' : 'Soil Testing'}
            </div>
            <div className="font-heading font-bold text-[14px]">
              {lang === 'MR' ? 'मृदा आरोग्य कार्ड' : 'Soil Health'}
            </div>
          </div>
          <span className="material-symbols-outlined text-[22px]">spa</span>
        </button>

        <button
          onClick={() => setActiveTab('pest')}
          className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
            activeTab === 'pest'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
              : 'bg-white text-stone-900 border-[#efe7dc] hover:bg-[#faf6ee]'
          }`}
        >
          <div>
            <div className={`text-[10px] font-bold uppercase ${activeTab === 'pest' ? 'text-emerald-200' : 'text-stone-500'}`}>
              {lang === 'MR' ? 'पीक संरक्षण' : 'Pest Advisory'}
            </div>
            <div className="font-heading font-bold text-[14px]">
              {lang === 'MR' ? 'रोग व कीड सल्ला' : 'Pest & Crops'}
            </div>
          </div>
          <span className="material-symbols-outlined text-[22px]">pest_control</span>
        </button>
      </div>

      {/* 5. Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols Wide) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* APMC Mandi Rates Block */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#166534] text-[22px]">trending_up</span>
                <div>
                  <h3 className="font-heading font-extrabold text-[17px] text-[#166534]">
                    Live APMC Mandi Rates <span className="text-[12px] font-bold text-[#bbf7d0] bg-[#166534] px-2 py-0.5 rounded ml-1">PAUNI &amp; HAVELI APMC</span>
                  </h3>
                  <p className="text-[11px] text-[#707974]">Updated Today, 06:30 AM (Official Computer Type Mandi Weighbridge)</p>
                </div>
              </div>

              <button
                onClick={() => alert('Full APMC 45-commodity rate sheet downloaded.')}
                className="px-3 py-1.5 rounded-xl bg-[#166534] text-white text-[12px] font-bold hover:bg-[#052e16] transition-colors"
              >
                Full APMC Sheet
              </button>
            </div>

            {/* Commodity Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dynamicCommodities.map((item) => (
                <div key={item.id} className="bg-[#f9f3ea] rounded-xl p-4 border border-[#e8e2d9] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[14px] text-[#1d1b16]">{item.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 my-2">
                      <span className="font-heading font-extrabold text-[24px] text-[#166534]">{item.price}</span>
                      <span className="text-[12px] text-[#707974]">{item.unit}</span>
                    </div>

                    <div className="text-[11px] text-[#707974] space-y-0.5 pt-2 border-t border-[#e8e2d9]">
                      <div>{item.msp}</div>
                      <div>{item.arrival}</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#e8e2d9] text-[11px] font-bold text-[#c2410c]">
                    ✓ {item.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Tur Banner */}
            <div className="bg-[#fef9ee] rounded-xl p-3.5 border border-[#fed7aa] mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#c2410c] text-white flex items-center justify-center font-bold text-[14px]">
                  तुर
                </div>
                <div className="text-[12px] text-[#1d1b16]">
                  <strong>Tur / Pigeon Pea (तूर - सफेद वाण) [NEW]</strong> • Pauni APMC Modal Rate: <strong>₹9,850 / qtl</strong> — Procurement center opening on 15 Nov.
                </div>
              </div>
              <button
                onClick={() => alert('Displaying 8 authorized Tur procurement centers in Pauni.')}
                className="px-3 py-1.5 rounded-lg bg-[#166534] text-white text-[11px] font-bold shrink-0 hover:bg-[#052e16]"
              >
                View Buyer Contacts
              </button>
            </div>
          </div>

          {/* Machinery & Tractor Pool Block */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#166534]">
                  Kisan Tractor, Drone &amp; Implement Rental Pool
                </h3>
                <p className="text-[12px] text-[#707974]">
                  Direct village-level implements operating at Gram Panchayat agreed standardized rental rates. Zero middlemen fees.
                </p>
              </div>

              <button
                onClick={() => alert('List your tractor or farm implement modal opened.')}
                className="px-3.5 py-1.5 rounded-xl bg-[#f9f3ea] hover:bg-[#f3ede4] text-[#166534] text-[12px] font-bold border border-[#e8e2d9] flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>List Your Machinery</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...dbMachinery, ...machineryList].map((m) => (
                <div key={m.id} className="bg-[#f9f3ea] rounded-xl overflow-hidden border border-[#e8e2d9] flex flex-col justify-between">
                  <div className="h-36 w-full relative bg-[#f3ede4]">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-[#166534] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {m.badge}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-extrabold px-2 py-0.5 rounded backdrop-blur-xs">
                      {m.price}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-[14px] text-[#1d1b16] mb-1">{m.name}</h4>
                      <p className="text-[11px] text-[#404945] leading-relaxed mb-2">{m.desc}</p>
                      <div className="text-[11px] text-[#707974] mb-3">Owner: {m.owner}</div>
                    </div>

                    <a
                      href={`tel:${m.phone}`}
                      className="w-full py-2 bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-1 transition-colors shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      <span>Call Owner ({m.phone})</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soil Health Card & Fertilizer Stock Roster */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#166534]">
                  Soil Health Card &amp; Fertilizer Stock Roster
                </h3>
                <p className="text-[12px] text-[#707974]">
                  Check nutrient levels for Asgaon village soil zones, verified by Regional Krishi Vigyan Kendra (KVK).
                </p>
              </div>

              <button
                onClick={() => alert('Soil health card report downloaded.')}
                className="px-3 py-1.5 rounded-xl bg-[#166534] text-white text-[12px] font-bold flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>Download Soil Card</span>
              </button>
            </div>

            {/* 3 Nutrient Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span className="text-[#707974]">NITROGEN (N)</span>
                  <span className="text-[#93000a] bg-[#fef3c7] px-1.5 py-0.2 rounded">DEFICIENT (Low)</span>
                </div>
                <div className="font-heading font-extrabold text-[22px] text-[#1d1b16]">
                  168 <span className="text-[11px] font-normal text-[#707974]">kg/ha (Ideal: 280-560)</span>
                </div>
                <div className="text-[10px] text-[#404945] mt-2 pt-2 border-t border-[#e8e2d9]">
                  Apply 30% additional NPK topping after seed sprouting in Ward 2-4.
                </div>
              </div>

              <div className="bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span className="text-[#707974]">PHOSPHORUS (P2O5)</span>
                  <span className="text-[#002117] bg-[#bbf7d0] px-1.5 py-0.2 rounded">MEDIUM (Balanced)</span>
                </div>
                <div className="font-heading font-extrabold text-[22px] text-[#1d1b16]">
                  18.4 <span className="text-[11px] font-normal text-[#707974]">kg/ha (Ideal: 15-25)</span>
                </div>
                <div className="text-[10px] text-[#404945] mt-2 pt-2 border-t border-[#e8e2d9]">
                  Adequate for pulses; maintain for Rabi chickpea and wheat cultivation.
                </div>
              </div>

              <div className="bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span className="text-[#707974]">ORGANIC CARBON</span>
                  <span className="text-[#93000a] bg-[#fef3c7] px-1.5 py-0.2 rounded">CRITICAL (Low)</span>
                </div>
                <div className="font-heading font-extrabold text-[22px] text-[#ba1a1a]">
                  0.42% <span className="text-[11px] font-normal text-[#707974]">(Standard: &gt; 0.75%)</span>
                </div>
                <div className="text-[10px] text-[#404945] mt-2 pt-2 border-t border-[#e8e2d9]">
                  Extreme deficiency. Urgent need for farmyard manure (shendriya khat).
                </div>
              </div>
            </div>

            {/* Fertilizer Stock Availability */}
            <div className="bg-white p-3.5 rounded-xl border border-[#e8e2d9]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#166534] mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                <span>Official Certified Fertilizer Stock Availability (खत साठा उपलब्धता)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
                <div className="bg-[#f9f3ea] p-2.5 rounded-lg border border-[#e8e2d9]">
                  <div className="text-[10px] text-[#707974]">DAP (Di-Ammonium Phosphate)</div>
                  <div className="font-bold text-[#166534]">120 Bags Available</div>
                  <div className="text-[10px] text-[#707974]">Price: ₹1,350 / 50kg bag</div>
                </div>
                <div className="bg-[#f9f3ea] p-2.5 rounded-lg border border-[#e8e2d9]">
                  <div className="text-[10px] text-[#707974]">Neem Coated Urea</div>
                  <div className="font-bold text-[#166534]">280 Bags in Stock</div>
                  <div className="text-[10px] text-[#707974]">Price: ₹266.50 / 45kg bag</div>
                </div>
                <div className="bg-[#f9f3ea] p-2.5 rounded-lg border border-[#e8e2d9]">
                  <div className="text-[10px] text-[#707974]">IFFCO Nano Urea Liquid</div>
                  <div className="font-bold text-[#c2410c]">Unlimited Stock</div>
                  <div className="text-[10px] text-[#707974]">Price: ₹225 / 500ml Bottle</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Field Warning & Pest Diagnostics */}
          <div className="bg-[#fef3c7] text-[#93000a] p-4 rounded-2xl border border-[#fde68a] shadow-xs">
            <div className="flex items-start gap-2 mb-2">
              <span className="material-symbols-outlined text-[22px] text-[#ba1a1a] shrink-0 mt-0.5">warning</span>
              <div>
                <h4 className="font-heading font-extrabold text-[15px] text-[#ba1a1a]">
                  CRITICAL FIELD WARNING: Fall Armyworm &amp; Pod Borer Alert for Rabi Gram (Harbhara)
                </h4>
                <p className="text-[12px] mt-0.5 leading-relaxed">
                  Heavy morning fog and dew drops triggering pest outbreak. Immediate spraying of approved bio-pesticides or Neem oil recommended.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-white text-[#1d1b16] p-3 rounded-xl border border-[#fde68a] text-[12px]">
                <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#fef3c7] px-1.5 py-0.2 rounded">Harbhara Crop</span>
                <h5 className="font-bold text-[14px] mt-1 mb-1">Helicoverpa Pod Borer (घाटे अळी)</h5>
                <p className="text-[11px] text-[#707974] mb-2">Larvae feeding on developing pods with circular holes.</p>
                <div className="text-[11px] font-semibold text-[#166534]">Remedy: Emamectin Benzoate 5% SG @ 4g/10L water</div>
              </div>

              <div className="bg-white text-[#1d1b16] p-3 rounded-xl border border-[#fde68a] text-[12px]">
                <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#fef3c7] px-1.5 py-0.2 rounded">Mustard &amp; Wheat</span>
                <h5 className="font-bold text-[14px] mt-1 mb-1">Sucking Pest Complex &amp; Leaf Curl (मावा, तुडतुडे)</h5>
                <p className="text-[11px] text-[#707974] mb-2">Upward curling of leaf margins, yellowing between veins.</p>
                <div className="text-[11px] font-semibold text-[#166534]">Remedy: Imidacloprid 17.8% SL @ 0.3ml/L water</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Sidebars */}
        <div className="flex flex-col gap-5">
          {/* Weather Widget */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center justify-between text-[11px] text-[#707974] mb-1">
              <span>AGRI-WEATHER RADAR</span>
              <span>Updated: 07:15 AM</span>
            </div>

            <div className="flex items-baseline justify-between my-2">
              <div className="font-heading font-extrabold text-[36px] text-[#166534]">28°C</div>
              <div className="text-right">
                <div className="font-bold text-[13px] text-[#1d1b16]">Asgaon Farm Outskirts</div>
                <div className="text-[11px] text-[#707974]">Sunny &amp; Clear Sky</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#f9f3ea] p-2.5 rounded-xl border border-[#e8e2d9] text-center text-[11px] mb-3">
              <div>
                <div className="text-[#707974]">Humidity</div>
                <div className="font-bold text-[#1d1b16]">62%</div>
              </div>
              <div>
                <div className="text-[#707974]">Wind NW</div>
                <div className="font-bold text-[#1d1b16]">8 km/h</div>
              </div>
              <div>
                <div className="text-[#707974]">Cloud Cover</div>
                <div className="font-bold text-[#166534]">Zero</div>
              </div>
            </div>

            <div className="text-[11px] text-[#404945]">
              <strong>Irrigation Advisory:</strong> Safe to irrigate crops today. Canal delivery on schedule.
            </div>
          </div>

          {/* Designated Agri Officer */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#bbf7d0] px-2 py-0.5 rounded">
              DESIGNATED OFFICER • ON FIELD DUTY
            </span>

            <div className="flex items-center gap-3 my-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="D. K. More"
                className="w-12 h-12 rounded-xl object-cover border border-[#e8e2d9]"
              />
              <div>
                <h4 className="font-heading font-bold text-[15px] text-[#1d1b16]">D. K. More</h4>
                <div className="text-[11px] text-[#707974]">Taluka Agriculture Officer - Pauni</div>
              </div>
            </div>

            <div className="text-[12px] space-y-1 text-[#707974] mb-3">
              <div>Office Hours: <strong className="text-[#1d1b16]">Mon &amp; Thu: 10:00 - 13:00</strong></div>
              <div>Field Visit Day: <strong className="text-[#1d1b16]">Every Tuesday Morning</strong></div>
              <div>Desk: <strong className="text-[#1d1b16]">Room 3, ZP Bhawan</strong></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:9822104500"
                className="py-2 bg-[#166534] text-white text-[12px] font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-[#052e16]"
              >
                <span className="material-symbols-outlined text-[14px]">call</span>
                <span>Call Desk</span>
              </a>
              <a
                href="https://wa.me/919822104500"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 bg-[#f9f3ea] text-[#166534] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1 border border-[#e8e2d9]"
              >
                <span className="material-symbols-outlined text-[14px] text-[#25D366]">chat</span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Kisan Credit Card Camp */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2410c] bg-[#fef9ee] px-2 py-0.5 rounded border border-[#fed7aa]">
              KCC SHIBIR NOTICE
            </span>

            <h4 className="font-heading font-extrabold text-[15px] text-[#166534] mt-2 mb-1">
              Kisan Credit Card Camp
            </h4>
            <p className="text-[11px] text-[#707974] leading-relaxed mb-3">
              Special KCC saturation drive by Bank of Maharashtra at Asgaon Village Hall. Loan sanction up to ₹3,00,000 at 4% subsidized interest rate.
            </p>

            <ul className="text-[11px] text-[#1d1b16] space-y-1 mb-3">
              <li>✓ Digital 7/12 &amp; 8A Land Extract</li>
              <li>✓ Aadhaar Card + Voter ID / Ration Card</li>
              <li>✓ 3 Cheques + Bank Passbook Copy</li>
              <li>✓ No Dues Certificate from PACs</li>
            </ul>

            <button
              onClick={() => alert('Registration confirmed for Kisan Credit Card camp.')}
              className="w-full py-2 bg-[#c2410c] hover:bg-[#852f00] text-white text-[12px] font-bold rounded-xl transition-colors shadow-xs"
            >
              Register for Camp Drive
            </button>
          </div>

          {/* Village Kisan Chawadi */}
          <div className="bg-[#f9f3ea] rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center justify-between text-[13px] font-bold text-[#166534] mb-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">forum</span>
                <span>Village Kisan Chawadi (शेतकरी मंच)</span>
              </span>
              <span className="text-[10px] text-[#c2410c]">14 Active Topics</span>
            </div>

            <div className="space-y-2 text-[11px] text-[#1d1b16]">
              <div className="p-2 bg-white rounded-lg border border-[#e8e2d9] flex justify-between items-center">
                <span>Canal water release timing for Sector 3?</span>
                <span className="text-[10px] text-[#707974]">4 replies</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-[#e8e2d9] flex justify-between items-center">
                <span>Where can I get certified JS 335 seed?</span>
                <span className="text-[10px] text-[#707974]">11 replies</span>
              </div>
            </div>

            <button
              onClick={() => alert('Chawadi discussion portal opened.')}
              className="w-full mt-3 py-1.5 bg-[#166534] text-white text-[11px] font-bold rounded-lg hover:bg-[#052e16]"
            >
              Post a Question to Village Farmers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
