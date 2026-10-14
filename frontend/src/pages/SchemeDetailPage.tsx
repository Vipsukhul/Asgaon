import { LucideIcon } from '../components/LucideIcon';
import React, { useMemo } from 'react';
import type { Scheme } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEOHead } from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

interface SchemeDetailPageProps {
  slug: string;
  schemes: Scheme[];
  onNavigateBack: () => void;
  onSelectScheme: (slug: string) => void;
  onNavigateHome: () => void;
}

export const SchemeDetailPage: React.FC<SchemeDetailPageProps> = ({
  slug,
  schemes,
  onNavigateBack,
  onSelectScheme,
  onNavigateHome
}) => {
  const { lang, t } = useLanguage();

  // Find current scheme by slug or id
  const scheme = useMemo(() => {
    return schemes.find(
      (s) => s.slug === slug || s.id === slug || s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    ) || schemes[0];
  }, [slug, schemes]);

  if (!scheme) {
    if (schemes.length === 0) {
      return (
        <div className="w-full py-28 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-3 border-[#166534] border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] font-bold text-[#166534]">
            {lang === 'MR' ? 'माहिती लोड होत आहे, कृपया प्रतीक्षा करा...' : 'Loading scheme details...'}
          </p>
        </div>
      );
    }
    return (
      <div className="w-full py-16 text-center">
        <h2 className="text-xl font-bold text-[#166534]">
          {lang === 'MR' ? 'योजना आढळली नाही' : 'Scheme not found'}
        </h2>
        <button
          onClick={onNavigateBack}
          className="mt-4 px-4 py-2 bg-[#166534] text-white rounded-xl font-bold text-sm"
        >
          {lang === 'MR' ? 'सर्व योजनांकडे परत जा' : 'Back to Schemes Directory'}
        </button>
      </div>
    );
  }

  const category = (scheme.category || 'farmer').toLowerCase();
  const isGharkul =
    category === 'housing' ||
    scheme.title.toLowerCase().includes('gharkul') ||
    scheme.title.toLowerCase().includes('awas');

  // Related schemes in same category
  const relatedSchemes = schemes
    .filter((s) => s.slug !== scheme.slug && (s.category || '').toLowerCase() === category)
    .slice(0, 3);

  // SEO dynamic metadata
  const pageUrl = `${window.location.origin}/schemes/${scheme.slug}`;
  const seoTitle = `${scheme.title} — पात्रता, कागदपत्रे व अनुदान माहिती | Asgaon Portal`;
  const seoDescription = `अधिकृत माहिती: ${scheme.title}. ${scheme.benefits}. पात्रता निकष, आवश्यक कागदपत्रे, व अर्ज करण्याची पद्धत. Pauni, Asgaon, Bhandara DBT Desk.`;

  // Application Steps customized for category
  const applicationSteps = isGharkul
    ? [
        {
          step: 1,
          title: 'नमुना ८-अ व जागेची आवश्यक कागदपत्रे गोळा करा',
          desc: 'ग्रामपंचायत कार्यालयातून नमुना ८-अ मालमत्ता पत्रक किंवा ७/१२ जमिनीचा उतारा मिळवा. जागा स्वतःच्या नावावर किंवा वडिलोपार्जित असणे आवश्यक आहे.'
        },
        {
          step: 2,
          title: 'उत्पन्न व उत्पन्न व जात प्रमाणपत्र तयार ठेवा',
          desc: 'तहसीलदार कार्यालयाचा चालू आर्थिक वर्षाचा उत्पन्नाचा दाखला (वार्षिक उत्पन्न मर्यादा ₹१.२० लाखांपर्यंत) आणि सक्षम प्राधिकाऱ्याचा जातीचा दाखला जोडा.'
        },
        {
          step: 3,
          title: 'ग्रामसेवक किंवा CSC ग्रामपंचायत किंवा आपले सरकार सेवा केंद्रात अर्ज सादर करा',
          desc: 'ग्रामपंचायतीच्या घरकुल कक्षात ग्रामसेवक यांच्याकडे किंवा अधिकृत महा-ई-सेवा केंद्रात ऑनलाइन Awaas+ पोर्टलवर नोंदणी करा.'
        },
        {
          step: 4,
          title: 'जिओ-टॅगिंग व टप्प्याटप्प्याने बँक खात्यात थेट अनुदान',
          desc: 'पाया बांधकाम, भिंती बांधकाम, छत बांधकाम व पूर्ण बांधकाम झाल्यावर जिओ-टॅग फोटो तपासणीनंतर अनुदान थेट बँक खात्यात जमा होते.'
        }
      ]
    : [
        {
          step: 1,
          title: 'पात्रता व कागदपत्रांची पडताळणी',
          desc: 'आधार कार्ड, बँक पासबुक (NPCI आधार संलग्न) आणि जमिनीचा अद्ययावत ७/१२ उतारा किंवा शैक्षणिक कागदपत्रे तयार ठेवा.'
        },
        {
          step: 2,
          title: 'अधिकृत शासकीय पोर्टलवर ऑनलाइन नोंदणी',
          desc: 'अधिकृत शासकीय पोर्टलवर (MahaDBT / PM-Kisan) नवीन वापरकर्ता म्हणून नोंदणी करून अर्ज भरा.'
        },
        {
          step: 3,
          title: 'बायोमेट्रिक e-KYC किंवा कागदपत्र पडताळणी',
          desc: 'जवळच्या आसगाव CSC डिजिटल सेवा केंद्रात जाऊन आधार बायोमेट्रिक e-KYC पूर्ण करा.'
        },
        {
          step: 4,
          title: 'थेट बँक खात्यात थेट लाभ हस्तांतरण',
          desc: 'अर्जाची पडताळणी पूर्ण झाल्यावर अनुदानाची रक्कम थेट तुमच्या आधार-लिंक्ड बँक खात्यात जमा केली जाते.'
        }
      ];

  // Tailored FAQs per scheme
  const schemeFaqs = [
    {
      q: `Who is eligible for ${scheme.title}? (पात्रता निकष काय आहेत?)`,
      a: scheme.eligibility
    },
    {
      q: `What financial benefit or subsidy is provided? (किती अनुदान मिळते?)`,
      a: scheme.benefits
    },
    {
      q: `What documents are mandatory? (कोणती कागदपत्रे आवश्यक आहेत?)`,
      a: Array.isArray(scheme.documentsRequired)
        ? scheme.documentsRequired.join(', ')
        : 'Aadhaar Card, 7/12 or 8A property extract, Income Certificate, Active Bank Passbook.'
    },
    {
      q: `Are there any application charges or fees? (काही शुल्क किंवा फी आहे का?)`,
      a: 'Zero fee! Government welfare schemes in Asgaon Gram Panchayat are 100% free of cost. Never pay any fee or bribe to agents.'
    }
  ];

  // Schema.org Structured Data (GovernmentService + HowTo + FAQPage + BreadcrumbList)
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
            name: 'Government Schemes',
            item: `${window.location.origin}/schemes`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: scheme.title,
            item: pageUrl
          }
        ]
      },
      {
        '@type': 'GovernmentService',
        name: scheme.title,
        serviceType: scheme.category,
        provider: {
          '@type': 'GovernmentOrganization',
          name: scheme.sponsoringAgency || 'Government of Maharashtra'
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Asgaon, Pauni, Bhandara, Maharashtra'
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
          description: scheme.benefits
        },
        url: pageUrl
      },
      {
        '@type': 'HowTo',
        name: `How to apply for ${scheme.title}`,
        step: applicationSteps.map((s, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: s.title,
          text: s.desc
        }))
      },
      {
        '@type': 'FAQPage',
        mainEntity: schemeFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a
          }
        }))
      }
    ]
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*${scheme.title}*\n${scheme.benefits}\n\nसविस्तर माहिती, पात्रता व कागदपत्रे पाहण्यासाठी खालील लिंक उघडा:\n${pageUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* 1. Dedicated SEO Head Injection */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={`${scheme.title}, ${category}, Asgaon, Pauni, Bhandara, Maharashtra DBT, सरकारी योजना, कागदपत्रे, पात्रता, अनुदान`}
        canonicalUrl={pageUrl}
        ogType="article"
        structuredData={structuredData}
      />

      {/* 2. Breadcrumbs & Return Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: t('nav_home'), onClick: onNavigateHome },
            { label: t('nav_schemes'), onClick: onNavigateBack },
            { label: scheme.title, active: true }
          ]}
        />

        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-[#1d1b16] text-[12px] font-bold transition-colors border border-[#e8e2d9] shadow-xs cursor-pointer"
        >
          <LucideIcon name="arrow_back" className="text-[16px]" />
          <span>{lang === 'MR' ? 'परत जा' : 'Back'}</span>
        </button>
      </div>

      {/* 3. Hero Header Section */}
      <header className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#dbe1ff] text-[#002873]">
              {scheme.category} {isGharkul ? (lang === 'MR' ? '• घरकुल योजना' : '• GHARKUL SCHEME') : (lang === 'MR' ? '• शासकीय योजना' : '• GOVT SCHEME')}
            </span>

          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white text-[12px] font-bold transition-colors shadow-xs"
            >
              <LucideIcon name="share" className="text-[16px]" />
              <span>{lang === 'MR' ? 'शेअर' : 'Share'}</span>
            </button>
          </div>
        </div>

        <h1 className="font-heading font-extrabold text-[24px] sm:text-[32px] text-[#166534] leading-tight mb-2">
          {scheme.title}
        </h1>

        {scheme.sponsoringAgency && (
          <div className="flex items-center gap-2 text-[14px] font-bold text-[#c2410c] mb-4">
            <LucideIcon name="account_balance" className="text-[18px]" />
            <span>{scheme.sponsoringAgency}</span>
          </div>
        )}

        <p className="text-[14px] text-[#404945] leading-relaxed max-w-4xl">
          {scheme.description}
        </p>

        {/* Highlight Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#f3ede4]">
          <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
            <div className="text-[11px] uppercase font-bold text-[#707974] flex items-center gap-1">
              <LucideIcon name="payments" className="text-[16px] text-[#c2410c]" />
              <span>{lang === 'MR' ? 'थेट लाभ / अनुदान' : 'Direct Benefit / Subsidy'}</span>
            </div>
            <div className="font-heading font-extrabold text-[17px] text-[#166534] mt-1">
              {scheme.benefits.split('.')[0] || (lang === 'MR' ? '१००% थेट डीबीटी' : '100% Direct DBT')}
            </div>
          </div>

          <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
            <div className="text-[11px] uppercase font-bold text-[#707974] flex items-center gap-1">
              <LucideIcon name="verified" className="text-[16px] text-[#002873]" />
              <span>{lang === 'MR' ? 'अर्ज शुल्क' : 'Application Fee'}</span>
            </div>
            <div className="font-heading font-extrabold text-[17px] text-[#002873] mt-1">
              {lang === 'MR' ? '₹० मोफत (शून्य शुल्क)' : '₹0 Free (Zero Fee)'}
            </div>
          </div>

          <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
            <div className="text-[11px] uppercase font-bold text-[#707974] flex items-center gap-1">
              <LucideIcon name="how_to_reg" className="text-[16px] text-[#376757]" />
              <span>{lang === 'MR' ? 'नोंदणी व मदत कक्ष' : 'Approval Desk'}</span>
            </div>
            <div className="font-heading font-extrabold text-[16px] text-[#376757] mt-1">
              {lang === 'MR' ? 'आसगाव सीएससी केंद्र' : 'Asgaon CSC Desk'}
            </div>
          </div>

          <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
            <div className="text-[11px] uppercase font-bold text-[#707974] flex items-center gap-1">
              <LucideIcon name="timer" className="text-[16px] text-[#c2410c]" />
              <span>{lang === 'MR' ? 'वितरण पद्धत' : 'Disbursement Mode'}</span>
            </div>
            <div className="font-heading font-extrabold text-[16px] text-[#c2410c] mt-1">
              {lang === 'MR' ? 'थेट बँक खात्यात' : 'Aadhaar DBT to Bank'}
            </div>
          </div>
        </div>
      </header>

      {/* 4. Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Deep Details (2 cols wide) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Eligibility Section */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[18px] text-[#166534] flex items-center gap-2 mb-3">
              <LucideIcon name="checklist_rtl" className="text-[#376757]" />
              <span>{lang === 'MR' ? 'सविस्तर पात्रता निकष' : 'Eligibility Criteria'}</span>
            </h2>
            <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9] text-[13px] text-[#1d1b16] leading-relaxed mb-4 font-medium">
              {scheme.eligibility}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
              <div className="bg-[#f3ede4] p-3 rounded-xl border border-[#e8e2d9]">
                <strong className="text-[#166534] block mb-1">
                  {lang === 'MR' ? 'पात्र लाभार्थी:' : 'Eligible Categories:'}
                </strong>
                <p className="text-[#404945]">
                  {isGharkul
                    ? (lang === 'MR' ? 'घर नसलेले कुटुंब, कच्च्या घराचे रहिवासी, गावात मंजूर नमुना ८-अ असलेले नागरिक.' : 'Houseless families, Kutcha/mud hut dwellers, Rural residents with approved village 8A extract.')
                    : (lang === 'MR' ? 'ग्रामीण रहिवासी, शेतकरी, विद्यार्थी किंवा उत्पन्न मर्यादा पूर्ण करणाऱ्या महिला.' : 'Rural residents, cultivators, students, or women meeting official income criteria.')}
                </p>
              </div>
              <div className="bg-[#f3ede4] p-3 rounded-xl border border-[#e8e2d9]">
                <strong className="text-[#ba1a1a] block mb-1">
                  {lang === 'MR' ? 'अपात्र निकष:' : 'Ineligible:'}
                </strong>
                <p className="text-[#404945]">
                  {lang === 'MR'
                    ? 'शासकीय नोकरदार, आयकर भरणारे किंवा स्वतःच्या मालकीचे पक्के सिमेंट घर असलेले कुटुंब.'
                    : 'Government salaried employees, income tax payees, or families already owning concrete pukka houses.'}
                </p>
              </div>
            </div>
          </section>

          {/* Mandatory Documents Checklist */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[18px] text-[#166534] flex items-center gap-2 mb-3">
              <LucideIcon name="task_alt" className="text-[#002873]" />
              <span>{lang === 'MR' ? 'आवश्यक कागदपत्रांची यादी' : 'Mandatory Documents Checklist'}</span>
            </h2>
            <p className="text-[12px] text-[#707974] mb-4">
              {lang === 'MR'
                ? 'कृपया मूळ प्रत व स्वसाक्षांकित झेरॉक्स प्रती आसगाव सीएससी डेस्क किंवा संबंधित कार्यालयात घेऊन जा:'
                : 'Please carry both original and self-attested photocopies to the Asgaon CSC desk:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Array.isArray(scheme.documentsRequired) ? scheme.documentsRequired : []).map(
                (doc: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9] flex items-start gap-2 text-[13px]"
                  >
                    <LucideIcon name="check_circle" className=" text-[18px] text-[#376757] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#1d1b16]">{doc}</div>
                      <div className="text-[11px] text-[#707974] mt-0.5">
                        {lang === 'MR' ? 'मूळ प्रत व १ झेरॉक्स आवश्यक' : 'Original & 1 Xerox copy required'}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* How to Apply: Step-by-Step Roadmap */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[18px] text-[#166534] flex items-center gap-2 mb-4">
              <LucideIcon name="route" className="text-[#c2410c]" />
              <span>{lang === 'MR' ? 'अर्ज करण्याची सोपी पद्धत' : 'Step-by-Step Application Guide'}</span>
            </h2>

            <div className="space-y-4">
              {applicationSteps.map((st) => (
                <div key={st.step} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-[13px] shrink-0">
                    {st.step}
                  </div>
                  <div className="flex-1 bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                    <h3 className="font-bold text-[14px] text-[#166534] mb-1">{st.title}</h3>
                    <p className="text-[12px] text-[#404945] leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Scheme Specific FAQs */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[18px] text-[#166534] flex items-center gap-2 mb-4">
              <LucideIcon name="help_outline" className="text-[#002873]" />
              <span>{lang === 'MR' ? 'वारंवार विचारले जाणारे प्रश्न' : 'Frequently Asked Questions (FAQ)'}</span>
            </h2>

            <div className="space-y-3 text-[13px]">
              {schemeFaqs.map((faq, idx) => (
                <details key={idx} className="group bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                  <summary className="font-bold text-[#166534] cursor-pointer flex items-center justify-between list-none">
                    <span>{faq.q}</span>
                    <LucideIcon name="expand_more" className=" text-[20px] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-[#404945] leading-relaxed pt-2 border-t border-[#e8e2d9]/60">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Related Schemes Carousel/Grid */}
          {relatedSchemes.length > 0 && (
            <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
              <h2 className="font-heading font-extrabold text-[17px] text-[#166534] mb-3">
                {lang === 'MR' ? `इतर संबंधित ${scheme.category} योजना` : `Related ${scheme.category} Schemes`}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedSchemes.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => {
                      onSelectScheme(rel.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-xl bg-white card-hover-subtle hover:bg-stone-50 border border-[#e8e2d9] text-left transition-colors flex flex-col justify-between shadow-xs cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
                        {rel.category}
                      </span>
                      <h3 className="font-heading font-bold text-[13px] text-[#1d1b16] mt-2 line-clamp-2">
                        {rel.title}
                      </h3>
                    </div>
                    <div className="mt-3 text-[11px] font-bold text-[#c2410c] flex items-center gap-1">
                      <span>{lang === 'MR' ? 'तपशील पहा' : 'View Details'}</span>
                      <LucideIcon name="arrow_forward" className="text-[13px]" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar: Quick Actions & Helpdesk (1 col wide) */}
        <aside className="flex flex-col gap-5">
          {/* Action Box */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-3">
            <h3 className="font-heading font-extrabold text-[16px] text-[#166534]">
              {lang === 'MR' ? 'या योजनेसाठी अर्ज करा' : 'Apply for this Scheme'}
            </h3>
            <p className="text-[12px] text-[#707974] leading-relaxed">
              {lang === 'MR'
                ? 'अधिकृत महाराष्ट्र शासन / केंद्र शासन पोर्टल लिंक (आधार डीबीटी संलग्न):'
                : 'Official Maharashtra State / Central portal link with verified Aadhaar DBT integration:'}
            </p>

            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#002873] hover:bg-[#00174b] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span>{scheme.actionLabel || (lang === 'MR' ? 'अधिकृत पोर्टलवर अर्ज करा' : 'Apply on Official Portal')}</span>
              <LucideIcon name="open_in_new" className="text-[16px]" />
            </a>

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <LucideIcon name="share" className="text-[16px]" />
              <span>{lang === 'MR' ? 'व्हाट्सॲपवर शेअर करा' : 'Share on WhatsApp'}</span>
            </button>
          </div>

          {/* Asgaon Physical Helpdesk Desk */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
              {lang === 'MR' ? 'नागरिक मदत कक्ष' : 'PHYSICAL ASSISTANCE DESK'}
            </span>

            <h3 className="font-heading font-extrabold text-[16px] text-[#166534] mt-2 mb-1">
              {lang === 'MR' ? 'आसगाव सीएससी डिजिटल सेवा केंद्र' : 'Asgaon CSC Digital Seva Kendra'}
            </h3>
            <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
              {lang === 'MR'
                ? '८-अ / ७/१२ उतारा स्कॅनिंग, बायोमेट्रिक ई-केवायसी आणि ऑनलाइन फॉर्म भरण्यासाठी मदत केंद्र.'
                : 'Get assistance with scanning 8A / 7/12 land records, biometric e-KYC, and online form submission.'}
            </p>

            <div className="space-y-1 text-[12px] text-[#707974] mb-3">
              <div>{lang === 'MR' ? 'ऑपरेटर:' : 'VLE Operator:'} <strong className="text-[#1d1b16]">Ramesh Shinde</strong></div>
              <div>{lang === 'MR' ? 'स्थान:' : 'Office:'} <strong className="text-[#1d1b16]">{lang === 'MR' ? 'वॉर्ड क्र. २, आसगाव' : 'Ward No. 2, Asgaon'}</strong></div>
              <div>{lang === 'MR' ? 'वेळ:' : 'Timing:'} <strong className="text-[#1d1b16]">{lang === 'MR' ? '८:३० सकाळी - ६:३० संध्याकाळी' : '8:30 AM - 6:30 PM'}</strong></div>
            </div>

            <a
              href="tel:9822104500"
              className="w-full py-2.5 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold flex items-center justify-center gap-1 mb-2 transition-colors"
            >
              <LucideIcon name="call" className="text-[15px]" />
              <span>{lang === 'MR' ? 'ऑपरेटरशी संपर्क' : 'Call Operator'}</span>
            </a>
          </div>

          {/* Zero Bribery & Anti Corruption */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center gap-1.5 text-[#ba1a1a] font-bold text-[13px] mb-1">
              <LucideIcon name="verified_user" className="text-[18px]" />
              <span>{lang === 'MR' ? 'शून्य दलाली हमी' : 'Zero Middlemen Guarantee'}</span>
            </div>
            <p className="text-[12px] text-[#404945] leading-relaxed mb-2">
              {lang === 'MR'
                ? 'शासकीय योजनांचे अर्ज १००% मोफत आहेत. कोणत्याही व्यक्तीला लाच देऊ नका.'
                : 'Government schemes in Asgaon are 100% free of charge. If anyone demands a cut, report immediately.'}
            </p>
            <div className="text-[12px] font-bold text-[#ba1a1a]">
              {lang === 'MR' ? 'लाचलुचपत प्रतिबंधक हेल्पलाईन: १०६४' : 'ACB Anti-Corruption Helpline: Toll-Free 1064'}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
