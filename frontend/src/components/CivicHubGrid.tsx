import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface CivicHubGridProps {
  onSelectModule: (moduleId: string) => void;
  onOpenGrievance?: () => void;
  onOpenRegisterShop?: () => void;
  onOpenPostJob?: () => void;
  mandiPrices?: any[];
}

export const CivicHubGrid: React.FC<CivicHubGridProps> = ({
  onSelectModule,
  mandiPrices = []
}) => {
  const { lang, t } = useLanguage();

  // Highlighted live mandi rates (prefer props if available, fallback to Pauni APMC benchmarks)
  const defaultCommodities = [
    { name: lang === 'MR' ? 'धान (बारीक)' : 'Paddy (Fine)', price: '२,४५०', unit: lang === 'MR' ? 'क्विंटल' : 'qtl', trend: 'up', change: '+४०' },
    { name: lang === 'MR' ? 'सोयाबीन' : 'Soybean', price: '४,५५०', unit: lang === 'MR' ? 'क्विंटल' : 'qtl', trend: 'down', change: '-२०' },
    { name: lang === 'MR' ? 'तूर (लाल)' : 'Pigeon Pea', price: '९,८००', unit: lang === 'MR' ? 'क्विंटल' : 'qtl', trend: 'up', change: '+११०' }
  ];

  const displayPrices = mandiPrices && mandiPrices.length >= 3
    ? mandiPrices.slice(0, 3).map((p: any) => ({
        name: p.commodityName,
        price: p.modalPrice ? Number(p.modalPrice).toLocaleString('en-IN') : '४,५००',
        unit: p.unit || (lang === 'MR' ? 'क्विंटल' : 'qtl'),
        trend: p.trend || 'up',
        change: p.priceChange ? (p.priceChange > 0 ? `+${p.priceChange}` : `${p.priceChange}`) : '+३०'
      }))
    : defaultCommodities;

  // Real-world MSRTC ST departures from Asgaon Stop
  const upcomingBuses = [
    { dest: lang === 'MR' ? 'पवनी (Pauni)' : 'Pauni', time: '१२:३० दु.', type: lang === 'MR' ? 'साधी बस' : 'Ordinary', platform: 'थांबा १' },
    { dest: lang === 'MR' ? 'भंडारा (Bhandara)' : 'Bhandara', time: '०१:१५ दु.', type: lang === 'MR' ? 'निमआराम' : 'Semiluxury', platform: 'थांबा १' },
    { dest: lang === 'MR' ? 'नागपूर (Nagpur)' : 'Nagpur', time: '०२:४५ दु.', type: lang === 'MR' ? 'शिवशाही' : 'Express', platform: 'थांबा २' }
  ];

  return (
    <section className="w-full mb-10 flex flex-col gap-6">
      {/* 1. Header with Live Status Tag */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {lang === 'MR' ? 'थेट चालू घडामोडी व सेवा' : 'Live Village Pulse & Actions'}
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-[22px] sm:text-[24px] text-[#003629]">
            {t('hub_title')}
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#404945]">
            {t('hub_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-stone-600 bg-white px-3 py-1.5 rounded-xl border border-[#e8e2d9] shadow-2xs flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-amber-700">schedule</span>
            <span>{lang === 'MR' ? 'दैनिक अद्यतन: आज' : 'Updated: Today'}</span>
          </span>
        </div>
      </div>

      

      {/* 3. Real-Time Interactive Village Widgets Grid (4 Pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Widget 1: Live Pauni APMC Mandi Rates */}
        <div
          onClick={() => onSelectModule('krishi')}
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border border-[#e8e2d9] hover:border-emerald-700 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">agriculture</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {lang === 'MR' ? 'थेट बाजारभाव' : 'Live Mandi'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[16px] text-[#1d1b16] mb-1">
              {lang === 'MR' ? 'पवनी कृषी उत्पन्न बाजार' : 'Pauni APMC Rates'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? 'आजचे प्रत्यक्ष सौदे व हमीभाव' : "Today's live trading benchmarks"}
            </p>

            <div className="flex flex-col gap-2 bg-[#fdfbf7] p-2.5 rounded-xl border border-[#f0eae0]">
              {displayPrices.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">{item.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-[#003629]">₹{item.price}</span>
                    <span className={`text-[10px] font-bold ${item.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f3ede4] text-emerald-800 text-xs font-bold flex items-center justify-between group-hover:text-emerald-900 transition-colors">
            <span>{lang === 'MR' ? 'सर्व दर तपासा' : 'View All Crops'}</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Widget 2: Upcoming ST Bus Departures */}
        <div
          onClick={() => onSelectModule('transport')}
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border border-[#e8e2d9] hover:border-amber-700 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">directions_bus</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {lang === 'MR' ? 'पुढील बसेस' : 'Next Departures'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[16px] text-[#1d1b16] mb-1">
              {lang === 'MR' ? 'आसगाव बस थांबा वेळापत्रक' : 'Asgaon ST Stand'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? '५०% महिला सवलत पास लागू' : 'MSRTC 50% Mahila pass valid'}
            </p>

            <div className="flex flex-col gap-2 bg-[#fdfbf7] p-2.5 rounded-xl border border-[#f0eae0]">
              {upcomingBuses.map((bus, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-stone-800">{bus.dest}</span>
                    <span className="text-[10px] text-stone-400">{bus.type}</span>
                  </div>
                  <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                    {bus.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f3ede4] text-amber-800 text-xs font-bold flex items-center justify-between group-hover:text-amber-900 transition-colors">
            <span>{lang === 'MR' ? 'पूर्ण बस वेळापत्रक पहा' : 'View Full Schedule'}</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Widget 3: Village Utilities & Daily Status */}
        <div
          onClick={() => onSelectModule('businesses')}
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border border-[#e8e2d9] hover:border-sky-700 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">bolt</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                {lang === 'MR' ? 'नागरी सुविधा' : 'Daily Utilities'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[16px] text-[#1d1b16] mb-1">
              {lang === 'MR' ? 'पाणी, वीज व स्वच्छता' : 'Utilities & Daily Status'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? 'दैनंदिन ग्राम सेवा थेट स्थिती' : 'Current village utility metrics'}
            </p>

            <div className="flex flex-col gap-2.5 bg-[#fdfbf7] p-2.5 rounded-xl border border-[#f0eae0] text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <span className="material-symbols-outlined text-[15px] text-amber-600">electric_meter</span>
                  <span className="font-medium">{lang === 'MR' ? 'वीज पुरवठा:' : 'Power Supply:'}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {lang === 'MR' ? 'सुरळीत सुरू' : 'Normal'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <span className="material-symbols-outlined text-[15px] text-sky-600">water_drop</span>
                  <span className="font-medium">{lang === 'MR' ? 'नळ पाणी:' : 'Tap Water:'}</span>
                </div>
                <span className="text-[11px] font-bold text-sky-800">
                  {lang === 'MR' ? '६:३० - ८:३० स.' : '6:30 - 8:30 AM'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <span className="material-symbols-outlined text-[15px] text-stone-600">delete_sweep</span>
                  <span className="font-medium">{lang === 'MR' ? 'घंटागाडी:' : 'Sanitation:'}</span>
                </div>
                <span className="text-[11px] font-bold text-stone-700">
                  {lang === 'MR' ? 'सकाळी ९:००' : '9:00 AM'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f3ede4] text-sky-800 text-xs font-bold flex items-center justify-between group-hover:text-sky-900 transition-colors">
            <span>{lang === 'MR' ? 'स्थानिक सेवा डिरेक्टरी' : 'Local Directory'}</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Widget 4: Trending Govt Schemes */}
        <div
          onClick={() => onSelectModule('schemes')}
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border border-[#e8e2d9] hover:border-indigo-700 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                {lang === 'MR' ? 'थेट शासकीय लाभ' : 'Govt Benefits'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[16px] text-[#1d1b16] mb-1">
              {lang === 'MR' ? 'सक्रिय शासकीय योजना' : 'Active Schemes Desk'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? 'थेट बँक खात्यात अनुदान व लाभ' : 'Direct DBT subsidy schemes'}
            </p>

            <div className="flex flex-col gap-2 bg-[#fdfbf7] p-2.5 rounded-xl border border-[#f0eae0] text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800 truncate">
                  {lang === 'MR' ? 'माझी लाडकी बहीण' : 'Ladki Bahin Yojana'}
                </span>
                <span className="text-[11px] font-extrabold text-pink-700 shrink-0">₹१,५००/महिना</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800 truncate">
                  {lang === 'MR' ? 'पीएम किसान सन्मान' : 'PM-Kisan 17th'}
                </span>
                <span className="text-[11px] font-extrabold text-emerald-700 shrink-0">₹२,००० DBT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800 truncate">
                  {lang === 'MR' ? 'शबरी / रमाई घरकुल' : 'PMAY Housing'}
                </span>
                <span className="text-[11px] font-extrabold text-indigo-700 shrink-0">
                  {lang === 'MR' ? 'अर्ज सुरू' : 'Open'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f3ede4] text-indigo-800 text-xs font-bold flex items-center justify-between group-hover:text-indigo-900 transition-colors">
            <span>{lang === 'MR' ? 'पात्रता व अर्ज पहा' : 'Check Eligibility'}</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>
      </div>
    </section>
  );
};
