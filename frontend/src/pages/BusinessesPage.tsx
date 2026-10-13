import React, { useState } from 'react';
import type { Business } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { LiveBusinessMap } from '../components/LiveBusinessMap';
import { ShopLocationModal } from '../components/ShopLocationModal';
import { InlineShopMap } from '../components/InlineShopMap';
import { SEOHead } from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

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
  const { lang, setLang, t } = useLanguage();
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
  const [inlineMapBizId] = useState<string | number | null>(null);

  const toggleBookmark = (id: number, name: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((item) => item !== id));
      alert(lang === 'MR' ? `${name} जतन केलेल्या यादीतून काढले.` : `Removed ${name} from saved items.`);
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      alert(lang === 'MR' ? `${name} तुमच्या प्रोफाइलमध्ये जतन केले!` : `Saved ${name} to your profile bookmarks!`);
    }
  };

  const categories = [
    { id: 'All', label: lang === 'MR' ? 'सर्व दुकाने' : 'All Outlets' },
    { id: 'seeds', label: lang === 'MR' ? 'कृषी व बी-बियाणे' : 'Seeds & Fertilizers (कृषी केंद्र)' },
    { id: 'clinic', label: lang === 'MR' ? 'दवाखाने व आरोग्य केंद्र' : 'Medical & Health Clinics (रुग्णालय)' },
    { id: 'machinery', label: lang === 'MR' ? 'ट्रॅक्टर व कृषी अवजारे' : 'Tractor & Agro Machinery (अवजारे)' },
    { id: 'dairy', label: lang === 'MR' ? 'दुग्ध व डेअरी व्यवसाय' : 'Dairy & Milk Supply (दुग्ध व्यवसाय)' },
    { id: 'kirana', label: lang === 'MR' ? 'किराणा व जनरल स्टोअर्स' : 'Kirana & General Stores' },
    { id: 'hardware', label: lang === 'MR' ? 'हार्डवेअर व बांधकाम साहित्य' : 'Building Materials & Hardware' },
    { id: 'csc', label: lang === 'MR' ? 'आपले सरकार / सीएससी केंद्र' : 'Govt e-Seva & CSC Kiosks' }
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
      badge: b.verificationBadge || (lang === 'MR' ? 'प्रमाणित व्यावसायिक' : 'VERIFIED MERCHANT'),
      rating: String(b.rating || '4.8'),
      ratingCount: b.ratingCount || 50,
      categoryKey,
      image: b.imageUrl || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=600&q=80',
      address: b.address || (lang === 'MR' ? 'आसगाव मुख्य बाजार रस्ता' : 'Asgaon Village Market Road'),
      distance: b.landmark || b.distanceKm || (lang === 'MR' ? 'गाव मध्य' : 'Village Center'),
      owner: b.description ? b.description.split('.')[0] : (lang === 'MR' ? 'प्रमाणित व्यावसायिक' : 'Verified Merchant'),
      phone: b.phone || '9822104500',
      phoneDisplay: `+91 ${b.phone || '98221 04500'}`,
      whatsapp: b.whatsapp || b.phone || '9822104500',
      hours: b.openingHours ? (lang === 'MR' ? `वेळ: ${b.openingHours}` : `Open: ${b.openingHours}`) : (lang === 'MR' ? 'वेळ: स. ०७:३० - रा. ०८:३०' : 'Open: 07:30 AM - 08:30 PM'),
      tags: [(b.category && b.category.name) ? b.category.name : (b.category || (lang === 'MR' ? 'सामान्य व्यवसाय' : 'General Enterprise')), lang === 'MR' ? 'प्रमाणित' : 'Verified'],
      reviews: [
        {
          user: lang === 'MR' ? 'आसगावचे नागरिक' : 'Citizen of Asgaon',
          date: lang === 'MR' ? 'प्रमाणित' : 'Verified',
          comment: b.description || (lang === 'MR' ? 'आसगावमधील प्रमाणित स्थानिक व्यवसाय.' : 'Verified village enterprise in Asgaon.')
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
      const matchesAccredited = !panchayatAccredited || b.badge.toLowerCase().includes('verified') || b.badge.includes('प्रमाणित');
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
        title={lang === 'MR' ? "स्थानिक दुकाने व सेवा निर्देशिका | आसगाव ग्राम पोर्टल" : "Local Business & Service Directory | Asgaon Portal"}
        description={lang === 'MR' ? "आसगाव (पवनी, भंडारा) मधील कृषी केंद्र, दवाखाने, ट्रॅक्टर व कृषी अवजारे, किराणा दुकाने आणि स्थानिक सेवांची संपूर्ण माहिती व संपर्क यादी." : "Verified directory of local businesses, agro krishi stores, medical clinics, tractor machinery, and grocery shops in Asgaon (Pauni, Bhandara). Contact numbers, addresses, opening hours, and direct WhatsApp."}
        keywords="Asgaon businesses, Pauni shops, कृषी केंद्र, दवाखाने, ट्रॅक्टर, किराणा, स्थानिक व्यवसाय, Asgaon market"
        canonicalUrl={`${window.location.origin}/businesses`}
      />

      {/* 1. Breadcrumbs & Verified Status */}
      <Breadcrumb
        items={[
          { label: t('nav_home', 'मुख्यपृष्ठ'), onClick: onNavigateHome },
          { label: t('nav_businesses', 'स्थानिक दुकाने व सेवा'), active: true }
        ]}
        rightBadge={
          <div className="flex items-center gap-1.5 bg-[#bbf7d0] text-[#002117] px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[15px] text-[#002117]">verified_user</span>
            <span>{lang === 'MR' ? 'प्रभाग नागरी ग्राहक मदत केंद्र पडताळणीकृत • आज सकाळी ०८:०० वा. अद्ययावत' : 'Ward Civic Consumer Cell Hotline Verified • Updated today 08:00 AM'}</span>
          </div>
        }
      />

      {/* 2. Hero / Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e8e2d9] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#bbf7d0] text-[#002117] text-[10px] font-extrabold uppercase tracking-wider mb-2">
            {allBusinesses.length} {lang === 'MR' ? 'नोंदणीकृत स्थानिक दुकाने व सेवा केंद्र' : 'VERIFIED LOCAL OUTLETS IN WARD REGISTRY'}
          </span>

          <h1 className="font-heading font-extrabold text-[26px] sm:text-[30px] text-[#166534] leading-tight mb-1">
            {lang === 'MR' ? 'स्थानिक दुकाने व सेवा निर्देशिका' : 'Local Business & Service Directory'}
          </h1>
          <p className="font-heading font-bold text-[15px] text-[#c2410c] mb-3">
            {lang === 'MR' ? 'आसगाव - पवनी तालुका व्यापारी व सेवा केंद्र सूची' : 'Local Business & Service Directory (Asgaon - Pauni Cluster)'}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[12px] font-bold text-[#166534]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
              <span>{lang === 'MR' ? '१००% शून्य-दलाली थेट निर्देशिका' : '100% Zero-Commission Directory'}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
              <span>{lang === 'MR' ? 'थेट फोन आणि व्हॉट्सॲप संपर्क' : 'Direct Phone & WhatsApp'}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
              <span>{lang === 'MR' ? 'स्थानिक प्रभाग पडताळणीकृत दुकाने' : 'Local Ward Verified Outlets'}</span>
            </span>
          </div>
        </div>

        {/* Right CTA Box */}
        <div className="bg-[#052e16] text-white p-5 rounded-2xl border border-[#166534] shadow-sm flex flex-col gap-3 w-full lg:w-72 shrink-0">
          <button
            onClick={onRegisterShop}
            className="w-full py-2.5 px-4 rounded-xl bg-[#c2410c] hover:bg-[#852f00] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_business</span>
            <span>{t('btn_register_shop', lang === 'MR' ? 'दुकान नोंदवा' : 'Register Business')} ({lang === 'MR' ? 'मोफत' : 'FREE'})</span>
          </button>

          <button
            onClick={() => {
              setViewMode(viewMode === 'map' ? 'list' : 'map');
              window.scrollTo({ top: 340, behavior: 'smooth' });
            }}
            className={`w-full py-2 px-4 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              viewMode === 'map'
                ? 'bg-[#bbf7d0] text-[#002117] hover:bg-white'
                : 'bg-white text-[#166534] hover:bg-[#bbf7d0]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            <span>{viewMode === 'map' ? (lang === 'MR' ? 'सूची दृश्य पहा' : 'View List') : (lang === 'MR' ? 'थेट गावाचा नकाशा' : 'Live Map')}</span>
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
              placeholder={lang === 'MR' ? "दुकानाचे नाव, मालक, प्रकार, खूण शोधा (उदा. कृषी केंद्र, किराणा, ट्रॅक्टर दुरुस्ती, डॉक्टर)..." : "Search by shop name, owner, category, landmark (e.g. Krishi, Kirana, Tractor, Clinic)..."}
              className="w-full pl-10 pr-10 py-2.5 bg-[#f9f3ea] text-[#1d1b16] rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
            <button
              type="button"
              onClick={() => alert(lang === 'MR' ? 'व्हॉइस सर्च तयार आहे! बोला...' : 'Voice search ready!')}
              className="absolute right-3 top-2.5 text-[#166534] hover:text-[#052e16]"
              title={lang === 'MR' ? 'व्हॉइस सर्च' : 'Voice Search'}
            >
              <span className="material-symbols-outlined text-[19px]">mic</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            {/* Quick Language Toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === 'MR' ? 'EN' : 'MR')}
              className="px-2.5 py-1.5 rounded-xl text-[12px] font-bold bg-[#f9f3ea] hover:bg-[#e8e2d9] text-[#166534] border border-[#e8e2d9] flex items-center gap-1 transition-all"
              title={lang === 'MR' ? 'Switch to English' : 'मराठीत बदला'}
            >
              <span className="material-symbols-outlined text-[15px]">translate</span>
              <span>{lang === 'MR' ? 'EN' : 'मराठी'}</span>
            </button>

            <span className="text-[12px] font-bold text-[#707974] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">sort</span>
              <span>{lang === 'MR' ? 'क्रमवारी:' : 'Sort By:'}</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f9f3ea] text-[#1d1b16] p-2 rounded-xl text-[12px] font-bold border border-[#e8e2d9] focus:outline-none"
            >
              <option value="nearest">{lang === 'MR' ? 'जवळचे व प्रमाणित प्रथम' : 'Nearest & Verified First'}</option>
              <option value="rating">{lang === 'MR' ? 'रेटिंग: जास्त ते कमी' : 'Rating: High to Low'}</option>
              <option value="name">{lang === 'MR' ? 'अकारविल्हे (A-Z)' : 'Alphabetical (A-Z)'}</option>
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
                  ? 'bg-[#166534] text-white shadow-xs'
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
              className="w-4 h-4 accent-[#166534]"
            />
            <span>{lang === 'MR' ? 'सध्या सुरू' : 'Open Now'}</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={whatsappOnly}
              onChange={(e) => { setWhatsappOnly(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 accent-[#166534]"
            />
            <span>{lang === 'MR' ? 'व्हॉट्सॲप ऑर्डर' : 'WhatsApp Orders'}</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={homeDelivery}
              onChange={(e) => { setHomeDelivery(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 accent-[#166534]"
            />
            <span>{lang === 'MR' ? 'होम डिलिव्हरी' : 'Home Delivery'}</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={panchayatAccredited}
              onChange={(e) => { setPanchayatAccredited(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 accent-[#166534]"
            />
            <span>{lang === 'MR' ? 'प्रमाणित दुकाने' : 'Accredited Outlets'}</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={fssaiOnly}
              onChange={(e) => { setFssaiOnly(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 accent-[#166534]"
            />
            <span>{lang === 'MR' ? 'FSSAI / औषध परवाना' : 'FSSAI / Drug License'}</span>
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
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-[#404945] hover:text-[#166534]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">view_list</span>
                <span>{lang === 'MR' ? 'सूची' : 'List'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('map');
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'map'
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-[#404945] hover:text-[#166534]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">map</span>
                <span>{lang === 'MR' ? 'थेट नकाशा' : 'Live Map'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('both');
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'both'
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'text-[#404945] hover:text-[#166534]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">vertical_split</span>
                <span>{lang === 'MR' ? 'दोन्ही' : 'Both'}</span>
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
              <div className="w-8 h-8 border-3 border-[#166534] border-t-transparent rounded-full animate-spin mb-1" />
              <p className="text-[13px] font-bold text-[#166534]">{lang === 'MR' ? 'डेटाबेसशी जोडत आहे व दुकाने लोड होत आहेत...' : 'Connecting to database & loading businesses...'}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-[#c2410c]">storefront</span>
              <h3 className="font-heading font-bold text-[18px] text-[#166534]">{lang === 'MR' ? 'कोणताही व्यवसाय सापडला नाही' : 'No matching enterprises found'}</h3>
              <p className="text-[13px] text-[#707974] max-w-md">{lang === 'MR' ? 'तुमच्या निवडलेल्या फिल्टरनुसार कोणतीही दुकाने सापडली नाहीत. कृपया फिल्टर बदला किंवा पुन्हा शोधा.' : 'No shops or local services match your selected category and filters. Try clearing some filters or searching with different terms.'}</p>
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
                className="px-4 py-2 bg-[#166534] text-white text-[12px] font-bold rounded-xl hover:bg-[#052e16] transition-colors"
              >
                {lang === 'MR' ? 'सर्व फिल्टर्स रीसेट करा' : 'Reset All Filters'}
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
                  <span className="absolute top-2 left-2 bg-[#166534] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                    {item.badge === 'VERIFIED MERCHANT' ? (lang === 'MR' ? 'प्रमाणित व्यावसायिक' : 'VERIFIED MERCHANT') : item.badge}
                  </span>
                </div>

                {/* Card Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className="font-heading font-bold text-[17px] text-[#1d1b16] hover:text-[#166534] transition-colors leading-snug"
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
                      <div className="flex items-center gap-1 text-[12px] font-bold text-[#c2410c] shrink-0 bg-[#fef9ee] px-1.5 py-0.5 rounded border border-[#fed7aa]">
                        <span>★ {item.rating}</span>
                        <span className="text-[#707974] text-[10px]">({item.ratingCount})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <button
                        type="button"
                        onClick={() => setLocationModalBiz(item)}
                        className="text-[12px] text-[#707974] hover:text-[#166534] flex items-center gap-1 group text-left transition-colors"
                        title={lang === 'MR' ? 'नकाशावर स्थान पहा' : 'Click to view shop location on map'}
                      >
                        <span className="material-symbols-outlined text-[15px] text-[#c2410c] group-hover:scale-110 transition-transform">location_on</span>
                        <span>{item.address} • <strong className="text-[#1d1b16]">{item.distance}</strong></span>
                      </button>
                    </div>

                    <div className="text-[12px] text-[#1d1b16] font-semibold mb-1">
                      <span>{item.owner}</span>
                    </div>

                    <div className="text-[11px] text-[#707974] flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-[14px] text-[#166534]">schedule</span>
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
                        className="px-3 py-1.5 rounded-lg bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>{lang === 'MR' ? 'कॉल करा' : 'Call'}</span>
                      </a>

                      <a
                        href={`https://wa.me/91${item.whatsapp}?text=Hello%20${encodeURIComponent(item.name)},%20I%20saw%20your%20shop%20on%20Digital%20Gaon%20Asgaon.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#166534] text-[12px] font-bold flex items-center gap-1 border border-[#e8e2d9] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px] text-[#25D366]">chat</span>
                        <span>{lang === 'MR' ? 'व्हॉट्सॲप' : 'WhatsApp'}</span>
                      </a>
                      
                      {/* Dedicated Shop Location on Map Button */}
                      <button
                        type="button"
                        onClick={() => setLocationModalBiz(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#fef9ee] hover:bg-[#a63b00] hover:text-white text-[#a63b00] text-[12px] font-bold flex items-center gap-1 border border-[#fed7aa] hover:border-[#a63b00] transition-all shadow-xs"
                        title={lang === 'MR' ? 'दुकानाचे अचूक स्थान नकाशावर पहा' : 'View shop location on map modal'}
                      >
                        <span className="material-symbols-outlined text-[15px]">location_on</span>
                        <span>{lang === 'MR' ? 'स्थान' : 'Location'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleBookmark(item.id, item.name)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        bookmarkedIds.includes(item.id)
                          ? 'text-[#c2410c] bg-[#fed7aa]'
                          : 'text-[#707974] hover:text-[#166534] hover:bg-[#f3ede4]'
                      }`}
                      title={lang === 'MR' ? 'जतन करा (बुकमार्क)' : 'Bookmark this shop'}
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
              {lang === 'MR'
                ? `एकूण ${filtered.length} नोंदणीकृत व्यवसायांपैकी ${filtered.length > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, filtered.length)} दाखवत आहे`
                : `Showing ${filtered.length > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, filtered.length)} of ${filtered.length} registered village enterprises`}
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
                          ? 'bg-[#166534] text-white shadow-xs'
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
          {/* Widget 1: Civic Initiative - Are You a Local Shopkeeper? */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2410c] bg-[#fef9ee] px-2 py-0.5 rounded border border-[#fed7aa]">
              {lang === 'MR' ? 'नागरिक पुढाकार' : 'CIVIC INITIATIVE'}
            </span>

            <h3 className="font-heading font-extrabold text-[16px] text-[#166534] mt-2 mb-2">
              {lang === 'MR' ? 'तुम्ही स्थानिक व्यावसायिक किंवा कारागीर आहात का?' : 'Are You a Local Shopkeeper or Artisan?'}
            </h3>

            <p className="text-[12px] text-[#404945] leading-relaxed mb-4">
              {lang === 'MR'
                ? 'आपल्या दुकानाची माहिती नोंदवा. १४,०००+ स्थानिक नागरिकांपर्यंत थेट पोहोचा, व्हॉट्सॲपवरून थेट ऑर्डर्स मिळवा आणि डिजिटल ओळख मिळवा.'
                : 'List or claim your shop in just 2 minutes. Gain immediate reach to 14,280+ verified local residents, receive WhatsApp orders directly from farmers, and get a verified badge.'}
            </p>

            <ul className="space-y-2 text-[12px] text-[#1d1b16] mb-5">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
                <span>{lang === 'MR' ? 'स्थानिक रहिवाशांसाठी १००% मोफत नोंदणी' : '100% Free Registration for Ward Residents'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
                <span>{lang === 'MR' ? 'दुकानासाठी मोफत डिजिटल क्यूआर कोड' : 'Free QR Code Standee for Your Shop'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
                <span>{lang === 'MR' ? 'नागरिक ऑर्डर्सवर शून्य कमिशन' : 'Zero middleman commission on citizen orders'}</span>
              </li>
            </ul>
          </div>

          {/* Widget 2: Mandi & Local Rates - Gram Sabha Rate Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
                {lang === 'MR' ? 'स्थानिक दर' : 'LOCAL RATES'}
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#707974]">gavel</span>
            </div>

            <h3 className="font-heading font-extrabold text-[15px] text-[#166534] mt-2 mb-1">
              {lang === 'MR' ? 'ग्रामसभा प्रमाणित दरपत्रक' : 'Gram Sabha Rate Card'}
            </h3>
            <p className="text-[11px] text-[#707974] mb-3">
              {lang === 'MR' ? 'ग्रामसभेत ठरवून दिलेले सेवा व मजुरीचे अधिकृत दर (मार्च २०२६):' : 'Standardized service rates agreed upon in the Gram Sabha (March 2026):'}
            </p>

            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">{lang === 'MR' ? 'ट्रॅक्टर नांगरणी (रोटाव्हेटर)' : 'Tractor Tillage (Rotavator)'}</span>
                <span className="font-extrabold text-[#166534]">{lang === 'MR' ? '₹९०० - १,००० / तास' : '₹900 - 1,000 / hr'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">{lang === 'MR' ? 'धान कापणी यंत्र (हार्वेस्टर)' : 'Combine Harvester (Paddy)'}</span>
                <span className="font-extrabold text-[#166534]">{lang === 'MR' ? '₹२,२०० - २,५०० / एकर' : '₹2,200 - 2,500 / ac'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">{lang === 'MR' ? 'दैनिक शेतमजुरी (महिला)' : 'Daily Farm Labour (Female)'}</span>
                <span className="font-extrabold text-[#166534]">{lang === 'MR' ? '₹३५० - ४०० / दिवस' : '₹350 - 400 / day'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">{lang === 'MR' ? 'दैनिक शेतमजुरी (पुरुष)' : 'Daily Farm Labour (Male)'}</span>
                <span className="font-extrabold text-[#166534]">{lang === 'MR' ? '₹४५० - ५०० / दिवस' : '₹450 - 500 / day'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">{lang === 'MR' ? 'गवंडी / मिस्त्री (कुशल बांधकाम)' : 'Mason / Mistri (Skilled Civil)'}</span>
                <span className="font-extrabold text-[#166534]">{lang === 'MR' ? '₹८०० - ९०० / दिवस' : '₹800 - 900 / day'}</span>
              </div>
            </div>

            <button
              onClick={() => alert(lang === 'MR' ? 'अधिकृत ग्रामसभा दरपत्रक डाउनलोड झाले.' : 'Official Gram Sabha Rate Card PDF downloaded.')}
              className="mt-3 text-[12px] text-[#002873] font-bold hover:underline flex items-center gap-1"
            >
              <span>{lang === 'MR' ? 'अधिकृत ग्रामसभा दरपत्रक डाउनलोड करा' : 'Download Official Gram Sabha Rate Card'}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Widget 3: Urgent Village Help - Need an On-Demand Mechanic or Repair? */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ba1a1a] bg-[#fef3c7] px-2 py-0.5 rounded">
              {lang === 'MR' ? 'तातडीची मदत' : 'URGENT VILLAGE HELP'}
            </span>

            <h3 className="font-heading font-extrabold text-[15px] text-[#166534] mt-2 mb-1">
              {lang === 'MR' ? 'मेकॅनिक किंवा दुरुस्ती तंत्रज्ञ हवे आहेत?' : 'Need an On-Demand Mechanic or Repair?'}
            </h3>
            <p className="text-[11px] text-[#707974] mb-3">
              {lang === 'MR' ? 'आसगाव व पवनी परिसरातील २४x७ उपलब्ध तंत्रज्ञ:' : 'Emergency technicians available on-call across Pauni & Asgaon:'}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <a
                href="tel:8888172233"
                className="p-2.5 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9] hover:bg-[#f3ede4] transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-1 text-[#c2410c] font-bold">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>{lang === 'MR' ? 'इलेक्ट्रिशियन' : 'Village Electrician'}</span>
                </div>
                <div className="text-[#1d1b16] font-semibold mt-1">
                  {lang === 'MR' ? 'पांडुरंग माळी' : 'Pandurang Mali'}
                </div>
              </a>

              <a
                href="tel:9765432100"
                className="p-2.5 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9] hover:bg-[#f3ede4] transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-1 text-[#166534] font-bold">
                  <span className="material-symbols-outlined text-[16px]">precision_manufacturing</span>
                  <span>{lang === 'MR' ? 'मोटार रिवायंडिंग' : 'Submersible Motor'}</span>
                </div>
                <div className="text-[#1d1b16] font-semibold mt-1">
                  {lang === 'MR' ? 'किसान रिवायंडिंग' : 'Kisan Rewinding'}
                </div>
              </a>

              <a
                href="tel:9822100000"
                className="p-2.5 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9] hover:bg-[#f3ede4] transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-1 text-[#c2410c] font-bold">
                  <span className="material-symbols-outlined text-[16px]">plumbing</span>
                  <span>{lang === 'MR' ? 'बोअरवेल प्लंबर' : 'Borewell Plumber'}</span>
                </div>
                <div className="text-[#1d1b16] font-semibold mt-1">
                  {lang === 'MR' ? 'लक्ष्मण कांबळे' : 'Laxman Kamble'}
                </div>
              </a>

              <a
                href="tel:108"
                className="p-2.5 rounded-xl bg-[#fef3c7] text-[#93000a] border border-[#fde68a] hover:bg-[#fde68a] transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[16px]">ambulance</span>
                  <span>{lang === 'MR' ? 'रुग्णवाहिका' : 'PHC Ambulance'}</span>
                </div>
                <div className="font-extrabold mt-1">{lang === 'MR' ? '१०८ (२४x७ मोफत)' : '108 (24x7 Free)'}</div>
              </a>
            </div>
          </div>

          {/* Widget 4: Weekly Haat Notice - Asgaon Budhwar Bazaar */}
          <div className="bg-[#f9f3ea] rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e65100] bg-white px-2 py-0.5 rounded border border-[#e8e2d9]">
              {lang === 'MR' ? 'आठवडी बाजार सूचना' : 'WEEKLY HAAT NOTICE'}
            </span>

            <h3 className="font-heading font-extrabold text-[15px] text-[#166534] mt-2 mb-1">
              {lang === 'MR' ? 'आसगाव बुधवार बाजार' : 'Asgaon Budhwar Bazaar'}
            </h3>
            <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
              {lang === 'MR'
                ? 'प्रत्येक बुधवारी जुना बस स्टँड मैदानावर. ८५+ ताजी भाजीपाला दुकाने, कुक्कुटपालन व स्थानिक शेतीमाल.'
                : 'Every Wednesday (बुधवार) at the Old Bus Stand Ground. 85+ fresh vegetable vendors, poultry dealers, and seasonal potters.'}
            </p>

            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#e8e2d9] text-[12px]">
              <span className="font-bold text-[#707974]">{lang === 'MR' ? 'पुढील बाजाराचा वार:' : 'Next Haat Day:'}</span>
              <span className="font-extrabold text-[#c2410c]">{lang === 'MR' ? 'या बुधवारी, सकाळी ०७:०० वा.' : 'This Wednesday, 07:00 AM'}</span>
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
