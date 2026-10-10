import React, { useMemo, useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEOHead } from '../components/SEOHead';
import {
  DEFAULT_SCHOOLS,
  DEFAULT_ABHYASIKA,
  DEFAULT_TUTORS,
  type SchoolItem,
  type TutorCenterItem,
  type AbhyasikaConfig
} from '../data/shikshaData';

interface ShikshaDetailPageProps {
  slug: string;
  onNavigateBack: () => void;
  onSelectShiksha: (slug: string) => void;
  onNavigateHome: () => void;
}

export const ShikshaDetailPage: React.FC<ShikshaDetailPageProps> = ({
  slug,
  onNavigateBack,
  onSelectShiksha,
  onNavigateHome
}) => {
  const [bookingDeskOpen, setBookingDeskOpen] = useState(false);
  const [deskName, setDeskName] = useState('');
  const [deskPhone, setDeskPhone] = useState('');
  const [deskSlot, setDeskSlot] = useState('Full Day (8:00 AM - 10:00 PM)');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Match school, abhyasika, or tutor center
  const matchedEntity = useMemo(() => {
    // 1. Check schools
    const school = DEFAULT_SCHOOLS.find(
      (s) =>
        s.id === slug ||
        s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug ||
        slug.includes(s.id)
    );
    if (school) return { type: 'school' as const, data: school };

    // 2. Check abhyasika
    if (slug === 'abhyasika' || slug.includes('study-hall') || slug.includes('abhyasika') || slug.includes('library')) {
      return { type: 'abhyasika' as const, data: DEFAULT_ABHYASIKA };
    }

    // 3. Check tutors
    const tutor = DEFAULT_TUTORS.find(
      (t) =>
        t.id === slug ||
        t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug ||
        slug.includes(t.id)
    );
    if (tutor) return { type: 'tutor' as const, data: tutor };

    // Fallback to primary ZP school
    return { type: 'school' as const, data: DEFAULT_SCHOOLS[0] };
  }, [slug]);

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
      alert(`Study desk reserved successfully! Token #ASG-DESK-${Math.floor(100 + Math.random() * 900)} sent to ${deskPhone}.`);
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
            { label: 'Home', onClick: onNavigateHome },
            { label: 'Shiksha & Education Portal', onClick: onNavigateBack },
            { label: title, active: true }
          ]}
        />

        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[12px] font-bold transition-colors border border-[#e8e2d9]"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Shiksha Portal</span>
        </button>
      </div>

      {/* 3. Hero Header Banner */}
      <header className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#dbe1ff] text-[#002873]">
              {category}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#baeed9] text-[#002117]">
              ZP &amp; Govt Accredited
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white text-[12px] font-bold transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>WhatsApp Share</span>
            </button>
          </div>
        </div>

        <h1 className="font-heading font-extrabold text-[24px] sm:text-[32px] text-[#003629] leading-tight mb-2">
          {title}
        </h1>

        <div className="flex items-center gap-2 text-[14px] text-[#707974] mb-4">
          <span className="material-symbols-outlined text-[18px] text-[#a63b00]">location_on</span>
          <span>
            {type === 'school'
              ? (data as SchoolItem).address
              : type === 'abhyasika'
              ? 'Gram Panchayat Samaj Mandir Hall, Asgaon'
              : (data as TutorCenterItem).address}
          </span>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#f3ede4]">
          {type === 'school' ? (
            <>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Grades &amp; Classes</div>
                <div className="font-heading font-extrabold text-[16px] text-[#003629] mt-1">
                  {(data as SchoolItem).grades}
                </div>
              </div>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Medium of Instruction</div>
                <div className="font-heading font-extrabold text-[16px] text-[#003629] mt-1">
                  {(data as SchoolItem).medium}
                </div>
              </div>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Head of Institution</div>
                <div className="font-heading font-extrabold text-[16px] text-[#002873] mt-1">
                  {(data as SchoolItem).principalName}
                </div>
              </div>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Contact Telephone</div>
                <div className="font-heading font-extrabold text-[16px] text-[#a63b00] mt-1">
                  +91 {(data as SchoolItem).contactPhone}
                </div>
              </div>
            </>
          ) : type === 'abhyasika' ? (
            <>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Total Study Desks</div>
                <div className="font-heading font-extrabold text-[16px] text-[#003629] mt-1">
                  {(data as AbhyasikaConfig).totalDesks} Study Desks
                </div>
              </div>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Available Desks</div>
                <div className="font-heading font-extrabold text-[16px] text-[#376757] mt-1">
                  {(data as AbhyasikaConfig).availableDesks} Desks Vacant
                </div>
              </div>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Study Timings</div>
                <div className="font-heading font-extrabold text-[16px] text-[#002873] mt-1">
                  {(data as AbhyasikaConfig).timings}
                </div>
              </div>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">High-Speed WiFi</div>
                <div className="font-heading font-extrabold text-[16px] text-[#a63b00] mt-1">
                  {(data as AbhyasikaConfig).wifiSpeed} Fiber
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Subjects Taught</div>
                <div className="font-heading font-extrabold text-[16px] text-[#003629] mt-1">
                  {(data as TutorCenterItem).subjects}
                </div>
              </div>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Batches Timing</div>
                <div className="font-heading font-extrabold text-[16px] text-[#003629] mt-1">
                  {(data as TutorCenterItem).timing}
                </div>
              </div>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Course Fee Structure</div>
                <div className="font-heading font-extrabold text-[16px] text-[#376757] mt-1">
                  {(data as TutorCenterItem).feesInfo}
                </div>
              </div>
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Director Phone</div>
                <div className="font-heading font-extrabold text-[16px] text-[#a63b00] mt-1">
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
            <h2 className="font-heading font-extrabold text-[18px] text-[#003629] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#376757]">school</span>
              <span>Overview &amp; Programs (शाळा व अभ्यासक्रम माहिती)</span>
            </h2>
            <p className="text-[14px] text-[#404945] leading-relaxed">
              {type === 'school'
                ? (data as SchoolItem).description
                : type === 'abhyasika'
                ? (data as AbhyasikaConfig).noticeText
                : 'Local coaching and academic foundation center in Asgaon helping rural youth achieve top marks in board exams and competitive government recruitment.'}
            </p>

            {/* Key Tags / Features */}
            {type === 'school' && (
              <div className="mt-5 pt-5 border-t border-[#f3ede4]">
                <h3 className="font-bold text-[13px] text-[#003629] mb-2">Key Highlights &amp; Facilities:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
                  {(data as SchoolItem).tags.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#f9f3ea] p-2.5 rounded-xl border border-[#e8e2d9]">
                      <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
                      <span className="text-[#1d1b16] font-medium">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {type === 'abhyasika' && (
              <div className="mt-5 pt-5 border-t border-[#f3ede4]">
                <h3 className="font-bold text-[13px] text-[#003629] mb-3">Study Hall Amenities (अभ्यासिका सुविधा):</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                  <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#002873]">wifi</span>
                    <div>
                      <div className="font-bold">Free High-Speed WiFi</div>
                      <div className="text-[11px] text-[#707974]">{(data as AbhyasikaConfig).wifiSpeed} for online lectures</div>
                    </div>
                  </div>
                  <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#a63b00]">menu_book</span>
                    <div>
                      <div className="font-bold">Reference Library</div>
                      <div className="text-[11px] text-[#707974]">{(data as AbhyasikaConfig).bookCount} MPSC/UPSC/Police Bharti books</div>
                    </div>
                  </div>
                  <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#376757]">power</span>
                    <div>
                      <div className="font-bold">Inverter &amp; Generator Power</div>
                      <div className="text-[11px] text-[#707974]">24x7 uninterrupted power with charging sockets</div>
                    </div>
                  </div>
                  <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#003629]">water_drop</span>
                    <div>
                      <div className="font-bold">RO Filtered Drinking Water</div>
                      <div className="text-[11px] text-[#707974]">Clean hygienic water &amp; washrooms</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Admission & Enrolment Roadmap */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[18px] text-[#003629] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a63b00]">how_to_reg</span>
              <span>Admission &amp; Registration Process (प्रवेश प्रक्रिया)</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <div className="w-7 h-7 rounded-full bg-[#003629] text-white flex items-center justify-center font-bold text-[12px] shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-[#003629]">आवश्यक कागदपत्रे जमा करा (Prepare Documents)</h3>
                  <p className="text-[12px] text-[#404945] mt-0.5">
                    मागील वर्षाचे गुणपत्रक (Marksheet), शाळा सोडल्याचा दाखला (TC/LC), आधार कार्ड, जातीचा दाखला व २ पासपोर्ट फोटो.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <div className="w-7 h-7 rounded-full bg-[#003629] text-white flex items-center justify-center font-bold text-[12px] shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-[#003629]">प्रवेश अर्ज सादर करा (Submit Admission Form)</h3>
                  <p className="text-[12px] text-[#404945] mt-0.5">
                    कार्यालयात प्रत्यक्ष भेट देऊन किंवा ऑनलाइन प्रवेश प्रक्रियेद्वारे कागदपत्र पडताळणी करून घ्या.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9]">
                <div className="w-7 h-7 rounded-full bg-[#003629] text-white flex items-center justify-center font-bold text-[12px] shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-[13px] text-[#003629]">शासकीय सवलती व शिष्यवृत्ती अर्ज (Scholarships &amp; Concessions)</h3>
                  <p className="text-[12px] text-[#404945] mt-0.5">
                    MahaDBT पोर्टलवर १००% शासकीय फी माफी व सावित्रीबाई फुले शिष्यवृत्तीसाठी आसगाव CSC डेस्कवरून अर्ज करा.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Related Education Centers */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[17px] text-[#003629] mb-3">
              Explore More Institutions in Asgaon (इतर शैक्षणिक संस्था)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DEFAULT_SCHOOLS.filter((s) => s.id !== (data as any).id).map((other) => (
                <button
                  key={other.id}
                  onClick={() => {
                    onSelectShiksha(other.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 rounded-xl bg-[#f9f3ea] hover:bg-[#f3ede4] border border-[#e8e2d9] text-left transition-colors flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
                      {other.category}
                    </span>
                    <h3 className="font-heading font-bold text-[13px] text-[#1d1b16] mt-2 line-clamp-2">
                      {other.name}
                    </h3>
                  </div>
                  <div className="mt-3 text-[11px] font-bold text-[#a63b00] flex items-center gap-1">
                    <span>View Campus</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </div>
                </button>
              ))}

              <button
                onClick={() => {
                  onSelectShiksha('abhyasika');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-3.5 rounded-xl bg-[#f9f3ea] hover:bg-[#f3ede4] border border-[#e8e2d9] text-left transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
                    Free Study Hall
                  </span>
                  <h3 className="font-heading font-bold text-[13px] text-[#1d1b16] mt-2 line-clamp-2">
                    Dr. Ambedkar Abhyasika (40 Desks)
                  </h3>
                </div>
                <div className="mt-3 text-[11px] font-bold text-[#a63b00] flex items-center gap-1">
                  <span>Book Desk</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Contact & Actions (1 col wide) */}
        <aside className="flex flex-col gap-5">
          {/* Quick Action Box */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-3">
            <h3 className="font-heading font-extrabold text-[16px] text-[#003629]">
              {type === 'abhyasika' ? 'Book Free Study Desk' : 'Admission Inquiry'}
            </h3>

            {type === 'abhyasika' ? (
              <>
                <p className="text-[12px] text-[#707974] leading-relaxed">
                  Reserve a quiet, dedicated competitive exam study desk with high-speed WiFi and power socket. Zero fee.
                </p>
                <button
                  onClick={() => setBookingDeskOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">desk</span>
                  <span>Book a Study Desk Now</span>
                </button>
              </>
            ) : (
              <>
                <p className="text-[12px] text-[#707974] leading-relaxed">
                  Direct admission contact for academic counseling, fee structure, and hostel facilities:
                </p>
                <a
                  href={`tel:${type === 'school' ? (data as SchoolItem).contactPhone : (data as TutorCenterItem).phone}`}
                  className="w-full py-3 px-4 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>
                    Call Office: +91 {type === 'school' ? (data as SchoolItem).contactPhone : (data as TutorCenterItem).phone}
                  </span>
                </a>
              </>
            )}

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Share on WhatsApp</span>
            </button>
          </div>

          {/* Location & Timings */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
              CAMPUS DETAILS
            </span>

            <h3 className="font-heading font-extrabold text-[15px] text-[#003629] mt-2 mb-2">
              Working Timings &amp; In-Charge
            </h3>

            <div className="space-y-2 text-[12px] text-[#404945]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#003629]">schedule</span>
                <span><strong>Timing:</strong> 8:00 AM - 5:30 PM (Mon-Sat)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#003629]">person</span>
                <span><strong>In-Charge:</strong> {type === 'school' ? (data as SchoolItem).principalName : 'Panchayat Education Desk'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#003629]">location_on</span>
                <span><strong>Area:</strong> Gaothan, Ward 2, Asgaon (PIN 441910)</span>
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
                <h3 className="font-heading font-extrabold text-[18px] text-[#003629]">
                  Book Free Study Desk
                </h3>
                <p className="text-[12px] text-[#707974]">Dr. Babasaheb Ambedkar Village Abhyasika, Asgaon</p>
              </div>
              <button
                onClick={() => setBookingDeskOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f3ede4] flex items-center justify-center text-[#1d1b16]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleBookDesk} className="space-y-3 text-[13px]">
              <div>
                <label className="block font-bold text-[#1d1b16] mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={deskName}
                  onChange={(e) => setDeskName(e.target.value)}
                  placeholder="Enter student full name"
                  className="w-full px-3 py-2 bg-[#f9f3ea] border border-[#e8e2d9] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d1b16] mb-1">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  required
                  value={deskPhone}
                  onChange={(e) => setDeskPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-3 py-2 bg-[#f9f3ea] border border-[#e8e2d9] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d1b16] mb-1">Preferred Time Slot</label>
                <select
                  value={deskSlot}
                  onChange={(e) => setDeskSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f9f3ea] border border-[#e8e2d9] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#003629]"
                >
                  <option>Full Day (8:00 AM - 10:00 PM)</option>
                  <option>Morning Slot (8:00 AM - 2:00 PM)</option>
                  <option>Evening Slot (2:00 PM - 10:00 PM)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookingDeskOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#f3ede4] font-bold text-[12px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSuccess}
                  className="px-4 py-2 rounded-xl bg-[#003629] text-white font-bold text-[12px] flex items-center gap-1"
                >
                  <span>{bookingSuccess ? 'Booking...' : 'Confirm Desk Booking'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
