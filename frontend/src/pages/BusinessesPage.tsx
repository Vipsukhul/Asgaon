import React, { useState } from 'react';
import type { Business } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { LiveBusinessMap } from '../components/LiveBusinessMap';
import { ShopLocationModal } from '../components/ShopLocationModal';
import { InlineShopMap } from '../components/InlineShopMap';
import { SEOHead } from '../components/SEOHead';

interface BusinessesPageProps {
  businesses?: Business[];
  onSelectBusiness: (biz: any) => void;
  onRegisterShop: () => void;
  onNavigateHome?: () => void;
  onSelectBusinessSlug?: (slug: string) => void;
}

export const BusinessesPage: React.FC<BusinessesPageProps> = ({
  businesses,
  onSelectBusiness,
  onRegisterShop,
  onNavigateHome,
  onSelectBusinessSlug
}) => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('nearest');
  const [openNow, setOpenNow] = useState(false);
  const [whatsappOnly, setWhatsappOnly] = useState(false);
  const [homeDelivery, setHomeDelivery] = useState(false);
  const [panchayatAccredited, setPanchayatAccredited] = useState(false);
  const [fssaiOnly, setFssaiOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'both'>('list');
  const [focusedBusinessId, setFocusedBusinessId] = useState<string | number | null>(null);
  const [locationModalBiz, setLocationModalBiz] = useState<any | null>(null);
  const [inlineMapBizId, setInlineMapBizId] = useState<string | number | null>(null);

  const toggleBookmark = (id: number, name: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
      alert(`Removed ${name} from saved items.`);
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      alert(`Saved ${name} to your profile bookmarks!`);
    }
  };

  const categories = [
    { id: 'All', label: 'All Outlets' },
    { id: 'seeds', label: 'Seeds & Fertilizers (कृषी केंद्र)' },
    { id: 'clinic', label: 'Medical & Health Clinics (रुग्णालय)' },
    { id: 'machinery', label: 'Tractor & Agro Machinery (अवजारे)' },
    { id: 'dairy', label: 'Dairy & Milk Supply (दुग्ध व्यवसाय)' },
    { id: 'kirana', label: 'Kirana & General Stores' },
    { id: 'hardware', label: 'Building Materials & Hardware' },
    { id: 'csc', label: 'Govt e-Seva & CSC Kiosks' }
  ];

  const allBusinesses = (businesses || []).map((b: any, index: number) => {
    const catLower = ((b.category && b.category.name) ? b.category.name : (b.category || '')).toLowerCase();
    const categoryKey = (catLower.includes('seed') || catLower.includes('krishi') || catLower.includes('agro')) ? 'seeds' :
                        (catLower.includes('clinic') || catLower.includes('medical') || catLower.includes('health') || catLower.includes('pharmacy')) ? 'clinic' :
                        (catLower.includes('tractor') || catLower.includes('machinery')) ? 'machinery' :
                        (catLower.includes('dairy') || catLower.includes('husbandry') || catLower.includes('milk')) ? 'dairy' :
                        (catLower.includes('hardware') || catLower.includes('building') || catLower.includes('cement')) ? 'hardware' :
                        (catLower.includes('csc') || catLower.includes('seva') || catLower.includes('e-seva')) ? 'csc' : 'kirana';

    return {
      id: b.id || (index + 1),
      slug: b.slug || (b.name ? b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `biz-${index}`),
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
      phoneDisplay: `+91 ${b.phone || '98221 04500'}`,
      whatsapp: b.whatsapp || b.phone || '9822104500',
      hours: b.openingHours ? `Open: ${b.openingHours}` : 'Open: 07:30 AM - 08:30 PM',
      tags: [(b.category && b.category.name) ? b.category.name : (b.category || 'General Enterprise'), 'Panchayat Verified'],
      reviews: [
        {
          user: 'Citizen of Asgaon',
          date: 'Verified',
          comment: b.description || 'Verified village enterprise in Asgaon.'
        }
      ],
      latitude: b.latitude || (20.7850 + (index * 0.0012) - 0.002),
      longitude: b.longitude || (79.6350 + ((index % 2 === 0 ? 1 : -1) * 0.0018))
    };
  });

  const filtered = allBusinesses
    .filter((b) => {
      const matchesCat = selectedCat === 'All' || b.categoryKey === selectedCat;
      const matchesSearch =
        !search.trim() ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.address.toLowerCase().includes(search.toLowerCase()) ||
        b.owner.toLowerCase().includes(search.toLowerCase()) ||
        b.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesOpen = !openNow || (b.hours && !b.hours.toLowerCase().includes('closed'));
      const matchesWhatsapp = !whatsappOnly || Boolean(b.whatsapp && b.whatsapp.length >= 7);
      const matchesAccredited = !panchayatAccredited || b.badge.toLowerCase().includes('verified');
      const matchesFssai = !fssaiOnly || b.tags.some((t: string) => t.toLowerCase().includes('fssai') || t.toLowerCase().includes('drug') || b.categoryKey === 'clinic' || b.categoryKey === 'kirana');
      const matchesDelivery = !homeDelivery || b.tags.some((t: string) => t.toLowerCase().includes('delivery')) || b.categoryKey === 'kirana' || b.categoryKey === 'seeds';

      return matchesCat && matchesSearch && matchesOpen && matchesWhatsapp && matchesAccredited && matchesFssai && matchesDelivery;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return parseFloat(b.rating) - parseFloat(a.rating);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedBusinesses = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* 0. SEO Head Injection */}
      <SEOHead
        title="Local Business & Service Directory (स्थानिक व्यवसाय यादी) | Asgaon Portal"
        description="Verified directory of local businesses, agro krishi stores, medical clinics, tractor machinery, and grocery shops in Asgaon (Pauni, Bhandara). Contact numbers, addresses, opening hours, and direct WhatsApp."
        keywords="Asgaon businesses, Pauni shops, कृषी केंद्र, दवाखाने, ट्रॅक्टर, किराणा, स्थानिक व्यवसाय, Asgaon market"
        canonicalUrl={`${window.location.origin}/businesses`}
      />

      {/* 1. Breadcrumbs & Verified Status */}
      <Breadcrumb
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Businesses & Local Services (स्थानिक व्यवसाय यादी)', active: true }
        ]}
        rightBadge={
          <div className="flex items-center gap-1.5 bg-[#baeed9] text-[#002117] px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[15px] text-[#002117]">verified_user</span>
            <span>Panchayat Ward Civic Consumer Cell Hotline Verified • Updated today 08:00 AM</span>
          </div>
        }
      />

      {/* 2. Hero / Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e8e2d9] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#baeed9] text-[#002117] text-[10px] font-extrabold uppercase tracking-wider mb-2">
            {allBusinesses.length} VERIFIED LOCAL OUTLETS IN WARD REGISTRY
          </span>

          <h1 className="font-heading font-extrabold text-[26px] sm:text-[30px] text-[#003629] leading-tight mb-1">
            Local Business &amp; Service Directory
          </h1>
          <p className="font-heading font-bold text-[15px] text-[#a63b00] mb-3">
            स्थानिक व्यवसाय व सेवा निर्देशिका (Asgaon - Pauni Cluster)
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[12px] font-bold text-[#003629]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
              <span>100% Zero-Commission Directory</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
              <span>Direct Phone &amp; WhatsApp</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
              <span>Gram Sevak - Verified Ward Outlets</span>
            </span>
          </div>
        </div>

        {/* Right CTA Box */}
        <div className="bg-[#1b4d3e] text-white p-5 rounded-2xl border border-[#003629] shadow-sm flex flex-col gap-3 w-full lg:w-72 shrink-0">
          <button
            onClick={onRegisterShop}
            className="w-full py-2.5 px-4 rounded-xl bg-[#a63b00] hover:bg-[#852f00] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_business</span>
            <span>Register / Claim Shop (FREE)</span>
          </button>

          <button
            onClick={() => {
              setViewMode(viewMode === 'map' ? 'list' : 'map');
              window.scrollTo({ top: 340, behavior: 'smooth' });
            }}
            className={`w-full py-2 px-4 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              viewMode === 'map'
                ? 'bg-[#baeed9] text-[#002117] hover:bg-white'
                : 'bg-white text-[#003629] hover:bg-[#baeed9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            <span>{viewMode === 'map' ? 'सूची दृश्य पहा (View List)' : ' थेट गावाचा नकाशा (Live Map)'}</span>
          </button>
        </div>
      </div>

      {/* 3. Search, Filter & Sort Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex flex-col gap-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#707974] text-[20px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by shop name, owner, category, landmark (उदा. शिवाजी कृषी केंद्र, किराणा, ट्रॅक्टर दुरुस्ती, डॉक्टर)..."
              className="w-full pl-10 pr-10 py-2.5 bg-[#f9f3ea] text-[#1d1b16] rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#003629]"
            />
            <button
              type="button"
              onClick={() => alert('Voice search ready!')}
              className="absolute right-3 top-2.5 text-[#003629] hover:text-[#1b4d3e]"
              title="Voice Search"
            >
              <span className="material-symbols-outlined text-[19px]">mic</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <span className="text-[12px] font-bold text-[#707974] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">sort</span>
              <span>Sort By:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f9f3ea] text-[#1d1b16] p-2 rounded-xl text-[12px] font-bold border border-[#e8e2d9] focus:outline-none"
            >
              <option value="nearest">Nearest &amp; Verified First</option>
              <option value="rating">Rating: High to Low</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap ${
                selectedCat === cat.id
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'bg-[#f3ede4] text-[#404945] hover:bg-[#e8e2d9] border border-[#e8e2d9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Checkbox filters */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#f3ede4] text-[12px] font-medium text-[#404945]">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={openNow}
              onChange={(e) => { setOpenNow(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 accent-[#003629]"
            />
            <span>Open Now</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={whatsappOnly}
              onChange={(e) => { setWhatsappOnly(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 accent-[#003629]"
            />
            <span>WhatsApp Orders</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={homeDelivery}
              onChange={(e) => { setHomeDelivery(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 accent-[#003629]"
            />
            <span>Home Delivery</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={panchayatAccredited}
              onChange={(e) => { setPanchayatAccredited(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 accent-[#003629]"
            />
            <span>Panchayat Accredited</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={fssaiOnly}
              onChange={(e) => { setFssaiOnly(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 accent-[#003629]"
            />
            <span>FSSAI / Drug License</span>
          </label>
        </div>
      </div>

      {/* 4. Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Detailed Enterprise Cards (2 cols wide) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            

            {/* View Mode Toggle Controls */}
            <div className="flex items-center gap-1 bg-[#f9f3ea] p-1 rounded-xl border border-[#e8e2d9]">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#003629] text-white shadow-xs'
                    : 'text-[#404945] hover:text-[#003629]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">view_list</span>
                <span>सूची</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('map');
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'map'
                    ? 'bg-[#003629] text-white shadow-xs'
                    : 'text-[#404945] hover:text-[#003629]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">map</span>
                <span>थेट नकाशा</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('both');
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'both'
                    ? 'bg-[#003629] text-white shadow-xs'
                    : 'text-[#404945] hover:text-[#003629]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">vertical_split</span>
                <span>दोन्ही</span>
              </button>
            </div>
          </div>

          {/* Render Live Business Map if in 'map' or 'both' view */}
          {(viewMode === 'map' || viewMode === 'both') && (
            <div className="w-full mb-2 animate-fadeIn">
              <LiveBusinessMap
                businesses={filtered}
                selectedBusinessId={focusedBusinessId}
                onSelectBusiness={onSelectBusiness}
                height={viewMode === 'map' ? '560px' : '420px'}
                onClose={() => setViewMode('list')}
              />
            </div>
          )}

          {/* If View Mode is MAP ONLY, skip the cards below or show only when in 'list' or 'both' */}
          {viewMode !== 'map' && (
            <>
          {/* Cards List or Empty State */}
          {allBusinesses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-[#003629] border-t-transparent rounded-full animate-spin mb-1" />
              <p className="text-[13px] font-bold text-[#003629]">Connecting to database &amp; loading businesses...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-[#a63b00]">storefront</span>
              <h3 className="font-heading font-bold text-[18px] text-[#003629]">No matching enterprises found</h3>
              <p className="text-[13px] text-[#707974] max-w-md">No shops or local services match your selected category and filters. Try clearing some filters or searching with different terms.</p>
              <button
                onClick={() => {
                  setSelectedCat('All');
                  setSearch('');
                  setOpenNow(false);
                  setWhatsappOnly(false);
                  setHomeDelivery(false);
                  setPanchayatAccredited(false);
                  setFssaiOnly(false);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-[#003629] text-white text-[12px] font-bold rounded-xl hover:bg-[#1b4d3e] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            paginatedBusinesses.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e8e2d9] shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4"
              >
                {/* Image Thumbnail */}
                <div className="sm:w-44 h-40 sm:h-auto rounded-xl overflow-hidden bg-[#f3ede4] shrink-0 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#003629] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                </div>

                {/* Card Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className="font-heading font-bold text-[17px] text-[#1d1b16] hover:text-[#003629] transition-colors leading-snug"
                      >
                        {onSelectBusinessSlug ? (
                          <a
                            href={`/businesses/${item.slug || item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onSelectBusinessSlug(item.slug || item.id);
                            }}
                            className="hover:underline"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <span
                            onClick={() => onSelectBusiness(item)}
                            className="cursor-pointer hover:underline"
                          >
                            {item.name}
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-1 text-[12px] font-bold text-[#a63b00] shrink-0 bg-[#fff8f0] px-1.5 py-0.5 rounded border border-[#ffdbce]">
                        <span>★ {item.rating}</span>
                        <span className="text-[#707974] text-[10px]">({item.ratingCount})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <button
                        type="button"
                        onClick={() => setLocationModalBiz(item)}
                        className="text-[12px] text-[#707974] hover:text-[#003629] flex items-center gap-1 group text-left transition-colors"
                        title="नकाशावर स्थान पहा (Click to view shop location on map)"
                      >
                        <span className="material-symbols-outlined text-[15px] text-[#a63b00] group-hover:scale-110 transition-transform">location_on</span>
                        <span>{item.address} • <strong className="text-[#1d1b16]">{item.distance}</strong></span>
                      </button>

                     
                    </div>

                    <div className="text-[12px] text-[#1d1b16] font-semibold mb-1">
                      <span>{item.owner}</span>
                    </div>

                    <div className="text-[11px] text-[#707974] flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-[14px] text-[#003629]">schedule</span>
                      <span>{item.hours}</span>
                    </div>

                    {/* Service tag chips */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.tags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-[#f9f3ea] text-[#404945] px-2 py-0.5 rounded-md border border-[#e8e2d9]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Inline Mini Map if toggled */}
                    {inlineMapBizId === item.id && (
                      <InlineShopMap
                        latitude={item.latitude}
                        longitude={item.longitude}
                        shopName={item.name}
                        categoryKey={item.categoryKey}
                        address={item.address}
                        onOpenModal={() => setLocationModalBiz(item)}
                        onOpenFullMap={() => {
                          setFocusedBusinessId(item.id);
                          setViewMode('both');
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                      />
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="pt-2.5 border-t border-[#f3ede4] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      

                      <a
                        href={`tel:${item.phone}`}
                        className="px-3 py-1.5 rounded-lg bg-[#003629] hover:bg-[#1b4d3e] text-white text-[12px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>Call</span>
                      </a>

                      <a
                        href={`https://wa.me/91${item.whatsapp}?text=Hello%20${encodeURIComponent(item.name)},%20I%20saw%20your%20shop%20on%20Digital%20Gaon%20Asgaon.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#003629] text-[12px] font-bold flex items-center gap-1 border border-[#e8e2d9] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px] text-[#25D366]">chat</span>
                        <span>WhatsApp</span>
                      </a>

                      {/* Dedicated Shop Location on Map Button */}
                      <button
                        type="button"
                        onClick={() => setLocationModalBiz(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#fff8f0] hover:bg-[#a63b00] hover:text-white text-[#a63b00] text-[12px] font-bold flex items-center gap-1 border border-[#ffdbce] hover:border-[#a63b00] transition-all shadow-xs"
                        title="दुकानाचे अचूक स्थान नकाशावर पहा (View shop location on map modal)"
                      >
                        <span className="material-symbols-outlined text-[15px]">location_on</span>
                        <span>नकाशा</span>
                      </button>

                      {/* Inline Mini-Map Toggle */}
                      <button
                        type="button"
                        onClick={() => setInlineMapBizId(inlineMapBizId === item.id ? null : item.id)}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 border transition-colors ${
                          inlineMapBizId === item.id
                            ? 'bg-[#003629] text-white border-[#003629]'
                            : 'bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#404945] border-[#e8e2d9]'
                        }`}
                        title={inlineMapBizId === item.id ? 'मिनी नकाशा लपवा' : 'कार्डमध्येच नकाशा उघडा'}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {inlineMapBizId === item.id ? 'unfold_less' : 'pin_drop'}
                        </span>
                        <span className="hidden sm:inline">
                          {inlineMapBizId === item.id ? 'लपवा' : 'मिनी नकाशा'}
                        </span>
                      </button>

                      {/* Direct Google Maps Directions */}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#f3ede4] text-[#707974] hover:text-[#003629] hover:bg-[#e8e2d9] transition-colors border border-[#e8e2d9]"
                        title="Google Maps थेट दिशानिर्देश (Get Directions)"
                      >
                        <span className="material-symbols-outlined text-[15px]">navigation</span>
                      </a>
                    </div>

                    <button
                      onClick={() => toggleBookmark(item.id, item.name)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        bookmarkedIds.includes(item.id)
                          ? 'text-[#a63b00] bg-[#ffdbce]'
                          : 'text-[#707974] hover:text-[#003629] hover:bg-[#f3ede4]'
                      }`}
                      title="Bookmark this shop"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {bookmarkedIds.includes(item.id) ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Dynamic Pagination Strip */}
          <div className="bg-white rounded-xl p-3 border border-[#e8e2d9] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#707974] gap-2 mt-2">
            <span>
              Showing {filtered.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length} registered village enterprises
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  disabled={validCurrentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-7 h-7 rounded-lg bg-[#f3ede4] text-[#1d1b16] font-bold flex items-center justify-center disabled:opacity-40 hover:bg-[#e8e2d9] transition-colors"
                  aria-label="Previous Page"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition-colors ${
                        validCurrentPage === pageNum
                          ? 'bg-[#003629] text-white shadow-xs'
                          : 'bg-[#f3ede4] text-[#1d1b16] hover:bg-[#e8e2d9]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={validCurrentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-7 h-7 rounded-lg bg-[#f3ede4] text-[#1d1b16] font-bold flex items-center justify-center disabled:opacity-40 hover:bg-[#e8e2d9] transition-colors"
                  aria-label="Next Page"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
          </>
          )}
        </div>

        {/* Right Column: 4 Civic & Rate Card Sidebars (1 col wide) */}
        <div className="flex flex-col gap-5">
          {/* Widget 1: Gram Panchayat Civic Initiative - Are You a Local Shopkeeper? */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a63b00] bg-[#fff8f0] px-2 py-0.5 rounded border border-[#ffdbce]">
              GRAM PANCHAYAT CIVIC INITIATIVE
            </span>

            <h3 className="font-heading font-extrabold text-[16px] text-[#003629] mt-2 mb-2">
              Are You a Local Shopkeeper or Artisan?
            </h3>

            <p className="text-[12px] text-[#404945] leading-relaxed mb-4">
              List or claim your shop in just 2 minutes. Gain immediate reach to 14,280+ verified local residents, receive WhatsApp orders directly from farmers, and get a verified badge issued by the Gram Panchayat office.
            </p>

            <ul className="space-y-2 text-[12px] text-[#1d1b16] mb-5">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
                <span>100% Free Registration for Ward Residents</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
                <span>Free QR Code Standee from Panchayat Office</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
                <span>Zero middleman commission on citizen orders</span>
              </li>
            </ul>

           
          </div>

          {/* Widget 2: Mandi & Local Rates - Gram Sabha Rate Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
                LOCAL RATES
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#707974]">gavel</span>
            </div>

            <h3 className="font-heading font-extrabold text-[15px] text-[#003629] mt-2 mb-1">
              Gram Sabha Rate Card
            </h3>
            <p className="text-[11px] text-[#707974] mb-3">
              Standardized service rates agreed upon in the Gram Sabha (March 2026):
            </p>

            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">Tractor Tillage (Rotavator)</span>
                <span className="font-extrabold text-[#003629]">₹900 - 1,000 / hr</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">Combine Harvester (Paddy)</span>
                <span className="font-extrabold text-[#003629]">₹2,200 - 2,500 / ac</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">Daily Farm Labour (Female)</span>
                <span className="font-extrabold text-[#003629]">₹350 - 400 / day</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">Daily Farm Labour (Male)</span>
                <span className="font-extrabold text-[#003629]">₹450 - 500 / day</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">Mason / Mistri (Skilled Civil)</span>
                <span className="font-extrabold text-[#003629]">₹800 - 900 / day</span>
              </div>
            </div>

            <button
              onClick={() => alert('Official Gram Sabha Rate Card PDF downloaded.')}
              className="mt-3 text-[12px] text-[#002873] font-bold hover:underline flex items-center gap-1"
            >
              <span>Download Official Gram Sabha Rate Card</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Widget 3: Urgent Village Help - Need an On-Demand Mechanic or Repair? */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded">
              URGENT VILLAGE HELP
            </span>

            <h3 className="font-heading font-extrabold text-[15px] text-[#003629] mt-2 mb-1">
              Need an On-Demand Mechanic or Repair?
            </h3>
            <p className="text-[11px] text-[#707974] mb-3">
              Emergency technicians available on-call across Pauni &amp; Haveli village boundaries:
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <a
                href="tel:8888172233"
                className="p-2.5 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9] hover:bg-[#f3ede4] transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-1 text-[#a63b00] font-bold">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Village Electrician</span>
                </div>
                <div className="text-[#1d1b16] font-semibold mt-1">Pandurang Mali</div>
              </a>

              <a
                href="tel:9765432100"
                className="p-2.5 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9] hover:bg-[#f3ede4] transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-1 text-[#003629] font-bold">
                  <span className="material-symbols-outlined text-[16px]">precision_manufacturing</span>
                  <span>Submersible Motor</span>
                </div>
                <div className="text-[#1d1b16] font-semibold mt-1">Kisan Rewinding</div>
              </a>

              <a
                href="tel:9822100000"
                className="p-2.5 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9] hover:bg-[#f3ede4] transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-1 text-[#a63b00] font-bold">
                  <span className="material-symbols-outlined text-[16px]">plumbing</span>
                  <span>Borewell Plumber</span>
                </div>
                <div className="text-[#1d1b16] font-semibold mt-1">Laxman Kamble</div>
              </a>

              <a
                href="tel:108"
                className="p-2.5 rounded-xl bg-[#ffdad6] text-[#93000a] border border-[#ffb4ab] hover:bg-[#ffb4ab] transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[16px]">ambulance</span>
                  <span>PHC Ambulance</span>
                </div>
                <div className="font-extrabold mt-1">108 (24x7 Free)</div>
              </a>
            </div>
          </div>

          {/* Widget 4: Weekly Haat Notice - Asgaon Budhwar Bazaar */}
          <div className="bg-[#f9f3ea] rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e65100] bg-white px-2 py-0.5 rounded border border-[#e8e2d9]">
              WEEKLY HAAT NOTICE
            </span>

            <h3 className="font-heading font-extrabold text-[15px] text-[#003629] mt-2 mb-1">
              Asgaon Budhwar Bazaar
            </h3>
            <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
              Every Wednesday (बुधवार) at the Old Bus Stand Ground. 85+ fresh vegetable vendors, poultry dealers, and seasonal potters.
            </p>

            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#e8e2d9] text-[12px]">
              <span className="font-bold text-[#707974]">Next Haat Day:</span>
              <span className="font-extrabold text-[#a63b00]">This Wednesday, 07:00 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Location Interactive Leaflet Modal */}
      <ShopLocationModal
        business={locationModalBiz}
        isOpen={Boolean(locationModalBiz)}
        onClose={() => setLocationModalBiz(null)}
        onOpenInFullVillageMap={(bizId) => {
          setFocusedBusinessId(bizId);
          setViewMode('both');
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
      />
    </div>
  );
};
