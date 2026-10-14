import { LucideIcon } from './components/LucideIcon';
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OfficialAlertTicker } from './components/OfficialAlertTicker';
import { HeroSection } from './components/HeroSection';
import { CivicHubGrid } from './components/CivicHubGrid';
import { LiveMandiTicker } from './components/LiveMandiTicker';
import { FeaturedEnterprises } from './components/FeaturedEnterprises';
import { JobsBoardSection } from './components/JobsBoardSection';
import { GovtSchemesSection } from './components/GovtSchemesSection';
import { GrievanceDeskSection } from './components/GrievanceDeskSection';
import { PanchayatNoticeStrip } from './components/PanchayatNoticeStrip';
import { Footer } from './components/Footer';
import { VillageGraffitiBackdrop } from './components/WarliWallGraffiti';

// Independent Pages
import { ProfilePage, type UserProfileData } from './pages/ProfilePage';
import { BusinessesPage } from './pages/BusinessesPage';
import { BusinessDetailPage } from './pages/BusinessDetailPage';
import { JobsPage } from './pages/JobsPage';
import { SchemesPage } from './pages/SchemesPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { KrishiPage } from './pages/KrishiPage';
import { ShikshaPage } from './pages/ShikshaPage';
import { ShikshaDetailPage } from './pages/ShikshaDetailPage';
import { TransportPage } from './pages/TransportPage';
import { BlogsPage } from './pages/BlogsPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { WriteBlogPage } from './pages/WriteBlogPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { EventsPage } from './pages/EventsPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AdminPage } from './pages/AdminPage';

// Modals
import { GrievanceModal } from './components/GrievanceModal';
import { LoginModal } from './components/LoginModal';
import { GuestUpgradeModal } from './components/GuestUpgradeModal';
import { RegisterShopModal } from './components/RegisterShopModal';
import { PostJobModal } from './components/PostJobModal';
import { DetailModal } from './components/DetailModal';
import { VillageMasterMapModal } from './components/VillageMasterMapModal';
import type { Business, Job, Scheme, Grievance, MandiPrice } from './types';
import { api } from './services/api';
import { useSEO } from './hooks/useSEO';

const DEFAULT_GUEST_USER: UserProfileData = {
  fullName: 'Guest Visitor',
  phone: '',
  role: 'CITIZEN',
  ward: 'Ward 2 (Gaothan)',
  village: 'Asgaon, Pauni (PIN 441910)',
  isLoggedIn: false,
  avatarInitials: 'GV',
  occupation: 'Guest Surfer'
};

export function App() {
  // URL-driven navigation support (e.g. /admin, /krishi, /schemes/:slug, /businesses/:slug, /shiksha/:slug, etc.)
  const getInitialNav = () => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (path === 'admin' || window.location.hash === '#admin') return 'admin';
    if (path.startsWith('schemes/')) return 'scheme-detail';
    if (path.startsWith('businesses/')) return 'business-detail';
    if (path.startsWith('shiksha/')) return 'shiksha-detail';
    if (path === 'blogs/write' || path === 'write-blog') return 'write-blog';
    if (path.startsWith('blogs/')) return 'blog-detail';
    if (path) return path;
    return 'home';
  };

  const getInitialSlug = (prefix: string) => {
    try {
      const path = decodeURIComponent(window.location.pathname.replace(/^\/+|\/+$/g, ''));
      if (path.startsWith(prefix)) {
        return path.replace(prefix, '');
      }
    } catch {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      if (path.startsWith(prefix)) {
        return path.replace(prefix, '');
      }
    }
    return '';
  };

  const [activeNav, setActiveNav] = useState(getInitialNav);
  const [selectedSchemeSlug, setSelectedSchemeSlug] = useState<string>(() => getInitialSlug('schemes/'));
  const [selectedBusinessSlug, setSelectedBusinessSlug] = useState<string>(() => getInitialSlug('businesses/'));
  const [selectedShikshaSlug, setSelectedShikshaSlug] = useState<string>(() => getInitialSlug('shiksha/'));
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string>(() => getInitialSlug('blogs/'));

  // Dynamic SEO Configuration for Google Search Console and social bots
  const getPageSEO = () => {
    switch (activeNav) {
      case 'schemes':
        return {
          title: 'शासकीय योजना दालन (घरकुल, लाडकी बहीण, पीएम किसान)',
          description: 'आसगाव - महाराष्ट्र व केंद्र शासनाच्या सर्व सक्रिय योजना, पात्रता व थेट अर्ज लिंक. घरकुल, पीएम किसान व लाडकी बहीण योजना.',
          canonicalPath: '/schemes'
        };
      case 'scheme-detail':
        return {
          title: 'शासकीय योजना सविस्तर माहिती',
          description: 'आसगाव - योजनेचे थेट लाभ, आवश्यक कागदपत्रे व ऑनलाइन अर्ज प्रक्रिया.',
          canonicalPath: `/schemes/${selectedSchemeSlug || ''}`
        };
      case 'krishi':
        return {
          title: 'कृषी व बाजारभाव — आसगाव',
          description: 'पवनी कृषी उत्पन्न बाजार समिती धान, सोयाबीन, कापूस व तूर आजचे थेट बाजारभाव व कृषी सल्ला.',
          canonicalPath: '/krishi'
        };
      case 'transport':
        return {
          title: 'वाहतूक व बस — आसगाव',
          description: 'आसगाव बस थांबा — पवनी, भंडारा व नागपूर एसटी बसेस, ५०% महिला सवलत पास व स्थानिक वाहतूक.',
          canonicalPath: '/transport'
        };
      case 'businesses':
        return {
          title: 'स्थानिक दुकाने — आसगाव',
          description: 'आसगाव परिसरातील सर्व प्रमाणित स्थानिक दुकाने, कृषी केंद्र, किराणा, दवाखाने व व्यापारी संपर्क.',
          canonicalPath: '/businesses'
        };
      case 'reviews':
        return {
          title: 'नागरिक अभिप्राय — आसगाव',
          description: 'आसगाव परिसरातील दुकाने, कृषी केंद्र, दवाखाने व सेवांचे गावकऱ्यांनी दिलेले थेट अभिप्राय व मानांकन.',
          canonicalPath: '/reviews'
        };
      case 'jobs':
        return {
          title: 'रोजगार मंच — आसगाव',
          description: 'आसगाव रोजगार मंच — शेती मजूर, ट्रॅक्टर चालक, कारागीर व स्थानिक रोजगाराच्या संधी.',
          canonicalPath: '/jobs'
        };
      case 'shiksha':
        return {
          title: 'शिक्षण व शाळा — आसगाव',
          description: 'आसगाव जिल्हा परिषद शाळा, शिष्यवृत्ती, स्पर्धा परीक्षा वाचनालय व उच्च शिक्षण मार्गदर्शन.',
          canonicalPath: '/shiksha'
        };
      case 'announcements':
        return {
          title: 'ग्राम सूचना — आसगाव',
          description: 'आसगाव ग्रामपंचायत अधिकृत सूचना फलक — ग्रामसभा ठराव, कर पावती व विकासकामे.',
          canonicalPath: '/announcements'
        };
      case 'events':
        return {
          title: 'गावातील कार्यक्रम — आसगाव',
          description: 'आसगाव खंडोबा जत्रा, सार्वजनिक उत्सव, पोळा व सांस्कृतिक कार्यक्रम दिनदर्शिका.',
          canonicalPath: '/events'
        };
      case 'marketplace':
        return {
          title: 'ग्राम बाजार — आसगाव',
          description: 'आसगाव शेतीमाल, दुभती जनावरे, ट्रॅक्टर व स्थानिक उत्पादनांची थेट खरेदी-विक्री.',
          canonicalPath: '/marketplace'
        };
      case 'blogs':
        return {
          title: 'माहिती लेख व ब्लॉग — आसगाव',
          description: 'आसगाव गावकऱ्यांचे अनुभव, कृषी यशोगाथा, शासकीय मार्गदर्शन व लोकवार्ता.',
          canonicalPath: '/blogs'
        };
      case 'emergency':
        return {
          title: 'आपत्कालीन सेवा — आसगाव',
          description: 'आसगाव आपत्कालीन सेवा — रुग्णवाहिका, पोलीस, अग्निशामक, सर्पमित्र व महावितरण २४/७ थेट संपर्क.',
          canonicalPath: '/emergency'
        };
      case 'admin':
        return {
          title: 'प्रशासन पॅनेल — आसगाव',
          description: 'आसगाव ग्राम माहिती मंच प्रशासकीय व्यवस्थापन कक्ष.',
          canonicalPath: '/admin'
        };
      default:
        return {
          title: 'मुख्यपृष्ठ - ग्राम माहिती व सेवा',
          description: 'आसगाव गावकऱ्यांसाठी स्वतंत्र माहिती व जनजागृती मंच (पवनी, जि. भंडारा - ४४१९१०). शासकीय योजना, कृषी बाजारभाव, एसटी बस वेळापत्रक व नागरी सेवा एकाच ठिकाणी.',
          canonicalPath: '/'
        };
    }
  };

  useSEO(getPageSEO());
  const [currentUser, setCurrentUser] = useState<UserProfileData>(() => {
    const savedUser = localStorage.getItem('dg_user');
    const token = localStorage.getItem('dg_auth_token');
    if (savedUser && token) {
      try {
        const u = JSON.parse(savedUser);
        const role = (u.roles && u.roles.length > 0) ? u.roles[0].replace('ROLE_', '') : (u.role || 'CITIZEN');
        const name = u.fullName || u.username || 'Google Citizen';
        const phone = u.phone || '';
        return {
          fullName: name,
          phone,
          role,
          ward: u.ward || 'Ward 2 (Gaothan)',
          village: 'Asgaon, Pauni (PIN 441910)',
          isLoggedIn: true,
          avatarInitials: name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'GC',
          occupation: u.occupation || 'Asgaon Citizen'
        };
      } catch {
        // ignore
      }
    }
    return DEFAULT_GUEST_USER;
  });

  const [userRole, setUserRole] = useState<string | null>(() => {
    const token = localStorage.getItem('dg_auth_token');
    const savedUser = localStorage.getItem('dg_user');
    if (token && savedUser) {
      try {
        const u = JSON.parse(savedUser);
        return (u.roles && u.roles.length > 0) ? u.roles[0].replace('ROLE_', '') : (u.role || 'FARMER');
      } catch {
        return null;
      }
    }
    return null;
  });

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [isServerWaking, setIsServerWaking] = useState(false);

  useEffect(() => {
    const handleWaking = () => setIsServerWaking(true);
    const handleReady = () => setIsServerWaking(false);
    window.addEventListener('dg:server-waking', handleWaking);
    window.addEventListener('dg:server-ready', handleReady);
    return () => {
      window.removeEventListener('dg:server-waking', handleWaking);
      window.removeEventListener('dg:server-ready', handleReady);
    };
  }, []);

  // Fetch live data exclusively from PostgreSQL backend
  useEffect(() => {
    // 1. Fetch businesses
    api.getBusinesses()
      .then((backendBiz) => {
        if (backendBiz && backendBiz.length > 0) {
          const mapped: Business[] = backendBiz.map((b: any, index: number) => ({
            id: b.id || ('b-' + index),
            name: b.name,
            slug: b.slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: (b.category && b.category.name) || 'Kirana & General Stores',
            categoryId: (b.category && b.category.id) || 1,
            description: b.description || 'Verified Asgaon enterprise',
            address: b.address || 'Asgaon Market Road',
            landmark: b.landmark || 'Village Center',
            phone: b.phone || '9822104500',
            whatsapp: b.whatsapp || b.phone || '9822104500',
            openingHours: b.openingHours || '8:00 AM - 8:00 PM',
            imageUrl: b.imageUrl || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=600&q=80',
            isVerified: b.isVerified ?? true,
            verificationBadge: b.verificationBadge || 'Verified Merchant',
            rating: Number(b.rating) || 4.8,
            ratingCount: b.ratingCount || 1,
            distanceKm: '0.4 km',
            latitude: b.latitude,
            longitude: b.longitude
          }));
          setBusinesses(mapped);
        }
      })
      .catch((err) => console.error('Failed to load businesses from database API:', err.message));

    // 2. Fetch jobs
    api.getJobs()
      .then((backendJobs) => {
        if (backendJobs && backendJobs.length > 0) {
          const mapped: Job[] = backendJobs.map((j: any, index: number) => ({
            id: j.id || ('j-' + index),
            title: j.title,
            slug: j.slug || j.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            employerName: j.employerName,
            employmentType: j.employmentType,
            salaryRange: j.salaryRange || 'Daily / Weekly',
            location: j.location || 'Asgaon',
            description: j.description || '',
            requirements: j.requirements || 'Experience in trade',
            contactPhone: j.contactPhone || '9822104500',
            status: j.status || 'ACTIVE',
            postedAgo: 'Recently Posted',
            expiresAt: j.expiresAt || '2026-12-31'
          }));
          setJobs(mapped);
        }
      })
      .catch((err) => console.error('Failed to load jobs from database API:', err.message));

    // 3. Fetch schemes
    api.getSchemes()
      .then((backendSchemes) => {
        if (backendSchemes && backendSchemes.length > 0) {
          const mapped: Scheme[] = backendSchemes.map((s: any, index: number) => ({
            id: s.id || ('s-' + index),
            title: s.title,
            slug: s.slug || s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: s.category || 'farmer',
            sponsoringAgency: s.sponsoringAgency || 'Government of Maharashtra',
            deadlineText: s.deadlineText || 'Open all year',
            description: s.description || '',
            benefits: s.benefits || '',
            eligibility: s.eligibility || '',
            documentsRequired: s.documentsRequired ? s.documentsRequired.split(',').map((d: string) => d.trim()) : [],
            officialUrl: s.officialUrl || 'https://aaplesarkar.mahaonline.gov.in',
            actionLabel: s.actionLabel || 'Apply on Portal'
          }));
          setSchemes(mapped);
        }
      })
      .catch((err) => console.error('Failed to load schemes from database API:', err.message));

    // 4. Fetch mandi prices
    api.getMandiPrices()
      .then((prices) => {
        if (prices && prices.length > 0) {
          const mapped: MandiPrice[] = prices.map((p: any, index: number) => ({
            id: p.id || index + 1,
            commodityName: p.commodityName,
            variety: p.variety || 'Standard',
            marketName: p.marketName || 'Pauni APMC',
            modalPrice: Number(p.modalPrice) || 4500,
            unit: p.unit || 'Quintal',
            priceChange: Number(p.priceChange) || 0,
            trend: Number(p.priceChange) > 0 ? 'up' : Number(p.priceChange) < 0 ? 'down' : 'stable'
          }));
          setMandiPrices(mapped);
        }
      })
      .catch((err) => console.error('Failed to load mandi prices from database API:', err.message));

    // 5. Fetch announcements
    api.getAnnouncements()
      .then((notices) => {
        if (notices && notices.length > 0) {
          setAnnouncements(notices);
        }
      })
      .catch((err) => console.error('Failed to load announcements from database API:', err.message));

    // 6. Fetch live complaints from Neon PostgreSQL
    api.getAllComplaints()
      .then((comps) => {
        if (comps && comps.length > 0) {
          const mapped: Grievance[] = comps.map((c: any, index: number) => ({
            id: c.id || ('g-' + index),
            trackingNumber: c.trackingNumber || `ASG-2026-${index + 1000}`,
            category: c.category || 'Civic Infrastructure',
            title: c.title,
            description: c.description || 'Public grievance registered in Asgaon civic system.',
            wardOrArea: c.wardOrArea || 'Village Center',
            contactPhone: c.citizenPhone || '9822104500',
            status: (c.status === 'RESOLVED' ? 'RESOLVED' : c.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'SUBMITTED') as 'RESOLVED' | 'IN_PROGRESS' | 'SUBMITTED',
            statusBadge: c.status === 'RESOLVED' ? 'Resolved & Verified' : c.status === 'IN_PROGRESS' ? 'Repair Crew on Site' : 'Received (Under Review)',
            reportedBy: c.citizenName || 'Citizen (' + (c.citizenPhone ? c.citizenPhone.slice(-4) : '4500') + ')',
            progressPercent: c.status === 'RESOLVED' ? 100 : c.status === 'IN_PROGRESS' ? 65 : 20,
            actionTimeline: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently Registered',
            isVerifiedClosed: c.status === 'RESOLVED'
          }));
          setGrievances(mapped);
        }
      })
      .catch((err) => console.error('Failed to load complaints from database API:', err.message));
  }, []);

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [grievanceModalOpen, setGrievanceModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeActionTitle, setUpgradeActionTitle] = useState('');
  const [registerShopOpen, setRegisterShopOpen] = useState(false);
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [villageMapModalOpen, setVillageMapModalOpen] = useState(false);

  // Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<Business | Job | Scheme | null>(null);
  const [detailType, setDetailType] = useState<'business' | 'job' | 'scheme' | null>(null);

  // Search handler
  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    const matchedBiz = businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
    const matchedJob = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q)
    );
    const matchedScheme = schemes.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );

    if (matchedBiz.length > 0) {
      setDetailData(matchedBiz[0]);
      setDetailType('business');
      setDetailModalOpen(true);
    } else if (matchedJob.length > 0) {
      setDetailData(matchedJob[0]);
      setDetailType('job');
      setDetailModalOpen(true);
    } else if (matchedScheme.length > 0) {
      setDetailData(matchedScheme[0]);
      setDetailType('scheme');
      setDetailModalOpen(true);
    } else {
      alert(`Search for "${query}": Found ${matchedBiz.length + matchedJob.length + matchedScheme.length} local results across Asgaon.`);
    }
  };

  const requireAuth = (actionTitle: string, callback: () => void) => {
    if (userRole) {
      callback();
    } else {
      setUpgradeActionTitle(actionTitle);
      setUpgradeModalOpen(true);
    }
  };

  const handleBookmark = (item: any) => {
    requireAuth('bookmark items to your profile', () => {
      alert(`Item "${item.name || item.title}" bookmarked to your profile!`);
    });
  };

  const handleApplyJob = (job: Job) => {
    requireAuth(`apply directly for "${job.title}"`, () => {
      alert(`Application submitted for "${job.title}". The employer at ${job.employerName} will review your application.`);
    });
  };

  const handleSelectBusiness = (biz: Business) => {
    navigateToBusiness(biz.slug || biz.id);
  };

  const handleGrievanceSubmit = (newGrievance: Grievance) => {
    setGrievances((prev) => [newGrievance, ...prev]);
  };

  const handleAddBusiness = (newBiz: Business) => {
    setBusinesses((prev) => [newBiz, ...prev]);
  };

  const handleAddJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  // Synchronize browser URL and back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      let path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      try {
        path = decodeURIComponent(path);
      } catch {
        /* fallback to raw path */
      }
      if (path === 'admin' || window.location.hash === '#admin') {
        setActiveNav('admin');
      } else if (path.startsWith('schemes/')) {
        setSelectedSchemeSlug(path.replace('schemes/', ''));
        setActiveNav('scheme-detail');
      } else if (path.startsWith('businesses/')) {
        setSelectedBusinessSlug(path.replace('businesses/', ''));
        setActiveNav('business-detail');
      } else if (path.startsWith('shiksha/')) {
        setSelectedShikshaSlug(path.replace('shiksha/', ''));
        setActiveNav('shiksha-detail');
      } else if (path === 'blogs/write' || path === 'write-blog') {
        setActiveNav('write-blog');
      } else if (path.startsWith('blogs/')) {
        setSelectedBlogSlug(path.replace('blogs/', ''));
        setActiveNav('blog-detail');
      } else if (path) {
        setActiveNav(path);
      } else {
        setActiveNav('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (nav: string) => {
    setActiveNav(nav);
    const targetUrl = nav === 'home' ? '/' : `/${nav}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToScheme = (slug: string) => {
    setSelectedSchemeSlug(slug);
    setActiveNav('scheme-detail');
    const targetUrl = `/schemes/${slug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBusiness = (slug: string) => {
    setSelectedBusinessSlug(slug);
    setActiveNav('business-detail');
    const targetUrl = `/businesses/${slug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToShiksha = (slug: string) => {
    setSelectedShikshaSlug(slug);
    setActiveNav('shiksha-detail');
    const targetUrl = `/shiksha/${slug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBlog = (slug: string) => {
    setSelectedBlogSlug(slug);
    setActiveNav('blog-detail');
    const targetUrl = `/blogs/${slug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToWriteBlog = () => {
    setActiveNav('write-blog');
    const targetUrl = '/blogs/write';
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('dg_auth_token');
    localStorage.removeItem('dg_user');
    setUserRole(null);
    setCurrentUser(DEFAULT_GUEST_USER);
    if ((window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.disableAutoSelect();
      } catch (e) {
        console.warn('Google auto select disable notice:', e);
      }
    }
    navigateTo('home');
  };

  const handleLoginSuccess = (role: string, phone: string, name?: string, email?: string) => {
    setUserRole(role);
    if (!localStorage.getItem('dg_auth_token')) {
      localStorage.setItem('dg_auth_token', 'dg_session_' + Date.now());
    }
    const initials = name
      ? name.trim().split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
      : (role.substring(0, 2).toUpperCase());
    const updated: UserProfileData = {
      fullName: name || (role === 'SUPER_ADMIN' ? 'Chief Super Admin' : role === 'ADMIN' ? 'Gram Sevak S. N. Jadhav' : 'Google Citizen'),
      phone: phone || '',
      role: role || 'CITIZEN',
      ward: role === 'SUPER_ADMIN' ? 'Gram Sachivalaya' : 'Ward 2 (Gaothan)',
      village: 'Asgaon, Pauni (PIN 441910)',
      isLoggedIn: true,
      avatarInitials: initials || 'GA',
      occupation: role === 'SUPER_ADMIN' ? 'Chief Super Administrator' : role === 'ADMIN' ? 'Gram Panchayat Administrator' : role === 'FARMER' ? 'Farmer & Cultivator' : role === 'BUSINESS_OWNER' ? 'Local Merchant / Shopkeeper' : 'Asgaon Citizen'
    };
    setCurrentUser(updated);
    localStorage.setItem('dg_user', JSON.stringify({
      ...updated,
      email: email || ''
    }));
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1d1b16] flex flex-col font-sans relative">
      {/* Authentic Village Folk Art Graffiti Backdrop */}
      <VillageGraffitiBackdrop />

      {/* 1. Header with dynamic navigation */}
      <Header
        activeNav={activeNav}
        setActiveNav={(nav) => navigateTo(nav)}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenGrievance={() => setGrievanceModalOpen(true)}
        onSearch={handleSearch}
        userRole={userRole}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Floating Server Wake-up notification */}
      {isServerWaking && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-stone-950 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-amber-300">
          <LucideIcon name="sync" className="text-base animate-spin" />
          <span>कृपया क्षणभर प्रतीक्षा करा..</span>
        </div>
      )}

      {/* Main Container - dynamic top padding matching mobile single-row (pt-16) vs desktop two-row (md:pt-28) header */}
      <main className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 ${
        activeNav === 'admin' ? 'pt-16 md:pt-22' : 'pt-16 sm:pt-20 md:pt-28'
      }`}>
        {/* 2. Marquee Campaign Official Alert Ticker (Hidden in Admin mode) */}
        {activeNav !== 'admin' && (
          <OfficialAlertTicker
            onViewAllGazettes={() => setActiveNav('announcements')}
            alerts={announcements}
          />
        )}

        {/* 3. Page Router */}
        {activeNav === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              localStorage.setItem('dg_user', JSON.stringify(updated));
            }}
            onNavigateHome={() => navigateTo('home')}
            onOpenGrievanceModal={() => setGrievanceModalOpen(true)}
            onOpenLoginModal={() => setLoginModalOpen(true)}
            onLogout={handleLogout}
            schemes={schemes}
          />
        )}

        {activeNav === 'businesses' && (
          <BusinessesPage
            businesses={businesses}
            onSelectBusiness={handleSelectBusiness}
            onRegisterShop={() => setRegisterShopOpen(true)}
            onNavigateHome={() => navigateTo('home')}
            onSelectBusinessSlug={navigateToBusiness}
          />
        )}

        {activeNav === 'business-detail' && (
          <BusinessDetailPage
            slug={selectedBusinessSlug}
            businesses={businesses}
            onNavigateBack={() => navigateTo('businesses')}
            onSelectBusiness={navigateToBusiness}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activeNav === 'jobs' && (
          <JobsPage
            jobs={jobs}
            onApplyJob={handleApplyJob}
            onPostJob={() => setPostJobOpen(true)}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activeNav === 'schemes' && (
          <SchemesPage
            schemes={schemes}
            onBookmarkScheme={handleBookmark}
            onNavigateHome={() => navigateTo('home')}
            onSelectScheme={navigateToScheme}
          />
        )}

        {activeNav === 'scheme-detail' && (
          <SchemeDetailPage
            slug={selectedSchemeSlug}
            schemes={schemes}
            onNavigateBack={() => navigateTo('schemes')}
            onSelectScheme={navigateToScheme}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activeNav === 'krishi' && (
          <KrishiPage
            mandiPrices={mandiPrices}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activeNav === 'shiksha' && (
          <ShikshaPage
            onNavigateHome={() => navigateTo('home')}
            onSelectShikshaSlug={navigateToShiksha}
          />
        )}

        {activeNav === 'shiksha-detail' && (
          <ShikshaDetailPage
            slug={selectedShikshaSlug}
            onNavigateBack={() => navigateTo('shiksha')}
            onSelectShiksha={navigateToShiksha}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activeNav === 'transport' && (
          <TransportPage
            onNavigateHome={() => navigateTo('home')}
            onNavigateToAdmin={() => navigateTo('admin')}
          />
        )}

        {activeNav === 'blogs' && (
          <BlogsPage
            onSelectBlogSlug={navigateToBlog}
            onNavigateHome={() => navigateTo('home')}
            onNavigateToWriteBlog={navigateToWriteBlog}
            currentUser={currentUser ? {
              fullName: currentUser.fullName,
              ward: currentUser.ward,
              role: currentUser.role,
              isLoggedIn: currentUser.isLoggedIn
            } : undefined}
            onRequireLogin={() => setLoginModalOpen(true)}
          />
        )}

        {activeNav === 'write-blog' && (
          <WriteBlogPage
            onNavigateBack={() => navigateTo('blogs')}
            onNavigateHome={() => navigateTo('home')}
            onPublishSuccess={(slug) => navigateToBlog(slug)}
            currentUser={currentUser ? {
              fullName: currentUser.fullName,
              ward: currentUser.ward,
              role: currentUser.role,
              isLoggedIn: currentUser.isLoggedIn
            } : undefined}
            onRequireLogin={() => setLoginModalOpen(true)}
          />
        )}

        {activeNav === 'blog-detail' && (
          <BlogDetailPage
            slug={selectedBlogSlug}
            onNavigateBack={() => navigateTo('blogs')}
            onSelectBlog={navigateToBlog}
            onNavigateHome={() => navigateTo('home')}
            currentUser={currentUser ? {
              fullName: currentUser.fullName,
              ward: currentUser.ward,
              role: currentUser.role,
              isLoggedIn: currentUser.isLoggedIn
            } : undefined}
            onRequireLogin={() => setLoginModalOpen(true)}
            onWriteBlog={navigateToWriteBlog}
          />
        )}

        {activeNav === 'marketplace' && (
          <MarketplacePage
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activeNav === 'announcements' && (
          <AnnouncementsPage
            announcements={announcements}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activeNav === 'events' && (
          <EventsPage
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activeNav === 'emergency' && (
          <EmergencyPage
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {activeNav === 'reviews' && (
          <ReviewsPage
            businesses={businesses}
            onNavigateHome={() => navigateTo('home')}
            onSelectBusiness={(biz) => navigateToBusiness(biz.slug || biz.id)}
            onSelectBusinessSlug={(slug) => navigateToBusiness(slug)}
          />
        )}

        {activeNav === 'admin' && (
          <AdminPage
            currentUser={currentUser}
            onLoginAsAdmin={(role, phone, name) => {
              handleLoginSuccess(role, phone, name);
            }}
            onExit={() => navigateTo('home')}
            onLogout={() => {
              handleLogout();
              navigateTo('home');
            }}
          />
        )}

        {(activeNav === 'home' || activeNav === 'all') && (
          <div className="flex flex-col gap-10">
            {/* Hero & Universal Discovery Hub Slider */}
            <HeroSection
              onSearch={handleSearch}
              onTagClick={(tag) => handleSearch(tag)}
              onNavigate={(destination) => {
                setActiveNav(destination);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Live Village Action Hub & Real-Time Pulse */}
            <CivicHubGrid
              onSelectModule={(moduleId) => {
                setActiveNav(moduleId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenGrievance={() => setGrievanceModalOpen(true)}
              onOpenRegisterShop={() => setRegisterShopOpen(true)}
              onOpenPostJob={() => setPostJobOpen(true)}
              mandiPrices={mandiPrices}
            />

            {/* Live Mandi Bhaav Ticker */}
            <div id="krishi" className="scroll-mt-28">
              <LiveMandiTicker
                prices={mandiPrices}
                onViewAllMandi={() => setActiveNav('krishi')}
              />
            </div>

            {/* Featured Village Enterprises */}
            <FeaturedEnterprises
              businesses={businesses}
              onRegisterShop={() => setRegisterShopOpen(true)}
              onSelectBusiness={(biz) => navigateToBusiness(biz.slug || biz.id)}
            />

            {/* Gramin Rojgar Manch */}
            <JobsBoardSection
              jobs={jobs}
              onPostJob={() => setPostJobOpen(true)}
              onApplyJob={handleApplyJob}
            />

            {/* Sarkari Yojana Guidance Desk */}
            <GovtSchemesSection
              schemes={schemes}
              onOpenCSC={() => navigateTo('schemes')}
              onSaveScheme={handleBookmark}
              onSelectScheme={navigateToScheme}
            />

            {/* Public Grievance Desk */}
            <GrievanceDeskSection
              grievances={grievances}
              onOpenReportModal={() => setGrievanceModalOpen(true)}
              onTrackComplaint={async () => {
                const token = prompt('Enter Grievance Ref (उदा. ASG-2026-XXXXX):');
                if (token && token.trim()) {
                  try {
                    const comp = await api.trackComplaint(token.trim());
                    if (comp) {
                      alert(`Grievance [${comp.trackingNumber}]:\n• Title: ${comp.title}\n• Status: ${comp.status}\n• Category: ${comp.category}\n• Ward: ${comp.wardOrArea}\n• Lodged on: ${new Date(comp.createdAt).toLocaleDateString()}`);
                    } else {
                      alert(`Grievance Ref [${token.trim()}]: Status is Active / Under review by Village Office.`);
                    }
                  } catch (err: any) {
                    alert(`Grievance Ref [${token.trim()}]: Status is Active / Under review by Village Office.`);
                  }
                }
              }}
            />

            {/* Official Notice Strip */}
            <PanchayatNoticeStrip />
          </div>
        )}
      </main>

      {/* 4. Civic Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Interactive Modals */}
      <GrievanceModal
        isOpen={grievanceModalOpen}
        onClose={() => setGrievanceModalOpen(false)}
        onSubmitGrievance={handleGrievanceSubmit}
      />

      {loginModalOpen && (
        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={(role, phone, name, email) => {
            handleLoginSuccess(role, phone, name, email);
            setLoginModalOpen(false);
          }}
        />
      )}

      <GuestUpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onProceedToLogin={() => {
          setUpgradeModalOpen(false);
          setLoginModalOpen(true);
        }}
        actionTitle={upgradeActionTitle}
      />

      <RegisterShopModal
        isOpen={registerShopOpen}
        onClose={() => setRegisterShopOpen(false)}
        onAddBusiness={handleAddBusiness}
      />

      <PostJobModal
        isOpen={postJobOpen}
        onClose={() => setPostJobOpen(false)}
        onAddJob={handleAddJob}
      />

      <DetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        data={detailData}
        type={detailType}
        onBookmark={handleBookmark}
      />

      {/* Floating Action Button: Village GIS Master Map (Homepage Only) */}
      {(activeNav === 'home' || activeNav === 'all') && (
        <button
          type="button"
          onClick={() => setVillageMapModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#166534] via-[#14532d] to-[#166534] hover:from-[#052e16] hover:to-[#166534] text-white px-4 sm:px-5 py-3 rounded-full shadow-2xl hover:shadow-[#166534]/50 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-[#cadbcf]/50 group cursor-pointer"
          title="गाव नकाशा पहा"
          aria-label="Open village GIS map"
        >
          {/* Pulsing Beacon Indicator */}
         

          <LucideIcon name="explore" className=" text-[22px] text-[#a7f3d0] group-hover:rotate-12 transition-transform" />
          <span className="font-heading font-extrabold text-[13px] sm:text-[14px] tracking-wide whitespace-nowrap drop-shadow-xs">
            नकाशा
          </span>
        </button>
      )}

      {/* Master Village GIS Map Modal */}
      <VillageMasterMapModal
        isOpen={villageMapModalOpen}
        onClose={() => setVillageMapModalOpen(false)}
        businesses={businesses}
        onSelectBusiness={(biz) => {
          setVillageMapModalOpen(false);
          navigateToBusiness(biz.slug || biz.id);
        }}
      />
    </div>
  );
}

export default App;
