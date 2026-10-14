import { LucideIcon } from './LucideIcon';
import React, { useState, useEffect, useRef } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    const list = getStoredHeroSlides();
    return list.filter(s => s.isActive);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync slides if admin updates them in the portal
  useEffect(() => {
    const handleUpdate = () => {
      const updated = getStoredHeroSlides().filter(s => s.isActive);
      if (updated.length > 0) {
        setSlides(updated);
        setCurrentIndex(prev => (prev >= updated.length ? 0 : prev));
      }
    };
    window.addEventListener('dg:hero-slides-updated', handleUpdate);
    return () => window.removeEventListener('dg:hero-slides-updated', handleUpdate);
  }, []);

  // Auto-play slider (every 6 seconds, pauses on hover or user toggle)
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 6500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [slides.length, isPaused, currentIndex]);

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section
      className="relative w-full rounded-3xl overflow-hidden shadow-sm mb-8 border border-[#e8e2d9] group select-none min-h-[460px] sm:min-h-[500px] flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ========================================================
          SLIDE 1: WELCOME & UNIVERSAL SEARCH HUB
          ======================================================== */}
      {currentSlide.type === 'welcome' ? (
        <div className="relative w-full h-full bg-gradient-to-br from-[#faf7f0] via-[#f5f1e6] to-[#ece5d4] p-6 sm:p-10 flex-1 flex flex-col justify-center items-center text-center overflow-hidden transition-all duration-700 border-b border-[#e2dcd0]">
          {/* Ambient lighting */}
          <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-12 -top-12 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Authentic Gramin Warli Folk Graffiti Watermarks on Left & Right */}
          <div className="absolute left-2 sm:left-6 top-8 bottom-8 flex flex-col justify-between pointer-events-none opacity-[0.14] text-emerald-950 select-none hidden md:flex">
            <WarliTreeOfLife className="w-36 lg:w-44 h-auto" />
            <WarliFarmerWithBullocks className="w-48 lg:w-56 h-auto" />
          </div>
          <div className="absolute right-2 sm:right-6 top-8 bottom-8 flex flex-col justify-between pointer-events-none opacity-[0.14] text-amber-950 select-none hidden md:flex items-end">
            <WarliVillageHutAndSun className="w-36 lg:w-42 h-auto" />
            <WarliTarpaDance className="w-44 lg:w-52 h-auto" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            {/* Top Village Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-emerald-800 text-[12px] font-bold shadow-xs border border-emerald-200">
                <LucideIcon name="location_on" className="text-[16px] text-emerald-700" />
                <span>{t('village_full_location')}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[12px] font-bold shadow-xs border border-emerald-300">
                <LucideIcon name="spa" className="text-[16px] text-emerald-700" />
                <span>{lang === 'MR' ? 'शेती, नागरिक व गावहित मंच' : 'Farmer & Village Civic Forum'}</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-[32px] sm:text-[46px] text-emerald-900 tracking-tight mb-2 leading-tight">
              {lang === 'MR' ? 'आपलं डिजिटल आसगाव' : 'Digital Asgaon Village Portal'}
            </h1>
            <p className="font-heading font-bold text-[17px] sm:text-[21px] text-emerald-800 mb-2 leading-snug max-w-2xl">
              {lang === 'MR' ? 'गावातील सर्व सेवा, कृषी योजना, बाजारभाव व एसटी वेळापत्रक थेट मोबाईलवर!' : 'Village civic services, agriculture schemes, mandi rates & bus timings in one place!'}
            </p>
            <p className="text-[13px] sm:text-[14px] text-stone-600 mb-5 max-w-xl">
              {lang === 'MR' ? 'ग्रामपंचायत • पवनी APMC बाजारभाव • प्राथमिक आरोग्य केंद्र • एसटी बस थांबा' : 'Gram Panchayat • Pauni APMC • Primary Health Centre • ST Bus Stand'}
            </p>

            {/* High-Contrast Universal Village Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-2 flex flex-col md:flex-row items-center gap-2 border-2 border-emerald-700/20 focus-within:border-emerald-700 transition-all">
              <div className="flex items-center w-full px-3 py-2">
                <LucideIcon name="search" className="text-emerald-800 text-[26px] mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={lang === 'MR' ? 'खते, ट्रॅक्टर भाडे, लाडकी बहीण, एसटी बस, दवाखाना शोधा...' : 'Search fertilizer, tractor rental, Ladki Bahin, ST bus, clinic...'}
                  className="w-full bg-transparent text-stone-900 text-[15px] sm:text-[16px] font-medium placeholder:text-stone-400 focus:outline-none"
                />
                
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-[15px] font-extrabold whitespace-nowrap transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <LucideIcon name="travel_explore" className="text-[20px]" />
                <span>{lang === 'MR' ? 'शोधा' : 'Search'}</span>
              </button>
            </form>

            
          </div>
        </div>
      ) : (
        /* ========================================================
           CUSTOM BANNER SLIDE (IMAGE WITH OR WITHOUT TEXT OVERLAY)
           ======================================================== */
        <div className="relative w-full flex-1 flex flex-col justify-end min-h-[460px] sm:min-h-[500px] overflow-hidden bg-stone-900 transition-all duration-700">
          {/* Background Photography */}
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.titleEnglish || 'Asgaon Village Banner'}
            className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-1000 scale-100 group-hover:scale-102"
          />

          {/* Conditional Gradient Overlay: Only applied if text overlay is enabled or subtle bottom vignette */}
          {currentSlide.showTextOverlay ? (
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent flex flex-col justify-end p-6 sm:p-12 z-10">
              <div className="max-w-3xl">
                {/* Optional Badge */}
                {(currentSlide.badgeMarathi || currentSlide.badgeEnglish) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider mb-3 shadow-md">
                    <LucideIcon name="stars" className="text-[15px]" />
                    <span>{lang === 'MR' ? currentSlide.badgeMarathi : (currentSlide.badgeEnglish || currentSlide.badgeMarathi)}</span>
                  </span>
                )}

                {/* Main Headline */}
                <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight drop-shadow-md mb-2 leading-tight">
                  {lang === 'MR' ? currentSlide.titleMarathi : (currentSlide.titleEnglish || currentSlide.titleMarathi)}
                </h2>

                {/* Subtitle / Description */}
                {(currentSlide.subtitleMarathi || currentSlide.subtitleEnglish) && (
                  <p className="text-stone-200 text-sm sm:text-base font-medium max-w-2xl mb-5 leading-relaxed drop-shadow-xs">
                    {lang === 'MR' ? currentSlide.subtitleMarathi : (currentSlide.subtitleEnglish || currentSlide.subtitleMarathi)}
                  </p>
                )}

                {/* Action CTA Button */}
                {(currentSlide.ctaTextMarathi || currentSlide.ctaTextEnglish) && (
                  <button
                    onClick={() => {
                      if (currentSlide.ctaLink && onNavigate) {
                        onNavigate(currentSlide.ctaLink);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white text-stone-950 font-bold text-sm hover:bg-[#a7f3d0] hover:text-[#002117] transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>{lang === 'MR' ? currentSlide.ctaTextMarathi : (currentSlide.ctaTextEnglish || currentSlide.ctaTextMarathi)}</span>
                    <LucideIcon name="arrow_forward" className="text-[18px]" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* BLANK OPTIONABLE MODE: Pure photography without overlay text */
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
          )}
        </div>
      )}

      {/* ========================================================
          SLIDER CONTROLS: PREV / NEXT ARROWS & PAGINATION DOTS
          ======================================================== */}
      {slides.length > 1 && (
        <>
          {/* Previous Slide Arrow */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-stone-900 flex items-center justify-center shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:scale-105"
          >
            <LucideIcon name="chevron_left" className="text-xl" />
          </button>

          {/* Next Slide Arrow */}
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-stone-900 flex items-center justify-center shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:scale-105"
          >
            <LucideIcon name="chevron_right" className="text-xl" />
          </button>

          {/* Bottom Indicators & Pause Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-amber-400'
                    : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}

            <button
              type="button"
              onClick={() => setIsPaused(p => !p)}
              className="text-white/80 hover:text-white ml-1 text-xs cursor-pointer flex items-center"
              title={isPaused ? 'Resume auto-slider' : 'Pause auto-slider'}
            >
              <LucideIcon name={isPaused ? 'play_arrow' : 'pause'} className=" text-[14px]" />
            </button>
          </div>
        </>
      )}
    </section>
  );
};
