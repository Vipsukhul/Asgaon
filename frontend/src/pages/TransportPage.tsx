import React, { useState, useMemo, useEffect } from 'react';
import {
  BUS_SCHEDULES,
  AUTO_DRIVERS,
  DEPOT_CONTACTS,
  MSRTC_CONCESSIONS,
  type BusSchedule,
  type AutoDriver,
  type DepotContact
} from '../data/transportData';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';
import {
 
  ArrowRight,
  Phone,
  Share2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Navigation,
  Compass,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check
} from 'lucide-react';

interface TransportPageProps {
  onNavigateHome: () => void;
  onNavigateToAdmin?: () => void;
}

export const TransportPage: React.FC<TransportPageProps> = ({ onNavigateHome }) => {
  const { lang, t } = useLanguage();
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<'all' | 'pauni' | 'bhandara' | 'nagpur' | 'other' | 'incoming'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'buses' | 'autos' | 'depots' | 'concessions'>('buses');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Close filter modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFilterOpen) {
        setIsFilterOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterOpen]);

  // Dynamic state loaded from localStorage, falling back to mock data
  const [buses, setBuses] = useState<BusSchedule[]>(() => {
    const saved = localStorage.getItem('dg_transport_buses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        /* ignore */
      }
    }
    return BUS_SCHEDULES;
  });

  const [autos, setAutos] = useState<AutoDriver[]>(() => {
    const saved = localStorage.getItem('dg_transport_autos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        /* ignore */
      }
    }
    return AUTO_DRIVERS;
  });

  const [depots, setDepots] = useState<DepotContact[]>(() => {
    const saved = localStorage.getItem('dg_transport_depots');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        /* ignore */
      }
    }
    return DEPOT_CONTACTS;
  });

  // Listen for admin changes dispatched across tabs / windows
  useEffect(() => {
    const handleSync = () => {
      const savedBuses = localStorage.getItem('dg_transport_buses');
      if (savedBuses) {
        try { setBuses(JSON.parse(savedBuses)); } catch { }
      }
      const savedAutos = localStorage.getItem('dg_transport_autos');
      if (savedAutos) {
        try { setAutos(JSON.parse(savedAutos)); } catch { }
      }
      const savedDepots = localStorage.getItem('dg_transport_depots');
      if (savedDepots) {
        try { setDepots(JSON.parse(savedDepots)); } catch { }
      }
    };

    window.addEventListener('dg_transport_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dg_transport_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Compute upcoming bus relative to current local time
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTimeToMinutes = (time24: string) => {
    const [h, m] = (time24 || '00:00').split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const nextBus = useMemo(() => {
    const sorted = [...buses]
      .filter((b) => b.destination !== 'Asgaon')
      .sort((a, b) => parseTimeToMinutes(a.departureTime24) - parseTimeToMinutes(b.departureTime24));

    if (sorted.length === 0) return null;
    const upcoming = sorted.find((b) => parseTimeToMinutes(b.departureTime24) >= currentMinutes);
    return upcoming || sorted[0];
  }, [buses, currentMinutes]);

  // Filtered schedules
  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      // Route filter
      if (selectedRouteFilter === 'pauni' && bus.destination !== 'Pauni') return false;
      if (selectedRouteFilter === 'bhandara' && bus.destination !== 'Bhandara') return false;
      if (selectedRouteFilter === 'nagpur' && bus.destination !== 'Nagpur') return false;
      if (selectedRouteFilter === 'incoming' && bus.destination !== 'Asgaon') return false;
      if (selectedRouteFilter === 'other' && ['Pauni', 'Bhandara', 'Nagpur', 'Asgaon'].includes(bus.destination)) return false;

      // Time filter
      const mins = parseTimeToMinutes(bus.departureTime24);
      if (timeFilter === 'morning' && (mins < 360 || mins >= 720)) return false; // 06:00 to 12:00
      if (timeFilter === 'afternoon' && (mins < 720 || mins >= 960)) return false; // 12:00 to 16:00
      if (timeFilter === 'evening' && (mins < 960 || mins >= 1260)) return false; // 16:00 to 21:00
      if (timeFilter === 'night' && mins < 1260 && mins >= 360) return false; // 21:00 to 06:00

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDest = bus.destination.toLowerCase().includes(q) || (bus.destinationMarathi || '').toLowerCase().includes(q);
        const matchSource = bus.source.toLowerCase().includes(q) || (bus.sourceMarathi || '').toLowerCase().includes(q);
        const matchDepot = bus.depot.toLowerCase().includes(q) || (bus.depotMarathi || '').toLowerCase().includes(q);
        const matchVia = (bus.via || []).some((v) => v.toLowerCase().includes(q)) || (bus.viaMarathi || []).some((v) => v.toLowerCase().includes(q));
        if (!matchDest && !matchSource && !matchDepot && !matchVia) return false;
      }

      return true;
    });
  }, [buses, selectedRouteFilter, timeFilter, searchQuery]);

  const handleShareBus = (bus: BusSchedule) => {
    const text = `🚌 *आसगाव एसटी बस वेळापत्रक*\n\n` +
      `📍 *मार्ग:* ${bus.sourceMarathi} ➜ ${bus.destinationMarathi}\n` +
      `⏰ *वेळ:* ${bus.departureTime} (पोहोच: ${bus.approxArrivalTime})\n` +
      `🚍 *बस प्रकार:* ${bus.busTypeMarathi} (${bus.depotMarathi})\n` +
      `🎟️ *भाडे:* ₹${bus.fareGeneral} (महिला सवलत: ₹${bus.fareMahila})\n` +
      `🛑 *थांबा:* ${bus.boardingPointMarathi}\n` +
      `🔗 *तपशील व इतर बसेस पहा:* https://asgaon.digital/transport`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const getMinutesDifferenceText = (time24: string) => {
    const busMins = parseTimeToMinutes(time24);
    let diff = busMins - currentMinutes;
    if (diff < 0) diff += 1440;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    if (hours === 0) return `${mins} मिनिटांत`;
    return `${hours} तास ${mins} मिनिटांत`;
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TransitService',
    name: 'Asgaon ST Bus Transport Service & Timetable',
    description: 'MSRTC Bus Schedules connecting Asgaon to Pauni, Bhandara, Nagpur, Sakoli, and Bramhapuri in Maharashtra.',
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'Maharashtra State Road Transport Corporation (MSRTC) Pauni & Bhandara Depots'
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Asgaon, Pauni Taluka, Bhandara District, Maharashtra'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Bus Routes from Asgaon',
      itemListElement: buses.slice(0, 10).map((b, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: {
          '@type': 'BusTrip',
          busName: `${b.source} to ${b.destination} (${b.busType})`,
          departureTime: b.departureTime24,
          departureStation: {
            '@type': 'BusStop',
            name: `${b.boardingPointAtAsgaon}, Asgaon`
          },
          arrivalStation: {
            '@type': 'BusStop',
            name: b.destination
          }
        },
        price: b.fareGeneral,
        priceCurrency: 'INR'
      }))
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <SEOHead
        title="Asgaon ST Bus Time Table & Transport Schedule | आसगाव एसटी बस वेळापत्रक - पवनी, भंडारा, नागपूर"
        description="आसगाव एसटी बस वेळापत्रक - आसगाव ते पवनी, भंडारा, नागपूर, साकोली बसेसची वेळ, भाडे, महिला सन्मान योजना ५०% सवलत, गावातील रिक्षा चालक संपर्क."
        keywords="Asgaon ST bus time table, Asgaon to Pauni bus timings, Asgaon to Bhandara bus schedule, Pauni depot inquiry, MSRTC Pauni, Asgaon auto rickshaw contact, आसगाव एसटी वेळापत्रक, पवनी आगार संपर्क"
        canonicalUrl="https://asgaon.digital/transport"
        structuredData={structuredData}
      />

      <Breadcrumb
        items={[
          { label: t('nav_home'), onClick: onNavigateHome },
          { label: t('nav_transport'), active: true }
        ]}
      />

      {/* Hero Header Banner - Standardized to Match All Other Pages */}
      <header className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e8e2d9] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="font-heading font-extrabold text-[24px] sm:text-[28px] text-[#166534] leading-tight mb-1">
            {lang === 'MR' ? 'आसगाव एसटी बस वेळापत्रक व वाहतूक' : 'Asgaon ST Bus Timetable & Transit'}
          </h1>
          <p className="font-heading font-bold text-[14px] sm:text-[15px] text-[#c2410c] mb-2">
            {lang === 'MR' ? 'पवनी, भंडारा, नागपूर, साकोली बसेसची वेळ, थांबे, महिला सन्मान ५०% सवलत व रिक्षा संपर्क' : 'Live MSRTC bus schedules, Pauni & Bhandara routes, 50% Mahila discount pass & village autos'}
          </p>
          {nextBus && (
            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-xl bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-xs font-bold">
              <span className="uppercase text-[10px] bg-[#166534] text-white px-1.5 py-0.5 rounded font-black">{lang === 'MR' ? 'पुढील बस' : 'Next Bus'}</span>
              <span>{lang === 'MR' ? nextBus.destinationMarathi : nextBus.destination}</span>
              <span className="font-mono text-stone-900 font-extrabold">{nextBus.departureTime}</span>
              <span className="text-emerald-700 font-semibold">({getMinutesDifferenceText(nextBus.departureTime24)})</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-72 shrink-0">
          <a
            href={`tel:${depots[0]?.phone || '07185-255342'}`}
            className="w-full py-2.5 px-4 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Phone className="w-4 h-4" />
            <span>{lang === 'MR' ? 'पवनी आगार चौकशी' : 'Pauni Depot Helpline'}</span>
          </a>
          {nextBus && (
            <button
              type="button"
              onClick={() => handleShareBus(nextBus)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#f9f3ea] hover:bg-[#efe7dc] text-[#166534] border border-[#e8e2d9] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{lang === 'MR' ? 'वेळ शेअर करा' : 'Share Timing'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col gap-6">
        {/* Navigation Tabs - Matched to Application Theme */}
        <div className="bg-white rounded-2xl shadow-md border border-[#e8e2d9] p-1.5 flex overflow-x-auto gap-1">
          <button
            onClick={() => setSelectedTab('buses')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${selectedTab === 'buses'
                ? 'bg-[#166534] text-[#a7f3d0] shadow-xs'
                : 'text-[#55605a] hover:bg-[#f3ede4]'
              }`}
          >
            <Navigation className="w-4 h-4" />
            <span>{lang === 'MR' ? `वेळापत्रक` : `Schedule`}</span>
          </button>

          <button
            onClick={() => setSelectedTab('autos')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${selectedTab === 'autos'
                ? 'bg-[#166534] text-[#a7f3d0] shadow-xs'
                : 'text-[#55605a] hover:bg-[#f3ede4]'
              }`}
          >
            <Compass className="w-4 h-4" />
            <span>{lang === 'MR' ? `रिक्षा` : `Auto`}</span>
          </button>

          <button
            onClick={() => setSelectedTab('depots')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${selectedTab === 'depots'
                ? 'bg-[#166534] text-[#a7f3d0] shadow-xs'
                : 'text-[#55605a] hover:bg-[#f3ede4]'
              }`}
          >
            <Phone className="w-4 h-4" />
            <span>{lang === 'MR' ? `आगार संपर्क` : `Depot`}</span>
          </button>

          <button
            onClick={() => setSelectedTab('concessions')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${selectedTab === 'concessions'
                ? 'bg-[#166534] text-[#a7f3d0] shadow-xs'
                : 'text-[#55605a] hover:bg-[#f3ede4]'
              }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{lang === 'MR' ? 'पास माहिती' : 'Pass Guide'}</span>
          </button>
        </div>

        {/* TAB 1: BUSES */}
        {selectedTab === 'buses' && (
          <div className="mt-6 space-y-6">
            {/* Search and Unified Filter Bar */}
            <div className="bg-white rounded-2xl shadow-xs border border-[#e8e2d9] p-3 sm:p-4">
              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'MR' ? 'गाव, शहर, आगार किंवा थांबा शोधा...' : 'Search destination, city, depot or stop...'}
                    className="w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-2.5 rounded-xl border border-[#e8e2d9] text-xs sm:text-sm focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20 bg-[#f9f3ea] text-[#1d1b16] placeholder:text-[#707974]"
                  />
                  <Navigation className="w-4 h-4 text-[#707974] absolute left-3 top-3 pointer-events-none" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 p-0.5 text-[#707974] hover:text-[#1d1b16]"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Icon Button in Flex */}
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(true)}
                  className={`relative shrink-0 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all shadow-xs ${
                    (selectedRouteFilter !== 'all' || timeFilter !== 'all')
                      ? 'bg-[#166534] text-white border-[#166534] ring-2 ring-[#166534]/20'
                      : 'bg-[#f4efe8] text-[#1d1b16] border-[#e8e2d9] hover:bg-[#eae2d7]'
                  }`}
                  aria-label="Open filter options"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {lang === 'MR' ? 'फिल्टर' : 'Filter'}
                  </span>
                  {(selectedRouteFilter !== 'all' || timeFilter !== 'all') && (
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-stone-900 text-[10px] sm:text-[11px] font-black flex items-center justify-center">
                      {(selectedRouteFilter !== 'all' ? 1 : 0) + (timeFilter !== 'all' ? 1 : 0)}
                    </span>
                  )}
                </button>
              </div>

              {/* Active Filter Chips (Ultra-compact dismissible bar, appears ONLY when filters active) */}
              {(selectedRouteFilter !== 'all' || timeFilter !== 'all') && (
                <div className="mt-2.5 pt-2 border-t border-[#f0eee8] flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="text-[11px] font-medium text-[#707974]">
                    {lang === 'MR' ? 'सक्रिय फिल्टर्स:' : 'Active:'}
                  </span>
                  {selectedRouteFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
                      {selectedRouteFilter === 'pauni' ? (lang === 'MR' ? 'पवनी' : 'Pauni') :
                       selectedRouteFilter === 'bhandara' ? (lang === 'MR' ? 'भंडारा' : 'Bhandara') :
                       selectedRouteFilter === 'nagpur' ? (lang === 'MR' ? 'नागपूर' : 'Nagpur') :
                       selectedRouteFilter === 'incoming' ? (lang === 'MR' ? 'आसगावात येणाऱ्या' : 'Incoming') :
                       (lang === 'MR' ? 'साकोली / इतर' : 'Other')}
                      <button
                        onClick={() => setSelectedRouteFilter('all')}
                        className="hover:opacity-70 ml-0.5"
                        aria-label="Clear route filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {timeFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
                      {timeFilter === 'morning' ? (lang === 'MR' ? 'सकाळ (६-१२)' : 'Morning') :
                       timeFilter === 'afternoon' ? (lang === 'MR' ? 'दुपार (१२-४)' : 'Afternoon') :
                       timeFilter === 'evening' ? (lang === 'MR' ? 'सायंकाळ (४-९)' : 'Evening') :
                       (lang === 'MR' ? 'रात्र (९ नंतर)' : 'Night')}
                      <button
                        onClick={() => setTimeFilter('all')}
                        className="hover:opacity-70 ml-0.5"
                        aria-label="Clear time filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedRouteFilter('all');
                      setTimeFilter('all');
                    }}
                    className="text-[11px] font-bold text-[#c2410c] hover:underline ml-1"
                  >
                    {lang === 'MR' ? 'सर्व काढा' : 'Clear all'}
                  </button>
                </div>
              )}
            </div>

            {/* Filter Dialog Modal / Mobile Bottom Sheet */}
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
                          {lang === 'MR' ? 'बस वेळापत्रक फिल्टर्स' : 'Filter Bus Schedules'}
                        </h3>
                        <p className="text-[11px] text-[#707974]">
                          {lang === 'MR'
                            ? 'मार्ग व वेळेनुसार आवश्यक बस निवडा'
                            : 'Filter buses by destination route and departure time'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-8 h-8 rounded-full bg-[#f4efe8] hover:bg-[#eae2d7] text-[#707974] hover:text-[#1d1b16] flex items-center justify-center transition-all"
                      aria-label="Close filters"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-5 overflow-y-auto space-y-5 text-sm">
                    {/* Section 1: Route Destination */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-[#1d1b16] uppercase tracking-wider">
                          {lang === 'MR' ? '१. मार्ग / गंतव्यस्थान' : '1. Route / Destination'}
                        </span>
                        {selectedRouteFilter !== 'all' && (
                          <button
                            onClick={() => setSelectedRouteFilter('all')}
                            className="text-[11px] text-[#c2410c] font-semibold hover:underline"
                          >
                            {lang === 'MR' ? 'सर्व दाखवा' : 'Reset'}
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'all', label: lang === 'MR' ? 'सर्व मार्ग' : 'All Routes' },
                          { id: 'pauni', label: lang === 'MR' ? 'पवनी' : 'Pauni' },
                          { id: 'bhandara', label: lang === 'MR' ? 'भंडारा' : 'Bhandara' },
                          { id: 'nagpur', label: lang === 'MR' ? 'नागपूर' : 'Nagpur' },
                          { id: 'other', label: lang === 'MR' ? 'साकोली / इतर' : 'Other' },
                          { id: 'incoming', label: lang === 'MR' ? 'आसगावात येणाऱ्या' : 'Incoming' }
                        ].map((r) => {
                          const isSelected = selectedRouteFilter === r.id;
                          return (
                            <button
                              key={r.id}
                              onClick={() => setSelectedRouteFilter(r.id as any)}
                              className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                                isSelected
                                  ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                                  : 'bg-[#fdfbf7] text-[#404945] border-[#e8e2d9] hover:bg-[#f4efe8]'
                              }`}
                            >
                              <span className="truncate">{r.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-300" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Time of Day */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-[#1d1b16] uppercase tracking-wider">
                          {lang === 'MR' ? '२. प्रस्थान वेळ' : '2. Departure Time'}
                        </span>
                        {timeFilter !== 'all' && (
                          <button
                            onClick={() => setTimeFilter('all')}
                            className="text-[11px] text-[#c2410c] font-semibold hover:underline"
                          >
                            {lang === 'MR' ? 'सर्व दाखवा' : 'Reset'}
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { id: 'all', label: lang === 'MR' ? 'सर्व वेळ' : 'All Times' },
                          { id: 'morning', label: lang === 'MR' ? 'सकाळ (०६:०० ते १२:००)' : 'Morning (6am - 12pm)' },
                          { id: 'afternoon', label: lang === 'MR' ? 'दुपार (१२:०० ते १६:००)' : 'Afternoon (12pm - 4pm)' },
                          { id: 'evening', label: lang === 'MR' ? 'सायंकाळ (१६:०० ते २१:००)' : 'Evening (4pm - 9pm)' },
                          { id: 'night', label: lang === 'MR' ? 'रात्र (२१:०० नंतर)' : 'Night (After 9pm)' }
                        ].map((t) => {
                          const isSelected = timeFilter === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setTimeFilter(t.id as any)}
                              className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                                isSelected
                                  ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                                  : 'bg-[#fdfbf7] text-[#404945] border-[#e8e2d9] hover:bg-[#f4efe8]'
                              }`}
                            >
                              <span className="truncate">{t.label}</span>
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
                        setSelectedRouteFilter('all');
                        setTimeFilter('all');
                      }}
                      disabled={selectedRouteFilter === 'all' && timeFilter === 'all'}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedRouteFilter !== 'all' || timeFilter !== 'all'
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
                          ? `निकाल दाखवा (${filteredBuses.length})`
                          : `Show ${filteredBuses.length} Buses`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Count & Note */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
              <div className="text-xs sm:text-sm font-bold text-[#166534]">
                एकूण <span className="text-[#c2410c] font-black">{filteredBuses.length}</span> बसेस उपलब्ध
              </div>
            </div>

            {/* Bus Cards List */}
            {filteredBuses.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-[#e8e2d9]">
                <div className="w-12 h-12 rounded-full bg-[#f4efe8] flex items-center justify-center mx-auto text-[#707974] mb-3">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#1d1b16]">या फिल्टरनुसार बस आढळली नाही</h3>
                <p className="text-xs text-[#707974] mt-1">
                  कृपया शोध शब्द बदला किंवा 'सर्व मार्ग' व 'सर्व वेळ' निवडून पुन्हा तपासा.
                </p>
                <button
                  onClick={() => {
                    setSelectedRouteFilter('all');
                    setTimeFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold"
                >
                  सर्व बसेस दाखवा
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBuses.map((bus) => {
                  const isNext = bus.id === nextBus?.id;
                  return (
                    <div
                      key={bus.id}
                      className={`bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${isNext
                          ? 'border-[#006a4e] ring-2 ring-[#006a4e]/20 shadow-xs bg-gradient-to-br from-[#166534]/5 via-white to-white'
                          : 'border-[#e8e2d9] shadow-xs'
                        }`}
                    >
                      <div>
                        {/* Top Meta Header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${bus.busType === 'Shivshahi'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : bus.busType === 'Asiad'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-red-100 text-red-800 border border-red-200'
                                }`}
                            >
                              {bus.busTypeMarathi}
                            </span>
                            <span className="text-[11px] text-[#555] font-semibold bg-[#f4efe8] px-2 py-0.5 rounded">
                              {bus.depotMarathi}
                            </span>
                          </div>

                          {isNext && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#166534] text-[#a7f3d0] animate-pulse">
                              पुढील फेरी
                            </span>
                          )}
                        </div>

                        {/* Origin -> Destination Route */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 text-base sm:text-lg font-extrabold text-[#166534]">
                              <span>{bus.sourceMarathi}</span>
                              <ArrowRight className="w-4 h-4 text-[#c2410c] shrink-0" />
                              <span className="text-[#c2410c]">{bus.destinationMarathi}</span>
                            </div>
                            <div className="text-xs text-[#707974] mt-0.5">
                              {bus.source} to {bus.destination}
                            </div>
                          </div>

                          {/* Time Badge */}
                          <div className="text-right shrink-0">
                            <div className="text-lg sm:text-xl font-black text-[#166534] font-mono">
                              {bus.departureTime}
                            </div>
                            <div className="text-[11px] text-[#707974] font-medium">
                              पोहोच: ~{bus.approxArrivalTime}
                            </div>
                          </div>
                        </div>

                        {/* Via Route Stops */}
                        <div className="mt-3.5 pt-3 border-t border-[#f0eee8]">
                          <div className="text-[11px] font-bold text-[#707974] mb-1 flex items-center gap-1">
                            <Compass className="w-3 h-3 text-[#707974]" />
                            <span>मार्ग (मार्गे):</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {(bus.viaMarathi || []).map((v, i) => (
                              <span
                                key={i}
                                className="text-[11px] px-2 py-0.5 rounded bg-[#f4efe8] text-[#404945] font-medium"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>

                        

                        {/* Fare Breakdown */}
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                          <div className="bg-[#f4efe8] border border-[#e8e2d9] rounded-xl p-2">
                            <div className="text-[10px] text-[#707974] font-semibold">सर्वसाधारण</div>
                            <div className="text-xs sm:text-sm font-bold text-[#1d1b16] mt-0.5">
                              ₹{bus.fareGeneral}
                            </div>
                          </div>
                          <div className="bg-[#fef9ee] border border-[#fde68a] rounded-xl p-2">
                            <div className="text-[10px] text-[#c2410c] font-bold">महिला सवलत (५०%)</div>
                            <div className="text-xs sm:text-sm font-bold text-[#c2410c] mt-0.5">
                              ₹{bus.fareMahila}
                            </div>
                          </div>
                          <div className="bg-[#e6f7f0] border border-[#b8ebd5] rounded-xl p-2">
                            <div className="text-[10px] text-[#006a4e] font-bold">ज्येष्ठ (७५+)</div>
                            <div className="text-xs sm:text-sm font-bold text-[#006a4e] mt-0.5">
                              {bus.fareSenior === 0 ? 'मोफत' : `₹${bus.fareSenior}`}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-[#f0eee8] flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-[#707974] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#707974]" />
                          <span>{bus.frequencyMarathi}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleShareBus(bus)}
                            title="WhatsApp वर ही वेळ शेअर करा"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#e6f7f0] hover:bg-[#d0f0e3] text-[#006a4e] border border-[#b8ebd5] text-xs font-bold transition-all"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>शेअर करा</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VILLAGE AUTOS & VEHICLES */}
        {selectedTab === 'autos' && (
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#166534]">गावातील रिक्षा व टॅक्सी चालक</h2>
                <p className="text-xs text-[#707974] mt-1">
                  आसगाव चौकातील स्थानिक चालक; इमर्जन्सी, रुग्णालय, पवनी कोर्ट किंवा शेतीच्या कामानिमित्त थेट संपर्क करा.
                </p>
              </div>
              <div className="text-xs bg-[#a7f3d0]/30 text-[#166534] border border-[#cadbcf] px-3 py-1.5 rounded-xl font-bold">
                शेअरिंग भाडे: ₹३० प्रति सीट (आसगाव ⇄ पवनी)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {autos.map((driver) => (
                <div
                  key={driver.id}
                  className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#166534] text-[#a7f3d0] flex items-center justify-center font-bold text-sm">
                          {driver.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#166534]">{driver.nameMarathi}</h3>
                          <div className="text-xs text-[#707974]">{driver.name} • {driver.vehicleNumber}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#e6f7f0] text-[#006a4e] border border-[#b8ebd5]">
                        {driver.isAvailable ? 'उपलब्ध' : 'व्यस्त'}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-[#404945]">
                        <Compass className="w-3.5 h-3.5 text-[#707974] mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-[#166534]">मुख्य मार्ग: </strong>
                          {driver.primaryRouteMarathi}
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-[#404945]">
                        <Navigation className="w-3.5 h-3.5 text-[#707974] mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-[#166534]">स्टँड थांबा: </strong>
                          {driver.standLocationMarathi}
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-[#404945] bg-[#f9f3ea] p-2 rounded-lg border border-[#e8e2d9]">
                        <div className="font-semibold text-[#1d1b16]">अंदाजे भाडे:</div>
                        <div className="text-[#c2410c] font-bold">{driver.estimatedFare}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f0eee8] flex items-center justify-between gap-2">
                    <span className="text-xs text-[#707974] font-mono">{driver.phone}</span>
                    <a
                      href={`tel:${driver.phone}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>कॉल करा</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DEPOT CONTACTS */}
        {selectedTab === 'depots' && (
          <div className="mt-6 space-y-6">
            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {depots.map((depot, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#e6f7f0] text-[#006a4e] flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-[#006a4e] bg-[#e6f7f0] px-2 py-0.5 rounded">
                        अंतर: {depot.distanceFromAsgaon}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#166534]">{depot.depotNameMarathi}</h3>
                    <div className="text-xs text-[#707974]">{depot.depotName}</div>

                    <div className="mt-4 space-y-2 text-xs text-[#404945]">
                      <div>
                        <span className="font-bold text-[#166534]">पत्ता: </span>
                        <span>{depot.addressMarathi}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#166534]">कंट्रोलर डेस्क: </span>
                        <span className="font-mono text-[#1d1b16]">{depot.controllerDesk}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#f0eee8]">
                    <a
                      href={`tel:${depot.phone}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{depot.phone} वर कॉल करा</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CONCESSIONS & PASSES */}
        {selectedTab === 'concessions' && (
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
              <h2 className="text-lg font-bold text-[#166534]">एसटी प्रवास सवलती व पास योजना</h2>
              <p className="text-xs text-[#707974] mt-1">
                महाराष्ट्र शासनाने महिला, ज्येष्ठ नागरिक आणि शालेय विद्यार्थ्यांसाठी लागू केलेल्या सवलतींचे नियम व अटी.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MSRTC_CONCESSIONS.map((c, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-[#166534]">{c.title}</h3>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] shrink-0">
                      {c.benefit}
                    </span>
                  </div>

                  <div className="text-xs text-[#404945] space-y-1.5">
                    <div>
                      <strong className="text-[#166534]">पात्रता: </strong>
                      {c.eligibility}
                    </div>
                    <div>
                      <strong className="text-[#166534]">आवश्यक कागदपत्रे / नियम: </strong>
                      {c.requirement}
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-[#006a4e] font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>पवनी किंवा भंडारा आगारात पास काउंटरवर सविस्तर माहिती उपलब्ध.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
