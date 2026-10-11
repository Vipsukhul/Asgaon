import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const PanchayatNoticeStrip: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <section id="announcements" className="w-full mb-12 scroll-mt-28">
      {/* Official Notice Board Header Box */}
      <div className="bg-[#1b4d3e] text-white rounded-2xl p-5 sm:p-6 mb-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px] text-[#baeed9]">gavel</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-[17px] text-[#baeed9]">
                {lang === 'MR' ? 'आसगाव ग्राम माहिती व सूचना फलक • ताज्या घडामोडी' : 'Asgaon Village Civic Notice Board • Live Updates'}
              </h3>
            </div>
            <p className="text-[12px] text-white/80 mt-1 max-w-2xl leading-relaxed">
              {lang === 'MR'
                ? 'स्थानिक कार्यालय, कृषी विभाग व आरोग्य केंद्रांकडून संकलित केलेल्या अधिकृत सूचना. गावकऱ्यांना माहिती व्हावी म्हणून नियमित अद्ययावत.'
                : 'Verified public notices collected from local agricultural, health, and civic departments for the awareness of Asgaon residents.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert(lang === 'MR' ? 'मासिक आसगाव वृत्तपत्रक पीडीएफ डाउनलोड झाले.' : 'Monthly Asgaon Gazette PDF downloaded.')}
          className="px-4 py-2 rounded-xl bg-[#baeed9] text-[#002117] hover:bg-white transition-colors text-[12px] font-bold flex items-center gap-1.5 shrink-0 shadow-xs"
        >
          <span className="material-symbols-outlined text-[17px]">download</span>
          <span>{lang === 'MR' ? 'मासिक बातमीपत्र डाउनलोड करा' : 'Download Monthly Gazette'}</span>
        </button>
      </div>

      {/* 3 Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-xl p-4 border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#f9f3ea] flex items-center justify-center text-[#003629] shrink-0">
            <span className="material-symbols-outlined text-[22px]">calendar_month</span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#707974] uppercase">
              {lang === 'MR' ? 'ग्रामसेवक कार्यालयीन वेळ' : 'Gram Sevak Office Hours'}
            </div>
            <div className="text-[13px] font-extrabold text-[#1d1b16]">
              {lang === 'MR' ? 'सोम - बुध, शुक्र (स. १० ते दु. २)' : 'Mon - Wed, Fri (10 AM - 2 PM)'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a] shrink-0">
            <span className="material-symbols-outlined text-[22px]">medical_services</span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#707974] uppercase">
              {lang === 'MR' ? 'प्राथमिक आरोग्य केंद्र वैद्यकीय अधिकारी' : 'PHC On-Call Doctor'}
            </div>
            <a href="tel:9422001102" className="text-[13px] font-extrabold text-[#ba1a1a] hover:underline">
              {lang === 'MR' ? 'डॉ. अनिता शिंदे (मो: ९४२२००११०२)' : 'Dr. Anita Shinde (Ph: 9422001102)'}
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#f9f3ea] flex items-center justify-center text-[#a63b00] shrink-0">
            <span className="material-symbols-outlined text-[22px]">bolt</span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#707974] uppercase">
              {lang === 'MR' ? 'महावितरण (वीज) कनिष्ठ अभियंता' : 'MSEDCL Junior Engineer'}
            </div>
            <a href="tel:8888172233" className="text-[13px] font-extrabold text-[#a63b00] hover:underline">
              {lang === 'MR' ? 'आर. के. देशमुख (मो: ८८८८१७२२३३)' : 'R. K. Deshmukh (Ph: 8888172233)'}
            </a>
          </div>
        </div>
      </div>

      {/* RTI & Transparency Box */}
      <div className="bg-white rounded-xl p-4 border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[20px] text-[#003629] mt-0.5 shrink-0">policy</span>
          <div>
            <div className="text-[12px] font-bold text-[#003629]">
              {lang === 'MR' ? 'माहिती अधिकार (RTI) व सार्वजनिक पारदर्शकता वचनबद्धता' : 'RTI & Public Transparency Commitment'}
            </div>
            <div className="text-[11px] text-[#404945] mt-0.5 max-w-3xl leading-relaxed">
              {lang === 'MR'
                ? 'माहितीचा अधिकार अधिनियम २००५ कलम ४(१)(ब) अंतर्गत गाव विकास निधी, १५ वा वित्त आयोग वाटप आणि मनरेगा हजेरी पत्रके पंचायत काउंटरवर तपासणीसाठी उपलब्ध आहेत.'
                : 'Under Section 4(1)(b) of the Right to Information Act 2005, village development budgets, 15th Finance Commission fund allocations, and MGNREGA muster rolls are available for open public scrutiny at the counter.'}
            </div>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-[#f3ede4] text-[#1d1b16] text-[11px] font-bold border border-[#e8e2d9] shrink-0">
          {lang === 'MR' ? 'नागरिक भेट: प्रत्येक मंगळवारी, स. ११:०० वा.' : 'Public Meeting: Every Tuesday, 11 AM'}
        </span>
      </div>
    </section>
  );
};
