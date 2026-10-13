import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate?: (nav: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { lang } = useLanguage();

  const handleNav = (nav: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(nav);
    } else {
      window.location.href = `/${nav}`;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#052e16] text-[#dcfce7] border-t-4 border-[#166534] font-sans">
      {/* 1. Emergency Helpline & Urgent Assistance Ribbon */}
      <div className="bg-[#031e0f] border-b border-[#0f3d23] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <span className="material-symbols-outlined text-[18px] text-amber-400 animate-pulse">
              emergency
            </span>
            <span>{lang === 'MR' ? '२४x७ तातडीचे आपत्कालीन संपर्क (Emergency Speed-Dial):' : '24x7 Emergency Helplines & Speed-Dial:'}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 font-mono">
            <a
              href="tel:112"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a0808] hover:bg-[#3d0d0d] text-[#ffb4ab] border border-[#5c1d1d] font-bold text-[11px] transition-colors"
              title="पोलीस व राष्ट्रीय आपत्कालीन"
            >
              <span>🚨 ११२ (पोलीस / Police)</span>
            </a>
            <a
              href="tel:108"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a0808] hover:bg-[#3d0d0d] text-[#ffb4ab] border border-[#5c1d1d] font-bold text-[11px] transition-colors"
              title="रुग्णवाहिका सेवा"
            >
              <span>🚑 १०८ (रुग्णवाहिका / Ambulance)</span>
            </a>
            <a
              href="tel:101"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a0808] hover:bg-[#3d0d0d] text-[#ffb4ab] border border-[#5c1d1d] font-bold text-[11px] transition-colors"
              title="अग्निशामक दल"
            >
              <span>🔥 १०१ (अग्निशामक / Fire)</span>
            </a>
            <a
              href="tel:18001801551"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002b1f] hover:bg-[#003d2c] text-[#bbf7d0] border border-[#00513b] font-bold text-[11px] transition-colors"
              title="किसान कॉल सेंटर"
            >
              <span>🌾 १८००-१८०-१५५१ (किसान सल्ला)</span>
            </a>
            <a
              href="tel:1912"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#262000] hover:bg-[#3b3200] text-[#ffe082] border border-[#5c4d00] font-bold text-[11px] transition-colors"
              title="महावितरण वीज तक्रार"
            >
              <span>⚡ १९१२ (वीज पुरवठा तक्रार)</span>
            </a>
            <a
              href="tel:1091"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#240026] hover:bg-[#3d0040] text-[#f8bbd0] border border-[#59005e] font-bold text-[11px] transition-colors"
              title="महिला सुरक्षा हेल्पलाईन"
            >
              <span>👩 १०९१ (महिला सुरक्षा)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid (Identity + 3 Categorized Columns) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Identity & Mission (Takes 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/asgaon-logo.png"
                alt="Asgaon Village Civic Seal"
                className="h-14 w-14 rounded-full border-2 border-[#bbf7d0] shrink-0 object-cover shadow-md ring-2 ring-white/10"
              />
              <div>
                <h3 className="font-heading font-black text-lg text-white tracking-wide">
                  {lang === 'MR' ? 'आसगाव डिजिटल ग्राम मंच' : 'Asgaon Digital Civic Portal'}
                </h3>
                <p className="text-[12px] text-[#bbf7d0] font-medium">
                  {lang === 'MR' ? 'आसगाव स्वतंत्र नागरिक व ज्ञानपीठ मंच (ता. पवनी, जि. भंडारा)' : 'Independent Village Civic & Information Hub (Pauni, Bhandara)'}
                </p>
                <p className="text-[11px] text-[#7ea597] font-mono">
                  {lang === 'MR' ? 'पिन कोड: ४४१ ९१० • महाराष्ट्र' : 'PIN: 441910 • Maharashtra'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-[#a9c9bd] leading-relaxed">
              {lang === 'MR'
                ? 'गावातील शेतकरी, महिला, युवक व नागरिकांसाठी शासकीय योजनांची पारदर्शक माहिती, चालू बाजारभाव, पीक सल्ले, स्थानिक दुकाने आणि नागरिक सेवा एकाच ठिकाणी उपलब्ध करून देणारा स्वतंत्र डिजिटल मंच.'
                : 'Independent, transparent digital civic platform providing Asgaon farmers, women, students, and citizens with verified welfare schemes, live mandi benchmarks, bus timings, local businesses, and public services.'}
            </p>

            {/* Quick Civic Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#bbf7d0] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">location_on</span>
                <span>{lang === 'MR' ? 'प्रभाग १, २ व ३ (गावठाण)' : 'Wards 1, 2 & 3 (Gaothan)'}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#bbf7d0] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span>{lang === 'MR' ? 'सोम - शनि (१०:०० ते १७:३०)' : 'Mon - Sat (10:00 AM - 5:30 PM)'}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#bbf7d0] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">account_balance</span>
                <span>{lang === 'MR' ? '१५ वा वित्त आयोग पारदर्शकता' : '15th Finance Commission Transparency'}</span>
              </span>
            </div>
          </div>

          {/* Column 2: Civic & Schemes */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-[13px] uppercase tracking-wider text-white border-b border-[#00382b] pb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#bbf7d0]">policy</span>
              <span>{lang === 'MR' ? 'नागरिक सेवा व योजना' : 'Civic Welfare & Schemes'}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/schemes"
                  onClick={(e) => handleNav('schemes', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'शासकीय योजना दालन (Schemes)' : 'Govt Schemes Portal'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/schemes/pmay-gramin-housing"
                  onClick={(e) => handleNav('schemes', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'घरकुल आवास योजना (PMAY/Ramai)' : 'Gharkul Housing Grants'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/schemes/majhi-ladki-bahin-yojana"
                  onClick={(e) => handleNav('schemes', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'लाडकी बहीण योजना स्टेटस' : 'Ladki Bahin Status & Guide'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/schemes/pm-kisan-17th-installment"
                  onClick={(e) => handleNav('schemes', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'पीएम किसान व नमो शेतकरी' : 'PM-Kisan & Namo Shetkari'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/announcements"
                  onClick={(e) => handleNav('announcements', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'ग्रामसभा ठराव व जाहीर सूचना' : 'Gram Sabha & Village Notices'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Agri, Businesses & Jobs */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-[13px] uppercase tracking-wider text-white border-b border-[#00382b] pb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#bbf7d0]">storefront</span>
              <span>{lang === 'MR' ? 'शेती, व्यवसाय व रोजगार' : 'Agri, Business & Jobs'}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/krishi"
                  onClick={(e) => handleNav('krishi', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'थेट बाजारभाव व कृषी सल्ला (Krishi)' : 'Live Mandi Rates & Advisory'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/businesses"
                  onClick={(e) => handleNav('businesses', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'स्थानिक दुकाने व सेवा सूची (Directory)' : 'Local Business Directory'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/businesses"
                  onClick={(e) => handleNav('businesses', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'स्थानिक दुकाने व अभिप्राय' : 'Businesses & Shop Ratings'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/jobs"
                  onClick={(e) => handleNav('jobs', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'गावचा रोजगार व नोकऱ्या (Jobs Board)' : 'Village Jobs Board'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/marketplace"
                  onClick={(e) => handleNav('marketplace', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'आठवडी बाजार व खरेदी-विक्री (Market)' : 'Weekly Haat & Marketplace'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/transport"
                  onClick={(e) => handleNav('transport', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'पवनी-भंडारा एसटी बस वेळापत्रक' : 'MSRTC Bus Schedules'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Blogs, Education & Events */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-[13px] uppercase tracking-wider text-white border-b border-[#00382b] pb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#bbf7d0]">menu_book</span>
              <span>{lang === 'MR' ? 'ज्ञानपीठ व शिक्षण' : 'Education & Knowledge'}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/blogs"
                  onClick={(e) => handleNav('blogs', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'माहिती लेख व नागरिक ब्लॉग्स (Blogs)' : 'Village Articles & Guides'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/blogs/write"
                  onClick={(e) => handleNav('write-blog', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all font-bold text-[#bbf7d0]"
                >
                  <span className="material-symbols-outlined text-[14px]">edit_note</span>
                  <span>{lang === 'MR' ? 'नवीन लेख लिहा (Write Blog)' : 'Write Community Article'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/shiksha"
                  onClick={(e) => handleNav('shiksha', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'शाळा, वसतिगृह व अभ्यासिका (Education)' : 'Schools, Hostels & Library'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  onClick={(e) => handleNav('events', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'गावचे सण, उत्सव व क्रीडा स्पर्धा' : 'Festivals & Village Events'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/emergency"
                  onClick={(e) => handleNav('emergency', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#ffb4ab] font-bold"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  <span>{lang === 'MR' ? 'सर्व आपत्कालीन संपर्क (Directory)' : 'All Emergency Helplines'}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Transparency & Digital Standards Strip */}
      <div className="bg-[#032010] border-t border-[#0d3b1f] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-emerald-200">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-amber-300">verified</span>
              <span>{lang === 'MR' ? 'डिजिटल ग्राम माहिती मंच' : 'Digital Village Civic Portal'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-emerald-400">lock</span>
              <span>{lang === 'MR' ? '१००% सुरक्षित व जाहिरातमुक्त नागरिक व्यासपीठ' : '100% Secure & Ad-Free Citizen Platform'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-emerald-400">smart_toy</span>
              <span>{lang === 'MR' ? 'AI शोध व क्रॉलर्स अनुपालन (Robots.txt)' : 'AI & Crawler Compliant'}</span>
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] border border-white/15 transition-colors shrink-0 cursor-pointer"
            title={lang === 'MR' ? "पानाच्या वर जा" : "Scroll to Top"}
          >
            <span>{lang === 'MR' ? 'वर जा (Top)' : 'Top'}</span>
            <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
          </button>
        </div>
      </div>

      {/* 4. Bottom Copyright Strip */}
      <div className="bg-[#02150a] py-4 px-4 sm:px-6 lg:px-8 border-t border-[#092915]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#6d9182] text-center sm:text-left">
          <div>
            {lang === 'MR'
              ? '© २०२६ आसगाव डिजिटल ग्राम मंच. सर्व हक्क सुरक्षित. (आसगाव, ता. पवनी, जि. भंडारा - पिन ४४१९१०)'
              : '© 2026 Asgaon Village Civic Portal. All Rights Reserved. (Asgaon, Tal. Pauni, Dist. Bhandara - PIN 441910)'}
          </div>
          <div className="text-[10px] text-[#557568]">
            {lang === 'MR'
              ? 'नागरिकांच्या जनजागृती, पारदर्शकता व माहितीसाठी संचलित स्वतंत्र मंच'
              : 'Independent community platform operated for citizen transparency & awareness'}
          </div>
        </div>
      </div>
    </footer>
  );
};
