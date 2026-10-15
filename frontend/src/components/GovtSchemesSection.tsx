import { LucideIcon } from './LucideIcon';
import React from 'react';
import type { Scheme } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface GovtSchemesSectionProps {
  schemes: Scheme[];
  onOpenCSC: () => void;
  onSaveScheme: (scheme: Scheme) => void;
  onSelectScheme?: (slug: string) => void;
  onOpenEligibilityFinder?: () => void;
}

export const GovtSchemesSection: React.FC<GovtSchemesSectionProps> = ({
  schemes,
  onOpenCSC,
  onSaveScheme,
  onSelectScheme,
  onOpenEligibilityFinder
}) => {
  const { lang } = useLanguage();

  return (
    <section id="govt-schemes" className="w-full mb-12 scroll-mt-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="font-heading font-extrabold text-[24px] text-emerald-950 flex items-center gap-2">
            <LucideIcon name="verified_user" className="text-indigo-800 text-[28px]" />
            <span>{lang === 'MR' ? 'शासकीय योजना व थेट लाभ मार्गदर्शन कक्ष' : 'Sarkari Yojana Guidance Desk (Direct Welfare)'}</span>
          </h2>
          <p className="text-[13px] text-stone-600">
            {lang === 'MR'
              ? 'शासकीय अनुदान, घरकुल व शिष्यवृत्तीसाठी सीएससी केंद्र किंवा अधिकृत पोर्टलवर थेट अर्ज करा'
              : 'Apply for govt subsidies & scholarships at CSC Kiosk or official portal links'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenEligibilityFinder && (
            <button
              type="button"
              onClick={onOpenEligibilityFinder}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-[13px] font-extrabold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <LucideIcon name="stars" className="text-[17px] text-stone-950" />
              <span>{lang === 'MR' ? 'पात्र योजना शोधा' : 'Check Eligibility'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCSC}
            className="px-3.5 py-2 rounded-xl bg-indigo-800 hover:bg-indigo-900 text-white text-[13px] font-extrabold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <LucideIcon name="contact_support" className="text-[17px]" />
            <span>{lang === 'MR' ? 'सीएससी केंद्र' : 'CSC Kiosk'}</span>
          </button>
        </div>
      </div>

      {/* 3 Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            onClick={() => onSelectScheme && onSelectScheme(scheme.slug)}
            className="group bg-white rounded-2xl p-5 shadow-xs hover:shadow-xl hover:shadow-indigo-900/10 border border-stone-200/80 hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Title */}
              <h3 className="font-heading font-extrabold text-[17px] text-stone-900 group-hover:text-indigo-900 mb-2 transition-colors">
                {scheme.title}
              </h3>

              {/* Description */}
              <p className="text-[12px] text-stone-600 mb-4 leading-relaxed">
                {scheme.description}
              </p>

              {/* Documents Required Checklist */}
              <div className="bg-[#faf6ee] p-3 rounded-xl border border-[#efe7dc] mb-4 shadow-2xs">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-1">
                  <LucideIcon name="task_alt" className="text-[16px] text-indigo-700" />
                  <span>{lang === 'MR' ? 'आवश्यक कागदपत्रे' : 'Required Documents'}</span>
                </div>
                <ul className="space-y-1.5">
                  {scheme.documentsRequired.map((doc, idx) => (
                    <li key={idx} className="text-[12px] text-stone-800 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0"></span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-2 pt-3 border-t border-[#efe7dc] flex items-center justify-between gap-2">
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[12px] text-indigo-800 font-extrabold hover:underline flex items-center gap-0.5"
              >
                <span>{scheme.actionLabel || (lang === 'MR' ? 'अधिकृत पोर्टलवर अर्ज करा' : 'Apply on Portal')}</span>
                <LucideIcon name="open_in_new" className="text-[14px]" />
              </a>

              <div className="flex items-center gap-2">
                {scheme.badgeText && (
                  <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    {scheme.badgeText}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveScheme(scheme);
                  }}
                  title={lang === 'MR' ? 'योजना जतन करा' : 'Bookmark this Scheme'}
                  className="p-1 rounded-lg text-stone-500 hover:text-indigo-900 hover:bg-[#faf6ee] transition-colors cursor-pointer"
                >
                  <LucideIcon name="bookmark_border" className="text-[20px]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
