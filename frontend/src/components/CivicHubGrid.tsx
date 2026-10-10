import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface CivicHubGridProps {
  onSelectModule: (moduleId: string) => void;
}

export const CivicHubGrid: React.FC<CivicHubGridProps> = ({ onSelectModule }) => {
  const { lang, t } = useLanguage();

  const modules = [
    {
      id: 'businesses',
      tag: lang === 'MR' ? 'नोंदणीकृत दुकाने' : '184 Listings',
      tagColor: 'text-[#a63b00]',
      title: lang === 'MR' ? 'स्थानिक दुकाने व सेवा' : 'Local Businesses & Shops',
      desc: lang === 'MR' ? 'किराणा, कृषी केंद्र, रिपेअरिंग, बांधकाम साहित्य व टेलर्स.' : 'Kirana, repair shops, seeds, building materials & tailors.',
      icon: 'storefront',
      iconBg: 'bg-[#003629]/10 text-[#003629]',
      linkText: lang === 'MR' ? 'दुकानांची यादी पहा' : 'Explore Directory',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'jobs',
      tag: lang === 'MR' ? 'रोजगार संधी' : '18 New Openings',
      tagColor: 'text-[#a63b00]',
      title: lang === 'MR' ? 'रोजगार व कामगार मंच' : 'Rojgar & Jobs Board',
      desc: lang === 'MR' ? 'शेती मजूर, ड्रायव्हर्स, वेल्डर, मिस्त्री व स्थानिक नोकऱ्या.' : 'Farm labor, drivers, warehouse staff, vocational trades.',
      icon: 'work',
      iconBg: 'bg-[#ff793f]/15 text-[#a63b00]',
      linkText: lang === 'MR' ? 'नोकऱ्या पहा व अर्ज करा' : 'View Wages & Apply',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'govt-schemes',
      tag: lang === 'MR' ? 'थेट शासकीय लाभ' : 'Direct Benefit',
      tagColor: 'text-[#002873]',
      title: lang === 'MR' ? 'शासकीय योजना दालन' : 'Sarkari Yojana Desk',
      desc: lang === 'MR' ? 'घरकुल (PMAY-G, रमाई, शबरी), पीएम किसान, लाडकी बहीण, पेन्शन.' : 'PM-Kisan, solar pumps, house subsidies, widow pensions.',
      icon: 'verified_user',
      iconBg: 'bg-[#dbe1ff] text-[#002873]',
      linkText: lang === 'MR' ? 'पात्रता व अर्ज पहा' : 'Check Eligibility',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'krishi',
      tag: lang === 'MR' ? 'थेट बाजारभाव' : 'Live Mandi Hub',
      tagColor: 'text-[#004d40]',
      title: lang === 'MR' ? 'कृषी केंद्र व बाजारभाव (Mandi)' : 'Krishi Kendra & APMC',
      desc: lang === 'MR' ? 'धान, सोयाबीन व तूर बाजारभाव, खत साठा व हवामान सल्ला.' : 'Pauni & Nagpur APMC rates, fertilizer pool, soil health cards.',
      icon: 'agriculture',
      iconBg: 'bg-[#b2dfdb] text-[#004d40]',
      linkText: lang === 'MR' ? 'आजचे दर तपासा' : "Check Today's Bhaav",
      linkIcon: 'arrow_forward'
    },
    {
      id: 'shiksha',
      tag: lang === 'MR' ? 'विद्यार्थी व तरुण' : 'Students & Youth',
      tagColor: 'text-[#5d4037]',
      title: lang === 'MR' ? 'शिक्षण व अभ्यासिका केंद्र' : 'Shiksha & Skill Center',
      desc: lang === 'MR' ? 'शाळा, शिष्यवृत्ती, मोफत सायकल योजना व ग्राम वाचनालय.' : 'ZP School exams, ITI admissions, scholarships, study rooms.',
      icon: 'school',
      iconBg: 'bg-[#d7ccc8] text-[#5d4037]',
      linkText: lang === 'MR' ? 'शिक्षण दालन उघडा' : 'Youth Portal',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'transport',
      tag: lang === 'MR' ? 'एसटी बस व रिक्षा' : 'MSRTC & Auto Stand',
      tagColor: 'text-[#8c5000]',
      title: lang === 'MR' ? 'एसटी बस व वाहतूक (Transport)' : 'ST Bus & Transport',
      desc: lang === 'MR' ? 'पवनी, भंडारा, नागपूर बसेस, ५०% महिला सवलत पास व ऑटो रिक्षा.' : 'Pauni, Bhandara, Nagpur ST buses, fares, 50% Mahila pass & auto contacts.',
      icon: 'directions_bus',
      iconBg: 'bg-[#ffecb3] text-[#8c5000]',
      linkText: lang === 'MR' ? 'बस वेळापत्रक पहा' : 'Check Bus Timings',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'marketplace',
      tag: lang === 'MR' ? 'गावातील खरेदी-विक्री' : 'P2P & B2B',
      tagColor: 'text-[#e65100]',
      title: lang === 'MR' ? 'ग्राम बाजार (Village Market)' : 'Gaon Bazaar / Market',
      desc: lang === 'MR' ? 'गाई-म्हशी, जुने ट्रॅक्टर, शेतीमाल व अवजारे खरेदी-विक्री.' : 'Buy/sell milk cattle, pre-owned tractors, farm harvest.',
      icon: 'shopping_bag',
      iconBg: 'bg-[#ffe0b2] text-[#e65100]',
      linkText: lang === 'MR' ? 'खरेदी-विक्री यादी पहा' : 'Browse Listings',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'announcements',
      tag: lang === 'MR' ? 'ग्रामपंचायत कारभार' : 'Governance & Audit',
      tagColor: 'text-[#37474f]',
      title: lang === 'MR' ? 'ग्रामसभा व अधिकृत सूचना' : 'Gram Sabha Notices',
      desc: lang === 'MR' ? 'ग्रामपंचायत ठराव, कर पावती, विकासकामे व सरपंच निर्णय.' : 'Published budget, tenders, tax receipts & Sarpanch decisions.',
      icon: 'description',
      iconBg: 'bg-[#cfd8dc] text-[#37474f]',
      linkText: lang === 'MR' ? 'सूचना फलक पहा' : 'Download Circulars',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'emergency',
      tag: lang === 'MR' ? 'तातडीची मदत' : '108 Immediate Response',
      tagColor: 'text-[#ba1a1a]',
      title: lang === 'MR' ? 'आपत्कालीन थेट संपर्क' : 'Emergency Speed-Dial',
      desc: lang === 'MR' ? 'रुग्णवाहिका (१०८), पोलीस (११२), अग्निशामक (१०१) व लाईनमन.' : 'Ambulance (108), Police Beat Chowki, MSEB Lineman.',
      icon: 'e911_emergency',
      iconBg: 'bg-[#ffdad6] text-[#ba1a1a]',
      linkText: lang === 'MR' ? 'तातडीचे क्रमांक पहा' : 'Open Hotline Directory',
      linkIcon: 'arrow_forward'
    }
  ];

  return (
    <section className="w-full mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div>
          <h2 className="font-heading font-extrabold text-[22px] text-[#003629] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a63b00]">grid_view</span>
            <span>{t('hub_title')}</span>
          </h2>
          <p className="text-[13px] text-[#404945]">{t('hub_subtitle')}</p>
        </div>
        <span className="text-[11px] font-bold text-[#376757] uppercase tracking-wider bg-[#f3ede4] px-3 py-1 rounded-lg border border-[#e8e2d9]">
          {lang === 'MR' ? '९ प्रमाणित ग्राम विभाग' : '9 Verified Civic Modules'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((m) => (
          <div
            key={m.id}
            onClick={() => onSelectModule(m.id)}
            className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer border border-[#e8e2d9] hover:border-[#1b4d3e]"
          >
            <div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform ${m.iconBg}`}>
                <span className="material-symbols-outlined text-[26px]">{m.icon}</span>
              </div>
              <span className={`text-[11px] uppercase tracking-wider font-extrabold ${m.tagColor}`}>
                {m.tag}
              </span>
              <h3 className="font-heading font-bold text-[17px] text-[#1d1b16] mt-1 mb-1">
                {m.title}
              </h3>
              <p className="text-[13px] text-[#404945] leading-relaxed">
                {m.desc}
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-[#f3ede4] text-[#003629] text-[13px] font-bold flex items-center gap-1 group-hover:text-[#a63b00] transition-colors">
              <span>{m.linkText}</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                {m.linkIcon}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
