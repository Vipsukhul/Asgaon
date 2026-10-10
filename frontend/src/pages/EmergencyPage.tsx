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
      bg: 'bg-[#ffdad6] text-[#93000a]'
    },
    {
      id: 2,
      title: lang === 'MR' ? 'राज्य रुग्णवाहिका व अपघात मदत सेवा' : 'State Ambulance & Trauma Response',
      phone: '108',
      badge: lang === 'MR' ? 'तातडीची मदत' : '24/7 Immediate',
      category: lang === 'MR' ? 'वैद्यकीय आणीबाणी' : 'Medical Emergency',
      icon: 'ambulance',
      bg: 'bg-[#ffdad6] text-[#ba1a1a]'
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
      bg: 'bg-[#ffdbce] text-[#a63b00]'
    },
    {
      id: 5,
      title: lang === 'MR' ? 'ग्रामसेवक नागरिक मदत कक्ष' : 'Gram Sevak Civic Office Desk',
      phone: '9822104500',
      name: lang === 'MR' ? 'एस. एन. जाधव (ग्रामसेवक)' : 'S. N. Jadhav (Gram Sevak)',
      badge: lang === 'MR' ? 'ग्रामपंचायत प्रशासन' : 'Panchayat Administration',
      category: lang === 'MR' ? 'नागरी अडचणी' : 'Civic Grievances',
      icon: 'shield_person',
      bg: 'bg-[#baeed9] text-[#002117]'
    },
    {
      id: 6,
      title: lang === 'MR' ? 'किसान कॉल सेंटर (शेती व कीड नियंत्रण सल्ला)' : 'Kisan Call Center (Agri Emergency & Advisory)',
      phone: '18001801551',
      badge: lang === 'MR' ? 'टोल-फ्री शेतकरी मदत' : 'Toll-Free Kisan Desk',
      category: lang === 'MR' ? 'कृषी सल्ला' : 'Pest & Livestock Alert',
      icon: 'phone_in_talk',
      bg: 'bg-[#baeed9] text-[#002117]'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: t('nav_home'), onClick: onNavigateHome },
          { label: lang === 'MR' ? 'आपत्कालीन थेट संपर्क क्रमांक' : 'Emergency Speed-Dial Directory', active: true }
        ]}
        rightBadge={
          <div className="flex items-center gap-1.5 bg-[#ffdad6] text-[#93000a] px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[15px] text-[#ba1a1a]">e911_emergency</span>
            <span>{lang === 'MR' ? '२४x७ नागरिकांसाठी थेट मदत' : '24x7 Immediate Citizen Hotline'}</span>
          </div>
        }
      />

      <div className="bg-[#ffdad6] text-[#93000a] rounded-2xl p-6 border border-[#ffb4ab] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[28px] text-[#ba1a1a]">e911_emergency</span>
            <h1 className="font-heading font-extrabold text-[24px] text-[#ba1a1a]">
              {lang === 'MR' ? 'आसगाव २४/७ आपत्कालीन थेट संपर्क' : 'Asgaon 24/7 Emergency Speed-Dial Directory'}
            </h1>
          </div>
          <p className="text-[13px] text-[#93000a] font-medium">
            {lang === 'MR'
              ? 'वैद्यकीय आणीबाणी, पोलीस मदत, सर्पदंश उपचार, वीज बिघाड व ग्रामपंचायत अधिकाऱ्यांशी १-क्लिक थेट संपर्क.'
              : 'Immediate 1-touch telephone connection for medical emergencies, police, snake-bite response, power breakdown & panchayat officers.'}
          </p>
        </div>

        <a
          href="tel:112"
          className="px-5 py-3 rounded-xl bg-[#ba1a1a] text-white hover:bg-[#93000a] text-[14px] font-bold flex items-center gap-2 shadow-sm transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">call</span>
          <span>{lang === 'MR' ? 'डायल ११२ (पोलीस मदत)' : 'Dial 112 National Police'}</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hotlines.map((h) => (
          <div key={h.id} className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${h.bg}`}>
                  {h.category}
                </span>
                <span className="text-[11px] font-bold text-[#707974] bg-[#f9f3ea] px-2 py-0.5 rounded">
                  {h.badge}
                </span>
              </div>

              <h2 className="font-heading font-bold text-[16px] text-[#1d1b16] mb-1">
                {h.title}
              </h2>

              {h.name && (
                <p className="text-[12px] font-semibold text-[#006a4e] mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  <span>{h.name}</span>
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#f3ede4] flex items-center justify-between">
              <span className="font-mono text-base font-bold text-[#1d1b16]">{h.phone}</span>
              <a
                href={`tel:${h.phone}`}
                className="px-4 py-1.5 rounded-xl bg-[#003629] text-white hover:bg-[#1b4d3e] text-[12px] font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">call</span>
                <span>{lang === 'MR' ? 'कॉल करा' : 'Call'}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
