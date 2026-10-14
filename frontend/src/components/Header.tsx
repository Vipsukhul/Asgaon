import { LucideIcon } from './LucideIcon';
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
      .catch(() => { });
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
    { id: 'businesses', label: t('nav_businesses'), icon: 'storefront' },
    { id: 'jobs', label: t('nav_jobs'), icon: 'work' },
    { id: 'schemes', label: t('nav_schemes'), icon: 'assured_workload' },
    { id: 'krishi', label: t('nav_krishi'), icon: 'agriculture' },
    { id: 'shiksha', label: t('nav_education'), icon: 'school' },
    { id: 'transport', label: t('nav_transport'), icon: 'directions_bus' },
    { id: 'marketplace', label: t('nav_marketplace'), icon: 'local_mall' },
    { id: 'announcements', label: t('nav_announcements'), icon: 'campaign' },
    { id: 'events', label: t('nav_events'), icon: 'event' },
    { id: 'blogs', label: t('nav_blogs'), icon: 'article' },
    { id: 'emergency', label: t('nav_emergency'), icon: 'emergency' }
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fdfbf7]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.05)] border-b border-[#efe7dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col gap-2">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <AsgaonLogo onClick={() => setActiveNav('home')} size="md" />
          </div>

          

          {/* Actions & Role / Login */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Web Push Notification Bell Popover (Visible only when logged in) */}
            {currentUser?.isLoggedIn && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className={`relative h-8 w-8 rounded-lg flex items-center justify-center transition-all border ${notifDropdownOpen || pushActive
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs ring-1 ring-emerald-600/30'
                      : 'bg-white hover:bg-[#f7f2e7] text-stone-600 hover:text-emerald-800 border-[#e7dece] shadow-2xs'
                    }`}
                  title="गाव ग्राम सूचना व थेट अलर्ट"
                >
                  <LucideIcon name={pushActive ? 'notifications_active' : 'notifications'} className={` text-[19px] ${pushActive ? 'text-emerald-800' : ''}`} />
                  {hasUrgent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#d9381e] rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Notification Popover Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#e7dece] p-3 z-50 animate-fadeIn text-[12px]">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#efe7dc]">
                      <div className="flex items-center gap-1.5 font-extrabold text-emerald-900">
                        <LucideIcon name="campaign" className="text-[18px] text-emerald-700" />
                        <span>गाव सूचना व थेट अलर्ट</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                        {recentAlerts.length} ताज्या सूचना
                      </span>
                    </div>

                    {/* Web Push Subscription Action Box */}
                    <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between gap-2 ${pushActive ? 'bg-emerald-50 border-emerald-200' : 'bg-[#faf6ee] border-[#efe7dc]'
                      }`}>
                      <div className="flex items-center gap-2">
                        <LucideIcon name={pushActive ? 'check_circle' : 'notifications_paused'} className={` text-[20px] ${pushActive ? 'text-emerald-700' : 'text-[#c2410c]'}`} />
                        <div>
                          <div className="font-bold text-stone-900 text-[11px] leading-tight">
                            {pushActive ? 'मोबाईल सूचना चालू आहेत' : 'थेट सूचना सुरू करा'}
                          </div>
                          <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
                            {pushActive ? 'पाणी, वीज, APMC दर व तक्रार अपडेट्स' : 'पाणी पुरवठा व महत्त्वाच्या सूचना मिळवा'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleTogglePush}
                        disabled={pushLoading}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black shrink-0 transition-all ${pushActive
                            ? 'bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                            : 'bg-emerald-800 text-emerald-100 hover:bg-emerald-900 shadow-2xs'
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
                            className="p-2 rounded-xl bg-[#faf6ee] hover:bg-[#f3ede4] transition-colors cursor-pointer border border-[#efe7dc] text-left"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold text-emerald-950 truncate text-[11px]">
                                {a.title}
                              </span>
                              {a.priority === 'URGENT' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                                  तातडीची
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                              {a.message}
                            </p>
                            <div className="flex items-center justify-between mt-1 text-[10px] text-stone-500">
                              <span>{a.category || 'गाव सूचना'}</span>
                              <span className="text-emerald-800 font-bold flex items-center gap-0.5">
                                <span>सविस्तर पहा</span>
                                <LucideIcon name="chevron_right" className="text-[12px]" />
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-stone-500 text-xs">
                          सध्या कोणतीही नवीन तातडीची सूचना नाही.
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-2.5 pt-2 border-t border-[#efe7dc] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveNav('announcements');
                          setNotifDropdownOpen(false);
                        }}
                        className="text-emerald-800 hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <span>सर्व सूचना व परिपत्रके पहा</span>
                        <LucideIcon name="arrow_forward" className="text-[14px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-stone-500 hover:text-stone-900 font-bold text-[11px]"
                      >
                        बंद करा
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Language Switcher - Desktop only */}
            <div className="hidden md:flex items-center rounded-lg bg-[#faf6ee] p-0.5 border border-[#e7dece]">
              {(['EN', 'MR'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold transition-all cursor-pointer ${lang === l ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                >
                  {l === 'EN' ? 'EN' : 'म'}
                </button>
              ))}
            </div>

            {/* Desktop User status / Login */}
            <div className="hidden md:flex items-center">
              {currentUser?.isLoggedIn ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl text-[12px] font-bold transition-all border ${activeNav === 'profile'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-white hover:bg-[#faf6ee] text-emerald-950 border-[#e7dece] shadow-xs'
                      }`}
                    title="Citizen Profile & Settings"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-[10px] font-black">
                      {currentUser?.avatarInitials || (userRole ? userRole.substring(0, 2) : 'AC')}
                    </div>
                    <span className="hidden sm:inline font-bold">
                      {currentUser?.fullName || (userRole ? `${userRole} Portal` : 'Asgaon Citizen')}
                    </span>
                    <LucideIcon name="expand_more" className="text-[16px] text-stone-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-[#e7dece] p-2 z-50 animate-fadeIn text-[12px]">
                      <div className="p-2.5 bg-[#faf6ee] rounded-lg border border-[#efe7dc] mb-1.5">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-7 h-7 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {currentUser?.avatarInitials || (userRole ? userRole.substring(0, 2) : 'AC')}
                          </div>
                          <div className="truncate">
                            <strong className="text-emerald-950 block leading-tight truncate">
                              {currentUser?.fullName || 'Asgaon Resident'}
                            </strong>
                            <span className="text-[10px] text-emerald-700 font-bold">
                              {currentUser?.role || userRole || 'CITIZEN'} • {currentUser?.phone ? `+91 ${currentUser.phone}` : 'PIN 441910'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Language Switcher in Dropdown */}
                      <div className="p-2 bg-[#faf6ee] rounded-lg border border-[#efe7dc] mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900">
                          <LucideIcon name="translate" className="text-[15px] text-emerald-700" />
                          <span>भाषा / Lang:</span>
                        </div>
                        <div className="flex items-center rounded-md bg-white p-0.5 border border-[#e7dece]">
                          {(['EN', 'MR'] as const).map((l) => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => setLang(l)}
                              className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${lang === l ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-500 hover:text-stone-900'
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
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#faf6ee] rounded-lg text-emerald-900 font-bold transition-colors text-left"
                      >
                        <LucideIcon name="badge" className="text-[18px] text-[#c2410c]" />
                        <span>{t('nav_profile')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setActiveNav('profile'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#faf6ee] rounded-lg text-stone-600 font-medium transition-colors text-left"
                      >
                        <LucideIcon name="support_agent" className="text-[18px] text-emerald-700" />
                        <span>{t('nav_grievances')}</span>
                      </button>

                      <div className="h-px bg-[#efe7dc] my-1" />

                      <button
                        type="button"
                        onClick={() => { onLogout?.(); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-red-50 text-red-700 rounded-lg font-bold transition-colors text-left"
                      >
                        <LucideIcon name="logout" className="text-[18px]" />
                        <span>{lang === 'MR' ? 'बाहेर पडा' : 'Logout'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95 transition-all text-[12px] sm:text-[13px] font-extrabold shadow-sm whitespace-nowrap cursor-pointer"
                  title={t('header_login')}
                >
                  <LucideIcon name="login" className="text-[18px]" />
                  <span>{t('header_login')}</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#e7dece] text-emerald-900 hover:bg-[#faf6ee] active:scale-95 transition-all shadow-2xs cursor-pointer select-none"
              aria-label={mobileMenuOpen ? 'मेनू बंद करा' : 'मेनू उघडा'}
              title={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              <LucideIcon name={mobileMenuOpen ? 'close' : 'menu'} className=" text-[22px]" />
            </button>
          </div>
        </div>

        {/* Civic Sub-Navigation Bar (Desktop only, mobile accesses via hamburger drawer) */}
        {activeNav !== 'admin' && (
          <div className="hidden md:flex items-center justify-between pt-1 border-t border-[#efe7dc] overflow-hidden">
            <nav className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none w-full">
              <button
                onClick={() => setActiveNav('home')}
                className={`transition-all whitespace-nowrap px-3 py-1 rounded-lg text-[13px] font-extrabold cursor-pointer ${activeNav === 'home' || activeNav === 'all'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-700 hover:text-emerald-950 hover:bg-[#faf6ee]'
                  }`}
              >
                {t('nav_home')}
              </button>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`transition-all whitespace-nowrap px-2.5 py-1 rounded-lg text-[13px] font-bold cursor-pointer ${activeNav === item.id
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-stone-700 hover:text-emerald-950 hover:bg-[#faf6ee]'
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
          <div className="fixed top-0 right-0 h-[100dvh] max-h-[100dvh] w-[86%] max-w-[320px] bg-[#fdfbf7] shadow-2xl flex flex-col z-[100000] border-l border-[#efe7dc] animate-slide-drawer">
            {/* Drawer Header (Compact) */}
            <div className="py-2 px-3 border-b border-[#efe7dc] bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-black text-xs">
                  आ
                </div>
                <div>
                  <div className="font-bold text-emerald-950 text-xs leading-tight">
                    {lang === 'MR' ? 'डिजिटल आसगाव मेनू' : 'Digital Asgaon Menu'}
                  </div>
                  <div className="text-[10px] text-stone-500 leading-tight">
                    {lang === 'MR' ? 'नागरिक व शेतकरी सेवा दालन' : 'Civic & Farmer Services'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-[#faf6ee] transition-colors cursor-pointer"
                aria-label="Close Menu"
              >
                <LucideIcon name="close" className="text-[18px]" />
              </button>
            </div>

            {/* Drawer Body (Scrollable with safe bottom padding) */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-2.5 space-y-2 pb-14 touch-pan-y">
              {/* 1. Login / Citizen Profile Card + Language in ONE unified compact bar */}
              {currentUser?.isLoggedIn ? (
                <div className="bg-white p-2 rounded-xl border border-[#efe7dc] shadow-2xs">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 truncate flex-1">
                      <div className="w-7 h-7 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-[10px] font-black shrink-0">
                        {currentUser?.avatarInitials || (userRole ? userRole.substring(0, 2) : 'AC')}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-emerald-950 text-[11px] truncate leading-tight">
                          {currentUser?.fullName || 'Asgaon Citizen'}
                        </div>
                        <div className="text-[9px] text-stone-500 truncate leading-tight">
                          {currentUser?.ward || 'Ward 2'} • {currentUser?.role || userRole || 'CITIZEN'}
                        </div>
                      </div>
                    </div>
                    {/* Compact Language Toggle */}
                    <div className="flex items-center rounded-lg bg-[#faf6ee] p-0.5 border border-[#efe7dc] shrink-0">
                      {(['MR', 'EN'] as const).map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setLang(l)}
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all cursor-pointer ${
                            lang === l ? 'bg-emerald-800 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          {l === 'MR' ? 'मराठी' : 'EN'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1.5 mt-1.5 border-t border-[#efe7dc]">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-[#faf6ee] text-emerald-950 font-bold text-[11px] hover:bg-[#f3ede4] transition-colors"
                    >
                      <LucideIcon name="badge" className="text-[13px] text-emerald-700" />
                      <span>{t('nav_profile')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout?.();
                      }}
                      className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-red-50 text-red-700 font-bold text-[11px] hover:bg-red-100 transition-colors"
                    >
                      <LucideIcon name="logout" className="text-[13px]" />
                      <span>{lang === 'MR' ? 'बाहेर पडा' : 'Logout'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-1.5 rounded-xl border border-[#efe7dc] shadow-2xs flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <LucideIcon name="login" className="text-[14px]" />
                    <span>{lang === 'MR' ? 'लॉगिन' : 'Login'}</span>
                  </button>

                  {/* Compact Language Toggle */}
                  <div className="flex items-center rounded-lg bg-[#faf6ee] p-0.5 border border-[#efe7dc] shrink-0">
                    {(['MR', 'EN'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLang(l)}
                        className={`px-2 py-1 rounded text-[11px] font-black transition-all cursor-pointer ${
                          lang === l ? 'bg-emerald-800 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {l === 'MR' ? 'मराठी' : 'EN'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Compact Search Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onSearch(searchVal);
                }}
                className="relative flex items-center w-full h-8 rounded-lg bg-white border border-[#efe7dc] focus-within:border-emerald-600 px-2.5 shadow-2xs"
              >
                <LucideIcon name="search" className="text-[15px] text-stone-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={lang === 'MR' ? 'योजना, व्यवसाय, बस शोधा...' : 'Search shops, bus, schemes...'}
                  className="w-full bg-transparent text-stone-900 text-[11px] focus:outline-none placeholder:text-stone-400 font-medium"
                />
                {searchVal && (
                  <button
                    type="button"
                    onClick={() => setSearchVal('')}
                    className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                  >
                    <LucideIcon name="close" className="text-[13px]" />
                  </button>
                )}
              </form>

              {/* 3. Categorized Navigation Hubs List (Compact rows) */}
              <div className="space-y-0.5">
                <div className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider px-2 pt-1 pb-0.5">
                  {lang === 'MR' ? 'नागरिक सेवा व विभाग' : 'Civic Hubs & Departments'}
                </div>

                {/* All Hub / Home */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${activeNav === 'home' || activeNav === 'all'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-800 hover:bg-white hover:text-emerald-950'
                    }`}
                >
                  <LucideIcon name="home" className={` text-[17px] ${activeNav === 'home' || activeNav === 'all' ? 'text-white' : 'text-emerald-700' }`} />
                  <span className="flex-1 truncate">{t('nav_home')}</span>
                  <LucideIcon name="chevron_right" className="text-[14px] opacity-40" />
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
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${isActive
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-stone-800 hover:bg-white hover:text-emerald-950'
                        }`}
                    >
                      <LucideIcon name={item.icon} className={` text-[17px] ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                      <span className="flex-1 truncate">{item.label}</span>
                      <LucideIcon name="chevron_right" className="text-[14px] opacity-40" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer: Grievance and Emergency Services */}
            <div className="py-2 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] border-t border-[#efe7dc] bg-white space-y-1.5 shrink-0">
              <div className="flex items-center justify-between text-[10px] text-stone-500 px-1">
                <span>{lang === 'MR' ? 'आपत्कालीन मदत:' : 'Emergency Help:'}</span>
                <a href="tel:108" className="text-red-700 font-bold hover:underline flex items-center gap-1">
                  <LucideIcon name="phone_in_talk" className="text-[13px]" />
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
