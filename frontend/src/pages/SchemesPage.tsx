import React, { useState, useEffect } from 'react';
import type { Scheme } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEOHead } from '../components/SEOHead';

interface SchemesPageProps {
  schemes?: Scheme[];
  onBookmarkScheme?: (scheme: any) => void;
  onNavigateHome?: () => void;
  onSelectScheme?: (slug: string) => void;
}

export const SchemesPage: React.FC<SchemesPageProps> = ({
  schemes = [],
  onBookmarkScheme,
  onNavigateHome,
  onSelectScheme
}) => {
  // Read initial category/search from URL params if present
  const getInitialParam = (key: string, fallback: string) => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get(key) || fallback;
    } catch {
      return fallback;
    }
  };

  const [selectedCat, setSelectedCat] = useState(() => getInitialParam('category', 'All'));
  const [search, setSearch] = useState(() => getInitialParam('search', ''));
  const [activeCheckboxes, setActiveCheckboxes] = useState({
    active: false,
    dbt: false,
    free: false,
    land: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModalScheme, setSelectedModalScheme] = useState<any | null>(null);

  // Sync category & search to browser URL without reload for SEO shareability
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selectedCat !== 'All') {
        url.searchParams.set('category', selectedCat);
      } else {
        url.searchParams.delete('category');
      }

      if (search.trim()) {
        url.searchParams.set('search', search.trim());
      } else {
        url.searchParams.delete('search');
      }

      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  }, [selectedCat, search]);

  const categories = [
    { id: 'All', label: 'All Schemes (सर्व योजना)', icon: 'apps' },
    { id: 'housing', label: 'Gharkul & Housing (घरकुल योजना)', icon: 'home' },
    { id: 'farmer', label: 'Farmers & Krishi (शेती योजना)', icon: 'agriculture' },
    { id: 'women', label: 'Women & SHGs (महिला व लाडकी बहीण)', icon: 'family_restroom' },
    { id: 'student', label: 'Students & Youth (विद्यार्थी शिष्यवृत्ती)', icon: 'school' },
    { id: 'solar', label: 'Solar Energy (सौर कृषी पंप)', icon: 'solar_power' },
    { id: 'health', label: 'Health & Pension (आरोग्य व पेन्शन)', icon: 'health_and_safety' }
  ];

  const dynamicSchemes = (schemes || []).map((s: any, idx: number) => {
    const cat = s.category ? String(s.category).toLowerCase() : 'farmer';
    const isGharkul = cat === 'housing' || (s.title && s.title.toLowerCase().includes('gharkul')) || (s.title && s.title.toLowerCase().includes('awas'));

    return {
      id: s.id || `dyn-scheme-${idx}`,
      slug: s.slug || (s.title ? s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `scheme-${idx}`),
      badge: s.badgeText || (isGharkul ? 'GHARKUL HOUSING GRANT' : 'GOVERNMENT INITIATIVE'),
      quota: isGharkul ? 'Gram Sabha Approval Open' : 'Direct Application Open',
      deadline: s.deadlineText || 'Open all year round',
      subsidyBadge: isGharkul ? 'GOVT HOUSING GRANT' : 'GOVT DBT BENEFIT',
      subsidySub: isGharkul ? 'Stage-wise Direct DBT' : 'Direct to Bank',
      title: s.title,
      department: s.sponsoringAgency || 'Government of Maharashtra',
      categoryKey: cat,
      financialAssistance: s.benefits || s.description || 'Verified Maharashtra welfare benefit.',
      eligibility: s.eligibility || 'All eligible village residents with valid Aadhaar.',
      documents: (Array.isArray(s.documentsRequired) && s.documentsRequired.length > 0
        ? s.documentsRequired
        : ['Aadhaar Card', 'Ration Card', 'Bank Passbook']) as string[],
      warning: undefined as string | undefined,
      urgentAlert: isGharkul ? 'Submit 8A Land Document & Awaas+ list entry to Gram Sevak' : undefined,
      note: 'DBT verification active via CSC / Gram Panchayat desk',
      portalUrl: s.officialUrl || 'https://aaplesarkar.mahaonline.gov.in',
      actionLabel: s.actionLabel || 'Apply on Official Portal'
    };
  });

  const allSchemes = dynamicSchemes;

  const filtered = allSchemes.filter((s) => {
    const matchesCat = selectedCat === 'All' || s.categoryKey === selectedCat;
    const matchesSearch =
      !search.trim() ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      s.financialAssistance.toLowerCase().includes(search.toLowerCase()) ||
      s.eligibility.toLowerCase().includes(search.toLowerCase());
    const matchesActive = !activeCheckboxes.active || !s.deadline.toLowerCase().includes('closed');
    const matchesDbt =
      !activeCheckboxes.dbt ||
      s.subsidyBadge.toLowerCase().includes('dbt') ||
      s.financialAssistance.toLowerCase().includes('dbt') ||
      s.financialAssistance.includes('₹');
    const matchesFree =
      !activeCheckboxes.free ||
      s.financialAssistance.toLowerCase().includes('100%') ||
      s.financialAssistance.toLowerCase().includes('free') ||
      s.quota.toLowerCase().includes('direct');
    const matchesLand =
      !activeCheckboxes.land ||
      s.documents.some(
        (d: string) =>
          d.toLowerCase().includes('7/12') ||
          d.toLowerCase().includes('8a') ||
          d.toLowerCase().includes('land') ||
          d.toLowerCase().includes('property')
      ) ||
      s.categoryKey === 'farmer' ||
      s.categoryKey === 'housing';

    return matchesCat && matchesSearch && matchesActive && matchesDbt && matchesFree && matchesLand;
  });

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedSchemes = filtered.slice(startIndex, startIndex + pageSize);

  // SEO Dynamic Title and Description
  const seoTitle =
    selectedCat === 'housing'
      ? 'Gharkul Yojana List (घरकुल योजना) | Ramai, Shabari, Modi Awas & PMAY-G Asgaon'
      : selectedCat === 'farmer'
      ? 'Farmers & Krishi Schemes (शेतकरी योजना) | PM-Kisan, Namo Shetkari, Crop Insurance'
      : selectedCat === 'women'
      ? 'Women Schemes & Ladki Bahin (लाडकी बहीण योजना) | Umed & Matru Vandana Asgaon'
      : 'Government Schemes & Gharkul Yojana Portal (शासकीय योजना व घरकुल) | Asgaon';

  const seoDescription =
    selectedCat === 'housing'
      ? 'Complete details of Gharkul Yojanas in Asgaon (Pauni, Bhandara): PMAY-G, Ramai Awas, Shabari Adivasi, Modi Awas, and Yashwantrao Chavan Gharkul. Check eligibility, documents, subsidy grants, and application procedure.'
      : 'Verified Central & Maharashtra Government schemes and subsidies directory for Asgaon residents. Comprehensive guide for Gharkul housing grants, PM-Kisan, Ladki Bahin, Kusum Solar Agri Pumps, and scholarships.';

  // Schema.org Structured Data (GovernmentService & FAQPage)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: window.location.origin
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Government Schemes & Gharkul Yojana',
            item: `${window.location.origin}/schemes`
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'आसगावमध्ये घरकुल योजनेसाठी (Gharkul Yojana) कसा अर्ज करावा?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'आसगाव ग्रामपंचायतीत रमाई आवास (SC), शबरी आवास (ST), मोदी आवास (OBC) आणि प्रधानमंत्री आवास योजना-ग्रामीण (PMAY-G) अंतर्गत अर्ज करता येतो. यासाठी ग्रामपंचायतीचा नमुना ८-अ उतारा, आधार कार्ड, जातीचा दाखला व उत्पन्नाचा दाखला ग्रामसेवक यांच्याकडे सादर करावा लागतो.'
            }
          },
          {
            '@type': 'Question',
            name: 'How much subsidy is provided under Gharkul Housing Schemes in Maharashtra?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Eligible beneficiaries receive between ₹1,20,000 to ₹1,30,000 as a direct construction grant via DBT in milestones, plus approx ₹25,000 in 90 days MGNREGA wages and ₹12,000 for toilet construction under Swachh Bharat Mission (total assistance up to ₹1.57 Lakh).'
            }
          },
          {
            '@type': 'Question',
            name: 'Who is eligible for Mukhyamantri Majhi Ladki Bahin Yojana?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Resident women of Maharashtra aged 21 to 65 years with annual family income below ₹2.5 Lakhs (or holding Yellow/Orange Ration Card) receive ₹1,500 per month directly into their Aadhaar-seeded bank account.'
            }
          },
          {
            '@type': 'Question',
            name: 'What documents are required for PM-Kisan & Namo Shetkari Yojana?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Updated 7/12 & 8A land records, Aadhaar card linked with active mobile number, and NPCI Aadhaar-seeded bank passbook are mandatory to receive ₹12,000 annual combined DBT.'
            }
          }
        ]
      },
      ...paginatedSchemes.slice(0, 5).map((s) => ({
        '@type': 'GovernmentService',
        name: s.title,
        serviceType: s.categoryKey,
        provider: {
          '@type': 'GovernmentOrganization',
          name: s.department
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Asgaon, Pauni, Bhandara, Maharashtra'
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
          description: s.financialAssistance
        },
        url: s.portalUrl
      }))
    ]
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* 1. Dynamic SEO Tags Injection */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords="Gharkul yojana, घरकुल योजना, रमाई आवास, शबरी आवास, मोदी आवास, PMAY-G, PM Kisan, लाडकी बहीण योजना, Asgaon, Pauni, Bhandara, Maharashtra DBT, शासकीय योजना"
        canonicalUrl={`${window.location.origin}/schemes${selectedCat !== 'All' ? `?category=${selectedCat}` : ''}`}
        structuredData={structuredData}
      />

      {/* 2. Breadcrumbs & Verified Status */}
      <Breadcrumb
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Government Schemes & Subsidies (शासकीय योजना व सबसिडी मार्गदर्शक)', active: true }
        ]}
        rightBadge={
          <div className="flex items-center gap-1.5 bg-[#baeed9] text-[#002117] px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[15px] text-[#002117]">verified</span>
            <span>Pauni Tehsil Direct Benefit Transfer (DBT) Helpdesk Verified</span>
          </div>
        }
      />

      {/* 3. Hero Header Banner */}
      <header className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e8e2d9] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#baeed9] text-[#002117] text-[10px] font-extrabold uppercase tracking-wider mb-2">
            DBT VERIFIED | ZERO FEE | DIRECT WELFARE ASSISTANCE
          </span>

          <h1 className="font-heading font-extrabold text-[24px] sm:text-[28px] text-[#003629] leading-tight mb-1">
            Sarkari Yojana &amp; Gharkul Guidance Portal
          </h1>
          <p className="font-heading font-bold text-[14px] sm:text-[15px] text-[#a63b00] mb-2">
            सर्व शासकीय योजना, ग्रामीण घरकुल योजना व कृषी अनुदान — अधिकृत माहिती व थेट अर्ज
          </p>

          <p className="text-[13px] text-[#404945] leading-relaxed">
            100% authenticated government welfare programs from Central &amp; Maharashtra governments including <strong>Gharkul Housing (रमाई, शबरी, मोदी आवास, PMAY-G)</strong>, PM-Kisan, Ladki Bahin, Solar Pumps, and MahaDBT scholarships. Direct official portals, zero middlemen, zero fee.
          </p>
        </div>

        {/* Right CTA Buttons */}
        <div className="flex flex-col gap-2.5 w-full lg:w-72 shrink-0">
          <button
            onClick={() => {
              setSelectedCat('housing');
              setCurrentPage(1);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#a63b00] hover:bg-[#852f00] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>View All Gharkul Schemes (घरकुल यादी)</span>
          </button>

          <a
            href="tel:9822104500"
            className="w-full py-2 px-4 rounded-xl bg-[#f9f3ea] hover:bg-[#f3ede4] text-[#1d1b16] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#e8e2d9]"
          >
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            <span>Asgaon CSC Desk Helpline</span>
          </a>
        </div>
      </header>

      {/* 4. Gharkul Special Info Spotlight Card (Always visible or prominently shown) */}
      <section className="bg-gradient-to-r from-[#003629] to-[#0f533f] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#00261d]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#baeed9]">
              <span className="material-symbols-outlined text-[28px]">cottage</span>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#baeed9]">
                MAHARASHTRA RURAL HOUSING MISSION | महाराष्ट्र ग्रामीण घरकुल अभियान
              </div>
              <h2 className="font-heading font-extrabold text-[18px] sm:text-[20px] text-white">
                Gharkul Yojanas at a Glance (घरकुल योजनांची संपूर्ण माहिती)
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCat('housing');
              setCurrentPage(1);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#baeed9] text-[#002117] hover:bg-white text-[12px] font-bold shrink-0 transition-colors"
          >
            Filter Housing Schemes ({allSchemes.filter((s) => s.categoryKey === 'housing').length})
          </button>
        </div>

        {/* 4 Mini Cards for Each Gharkul Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12px]">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="font-bold text-[#baeed9] text-[13px] flex items-center gap-1">
                <span>PMAY-G (केंद्र सरकार)</span>
              </div>
              <div className="font-bold text-white text-[15px] my-1">₹1.57 Lakhs Total</div>
              <p className="text-white/80 text-[11px]">For houseless families in SECC / Awaas+ permanent waitlist.</p>
            </div>
            <div className="mt-2 text-[10px] text-[#baeed9] font-medium">All Castes (SECC List)</div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="font-bold text-[#baeed9] text-[13px]">रमाई आवास (Ramai Awas)</div>
              <div className="font-bold text-white text-[15px] my-1">₹1.30L + MGNREGA</div>
              <p className="text-white/80 text-[11px]">Dedicated pukka house grant for rural SC &amp; Neo-Buddhist families.</p>
            </div>
            <div className="mt-2 text-[10px] text-[#baeed9] font-medium">SC / Nav-Bouddha</div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="font-bold text-[#baeed9] text-[13px]">शबरी आवास (Shabari Awas)</div>
              <div className="font-bold text-white text-[15px] my-1">₹1.30L + MGNREGA</div>
              <p className="text-white/80 text-[11px]">Free pukka house financial aid for Scheduled Tribe (ST) families.</p>
            </div>
            <div className="mt-2 text-[10px] text-[#baeed9] font-medium">ST / Tribal Families</div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="font-bold text-[#baeed9] text-[13px]">मोदी आवास (Modi Awas)</div>
              <div className="font-bold text-white text-[15px] my-1">₹1.20L + MGNREGA</div>
              <p className="text-white/80 text-[11px]">Special Maharashtra housing scheme for rural OBC / SBC / VJNT.</p>
            </div>
            <div className="mt-2 text-[10px] text-[#baeed9] font-medium">OBC / SBC / VJNT</div>
          </div>
        </div>
      </section>

      {/* 5. Search & Filter Bar */}
      <section className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex flex-col gap-3">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#707974] text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search schemes by name, category (e.g. Gharkul, Ramai, Modi Awas, PM-Kisan, Ladki Bahin, Solar Pump)..."
            className="w-full pl-10 pr-10 py-2.5 bg-[#f9f3ea] text-[#1d1b16] rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#003629]"
            aria-label="Search schemes"
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-2.5 text-[#707974] hover:text-[#1d1b16]"
              aria-label="Clear Search"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat.id === 'All'
                ? allSchemes.length
                : allSchemes.filter((s) => s.categoryKey === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCat(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCat === cat.id
                    ? 'bg-[#003629] text-white shadow-xs'
                    : 'bg-[#f3ede4] text-[#404945] hover:bg-[#e8e2d9] border border-[#e8e2d9]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCat === cat.id ? 'bg-white/20 text-white' : 'bg-[#e8e2d9] text-[#707974]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Checkbox filters */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#f3ede4] text-[12px] font-medium text-[#404945]">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeCheckboxes.active}
              onChange={(e) => {
                setActiveCheckboxes({ ...activeCheckboxes, active: e.target.checked });
                setCurrentPage(1);
              }}
              className="w-4 h-4 accent-[#003629]"
            />
            <span>Applications Active Now</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeCheckboxes.dbt}
              onChange={(e) => {
                setActiveCheckboxes({ ...activeCheckboxes, dbt: e.target.checked });
                setCurrentPage(1);
              }}
              className="w-4 h-4 accent-[#003629]"
            />
            <span>Direct Benefit Transfer (DBT) Cash</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeCheckboxes.free}
              onChange={(e) => {
                setActiveCheckboxes({ ...activeCheckboxes, free: e.target.checked });
                setCurrentPage(1);
              }}
              className="w-4 h-4 accent-[#003629]"
            />
            <span>100% Free / Full Subsidy</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeCheckboxes.land}
              onChange={(e) => {
                setActiveCheckboxes({ ...activeCheckboxes, land: e.target.checked });
                setCurrentPage(1);
              }}
              className="w-4 h-4 accent-[#003629]"
            />
            <span>Land / Property Record (7/12 or 8A)</span>
          </label>
        </div>
      </section>

      {/* 6. Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Schemes Directory (2 cols wide) */}
        <main className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-[17px] text-[#003629]">
              {selectedCat === 'housing'
                ? 'Gharkul & Rural Housing Schemes (घरकुल योजना दालन)'
                : 'Government Schemes & Subsidies (शासकीय योजना व सबसिडी)'}{' '}
              <span className="text-[13px] font-normal text-[#707974]">
                (Showing {filtered.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length} verified schemes)
              </span>
            </h2>
          </div>

          {allSchemes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-[#003629] border-t-transparent rounded-full animate-spin mb-1" />
              <p className="text-[13px] font-bold text-[#003629]">Connecting to database &amp; loading government welfare schemes...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-[#a63b00]">policy</span>
              <h3 className="font-heading font-bold text-[18px] text-[#003629]">No matching schemes found</h3>
              <p className="text-[13px] text-[#707974] max-w-md">
                No government initiatives match your current filters. Try selecting "All Schemes" or clear your keyword search.
              </p>
              <button
                onClick={() => {
                  setSelectedCat('All');
                  setSearch('');
                  setActiveCheckboxes({ active: false, dbt: false, free: false, land: false });
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-[#003629] text-white text-[12px] font-bold rounded-xl hover:bg-[#1b4d3e] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            paginatedSchemes.map((item) => (
              <article
                key={item.id}
                itemScope
                itemType="https://schema.org/GovernmentService"
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider bg-[#dbe1ff] text-[#002873]">
                        {item.badge}
                      </span>
                      <span className="text-[11px] font-semibold text-[#707974]">{item.quota}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#ba1a1a]">{item.deadline}</span>
                  </div>

                  {/* Title & Department & Subsidy Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <h3
                        itemProp="name"
                        className="font-heading font-extrabold text-[18px] text-[#1d1b16] leading-snug hover:text-[#003629] transition-colors"
                      >
                        {onSelectScheme ? (
                          <a
                            href={`/schemes/${item.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onSelectScheme(item.slug);
                            }}
                            className="hover:underline"
                          >
                            {item.title}
                          </a>
                        ) : (
                          item.title
                        )}
                      </h3>
                      <p
                        itemProp="provider"
                        className="text-[12px] font-semibold text-[#a63b00] mt-0.5"
                      >
                        {item.department}
                      </p>
                    </div>

                    <div className="bg-[#fff8f0] p-2.5 rounded-xl border border-[#ffdbce] text-right shrink-0">
                      <div className="font-heading font-extrabold text-[15px] text-[#a63b00]">
                        {item.subsidyBadge}
                      </div>
                      <div className="text-[10px] text-[#707974] font-semibold">{item.subsidySub}</div>
                    </div>
                  </div>

                  {/* 2-Column Benefits & Eligibility Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9] mb-3 text-[12px]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#003629] mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                        <span>Financial Assistance / Subsidy</span>
                      </div>
                      <p className="text-[#404945] leading-relaxed font-medium">{item.financialAssistance}</p>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#003629] mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">checklist</span>
                        <span>Eligibility Criteria</span>
                      </div>
                      <p className="text-[#404945] leading-relaxed">{item.eligibility}</p>
                    </div>
                  </div>

                  {/* Required Documents Checklist */}
                  <div className="bg-white p-3 rounded-xl border border-[#e8e2d9] mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#707974] mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#376757]">task_alt</span>
                      <span>Required Documents Checklist (आवश्यक कागदपत्रे)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] text-[#1d1b16]">
                      {item.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-[#376757] shrink-0">check_circle</span>
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {item.urgentAlert && (
                    <div className="bg-[#fff8f0] text-[#a63b00] p-2.5 rounded-xl border border-[#ffdbce] text-[12px] font-bold mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">campaign</span>
                      <span>{item.urgentAlert}</span>
                    </div>
                  )}

                  {item.note && (
                    <div className="text-[11px] text-[#707974] flex items-center gap-1.5 mb-2">
                      <span className="material-symbols-outlined text-[15px] text-[#376757]">info</span>
                      <span>{item.note}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-3 border-t border-[#f3ede4] flex flex-wrap items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={item.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#002873] hover:bg-[#00174b] text-white text-[12px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <span>{item.actionLabel}</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>

                    {onSelectScheme ? (
                      <button
                        onClick={() => onSelectScheme(item.slug)}
                        className="px-3.5 py-2 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-[12px] font-bold transition-colors shadow-xs flex items-center gap-1"
                      >
                        <span>Full Scheme Page</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedModalScheme(item)}
                        className="px-3 py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[12px] font-bold transition-colors border border-[#e8e2d9]"
                      >
                        <span>View Details</span>
                      </button>
                    )}

                    {onBookmarkScheme && (
                      <button
                        onClick={() => onBookmarkScheme(item)}
                        title="Bookmark Scheme"
                        className="p-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#707974] hover:text-[#003629] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
                      </button>
                    )}
                  </div>

                  <a
                    href="tel:9822104500"
                    className="text-[12px] font-bold text-[#a63b00] hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">storefront</span>
                    <span>Book at Asgaon CSC Desk</span>
                  </a>
                </div>
              </article>
            ))
          )}

          {/* Dynamic Pagination Strip */}
          <nav
            aria-label="Schemes pagination"
            className="bg-white rounded-xl p-3 border border-[#e8e2d9] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#707974] gap-2 mt-2"
          >
            <span>
              Showing {filtered.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length} verified schemes
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  disabled={validCurrentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="w-7 h-7 rounded-lg bg-[#f3ede4] text-[#1d1b16] font-bold flex items-center justify-center disabled:opacity-40 hover:bg-[#e8e2d9] transition-colors"
                  aria-label="Previous Page"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition-colors ${
                        validCurrentPage === pageNum
                          ? 'bg-[#003629] text-white shadow-xs'
                          : 'bg-[#f3ede4] text-[#1d1b16] hover:bg-[#e8e2d9]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={validCurrentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="w-7 h-7 rounded-lg bg-[#f3ede4] text-[#1d1b16] font-bold flex items-center justify-center disabled:opacity-40 hover:bg-[#e8e2d9] transition-colors"
                  aria-label="Next Page"
                >
                  &gt;
                </button>
              </div>
            )}
          </nav>

          {/* 7. SEO FAQ Section (Schema.org Compliant Accordions) */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs mt-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#f3ede4]">
              <span className="material-symbols-outlined text-[24px] text-[#003629]">help_outline</span>
              <div>
                <h2 className="font-heading font-extrabold text-[17px] text-[#003629]">
                  Frequently Asked Questions (वारंवार विचारले जाणारे प्रश्न - FAQ)
                </h2>
                <p className="text-[12px] text-[#707974]">
                  Key guidelines for Gharkul housing and DBT subsidies in Asgaon Gram Panchayat
                </p>
              </div>
            </div>

            <div className="space-y-3 text-[13px]">
              <details className="group bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <summary className="font-bold text-[#003629] cursor-pointer flex items-center justify-between list-none">
                  <span>१. आसगावमध्ये घरकुल योजनेसाठी (Gharkul Yojana) कोणती कागदपत्रे लागतात?</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="mt-2 text-[#404945] leading-relaxed pt-2 border-t border-[#e8e2d9]/60">
                  घरकुल योजनेसाठी खालील कागदपत्रे आवश्यक आहेत:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>ग्रामपंचायतीचा नमुना ८-अ किंवा ७/१२ जमिनीचा उतारा (जागा स्वतःच्या नावावर असणे आवश्यक).</li>
                    <li>तहसीलदार कार्यालयाचा वार्षिक उत्पन्नाचा दाखला (वार्षिक उत्पन्न मर्यादा ₹१.२० लाखांपर्यंत).</li>
                    <li>सक्षम प्राधिकाऱ्याचा जातीचा दाखला (रमाईसाठी SC, शबरीसाठी ST, मोदी आवाससाठी OBC).</li>
                    <li>आधार कार्ड, शिधापत्रिका (रेशन कार्ड) व आधार संलग्न बँक खाते पासबुक.</li>
                    <li>ग्रामसभेचा मंजुरी ठराव किंवा SECC / Awaas+ प्रतीक्षा यादीतील नाव.</li>
                  </ul>
                </div>
              </details>

              <details className="group bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <summary className="font-bold text-[#003629] cursor-pointer flex items-center justify-between list-none">
                  <span>2. How is the financial grant disbursed in Gharkul Yojana?</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="mt-2 text-[#404945] leading-relaxed pt-2 border-t border-[#e8e2d9]/60">
                  The subsidy amount (₹1,20,000 to ₹1,30,000) is released in direct DBT milestone installments upon geo-tagged photo verification:
                  <ol className="list-decimal pl-5 mt-1 space-y-1">
                    <li>1st Installment (20%): Plinth level excavation foundation.</li>
                    <li>2nd Installment (45%): Lintel & wall masonry completion.</li>
                    <li>3rd Installment (25%): Roof slab completion.</li>
                    <li>4th Installment (10%): Door, window, plaster, and toilet completion + ₹12,000 SBM toilet incentive + ₹25,000 (90 days MGNREGA wages).</li>
                  </ol>
                </div>
              </details>

              <details className="group bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <summary className="font-bold text-[#003629] cursor-pointer flex items-center justify-between list-none">
                  <span>३. मुख्यमंत्री माझी लाडकी बहीण योजनेचा लाभ कोणाला मिळतो?</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="mt-2 text-[#404945] leading-relaxed pt-2 border-t border-[#e8e2d9]/60">
                  महाराष्ट्रातील २१ ते ६५ वयोगटातील विवाहित, विधवा, घटस्फोटित, परित्यक्ता आणि निराधार महिला ज्यांच्या कुटुंबाचे वार्षिक उत्पन्न ₹२.५ लाखांपेक्षा कमी आहे (किंवा पिवळे/केशरी रेशन कार्डधारक), त्यांना दरमहा ₹१,५०० (वार्षिक ₹१८,०००) थेट बँक खात्यात दिले जातात.
                </div>
              </details>

              <details className="group bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <summary className="font-bold text-[#003629] cursor-pointer flex items-center justify-between list-none">
                  <span>4. Are there any application fees or agent commissions?</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="mt-2 text-[#404945] leading-relaxed pt-2 border-t border-[#e8e2d9]/60">
                  <strong>Zero fees!</strong> All central and state government schemes in Asgaon Gram Panchayat are 100% free of charge. Never pay any bribe or commission to middlemen. In case of bribery demands, report immediately to Anti-Corruption Bureau toll-free 1064.
                </div>
              </details>
            </div>
          </section>
        </main>

        {/* Right Column: Sidebars (1 col wide) */}
        <aside className="flex flex-col gap-5">
          {/* Widget 1: Asgaon CSC Digital Seva Kendra */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
              GOVERNMENT SERVICES DESK
            </span>

            <h3 className="font-heading font-extrabold text-[16px] text-[#003629] mt-2 mb-1">
              Asgaon CSC Digital Seva Kendra
            </h3>
            <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
              Official physical assistance desk for online DBT registrations, document scanning, 7/12 &amp; 8A downloads, and biometric e-KYC.
            </p>

            <div className="space-y-1 text-[12px] text-[#707974] mb-3">
              <div>Operator: <strong className="text-[#1d1b16]">Ramesh Shinde (CSC VLE)</strong></div>
              <div>Location: <strong className="text-[#1d1b16]">Ground Floor, Gram Panchayat Bhawan, Ward No. 2</strong></div>
              <div>Hours: <strong className="text-[#1d1b16]">8:30 AM - 6:30 PM (Mon-Sat)</strong></div>
            </div>

            <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] mb-4 flex items-center justify-between text-[12px]">
              <div>
                <div className="text-[10px] text-[#707974] uppercase font-bold">Current Desk Queue</div>
                <div className="font-heading font-extrabold text-[15px] text-[#003629]">4 People Ahead</div>
              </div>
              <span className="text-[11px] font-bold text-[#a63b00] bg-white px-2 py-1 rounded-md border border-[#e8e2d9]">
                Estimated Wait: ~8 min
              </span>
            </div>

            <a
              href="tel:9822104500"
              className="w-full py-2.5 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-[12px] font-bold flex items-center justify-center gap-1 mb-2 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">call</span>
              <span>Call Operator: +91 98221 04500</span>
            </a>

            <button
              onClick={() => alert('Digital Queue Token #DG-48 generated! Please visit Asgaon CSC desk.')}
              className="w-full py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[12px] font-bold transition-colors border border-[#e8e2d9]"
            >
              Get Instant Queue Token
            </button>
          </div>

          {/* Widget 2: Gram Panchayat Gharkul Desk */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a63b00] bg-[#fff8f0] px-2 py-0.5 rounded border border-[#ffdbce]">
              GHARKUL DESK (घरकुल कक्ष)
            </span>

            <h3 className="font-heading font-extrabold text-[15px] text-[#003629] mt-2 mb-1">
              Gram Panchayat Housing Cell
            </h3>
            <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
              Submit your property 8A extract, Awaas+ registration, and Gram Sabha resolution directly to Gram Sevak.
            </p>

            <div className="space-y-1.5 text-[12px] text-[#404945]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#003629]">badge</span>
                <span>Gram Sevak: <strong>S. N. Jadhav</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#003629]">schedule</span>
                <span>Office Time: <strong>10:00 AM - 5:00 PM</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#003629]">location_on</span>
                <span>Gram Sachivalaya, Asgaon</span>
              </div>
            </div>
          </div>

          {/* Widget 3: Grievance & Zero Bribery */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center gap-1.5 text-[#ba1a1a] font-bold text-[13px] mb-1">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Grievance &amp; Zero Bribery (तक्रार निवारण)</span>
            </div>
            <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
              All government schemes in Asgaon are 100% free of charge. Demanding bribe or commission is a punishable offense under the Prevention of Corruption Act.
            </p>

            <div className="bg-[#ffdad6] text-[#93000a] p-3 rounded-xl border border-[#ffb4ab] text-[12px] mb-3">
              <div className="font-bold">Citizen Anti-Corruption Bureau (ACB)</div>
              <div className="font-extrabold text-[15px] mt-0.5">Toll-Free 1064</div>
              <div className="text-[10px]">Anonymous and confidential reporting</div>
            </div>

            <div className="text-[11px] text-[#707974] flex items-center justify-between">
              <span>Taluka Lokpal Desk:</span>
              <a href="tel:02162233400" className="font-bold text-[#ba1a1a] hover:underline">
                02162-233400
              </a>
            </div>
          </div>

          {/* Widget 4: Standard Village Affidavit Formats */}
          <div className="bg-[#f9f3ea] rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <h3 className="font-heading font-bold text-[14px] text-[#003629] mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#a63b00]">description</span>
              <span>Official Affidavit Formats (महत्वाचे नमुने)</span>
            </h3>
            <ul className="space-y-2 text-[12px]">
              <li>
                <button
                  onClick={() => alert('Downloading Gram Panchayat 8A Property Self-Affidavit Format (PDF)')}
                  className="text-[#003629] hover:underline flex items-center gap-1 text-left"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  <span>1. Gharkul 8A Property Self-Affidavit (PDF)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Downloading 7/12 Sowing Declaration Format (PDF)')}
                  className="text-[#003629] hover:underline flex items-center gap-1 text-left"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  <span>2. 7/12 Land Sowing Declaration (PDF)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Downloading Ladki Bahin Hamipatra Format (PDF)')}
                  className="text-[#003629] hover:underline flex items-center gap-1 text-left"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  <span>3. Ladki Bahin Hamipatra Declaration (PDF)</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* 8. Scheme Detail Modal */}
      {selectedModalScheme && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#e8e2d9] shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#dbe1ff] text-[#002873]">
                  {selectedModalScheme.badge}
                </span>
                <h3 className="font-heading font-extrabold text-[19px] text-[#1d1b16] mt-1">
                  {selectedModalScheme.title}
                </h3>
                <p className="text-[12px] font-bold text-[#a63b00]">{selectedModalScheme.department}</p>
              </div>
              <button
                onClick={() => setSelectedModalScheme(null)}
                className="w-8 h-8 rounded-full bg-[#f3ede4] hover:bg-[#e8e2d9] flex items-center justify-center text-[#1d1b16]"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9] text-[13px]">
              <strong className="text-[#003629] block text-[11px] uppercase mb-0.5">Assistance &amp; Benefit:</strong>
              <p className="text-[#1d1b16]">{selectedModalScheme.financialAssistance}</p>
            </div>

            <div className="text-[13px]">
              <strong className="text-[#003629] block text-[11px] uppercase mb-0.5">Eligibility:</strong>
              <p className="text-[#404945]">{selectedModalScheme.eligibility}</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#e8e2d9]">
              <strong className="text-[#003629] block text-[11px] uppercase mb-1.5">Required Documents:</strong>
              <div className="space-y-1.5 text-[12px]">
                {selectedModalScheme.documents.map((d: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[#1d1b16]">
                    <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f3ede4]">
              <button
                onClick={() => setSelectedModalScheme(null)}
                className="px-4 py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[12px] font-bold"
              >
                Close
              </button>
              <a
                href={selectedModalScheme.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#002873] hover:bg-[#00174b] text-white text-[12px] font-bold flex items-center gap-1"
              >
                <span>{selectedModalScheme.actionLabel}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
