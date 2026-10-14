import { LucideIcon } from './LucideIcon';
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const PanchayatNoticeStrip: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <section id="announcements" className="w-full mb-12 scroll-mt-28">
      {/* Official Notice Board Header Box */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-5 sm:p-6 mb-4 shadow-sm border border-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
            <LucideIcon name="gavel" className="text-[26px] text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-[18px] text-emerald-100">
                {lang === 'MR' ? 'आसगाव ग्राम माहिती व सूचना फलक • ताज्या घडामोडी' : 'Asgaon Village Civic Notice Board • Live Updates'}
              </h3>
            </div>
            <p className="text-[13px] text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              {lang === 'MR'
                ? 'स्थानिक कार्यालय, कृषी विभाग व आरोग्य केंद्रांकडून संकलित केलेल्या अधिकृत सूचना. गावकऱ्यांना माहिती व्हावी म्हणून नियमित अद्ययावत.'
                : 'Verified public notices collected from local agricultural, health, and civic departments for the awareness of Asgaon residents.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert(lang === 'MR' ? 'मासिक आसगाव वृत्तपत्रक पीडीएफ डाउनलोड झाले.' : 'Monthly Asgaon Gazette PDF downloaded.')}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 transition-colors text-[13px] font-extrabold flex items-center gap-2 shrink-0 shadow-sm cursor-pointer"
        >
          <LucideIcon name="download" className="text-[19px]" />
          <span>{lang === 'MR' ? 'मासिक बातमीपत्र डाउनलोड करा' : 'Download Monthly Gazette'}</span>
        </button>
      </div>

      {/* 3 Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="group bg-white rounded-xl p-4 border border-emerald-200/90 hover:border-emerald-500 shadow-xs hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 cursor-pointer">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 transition-all">
            <LucideIcon name="calendar_month" className="text-[24px]" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
              {lang === 'MR' ? 'ग्रामसेवक कार्यालयीन वेळ' : 'Gram Sevak Office Hours'}
            </div>
            <div className="text-[14px] font-extrabold text-stone-900 mt-0.5">
              {lang === 'MR' ? 'सोम - बुध, शुक्र (स. १० ते दु. २)' : 'Mon - Wed, Fri (10 AM - 2 PM)'}
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-xl p-4 border border-rose-200/90 hover:border-rose-500 shadow-xs hover:shadow-xl hover:shadow-rose-900/10 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 cursor-pointer">
          <div className="h-11 w-11 rounded-xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center text-rose-700 shrink-0 transition-all">
            <LucideIcon name="medical_services" className="text-[24px]" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
              {lang === 'MR' ? 'प्राथमिक आरोग्य केंद्र वैद्यकीय अधिकारी' : 'PHC On-Call Doctor'}
            </div>
            <a href="tel:9422001102" onClick={(e) => e.stopPropagation()} className="text-[14px] font-extrabold text-rose-700 hover:underline mt-0.5 block">
              {lang === 'MR' ? 'डॉ. अनिता शिंदे (मो: ९४२२००११०२)' : 'Dr. Anita Shinde (Ph: 9422001102)'}
            </a>
          </div>
        </div>

        <div className="group bg-white rounded-xl p-4 border border-amber-200/90 hover:border-amber-500 shadow-xs hover:shadow-xl hover:shadow-amber-900/10 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 cursor-pointer">
          <div className="h-11 w-11 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 transition-all">
            <LucideIcon name="bolt" className="text-[24px]" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
              {lang === 'MR' ? 'महावितरण (वीज) कनिष्ठ अभियंता' : 'MSEDCL Junior Engineer'}
            </div>
            <a href="tel:8888172233" onClick={(e) => e.stopPropagation()} className="text-[14px] font-extrabold text-amber-800 hover:underline mt-0.5 block">
              {lang === 'MR' ? 'आर. के. देशमुख (मो: ८८८८१७२२३३)' : 'R. K. Deshmukh (Ph: 8888172233)'}
            </a>
          </div>
        </div>
      </div>

      {/* RTI & Transparency Box */}
      <div className="group bg-white rounded-xl p-4 border border-stone-200/80 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <LucideIcon name="policy" className="text-[22px] text-emerald-800 mt-0.5 shrink-0" />
          <div>
            <div className="text-[13px] font-extrabold text-emerald-950">
              {lang === 'MR' ? 'माहिती अधिकार (RTI) व सार्वजनिक पारदर्शकता वचनबद्धता' : 'RTI & Public Transparency Commitment'}
            </div>
            <div className="text-[12px] text-stone-600 mt-0.5 max-w-3xl leading-relaxed">
              {lang === 'MR'
                ? 'माहितीचा अधिकार अधिनियम २००५ कलम ४(१)(ब) अंतर्गत गाव विकास निधी, १५ वा वित्त आयोग वाटप आणि मनरेगा हजेरी पत्रके पंचायत काउंटरवर तपासणीसाठी उपलब्ध आहेत.'
                : 'Under Section 4(1)(b) of the Right to Information Act 2005, village development budgets, 15th Finance Commission fund allocations, and MGNREGA muster rolls are available for open public scrutiny at the counter.'}
            </div>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-lg bg-[#faf6ee] text-emerald-950 text-[12px] font-bold border border-[#efe7dc] shrink-0">
          {lang === 'MR' ? 'नागरिक भेट: प्रत्येक मंगळवारी, स. ११:०० वा.' : 'Public Meeting: Every Tuesday, 11 AM'}
        </span>
      </div>
    </section>
  );
};
