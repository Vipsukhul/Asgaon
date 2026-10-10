import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getStoredHeroSlides } from '../data/heroSlidesData';
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
        <div className="relative w-full h-full bg-[#f9f3ea] p-6 sm:p-10 flex-1 flex flex-col justify-center items-center text-center overflow-hidden transition-all duration-700">
          {/* Radial ambient lighting */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#003629]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -top-10 w-72 h-72 bg-[#a63b00]/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#003629] text-[12px] font-semibold shadow-xs border border-[#e8e2d9]">
                <span className="material-symbols-outlined text-[16px] text-[#376757]">verified</span>
                <span>{t('village_full_location')}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#baeed9] text-[#002117] text-[12px] font-bold shadow-xs">
                <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                <span>{lang === 'MR' ? 'गावकऱ्यांसाठी स्वतंत्र माहिती मंच' : 'Independent Village Civic Forum'}</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-[32px] sm:text-[44px] text-[#003629] tracking-tight mb-2 leading-tight">
              {lang === 'MR' ? 'आपल्या गावाची सर्व माहिती, एकाच ठिकाणी.' : 'All Village Civic Services & Information in One Place.'}
            </h1>
            <p className="font-heading font-semibold text-[17px] sm:text-[20px] text-[#a63b00] mb-3">
              {lang === 'MR' ? 'ग्रामपंचायत, कृषी योजना, पाणी पुरवठा व स्थानिक बाजारपेठेची ताजी माहिती' : 'Gram Panchayat, Crop Schemes, Water Supply & Local Market Updates'}
            </p>

            

            {/* Universal Search Bar */}
            <form onSubmit={handleSearch} className="w-full bg-white rounded-2xl shadow-md p-2 flex flex-col md:flex-row items-center gap-2 border border-[#e8e2d9]">
              <div className="flex items-center w-full px-3 py-2">
                <span className="material-symbols-outlined text-[#003629] text-[24px] mr-2">travel_explore</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={lang === 'MR' ? 'खते व औषधे, ट्रॅक्टर भाडे, नोकऱ्या, पीएम किसान स्थिती, दवाखाना शोधा...' : 'Search fertilizer shops, tractor rental, jobs, PM-Kisan status, PHC doctor...'}
                  className="w-full bg-transparent text-[#1d1b16] text-[15px] placeholder:text-[#707974] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => alert(lang === 'MR' ? 'व्हॉइस सर्च सुरू आहे! बोला...' : 'Microphone activated. Please speak your query in Marathi, Hindi, or English.')}
                  className="p-2 rounded-lg bg-[#f9f3ea] text-[#003629] hover:bg-[#f3ede4] transition-colors cursor-pointer"
                  title={t('header_voice_search_title')}
                >
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-7 py-3 rounded-xl bg-[#003629] text-white text-[14px] font-bold whitespace-nowrap hover:bg-[#1b4d3e] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
                <span>{lang === 'MR' ? 'माहिती शोधा' : 'Search Portal'}</span>
              </button>
            </form>

            {/* Discovery Tags */}
            
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
                    <span className="material-symbols-outlined text-[15px]">stars</span>
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
                    className="px-6 py-2.5 rounded-xl bg-white text-stone-950 font-bold text-sm hover:bg-[#baeed9] hover:text-[#002117] transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>{lang === 'MR' ? currentSlide.ctaTextMarathi : (currentSlide.ctaTextEnglish || currentSlide.ctaTextMarathi)}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
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
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>

          {/* Next Slide Arrow */}
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-stone-900 flex items-center justify-center shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:scale-105"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
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
              <span className="material-symbols-outlined text-[14px]">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>
          </div>
        </>
      )}
    </section>
  );
};
