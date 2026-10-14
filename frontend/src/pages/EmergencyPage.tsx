import { LucideIcon } from '../components/LucideIcon';
import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

interface EmergencyPageProps {
  onNavigateHome?: () => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onNavigateHome }) => {
  const { lang, t } = useLanguage();

  const hotlines = [
    {
      id: 1,
      title: lang === 'MR' ? 'राष्ट्रीय आपत्कालीन सेवा (पोलीस / अग्निशमन)' : 'National Emergency Helpline (Police / Fire)',
      phone: '112',
      badge: lang === 'MR' ? '२४/७ टोल-फ्री' : '24/7 Toll-Free',
      category: lang === 'MR' ? 'पोलीस व नागरी मदत' : 'Police & Civic Emergency',
      icon: 'local_police',
      bg: 'bg-[#fef3c7] text-[#93000a]'
    },
    {
      id: 2,
      title: lang === 'MR' ? 'राज्य रुग्णवाहिका व अपघात मदत सेवा' : 'State Ambulance & Trauma Response',
      phone: '108',
      badge: lang === 'MR' ? 'तातडीची मदत' : '24/7 Immediate',
      category: lang === 'MR' ? 'वैद्यकीय आणीबाणी' : 'Medical Emergency',
      icon: 'ambulance',
      bg: 'bg-[#fef3c7] text-[#ba1a1a]'
    },
    {
      id: 3,
      title: lang === 'MR' ? 'पवनी प्राथमिक आरोग्य केंद्र (PHC डॉक्टर)' : 'Pauni Primary Health Center (PHC Doctor On-Call)',
      phone: '9422001102',
      name: lang === 'MR' ? 'डॉ. अनिता शिंदे (वैद्यकीय अधिकारी)' : 'Dr. Anita Shinde (Medical Officer)',
      badge: lang === 'MR' ? 'स्थानिक PHC' : 'Local PHC',
      category: lang === 'MR' ? 'डॉक्टर ऑन-कॉल' : 'Doctor On-Call',
      icon: 'medical_services',
      bg: 'bg-[#dbe1ff] text-[#002873]'
    },
    {
      id: 4,
      title: lang === 'MR' ? 'महावितरण वीज लाईनमन व कनिष्ठ अभियंता' : 'MSEDCL Rural Electricity Lineman & JE',
      phone: '8888172233',
      name: lang === 'MR' ? 'आर. के. देशमुख (कनिष्ठ अभियंता)' : 'R. K. Deshmukh (Junior Engineer)',
      badge: lang === 'MR' ? 'वीज पुरवठा बिघाड' : 'Electrical Breakdown',
      category: lang === 'MR' ? 'वीज पुरवठा' : 'Power Grid',
      icon: 'bolt',
      bg: 'bg-[#fed7aa] text-[#c2410c]'
    },
    {
      id: 5,
      title: lang === 'MR' ? 'ग्रामसेवक नागरिक मदत कक्ष' : 'Gram Sevak Civic Office Desk',
      phone: '9822104500',
      name: lang === 'MR' ? 'एस. एन. जाधव (ग्रामसेवक)' : 'S. N. Jadhav (Gram Sevak)',
      badge: lang === 'MR' ? 'ग्रामपंचायत प्रशासन' : 'Panchayat Administration',
      category: lang === 'MR' ? 'नागरी अडचणी' : 'Civic Grievances',
      icon: 'shield_person',
      bg: 'bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]'
    },
    {
      id: 6,
      title: lang === 'MR' ? 'किसान कॉल सेंटर (शेती व कीड नियंत्रण सल्ला)' : 'Kisan Call Center (Agri Emergency & Advisory)',
      phone: '18001801551',
      badge: lang === 'MR' ? 'टोल-फ्री शेतकरी मदत' : 'Toll-Free Kisan Desk',
      category: lang === 'MR' ? 'कृषी सल्ला' : 'Pest & Livestock Alert',
      icon: 'phone_in_talk',
      bg: 'bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: t('nav_home'), onClick: onNavigateHome },
          { label: t('nav_emergency'), active: true }
        ]}
        
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hotlines.map((h) => (
          <div key={h.id} className="bg-white card-hover-subtle rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${h.bg}`}>
                  {h.category}
                </span>
                <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/60">
                  {h.badge}
                </span>
              </div>

              <h2 className="font-heading font-extrabold text-[16px] text-stone-900 mb-1">
                {h.title}
              </h2>

              {h.name && (
                <p className="text-[12px] font-bold text-emerald-800 mb-2 flex items-center gap-1">
                  <LucideIcon name="person" className="text-[15px]" />
                  <span>{h.name}</span>
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="font-mono text-base font-extrabold text-stone-900">{h.phone}</span>
              <a
                href={`tel:${h.phone}`}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 text-[13px] font-extrabold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <LucideIcon name="call" className="text-[16px]" />
                <span>{lang === 'MR' ? 'कॉल करा' : 'Call'}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
