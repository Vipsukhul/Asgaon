import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Breadcrumb } from '../components/Breadcrumb';

interface MarketplacePageProps {
  onNavigateHome?: () => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigateHome }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'harvest' | 'livestock' | 'machinery' | 'household'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
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
      {/* 1. TOP WEEKLY HAAT BANNER */}
      <div className="bg-[#a63b00] text-white px-4 py-2.5 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] font-medium">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#ffdad6]">campaign</span>
          <span>
            <strong className="font-bold">Weekly Haat Reminder:</strong> Asgaon Budhwar Bazaar opens this Friday at 08:00 AM at Old Bus Stand Ground • Zero stall fee for local registered farmers
          </span>
        </div>
        <button
          onClick={() => setShowStallModal(true)}
          className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 border border-white/30"
        >
          <span>View Haat Map</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      {/* 2. BREADCRUMB & PLATFORM BADGE */}
      <Breadcrumb
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Marketplace (स्थानिक बाजारपेठ)', active: true }
        ]}
        rightBadge={
          <div className="text-[11px] font-semibold text-[#006a4e] bg-[#baeed9]/40 px-2.5 py-0.5 rounded-full border border-[#baeed9]">
            98.3% Direct Sellers • 100% Zero-Middlemen
          </div>
        }
      />

      {/* 3. HERO BANNER */}
      <div className="bg-gradient-to-br from-[#003629]/5 via-white to-[#003629]/10 rounded-2xl p-6 sm:p-8 border border-[#c4d6cf] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <span className="inline-block bg-[#006a4e]/10 text-[#006a4e] text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase border border-[#006a4e]/20 mb-2">
            स्थानिक खरेदी-विक्री — ASGAON BAZAAR PLATFORM
          </span>
          <h1 className="font-heading font-extrabold text-[26px] sm:text-[30px] text-[#003629] leading-tight mb-2">
            Gaon Marketplace — Local Farm Produce &amp; Village Bazar
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#404945] max-w-2xl leading-relaxed">
            Buy, sell, and rent directly within Asgaon and neighboring villages. Farm crops, perched cattle, tractors, seed batches, and pre-owned tools with zero broker cuts and verified direct phone/WhatsApp connect.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
          <button
            onClick={() => setShowPostModal(true)}
            className="px-5 py-3 rounded-xl bg-[#003629] hover:bg-[#00281e] text-white text-[13px] font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Post a Free Village Listing</span>
          </button>
          <span className="text-[10px] text-[#55605a]">SMS &amp; OTP Verified • Instant WhatsApp Notification</span>
        </div>
      </div>

      {/* 4. FILTER PILLS & SEARCH BAR */}
      <div className="flex flex-col gap-3">
        {/* Search row */}
        <div className="bg-white p-2 sm:p-3 rounded-xl border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-[18px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by item (e.g. JS335 Soybean, Buffalo, 150Ah Solar, Shaktiman Rotavator)..."
              className="w-full pl-9 pr-3 py-2 bg-[#f3ede4]/40 rounded-lg text-[13px] text-[#1a1c1b] placeholder-[#707974] border border-transparent focus:border-[#006a4e] focus:bg-white outline-none"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { setVerifiedOnly(!verifiedOnly); setCurrentPage(1); }}
              className={`px-3 py-2 rounded-lg text-[12px] font-medium border flex items-center gap-1.5 transition-all ${
                verifiedOnly ? 'bg-[#baeed9] text-[#002117] border-[#006a4e]' : 'bg-white text-[#404945] border-[#e8e2d9]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Verified Sellers</span>
            </button>
            <div className="text-[12px] text-[#55605a] hidden sm:flex items-center gap-1 px-2">
              <span className="material-symbols-outlined text-[16px]">sort</span>
              <span>Sort: Newest Listed First</span>
            </div>
            <div className="text-[11px] font-bold text-[#006a4e] bg-[#f3ede4] px-2.5 py-1.5 rounded-lg border border-[#e8e2d9]">
              PIN: 441910 Only (Pauni)
            </div>
          </div>
        </div>

        {/* Filter categories pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[12px] font-medium no-scrollbar">
          <button
            onClick={() => { setActiveFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-bold shrink-0 transition-all ${
              activeFilter === 'all'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
            }`}
          >
            ALL LISTINGS ({extraItems.length})
          </button>
          <button
            onClick={() => { setActiveFilter('harvest'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium shrink-0 transition-all flex items-center gap-1.5 ${
              activeFilter === 'harvest'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#a63b00]">eco</span>
            <span>Direct Farm Harvest ({harvestCount})</span>
          </button>
          <button
            onClick={() => { setActiveFilter('livestock'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium shrink-0 transition-all flex items-center gap-1.5 ${
              activeFilter === 'livestock'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#006a4e]">cruelty_free</span>
            <span>Cattle &amp; Livestock (पशुधन) ({livestockCount})</span>
          </button>
          <button
            onClick={() => { setActiveFilter('machinery'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium shrink-0 transition-all flex items-center gap-1.5 ${
              activeFilter === 'machinery'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#006a4e]">agriculture</span>
            <span>Tractors &amp; Implements (अवजारे) ({machineryCount})</span>
          </button>
          <button
            onClick={() => { setActiveFilter('household'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium shrink-0 transition-all flex items-center gap-1.5 ${
              activeFilter === 'household'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#707974]">handyman</span>
            <span>Household &amp; Small Goods ({householdCount})</span>
          </button>
        </div>
      </div>

      {/* 5. MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: LISTINGS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-[17px] text-[#003629]">
              Marketplace Catalog{' '}
              <span className="text-[13px] font-normal text-[#707974]">
                (Showing {totalVisible} listings)
              </span>
            </h2>
          </div>

          {totalVisible === 0 && (
            <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-[#a63b00]">storefront</span>
              <h3 className="font-heading font-bold text-[18px] text-[#003629]">No matching marketplace listings</h3>
              <p className="text-[13px] text-[#707974] max-w-md">No agricultural produce, livestock, or machinery matches your search query or seller filter.</p>
              <button
                onClick={() => { setActiveFilter('all'); setSearchQuery(''); setVerifiedOnly(false); setCurrentPage(1); }}
                className="px-4 py-2 bg-[#003629] text-white text-[12px] font-bold rounded-xl hover:bg-[#1b4d3e] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* SECTION 1: FRESH FARM HARVEST */}
          {(activeFilter === 'all' || activeFilter === 'harvest') && allHarvest.length > 0 && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#006a4e] tracking-wider uppercase">
                    DIRECT HARVEST • NO MIDDLEMAN SPREAD
                  </span>
                  <h2 className="font-heading font-extrabold text-[20px] text-[#003629]">
                    Fresh Farm Harvest Direct from Growers
                  </h2>
                  <p className="text-[12px] text-[#707974]">
                    827 qtl total harvested produce ready for bulk &amp; retail pickup in the region
                  </p>
                </div>
                <button
                  onClick={() => setActiveFilter('harvest')}
                  className="text-[12px] font-bold text-[#006a4e] hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View 18 Harvest Lots</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allHarvest.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#e8e2d9] rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between bg-white"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-[#f3ede4] overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                          <span className="bg-[#003629]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {item.badge1}
                          </span>
                          <span className="bg-white/90 text-[#003629] text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                            {item.badge2}
                          </span>
                        </div>
                        <span className="absolute bottom-2.5 right-2.5 bg-[#a63b00] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                          {item.statusTag}
                        </span>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-heading font-bold text-[15px] text-[#003629] leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-[20px] font-black text-[#a63b00]">{item.price}</span>
                          <span className="text-[11px] text-[#707974]">{item.unit}</span>
                        </div>
                        <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
                          {item.desc}
                        </p>

                        <div className="flex items-center gap-2 p-2 bg-[#f3ede4]/40 rounded-lg text-[11px]">
                          <span className="material-symbols-outlined text-[16px] text-[#006a4e]">account_circle</span>
                          <div className="truncate">
                            <strong className="text-[#003629] block truncate">{item.seller}</strong>
                            <span className="text-[#707974] text-[10px] block truncate">{item.sellerRole}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="py-2 px-3 bg-[#003629] hover:bg-[#00281e] text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>Call Seller</span>
                      </a>
                      <a
                        href={`https://wa.me/91${item.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 border border-[#006a4e] text-[#006a4e] hover:bg-[#baeed9]/20 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">chat</span>
                        <span>WhatsApp</span>
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
                  <span className="text-[10px] font-bold text-[#a63b00] tracking-wider uppercase">
                    VET-INSPECTED &amp; VET CHECKED • Safe for Farmer Transfer
                  </span>
                  <h2 className="font-heading font-extrabold text-[20px] text-[#003629]">
                    Village Livestock &amp; Cattle Bazar
                  </h2>
                  <p className="text-[12px] text-[#707974]">
                    Cows, bulls, buffaloes, and backyard poultry with verified health certificates
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#006a4e] bg-[#baeed9]/40 px-3 py-1 rounded-full border border-[#baeed9] self-start sm:self-auto">
                  {allLivestock.length} Live Cattle Records
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allLivestock.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#e8e2d9] rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between bg-white"
                  >
                    <div>
                      <div className="relative h-40 w-full bg-[#f3ede4] overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#003629]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {item.healthTag}
                        </span>
                        <span className="absolute bottom-2 left-2 bg-white/90 text-[#003629] text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {item.subBadge}
                        </span>
                      </div>

                      <div className="p-3.5">
                        <span className="inline-block text-[9px] font-bold uppercase text-[#a63b00] tracking-wide mb-1">
                          {item.badge}
                        </span>
                        <h3 className="font-heading font-bold text-[14px] text-[#003629] leading-snug mb-1">
                          {item.title}
                        </h3>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-[18px] font-black text-[#a63b00]">{item.price}</span>
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
                        className="w-full py-2 bg-[#003629] hover:bg-[#00281e] text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>Contact Owner</span>
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
                  HEAVY MACHINERY • No Dealer Commissions
                </span>
                <h2 className="font-heading font-extrabold text-[20px] text-[#003629]">
                  Pre-Owned Tractors &amp; Implements
                </h2>
                <p className="text-[12px] text-[#707974]">
                  कृषी अवजारे बाजार — Inspected machinery with authentic ownership records
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allMachinery.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#e8e2d9] rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between bg-white"
                  >
                    <div>
                      <div className="relative h-40 w-full bg-[#f3ede4] overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#003629]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {item.badge}
                        </span>
                      </div>

                      <div className="p-3.5">
                        <h3 className="font-heading font-bold text-[14px] text-[#003629] leading-snug mb-1">
                          {item.title}
                        </h3>
                        <div className="text-[18px] font-black text-[#a63b00] mb-2">{item.price}</div>
                        <ul className="text-[11px] text-[#404945] flex flex-col gap-1 mb-3">
                          {item.specs.map((spec, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="material-symbols-outlined text-[13px] text-[#006a4e] mt-0.5">check_circle</span>
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
                        className="w-full py-2 bg-[#003629] hover:bg-[#00281e] text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>Connect Seller</span>
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
                <span className="text-[10px] font-bold text-[#a63b00] tracking-wider uppercase">
                  VILLAGE RESALE • Verified Local Owners
                </span>
                <h2 className="font-heading font-extrabold text-[20px] text-[#003629]">
                  Household &amp; Small Enterprise Goods
                </h2>
                <p className="text-[12px] text-[#707974]">
                  घरगुती वस्तू आणि लघुउद्योग साधने
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allHousehold.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#e8e2d9] rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between bg-white"
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
                          <h3 className="font-heading font-bold text-[15px] text-[#003629]">
                            {item.title}
                          </h3>
                          <span className="text-[18px] font-black text-[#a63b00] shrink-0">{item.price}</span>
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
                        className="py-2 px-3 bg-[#003629] hover:bg-[#00281e] text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>Call Owner</span>
                      </a>
                      <a
                        href={`https://wa.me/91${item.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 border border-[#006a4e] text-[#006a4e] hover:bg-[#baeed9]/20 text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">chat</span>
                        <span>Chat</span>
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
              Showing {totalVisible > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + pageSize, totalVisible)} of {totalVisible} village listings
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
        </div>

        {/* RIGHT SIDEBAR COLUMN: 4 WIDGETS (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* WIDGET 1: MARKETPLACE SAFE GUIDELINES */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-[#f3ede4] pb-3">
              <span className="material-symbols-outlined text-[#006a4e] text-[22px]">verified_user</span>
              <div>
                <h3 className="font-heading font-bold text-[14px] text-[#003629]">
                  Marketplace Safe Guidelines
                </h3>
                <span className="text-[10px] text-[#707974]">Gram Gaon Verified Safe Advice</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-[#fff8f0] p-3 rounded-xl border border-[#ffe0cc] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#a63b00] text-[18px] shrink-0 mt-0.5">wb_sunny</span>
                <div>
                  <h4 className="font-bold text-[12px] text-[#a63b00]">Daylight Inspection</h4>
                  <p className="text-[11px] text-[#404945] leading-relaxed">
                    Always inspect cattle, tractors, and grain quality in daylight at the seller's farm or residence.
                  </p>
                </div>
              </div>

              <div className="bg-[#fff8f0] p-3 rounded-xl border border-[#ffe0cc] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px] shrink-0 mt-0.5">do_not_disturb_on</span>
                <div>
                  <h4 className="font-bold text-[12px] text-[#ba1a1a]">Zero Advance UPI</h4>
                  <p className="text-[11px] text-[#404945] leading-relaxed">
                    Never transfer advance token money via Google Pay or PhonePe before physical verification scan-bills.
                  </p>
                </div>
              </div>

              <div className="bg-[#fff8f0] p-3 rounded-xl border border-[#ffe0cc] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[18px] shrink-0 mt-0.5">scale</span>
                <div>
                  <h4 className="font-bold text-[12px] text-[#006a4e]">Verify Haat Weighing Tag</h4>
                  <p className="text-[11px] text-[#404945] leading-relaxed">
                    For bulk harvest check, insist on receipt for testing certified by the weighbridge tag on the Pauni portal.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f3ede4] flex items-center justify-between text-[11px] text-[#707974]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">call</span>
                <span>Toll Free Krishi Desk:</span>
              </span>
              <strong className="text-[#003629]">07185-221101</strong>
            </div>
          </div>

          {/* WIDGET 2: WEEKLY HAAT BANNER & MAP */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#f3ede4] pb-3">
              <div>
                <span className="text-[9px] font-black uppercase text-[#a63b00] tracking-wider">
                  WEEKLY HAAT
                </span>
                <h3 className="font-heading font-extrabold text-[15px] text-[#003629]">
                  Asgaon Budhwar Bazaar
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#006a4e] bg-[#baeed9]/40 px-2 py-0.5 rounded border border-[#baeed9]">
                Every Friday
              </span>
            </div>

            <div className="text-[11px] text-[#55605a]">
              Old Bus Stand Ground • 07:00 AM – 02:00 PM
            </div>

            {/* Map visual card */}
            <div className="relative rounded-xl overflow-hidden border border-[#c4d6cf] h-32 bg-[#e2eee9] flex flex-col items-center justify-center p-3 text-center">
              <span className="material-symbols-outlined text-[32px] text-[#006a4e] mb-1">map</span>
              <span className="font-bold text-[11px] text-[#003629]">Old Bus Stand Ground • 42 Stalls Allocated</span>
              <span className="text-[10px] text-[#55605a]">Pauni-Bhandara State Highway 352 Junction</span>
            </div>

            <div className="bg-[#f3ede4]/60 p-2.5 rounded-xl text-[10px] text-[#404945] flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span>Local Farmers &amp; Self-Help Groups:</span>
                <strong className="text-[#006a4e]">FREE / Stall</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Outside Commercial Vendors:</span>
                <strong className="text-[#a63b00]">₹50 Stall Fee / Day</strong>
              </div>
            </div>

            <button
              onClick={() => setShowStallModal(true)}
              className="w-full py-2.5 bg-[#a63b00] hover:bg-[#852f00] text-white text-[12px] font-bold rounded-xl transition-all shadow-xs"
            >
              Book Free Farmer Stall Space
            </button>
          </div>

          {/* WIDGET 3: APMC COMPUTERIZED WEIGHBRIDGE */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#f3ede4] pb-3">
              <span className="material-symbols-outlined text-[#006a4e] text-[20px]">scale</span>
              <div>
                <span className="text-[9px] font-bold text-[#006a4e] uppercase tracking-wider block">
                  APMC CERTIFIED
                </span>
                <h3 className="font-heading font-bold text-[14px] text-[#003629]">
                  Computerized Weighbridge (धर्म काटा)
                </h3>
              </div>
            </div>

            <p className="text-[11px] text-[#404945] leading-relaxed">
              Avoid faulty scale losses. Electronic 60-ton weighbridge just 1.5 km from Asgaon on Pauni road.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#f3ede4]/40 p-2.5 rounded-xl">
              <div>
                <span className="text-[10px] text-[#707974] block">Tractor / Trolley</span>
                <strong className="text-[#003629]">Up to 60 Quintals: ₹50</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#707974] block">10-Wheeler Truck</span>
                <strong className="text-[#003629]">₹100 (incl. MSP Receipt)</strong>
              </div>
            </div>

            <div className="text-[10px] text-[#707974]">
              Hours: <strong className="text-[#003629]">Open 07:00 AM – 08:00 PM Daily</strong>
            </div>

            <a
              href="tel:9370488102"
              className="w-full py-2 border border-[#006a4e] text-[#006a4e] hover:bg-[#baeed9]/20 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">call</span>
              <span>Call Weighbridge In-charge: 93704 88102</span>
            </a>
          </div>

          {/* WIDGET 4: OFFICIAL MSP CHECKER */}
          <div className="bg-[#003629] text-white rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#baeed9]">
                OFFICIAL PROCUREMENT
              </span>
              <span className="bg-[#baeed9]/20 text-[#baeed9] text-[9px] font-bold px-2 py-0.5 rounded">
                Centre Open Today
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-[15px] leading-snug">
              Check Government MSP Before You Sell
            </h3>

            <p className="text-[11px] text-[#e8e2d9] leading-relaxed">
              Soybean 2026 MSP: <strong>₹4,892/qtl</strong> • Cotton (Medium Staple): <strong>₹7,121/qtl</strong>. Never settle for distress sales below Govt minimum price floor.
            </p>

            <a
              href="#mandi-bulletin"
              className="w-full py-2.5 bg-[#baeed9] hover:bg-[#a0dec5] text-[#002117] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors mt-1"
            >
              <span>Open Mandi Price Bulletin</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#006a4e] text-[24px]">post_add</span>
              <div>
                <h3 className="font-heading font-extrabold text-[18px] text-[#003629]">
                  Post a Free Village Listing
                </h3>
                <span className="text-[11px] text-[#707974]">Asgaon Gaon Bazaar Direct Seller Platform</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-[#baeed9]/40 border border-[#006a4e] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-[#006a4e] text-[40px] mb-2">check_circle</span>
                <h4 className="font-bold text-[15px] text-[#003629]">Listing Published Successfully!</h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  Your listing is now active and visible to all villagers and nearby traders.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Item Title / Commodity Name</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. JS335 Soybean Seeds / Murrah Buffalo / 6ft Rotavator"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#003629] block mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                    >
                      <option value="harvest">Farm Harvest (शेतमाल)</option>
                      <option value="livestock">Livestock &amp; Cattle (पशुधन)</option>
                      <option value="machinery">Tractors &amp; Implements (अवजारे)</option>
                      <option value="household">Household Goods (घरगुती)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#003629] block mb-1">Expected Price (₹)</label>
                    <input
                      type="text"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="e.g. ₹4,850 / Quintal or ₹82,000"
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#003629] block mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#003629] block mb-1">Village Location / Ward</label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Asgaon Ward 2 / Pauni Gate"
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#003629] block mb-1">Details &amp; Condition</label>
                  <textarea
                    rows={3}
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Provide details about variety, quantity, age/vaccination, machine hours, etc."
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                  />
                </div>

                {/* Cloudinary Produce/Item Photo Upload */}
                <div>
                  <label className="font-bold text-[#003629] block mb-1">
                    Commodity / Item Photo (मालाचे छायाचित्र)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#003629] text-white text-[11px] font-bold hover:bg-[#1b4d3e] transition-colors shadow-xs">
                      <span className="material-symbols-outlined text-[17px]">add_a_photo</span>
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
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
                          <span className="material-symbols-outlined text-[15px]">check_circle</span>
                          Attached
                        </span>
                        <button
                          type="button"
                          onClick={() => setNewImage('')}
                          className="text-[11px] text-[#ba1a1a] hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#707974]">Optional (Defaults to verified category photo)</span>
                    )}
                  </div>
                  {uploadError && (
                    <p className="text-[11px] text-[#ba1a1a] mt-1 font-semibold">{uploadError}</p>
                  )}
                </div>

                <div className="bg-[#fff8f0] p-2.5 rounded-lg border border-[#ffe0cc] text-[11px] text-[#a63b00] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Listing is 100% free with zero commission taken by Gram Panchayat.</span>
                </div>

                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="w-full py-2.5 bg-[#003629] hover:bg-[#00281e] text-white font-bold rounded-xl transition-all shadow-xs mt-1 disabled:opacity-50"
                >
                  {uploadingImage ? 'Uploading Image...' : 'Publish Marketplace Listing'}
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
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#a63b00] text-[24px]">storefront</span>
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#003629]">
                  Book Free Stall for Friday Haat
                </h3>
                <span className="text-[11px] text-[#707974]">Asgaon Shukrawar Weekly Bazaar</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-[#baeed9]/40 border border-[#006a4e] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-[#006a4e] text-[40px] mb-2">check_circle</span>
                <h4 className="font-bold text-[15px] text-[#003629]">Stall Slot Confirmed!</h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  Stall #F-19 reserved under your name for this Friday (07:00 AM - 02:00 PM).
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Farmer / Vendor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter vendor / farmer full name"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Contact Number</label>
                  <input
                    type="tel"
                    required
                    defaultValue="9876543210"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Produce to Sell</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fresh leafy vegetables, grains, milk or fruits"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div className="bg-[#baeed9]/30 p-2.5 rounded-lg border border-[#006a4e]/20 text-[11px] text-[#003629]">
                  Notice: Asgaon resident farmers receive free stalls. Please bring your 7/12 extract or Aadhaar card.
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#a63b00] hover:bg-[#852f00] text-white font-bold rounded-xl transition-all shadow-xs mt-1"
                >
                  Confirm Stall Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
