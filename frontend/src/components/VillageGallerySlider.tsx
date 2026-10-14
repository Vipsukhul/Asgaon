import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon } from './LucideIcon';
import { useLanguage } from '../context/LanguageContext';
import { getStoredGalleryItems } from '../data/galleryData';
import type { GalleryItem } from '../types';

interface VillageGallerySliderProps {
  onViewAll?: () => void;
  className?: string;
  titleMarathi?: string;
  titleEnglish?: string;
}

export const VillageGallerySlider: React.FC<VillageGallerySliderProps> = ({
  onViewAll,
  className = '',
  titleMarathi = 'आसगाव ग्राम छायाचित्र दालन',
  titleEnglish = 'Asgaon Village Photo Gallery'
}) => {
  const { lang } = useLanguage();
  const isMr = lang === 'MR';

  const [items, setItems] = useState<GalleryItem[]>(() => {
    const all = getStoredGalleryItems();
    const featured = all.filter((i) => i.isFeatured);
    return featured.length >= 3 ? featured : all;
  });

  const [isPaused, setIsPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync with admin changes dynamically
  useEffect(() => {
    const handleUpdate = () => {
      const all = getStoredGalleryItems();
      const featured = all.filter((i) => i.isFeatured);
      setItems(featured.length >= 3 ? featured : all);
    };
    window.addEventListener('dg:gallery-updated', handleUpdate);
    return () => window.removeEventListener('dg:gallery-updated', handleUpdate);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % items.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, items.length]);

  if (items.length === 0) return null;

  // Duplicate items for continuous, seamless infinite marquee loop
  const marqueeItems = [...items, ...items, ...items];

  const handleNudge = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -350 : 350;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 ${className}`}>
      {/* Clean Aesthetic Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <h2 className="text-sm sm:text-base md:text-lg font-heading font-black text-stone-900 tracking-tight">
            {isMr ? titleMarathi : titleEnglish}
          </h2>
          <span className="hidden sm:inline-flex text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
            {items.length} {isMr ? 'छायाचित्रे' : 'Photos'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            title={isPaused ? (isMr ? 'प्ले करा' : 'Play') : (isMr ? 'पॉज करा' : 'Pause')}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            <LucideIcon name={isPaused ? 'play_arrow' : 'pause'} className="text-[16px]" />
          </button>

          {/* Left / Right nudge controls */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleNudge('left')}
              title={isMr ? 'मागे' : 'Previous'}
              className="w-8 h-8 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <LucideIcon name="chevron_left" className="text-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => handleNudge('right')}
              title={isMr ? 'पुढे' : 'Next'}
              className="w-8 h-8 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <LucideIcon name="chevron_right" className="text-[18px]" />
            </button>
          </div>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline cursor-pointer ml-1"
            >
              <span>{isMr ? 'सर्व पहा' : 'View All'}</span>
              <LucideIcon name="arrow_forward" className="text-[14px]" />
            </button>
          )}
        </div>
      </div>

      {/* Marquee Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-stone-900/5 p-2 sm:p-3"
      >
        {/* Soft edge gradient fades for cinematic look */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[var(--site-bg,#ecfdf5)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[var(--site-bg,#ecfdf5)] to-transparent z-10 pointer-events-none" />

        {/* Continuous Marquee Track */}
        <div
          className={`animate-gallery-marquee flex gap-3 sm:gap-4.5 items-center ${
            isPaused ? 'is-paused' : ''
          }`}
          style={{
            animationDuration: `${Math.max(25, items.length * 8)}s`
          }}
        >
          {marqueeItems.map((item, idx) => {
            const originalIndex = idx % items.length;
            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => setLightboxIndex(originalIndex)}
                className="group relative shrink-0 cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl bg-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 w-[240px] sm:w-[320px] md:w-[380px] h-[160px] sm:h-[210px] md:h-[250px]"
              >
                {/* Pure Aesthetic Image */}
                <img
                  src={item.imageUrl}
                  alt={isMr ? item.titleMarathi : item.titleEnglish}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Subtle Clean Hover Overlay without cluttered details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3 sm:p-4">
                  <div className="text-white">
                    <p className="text-xs sm:text-sm font-bold drop-shadow-md line-clamp-1">
                      {isMr ? item.titleMarathi : item.titleEnglish}
                    </p>
                    {item.location && (
                      <p className="text-[10px] text-white/80 drop-shadow-xs line-clamp-1">
                        📍 {item.location}
                      </p>
                    )}
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 border border-white/30">
                    <LucideIcon name="zoom_in" className="text-[16px]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      {lightboxIndex !== null && items[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            title="बंद करा (Esc)"
          >
            <LucideIcon name="close" className="text-[24px]" />
          </button>

          {/* Previous Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
            }}
            className="absolute left-3 sm:left-6 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            title="मागे"
          >
            <LucideIcon name="chevron_left" className="text-[28px]" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev !== null ? (prev + 1) % items.length : null));
            }}
            className="absolute right-3 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            title="पुढे"
          >
            <LucideIcon name="chevron_right" className="text-[28px]" />
          </button>

          {/* Lightbox Image Container */}
          <div
            className="relative max-w-5xl max-h-[88vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[lightboxIndex].imageUrl}
              alt={isMr ? items[lightboxIndex].titleMarathi : items[lightboxIndex].titleEnglish}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl sm:rounded-2xl shadow-2xl"
            />
            <div className="mt-3 text-center text-white max-w-2xl px-4">
              <h3 className="text-base sm:text-lg font-bold">
                {isMr ? items[lightboxIndex].titleMarathi : items[lightboxIndex].titleEnglish}
              </h3>
              <p className="text-xs text-white/70 mt-1">
                {lightboxIndex + 1} / {items.length}
                {items[lightboxIndex].location ? ` • 📍 ${items[lightboxIndex].location}` : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
