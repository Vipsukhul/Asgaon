import React from 'react';
import type { Business } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FeaturedEnterprisesProps {
  businesses: Business[];
  onRegisterShop: () => void;
  onSelectBusiness: (biz: Business) => void;
}

export const FeaturedEnterprises: React.FC<FeaturedEnterprisesProps> = ({
  businesses,
  onRegisterShop,
  onSelectBusiness
}) => {
  const { lang  } = useLanguage();

  return (
    <section id="businesses" className="w-full mb-12 scroll-mt-28">
      {/* Header with Title and Free Listing CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="font-heading font-extrabold text-[24px] text-emerald-950 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c2410c] text-[28px]">storefront</span>
            <span>{lang === 'MR' ? 'स्थानिक वैशिष्ट्यपूर्ण दुकाने व व्यवसाय' : 'Featured Village Enterprises'}</span>
          </h2>
          <p className="text-[13px] text-stone-600">
            {lang === 'MR'
              ? 'आसगावची ग्रामीण अर्थव्यवस्था • स्थानिक प्रभाग पडताळणीकृत दुकाने व व्यावसायिक'
              : "Asgaon's trusted rural economy • Verified local businesses"}
          </p>
        </div>

        <button
          type="button"
          onClick={onRegisterShop}
          className="px-4 py-2 rounded-xl bg-[#c2410c] hover:bg-[#ea580c] text-white text-[13px] font-extrabold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_business</span>
          <span>{lang === 'MR' ? 'मोफत दुकान नोंदवा (आपला व्यापार)' : 'List Your Shop Free'}</span>
        </button>
      </div>

      {/* Grid of Enterprise Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {businesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all border border-[#efe7dc] hover:border-emerald-700 flex flex-col justify-between group"
          >
            {/* Image Thumbnail with Floating Tags */}
            <div className="relative h-44 w-full overflow-hidden bg-[#faf6ee]">
              <img
                src={biz.imageUrl}
                alt={biz.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Landmark location pill with direct map navigation */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${biz.latitude || 20.7850},${biz.longitude || 79.6350}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-2.5 left-2.5 bg-black/75 hover:bg-emerald-800 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors border border-white/20"
                title={lang === 'MR' ? 'नकाशावर ठिकाण पहा' : 'View on Map / Directions'}
              >
                <span className="material-symbols-outlined text-[13px] text-amber-400">location_on</span>
                <span>{biz.landmark} • {lang === 'MR' ? 'नकाशा ↗' : 'Map ↗'}</span>
              </a>

              {/* Verification badge pill */}
              {biz.isVerified && (
                <div className="absolute top-2.5 right-2.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <span className="material-symbols-outlined text-[12px] text-emerald-700">verified</span>
                  <span>{lang === 'MR' && biz.verificationBadge === 'VERIFIED MERCHANT' ? 'प्रमाणित व्यावसायिक' : (biz.verificationBadge || 'VERIFIED')}</span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#c2410c] mb-1">
                {biz.category}
              </span>
              <h3
                onClick={() => onSelectBusiness(biz)}
                className="font-heading font-extrabold text-[16px] text-stone-900 hover:text-emerald-800 cursor-pointer transition-colors leading-snug line-clamp-1"
              >
                {biz.name}
              </h3>
              <p className="text-[12px] text-stone-600 mt-1.5 line-clamp-2 leading-relaxed flex-1">
                {biz.description}
              </p>

              {/* Timing */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-600 bg-[#faf6ee] px-2 py-1 rounded-lg border border-[#efe7dc]">
                <span className="material-symbols-outlined text-[14px] text-emerald-700">schedule</span>
                <span className="truncate">{biz.openingHours}</span>
              </div>

              {/* Action Buttons: Call, WhatsApp & Map Location */}
              <div className="mt-4 pt-3 border-t border-[#efe7dc] flex items-center gap-2">
                <a
                  href={`tel:${biz.phone}`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#faf6ee] text-stone-800 hover:bg-[#f3ede4] transition-colors text-[12px] font-bold border border-[#efe7dc]"
                >
                  <span className="material-symbols-outlined text-[15px] text-emerald-800">call</span>
                  <span>{lang === 'MR' ? 'कॉल करा' : 'Call'}</span>
                </a>
                <a
                  href={`https://wa.me/91${biz.whatsapp}?text=Hello%20${encodeURIComponent(biz.name)},%20I%20saw%20your%20listing%20on%20Digital%20Gaon%20Asgaon.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors text-[12px] font-extrabold shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[15px] text-emerald-200">chat</span>
                  <span>{lang === 'MR' ? 'व्हॉट्सॲप' : 'WhatsApp'}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${biz.latitude || 20.7850},${biz.longitude || 79.6350}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors border border-amber-200"
                  title={lang === 'MR' ? 'Google Maps वर ठिकाण पहा' : 'View on Map'}
                >
                  <span className="material-symbols-outlined text-[17px]">location_on</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
