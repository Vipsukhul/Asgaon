import { LucideIcon } from './LucideIcon';
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
    <section className="w-full bg-amber-50 text-amber-950 py-2 px-3 sm:px-4 shadow-xs rounded-xl mb-4 border border-amber-200/90 flex items-center justify-between gap-3 overflow-hidden">
      {/* Left Icon & Badge */}
      <div className="flex items-center gap-2 shrink-0 z-10 bg-amber-50 pr-2">
        <span className="flex h-3 w-3 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
        </span>
        <LucideIcon name="campaign" className="text-[20px] text-amber-700 shrink-0" />
        <span className="text-[11px] uppercase tracking-wider text-amber-900 font-black hidden sm:inline px-2 py-0.5 rounded-full bg-amber-200/80 border border-amber-300">
          {lang === 'MR' ? 'थेट' : 'LIVE'}
        </span>
      </div>

      {/* Marquee Center Stream */}
      <div className="flex-1 overflow-hidden relative cursor-pointer" title={lang === 'MR' ? 'थांबवण्यासाठी माउस ठेवा' : 'Hover to pause ticker'}>
        <div className="animate-marquee whitespace-nowrap text-[13px] font-semibold text-stone-800 flex items-center gap-8">
          <span>{alertText}</span>
          <span>{alertText}</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0 z-10 bg-amber-50 pl-2 border-l border-amber-200">
        {onViewAllGazettes && (
          <button
            type="button"
            onClick={onViewAllGazettes}
            className="text-emerald-800 hover:text-emerald-950 text-[12px] font-bold flex items-center hover:underline whitespace-nowrap"
          >
            <span>{lang === 'MR' ? 'सर्व पहा' : 'View All'}</span>
            <LucideIcon name="chevron_right" className="text-[16px] ml-0.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-stone-500 hover:text-stone-800 p-1 rounded-md text-[11px] font-bold cursor-pointer"
          title={lang === 'MR' ? 'सूचना बंद करा' : 'Dismiss Alert'}
        >
          {lang === 'MR' ? 'बंद करा' : 'Dismiss'}
        </button>
      </div>
    </section>
  );
};
