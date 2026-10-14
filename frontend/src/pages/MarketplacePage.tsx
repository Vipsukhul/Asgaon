import { LucideIcon } from '../components/LucideIcon';
import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';
import { api } from '../services/api';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

interface MarketplacePageProps {
  onNavigateHome?: () => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigateHome }) => {
  const { lang, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'harvest' | 'livestock' | 'machinery' | 'household'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showStallModal, setShowStallModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form states for posting a listing
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('harvest');
  const [newPrice, setNewPrice] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLocation, setNewLocation] = useState('Asgaon');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [extraItems, setExtraItems] = useState<any[]>([]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setUploadError('');
    try {
      const url = await api.uploadImage(file, 'asgaon_marketplace');
      setNewImage(url);
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    api.getMarketplaceListings()
      .then((listings) => {
        if (listings && listings.length > 0) {
          const mapped = listings.map((item: any) => ({
            id: item.id || ('live-' + Math.random()),
            title: item.title,
            badge1: 'Verified Listing',
            badge2: item.status || 'Active',
            statusTag: 'Direct from Village',
            price: item.price || '₹500',
            unit: '',
            desc: item.description || 'Available in Asgaon village',
            seller: item.sellerName || 'Local Farmer',
            sellerRole: item.villageLocation || 'Asgaon',
            phone: item.contactPhone || '9876543210',
            image: item.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
            category: item.category ? item.category.toLowerCase() : 'harvest'
          }));
          setExtraItems(mapped);
        }
      })
      .catch((err) => console.log('Marketplace cache fallback:', err.message));
  }, []);

  const harvestCount = extraItems.filter(e => !e.category || e.category === 'harvest').length;
  const livestockCount = extraItems.filter(e => e.category === 'livestock').length;
  const machineryCount = extraItems.filter(e => e.category === 'machinery').length;
  const householdCount = extraItems.filter(e => e.category === 'household').length;

  const matchesSearch = (e: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (e.title && e.title.toLowerCase().includes(q)) ||
      (e.desc && e.desc.toLowerCase().includes(q)) ||
      (e.seller && e.seller.toLowerCase().includes(q)) ||
      (e.price && e.price.toLowerCase().includes(q))
    );
  };

  const matchesVerified = (e: any) => {
    if (!verifiedOnly) return true;
    return (
      (e.badge1 && e.badge1.toLowerCase().includes('verif')) ||
      (e.badge2 && e.badge2.toLowerCase().includes('verif')) ||
      (e.statusTag && e.statusTag.toLowerCase().includes('village'))
    );
  };

  const allHarvest = extraItems
    .filter(e => !e.category || e.category === 'harvest')
    .filter(matchesSearch)
    .filter(matchesVerified);

  const allLivestock = extraItems
    .filter(e => e.category === 'livestock')
    .filter(matchesSearch)
    .filter(matchesVerified)
    .map(l => ({
      id: l.id,
      title: l.title,
      badge: 'DIRECT DAIRY / CATTLE',
      healthTag: 'Vaccinated & Verified',
      subBadge: 'Available in Village',
      price: l.price,
      priceUnit: '',
      desc: l.desc,
      location: `${l.seller} • ${l.sellerRole}`,
      phone: l.phone,
      image: l.image || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80'
    }));

  const allMachinery = extraItems
    .filter(e => e.category === 'machinery')
    .filter(matchesSearch)
    .filter(matchesVerified)
    .map(m => ({
      id: m.id,
      title: m.title,
      badge: 'AGRI EQUIPMENT',
      price: m.price,
      specs: ['Verified by Village Desk', 'Direct Farmer Settlement', 'Zero Dealer Commission'],
      location: `${m.seller} • ${m.sellerRole}`,
      phone: m.phone,
      image: m.image || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
    }));

  const allHousehold = extraItems
    .filter(e => e.category === 'household')
    .filter(matchesSearch)
    .filter(matchesVerified)
    .map(h => ({
      id: h.id,
      title: h.title,
      badge: 'VILLAGE ITEM',
      price: h.price,
      desc: h.desc,
      location: `${h.seller} • ${h.sellerRole}`,
      phone: h.phone,
      image: h.image || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
    }));

  const totalVisible =
    (activeFilter === 'all' || activeFilter === 'harvest' ? allHarvest.length : 0) +
    (activeFilter === 'all' || activeFilter === 'livestock' ? allLivestock.length : 0) +
    (activeFilter === 'all' || activeFilter === 'machinery' ? allMachinery.length : 0) +
    (activeFilter === 'all' || activeFilter === 'household' ? allHousehold.length : 0);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(totalVisible / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showPostModal) {
      const fallbackImage = newCategory === 'livestock'
        ? 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80'
        : newCategory === 'machinery'
        ? 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
        : newCategory === 'household'
        ? 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80';

      const finalImg = newImage || fallbackImage;

      try {
        const parsedPrice = parseFloat(newPrice.replace(/[^0-9.]/g, '')) || 500;
        await api.createMarketplaceListing({
          titleEn: newTitle,
          category: newCategory,
          price: parsedPrice,
          sellerName: 'Local Resident',
          sellerPhone: newPhone || '9876543210',
          villageName: newLocation || 'Asgaon',
          descriptionEn: newDesc,
          imageUrl: finalImg
        });

        setExtraItems(prev => [{
          id: 'live-' + Date.now(),
          title: newTitle,
          badge1: 'Verified Listing',
          badge2: 'Active',
          statusTag: 'Direct from Village',
          price: '₹' + newPrice,
          unit: '',
          desc: newDesc,
          seller: 'Local Resident',
          sellerRole: 'Direct • ' + (newLocation || 'Asgaon'),
          phone: newPhone || '9876543210',
          image: finalImg,
          category: newCategory.toLowerCase()
        }, ...prev]);
      } catch (err: any) {
        console.error('Error creating marketplace listing:', err.message);
      }
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowPostModal(false);
      setShowStallModal(false);
      setNewImage('');
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      

      {/* 2. BREADCRUMB & PLATFORM BADGE */}
      <Breadcrumb
        items={[
          { label: t('nav_home'), onClick: onNavigateHome },
          { label: t('nav_marketplace'), active: true }
        ]}
      />

      {/* 3. HERO BANNER */}
      <div className="bg-gradient-to-br from-[#166534]/5 via-white to-[#166534]/10 rounded-2xl p-6 sm:p-8 border border-[#c4d6cf] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          
          <h1 className="font-heading font-extrabold text-[26px] sm:text-[30px] text-[#166534] leading-tight mb-2">
            {lang === 'MR' ? 'गाव बाजारपेठ — शेतमाल, पशुधन व अवजारे' : 'Gaon Marketplace — Local Farm Produce & Village Bazar'}
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#404945] max-w-2xl leading-relaxed">
            {lang === 'MR'
              ? 'आसगाव व परिसरातील गावांमधील थेट शेतमाल, जनावरे, ट्रॅक्टर, बियाणे आणि शेती अवजारे खरेदी-विक्री मंच.'
              : 'Buy, sell, and rent directly within Asgaon and neighboring villages. Farm crops, livestock, tractors, seed batches, and tools with zero broker cuts.'}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
          <button
            onClick={() => setShowPostModal(true)}
            className="px-5 py-3 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[13px] font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <LucideIcon name="add_circle" className="text-[18px]" />
            <span>{lang === 'MR' ? '+ मोफत शेतमाल/वस्तू नोंदवा' : '+ Post a Free Village Listing'}</span>
          </button>
        </div>
      </div>

      {/* 4. SEARCH & UNIFIED FILTER ROW */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1">
            <LucideIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-[18px]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={lang === 'MR' ? 'वस्तू किंवा शेतमाल शोधा (उदा. सोयाबीन, गाय, ट्रॅक्टर)...' : 'Search marketplace (e.g. Soybean, Cattle, Tractor)...'}
              className="w-full pl-9 pr-9 py-2.5 bg-[#f9f3ea] text-[#1a1c1b] placeholder-[#707974] rounded-xl text-xs sm:text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#707974] hover:text-[#1d1b16]"
                aria-label="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Corporate Filter Icon Button in Flex */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className={`relative shrink-0 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all shadow-xs ${
              (activeFilter !== 'all' || verifiedOnly)
                ? 'bg-[#166534] text-white border-[#166534] ring-2 ring-[#166534]/20'
                : 'bg-[#f4efe8] text-[#1d1b16] border-[#e8e2d9] hover:bg-[#eae2d7]'
            }`}
            aria-label="Filter Marketplace"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'MR' ? 'फिल्टर' : 'Filter'}</span>
            {((activeFilter !== 'all' ? 1 : 0) + (verifiedOnly ? 1 : 0)) > 0 && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-stone-900 text-[10px] sm:text-[11px] font-black flex items-center justify-center">
                {(activeFilter !== 'all' ? 1 : 0) + (verifiedOnly ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Chips (Micro Row) */}
        {((activeFilter !== 'all' ? 1 : 0) + (verifiedOnly ? 1 : 0)) > 0 && (
          <div className="pt-2 border-t border-[#f0eee8] flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] font-medium text-[#707974]">
              {lang === 'MR' ? 'सक्रिय फिल्टर्स:' : 'Active:'}
            </span>
            {activeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
                {activeFilter === 'harvest' ? (lang === 'MR' ? 'थेट शेतमाल' : 'Farm Harvest') :
                 activeFilter === 'livestock' ? (lang === 'MR' ? 'पशुधन व जनावरे' : 'Livestock') :
                 activeFilter === 'machinery' ? (lang === 'MR' ? 'ट्रॅक्टर व अवजारे' : 'Machinery') :
                 (lang === 'MR' ? 'घरगुती वस्तू' : 'Household')}
                <button onClick={() => { setActiveFilter('all'); setCurrentPage(1); }} className="hover:opacity-70 ml-0.5" aria-label="Clear category">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {verifiedOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
                {lang === 'MR' ? 'प्रमाणित नोंदी' : 'Verified Listings'}
                <button onClick={() => { setVerifiedOnly(false); setCurrentPage(1); }} className="hover:opacity-70 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setActiveFilter('all');
                setVerifiedOnly(false);
                setCurrentPage(1);
              }}
              className="text-[11px] font-bold text-[#c2410c] hover:underline ml-1"
            >
              {lang === 'MR' ? 'सर्व काढा' : 'Clear all'}
            </button>
          </div>
        )}
      </div>

      {/* Corporate Filter Modal / Bottom Sheet */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#e8e2d9] flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#e8e2d9] flex items-center justify-between bg-[#fdfbf7]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e8f1ec] text-[#166534] flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1d1b16]">
                    {lang === 'MR' ? 'बाजारपेठ फिल्टर्स' : 'Filter Marketplace'}
                  </h3>
                  <p className="text-[11px] text-[#707974]">
                    {lang === 'MR' ? 'शेतमाल, पशुधन व अवजारांनुसार शोधा' : 'Filter by category and verified status'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f4efe8] hover:bg-[#eae2d7] text-[#707974] hover:text-[#1d1b16] flex items-center justify-center transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-sm">
              {/* Category Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-[#1d1b16] uppercase tracking-wider">
                    {lang === 'MR' ? '१. वस्तू व शेतमाल प्रवर्ग' : '1. Marketplace Category'}
                  </span>
                  {activeFilter !== 'all' && (
                    <button
                      onClick={() => { setActiveFilter('all'); setCurrentPage(1); }}
                      className="text-[11px] text-[#c2410c] font-semibold hover:underline"
                    >
                      {lang === 'MR' ? 'सर्व दाखवा' : 'Reset'}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: lang === 'MR' ? 'सर्व नोंदी' : 'All Listings', count: extraItems.length },
                    { id: 'harvest', label: lang === 'MR' ? 'थेट शेतमाल' : 'Farm Harvest', count: harvestCount },
                    { id: 'livestock', label: lang === 'MR' ? 'पशुधन व जनावरे' : 'Cattle & Livestock', count: livestockCount },
                    { id: 'machinery', label: lang === 'MR' ? 'ट्रॅक्टर व अवजारे' : 'Tractors & Machinery', count: machineryCount },
                    { id: 'household', label: lang === 'MR' ? 'घरगुती साधने' : 'Household Goods', count: householdCount }
                  ].map((cat) => {
                    const isSelected = activeFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setActiveFilter(cat.id as any); setCurrentPage(1); }}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                            : 'bg-[#fdfbf7] text-[#404945] border-[#e8e2d9] hover:bg-[#f4efe8]'
                        }`}
                      >
                        <span className="truncate">{cat.label} ({cat.count})</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verified Filter Section */}
              <div>
                <span className="text-xs font-bold text-[#1d1b16] uppercase tracking-wider block mb-2.5">
                  {lang === 'MR' ? '२. पडताळणी स्थिती' : '2. Verification Status'}
                </span>
                <button
                  onClick={() => { setVerifiedOnly(!verifiedOnly); setCurrentPage(1); }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                    verifiedOnly
                      ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                      : 'bg-[#fdfbf7] text-[#404945] border-[#e8e2d9] hover:bg-[#f4efe8]'
                  }`}
                >
                  <span>{lang === 'MR' ? 'फक्त प्रमाणित शेतकरी व विक्रेते (Verified Only)' : 'Verified Local Sellers Only'}</span>
                  {verifiedOnly && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-300" />}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#e8e2d9] bg-[#f9f3ea] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setVerifiedOnly(false);
                  setCurrentPage(1);
                }}
                disabled={activeFilter === 'all' && !verifiedOnly}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  (activeFilter !== 'all' || verifiedOnly)
                    ? 'text-[#c2410c] hover:bg-orange-100/60'
                    : 'text-stone-400 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'MR' ? 'सर्व रीसेट' : 'Clear All'}</span>
              </button>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#166534] text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-[#14532d] transition-all flex items-center justify-center gap-2"
              >
                <span>{lang === 'MR' ? 'नोंदी दाखवा' : 'Show Listings'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: LISTINGS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {totalVisible === 0 && (
            <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <LucideIcon name="storefront" className="text-[48px] text-[#c2410c]" />
              <h3 className="font-heading font-bold text-[18px] text-[#166534]">
                {lang === 'MR' ? 'कोणतीही नोंद सापडली नाही' : 'No matching marketplace listings'}
              </h3>
              <p className="text-[13px] text-[#707974] max-w-md">
                {lang === 'MR' ? 'तुमच्या शोधानुसार किंवा फिल्टरनुसार कोणताही शेतमाल किंवा वस्तू उपलब्ध नाही.' : 'No agricultural produce, livestock, or machinery matches your search query.'}
              </p>
              <button
                onClick={() => { setActiveFilter('all'); setSearchQuery(''); setVerifiedOnly(false); setCurrentPage(1); }}
                className="px-4 py-2 bg-[#166534] text-white text-[12px] font-bold rounded-xl hover:bg-[#052e16] transition-colors"
              >
                {lang === 'MR' ? 'सर्व फिल्टर रीसेट करा' : 'Reset All Filters'}
              </button>
            </div>
          )}

          {/* SECTION 1: FRESH FARM HARVEST */}
          {(activeFilter === 'all' || activeFilter === 'harvest') && allHarvest.length > 0 && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#006a4e] tracking-wider uppercase">
                    {lang === 'MR' ? 'थेट शेतमाल • शून्य मध्यस्थ' : 'DIRECT HARVEST • NO MIDDLEMAN SPREAD'}
                  </span>
                  <h2 className="font-heading font-extrabold text-[20px] text-[#166534]">
                    {lang === 'MR' ? 'थेट शेतकऱ्यांकडून ताजा शेतमाल' : 'Fresh Farm Harvest Direct from Growers'}
                  </h2>
                  <p className="text-[12px] text-[#707974]">
                    {lang === 'MR' ? 'आसगाव व परिसरातील शेतातील थेट उत्पादन व बियाणे' : 'Harvested produce ready for bulk & retail pickup in the region'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveFilter('harvest')}
                  className="text-[12px] font-bold text-[#006a4e] hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>{lang === 'MR' ? `सर्व शेतमाल पहा (${allHarvest.length})` : `View ${allHarvest.length} Lots`}</span>
                  <LucideIcon name="arrow_forward" className="text-[14px]" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allHarvest.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#e8e2d9] rounded-xl overflow-hidden card-hover-subtle shadow-xs flex flex-col justify-between bg-white"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-[#f3ede4] overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                          <span className="bg-[#166534]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {item.badge1}
                          </span>
                          <span className="bg-white/90 text-[#166534] text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {item.badge2}
                          </span>
                        </div>
                        <span className="absolute bottom-2.5 right-2.5 bg-[#c2410c] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                          {item.statusTag}
                        </span>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-heading font-bold text-[15px] text-[#166534] leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-[20px] font-black text-[#c2410c]">{item.price}</span>
                          <span className="text-[11px] text-[#707974]">{item.unit}</span>
                        </div>
                        <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
                          {item.desc}
                        </p>

                        <div className="flex items-center gap-2 p-2 bg-[#f3ede4]/40 rounded-lg text-[11px]">
                          <LucideIcon name="account_circle" className="text-[16px] text-[#006a4e]" />
                          <div className="truncate">
                            <strong className="text-[#166534] block truncate">{item.seller}</strong>
                            <span className="text-[#707974] text-[10px] block truncate">{item.sellerRole}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="py-2 px-3 bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LucideIcon name="call" className="text-[14px]" />
                        <span>{lang === 'MR' ? 'कॉल करा' : 'Call Seller'}</span>
                      </a>
                      <a
                        href={`https://wa.me/91${item.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 border border-[#006a4e] text-[#006a4e] hover:bg-[#e8f1ec]/60 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LucideIcon name="chat" className="text-[14px]" />
                        <span>{lang === 'MR' ? 'व्हॉट्सअ‍ॅप' : 'WhatsApp'}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: VILLAGE LIVESTOCK & CATTLE BAZAR */}
          {(activeFilter === 'all' || activeFilter === 'livestock') && allLivestock.length > 0 && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#c2410c] tracking-wider uppercase">
                    {lang === 'MR' ? 'तपासणी केलेले पशुधन • थेट शेतकरी व्यवहार' : 'VET-INSPECTED • Safe for Farmer Transfer'}
                  </span>
                  <h2 className="font-heading font-extrabold text-[20px] text-[#166534]">
                    {lang === 'MR' ? 'स्थानिक पशुधन व जनावरे बाजार' : 'Village Livestock & Cattle Bazar'}
                  </h2>
                  <p className="text-[12px] text-[#707974]">
                    {lang === 'MR' ? 'गाय, म्हैस, बैल आणि शेळी खरेदी-विक्री' : 'Cows, bulls, buffaloes, and backyard livestock'}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#006a4e] bg-[#e8f1ec] px-3 py-1 rounded-full border border-[#cadbcf] self-start sm:self-auto">
                  {allLivestock.length} {lang === 'MR' ? 'पशुधन नोंदी' : 'Live Cattle Records'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allLivestock.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#e8e2d9] rounded-xl overflow-hidden card-hover-subtle shadow-xs flex flex-col justify-between bg-white"
                  >
                    <div>
                      <div className="relative h-40 w-full bg-[#f3ede4] overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#166534]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {item.healthTag}
                        </span>
                        <span className="absolute bottom-2 left-2 bg-white/90 text-[#166534] text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {item.subBadge}
                        </span>
                      </div>

                      <div className="p-3.5">
                        <span className="inline-block text-[9px] font-bold uppercase text-[#c2410c] tracking-wide mb-1">
                          {item.badge}
                        </span>
                        <h3 className="font-heading font-bold text-[14px] text-[#166534] leading-snug mb-1">
                          {item.title}
                        </h3>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-[18px] font-black text-[#c2410c]">{item.price}</span>
                          {item.priceUnit && (
                            <span className="text-[10px] text-[#707974]">{item.priceUnit}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#404945] leading-relaxed line-clamp-3 mb-2.5">
                          {item.desc}
                        </p>
                        <p className="text-[10px] text-[#707974] bg-[#f3ede4]/50 p-1.5 rounded truncate">
                          {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 pt-0">
                      <a
                        href={`tel:${item.phone}`}
                        className="w-full py-2 bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LucideIcon name="call" className="text-[14px]" />
                        <span>{lang === 'MR' ? 'मालकाशी संपर्क' : 'Contact Owner'}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: PRE-OWNED TRACTORS & IMPLEMENTS */}
          {(activeFilter === 'all' || activeFilter === 'machinery') && allMachinery.length > 0 && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
              <div className="border-b border-[#f3ede4] pb-4">
                <span className="text-[10px] font-bold text-[#006a4e] tracking-wider uppercase">
                  {lang === 'MR' ? 'कृषी यंत्रे • थेट शेतकरी व्यवहार' : 'HEAVY MACHINERY • No Dealer Commissions'}
                </span>
                <h2 className="font-heading font-extrabold text-[20px] text-[#166534]">
                  {lang === 'MR' ? 'वापरलेले ट्रॅक्टर व शेती अवजारे' : 'Pre-Owned Tractors & Implements'}
                </h2>
                <p className="text-[12px] text-[#707974]">
                  {lang === 'MR' ? 'रोटाव्हेटर, नांगर, ट्रॉली व पेरणी यंत्रे — अधिकृत मालकी' : 'Inspected machinery with authentic ownership records'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allMachinery.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#e8e2d9] rounded-xl overflow-hidden card-hover-subtle shadow-xs flex flex-col justify-between bg-white"
                  >
                    <div>
                      <div className="relative h-40 w-full bg-[#f3ede4] overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#166534]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {item.badge}
                        </span>
                      </div>

                      <div className="p-3.5">
                        <h3 className="font-heading font-bold text-[14px] text-[#166534] leading-snug mb-1">
                          {item.title}
                        </h3>
                        <div className="text-[18px] font-black text-[#c2410c] mb-2">{item.price}</div>
                        <ul className="text-[11px] text-[#404945] flex flex-col gap-1 mb-3">
                          {item.specs.map((spec, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <LucideIcon name="check_circle" className="text-[13px] text-[#006a4e] mt-0.5" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-[10px] text-[#707974] bg-[#f3ede4]/50 p-1.5 rounded truncate">
                          {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 pt-0">
                      <a
                        href={`tel:${item.phone}`}
                        className="w-full py-2 bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LucideIcon name="call" className="text-[14px]" />
                        <span>{lang === 'MR' ? 'मालकाशी बोला' : 'Connect Seller'}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: HOUSEHOLD & SMALL ENTERPRISE GOODS */}
          {(activeFilter === 'all' || activeFilter === 'household') && allHousehold.length > 0 && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
              <div className="border-b border-[#f3ede4] pb-4">
                <span className="text-[10px] font-bold text-[#c2410c] tracking-wider uppercase">
                  {lang === 'MR' ? 'स्थानिक खरेदी-विक्री' : 'VILLAGE RESALE • Verified Local Owners'}
                </span>
                <h2 className="font-heading font-extrabold text-[20px] text-[#166534]">
                  {lang === 'MR' ? 'घरगुती वस्तू व लघुउद्योग साधने' : 'Household & Small Enterprise Goods'}
                </h2>
                <p className="text-[12px] text-[#707974]">
                  {lang === 'MR' ? 'गावपातळीवरील उपयुक्त वस्तू, उपकरणे व साधने' : 'Locally verified household and small business items'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allHousehold.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#e8e2d9] rounded-xl overflow-hidden card-hover-subtle shadow-xs flex flex-col justify-between bg-white"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-[#f3ede4] overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {item.badge}
                        </span>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-heading font-bold text-[15px] text-[#166534]">
                            {item.title}
                          </h3>
                          <span className="text-[18px] font-black text-[#c2410c] shrink-0">{item.price}</span>
                        </div>
                        <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
                          {item.desc}
                        </p>
                        <p className="text-[10px] text-[#707974] bg-[#f3ede4]/50 p-1.5 rounded truncate">
                          {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="py-2 px-3 bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LucideIcon name="call" className="text-[14px]" />
                        <span>{lang === 'MR' ? 'कॉल करा' : 'Call Owner'}</span>
                      </a>
                      <a
                        href={`https://wa.me/91${item.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 border border-[#006a4e] text-[#006a4e] hover:bg-[#e8f1ec]/60 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LucideIcon name="chat" className="text-[14px]" />
                        <span>{lang === 'MR' ? 'चॅट' : 'Chat'}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Pagination Strip */}
          <div className="bg-white rounded-xl p-3 border border-[#e8e2d9] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#707974] gap-2 mt-2">
            <span>
              {lang === 'MR'
                ? `एकूण ${totalVisible} पैकी ${totalVisible > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, totalVisible)} नोंदी दाखवत आहे`
                : `Showing ${totalVisible > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, totalVisible)} of ${totalVisible} village listings`}
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
        </div>

        {/* RIGHT SIDEBAR COLUMN: 4 WIDGETS (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* WIDGET 1: MARKETPLACE SAFE GUIDELINES */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-[#f3ede4] pb-3">
              <LucideIcon name="verified_user" className="text-[#006a4e] text-[22px]" />
              <div>
                <h3 className="font-heading font-bold text-[14px] text-[#166534]">
                  {lang === 'MR' ? 'बाजारातील सुरक्षित खरेदी-विक्री नियम' : 'Marketplace Safe Guidelines'}
                </h3>
                <span className="text-[10px] text-[#707974]">
                  {lang === 'MR' ? 'गाव पडताळणी सुरक्षित सल्ला' : 'Gram Gaon Verified Safe Advice'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-[#fef9ee] p-3 rounded-xl border border-[#fde68a] flex items-start gap-2.5">
                <LucideIcon name="wb_sunny" className="text-[#c2410c] text-[18px] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[12px] text-[#c2410c]">
                    {lang === 'MR' ? 'दिवसा उजेडात प्रत्यक्ष तपासणी' : 'Daylight Inspection'}
                  </h4>
                  <p className="text-[11px] text-[#404945] leading-relaxed">
                    {lang === 'MR'
                      ? 'जनावरे, ट्रॅक्टर आणि धान्याची गुणवत्ता नेहमी दिवसा उजेडात विक्रेत्याच्या शेतात किंवा घरी प्रत्यक्ष तपासा.'
                      : "Always inspect cattle, tractors, and grain quality in daylight at the seller's farm or residence."}
                  </p>
                </div>
              </div>

              <div className="bg-[#fef9ee] p-3 rounded-xl border border-[#fde68a] flex items-start gap-2.5">
                <LucideIcon name="do_not_disturb_on" className="text-[#ba1a1a] text-[18px] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[12px] text-[#ba1a1a]">
                    {lang === 'MR' ? 'आगाऊ UPI पैसे पाठवू नका' : 'Zero Advance UPI'}
                  </h4>
                  <p className="text-[11px] text-[#404945] leading-relaxed">
                    {lang === 'MR'
                      ? 'मालाची प्रत्यक्ष पाहणी करण्यापूर्वी Google Pay किंवा PhonePe द्वारे कधीही आगाऊ रक्कम पाठवू नका.'
                      : 'Never transfer advance money via Google Pay or PhonePe before seeing the goods in person.'}
                  </p>
                </div>
              </div>

              <div className="bg-[#fef9ee] p-3 rounded-xl border border-[#fde68a] flex items-start gap-2.5">
                <LucideIcon name="scale" className="text-[#006a4e] text-[18px] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[12px] text-[#006a4e]">
                    {lang === 'MR' ? 'अधिकृत धर्म काटा वजन पावती' : 'Verify Haat Weighing Tag'}
                  </h4>
                  <p className="text-[11px] text-[#404945] leading-relaxed">
                    {lang === 'MR'
                      ? 'मोठ्या शेतमालाच्या व्यवहारासाठी पौनी पोर्टल प्रमाणित धर्म काटा वजन पावती अवश्य मागा.'
                      : 'For bulk harvest check, insist on receipt for testing certified by the weighbridge tag on the Pauni portal.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f3ede4] flex items-center justify-between text-[11px] text-[#707974]">
              <span className="flex items-center gap-1">
                <LucideIcon name="call" className="text-[14px]" />
                <span>{lang === 'MR' ? 'कृषी हेल्पलाईन:' : 'Toll Free Krishi Desk:'}</span>
              </span>
              <strong className="text-[#166534]">07185-221101</strong>
            </div>
          </div>

          {/* WIDGET 2: WEEKLY HAAT BANNER & MAP */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#f3ede4] pb-3">
              <div>
                <span className="text-[9px] font-black uppercase text-[#c2410c] tracking-wider">
                  {lang === 'MR' ? 'आठवडे बाजार' : 'WEEKLY HAAT'}
                </span>
                <h3 className="font-heading font-extrabold text-[15px] text-[#166534]">
                  {lang === 'MR' ? 'असगाव शुक्रवार बाजार' : 'Asgaon Friday Bazaar'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#006a4e] bg-[#e8f1ec] px-2 py-0.5 rounded border border-[#cadbcf]">
                {lang === 'MR' ? 'दर शुक्रवारी' : 'Every Friday'}
              </span>
            </div>

            <div className="text-[11px] text-[#55605a]">
              {lang === 'MR'
                ? 'जुना बस स्टँड मैदान • सकाळी ०७:०० ते दुपारी ०२:००'
                : 'Old Bus Stand Ground • 07:00 AM – 02:00 PM'}
            </div>

            {/* Map visual card */}
            <div className="relative rounded-xl overflow-hidden border border-[#c4d6cf] h-32 bg-[#e2eee9] flex flex-col items-center justify-center p-3 text-center">
              <LucideIcon name="map" className="text-[32px] text-[#006a4e] mb-1" />
              <span className="font-bold text-[11px] text-[#166534]">
                {lang === 'MR' ? 'जुना बस स्टँड मैदान • ४२ ओटे/गाळे उपलब्ध' : 'Old Bus Stand Ground • 42 Stalls Allocated'}
              </span>
              <span className="text-[10px] text-[#55605a]">
                {lang === 'MR' ? 'पौनी-भंडारा राज्य महामार्ग ३५२ जंक्शन' : 'Pauni-Bhandara State Highway 352 Junction'}
              </span>
            </div>

            <div className="bg-[#f3ede4]/60 p-2.5 rounded-xl text-[10px] text-[#404945] flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span>{lang === 'MR' ? 'स्थानिक शेतकरी व बचत गट:' : 'Local Farmers & Self-Help Groups:'}</span>
                <strong className="text-[#006a4e]">{lang === 'MR' ? 'मोफत गाळा' : 'FREE / Stall'}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>{lang === 'MR' ? 'बाहेरील व्यावसायिक विक्रेते:' : 'Outside Commercial Vendors:'}</span>
                <strong className="text-[#c2410c]">{lang === 'MR' ? '₹५० शुल्क / दिवस' : '₹50 Stall Fee / Day'}</strong>
              </div>
            </div>

            <button
              onClick={() => setShowStallModal(true)}
              className="w-full py-2.5 bg-[#c2410c] hover:bg-[#852f00] text-white text-[12px] font-bold rounded-xl transition-all shadow-xs"
            >
              {lang === 'MR' ? 'शेतकऱ्यांसाठी मोफत गाळा बुक करा' : 'Book Free Farmer Stall Space'}
            </button>
          </div>

          {/* WIDGET 3: APMC COMPUTERIZED WEIGHBRIDGE */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#f3ede4] pb-3">
              <LucideIcon name="scale" className="text-[#006a4e] text-[20px]" />
              <div>
                <span className="text-[9px] font-bold text-[#006a4e] uppercase tracking-wider block">
                  {lang === 'MR' ? 'एपीएमसी प्रमाणित' : 'APMC CERTIFIED'}
                </span>
                <h3 className="font-heading font-bold text-[14px] text-[#166534]">
                  {lang === 'MR' ? 'संगणकीकृत धर्म काटा (इलेक्ट्रॉनिक वजन)' : 'Computerized Weighbridge (धर्म काटा)'}
                </h3>
              </div>
            </div>

            <p className="text-[11px] text-[#404945] leading-relaxed">
              {lang === 'MR'
                ? 'चुकीच्या वजनामुळे होणारे नुकसान टाळा. असगावपासून पौनी रस्त्यावर अवघ्या १.५ किमी अंतरावर ६० टनी इलेक्ट्रॉनिक धर्म काटा.'
                : 'Avoid faulty scale losses. Electronic 60-ton weighbridge just 1.5 km from Asgaon on Pauni road.'}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#f3ede4]/40 p-2.5 rounded-xl">
              <div>
                <span className="text-[10px] text-[#707974] block">
                  {lang === 'MR' ? 'ट्रॅक्टर / ट्रॉली' : 'Tractor / Trolley'}
                </span>
                <strong className="text-[#166534]">
                  {lang === 'MR' ? '६० क्विंटलपर्यंत: ₹५०' : 'Up to 60 Quintals: ₹50'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-[#707974] block">
                  {lang === 'MR' ? '१०-चाकी ट्रक' : '10-Wheeler Truck'}
                </span>
                <strong className="text-[#166534]">
                  {lang === 'MR' ? '₹१०० (हमीभाव पावतीसह)' : '₹100 (incl. MSP Receipt)'}
                </strong>
              </div>
            </div>

            <div className="text-[10px] text-[#707974]">
              {lang === 'MR' ? 'वेळ: ' : 'Hours: '}
              <strong className="text-[#166534]">
                {lang === 'MR' ? 'दररोज सकाळी ०७:०० ते रात्री ०८:००' : 'Open 07:00 AM – 08:00 PM Daily'}
              </strong>
            </div>

            <a
              href="tel:9370488102"
              className="w-full py-2 border border-[#006a4e] text-[#006a4e] hover:bg-[#e8f1ec]/60 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <LucideIcon name="call" className="text-[14px]" />
              <span>
                {lang === 'MR' ? 'धर्म काटा प्रमुख' : 'Call Weighbridge In-charge'}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* MODAL 1: POST A FREE VILLAGE LISTING */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4]"
            >
              <LucideIcon name="close" className="text-[20px]" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <LucideIcon name="post_add" className="text-[#006a4e] text-[24px]" />
              <div>
                <h3 className="font-heading font-extrabold text-[18px] text-[#166534]">
                  {lang === 'MR' ? 'मोफत गाव जाहिरात नोंदवा' : 'Post a Free Village Listing'}
                </h3>
                <span className="text-[11px] text-[#707974]">
                  {lang === 'MR'
                    ? 'असगाव गाव बाजार थेट शेतकरी-ग्राहक व्यासपीठ'
                    : 'Asgaon Gaon Bazaar Direct Seller Platform'}
                </span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-[#e8f1ec] border border-[#006a4e] rounded-xl p-4 text-center">
                <LucideIcon name="check_circle" className="text-[#006a4e] text-[40px] mb-2" />
                <h4 className="font-bold text-[15px] text-[#166534]">
                  {lang === 'MR' ? 'जाहिरात यशस्वीरित्या प्रकाशित झाली!' : 'Listing Published Successfully!'}
                </h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  {lang === 'MR'
                    ? 'तुमची जाहिरात आता सक्रिय असून सर्व गावकरी आणि परिसरातील खरेदीदारांना दिसत आहे.'
                    : 'Your listing is now active and visible to all villagers and nearby traders.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'वस्तूचे नाव / शेतमाल प्रकार' : 'Item Title / Commodity Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={
                      lang === 'MR'
                        ? 'उदा. जेएस ३३५ सोयाबीन बियाणे / मुऱ्हा म्हैस / ६ फूट रोटाव्हेटर'
                        : 'e.g. JS335 Soybean Seeds / Murrah Buffalo / 6ft Rotavator'
                    }
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#166534] block mb-1">
                      {lang === 'MR' ? 'श्रेणी' : 'Category'}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                    >
                      <option value="harvest">{lang === 'MR' ? 'शेतमाल' : 'Farm Harvest'}</option>
                      <option value="livestock">{lang === 'MR' ? 'पशुधन' : 'Livestock & Cattle'}</option>
                      <option value="machinery">{lang === 'MR' ? 'अवजारे' : 'Tractors & Implements'}</option>
                      <option value="household">{lang === 'MR' ? 'घरगुती सामान' : 'Household Goods'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#166534] block mb-1">
                      {lang === 'MR' ? 'अपेक्षित किंमत (₹)' : 'Expected Price (₹)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder={lang === 'MR' ? 'उदा. ₹४,८५० / क्विंटल किंवा ₹८२,०००' : 'e.g. ₹4,850 / Quintal or ₹82,000'}
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#166534] block mb-1">
                      {lang === 'MR' ? 'मोबाईल / व्हॉट्सअ‍ॅप नंबर' : 'Mobile / WhatsApp Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder={lang === 'MR' ? '१०-अंकी मोबाईल नंबर' : '10-digit mobile number'}
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#166534] block mb-1">
                      {lang === 'MR' ? 'गावातील पत्ता / परिसर' : 'Village Location / Ward'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder={lang === 'MR' ? 'उदा. असगाव वॉर्ड २ / पौनी वेस' : 'e.g. Asgaon Ward 2 / Pauni Gate'}
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'सविस्तर माहिती व स्थिती' : 'Details & Condition'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder={
                      lang === 'MR'
                        ? 'वाण, प्रमाण, जनावराचे वय/लसीकरण, अवजारे चाललेले तास इत्यादी तपशील द्या.'
                        : 'Provide details about variety, quantity, age/vaccination, machine hours, etc.'
                    }
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                  />
                </div>

                {/* Cloudinary Produce/Item Photo Upload */}
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'मालाचे छायाचित्र (फोटो)' : 'Commodity / Item Photo'}
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#166534] text-white text-[11px] font-bold hover:bg-[#052e16] transition-colors shadow-xs">
                      <LucideIcon name="add_a_photo" className="text-[17px]" />
                      <span>
                        {uploadingImage
                          ? (lang === 'MR' ? 'अपलोड होत आहे...' : 'Uploading...')
                          : (lang === 'MR' ? 'फोटो निवडा' : 'Upload Photo')}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>

                    {newImage ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={newImage}
                          alt="Uploaded produce"
                          className="w-10 h-10 object-cover rounded-lg border border-[#006a4e]"
                        />
                        <span className="text-[11px] text-[#006a4e] font-bold flex items-center gap-0.5">
                          <LucideIcon name="check_circle" className="text-[15px]" />
                          {lang === 'MR' ? 'जोडले' : 'Attached'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setNewImage('')}
                          className="text-[11px] text-[#ba1a1a] hover:underline font-semibold"
                        >
                          {lang === 'MR' ? 'काढून टाका' : 'Remove'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#707974]">
                        {lang === 'MR' ? 'पर्यायी (डीफॉल्ट फोटो वापरला जाईल)' : 'Optional (Defaults to verified category photo)'}
                      </span>
                    )}
                  </div>
                  {uploadError && (
                    <p className="text-[11px] text-[#ba1a1a] mt-1 font-semibold">{uploadError}</p>
                  )}
                </div>

                <div className="bg-[#fef9ee] p-2.5 rounded-lg border border-[#fde68a] text-[11px] text-[#c2410c] flex items-center gap-2">
                  <LucideIcon name="verified" className="text-[16px]" />
                  <span>
                    {lang === 'MR'
                      ? 'ही सेवा १००% मोफत असून कोणतीही मध्यस्थी किंवा कमिशन घेतले जात नाही.'
                      : 'Listing is 100% free with zero brokerage or commission taken.'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="w-full py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs mt-1 disabled:opacity-50"
                >
                  {uploadingImage
                    ? (lang === 'MR' ? 'फोटो अपलोड होत आहे...' : 'Uploading Image...')
                    : (lang === 'MR' ? 'जाहिरात प्रकाशित करा' : 'Publish Marketplace Listing')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: STALL BOOKING MODAL */}
      {showStallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setShowStallModal(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4]"
            >
              <LucideIcon name="close" className="text-[20px]" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <LucideIcon name="storefront" className="text-[#c2410c] text-[24px]" />
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#166534]">
                  {lang === 'MR' ? 'शुक्रवार आठवडे बाजारासाठी मोफत गाळा नोंदवा' : 'Book Free Stall for Friday Haat'}
                </h3>
                <span className="text-[11px] text-[#707974]">
                  {lang === 'MR' ? 'असगाव शुक्रवार साप्ताहिक बाजार' : 'Asgaon Friday Weekly Bazaar'}
                </span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-[#e8f1ec] border border-[#006a4e] rounded-xl p-4 text-center">
                <LucideIcon name="check_circle" className="text-[#006a4e] text-[40px] mb-2" />
                <h4 className="font-bold text-[15px] text-[#166534]">
                  {lang === 'MR' ? 'गाळा जागा निश्चित झाली!' : 'Stall Slot Confirmed!'}
                </h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  {lang === 'MR'
                    ? 'या शुक्रवारसाठी (सकाळी ०७:०० - दुपारी ०२:००) गाळा क्र. #F-19 आपल्या नावे राखीव झाला आहे.'
                    : 'Stall #F-19 reserved under your name for this Friday (07:00 AM - 02:00 PM).'}
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'शेतकरी / विक्रेत्याचे नाव' : 'Farmer / Vendor Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'MR' ? 'विक्रेत्याचे पूर्ण नाव प्रविष्ट करा' : 'Enter vendor / farmer full name'}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'संपर्क मोबाईल क्रमांक' : 'Contact Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    defaultValue="9876543210"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'विक्रीसाठी आणायचा माल' : 'Produce to Sell'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      lang === 'MR'
                        ? 'उदा. ताज्या पालेभाज्या, धान्य, फळे, दूध इत्यादी'
                        : 'e.g. Fresh leafy vegetables, grains, milk or fruits'
                    }
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div className="bg-[#a7f3d0]/30 p-2.5 rounded-lg border border-[#006a4e]/20 text-[11px] text-[#166534]">
                  {lang === 'MR'
                    ? 'सूचना: असगावच्या स्थानिक रहिवासी शेतकऱ्यांना मोफत गाळा मिळतो. कृपया सोबत ७/१२ किंवा आधार कार्ड ठेवा.'
                    : 'Notice: Asgaon resident farmers receive free stalls. Please bring your 7/12 extract or Aadhaar card.'}
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#c2410c] hover:bg-[#852f00] text-white font-bold rounded-xl transition-all shadow-xs mt-1"
                >
                  {lang === 'MR' ? 'गाळा आरक्षण निश्चित करा' : 'Confirm Stall Reservation'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
