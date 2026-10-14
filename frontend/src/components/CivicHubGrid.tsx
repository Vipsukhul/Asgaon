import React from 'react';
import { LucideIcon } from './LucideIcon';
import { useLanguage } from '../context/LanguageContext';

interface CivicHubGridProps {
  onSelectModule: (moduleId: string) => void;
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
          <h2 className="font-heading font-extrabold text-[24px] sm:text-[28px] text-emerald-900 leading-tight">
            {lang === 'MR' ? 'गावकऱ्यांसाठी मुख्य सेवा दालन' : 'Village Civic & Essential Services'}
          </h2>
          <p className="text-[14px] text-stone-600">
            {lang === 'MR' ? 'शेतकरी, महिला व ज्येष्ठ नागरिकांसाठी एका स्पर्शात उपलब्ध माहिती' : 'One-touch access for farmers, women and village elders'}
          </p>
        </div>

        
      </div>

      {/* 2. HIGH-CONTRAST BIG TOUCH TILES FOR FARMERS & ELDERS (मोठे स्पर्श बटणे) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Tile 1: Krishi & Mandi */}
        <button
          type="button"
          onClick={() => onSelectModule('krishi')}
          className="group relative bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-500 shadow-xs hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-emerald-100 transition-all shadow-xs">
            <LucideIcon name="agriculture" className="text-[30px] sm:text-[32px]" />
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-stone-900 group-hover:text-emerald-800 leading-tight mb-1 transition-colors">
            {lang === 'MR' ? 'कृषी व बाजारभाव' : 'Krishi & Mandi'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-emerald-700 leading-tight">
            {lang === 'MR' ? 'पवनी APMC भाव' : 'Live Crop Rates'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200 transition-colors shadow-2xs">
            {lang === 'MR' ? 'खते व बियाणे' : 'Seeds & Inputs'}
          </span>
        </button>

        {/* Tile 2: ST Bus */}
        <button
          type="button"
          onClick={() => onSelectModule('transport')}
          className="group relative bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 hover:border-sky-500 shadow-xs hover:shadow-xl hover:shadow-sky-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200/80 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-sky-100 transition-all shadow-xs">
            <LucideIcon name="directions_bus" className="text-[30px] sm:text-[32px]" />
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-stone-900 group-hover:text-sky-800 leading-tight mb-1 transition-colors">
            {lang === 'MR' ? 'एसटी बस वेळा' : 'ST Bus Schedule'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-sky-700 leading-tight">
            {lang === 'MR' ? 'पवनी, भंडारा बसेस' : 'Pauni & Bhandara'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full border border-sky-200 transition-colors shadow-2xs">
            {lang === 'MR' ? '५०% महिला सवलत' : '50% Discount'}
          </span>
        </button>

        {/* Tile 3: Gram Panchayat */}
        <button
          type="button"
          onClick={() => onSelectModule('announcements')}
          className="group relative bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 hover:border-indigo-500 shadow-xs hover:shadow-xl hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-indigo-100 transition-all shadow-xs">
            <LucideIcon name="account_balance" className="text-[30px] sm:text-[32px]" />
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-stone-900 group-hover:text-indigo-800 leading-tight mb-1 transition-colors">
            {lang === 'MR' ? 'ग्रामपंचायत' : 'Panchayat'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-indigo-700 leading-tight">
            {lang === 'MR' ? 'दाखले व सूचना' : 'Notices & Forms'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-indigo-800 bg-indigo-100/80 px-2.5 py-0.5 rounded-full border border-indigo-200 transition-colors shadow-2xs">
            {lang === 'MR' ? 'ग्रामसेवक वेळ' : 'Office Timings'}
          </span>
        </button>

        {/* Tile 4: Health & Doctor */}
        <button
          type="button"
          onClick={() => onSelectModule('emergency')}
          className="group relative bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 hover:border-rose-500 shadow-xs hover:shadow-xl hover:shadow-rose-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200/80 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-rose-100 transition-all shadow-xs">
            <LucideIcon name="medical_services" className="text-[30px] sm:text-[32px]" />
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-stone-900 group-hover:text-rose-800 leading-tight mb-1 transition-colors">
            {lang === 'MR' ? 'दवाखाना व आरोग्य' : 'Health & Doctor'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-rose-700 leading-tight">
            {lang === 'MR' ? '१०८ रुग्णवाहिका' : 'PHC & 108 Ambulance'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-rose-800 bg-rose-100/80 px-2.5 py-0.5 rounded-full border border-rose-200 transition-colors shadow-2xs">
            {lang === 'MR' ? '२४x७ आपत्कालीन' : '24x7 Emergency'}
          </span>
        </button>

        {/* Tile 5: Govt Schemes */}
        <button
          type="button"
          onClick={() => onSelectModule('schemes')}
          className="group relative bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 hover:border-purple-500 shadow-xs hover:shadow-xl hover:shadow-purple-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-purple-100 transition-all shadow-xs">
            <LucideIcon name="assured_workload" className="text-[30px] sm:text-[32px]" />
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-stone-900 group-hover:text-purple-800 leading-tight mb-1 transition-colors">
            {lang === 'MR' ? 'शासकीय योजना' : 'Govt Schemes'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-purple-700 leading-tight">
            {lang === 'MR' ? 'लाडकी बहीण / किसान' : 'DBT & Subsidies'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-purple-800 bg-purple-100/80 px-2.5 py-0.5 rounded-full border border-purple-200 transition-colors shadow-2xs">
            {lang === 'MR' ? 'घरकुल अनुदान' : 'PMAY Housing'}
          </span>
        </button>

        {/* Tile 6: Local Shops & Services */}
        <button
          type="button"
          onClick={() => onSelectModule('businesses')}
          className="group relative bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 hover:border-amber-500 shadow-xs hover:shadow-xl hover:shadow-amber-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer select-none"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-amber-100 transition-all shadow-xs">
            <LucideIcon name="storefront" className="text-[30px] sm:text-[32px]" />
          </div>
          <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-stone-900 group-hover:text-amber-800 leading-tight mb-1 transition-colors">
            {lang === 'MR' ? 'स्थानिक दुकाने' : 'Village Shops'}
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-amber-700 leading-tight">
            {lang === 'MR' ? 'ट्रॅक्टर, किराणा, कामे' : 'Tractor, Daily Stores'}
          </span>
          <span className="mt-2 text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200 transition-colors shadow-2xs">
            {lang === 'MR' ? 'गाव डिरेक्टरी' : 'Local Directory'}
          </span>
        </button>
      </div>

      {/* 3. Real-Time Interactive Village Widgets Grid (4 Pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {/* Widget 1: Live Pauni APMC Mandi Rates */}
        <div
          onClick={() => onSelectModule('krishi')}
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-1.5 border border-stone-200/80 hover:border-emerald-500 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 group-hover:scale-105 group-hover:bg-emerald-100 transition-all">
                <LucideIcon name="agriculture" className="text-[24px]" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {lang === 'MR' ? 'थेट बाजारभाव' : 'Live Mandi'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[17px] text-stone-900 group-hover:text-emerald-800 mb-1 transition-colors">
              {lang === 'MR' ? 'पवनी कृषी उत्पन्न बाजार' : 'Pauni APMC Rates'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? 'आजचे प्रत्यक्ष सौदे व हमीभाव' : "Today's live trading benchmarks"}
            </p>

            <div className="flex flex-col gap-2 bg-[#faf6ee] p-3 rounded-xl border border-[#efe7d8] shadow-2xs">
              {displayPrices.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[13px]">
                  <span className="font-bold text-stone-800">{item.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-emerald-700">₹{item.price}</span>
                    <span className="text-[11px] font-bold text-emerald-700">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f3ede4] text-emerald-700 text-xs font-bold flex items-center justify-between">
            <span>{lang === 'MR' ? 'सर्व दर तपासा' : 'View All Crops'}</span>
            <LucideIcon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Widget 2: Upcoming ST Bus Departures */}
        <div
          onClick={() => onSelectModule('transport')}
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-xl hover:shadow-sky-900/10 transition-all duration-300 hover:-translate-y-1.5 border border-stone-200/80 hover:border-sky-500 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200/80 group-hover:scale-105 group-hover:bg-sky-100 transition-all">
                <LucideIcon name="directions_bus" className="text-[24px]" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-md border border-sky-200">
                {lang === 'MR' ? 'पुढील बसेस' : 'Next Departures'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[17px] text-stone-900 group-hover:text-sky-800 mb-1 transition-colors">
              {lang === 'MR' ? 'आसगाव बस थांबा वेळापत्रक' : 'Asgaon ST Stand'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? '५०% महिला सवलत पास लागू' : 'MSRTC 50% Mahila pass valid'}
            </p>

            <div className="flex flex-col gap-2 bg-[#faf6ee] p-3 rounded-xl border border-[#efe7d8] shadow-2xs">
              {upcomingBuses.map((bus, idx) => (
                <div key={idx} className="flex items-center justify-between text-[13px]">
                  <div className="flex flex-col">
                    <span className="font-bold text-stone-800">{bus.dest}</span>
                    <span className="text-[10px] font-semibold text-stone-500">{bus.type}</span>
                  </div>
                  <span className="font-extrabold text-sky-800 bg-sky-100/90 px-2.5 py-0.5 rounded-md border border-sky-200">
                    {bus.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f3ede4] text-sky-700 text-xs font-bold flex items-center justify-between">
            <span>{lang === 'MR' ? 'पूर्ण बस वेळापत्रक पहा' : 'View Full Schedule'}</span>
            <LucideIcon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Widget 3: Village Utilities & Daily Status */}
        <div
          onClick={() => onSelectModule('businesses')}
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300 hover:-translate-y-1.5 border border-stone-200/80 hover:border-amber-500 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/80 group-hover:scale-105 group-hover:bg-amber-100 transition-all">
                <LucideIcon name="bolt" className="text-[24px]" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-200">
                {lang === 'MR' ? 'नागरी सुविधा' : 'Daily Utilities'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[17px] text-stone-900 group-hover:text-amber-800 mb-1 transition-colors">
              {lang === 'MR' ? 'पाणी, वीज व स्वच्छता' : 'Utilities & Daily Status'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? 'दैनंदिन ग्राम सेवा थेट स्थिती' : 'Current village utility metrics'}
            </p>

            <div className="flex flex-col gap-2 bg-[#faf6ee] p-3 rounded-xl border border-[#efe7d8] shadow-2xs text-[13px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <LucideIcon name="electric_meter" className="text-[16px] text-amber-700" />
                  <span className="font-semibold">{lang === 'MR' ? 'वीज पुरवठा:' : 'Power:'}</span>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                  {lang === 'MR' ? 'सुरळीत सुरू' : 'Normal'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <LucideIcon name="water_drop" className="text-[16px] text-sky-600" />
                  <span className="font-semibold">{lang === 'MR' ? 'नळ पाणी:' : 'Water:'}</span>
                </div>
                <span className="text-[11px] font-bold text-sky-800 bg-sky-100/90 px-2 py-0.5 rounded-md border border-sky-300">
                  {lang === 'MR' ? '६:३० - ८:३० स.' : '6:30 - 8:30 AM'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <LucideIcon name="delete_sweep" className="text-[16px] text-stone-600" />
                  <span className="font-semibold">{lang === 'MR' ? 'घंटागाडी:' : 'Sanitation:'}</span>
                </div>
                <span className="text-[11px] font-bold text-stone-700">
                  {lang === 'MR' ? 'सकाळी ९:००' : '9:00 AM'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f3ede4] text-amber-700 text-xs font-bold flex items-center justify-between">
            <span>{lang === 'MR' ? 'स्थानिक सेवा डिरेक्टरी' : 'Local Directory'}</span>
            <LucideIcon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Widget 4: Trending Govt Schemes */}
        <div
          onClick={() => onSelectModule('schemes')}
          className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 hover:-translate-y-1.5 border border-stone-200/80 hover:border-purple-500 flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200/80 group-hover:scale-105 group-hover:bg-purple-100 transition-all">
                <LucideIcon name="verified_user" className="text-[24px]" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100/80 px-2.5 py-0.5 rounded-md border border-purple-200">
                {lang === 'MR' ? 'थेट शासकीय लाभ' : 'Govt Benefits'}
              </span>
            </div>

            <h3 className="font-heading font-bold text-[17px] text-stone-900 group-hover:text-purple-800 mb-1 transition-colors">
              {lang === 'MR' ? 'सक्रिय शासकीय योजना' : 'Active Schemes Desk'}
            </h3>
            <p className="text-[12px] text-stone-500 mb-3">
              {lang === 'MR' ? 'थेट बँक खात्यात अनुदान व लाभ' : 'Direct DBT subsidy schemes'}
            </p>

            <div className="flex flex-col gap-2 bg-[#faf6ee] p-3 rounded-xl border border-[#efe7d8] shadow-2xs text-[13px]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 truncate">
                  {lang === 'MR' ? 'माझी लाडकी बहीण' : 'Ladki Bahin Yojana'}
                </span>
                <span className="text-[12px] font-extrabold text-purple-900 bg-purple-100/90 px-2 py-0.5 rounded-md border border-purple-200 shrink-0">₹१,५००/महिना</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 truncate">
                  {lang === 'MR' ? 'पीएम किसान सन्मान' : 'PM-Kisan 17th'}
                </span>
                <span className="text-[12px] font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0 border border-emerald-300">₹२,००० DBT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 truncate">
                  {lang === 'MR' ? 'शबरी / रमाई घरकुल' : 'PMAY Housing'}
                </span>
                <span className="text-[11px] font-extrabold text-purple-900 bg-purple-100/90 px-2 py-0.5 rounded-md shrink-0 border border-purple-200">
                  {lang === 'MR' ? 'अर्ज सुरू' : 'Open'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f3ede4] text-purple-700 text-xs font-bold flex items-center justify-between">
            <span>{lang === 'MR' ? 'पात्रता व अर्ज पहा' : 'Check Eligibility'}</span>
            <LucideIcon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
};
