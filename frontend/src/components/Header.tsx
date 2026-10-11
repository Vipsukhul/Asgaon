import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AsgaonLogo } from './AsgaonLogo';
import { isPushSubscribed, subscribeUserToPush, unsubscribeUserFromPush } from '../services/pushNotifications';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenGrievance: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onSearch: (query: string) => void;
  userRole?: string | null;
  currentUser?: {
    fullName: string;
    phone: string;
    role: string;
    ward: string;
    village: string;
    isLoggedIn: boolean;
    avatarInitials: string;
  };
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLogin,
  activeNav,
  setActiveNav,
  onSearch,
  userRole,
  currentUser,
  onLogout
}) => {
  const { lang, setLang, t } = useLanguage();
  const [searchVal, setSearchVal] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pushActive, setPushActive] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [hasUrgent, setHasUrgent] = useState(false);

  // Lock body scroll when mobile drawer is open & support Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    isPushSubscribed().then(setPushActive);
    api.getAnnouncements()
      .then((data) => {
        if (data && data.length > 0) {
          setRecentAlerts(data.slice(0, 4));
          const urgent = data.some((a: any) => a.priority === 'URGENT' || a.priority === 'HIGH');
          setHasUrgent(urgent);
        }
      })
      .catch(() => {});
  }, []);

  const handleTogglePush = async () => {
    setPushLoading(true);
    try {
      if (pushActive) {
        const res = await unsubscribeUserFromPush();
        alert(res.message);
        setPushActive(false);
      } else {
        const res = await subscribeUserToPush(currentUser?.phone, userRole || undefined);
        alert(res.message);
        if (res.success) setPushActive(true);
      }
    } finally {
      setPushLoading(false);
    }
  };

  const navItems = [
    { id: 'businesses', label: lang === 'MR' ? 'स्थानिक दुकाने' : 'Businesses', icon: 'storefront' },
    { id: 'reviews', label: lang === 'MR' ? 'नागरिक अभिप्राय' : 'Reviews', icon: 'rate_review' },
    { id: 'jobs', label: lang === 'MR' ? 'रोजगार / नोकऱ्या' : 'Jobs', icon: 'work' },
    { id: 'schemes', label: lang === 'MR' ? 'शासकीय योजना' : 'Govt Schemes', icon: 'assured_workload' },
    { id: 'krishi', label: lang === 'MR' ? 'कृषी व बाजारभाव' : 'Krishi / Mandi', icon: 'agriculture' },
    { id: 'shiksha', label: lang === 'MR' ? 'शिक्षण व शाळा' : 'Education', icon: 'school' },
    { id: 'transport', label: lang === 'MR' ? 'वाहतूक व बस' : 'ST Bus / Transport', icon: 'directions_bus' },
    { id: 'marketplace', label: lang === 'MR' ? 'ग्राम बाजार' : 'Marketplace', icon: 'local_mall' },
    { id: 'announcements', label: lang === 'MR' ? 'सूचना व परिपत्रके' : 'Announcements', icon: 'campaign' },
    { id: 'events', label: lang === 'MR' ? 'गावातील कार्यक्रम' : 'Events', icon: 'event' },
    { id: 'blogs', label: lang === 'MR' ? 'ग्राम वार्ता' : 'Stories', icon: 'article' },
    { id: 'emergency', label: lang === 'MR' ? 'आपत्कालीन सेवा' : 'Emergency', icon: 'emergency' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fff8f0]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e8e2d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col gap-2">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <AsgaonLogo onClick={() => setActiveNav('home')} size="md" />
          </div>

          {/* Center Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-2 hidden sm:flex">
              <div className="relative flex items-center w-full h-10 rounded-xl bg-white border border-[#e8e2d9] px-3 shadow-inner">
                <span className="material-symbols-outlined text-[20px] text-[#707974] mr-2">search</span>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={t('header_search_placeholder')}
                  className="w-full bg-transparent text-[#1d1b16] text-[13px] focus:outline-none placeholder:text-[#707974]"
                />
                <div className="flex items-center gap-2 pl-2 border-l border-[#e8e2d9]">
                  <button
                    type="button"
                    title={t('header_voice_search_title')}
                    onClick={() => alert(lang === 'MR' ? 'व्हॉइस सर्च तयार आहे! बोला...' : 'Voice search ready! Speak now...')}
                    className="text-[#003629] hover:text-[#1b4d3e] p-0.5"
                  >
                    <span className="material-symbols-outlined text-[19px]">mic</span>
                  </button>
                  <span className="text-[11px] font-semibold text-[#707974]">{t('header_all')}</span>
                  <span className="material-symbols-outlined text-[16px] text-[#707974]">expand_more</span>
                </div>
              </div>
            </form>

          {/* Actions & Role / Login */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Web Push Notification Bell Popover (Visible only when logged in) */}
            {currentUser?.isLoggedIn && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className={`relative h-8 w-8 rounded-lg flex items-center justify-center transition-all border ${
                    notifDropdownOpen || pushActive
                      ? 'bg-[#baeed9] text-[#002117] border-[#006a4e]/40 shadow-xs ring-1 ring-[#006a4e]/30'
                      : 'bg-white hover:bg-[#f3ede4] text-[#55605a] hover:text-[#003629] border-[#e8e2d9] shadow-2xs'
                  }`}
                  title="गाव पातळीवरील सूचना व थेट अलर्ट (Civic Notifications & Push Alerts)"
                >
                  <span className={`material-symbols-outlined text-[19px] ${pushActive ? 'text-[#006a4e]' : ''}`}>
                    {pushActive ? 'notifications_active' : 'notifications'}
                  </span>
                  {hasUrgent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#d9381e] rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Notification Popover Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#e8e2d9] p-3 z-50 animate-fadeIn text-[12px]">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#e8e2d9]">
                      <div className="flex items-center gap-1.5 font-bold text-[#003629]">
                        <span className="material-symbols-outlined text-[18px] text-[#006a4e]">campaign</span>
                        <span>गाव सूचना व थेट अलर्ट</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#baeed9] text-[#003629]">
                        {recentAlerts.length} ताज्या सूचना
                      </span>
                    </div>

                    {/* Web Push Subscription Action Box */}
                    <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between gap-2 ${
                      pushActive ? 'bg-[#e6f7f0] border-[#b8ebd5]' : 'bg-[#fff8f0] border-[#f0dfcc]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[20px] ${pushActive ? 'text-[#006a4e]' : 'text-[#a63b00]'}`}>
                          {pushActive ? 'check_circle' : 'notifications_paused'}
                        </span>
                        <div>
                          <div className="font-bold text-[#1d1b16] text-[11px] leading-tight">
                            {pushActive ? 'मोबाईल सूचना चालू आहेत' : 'थेट सूचना सुरू करा'}
                          </div>
                          <div className="text-[10px] text-[#707974] leading-tight mt-0.5">
                            {pushActive ? 'पाणी, वीज, APMC दर व तक्रार अपडेट्स' : 'पाणी पुरवथा व महत्त्वाच्या सूचना मिळवा'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleTogglePush}
                        disabled={pushLoading}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black shrink-0 transition-all ${
                          pushActive
                            ? 'bg-white border border-[#b8ebd5] text-[#006a4e] hover:bg-[#d5f3e5]'
                            : 'bg-[#003629] text-[#baeed9] hover:bg-[#1b4d3e] shadow-2xs'
                        }`}
                      >
                        {pushLoading ? '...' : pushActive ? 'सक्रिय ✓' : 'सुरू करा'}
                      </button>
                    </div>

                    {/* Recent Alerts List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {recentAlerts.length > 0 ? (
                        recentAlerts.map((a: any, idx: number) => (
                          <div
                            key={a.id || idx}
                            onClick={() => {
                              setActiveNav('announcements');
                              setNotifDropdownOpen(false);
                            }}
                            className="p-2 rounded-xl bg-[#f9f3ea] hover:bg-[#f3ede4] transition-colors cursor-pointer border border-[#e8e2d9]/60 text-left"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold text-[#003629] truncate text-[11px]">
                                {a.title}
                              </span>
                              {a.priority === 'URGENT' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#ffdad6] text-[#ba1a1a] shrink-0">
                                  तातडीची
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#404945] line-clamp-2 leading-relaxed">
                              {a.message}
                            </p>
                            <div className="flex items-center justify-between mt-1 text-[10px] text-[#707974]">
                              <span>{a.category || 'गाव सूचना'}</span>
                              <span className="text-[#006a4e] font-semibold flex items-center gap-0.5">
                                <span>सविस्तर पहा</span>
                                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-[#707974] text-xs">
                          सध्या कोणतीही नवीन तातडीची सूचना नाही.
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-2.5 pt-2 border-t border-[#e8e2d9] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveNav('announcements');
                          setNotifDropdownOpen(false);
                        }}
                        className="text-[#006a4e] hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <span>सर्व सूचना व परिपत्रके पहा</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-[#707974] hover:text-[#1d1b16] font-bold text-[11px]"
                      >
                        बंद करा
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Language Switcher - Desktop only */}
            <div className="hidden md:flex items-center rounded-lg bg-[#f9f3ea] p-0.5 border border-[#e8e2d9]">
              {(['EN', 'MR'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${lang === l ? 'bg-[#003629] text-white shadow-xs' : 'text-[#707974] hover:text-[#1d1b16]'
                    }`}
                >
                  {l === 'EN' ? 'EN' : 'म'}
                </button>
              ))}
            </div>

            {/* Desktop User status / Login (Hidden on mobile; on mobile it is inside Hamburger Menu at top) */}
            <div className="hidden md:flex items-center">
              {currentUser?.isLoggedIn ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl text-[12px] font-bold transition-all border ${activeNav === 'profile'
                        ? 'bg-[#003629] text-[#baeed9] border-[#003629] shadow-xs'
                        : 'bg-white hover:bg-[#f3ede4] text-[#003629] border-[#e8e2d9] shadow-xs'
                      }`}
                    title="Citizen Profile & Settings"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#003629] text-[#baeed9] flex items-center justify-center text-[10px] font-black">
                      {currentUser?.avatarInitials || (userRole ? userRole.substring(0, 2) : 'AC')}
                    </div>
                    <span className="hidden sm:inline">
                      {currentUser?.fullName || (userRole ? `${userRole} Portal` : 'Asgaon Citizen')}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-[#707974]">expand_more</span>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-[#e8e2d9] p-2 z-50 animate-fadeIn text-[12px]">
                      <div className="p-2.5 bg-[#f9f3ea] rounded-lg border border-[#e8e2d9] mb-1.5">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-full bg-[#003629] text-[#baeed9] flex items-center justify-center text-[10px] font-bold shrink-0">
                            {currentUser?.avatarInitials || (userRole ? userRole.substring(0, 2) : 'AC')}
                          </div>
                          <div className="truncate">
                            <strong className="text-[#003629] block leading-tight truncate">
                              {currentUser?.fullName || 'Asgaon Resident'}
                            </strong>
                            <span className="text-[10px] text-[#006a4e] font-semibold">
                              {currentUser?.role || userRole || 'CITIZEN'} • {currentUser?.phone ? `+91 ${currentUser.phone}` : 'PIN 441910'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Language Switcher in Dropdown */}
                      <div className="p-2 bg-[#f9f3ea] rounded-lg border border-[#e8e2d9] mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#003629]">
                          <span className="material-symbols-outlined text-[15px] text-[#006a4e]">translate</span>
                          <span>भाषा / Lang:</span>
                        </div>
                        <div className="flex items-center rounded-md bg-white p-0.5 border border-[#e8e2d9]">
                          {(['EN', 'MR'] as const).map((l) => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => setLang(l)}
                              className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all ${lang === l ? 'bg-[#003629] text-white shadow-xs' : 'text-[#707974] hover:text-[#1d1b16]'
                                }`}
                            >
                              {l === 'EN' ? 'English' : 'मराठी'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => { setActiveNav('profile'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#f3ede4] rounded-lg text-[#003629] font-bold transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#a63b00]">badge</span>
                        <span>My Citizen Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setActiveNav('profile'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#f3ede4] rounded-lg text-[#404945] font-medium transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#006a4e]">support_agent</span>
                        <span>My Grievances &amp; Tracking</span>
                      </button>

                      <div className="h-px bg-[#f3ede4] my-1" />

                      <button
                        type="button"
                        onClick={() => { onLogout?.(); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#ffdad6]/40 text-[#ba1a1a] rounded-lg font-bold transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span>Logout / Exit Session</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#003629] text-white hover:bg-[#1b4d3e] active:scale-95 transition-all text-[12px] sm:text-[13px] font-bold shadow-xs whitespace-nowrap"
                  title={t('header_login')}
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>{t('header_login')}</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#e8e2d9] text-[#003629] hover:bg-[#f3ede4] active:scale-95 transition-all shadow-2xs cursor-pointer select-none"
              aria-label={mobileMenuOpen ? 'मेनू बंद करा' : 'मेनू उघडा'}
              title={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Civic Sub-Navigation Bar (Desktop only, mobile accesses via hamburger drawer) */}
        {activeNav !== 'admin' && (
          <div className="hidden md:flex items-center justify-between pt-1 border-t border-[#f3ede4] overflow-hidden">
            <nav className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none w-full">
              <button
                onClick={() => setActiveNav('home')}
                className={`transition-colors whitespace-nowrap px-3 py-1 rounded-lg text-[13px] font-bold ${activeNav === 'home' || activeNav === 'all'
                    ? 'bg-[#1b4d3e] text-[#baeed9]'
                    : 'text-[#404945] hover:text-[#1d1b16] hover:bg-[#f3ede4]'
                  }`}
              >
                {lang === 'MR' ? 'सर्व विभाग' : 'All Hub'}
              </button>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`transition-colors whitespace-nowrap px-2.5 py-1 rounded-lg text-[13px] font-semibold ${activeNav === item.id
                      ? 'bg-[#1b4d3e] text-[#baeed9] font-bold'
                      : 'text-[#404945] hover:text-[#1d1b16] hover:bg-[#f3ede4]'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Mobile Hamburger Slide-in Drawer Portal (Mounted to document.body to break free of header containing block) */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] md:hidden">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 h-screen h-[100dvh] w-[86%] max-w-[340px] bg-[#fff8f0] shadow-2xl flex flex-col z-[100000] border-l border-[#e8e2d9] animate-slide-drawer">
            {/* Drawer Header */}
            <div className="p-3.5 border-b border-[#e8e2d9] bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#003629] text-[#baeed9] flex items-center justify-center font-black text-sm">
                  आ
                </div>
                <div>
                  <div className="font-bold text-[#003629] text-xs leading-tight">
                    {lang === 'MR' ? 'डिजिटल आसगाव मेनू' : 'Digital Asgaon Menu'}
                  </div>
                  <div className="text-[10px] text-[#707974] leading-tight">
                    {lang === 'MR' ? 'नागरिक सेवा दालन' : 'Civic Services Hub'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#707974] hover:text-[#1d1b16] hover:bg-[#f3ede4] transition-colors cursor-pointer"
                aria-label="Close Menu"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* 1. Login / Citizen Profile Card at TOP (Under Menu Header) */}
              {currentUser?.isLoggedIn ? (
                <div className="bg-white p-3 rounded-2xl border border-[#e8e2d9] shadow-2xs">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#003629] text-[#baeed9] flex items-center justify-center text-xs font-black shrink-0">
                      {currentUser?.avatarInitials || (userRole ? userRole.substring(0, 2) : 'AC')}
                    </div>
                    <div className="truncate flex-1">
                      <div className="font-bold text-[#003629] text-[13px] truncate">
                        {currentUser?.fullName || 'Asgaon Citizen'}
                      </div>
                      <div className="text-[10px] text-[#707974] truncate">
                        {currentUser?.ward || 'Ward 2'} • {currentUser?.role || userRole || 'CITIZEN'}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f3ede4]">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#f9f3ea] text-[#003629] font-bold text-xs hover:bg-[#f3ede4] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#006a4e]">badge</span>
                      <span>{lang === 'MR' ? 'माझे प्रोफाइल' : 'Profile'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout?.();
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#ffdad6]/40 text-[#ba1a1a] font-bold text-xs hover:bg-[#ffdad6] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>{lang === 'MR' ? 'बाहेर पडा' : 'Logout'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-3.5 rounded-2xl border border-[#e8e2d9] shadow-2xs">
                  
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#003629] text-white hover:bg-[#1b4d3e] font-bold text-[13px] shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    <span>{lang === 'MR' ? 'लॉगिन / नोंदणी करा' : 'Login / Register'}</span>
                  </button>
                </div>
              )}

              {/* 2. Language Switcher (Marathi & English Separate Buttons with Marathi as Preferred Default) */}
              <div className="bg-white p-3 rounded-2xl border border-[#e8e2d9] shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLang('MR')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                      lang === 'MR'
                        ? 'bg-[#003629] text-white border-[#003629] shadow-xs ring-2 ring-[#006a4e]/20'
                        : 'bg-[#f9f3ea] text-[#404945] border-[#e8e2d9] hover:bg-[#f3ede4]'
                    }`}
                  >
                    <span className="text-sm">🇮🇳</span>
                    <span>मराठी</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('EN')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                      lang === 'EN'
                        ? 'bg-[#003629] text-white border-[#003629] shadow-xs ring-2 ring-[#006a4e]/20'
                        : 'bg-[#f9f3ea] text-[#404945] border-[#e8e2d9] hover:bg-[#f3ede4]'
                    }`}
                  >
                    <span className="text-sm">🌐</span>
                    <span>English</span>
                  </button>
                </div>
              </div>

              {/* 3. Mobile Quick Search Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onSearch(searchVal);
                }}
                className="relative flex items-center w-full h-10 rounded-xl bg-white border border-[#e8e2d9] px-3 shadow-inner"
              >
                <span className="material-symbols-outlined text-[19px] text-[#707974] mr-2">search</span>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={lang === 'MR' ? 'योजना, व्यवसाय, बस किंवा सेवा शोधा...' : 'Search shops, bus, schemes...'}
                  className="w-full bg-transparent text-[#1d1b16] text-[12px] focus:outline-none placeholder:text-[#707974]"
                />
                {searchVal && (
                  <button
                    type="button"
                    onClick={() => setSearchVal('')}
                    className="text-[#707974] hover:text-[#1d1b16] p-0.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </form>

              {/* 4. Categorized Navigation Hubs List */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-[#707974] uppercase tracking-wider px-2 pt-1 pb-1">
                  {lang === 'MR' ? 'नागरिक सेवा व विभाग' : 'Civic Hubs & Departments'}
                </div>

                {/* All Hub / Home */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all text-left cursor-pointer ${
                    activeNav === 'home' || activeNav === 'all'
                      ? 'bg-[#003629] text-[#baeed9] shadow-xs'
                      : 'text-[#1d1b16] hover:bg-white hover:text-[#003629]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${
                    activeNav === 'home' || activeNav === 'all' ? 'text-[#baeed9]' : 'text-[#006a4e]'
                  }`}>
                    home
                  </span>
                  <span className="flex-1 truncate">{lang === 'MR' ? 'सर्व विभाग (मुख्य दालन)' : 'All Hub (Home)'}</span>
                  <span className="material-symbols-outlined text-[16px] opacity-40">chevron_right</span>
                </button>

                {navItems.map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveNav(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#003629] text-[#baeed9] shadow-xs'
                          : 'text-[#1d1b16] hover:bg-white hover:text-[#003629]'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#baeed9]' : 'text-[#006a4e]'}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="material-symbols-outlined text-[16px] opacity-40">chevron_right</span>
                    </button>
                  );
                })}
              </div>
            </div>


            {/* Drawer Footer: Grievance and Emergency Services */}
            <div className="p-3 border-t border-[#e8e2d9] bg-white space-y-2 shrink-0">
              
              <div className="flex items-center justify-between text-[11px] text-[#707974] px-1">
                <span>{lang === 'MR' ? 'आपत्कालीन मदत:' : 'Emergency Help:'}</span>
                <a href="tel:108" className="text-[#ba1a1a] font-bold hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">phone_in_talk</span>
                  <span>१०८ रुग्णवाहिका</span>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
