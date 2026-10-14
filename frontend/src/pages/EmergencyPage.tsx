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
        rightBadge={
          <div className="flex items-center gap-1.5 bg-[#fef3c7] text-[#93000a] px-3 py-1 rounded-full text-[11px] font-bold">
            <LucideIcon name="e911_emergency" className="text-[15px] text-[#ba1a1a]" />
            <span>{lang === 'MR' ? '२४x७ नागरिकांसाठी थेट मदत' : '24x7 Immediate Citizen Hotline'}</span>
          </div>
        }
      />

      <div className="bg-[#fef3c7] text-[#93000a] rounded-2xl p-6 border border-[#fde68a] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LucideIcon name="e911_emergency" className="text-[28px] text-[#ba1a1a]" />
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
          <LucideIcon name="call" className="text-[20px]" />
          <span>{lang === 'MR' ? 'डायल ११२ (पोलीस मदत)' : 'Dial 112 National Police'}</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hotlines.map((h) => (
          <div key={h.id} className="bg-white rounded-2xl p-5 border-2 border-emerald-700/15 hover:border-emerald-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${h.bg}`}>
                  {h.category}
                </span>
                <span className="text-[11px] font-bold text-stone-600 bg-[#faf6ee] px-2 py-0.5 rounded border border-[#efe7dc]">
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

            <div className="mt-4 pt-3 border-t border-[#efe7dc] flex items-center justify-between">
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
