import React, { useState } from 'react';
import type { Job } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

interface JobsPageProps {
  jobs?: Job[];
  onApplyJob: (job: any) => void;
  onPostJob: () => void;
  onNavigateHome?: () => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({ jobs = [], onApplyJob, onPostJob, onNavigateHome }) => {
  const { lang, t } = useLanguage();
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');
  const [payRange, setPayRange] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { id: 'All', label: lang === 'MR' ? 'सर्व संधी' : 'All Openings' },
    { id: 'farm', label: lang === 'MR' ? 'रोजंदारी व शेतमजूर' : 'Daily Wage & Farm Labor (रोजंदारी)' },
    { id: 'staff', label: lang === 'MR' ? 'दुकान व कार्यालय कर्मचारी' : 'Permanent Staff (Shop / Office)' },
    { id: 'tech', label: lang === 'MR' ? 'कुशल तंत्रज्ञ (वायरमन/टेक)' : 'Skilled Technical (Wireman / Tech)' },
    { id: 'women', label: lang === 'MR' ? 'महिला व बचत गट कामे' : 'Women & SHG Works' }
  ];

  const dynamicJobs = (jobs || []).map((j: any, idx: number) => {
    const titleLower = (j.title || '').toLowerCase();
    const typeLower = (j.employmentType || '').toLowerCase();
    const categoryKey = (typeLower.includes('staff') || titleLower.includes('clerk') || titleLower.includes('billing')) ? 'staff' :
                        (titleLower.includes('tech') || titleLower.includes('wireman') || titleLower.includes('solar') || titleLower.includes('electric')) ? 'tech' :
                        (titleLower.includes('teacher') || titleLower.includes('shiksha') || titleLower.includes('women')) ? 'women' : 'farm';

    return {
      id: j.id || `dyn-job-${idx}`,
      tagBadge: j.employmentType ? String(j.employmentType).toUpperCase() : 'ACTIVE VACANCY',
      tagColor: 'bg-[#bbf7d0] text-[#002117]',
      certBadge: 'Asgaon Verified Employer',
      posted: j.postedAgo || 'Recently Posted',
      title: j.title,
      employer: `${j.employerName || 'Village Enterprise'} • ${j.location || 'Asgaon'}`,
      rate: j.salaryRange || '₹600 - ₹900 / Day',
      rateSub: 'Direct Settlement',
      vacancies: 'Open Vacancy',
      vacanciesSub: j.requirements || 'Suitable for village youth',
      schedule: 'Full Time / Direct',
      scheduleSub: 'Immediate Joining',
      description: j.description || 'Village job opening verified by Gram Panchayat desk.',
      perks: ['Direct Payment', 'Zero Brokerage Fee'],
      phone: j.contactPhone || '9822104500',
      categoryKey
    };
  });

  const allJobs = dynamicJobs;

  const filtered = allJobs.filter((j) => {
    const matchesCat = filterType === 'All' || j.categoryKey === filterType;
    const matchesSearch =
      !search.trim() ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.employer.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase());
    const matchesPay =
      payRange === 'All' ||
      (payRange === 'daily' && (j.rate.toLowerCase().includes('day') || j.schedule.toLowerCase().includes('daily') || j.categoryKey === 'farm')) ||
      (payRange === 'monthly' && (j.rate.toLowerCase().includes('month') || j.schedule.toLowerCase().includes('full') || j.categoryKey === 'staff' || j.categoryKey === 'tech'));
    return matchesCat && matchesSearch && matchesPay;
  });

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedJobs = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* 1. Breadcrumb & Top Bar */}
      <Breadcrumb
        items={[
          { label: t('nav_home'), onClick: onNavigateHome },
          { label: lang === 'MR' ? 'ग्राम रोजगार मंच' : 'Jobs', active: true }
        ]}
        rightBadge={
          <div className="flex items-center gap-1.5 bg-[#bbf7d0] text-[#002117] px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[15px] text-[#002117]">verified</span>
            <span>{lang === 'MR' ? '१००% थेट स्थानिक रोजगार • शून्य दलाली' : '100% Direct Village Employment • No Middlemen Fee'}</span>
          </div>
        }
      />

      {/* 2. Hero Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e8e2d9] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold text-[#ba1a1a] bg-[#fef3c7] px-2 py-0.5 rounded uppercase tracking-wider">
              {lang === 'MR' ? 'सत्यापित रोजगार | शून्य दलाली' : 'VERIFIED EMPLOYMENT | ZERO BROKERAGE'}
            </span>
            <span className="text-[11px] text-[#707974]">
              {lang === 'MR' ? 'पवनी व हवेली तालुका परिसर' : 'Pauni Taluka • Haveli Boundary'}
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-[26px] sm:text-[30px] text-[#166534] leading-tight mb-1">
            {lang === 'MR' ? 'ग्रामीण रोजगार मंच — स्थानिक नोकऱ्या व कामे' : 'Gramin Rojgar Manch — Local Village Job Board'}
          </h1>
          <p className="font-heading font-bold text-[15px] text-[#c2410c] mb-2">
            {lang === 'MR' ? 'स्थानिक रोजगार, रोजंदारी व कारागीर' : 'Local Jobs, Daily Wage & Skilled Trades'}
          </p>

          <p className="text-[13px] text-[#404945] leading-relaxed">
            {lang === 'MR'
              ? 'आसगाव व परिसरातील ५ ते १५ किमी अंतरावरील थेट नोकऱ्या. गावातील तरुण, कुशल कारागीर, शेतमजूर आणि महिला बचत गटांसाठी थेट संपर्क.'
              : 'Zero-brokerage, verified local job opportunities within 5 to 15 km of Asgaon & Pauni. Connecting village youth, skilled technicians, daily wage laborers, and women self-help groups (SHGs) directly with employers.'}
          </p>
        </div>

        {/* Right Action Box */}
        <div className="flex flex-col gap-2.5 w-full lg:w-72 shrink-0">
          <button
            onClick={onPostJob}
            className="w-full py-2.5 px-4 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">post_add</span>
            <span>{lang === 'MR' ? 'नोकरीची जाहिरात करा' : 'Post a Job Vacancy'}</span>
          </button>

          <button
            onClick={() => alert(lang === 'MR' ? 'उमेदवार नोंदणी फॉर्म उघडला आहे.' : 'Candidate registration modal opened.')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#f9f3ea] hover:bg-[#f3ede4] text-[#1d1b16] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors border border-[#e8e2d9]"
          >
            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            <span>{lang === 'MR' ? 'उमेदवार नोंदणी करा' : 'Register as Job Seeker'}</span>
          </button>
        </div>
      </div>

      {/* 3. Four Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#bbf7d0] text-[#002117] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">work</span>
          </div>
          <div>
            <div className="font-heading font-extrabold text-[20px] text-[#166534]">{allJobs.length}</div>
            <div className="text-[11px] font-bold text-[#707974] uppercase">
              {lang === 'MR' ? 'सध्याच्या संधी (आसगाव परिसर)' : 'Active Openings (Asgaon Cluster)'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#fed7aa] text-[#c2410c] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">payments</span>
          </div>
          <div>
            <div className="font-heading font-extrabold text-[20px] text-[#c2410c]">₹650 - ₹950</div>
            <div className="text-[11px] font-bold text-[#707974] uppercase">
              {lang === 'MR' ? 'सरासरी रोजंदारी दर' : 'Avg Daily Wage Rate'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#dbe1ff] text-[#002873] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <div>
            <div className="font-heading font-extrabold text-[20px] text-[#002873]">100% Direct</div>
            <div className="text-[11px] font-bold text-[#707974] uppercase">
              {lang === 'MR' ? 'थेट मालकाशी फोनवर संपर्क' : 'No Middleman / Direct Phone'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#f3ede4] text-[#1d1b16] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">engineering</span>
          </div>
          <div>
            <div className="font-heading font-extrabold text-[20px] text-[#1d1b16]">14 Works</div>
            <div className="text-[11px] font-bold text-[#707974] uppercase">
              {lang === 'MR' ? 'मनरेगा सार्वजनिक कामे' : 'MGNREGA Rural Works'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex flex-col gap-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#707974] text-[20px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder={lang === 'MR' ? 'पद, मालक किंवा कौशल्यानुसार शोधा (उदा. ड्रायव्हर, हिशेबनीस, वायरमन, शेतमजूर)...' : 'Search by job role, employer, village (e.g. Tractor Driver, Accountant, ZP Teacher, Electrician)...'}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f9f3ea] text-[#1d1b16] rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <select
              value={payRange}
              onChange={(e) => { setPayRange(e.target.value); setCurrentPage(1); }}
              className="bg-[#f9f3ea] text-[#1d1b16] p-2 rounded-xl text-[12px] font-bold border border-[#e8e2d9] focus:outline-none"
            >
              <option value="All">{lang === 'MR' ? 'सर्व वेतन श्रेणी' : 'All Pay Ranges'}</option>
              <option value="daily">{lang === 'MR' ? 'रोजंदारी (₹५०० - ₹१,०००)' : 'Daily Wage (₹500 - ₹1,000)'}</option>
              <option value="monthly">{lang === 'MR' ? 'मासिक (₹१२,००० - ₹२०,०००)' : 'Monthly (₹12,000 - ₹20,000)'}</option>
            </select>
          </div>
        </div>

        {/* Categories Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setFilterType(cat.id); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap ${
                filterType === cat.id
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-[#f3ede4] text-[#404945] hover:bg-[#e8e2d9] border border-[#e8e2d9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Cards List (2 cols wide) */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-[17px] text-[#166534]">
              {lang === 'MR' ? 'स्थानिक रोजगार संधी' : 'Verified Village Openings'}{' '}
              <span className="text-[13px] font-normal text-[#707974]">
                ({lang === 'MR'
                  ? `दाखवत आहे ${filtered.length > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, filtered.length)} / एकूण ${filtered.length} संधी`
                  : `Showing ${filtered.length > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, filtered.length)} of ${filtered.length} openings`})
              </span>
            </h2>
          </div>

          {allJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-[#166534] border-t-transparent rounded-full animate-spin mb-1" />
              <p className="text-[13px] font-bold text-[#166534]">
                {lang === 'MR' ? 'नोकरी माहिती लोड होत आहे, कृपया प्रतीक्षा करा...' : 'Connecting to database & loading job vacancies...'}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-[#c2410c]">work_off</span>
              <h3 className="font-heading font-bold text-[18px] text-[#166534]">
                {lang === 'MR' ? 'एकही नोकरी आढळली नाही' : 'No matching job openings'}
              </h3>
              <p className="text-[13px] text-[#707974] max-w-md">
                {lang === 'MR'
                  ? 'निवडलेल्या निकषांनुसार कोणतीही नोकरी उपलब्ध नाही. सर्व नोकऱ्या पाहण्यासाठी फिल्टर्स रीसेट करा.'
                  : 'No jobs match your selected category, search query, or pay range. Try clearing filters to see all village opportunities.'}
              </p>
              <button
                onClick={() => { setFilterType('All'); setSearch(''); setPayRange('All'); setCurrentPage(1); }}
                className="px-4 py-2 bg-[#166534] text-white text-[12px] font-bold rounded-xl hover:bg-[#052e16] transition-colors"
              >
                {lang === 'MR' ? 'सर्व फिल्टर्स रीसेट करा' : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            paginatedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${job.tagColor}`}>
                        {job.tagBadge}
                      </span>
                      <span className="text-[11px] font-bold text-[#166534] bg-[#bbf7d0] px-2 py-0.5 rounded">
                        {lang === 'MR' ? 'सत्यापित मालक' : job.certBadge}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[#707974]">{job.posted}</span>
                  </div>

                  <h3 className="font-heading font-extrabold text-[18px] text-[#1d1b16] mb-1">
                    {job.title}
                  </h3>
                  <div className="text-[12px] font-semibold text-[#c2410c] mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">apartment</span>
                    <span>{job.employer}</span>
                  </div>

                  {/* 3-Column Pay & Role Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] mb-3.5 text-[12px]">
                    <div>
                      <div className="text-[10px] font-bold text-[#707974] uppercase">
                        {lang === 'MR' ? 'तासिका / रोजंदारी दर' : 'Hourly / Daily Rate'}
                      </div>
                      <div className="font-heading font-extrabold text-[15px] text-[#166534]">{job.rate}</div>
                      <div className="text-[10px] text-[#707974]">{job.rateSub}</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-[#707974] uppercase">
                        {lang === 'MR' ? 'जागा व अनुभव' : 'Vacancies & Experience'}
                      </div>
                      <div className="font-bold text-[#1d1b16]">{job.vacancies}</div>
                      <div className="text-[10px] text-[#707974]">{job.vacanciesSub}</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-[#707974] uppercase">
                        {lang === 'MR' ? 'वेळ व देयक' : 'Payment / Timing'}
                      </div>
                      <div className="font-bold text-[#1d1b16]">{job.schedule}</div>
                      <div className="text-[10px] text-[#707974]">{job.scheduleSub}</div>
                    </div>
                  </div>

                  <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
                    <strong className="text-[#1d1b16]">{lang === 'MR' ? 'कामाचे स्वरूप व पात्रता: ' : 'Work Role & Eligibility: '}</strong>
                    {job.description}
                  </p>

                  {/* Perks tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {job.perks.map((p: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-[#f3ede4] text-[#404945] px-2 py-0.5 rounded-md border border-[#e8e2d9]"
                      >
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-3 border-t border-[#f3ede4] flex flex-wrap items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${job.phone}`}
                      className="px-3.5 py-1.5 rounded-lg bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      <span>{lang === 'MR' ? 'थेट फोन करा' : 'Direct Call Employer'}</span>
                    </a>

                    <a
                      href={`https://wa.me/91${job.phone}?text=Hello,%20I%20saw%20your%20job%20posting%20for%20${encodeURIComponent(job.title)}%20on%20Digital%20Gaon.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#166534] text-[12px] font-bold flex items-center gap-1 border border-[#e8e2d9]"
                    >
                      <span className="material-symbols-outlined text-[14px] text-[#25D366]">chat</span>
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <button
                    onClick={() => onApplyJob(job)}
                    className="text-[12px] font-bold text-[#c2410c] hover:underline flex items-center gap-0.5"
                  >
                    <span>{lang === 'MR' ? 'प्रोफाइलद्वारे अर्ज करा' : 'Apply via Village Profile'}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Dynamic Pagination Strip */}
          <div className="bg-white rounded-xl p-3 border border-[#e8e2d9] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#707974] gap-2 mt-2">
            <span>
              {lang === 'MR'
                ? `दाखवत आहे ${filtered.length > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, filtered.length)} / एकूण ${filtered.length} संधी`
                : `Showing ${filtered.length > 0 ? startIndex + 1 : 0}-${Math.min(startIndex + pageSize, filtered.length)} of ${filtered.length} active openings`}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  disabled={validCurrentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                      onClick={() => setCurrentPage(pageNum)}
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-7 h-7 rounded-lg bg-[#f3ede4] text-[#1d1b16] font-bold flex items-center justify-center disabled:opacity-40 hover:bg-[#e8e2d9] transition-colors"
                  aria-label="Next Page"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sidebars (1 col wide) */}
        <div className="flex flex-col gap-5">
          {/* Widget 1: Kisan & Village Labor Wage Standard */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2410c] bg-[#fef9ee] px-2 py-0.5 rounded border border-[#fed7aa]">
              {lang === 'MR' ? 'स्थानिक वेतन मापदंड' : 'CIVIC WAGE BENCHMARK'}
            </span>

            <h3 className="font-heading font-extrabold text-[16px] text-[#166534] mt-2 mb-1">
              {lang === 'MR' ? 'शेतकरी व ग्रामीण मजूर वेतन दर' : 'Kisan & Village Labor Wage Standard'}
            </h3>
            <p className="text-[11px] text-[#707974] mb-3">
              {lang === 'MR'
                ? 'परिसरातील प्रचलित सरासरी वेतन दर (स्थानिक संदर्भ):'
                : 'Current average prevailing wage rates in village cluster:'}
            </p>

            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">{lang === 'MR' ? 'दैनिक शेतमजूर (महिला)' : 'Daily Farm Labour (Female)'}</span>
                <span className="font-extrabold text-[#c2410c]">₹350 - ₹400 / {lang === 'MR' ? 'दिवस' : 'day'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">{lang === 'MR' ? 'कापूस वेचणी मजूर' : 'Women Farm Labour (Cotton picking)'}</span>
                <span className="font-extrabold text-[#166534]">₹400 / {lang === 'MR' ? 'दिवस' : 'day'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">{lang === 'MR' ? 'ट्रॅक्टर + चालक (जड काम)' : 'Tractor + Operator (Heavy Work)'}</span>
                <span className="font-extrabold text-[#166534]">₹900 - ₹1,000 / {lang === 'MR' ? 'तास' : 'hr'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">{lang === 'MR' ? 'गवंडी / मिस्त्री (कुशल बांधकाम)' : 'Mason / Mistri (Skilled Civil)'}</span>
                <span className="font-extrabold text-[#c2410c]">₹850 / {lang === 'MR' ? 'दिवस' : 'day'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#f9f3ea] border border-[#e8e2d9]">
                <span className="text-[#1d1b16] font-semibold">{lang === 'MR' ? 'पेंटर / प्लंबर (कुशल काम)' : 'Skilled Painter / Plumber (Daily)'}</span>
                <span className="font-extrabold text-[#166534]">₹750 - ₹850 / {lang === 'MR' ? 'दिवस' : 'day'}</span>
              </div>
            </div>

            <button
              onClick={() => alert(lang === 'MR' ? 'वेतन दर मार्गदर्शक सूची PDF डाऊनलोड होत आहे.' : 'Official Wage Standard Gazette PDF downloaded.')}
              className="mt-3 text-[12px] text-[#166534] font-bold hover:underline flex items-center gap-1"
            >
              <span>{lang === 'MR' ? 'वेतन दर मार्गदर्शक PDF डाऊनलोड करा' : 'Download Wage Benchmark PDF'}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Widget 2: Instant Village Job Alerts */}
          <div className="bg-[#052e16] text-white rounded-2xl p-5 shadow-xs border border-[#166534]">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#bbf7d0] text-[22px]">notifications_active</span>
              <h3 className="font-heading font-extrabold text-[15px] text-[#bbf7d0]">
                {lang === 'MR' ? 'झटपट नोकरी अलर्ट्स!' : 'Instant Village Job Alerts!'}
              </h3>
            </div>

            <p className="text-[12px] text-white/90 leading-relaxed mb-3">
              {lang === 'MR'
                ? 'नवीन नोकऱ्यांची माहिती तुमच्या मोबाईलवर एसएमएस किंवा व्हॉट्सॲपवर मोफत मिळवा. शून्य दलाली.'
                : 'Get free SMS & WhatsApp notifications of all new village job vacancies directly to your phone. Zero middleman fees.'}
            </p>

            <ul className="space-y-1.5 text-[11px] text-white/80 mb-4">
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#bbf7d0]">check_circle</span>
                <span>{lang === 'MR' ? 'सत्यापित स्थानिक नोकऱ्या' : 'Verified jobs'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#bbf7d0]">check_circle</span>
                <span>{lang === 'MR' ? '१००% मोफत सूचना' : '100% free alerts, no fees ever'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#bbf7d0]">check_circle</span>
                <span>{lang === 'MR' ? 'थेट मालकांशी संपर्क' : 'Direct connect to employers'}</span>
              </li>
            </ul>

            <button
              onClick={() => alert(lang === 'MR' ? 'तुमच्या क्रमांकासाठी मोफत नोकरी अलर्ट सुरू झाले आहे.' : 'Free job alert subscription activated for your mobile number.')}
              className="w-full py-2.5 rounded-xl bg-[#c2410c] hover:bg-[#852f00] text-white text-[12px] font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
            >
              <span>{lang === 'MR' ? '१-क्लिकमध्ये मोफत नोंदणी करा' : 'Create Free Profile in 1-Click'}</span>
            </button>
          </div>

          {/* Widget 3: Need Farm or Shop Workers? */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <h3 className="font-heading font-extrabold text-[15px] text-[#166534] mb-1">
              {lang === 'MR' ? 'शेती किंवा दुकानासाठी कामगार हवेत?' : 'Need Farm or Shop Workers?'}
            </h3>
            <p className="text-[11px] text-[#707974] mb-3">
              {lang === 'MR'
                ? 'तुमची शेतीची किंवा दुकानाची नोकरी जाहिरात करा. परिसरातील हजारो नागरिकांपर्यंत मोफत पोहोचा.'
                : 'Post your farm requirement, tractor helper opening, or shop vacancy. Reach local residents within 24 hours.'}
            </p>

            <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] text-[11px] text-[#404945] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c2410c] text-[20px]">groups</span>
              <span>{lang === 'MR' ? 'थेट स्थानिक कामगारांशी संपर्क • १००% पडताळणी केलेले प्रोफाइल' : 'Direct connect with verified local worker profiles'}</span>
            </div>

            <button
              onClick={onPostJob}
              className="w-full py-2 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">add_circle</span>
              <span>{lang === 'MR' ? 'नोकरीची जाहिरात पोस्ट करा' : 'Post Vacancy'}</span>
            </button>
          </div>

          {/* Widget 4: MGNREGA 100 Days Guarantee */}
          <div className="bg-[#f9f3ea] rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center gap-2 text-[#166534] font-bold text-[14px] mb-1">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>{lang === 'MR' ? 'मनरेगा १०० दिवस रोजगार हमी' : 'MGNREGA 100 Days Guarantee'}</span>
            </div>
            <p className="text-[11px] text-[#707974] leading-relaxed mb-3">
              {lang === 'MR'
                ? 'कायद्यानुसार प्रत्येक ग्रामीण कुटुंबाला वर्षाला १०० दिवसांचा अकुशल मजुरी रोजगार मिळण्याचा अधिकार आहे.'
                : 'Every rural household is entitled to 100 days of manual wage employment per year by law.'}
            </p>
            <a
              href="https://nrega.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[#c2410c] font-bold hover:underline flex items-center gap-1"
            >
              <span>{lang === 'MR' ? 'मनरेगा जॉब कार्डसाठी अर्ज करा' : 'Apply for MGNREGA Job Card'}</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
