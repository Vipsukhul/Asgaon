import { LucideIcon } from '../components/LucideIcon';
import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';
import type { Scheme } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEOHead } from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

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
  const { lang, t } = useLanguage();

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
    { id: 'All', label: lang === 'MR' ? 'सर्व योजना' : 'All Schemes', icon: 'apps' },
    { id: 'housing', label: lang === 'MR' ? 'घरकुल व आवास योजना' : 'Gharkul & Housing', icon: 'home' },
    { id: 'farmer', label: lang === 'MR' ? 'शेती व कृषी योजना' : 'Farmers & Krishi', icon: 'agriculture' },
    { id: 'women', label: lang === 'MR' ? 'महिला व लाडकी बहीण' : 'Women & SHGs', icon: 'family_restroom' },
    { id: 'student', label: lang === 'MR' ? 'विद्यार्थी व शिष्यवृत्ती' : 'Students & Youth', icon: 'school' },
    { id: 'solar', label: lang === 'MR' ? 'सौर कृषी पंप (कुसुम)' : 'Solar Energy', icon: 'solar_power' },
    { id: 'health', label: lang === 'MR' ? 'आरोग्य व पेन्शन' : 'Health & Pension', icon: 'health_and_safety' }
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
            name: 'आसगावमध्ये घरकुल योजनेसाठी कसा अर्ज करावा?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'आसगाव ग्रामपंचायतीत रमाई आवास योजना, शबरी आवास योजना, मोदी आवास योजना आणि प्रधानमंत्री आवास योजना-ग्रामीण अंतर्गत अर्ज करता येतो. यासाठी ग्रामपंचायतीचा नमुना ८-अ उतारा, आधार कार्ड, जातीचा दाखला व उत्पन्नाचा दाखला ग्रामसेवक यांच्याकडे सादर करावा लागतो.'
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
          { label: t('nav_home'), onClick: onNavigateHome },
          { label: t('nav_schemes'), active: true }
        ]}
        
      />

      {/* 3. Hero Header Banner */}
      <header className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e8e2d9] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="font-heading font-extrabold text-[24px] sm:text-[28px] text-[#166534] leading-tight mb-1">
            {lang === 'MR' ? 'शासकीय योजना व घरकुल मार्गदर्शन दालन' : 'Sarkari Yojana & Gharkul Guidance Portal'}
          </h1>
          <p className="font-heading font-bold text-[14px] sm:text-[15px] text-[#c2410c] mb-2">
            {lang === 'MR' ? 'सर्व शासकीय योजना, ग्रामीण घरकुल योजना व कृषी अनुदान — अधिकृत माहिती व थेट अर्ज' : 'Central & Maharashtra Govt Welfare Schemes, Housing Grants & Farm Subsidies'}
          </p>
        </div>

        {/* Right CTA Buttons */}
        <div className="flex flex-col gap-2.5 w-full lg:w-72 shrink-0">
          <button
            onClick={() => {
              setSelectedCat('housing');
              setCurrentPage(1);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#c2410c] hover:bg-[#852f00] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <LucideIcon name="home" className="text-[18px]" />
            <span>{lang === 'MR' ? 'सर्व घरकुल योजना पहा' : 'View All Gharkul Schemes'}</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href="tel:9822104500"
              className="flex-1 py-2 px-3 rounded-xl bg-[#f9f3ea] hover:bg-[#f3ede4] text-[#1d1b16] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#e8e2d9]"
            >
              <LucideIcon name="support_agent" className="text-[16px]" />
              <span>{lang === 'MR' ? 'सीएससी मदत' : 'CSC Helpline'}</span>
            </a>
          </div>
        </div>
      </header>

      {/* 4. Gharkul Special Info Spotlight Card (Always visible or prominently shown) */}
      <section className="bg-gradient-to-r from-[#166534] to-[#0f533f] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#052e16]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#a7f3d0]">
              <LucideIcon name="cottage" className="text-[28px]" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#a7f3d0]">
                {lang === 'MR' ? 'महाराष्ट्र ग्रामीण घरकुल अभियान • आसगाव' : 'MAHARASHTRA RURAL HOUSING MISSION | ASGAON'}
              </div>
              <h2 className="font-heading font-extrabold text-[18px] sm:text-[20px] text-white">
                {lang === 'MR' ? 'घरकुल योजनांची संपूर्ण माहिती व अनुदान' : 'Gharkul Yojanas at a Glance'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCat('housing');
              setCurrentPage(1);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] hover:bg-white text-[12px] font-bold shrink-0 transition-colors"
          >
            {lang === 'MR'
              ? `घरकुल योजना फिल्टर करा (${allSchemes.filter((s) => s.categoryKey === 'housing').length})`
              : `Filter Housing Schemes (${allSchemes.filter((s) => s.categoryKey === 'housing').length})`}
          </button>
        </div>

        {/* 4 Mini Cards for Each Gharkul Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12px]">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="font-bold text-[#a7f3d0] text-[13px] flex items-center gap-1">
                <span>PMAY-G ({lang === 'MR' ? 'केंद्र सरकार' : 'Central Govt'})</span>
              </div>
              <div className="font-bold text-white text-[15px] my-1">{lang === 'MR' ? '₹१.५७ लाख एकूण' : '₹1.57 Lakhs Total'}</div>
              <p className="text-white/80 text-[11px]">{lang === 'MR' ? 'SECC / आवास+ प्रतीक्षा यादीतील बेघर कुटुंबांसाठी.' : 'For houseless families in SECC / Awaas+ waitlist.'}</p>
            </div>
            <div className="mt-2 text-[10px] text-[#a7f3d0] font-medium">{lang === 'MR' ? 'सर्व प्रवर्ग (SECC यादी)' : 'All Castes (SECC List)'}</div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="font-bold text-[#a7f3d0] text-[13px]">{lang === 'MR' ? 'रमाई आवास योजना' : 'Ramai Awas Yojana'}</div>
              <div className="font-bold text-white text-[15px] my-1">{lang === 'MR' ? '₹१.३० लाख + मनरेगा' : '₹1.30L + MGNREGA'}</div>
              <p className="text-white/80 text-[11px]">{lang === 'MR' ? 'ग्रामीण भागातील अनुसूचित जाती व नवबौद्ध कुटुंबांसाठी.' : 'Dedicated grant for rural SC & Neo-Buddhist families.'}</p>
            </div>
            <div className="mt-2 text-[10px] text-[#a7f3d0] font-medium">{lang === 'MR' ? 'अनुसूचित जाती प्रवर्ग' : 'SC / Nav-Bouddha'}</div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="font-bold text-[#a7f3d0] text-[13px]">{lang === 'MR' ? 'शबरी आवास योजना' : 'Shabari Awas Yojana'}</div>
              <div className="font-bold text-white text-[15px] my-1">{lang === 'MR' ? '₹१.३० लाख + मनरेगा' : '₹1.30L + MGNREGA'}</div>
              <p className="text-white/80 text-[11px]">{lang === 'MR' ? 'अनुसूचित जमाती आदिवासी कुटुंबांसाठी पक्के घर अनुदान.' : 'Pukka house financial aid for Scheduled Tribe (ST) families.'}</p>
            </div>
            <div className="mt-2 text-[10px] text-[#a7f3d0] font-medium">{lang === 'MR' ? 'अनुसूचित जमाती प्रवर्ग' : 'ST / Tribal Families'}</div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="font-bold text-[#a7f3d0] text-[13px]">{lang === 'MR' ? 'मोदी आवास योजना' : 'Modi Awas Yojana'}</div>
              <div className="font-bold text-white text-[15px] my-1">{lang === 'MR' ? '₹१.२० लाख + मनरेगा' : '₹1.20L + MGNREGA'}</div>
              <p className="text-white/80 text-[11px]">{lang === 'MR' ? 'ग्रामीण भागातील इतर मागासवर्ग व विशेष मागास प्रवर्गासाठी.' : 'Special housing scheme for rural OBC / SBC / VJNT.'}</p>
            </div>
            <div className="mt-2 text-[10px] text-[#a7f3d0] font-medium">{lang === 'MR' ? 'इतर मागास प्रवर्ग' : 'OBC / SBC / VJNT'}</div>
          </div>
        </div>
      </section>

      {/* 5. Search & Unified Filter Bar */}
      <section className="bg-white rounded-2xl p-3 sm:p-4 border border-[#e8e2d9] shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1">
            <LucideIcon name="search" className="absolute left-3 top-2.5 text-[#707974] text-[18px]" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={lang === 'MR' ? "योजना शोधा (उदा. घरकुल, पीएम किसान, लाडकी बहीण)..." : "Search schemes by name, category, eligibility..."}
              className="w-full pl-9 sm:pl-10 pr-9 py-2.5 bg-[#f9f3ea] text-[#1d1b16] rounded-xl text-xs sm:text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
              aria-label="Search schemes"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-2.5 p-0.5 text-[#707974] hover:text-[#1d1b16]"
                aria-label="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Corporate Filter Icon Button in Flex */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className={`relative shrink-0 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all shadow-xs ${
              (selectedCat !== 'All' || activeCheckboxes.active || activeCheckboxes.dbt || activeCheckboxes.free || activeCheckboxes.land)
                ? 'bg-[#166534] text-white border-[#166534] ring-2 ring-[#166534]/20'
                : 'bg-[#f4efe8] text-[#1d1b16] border-[#e8e2d9] hover:bg-[#eae2d7]'
            }`}
            aria-label="Filter Schemes"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'MR' ? 'फिल्टर' : 'Filter'}</span>
            {((selectedCat !== 'All' ? 1 : 0) + (activeCheckboxes.active ? 1 : 0) + (activeCheckboxes.dbt ? 1 : 0) + (activeCheckboxes.free ? 1 : 0) + (activeCheckboxes.land ? 1 : 0)) > 0 && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-stone-900 text-[10px] sm:text-[11px] font-black flex items-center justify-center">
                {(selectedCat !== 'All' ? 1 : 0) + (activeCheckboxes.active ? 1 : 0) + (activeCheckboxes.dbt ? 1 : 0) + (activeCheckboxes.free ? 1 : 0) + (activeCheckboxes.land ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Chips (Micro Row) */}
        {((selectedCat !== 'All' ? 1 : 0) + (activeCheckboxes.active ? 1 : 0) + (activeCheckboxes.dbt ? 1 : 0) + (activeCheckboxes.free ? 1 : 0) + (activeCheckboxes.land ? 1 : 0)) > 0 && (
          <div className="pt-2 border-t border-[#f0eee8] flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] font-medium text-[#707974]">
              {lang === 'MR' ? 'सक्रिय फिल्टर्स:' : 'Active:'}
            </span>
            {selectedCat !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
                {categories.find((c) => c.id === selectedCat)?.label}
                <button onClick={() => { setSelectedCat('All'); setCurrentPage(1); }} className="hover:opacity-70 ml-0.5" aria-label="Clear category">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeCheckboxes.active && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
                {lang === 'MR' ? 'सध्या सुरू' : 'Active'}
                <button onClick={() => { setActiveCheckboxes(prev => ({ ...prev, active: false })); setCurrentPage(1); }} className="hover:opacity-70 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeCheckboxes.dbt && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
                {lang === 'MR' ? 'थेट बँक (DBT)' : 'DBT'}
                <button onClick={() => { setActiveCheckboxes(prev => ({ ...prev, dbt: false })); setCurrentPage(1); }} className="hover:opacity-70 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeCheckboxes.free && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
                {lang === 'MR' ? '१००% मोफत' : '100% Free'}
                <button onClick={() => { setActiveCheckboxes(prev => ({ ...prev, free: false })); setCurrentPage(1); }} className="hover:opacity-70 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeCheckboxes.land && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
                {lang === 'MR' ? '७/१२ आवश्यक' : '7/12'}
                <button onClick={() => { setActiveCheckboxes(prev => ({ ...prev, land: false })); setCurrentPage(1); }} className="hover:opacity-70 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCat('All');
                setActiveCheckboxes({ active: false, dbt: false, free: false, land: false });
                setCurrentPage(1);
              }}
              className="text-[11px] font-bold text-[#c2410c] hover:underline ml-1"
            >
              {lang === 'MR' ? 'सर्व काढा' : 'Clear all'}
            </button>
          </div>
        )}
      </section>

      {/* Corporate Filter Modal / Bottom Sheet */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#e8e2d9] flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#e8e2d9] flex items-center justify-between bg-[#fdfbf7]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e8f1ec] text-[#166534] flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1d1b16]">
                    {lang === 'MR' ? 'शासकीय योजना फिल्टर्स' : 'Filter Government Schemes'}
                  </h3>
                  <p className="text-[11px] text-[#707974]">
                    {lang === 'MR' ? 'विभाग व अर्जाच्या स्वरूपानुसार योजना निवडा' : 'Filter by category, subsidy type & eligibility'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f4efe8] hover:bg-[#eae2d7] text-[#707974] hover:text-[#1d1b16] flex items-center justify-center transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-sm">
              {/* Category Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-[#1d1b16] uppercase tracking-wider">
                    {lang === 'MR' ? '१. योजना विभाग' : '1. Scheme Category'}
                  </span>
                  {selectedCat !== 'All' && (
                    <button
                      onClick={() => { setSelectedCat('All'); setCurrentPage(1); }}
                      className="text-[11px] text-[#c2410c] font-semibold hover:underline"
                    >
                      {lang === 'MR' ? 'सर्व दाखवा' : 'Reset'}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const count =
                      cat.id === 'All'
                        ? allSchemes.length
                        : allSchemes.filter((s) => s.categoryKey === cat.id).length;
                    const isSelected = selectedCat === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCat(cat.id); setCurrentPage(1); }}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                            : 'bg-[#fdfbf7] text-[#404945] border-[#e8e2d9] hover:bg-[#f4efe8]'
                        }`}
                      >
                        <span className="truncate">{cat.label} ({count})</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Eligibility & Features */}
              <div>
                <span className="text-xs font-bold text-[#1d1b16] uppercase tracking-wider block mb-2.5">
                  {lang === 'MR' ? '२. पात्रता व लाभाचे स्वरूप' : '2. Benefits & Eligibility'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: 'active', label: lang === 'MR' ? 'सध्या अर्ज सुरू' : 'Applications Active Now', val: activeCheckboxes.active },
                    { key: 'dbt', label: lang === 'MR' ? 'थेट बँक खात्यात (DBT)' : 'DBT Cash Transfer', val: activeCheckboxes.dbt },
                    { key: 'free', label: lang === 'MR' ? '१००% मोफत / पूर्ण अनुदान' : '100% Free / Full Subsidy', val: activeCheckboxes.free },
                    { key: 'land', label: lang === 'MR' ? 'जमीन / घर नमुना (७/१२ आवश्यक)' : 'Land Record (7/12 Required)', val: activeCheckboxes.land }
                  ].map((attr) => (
                    <button
                      key={attr.key}
                      onClick={() => {
                        setActiveCheckboxes(prev => ({ ...prev, [attr.key]: !attr.val }));
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                        attr.val
                          ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                          : 'bg-[#fdfbf7] text-[#404945] border-[#e8e2d9] hover:bg-[#f4efe8]'
                      }`}
                    >
                      <span>{attr.label}</span>
                      {attr.val && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-300" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#e8e2d9] bg-[#f9f3ea] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedCat('All');
                  setActiveCheckboxes({ active: false, dbt: false, free: false, land: false });
                  setCurrentPage(1);
                }}
                disabled={selectedCat === 'All' && !activeCheckboxes.active && !activeCheckboxes.dbt && !activeCheckboxes.free && !activeCheckboxes.land}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  (selectedCat !== 'All' || activeCheckboxes.active || activeCheckboxes.dbt || activeCheckboxes.free || activeCheckboxes.land)
                    ? 'text-[#c2410c] hover:bg-orange-100/60'
                    : 'text-stone-400 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'MR' ? 'सर्व रीसेट' : 'Clear All'}</span>
              </button>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#166534] text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-[#14532d] transition-all flex items-center justify-center gap-2"
              >
                <span>{lang === 'MR' ? 'योजना दाखवा' : 'Show Schemes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Schemes Directory (2 cols wide) */}
        <main className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-[17px] text-[#166534]">
              {selectedCat === 'housing'
                ? (lang === 'MR' ? 'घरकुल व ग्रामीण गृहनिर्माण योजना दालन' : 'Gharkul & Rural Housing Schemes')
                : (lang === 'MR' ? 'शासकीय योजना व थेट सबसिडी सहाय्य' : 'Government Schemes & Subsidies')}{' '}
              <span className="text-[13px] font-normal text-[#707974]">
                ({lang === 'MR'
                  ? `दाखवत आहे ${filtered.length > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, filtered.length)} / एकूण ${filtered.length} योजना`
                  : `Showing ${filtered.length > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, filtered.length)} of ${filtered.length} verified schemes`})
              </span>
            </h2>
          </div>

          {allSchemes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-[#166534] border-t-transparent rounded-full animate-spin mb-1" />
              <p className="text-[13px] font-bold text-[#166534]">
                {lang === 'MR' ? 'माहिती लोड होत आहे, कृपया प्रतीक्षा करा...' : 'Loading government welfare schemes...'}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <LucideIcon name="policy" className="text-[48px] text-[#c2410c]" />
              <h3 className="font-heading font-bold text-[18px] text-[#166534]">
                {lang === 'MR' ? 'एकही योजना आढळली नाही' : 'No matching schemes found'}
              </h3>
              <p className="text-[13px] text-[#707974] max-w-md">
                {lang === 'MR'
                  ? 'तुमच्या निवडलेल्या फिल्टरनुसार कोणतीही योजना उपलब्ध नाही. कृपया "सर्व योजना" निवडा किंवा शोध शब्द बदला.'
                  : 'No government initiatives match your current filters. Try selecting "All Schemes" or clear your keyword search.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCat('All');
                  setSearch('');
                  setActiveCheckboxes({ active: false, dbt: false, free: false, land: false });
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-[#166534] text-white text-[12px] font-bold rounded-xl hover:bg-[#052e16] transition-colors"
              >
                {lang === 'MR' ? 'सर्व फिल्टर्स रीसेट करा' : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            paginatedSchemes.map((item) => (
              <article
                key={item.id}
                itemScope
                itemType="https://schema.org/GovernmentService"
                className="bg-white card-hover-subtle rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col justify-between"
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
                        className="font-heading font-extrabold text-[18px] text-[#1d1b16] leading-snug hover:text-[#166534] transition-colors"
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
                        className="text-[12px] font-semibold text-[#c2410c] mt-0.5"
                      >
                        {item.department}
                      </p>
                    </div>

                    <div className="bg-[#fef9ee] p-2.5 rounded-xl border border-[#fed7aa] text-right shrink-0">
                      <div className="font-heading font-extrabold text-[15px] text-[#c2410c]">
                        {item.subsidyBadge}
                      </div>
                      <div className="text-[10px] text-[#707974] font-semibold">{item.subsidySub}</div>
                    </div>
                  </div>

                  {/* 2-Column Benefits & Eligibility Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9] mb-3 text-[12px]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#166534] mb-1 flex items-center gap-1">
                        <LucideIcon name="account_balance_wallet" className="text-[14px]" />
                        <span>{lang === 'MR' ? 'आर्थिक सहाय्य / सबसिडी' : 'Financial Assistance / Subsidy'}</span>
                      </div>
                      <p className="text-[#404945] leading-relaxed font-medium">{item.financialAssistance}</p>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#166534] mb-1 flex items-center gap-1">
                        <LucideIcon name="checklist" className="text-[14px]" />
                        <span>{lang === 'MR' ? 'पात्रता निकष' : 'Eligibility Criteria'}</span>
                      </div>
                      <p className="text-[#404945] leading-relaxed">{item.eligibility}</p>
                    </div>
                  </div>

                  {/* Required Documents Checklist */}
                  <div className="bg-white p-3 rounded-xl border border-[#e8e2d9] mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#707974] mb-2 flex items-center gap-1">
                      <LucideIcon name="task_alt" className="text-[14px] text-[#376757]" />
                      <span>{lang === 'MR' ? 'आवश्यक कागदपत्रे सूची' : 'Required Documents Checklist'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] text-[#1d1b16]">
                      {item.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <LucideIcon name="check_circle" className="text-[15px] text-[#376757] shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {item.urgentAlert && (
                    <div className="bg-[#fef9ee] text-[#c2410c] p-2.5 rounded-xl border border-[#fed7aa] text-[12px] font-bold mb-3 flex items-center gap-2">
                      <LucideIcon name="campaign" className="text-[18px]" />
                      <span>{item.urgentAlert}</span>
                    </div>
                  )}

                  {item.note && (
                    <div className="text-[11px] text-[#707974] flex items-center gap-1.5 mb-2">
                      <LucideIcon name="info" className="text-[15px] text-[#376757]" />
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
                      <span>{item.actionLabel || (lang === 'MR' ? 'पोर्टलवर अर्ज करा' : 'Apply on Portal')}</span>
                      <LucideIcon name="open_in_new" className="text-[14px]" />
                    </a>

                    {/* {onSelectScheme ? (
                      <button
                        onClick={() => onSelectScheme(item.slug)}
                        className="px-3.5 py-2 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold transition-colors shadow-xs flex items-center gap-1"
                      >
                        <span>{lang === 'MR' ? 'संपूर्ण तपशील पहा' : 'Full Scheme Page'}</span>
                        <LucideIcon name="arrow_forward" className="text-[14px]" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedModalScheme(item)}
                        className="px-3 py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[12px] font-bold transition-colors border border-[#e8e2d9]"
                      >
                        <span>{lang === 'MR' ? 'तपशील पहा' : 'View Details'}</span>
                      </button>
                    )} */}

                    {onBookmarkScheme && (
                      <button
                        onClick={() => onBookmarkScheme(item)}
                        title={lang === 'MR' ? 'योजना सेव्ह करा' : 'Bookmark Scheme'}
                        className="p-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#707974] hover:text-[#166534] transition-colors"
                      >
                        <LucideIcon name="bookmark_border" className="text-[18px]" />
                      </button>
                    )}
                  </div>

                  <a
                    href="tel:9822104500"
                    className="text-[12px] font-bold text-[#c2410c] hover:underline flex items-center gap-1"
                  >
                    <LucideIcon name="storefront" className="text-[15px]" />
                    <span>{lang === 'MR' ? 'आसगाव CSC केंद्रावर अर्ज करा' : 'Book at Asgaon CSC Desk'}</span>
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
              {lang === 'MR'
                ? `दाखवत आहे ${filtered.length > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, filtered.length)} / एकूण ${filtered.length} योजना`
                : `Showing ${filtered.length > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, filtered.length)} of ${filtered.length} verified schemes`}
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
                          ? 'bg-[#166534] text-white shadow-xs'
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
              <LucideIcon name="help_outline" className="text-[24px] text-[#166534]" />
              <div>
                <h2 className="font-heading font-extrabold text-[17px] text-[#166534]">
                  {lang === 'MR' ? 'वारंवार विचारले जाणारे प्रश्न' : 'Frequently Asked Questions (FAQ)'}
                </h2>
                <p className="text-[12px] text-[#707974]">
                  {lang === 'MR'
                    ? 'आसगाव परिसरातील घरकुल व थेट अनुदान योजनांविषयी महत्त्वाची माहिती'
                    : 'Key guidelines for Gharkul housing and DBT subsidies in Asgaon area'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-[13px]">
              <details className="group bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <summary className="font-bold text-[#166534] cursor-pointer flex items-center justify-between list-none">
                  <span>{lang === 'MR' ? '१. आसगावमध्ये घरकुल योजनेसाठी कोणती कागदपत्रे लागतात?' : '1. Which documents are required for Gharkul Yojana in Asgaon?'}</span>
                  <LucideIcon name="expand_more" className="text-[20px] transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-2 text-[#404945] leading-relaxed pt-2 border-t border-[#e8e2d9]/60">
                  {lang === 'MR' ? (
                    <>
                      घरकुल योजनेसाठी खालील कागदपत्रे आवश्यक आहेत:
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>नमुना ८-अ किंवा ७/१२ जमिनीचा उतारा (जागा स्वतःच्या नावावर असणे आवश्यक).</li>
                        <li>तहसीलदार कार्यालयाचा वार्षिक उत्पन्नाचा दाखला (वार्षिक उत्पन्न मर्यादा ₹१.२० लाखांपर्यंत).</li>
                        <li>सक्षम प्राधिकाऱ्याचा जातीचा दाखला (रमाईसाठी SC, शबरीसाठी ST, मोदी आवाससाठी OBC).</li>
                        <li>आधार कार्ड, शिधापत्रिका (रेशन कार्ड) व आधार संलग्न बँक खाते पासबुक.</li>
                        <li>ग्रामसभेचा मंजुरी ठराव किंवा SECC / Awaas+ प्रतीक्षा यादीतील नाव.</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      The following documents are required for Gharkul housing schemes:
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Form 8A or 7/12 Land Record (Plot must be registered in applicant's name).</li>
                        <li>Income Certificate from Tehsildar (Annual limit up to ₹1.20 Lakh).</li>
                        <li>Caste Certificate (SC for Ramai, ST for Shabari, OBC for Modi Awas).</li>
                        <li>Aadhaar Card, Ration Card &amp; Aadhaar-linked Bank Passbook.</li>
                        <li>Gram Sabha recommendation resolution or name in SECC / Awaas+ waitlist.</li>
                      </ul>
                    </>
                  )}
                </div>
              </details>

              <details className="group bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <summary className="font-bold text-[#166534] cursor-pointer flex items-center justify-between list-none">
                  <span>{lang === 'MR' ? '२. घरकुल योजनेत अनुदानाची रक्कम कशी वितरित केली जाते?' : '2. How is the financial grant disbursed in Gharkul Yojana?'}</span>
                  <LucideIcon name="expand_more" className="text-[20px] transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-2 text-[#404945] leading-relaxed pt-2 border-t border-[#e8e2d9]/60">
                  {lang === 'MR' ? (
                    <>
                      अनुदान रक्कम (₹१,२०,००० ते ₹१,३०,०००) जिओ-टॅग केलेल्या फोटो पडताळणीनंतर थेट बँक खात्यात टप्प्याटप्प्याने जमा केली जाते:
                      <ol className="list-decimal pl-5 mt-1 space-y-1">
                        <li>१ ला हप्ता (२०%): जोत्याचे बांधकाम.</li>
                        <li>२ रा हप्ता (४५%): खिडकी व भिंतीचे बांधकाम पूर्ण झाल्यावर.</li>
                        <li>३ रा हप्ता (२५%): स्लॅब (छत) टाकल्यावर.</li>
                        <li>४ था हप्ता (१०%): दरवाजे, खिडक्या, प्लास्टर व शौचालय पूर्ण झाल्यावर + स्वच्छ भारत अभियान अंतर्गत ₹१२,००० प्रोत्साहन अनुदान + मनरेगा अंतर्गत ९० दिवसांची मजुरी (सुमारे ₹२५,०००).</li>
                      </ol>
                    </>
                  ) : (
                    <>
                      The subsidy amount (₹1,20,000 to ₹1,30,000) is released in direct DBT milestone installments upon geo-tagged photo verification:
                      <ol className="list-decimal pl-5 mt-1 space-y-1">
                        <li>1st Installment (20%): Plinth level excavation foundation.</li>
                        <li>2nd Installment (45%): Lintel &amp; wall masonry completion.</li>
                        <li>3rd Installment (25%): Roof slab completion.</li>
                        <li>4th Installment (10%): Door, window, plaster, and toilet completion + ₹12,000 SBM toilet incentive + ₹25,000 (90 days MGNREGA wages).</li>
                      </ol>
                    </>
                  )}
                </div>
              </details>

              <details className="group bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <summary className="font-bold text-[#166534] cursor-pointer flex items-center justify-between list-none">
                  <span>{lang === 'MR' ? '३. मुख्यमंत्री माझी लाडकी बहीण योजनेचा लाभ कोणाला मिळतो?' : '3. Who is eligible for Majhi Ladki Bahin Yojana?'}</span>
                  <LucideIcon name="expand_more" className="text-[20px] transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-2 text-[#404945] leading-relaxed pt-2 border-t border-[#e8e2d9]/60">
                  {lang === 'MR' ? (
                    <>
                      महाराष्ट्रातील २१ ते ६५ वयोगटातील विवाहित, विधवा, घटस्फोटित, परित्यक्ता आणि निराधार महिला ज्यांच्या कुटुंबाचे वार्षिक उत्पन्न ₹२.५ लाखांपेक्षा कमी आहे (किंवा पिवळे/केशरी रेशन कार्डधारक), त्यांना दरमहा ₹१,५०० (वार्षिक ₹१८,०००) थेट बँक खात्यात दिले जातात.
                    </>
                  ) : (
                    <>
                      Married, widowed, divorced, and destitute women of Maharashtra aged 21 to 65 years whose family annual income is below ₹2.5 lakh (or having yellow/orange ration card) receive ₹1,500 monthly directly into their bank account.
                    </>
                  )}
                </div>
              </details>

              <details className="group bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <summary className="font-bold text-[#166534] cursor-pointer flex items-center justify-between list-none">
                  <span>{lang === 'MR' ? '४. अर्जासाठी कोणतेही शुल्क किंवा मध्यस्थांची फी लागते का?' : '4. Are there any application fees or agent commissions?'}</span>
                  <LucideIcon name="expand_more" className="text-[20px] transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-2 text-[#404945] leading-relaxed pt-2 border-t border-[#e8e2d9]/60">
                  {lang === 'MR' ? (
                    <>
                      <strong>शून्य शुल्क!</strong> शासनाच्या सर्व योजनांचे अर्ज नागरिकांसाठी १००% मोफत आहेत. कोणत्याही मध्यस्थ अथवा दलालाला लाच देऊ नका. गैरव्यवहाराची तक्रार लाचलुचपत प्रतिबंधक विभाग टोल-फ्री १०६४ वर तात्काळ नोंदवा.
                    </>
                  ) : (
                    <>
                      <strong>Zero fees!</strong> All central and state government schemes are 100% free of charge. Never pay any bribe or commission to middlemen. In case of bribery demands, report immediately to Anti-Corruption Bureau toll-free 1064.
                    </>
                  )}
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
              {lang === 'MR' ? 'नागरिक सेवा केंद्र' : 'GOVERNMENT SERVICES DESK'}
            </span>

            <h3 className="font-heading font-extrabold text-[16px] text-[#166534] mt-2 mb-1">
              {lang === 'MR' ? 'आसगाव सीएससी डिजिटल सेवा केंद्र' : 'Asgaon CSC Digital Seva Kendra'}
            </h3>
            <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
              {lang === 'MR'
                ? 'ऑनलाइन डीबीटी नोंदणी, कागदपत्र स्कॅनिंग, ७/१२ व ८-अ डाऊनलोड आणि बायोमेट्रिक ई-केवायसीसाठी मदत केंद्र.'
                : 'Assistance desk for online DBT registrations, document scanning, 7/12 & 8A downloads, and biometric e-KYC.'}
            </p>

            <div className="space-y-1 text-[12px] text-[#707974] mb-3">
              <div>{lang === 'MR' ? 'ऑपरेटर:' : 'Operator:'} <strong className="text-[#1d1b16]">Ramesh Shinde (CSC VLE)</strong></div>
              <div>{lang === 'MR' ? 'पत्ता:' : 'Location:'} <strong className="text-[#1d1b16]">{lang === 'MR' ? 'वॉर्ड क्र. २, आसगाव' : 'Ward No. 2, Asgaon'}</strong></div>
              <div>{lang === 'MR' ? 'वेळ:' : 'Hours:'} <strong className="text-[#1d1b16]">{lang === 'MR' ? 'सकाळी ८:३० - संध्याकाळी ६:३० (सोम-शनि)' : '8:30 AM - 6:30 PM (Mon-Sat)'}</strong></div>
            </div>

            <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] mb-4 flex items-center justify-between text-[12px]">
              <div>
                <div className="text-[10px] text-[#707974] uppercase font-bold">{lang === 'MR' ? 'रांगेतील स्थिती' : 'Current Desk Queue'}</div>
                <div className="font-heading font-extrabold text-[15px] text-[#166534]">{lang === 'MR' ? '४ नागरिक पुढे आहेत' : '4 People Ahead'}</div>
              </div>
              <span className="text-[11px] font-bold text-[#c2410c] bg-white px-2 py-1 rounded-md border border-[#e8e2d9]">
                {lang === 'MR' ? 'अंदाजे वेळ: ~८ मि.' : 'Estimated Wait: ~8 min'}
              </span>
            </div>

            <a
              href="tel:9822104500"
              className="w-full py-2.5 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold flex items-center justify-center gap-1 mb-2 shadow-xs transition-colors"
            >
              <LucideIcon name="call" className="text-[15px]" />
              <span>{lang === 'MR' ? 'ऑपरेटरशी संपर्क साधा' : 'Call Operator'}</span>
            </a>

            <button
              onClick={() => alert(lang === 'MR' ? 'नोंदणी क्रमांक #DG-48 निश्चित झाला! कृपया आसगाव CSC केंद्राला भेट द्या.' : 'Appointment Reference #DG-48 generated! Please visit Asgaon CSC desk.')}
              className="w-full py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[12px] font-bold transition-colors border border-[#e8e2d9]"
            >
              {lang === 'MR' ? 'सीएससी भेट क्रमांक मिळवा' : 'Get CSC Appointment Ref'}
            </button>
          </div>

          {/* Widget 2: Housing Guidance Desk */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2410c] bg-[#fef9ee] px-2 py-0.5 rounded border border-[#fed7aa]">
              {lang === 'MR' ? 'घरकुल कक्ष' : 'GHARKUL DESK'}
            </span>

            <h3 className="font-heading font-extrabold text-[15px] text-[#166534] mt-2 mb-1">
              {lang === 'MR' ? 'घरकुल व आवास मार्गदर्शन' : 'Housing & Gharkul Guidance Desk'}
            </h3>
            <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
              {lang === 'MR'
                ? 'तुमचा ८-अ उतारा, आवास+ नोंदणी आणि आवश्यक अर्जाच्या मदतीसाठी स्थानिक माहिती.'
                : 'Submit property 8A extract, Awaas+ registration details and obtain local scheme guidance.'}
            </p>

            <div className="space-y-1.5 text-[12px] text-[#404945]">
              <div className="flex items-center gap-1.5">
                <LucideIcon name="schedule" className="text-[16px] text-[#166534]" />
                <span>{lang === 'MR' ? 'कार्यालय वेळ:' : 'Office Time:'} <strong>{lang === 'MR' ? 'सकाळी १०:०० - संध्याकाळी ५:००' : '10:00 AM - 5:00 PM'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <LucideIcon name="location_on" className="text-[16px] text-[#166534]" />
                <span>{lang === 'MR' ? 'आसगाव गाव परिसर' : 'Asgaon Village Area'}</span>
              </div>
            </div>
          </div>

          {/* Widget 3: Transparency & Anti-Bribery Helpline */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center gap-1.5 text-[#ba1a1a] font-bold text-[13px] mb-1">
              <LucideIcon name="verified_user" className="text-[18px]" />
              <span>{lang === 'MR' ? 'पारदर्शकता व लाचलुचपत प्रतिबंध' : 'Transparency & Anti-Bribery Desk'}</span>
            </div>
            <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
              {lang === 'MR'
                ? 'शासकीय योजनांचे सर्व अर्ज १००% मोफत आहेत. लाच मागणे किंवा दलाली करणे हा कायद्याने दंडनीय गुन्हा आहे.'
                : 'All government scheme applications are 100% free. Demanding bribe or commission is a punishable offense.'}
            </p>

            <div className="bg-[#fef3c7] text-[#93000a] p-3 rounded-xl border border-[#fde68a] text-[12px] mb-3">
              <div className="font-bold">{lang === 'MR' ? 'लाचलुचपत प्रतिबंधक विभाग' : 'Citizen Anti-Corruption Bureau (ACB)'}</div>
              <div className="font-extrabold text-[15px] mt-0.5">{lang === 'MR' ? 'टोल-फ्री १०६४' : 'Toll-Free 1064'}</div>
              <div className="text-[10px]">{lang === 'MR' ? 'गोपनीय शासकीय हेल्पलाईन' : 'Confidential Government Helpline'}</div>
            </div>

            <div className="text-[11px] text-[#707974] flex items-center justify-between">
              <span>{lang === 'MR' ? 'तालुका लोकपाल हेल्पलाईन:' : 'Taluka Lokpal Desk:'}</span>
              <a href="tel:02162233400" className="font-bold text-[#ba1a1a] hover:underline">
                02162-233400
              </a>
            </div>
          </div>

          {/* Widget 4: Standard Village Affidavit Formats */}
          <div className="bg-[#f9f3ea] rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <h3 className="font-heading font-bold text-[14px] text-[#166534] mb-2 flex items-center gap-1">
              <LucideIcon name="description" className="text-[16px] text-[#c2410c]" />
              <span>{lang === 'MR' ? 'महत्वाचे अर्ज नमुने व प्रतिज्ञापत्रे' : 'Official Affidavit Formats'}</span>
            </h3>
            <ul className="space-y-2 text-[12px]">
              <li>
                <button
                  onClick={() => alert(lang === 'MR' ? 'घरकुल ८-अ स्वयंघोषणापत्र नमुना डाउनलोड होत आहे' : 'Downloading Gharkul 8A Property Self-Affidavit Format (PDF)')}
                  className="text-[#166534] hover:underline flex items-center gap-1 text-left"
                >
                  <LucideIcon name="download" className="text-[14px]" />
                  <span>{lang === 'MR' ? '१. घरकुल ८-८-अ मालमत्ता स्वयंघोषणापत्र' : '1. Gharkul 8A Property Self-Affidavit (PDF)'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert(lang === 'MR' ? '७/१२ पीक पाहणी घोषणापत्र नमुना डाउनलोड होत आहे' : 'Downloading 7/12 Sowing Declaration Format (PDF)')}
                  className="text-[#166534] hover:underline flex items-center gap-1 text-left"
                >
                  <LucideIcon name="download" className="text-[14px]" />
                  <span>{lang === 'MR' ? '२. ७/१२ ई-पीक पाहणी स्वयंघोषणापत्र' : '2. 7/12 Land Sowing Declaration (PDF)'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert(lang === 'MR' ? 'लाडकी बहीण हमीपत्र नमुना डाउनलोड होत आहे' : 'Downloading Ladki Bahin Hamipatra Format (PDF)')}
                  className="text-[#166534] hover:underline flex items-center gap-1 text-left"
                >
                  <LucideIcon name="download" className="text-[14px]" />
                  <span>{lang === 'MR' ? '३. लाडकी बहीण योजना हमीपत्र' : '3. Ladki Bahin Hamipatra Declaration (PDF)'}</span>
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
                <p className="text-[12px] font-bold text-[#c2410c]">{selectedModalScheme.department}</p>
              </div>
              <button
                onClick={() => setSelectedModalScheme(null)}
                className="w-8 h-8 rounded-full bg-[#f3ede4] hover:bg-[#e8e2d9] flex items-center justify-center text-[#1d1b16]"
                aria-label="Close modal"
              >
                <LucideIcon name="close" className="text-[18px]" />
              </button>
            </div>

            <div className="bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9] text-[13px]">
              <strong className="text-[#166534] block text-[11px] uppercase mb-0.5">
                {lang === 'MR' ? 'आर्थिक सहाय्य व लाभ:' : 'Assistance & Benefit:'}
              </strong>
              <p className="text-[#1d1b16]">{selectedModalScheme.financialAssistance}</p>
            </div>

            <div className="text-[13px]">
              <strong className="text-[#166534] block text-[11px] uppercase mb-0.5">
                {lang === 'MR' ? 'पात्रता निकष:' : 'Eligibility:'}
              </strong>
              <p className="text-[#404945]">{selectedModalScheme.eligibility}</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#e8e2d9]">
              <strong className="text-[#166534] block text-[11px] uppercase mb-1.5">
                {lang === 'MR' ? 'आवश्यक कागदपत्रे:' : 'Required Documents:'}
              </strong>
              <div className="space-y-1.5 text-[12px]">
                {selectedModalScheme.documents.map((d: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[#1d1b16]">
                    <LucideIcon name="check_circle" className="text-[16px] text-[#376757]" />
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
                {lang === 'MR' ? 'बंद करा' : 'Close'}
              </button>
              <a
                href={selectedModalScheme.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#002873] hover:bg-[#00174b] text-white text-[12px] font-bold flex items-center gap-1"
              >
                <span>{selectedModalScheme.actionLabel || (lang === 'MR' ? 'पोर्टलवर अर्ज करा' : 'Apply on Portal')}</span>
                <LucideIcon name="open_in_new" className="text-[14px]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
