import React, { useState, useEffect } from 'react';
import { LucideIcon } from '../components/LucideIcon';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';
import { getStoredGalleryItems } from '../data/galleryData';
import { VillageGallerySlider } from '../components/VillageGallerySlider';
import type { GalleryItem } from '../types';

interface GalleryPageProps {
  onNavigateHome: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigateHome }) => {
  const { lang, t } = useLanguage();
  const isMr = lang === 'MR';

  const [items, setItems] = useState<GalleryItem[]>(() => getStoredGalleryItems());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getStoredGalleryItems());
    };
    window.addEventListener('dg:gallery-updated', handleUpdate);
    return () => window.removeEventListener('dg:gallery-updated', handleUpdate);
  }, []);

  const categories = [
    { id: 'all', labelMr: 'सर्व छायाचित्रे', labelEn: 'All Photos', icon: 'image' },
    { id: 'agriculture', labelMr: 'कृषी व जलसिंचन', labelEn: 'Agriculture & Canals', icon: 'agriculture' },
    { id: 'festival', labelMr: 'यात्रा व उत्सव', labelEn: 'Festivals & Heritage', icon: 'celebration' },
    { id: 'development', labelMr: 'ग्रामविकास कामे', labelEn: 'Development Works', icon: 'construction' },
    { id: 'nature', labelMr: 'निसर्ग व परिसर', labelEn: 'Wainganga & Nature', icon: 'forest' },
    { id: 'community', labelMr: 'शिक्षण व समाज', labelEn: 'Civic & Education', icon: 'groups' }
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      item.titleMarathi.toLowerCase().includes(q) ||
      item.titleEnglish.toLowerCase().includes(q) ||
      (item.descriptionMarathi && item.descriptionMarathi.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <Breadcrumb
        items={[
          { label: t('nav_home'), onClick: onNavigateHome },
          { label: isMr ? 'छायाचित्र दालन' : 'Photo Gallery', active: true }
        ]}
      />

      {/* Featured Aesthetic Slider at Top of Gallery Page */}
      <VillageGallerySlider className="!px-0 !py-0" />

      {/* Gallery Grid Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs flex flex-col gap-6">
        {/* Controls: Search & Category Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#efe7dc]">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-[#faf6ee] text-stone-700 hover:bg-[#f3ede4] border border-[#efe7dc]'
                  }`}
                >
                  <LucideIcon name={cat.icon} className="text-[14px]" />
                  <span>{isMr ? cat.labelMr : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Item Count */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-extrabold text-stone-500 bg-[#faf6ee] px-2.5 py-1 rounded-full border border-[#efe7dc] shrink-0">
              {filteredItems.length} {isMr ? 'छायाचित्रे' : 'Photos'}
            </span>

            <div className="relative w-full sm:w-64">
              <LucideIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isMr ? 'फोटो शोधा...' : 'Search gallery...'}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-[#faf6ee] border border-[#efe7dc] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <LucideIcon name="close" className="text-[14px]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Responsive Photo Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxItem(item)}
                className="group bg-[#faf6ee] rounded-2xl overflow-hidden border border-[#efe7dc] shadow-2xs hover:shadow-md hover:border-emerald-600/40 transition-all cursor-pointer flex flex-col"
              >
                {/* Photo Image with Hover Zoom */}
                <div className="relative h-56 sm:h-60 overflow-hidden bg-stone-900">
                  <img
                    src={item.imageUrl}
                    alt={isMr ? item.titleMarathi : item.titleEnglish}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md bg-stone-900/70 border border-white/20 text-emerald-300">
                      {item.category}
                    </span>
                  </div>

                  {/* Zoom Indicator Icon */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <LucideIcon name="zoom_in" className="text-[16px]" />
                  </div>
                </div>

                {/* Caption Details */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h3 className="font-heading font-black text-base text-emerald-950 group-hover:text-emerald-800 transition-colors line-clamp-1 mb-1">
                      {isMr ? item.titleMarathi : item.titleEnglish}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {isMr ? item.descriptionMarathi : item.descriptionEnglish}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#efe7dc] flex items-center justify-between text-[11px] text-stone-500 font-medium">
                    {item.location && (
                      <span className="flex items-center gap-1 truncate">
                        <LucideIcon name="place" className="text-[13px] text-emerald-700 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </span>
                    )}
                    {item.date && <span>{item.date}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-stone-500 flex flex-col items-center gap-2">
            <LucideIcon name="image" className="text-[36px] text-stone-300" />
            <p className="font-bold text-sm">
              {isMr ? 'या विभागात कोणतेही छायाचित्र सापडले नाही.' : 'No photos found in this category.'}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white z-10">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-700 text-white uppercase tracking-wider">
              {activeLightboxItem.category}
            </span>

            <button
              type="button"
              onClick={() => setActiveLightboxItem(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <LucideIcon name="close" className="text-[22px]" />
            </button>
          </div>

          {/* Centered Image */}
          <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center my-3 select-none">
            <img
              src={activeLightboxItem.imageUrl}
              alt={isMr ? activeLightboxItem.titleMarathi : activeLightboxItem.titleEnglish}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>

          {/* Caption Box */}
          <div className="w-full max-w-3xl bg-stone-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center text-white">
            <h4 className="font-heading font-black text-lg sm:text-xl text-emerald-300 mb-1">
              {isMr ? activeLightboxItem.titleMarathi : activeLightboxItem.titleEnglish}
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-2">
              {isMr ? activeLightboxItem.descriptionMarathi : activeLightboxItem.descriptionEnglish}
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400">
              {activeLightboxItem.location && <span>📍 {activeLightboxItem.location}</span>}
              {activeLightboxItem.date && <span>📅 {activeLightboxItem.date}</span>}
              {activeLightboxItem.credit && <span>📷 {activeLightboxItem.credit}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
