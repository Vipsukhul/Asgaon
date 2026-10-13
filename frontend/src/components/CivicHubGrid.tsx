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
  const { lang } = useLanguage();

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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-700"></span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3 py-0.5 rounded-full border border-emerald-300">
              {lang === 'MR' ? 'थेट गाव सेवा व चालू घडामोडी' : 'Live Village Pulse & Actions'}
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-[24px] sm:text-[28px] text-emerald-900 leading-tight">
            {lang === 'MR' ? 'गावकऱ्यांसाठी मुख्य सेवा दालन' : 'Village Civic & Essential Services'}
          </h2>
          <p className="text-[14px] text-stone-600">
            {lang === 'MR' ? 'शेतकरी, महिला व ज्येष्ठ नागरिकांसाठी एका स्पर्शात उपलब्ध माहिती' : 'One-touch access for farmers, women and village elders'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-amber-700">schedule</span>
            <span>{lang === 'MR' ? 'आजचे ताजे अद्यतन' : 'Updated: Today'}</span>
          </span>
        </div>
      </div>

      {/* 2. HIGH-CONTRAST BIG TOUCH TILES FOR FARMERS & ELDERS (मोठे स्पर्श बटणे) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Tile 1: Krishi & Mandi */}
        <button
          type="button"
          onClick={() => onSelectModule('krishi')}
          className="group relative bg-white hover:bg-emerald-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-emerald-600/30 hover:border-emerald-700 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-xs">
            <span className="material-symbols-outlined text-[30px] sm:text-[32px]">agriculture</span>
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-emerald-950 leading-tight mb-1">
            {lang === 'MR' ? 'कृषी व बाजारभाव' : 'Krishi & Mandi'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-emerald-700 leading-tight">
            {lang === 'MR' ? 'पवनी APMC भाव' : 'Live Crop Rates'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
            {lang === 'MR' ? 'खते व बियाणे' : 'Seeds & Inputs'}
          </span>
        </button>

        {/* Tile 2: ST Bus */}
        <button
          type="button"
          onClick={() => onSelectModule('transport')}
          className="group relative bg-white hover:bg-amber-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-600/30 hover:border-amber-700 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-amber-700 group-hover:text-white transition-all shadow-xs">
            <span className="material-symbols-outlined text-[30px] sm:text-[32px]">directions_bus</span>
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-amber-950 leading-tight mb-1">
            {lang === 'MR' ? 'एसटी बस वेळा' : 'ST Bus Schedule'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-amber-800 leading-tight">
            {lang === 'MR' ? 'पवनी, भंडारा बसेस' : 'Pauni & Bhandara'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
            {lang === 'MR' ? '५०% महिला सवलत' : '50% Discount'}
          </span>
        </button>

        {/* Tile 3: Gram Panchayat */}
        <button
          type="button"
          onClick={() => onSelectModule('announcements')}
          className="group relative bg-white hover:bg-orange-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-orange-600/30 hover:border-orange-700 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-orange-100 text-orange-900 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-orange-700 group-hover:text-white transition-all shadow-xs">
            <span className="material-symbols-outlined text-[30px] sm:text-[32px]">account_balance</span>
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-orange-950 leading-tight mb-1">
            {lang === 'MR' ? 'ग्रामपंचायत' : 'Panchayat'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-orange-800 leading-tight">
            {lang === 'MR' ? 'दाखले व सूचना' : 'Notices & Forms'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-orange-900 bg-orange-100/80 px-2 py-0.5 rounded-full border border-orange-300">
            {lang === 'MR' ? 'ग्रामसेवक वेळ' : 'Office Timings'}
          </span>
        </button>

        {/* Tile 4: Health & Doctor (Red Medical Theme) */}
        <button
          type="button"
          onClick={() => onSelectModule('emergency')}
          className="group relative bg-white hover:bg-red-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-red-600/30 hover:border-red-700 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-red-700 group-hover:text-white transition-all shadow-xs">
            <span className="material-symbols-outlined text-[30px] sm:text-[32px]">medical_services</span>
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-red-950 leading-tight mb-1">
            {lang === 'MR' ? 'दवाखाना व आरोग्य' : 'Health & Doctor'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-red-800 leading-tight">
            {lang === 'MR' ? '१०८ रुग्णवाहिका' : 'PHC & 108 Ambulance'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-red-900 bg-red-100/80 px-2 py-0.5 rounded-full border border-red-300">
            {lang === 'MR' ? '२४x७ आपत्कालीन' : '24x7 Emergency'}
          </span>
        </button>

        {/* Tile 5: Govt Schemes */}
        <button
          type="button"
          onClick={() => onSelectModule('schemes')}
          className="group relative bg-white hover:bg-indigo-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-indigo-600/30 hover:border-indigo-700 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-indigo-700 group-hover:text-white transition-all shadow-xs">
            <span className="material-symbols-outlined text-[30px] sm:text-[32px]">assured_workload</span>
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-indigo-950 leading-tight mb-1">
            {lang === 'MR' ? 'शासकीय योजना' : 'Govt Schemes'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-indigo-800 leading-tight">
            {lang === 'MR' ? 'लाडकी बहीण / किसान' : 'DBT & Subsidies'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-indigo-900 bg-indigo-100/80 px-2 py-0.5 rounded-full border border-indigo-300">
            {lang === 'MR' ? 'घरकुल अनुदान' : 'PMAY Housing'}
          </span>
        </button>

        {/* Tile 6: Local Shops & Services */}
        <button
          type="button"
          onClick={() => onSelectModule('businesses')}
          className="group relative bg-white hover:bg-teal-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-teal-600/30 hover:border-teal-700 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-teal-100 text-teal-900 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-teal-700 group-hover:text-white transition-all shadow-xs">
            <span className="material-symbols-outlined text-[30px] sm:text-[32px]">storefront</span>
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-teal-950 leading-tight mb-1">
            {lang === 'MR' ? 'स्थानिक दुकाने' : 'Village Shops'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-teal-800 leading-tight">
            {lang === 'MR' ? 'ट्रॅक्टर, किराणा, कामे' : 'Tractor, Daily Stores'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-teal-900 bg-teal-100/80 px-2 py-0.5 rounded-full border border-teal-300">
            {lang === 'MR' ? 'गाव डिरेक्टरी' : 'Local Directory'}
          </span>
        </button>
      </div>

      {/* 3. Real-Time Interactive Village Widgets Grid (4 Pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {/* Widget 1: Live Pauni APMC Mandi Rates */}
        <div
          onClick={() => onSelectModule('krishi')}
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border-2 border-emerald-600/20 hover:border-emerald-700 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">agriculture</span>
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                {lang === 'MR' ? 'थेट बाजारभाव' : 'Live Mandi'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[17px] text-stone-900 mb-1">
              {lang === 'MR' ? 'पवनी कृषी उत्पन्न बाजार' : 'Pauni APMC Rates'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? 'आजचे प्रत्यक्ष सौदे व हमीभाव' : "Today's live trading benchmarks"}
            </p>

            <div className="flex flex-col gap-2 bg-[#faf6ee] p-3 rounded-xl border border-[#efe7d8]">
              {displayPrices.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[13px]">
                  <span className="font-bold text-stone-800">{item.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-emerald-800">₹{item.price}</span>
                    <span className={`text-[11px] font-bold ${item.trend === 'up' ? 'text-emerald-700' : 'text-red-700'}`}>
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
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border-2 border-amber-600/30 hover:border-amber-700 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">directions_bus</span>
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
                {lang === 'MR' ? 'पुढील बसेस' : 'Next Departures'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[17px] text-stone-900 mb-1">
              {lang === 'MR' ? 'आसगाव बस थांबा वेळापत्रक' : 'Asgaon ST Stand'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? '५०% महिला सवलत पास लागू' : 'MSRTC 50% Mahila pass valid'}
            </p>

            <div className="flex flex-col gap-2 bg-[#faf6ee] p-3 rounded-xl border border-[#efe7d8]">
              {upcomingBuses.map((bus, idx) => (
                <div key={idx} className="flex items-center justify-between text-[13px]">
                  <div className="flex flex-col">
                    <span className="font-bold text-stone-800">{bus.dest}</span>
                    <span className="text-[10px] font-semibold text-stone-500">{bus.type}</span>
                  </div>
                  <span className="font-extrabold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-md border border-amber-300">
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
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border-2 border-sky-600/30 hover:border-sky-700 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center border border-sky-300 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">bolt</span>
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-900 bg-sky-100 px-2.5 py-0.5 rounded-md border border-sky-300">
                {lang === 'MR' ? 'नागरी सुविधा' : 'Daily Utilities'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[17px] text-stone-900 mb-1">
              {lang === 'MR' ? 'पाणी, वीज व स्वच्छता' : 'Utilities & Daily Status'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? 'दैनंदिन ग्राम सेवा थेट स्थिती' : 'Current village utility metrics'}
            </p>

            <div className="flex flex-col gap-2 bg-[#faf6ee] p-3 rounded-xl border border-[#efe7d8] text-[13px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <span className="material-symbols-outlined text-[16px] text-amber-700">electric_meter</span>
                  <span className="font-semibold">{lang === 'MR' ? 'वीज पुरवठा:' : 'Power:'}</span>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                  {lang === 'MR' ? 'सुरळीत सुरू' : 'Normal'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <span className="material-symbols-outlined text-[16px] text-sky-700">water_drop</span>
                  <span className="font-semibold">{lang === 'MR' ? 'नळ पाणी:' : 'Water:'}</span>
                </div>
                <span className="text-[11px] font-bold text-sky-900 bg-sky-100/90 px-2 py-0.5 rounded-md border border-sky-200">
                  {lang === 'MR' ? '६:३० - ८:३० स.' : '6:30 - 8:30 AM'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <span className="material-symbols-outlined text-[16px] text-stone-600">delete_sweep</span>
                  <span className="font-semibold">{lang === 'MR' ? 'घंटागाडी:' : 'Sanitation:'}</span>
                </div>
                <span className="text-[11px] font-bold text-stone-800">
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
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border-2 border-indigo-600/30 hover:border-indigo-700 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center border border-indigo-300 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded-md border border-indigo-300">
                {lang === 'MR' ? 'थेट शासकीय लाभ' : 'Govt Benefits'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[17px] text-stone-900 mb-1">
              {lang === 'MR' ? 'सक्रिय शासकीय योजना' : 'Active Schemes Desk'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? 'थेट बँक खात्यात अनुदान व लाभ' : 'Direct DBT subsidy schemes'}
            </p>

            <div className="flex flex-col gap-2 bg-[#faf6ee] p-3 rounded-xl border border-[#efe7d8] text-[13px]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 truncate">
                  {lang === 'MR' ? 'माझी लाडकी बहीण' : 'Ladki Bahin Yojana'}
                </span>
                <span className="text-[12px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 shrink-0">₹१,५००/महिना</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 truncate">
                  {lang === 'MR' ? 'पीएम किसान सन्मान' : 'PM-Kisan 17th'}
                </span>
                <span className="text-[12px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">₹२,००० DBT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 truncate">
                  {lang === 'MR' ? 'शबरी / रमाई घरकुल' : 'PMAY Housing'}
                </span>
                <span className="text-[11px] font-extrabold text-indigo-800 bg-indigo-100/80 px-2 py-0.5 rounded-md shrink-0">
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
