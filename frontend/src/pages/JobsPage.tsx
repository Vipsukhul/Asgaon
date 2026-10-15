import { LucideIcon } from '../components/LucideIcon';
import React, { useState } from 'react';
import { SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { id: 'All', label: lang === 'MR' ? 'सर्व संधी' : 'All Openings' },
    { id: 'farm', label: lang === 'MR' ? 'रोजंदारी व शेतमजूर' : 'Daily Wage & Farm Labor' },
    { id: 'staff', label: lang === 'MR' ? 'दुकान व कार्यालय कर्मचारी' : 'Shop & Office Staff' },
    { id: 'tech', label: lang === 'MR' ? 'कुशल तंत्रज्ञ व कारागीर' : 'Skilled Technicians & Artisans' },
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
      tagColor: 'bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]',
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
          { label: t('nav_jobs'), active: true }
        ]}

      />

      {/* 2. Hero Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e8e2d9] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="font-heading font-extrabold text-[26px] sm:text-[30px] text-[#166534] leading-tight mb-1">
            {lang === 'MR' ? 'ग्रामीण रोजगार मंच — स्थानिक नोकऱ्या व कामे' : 'Gramin Rojgar Manch — Local Village Job Board'}
          </h1>
          <p className="font-heading font-bold text-[15px] text-[#c2410c] mb-2">
            {lang === 'MR' ? 'स्थानिक रोजगार, रोजंदारी व कारागीर' : 'Local Jobs, Daily Wage & Skilled Trades'}
          </p>
        </div>

        {/* Right Action Box */}
        <div className="flex flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
          <button
            onClick={onPostJob}
            className="flex-1 sm:flex-initial py-2.5 px-3.5 sm:px-4 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs whitespace-nowrap cursor-pointer"
          >
            <LucideIcon name="post_add" className="text-[18px]" />
            <span>{lang === 'MR' ? 'जाहिरात करा' : 'Post a Job'}</span>
          </button>

          <button
            onClick={() => alert(lang === 'MR' ? 'उमेदवार नोंदणी फॉर्म उघडला आहे.' : 'Candidate registration modal opened.')}
            className="flex-1 sm:flex-initial py-2.5 px-3.5 sm:px-4 rounded-xl bg-[#f9f3ea] hover:bg-[#f3ede4] text-[#1d1b16] text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#e8e2d9] whitespace-nowrap cursor-pointer"
          >
            <LucideIcon name="how_to_reg" className="text-[18px]" />
            <span>{lang === 'MR' ? 'नोंदणी करा' : 'Register'}</span>
          </button>
        </div>
      </div>

      {/* 3. Four Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] flex items-center justify-center shrink-0">
            <LucideIcon name="work" className="text-[22px]" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-[20px] text-[#166534]">{allJobs.length}</div>
            <div className="text-[11px] font-bold text-[#707974] uppercase">
              {lang === 'MR' ? 'सध्याच्या संधी (आसगाव परिसर)' : 'Active Openings (Asgaon Area)'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#fed7aa] text-[#c2410c] flex items-center justify-center shrink-0">
            <LucideIcon name="payments" className="text-[22px]" />
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
            <LucideIcon name="verified" className="text-[22px]" />
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
            <LucideIcon name="engineering" className="text-[22px]" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-[20px] text-[#1d1b16]">14 Works</div>
            <div className="text-[11px] font-bold text-[#707974] uppercase">
              {lang === 'MR' ? 'मनरेगा सार्वजनिक कामे' : 'MGNREGA Rural Works'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Search & Unified Filter Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#e8e2d9] shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1">
            <LucideIcon name="search" className="absolute left-3 top-2.5 text-[#707974] text-[18px]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder={lang === 'MR' ? 'पद, मालक किंवा कौशल्यानुसार शोधा...' : 'Search jobs by role, employer, trade...'}
              className="w-full pl-9 sm:pl-10 pr-9 py-2.5 bg-[#f9f3ea] text-[#1d1b16] rounded-xl text-xs sm:text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); setCurrentPage(1); }}
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
            className={`relative shrink-0 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all shadow-xs ${(filterType !== 'All' || payRange !== 'All')
                ? 'bg-[#166534] text-white border-[#166534] ring-2 ring-[#166534]/20'
                : 'bg-[#f4efe8] text-[#1d1b16] border-[#e8e2d9] hover:bg-[#eae2d7]'
              }`}
            aria-label="Filter Jobs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'MR' ? 'फिल्टर' : 'Filter'}</span>
            {((filterType !== 'All' ? 1 : 0) + (payRange !== 'All' ? 1 : 0)) > 0 && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-stone-900 text-[10px] sm:text-[11px] font-black flex items-center justify-center">
                {(filterType !== 'All' ? 1 : 0) + (payRange !== 'All' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Chips (Micro Row) */}
        {((filterType !== 'All' ? 1 : 0) + (payRange !== 'All' ? 1 : 0)) > 0 && (
          <div className="pt-2 border-t border-[#f0eee8] flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] font-medium text-[#707974]">
              {lang === 'MR' ? 'सक्रिय फिल्टर्स:' : 'Active:'}
            </span>
            {filterType !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
                {categories.find((c) => c.id === filterType)?.label}
                <button onClick={() => { setFilterType('All'); setCurrentPage(1); }} className="hover:opacity-70 ml-0.5" aria-label="Clear category">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {payRange !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
                {payRange === 'daily' ? (lang === 'MR' ? 'रोजंदारी' : 'Daily Wage') : (lang === 'MR' ? 'मासिक' : 'Monthly')}
                <button onClick={() => { setPayRange('All'); setCurrentPage(1); }} className="hover:opacity-70 ml-0.5" aria-label="Clear pay range">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setFilterType('All');
                setPayRange('All');
                setCurrentPage(1);
              }}
              className="text-[11px] font-bold text-[#c2410c] hover:underline ml-1"
            >
              {lang === 'MR' ? 'सर्व काढा' : 'Clear all'}
            </button>
          </div>
        )}
      </div>

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
                    {lang === 'MR' ? 'रोजगार व काम फिल्टर्स' : 'Filter Job Openings'}
                  </h3>
                  <p className="text-[11px] text-[#707974]">
                    {lang === 'MR' ? 'कामाचे स्वरूप व वेतन श्रेणीनुसार निवडा' : 'Filter by trade category and pay schedule'}
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
                    {lang === 'MR' ? '१. कामाचे स्वरूप' : '1. Job Category'}
                  </span>
                  {filterType !== 'All' && (
                    <button
                      onClick={() => { setFilterType('All'); setCurrentPage(1); }}
                      className="text-[11px] text-[#c2410c] font-semibold hover:underline"
                    >
                      {lang === 'MR' ? 'सर्व दाखवा' : 'Reset'}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const isSelected = filterType === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setFilterType(cat.id); setCurrentPage(1); }}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${isSelected
                            ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                            : 'bg-[#fdfbf7] text-[#404945] border-[#e8e2d9] hover:bg-[#f4efe8]'
                          }`}
                      >
                        <span className="truncate">{cat.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pay Range Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-[#1d1b16] uppercase tracking-wider">
                    {lang === 'MR' ? '२. वेतन श्रेणी' : '2. Pay Range'}
                  </span>
                  {payRange !== 'All' && (
                    <button
                      onClick={() => { setPayRange('All'); setCurrentPage(1); }}
                      className="text-[11px] text-[#c2410c] font-semibold hover:underline"
                    >
                      {lang === 'MR' ? 'सर्व दाखवा' : 'Reset'}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'All', label: lang === 'MR' ? 'सर्व वेतन श्रेणी' : 'All Pay Ranges' },
                    { id: 'daily', label: lang === 'MR' ? 'रोजंदारी (₹५०० - ₹१,००० प्रति दिन)' : 'Daily Wage (₹500 - ₹1,000 / Day)' },
                    { id: 'monthly', label: lang === 'MR' ? 'मासिक वेतन (₹१२,००० - ₹२०,००० प्रति महिना)' : 'Monthly (₹12,000 - ₹20,000 / Month)' }
                  ].map((p) => {
                    const isSelected = payRange === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => { setPayRange(p.id); setCurrentPage(1); }}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${isSelected
                            ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                            : 'bg-[#fdfbf7] text-[#404945] border-[#e8e2d9] hover:bg-[#f4efe8]'
                          }`}
                      >
                        <span>{p.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#e8e2d9] bg-[#f9f3ea] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setFilterType('All');
                  setPayRange('All');
                  setCurrentPage(1);
                }}
                disabled={filterType === 'All' && payRange === 'All'}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${(filterType !== 'All' || payRange !== 'All')
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
                <span>
                  {lang === 'MR'
                    ? `संधी दाखवा (${filtered.length})`
                    : `Show ${filtered.length} Openings`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

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
                {lang === 'MR' ? 'नोकरी माहिती लोड होत आहे, कृपया प्रतीक्षा करा...' : 'Loading job vacancies...'}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
              <LucideIcon name="work_off" className="text-[48px] text-[#c2410c]" />
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
                className="bg-white card-hover-subtle rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${job.tagColor}`}>
                        {job.tagBadge}
                      </span>
                      <span className="text-[11px] font-bold text-[#166534] bg-[#a7f3d0] px-2 py-0.5 rounded">
                        {lang === 'MR' ? 'सत्यापित मालक' : job.certBadge}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[#707974]">{job.posted}</span>
                  </div>

                  <h3 className="font-heading font-extrabold text-[18px] text-[#1d1b16] mb-1">
                    {job.title}
                  </h3>
                  <div className="text-[12px] font-semibold text-[#c2410c] mb-3 flex items-center gap-1">
                    <LucideIcon name="apartment" className="text-[15px]" />
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
                <div className="pt-3 border-t border-[#f3ede4] flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <a
                      href={`tel:${job.phone}`}
                      className="px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0"
                    >
                      <LucideIcon name="call" className="text-[14px]" />
                      <span>{lang === 'MR' ? 'फोन करा' : 'Call'}</span>
                    </a>

                    <a
                      href={`https://wa.me/91${job.phone}?text=Hello,%20I%20saw%20your%20job%20posting%20for%20${encodeURIComponent(job.title)}%20on%20Digital%20Gaon.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 sm:px-3 py-1.5 rounded-lg bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#166534] text-[12px] font-bold flex items-center gap-1 border border-[#e8e2d9] shrink-0"
                    >
                      <LucideIcon name="chat" className="text-[14px] text-[#25D366]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <button
                    onClick={() => onApplyJob(job)}
                    className="text-[12px] font-bold text-[#c2410c] hover:underline flex items-center gap-0.5 shrink-0 whitespace-nowrap cursor-pointer ml-auto"
                  >
                    <span>{lang === 'MR' ? 'अर्ज करा' : 'Apply'}</span>
                    <LucideIcon name="arrow_forward" className="text-[14px]" />
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
                      className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition-colors ${validCurrentPage === pageNum
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
              <LucideIcon name="arrow_forward" className="text-[14px]" />
            </button>
          </div>

          {/* Widget 2: Instant Village Job Alerts */}
          <div className="bg-[#052e16] text-white rounded-2xl p-5 shadow-xs border border-[#166534]">
            <div className="flex items-center gap-2 mb-2">
              <LucideIcon name="notifications_active" className="text-[#a7f3d0] text-[22px]" />
              <h3 className="font-heading font-extrabold text-[15px] text-[#a7f3d0]">
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
                <LucideIcon name="check_circle" className="text-[14px] text-[#a7f3d0]" />
                <span>{lang === 'MR' ? 'सत्यापित स्थानिक नोकऱ्या' : 'Verified jobs'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <LucideIcon name="check_circle" className="text-[14px] text-[#a7f3d0]" />
                <span>{lang === 'MR' ? '१००% मोफत सूचना' : '100% free alerts, no fees ever'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <LucideIcon name="check_circle" className="text-[14px] text-[#a7f3d0]" />
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
              <LucideIcon name="groups" className="text-[#c2410c] text-[20px]" />
              <span>{lang === 'MR' ? 'थेट स्थानिक कामगारांशी संपर्क • १००% पडताळणी केलेले प्रोफाइल' : 'Direct connect with verified local worker profiles'}</span>
            </div>

            <button
              onClick={onPostJob}
              className="w-full py-2 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <LucideIcon name="add_circle" className="text-[15px]" />
              <span>{lang === 'MR' ? 'नोकरीची जाहिरात पोस्ट करा' : 'Post Vacancy'}</span>
            </button>
          </div>

          {/* Widget 4: MGNREGA 100 Days Guarantee */}
          <div className="bg-[#f9f3ea] rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center gap-2 text-[#166534] font-bold text-[14px] mb-1">
              <LucideIcon name="verified_user" className="text-[18px]" />
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
              <LucideIcon name="open_in_new" className="text-[14px]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
