import { LucideIcon } from './LucideIcon';
import React from 'react';
import type { Grievance } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface GrievanceDeskSectionProps {
  grievances: Grievance[];
  onOpenReportModal: () => void;
  onTrackComplaint: () => void;
}

export const GrievanceDeskSection: React.FC<GrievanceDeskSectionProps> = ({
  grievances,
  onOpenReportModal,
  onTrackComplaint
}) => {
  const { lang} = useLanguage();

  return (
    <section id="complaints" className="w-full mb-12 scroll-mt-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="font-heading font-extrabold text-[24px] text-emerald-950 flex items-center gap-2">
            <LucideIcon name="report_problem" className="text-amber-600 text-[28px]" />
            <span>{lang === 'MR' ? 'नागरी तक्रार निवारण व प्रभाग मंच' : 'Public Grievance & Ward Resolution Desk'}</span>
          </h2>
          <p className="text-[13px] text-stone-600">
            {lang === 'MR'
              ? 'गावपातळीवरील समस्यांची थेट स्थिती तपासा. २४ तासांत ग्रामसेवक कार्यालयाकडून अद्यतन केले जाते.'
              : 'Track community issues in real-time. Notice boards are updated every 24 hours.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTrackComplaint}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#efe7dc] text-stone-800 text-[13px] font-bold hover:bg-[#faf6ee] transition-colors cursor-pointer"
          >
            {lang === 'MR' ? 'स्थिती तपासा' : 'Track Status'}
          </button>
          <button
            type="button"
            onClick={onOpenReportModal}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[13px] font-extrabold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <LucideIcon name="campaign" className="text-[18px]" />
            <span>{lang === 'MR' ? 'समस्या / तक्रार नोंदवा' : 'Report a Village Issue'}</span>
          </button>
        </div>
      </div>

      {/* 3 Grievance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {grievances.map((item) => (
          <div
            key={item.id}
            onClick={onTrackComplaint}
            className="group bg-white rounded-2xl p-5 shadow-xs hover:shadow-xl hover:shadow-stone-900/10 border border-stone-200/80 hover:border-amber-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                    item.status === 'RESOLVED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {item.status === 'RESOLVED' && lang === 'MR' ? 'निवारण झाले' : item.statusBadge}
                </span>
                <span className="text-[11px] font-mono font-bold text-stone-600 bg-[#faf6ee] px-2 py-0.5 rounded border border-[#efe7dc]">
                  {lang === 'MR' ? 'तक्रार क्र.:' : 'Ref:'} {item.trackingNumber}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-extrabold text-[16px] text-stone-900 group-hover:text-amber-900 mb-2 leading-snug transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[12px] text-stone-600 mb-4 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            {/* Bottom Status Trail */}
            <div className="pt-3 border-t border-[#efe7dc] flex items-center justify-between text-[11px] text-stone-500">
              <span className="truncate">{lang === 'MR' ? 'नोंदवणारे:' : 'Reported:'} {item.reportedBy}</span>
              <span
                className={`font-bold ${
                  item.status === 'RESOLVED' ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {item.actionTimeline}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
