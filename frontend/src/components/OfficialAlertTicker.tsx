import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface OfficialAlertTickerProps {
  onViewAllGazettes?: () => void;
  alerts?: any[];
}

export const OfficialAlertTicker: React.FC<OfficialAlertTickerProps> = ({ onViewAllGazettes, alerts }) => {
  const { lang } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const defaultAlert = lang === 'MR'
    ? "अधिकृत सूचना: कालवा सिंचन पाणी सोडण्याचे वेळापत्रक — दक्षिण ब्लॉकसाठी गुरुवारी सकाळी ०८:०० वा. • जिल्हा परिषद शाळेत या शनिवारी मोफत आरोग्य तपासणी शिबीर (स. ९ ते दु. ४) • आसगाव कालवा पाणी वाटप उद्या सकाळी ०६:०० वा. सुरू होत आहे •"
    : "Official Alert: Canal Irrigation Water Release scheduled for South Block on Thursday, 8:00 AM • Free Pulse Polio & General Health Camp at ZP High School this Saturday (9 AM - 4 PM) • Asgaon Canal Water Roster: Rotational irrigation commences tomorrow at 06:00 AM •";

  const alertText = alerts && alerts.length > 0 
    ? alerts.map((a: any) => `${a.priority === 'URGENT' ? (lang === 'MR' ? '🚨 तातडीची सूचना: ' : '🚨 URGENT: ') : ''}${a.title}: ${a.message}`).join(' • ') + ' • '
    : defaultAlert;

  return (
    <section className="w-full bg-[#ffdad6] text-[#93000a] py-2 px-3 sm:px-4 shadow-xs rounded-xl mb-4 border border-[#ffb4ab] flex items-center justify-between gap-3 overflow-hidden">
      {/* Left Icon & Badge */}
      <div className="flex items-center gap-2 shrink-0 z-10 bg-[#ffdad6] pr-2">
        <span className="flex h-3 w-3 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ba1a1a] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ba1a1a]"></span>
        </span>
        <span className="material-symbols-outlined text-[20px] text-[#ba1a1a] shrink-0">campaign</span>
        <span className="text-[11px] uppercase tracking-wider text-[#ba1a1a] font-black hidden sm:inline px-1.5 py-0.5 rounded bg-white/60">
          {lang === 'MR' ? 'थेट' : 'LIVE'}
        </span>
      </div>

      {/* Marquee Center Stream */}
      <div className="flex-1 overflow-hidden relative cursor-pointer" title={lang === 'MR' ? 'थांबवण्यासाठी माउस ठेवा' : 'Hover to pause ticker'}>
        <div className="animate-marquee whitespace-nowrap text-[13px] font-semibold text-[#93000a] flex items-center gap-8">
          <span>{alertText}</span>
          <span>{alertText}</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0 z-10 bg-[#ffdad6] pl-2 border-l border-[#ffb4ab]">
        {onViewAllGazettes && (
          <button
            type="button"
            onClick={onViewAllGazettes}
            className="text-[#ba1a1a] text-[12px] font-bold flex items-center hover:underline whitespace-nowrap"
          >
            <span>{lang === 'MR' ? 'सर्व पहा' : 'View All'}</span>
            <span className="material-symbols-outlined text-[16px] ml-0.5">chevron_right</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-[#93000a] hover:text-[#ba1a1a] p-1 rounded-md text-[11px] font-bold"
          title={lang === 'MR' ? 'सूचना बंद करा' : 'Dismiss Alert'}
        >
          {lang === 'MR' ? 'बंद करा' : 'Dismiss'}
        </button>
      </div>
    </section>
  );
};
