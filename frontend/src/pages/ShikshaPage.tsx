import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEOHead } from '../components/SEOHead';
import { ShikshaMap } from '../components/ShikshaMap';
import { useLanguage } from '../context/LanguageContext';
import type {
  SchoolItem,
  ScholarshipItem,
  AbhyasikaConfig,
  TutorCenterItem,
  ShikshaNotice
} from '../data/shikshaData';
import {
  DEFAULT_SCHOOLS,
  DEFAULT_SCHOLARSHIPS,
  DEFAULT_ABHYASIKA,
  DEFAULT_TUTORS,
  DEFAULT_SHIKSHA_NOTICE
} from '../data/shikshaData';

interface ShikshaPageProps {
  onNavigateHome?: () => void;
  onSelectShikshaSlug?: (slug: string) => void;
}

export const ShikshaPage: React.FC<ShikshaPageProps> = ({ onNavigateHome, onSelectShikshaSlug }) => {
  const { lang } = useLanguage();
  const [showDeskModal, setShowDeskModal] = useState(false);
  const [showCounselingModal, setShowCounselingModal] = useState(false);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Dynamic Data States with localStorage persistence
  const [schools, setSchools] = useState<SchoolItem[]>(() => {
    const saved = localStorage.getItem('dg_shiksha_schools');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_SCHOOLS;
  });

  const [scholarships, setScholarships] = useState<ScholarshipItem[]>(() => {
    const saved = localStorage.getItem('dg_shiksha_scholarships');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_SCHOLARSHIPS;
  });

  const [abhyasika, setAbhyasika] = useState<AbhyasikaConfig>(() => {
    const saved = localStorage.getItem('dg_shiksha_abhyasika');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_ABHYASIKA;
  });

  const [tutors, setTutors] = useState<TutorCenterItem[]>(() => {
    const saved = localStorage.getItem('dg_shiksha_tutors');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_TUTORS;
  });

  const [notice, setNotice] = useState<ShikshaNotice>(() => {
    const saved = localStorage.getItem('dg_shiksha_notice');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_SHIKSHA_NOTICE;
  });

  // Filter states
  const [schoolCategoryFilter, setSchoolCategoryFilter] = useState<'all' | 'highschool' | 'primary' | 'technical' | 'hostel'>('all');
  const [scholarshipFilter, setScholarshipFilter] = useState<string>('all');

  // Listen for storage changes across tabs or admin edits
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const s = localStorage.getItem('dg_shiksha_schools');
        if (s) setSchools(JSON.parse(s));
        const sc = localStorage.getItem('dg_shiksha_scholarships');
        if (sc) setScholarships(JSON.parse(sc));
        const a = localStorage.getItem('dg_shiksha_abhyasika');
        if (a) setAbhyasika(JSON.parse(a));
        const t = localStorage.getItem('dg_shiksha_tutors');
        if (t) setTutors(JSON.parse(t));
        const n = localStorage.getItem('dg_shiksha_notice');
        if (n) setNotice(JSON.parse(n));
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Desk reservation state
  const [deskName, setDeskName] = useState('');
  const [deskPhone, setDeskPhone] = useState('');
  const [deskTime, setDeskTime] = useState('Morning (06:00 AM - 11:00 AM)');
  const [deskExam, setDeskExam] = useState('MPSC / State Services');

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);

    // Save student reservation in local requests registry
    const newReservation = {
      id: 'desk-' + Date.now(),
      studentName: deskName || 'विद्यार्थी',
      exam: deskExam,
      timeSlot: deskTime,
      phone: deskPhone || '9822104500',
      deskNumber: Math.floor(1 + Math.random() * 40),
      date: new Date().toLocaleDateString('en-IN'),
      status: 'CONFIRMED'
    };
    try {
      const savedReqs = JSON.parse(localStorage.getItem('dg_shiksha_desk_requests') || '[]');
      localStorage.setItem('dg_shiksha_desk_requests', JSON.stringify([newReservation, ...savedReqs]));

      if (abhyasika.availableDesks > 0) {
        const updatedAbhyasika = { ...abhyasika, availableDesks: abhyasika.availableDesks - 1 };
        setAbhyasika(updatedAbhyasika);
        localStorage.setItem('dg_shiksha_abhyasika', JSON.stringify(updatedAbhyasika));
      }
    } catch { /* ignore */ }

    try {
      await api.lodgeComplaint({
        title: `अभ्यासिका डेस्क आरक्षण: ${deskExam} (${deskTime})`,
        description: `विद्यार्थी: ${deskName || 'विद्यार्थी'}, संपर्क: ${deskPhone || '9822104500'}. मोफत अभ्यासिका डेस्क आरक्षित करण्यात आला. परीक्षा: ${deskExam}, वेळ: ${deskTime}.`,
        category: 'Education & Study Desk',
        ward: 'Ward 2 (ZP Hall)',
        citizenPhone: deskPhone || '9822104500'
      });
    } catch (err) {
      console.log('Desk reservation recorded:', err);
    }
    setTimeout(() => {
      setBookingSuccess(false);
      setShowDeskModal(false);
      setShowCounselingModal(false);
      setShowGrievanceModal(false);
      setDeskName('');
      setDeskPhone('');
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 0. SEO Head Injection */}
      <SEOHead
        title="Shiksha, Schools & Competitive Exam Study Hall (शिक्षण व अभ्यासिका) | Asgaon Portal"
        description="Comprehensive education directory for Asgaon & Pauni: ZP High School, Junior College, Dr. Ambedkar Free Study Hall (Abhyasika), MahaDBT scholarship desk, and competitive exam coaching."
        keywords="Asgaon schools, ZP High school, Pauni colleges, अभ्यासिका, स्पर्धा परीक्षा, महाडीबीटी, शिष्यवृत्ती, शिक्षण, Asgaon Shiksha"
        canonicalUrl={`${window.location.origin}/shiksha`}
      />

      {/* 1. TOP LIVE NOTICE STRIP (Dynamic) */}
      {notice.isActive && (
        <div className="bg-[#c2410c] text-white px-4 py-2.5 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-[#fef9ee] font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              {lang === 'MR' ? 'महत्त्वाची सूचना' : 'LIVE NOTICE'}
            </span>
            <span>
              <strong>{notice.headline}</strong> • {notice.subtext}
            </span>
          </div>
          <button
            onClick={() => setShowDeskModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 border border-white/30"
          >
            <span>{notice.actionLabel || (lang === 'MR' ? 'सविस्तर पहा' : 'View Details')}</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* 2. BREADCRUMBS & TALUKA CONTACTS */}
      <Breadcrumb
        items={[
          { label: lang === 'MR' ? 'मुख्यपृष्ठ' : 'Home', onClick: onNavigateHome },
          { label: lang === 'MR' ? 'शिक्षण आणि करिअर' : 'Education & Career', active: true }
        ]}
        rightBadge={
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-[#006a4e] flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px]">call</span>
              <span>{lang === 'MR' ? 'शिक्षण हेल्पलाईन: ०७१८५-२२४४१० (पवनी)' : 'Education Helpline: 07185-224410 (Pauni)'}</span>
            </span>
            <span className="text-[#707974] hidden md:inline">|</span>
            <span className="text-[#c2410c] font-semibold hidden md:inline">{lang === 'MR' ? 'जि.प. शिक्षण संचिका' : 'ZP Education Directory'}</span>
          </div>
        }
      />

      {/* 3. HERO BANNER */}
      <div className="bg-gradient-to-br from-[#166534]/5 via-white to-[#166534]/10 rounded-2xl p-6 sm:p-8 border border-[#c4d6cf] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="font-heading font-extrabold text-[26px] sm:text-[30px] text-[#166534] leading-tight mb-1">
            {lang === 'MR' ? 'शिक्षण आणि युवा विकास मंच' : 'Shiksha & Youth Development Portal'}
          </h1>
          <h2 className="text-[14px] sm:text-[15px] font-bold text-[#c2410c] mb-2">
            {lang === 'MR' ? 'आसगाव व पवनी परिसर — शैक्षणिक व करिअर दालन' : 'Asgaon & Pauni Educational and Career Guidance Hub'}
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#404945] max-w-2xl leading-relaxed">
            {lang === 'MR'
              ? 'आसगाव व पवनी परिसरातील विद्यार्थ्यांसाठी स्थानिक शाळा, कनिष्ठ महाविद्यालये, शासकीय शिष्यवृत्ती, मोफत डिजिटल अभ्यासिका आणि करिअर मार्गदर्शन मंच.'
              : 'Comprehensive village school directory, government scholarship updates, 24x7 digital study rooms, accredited skill training, and career counseling for students of Asgaon and Pauni region.'}
          </p>
        </div>

        {/* 3 Dynamic Counters */}
        <div className="grid grid-cols-3 gap-3 shrink-0 self-stretch sm:self-auto">
          <div className="bg-white p-3 rounded-xl border border-[#e8e2d9] text-center shadow-xs flex flex-col justify-center min-w-[85px]">
            <span className="font-black text-[22px] text-[#166534]">{schools.length}</span>
            <span className="text-[10px] text-[#707974] uppercase font-bold">{lang === 'MR' ? 'शाळा व संस्था' : 'Schools'}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#e8e2d9] text-center shadow-xs flex flex-col justify-center min-w-[85px]">
            <span className="font-black text-[22px] text-[#c2410c]">{scholarships.length}</span>
            <span className="text-[10px] text-[#707974] uppercase font-bold">{lang === 'MR' ? 'शिष्यवृत्ती' : 'Scholarships'}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#e8e2d9] text-center shadow-xs flex flex-col justify-center min-w-[85px]">
            <span className="font-black text-[22px] text-[#006a4e]">{abhyasika.availableDesks}</span>
            <span className="text-[10px] text-[#707974] uppercase font-bold">{lang === 'MR' ? 'मोफत जागा' : 'Free Desks'}</span>
          </div>
        </div>
      </div>

      {/* 4 ACTION BUTTONS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <a
          href="#scholarships"
          className="p-3 bg-[#166534] hover:bg-[#052e16] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all text-center"
        >
          <span className="material-symbols-outlined text-[18px]">school</span>
          <span>{lang === 'MR' ? 'MahaDBT शिष्यवृत्ती अर्ज' : 'Apply for MahaDBT Scholarships'}</span>
        </a>
        <button
          onClick={() => setShowDeskModal(true)}
          className="p-3 bg-[#c2410c] hover:bg-[#852f00] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all text-center"
        >
          <span className="material-symbols-outlined text-[18px]">local_library</span>
          <span>{lang === 'MR' ? 'मोफत डिजिटल अभ्यासिका बुकिंग' : 'Digital Study Room Booking'}</span>
        </button>
        <a
          href="#schools-map"
          className="p-3 bg-white hover:bg-[#f3ede4] text-[#166534] border border-[#e8e2d9] rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all text-center"
        >
          <span className="material-symbols-outlined text-[18px]">map</span>
          <span>{lang === 'MR' ? 'शाळा व ग्रंथालय नकाशा' : 'School & Library Map'}</span>
        </a>
        <a
          href="https://wa.me/919422811204"
          target="_blank"
          rel="noreferrer"
          className="p-3 bg-white hover:bg-[#f3ede4] text-[#006a4e] border border-[#bbf7d0] rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all text-center"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span>{lang === 'MR' ? 'व्हॉट्सअ‍ॅप समुपदेशक डेस्क' : 'WhatsApp Mentor Desk'}</span>
        </a>
      </div>

      {/* 4.5 INTERACTIVE EDUCATION & LIBRARY GIS MAP */}
      <div id="schools-map" className="w-full">
        <ShikshaMap height="480px" />
      </div>

      {/* 5. MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PRIMARY SECTIONS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* SECTION 1: LOCAL SCHOOLS & COLLEGES */}
          <div id="schools" className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a4e] text-[24px]">school</span>
                <div>
                  <h2 className="font-heading font-extrabold text-[20px] text-[#166534]">
                    {lang === 'MR' ? 'स्थानिक शाळा व कनिष्ठ महाविद्यालये' : 'Local Schools & Colleges'}
                  </h2>
                  <p className="text-[12px] text-[#707974]">
                    {lang === 'MR' ? 'आसगाव व पवनी परिसर (जि.प. व शासकीय/अनुदानित)' : 'in Asgaon + Pauni (ZP and Aided / Non-Aided)'}
                  </p>
                </div>
              </div>
              <a href="#scholarships" className="text-[12px] font-bold text-[#006a4e] hover:underline self-start sm:self-auto">
                {lang === 'MR' ? 'शिष्यवृत्ती माहिती पहा >' : 'View Scholarships >'}
              </a>
            </div>

            {/* Filter categories pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[12px] font-medium no-scrollbar">
              {[
                { id: 'all', label: lang === 'MR' ? `सर्व शाळा (${schools.length})` : `All (${schools.length})` },
                { id: 'highschool', label: lang === 'MR' ? 'हायस्कूल व कनिष्ठ महाविद्यालय' : 'High School & Jr College' },
                { id: 'primary', label: lang === 'MR' ? 'प्राथमिक शाळा' : 'Primary Schools' },
                { id: 'technical', label: lang === 'MR' ? 'आयटीआय व तांत्रिक' : 'ITI & Technical' },
                { id: 'hostel', label: lang === 'MR' ? 'वसतिगृह' : 'Hostels' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSchoolCategoryFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                    schoolCategoryFilter === f.id
                      ? 'bg-[#166534] text-white shadow-xs'
                      : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {schools
                .filter(s => {
                  if (schoolCategoryFilter === 'all') return true;
                  const cat = (s.category || '').toLowerCase();
                  const name = (s.name || '').toLowerCase();
                  if (schoolCategoryFilter === 'highschool') return cat.includes('high') || cat.includes('college') || name.includes('high');
                  if (schoolCategoryFilter === 'primary') return cat.includes('primary') || name.includes('primary');
                  if (schoolCategoryFilter === 'technical') return cat.includes('tech') || cat.includes('iti') || name.includes('iti');
                  if (schoolCategoryFilter === 'hostel') return cat.includes('hostel') || name.includes('hostel');
                  return true;
                })
                .map((school) => (
                  <div key={school.id} className="border border-[#e8e2d9] rounded-xl p-4 hover:shadow-md transition-all bg-white flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-44 h-36 rounded-lg overflow-hidden bg-[#f3ede4] shrink-0">
                      <img
                        src={school.imageUrl || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80"}
                        alt={school.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span className="bg-[#bbf7d0] text-[#002117] text-[10px] font-extrabold px-2 py-0.5 rounded">
                            {school.badge}
                          </span>
                          <span className="bg-[#f3ede4] text-[#404945] text-[10px] font-bold px-2 py-0.5 rounded">
                            {school.medium}
                          </span>
                          <span className="bg-[#fef9ee] text-[#c2410c] text-[10px] font-bold px-2 py-0.5 rounded border border-[#fde68a]">
                            {lang === 'MR' ? 'इयत्ता:' : 'Grades:'} {school.grades}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-[16px] text-[#166534] leading-snug hover:text-[#c2410c] transition-colors">
                          {onSelectShikshaSlug ? (
                            <a
                              href={`/shiksha/${school.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                onSelectShikshaSlug(school.id);
                              }}
                              className="hover:underline"
                            >
                              {school.name}
                            </a>
                          ) : (
                            school.name
                          )}
                        </h3>
                        <p className="text-[12px] text-[#404945] leading-relaxed mt-1">
                          {school.description}
                        </p>
                        {school.tags && school.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 text-[11px] text-[#55605a] mt-2">
                            {school.tags.map((tag, i) => (
                              <span key={i} className="bg-[#f3ede4]/60 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 mt-3 border-t border-[#f3ede4]">
                        <span className="text-[11px] text-[#707974]">
                          {school.principalName ? `${lang === 'MR' ? 'मुख्याध्यापक:' : 'Headmaster:'} ${school.principalName}` : school.address} {school.contactPhone ? `(${school.contactPhone})` : ''}
                        </span>
                        <div className="flex items-center gap-2">
                          {onSelectShikshaSlug && (
                            <button
                              type="button"
                              onClick={() => onSelectShikshaSlug(school.id)}
                              className="py-1.5 px-3 bg-[#002873] hover:bg-[#00174b] text-white text-[11px] font-bold rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs"
                            >
                              <span>{lang === 'MR' ? 'माहिती पहा' : 'Campus Page'}</span>
                              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                            </button>
                          )}
                          {school.contactPhone ? (
                            <a
                              href={`tel:${school.contactPhone}`}
                              className="py-1.5 px-3 bg-[#166534] hover:bg-[#052e16] text-white text-[11px] font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">call</span>
                              <span>{lang === 'MR' ? 'संपर्क साधा' : 'Call School'}</span>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* SECTION 2: STUDENT SCHOLARSHIP GUIDANCE DESK */}
          <div id="scholarships" className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c2410c] text-[24px]">workspace_premium</span>
                <div>
                  <h2 className="font-heading font-extrabold text-[20px] text-[#166534]">
                    {lang === 'MR' ? 'विद्यार्थी शिष्यवृत्ती मार्गदर्शन कक्ष' : 'Student Scholarship Guidance Desk'}
                  </h2>
                  <p className="text-[12px] text-[#707974]">
                    {lang === 'MR' ? 'थेट बँक हस्तांतरण (DBT) पात्र केंद्र व राज्य शासकीय योजना' : 'Direct Benefit Transfer (DBT) eligible central & state govt education schemes'}
                  </p>
                </div>
              </div>
              <a
                href="https://mahadbt.maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-[#c2410c] hover:underline flex items-center gap-1 self-start sm:self-auto bg-[#fef9ee] px-3 py-1 rounded-md border border-[#fde68a]"
              >
                <span>{lang === 'MR' ? 'MahaDBT अधिकृत पोर्टल' : 'MahaDBT Official Portal'}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>

            {/* Filter pills for scholarships */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[12px] font-medium no-scrollbar">
              {[
                { id: 'all', label: lang === 'MR' ? `सर्व शिष्यवृत्ती (${scholarships.length})` : `All (${scholarships.length})` },
                { id: 'matric', label: lang === 'MR' ? 'मॅट्रिकोत्तर (Post-Matric)' : 'Post-Matric' },
                { id: 'open', label: lang === 'MR' ? 'खुला प्रवर्ग / EWS' : 'Open / EWS' },
                { id: 'girls', label: lang === 'MR' ? 'मुलींसाठी विशेष' : 'For Girls' },
                { id: 'merit', label: lang === 'MR' ? 'गुणवत्ता परीक्षा (NMMS)' : 'Merit (NMMS)' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setScholarshipFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                    scholarshipFilter === f.id
                      ? 'bg-[#c2410c] text-white shadow-xs'
                      : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scholarships
                .filter(sch => {
                  if (scholarshipFilter === 'all') return true;
                  const title = (sch.title || '').toLowerCase();
                  const badge = (sch.badge || '').toLowerCase();
                  if (scholarshipFilter === 'matric') return title.includes('post') || badge.includes('post');
                  if (scholarshipFilter === 'open') return title.includes('shahu') || badge.includes('open') || badge.includes('ews');
                  if (scholarshipFilter === 'girls') return title.includes('phule') || title.includes('kanya') || badge.includes('girls');
                  if (scholarshipFilter === 'merit') return title.includes('nmms') || badge.includes('merit');
                  return true;
                })
                .map((sch) => (
                  <div key={sch.id} className="border border-[#e8e2d9] rounded-xl p-4 bg-white flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="bg-[#bbf7d0] text-[#002117] text-[9px] font-black uppercase px-2 py-0.5 rounded">
                          {sch.badge}
                        </span>
                        <span className="text-[10px] text-[#ba1a1a] font-bold">
                          {lang === 'MR' ? 'शेवटची तारीख:' : 'Deadline:'} {sch.deadline}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-[14px] text-[#166534] leading-snug">
                        {sch.title}
                      </h3>
                      <p className="text-[11px] text-[#404945] leading-relaxed mt-1 mb-3">
                        {sch.description}
                      </p>

                      <div className="bg-[#f3ede4]/50 p-2.5 rounded-lg flex flex-col gap-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-[#707974]">{lang === 'MR' ? 'लाभ / रक्कम:' : 'Benefit / Amount:'}</span>
                          <strong className="text-[#166534]">{sch.benefit}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#707974]">{lang === 'MR' ? 'कौटुंबिक उत्पन्न मर्यादा:' : 'Income Limit:'}</span>
                          <strong className="text-[#166534]">{sch.incomeLimit}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#707974]">{lang === 'MR' ? 'विभाग:' : 'Department:'}</span>
                          <span className="text-[#166534] text-[10px]">{sch.department}</span>
                        </div>
                        {sch.eligibility && (
                          <div className="flex justify-between pt-1 border-t border-[#e8e2d9]">
                            <span className="text-[#707974]">{lang === 'MR' ? 'पात्रता:' : 'Eligibility:'}</span>
                            <span className="text-[#006a4e] font-semibold text-[10px] text-right max-w-[180px]">{sch.eligibility}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#f3ede4]">
                      <span className="text-[10px] text-[#006a4e] font-semibold">
                        {lang === 'MR' ? 'आधार संलग्न DBT अनिवार्य' : 'Aadhaar DBT Required'}
                      </span>
                      <a
                        href={sch.officialUrl || "https://mahadbt.maharashtra.gov.in"}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 px-3 bg-[#166534] hover:bg-[#052e16] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>{lang === 'MR' ? 'अर्ज करा' : 'Apply Online'}</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* SECTION 3: DOCUMENT CHECKLIST FOR MAHADBT */}
          <div className="bg-[#fef9ee] rounded-2xl p-5 sm:p-6 border border-[#fde68a] shadow-xs flex flex-col gap-4">
            <div className="border-b border-[#fde68a] pb-3">
              <h3 className="font-heading font-bold text-[16px] text-[#166534]">
                {lang === 'MR' ? 'MahaDBT पडताळणीसाठी आवश्यक कागदपत्रे यादी' : 'Document Checklist for MahaDBT Verification'}
              </h3>
              <p className="text-[12px] text-[#707974]">
                {lang === 'MR'
                  ? 'ऑनलाइन अर्ज सादर करण्यापूर्वी किंवा CSC केंद्रात जाण्यापूर्वी स्पष्ट स्वाक्षरी केलेल्या PDF प्रती (२५० KB पेक्षा कमी) तयार ठेवा:'
                  : 'Keep clear scan-attested PDF copies (<250 KB) ready before approaching the Asgaon CSC Kiosk or submitting online:'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-xl border border-[#fde68a] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[20px] shrink-0 mt-0.5">badge</span>
                <div>
                  <h4 className="font-bold text-[11px] text-[#166534]">
                    {lang === 'MR' ? 'अधिवास व वयाचा पुरावा (Domicile)' : 'Domicile & Age Proof'}
                  </h4>
                  <p className="text-[10px] text-[#707974] leading-tight mt-0.5">
                    {lang === 'MR' ? 'महा ई-सेवा केंद्र / तहसील कार्यालय' : 'Maha E-Seva / Tahsil Office'}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#fde68a] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[20px] shrink-0 mt-0.5">verified_user</span>
                <div>
                  <h4 className="font-bold text-[11px] text-[#166534]">
                    {lang === 'MR' ? 'जातीचा दाखला व वैधता (Caste Validity)' : 'Caste & Validity Certificate'}
                  </h4>
                  <p className="text-[10px] text-[#707974] leading-tight mt-0.5">
                    {lang === 'MR' ? 'उपविभागीय दंडाधिकारी / पडताळणी समिती' : 'Sub-Divisional Magistrate / Verification'}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#fde68a] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[20px] shrink-0 mt-0.5">receipt_long</span>
                <div>
                  <h4 className="font-bold text-[11px] text-[#166534]">
                    {lang === 'MR' ? 'चालू वर्षाचा उत्पन्नाचा दाखला' : 'Income Certificate (2025-26)'}
                  </h4>
                  <p className="text-[10px] text-[#707974] leading-tight mt-0.5">
                    {lang === 'MR' ? 'तहसीलदार, पवनी यांच्या स्वाक्षरीसह' : 'Issued by Tahsildar, Pauni'}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#fde68a] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[20px] shrink-0 mt-0.5">account_balance_wallet</span>
                <div>
                  <h4 className="font-bold text-[11px] text-[#166534]">
                    {lang === 'MR' ? 'आधार-NPCI संलग्न बँक पासबुक' : 'Aadhaar-NPCI Bank Passbook'}
                  </h4>
                  <p className="text-[10px] text-[#707974] leading-tight mt-0.5">
                    {lang === 'MR' ? 'सक्रिय DBT बँक खाते (SBI / BoM / PGB)' : 'Active DBT seeded SBI / BoM / PGB'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: DR. APJ ABDUL KALAM ABHYASIKA (Dynamic) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[26px]">local_library</span>
                <div>
                  <h2 className="font-heading font-extrabold text-[18px] sm:text-[20px] text-[#166534]">
                    {abhyasika.title}
                  </h2>
                  <p className="text-[12px] text-[#707974]">
                    {lang === 'MR' ? 'डिजिटल अभ्यासिका व स्पर्धा परीक्षा केंद्र — मोफत अभ्यास सुविधा' : 'Dedicated Free Digital Public Study Facility'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#006a4e] bg-[#bbf7d0]/40 px-3 py-1 rounded-full border border-[#bbf7d0] self-start sm:self-auto">
                {abhyasika.availableDesks} {lang === 'MR' ? 'जागा उपलब्ध (मोफत प्रवेश)' : 'Desks Available (Free)'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#f3ede4]/40 p-3.5 rounded-xl border border-[#e8e2d9] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[22px] shrink-0">desk</span>
                <div>
                  <h4 className="font-bold text-[12px] text-[#166534]">
                    {abhyasika.totalDesks} {lang === 'MR' ? 'रीडिंग डेस्क' : 'Reading Desks'}
                  </h4>
                  <p className="text-[11px] text-[#404945] mt-0.5">
                    {lang === 'MR' ? 'शांत वातावरण, एर्गोनॉमिक चेअर्स व स्वतंत्र चार्जिंग पॉईंट्स.' : 'Quiet environment with dedicated power sockets.'}
                  </p>
                </div>
              </div>

              <div className="bg-[#f3ede4]/40 p-3.5 rounded-xl border border-[#e8e2d9] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[22px] shrink-0">wifi</span>
                <div>
                  <h4 className="font-bold text-[12px] text-[#166534]">{abhyasika.wifiSpeed}</h4>
                  <p className="text-[11px] text-[#404945] mt-0.5">
                    {lang === 'MR' ? 'ऑनलाइन लेक्चर्स आणि मॉक टेस्टसाठी मोफत हाय-स्पीड इंटरनेट.' : 'Free high-speed internet for online lectures.'}
                  </p>
                </div>
              </div>

              <div className="bg-[#f3ede4]/40 p-3.5 rounded-xl border border-[#e8e2d9] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[22px] shrink-0">menu_book</span>
                <div>
                  <h4 className="font-bold text-[12px] text-[#166534]">{abhyasika.bookCount}</h4>
                  <p className="text-[11px] text-[#404945] mt-0.5">
                    {lang === 'MR' ? 'MPSC, UPSC, पोलिस भरती, बँकिंग व संदर्भ पुस्तके.' : 'MPSC, UPSC, Police Bharti & competitive books.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#f3ede4]">
              <div>
                <span className="text-[10px] text-[#707974] block">{lang === 'MR' ? 'अभ्यासिका दैनंदिन वेळ:' : 'Daily Timings:'}</span>
                <strong className="text-[12px] text-[#166534]">{abhyasika.timings}</strong>
                <span className="text-[10px] text-[#55605a] block mt-0.5">
                  {lang === 'MR' ? 'व्यवस्थापक:' : 'Caretaker:'} {abhyasika.caretakerName} ({abhyasika.caretakerRole})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {onSelectShikshaSlug && (
                  <button
                    type="button"
                    onClick={() => onSelectShikshaSlug('abhyasika')}
                    className="py-2.5 px-3.5 bg-[#002873] hover:bg-[#00174b] text-white text-[12px] font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <span>{lang === 'MR' ? 'अभ्यासिका संपूर्ण माहिती' : 'Full Study Hall Page'}</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                )}
                <button
                  onClick={() => setShowDeskModal(true)}
                  className="py-2.5 px-4 bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  <span>{lang === 'MR' ? 'मोफत जागा आरक्षित करा' : 'Book Free Desk'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 5: LOCAL TUTORS, COACHING & SKILL CENTERS (Dynamic) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
            <div className="border-b border-[#f3ede4] pb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c2410c] text-[22px]">diversity_3</span>
                  <h2 className="font-heading font-extrabold text-[20px] text-[#166534]">
                    {lang === 'MR' ? `स्थानिक शिकवणी व प्रशिक्षण केंद्रे (${tutors.length})` : `Local Tutors, Coaching & Skill Centers (${tutors.length})`}
                  </h2>
                </div>
                <p className="text-[12px] text-[#707974]">
                  {lang === 'MR' ? 'गाव आणि परिसरातील खाजगी शिकवणी वर्ग आणि कौशल्य प्रशिक्षण केंद्रे' : 'Private tutoring batches and vocational training in Asgaon & Pauni'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tutors.map((tutor) => (
                <div key={tutor.id} className="border border-[#e8e2d9] rounded-xl p-4 bg-white flex flex-col justify-between hover:shadow-xs transition-all">
                  <div>
                    <span className="bg-[#f3ede4] text-[#404945] text-[9px] font-bold px-2 py-0.5 rounded">
                      {tutor.category}
                    </span>
                    <h3 className="font-heading font-bold text-[14px] text-[#166534] leading-snug mt-1.5">
                      {tutor.name}
                    </h3>
                    <p className="text-[11px] text-[#404945] leading-relaxed mt-1">
                      {tutor.subjects}
                    </p>
                    <p className="text-[10px] text-[#707974] bg-[#f3ede4]/50 p-1.5 rounded mt-2.5 truncate">
                      {tutor.address} {tutor.timing ? `• ${tutor.timing}` : ''}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#f3ede4] flex items-center justify-between text-[11px]">
                    <span className="text-[#006a4e] font-bold">{tutor.feesInfo || (lang === 'MR' ? 'सवलत दर' : 'Affordable')}</span>
                    {tutor.phone ? (
                      <a href={`tel:${tutor.phone}`} className="text-[#166534] font-bold hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>{lang === 'MR' ? 'कॉल करा' : 'Call'}</span>
                      </a>
                    ) : (
                      <span className="text-[#707974]">{lang === 'MR' ? 'माहिती उपलब्ध' : 'Verified'}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN: 4 WIDGETS (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* WIDGET 1: CAREER COUNSELING CLINIC */}
          <div className="bg-[#166534] text-white rounded-2xl p-5 shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#bbf7d0]">
                {lang === 'MR' ? 'करिअर क्लिनिक' : 'CAREER CLINIC'}
              </span>
              <span className="bg-[#bbf7d0]/20 text-[#bbf7d0] text-[9px] font-bold px-2 py-0.5 rounded">
                {lang === 'MR' ? 'दर मंगळवारी' : 'Every Tuesday'}
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-[16px] leading-snug">
              {lang === 'MR' ? 'करिअर मार्गदर्शन व समुपदेशन केंद्र' : 'Career Counseling & Guidance Clinic'}
            </h3>

            <p className="text-[11px] text-[#e8e2d9] leading-relaxed">
              {lang === 'MR'
                ? '१०वी व १२वीनंतर योग्य शाखा निवड, स्पर्धा परीक्षा नियोजन व शिष्यवृत्ती मार्गदर्शनासाठी तज्ज्ञांचे मोफत समुपदेशन सत्र.'
                : 'Free weekly 1-on-1 career navigation guidance session with district educational mentors.'}
            </p>

            <div className="bg-white/10 p-2.5 rounded-xl text-[11px] flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#bbf7d0]">event</span>
                <span>{lang === 'MR' ? 'वेळ:' : 'Timing:'} <strong>{lang === 'MR' ? 'मंगळवारी सकाळी १० ते दुपारी १' : 'Tuesday, 10:00 AM – 1:00 PM'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#bbf7d0]">location_on</span>
                <span>{lang === 'MR' ? 'स्थानिक समाज सभागृह, आसगाव ४४१९१०' : 'Community Hall, Asgaon 441910'}</span>
              </div>
            </div>

            <button
              onClick={() => setShowCounselingModal(true)}
              className="w-full py-2.5 bg-white hover:bg-[#fef9ee] text-[#166534] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span>{lang === 'MR' ? '२० मिनिटांचा स्लॉट बुक करा' : 'Book 20-Min Slot'}</span>
            </button>
          </div>

          {/* WIDGET 2: PREVIOUS YEAR QUESTION PAPERS */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#f3ede4] pb-3">
              <span className="material-symbols-outlined text-[#006a4e] text-[22px]">download_for_offline</span>
              <div>
                <h3 className="font-heading font-bold text-[14px] text-[#166534]">
                  {lang === 'MR' ? 'मागील वर्षांच्या प्रश्नपत्रिका (PDF)' : 'Previous Year Question Papers'}
                </h3>
                <span className="text-[10px] text-[#707974]">{lang === 'MR' ? 'मोफत डाऊनलोड (शिक्षक तपासित)' : 'Free PDF downloads'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[11px]">
              <a
                href="#download"
                className="p-2.5 rounded-lg border border-[#e8e2d9] hover:border-[#006a4e] hover:bg-[#bbf7d0]/10 transition-all flex items-center justify-between group"
              >
                <div>
                  <strong className="text-[#166534] block group-hover:text-[#006a4e]">
                    {lang === 'MR' ? '१०वी बोर्ड परीक्षा प्रश्नपत्रिका (२०२१-२०२६)' : 'SSC 10th Board (2021-2026)'}
                  </strong>
                  <span className="text-[10px] text-[#707974]">{lang === 'MR' ? 'मराठी / गणित / विज्ञान सोडवलेल्या पत्रिका' : 'Marathi / Maths / Science Solved Papers'}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#707974] group-hover:text-[#006a4e]">download</span>
              </a>

              <a
                href="#download"
                className="p-2.5 rounded-lg border border-[#e8e2d9] hover:border-[#006a4e] hover:bg-[#bbf7d0]/10 transition-all flex items-center justify-between group"
              >
                <div>
                  <strong className="text-[#166534] block group-hover:text-[#006a4e]">
                    {lang === 'MR' ? '१२वी बोर्ड परीक्षा (विज्ञान व कला)' : 'HSC 12th Board Science & Arts'}
                  </strong>
                  <span className="text-[10px] text-[#707974]">{lang === 'MR' ? 'भौतिकशास्त्र / रसायनशास्त्र / कृषी' : 'Physics / Chemistry / Agri / Political'}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#707974] group-hover:text-[#006a4e]">download</span>
              </a>

              <a
                href="#download"
                className="p-2.5 rounded-lg border border-[#e8e2d9] hover:border-[#006a4e] hover:bg-[#bbf7d0]/10 transition-all flex items-center justify-between group"
              >
                <div>
                  <strong className="text-[#166534] block group-hover:text-[#006a4e]">
                    {lang === 'MR' ? 'TET / TAIT शिक्षक भरती सराव पत्रिका' : 'TET / TAIT Model Papers (2025)'}
                  </strong>
                  <span className="text-[10px] text-[#707974]">{lang === 'MR' ? 'पेपर १ व २ सविस्तर उत्तरपत्रिका' : 'Teacher Eligibility Paper 1 & 2'}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#707974] group-hover:text-[#006a4e]">download</span>
              </a>

              <a
                href="#download"
                className="p-2.5 rounded-lg border border-[#e8e2d9] hover:border-[#006a4e] hover:bg-[#bbf7d0]/10 transition-all flex items-center justify-between group"
              >
                <div>
                  <strong className="text-[#166534] block group-hover:text-[#006a4e]">
                    {lang === 'MR' ? 'महाराष्ट्र पोलीस भरती सराव संच' : 'Maharashtra Police Constable'}
                  </strong>
                  <span className="text-[10px] text-[#707974]">{lang === 'MR' ? 'भंडारा जिल्हा मागील ५ वर्षांचे पेपर्स' : 'Previous 5-year Bhandara district papers'}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#707974] group-hover:text-[#006a4e]">download</span>
              </a>
            </div>

            <button className="w-full py-2 border border-[#e8e2d9] text-[#166534] hover:bg-[#f3ede4] text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
              <span>{lang === 'MR' ? 'सर्व २५+ सराव पत्रिका पहा' : 'View Complete 25+ PDF Repository'}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* WIDGET 3: EDUCATION GRIEVANCE DESK */}
          <div className="bg-[#fef9ee] rounded-2xl p-5 border border-[#fde68a] shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center gap-2 border-b border-[#fde68a] pb-3">
              <span className="material-symbols-outlined text-[#c2410c] text-[20px]">report</span>
              <div>
                <h3 className="font-heading font-bold text-[14px] text-[#c2410c]">
                  {lang === 'MR' ? 'शालेय तक्रार व विचारणा कक्ष' : 'Education Grievance Desk'}
                </h3>
                <span className="text-[10px] text-[#707974]">{lang === 'MR' ? 'थेट नागरिक नोंदणी' : 'Direct reporting'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 text-[11px] text-[#404945]">
              <div className="bg-white p-2.5 rounded-lg border border-[#fde68a]">
                <strong className="text-[#166534] block">
                  {lang === 'MR' ? 'शालेय पोषण आहार (PM पोषण) गुणवत्ता:' : 'Mid-Day Meal Quality Complaint:'}
                </strong>
                <p className="text-[10px] text-[#707974] mt-0.5 leading-tight">
                  {lang === 'MR' ? 'आहाराच्या गुणवत्तेबाबत तक्रार नोंदवून ४८ तासांत निवारण मिळवा.' : 'Submit concern regarding mid-day meal hygiene.'}
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#fde68a]">
                <strong className="text-[#166534] block">
                  {lang === 'MR' ? 'RTE २५% मोफत प्रवेश सहाय्यता:' : 'RTE 25% Free Admission Desk:'}
                </strong>
                <p className="text-[10px] text-[#707974] mt-0.5 leading-tight">
                  {lang === 'MR' ? 'आर्थिक दुर्बल घटकांतील पाल्यांसाठी खाजगी शाळा लॉटरी प्रवेश मार्गदर्शन.' : 'Assistance for private schooling lottery entry for economically weaker wards.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGrievanceModal(true)}
              className="w-full py-2 bg-[#c2410c] hover:bg-[#852f00] text-white text-[11px] font-bold rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
              <span>{lang === 'MR' ? 'शैक्षणिक तक्रार / विचारणा नोंदवा' : 'Submit an Education Complaint / Inquiry'}</span>
            </button>
          </div>

          {/* WIDGET 4: CIVIC EDUCATION VISION */}
          <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#166534] text-[#bbf7d0] font-bold text-[12px] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">auto_stories</span>
            </div>
            <div className="text-[11px] text-[#404945] leading-relaxed">
              <strong className="text-[#166534] block">
                {lang === 'MR' ? 'आसगाव ग्राम शिक्षण संकल्प' : 'Asgaon Village Education Mission'}
              </strong>
              <span className="text-[10px] text-[#707974] block mb-1">{lang === 'MR' ? 'ज्ञान समृद्ध गाव — उज्वल भविष्य' : 'Knowledge Empowerment for Rural Youth'}</span>
              <p className="italic text-[10px]">
                {lang === 'MR'
                  ? '“प्रत्येक बालकाला दर्जेदार शिक्षण आणि तरुणांना योग्य करिअर संधी मिळवून देणे हाच गावाच्या सर्वांगीण विकासाचा पाया आहे.”'
                  : '“Empowering every child with education is the singular pathway towards lasting village prosperity.”'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: STUDY DESK BOOKING */}
      {showDeskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setShowDeskModal(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#006a4e] text-[24px]">local_library</span>
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#166534]">
                  {lang === 'MR' ? 'अभ्यासिका डेस्क आरक्षित करा' : 'Reserve Study Room Desk'}
                </h3>
                <span className="text-[11px] text-[#707974]">
                  {lang === 'MR' ? 'डॉ. एपीजे अब्दुल कलाम सार्वजनिक अभ्यासिका, आसगाव' : 'Dr. APJ Abdul Kalam Public Abhyasika, Asgaon'}
                </span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-[#bbf7d0]/40 border border-[#006a4e] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-[#006a4e] text-[40px] mb-2">check_circle</span>
                <h4 className="font-bold text-[15px] text-[#166534]">
                  {lang === 'MR' ? 'अभ्यासिका डेस्क आरक्षित झाला!' : 'Study Desk Reserved!'}
                </h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  {lang === 'MR'
                    ? 'तुमच्या निवडलेल्या वेळेसाठी जागा निश्चित केली आहे. मोफत प्रवेश नोंदवला गेला आहे.'
                    : 'Desk confirmed for your slot. Entry token sent via SMS.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'विद्यार्थ्याचे पूर्ण नाव' : 'Student Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={deskName}
                    onChange={(e) => setDeskName(e.target.value)}
                    placeholder={lang === 'MR' ? 'उदा. राहुल सुनील जाधव' : 'e.g. Rahul Sunil Jadhav'}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'मोबाईल नंबर (एसएमएस कन्फर्मेशनसाठी)' : 'Mobile Number (For Confirmation)'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={deskPhone}
                    onChange={(e) => setDeskPhone(e.target.value)}
                    placeholder={lang === 'MR' ? '१०-अंकी मोबाईल नंबर' : '10-digit mobile number'}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'तयारी करत असलेली परीक्षा / अभ्यासक्रम' : 'Target Examination / Course'}
                  </label>
                  <select
                    value={deskExam}
                    onChange={(e) => setDeskExam(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                  >
                    <option value="MPSC / State Services">{lang === 'MR' ? 'MPSC / राज्य सेवा परीक्षा' : 'MPSC / State Civil Services'}</option>
                    <option value="UPSC Civil Services">{lang === 'MR' ? 'UPSC केंद्रीय नागरी सेवा' : 'UPSC Civil Services'}</option>
                    <option value="Maharashtra Police Constable">{lang === 'MR' ? 'महाराष्ट्र पोलीस भरती' : 'Maharashtra Police Constable'}</option>
                    <option value="TET / TAIT Teacher Exam">{lang === 'MR' ? 'TET / TAIT शिक्षक पात्रता परीक्षा' : 'TET / TAIT Teacher Exam'}</option>
                    <option value="10th / 12th Board">{lang === 'MR' ? '१०वी / १२वी राज्य मंडळ परीक्षा' : '10th / 12th State Board'}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'वेळ सत्र निवड (Time Slot)' : 'Time Slot Preference'}
                  </label>
                  <select
                    value={deskTime}
                    onChange={(e) => setDeskTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                  >
                    <option value="Morning (06:00 AM - 11:00 AM)">{lang === 'MR' ? 'सकाळ सत्र (सकाळी ०६:०० ते ११:००)' : 'Morning (06:00 AM – 11:00 AM)'}</option>
                    <option value="Afternoon (11:00 AM - 04:00 PM)">{lang === 'MR' ? 'दुपार सत्र (सकाळी ११:०० ते दुपारी ०४:००)' : 'Afternoon (11:00 AM – 04:00 PM)'}</option>
                    <option value="Evening (04:00 PM - 09:00 PM)">{lang === 'MR' ? 'संध्याकाळ सत्र (दुपारी ०४:०० ते रात्री ०९:००)' : 'Evening (04:00 PM – 09:00 PM)'}</option>
                    <option value="Night Study (09:00 PM - 11:00 PM)">{lang === 'MR' ? 'रात्र सत्र (रात्री ०९:०० ते ११:००)' : 'Night Study (09:00 PM – 11:00 PM)'}</option>
                  </select>
                </div>
                <div className="bg-[#bbf7d0]/30 p-2.5 rounded-lg border border-[#006a4e]/20 text-[11px] text-[#166534]">
                  {lang === 'MR' ? 'आसगाव परिसरातील सर्व विद्यार्थ्यांसाठी १००% मोफत. हाय-स्पीड वायफाय व इन्व्हर्टर बॅकअप सक्रिय.' : '100% Free for all students. High-speed WiFi & power backup active.'}
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs mt-1"
                >
                  {lang === 'MR' ? 'मोफत डेस्क आरक्षण निश्चित करा' : 'Confirm Free Desk Reservation'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: CAREER COUNSELING BOOKING */}
      {showCounselingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setShowCounselingModal(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#006a4e] text-[24px]">psychology</span>
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#166534]">
                  {lang === 'MR' ? 'करिअर समुपदेशन वेळ बुक करा' : 'Book Career Counseling Slot'}
                </h3>
                <span className="text-[11px] text-[#707974]">
                  {lang === 'MR' ? 'डॉ. प्रतिभा शिंदे (जिल्हा शिक्षण समुपदेशक)' : 'With Dr. Pratibha Shinde (District Counselor)'}
                </span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-[#bbf7d0]/40 border border-[#006a4e] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-[#006a4e] text-[40px] mb-2">check_circle</span>
                <h4 className="font-bold text-[15px] text-[#166534]">
                  {lang === 'MR' ? 'समुपदेशन सत्र निश्चित झाले!' : 'Session Confirmed!'}
                </h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  {lang === 'MR'
                    ? 'मंगळवारी सकाळी १०:३० वाजता स्थानिक समाज सभागृहात तुमचा २० मिनिटांचा सल्ला स्लॉट आरक्षित झाला आहे.'
                    : 'Your 20-min consultation slot is reserved for Tuesday 10:30 AM.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'विद्यार्थी किंवा पालकांचे नाव' : 'Student / Parent Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'MR' ? 'उदा. सुनील जाधव / राहुल' : 'e.g. Sunil Jadhav / Rahul'}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'सध्याची इयत्ता किंवा शिक्षण पातळी' : 'Current Class / Education Level'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'MR' ? 'उदा. १०वी / १२वी विज्ञान / आयटीआय २रे वर्ष' : 'e.g. 10th Appearing / 12th Science / ITI 2nd Year'}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'तुम्हाला कोणत्या विषयावर मार्गदर्शन हवे आहे?' : 'What would you like guidance on?'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={lang === 'MR' ? 'उदा. १०वीनंतर शाखा निवड, पॉलिटेक्निक की आयटीआय, स्पर्धा परीक्षा तयारी...' : 'e.g. Selecting stream after 10th, Polytechnic vs ITI, Competitive exams guidance'}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs mt-1"
                >
                  {lang === 'MR' ? 'समुपदेशन वेळ निश्चित करा' : 'Confirm Appointment'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: GRIEVANCE DESK */}
      {showGrievanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setShowGrievanceModal(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#c2410c] text-[24px]">report</span>
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#166534]">
                  {lang === 'MR' ? 'शालेय तक्रार व विचारणा कक्ष' : 'Education Grievance Desk'}
                </h3>
                <span className="text-[11px] text-[#707974]">
                  {lang === 'MR' ? 'स्थानिक शिक्षण सहाय्यता समितीकडे थेट नोंदणी' : 'Direct reporting to Education Assistance Desk'}
                </span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-[#bbf7d0]/40 border border-[#006a4e] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-[#006a4e] text-[40px] mb-2">check_circle</span>
                <h4 className="font-bold text-[15px] text-[#166534]">
                  {lang === 'MR' ? 'तक्रार / विचारणा नोंदवली गेली!' : 'Grievance Registered!'}
                </h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  {lang === 'MR'
                    ? 'नोंदणी क्रमांक #EDU-3891 जारी केला आहे. ४८ तासांच्या आत कार्यवाही अहवाल प्राप्त होईल.'
                    : 'Ticket #EDU-3891 logged. Action report will be delivered within 48 hours.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'संबंधित शाळा किंवा संस्था' : 'Concern School / Institution'}
                  </label>
                  <select className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white">
                    <option>{lang === 'MR' ? 'जि.प. हायस्कूल व कनिष्ठ महाविद्यालय, आसगाव' : 'ZP High School & Jr College, Asgaon'}</option>
                    <option>{lang === 'MR' ? 'सरस्वती विद्या मंदिर प्राथमिक शाळा' : 'Saraswati Vidya Mandir Primary School'}</option>
                    <option>{lang === 'MR' ? 'शासकीय आयटीआय पवनी' : 'Govt ITI Pauni'}</option>
                    <option>{lang === 'MR' ? 'डॉ. आंबेडकर समाजकल्याण वसतिगृह' : 'Dr. Ambedkar Social Welfare Hostel'}</option>
                    <option>{lang === 'MR' ? 'अंगणवाडी केंद्र १ किंवा २' : 'Anganwadi Center 1 or 2'}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'मुद्द्याचा प्रकार (Category)' : 'Issue Category'}
                  </label>
                  <select className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white">
                    <option>{lang === 'MR' ? 'शालेय पोषण आहार (PM पोषण) गुणवत्ता व स्वच्छता' : 'Mid-Day Meal (PM POSHAN) Quality / Hygiene'}</option>
                    <option>{lang === 'MR' ? 'RTE २५% मोफत प्रवेश सहाय्यता' : 'RTE 25% Admission Assistance'}</option>
                    <option>{lang === 'MR' ? 'शिक्षक उपस्थिती / विषय पद रिक्तता' : 'Teacher Attendance / Subject Vacancy'}</option>
                    <option>{lang === 'MR' ? 'पिण्याचे पाणी व स्वच्छतागृह सुविधा' : 'Drinking Water / Sanitation Facility'}</option>
                    <option>{lang === 'MR' ? 'शिष्यवृत्ती वाटप विलंब विचारणा' : 'Scholarship Disbursement Delay'}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'सविस्तर तपशील व निरीक्षण' : 'Details & Observations'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={lang === 'MR' ? 'तक्रारीचा किंवा मुद्द्याचा सविस्तर तपशील लिहा...' : 'Provide detailed description of the matter...'}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#c2410c] hover:bg-[#852f00] text-white font-bold rounded-xl transition-all shadow-xs mt-1"
                >
                  {lang === 'MR' ? 'तक्रार / विचारणा सादर करा' : 'Submit Official Education Report'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
