import { LucideIcon } from '../components/LucideIcon';
import React, { useMemo, useState, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEOHead } from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';
import {
  type SchoolItem,
  type TutorCenterItem,
  type AbhyasikaConfig
} from '../data/shikshaData';

import { api } from '../services/api';

interface ShikshaDetailPageProps {
  slug: string;
  onNavigateBack: () => void;
  onSelectShiksha: (slug: string) => void;
  onNavigateHome: () => void;
  schools?: SchoolItem[];
}

export const ShikshaDetailPage: React.FC<ShikshaDetailPageProps> = ({
  slug,
  onNavigateBack,
  onSelectShiksha,
  onNavigateHome,
  schools: propSchools
}) => {
  const { lang, t } = useLanguage();
  const [bookingDeskOpen, setBookingDeskOpen] = useState(false);
  const [deskName, setDeskName] = useState('');
  const [deskPhone, setDeskPhone] = useState('');
  const [deskSlot, setDeskSlot] = useState(lang === 'MR' ? 'संपूर्ण दिवस (सकाळी ८:०० - रात्री १०:००)' : 'Full Day (8:00 AM - 10:00 PM)');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Loading & Dynamic states
  const [isLoading, setIsLoading] = useState(true);
  const [schoolsList, setSchoolsList] = useState<SchoolItem[]>(() => {
    if (propSchools && propSchools.length > 0) return propSchools;
    try {
      const saved = localStorage.getItem('dg_shiksha_schools');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  const [abhyasikaEntity, setAbhyasikaEntity] = useState<AbhyasikaConfig | null>(() => {
    try {
      const saved = localStorage.getItem('dg_shiksha_abhyasika');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [tutorsList, setTutorsList] = useState<TutorCenterItem[]>(() => {
    try {
      const saved = localStorage.getItem('dg_shiksha_tutors');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const parseTags = (raw: any): string[] => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.trim().length > 0) {
      return raw.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
    return [];
  };

  useEffect(() => {
    let isMounted = true;
    const cleanSlug = (slug || '').trim().toLowerCase();
    setIsLoading(true);

    // If it's abhyasika, fetch LIBRARY study-center from DB
    if (cleanSlug === 'abhyasika' || cleanSlug.includes('study-hall') || cleanSlug.includes('library')) {
      api.getStudyCenters('LIBRARY')
        .then((res: any) => {
          if (!isMounted) return;
          const list = Array.isArray(res) ? res : (res?.data || []);
          const lib = list && list.length > 0 ? list[0] : null;
          if (lib) {
            const mappedAbhy: AbhyasikaConfig = {
              title: lib.name,
              totalDesks: lib.totalDesks || 40,
              availableDesks: lib.availableDesks || 15,
              timings: lib.timing || '06:00 AM – 11:00 PM',
              caretakerName: lib.caretakerName || '',
              caretakerRole: lib.caretakerRole || '',
              wifiSpeed: lib.wifiSpeed || '100 Mbps BSNL Optical Fiber',
              bookCount: lib.bookCount || '3,200+ Books & Journals',
              noticeText: lib.noticeText || '',
            };
            setAbhyasikaEntity(mappedAbhy);
            localStorage.setItem('dg_shiksha_abhyasika', JSON.stringify(mappedAbhy));
          }
          setIsLoading(false);
        })
        .catch(() => {
          if (isMounted) setIsLoading(false);
        });
      return;
    }

    // Always fetch study centers from DB to support tutors & abhyasika
    api.getStudyCenters()
      .then((res: any) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : (res?.data || []);
        if (Array.isArray(list) && list.length > 0) {
          const tuts = list.filter((c: any) => c.type === 'TUTOR');
          if (tuts.length > 0) {
            const mappedTutors: TutorCenterItem[] = tuts.map((t: any) => ({
              id: t.id,
              name: t.name,
              category: t.category,
              subjects: t.subjects,
              timing: t.timing,
              phone: t.phone,
              address: t.address,
              feesInfo: t.feesInfo,
            }));
            setTutorsList(mappedTutors);
            localStorage.setItem('dg_shiksha_tutors', JSON.stringify(mappedTutors));
          }
          const lib = list.find((c: any) => c.type === 'LIBRARY');
          if (lib) {
            const mappedAbhy: AbhyasikaConfig = {
              title: lib.name,
              totalDesks: lib.totalDesks || 40,
              availableDesks: lib.availableDesks || 15,
              timings: lib.timing || '06:00 AM – 11:00 PM',
              caretakerName: lib.caretakerName || '',
              caretakerRole: lib.caretakerRole || '',
              wifiSpeed: lib.wifiSpeed || '100 Mbps BSNL Optical Fiber',
              bookCount: lib.bookCount || '3,200+ Books & Journals',
              noticeText: lib.noticeText || '',
            };
            setAbhyasikaEntity(mappedAbhy);
            localStorage.setItem('dg_shiksha_abhyasika', JSON.stringify(mappedAbhy));
          }
        }
      })
      .catch(() => {});

    // If passed via props and found
    if (propSchools && propSchools.length > 0) {
      setSchoolsList(propSchools);
      setIsLoading(false);
      return;
    }

    // Fetch school directly by ID/slug first
    api.getSchoolById(slug)
      .then((res: any) => {
        const item = res?.data || res;
        if (isMounted && item && (item.id || item.name)) {
          const mapped: SchoolItem = {
            id: item.id,
            name: item.name,
            badge: item.badge || '',
            category: item.category || 'School',
            grades: item.grades || '',
            medium: item.medium || '',
            description: item.description || '',
            tags: parseTags(item.tags),
            principalName: item.principalName || '',
            contactPhone: item.contactPhone || '',
            address: item.address || '',
            imageUrl: item.imageUrl || '',
            latitude: item.latitude,
            longitude: item.longitude,
          };
          setSchoolsList(prev => {
            const others = prev.filter(s => s.id !== mapped.id);
            return [mapped, ...others];
          });
          setIsLoading(false);
          return;
        }
        // Fallback: fetch all schools to find by slug or name
        return api.getSchools().then((allRes: any) => {
          if (!isMounted) return;
          const list = Array.isArray(allRes) ? allRes : (allRes?.data || []);
          if (Array.isArray(list) && list.length > 0) {
            const mappedAll: SchoolItem[] = list.map((s: any) => ({
              id: s.id,
              name: s.name,
              badge: s.badge || '',
              category: s.category || 'School',
              grades: s.grades || '',
              medium: s.medium || '',
              description: s.description || '',
              tags: parseTags(s.tags),
              principalName: s.principalName || '',
              contactPhone: s.contactPhone || '',
              address: s.address || '',
              imageUrl: s.imageUrl || '',
              latitude: s.latitude,
              longitude: s.longitude,
            }));
            setSchoolsList(mappedAll);
            localStorage.setItem('dg_shiksha_schools', JSON.stringify(mappedAll));
          }
          setIsLoading(false);
        });
      })
      .catch(() => {
        // Fallback: fetch all schools
        api.getSchools().then((allRes: any) => {
          if (!isMounted) return;
          const list = Array.isArray(allRes) ? allRes : (allRes?.data || []);
          if (Array.isArray(list) && list.length > 0) {
            const mappedAll: SchoolItem[] = list.map((s: any) => ({
              id: s.id,
              name: s.name,
              badge: s.badge || '',
              category: s.category || 'School',
              grades: s.grades || '',
              medium: s.medium || '',
              description: s.description || '',
              tags: parseTags(s.tags),
              principalName: s.principalName || '',
              contactPhone: s.contactPhone || '',
              address: s.address || '',
              imageUrl: s.imageUrl || '',
              latitude: s.latitude,
              longitude: s.longitude,
            }));
            setSchoolsList(mappedAll);
            localStorage.setItem('dg_shiksha_schools', JSON.stringify(mappedAll));
          }
          setIsLoading(false);
        }).catch(() => {
          if (isMounted) setIsLoading(false);
        });
      });

    return () => {
      isMounted = false;
    };
  }, [slug, propSchools]);

  // Match school, abhyasika, or tutor center
  const matchedEntity = useMemo(() => {
    const cleanSlug = (slug || '').trim().toLowerCase();

    // 1. Check schools from dynamic database list
    const school = schoolsList.find(
      (s) =>
        s.id === slug ||
        s.id.toLowerCase() === cleanSlug ||
        s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug ||
        cleanSlug.includes(s.id.toLowerCase()) ||
        s.id.toLowerCase().includes(cleanSlug)
    );
    if (school) return { type: 'school' as const, data: school };

    // 2. Check abhyasika from DB
    if (cleanSlug === 'abhyasika' || cleanSlug.includes('study-hall') || cleanSlug.includes('abhyasika') || cleanSlug.includes('library')) {
      if (abhyasikaEntity && abhyasikaEntity.title) {
        return { type: 'abhyasika' as const, data: abhyasikaEntity };
      }
    }

    // 3. Check tutors from DB
    const tutor = tutorsList.find(
      (t) =>
        t.id === slug ||
        t.id.toLowerCase() === cleanSlug ||
        t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug ||
        cleanSlug.includes(t.id.toLowerCase())
    );
    if (tutor) return { type: 'tutor' as const, data: tutor };

    return null;
  }, [slug, schoolsList, abhyasikaEntity, tutorsList]);

  // Loading state skeleton
  if (isLoading && (!matchedEntity || !matchedEntity.data)) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="w-48 h-5 bg-stone-200 rounded" />

        {/* Hero banner skeleton */}
        <div className="h-64 sm:h-80 w-full bg-stone-200 rounded-3xl" />

        {/* Header and badge skeleton */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="w-32 h-6 bg-stone-200 rounded-full" />
            <div className="w-24 h-6 bg-stone-100 rounded-full" />
          </div>
          <div className="w-3/4 sm:w-1/2 h-8 bg-stone-200 rounded" />
          <div className="w-full sm:w-2/3 h-4 bg-stone-100 rounded" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#f3ede4]">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-16 bg-stone-100 rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Details section skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#e8e2d9] space-y-4">
            <div className="w-40 h-6 bg-stone-200 rounded" />
            <div className="w-full h-24 bg-stone-100 rounded-xl" />
            <div className="w-full h-32 bg-stone-100 rounded-xl" />
          </div>
          <div className="bg-white rounded-3xl p-6 border border-[#e8e2d9] space-y-4">
            <div className="w-32 h-6 bg-stone-200 rounded" />
            <div className="w-full h-20 bg-stone-100 rounded-xl" />
            <div className="w-full h-12 bg-stone-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!matchedEntity || !matchedEntity.data) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-[#e8e2d9] shadow-xs my-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
          <LucideIcon name="school" className="text-3xl" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-stone-900 mb-2">
          {lang === 'MR' ? 'शाळा किंवा संस्था आढळली नाही' : 'School or Campus Not Found'}
        </h2>
        <p className="text-sm text-stone-600 max-w-md mb-6">
          {lang === 'MR'
            ? 'तुम्ही शोधत असलेली शाळा किंवा अभ्यासिका उपलब्ध नाही किंवा काढून टाकण्यात आली आहे.'
            : 'The school, college, or study center you are looking for is not listed or has been moved.'}
        </p>
        <button
          onClick={onNavigateBack}
          className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer flex items-center gap-2"
        >
          <LucideIcon name="arrow_back" className="text-base" />
          <span>{lang === 'MR' ? 'शिक्षण दालनावर परत जा' : 'Back to Education Portal'}</span>
        </button>
      </div>
    );
  }

  const { type, data } = matchedEntity;

  // Metadata per type
  const title =
    type === 'school'
      ? (data as SchoolItem).name
      : type === 'abhyasika'
      ? (data as AbhyasikaConfig).title
      : (data as TutorCenterItem).name;

  const category =
    type === 'school'
      ? (data as SchoolItem).category
      : type === 'abhyasika'
      ? 'Study Hall & Library'
      : (data as TutorCenterItem).category;

  const pageUrl = `${window.location.origin}/shiksha/${slug}`;
  const seoTitle = `${title} — प्रवेश, अभ्यासक्रम व माहिती | Asgaon Shiksha Portal`;
  const seoDescription = `${title} in Asgaon, Pauni: ${
    type === 'school'
      ? (data as SchoolItem).description
      : type === 'abhyasika'
      ? 'Village competitive exam study hall with free desks, WiFi, and UPSC/MPSC books.'
      : (data as TutorCenterItem).subjects
  }. Contact and admission guide.`;

  // Schema.org structured data
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
            name: 'Education & Shiksha',
            item: `${window.location.origin}/shiksha`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: pageUrl
          }
        ]
      },
      {
        '@type': type === 'abhyasika' ? 'Library' : 'EducationalOrganization',
        name: title,
        description: seoDescription,
        address: {
          '@type': 'PostalAddress',
          streetAddress: type === 'school' ? (data as SchoolItem).address : 'Gaothan, Asgaon',
          addressLocality: 'Asgaon, Pauni',
          addressRegion: 'Maharashtra',
          postalCode: '441910',
          addressCountry: 'IN'
        },
        url: pageUrl
      }
    ]
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*${title}* (${category})\n${seoDescription}\n\nसविस्तर माहिती व प्रवेश मार्गदर्शनासाठी लिंक पहा:\n${pageUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleBookDesk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deskName || !deskPhone) {
      alert('Please enter your name and phone number');
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingDeskOpen(false);
      setDeskName('');
      setDeskPhone('');
      alert(lang === 'MR' ? `अभ्यासिका डेस्क यशस्वीरीत्या आरक्षित झाला! पुष्टी क्रमांक #ASG-DESK-${Math.floor(100 + Math.random() * 900)} ${deskPhone} क्रमांकावर पाठवला आहे.` : `Study desk reserved successfully! Confirmation #ASG-DESK-${Math.floor(100 + Math.random() * 900)} sent to ${deskPhone}.`);
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* 1. SEO Head */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={`${title}, ${category}, Asgaon schools, Pauni, Bhandara, शाळा, कनिष्ठ महाविद्यालय, अभ्यासिका, प्रवेश, शिष्यवृत्ती`}
        canonicalUrl={pageUrl}
        ogType="article"
        structuredData={structuredData}
      />

      {/* 2. Breadcrumbs & Return Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: t('nav_home'), onClick: onNavigateHome },
            { label: t('nav_education'), onClick: onNavigateBack },
            { label: title, active: true }
          ]}
        />

        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-[#1d1b16] text-[12px] font-bold transition-colors border border-[#e8e2d9] shadow-xs cursor-pointer"
        >
          <LucideIcon name="arrow_back" className="text-[16px]" />
          <span>{lang === 'MR' ? 'शिक्षण पोर्टलवर परत जा' : 'Back to Shiksha Portal'}</span>
        </button>
      </div>

      {/* 3. Hero Header Banner */}
      <header className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#dbe1ff] text-[#002873]">
              {category}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]">
              {lang === 'MR' ? 'जि.प. व शासकीय मान्यताप्राप्त' : 'ZP & Govt Accredited'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white text-[12px] font-bold transition-colors shadow-xs"
            >
              <LucideIcon name="share" className="text-[16px]" />
              <span>{lang === 'MR' ? 'व्हॉट्सअ‍ॅप शेअर' : 'WhatsApp Share'}</span>
            </button>
          </div>
        </div>

        <h1 className="font-heading font-extrabold text-[24px] sm:text-[32px] text-[#166534] leading-tight mb-2">
          {title}
        </h1>

        <div className="flex items-center gap-2 text-[14px] text-[#707974] mb-4">
          <LucideIcon name="location_on" className="text-[18px] text-[#c2410c]" />
          <span>
            {type === 'school'
              ? (data as SchoolItem).address
              : type === 'abhyasika'
              ? (lang === 'MR' ? 'स्थानिक समाज मंदिर परिसर, आसगाव' : 'Community Hall Campus, Asgaon')
              : (data as TutorCenterItem).address}
          </span>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#f3ede4]">
          {type === 'school' ? (
            <>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'इयत्ता व वर्ग' : 'Grades & Classes'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#166534] mt-1">
                  {(data as SchoolItem).grades}
                </div>
              </div>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'शिक्षणाचे माध्यम' : 'Medium of Instruction'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#166534] mt-1">
                  {(data as SchoolItem).medium}
                </div>
              </div>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'संस्था प्रमुख / मुख्याध्यापक' : 'Head of Institution'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#002873] mt-1">
                  {(data as SchoolItem).principalName}
                </div>
              </div>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'संपर्क दूरध्वनी' : 'Contact Telephone'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#c2410c] mt-1">
                  +91 {(data as SchoolItem).contactPhone}
                </div>
              </div>
            </>
          ) : type === 'abhyasika' ? (
            <>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'एकूण अभ्यासिका जागा' : 'Total Study Desks'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#166534] mt-1">
                  {(data as AbhyasikaConfig).totalDesks} {lang === 'MR' ? 'जागा' : 'Study Desks'}
                </div>
              </div>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'उपलब्ध जागा' : 'Available Desks'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#376757] mt-1">
                  {(data as AbhyasikaConfig).availableDesks} {lang === 'MR' ? 'जागा रिक्त' : 'Desks Vacant'}
                </div>
              </div>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'अभ्यासिका वेळ' : 'Study Timings'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#002873] mt-1">
                  {(data as AbhyasikaConfig).timings}
                </div>
              </div>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'हाय-स्पीड वायफाय' : 'High-Speed WiFi'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#c2410c] mt-1">
                  {(data as AbhyasikaConfig).wifiSpeed} Fiber
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'शिकवले जाणारे विषय' : 'Subjects Taught'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#166534] mt-1">
                  {(data as TutorCenterItem).subjects}
                </div>
              </div>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'बॅच वेळ' : 'Batches Timing'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#166534] mt-1">
                  {(data as TutorCenterItem).timing}
                </div>
              </div>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'शुल्क रचना' : 'Course Fee Structure'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#376757] mt-1">
                  {(data as TutorCenterItem).feesInfo}
                </div>
              </div>
              <div className="bg-[#f9f3ea] card-hover-subtle p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {lang === 'MR' ? 'संचालक संपर्क' : 'Director Phone'}
                </div>
                <div className="font-heading font-extrabold text-[16px] text-[#c2410c] mt-1">
                  +91 {(data as TutorCenterItem).phone}
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* 4. Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details (2 cols wide) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Overview & Description */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[18px] text-[#166534] mb-3 flex items-center gap-2">
              <LucideIcon name="school" className="text-[#376757]" />
              <span>{lang === 'MR' ? 'शाळा व अभ्यासक्रम माहिती' : 'Overview & Programs'}</span>
            </h2>
            <p className="text-[14px] text-[#404945] leading-relaxed">
              {type === 'school'
                ? (data as SchoolItem).description
                : type === 'abhyasika'
                ? (data as AbhyasikaConfig).noticeText
                : (lang === 'MR'
                  ? 'आसगाव परिसरातील विद्यार्थ्यांसाठी स्पर्धा परीक्षा, बोर्ड परीक्षा व शैक्षणिक प्रगतीसाठी मार्गदर्शन केंद्र.'
                  : 'Local coaching and academic foundation center in Asgaon helping rural youth achieve top marks in board exams and competitive recruitment.')}
            </p>

            {/* Key Tags / Features */}
            {type === 'school' && (
              <div className="mt-5 pt-5 border-t border-[#f3ede4]">
                <h3 className="font-bold text-[13px] text-[#166534] mb-2">
                  {lang === 'MR' ? 'प्रमुख वैशिष्ट्ये व सुविधा:' : 'Key Highlights & Facilities:'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
                  {((data as SchoolItem).tags || []).map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#f9f3ea] p-2.5 rounded-xl border border-[#e8e2d9]">
                      <LucideIcon name="check_circle" className="text-[16px] text-[#376757]" />
                      <span className="text-[#1d1b16] font-medium">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {type === 'abhyasika' && (
              <div className="mt-5 pt-5 border-t border-[#f3ede4]">
                <h3 className="font-bold text-[13px] text-[#166534] mb-3">
                  {lang === 'MR' ? 'अभ्यासिका सुविधा:' : 'Study Hall Amenities:'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] flex items-center gap-2">
                    <LucideIcon name="wifi" className="text-[18px] text-[#002873]" />
                    <div>
                      <div className="font-bold">{lang === 'MR' ? 'मोफत हाय-स्पीड वायफाय' : 'Free High-Speed WiFi'}</div>
                      <div className="text-[11px] text-[#707974]">{(data as AbhyasikaConfig).wifiSpeed} {lang === 'MR' ? 'ऑनलाइन लेक्चरसाठी' : 'for online lectures'}</div>
                    </div>
                  </div>
                  <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] flex items-center gap-2">
                    <LucideIcon name="menu_book" className="text-[18px] text-[#c2410c]" />
                    <div>
                      <div className="font-bold">{lang === 'MR' ? 'संदर्भ ग्रंथालय' : 'Reference Library'}</div>
                      <div className="text-[11px] text-[#707974]">{(data as AbhyasikaConfig).bookCount} {lang === 'MR' ? 'MPSC/पोलीस भरती पुस्तके' : 'MPSC/UPSC/Police Bharti books'}</div>
                    </div>
                  </div>
                  <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] flex items-center gap-2">
                    <LucideIcon name="power" className="text-[18px] text-[#376757]" />
                    <div>
                      <div className="font-bold">{lang === 'MR' ? 'अखंड वीज पुरवठा व इन्व्हर्टर' : 'Inverter & Power Backup'}</div>
                      <div className="text-[11px] text-[#707974]">{lang === 'MR' ? 'प्रत्येक डेस्कला चार्जिंग सॉकेट' : '24x7 power with charging sockets'}</div>
                    </div>
                  </div>
                  <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] flex items-center gap-2">
                    <LucideIcon name="water_drop" className="text-[18px] text-[#166534]" />
                    <div>
                      <div className="font-bold">{lang === 'MR' ? 'आरओ शुद्ध पेयजल' : 'RO Filtered Drinking Water'}</div>
                      <div className="text-[11px] text-[#707974]">{lang === 'MR' ? 'स्वच्छ पाणी व स्वच्छतागृह' : 'Clean hygienic water & washrooms'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Admission & Enrolment Roadmap */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[18px] text-[#166534] mb-4 flex items-center gap-2">
              <LucideIcon name="how_to_reg" className="text-[#c2410c]" />
              <span>{lang === 'MR' ? 'प्रवेश व नावनोंदणी प्रक्रिया' : 'Admission & Registration Process'}</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <div className="w-7 h-7 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-[12px] shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-[#166534]">
                    {lang === 'MR' ? 'आवश्यक कागदपत्रे जमा करा' : 'Prepare Required Documents'}
                  </h3>
                  <p className="text-[12px] text-[#404945] mt-0.5">
                    {lang === 'MR'
                      ? 'मागील वर्षाचे गुणपत्रक, शाळा सोडल्याचा दाखला, आधार कार्ड, जातीचा दाखला व २ पासपोर्ट फोटो.'
                      : 'Previous marksheet, School Leaving Certificate (TC/LC), Aadhaar Card, caste certificate, and 2 passport photos.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <div className="w-7 h-7 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-[12px] shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-[#166534]">
                    {lang === 'MR' ? 'प्रवेश अर्ज सादर करा' : 'Submit Admission Form'}
                  </h3>
                  <p className="text-[12px] text-[#404945] mt-0.5">
                    {lang === 'MR'
                      ? 'कार्यालयात प्रत्यक्ष भेट देऊन किंवा ऑनलाइन प्रवेश प्रक्रियेद्वारे कागदपत्र पडताळणी करून घ्या.'
                      : 'Visit the school campus office or submit documentation for verification.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <div className="w-7 h-7 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-[12px] shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-[#166534]">
                    {lang === 'MR' ? 'शासकीय सवलती व शिष्यवृत्ती अर्ज' : 'Scholarships & Fee Concessions'}
                  </h3>
                  <p className="text-[12px] text-[#404945] mt-0.5">
                    {lang === 'MR'
                      ? 'MahaDBT पोर्टलवर १००% शासकीय फी माफी व सावित्रीबाई फुले शिष्यवृत्तीसाठी आसगाव CSC डेस्कवरून अर्ज करा.'
                      : 'Apply via MahaDBT portal for 100% government fee reimbursement and Savitribai Phule scholarship at Asgaon CSC.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Related Education Centers */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[17px] text-[#166534] mb-3">
              {lang === 'MR' ? 'आसगाव परिसरातील इतर शैक्षणिक संस्था' : 'Explore More Institutions in Asgaon'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {schoolsList.filter((s) => s.id !== (data as any).id).map((other) => (
                <button
                  key={other.id}
                  onClick={() => {
                    onSelectShiksha(other.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 rounded-xl bg-white card-hover-subtle hover:bg-stone-50 border border-[#e8e2d9] text-left transition-colors flex flex-col justify-between shadow-xs cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
                      {other.category}
                    </span>
                    <h3 className="font-heading font-bold text-[13px] text-[#1d1b16] mt-2 line-clamp-2">
                      {other.name}
                    </h3>
                  </div>
                  <div className="mt-3 text-[11px] font-bold text-[#c2410c] flex items-center gap-1">
                    <span>{lang === 'MR' ? 'माहिती पहा' : 'View Campus'}</span>
                    <LucideIcon name="arrow_forward" className="text-[13px]" />
                  </div>
                </button>
              ))}

              <button
                onClick={() => {
                  onSelectShiksha('abhyasika');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-3.5 rounded-xl bg-white card-hover-subtle hover:bg-stone-50 border border-[#e8e2d9] text-left transition-colors flex flex-col justify-between shadow-xs cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
                    {lang === 'MR' ? 'मोफत अभ्यासिका' : 'Free Study Hall'}
                  </span>
                  <h3 className="font-heading font-bold text-[13px] text-[#1d1b16] mt-2 line-clamp-2">
                    {lang === 'MR' ? 'डॉ. आंबेडकर अभ्यासिका (४० जागा)' : 'Dr. Ambedkar Abhyasika (40 Desks)'}
                  </h3>
                </div>
                <div className="mt-3 text-[11px] font-bold text-[#c2410c] flex items-center gap-1">
                  <span>{lang === 'MR' ? 'जागा आरक्षित करा' : 'Book Desk'}</span>
                  <LucideIcon name="arrow_forward" className="text-[13px]" />
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Contact & Actions (1 col wide) */}
        <aside className="flex flex-col gap-5">
          {/* Quick Action Box */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-3">
            <h3 className="font-heading font-extrabold text-[16px] text-[#166534]">
              {type === 'abhyasika'
                ? (lang === 'MR' ? 'मोफत अभ्यासिका जागा बुक करा' : 'Book Free Study Desk')
                : (lang === 'MR' ? 'प्रवेश विचारणा' : 'Admission Inquiry')}
            </h3>

            {type === 'abhyasika' ? (
              <>
                <p className="text-[12px] text-[#707974] leading-relaxed">
                  {lang === 'MR'
                    ? 'स्पर्धा परीक्षा तयारीसाठी हाय-स्पीड वायफाय व अखंड वीज पुरवठ्यासह शांत अभ्यासिका जागा आरक्षित करा.'
                    : 'Reserve a quiet, dedicated competitive exam study desk with high-speed WiFi and power socket. Zero fee.'}
                </p>
                <button
                  onClick={() => setBookingDeskOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <LucideIcon name="desk" className="text-[18px]" />
                  <span>{lang === 'MR' ? 'अभ्यासिका जागा आता बुक करा' : 'Book a Study Desk Now'}</span>
                </button>
              </>
            ) : (
              <>
                <p className="text-[12px] text-[#707974] leading-relaxed">
                  {lang === 'MR'
                    ? 'प्रवेश, अभ्यासक्रम, शुल्क रचना व हॉस्टेल मार्गदर्शनासाठी थेट संपर्क साधा:'
                    : 'Direct admission contact for academic counseling, fee structure, and hostel facilities:'}
                </p>
                <a
                  href={`tel:${type === 'school' ? (data as SchoolItem).contactPhone : (data as TutorCenterItem).phone}`}
                  className="w-full py-3 px-4 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <LucideIcon name="call" className="text-[18px]" />
                  <span>
                    {lang === 'MR' ? 'कार्यालयाशी संपर्क:' : 'Call Office:'} +91 {type === 'school' ? (data as SchoolItem).contactPhone : (data as TutorCenterItem).phone}
                  </span>
                </a>
              </>
            )}

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <LucideIcon name="share" className="text-[18px]" />
              <span>{lang === 'MR' ? 'व्हॉट्सअ‍ॅपवर शेअर करा' : 'Share on WhatsApp'}</span>
            </button>
          </div>

          {/* Location & Timings */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
              {lang === 'MR' ? 'परिसर माहिती' : 'CAMPUS DETAILS'}
            </span>

            <h3 className="font-heading font-extrabold text-[15px] text-[#166534] mt-2 mb-2">
              {lang === 'MR' ? 'वेळापत्रक व संपर्क अधिकारी' : 'Working Timings & In-Charge'}
            </h3>

            <div className="space-y-2 text-[12px] text-[#404945]">
              <div className="flex items-center gap-2">
                <LucideIcon name="schedule" className="text-[16px] text-[#166534]" />
                <span><strong>{lang === 'MR' ? 'वेळ:' : 'Timing:'}</strong> {lang === 'MR' ? 'सकाळी ८:०० ते संध्याकाळी ५:३० (सोम-शनि)' : '8:00 AM - 5:30 PM (Mon-Sat)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <LucideIcon name="person" className="text-[16px] text-[#166534]" />
                <span><strong>{lang === 'MR' ? 'प्रमुख:' : 'In-Charge:'}</strong> {type === 'school' ? (data as SchoolItem).principalName : (lang === 'MR' ? 'स्थानिक शिक्षण कक्ष समन्वयक' : 'Civic Education Desk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <LucideIcon name="location_on" className="text-[16px] text-[#166534]" />
                <span><strong>{lang === 'MR' ? 'पत्ता:' : 'Area:'}</strong> {lang === 'MR' ? 'गावठाण, वॉर्ड २, आसगाव (पिन ४४१९१०)' : 'Gaothan, Ward 2, Asgaon (PIN 441910)'}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Desk Booking Modal */}
      {bookingDeskOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-[18px] text-[#166534]">
                  {lang === 'MR' ? 'मोफत अभ्यासिका जागा बुक करा' : 'Book Free Study Desk'}
                </h3>
                <p className="text-[12px] text-[#707974]">
                  {lang === 'MR' ? 'डॉ. बाबासाहेब आंबेडकर अभ्यासिका, आसगाव' : 'Dr. Babasaheb Ambedkar Village Abhyasika, Asgaon'}
                </p>
              </div>
              <button
                onClick={() => setBookingDeskOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f3ede4] flex items-center justify-center text-[#1d1b16]"
              >
                <LucideIcon name="close" className="text-[18px]" />
              </button>
            </div>

            <form onSubmit={handleBookDesk} className="space-y-3 text-[13px]">
              <div>
                <label className="block font-bold text-[#1d1b16] mb-1">
                  {lang === 'MR' ? 'विद्यार्थ्याचे पूर्ण नाव' : 'Student Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={deskName}
                  onChange={(e) => setDeskName(e.target.value)}
                  placeholder={lang === 'MR' ? 'विद्यार्थ्याचे नाव प्रविष्ट करा' : 'Enter student full name'}
                  className="w-full px-3 py-2 bg-[#f9f3ea] border border-[#e8e2d9] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#166534]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d1b16] mb-1">
                  {lang === 'MR' ? 'व्हॉट्सअ‍ॅप / मोबाईल नंबर' : 'WhatsApp / Phone Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={deskPhone}
                  onChange={(e) => setDeskPhone(e.target.value)}
                  placeholder={lang === 'MR' ? '१०-अंकी मोबाईल नंबर' : '10-digit mobile number'}
                  className="w-full px-3 py-2 bg-[#f9f3ea] border border-[#e8e2d9] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#166534]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d1b16] mb-1">
                  {lang === 'MR' ? 'अभ्यासिका वेळ' : 'Preferred Time Slot'}
                </label>
                <select
                  value={deskSlot}
                  onChange={(e) => setDeskSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f9f3ea] border border-[#e8e2d9] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#166534]"
                >
                  <option>{lang === 'MR' ? 'संपूर्ण दिवस (सकाळी ८:०० - रात्री १०:००)' : 'Full Day (8:00 AM - 10:00 PM)'}</option>
                  <option>{lang === 'MR' ? 'सकाळ सत्र (सकाळी ८:०० - दुपारी २:००)' : 'Morning Slot (8:00 AM - 2:00 PM)'}</option>
                  <option>{lang === 'MR' ? 'दुपार/संध्याकाळ सत्र (दुपारी २:०० - रात्री १०:००)' : 'Evening Slot (2:00 PM - 10:00 PM)'}</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookingDeskOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#f3ede4] font-bold text-[12px]"
                >
                  {lang === 'MR' ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={bookingSuccess}
                  className="px-4 py-2 rounded-xl bg-[#166534] text-white font-bold text-[12px] flex items-center gap-1"
                >
                  <span>{bookingSuccess ? (lang === 'MR' ? 'नोंदणी करत आहे...' : 'Booking...') : (lang === 'MR' ? 'जागा आरक्षित करा' : 'Confirm Desk Booking')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
