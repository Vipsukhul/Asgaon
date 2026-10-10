import React from 'react';

interface CivicHubGridProps {
  onSelectModule: (moduleId: string) => void;
}

export const CivicHubGrid: React.FC<CivicHubGridProps> = ({ onSelectModule }) => {
  const modules = [
    {
      id: 'businesses',
      tag: '184 Listings',
      tagColor: 'text-[#a63b00]',
      title: 'Local Vyapar & Shops',
      desc: 'Kirana, repair shops, seeds, building materials & tailors.',
      icon: 'storefront',
      iconBg: 'bg-[#003629]/10 text-[#003629]',
      linkText: 'Explore Directory',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'jobs',
      tag: '18 New Openings',
      tagColor: 'text-[#a63b00]',
      title: 'Rojgar & Berojgari',
      desc: 'Farm labor, drivers, warehouse staff, vocational trades.',
      icon: 'work',
      iconBg: 'bg-[#ff793f]/15 text-[#a63b00]',
      linkText: 'View Wages & Apply',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'govt-schemes',
      tag: 'Direct Benefit',
      tagColor: 'text-[#002873]',
      title: 'Sarkari Yojana Desk',
      desc: 'PM-Kisan, solar pumps, house subsidies, widow pensions.',
      icon: 'verified_user',
      iconBg: 'bg-[#dbe1ff] text-[#002873]',
      linkText: 'Check Eligibility',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'krishi',
      tag: 'Live Mandi Hub',
      tagColor: 'text-[#004d40]',
      title: 'Krishi Kendra & APMC',
      desc: 'Pune & Haveli APMC rates, fertilizer pool, soil health cards.',
      icon: 'agriculture',
      iconBg: 'bg-[#b2dfdb] text-[#004d40]',
      linkText: "Check Today's Bhaav",
      linkIcon: 'arrow_forward'
    },
    {
      id: 'shiksha',
      tag: 'Students & Youth',
      tagColor: 'text-[#5d4037]',
      title: 'Shiksha & Skill Center',
      desc: 'ZP School exams, ITI admissions, scholarships, study rooms.',
      icon: 'school',
      iconBg: 'bg-[#d7ccc8] text-[#5d4037]',
      linkText: 'Youth Portal',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'transport',
      tag: 'MSRTC & Auto Stand',
      tagColor: 'text-[#8c5000]',
      title: 'ST Bus & Vaahatuk (वाहतूक)',
      desc: 'Pauni, Bhandara, Nagpur ST buses, fares, 50% Mahila pass & auto contacts.',
      icon: 'directions_bus',
      iconBg: 'bg-[#ffecb3] text-[#8c5000]',
      linkText: 'Check Bus Timings',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'marketplace',
      tag: 'P2P & B2B',
      tagColor: 'text-[#e65100]',
      title: 'Gaon Bazaar / Weekly Haat',
      desc: 'Buy/sell milk cattle, pre-owned tractors, farm harvest.',
      icon: 'shopping_bag',
      iconBg: 'bg-[#ffe0b2] text-[#e65100]',
      linkText: 'Browse Listings',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'announcements',
      tag: 'Governance & Audit',
      tagColor: 'text-[#37474f]',
      title: 'Gram Sabha Minutes',
      desc: 'Published budget, tenders, tax receipts & Sarpanch decisions.',
      icon: 'description',
      iconBg: 'bg-[#cfd8dc] text-[#37474f]',
      linkText: 'Download PDF Gazettes',
      linkIcon: 'arrow_forward'
    },
    {
      id: 'emergency',
      tag: '108 Immediate Response',
      tagColor: 'text-[#ba1a1a]',
      title: 'Emergency Speed-Dial',
      desc: 'Ambulance (108), Police Beat Chowki, MSEB Lineman.',
      icon: 'e911_emergency',
      iconBg: 'bg-[#ffdad6] text-[#ba1a1a]',
      linkText: 'Open Hotline Directory',
      linkIcon: 'arrow_forward'
    }
  ];

  return (
    <section className="w-full mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div>
          <h2 className="font-heading font-extrabold text-[22px] text-[#003629] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a63b00]">grid_view</span>
            <span>Essential Village Hub Services</span>
          </h2>
          <p className="text-[13px] text-[#404945]">Instant access to verified civic, agricultural, commerce, and welfare pillars</p>
        </div>
        <span className="text-[11px] font-bold text-[#376757] uppercase tracking-wider bg-[#f3ede4] px-3 py-1 rounded-lg border border-[#e8e2d9]">
          9 Verified Civic Modules
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
