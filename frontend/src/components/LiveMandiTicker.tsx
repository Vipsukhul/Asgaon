import { LucideIcon } from './LucideIcon';
import React from 'react';
import type { MandiPrice } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LiveMandiTickerProps {
  prices: MandiPrice[];
  onViewAllMandi: () => void;
}

export const LiveMandiTicker: React.FC<LiveMandiTickerProps> = ({ prices, onViewAllMandi }) => {
  const { lang } = useLanguage();

  return (
    <section className="w-full bg-[#faf6ee] rounded-2xl p-4 sm:p-5 shadow-xs mb-10 border border-[#efe7dc]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3.5 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <LucideIcon name="trending_up" className="text-[20px]" />
          </div>
          <span className="font-heading font-extrabold text-[16px] text-emerald-950">
            {lang === 'MR' ? 'थेट बाजारभाव (पवनी व भंडारा कृषी उत्पन्न बाजार)' : 'LIVE MANDI BHAAV (Pauni & Bhandara APMC)'}
          </span>
          <span className="text-[12px] text-stone-500 hidden md:inline">
            {lang === 'MR' ? '• आजचे ताजे दर' : '• Updated Today'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-stone-500 hidden lg:inline">
            {lang === 'MR' ? 'अधिकृत बाजार समिती दर • प्रति क्विंटल' : 'Official APMC Rates • Per Quintal'}
          </span>
          <button
            onClick={onViewAllMandi}
            className="text-[12px] text-[#c2410c] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{lang === 'MR' ? 'संपूर्ण बाजारभाव पत्रक' : 'Full APMC Sheet'}</span>
            <LucideIcon name="chevron_right" className="text-[16px]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {prices.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-3.5 shadow-xs border-2 border-emerald-700/15 hover:border-emerald-700 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <div>
                <div className="font-heading font-extrabold text-[15px] text-stone-900 leading-tight">
                  {item.commodityName}
                </div>
                <div className="text-[11px] font-medium text-stone-500">{item.variety}</div>
              </div>

              {item.trend === 'up' && (
                <span className="inline-flex items-center text-[11px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300">
                  +{item.priceChange}
                </span>
              )}
              {item.trend === 'down' && (
                <span className="inline-flex items-center text-[11px] font-black bg-red-100 text-red-800 px-2 py-0.5 rounded-md border border-red-300">
                  {item.priceChange}
                </span>
              )}
              {item.trend === 'stable' && (
                <span className="inline-flex items-center text-[11px] font-bold bg-[#faf6ee] text-stone-700 px-2 py-0.5 rounded-md border border-[#efe7dc]">
                  स्थिर
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between mt-2.5 pt-1.5 border-t border-[#efe7dc]">
              <div className="font-heading font-black text-[20px] text-emerald-800">
                ₹{item.modalPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] font-bold text-stone-500">
                / {item.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
