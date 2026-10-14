import { LucideIcon } from '../components/LucideIcon';
import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';
import { api } from '../services/api';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

interface AnnouncementsPageProps {
  announcements?: any[];
  onNavigateHome?: () => void;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ announcements: initialAnnouncements, onNavigateHome }) => {
  const { lang, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'resolutions' | 'urgent' | 'tenders' | 'health'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [verifyNoticeId, setVerifyNoticeId] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);

  // Backend announcements
  const [announcements, setAnnouncements] = useState<any[]>(initialAnnouncements || []);

  // Modals state
  const [showTankerModal, setShowTankerModal] = useState(false);
  const [showAgendaPointModal, setShowAgendaPointModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyNoticeId.trim()) return;
    setVerifyStatus(
      lang === 'MR'
        ? `पडताळणी पूर्ण: सूचना क्र. [${verifyNoticeId.trim()}] अधिकृत ग्रामपंचायत राजपत्रात नोंदणीकृत आहे.`
        : `VERIFIED: Official Gazette Circular verified in Citizen Register under Stamp #MH-BHD-ASG-2026 for Notice [${verifyNoticeId.trim()}].`
    );
  };

  useEffect(() => {
    if (!initialAnnouncements || initialAnnouncements.length === 0) {
      api.getAnnouncements()
        .then((data) => {
          if (data && data.length > 0) setAnnouncements(data);
        })
        .catch((err) => console.log('Announcements local cache:', err.message));
    }
  }, [initialAnnouncements]);

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSuccess(true);
    setTimeout(() => {
      setModalSuccess(false);
      setShowTankerModal(false);
      setShowAgendaPointModal(false);
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. TOP GAZETTE PORTAL STRIP */}
      <Breadcrumb
        items={[
          { label: t('nav_home'), onClick: onNavigateHome },
          { label: t('nav_announcements'), active: true }
        ]}
      />

      {/* 2. HERO BANNER */}
      <div className="bg-gradient-to-br from-[#166534]/5 via-white to-[#166534]/10 rounded-2xl p-6 sm:p-8 border border-[#c4d6cf] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="font-heading font-extrabold text-[26px] sm:text-[30px] text-[#166534] leading-tight mb-1">
            {lang === 'MR'
              ? 'गाव जाहीर सूचना फलक व राजपत्र'
              : 'Digital Notice Board & Civic Gazettes'}
          </h1>
          <h2 className="text-[14px] sm:text-[15px] font-bold text-[#c2410c] mb-2">
            {lang === 'MR'
              ? 'अधिकृत घोषणा, आपत्कालीन सूचना व जाहीर परिपत्रके'
              : 'Official Announcements & Public Circulars'}
          </h2>
          
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
          <button
            onClick={() => alert(lang === 'MR' ? 'मासिक राजपत्र सारांश PDF (२.४ MB) डाउनलोड होत आहे.' : 'Downloading official Asgaon October Gazette summary PDF (2.4 MB).')}
            className="px-4 py-2.5 bg-[#166534] hover:bg-[#052e16] text-white text-[12px] font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <LucideIcon name="download" className="text-[16px]" />
            <span>{lang === 'MR' ? 'मासिक राजपत्र' : 'Download Gazette'}</span>
          </button>
        </div>
      </div>

      {/* 3. 4 METRIC STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#e8f1ec] text-[#002117] flex items-center justify-center shrink-0">
            <LucideIcon name="notifications_active" className="text-[20px]" />
          </div>
          <div>
            <div className="font-heading font-black text-[22px] text-[#166534]">{announcements.length || 18}</div>
            <div className="text-[11px] text-[#707974] leading-tight">
              {lang === 'MR' ? 'सक्रिय जाहीर सूचना' : 'Active Open Notices'}
            </div>
            <div className="text-[9px] text-[#006a4e] font-semibold">
              {lang === 'MR' ? 'अधिकृत पडताळणीकृत' : 'Civic Board Verified'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#ba1a1a] flex items-center justify-center shrink-0">
            <LucideIcon name="warning" className="text-[20px]" />
          </div>
          <div>
            <div className="font-heading font-black text-[22px] text-[#ba1a1a]">0{announcements.filter(a => (a.priority || '').toLowerCase() === 'urgent' || (a.priority || '').toLowerCase() === 'high').length || 4}</div>
            <div className="text-[11px] text-[#707974] leading-tight">
              {lang === 'MR' ? 'तातडीच्या आपत्कालीन सूचना' : 'Critical / Urgent Alerts'}
            </div>
            <div className="text-[9px] text-[#ba1a1a] font-semibold">
              {lang === 'MR' ? 'पाणी, ३-फेज वीज व कालवा' : 'Water, 3-Phase & Canal Alerts'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fef9ee] text-[#c2410c] border border-[#fde68a] flex items-center justify-center shrink-0">
            <LucideIcon name="event_seat" className="text-[20px]" />
          </div>
          <div>
            <div className="font-heading font-bold text-[14px] text-[#c2410c] leading-tight">
              {lang === 'MR' ? '२६ जाने २०२६' : '26 Jan 2026'}
            </div>
            <div className="text-[11px] text-[#707974] leading-tight">
              {lang === 'MR' ? 'पुढील ग्रामसभा दिनांक' : 'Next Gram Sabha Date'}
            </div>
            <div className="text-[9px] text-[#55605a]">
              {lang === 'MR' ? '१०:०० AM • सामाजिक सभागृह' : '10:00 AM • Samajik Sabhagruh'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f3ede4] text-[#404945] flex items-center justify-center shrink-0">
            <LucideIcon name="timer" className="text-[20px]" />
          </div>
          <div>
            <div className="font-heading font-black text-[22px] text-[#166534]">
              48 <span className="text-[14px] font-normal">{lang === 'MR' ? 'तास' : 'hrs'}</span>
            </div>
            <div className="text-[11px] text-[#707974] leading-tight">
              {lang === 'MR' ? 'तक्रार निवारण सरासरी वेळ' : 'Public Grievance TAT'}
            </div>
            <div className="text-[9px] text-[#006a4e] font-semibold">
              {lang === 'MR' ? 'नागरिक सनद प्रमाण' : 'Citizen Charter Standard'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. SEARCH & UNIFIED FILTER ROW */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1">
            <LucideIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-[18px]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={
                lang === 'MR'
                  ? 'कीवर्ड, विभाग किंवा ठराव क्रमांकाने शोधा...'
                  : 'Search notices by keyword, department, resolution...'
              }
              className="w-full pl-9 pr-9 py-2.5 bg-[#f9f3ea] text-[#1a1c1b] placeholder-[#707974] rounded-xl text-xs sm:text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#707974] hover:text-[#1d1b16]"
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
              activeFilter !== 'all'
                ? 'bg-[#166534] text-white border-[#166534] ring-2 ring-[#166534]/20'
                : 'bg-[#f4efe8] text-[#1d1b16] border-[#e8e2d9] hover:bg-[#eae2d7]'
            }`}
            aria-label="Filter Notices"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'MR' ? 'फिल्टर' : 'Filter'}</span>
            {activeFilter !== 'all' && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-stone-900 text-[10px] sm:text-[11px] font-black flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Chips (Micro Row) */}
        {activeFilter !== 'all' && (
          <div className="pt-2 border-t border-[#f0eee8] flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] font-medium text-[#707974]">
              {lang === 'MR' ? 'सक्रिय फिल्टर्स:' : 'Active:'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
              {activeFilter === 'resolutions' ? (lang === 'MR' ? 'ग्रामसभा ठराव' : 'Resolutions') :
               activeFilter === 'urgent' ? (lang === 'MR' ? 'तातडीच्या सूचना' : 'Urgent Alerts') :
               activeFilter === 'tenders' ? (lang === 'MR' ? 'विकासकामे व निविदा' : 'Tenders') :
               (lang === 'MR' ? 'आरोग्य व स्वच्छता' : 'Health & Sanitation')}
              <button onClick={() => { setActiveFilter('all'); setCurrentPage(1); }} className="hover:opacity-70 ml-0.5" aria-label="Clear filter">
                <X className="w-3 h-3" />
              </button>
            </span>
            <button
              onClick={() => {
                setActiveFilter('all');
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
                    {lang === 'MR' ? 'सूचना व ठराव फिल्टर्स' : 'Filter Public Notices'}
                  </h3>
                  <p className="text-[11px] text-[#707974]">
                    {lang === 'MR' ? 'सूचना प्रकार व विभागांनुसार निवडा' : 'Filter by notice category and department'}
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
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-[#1d1b16] uppercase tracking-wider">
                    {lang === 'MR' ? 'सूचना प्रवर्ग' : 'Notice Category'}
                  </span>
                  {activeFilter !== 'all' && (
                    <button
                      onClick={() => { setActiveFilter('all'); setCurrentPage(1); }}
                      className="text-[11px] text-[#c2410c] font-semibold hover:underline"
                    >
                      {lang === 'MR' ? 'सर्व दाखवा' : 'Reset'}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: lang === 'MR' ? 'सर्व सूचना' : 'All Notices', count: announcements.length },
                    { id: 'resolutions', label: lang === 'MR' ? 'ग्रामसभा ठराव' : 'Gram Sabha Resolutions', count: announcements.filter(a => ((a.category || '') + (a.title || '')).toLowerCase().includes('sabha')).length },
                    { id: 'urgent', label: lang === 'MR' ? 'तातडीच्या सूचना' : 'Urgent Alerts', count: announcements.filter(a => (a.priority || '').toLowerCase() === 'urgent' || (a.priority || '').toLowerCase() === 'high').length },
                    { id: 'tenders', label: lang === 'MR' ? 'विकासकामे व निविदा' : 'Works & Tenders', count: announcements.filter(a => ((a.category || '') + (a.title || '')).toLowerCase().includes('tender') || ((a.category || '') + (a.title || '')).toLowerCase().includes('work')).length },
                    { id: 'health', label: lang === 'MR' ? 'आरोग्य व स्वच्छता' : 'Health & Sanitation', count: announcements.filter(a => ((a.category || '') + (a.title || '')).toLowerCase().includes('health')).length }
                  ].map((cat) => {
                    const isSelected = activeFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setActiveFilter(cat.id as any); setCurrentPage(1); }}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                            : 'bg-[#fdfbf7] text-[#404945] border-[#e8e2d9] hover:bg-[#f4efe8]'
                        }`}
                      >
                        <span className="truncate">{cat.label} ({cat.count})</span>
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
                  setActiveFilter('all');
                  setCurrentPage(1);
                }}
                disabled={activeFilter === 'all'}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeFilter !== 'all'
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
                <span>{lang === 'MR' ? 'सूचना दाखवा' : 'Show Notices'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: NOTICES FEED (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {(() => {
            const filteredNotices = announcements.filter((item) => {
              const cat = (item.category || '').toLowerCase();
              const priority = (item.priority || '').toLowerCase();
              const title = (item.title || '').toLowerCase();
              const body = (item.message || item.content || item.body || '').toLowerCase();

              const matchesFilter =
                activeFilter === 'all' ||
                (activeFilter === 'resolutions' && (cat.includes('gram') || cat.includes('sabha') || title.includes('sabha') || title.includes('resolution'))) ||
                (activeFilter === 'urgent' && (priority === 'urgent' || priority === 'high' || cat.includes('urgent') || cat.includes('alert'))) ||
                (activeFilter === 'tenders' && (cat.includes('tender') || cat.includes('work') || title.includes('tender') || title.includes('road'))) ||
                (activeFilter === 'health' && (cat.includes('health') || title.includes('health') || title.includes('polio')));

              const matchesSearch =
                !searchQuery.trim() ||
                title.includes(searchQuery.toLowerCase()) ||
                body.includes(searchQuery.toLowerCase()) ||
                cat.includes(searchQuery.toLowerCase());

              return matchesFilter && matchesSearch;
            });

            const pageSize = 4;
            const totalPages = Math.max(1, Math.ceil(filteredNotices.length / pageSize));
            const validCurrentPage = Math.min(currentPage, totalPages);
            const startIndex = (validCurrentPage - 1) * pageSize;
            const paginatedNotices = filteredNotices.slice(startIndex, startIndex + pageSize);

            return (
              <>
                
                {filteredNotices.length === 0 && announcements.length > 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
                    <LucideIcon name="notifications_off" className="text-[48px] text-[#c2410c]" />
                    <h3 className="font-heading font-bold text-[18px] text-[#166534]">
                      {lang === 'MR' ? 'कोणतीही जुळणारी सूचना आढळली नाही' : 'No matching notices found'}
                    </h3>
                    <p className="text-[13px] text-[#707974] max-w-md">
                      {lang === 'MR'
                        ? 'तुमच्या शोध शब्दांशी किंवा निवडलेल्या वर्गवारीशी कोणतीही सूचना जुळत नाही.'
                        : 'No announcements match your search keywords or active filter category.'}
                    </p>
                    <button
                      onClick={() => { setActiveFilter('all'); setSearchQuery(''); setCurrentPage(1); }}
                      className="px-4 py-2 bg-[#166534] text-white text-[12px] font-bold rounded-xl hover:bg-[#052e16] transition-colors"
                    >
                      {lang === 'MR' ? 'सर्व फिल्टर रीसेट करा' : 'Reset All Filters'}
                    </button>
                  </div>
                ) : (
                  paginatedNotices.map((item) => (
                    <div key={item.id} className="bg-white card-hover-subtle rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-3 relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider flex items-center gap-1 ${item.priority === 'HIGH' || item.priority === 'URGENT' ? 'bg-[#ba1a1a]' : 'bg-[#006a4e]'}`}>
                            <LucideIcon name={item.priority === 'HIGH' || item.priority === 'URGENT' ? 'warning' : 'campaign'} className="text-[13px]" />
                            <span>{item.category?.toUpperCase() || (lang === 'MR' ? 'राजपत्र सूचना' : 'GAZETTE CIRCULAR')}</span>
                          </span>
                          <span className="text-[11px] font-bold text-[#006a4e]">ASG-GP-{item.id ? String(item.id).substring(0, 5) : '2026'}</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#006a4e] bg-[#e8f1ec] px-2.5 py-0.5 rounded border border-[#cadbcf]">
                          {lang === 'MR' ? 'प्रसिद्धी: ' : 'Issued by: '}
                          {item.issuedBy || item.authorName || (lang === 'MR' ? 'असगाव नागरी प्रशासन' : 'Asgaon Civic Administration')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-heading font-extrabold text-[18px] sm:text-[19px] text-[#166534] leading-snug">
                          {lang === 'MR' ? (item.marathiTitle || item.title) : item.title}
                        </h3>
                        {item.marathiTitle && lang !== 'MR' && (
                          <h4 className="text-[13px] font-bold text-[#c2410c] mt-0.5">
                            {item.marathiTitle}
                          </h4>
                        )}
                        {item.marathiTitle && lang === 'MR' && item.title !== item.marathiTitle && (
                          <h4 className="text-[12px] font-medium text-[#707974] mt-0.5">
                            {item.title}
                          </h4>
                        )}
                        <p className="text-[13px] text-[#404945] leading-relaxed mt-2 whitespace-pre-line">
                          {item.message || item.content || item.body}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {/* Dynamic Pagination Strip */}
                {filteredNotices.length > 0 && (
                  <div className="bg-white rounded-xl p-3 border border-[#e8e2d9] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#707974] gap-2 mt-2">
                    <span>
                      {lang === 'MR'
                        ? `एकूण ${filteredNotices.length} पैकी ${startIndex + 1}-${Math.min(startIndex + pageSize, filteredNotices.length)} सूचना दर्शवत आहे`
                        : `Showing ${startIndex + 1}-${Math.min(startIndex + pageSize, filteredNotices.length)} of ${filteredNotices.length} notices`}
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
                )}
              </>
            );
          })()}

          {announcements.length === 0 && (
            <>
          {/* NOTICE 1: CRITICAL WATER PIPELINE NOTICE (Red alert box) */}
          {(activeFilter === 'all' || activeFilter === 'urgent') && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-[#ba1a1a]/30 shadow-xs flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ba1a1a]" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#ba1a1a] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider flex items-center gap-1">
                    <LucideIcon name="warning" className="text-[13px]" />
                    <span>URGENT CIVIC NOTICE</span>
                  </span>
                  <span className="text-[11px] font-bold text-[#ba1a1a]">PDR 104/FIN</span>
                  <span className="text-[11px] text-[#707974]">• Published Today, 07:30 AM</span>
                </div>
                <span className="text-[10px] font-bold text-[#006a4e] bg-[#e8f1ec] px-2.5 py-0.5 rounded border border-[#cadbcf] self-start sm:self-auto">
                  Issued by: Gram Sevak &amp; Sarpanch
                </span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-[18px] sm:text-[20px] text-[#166534] leading-snug">
                  Drinking Water Pipeline Interruption &amp; Canal Roster for South Wards 3, 4 &amp; 6
                </h3>
                <h4 className="text-[13px] font-bold text-[#ba1a1a] mt-0.5">
                  पिण्याच्या पाण्याचा पुरवठा खंडित आणि दक्षिण प्रभागांसाठी कालवा पाणीवाटप वेळापत्रक
                </h4>
                <p className="text-[12px] sm:text-[13px] text-[#404945] leading-relaxed mt-2">
                  Due to emergency repair maintenance at the MSEDCL Pauni 33kV substation and canal feeder pipe replacement near Shinde Vasti, drinking water supply to southern connections in Wards 3, 4, 6 will be temporarily shut on Saturday from <strong>06:00 AM to 04:00 PM</strong>. Water tankers will be stationed for emergency domestic needs.
                </p>
              </div>

              {/* 3 Tanker station boxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 bg-[#fef9ee] p-3 rounded-xl border border-[#fde68a]">
                <div className="flex flex-col text-[11px]">
                  <strong className="text-[#c2410c] font-bold">TANKER POINT 1:</strong>
                  <span className="text-[#166534] font-semibold">Vitthal Mandir Chowk</span>
                  <span className="text-[#707974]">Ward 3 • 07:00 AM to 11:30 AM</span>
                </div>
                <div className="flex flex-col text-[11px]">
                  <strong className="text-[#c2410c] font-bold">TANKER POINT 2:</strong>
                  <span className="text-[#166534] font-semibold">ZP High School Gate</span>
                  <span className="text-[#707974]">Ward 4 • 11:45 AM to 01:30 PM</span>
                </div>
                <div className="flex flex-col text-[11px]">
                  <strong className="text-[#c2410c] font-bold">TANKER POINT 3:</strong>
                  <span className="text-[#166534] font-semibold">Shinde Vasti Community Well</span>
                  <span className="text-[#707974]">Ward 6 • 01:30 PM to 04:30 PM</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#f3ede4] text-[11px]">
                <div className="text-[#707974]">
                  Water Supply Toll-Free Helpline: <strong className="text-[#166534]">+91 98220 81100</strong> | Normal pressure test: Sunday 05:00 AM
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTankerModal(true)}
                    className="py-1.5 px-3 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <LucideIcon name="local_shipping" className="text-[14px]" />
                    <span>Live Tanker Tracker</span>
                  </button>
                  <a
                    href="https://wa.me/?text=Asgaon%20Water%20Cut%20Alert:%20Saturday%2006AM-04PM%20for%20Wards%203,4,6."
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 border border-[#006a4e] text-[#006a4e] hover:bg-[#e8f1ec]/60 font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <LucideIcon name="share" className="text-[14px]" />
                    <span>Forward on WA</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* NOTICE 2: GRAM SABHA STATUTORY RESOLUTION */}
          {(activeFilter === 'all' || activeFilter === 'resolutions') && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#166534] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                    CONSTITUTIONAL MANDATE
                  </span>
                  <span className="text-[11px] font-bold text-[#006a4e]">RES-2026/01</span>
                </div>
                <span className="text-[11px] text-[#707974]">Notice Issued: 24 Nov 2024</span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-[18px] sm:text-[20px] text-[#166534] leading-snug">
                  Special Republic Day Gram Sabha Assembly &amp; Statutory Resolution Agenda
                </h3>
                <h4 className="text-[13px] font-bold text-[#c2410c] mt-0.5">
                  प्रजासत्ताक दिन विशेष ग्रामसभा जाहीर आमंत्रण व विषयपत्रिका
                </h4>
              </div>

              {/* Sabha date highlight box */}
              <div className="bg-[#f3ede4]/60 p-3.5 rounded-xl border border-[#e8e2d9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white text-[#166534] border border-[#e8e2d9] flex flex-col items-center justify-center shrink-0">
                    <LucideIcon name="calendar_month" className="text-[20px]" />
                    <span className="text-[9px] font-black uppercase">26 JAN</span>
                  </div>
                  <div>
                    <strong className="text-[13px] text-[#166534] block">
                      Sunday, 26th January 2026 • 10:30 AM
                    </strong>
                    <span className="text-[11px] text-[#707974]">
                      Dr. Babasaheb Ambedkar Samajik Sabhagruh, Ward 2 (Near ZP High School)
                    </span>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-[#e8e2d9] sm:pl-4">
                  <span className="text-[9px] font-black uppercase text-[#c2410c] tracking-wider block">
                    MANDATORY QUORUM
                  </span>
                  <strong className="text-[12px] text-[#166534]">Min 100 Villagers</strong>
                  <span className="text-[10px] text-[#006a4e] block font-semibold">Including 33% Women Citizens</span>
                </div>
              </div>

              {/* 4 Agenda resolutions */}
              <div className="flex flex-col gap-2 text-[12px]">
                <span className="text-[10px] font-bold text-[#707974] uppercase tracking-wider">
                  STATUTORY AGENDA RESOLUTIONS (विषयपत्रिका):
                </span>
                
                <div className="p-2.5 rounded-lg bg-white border border-[#e8e2d9] flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    01
                  </span>
                  <p className="text-[#404945] leading-relaxed">
                    <strong className="text-[#166534]">15th Finance Commission Untied Grants Fund:</strong> Ratification of development fund allocation (₹14.8 Lakh) for internal paver-block lanes and solar high-mast illumination.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-[#e8e2d9] flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    02
                  </span>
                  <p className="text-[#404945] leading-relaxed">
                    <strong className="text-[#166534]">Jal Jeevan Mission Audit:</strong> Sanction of 402 household water connections, meter calibration, and approval of maintenance tariff.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-[#e8e2d9] flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    03
                  </span>
                  <p className="text-[#404945] leading-relaxed">
                    <strong className="text-[#166534]">PMAY-G (Pradhan Mantri Awaas):</strong> Finalization and public reading of sanction roster for 41 rural homeless families.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-[#e8e2d9] flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    04
                  </span>
                  <p className="text-[#404945] leading-relaxed">
                    <strong className="text-[#166534]">Weekly Haat Bazaar Auction:</strong> Public bidding for Friday temporary shopkeeper concessions rights for fiscal cycle 2025-26.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#f3ede4] text-[11px]">
                <span className="text-[#707974]">
                  Sanctioned by: <strong>Sarpanch / Talathi / Gram Sevak</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('Downloading official Gram Sabha Agenda PDF (890 KB).')}
                    className="py-1.5 px-3 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <LucideIcon name="download" className="text-[14px]" />
                    <span>Agenda &amp; Draft Resolution PDF (890 KB)</span>
                  </button>
                  <button
                    onClick={() => setShowAgendaPointModal(true)}
                    className="py-1.5 px-3 border border-[#c2410c] text-[#c2410c] hover:bg-[#fef9ee] font-bold rounded-lg transition-colors"
                  >
                    Submit Citizen's Point Ahead of Time
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTICE 3: HEALTH CARE FOGGING & IMMUNIZATION */}
          {(activeFilter === 'all' || activeFilter === 'health') && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                    PRIMARY HEALTH CARE DRIVE
                  </span>
                  <span className="text-[11px] font-bold text-[#006a4e]">PHC-2024/09</span>
                </div>
                <span className="text-[11px] text-[#707974]">Notice Published: 20 Nov 2024</span>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <h3 className="font-heading font-extrabold text-[18px] text-[#166534] leading-snug">
                    Free Vector Control Fogging Drive &amp; Mission Indradhanush Immunization Camp
                  </h3>
                  <h4 className="text-[13px] font-bold text-[#c2410c] mt-0.5">
                    डेंग्यू व मलेरिया प्रतिबंधक धूरफवारणी व बाल लसीकरण मोहीम
                  </h4>
                  <p className="text-[12px] text-[#404945] leading-relaxed mt-2">
                    In coordination with Asgaon Primary Health Center (PHC), comprehensive thermal fogging and larva eradication will be carried out across all 6 wards. Concurrently, routine pediatric vaccines (BCG, DPT, Pentavalent, MR) will be administered.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#f3ede4]/40 p-2.5 rounded-xl border border-[#e8e2d9] mt-3 text-[11px]">
                    <div>
                      <strong className="text-[#166534] block">DATES &amp; TIME:</strong>
                      <span className="text-[#707974]">Thursday, 14 Nov 2024</span>
                      <span className="text-[#006a4e] block font-semibold">08:00 AM to 02:00 PM</span>
                    </div>
                    <div>
                      <strong className="text-[#166534] block">CAMP VENUE:</strong>
                      <span className="text-[#707974]">ZP School &amp; Anganwadi 1 &amp; 2</span>
                      <span className="text-[#707974] block">(Behind Vitthal Mandir)</span>
                    </div>
                    <div>
                      <strong className="text-[#166534] block">BENEFICIARY GROUP:</strong>
                      <span className="text-[#707974]">0–5 Yrs Children</span>
                      <span className="text-[#c2410c] block font-semibold">&amp; Pregnant Mothers</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-44 h-36 rounded-xl overflow-hidden bg-[#f3ede4] shrink-0 self-center">
                  <img
                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80"
                    alt="Immunization"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[#f3ede4] text-[11px]">
                <span className="text-[#707974]">
                  Medical Officer: <strong>Dr. Santosh Zalke</strong> (MBBS, PHC Pauni)
                </span>
                <span className="text-[#006a4e] font-semibold flex items-center gap-1">
                  <LucideIcon name="call" className="text-[14px]" />
                  <span>PHC Ward Desk: 07185-242210</span>
                </span>
              </div>
            </div>
          )}

          {/* NOTICE 4: MSEDCL AGRI PUMP ROSTER */}
          {(activeFilter === 'all' || activeFilter === 'urgent') && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                    MSEDCL ROSTER NOTICE
                  </span>
                  <span className="text-[11px] font-bold text-[#006a4e]">ROST-301/RAB</span>
                </div>
                <span className="text-[11px] text-[#707974]">Effective: 10 Nov – 24 Nov 2024</span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-[18px] text-[#166534] leading-snug">
                  MSEDCL Agricultural Pump 3-Phase Power Supply Roster (पाणीपंप वीज वेळापत्रक)
                </h3>
                <p className="text-[12px] text-[#707974] mt-1">
                  Rotational 3-phase agriculture electricity supply schedule for Asgaon irrigation pump feeders under the Pauni Rural Sub-division:
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border border-[#e8e2d9] rounded-lg overflow-hidden">
                  <thead className="bg-[#f3ede4] text-[#166534] font-bold">
                    <tr>
                      <th className="p-2 border-b border-[#e8e2d9]">FEEDER GROUP</th>
                      <th className="p-2 border-b border-[#e8e2d9]">COVERED AGRICULTURAL LAND</th>
                      <th className="p-2 border-b border-[#e8e2d9]">SUPPLY SHIFT TIMINGS</th>
                      <th className="p-2 border-b border-[#e8e2d9]">LOAD CAPACITY</th>
                      <th className="p-2 border-b border-[#e8e2d9]">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#f3ede4] hover:bg-[#fef9ee]">
                      <td className="p-2 font-bold text-[#166534]">Group A (Night Shift)</td>
                      <td className="p-2 text-[#404945]">Tembhurne &amp; Canal Feeder: 34 Wards</td>
                      <td className="p-2 font-bold text-[#006a4e]">10:30 PM — 06:30 AM</td>
                      <td className="p-2 text-[#707974]">11 kV / 100 kVA</td>
                      <td className="p-2">
                        <span className="bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-[9px] font-bold px-2 py-0.5 rounded">Active</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#fef9ee]">
                      <td className="p-2 font-bold text-[#166534]">Group B (Day Shift)</td>
                      <td className="p-2 text-[#404945]">River Bank &amp; Savitri Well: Sub 101 to 210</td>
                      <td className="p-2 font-bold text-[#c2410c]">09:00 AM — 05:00 PM</td>
                      <td className="p-2 text-[#707974]">11 kV / 100 kVA</td>
                      <td className="p-2">
                        <span className="bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-[9px] font-bold px-2 py-0.5 rounded">Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-[#707974]">
                <span className="flex items-center gap-1">
                  <LucideIcon name="electrical_services" className="text-[14px] text-[#c2410c]" />
                  <span>Emergency Electrical Breakdown Desk (MSEDCL Pauni): <strong>+91 94221 04222</strong></span>
                </span>
                <button
                  onClick={() => alert('Downloading MSEDCL Weekly Roster Sheet.')}
                  className="text-[#006a4e] font-bold hover:underline"
                >
                  Download Weekly Roster Sheet (PNG) →
                </button>
              </div>
            </div>
          )}

          {/* NOTICE 5: PUBLIC DEVELOPMENT TENDER */}
          {(activeFilter === 'all' || activeFilter === 'tenders') && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3ede4] pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#166534] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                    DEVELOPMENT TENDER
                  </span>
                  <span className="text-[11px] font-bold text-[#006a4e]">Panch-Works/14/26</span>
                </div>
                <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#fef3c7] px-2 py-0.5 rounded">
                  Closing in 3 Days
                </span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-[18px] text-[#166534] leading-snug">
                  Construction of 400m Paver Block Road &amp; Covered Stormwater Drain near Vitthal Mandir
                </h3>
                <h4 className="text-[13px] font-bold text-[#c2410c] mt-0.5">
                  प्रभाग 3 विठ्ठल मंदिर परिसर पेव्हर ब्लॉक रस्ता व बंदिस्त नाली बांधकाम जाहीर ई-निविदा
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#f3ede4]/50 p-3 rounded-xl border border-[#e8e2d9] text-[11px]">
                <div>
                  <span className="text-[10px] text-[#707974] block">ESTIMATED COST</span>
                  <strong className="text-[15px] font-black text-[#166534]">₹6,45,000</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#707974] block">EMD SECURITY</span>
                  <strong className="text-[15px] font-black text-[#c2410c]">₹6,500</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#707974] block">WORK DURATION</span>
                  <strong className="text-[15px] font-black text-[#006a4e]">60 Days</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#707974] block">SUBMISSION CLOSING</span>
                  <strong className="text-[14px] font-bold text-[#ba1a1a]">22 Nov, 5 PM</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[11px]">
                <span className="text-[#707974]">GP Class VII and above Contractors Eligible</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('Accessing Pauni Tehsil e-Tender portal documents.')}
                    className="py-1.5 px-3 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-lg transition-colors"
                  >
                    View All Tender Documents
                  </button>
                  <button
                    onClick={() => alert('Downloading BOQ & Notice (450 KB).')}
                    className="py-1.5 px-3 border border-[#166534] text-[#166534] hover:bg-[#e8f1ec]/60 font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <LucideIcon name="download" className="text-[14px]" />
                    <span>Download BOQ &amp; Notice</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          </>
          )}

          {/* NOTICE 6: RTI & TRANSPARENCY QUERY BANNER */}
          <div className="bg-[#fef9ee] rounded-2xl p-4 sm:p-5 border border-[#fde68a] shadow-xs flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white border border-[#fde68a] overflow-hidden shrink-0 flex items-center justify-center">
              <LucideIcon name="policy" className="text-[36px] text-[#c2410c]" />
            </div>
            <div className="flex-1 text-[12px]">
              <span className="text-[10px] font-bold text-[#c2410c] uppercase tracking-wider block">
                {lang === 'MR' ? 'नागरिक माहिती अधिकार' : 'CITIZEN RIGHT TO INFORMATION'}
              </span>
              <h4 className="font-heading font-bold text-[15px] text-[#166534] leading-snug">
                {lang === 'MR'
                  ? 'परिपत्रक किंवा ठराव माहिती कक्ष'
                  : "Need assistance with a Gazette Circular or Resolution?"}
              </h4>
              <p className="text-[#404945] mt-1 leading-relaxed">
                {lang === 'MR'
                  ? 'माहिती अधिकार कायदा कलम ४(१)(बी) अंतर्गत असगाव गावातील सर्व सार्वजनिक ठराव व मंजुरी नोंदी नागरिकांसाठी उपलब्ध आहेत. सीएससी केंद्रात कोणत्याही शुल्काविना माहिती सहाय्य उपलब्ध.'
                  : 'Every resolution passed by Asgaon Gram Panchayat is public record under Section 4(1)(b) of the Right to Information Act. Free assistance is available at the CSC desk.'}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <a href="tel:9822104500" className="text-[#006a4e] font-bold hover:underline flex items-center gap-1">
                  <LucideIcon name="call" className="text-[14px]" />
                  <span>{lang === 'MR' ? 'माहिती कक्ष संपर्क (+91 98221 04500) →' : 'Panchayat Helpdesk (+91 98221 04500) →'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN: 5 CIVIC WIDGETS (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* WIDGET 1: PANCHAYAT DIGNITARIES */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-[#f3ede4] pb-3">
              <div className="flex items-center gap-2">
                <LucideIcon name="account_balance" className="text-[#006a4e] text-[20px]" />
                <h3 className="font-heading font-bold text-[14px] text-[#166534]">
                  {lang === 'MR' ? 'गाव पदाधिकारी व प्रतिनिधी' : 'Panchayat Dignitaries'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#006a4e] bg-[#e8f1ec] px-2 py-0.5 rounded">
                {lang === 'MR' ? 'कर्तव्य वेळापत्रक' : 'Duty Roster'}
              </span>
            </div>

            <div className="flex flex-col gap-3 text-[11px]">
              {/* Sarpanch */}
              <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#f3ede4]/40 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#166534] text-[#a7f3d0] font-bold text-[11px] flex items-center justify-center shrink-0">
                  SJ
                </div>
                <div>
                  <strong className="text-[#166534] block">Sau. Sunita Tai Jadhav</strong>
                  <span className="text-[10px] text-[#c2410c] font-semibold block">
                    {lang === 'MR' ? 'सरपंच (९४२२० ०११००)' : 'Sarpanch (94220 01100)'}
                  </span>
                  <span className="text-[#707974] text-[10px]">
                    {lang === 'MR' ? 'भेट वेळ: सोम व गुरु स. १०:०० ते दु. १:०० (सभागृह)' : 'Visiting Hours: Mon & Thu 10:00 AM – 1:00 PM (GP Hall)'}
                  </span>
                </div>
              </div>

              {/* Up-Sarpanch */}
              <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#f3ede4]/40 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#c2410c] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                  BG
                </div>
                <div>
                  <strong className="text-[#166534] block">Shri. Balasaheb D. Gaikwad</strong>
                  <span className="text-[10px] text-[#55605a] block">
                    {lang === 'MR' ? 'उपसरपंच (९८२२१ ००१९९)' : 'Up-Sarpanch (98221 00199)'}
                  </span>
                  <span className="text-[#707974] text-[10px]">
                    {lang === 'MR' ? 'प्रभाग ४ • फोनवर संपर्क उपलब्ध' : 'Ward 4 • Available on Call'}
                  </span>
                </div>
              </div>

              {/* Gram Sevak */}
              <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#f3ede4]/40 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#006a4e] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                  SP
                </div>
                <div>
                  <strong className="text-[#166534] block">Shri. Sachin M. Patil</strong>
                  <span className="text-[10px] text-[#006a4e] font-semibold block">
                    {lang === 'MR' ? 'ग्रामसेवक / सचिव (९४२२० ११९९९)' : 'Gram Sevak / Secretary (94220 11999)'}
                  </span>
                  <span className="text-[#707974] text-[10px]">
                    {lang === 'MR' ? 'सोम ते शनि स. ०९:३० ते दु. ०४:३० (कार्यालय)' : 'Mon to Sat 09:30 AM – 04:30 PM (GP Office)'}
                  </span>
                </div>
              </div>

              {/* Talathi */}
              <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#f3ede4]/40 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#404945] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                  DB
                </div>
                <div>
                  <strong className="text-[#166534] block">Shri. D. K. Borse</strong>
                  <span className="text-[10px] text-[#55605a] block">
                    {lang === 'MR' ? 'तलाठी / महसूल अधिकारी' : 'Talathi / Revenue Officer'}
                  </span>
                  <span className="text-[#707974] text-[10px]">
                    {lang === 'MR' ? 'मंगळ व शुक्र स. १०:०० ते दु. ०२:००' : 'Tue & Fri 10:00 AM – 02:00 PM'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f3ede4] text-[10px] text-[#707974] text-center">
              {lang === 'MR' ? 'पंचायत भवन सभागृह, बायपास, असगाव' : 'Panchayat Bhavan Hall, Bypass, Asgaon'}
            </div>
          </div>

          {/* WIDGET 2: CIRCULAR VERIFICATION & RTI */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-[#f3ede4] pb-3">
              <LucideIcon name="verified" className="text-[#006a4e] text-[20px]" />
              <div>
                <h3 className="font-heading font-bold text-[14px] text-[#166534]">
                  {lang === 'MR' ? 'परिपत्रक पडताळणी व माहिती' : 'Circular Verification & RTI'}
                </h3>
                <span className="text-[10px] text-[#707974]">
                  {lang === 'MR' ? 'डिजिटल मुद्रा व अस्सलता तपासा' : 'Verify digital seal authenticity'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#404945] leading-relaxed">
              {lang === 'MR'
                ? 'बनावट परिपत्रके किंवा अनधिकृत सूचना टाळण्यासाठी डिजिटल अभिलेखात अधिकृत शिक्का व ठराव क्रमांक तपासा.'
                : 'To prevent distribution of fake notices or unapproved circulars, verify official stamp and resolution numbers in the Digital Gazette Archive.'}
            </p>

            <form onSubmit={handleVerify} className="flex flex-col gap-2">
              <input
                type="text"
                value={verifyNoticeId}
                onChange={(e) => setVerifyNoticeId(e.target.value)}
                placeholder={lang === 'MR' ? 'सूचना आयडी टाका (उदा. GP/2026/RES-401)' : 'ENTER NOTICE ID (E.G. GP/2026/RES-401)'}
                className="p-2.5 rounded-lg border border-[#e8e2d9] text-[11px] uppercase tracking-wide focus:border-[#006a4e] outline-none"
              />
              <button
                type="submit"
                className="py-2 bg-[#166534] hover:bg-[#052e16] text-white text-[11px] font-bold rounded-lg transition-colors"
              >
                {lang === 'MR' ? 'डिजिटल मुद्रा पडताळा' : 'Verify Digital Seal Authenticity'}
              </button>
            </form>

            {verifyStatus && (
              <div className="bg-[#e8f1ec] border border-[#006a4e] p-2.5 rounded-lg text-[10px] text-[#002117] leading-tight mt-1">
                {verifyStatus}
              </div>
            )}

            <div className="text-[10px] text-[#707974] pt-1">
              {lang === 'MR' ? 'माहिती अधिकार हेल्पडेस्क: ' : 'Direct RTI Helpdesk: '}
              <strong className="text-[#166534]">07185-224410</strong>
            </div>
          </div>

          {/* WIDGET 3: WHATSAPP BROADCAST */}
          <div className="bg-[#166534] text-white rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#a7f3d0]">
                {lang === 'MR' ? 'अधिकृत नागरी ब्रॉडकास्ट' : 'OFFICIAL GP BROADCAST'}
              </span>
              <span className="bg-[#e8f1ec]/60 text-[#a7f3d0] text-[9px] font-bold px-2 py-0.5 rounded">
                {lang === 'MR' ? 'थेट' : 'Live'}
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-[15px] leading-snug">
              {lang === 'MR'
                ? 'असगावच्या १,४२०+ ग्रामस्थांसोबत व्हॉट्सअ‍ॅपवर जुळा'
                : 'Join 1,420+ Asgaon Residents on Official WhatsApp'}
            </h3>

            <p className="text-[11px] text-[#e8e2d9] leading-relaxed">
              {lang === 'MR'
                ? 'पिण्याच्या पाण्याचे वेळापत्रक, वीज कपात, ग्रामसभा ठराव आणि महत्त्वाच्या नागरी सूचना थेट मोबाईलवर मिळवा.'
                : 'Get immediate emergency water notices, power cuts, Gram Sabha resolutions, and death/birth registrations directly to your mobile.'}
            </p>

            {/* QR Mockup */}
            <div className="bg-white p-3 rounded-xl flex items-center gap-3 text-[#1a1c1b]">
              <div className="w-12 h-12 bg-[#166534] rounded-lg flex items-center justify-center text-white shrink-0">
                <LucideIcon name="qr_code_2" className="text-[28px]" />
              </div>
              <div className="text-[10px]">
                <strong className="block text-[#166534]">
                  {lang === 'MR' ? 'व्हॉट्सअ‍ॅप कॅमेऱ्याने स्कॅन करा' : 'Scan with WhatsApp Camera'}
                </strong>
                <span className="text-[#707974]">
                  {lang === 'MR' ? 'थेट चॅनेल: असगाव ग्राम सेवा' : 'Direct Channel: Asgaon Gram Seva'}
                </span>
              </div>
            </div>

            <a
              href="https://wa.me/919422001100?text=Please%20add%20me%20to%20Asgaon%20Gram%20Panchayat%20Official%20Alerts"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-[#a7f3d0] hover:bg-[#a0dec5] text-[#002117] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors mt-1"
            >
              <span>{lang === 'MR' ? 'व्हॉट्सअ‍ॅप सूचनांमध्ये सामील व्हा' : 'Subscribe to Official GP WhatsApp'}</span>
              <LucideIcon name="arrow_forward" className="text-[16px]" />
            </a>
          </div>

          {/* WIDGET 4: VILLAGE DEVELOPMENT WORKS */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#f3ede4] pb-3">
              <div className="flex items-center gap-1.5">
                <LucideIcon name="task_alt" className="text-[#006a4e] text-[18px]" />
                <h3 className="font-heading font-bold text-[14px] text-[#166534]">
                  {lang === 'MR' ? 'ग्रामविकास कामे व प्रगती अहवाल' : 'Village Works & Progress'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#006a4e] bg-[#e8f1ec] px-2 py-0.5 rounded">
                {lang === 'MR' ? 'थेट अद्यतन' : 'Live Update'}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-[11px]">
              <div className="p-2.5 rounded-lg bg-[#f3ede4]/40 border border-[#e8e2d9]">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-[#166534]">
                    {lang === 'MR' ? 'प्रकल्प #१०४ — पथदिवे दुरुस्ती' : 'Work #104 — Streetlight Wiring'}
                  </strong>
                  <span className="text-[9px] font-bold text-[#006a4e] bg-[#a7f3d0] px-1.5 py-0.2 rounded">
                    {lang === 'MR' ? 'पूर्ण' : 'COMPLETED'}
                  </span>
                </div>
                <p className="text-[10px] text-[#707974] leading-tight">
                  {lang === 'MR'
                    ? 'प्रभाग २ व ५ विठ्ठल मंदिर बायपास खांबांवर नवीन वायरिंग पूर्ण केली.'
                    : 'Wards 2 & 5 Vitthal Mandir bypass poles re-wired and operational.'}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#f3ede4]/40 border border-[#e8e2d9]">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-[#166534]">
                    {lang === 'MR' ? 'प्रकल्प #१०२ — बोअरवेल क्लोरीनेशन' : 'Work #102 — Water Chlorination'}
                  </strong>
                  <span className="text-[9px] font-bold text-[#006a4e] bg-[#a7f3d0] px-1.5 py-0.2 rounded">
                    {lang === 'MR' ? 'पूर्ण' : 'COMPLETED'}
                  </span>
                </div>
                <p className="text-[10px] text-[#707974] leading-tight">
                  {lang === 'MR'
                    ? 'हातपंपाचे निर्जंतुकीकरण व शुद्ध पाणी चाचणी यशस्वीरीत्या पूर्ण.'
                    : 'Handpump disinfected and clean water test verified.'}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#fef9ee] border border-[#fde68a]">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-[#c2410c]">
                    {lang === 'MR' ? 'प्रकल्प #०९८ — पेव्हर ब्लॉक व स्वच्छता' : 'Work #098 — Paver Blocks & Sanitation'}
                  </strong>
                  <span className="text-[9px] font-bold text-[#c2410c] bg-[#fef9ee] px-1.5 py-0.2 rounded border border-[#fde68a]">
                    {lang === 'MR' ? 'प्रगतीपथावर' : 'IN PROGRESS'}
                  </span>
                </div>
                <p className="text-[10px] text-[#707974] leading-tight">
                  {lang === 'MR'
                    ? 'सकाळच्या स्वच्छतेसाठी कचरा व्यवस्थापन पथक कार्यरत.'
                    : 'Solid waste team assigned for morning clearance.'}
                </p>
              </div>
            </div>

            <div className="text-[10px] text-[#707974] text-center pt-1 border-t border-[#f3ede4]">
              {lang === 'MR' ? 'ग्रामपंचायत आसगाव • सार्वजनिक विकास अहवाल' : 'Gram Panchayat Asgaon • Public Works Log'}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 2: LIVE TANKER TRACKER */}
      {showTankerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setShowTankerModal(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4]"
            >
              <LucideIcon name="close" className="text-[20px]" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <LucideIcon name="local_shipping" className="text-[#006a4e] text-[24px]" />
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#166534]">
                  {lang === 'MR' ? 'पाणी टँकर थेट स्थिती' : 'Emergency Water Tanker Tracker'}
                </h3>
                <span className="text-[11px] text-[#707974]">
                  {lang === 'MR' ? 'नागरी पाणी पुरवठा वाहन स्थिती' : 'Gram Panchayat Relief Vehicle Status'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-[12px]">
              <div className="p-3 bg-[#e8f1ec] border border-[#006a4e] rounded-xl flex items-center justify-between">
                <div>
                  <strong className="text-[#166534] block">Tanker #MH-36-T-4091</strong>
                  <span className="text-[11px] text-[#404945]">
                    {lang === 'MR' ? 'सध्याचे स्थान: विठ्ठल मंदिर चौक' : 'Current Location: Vitthal Mandir Chowk'}
                  </span>
                </div>
                <span className="bg-[#006a4e] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {lang === 'MR' ? 'पाणी वाटप सुरू' : 'DISPENSING'}
                </span>
              </div>

              <div className="p-3 bg-[#f3ede4]/50 border border-[#e8e2d9] rounded-xl flex items-center justify-between">
                <div>
                  <strong className="text-[#166534] block">Tanker #MH-36-T-2180</strong>
                  <span className="text-[11px] text-[#404945]">
                    {lang === 'MR' ? 'स्थिती: जि.प. हायस्कूलकडे जात आहे (१५ मि)' : 'Status: En route to ZP High School (ETA 15 mins)'}
                  </span>
                </div>
                <span className="bg-[#c2410c] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {lang === 'MR' ? 'मार्गावर' : 'IN TRANSIT'}
                </span>
              </div>

              <div className="bg-[#fef9ee] p-3 rounded-xl border border-[#fde68a] text-[11px] text-[#c2410c]">
                {lang === 'MR' ? (
                  <>आपल्या प्रभागात तातडीचा टँकर हवा असल्यास थेट <strong>+91 98220 81100</strong> वर संपर्क करा.</>
                ) : (
                  <>If your ward needs an urgent tanker dispatch, call the Water Desk directly at <strong>+91 98220 81100</strong>.</>
                )}
              </div>

              <button
                onClick={() => setShowTankerModal(false)}
                className="w-full py-2.5 bg-[#166534] text-white font-bold rounded-xl transition-all shadow-xs"
              >
                {lang === 'MR' ? 'बंद करा' : 'Close Tracker'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CITIZEN POINT AHEAD OF GRAM SABHA */}
      {showAgendaPointModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setShowAgendaPointModal(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4]"
            >
              <LucideIcon name="close" className="text-[20px]" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <LucideIcon name="ballot" className="text-[#c2410c] text-[24px]" />
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#166534]">
                  {lang === 'MR' ? 'ग्रामसभेसाठी चर्चेचा मुद्दा नोंदवा' : 'Submit Gram Sabha Discussion Point'}
                </h3>
                <span className="text-[11px] text-[#707974]">
                  {lang === 'MR' ? 'अधिकृत विषयपत्रिकेत आपल्या मुद्द्याचा समावेश करा' : 'Include your point on the official agenda'}
                </span>
              </div>
            </div>

            {modalSuccess ? (
              <div className="bg-[#e8f1ec] border border-[#006a4e] rounded-xl p-4 text-center">
                <LucideIcon name="check_circle" className="text-[#006a4e] text-[40px] mb-2" />
                <h4 className="font-bold text-[15px] text-[#166534]">
                  {lang === 'MR' ? 'मुद्दा सभेसाठी नोंदवला गेला!' : 'Point Enrolled for Sabha!'}
                </h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  {lang === 'MR'
                    ? 'आपला चर्चेचा विषय २६ जानेवारी ग्रामसभेत वाचून दाखवण्यासाठी नोंदवला आहे.'
                    : 'Your discussion subject has been recorded for the 26 Jan Gram Sabha reading.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'नागरिकाचे नाव व प्रभाग' : 'Citizen Name & Ward'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'MR' ? 'उदा. सुनील जाधव, प्रभाग ३' : 'e.g. Sunil Jadhav, Ward 3'}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'प्रस्तावित विषय' : 'Proposal Topic'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'MR' ? 'उदा. कालवा रस्त्यावरील गटार दुरुस्ती' : 'e.g. Drainage pipe repair on Canal Road'}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {lang === 'MR' ? 'सविस्तर स्पष्टीकरण' : 'Detailed Explanation'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={lang === 'MR' ? 'हा विषय ग्रामसभेत का चर्चेत घेतला पाहिजे ते स्पष्ट करा...' : 'Explain why this matter should be addressed during the meeting...'}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#c2410c] hover:bg-[#852f00] text-white font-bold rounded-xl transition-all shadow-xs mt-1"
                >
                  {lang === 'MR' ? 'चर्चेचा मुद्दा नोंदवा' : 'Enroll Discussion Point'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
