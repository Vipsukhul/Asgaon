import React, { useState, useEffect, useMemo } from 'react';
import { LucideIcon } from './LucideIcon';
import type { UserProfileData } from '../pages/ProfilePage';

export interface AdminNavItem {
  id: string;
  icon: string;
  labelMarathi: string;
  labelEnglish: string;
  category: 'GOVERNANCE' | 'SERVICES' | 'COMMS';
  badge?: number | string;
  badgeColor?: string;
  isSuperOnly?: boolean;
}

interface AdminNavSystemProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  currentUser: UserProfileData;
  isSuperAdmin: boolean;
  isTabAllowed: (tabId: string) => boolean;
  badges: {
    complaints?: number;
    businesses?: number;
    reviews?: number;
    events?: number;
    schools?: number;
    buses?: number;
    blogs?: number;
    notices?: number;
    schemes?: number;
    contacts?: number;
    projects?: number;
    users?: number;
  };
  onExit: () => void;
  onLogout: () => void;
}

export const ADMIN_CATEGORIES = [
  {
    id: 'GOVERNANCE',
    titleMarathi: 'प्रशासन व देखरेख',
    titleEnglish: 'Governance & Oversight',
    icon: 'account_balance'
  },
  {
    id: 'SERVICES',
    titleMarathi: 'नागरी सेवा व तक्रार निवारण',
    titleEnglish: 'Civic Services & Grievance',
    icon: 'assignment'
  },
  {
    id: 'COMMS',
    titleMarathi: 'संवाद, प्रसिद्धी व माहिती',
    titleEnglish: 'Communications & Media',
    icon: 'campaign'
  }
];

export const AdminNavSystem: React.FC<AdminNavSystemProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  isSuperAdmin,
  isTabAllowed,
  badges,
  onExit,
  onLogout
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Dynamic PWA Manifest Swapping for Admin Mode
  useEffect(() => {
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
      existingManifest.setAttribute('href', '/admin-manifest.json');
    }

    // Check if running in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      const manifestTag = document.querySelector('link[rel="manifest"]');
      if (manifestTag) {
        manifestTag.setAttribute('href', '/manifest.json');
      }
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      alert('तुमच्या ब्राउझर मेनूमधील "Add to Home Screen" किंवा "Install App" पर्याय निवडून हे अॅडमिन अॅप इन्स्टॉल करा.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    }
  };

  // Nav Items with live dynamic badges
  const allNavItems: AdminNavItem[] = useMemo(() => [
    // 1. Governance & Oversight
    {
      id: 'overview',
      icon: 'analytics',
      labelMarathi: 'आढावा व आकडेवारी',
      labelEnglish: 'Dashboard Overview',
      category: 'GOVERNANCE'
    },
    ...(isSuperAdmin ? [{
      id: 'admin_management',
      icon: 'admin_panel_settings',
      labelMarathi: 'अॅडमिन अधिकार वाटप',
      labelEnglish: 'Admin Permissions',
      category: 'GOVERNANCE' as const,
      isSuperOnly: true,
      badge: 'SUPER',
      badgeColor: 'bg-amber-500 text-white'
    }] : []),
    {
      id: 'users',
      icon: 'group',
      labelMarathi: 'गावकऱ्यांची यादी व भूमिका',
      labelEnglish: 'Citizen Directory',
      category: 'GOVERNANCE',
      badge: badges.users,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'transparency',
      icon: 'account_balance',
      labelMarathi: 'ग्राम पारदर्शकता व निधी',
      labelEnglish: 'Panchayat Transparency',
      category: 'GOVERNANCE',
      badge: 'eGram',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'logs',
      icon: 'manage_history',
      labelMarathi: 'प्रणाली ऑडिट नोंदी',
      labelEnglish: 'Audit Logs',
      category: 'GOVERNANCE'
    },

    // 2. Services & Grievances
    {
      id: 'complaints',
      icon: 'report_problem',
      labelMarathi: 'तक्रार निवारण कक्ष',
      labelEnglish: 'Grievance Redressal',
      category: 'SERVICES',
      badge: badges.complaints,
      badgeColor: 'bg-red-500 text-white'
    },
    {
      id: 'businesses',
      icon: 'storefront',
      labelMarathi: 'स्थानिक दुकाने व पडताळणी',
      labelEnglish: 'Business Verification',
      category: 'SERVICES',
      badge: badges.businesses,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'reviews',
      icon: 'rate_review',
      labelMarathi: 'नागरिक अभिप्राय',
      labelEnglish: 'Citizen Reviews',
      category: 'SERVICES',
      badge: badges.reviews,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'water',
      icon: 'water_drop',
      labelMarathi: 'पाणी पुरवठा वेळापत्रक',
      labelEnglish: 'Water Supply Schedule',
      category: 'SERVICES'
    },
    {
      id: 'schemes',
      icon: 'description',
      labelMarathi: 'शासकीय योजना व्यवस्थापन',
      labelEnglish: 'Government Schemes',
      category: 'SERVICES',
      badge: badges.schemes,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'shiksha',
      icon: 'school',
      labelMarathi: 'शिक्षण व शाळा दालन',
      labelEnglish: 'Education & Schools',
      category: 'SERVICES',
      badge: badges.schools,
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'transport',
      icon: 'directions_bus',
      labelMarathi: 'वाहतूक व एसटी बसेस',
      labelEnglish: 'Transport Schedules',
      category: 'SERVICES',
      badge: badges.buses,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'contacts',
      icon: 'contacts',
      labelMarathi: 'महत्त्वाचे गाव संपर्क',
      labelEnglish: 'Official Contacts',
      category: 'SERVICES',
      badge: badges.contacts,
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'projects',
      icon: 'construction',
      labelMarathi: 'ग्राम विकासकामे (GPDP)',
      labelEnglish: 'Development Projects',
      category: 'SERVICES',
      badge: badges.projects,
      badgeColor: 'bg-orange-100 text-orange-800'
    },

    // 3. Communications & Media
    {
      id: 'broadcast',
      icon: 'cell_tower',
      labelMarathi: 'तातडीची दवंडी (Push Alert)',
      labelEnglish: 'Emergency Alerts',
      category: 'COMMS',
      badge: 'LIVE',
      badgeColor: 'bg-red-600 text-white font-black animate-pulse'
    },
    {
      id: 'notices',
      icon: 'campaign',
      labelMarathi: 'ग्राम सूचना फलक',
      labelEnglish: 'Notice Board',
      category: 'COMMS',
      badge: badges.notices,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'events',
      icon: 'event',
      labelMarathi: 'कार्यक्रम व यात्रा दिनदर्शिका',
      labelEnglish: 'Events & Fairs',
      category: 'COMMS',
      badge: badges.events,
      badgeColor: 'bg-pink-100 text-pink-800'
    },
    {
      id: 'blogs',
      icon: 'menu_book',
      labelMarathi: 'माहिती लेख व ब्लॉग',
      labelEnglish: 'Articles & Blogs',
      category: 'COMMS',
      badge: badges.blogs,
      badgeColor: 'bg-violet-100 text-violet-800'
    },
    {
      id: 'gallery',
      icon: 'photo_library',
      labelMarathi: 'छायाचित्र दालन (Gallery)',
      labelEnglish: 'Photo Gallery',
      category: 'COMMS'
    },
    {
      id: 'banners',
      icon: 'view_carousel',
      labelMarathi: 'हिरो स्लायडर व बॅनर',
      labelEnglish: 'Homepage Banners',
      category: 'COMMS'
    }
  ], [isSuperAdmin, badges]);

  // Filter items by allowed permissions and search query
  const filteredNavItems = useMemo(() => {
    return allNavItems.filter((item) => {
      if (!isTabAllowed(item.id)) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.labelMarathi.toLowerCase().includes(q) ||
        item.labelEnglish.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    });
  }, [allNavItems, isTabAllowed, searchQuery]);

  const activeItem = allNavItems.find((i) => i.id === activeTab) || allNavItems[0];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────
          DESKTOP SIDEBAR NAVIGATION (Visible on md and up)
      ─────────────────────────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col shrink-0 bg-white border-r border-[#e8e2d9] transition-all duration-300 z-30 h-full shadow-xs ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Sidebar Header Brand with Toggle */}
        <div className="p-3.5 border-b border-[#e8e2d9] flex items-center justify-between gap-2 bg-[#fcfaf7] shrink-0">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14532d] to-[#0a2e1d] p-0.5 shadow-xs flex items-center justify-center shrink-0">
                <img src="/admin-icon.svg" alt="Admin Crest" className="w-7 h-7 drop-shadow-xs" />
              </div>
              <div className="min-w-0">
                <h2 className="font-heading font-black text-xs text-[#14532d] truncate tracking-tight">
                  आसगाव प्रशासक कक्ष
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-wider uppercase ${
                    isSuperAdmin ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {isSuperAdmin ? 'Super Admin' : 'Admin'}
                  </span>
                  <span className="text-[10px] text-[#707974] truncate max-w-[100px]">
                    {currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Admin'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {isSidebarCollapsed && (
            <div className="w-full flex justify-center">
              <img src="/admin-icon.svg" alt="Admin" className="w-8 h-8" />
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? 'साइडबार उघडा' : 'साइडबार संकुचित करा'}
            className="p-1.5 rounded-lg hover:bg-[#f3ede4] text-[#707974] hover:text-[#14532d] transition-colors cursor-pointer"
          >
            <LucideIcon name={isSidebarCollapsed ? 'chevron_right' : 'chevron_left'} className="text-[18px]" />
          </button>
        </div>

        {/* PWA Install Quick Banner (If not yet installed) */}
        {!isAppInstalled && !isSidebarCollapsed && (
          <div className="p-2.5 mx-3 mt-3 rounded-xl bg-gradient-to-r from-[#e8f1ec] to-[#fef9ee] border border-[#cadbcf] flex items-center justify-between gap-2 shadow-2xs shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#14532d] text-white flex items-center justify-center shrink-0 text-sm">
                📲
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#14532d] truncate">प्रशासक PWA अॅप</p>
                <p className="text-[9px] text-[#55605a] truncate">होम स्क्रीनवर जोडा</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleInstallPwa}
              className="px-2.5 py-1 rounded-lg bg-[#14532d] hover:bg-[#0f3f24] text-white text-[10px] font-black shrink-0 transition-all shadow-2xs cursor-pointer"
            >
              इन्स्टॉल
            </button>
          </div>
        )}

        {/* Search Bar (When expanded) */}
        {!isSidebarCollapsed && (
          <div className="px-3 pt-3 pb-1 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="मॉड्यूल शोधा..."
                className="w-full py-1.5 pl-8 pr-7 bg-[#f9f3ea] text-xs rounded-xl border border-[#e8e2d9] outline-none focus:border-[#14532d] transition-all"
              />
              <LucideIcon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#707974] text-[14px]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#707974] hover:text-[#14532d] text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Navigation Items */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2.5 py-2 space-y-4 no-scrollbar">
          {ADMIN_CATEGORIES.map((cat) => {
            const items = filteredNavItems.filter((i) => i.category === cat.id);
            if (items.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#707974] flex items-center justify-between">
                    <span>{cat.titleMarathi}</span>
                    <span className="text-[9px] font-mono opacity-60">({items.length})</span>
                  </div>
                )}

                <div className="space-y-0.5">
                  {items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleItemClick(item.id)}
                        title={isSidebarCollapsed ? `${item.labelMarathi} (${item.labelEnglish})` : undefined}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer group relative ${
                          isActive
                            ? 'bg-[#14532d] text-[#a7f3d0] font-bold shadow-xs'
                            : 'text-[#444e48] hover:bg-[#f3ede4] hover:text-[#1d1b16] font-medium'
                        } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                      >
                        <LucideIcon
                          name={item.icon}
                          className={`text-[18px] shrink-0 transition-transform ${
                            isActive ? 'text-[#a7f3d0] scale-105' : 'text-[#707974] group-hover:text-[#14532d]'
                          }`}
                        />

                        {!isSidebarCollapsed && (
                          <>
                            <span className="text-xs truncate flex-1 leading-snug">
                              {item.labelMarathi}
                            </span>
                            {item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
                              <span
                                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                  isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-[#e8e2d9] text-[#444e48]'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}

                        {/* Collapsed Active Dot */}
                        {isSidebarCollapsed && isActive && (
                          <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-[#14532d]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer: Exit & Sign Out */}
        <div className="p-3 border-t border-[#e8e2d9] bg-[#fcfaf7] flex flex-col gap-1.5 shrink-0">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onExit}
                className="flex-1 py-1.5 px-2.5 rounded-xl border border-[#cadbcf] hover:bg-white text-[11px] font-bold text-[#14532d] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LucideIcon name="home" className="text-[14px]" />
                <span>नागरी पोर्टल</span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="py-1.5 px-2.5 rounded-xl bg-[#ba1a1a]/10 hover:bg-[#ba1a1a] text-[#ba1a1a] hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="प्रशासक खात्यातून बाहेर पडा"
              >
                <LucideIcon name="logout" className="text-[14px]" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onExit}
                title="नागरी पोर्टल"
                className="p-2 rounded-xl hover:bg-[#f3ede4] text-[#14532d]"
              >
                <LucideIcon name="home" className="text-[18px]" />
              </button>
              <button
                type="button"
                onClick={onLogout}
                title="बाहेर पडा"
                className="p-2 rounded-xl text-[#ba1a1a] hover:bg-[#ba1a1a]/10"
              >
                <LucideIcon name="logout" className="text-[18px]" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────────
          MOBILE STICKY TOP APP BAR (Visible on screens < md)
      ─────────────────────────────────────────────────────────────────── */}
      <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8e2d9] px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="w-9 h-9 rounded-xl bg-[#14532d] text-white flex items-center justify-center shrink-0 shadow-2xs active:scale-95 transition-all"
            aria-label="Open Admin Menu"
          >
            <LucideIcon name="menu" className="text-[20px]" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase text-[#14532d] tracking-wider bg-[#e8f1ec] px-1.5 py-0.2 rounded">
                प्रशासक
              </span>
              <span className="text-[10px] text-[#707974] truncate">
                {currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Admin'}
              </span>
            </div>
            <h1 className="font-heading font-black text-xs sm:text-sm text-[#1d1b16] truncate flex items-center gap-1">
              <span>{activeItem.labelMarathi}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {!isAppInstalled && (
            <button
              type="button"
              onClick={handleInstallPwa}
              title="प्रशासक अॅप इन्स्टॉल करा"
              className="px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black flex items-center gap-1 shadow-2xs"
            >
              <LucideIcon name="download" className="text-[12px]" />
              <span>PWA</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExit}
            title="नागरी पोर्टलवर जा"
            className="p-1.5 rounded-lg border border-[#cadbcf] text-[#14532d] text-xs font-bold"
          >
            <LucideIcon name="home" className="text-[18px]" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          MOBILE SLIDE-IN ACTION DRAWER (Full Menu Overlay)
      ─────────────────────────────────────────────────────────────────── */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Slide Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-right">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-br from-[#14532d] to-[#0a2e1d] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/admin-icon.svg" alt="Admin" className="w-8 h-8 drop-shadow-xs" />
                <div>
                  <h3 className="font-heading font-black text-sm leading-tight">आसगाव ग्राम प्रशासक</h3>
                  <p className="text-[10px] text-[#a7f3d0] font-medium mt-0.5">
                    {isSuperAdmin ? '👑 Super Admin' : '🛡️ Admin'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Quick Filter Search */}
            <div className="p-3 border-b border-[#e8e2d9] bg-[#fcfaf7]">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="मॉड्यूल शोधा..."
                  className="w-full py-2 pl-8 pr-7 bg-white text-xs rounded-xl border border-[#cadbcf] outline-none focus:border-[#14532d]"
                />
                <LucideIcon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#707974] text-[15px]" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707974] text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Scrollable Nav List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
              {ADMIN_CATEGORIES.map((cat) => {
                const items = filteredNavItems.filter((i) => i.category === cat.id);
                if (items.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-1">
                    <p className="px-2 text-[10px] font-black uppercase tracking-wider text-[#707974] flex items-center justify-between">
                      <span>{cat.titleMarathi}</span>
                      <span className="text-[9px] font-mono">({items.length})</span>
                    </p>

                    <div className="space-y-1">
                      {items.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleItemClick(item.id)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                              isActive
                                ? 'bg-[#14532d] text-white font-bold shadow-xs'
                                : 'text-[#2d3330] hover:bg-[#f3ede4] font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <LucideIcon
                                name={item.icon}
                                className={`text-[19px] shrink-0 ${
                                  isActive ? 'text-[#a7f3d0]' : 'text-[#707974]'
                                }`}
                              />
                              <span className="text-xs truncate">{item.labelMarathi}</span>
                            </div>
                            {item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                  isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-[#e8e2d9] text-[#444e48]'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-[#e8e2d9] bg-[#fcfaf7] flex items-center gap-2">
              <button
                type="button"
                onClick={onExit}
                className="flex-1 py-2 rounded-xl bg-[#14532d] text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <LucideIcon name="home" className="text-[16px]" />
                <span>नागरी पोर्टल</span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="py-2 px-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold flex items-center justify-center gap-1 border border-red-200"
              >
                <LucideIcon name="logout" className="text-[16px]" />
                <span>बाहेर पडा</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          MOBILE BOTTOM QUICK ACCESS DOCK (Visible on screens < md)
      ─────────────────────────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8e2d9] px-2 py-1 flex items-center justify-around shadow-lg">
        {(() => {
          const quickCandidates = [
            { id: 'overview', icon: 'analytics', label: 'आढावा' },
            { id: 'complaints', icon: 'report_problem', label: 'तक्रारी', badge: badges.complaints },
            { id: 'broadcast', icon: 'cell_tower', label: 'दवंडी' },
            { id: 'water', icon: 'water_drop', label: 'पाणी' },
            { id: 'notices', icon: 'campaign', label: 'सूचना' },
            { id: 'schemes', icon: 'assignment', label: 'योजना' },
            { id: 'users', icon: 'group', label: 'नागरिक', badge: badges.users }
          ];
          const allowedQuick = quickCandidates.filter((btn) => isTabAllowed(btn.id)).slice(0, 4);
          return allowedQuick.map((btn) => {
            const isActive = activeTab === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => onSelectTab(btn.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                  isActive ? 'text-[#14532d] font-bold' : 'text-[#707974] font-medium'
                }`}
              >
                <div className="relative">
                  <LucideIcon name={btn.icon} className={`text-[20px] ${isActive ? 'scale-110' : ''}`} />
                  {btn.badge !== undefined && btn.badge !== null && btn.badge !== 0 && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-red-500 text-white text-[8px] font-black min-w-[14px] text-center">
                      {btn.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5">{btn.label}</span>
                {isActive && <span className="w-1 h-1 rounded-full bg-[#14532d] mt-0.5" />}
              </button>
            );
          });
        })()}

        {/* 5th Button: Open Full Drawer */}
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[#707974] hover:text-[#14532d] font-medium"
        >
          <LucideIcon name="dashboard_customize" className="text-[20px]" />
          <span className="text-[10px] mt-0.5">सर्व मेनू</span>
        </button>
      </nav>
    </>
  );
};
