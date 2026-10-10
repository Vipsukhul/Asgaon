import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';

interface EmergencyPageProps {
  onNavigateHome?: () => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onNavigateHome }) => {
  const hotlines = [
    {
      id: 1,
      title: 'National Emergency Helpline (पोलीस / अग्निशमन)',
      phone: '112',
      badge: '24/7 Toll-Free',
      category: 'Police & Civic Emergency',
      icon: 'local_police',
      bg: 'bg-[#ffdad6] text-[#93000a]'
    },
    {
      id: 2,
      title: 'State Ambulance & Trauma Response',
      phone: '108',
      badge: '24/7 Immediate',
      category: 'Medical Emergency',
      icon: 'ambulance',
      bg: 'bg-[#ffdad6] text-[#ba1a1a]'
    },
    {
      id: 3,
      title: 'Pauni Primary Health Center (PHC Doctor On-Call)',
      phone: '9422001102',
      name: 'Dr. Anita Shinde (Medical Officer)',
      badge: 'Local PHC',
      category: 'Doctor On-Call',
      icon: 'medical_services',
      bg: 'bg-[#dbe1ff] text-[#002873]'
    },
    {
      id: 4,
      title: 'MSEDCL Rural Electricity Lineman & JE',
      phone: '8888172233',
      name: 'R. K. Deshmukh (Junior Engineer)',
      badge: 'Electrical Breakdown',
      category: 'Power Grid',
      icon: 'bolt',
      bg: 'bg-[#ffdbce] text-[#a63b00]'
    },
    {
      id: 5,
      title: 'Gram Sevak Civic Office Desk',
      phone: '9822104500',
      name: 'S. N. Jadhav (Gram Sevak)',
      badge: 'Panchayat Administration',
      category: 'Civic Grievances',
      icon: 'shield_person',
      bg: 'bg-[#baeed9] text-[#002117]'
    },
    {
      id: 6,
      title: 'Kisan Call Center (Agri Emergency & Advisory)',
      phone: '18001801551',
      badge: 'Toll-Free Kisan Desk',
      category: 'Pest & Livestock Alert',
      icon: 'phone_in_talk',
      bg: 'bg-[#baeed9] text-[#002117]'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Emergency Speed-Dial Directory (आपत्कालीन संपर्क)', active: true }
        ]}
        rightBadge={
          <div className="flex items-center gap-1.5 bg-[#ffdad6] text-[#93000a] px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[15px] text-[#ba1a1a]">e911_emergency</span>
            <span>24x7 Immediate Citizen Hotline</span>
          </div>
        }
      />

      <div className="bg-[#ffdad6] text-[#93000a] rounded-2xl p-6 border border-[#ffb4ab] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[28px] text-[#ba1a1a]">e911_emergency</span>
            <h1 className="font-heading font-extrabold text-[24px] text-[#ba1a1a]">
              Asgaon 24/7 Emergency Speed-Dial Directory
            </h1>
          </div>
          <p className="text-[13px] text-[#93000a] font-medium">
            Immediate 1-touch telephone connection for medical emergencies, police, snake-bite response, power breakdown &amp; panchayat officers.
          </p>
        </div>

        <a
          href="tel:112"
          className="px-5 py-3 rounded-xl bg-[#ba1a1a] text-white hover:bg-[#93000a] text-[14px] font-bold flex items-center gap-2 shadow-sm transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">call</span>
          <span>Dial 112 National Police</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hotlines.map((h) => (
          <div key={h.id} className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${h.bg}`}>
                  <span className="material-symbols-outlined text-[22px]">{h.icon}</span>
                </div>
                <span className="text-[11px] font-bold bg-[#f3ede4] text-[#1d1b16] px-2 py-0.5 rounded">
                  {h.badge}
                </span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-[#a63b00] mb-1">
                {h.category}
              </div>
              <h3 className="font-heading font-bold text-[16px] text-[#1d1b16] mb-1">{h.title}</h3>
              {h.name && <p className="text-[12px] text-[#707974] mb-3">{h.name}</p>}

              <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] my-3 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#707974]">Emergency Number</span>
                <span className="font-heading font-extrabold text-[20px] text-[#ba1a1a]">
                  {h.phone}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f3ede4]">
              <a
                href={`tel:${h.phone}`}
                className="w-full py-2.5 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>Speed Dial Now</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
