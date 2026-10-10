import React from 'react';

interface FooterProps {
  onNavigate?: (nav: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
    <footer className="w-full bg-[#001e17] text-[#d1e7de] border-t-2 border-[#003629] font-sans">
      {/* 1. Emergency Helpline & Urgent Assistance Ribbon */}
      <div className="bg-[#00140f] border-b border-[#003325] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#baeed9] font-bold">
            <span className="material-symbols-outlined text-[18px] text-[#ff7043] animate-pulse">
              emergency
            </span>
            <span>२४x७ तातडीचे आपत्कालीन संपर्क (24x7 Emergency Helplines):</span>
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
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002b1f] hover:bg-[#003d2c] text-[#baeed9] border border-[#00513b] font-bold text-[11px] transition-colors"
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
                alt="Asgaon Gram Panchayat Seal"
                className="h-14 w-14 rounded-full border-2 border-[#baeed9] shrink-0 object-cover shadow-md ring-2 ring-white/10"
              />
              <div>
                <h3 className="font-heading font-black text-lg text-white tracking-wide">
                  आसगाव डिजिटल ग्राम मंच
                </h3>
                <p className="text-[12px] text-[#baeed9] font-medium">
                  Asgaon Gram Panchayat (ता. पवनी, जि. भंडारा)
                </p>
                <p className="text-[11px] text-[#7ea597] font-mono">
                  पिन कोड: ४४१ ९१० • नोंदणी: GP-10928/MH
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-[#a9c9bd] leading-relaxed">
              गावातील शेतकरी, महिला, युवक व नागरिकांसाठी शासकीय योजनांची पारदर्शक माहिती, चालू बाजारभाव, पीक सल्ले, स्थानिक दुकाने आणि नागरिक सेवा एकाच ठिकाणी उपलब्ध करून देणारा स्वतंत्र डिजिटल मंच.
            </p>

            {/* Quick Civic Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#baeed9] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">location_on</span>
                <span>प्रभाग १, २ व ३ (गावठाण)</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#baeed9] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                <span>सोम - शनि (१०:०० ते १७:३०)</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#baeed9] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">account_balance</span>
                <span>१५ वा वित्त आयोग पारदर्शकता</span>
              </span>
            </div>
          </div>

          {/* Column 2: Civic & Schemes */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-[13px] uppercase tracking-wider text-white border-b border-[#00382b] pb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#baeed9]">policy</span>
              <span>नागरिक सेवा व योजना</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/schemes"
                  onClick={(e) => handleNav('schemes', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>शासकीय योजना दालन (Schemes)</span>
                </a>
              </li>
              <li>
                <a
                  href="/schemes/pmay-gramin-housing"
                  onClick={(e) => handleNav('schemes', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>घरकुल आवास योजना (PMAY/Ramai)</span>
                </a>
              </li>
              <li>
                <a
                  href="/schemes/majhi-ladki-bahin-yojana"
                  onClick={(e) => handleNav('schemes', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>लाडकी बहीण योजना स्टेटस</span>
                </a>
              </li>
              <li>
                <a
                  href="/schemes/pm-kisan-17th-installment"
                  onClick={(e) => handleNav('schemes', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>पीएम किसान व नमो शेतकरी</span>
                </a>
              </li>
              <li>
                <a
                  href="/announcements"
                  onClick={(e) => handleNav('announcements', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>ग्रामसभा ठराव व जाहीर सूचना</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Agri, Businesses & Jobs */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-[13px] uppercase tracking-wider text-white border-b border-[#00382b] pb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#baeed9]">storefront</span>
              <span>शेती, व्यवसाय व रोजगार</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/krishi"
                  onClick={(e) => handleNav('krishi', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>थेट बाजारभाव व कृषी सल्ला (Krishi)</span>
                </a>
              </li>
              <li>
                <a
                  href="/businesses"
                  onClick={(e) => handleNav('businesses', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>स्थानिक दुकाने व सेवा सूची (Directory)</span>
                </a>
              </li>
              <li>
                <a
                  href="/jobs"
                  onClick={(e) => handleNav('jobs', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>गावचा रोजगार व नोकऱ्या (Jobs Board)</span>
                </a>
              </li>
              <li>
                <a
                  href="/marketplace"
                  onClick={(e) => handleNav('marketplace', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>आठवडी बाजार व खरेदी-विक्री (Market)</span>
                </a>
              </li>
              <li>
                <a
                  href="/transport"
                  onClick={(e) => handleNav('transport', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>पवनी-भंडारा एसटी बस वेळापत्रक</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Blogs, Education & Events */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-[13px] uppercase tracking-wider text-white border-b border-[#00382b] pb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#baeed9]">menu_book</span>
              <span>ज्ञानपीठ व शिक्षण</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/blogs"
                  onClick={(e) => handleNav('blogs', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>माहिती लेख व नागरिक ब्लॉग्स (Blogs)</span>
                </a>
              </li>
              <li>
                <a
                  href="/blogs/write"
                  onClick={(e) => handleNav('write-blog', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all font-bold text-[#baeed9]"
                >
                  <span className="material-symbols-outlined text-[14px]">edit_note</span>
                  <span>नवीन लेख लिहा (Write Blog)</span>
                </a>
              </li>
              <li>
                <a
                  href="/shiksha"
                  onClick={(e) => handleNav('shiksha', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>शाळा, वसतिगृह व अभ्यासिका (Education)</span>
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  onClick={(e) => handleNav('events', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#b6d6ca]"
                >
                  <span className="text-[#00a877]">›</span>
                  <span>गावचे सण, उत्सव व क्रीडा स्पर्धा</span>
                </a>
              </li>
              <li>
                <a
                  href="/emergency"
                  onClick={(e) => handleNav('emergency', e)}
                  className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-[#ffb4ab] font-bold"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  <span>सर्व आपत्कालीन संपर्क (Directory)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Transparency & Digital Standards Strip */}
      <div className="bg-[#001711] border-t border-[#002e21] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8cb3a3]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#baeed9]">verified</span>
              <span>डिजिटल ग्रामपंचायत संकल्पना</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#baeed9]">lock</span>
              <span>१००% सुरक्षित व जाहिरातमुक्त नागरिक व्यासपीठ</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#baeed9]">smart_toy</span>
              <span>AI शोध व क्रॉलर्स अनुपालन (Robots.txt)</span>
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-[11px] border border-white/10 transition-colors shrink-0"
            title="पानाच्या वर जा"
          >
            <span>वर जा (Top)</span>
            <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
          </button>
        </div>
      </div>

      {/* 4. Bottom Copyright Strip */}
      <div className="bg-[#00100c] py-4 px-4 sm:px-6 lg:px-8 border-t border-[#002419]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#6d9182] text-center sm:text-left">
          <div>
            © २०२६ आसगाव डिजिटल ग्राम मंच. सर्व हक्क सुरक्षित. (Asgaon Gram Panchayat, Pauni, Bhandara - PIN 441910)
          </div>
          <div className="text-[10px] text-[#557568]">
            महाराष्ट्र शासन ग्राम विकास विभाग मार्गदर्शक तत्त्वांवर आधारित नागरिक ज्ञानपीठ मंच
          </div>
        </div>
      </div>
    </footer>
  );
};
