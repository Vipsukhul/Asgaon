import { LucideIcon } from './LucideIcon';
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate?: (nav: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { lang, t } = useLanguage();

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
      

      {/* 2. Main Footer Grid (Identity + 3 Categorized Columns) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Identity & Mission (Takes 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/asgaon-logo.png"
                alt="Asgaon Village Civic Seal"
                className="h-14 w-14 rounded-full border-2 border-[#cadbcf] shrink-0 object-cover shadow-md ring-2 ring-white/10"
              />
              <div>
                <h3 className="font-heading font-black text-lg text-white tracking-wide">
                  {lang === 'MR' ? 'आसगाव डिजिटल ग्राम मंच' : 'Asgaon Digital Civic Portal'}
                </h3>
                <p className="text-[12px] text-[#a7f3d0] font-medium">
                  {lang === 'MR' ? 'आसगाव स्वतंत्र नागरिक व ज्ञानपीठ मंच (ता. पवनी, जि. भंडारा)' : 'Independent Village Civic & Information Hub (Pauni, Bhandara)'}
                </p>
                <p className="text-[11px] text-[#7ea597] font-mono">
                  {lang === 'MR' ? 'पिन कोड: ४४१ ९१० • महाराष्ट्र' : 'PIN: 441910 • Maharashtra'}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Civic & Schemes */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-[13px] uppercase tracking-wider text-white border-b border-[#00382b] pb-2 flex items-center gap-1.5">
              <LucideIcon name="policy" className="text-[16px] text-[#a7f3d0]" />
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
                  <span>{t('nav_schemes')}</span>
                </a>
              </li>
              <li>
                <a
                  href="/schemes/pmay-gramin-housing"
                  onClick={(e) => handleNav('schemes', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'घरकुल आवास योजना' : 'Gharkul Housing Grants'}</span>
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
                  <span>{t('nav_announcements')}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Agri, Businesses & Jobs */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-[13px] uppercase tracking-wider text-white border-b border-[#00382b] pb-2 flex items-center gap-1.5">
              <LucideIcon name="storefront" className="text-[16px] text-[#a7f3d0]" />
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
                  <span>{t('nav_krishi')}</span>
                </a>
              </li>
              <li>
                <a
                  href="/businesses"
                  onClick={(e) => handleNav('businesses', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{t('nav_businesses')}</span>
                </a>
              </li>
              <li>
                <a
                  href="/businesses"
                  onClick={(e) => handleNav('businesses', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{lang === 'MR' ? 'स्थानिक व्यवसाय अभिप्राय' : 'Business Reviews'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/jobs"
                  onClick={(e) => handleNav('jobs', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{t('nav_jobs')}</span>
                </a>
              </li>
              <li>
                <a
                  href="/marketplace"
                  onClick={(e) => handleNav('marketplace', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{t('nav_marketplace')}</span>
                </a>
              </li>
              <li>
                <a
                  href="/transport"
                  onClick={(e) => handleNav('transport', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{t('nav_transport')}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Blogs, Education & Events */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-[13px] uppercase tracking-wider text-white border-b border-[#00382b] pb-2 flex items-center gap-1.5">
              <LucideIcon name="menu_book" className="text-[16px] text-[#a7f3d0]" />
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
                  <span>{t('nav_blogs')}</span>
                </a>
              </li>
              <li>
                <a
                  href="/blogs/write"
                  onClick={(e) => handleNav('write-blog', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all font-bold text-[#a7f3d0]"
                >
                  <LucideIcon name="edit_note" className="text-[14px]" />
                  <span>{lang === 'MR' ? 'नवीन लेख लिहा' : 'Write Community Article'}</span>
                </a>
              </li>
              <li>
                <a
                  href="/shiksha"
                  onClick={(e) => handleNav('shiksha', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{t('nav_education')}</span>
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  onClick={(e) => handleNav('events', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>{t('nav_events')}</span>
                </a>
              </li>
              <li>
                <a
                  href="/emergency"
                  onClick={(e) => handleNav('emergency', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#fde68a] font-bold"
                >
                  <LucideIcon name="call" className="text-[14px]" />
                  <span>{t('nav_emergency')}</span>
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
              <LucideIcon name="verified" className="text-[15px] text-amber-300" />
              <span>{lang === 'MR' ? 'डिजिटल ग्राम माहिती मंच' : 'Digital Village Civic Portal'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <LucideIcon name="smart_toy" className="text-[15px] text-emerald-400" />
              <span>{lang === 'MR' ? 'AI शोध व क्रॉलर्स' : 'AI Crawler'}</span>
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] border border-white/15 transition-colors shrink-0 cursor-pointer"
            title={lang === 'MR' ? "पानाच्या वर जा" : "Scroll to Top"}
          >
            <span>{lang === 'MR' ? 'वर जा' : 'Top'}</span>
            <LucideIcon name="arrow_upward" className="text-[15px]" />
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
