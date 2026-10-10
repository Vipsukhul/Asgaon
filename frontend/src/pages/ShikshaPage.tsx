import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEOHead } from '../components/SEOHead';
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
        <div className="bg-[#a63b00] text-white px-4 py-2.5 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-[#fff8f0] font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              LIVE NOTICE
            </span>
            <span>
              <strong>{notice.headline}</strong> • {notice.subtext}
            </span>
          </div>
          <button
            onClick={() => setShowDeskModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 border border-white/30"
          >
            <span>{notice.actionLabel || 'View Details'}</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* 2. BREADCRUMBS & TALUKA CONTACTS */}
      <Breadcrumb
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Shiksha & Education (शिक्षण आणि करिअर)', active: true }
        ]}
        rightBadge={
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-[#006a4e] flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px]">call</span>
              <span>Education Helpline: 07185-224410 (Pauni Taluka)</span>
            </span>
            <span className="text-[#707974] hidden md:inline">|</span>
            <span className="text-[#a63b00] font-semibold hidden md:inline">ZP Education Directory</span>
          </div>
        }
      />

      {/* 3. HERO BANNER */}
      <div className="bg-gradient-to-br from-[#003629]/5 via-white to-[#003629]/10 rounded-2xl p-6 sm:p-8 border border-[#c4d6cf] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="font-heading font-extrabold text-[26px] sm:text-[30px] text-[#003629] leading-tight mb-1">
            Shiksha &amp; Youth Development Portal
          </h1>
          <h2 className="text-[14px] sm:text-[15px] font-bold text-[#a63b00] mb-2">
            शिक्षण आणि युवा विकास मंच — आसगाव व पवनी परिसर
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#404945] max-w-2xl leading-relaxed">
            Comprehensive village school directory, government scholarship updates, 24x7 digital study rooms, accredited skill training, and career counseling for students of Asgaon Gram Panchayat.
          </p>
        </div>

        {/* 3 Dynamic Counters */}
        <div className="grid grid-cols-3 gap-3 shrink-0 self-stretch sm:self-auto">
          <div className="bg-white p-3 rounded-xl border border-[#e8e2d9] text-center shadow-xs flex flex-col justify-center min-w-[85px]">
            <span className="font-black text-[22px] text-[#003629]">{schools.length}</span>
            <span className="text-[10px] text-[#707974] uppercase font-bold">शाळा व संस्था</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#e8e2d9] text-center shadow-xs flex flex-col justify-center min-w-[85px]">
            <span className="font-black text-[22px] text-[#a63b00]">{scholarships.length}</span>
            <span className="text-[10px] text-[#707974] uppercase font-bold">शिष्यवृत्ती</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#e8e2d9] text-center shadow-xs flex flex-col justify-center min-w-[85px]">
            <span className="font-black text-[22px] text-[#006a4e]">{abhyasika.availableDesks}</span>
            <span className="text-[10px] text-[#707974] uppercase font-bold">मोफत जागा</span>
          </div>
        </div>
      </div>

      {/* 4 ACTION BUTTONS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <a
          href="#scholarships"
          className="p-3 bg-[#003629] hover:bg-[#00281e] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all text-center"
        >
          <span className="material-symbols-outlined text-[18px]">school</span>
          <span>Apply for MahaDBT Scholarships (शिष्यवृत्ती)</span>
        </a>
        <button
          onClick={() => setShowDeskModal(true)}
          className="p-3 bg-[#a63b00] hover:bg-[#852f00] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all text-center"
        >
          <span className="material-symbols-outlined text-[18px]">local_library</span>
          <span>ZP Digital Study Room Booking (अभ्यासिका)</span>
        </button>
        <a
          href="#schools"
          className="p-3 bg-white hover:bg-[#f3ede4] text-[#003629] border border-[#e8e2d9] rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all text-center"
        >
          <span className="material-symbols-outlined text-[18px]">account_balance</span>
          <span>Explore Local Schools</span>
        </a>
        <a
          href="https://wa.me/919422811204"
          target="_blank"
          rel="noreferrer"
          className="p-3 bg-white hover:bg-[#f3ede4] text-[#006a4e] border border-[#baeed9] rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all text-center"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span>WhatsApp Mentor Desk</span>
        </a>
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
                  <h2 className="font-heading font-extrabold text-[20px] text-[#003629]">
                    Local Schools &amp; Colleges
                  </h2>
                  <p className="text-[12px] text-[#707974]">
                    in Asgaon + Pauni (ZP and Aided / Non-Aided)
                  </p>
                </div>
              </div>
              <button className="text-[12px] font-bold text-[#006a4e] hover:underline self-start sm:self-auto">
                All Application Forms &gt;
              </button>
            </div>

            {/* Filter categories pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[12px] font-medium no-scrollbar">
              {[
                { id: 'all', label: `सर्व शाळा (${schools.length})` },
                { id: 'highschool', label: 'हायस्कूल व कनिष्ठ महाविद्यालय' },
                { id: 'primary', label: 'प्राथमिक शाळा' },
                { id: 'technical', label: 'आयटीआय व तांत्रिक' },
                { id: 'hostel', label: 'वसतिगृह' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSchoolCategoryFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                    schoolCategoryFilter === f.id
                      ? 'bg-[#003629] text-white shadow-xs'
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
                          <span className="bg-[#baeed9] text-[#002117] text-[10px] font-extrabold px-2 py-0.5 rounded">
                            {school.badge}
                          </span>
                          <span className="bg-[#f3ede4] text-[#404945] text-[10px] font-bold px-2 py-0.5 rounded">
                            {school.medium}
                          </span>
                          <span className="bg-[#fff8f0] text-[#a63b00] text-[10px] font-bold px-2 py-0.5 rounded border border-[#ffe0cc]">
                            इयत्ता: {school.grades}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-[16px] text-[#003629] leading-snug hover:text-[#a63b00] transition-colors">
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
                          {school.principalName ? `मुख्याध्यापक: ${school.principalName}` : school.address} {school.contactPhone ? `(${school.contactPhone})` : ''}
                        </span>
                        <div className="flex items-center gap-2">
                          {onSelectShikshaSlug && (
                            <button
                              type="button"
                              onClick={() => onSelectShikshaSlug(school.id)}
                              className="py-1.5 px-3 bg-[#002873] hover:bg-[#00174b] text-white text-[11px] font-bold rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs"
                            >
                              <span>Campus Page</span>
                              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                            </button>
                          )}
                          {school.contactPhone ? (
                            <a
                              href={`tel:${school.contactPhone}`}
                              className="py-1.5 px-3 bg-[#003629] hover:bg-[#00281e] text-white text-[11px] font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">call</span>
                              <span>संपर्क साधा</span>
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
                <span className="material-symbols-outlined text-[#a63b00] text-[24px]">workspace_premium</span>
                <div>
                  <h2 className="font-heading font-extrabold text-[20px] text-[#003629]">
                    Student Scholarship Guidance Desk
                  </h2>
                  <p className="text-[12px] text-[#707974]">
                    Direct Benefit Transfer (DBT) eligible central &amp; state govt education schemes
                  </p>
                </div>
              </div>
              <a
                href="https://mahadbt.maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-[#a63b00] hover:underline flex items-center gap-1 self-start sm:self-auto bg-[#fff8f0] px-3 py-1 rounded-md border border-[#ffe0cc]"
              >
                <span>MahaDBT Official Portal</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>

            {/* Filter pills for scholarships */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[12px] font-medium no-scrollbar">
              {[
                { id: 'all', label: `सर्व शिष्यवृत्ती (${scholarships.length})` },
                { id: 'matric', label: 'मॅट्रिकोत्तर (Post-Matric)' },
                { id: 'open', label: 'खुला प्रवर्ग / EWS' },
                { id: 'girls', label: 'मुलींसाठी विशेष' },
                { id: 'merit', label: 'गुणवत्ता परीक्षा (NMMS)' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setScholarshipFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                    scholarshipFilter === f.id
                      ? 'bg-[#a63b00] text-white shadow-xs'
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
                        <span className="bg-[#baeed9] text-[#002117] text-[9px] font-black uppercase px-2 py-0.5 rounded">
                          {sch.badge}
                        </span>
                        <span className="text-[10px] text-[#ba1a1a] font-bold">शेवटची तारीख: {sch.deadline}</span>
                      </div>
                      <h3 className="font-heading font-bold text-[14px] text-[#003629] leading-snug">
                        {sch.title}
                      </h3>
                      <p className="text-[11px] text-[#404945] leading-relaxed mt-1 mb-3">
                        {sch.description}
                      </p>

                      <div className="bg-[#f3ede4]/50 p-2.5 rounded-lg flex flex-col gap-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-[#707974]">लाभ / रक्कम:</span>
                          <strong className="text-[#003629]">{sch.benefit}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#707974]">कौटुंबिक उत्पन्न मर्यादा:</span>
                          <strong className="text-[#003629]">{sch.incomeLimit}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#707974]">विभाग:</span>
                          <span className="text-[#003629] text-[10px]">{sch.department}</span>
                        </div>
                        {sch.eligibility && (
                          <div className="flex justify-between pt-1 border-t border-[#e8e2d9]">
                            <span className="text-[#707974]">पात्रता:</span>
                            <span className="text-[#006a4e] font-semibold text-[10px] text-right max-w-[180px]">{sch.eligibility}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#f3ede4]">
                      <span className="text-[10px] text-[#006a4e] font-semibold">आधार संलग्न DBT अनिवार्य</span>
                      <a
                        href={sch.officialUrl || "https://mahadbt.maharashtra.gov.in"}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 px-3 bg-[#003629] hover:bg-[#00281e] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>अर्ज करा</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* SECTION 3: DOCUMENT CHECKLIST FOR MAHADBT */}
          <div className="bg-[#fff8f0] rounded-2xl p-5 sm:p-6 border border-[#ffe0cc] shadow-xs flex flex-col gap-4">
            <div className="border-b border-[#ffe0cc] pb-3">
              <h3 className="font-heading font-bold text-[16px] text-[#003629]">
                Document Checklist for MahaDBT Verification (कागदपत्रे यादी)
              </h3>
              <p className="text-[12px] text-[#707974]">
                Keep clear scan-attested PDF copies (&lt;250 KB) ready before approaching the Asgaon CSC Kiosk or submitting online:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-xl border border-[#ffe0cc] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[20px] shrink-0 mt-0.5">badge</span>
                <div>
                  <h4 className="font-bold text-[11px] text-[#003629]">Domicile &amp; Age Proof</h4>
                  <p className="text-[10px] text-[#707974] leading-tight mt-0.5">
                    Maha E-Seva Hall Mark / Tahsil Building
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#ffe0cc] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[20px] shrink-0 mt-0.5">verified_user</span>
                <div>
                  <h4 className="font-bold text-[11px] text-[#003629]">Caste &amp; Validity Certificate</h4>
                  <p className="text-[10px] text-[#707974] leading-tight mt-0.5">
                    Sub-Divisional Magistrate / Vignyan
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#ffe0cc] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[20px] shrink-0 mt-0.5">receipt_long</span>
                <div>
                  <h4 className="font-bold text-[11px] text-[#003629]">Income Certificate (2025-26)</h4>
                  <p className="text-[10px] text-[#707974] leading-tight mt-0.5">
                    Issued by Tahsildar, Pauni
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#ffe0cc] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[20px] shrink-0 mt-0.5">account_balance_wallet</span>
                <div>
                  <h4 className="font-bold text-[11px] text-[#003629]">Aadhaar-NPCI Bank Passbook</h4>
                  <p className="text-[10px] text-[#707974] leading-tight mt-0.5">
                    Active DBT seeded SBI / BoM / PGB
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
                  <h2 className="font-heading font-extrabold text-[18px] sm:text-[20px] text-[#003629]">
                    {abhyasika.title}
                  </h2>
                  <p className="text-[12px] text-[#707974]">
                    डिजिटल अभ्यासिका व स्पर्धा परीक्षा केंद्र — Dedicated Free Public Study Facility
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#006a4e] bg-[#baeed9]/40 px-3 py-1 rounded-full border border-[#baeed9] self-start sm:self-auto">
                {abhyasika.availableDesks} जागा उपलब्ध (Free Entry with Smart Card)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#f3ede4]/40 p-3.5 rounded-xl border border-[#e8e2d9] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[22px] shrink-0">desk</span>
                <div>
                  <h4 className="font-bold text-[12px] text-[#003629]">{abhyasika.totalDesks} रीडिंग डेस्क</h4>
                  <p className="text-[11px] text-[#404945] mt-0.5">
                    शांत वातावरण, एर्गोनॉमिक चेअर्स व स्वतंत्र चार्जिंग पॉईंट्स.
                  </p>
                </div>
              </div>

              <div className="bg-[#f3ede4]/40 p-3.5 rounded-xl border border-[#e8e2d9] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[22px] shrink-0">wifi</span>
                <div>
                  <h4 className="font-bold text-[12px] text-[#003629]">{abhyasika.wifiSpeed}</h4>
                  <p className="text-[11px] text-[#404945] mt-0.5">
                    ऑनलाइन लेक्चर्स आणि मॉक टेस्टसाठी मोफत हाय-स्पीड इंटरनेट.
                  </p>
                </div>
              </div>

              <div className="bg-[#f3ede4]/40 p-3.5 rounded-xl border border-[#e8e2d9] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[22px] shrink-0">menu_book</span>
                <div>
                  <h4 className="font-bold text-[12px] text-[#003629]">{abhyasika.bookCount}</h4>
                  <p className="text-[11px] text-[#404945] mt-0.5">
                    MPSC, UPSC, पोलिस भरती, बँकिंग व संदर्भ पुस्तके.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#f3ede4]">
              <div>
                <span className="text-[10px] text-[#707974] block">अभ्यासिका दैनंदिन वेळ:</span>
                <strong className="text-[12px] text-[#003629]">{abhyasika.timings}</strong>
                <span className="text-[10px] text-[#55605a] block mt-0.5">
                  व्यवस्थापक / केअरटेकर: {abhyasika.caretakerName} ({abhyasika.caretakerRole})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {onSelectShikshaSlug && (
                  <button
                    type="button"
                    onClick={() => onSelectShikshaSlug('abhyasika')}
                    className="py-2.5 px-3.5 bg-[#002873] hover:bg-[#00174b] text-white text-[12px] font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <span>Full Study Hall Page</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                )}
                <button
                  onClick={() => setShowDeskModal(true)}
                  className="py-2.5 px-4 bg-[#003629] hover:bg-[#00281e] text-white text-[12px] font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  <span>मोफत जागा आरक्षित करा</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 5: LOCAL TUTORS, COACHING & SKILL CENTERS (Dynamic) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
            <div className="border-b border-[#f3ede4] pb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#a63b00] text-[22px]">diversity_3</span>
                  <h2 className="font-heading font-extrabold text-[20px] text-[#003629]">
                    Local Tutors, Coaching &amp; Skill Centers ({tutors.length})
                  </h2>
                </div>
                <p className="text-[12px] text-[#707974]">
                  गाव आणि परिसरातील खाजगी शिकवणी वर्ग आणि कौशल्य प्रशिक्षण केंद्रे
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
                    <h3 className="font-heading font-bold text-[14px] text-[#003629] leading-snug mt-1.5">
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
                    <span className="text-[#006a4e] font-bold">{tutor.feesInfo || 'सवलत दर'}</span>
                    {tutor.phone ? (
                      <a href={`tel:${tutor.phone}`} className="text-[#003629] font-bold hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>कॉल करा</span>
                      </a>
                    ) : (
                      <span className="text-[#707974]">माहिती उपलब्ध</span>
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
          <div className="bg-[#003629] text-white rounded-2xl p-5 shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#baeed9]">
                CAREER CLINIC
              </span>
              <span className="bg-[#baeed9]/20 text-[#baeed9] text-[9px] font-bold px-2 py-0.5 rounded">
                Every Saturday
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-[16px] leading-snug">
              Career Counseling &amp; Guidance Clinic
            </h3>

            <p className="text-[11px] text-[#e8e2d9] leading-relaxed">
              Weekly 1-on-1 career navigation session with District Educational Counselor <strong>Dr. Pratibha Shinde</strong> at the Gram Panchayat Hall.
            </p>

            <div className="bg-white/10 p-2.5 rounded-xl text-[11px] flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#baeed9]">event</span>
                <span>Next Session: <strong>Tuesday, 10:00 AM – 1:00 PM</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#baeed9]">location_on</span>
                <span>ZP Sabha Gruh, Pauni Road, Asgaon, 441910</span>
              </div>
            </div>

            <button
              onClick={() => setShowCounselingModal(true)}
              className="w-full py-2.5 bg-white hover:bg-[#fff8f0] text-[#003629] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span>Book 20-Min Slot</span>
            </button>
          </div>

          {/* WIDGET 2: PREVIOUS YEAR QUESTION PAPERS */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#f3ede4] pb-3">
              <span className="material-symbols-outlined text-[#006a4e] text-[22px]">download_for_offline</span>
              <div>
                <h3 className="font-heading font-bold text-[14px] text-[#003629]">
                  Previous Year Question Papers
                </h3>
                <span className="text-[10px] text-[#707974]">Free PDF downloads verified by ZP teachers</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[11px]">
              <a
                href="#download"
                className="p-2.5 rounded-lg border border-[#e8e2d9] hover:border-[#006a4e] hover:bg-[#baeed9]/10 transition-all flex items-center justify-between group"
              >
                <div>
                  <strong className="text-[#003629] block group-hover:text-[#006a4e]">
                    SSC 10th Board (2021-2026)
                  </strong>
                  <span className="text-[10px] text-[#707974]">Marathi / Maths / Science Solved Papers</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#707974] group-hover:text-[#006a4e]">download</span>
              </a>

              <a
                href="#download"
                className="p-2.5 rounded-lg border border-[#e8e2d9] hover:border-[#006a4e] hover:bg-[#baeed9]/10 transition-all flex items-center justify-between group"
              >
                <div>
                  <strong className="text-[#003629] block group-hover:text-[#006a4e]">
                    HSC 12th Board Science &amp; Arts
                  </strong>
                  <span className="text-[10px] text-[#707974]">Physics / Chemistry / Agri / Political</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#707974] group-hover:text-[#006a4e]">download</span>
              </a>

              <a
                href="#download"
                className="p-2.5 rounded-lg border border-[#e8e2d9] hover:border-[#006a4e] hover:bg-[#baeed9]/10 transition-all flex items-center justify-between group"
              >
                <div>
                  <strong className="text-[#003629] block group-hover:text-[#006a4e]">
                    TET / TAIT Model Papers (2025)
                  </strong>
                  <span className="text-[10px] text-[#707974]">Teacher Eligibility Paper 1 &amp; 2</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#707974] group-hover:text-[#006a4e]">download</span>
              </a>

              <a
                href="#download"
                className="p-2.5 rounded-lg border border-[#e8e2d9] hover:border-[#006a4e] hover:bg-[#baeed9]/10 transition-all flex items-center justify-between group"
              >
                <div>
                  <strong className="text-[#003629] block group-hover:text-[#006a4e]">
                    Maharashtra Police Constable
                  </strong>
                  <span className="text-[10px] text-[#707974]">Previous 5-year Bhandara district papers</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#707974] group-hover:text-[#006a4e]">download</span>
              </a>
            </div>

            <button className="w-full py-2 border border-[#e8e2d9] text-[#003629] hover:bg-[#f3ede4] text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
              <span>View Complete 25+ PDF Repository</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* WIDGET 3: EDUCATION GRIEVANCE DESK */}
          <div className="bg-[#fff8f0] rounded-2xl p-5 border border-[#ffe0cc] shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center gap-2 border-b border-[#ffe0cc] pb-3">
              <span className="material-symbols-outlined text-[#a63b00] text-[20px]">report</span>
              <div>
                <h3 className="font-heading font-bold text-[14px] text-[#a63b00]">
                  Education Grievance Desk
                </h3>
                <span className="text-[10px] text-[#707974]">शालेय तक्रार निवारण — Direct reporting</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 text-[11px] text-[#404945]">
              <div className="bg-white p-2.5 rounded-lg border border-[#ffe0cc]">
                <strong className="text-[#003629] block">Mid-Day Meal Quality Complaint:</strong>
                <p className="text-[10px] text-[#707974] mt-0.5 leading-tight">
                  Contact Headmaster or submit image on Panchayat portal (Action within 48 hours).
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-[#ffe0cc]">
                <strong className="text-[#003629] block">RTE 25% Free Admission Desk:</strong>
                <p className="text-[10px] text-[#707974] mt-0.5 leading-tight">
                  Verification and assistance ongoing for private schooling lottery entry for economically weaker wards.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowGrievanceModal(true)}
              className="w-full py-2 bg-[#a63b00] hover:bg-[#852f00] text-white text-[11px] font-bold rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
              <span>Submit an Education Complaint / Inquiry</span>
            </button>
          </div>

          {/* WIDGET 4: GRAM PANCHAYAT ENDORSEMENT */}
          <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#003629] text-[#baeed9] font-bold text-[12px] flex items-center justify-center shrink-0">
              GP
            </div>
            <div className="text-[11px] text-[#404945] leading-relaxed">
              <strong className="text-[#003629] block">
                Adv. Sachin Suresh More (Sarpanch)
              </strong>
              <span className="text-[10px] text-[#707974] block mb-1">Sunita Tai Telrandhe (Upsarpanch)</span>
              <p className="italic text-[10px]">
                &ldquo;Empowering every child with education is the singular pathway towards lasting village prosperity.&rdquo;
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
                <h3 className="font-heading font-extrabold text-[17px] text-[#003629]">
                  Reserve Study Room Desk
                </h3>
                <span className="text-[11px] text-[#707974]">Dr. APJ Abdul Kalam Gram Panchayat Abhyasika</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-[#baeed9]/40 border border-[#006a4e] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-[#006a4e] text-[40px] mb-2">check_circle</span>
                <h4 className="font-bold text-[15px] text-[#003629]">Study Desk Reserved!</h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  Desk #11 confirmed for your slot. Entry smart code sent via SMS.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={deskName}
                    onChange={(e) => setDeskName(e.target.value)}
                    placeholder="e.g. Rahul Sunil Jadhav"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Mobile Number (फॉर एसएमएस कन्फर्मेशन)</label>
                  <input
                    type="tel"
                    required
                    value={deskPhone}
                    onChange={(e) => setDeskPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Target Examination / Course</label>
                  <select
                    value={deskExam}
                    onChange={(e) => setDeskExam(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                  >
                    <option value="MPSC / State Services">MPSC / State Civil Services</option>
                    <option value="UPSC Civil Services">UPSC Civil Services</option>
                    <option value="Maharashtra Police Constable">Maharashtra Police Constable</option>
                    <option value="TET / TAIT Teacher Exam">TET / TAIT Teacher Exam</option>
                    <option value="10th / 12th Board">10th / 12th State Board</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Time Slot Preference</label>
                  <select
                    value={deskTime}
                    onChange={(e) => setDeskTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                  >
                    <option value="Morning (06:00 AM - 11:00 AM)">Morning (06:00 AM – 11:00 AM)</option>
                    <option value="Afternoon (11:00 AM - 04:00 PM)">Afternoon (11:00 AM – 04:00 PM)</option>
                    <option value="Evening (04:00 PM - 09:00 PM)">Evening (04:00 PM – 09:00 PM)</option>
                    <option value="Night Study (09:00 PM - 11:00 PM)">Night Study (09:00 PM – 11:00 PM)</option>
                  </select>
                </div>
                <div className="bg-[#baeed9]/30 p-2.5 rounded-lg border border-[#006a4e]/20 text-[11px] text-[#003629]">
                  100% Free for all Asgaon village students. High-speed WiFi &amp; inverter backup active.
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#003629] hover:bg-[#00281e] text-white font-bold rounded-xl transition-all shadow-xs mt-1"
                >
                  Confirm Free Desk Reservation
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
                <h3 className="font-heading font-extrabold text-[17px] text-[#003629]">
                  Book Career Counseling Slot
                </h3>
                <span className="text-[11px] text-[#707974]">With Dr. Pratibha Shinde (District Counselor)</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-[#baeed9]/40 border border-[#006a4e] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-[#006a4e] text-[40px] mb-2">check_circle</span>
                <h4 className="font-bold text-[15px] text-[#003629]">Session Confirmed!</h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  Your 20-min consultation slot is reserved for Tuesday 10:30 AM at ZP Sabha Gruh.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Student / Parent Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunil Jadhav / Rahul"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Current Class / Education Level</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10th Appearing / 12th Science / ITI 2nd Year"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">What would you like guidance on?</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Selecting stream after 10th, Polytechnic vs ITI, Competitive exams guidance"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#003629] hover:bg-[#00281e] text-white font-bold rounded-xl transition-all shadow-xs mt-1"
                >
                  Confirm Appointment
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
              <span className="material-symbols-outlined text-[#a63b00] text-[24px]">report</span>
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#003629]">
                  Education Grievance Desk
                </h3>
                <span className="text-[11px] text-[#707974]">Direct reporting to Panchayat Education Committee</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="bg-[#baeed9]/40 border border-[#006a4e] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-[#006a4e] text-[40px] mb-2">check_circle</span>
                <h4 className="font-bold text-[15px] text-[#003629]">Grievance Registered!</h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  Ticket #EDU-3891 logged. Action report will be delivered within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Concern School / Institution</label>
                  <select className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white">
                    <option>ZP High School &amp; Jr College, Asgaon</option>
                    <option>Saraswati Vidya Mandir Primary School</option>
                    <option>Govt ITI Pauni</option>
                    <option>Dr. Ambedkar Social Welfare Hostel</option>
                    <option>Anganwadi Center 1 or 2</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Issue Category</label>
                  <select className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white">
                    <option>Mid-Day Meal (PM POSHAN) Quality / Hygiene</option>
                    <option>RTE 25% Admission Assistance</option>
                    <option>Teacher Attendance / Subject Vacancy</option>
                    <option>Drinking Water / Sanitation Facility</option>
                    <option>Scholarship Disbursement Delay</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Details &amp; Observations</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide detailed description of the matter..."
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#a63b00] hover:bg-[#852f00] text-white font-bold rounded-xl transition-all shadow-xs mt-1"
                >
                  Submit Official Education Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
