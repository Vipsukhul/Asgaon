import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Breadcrumb } from '../components/Breadcrumb';

interface EventsPageProps {
  onNavigateHome?: () => void;
}

const DEFAULT_VILLAGE_EVENTS = [
  {
    id: 'seed-1',
    title: 'श्री खंडोबा महाराज वार्षिक यात्रा व महाप्रसाद',
    category: 'religious',
    eventDate: '15 Nov 2025',
    eventTime: '06:00 AM — 11:30 PM',
    location: 'खंडोबा मंदिर प्रांगण, आसगाव',
    organizer: 'आसगाव देवस्थान ट्रस्ट व ग्रामस्थ मंडळ',
    badge: 'वार्षिक उत्सव',
    description: 'गावातील पारंपारिक अखंड हरिनाम सप्ताह सांगता, पालखी मिरवणूक, महाप्रसाद वाटप व कुस्ती दंगल स्पर्धा. सर्व भाविकांनी उपस्थित राहावे.',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'seed-2',
    title: 'मोफत आरोग्य, नेत्र तपासणी व चष्मा वाटप शिबीर',
    category: 'health',
    eventDate: '20 Nov 2025',
    eventTime: '09:00 AM — 04:00 PM',
    location: 'प्राथमिक आरोग्य केंद्र (PHC), आसगाव',
    organizer: 'जिल्हा सामान्य रुग्णालय व ग्रामपंचायत आसगाव',
    badge: 'मोफत आरोग्य सेवा',
    description: 'तज्ज्ञ डॉक्टरांकडून रक्तदाब, मधुमेह, हृदय व मोतीबिंदू तपासणी. गरजूंना मोफत औषधे व चष्मे वाटप. कृपया आधार कार्ड आणावे.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'seed-3',
    title: 'खरीप व रब्बी हंगाम आधुनिक शेती तंत्रज्ञान कार्यशाळा',
    category: 'agriculture',
    eventDate: '28 Nov 2025',
    eventTime: '10:30 AM — 02:30 PM',
    location: 'ग्रामपंचायत सभागृह (Samaj Mandir), आसगाव',
    organizer: 'कृषी विज्ञान केंद्र व कृषी विभाग',
    badge: 'शेतकरी मार्गदर्शन',
    description: 'ठिबक सिंचन अनुदान, सेंद्रिय खते, माती परीक्षण अहवाल वाटप व ड्रोन फवारणी प्रात्यक्षिक. सर्व शेतकरी बांधवांसाठी अल्पोपहार.',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'seed-4',
    title: 'आसगाव ग्रामीण अजिंक्यपद कबड्डी व क्रिकेट चषक',
    category: 'sports',
    eventDate: '05 Dec 2025',
    eventTime: '08:00 AM — 06:00 PM',
    location: 'जिल्हा परिषद शाळा मैदान, आसगाव',
    organizer: 'आसगाव युवक क्रीडा मंडळ',
    badge: 'क्रीडा स्पर्धा',
    description: 'परिसरातील १६ संघांमध्ये भव्य कबड्डी व टेनिस बॉल क्रिकेट सामने. प्रथम पारितोषिक ₹२१,००० व चषक. युवक खेळाडूंना सन्मान.',
    imageUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?auto=format&fit=crop&w=600&q=80'
  }
];

export const EventsPage: React.FC<EventsPageProps> = ({ onNavigateHome }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'religious' | 'health' | 'agriculture' | 'sports'>('all');
  const [activeMonthFilter, setActiveMonthFilter] = useState<'nov' | 'dec' | 'winter' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [showEventSubmitModal, setShowEventSubmitModal] = useState(false);
  const [showHallModal, setShowHallModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  // Form states
  const [tokenName, setTokenName] = useState('');
  const [tokenPhone, setTokenPhone] = useState('');
  const [tokenType, setTokenType] = useState('Free Eye Checkup (17 Nov)');
  const [generatedToken, setGeneratedToken] = useState('');

  // Dynamic Events state & submission
  const [backendEvents, setBackendEvents] = useState<any[]>(() => {
    const cached = localStorage.getItem('dg_village_events_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return DEFAULT_VILLAGE_EVENTS;
  });
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCategory, setEventCategory] = useState('Cultural / Religious');
  const [eventVenue, setEventVenue] = useState('');
  const [eventOrganizer, setEventOrganizer] = useState('');
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  useEffect(() => {
    api.getEvents()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setBackendEvents(data);
          localStorage.setItem('dg_village_events_cache', JSON.stringify(data));
        }
      })
      .catch((err) => console.log('Events local cache fallback:', err.message));
  }, []);

  const handleEventFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingEvent(true);
    try {
      const saved = await api.createEvent({
        title: eventTitle,
        category: eventCategory.toLowerCase().includes('health') ? 'health' :
                  eventCategory.toLowerCase().includes('agri') ? 'agriculture' :
                  eventCategory.toLowerCase().includes('sport') ? 'sports' : 'religious',
        eventDate: eventDate,
        eventTime: '10:00 AM — 05:00 PM',
        location: eventVenue || 'Asgaon Village Center',
        organizer: eventOrganizer || 'Asgaon Community Committee',
        badge: 'Verified Community Event',
        description: `${eventTitle} organized by ${eventOrganizer} at ${eventVenue}. Open for all villagers.`,
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
      });
      if (saved) {
        setBackendEvents((prev) => [saved, ...prev]);
      }
      setModalSuccess(true);
      setTimeout(() => {
        setModalSuccess(false);
        setShowEventSubmitModal(false);
        setEventTitle('');
        setEventDate('');
        setEventVenue('');
        setEventOrganizer('');
      }, 2000);
    } catch (err: any) {
      alert(`Submission note: Saved to local feed (${err.message})`);
      setBackendEvents((prev) => [{
        id: 'local-' + Date.now(),
        title: eventTitle,
        category: 'religious',
        eventDate: eventDate,
        eventTime: '10:00 AM',
        location: eventVenue,
        organizer: eventOrganizer,
        badge: 'Community Proposed',
        description: eventTitle
      }, ...prev]);
      setModalSuccess(true);
      setTimeout(() => {
        setModalSuccess(false);
        setShowEventSubmitModal(false);
      }, 2000);
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `ASG-${Math.floor(100 + Math.random() * 900)}`;
    setGeneratedToken(token);
    setModalSuccess(true);
    setTimeout(() => {
      setModalSuccess(false);
      setShowTokenModal(false);
      setTokenName('');
      setTokenPhone('');
    }, 3000);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSuccess(true);
    setTimeout(() => {
      setModalSuccess(false);
      setShowEventSubmitModal(false);
      setShowHallModal(false);
      setShowTokenModal(false);
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. TOP BREADCRUMB & STATUS STRIP */}
      <Breadcrumb
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Village Events & Calendar (गावातील कार्यक्रम व दिनदर्शिका)', active: true }
        ]}
        rightBadge={
          <div className="text-[11px] font-semibold text-[#006a4e] bg-[#baeed9]/40 px-2.5 py-0.5 rounded-full border border-[#baeed9]">
            COMMUNITY CULTURAL &amp; DEVELOPMENT CALENDAR 2025–2026 • Asgaon Gram Sabha
          </div>
        }
      />

      {/* 2. HERO BANNER */}
      <div className="bg-gradient-to-br from-[#003629]/5 via-white to-[#003629]/10 rounded-2xl p-6 sm:p-8 border border-[#c4d6cf] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <span className="inline-block bg-[#a63b00]/10 text-[#a63b00] text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase border border-[#a63b00]/20 mb-2">
            समुदाय । आसगाव सांस्कृतिक व नागरी मंच
          </span>
          <h1 className="font-heading font-extrabold text-[26px] sm:text-[30px] text-[#003629] leading-tight mb-1">
            Village Events, Festivals &amp; Community Gatherings
          </h1>
          <h2 className="text-[14px] sm:text-[15px] font-bold text-[#a63b00] mb-2">
            गावातील सभा, जत्रा, कृषी मेळावे व समाज दिनदर्शिका
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#404945] max-w-2xl leading-relaxed">
            Discover upcoming weekly rural bazaars, sacred annual jatras, multi-specialty health camps, kabaddi championships, agricultural innovation workshops, and Gram Sabha dialogue forums in Asgaon.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <button
            onClick={() => setShowEventSubmitModal(true)}
            className="px-5 py-3 rounded-xl bg-[#003629] hover:bg-[#00281e] text-white text-[13px] font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Submit a Community Notice / Event</span>
          </button>
          <div className="flex items-center gap-2 text-[11px] text-[#55605a]">
            <span className="bg-[#f3ede4] px-2 py-0.5 rounded font-semibold border border-[#e8e2d9]">2025–2026</span>
            <button
              onClick={() => alert('Downloading official Asgaon Annual Village Event Calendar PDF (3.1 MB).')}
              className="text-[#006a4e] font-bold hover:underline flex items-center gap-0.5"
            >
              <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
              <span>Annual PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. 4 KEY METRIC COUNTERS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#baeed9]/60 text-[#002117] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">event_upcoming</span>
          </div>
          <div>
            <div className="font-heading font-black text-[22px] text-[#003629]">12</div>
            <div className="text-[11px] text-[#707974] leading-tight">Upcoming Events</div>
            <div className="text-[9px] text-[#006a4e] font-semibold">This Spring &amp; Winter</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fff8f0] text-[#a63b00] border border-[#ffe0cc] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
          </div>
          <div>
            <div className="font-heading font-bold text-[13px] text-[#a63b00] leading-tight">EVERY FRIDAY 8 AM</div>
            <div className="text-[11px] text-[#707974] leading-tight">Shukrawar Haat</div>
            <div className="text-[9px] text-[#55605a]">Old Bus Stand Ground</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f3ede4] text-[#003629] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">temple_hindu</span>
          </div>
          <div>
            <div className="font-heading font-bold text-[13px] text-[#003629] leading-tight">14 Dec 2024</div>
            <div className="text-[11px] text-[#707974] leading-tight">Khandoba Mandir Jatra</div>
            <div className="text-[9px] text-[#006a4e] font-semibold">14 to 18 December 2024</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#baeed9]/40 text-[#006a4e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">groups</span>
          </div>
          <div>
            <div className="font-heading font-black text-[22px] text-[#003629]">3,500+</div>
            <div className="text-[11px] text-[#707974] leading-tight">Expected Footfall</div>
            <div className="text-[9px] text-[#006a4e] font-semibold">Across active events</div>
          </div>
        </div>
      </div>

      {/* 4. SEARCH & TIMELINE FILTER ROW */}
      <div className="flex flex-col gap-3">
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-[18px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search event by name, date, festival, sports, venue, or organizer..."
              className="w-full pl-9 pr-3 py-2 bg-[#f3ede4]/40 rounded-lg text-[13px] text-[#1a1c1b] placeholder-[#707974] border border-transparent focus:border-[#006a4e] focus:bg-white outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-medium shrink-0">
            <button
              onClick={() => { setActiveMonthFilter('nov'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMonthFilter === 'nov' ? 'bg-[#003629] text-white font-bold' : 'bg-[#f3ede4] text-[#404945] hover:bg-[#e8e2d9]'
              }`}
            >
              This Month (Nov)
            </button>
            <button
              onClick={() => { setActiveMonthFilter('dec'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMonthFilter === 'dec' ? 'bg-[#003629] text-white font-bold' : 'bg-[#f3ede4] text-[#404945] hover:bg-[#e8e2d9]'
              }`}
            >
              Next Month (Dec)
            </button>
            <button
              onClick={() => { setActiveMonthFilter('winter'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMonthFilter === 'winter' ? 'bg-[#003629] text-white font-bold' : 'bg-[#f3ede4] text-[#404945] hover:bg-[#e8e2d9]'
              }`}
            >
              Winter Season
            </button>
            <button
              onClick={() => { setActiveMonthFilter('all'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMonthFilter === 'all' ? 'bg-[#003629] text-white font-bold' : 'bg-[#f3ede4] text-[#404945] hover:bg-[#e8e2d9]'
              }`}
            >
              Full Year
            </button>
          </div>
        </div>

        {/* Filter categories pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[12px] font-medium no-scrollbar">
          <button
            onClick={() => { setActiveCategory('all'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-bold shrink-0 transition-all ${
              activeCategory === 'all'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
            }`}
          >
            All Events ({backendEvents.length})
          </button>
          <button
            onClick={() => { setActiveCategory('religious'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium shrink-0 transition-all flex items-center gap-1.5 ${
              activeCategory === 'religious'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#a63b00]">temple_hindu</span>
            <span>Religious Festivals &amp; Jatras ({backendEvents.filter(e => (e.category || '').toLowerCase().includes('relig') || (e.category || '').toLowerCase().includes('cult')).length})</span>
          </button>
          <button
            onClick={() => { setActiveCategory('health'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium shrink-0 transition-all flex items-center gap-1.5 ${
              activeCategory === 'health'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">medical_services</span>
            <span>Health &amp; Camps ({backendEvents.filter(e => (e.category || '').toLowerCase().includes('health')).length})</span>
          </button>
          <button
            onClick={() => { setActiveCategory('agriculture'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium shrink-0 transition-all flex items-center gap-1.5 ${
              activeCategory === 'agriculture'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#006a4e]">agriculture</span>
            <span>Agriculture &amp; Seminars ({backendEvents.filter(e => (e.category || '').toLowerCase().includes('agri')).length})</span>
          </button>
          <button
            onClick={() => { setActiveCategory('sports'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium shrink-0 transition-all flex items-center gap-1.5 ${
              activeCategory === 'sports'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#006a4e]">sports_kabaddi</span>
            <span>Sports &amp; Youth ({backendEvents.filter(e => (e.category || '').toLowerCase().includes('sport')).length})</span>
          </button>
        </div>
      </div>

      {/* 5. MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: EVENTS FEED (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {(() => {
            const filteredEvents = backendEvents.filter((evt) => {
              const cat = (evt.category || '').toLowerCase();
              const matchesCat =
                activeCategory === 'all' ||
                (activeCategory === 'religious' && (cat.includes('relig') || cat.includes('cult'))) ||
                (activeCategory === 'health' && cat.includes('health')) ||
                (activeCategory === 'agriculture' && cat.includes('agri')) ||
                (activeCategory === 'sports' && cat.includes('sport'));

              const matchesSearch =
                !searchQuery.trim() ||
                evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                evt.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                evt.organizer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                evt.description?.toLowerCase().includes(searchQuery.toLowerCase());

              const dateStr = (evt.eventDate || '').toLowerCase();
              const matchesMonth =
                activeMonthFilter === 'all' ||
                (activeMonthFilter === 'nov' && (dateStr.includes('nov') || dateStr.includes('-11-'))) ||
                (activeMonthFilter === 'dec' && (dateStr.includes('dec') || dateStr.includes('-12-'))) ||
                (activeMonthFilter === 'winter' && (dateStr.includes('nov') || dateStr.includes('dec') || dateStr.includes('jan') || dateStr.includes('feb') || dateStr.includes('winter')));

              return matchesCat && matchesSearch && matchesMonth;
            });

            const pageSize = 4;
            const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
            const validCurrentPage = Math.min(currentPage, totalPages);
            const startIndex = (validCurrentPage - 1) * pageSize;
            const paginatedEvents = filteredEvents.slice(startIndex, startIndex + pageSize);

            return (
              <>
                {filteredEvents.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-[48px] text-[#a63b00]">event_busy</span>
                    <h3 className="font-heading font-bold text-[18px] text-[#003629]">No matching events found</h3>
                    <p className="text-[13px] text-[#707974] max-w-md">No village gatherings or festivals match your selected category, month, or search keywords.</p>
                    <button
                      onClick={() => { setActiveCategory('all'); setActiveMonthFilter('all'); setSearchQuery(''); setCurrentPage(1); }}
                      className="px-4 py-2 bg-[#003629] text-white text-[12px] font-bold rounded-xl hover:bg-[#1b4d3e] transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  paginatedEvents.map((evt) => (
                    <div key={evt.id} className="bg-white rounded-2xl border-2 border-[#006a4e]/20 p-5 shadow-xs flex flex-col sm:flex-row gap-4 hover:shadow-md transition-all">
                      <img
                        src={evt.imageUrl || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80"}
                        alt={evt.title}
                        className="w-full sm:w-48 h-40 object-cover rounded-xl shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="bg-[#baeed9] text-[#002117] text-[10px] font-black uppercase px-2.5 py-0.5 rounded">
                              {evt.badge || 'VERIFIED EVENT'}
                            </span>
                            <span className="text-[11px] font-semibold text-[#a63b00] bg-[#fff8f0] px-2 py-0.5 rounded border border-[#ffe0cc]">
                              {evt.eventDate} • {evt.eventTime}
                            </span>
                          </div>
                          <h4 className="font-heading font-extrabold text-[18px] text-[#003629] mb-1.5 leading-snug">
                            {evt.title}
                          </h4>
                          <p className="text-[12px] text-[#404945] line-clamp-3 mb-3 leading-relaxed">
                            {evt.description}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] border-t border-[#f3ede4] pt-2.5 gap-2">
                          <span className="text-[#a63b00] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">location_on</span>
                            <span>{evt.location}</span>
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[#707974]">{evt.organizer}</span>
                            <button
                              onClick={() => {
                                setTokenType(evt.title);
                                setShowTokenModal(true);
                              }}
                              className="py-1 px-3 bg-[#003629] hover:bg-[#00281e] text-white text-[11px] font-bold rounded-lg transition-colors"
                            >
                              RSVP / Register
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Dynamic Pagination Strip */}
                <div className="bg-white rounded-xl p-3 border border-[#e8e2d9] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#707974] gap-2 mt-2">
                  <span>
                    Showing {filteredEvents.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + pageSize, filteredEvents.length)} of {filteredEvents.length} events
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
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="w-7 h-7 rounded-lg bg-[#f3ede4] text-[#1d1b16] font-bold flex items-center justify-center disabled:opacity-40 hover:bg-[#e8e2d9] transition-colors"
                        aria-label="Next Page"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>

        {/* RIGHT SIDEBAR COLUMN: CALENDAR & WIDGETS (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* WIDGET 1: MONTHLY CALENDAR */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-[#f3ede4] pb-3">
              <h3 className="font-heading font-extrabold text-[15px] text-[#003629]">
                November 2024
              </h3>
              <div className="flex items-center gap-1">
                <button className="w-6 h-6 rounded border border-[#e8e2d9] flex items-center justify-center text-[#707974] hover:bg-[#f3ede4]">
                  &lt;
                </button>
                <button className="w-6 h-6 rounded border border-[#e8e2d9] flex items-center justify-center text-[#707974] hover:bg-[#f3ede4]">
                  &gt;
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#707974]">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            {/* Calendar dates matrix */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
              <span className="text-[#c4d6cf] p-1.5">27</span>
              <span className="text-[#c4d6cf] p-1.5">28</span>
              <span className="text-[#c4d6cf] p-1.5">29</span>
              <span className="text-[#c4d6cf] p-1.5">30</span>
              <span className="text-[#c4d6cf] p-1.5">31</span>
              <span className="p-1.5 text-[#404945]">1</span>
              <span className="p-1.5 text-[#404945]">2</span>

              <span className="p-1.5 text-[#404945]">3</span>
              <span className="p-1.5 text-[#404945]">4</span>
              <span className="p-1.5 text-[#404945]">5</span>
              <span className="p-1.5 text-[#404945]">6</span>
              <span className="p-1.5 text-[#404945]">7</span>
              <span className="p-1.5 text-[#404945]">8</span>
              <span className="p-1.5 text-[#404945]">9</span>

              {/* 10th - Krishi Melava */}
              <span className="p-1.5 bg-[#baeed9] text-[#002117] font-bold rounded-lg cursor-pointer" title="Krishi Melawa">10</span>
              <span className="p-1.5 text-[#404945]">11</span>
              <span className="p-1.5 text-[#404945]">12</span>
              <span className="p-1.5 text-[#404945]">13</span>
              {/* 14th - Fogging & Vaccine */}
              <span className="p-1.5 bg-[#ffdad6] text-[#ba1a1a] font-bold rounded-lg cursor-pointer" title="Mission Indradhanush">14</span>
              {/* 15th - Friday Haat */}
              <span className="p-1.5 bg-[#baeed9] text-[#002117] font-bold rounded-lg cursor-pointer" title="Shukrawar Haat">15</span>
              <span className="p-1.5 text-[#404945]">16</span>

              {/* 17th - Eye Camp */}
              <span className="p-1.5 bg-[#ffdad6] text-[#ba1a1a] font-bold rounded-lg cursor-pointer" title="Free Eye Camp">17</span>
              <span className="p-1.5 text-[#404945]">18</span>
              <span className="p-1.5 text-[#404945]">19</span>
              <span className="p-1.5 text-[#404945]">20</span>
              <span className="p-1.5 text-[#404945]">21</span>
              {/* 22nd - Friday Haat */}
              <span className="p-1.5 bg-[#baeed9] text-[#002117] font-bold rounded-lg cursor-pointer" title="Shukrawar Haat">22</span>
              <span className="p-1.5 text-[#404945]">23</span>

              <span className="p-1.5 text-[#404945]">24</span>
              <span className="p-1.5 text-[#404945]">25</span>
              <span className="p-1.5 text-[#404945]">26</span>
              <span className="p-1.5 text-[#404945]">27</span>
              <span className="p-1.5 text-[#404945]">28</span>
              {/* 29th - Friday Haat */}
              <span className="p-1.5 bg-[#baeed9] text-[#002117] font-bold rounded-lg cursor-pointer" title="Shukrawar Haat">29</span>
              <span className="p-1.5 text-[#404945]">30</span>
            </div>

            {/* Calendar Legend */}
            <div className="flex items-center justify-between text-[10px] text-[#707974] pt-2 border-t border-[#f3ede4]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#003629]" />
                <span>Statutory</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                <span>Medical Camp</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#006a4e]" />
                <span>Agri / Haat</span>
              </span>
            </div>
          </div>

          {/* WIDGET 2: HOST A FUNCTION / HALL BOOKING */}
          <div className="bg-[#003629] text-white rounded-2xl p-5 shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#baeed9] text-[20px]">meeting_room</span>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#baeed9] block">
                  CIVIC VENUE RESERVATION
                </span>
                <h3 className="font-heading font-extrabold text-[15px] leading-snug">
                  Host a Village Function or Book Panchayat Hall
                </h3>
              </div>
            </div>

            <p className="text-[11px] text-[#e8e2d9] leading-relaxed">
              Ideal space for family weddings, sacred ceremonies, public meetings, or youth mock test camps. Subsidized civic rates for Asgaon residents.
            </p>

            <div className="bg-white/10 p-3 rounded-xl flex flex-col gap-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>Community Hall (400 Capacity):</span>
                <strong className="text-[#baeed9]">₹1,500 / Day</strong>
              </div>
              <div className="flex justify-between">
                <span>Sound System / PA &amp; Mic:</span>
                <strong className="text-[#baeed9]">Included</strong>
              </div>
              <div className="flex justify-between">
                <span>Drinking Water Tanker (2,000 L):</span>
                <strong className="text-[#baeed9]">₹250 (Govt Rate)</strong>
              </div>
            </div>

            <button
              onClick={() => setShowHallModal(true)}
              className="w-full py-2.5 bg-[#a63b00] hover:bg-[#852f00] text-white text-[12px] font-bold rounded-xl transition-all shadow-xs"
            >
              Apply for Hall NOC &amp; Hall Booking
            </button>
          </div>

          {/* WIDGET 4: SWACHHATA ADVISORY */}
          <div className="bg-[#fff8f0] rounded-2xl p-4 border border-[#ffe0cc] shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a63b00] text-[18px]">eco</span>
              <h4 className="font-heading font-bold text-[13px] text-[#a63b00]">
                Panchayat Swachhata By-laws
              </h4>
            </div>

            <ul className="text-[11px] text-[#404945] flex flex-col gap-2">
              <li className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#ba1a1a] mt-0.5 shrink-0">cancel</span>
                <span>Plastic litter or single-use thermo-plate disposal inside fair grounds carries a ₹50 fine.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#006a4e] mt-0.5 shrink-0">check_circle</span>
                <span>Organic vegetable leftover must be deposited in marked green compost carts.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#a63b00] mt-0.5 shrink-0">volume_off</span>
                <span>Loudspeakers curfew strictly enforced after 10:00 PM as per Pauni Police directive.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* MODAL 1: SUBMIT EVENT NOTICE */}
      {showEventSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEventSubmitModal(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#006a4e] text-[24px]">event_note</span>
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#003629]">
                  Submit Community Event
                </h3>
                <span className="text-[11px] text-[#707974]">Publish to Asgaon Public Village Calendar</span>
              </div>
            </div>

            {modalSuccess ? (
              <div className="bg-[#baeed9]/40 border border-[#006a4e] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-[#006a4e] text-[40px] mb-2">check_circle</span>
                <h4 className="font-bold text-[15px] text-[#003629]">Event Proposal Submitted!</h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  Panchayat secretariat will verify and publish your event within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEventFormSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Event / Programme Title</label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Free Blood Donation Camp / Kabaddi Tournament"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#003629] block mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#003629] block mb-1">Category</label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                    >
                      <option>Cultural / Religious</option>
                      <option>Medical &amp; Health Camp</option>
                      <option>Agriculture Melawa</option>
                      <option>Sports &amp; Youth</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Venue / Location in Asgaon</label>
                  <input
                    type="text"
                    required
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="e.g. Vitthal Mandir Sabha Gruh / ZP High School"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Organizer &amp; Contact Mobile</label>
                  <input
                    type="text"
                    required
                    value={eventOrganizer}
                    onChange={(e) => setEventOrganizer(e.target.value)}
                    placeholder="e.g. Asgaon Yuvak Mandal (98221 00000)"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingEvent}
                  className="w-full py-2.5 bg-[#003629] hover:bg-[#00281e] text-white font-bold rounded-xl transition-all shadow-xs mt-1 disabled:opacity-50"
                >
                  {isSubmittingEvent ? 'Submitting to Panchayat...' : 'Submit for Panchayat Approval'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: HALL BOOKING */}
      {showHallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setShowHallModal(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#a63b00] text-[24px]">meeting_room</span>
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#003629]">
                  Book Gram Panchayat Samaj Mandir
                </h3>
                <span className="text-[11px] text-[#707974]">Civic Hall &amp; Ground Reservation</span>
              </div>
            </div>

            {modalSuccess ? (
              <div className="bg-[#baeed9]/40 border border-[#006a4e] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-[#006a4e] text-[40px] mb-2">check_circle</span>
                <h4 className="font-bold text-[15px] text-[#003629]">Hall Booking Slot Held!</h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  Provisional NOC generated. Visit the Gram Sevak desk with ₹1,500 receipt fee.
                </p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Applicant Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunil Ramesh Jadhav"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#003629] block mb-1">Booking Date</label>
                    <input
                      type="date"
                      required
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#003629] block mb-1">Function Purpose</label>
                    <select className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white">
                      <option>Wedding / Engagement</option>
                      <option>Naming Ceremony / Birthday</option>
                      <option>Public / SHG Meeting</option>
                      <option>Cultural Programme</option>
                    </select>
                  </div>
                </div>
                <div className="bg-[#fff8f0] p-2.5 rounded-lg border border-[#ffe0cc] text-[11px] text-[#a63b00]">
                  Rate: ₹1,500/day includes hall electricity &amp; PA mic. Cleanliness deposit ₹500 refundable.
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#a63b00] hover:bg-[#852f00] text-white font-bold rounded-xl transition-all shadow-xs mt-1"
                >
                  Generate Provisional Booking
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: PRE-REGISTRATION TOKEN */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setShowTokenModal(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#006a4e] text-[24px]">confirmation_number</span>
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#003629]">
                  Claim Free Event Token
                </h3>
                <span className="text-[11px] text-[#707974]">{tokenType}</span>
              </div>
            </div>

            {modalSuccess ? (
              <div className="bg-[#baeed9]/40 border border-[#006a4e] rounded-xl p-4 text-center">
                <span className="material-symbols-outlined text-[#006a4e] text-[40px] mb-2">check_circle</span>
                <h4 className="font-bold text-[15px] text-[#003629]">टोकन #{generatedToken || 'ASG-894'} निश्चित झाले!</h4>
                <p className="text-[12px] text-[#404945] mt-1">
                  नोंदणीकृत क्रमांकावर एसएमएस पाठवला आहे. प्रवेशद्वारावर हा टोकन क्रमांक दाखवून रांगेविना प्रवेश मिळवा.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTokenSubmit} className="flex flex-col gap-3 text-[12px]">
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Beneficiary Name</label>
                  <input
                    type="text"
                    required
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="e.g. Babanrao Thorat"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">Mobile Number (for SMS token)</label>
                  <input
                    type="tel"
                    required
                    value={tokenPhone}
                    onChange={(e) => setTokenPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div className="bg-[#baeed9]/30 p-2.5 rounded-lg border border-[#006a4e]/20 text-[11px] text-[#003629]">
                  100% Free entry. Guaranteed medicine/seed kit priority allocation.
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#003629] hover:bg-[#00281e] text-white font-bold rounded-xl transition-all shadow-xs mt-1"
                >
                  Generate Fast-Track Token
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
