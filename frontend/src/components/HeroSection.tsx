import { LucideIcon } from './LucideIcon';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getStoredHeroSlides } from '../data/heroSlidesData';
import { WarliTreeOfLife, WarliFarmerWithBullocks, WarliTarpaDance, WarliVillageHutAndSun } from './WarliWallGraffiti';
import type { HeroSlide } from '../types';

interface HeroSectionProps {
  onSearch: (term: string) => void;
  onTagClick: (tag: string) => void;
  onNavigate?: (destination: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onNavigate }) => {
  const { lang, t } = useLanguage();
  const isMr = lang === 'MR';

  const [searchTerm, setSearchTerm] = useState('');
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    const list = getStoredHeroSlides();
    return list.filter((s) => s.isActive);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Swipe gesture tracking refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync slides if updated in admin portal
  useEffect(() => {
    const handleUpdate = () => {
      const updated = getStoredHeroSlides().filter((s) => s.isActive);
      if (updated.length > 0) {
        setSlides(updated);
        setCurrentIndex((prev) => (prev >= updated.length ? 0 : prev));
      }
    };
    window.addEventListener('dg:hero-slides-updated', handleUpdate);
    return () => window.removeEventListener('dg:hero-slides-updated', handleUpdate);
  }, []);

  const totalSlides = slides.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play timer
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    autoPlayRef.current = setInterval(() => {
      goToNext();
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [totalSlides, isPaused, goToNext]);

  // Touch Swipe Handlers for mobile (Smooth swipe left/right, no vertical scroll blocking)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const deltaX = endX - touchStartX.current;
    const deltaY = endY - touchStartY.current;

    // Detect horizontal swipe if horizontal movement exceeds vertical and is > 40px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        // Swiped Left -> Next
        goToNext();
      } else {
        // Swiped Right -> Previous
        goToPrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  if (totalSlides === 0) return null;

  return (
    <section
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-md mb-8 border border-[#e8e2d9] group select-none min-h-[420px] sm:min-h-[480px] md:min-h-[500px] flex flex-col justify-between transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Container for all stacked slides with smooth cross-fade */}
      <div className="relative w-full flex-1 min-h-[420px] sm:min-h-[480px] md:min-h-[500px] overflow-hidden">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;

          return (
            <div
              key={slide.id || idx}
              aria-hidden={!isActive}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive
                  ? 'opacity-100 z-10 pointer-events-auto'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {slide.type === 'welcome' ? (
                /* ========================================================
                   SLIDE 1: WELCOME & UNIVERSAL SEARCH HUB
                   ======================================================== */
                <div className="relative w-full h-full bg-gradient-to-br from-[#faf7f0] via-[#f5f1e6] to-[#ece5d4] p-5 sm:p-8 md:p-10 flex flex-col justify-center items-center text-center overflow-hidden">
                  {/* Subtle ambient lighting */}
                  <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -left-12 -top-12 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Warli Folk Graffiti Watermarks on Desktop */}
                  <div className="absolute left-2 sm:left-6 top-8 bottom-8 flex flex-col justify-between pointer-events-none opacity-[0.14] text-emerald-950 select-none hidden md:flex">
                    <WarliTreeOfLife className="w-36 lg:w-44 h-auto" />
                    <WarliFarmerWithBullocks className="w-48 lg:w-56 h-auto" />
                  </div>
                  <div className="absolute right-2 sm:right-6 top-8 bottom-8 flex flex-col justify-between pointer-events-none opacity-[0.14] text-amber-950 select-none hidden md:flex items-end">
                    <WarliVillageHutAndSun className="w-36 lg:w-42 h-auto" />
                    <WarliTarpaDance className="w-44 lg:w-52 h-auto" />
                  </div>

                  <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-emerald-800 text-[11px] sm:text-xs font-bold shadow-xs border border-emerald-200">
                        <LucideIcon name="location_on" className="text-[14px] text-emerald-700" />
                        <span>{t('village_full_location')}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-950 text-[11px] sm:text-xs font-bold shadow-xs border border-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        <span>{isMr ? 'शेती, नागरिक व गावहित मंच' : 'Farmer & Village Forum'}</span>
                      </span>
                    </div>

                    {/* Main Headline (Primary H1 for SEO) */}
                    <h1 className="font-heading font-black text-[28px] sm:text-[40px] md:text-[46px] text-emerald-950 tracking-tight mb-2 leading-tight">
                      {isMr
                        ? 'आपलं डिजिटल आसगाव — ग्रामपंचायत, योजना व बाजारभाव'
                        : 'Digital Asgaon — Village Civic Portal, Schemes & Mandi Rates'}
                    </h1>

                    <p className="font-heading font-bold text-[15px] sm:text-[19px] text-emerald-800 mb-2 leading-snug max-w-2xl">
                      {isMr
                        ? 'गावातील सर्व सेवा, कृषी योजना, बाजारभाव व एसटी वेळापत्रक थेट मोबाईलवर!'
                        : 'Village civic services, agriculture schemes, mandi rates & bus timings in one place!'}
                    </p>

                    <p className="text-[12px] sm:text-[13px] text-stone-600 mb-5 max-w-lg">
                      {isMr
                        ? 'ग्रामपंचायत • पवनी APMC बाजारभाव • प्राथमिक आरोग्य केंद्र • एसटी बस थांबा'
                        : 'Gram Panchayat • Pauni APMC • Health Center • ST Bus Stand'}
                    </p>

                    {/* Modern Glassmorphic Search Bar */}
                    <form
                      onSubmit={handleSearch}
                      className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-md p-1.5 sm:p-2 flex flex-col sm:flex-row items-center gap-2 border-2 border-emerald-700/25 focus-within:border-emerald-700 transition-all"
                    >
                      <div className="flex items-center w-full px-2.5 py-1.5">
                        <LucideIcon name="search" className="text-emerald-800 text-[22px] sm:text-[24px] mr-2 shrink-0" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder={
                            isMr
                              ? 'खते, ट्रॅक्टर भाडे, लाडकी बहीण, एसटी बस, दवाखाना शोधा...'
                              : 'Search fertilizer, tractor, Ladki Bahin, ST bus, clinic...'
                          }
                          className="w-full bg-transparent text-stone-900 text-sm sm:text-base font-medium placeholder:text-stone-400 focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0"
                      >
                        <LucideIcon name="travel_explore" className="text-[18px]" />
                        <span>{isMr ? 'शोधा' : 'Search'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                /* ========================================================
                   CUSTOM IMAGE BANNER SLIDE (CINEMATIC FULL-BLEED)
                   ======================================================== */
                <div className="relative w-full h-full flex flex-col justify-end overflow-hidden bg-stone-950">
                  {/* Background Photo with smooth Ken Burns zoom */}
                  <img
                    src={slide.imageUrl}
                    alt={isMr ? (slide.titleMarathi || 'आसगाव ग्राम दालन') : (slide.titleEnglish || 'Asgaon Village Banner')}
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                    decoding="async"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                      isActive ? 'scale-106' : 'scale-100'
                    }`}
                  />

                  {/* Cinematic Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />

                  {/* Text Overlay (if enabled) */}
                  {slide.showTextOverlay && (
                    <div className="relative z-10 p-5 sm:p-8 md:p-12 max-w-3xl pb-14 sm:pb-16">
                      {/* Optional Badge */}
                      {(slide.badgeMarathi || slide.badgeEnglish) && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2.5 shadow-md">
                          <LucideIcon name="stars" className="text-[14px]" />
                          <span>
                            {isMr
                              ? slide.badgeMarathi
                              : slide.badgeEnglish || slide.badgeMarathi}
                          </span>
                        </div>
                      )}

                      {/* Main Headline */}
                      <h2 className="font-heading font-black text-xl sm:text-3xl md:text-4xl text-white tracking-tight drop-shadow-md mb-1.5 leading-tight">
                        {isMr
                          ? slide.titleMarathi
                          : slide.titleEnglish || slide.titleMarathi}
                      </h2>

                      {/* Subtitle / Description */}
                      {(slide.subtitleMarathi || slide.subtitleEnglish) && (
                        <p className="text-stone-200 text-xs sm:text-sm md:text-base font-medium max-w-2xl mb-4 leading-relaxed drop-shadow-xs line-clamp-2 sm:line-clamp-none">
                          {isMr
                            ? slide.subtitleMarathi
                            : slide.subtitleEnglish || slide.subtitleMarathi}
                        </p>
                      )}

                      {/* Action CTA Button */}
                      {(slide.ctaTextMarathi || slide.ctaTextEnglish) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (slide.ctaLink && onNavigate) {
                              onNavigate(slide.ctaLink);
                            }
                          }}
                          className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-white hover:bg-emerald-400 hover:text-emerald-950 text-stone-950 font-bold text-xs sm:text-sm transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
                        >
                          <span>
                            {isMr
                              ? slide.ctaTextMarathi
                              : slide.ctaTextEnglish || slide.ctaTextMarathi}
                          </span>
                          <LucideIcon name="arrow_forward" className="text-[16px]" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ========================================================
          SLIDER CONTROLS:
          - DESKTOP: Subtle floating arrows (hidden on mobile, visible on hover)
          - MOBILE: Controlled 100% via smooth touch SWIPE (No awkward buttons!)
          - BOTTOM: Clean, minimal floating pill progress indicators
          ======================================================== */}
      {totalSlides > 1 && (
        <>
          {/* Previous Arrow (Desktop ONLY, hidden on mobile) */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous slide"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-900 items-center justify-center shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-108 active:scale-95 border border-white/40"
          >
            <LucideIcon name="chevron_left" className="text-[22px]" />
          </button>

          {/* Next Arrow (Desktop ONLY, hidden on mobile) */}
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-900 items-center justify-center shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-108 active:scale-95 border border-white/40"
          >
            <LucideIcon name="chevron_right" className="text-[22px]" />
          </button>

          {/* Bottom Ultra-Refined Frosted Glass Pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/15 hover:bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shadow-md shadow-black/10 transition-all">
            {slides.map((slide, idx) => {
              const isSelected = currentIndex === idx;
              return (
                <button
                  key={slide.id || idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  title={(isMr ? slide.titleMarathi : slide.titleEnglish) || `Slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                    isSelected
                      ? 'w-5 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-300 shadow-xs shadow-emerald-400/50'
                      : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80 hover:scale-125'
                  }`}
                />
              );
            })}

            {/* Subtle Vertical Divider */}
            <div className="w-[1px] h-2 bg-white/15 mx-0.5" />

            {/* Play/Pause Minimal Transparent Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="w-4.5 h-4.5 rounded-full bg-transparent hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
              title={isPaused ? (isMr ? 'प्ले करा' : 'Resume') : (isMr ? 'पॉज करा' : 'Pause')}
            >
              <LucideIcon name={isPaused ? 'play' : 'pause'} className="text-[10px]" />
            </button>
          </div>
        </>
      )}
    </section>
  );
};
