import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onSearch: (term: string) => void;
  onTagClick: (tag: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onTagClick }) => {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const tags = lang === 'MR' ? [
    { label: '🌾 सोयाबीन व धान बाजारभाव', query: 'mandi' },
    { label: '🚜 ट्रॅक्टर व शेती अवजारे', query: 'tractor' },
    { label: '📜 ७/१२ व ८-अ उतारा', query: '7/12' },
    { label: '🏥 प्राथमिक आरोग्य केंद्र व दवाखाना', query: 'clinic' }
  ] : [
    { label: '🌾 Paddy & Soybean Mandi Rate', query: 'mandi' },
    { label: '🚜 Tractor & Farm Rental', query: 'tractor' },
    { label: '📜 7/12 & 8A Land Record', query: '7/12' },
    { label: '🏥 PHC & Village Clinics', query: 'clinic' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <section className="relative w-full bg-[#f9f3ea] rounded-2xl p-6 sm:p-10 overflow-hidden shadow-xs mb-8 border border-[#e8e2d9]">
      {/* Decorative radial gradients */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#003629]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-10 -top-10 w-72 h-72 bg-[#a63b00]/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Public Access & Panchayat Header Pills */}
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

        {/* Main Title & Bilingual Tagline */}
        <h1 className="font-heading font-extrabold text-[32px] sm:text-[44px] text-[#003629] tracking-tight mb-2 leading-tight">
          {lang === 'MR' ? 'आपल्या गावाची सर्व माहिती, एकाच ठिकाणी.' : 'All Village Civic Services & Information in One Place.'}
        </h1>
        <p className="font-heading font-semibold text-[17px] sm:text-[20px] text-[#a63b00] mb-3">
          {lang === 'MR' ? 'ग्रामपंचायत, कृषी योजना, पाणी पुरवठा व स्थानिक बाजारपेठेची ताजी माहिती' : 'Gram Panchayat, Crop Schemes, Water Supply & Local Market Updates'}
        </p>

        {/* Community Initiative Micro-strip */}
        <p className="text-[13px] text-[#404945] mb-6 max-w-2xl font-medium">
          {lang === 'MR'
            ? 'गावकऱ्यांच्या जनजागृतीसाठी सुरू केलेला स्वतंत्र माहिती मंच • थेट ग्रामपंचायत, कृषी विभाग व स्थानिक कार्यालयांकडून संकलित केलेली माहिती • १४,२८० नागरिकांसाठी'
            : 'Independent civic portal run for citizen empowerment • Sourced directly from Gram Panchayat, Agriculture Department & village administration • For 14,280 residents'}
        </p>

        {/* High-Precision Universal Search Bar */}
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
              onClick={() => alert(lang === 'MR' ? 'व्हॉइस सर्च सुरू आहे! बोला...' : 'Microphone activated. Please say your search query in Marathi, Hindi, or English.')}
              className="p-2 rounded-lg bg-[#f9f3ea] text-[#003629] hover:bg-[#f3ede4] transition-colors"
              title={t('header_voice_search_title')}
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-7 py-3 rounded-xl bg-[#003629] text-white text-[14px] font-bold whitespace-nowrap hover:bg-[#1b4d3e] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
            <span>{lang === 'MR' ? 'माहिती शोधा' : 'Search Portal'}</span>
          </button>
        </form>

        {/* Popular Discovery Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-[12px] text-[#404945] font-bold mr-1">
            {lang === 'MR' ? 'वारंवार शोधले जाणारे:' : 'Frequently Searched:'}
          </span>
          {tags.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchTerm(t.query);
                onTagClick(t.query);
              }}
              className="px-3 py-1 rounded-full bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[12px] font-medium transition-colors border border-[#e8e2d9]"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
