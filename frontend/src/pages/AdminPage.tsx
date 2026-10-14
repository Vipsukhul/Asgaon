import { LucideIcon } from '../components/LucideIcon';
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { UserProfileData } from './ProfilePage';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';
import { sendTestPushNotification } from '../services/pushNotifications';
import { AdminLogsSection } from '../components/AdminLogsSection';
import { AdminBannerManager } from '../components/AdminBannerManager';
import { AdminGalleryManager } from '../components/AdminGalleryManager';
import {
  AdminManagementSection,
  getAllowedModulesForUser,
  type AdminModuleId
} from '../components/AdminManagementSection';
import {
  VILLAGE_CONTACTS,
  WATER_SCHEDULE,
  VILLAGE_PROJECTS
} from '../data/villageData';
import type { VillageContact, WaterScheduleItem, VillageProject, Scheme } from '../types';
import type {
  SchoolItem,
  ScholarshipItem,
  AbhyasikaConfig,
  TutorCenterItem,
  ShikshaNotice,
  DeskReservation
} from '../data/shikshaData';
import {
  DEFAULT_SCHOOLS,
  DEFAULT_SCHOLARSHIPS,
  DEFAULT_ABHYASIKA,
  DEFAULT_TUTORS,
  DEFAULT_SHIKSHA_NOTICE
} from '../data/shikshaData';
import {
  BUS_SCHEDULES,
  AUTO_DRIVERS,
  DEPOT_CONTACTS,
  type BusSchedule,
  type AutoDriver,
  type DepotContact
} from '../data/transportData';
import {
  INITIAL_BLOG_POSTS,
  type BlogPost
} from '../data/blogData';

interface AdminPageProps {
  currentUser: UserProfileData;
  onLoginAsAdmin?: (role: string, phone: string, name: string) => void;
  onExit?: () => void;
  onLogout?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ currentUser, onLoginAsAdmin, onExit, onLogout }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'businesses' | 'reviews' | 'events' | 'shiksha' | 'transport' | 'blogs' | 'notices' | 'water' | 'schemes' | 'contacts' | 'projects' | 'complaints' | 'broadcast' | 'users' | 'logs' | 'banners' | 'gallery' | 'admin_management'
  >('overview');

  // Customer Reviews Moderation State
  const [adminReviews, setAdminReviews] = useState<any[]>(() => {
    const saved = localStorage.getItem('dg_all_public_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return [
      {
        id: 'rev-1',
        businessId: '1',
        businessName: 'खडके किराणा आणि जनरल स्टोअर्स',
        userName: 'रमेश पाटील',
        wardOrArea: 'वॉर्ड २ (गावठाण)',
        rating: 5,
        date: 'काल',
        comment: 'उत्कृष्ट सेवा आणि वाजवी दर. वेळेवर सर्व धान्य व किराणा माल उपलब्ध असतो.',
        verifiedCitizen: true
      },
      {
        id: 'rev-2',
        businessId: '2',
        businessName: 'पाटील कृषी केंद्र',
        userName: 'सुनीता झाळके',
        wardOrArea: 'आंबेडकर वॉर्ड १',
        rating: 5,
        date: '३ दिवसांपूर्वी',
        comment: 'अतिशय नम्र बोलणे आणि खात्रीशीर बियाणे. रासायनिक व सेंद्रिय खतांचा योग्य सल्ला देतात.',
        verifiedCitizen: true
      },
      {
        id: 'rev-3',
        businessId: '3',
        businessName: 'सोनवणे मेडिकल व क्लिनिक',
        userName: 'विठ्ठल मेश्राम',
        wardOrArea: 'विठ्ठल मंदिर परिसर वॉर्ड ३',
        rating: 5,
        date: '१ आठवड्यापूर्वी',
        comment: 'तातडीच्या वेळी रात्रीही आवश्यक औषधे उपलब्ध करून दिली. बीपी व शुगर तपासणी मोफत केली जाते.',
        verifiedCitizen: true
      }
    ];
  });
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewFilterRating, setReviewFilterRating] = useState('all');

  const handleDeleteReview = (id: string | number) => {
    if (!window.confirm('हा अभिप्राय हटवायचा आहे का?')) return;
    const updated = adminReviews.filter((r) => r.id !== id);
    setAdminReviews(updated);
    localStorage.setItem('dg_all_public_reviews', JSON.stringify(updated));
    alert('अभिप्राय यशस्वीरीत्या काढला गेला!');
  };

  const handleToggleVerifiedReview = (id: string | number) => {
    const updated = adminReviews.map((r) => r.id === id ? { ...r, verifiedCitizen: !r.verifiedCitizen } : r);
    setAdminReviews(updated);
    localStorage.setItem('dg_all_public_reviews', JSON.stringify(updated));
  };

  // --- BUSINESSES & VERIFICATION MODERATION STATE ---
  const [adminBusinesses, setAdminBusinesses] = useState<any[]>(() => {
    const saved = localStorage.getItem('dg_asgaon_businesses_cache');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return [];
  });
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [businessSearch, setBusinessSearch] = useState('');
  const [businessStatusFilter, setBusinessStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');
  const [selectedBizForBadge, setSelectedBizForBadge] = useState<any | null>(null);
  const [badgeToAssign, setBadgeToAssign] = useState('Verified Merchant');
  const [bizFeedbackMsg, setBizFeedbackMsg] = useState<string | null>(null);

  // Dashboard Metrics
  const [stats, setStats] = useState<any>({
    totalCitizens: 1420,
    totalComplaints: 0,
    pendingComplaints: 0,
    totalBusinesses: 0,
    totalJobs: 0,
    totalAnnouncements: 0,
    totalMarketplaceListings: 0
  });

  // 0. Village Events & Jatra
  const [events, setEvents] = useState<any[]>(() => {
    const saved = localStorage.getItem('dg_village_events_cache');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return [];
  });
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'religious',
    eventDate: '',
    eventTime: '10:00 AM — 05:00 PM',
    location: 'खंडोबा मंदिर प्रांगण, आसगाव',
    organizer: 'ग्रामपंचायत आसगाव',
    badge: 'गावातील कार्यक्रम',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
  });
  const [savingEvent, setSavingEvent] = useState(false);

  // --- SHIKSHA / EDUCATION MANAGEMENT STATE ---
  const [shikshaSubTab, setShikshaSubTab] = useState<'schools' | 'scholarships' | 'abhyasika' | 'tutors' | 'requests' | 'notice'>('schools');

  const [shikshaSchools, setShikshaSchools] = useState<SchoolItem[]>(() => {
    const saved = localStorage.getItem('dg_shiksha_schools');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_SCHOOLS;
  });
  const [editingSchool, setEditingSchool] = useState<SchoolItem | null>(null);
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    badge: 'Govt Approved',
    category: 'High School & Jr College',
    grades: '1st – 12th',
    medium: 'मराठी व सेमी-इंग्रजी',
    description: '',
    tagsString: 'शासन मान्यताप्राप्त, मोफत सायकल योजना, मध्यान्ह भोजन',
    principalName: '',
    contactPhone: '',
    address: 'आसगाव',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
  });

  const [shikshaScholarships, setShikshaScholarships] = useState<ScholarshipItem[]>(() => {
    const saved = localStorage.getItem('dg_shiksha_scholarships');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_SCHOLARSHIPS;
  });
  const [editingScholarship, setEditingScholarship] = useState<ScholarshipItem | null>(null);
  const [scholarshipForm, setScholarshipForm] = useState({
    title: '',
    badge: 'POST-MATRIC (11th & Higher)',
    deadline: '15 Nov 2026',
    description: '',
    benefit: '100% फी सवलत + मासिक निर्वाह भत्ता',
    incomeLimit: '≤ ₹2,50,000 / वर्ष',
    department: 'सामाजिक न्याय व विशेष सहाय्य विभाग',
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    eligibility: 'आधार संलग्न बँक खाते, जात प्रमाणपत्र, उत्पन्न दाखला',
  });

  const [shikshaAbhyasika, setShikshaAbhyasika] = useState<AbhyasikaConfig>(() => {
    const saved = localStorage.getItem('dg_shiksha_abhyasika');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_ABHYASIKA;
  });

  const [shikshaTutors, setShikshaTutors] = useState<TutorCenterItem[]>(() => {
    const saved = localStorage.getItem('dg_shiksha_tutors');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_TUTORS;
  });
  const [editingTutor, setEditingTutor] = useState<TutorCenterItem | null>(null);
  const [tutorForm, setTutorForm] = useState({
    name: '',
    category: 'इ. ५ वी ते १० वी शिकवणी',
    subjects: 'गणित, विज्ञान, इंग्रजी',
    timing: 'सकाळी ०६:३० ते ०८:३०',
    phone: '',
    address: 'आसगाव',
    feesInfo: '₹400 / महिना',
  });

  const [shikshaNotice, setShikshaNotice] = useState<ShikshaNotice>(() => {
    const saved = localStorage.getItem('dg_shiksha_notice');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_SHIKSHA_NOTICE;
  });

  const [deskRequests, setDeskRequests] = useState<DeskReservation[]>(() => {
    const saved = localStorage.getItem('dg_shiksha_desk_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  // --- TRANSPORT / MSRTC MANAGEMENT STATE ---
  const [transportSubTab, setTransportSubTab] = useState<'buses' | 'autos' | 'depots'>('buses');
  const [transportBuses, setTransportBuses] = useState<BusSchedule[]>(() => {
    const saved = localStorage.getItem('dg_transport_buses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return BUS_SCHEDULES;
  });
  const [editingBus, setEditingBus] = useState<BusSchedule | null>(null);
  const [busForm, setBusForm] = useState({
    busNumber: 'MH40-Y-',
    source: 'Asgaon',
    destination: 'Pauni',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'पवनी',
    viaMarathiString: 'आसगाव फाटा, कोंढा, पवनी बस स्थानक',
    departureTime: '07:00 AM',
    departureTime24: '07:00',
    approxArrivalTime: '07:35 AM',
    durationMinutes: 35,
    busType: 'Lalpari' as BusSchedule['busType'],
    depot: 'Pauni Depot',
    depotMarathi: 'पवनी आगार',
    fareGeneral: 20,
    fareMahila: 10,
    fareSenior: 0,
    frequencyMarathi: 'दररोज',
    boardingPointMarathi: 'आसगाव ग्रामपंचायत चौक'
  });

  const [transportAutos, setTransportAutos] = useState<AutoDriver[]>(() => {
    const saved = localStorage.getItem('dg_transport_autos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return AUTO_DRIVERS;
  });
  const [editingAuto, setEditingAuto] = useState<AutoDriver | null>(null);
  const [autoForm, setAutoForm] = useState({
    name: '',
    nameMarathi: '',
    vehicleNumber: 'MH36-',
    vehicleType: 'Auto Rickshaw' as AutoDriver['vehicleType'],
    phone: '+91',
    standLocationMarathi: 'आसगाव मुख्य बस स्टँड चौक',
    primaryRouteMarathi: 'आसगाव ⇄ पवनी (शेअरिंग)',
    estimatedFare: '₹30 प्रति सीट / ₹180 स्पेशल',
    isAvailable: true
  });

  const [transportDepots, setTransportDepots] = useState<DepotContact[]>(() => {
    const saved = localStorage.getItem('dg_transport_depots');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return DEPOT_CONTACTS;
  });

  // Transport Action Handlers
  const handleSaveBus = (e: React.FormEvent) => {
    e.preventDefault();
    const viaArray = busForm.viaMarathiString.split(',').map((s) => s.trim()).filter(Boolean);
    const busTypeMarathiMap: Record<string, string> = {
      Lalpari: 'साधी लालपरी',
      Asiad: 'निमआराम',
      Shivshahi: 'शिवशाही वातानुकूलित',
      Ordinary: 'स्थानिक लोकल फेरी'
    };

    let updated: BusSchedule[];
    if (editingBus) {
      updated = transportBuses.map((b) =>
        b.id === editingBus.id
          ? {
            ...b,
            ...busForm,
            busTypeMarathi: busTypeMarathiMap[busForm.busType] || busForm.busType,
            viaMarathi: viaArray,
            via: viaArray
          }
          : b
      );
    } else {
      const newBus: BusSchedule = {
        id: 'bus-' + Date.now(),
        ...busForm,
        busTypeMarathi: busTypeMarathiMap[busForm.busType] || busForm.busType,
        viaMarathi: viaArray,
        via: viaArray,
        durationMinutes: busForm.durationMinutes || 35,
        frequency: 'Daily',
        boardingPointAtAsgaon: busForm.boardingPointMarathi
      };
      updated = [newBus, ...transportBuses];
    }

    setTransportBuses(updated);
    localStorage.setItem('dg_transport_buses', JSON.stringify(updated));
    window.dispatchEvent(new Event('dg_transport_updated'));
    setEditingBus(null);
    alert('एसटी बस वेळापत्रक यशस्वीरित्या सेव्ह केले!');
  };

  const handleDeleteBus = (id: string) => {
    if (!confirm('ही बस फेरी हटवायची आहे का?')) return;
    const updated = transportBuses.filter((b) => b.id !== id);
    setTransportBuses(updated);
    localStorage.setItem('dg_transport_buses', JSON.stringify(updated));
    window.dispatchEvent(new Event('dg_transport_updated'));
  };

  const handleResetBuses = () => {
    if (!confirm('सर्व बसेस मूळ अधिकृत वेळापत्रकावर रीसेट करायच्या का?')) return;
    setTransportBuses(BUS_SCHEDULES);
    localStorage.setItem('dg_transport_buses', JSON.stringify(BUS_SCHEDULES));
    window.dispatchEvent(new Event('dg_transport_updated'));
  };

  const handleSaveAuto = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: AutoDriver[];
    if (editingAuto) {
      updated = transportAutos.map((a) => (a.id === editingAuto.id ? { ...a, ...autoForm } : a));
    } else {
      const newAuto: AutoDriver = {
        id: 'auto-' + Date.now(),
        ...autoForm,
        standLocation: autoForm.standLocationMarathi,
        primaryRoute: autoForm.primaryRouteMarathi
      };
      updated = [newAuto, ...transportAutos];
    }
    setTransportAutos(updated);
    localStorage.setItem('dg_transport_autos', JSON.stringify(updated));
    window.dispatchEvent(new Event('dg_transport_updated'));
    setEditingAuto(null);
    setAutoForm({
      name: '',
      nameMarathi: '',
      vehicleNumber: 'MH36-',
      vehicleType: 'Auto Rickshaw',
      phone: '+91',
      standLocationMarathi: 'आसगाव मुख्य बस स्टँड चौक',
      primaryRouteMarathi: 'आसगाव ⇄ पवनी (शेअरिंग)',
      estimatedFare: '₹30 प्रति सीट / ₹180 स्पेशल',
      isAvailable: true
    });
    alert('रिक्षा चालक माहिती यशस्वीरित्या सेव्ह केली!');
  };

  const handleToggleAutoAvailable = (id: string) => {
    const updated = transportAutos.map((a) => (a.id === id ? { ...a, isAvailable: !a.isAvailable } : a));
    setTransportAutos(updated);
    localStorage.setItem('dg_transport_autos', JSON.stringify(updated));
    window.dispatchEvent(new Event('dg_transport_updated'));
  };

  const handleDeleteAuto = (id: string) => {
    if (!confirm('हा चालक संपर्क हटवायचा आहे का?')) return;
    const updated = transportAutos.filter((a) => a.id !== id);
    setTransportAutos(updated);
    localStorage.setItem('dg_transport_autos', JSON.stringify(updated));
    window.dispatchEvent(new Event('dg_transport_updated'));
  };

  // --- BLOGS / KNOWLEDGE ARTICLES MANAGEMENT STATE ---
  const [villageBlogs, setVillageBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('dg_village_blogs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return INITIAL_BLOG_POSTS;
  });
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    titleMarathi: '',
    slug: '',
    excerptMarathi: '',
    content: '',
    category: 'Schemes' as BlogPost['category'],
    author: 'ग्रामसेवक कार्यालय, आसगाव',
    authorRoleMarathi: 'माहिती कक्ष, आसगाव',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    tagsMarathiString: 'शासकीय योजना, आसगाव, माहिती',
    seoKeywords: 'Asgaon, Maharashtra schemes, Pauni',
    isFeatured: false
  });

  const generateSlugFromTitle = (titleText: string) => {
    return titleText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = (blogForm.slug || generateSlugFromTitle(blogForm.title) || `blog-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const categoryMarathiMap: Record<string, string> = {
      General: 'सामान्य / इतर',
      Schemes: 'शासकीय योजना',
      Agriculture: 'कृषी व शेती',
      Governance: 'प्रशासन व सेवा',
      Education: 'शिक्षण व करिअर',
      Health: 'आरोग्य व पोषण'
    };

    const tagsArray = blogForm.tagsMarathiString.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      if (editingBlog) {
        await api.updateBlog(editingBlog.id, {
          title: blogForm.title || blogForm.titleMarathi,
          titleMarathi: blogForm.titleMarathi,
          excerpt: blogForm.excerptMarathi,
          excerptMarathi: blogForm.excerptMarathi,
          content: blogForm.content,
          contentMarathi: blogForm.content,
          category: blogForm.category,
          categoryMarathi: categoryMarathiMap[blogForm.category] || 'सामान्य / इतर',
          author: blogForm.author,
          authorRole: 'Village Information Desk',
          authorRoleMarathi: blogForm.authorRoleMarathi,
          coverImage: blogForm.coverImage,
          tags: tagsArray.join(', '),
          tagsMarathi: tagsArray.join(', '),
          seoTitle: `${blogForm.titleMarathi} | Asgaon Digital Blog`,
          seoDescription: blogForm.excerptMarathi,
          seoKeywords: blogForm.seoKeywords,
          isFeatured: blogForm.isFeatured
        });
      } else {
        const now = new Date();
        await api.createBlog({
          slug: cleanSlug,
          title: blogForm.title || blogForm.titleMarathi,
          titleMarathi: blogForm.titleMarathi,
          excerpt: blogForm.excerptMarathi,
          excerptMarathi: blogForm.excerptMarathi,
          content: blogForm.content,
          contentMarathi: blogForm.content,
          category: blogForm.category,
          categoryMarathi: categoryMarathiMap[blogForm.category] || 'सामान्य / इतर',
          author: blogForm.author,
          authorRole: 'Village Information Desk',
          authorRoleMarathi: blogForm.authorRoleMarathi,
          publishDate: `${now.getDate()} ऑक्टोबर २०२६`,
          publishDateISO: now.toISOString().split('T')[0],
          readTimeMinutes: Math.max(2, Math.round(blogForm.content.length / 500)),
          coverImage: blogForm.coverImage,
          tags: tagsArray.join(', '),
          tagsMarathi: tagsArray.join(', '),
          seoTitle: `${blogForm.titleMarathi} | Asgaon Digital Blog`,
          seoDescription: blogForm.excerptMarathi,
          seoKeywords: blogForm.seoKeywords,
          isFeatured: blogForm.isFeatured
        });
      }
      loadData();
      alert('ब्लॉग लेख डेटाबेसमध्ये यशस्वीरित्या जतन व प्रसिद्ध केला!');
    } catch (err: any) {
      alert('ब्लॉग सेव्ह करताना त्रुटी: ' + err.message);
    }

    setEditingBlog(null);
    setBlogForm({
      title: '',
      titleMarathi: '',
      slug: '',
      excerptMarathi: '',
      content: '',
      category: 'General',
      author: 'ग्रामसेवक कार्यालय, आसगाव',
      authorRoleMarathi: 'माहिती कक्ष, आसगाव',
      coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      tagsMarathiString: 'शासकीय योजना, आसगाव, माहिती',
      seoKeywords: 'Asgaon, Maharashtra schemes, Pauni',
      isFeatured: false
    });
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('हा लेख कायमस्वरूपी डेटाबेसमधून हटवायचा आहे का?')) return;
    try {
      await api.deleteBlog(id);
      loadData();
      alert('लेख डेटाबेसमधून यशस्वीरित्या हटवला!');
    } catch (err: any) {
      alert('हटवताना त्रुटी: ' + err.message);
    }
  };

  const handleResetBlogs = () => {
    loadData();
  };

  // 1. Announcements / Circulars
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('ग्रामपंचायत');
  const [noticePriority, setNoticePriority] = useState('NORMAL');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeAuthor, setNoticeAuthor] = useState('ग्रामसेवक कार्यालय');
  const [noticeStatusFeedback, setNoticeStatusFeedback] = useState('');

  // 2. Water Schedule & Tanker
  const [waterSchedules, setWaterSchedules] = useState<WaterScheduleItem[]>(() => {
    const saved = localStorage.getItem('dg_water_schedule');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return WATER_SCHEDULE;
  });
  const [editingWaterWard, setEditingWaterWard] = useState<WaterScheduleItem | null>(null);

  // 3. Government & Krishi Schemes
  const [schemes, setSchemes] = useState<Scheme[]>(() => {
    const saved = localStorage.getItem('dg_schemes_cache');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);

  useEffect(() => {
    api.getSchemes()
      .then((data) => {
        if (data && data.length > 0) {
          setSchemes(data);
          localStorage.setItem('dg_schemes_cache', JSON.stringify(data));
        }
      })
      .catch((err) => console.error('Error fetching admin schemes:', err));
  }, []);

  const [schemeForm, setSchemeForm] = useState({
    title: '',
    category: 'Farmer',
    description: '',
    benefits: '',
    eligibility: '',
    documentsRequired: '७/१२ उतारा, ८-अ, आधार कार्ड, बँक पासबुक',
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    actionLabel: 'अर्ज करा / माहिती'
  });

  // 4. Village Contacts & Directory
  const [contacts, setContacts] = useState<VillageContact[]>(() => {
    const saved = localStorage.getItem('dg_village_contacts');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return VILLAGE_CONTACTS as VillageContact[];
  });
  const [editingContact, setEditingContact] = useState<VillageContact | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    designation: '',
    phone: '',
    category: 'Administration' as VillageContact['category'],
    officeHours: '',
    address: 'आसगाव'
  });

  // 5. Village Development Works / Projects
  const [projects, setProjects] = useState<VillageProject[]>(() => {
    const saved = localStorage.getItem('dg_village_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return VILLAGE_PROJECTS as VillageProject[];
  });
  const [editingProject, setEditingProject] = useState<VillageProject | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Road & Transport' as VillageProject['category'],
    sanctionedAmount: '',
    fundSource: '१५ वा वित्त आयोग',
    executingAgency: 'ग्रामपंचायत आसगाव',
    progressPercent: 50,
    status: 'IN_PROGRESS' as VillageProject['status'],
    targetDate: ''
  });

  // 6. Complaints
  const [complaints, setComplaints] = useState<any[]>([]);
  const [complaintFilter, setComplaintFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState('IN_PROGRESS');
  const [resolutionNote, setResolutionNote] = useState('');
  const [updatingComplaint, setUpdatingComplaint] = useState(false);

  // 7. Push Broadcast Alert
  const [broadcastTitle, setBroadcastTitle] = useState('🚨 आसगाव तातडीची सूचना: उद्या पाणी पुरवठा वेळ बदल');
  const [broadcastBody, setBroadcastBody] = useState('मुख्य पाईपलाईन दुरुस्ती कामामुळे उद्या सकाळी पाणी पुरवठा ७:०० ऐवजी ८:३० वाजता होईल. गावकऱ्यांनी नोंद घ्यावी.');
  const [broadcastCategory, setBroadcastCategory] = useState('पाणी पुरवठा');
  const [pushSending, setPushSending] = useState(false);
  const [pushFeedback, setPushFeedback] = useState<string | null>(null);

  // 8. Users
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');

  // Login form state
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ROLE_SUPER_ADMIN';
  const isAdmin = isSuperAdmin || currentUser.role === 'ADMIN' || currentUser.role === 'ROLE_ADMIN';

  // Resolved list of modules permitted for this user
  const allowedModules = getAllowedModulesForUser(currentUser.phone, currentUser.role);

  const isTabAllowed = (tabId: string) => {
    if (tabId === 'admin_management') return isSuperAdmin;
    if (isSuperAdmin) return true;
    return allowedModules.includes(tabId as AdminModuleId);
  };

  // Auto-redirect if non-super admin lands on unauthorized tab
  useEffect(() => {
    if (!isTabAllowed(activeTab)) {
      const fallbackTab = (allowedModules[0] || 'overview') as any;
      setActiveTab(fallbackTab);
    }
  }, [currentUser.phone, currentUser.role, activeTab]);

  // Load all data
  const loadData = () => {
    api.getAdminStats()
      .then((res) => { if (res) setStats(res); })
      .catch((e) => console.log('Admin stats fetch notice:', e.message));

    api.getAllComplaints()
      .then((res) => { if (res) setComplaints(res); })
      .catch((e) => console.log('Admin complaints fetch notice:', e.message));

    setLoadingAnnouncements(true);
    api.getAnnouncements()
      .then((res) => {
        if (res && res.length > 0) setAnnouncements(res);
      })
      .catch((e) => console.log('Announcements fetch notice:', e.message))
      .finally(() => setLoadingAnnouncements(false));

    api.getSchemes()
      .then((res) => {
        if (res && res.length > 0) {
          setSchemes(res);
          localStorage.setItem('dg_schemes_cache', JSON.stringify(res));
        }
      })
      .catch((e) => console.log('Schemes fetch notice:', e.message));

    api.getAdminUsers()
      .then((res) => { if (res) setUsers(res); })
      .catch((e) => console.log('Admin users fetch notice:', e.message));

    setLoadingEvents(true);
    api.getEvents()
      .then((res) => {
        if (res && Array.isArray(res) && res.length > 0) {
          setEvents(res);
          localStorage.setItem('dg_village_events_cache', JSON.stringify(res));
        }
      })
      .catch((e) => console.log('Admin events fetch notice:', e.message))
      .finally(() => setLoadingEvents(false));

    api.getBlogs()
      .then((res) => {
        if (res && res.length > 0) {
          const mapped: BlogPost[] = res.map((b: any) => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            titleMarathi: b.titleMarathi || b.title_marathi || b.title,
            excerpt: b.excerpt || '',
            excerptMarathi: b.excerptMarathi || b.excerpt_marathi || b.excerpt || '',
            content: b.content || '',
            contentMarathi: b.contentMarathi || b.content_marathi || b.content || '',
            category: b.category || 'General',
            categoryMarathi: b.categoryMarathi || b.category_marathi || 'सामान्य / इतर',
            author: b.author || 'आसगाव ग्रामस्थ',
            authorRole: b.authorRole || b.author_role || 'Contributor',
            authorRoleMarathi: b.authorRoleMarathi || b.author_role_marathi || 'स्थानिक नागरिक',
            publishDate: b.publishDate || b.publish_date || 'ऑक्टोबर २०२६',
            publishDateISO: b.publishDateISO || b.publish_date_iso || new Date().toISOString(),
            readTimeMinutes: b.readTimeMinutes || b.read_time_minutes || 3,
            coverImage: b.coverImage || b.cover_image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
            tags: typeof b.tags === 'string' ? b.tags.split(',').map((t: string) => t.trim()) : (b.tags || []),
            tagsMarathi: typeof b.tagsMarathi === 'string' ? b.tagsMarathi.split(',').map((t: string) => t.trim()) : (b.tagsMarathi || []),
            seoTitle: b.seoTitle || b.seo_title || b.title,
            seoDescription: b.seoDescription || b.seo_description || b.excerpt,
            seoKeywords: b.seoKeywords || b.seo_keywords || '',
            isFeatured: b.isFeatured ?? b.is_featured,
            viewCount: b.viewCount ?? b.view_count ?? 1,
            likesCount: b.likesCount ?? b.likes_count ?? 0,
            commentsCount: b.commentsCount ?? b.comments_count ?? 0
          }));
          setVillageBlogs(mapped);
          localStorage.setItem('dg_village_blogs', JSON.stringify(mapped));
        }
      })
      .catch((e) => console.log('Admin blogs fetch notice:', e.message));

    setLoadingBusinesses(true);
    api.getBusinesses()
      .then((res) => {
        if (res && Array.isArray(res) && res.length > 0) {
          setAdminBusinesses(res);
          localStorage.setItem('dg_asgaon_businesses_cache', JSON.stringify(res));
        }
      })
      .catch((e) => console.log('Admin businesses fetch notice:', e.message))
      .finally(() => setLoadingBusinesses(false));
  };

  // --- BUSINESS VERIFICATION HANDLERS ---
  const handleToggleBusinessVerify = async (biz: any) => {
    const newStatus = !biz.isVerified;
    const badge = biz.verificationBadge || 'Verified Merchant';
    try {
      if (biz.id && !String(biz.id).startsWith('b-')) {
        await api.adminVerifyBusiness(biz.id, newStatus, badge);
      }
      const updated = adminBusinesses.map((b) =>
        b.id === biz.id ? { ...b, isVerified: newStatus, verificationBadge: badge } : b
      );
      setAdminBusinesses(updated);
      localStorage.setItem('dg_asgaon_businesses_cache', JSON.stringify(updated));
      setBizFeedbackMsg(`दुकान "${biz.name}" ची पडताळणी ${newStatus ? 'यशस्वीरीत्या मंजूर केली!' : 'रद्द केली.'}`);
      setTimeout(() => setBizFeedbackMsg(null), 4000);
    } catch (err: any) {
      alert('पडताळणी बदलण्यात अडचण आली: ' + err.message);
    }
  };

  const handleUpdateBusinessBadge = async (biz: any, newBadge: string) => {
    try {
      if (biz.id && !String(biz.id).startsWith('b-')) {
        await api.adminVerifyBusiness(biz.id, true, newBadge);
      }
      const updated = adminBusinesses.map((b) =>
        b.id === biz.id ? { ...b, isVerified: true, verificationBadge: newBadge } : b
      );
      setAdminBusinesses(updated);
      localStorage.setItem('dg_asgaon_businesses_cache', JSON.stringify(updated));
      setSelectedBizForBadge(null);
      setBizFeedbackMsg(`"${biz.name}" साठी अधिकृत बॅज "${newBadge}" लागू केला!`);
      setTimeout(() => setBizFeedbackMsg(null), 4000);
    } catch (err: any) {
      alert('बॅज बदलताना अडचण आली: ' + err.message);
    }
  };

  const handleDeleteBusiness = async (biz: any) => {
    if (!window.confirm(`तुम्हाला खात्री आहे की "${biz.name}" हे दुकान पोर्टलवरून हटवायचे आहे?`)) return;
    try {
      if (biz.id && !String(biz.id).startsWith('b-')) {
        await api.adminDeleteBusiness(biz.id);
      }
      const updated = adminBusinesses.filter((b) => b.id !== biz.id);
      setAdminBusinesses(updated);
      localStorage.setItem('dg_asgaon_businesses_cache', JSON.stringify(updated));
      setBizFeedbackMsg(`दुकान "${biz.name}" पोर्टलवरून यशस्वीरीत्या काढण्यात आले.`);
      setTimeout(() => setBizFeedbackMsg(null), 4000);
    } catch (err: any) {
      alert('दुकान काढताना अडचण आली: ' + err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Save helpers for local storage
  const saveWaterSchedule = (items: WaterScheduleItem[]) => {
    setWaterSchedules(items);
    localStorage.setItem('dg_water_schedule', JSON.stringify(items));
  };

  const saveContacts = (items: VillageContact[]) => {
    setContacts(items);
    localStorage.setItem('dg_village_contacts', JSON.stringify(items));
  };

  const saveProjects = (items: VillageProject[]) => {
    setProjects(items);
    localStorage.setItem('dg_village_projects', JSON.stringify(items));
  };


  // Standard Admin Login
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = adminPhone.trim();
    const pass = adminPassword.trim();

    if (!phone || !pass) {
      setLoginError('कृपया अधिकृत मोबाईल नंबर व पासवर्ड दोन्ही प्रविष्ट करा.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await api.login(phone, pass);
      if (res && res.token) {
        const rawRole = (res.roles && res.roles.length > 0)
          ? res.roles[0].replace('ROLE_', '')
          : (res.role ? res.role.replace('ROLE_', '') : 'USER');

        if (rawRole !== 'ADMIN' && rawRole !== 'SUPER_ADMIN') {
          throw new Error('या खात्याकडे प्रशासक अधिकार नाहीत. कृपया अधिकृत ग्रामपंचायत अॅडमिन खात्याने प्रवेश करा. (Access Denied: Admin Privileges Required)');
        }

        localStorage.setItem('dg_auth_token', res.token);
        localStorage.setItem('dg_user', JSON.stringify({ ...res, role: rawRole }));
        onLoginAsAdmin?.(rawRole, res.phone || phone, res.fullName || 'Asgaon Admin');
        setActiveTab('overview');
        return;
      }
      throw new Error('अवैध माहिती (लॉगिन अयशस्वी)');
    } catch (err: any) {
      setLoginError(err.message || 'प्रवेश अयशस्वी: कृपया योग्य मोबाईल नंबर व पासवर्ड तपासा.');
    } finally {
      setLoginLoading(false);
    }
  };

  // --- NOTICE ACTIONS ---
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) return;
    setNoticeStatusFeedback('जतन होत आहे...');
    try {
      if (editingAnnouncement) {
        await api.updateAnnouncement(editingAnnouncement.id, {
          title: noticeTitle.trim(),
          category: noticeCategory,
          priority: noticePriority,
          message: noticeMessage.trim(),
          authorName: noticeAuthor.trim()
        });
        setNoticeStatusFeedback('सूचना यशस्वीरीत्या अद्ययावत केली!');
      } else {
        await api.createAnnouncement({
          title: noticeTitle.trim(),
          category: noticeCategory,
          priority: noticePriority,
          message: noticeMessage.trim(),
          authorName: noticeAuthor.trim()
        });
        setNoticeStatusFeedback('नवीन सूचना फलकावर प्रसिद्ध झाली!');
      }
      setNoticeTitle('');
      setNoticeMessage('');
      setEditingAnnouncement(null);
      loadData();
      setTimeout(() => setNoticeStatusFeedback(''), 4000);
    } catch (err: any) {
      alert('Error saving notice: ' + err.message);
      setNoticeStatusFeedback('');
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!window.confirm('ही सूचना हटवायची आहे का?')) return;
    try {
      await api.deleteAnnouncement(id);
      loadData();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleStartEditNotice = (a: any) => {
    setEditingAnnouncement(a);
    setNoticeTitle(a.title || '');
    setNoticeCategory(a.category || 'ग्रामपंचायत');
    setNoticePriority(a.priority || 'NORMAL');
    setNoticeMessage(a.message || '');
    setNoticeAuthor(a.authorName || 'ग्रामसेवक कार्यालय');
    setActiveTab('notices');
  };

  // --- SCHEME ACTIONS ---
  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeForm.title.trim()) return;
    const docs = schemeForm.documentsRequired.split(',').map((s) => s.trim()).filter(Boolean);
    const payload: any = {
      title: schemeForm.title.trim(),
      category: schemeForm.category,
      description: schemeForm.description.trim(),
      benefits: schemeForm.benefits.trim(),
      eligibility: schemeForm.eligibility.trim(),
      documentsRequired: docs,
      officialUrl: schemeForm.officialUrl.trim(),
      actionLabel: schemeForm.actionLabel.trim()
    };

    try {
      if (editingScheme) {
        await api.updateScheme(editingScheme.id, payload).catch(() => null);
        const updated = schemes.map((s) => s.id === editingScheme.id ? { ...s, ...payload } : s);
        setSchemes(updated);
        localStorage.setItem('dg_schemes_cache', JSON.stringify(updated));
      } else {
        const res = await api.createScheme(payload).catch(() => null);
        const newObj: Scheme = res || {
          id: 's-' + Date.now(),
          slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          ...payload
        };
        const updated = [newObj, ...schemes];
        setSchemes(updated);
        localStorage.setItem('dg_schemes_cache', JSON.stringify(updated));
      }
      setEditingScheme(null);
      setSchemeForm({
        title: '',
        category: 'Farmer',
        description: '',
        benefits: '',
        eligibility: '',
        documentsRequired: '७/१२ उतारा, ८-अ, आधार कार्ड, बँक पासबुक',
        officialUrl: 'https://mahadbt.maharashtra.gov.in',
        actionLabel: 'अर्ज करा / माहिती'
      });
      alert('योजना यशस्वीरीत्या जतन झाली!');
    } catch (err: any) {
      alert('Error saving scheme: ' + err.message);
    }
  };

  const handleDeleteScheme = async (id: string) => {
    if (!window.confirm('ही योजना पोर्टलवरून काढायची आहे का?')) return;
    await api.deleteScheme(id).catch(() => null);
    const filtered = schemes.filter((s) => s.id !== id);
    setSchemes(filtered);
    localStorage.setItem('dg_schemes_cache', JSON.stringify(filtered));
  };

  // --- EVENT ACTIONS ---
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.eventDate.trim()) {
      alert('कृपया कार्यक्रमाचे नाव आणि तारीख भरा');
      return;
    }
    setSavingEvent(true);
    try {
      if (editingEvent) {
        const updated = await api.updateEvent(editingEvent.id, eventForm).catch(() => null);
        const newEvents = events.map((ev) => ev.id === editingEvent.id ? (updated || { ...ev, ...eventForm }) : ev);
        setEvents(newEvents);
        localStorage.setItem('dg_village_events_cache', JSON.stringify(newEvents));
        alert('कार्यक्रम यशस्वीरीत्या अद्ययावत केला!');
      } else {
        const created = await api.createEvent(eventForm).catch(() => null);
        const newEventObj = created || { id: 'evt-' + Date.now(), ...eventForm };
        const newEvents = [newEventObj, ...events];
        setEvents(newEvents);
        localStorage.setItem('dg_village_events_cache', JSON.stringify(newEvents));
        alert('नवीन कार्यक्रम यशस्वीरीत्या जोडला!');
      }
      setEditingEvent(null);
      setEventForm({
        title: '',
        category: 'religious',
        eventDate: '',
        eventTime: '10:00 AM — 05:00 PM',
        location: 'खंडोबा मंदिर प्रांगण, आसगाव',
        organizer: 'ग्रामपंचायत आसगाव',
        badge: 'गावातील कार्यक्रम',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
      });
    } catch (err: any) {
      alert('Error saving event: ' + err.message);
    } finally {
      setSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('हा कार्यक्रम पोर्टलवरून काढायचा आहे का?')) return;
    await api.deleteEvent(id).catch(() => null);
    const filtered = events.filter((ev) => ev.id !== id);
    setEvents(filtered);
    localStorage.setItem('dg_village_events_cache', JSON.stringify(filtered));
    alert('कार्यक्रम यशस्वीरीत्या हटवला!');
  };

  // --- SHIKSHA / EDUCATION ACTIONS ---
  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolForm.name.trim()) {
      alert('शाळेचे नाव आवश्यक आहे');
      return;
    }
    const tags = schoolForm.tagsString.split(',').map(t => t.trim()).filter(Boolean);
    const payload: SchoolItem = {
      id: editingSchool ? editingSchool.id : 'sch-' + Date.now(),
      name: schoolForm.name.trim(),
      badge: schoolForm.badge || 'Govt Approved',
      category: schoolForm.category || 'High School & Jr College',
      grades: schoolForm.grades || '1st – 12th',
      medium: schoolForm.medium || 'मराठी माध्यम',
      description: schoolForm.description || '',
      tags: tags.length > 0 ? tags : ['शासनमान्य'],
      principalName: schoolForm.principalName || '',
      contactPhone: schoolForm.contactPhone || '',
      address: schoolForm.address || 'आसगाव',
      imageUrl: schoolForm.imageUrl || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    };

    let updated: SchoolItem[];
    if (editingSchool) {
      updated = shikshaSchools.map(s => s.id === editingSchool.id ? payload : s);
      alert('शाळेची माहिती अद्ययावत केली!');
    } else {
      updated = [payload, ...shikshaSchools];
      alert('नवीन शाळा यशस्वीरीत्या जोडली!');
    }
    setShikshaSchools(updated);
    localStorage.setItem('dg_shiksha_schools', JSON.stringify(updated));
    setEditingSchool(null);
    setSchoolForm({
      name: '',
      badge: 'Govt Approved',
      category: 'High School & Jr College',
      grades: '1st – 12th',
      medium: 'मराठी व सेमी-इंग्रजी',
      description: '',
      tagsString: 'शासन मान्यताप्राप्त, मोफत सायकल योजना, मध्यान्ह भोजन',
      principalName: '',
      contactPhone: '',
      address: 'आसगाव',
      imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    });
  };

  const handleDeleteSchool = (id: string) => {
    if (!window.confirm('ही शाळा पोर्टलवरून काढायची आहे का?')) return;
    const filtered = shikshaSchools.filter(s => s.id !== id);
    setShikshaSchools(filtered);
    localStorage.setItem('dg_shiksha_schools', JSON.stringify(filtered));
    alert('शाळा हटवली गेली!');
  };

  const handleSaveScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarshipForm.title.trim()) {
      alert('शिष्यवृत्तीचे नाव आवश्यक आहे');
      return;
    }
    const payload: ScholarshipItem = {
      id: editingScholarship ? editingScholarship.id : 'sch-opt-' + Date.now(),
      title: scholarshipForm.title.trim(),
      badge: scholarshipForm.badge || 'Govt Scholarship',
      deadline: scholarshipForm.deadline || 'चालू योजना',
      description: scholarshipForm.description || '',
      benefit: scholarshipForm.benefit || '',
      incomeLimit: scholarshipForm.incomeLimit || '',
      department: scholarshipForm.department || '',
      officialUrl: scholarshipForm.officialUrl || 'https://mahadbt.maharashtra.gov.in',
      eligibility: scholarshipForm.eligibility || '',
    };

    let updated: ScholarshipItem[];
    if (editingScholarship) {
      updated = shikshaScholarships.map(s => s.id === editingScholarship.id ? payload : s);
      alert('शिष्यवृत्ती माहिती अद्ययावत केली!');
    } else {
      updated = [payload, ...shikshaScholarships];
      alert('नवीन शिष्यवृत्ती जोडली!');
    }
    setShikshaScholarships(updated);
    localStorage.setItem('dg_shiksha_scholarships', JSON.stringify(updated));
    setEditingScholarship(null);
    setScholarshipForm({
      title: '',
      badge: 'POST-MATRIC (11th & Higher)',
      deadline: '15 Nov 2026',
      description: '',
      benefit: '100% फी सवलत + मासिक निर्वाह भत्ता',
      incomeLimit: '≤ ₹2,50,000 / वर्ष',
      department: 'सामाजिक न्याय व विशेष सहाय्य विभाग',
      officialUrl: 'https://mahadbt.maharashtra.gov.in',
      eligibility: 'आधार संलग्न बँक खाते, जात प्रमाणपत्र, उत्पन्न दाखला',
    });
  };

  const handleDeleteScholarship = (id: string) => {
    if (!window.confirm('ही शिष्यवृत्ती काढायची आहे का?')) return;
    const filtered = shikshaScholarships.filter(s => s.id !== id);
    setShikshaScholarships(filtered);
    localStorage.setItem('dg_shiksha_scholarships', JSON.stringify(filtered));
    alert('शिष्यवृत्ती हटवली गेली!');
  };

  const handleSaveAbhyasikaConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('dg_shiksha_abhyasika', JSON.stringify(shikshaAbhyasika));
    alert('अभ्यासिका संरचना यशस्वीरीत्या जतन केली!');
  };

  const handleSaveTutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorForm.name.trim()) return;
    const payload: TutorCenterItem = {
      id: editingTutor ? editingTutor.id : 'tut-' + Date.now(),
      name: tutorForm.name.trim(),
      category: tutorForm.category || 'खाजगी शिकवणी',
      subjects: tutorForm.subjects || '',
      timing: tutorForm.timing || '',
      phone: tutorForm.phone || '',
      address: tutorForm.address || 'आसगाव',
      feesInfo: tutorForm.feesInfo || '',
    };

    let updated: TutorCenterItem[];
    if (editingTutor) {
      updated = shikshaTutors.map(t => t.id === editingTutor.id ? payload : t);
      alert('शिकवणी वर्ग माहिती अद्ययावत केली!');
    } else {
      updated = [payload, ...shikshaTutors];
      alert('नवीन शिकवणी वर्ग जोडला!');
    }
    setShikshaTutors(updated);
    localStorage.setItem('dg_shiksha_tutors', JSON.stringify(updated));
    setEditingTutor(null);
    setTutorForm({
      name: '',
      category: 'इ. ५ वी ते १० वी शिकवणी',
      subjects: 'गणित, विज्ञान, इंग्रजी',
      timing: 'सकाळी ०६:३० ते ०८:३०',
      phone: '',
      address: 'आसगाव',
      feesInfo: '₹400 / महिना',
    });
  };

  const handleDeleteTutor = (id: string) => {
    if (!window.confirm('हा वर्ग काढायचा आहे का?')) return;
    const filtered = shikshaTutors.filter(t => t.id !== id);
    setShikshaTutors(filtered);
    localStorage.setItem('dg_shiksha_tutors', JSON.stringify(filtered));
    alert('शिकवणी वर्ग हटवला!');
  };

  const handleSaveShikshaNotice = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('dg_shiksha_notice', JSON.stringify(shikshaNotice));
    alert('शिक्षण नोटीस पट्टी अद्ययावत झाली!');
  };

  const handleClearDeskRequest = (id: string) => {
    const updated = deskRequests.filter(r => r.id !== id);
    setDeskRequests(updated);
    localStorage.setItem('dg_shiksha_desk_requests', JSON.stringify(updated));
  };

  // --- CONTACT ACTIONS ---
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.phone.trim()) return;
    if (editingContact) {
      const updated = contacts.map((c) => c.id === editingContact.id ? { ...c, ...contactForm } : c);
      saveContacts(updated);
    } else {
      const newContact: VillageContact = {
        id: 'vc-' + Date.now(),
        ...contactForm
      };
      saveContacts([...contacts, newContact]);
    }
    setEditingContact(null);
    setContactForm({
      name: '',
      designation: '',
      phone: '',
      category: 'Administration',
      officeHours: '',
      address: 'आसगाव'
    });
    alert('संपर्क यशस्वीरीत्या जतन केला!');
  };

  // --- PROJECT ACTIONS ---
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;
    if (editingProject) {
      const updated = projects.map((p) => p.id === editingProject.id ? { ...p, ...projectForm } : p);
      saveProjects(updated);
    } else {
      const newP: VillageProject = {
        id: 'vp-' + Date.now(),
        ...projectForm
      };
      saveProjects([...projects, newP]);
    }
    setEditingProject(null);
    setProjectForm({
      title: '',
      category: 'Road & Transport',
      sanctionedAmount: '',
      fundSource: '१५ वा वित्त आयोग',
      executingAgency: 'ग्रामपंचायत आसगाव',
      progressPercent: 50,
      status: 'IN_PROGRESS',
      targetDate: ''
    });
    alert('विकासकाम यशस्वीरीत्या जतन केले!');
  };

  // --- WATER SCHEDULE ACTION ---
  const handleSaveWaterWard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWaterWard) return;
    const updated = waterSchedules.map((w) => w.id === editingWaterWard.id ? editingWaterWard : w);
    saveWaterSchedule(updated);
    setEditingWaterWard(null);
    alert('पाणी पुरवठा वेळापत्रक अद्ययावत केले!');
  };

  // --- BROADCAST PUSH ---
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) return;
    setPushSending(true);
    setPushFeedback(null);
    try {
      const res = await sendTestPushNotification(broadcastTitle.trim(), broadcastBody.trim(), '/announcements');
      setPushFeedback(res.message || 'सर्व गावकऱ्यांच्या मोबाईलवर तात्काळ सूचना पाठवली गेली!');
    } catch (err: any) {
      setPushFeedback('Broadcast notice: ' + (err.message || 'Notification triggered.'));
    } finally {
      setPushSending(false);
    }
  };

  // --- COMPLAINT STATUS ---
  const handleUpdateComplaintStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setUpdatingComplaint(true);
    try {
      await api.updateComplaintStatus(selectedComplaint.id, resolutionStatus, resolutionNote);
      setSelectedComplaint(null);
      setResolutionNote('');
      loadData();
      alert('तक्रार स्थिती अद्ययावत केली!');
    } catch (err: any) {
      alert('Error updating complaint: ' + err.message);
    } finally {
      setUpdatingComplaint(false);
    }
  };

  // Unauthenticated / Non-Admin Production-Ready Administrative Login Screen
  if (!isAdmin) {
    return (
      <div className="w-full min-h-[82vh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#f9f3ea]/60 via-[#fef9ee] to-[#f3ede4]/40">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#e8e2d9] overflow-hidden flex flex-col">
          {/* Top Government / Official Header Strip */}
          <div className="bg-gradient-to-r from-[#166534] via-[#14532d] to-[#052e16] text-white p-6 sm:p-7 relative overflow-hidden">
            {/* Background Decorative Pattern */}
            <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute right-12 -top-10 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#a7f3d0] block">
                    आसगाव ग्राम माहिती मंच • स्वतंत्र नागरिक उपक्रम
                  </span>
                  <h1 className="font-heading font-extrabold text-[20px] sm:text-[23px] text-white leading-tight">
                    आसगाव ग्राम माहिती मंच
                  </h1>
                  <p className="text-[12px] text-[#a7f3d0] font-medium">
                    माहिती व्यवस्थापन व संपादन कक्ष
                  </p>
                </div>
              </div>
            </div>

            {/* Security Pill */}
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/80">
              <span className="flex items-center gap-1.5 font-medium">
                <LucideIcon name="lock" className="text-[15px] text-[#a7f3d0]" />
                <span>सुरक्षित प्रवेश</span>
              </span>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8 flex flex-col gap-5">
            <div>
              <h2 className="font-heading font-extrabold text-[19px] sm:text-[21px] text-[#166534]">
                प्रशासक लॉगिन
              </h2>
              <p className="text-[12px] text-[#55605a] mt-0.5 leading-relaxed">
                आसगाव ग्राम माहिती मंच व्यवस्थापकांसाठी सुरक्षित प्रवेश.
              </p>
            </div>

            {/* Error Notification */}
            {loginError && (
              <div className="p-3.5 rounded-xl bg-[#fef3c7]/80 border border-[#fde68a] text-[#ba1a1a] flex items-start gap-2.5 text-[12px] font-medium animate-fadeIn">
                <LucideIcon name="error" className="text-[18px] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong>प्रवेश अयशस्वी: </strong>
                  <span>{loginError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLoginError('')}
                  className="text-[#ba1a1a] hover:opacity-70 text-[14px]"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleAdminLoginSubmit} className="flex flex-col gap-4">
              {/* Phone / Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#166534] flex items-center justify-between">
                  <span>मोबाईल क्र. / युझरनेम </span>
                  <span className="text-[10px] text-[#707974] font-normal">आवश्यक</span>
                </label>
                <div className="relative">
                  <LucideIcon name="phone_android" className=" absolute left-3 top-3 text-[19px] text-[#707974]" />
                  <input
                    type="text"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="आपला मोबाईल नंबर प्रविष्ट करा"
                    autoComplete="username"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f9f3ea]/50 border border-[#c4d6cf] text-[#166534] text-[13px] font-medium placeholder:text-[#88938d] focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#166534] flex items-center justify-between">
                  <span>पासवर्ड </span>
                  <span className="text-[10px] text-[#707974] font-normal">आवश्यक</span>
                </label>
                <div className="relative">
                  <LucideIcon name="lock" className=" absolute left-3 top-3 text-[19px] text-[#707974]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="पासवर्ड प्रविष्ट करा"
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#f9f3ea]/50 border border-[#c4d6cf] text-[#166534] text-[13px] font-medium placeholder:text-[#88938d] focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-[#707974] hover:text-[#166534] transition-colors"
                    title={showPassword ? 'पासवर्ड लपवा' : 'पासवर्ड दाखवा'}
                  >
                    <LucideIcon name={showPassword ? 'visibility_off' : 'visibility'} className=" text-[19px]" />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#166534] to-[#14532d] hover:from-[#052e16] hover:to-[#166534] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loginLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>पडताळणी चालू आहे...</span>
                  </>
                ) : (
                  <>
                    <LucideIcon name="lock_open" className="text-[19px]" />
                    <span>लॉगिन करा</span>
                  </>
                )}
              </button>
            </form>

            {/* Disclaimer & Info */}
            <div className="pt-4 border-t border-[#f3ede4] flex flex-col gap-2 text-[11px] text-[#707974]">
              <div className="flex items-start gap-1.5 leading-relaxed text-[#55605a]">
                <LucideIcon name="info" className="text-[15px] text-[#c2410c] shrink-0 mt-0.5" />
                <span>
                  <strong>टीप:</strong> हे व्यासपीठ आसगाव ग्रामस्थांसाठी चालवले जाणारे स्वतंत्र माहिती पोर्टल आहे. हा कक्ष केवळ अधिकृत पोर्टल व्यवस्थापकांसाठी आहे.
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#707974] pt-1">
                <span>आसगाव, ता. पवनी, जि. भंडारा (४४१९१०)</span>
                <span>व्यवस्थापक साहाय्य कक्ष</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: t('nav_home'), onClick: onExit },
          { label: t('nav_admin'), active: true }
        ]}
      />

      {/* Top Banner with responsive mobile and role badge */}
      <div className="bg-gradient-to-r from-[#166534] via-[#14532d] to-[#052e16] text-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#cadbcf]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-full">
            

            <h1 className="font-heading font-extrabold text-[19px] sm:text-[23px] text-white leading-tight">
              आसगाव ग्राम माहिती व डेटा व्यवस्थापन केंद्र
            </h1>
            <p className="text-[11px] sm:text-[12px] text-[#a7f3d0] font-medium mt-0.5">
              ग्रामपंचायतीतून मिळणारी खरी माहिती गावकऱ्यांपर्यंत पोहोचवणारा स्वतंत्र मंच
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
          {onExit && (
            <button
              onClick={onExit}
              className="flex-1 md:flex-initial px-3.5 py-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[12px] transition-all flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <LucideIcon name="visibility" className="text-[16px]" />
              <span>सार्वजनिक दृश्य</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex-1 md:flex-initial px-3.5 py-2.5 sm:py-2 rounded-xl bg-[#fef3c7]/20 hover:bg-[#fef3c7]/30 text-[#fde68a] font-bold text-[12px] transition-all flex items-center justify-center gap-1.5 border border-[#fde68a]/30 cursor-pointer"
            >
              <LucideIcon name="logout" className="text-[16px]" />
              <span>बाहेर पडा</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Select Tab Navigation (Quick 1-tap jump on phones) */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#707974] flex items-center gap-1">
            <LucideIcon name="tune" className="text-[15px] text-[#006a4e]" />
            <span>व्यवस्थापन विभाग निवडा:</span>
          </label>
          <span className="text-[10px] font-bold text-[#006a4e] bg-[#e8f1ec] px-2 py-0.5 rounded-full">
            {isSuperAdmin ? 'सर्व १६ मॉड्यूल्स' : `${allowedModules.length} मॉड्यूल्स अधिकार`}
          </span>
        </div>

        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="w-full p-3 pl-10 pr-9 bg-white border-2 border-[#166534] rounded-xl text-xs sm:text-sm font-bold text-[#166534] shadow-xs appearance-none cursor-pointer"
          >
            {[
              { id: 'overview', label: '📊 आढावा ' },
              ...(isSuperAdmin
                ? [{ id: 'admin_management', label: '🛡️ अॅडमिन अधिकार नियंत्रण ' }]
                : []),
              { id: 'businesses', label: `🏪 दुकाने व पडताळणी (${adminBusinesses.length})` },
              { id: 'reviews', label: `⭐ नागरिक अभिप्राय (${adminReviews.length})` },
              { id: 'banners', label: '🖼️ हिरो स्लायडर व बॅनर' },
              { id: 'gallery', label: '📸 छायाचित्र दालन (Gallery)' },
              { id: 'events', label: `🎪 कार्यक्रम व जत्रा (${events.length})` },
              { id: 'shiksha', label: `🏫 शिक्षण व शाळा (${shikshaSchools.length})` },
              { id: 'transport', label: `🚌 वाहतूक व बसेस (${transportBuses.length})` },
              { id: 'blogs', label: `📰 ब्लॉग व लेख (${villageBlogs.length})` },
              { id: 'notices', label: `📢 सूचना फलक (${announcements.length})` },
              { id: 'water', label: '💧 पाणी पुरवठा' },
              { id: 'schemes', label: `📋 योजना व्यवस्थापन (${schemes.length})` },
              { id: 'contacts', label: `📞 महत्त्वाचे संपर्क (${contacts.length})` },
              { id: 'projects', label: `🏗️ विकासकामे (${projects.length})` },
              { id: 'broadcast', label: '🚨 तातडीची दवंडी ' },
              { id: 'users', label: '👥 गावकऱ्यांची यादी' },
              { id: 'logs', label: '📜 ऑडिट नोंदी ' }
            ]
              .filter((t) => isTabAllowed(t.id))
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
          </select>
          <LucideIcon name="dashboard_customize" className=" absolute left-3 top-1/2 -translate-y-1/2 text-[#166534] text-[20px] pointer-events-none" />
          <LucideIcon name="expand_more" className=" absolute right-3 top-1/2 -translate-y-1/2 text-[#166534] text-[20px] pointer-events-none" />
        </div>
      </div>

      {/* Navigation Tabs (Scrollable pills on desktop & tablet) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-[#e8e2d9] no-scrollbar scroll-smooth -mx-2 px-2 sm:mx-0 sm:px-0">
        {[
          { id: 'overview', icon: 'analytics', label: 'आढावा ' },
          ...(isSuperAdmin
            ? [{
                id: 'admin_management',
                icon: 'admin_panel_settings',
                label: 'अॅडमिन अधिकार',
                isSuperTag: true
              }]
            : []),
          { id: 'businesses', icon: 'storefront', label: `दुकाने व पडताळणी (${adminBusinesses.length})` },
          { id: 'reviews', icon: 'rate_review', label: `नागरिक अभिप्राय (${adminReviews.length})` },
          { id: 'banners', icon: 'view_carousel', label: 'हिरो स्लायडर व बॅनर' },
          { id: 'gallery', icon: 'photo_library', label: 'छायाचित्र दालन' },
          { id: 'events', icon: 'event', label: `कार्यक्रम व जत्रा (${events.length})` },
          { id: 'shiksha', icon: 'school', label: `शिक्षण व शाळा (${shikshaSchools.length})` },
          { id: 'transport', icon: 'directions_bus', label: `वाहतूक व बसेस (${transportBuses.length})` },
          { id: 'blogs', icon: 'menu_book', label: `ब्लॉग व लेख (${villageBlogs.length})` },
          { id: 'notices', icon: 'campaign', label: `सूचना फलक (${announcements.length})` },
          { id: 'water', icon: 'water_drop', label: 'पाणी पुरवठा' },
          { id: 'schemes', icon: 'description', label: `योजना व्यवस्थापन (${schemes.length})` },
          { id: 'contacts', icon: 'contacts', label: `महत्त्वाचे संपर्क (${contacts.length})` },
          { id: 'projects', icon: 'construction', label: `विकासकामे (${projects.length})` },
          { id: 'broadcast', icon: 'cell_tower', label: 'तातडीची दवंडी ' },
          { id: 'users', icon: 'group', label: 'गावकऱ्यांची यादी' },
          { id: 'logs', icon: 'manage_history', label: 'ऑडिट नोंदी ' }
        ]
          .filter((t) => isTabAllowed(t.id))
          .map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-[13px] font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? t.isSuperTag
                    ? 'bg-gradient-to-r from-[#ef9f27] to-[#ba7200] text-white shadow-xs'
                    : 'bg-[#166534] text-[#a7f3d0] shadow-xs'
                  : t.isSuperTag
                    ? 'bg-[#fff8e1] text-[#7c4d00] hover:bg-[#ffecb3] border border-[#ffe082]'
                    : 'text-[#55605a] hover:bg-[#f3ede4]'
              }`}
            >
              <LucideIcon name={t.icon} className="text-[17px] sm:text-[18px]" />
              <span>{t.label}</span>
              {t.isSuperTag && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-black uppercase ml-0.5">
                  SUPER
                </span>
              )}
            </button>
          ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#707974] block mb-1">
                प्रसिद्ध सूचना
              </span>
              <span className="font-heading font-black text-[26px] text-[#166534]">
                {announcements.length}
              </span>
              <span className="text-[10px] text-[#006a4e] block mt-1 font-semibold">सक्रिय सूचना</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#707974] block mb-1">
                सरकारी योजना
              </span>
              <span className="font-heading font-black text-[26px] text-[#c2410c]">
                {schemes.length}
              </span>
              <span className="text-[10px] text-[#c2410c] block mt-1 font-semibold">शेतकरी व नागरिक</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#707974] block mb-1">
                विकासकामे
              </span>
              <span className="font-heading font-black text-[26px] text-[#002873]">
                {projects.length}
              </span>
              <span className="text-[10px] text-[#002873] block mt-1 font-semibold">निधी व प्रगती</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#707974] block mb-1">
                गावकऱ्यांच्या तक्रारी
              </span>
              <span className="font-heading font-black text-[26px] text-[#ba1a1a]">
                {complaints.length}
              </span>
              <span className="text-[10px] text-[#ba1a1a] block mt-1 font-semibold">निवारणासाठी अर्ज</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#707974] block mb-1">
                शाळा व संस्था
              </span>
              <span className="font-heading font-black text-[26px] text-[#006a4e]">
                {shikshaSchools.length}
              </span>
              <span className="text-[10px] text-[#006a4e] block mt-1 font-semibold">शिक्षण मंच</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#707974] block mb-1">
                नागरिक मतदार
              </span>
              <span className="font-heading font-black text-[26px] text-[#166534]">
                {stats.totalCitizens || 1420}
              </span>
              <span className="text-[10px] text-[#006a4e] block mt-1 font-semibold">गावातील लोकसंख्या</span>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-white rounded-2xl border border-[#e8e2d9] p-6 shadow-xs">
            <h2 className="font-heading font-bold text-[16px] text-[#166534] mb-4 flex items-center gap-2">
              <LucideIcon name="bolt" className="text-[20px] text-[#c2410c]" />
              <span>ग्रामपंचायत भेट दिल्यावर त्वरित करण्याचे काम</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setActiveTab('admin_management')}
                  className="p-4 rounded-xl bg-gradient-to-br from-[#166534] to-[#002117] text-white hover:shadow-md transition-all text-left group border border-[#ef9f27]/40 relative overflow-hidden"
                >
                  <LucideIcon name="admin_panel_settings" className=" text-[24px] text-[#ef9f27] mb-2 block" />
                  <strong className="block text-[13px] mb-1 flex items-center gap-1.5 text-white">
                    <span>अॅडमिन व पृष्ठ अधिकार</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#ef9f27] text-[#002117] text-[9px] font-black">SUPER</span>
                  </strong>
                  <p className="text-[11px] text-[#a7f3d0]">
                    इतर अॅडमिन्स जोडा व त्यांच्या पानांचे प्रवेश अधिकार नियंत्रित करा
                  </p>
                </button>
              )}

              {isTabAllowed('events') && (
                <button
                  type="button"
                  onClick={() => { setEditingEvent(null); setActiveTab('events'); }}
                  className="p-4 rounded-2xl bg-[#fffdfa] hover:bg-[#166534] hover:text-white transition-all text-left group border border-[#e7dec8] hover:border-[#166534] shadow-[0_2px_8px_rgba(20,40,30,0.03)] hover:shadow-[0_8px_20px_rgba(20,40,30,0.08)] hover:-translate-y-0.5"
                >
                  <LucideIcon name="event" className=" text-[24px] text-[#14532d] group-hover:text-[#a7f3d0] mb-2 block" />
                  <strong className="block text-[13px] mb-1">नवीन कार्यक्रम / जत्रा जोडा</strong>
                  <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                    यात्रा, महाप्रसाद, आरोग्य शिबीर किंवा क्रीडा स्पर्धा
                  </p>
                </button>
              )}

              {isTabAllowed('shiksha') && (
                <button
                  type="button"
                  onClick={() => { setEditingSchool(null); setActiveTab('shiksha'); }}
                  className="p-4 rounded-2xl bg-[#fffdfa] hover:bg-[#166534] hover:text-white transition-all text-left group border border-[#e7dec8] hover:border-[#166534] shadow-[0_2px_8px_rgba(20,40,30,0.03)] hover:shadow-[0_8px_20px_rgba(20,40,30,0.08)] hover:-translate-y-0.5"
                >
                  <LucideIcon name="school" className=" text-[24px] text-[#14532d] group-hover:text-[#a7f3d0] mb-2 block" />
                  <strong className="block text-[13px] mb-1">शाळा व शिक्षण व्यवस्थापन</strong>
                  <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                    शाळा, शिष्यवृत्ती, अभ्यासिका व शिकवणी वर्ग
                  </p>
                </button>
              )}

              {isTabAllowed('notices') && (
                <button
                  type="button"
                  onClick={() => { setEditingAnnouncement(null); setActiveTab('notices'); }}
                  className="p-4 rounded-2xl bg-[#fffdfa] hover:bg-[#166534] hover:text-white transition-all text-left group border border-[#e7dec8] hover:border-[#166534] shadow-[0_2px_8px_rgba(20,40,30,0.03)] hover:shadow-[0_8px_20px_rgba(20,40,30,0.08)] hover:-translate-y-0.5"
                >
                  <LucideIcon name="campaign" className=" text-[24px] text-[#14532d] group-hover:text-[#a7f3d0] mb-2 block" />
                  <strong className="block text-[13px] mb-1">नवीन नोटीस / ठराव टाका</strong>
                  <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                    ग्रामसभा बैठक, कर भरणा अथवा वीज भारनियमन सूचना
                  </p>
                </button>
              )}

              {isTabAllowed('water') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('water')}
                  className="p-4 rounded-2xl bg-[#fffdfa] hover:bg-[#166534] hover:text-white transition-all text-left group border border-[#e7dec8] hover:border-[#166534] shadow-[0_2px_8px_rgba(20,40,30,0.03)] hover:shadow-[0_8px_20px_rgba(20,40,30,0.08)] hover:-translate-y-0.5"
                >
                  <LucideIcon name="water_drop" className=" text-[24px] text-[#0369a1] group-hover:text-[#a7f3d0] mb-2 block" />
                  <strong className="block text-[13px] mb-1">पाणी पुरवठा वेळ बदला</strong>
                  <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                    वॉर्डनिहाय वेळ, टाकीतील पाणी साठा व दुरुस्ती स्थिती
                  </p>
                </button>
              )}

              {isTabAllowed('schemes') && (
                <button
                  type="button"
                  onClick={() => { setEditingScheme(null); setActiveTab('schemes'); }}
                  className="p-4 rounded-2xl bg-[#fffdfa] hover:bg-[#166534] hover:text-white transition-all text-left group border border-[#e7dec8] hover:border-[#166534] shadow-[0_2px_8px_rgba(20,40,30,0.03)] hover:shadow-[0_8px_20px_rgba(20,40,30,0.08)] hover:-translate-y-0.5"
                >
                  <LucideIcon name="description" className=" text-[24px] text-[#b45309] group-hover:text-[#a7f3d0] mb-2 block" />
                  <strong className="block text-[13px] mb-1">नवीन सरकारी योजना जोडा</strong>
                  <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                    कागदपत्रे यादी, अनुदान रक्कम व शेवटची तारीख
                  </p>
                </button>
              )}

              {isTabAllowed('broadcast') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('broadcast')}
                  className="p-4 rounded-2xl bg-[#fffdfa] hover:bg-[#166534] hover:text-white transition-all text-left group border border-[#e7dec8] hover:border-[#166534] shadow-[0_2px_8px_rgba(20,40,30,0.03)] hover:shadow-[0_8px_20px_rgba(20,40,30,0.08)] hover:-translate-y-0.5"
                >
                  <LucideIcon name="cell_tower" className=" text-[24px] text-[#b91c1c] group-hover:text-[#a7f3d0] mb-2 block" />
                  <strong className="block text-[13px] mb-1">तातडीची दवंडी </strong>
                  <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                    सर्व गावकऱ्यांच्या मोबाईलवर लगेच अलर्ट पाठवा
                  </p>
                </button>
              )}

              {isTabAllowed('businesses') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('businesses')}
                  className="p-4 rounded-2xl bg-[#fffdfa] hover:bg-[#166534] hover:text-white transition-all text-left group border border-[#e7dec8] hover:border-[#166534] shadow-[0_2px_8px_rgba(20,40,30,0.03)] hover:shadow-[0_8px_20px_rgba(20,40,30,0.08)] hover:-translate-y-0.5"
                >
                  <LucideIcon name="storefront" className=" text-[24px] text-[#115e59] group-hover:text-[#a7f3d0] mb-2 block" />
                  <strong className="block text-[13px] mb-1">स्थानिक दुकाने व पडताळणी</strong>
                  <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                    दुकानांची तपासणी, मंजुरी व पडताळणी बॅज व्यवस्थापन
                  </p>
                </button>
              )}

              {isTabAllowed('reviews') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="p-4 rounded-2xl bg-[#fffdfa] hover:bg-[#166534] hover:text-white transition-all text-left group border border-[#e7dec8] hover:border-[#166534] shadow-[0_2px_8px_rgba(20,40,30,0.03)] hover:shadow-[0_8px_20px_rgba(20,40,30,0.08)] hover:-translate-y-0.5"
                >
                  <LucideIcon name="rate_review" className=" text-[24px] text-[#b45309] group-hover:text-[#a7f3d0] mb-2 block" />
                  <strong className="block text-[13px] mb-1">नागरिक अभिप्राय व्यवस्थापन</strong>
                  <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                    स्थानिक दुकानांचे रेटिंग, परीक्षणे व अभिप्राय
                  </p>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: BUSINESSES DIRECTORY & VERIFICATION MODERATION */}
      {activeTab === 'businesses' && (
        <div className="flex flex-col gap-6">
          {/* Feedback Toast */}
          {bizFeedbackMsg && (
            <div className="bg-[#e8f1ec] text-[#14532d] border border-[#006a4e] text-[#002117] p-3.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-md transition-all animate-fade-in">
              <div className="flex items-center gap-2">
                <LucideIcon name="verified" className="text-[18px] text-[#006a4e]" />
                <span>{bizFeedbackMsg}</span>
              </div>
              <button onClick={() => setBizFeedbackMsg(null)} className="text-[#002117]/60 hover:text-[#002117]">
                ✕
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#e8e2d9] p-4 sm:p-6 shadow-xs">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#166534] text-[#a7f3d0] font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <LucideIcon name="verified_user" className="text-[13px]" />
                    ग्रामपंचायत पडताळणी केंद्र 
                  </span>
                  <span className="text-[11px] text-[#707974]">
                    एकूण दुकाने: {adminBusinesses.length}
                  </span>
                </div>
                <h2 className="font-heading font-extrabold text-[18px] sm:text-[22px] text-[#166534] flex items-center gap-2">
                  <LucideIcon name="storefront" className="text-[24px] text-[#006a4e]" />
                  <span>स्थानिक दुकाने व व्यवसाय पडताळणी </span>
                </h2>
                <p className="text-[12px] text-[#707974] mt-0.5">
                  गावकऱ्यांच्या सुरक्षिततेसाठी दुकानांची पडताळणी करा, अधिकृत ट्रस्ट बॅज द्या आणि अनधिकृत दुकाने नियंत्रित करा.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadData}
                  disabled={loadingBusinesses}
                  className="px-3.5 py-2 rounded-xl bg-[#f9f3ea] hover:bg-[#166534] hover:text-white text-[#166534] font-bold text-xs flex items-center gap-1.5 transition-all border border-[#e8e2d9] cursor-pointer"
                >
                  <LucideIcon name="refresh" className={` text-[16px] ${loadingBusinesses ? 'animate-spin' : ''}`} />
                  <span>ताजे करा </span>
                </button>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-[#fcfbf9] border border-[#e8e2d9]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#707974] block">एकूण दुकाने</span>
                <span className="font-heading font-black text-[22px] text-[#166534]">{adminBusinesses.length}</span>
                <span className="text-[10px] text-[#55605a] block">पोर्टलवर नोंदणीकृत</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#cadbcf]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] block">प्रमाणित दुकाने</span>
                <span className="font-heading font-black text-[22px] text-[#166534]">
                  {adminBusinesses.filter((b) => b.isVerified).length}
                </span>
                <span className="text-[10px] text-[#166534] block font-semibold">पडताळणी पूर्ण </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400e] block">पडताळणी प्रलंबित</span>
                <span className="font-heading font-black text-[22px] text-[#92400e]">
                  {adminBusinesses.filter((b) => !b.isVerified).length}
                </span>
                <span className="text-[10px] text-[#92400e] block font-semibold">तपासणी आवश्यक</span>
              </div>
            </div>

            {/* Search and Status Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9]">
              <div className="relative flex-1">
                <LucideIcon name="search" className=" absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-[18px]" />
                <input
                  type="text"
                  value={businessSearch}
                  onChange={(e) => setBusinessSearch(e.target.value)}
                  placeholder="दुकान, मालकाचे नाव, वर्गवारी किंवा फोन शोधा..."
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-lg text-xs text-[#1d1b16] border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'ALL', label: `सर्व (${adminBusinesses.length})` },
                  { id: 'VERIFIED', label: `प्रमाणित (${adminBusinesses.filter((b) => b.isVerified).length})` },
                  { id: 'PENDING', label: `प्रलंबित (${adminBusinesses.filter((b) => !b.isVerified).length})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setBusinessStatusFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      businessStatusFilter === f.id
                        ? 'bg-[#166534] text-white shadow-xs'
                        : 'bg-white text-[#55605a] hover:bg-[#f3ede4] border border-[#e8e2d9]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Businesses List */}
            {adminBusinesses.length === 0 ? (
              <div className="text-center py-12 text-[#707974]">
                <LucideIcon name="storefront" className=" text-[48px] text-[#ccc] mb-2 block" />
                <p className="font-bold text-[14px]">अद्याप कोणतीही दुकाने आढळली नाहीत</p>
                <p className="text-[12px] mt-1">पोर्टलवर दुकान नोंदणी झाल्यानंतर ती येथे व्यवस्थापनासाठी दिसतील.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminBusinesses
                  .filter((b) => {
                    const matchesStatus =
                      businessStatusFilter === 'ALL' ||
                      (businessStatusFilter === 'VERIFIED' && b.isVerified) ||
                      (businessStatusFilter === 'PENDING' && !b.isVerified);
                    const q = businessSearch.toLowerCase().trim();
                    const matchesSearch =
                      !q ||
                      (b.name && b.name.toLowerCase().includes(q)) ||
                      (b.phone && b.phone.includes(q)) ||
                      (b.address && b.address.toLowerCase().includes(q)) ||
                      (b.category && (typeof b.category === 'string' ? b.category.toLowerCase().includes(q) : b.category.name?.toLowerCase().includes(q)));
                    return matchesStatus && matchesSearch;
                  })
                  .map((biz) => {
                    const categoryName = typeof biz.category === 'string' ? biz.category : biz.category?.name || 'स्थानिक दुकान';
                    const isVerified = Boolean(biz.isVerified);
                    const badge = biz.verificationBadge || 'Verified Merchant';

                    return (
                      <div
                        key={biz.id}
                        className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between gap-3.5 transition-all ${
                          isVerified ? 'border-[#cadbcf] hover:border-[#006a4e]' : 'border-[#fde68a] bg-[#fffdfa]'
                        }`}
                      >
                        <div>
                          {/* Top Row: Image + Details + Status */}
                          <div className="flex items-start gap-3">
                            <img
                              src={biz.imageUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80'}
                              alt={biz.name}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#e8e2d9]"
                              onError={(e: any) => {
                                e.target.src = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1">
                                <h3 className="font-heading font-extrabold text-[14px] sm:text-[15px] text-[#1d1b16] truncate">
                                  {biz.name}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                                    isVerified
                                      ? 'bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]'
                                      : 'bg-[#fef3c7] text-[#92400e]'
                                  }`}
                                >
                                  {isVerified ? 'प्रमाणित' : 'प्रलंबित'}
                                </span>
                              </div>

                              <p className="text-[11px] text-[#006a4e] font-semibold flex items-center gap-1 mt-0.5">
                                <LucideIcon name="category" className="text-[13px]" />
                                <span>{categoryName}</span>
                              </p>

                              <p className="text-[11px] text-[#707974] flex items-center gap-1.5 mt-1 truncate">
                                <LucideIcon name="call" className="text-[13px] text-[#006a4e]" />
                                <a href={`tel:${biz.phone}`} className="hover:underline text-[#166534] font-mono font-bold">
                                  {biz.phone || '-'}
                                </a>
                                {biz.address && <span>• {biz.address}</span>}
                              </p>
                            </div>
                          </div>

                          {/* Verification Badge Display */}
                          <div className="mt-3 p-2.5 rounded-xl bg-[#fcfbf9] border border-[#f0eee8] flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <LucideIcon name={isVerified ? 'verified' : 'pending_actions'} className={` text-[16px] ${isVerified ? 'text-[#006a4e]' : 'text-[#c2410c]'}`} />
                              <span className="font-bold text-[#166534]">
                                {isVerified ? badge : 'पडताळणी प्रलंबित '}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#707974]">
                              रेटिंग: ⭐ {biz.rating || 5.0} ({biz.ratingCount || 1})
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-[#f0eee8] flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Toggle Verification Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleBusinessVerify(biz)}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-98 ${
                                isVerified
                                  ? 'bg-[#fef9ee] hover:bg-[#fef3c7] text-[#ba1a1a] border border-[#fef3c7]'
                                  : 'bg-[#166534] hover:bg-[#052e16] text-white'
                              }`}
                            >
                              <LucideIcon name={isVerified ? 'cancel' : 'check_circle'} className=" text-[14px]" />
                              <span>{isVerified ? 'पडताळणी रद्द करा' : 'पडताळणी मंजूर करा'}</span>
                            </button>

                            {/* Change Badge Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBizForBadge(biz);
                                setBadgeToAssign(biz.verificationBadge || 'Verified Merchant');
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-[#f5ede3] hover:bg-[#e8ded3] text-[#166534] text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <LucideIcon name="military_tech" className="text-[14px]" />
                              <span>बॅज बदला</span>
                            </button>
                          </div>

                          {/* Delete Shop Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteBusiness(biz)}
                            title="दुकान हटवा"
                            className="p-1.5 rounded-xl text-[#ba1a1a] hover:bg-[#fef3c7]/40 transition-all cursor-pointer"
                          >
                            <LucideIcon name="delete" className="text-[17px]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* BADGE MODAL */}
          {selectedBizForBadge && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#e8e2d9] flex flex-col gap-4">
                <div className="flex items-start justify-between border-b border-[#f0eee8] pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-[10px] font-black uppercase">
                      ट्रस्ट बॅज व्यवस्थापन 
                    </span>
                    <h3 className="font-heading font-black text-[16px] text-[#166534] mt-1">
                      {selectedBizForBadge.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBizForBadge(null)}
                    className="w-7 h-7 rounded-full bg-[#f3ede4] hover:bg-[#e8ded3] flex items-center justify-center text-[#55605a] font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-bold text-[#166534]">
                    अधिकृत पडताळणी बॅज निवडा:
                  </label>

                  {[
                    { id: 'Verified Merchant', label: 'Verified Merchant (प्रमाणित स्थानिक व्यापारी)' },
                    { id: 'Gram Panchayat Approved', label: 'Gram Panchayat Approved (ग्रामपंचायत मान्यताप्राप्त)' },
                    { id: 'Authentic Agri Partner', label: 'Authentic Agri Partner (खात्रीशीर कृषी केंद्र)' },
                    { id: 'Govt Ration Authorized', label: 'Govt Ration Authorized (शासकीय रास्त भाव धान्य)' },
                    { id: 'Essential Health Service', label: 'Essential Health Service (अत्यावश्यक आरोग्य सेवा)' }
                  ].map((preset) => (
                    <label
                      key={preset.id}
                      className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 cursor-pointer transition-all ${
                        badgeToAssign === preset.id
                          ? 'border-[#166534] bg-[#f0fdf4] text-[#166534]'
                          : 'border-[#e8e2d9] hover:bg-[#fcfbf9] text-[#55605a]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="badgePreset"
                        checked={badgeToAssign === preset.id}
                        onChange={() => setBadgeToAssign(preset.id)}
                        className="accent-[#166534]"
                      />
                      <span>{preset.label}</span>
                    </label>
                  ))}

                  <div className="mt-2 flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[#707974]">किंवा स्वतःचा सानुकूल बॅज प्रविष्ट करा:</label>
                    <input
                      type="text"
                      value={badgeToAssign}
                      onChange={(e) => setBadgeToAssign(e.target.value)}
                      className="p-2 bg-[#fcfbf9] rounded-xl text-xs border border-[#e8e2d9] font-medium"
                      placeholder="उदा. ग्राम गौरव पुरस्कार प्राप्त"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBizForBadge(null)}
                    className="px-4 py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8ded3] text-[#55605a] font-bold text-xs cursor-pointer"
                  >
                    रद्द करा
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateBusinessBadge(selectedBizForBadge, badgeToAssign)}
                    className="px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
                  >
                    <LucideIcon name="save" className="text-[16px]" />
                    <span>बॅज लागू करा</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: REVIEWS MANAGEMENT */}
      {activeTab === 'reviews' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-[#e8e2d9] p-4 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-heading font-extrabold text-[18px] sm:text-[20px] text-[#166534] flex items-center gap-2">
                  <LucideIcon name="rate_review" className="text-[24px] text-[#ef9f27]" />
                  <span>स्थानिक दुकाने - नागरिक अभिप्राय व्यवस्थापन</span>
                </h2>
                <p className="text-[12px] text-[#707974] mt-0.5">
                  गावकऱ्यांनी विविध दुकानांसाठी दिलेले रेटिंग, परीक्षणे व अनुभव तपासा आणि नियंत्रित करा.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/reviews"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <LucideIcon name="open_in_new" className="text-[16px]" />
                  <span>सार्वजनिक अभिप्राय पृष्ठ उघडा</span>
                </a>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9]">
              <div className="relative flex-1">
                <LucideIcon name="search" className=" absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-[18px]" />
                <input
                  type="text"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder="ग्राहक, दुकान किंवा टिप्पणी शोधा..."
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-lg text-xs text-[#1d1b16] border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={reviewFilterRating}
                  onChange={(e) => setReviewFilterRating(e.target.value)}
                  className="p-2 bg-white rounded-lg text-xs font-bold text-[#166534] border border-[#e8e2d9] outline-none cursor-pointer"
                >
                  <option value="all">सर्व रेटिंग</option>
                  <option value="5">⭐⭐⭐⭐⭐ (५ स्टार)</option>
                  <option value="4">⭐⭐⭐⭐ (४ स्टार)</option>
                  <option value="3">⭐⭐⭐ (३ स्टार)</option>
                  <option value="2">⭐⭐ (२ स्टार)</option>
                  <option value="1">⭐ (१ स्टार)</option>
                </select>
              </div>
            </div>

            {/* Reviews Cards List */}
            <div className="space-y-3">
              {adminReviews
                .filter((r) => {
                  const matchesRating = reviewFilterRating === 'all' || String(r.rating) === reviewFilterRating;
                  const q = reviewSearch.toLowerCase().trim();
                  const matchesSearch =
                    !q ||
                    (r.userName && r.userName.toLowerCase().includes(q)) ||
                    (r.businessName && r.businessName.toLowerCase().includes(q)) ||
                    (r.comment && r.comment.toLowerCase().includes(q));
                  return matchesRating && matchesSearch;
                })
                .map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border border-[#e8e2d9] bg-[#fcfbf9] hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-[#166534]">
                          {rev.userName}
                        </span>
                        <span className="text-[11px] text-[#707974]">
                          ({rev.wardOrArea || 'आसगाव'})
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#166534] text-white text-[10px] font-bold">
                          {rev.businessName}
                        </span>
                        <div className="flex items-center text-[#ef9f27]">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <LucideIcon name="star" key={i} className=" text-[15px] font-fill" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-[#404945] italic">
                        "{rev.comment}"
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-[#707974] pt-0.5">
                        <span>{rev.date}</span>
                        <span className="font-semibold text-[#006a4e]">
                          {rev.verifiedCitizen ? '✓ सत्यापित ग्रामस्थ नागरिक' : 'अनोंदणीकृत'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleVerifiedReview(rev.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          rev.verifiedCitizen
                            ? 'bg-[#e8f1ec] text-[#006a4e] border-[#cadbcf]'
                            : 'bg-white text-[#707974] border-[#e8e2d9]'
                        }`}
                        title="सत्यापित स्थिती बदला"
                      >
                        {rev.verifiedCitizen ? 'सत्यापित ✓' : 'सत्यापित करा'}
                      </button>

                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 rounded-lg bg-[#fef3c7]/40 hover:bg-[#fef3c7] text-[#ba1a1a] transition-all cursor-pointer"
                        title="अभिप्राय हटवा"
                      >
                        <LucideIcon name="delete" className="text-[18px]" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: VILLAGE EVENTS & JATRA */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Events List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#e8e2d9] shadow-xs flex items-center justify-between">
              <div>
                <h2 className="font-heading font-extrabold text-[17px] text-[#166534] flex items-center gap-2">
                  <LucideIcon name="celebration" className="text-[22px] text-[#c2410c]" />
                  <span>गावातील कार्यक्रम व जत्रा ({events.length})</span>
                </h2>
                <p className="text-[12px] text-[#707974] mt-0.5">
                  येथील सर्व गावातील कार्यक्रम पानावर व होमपेजवर दिसतात.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setEventForm({
                    title: '',
                    category: 'religious',
                    eventDate: '',
                    eventTime: '10:00 AM — 05:00 PM',
                    location: 'खंडोबा मंदिर प्रांगण, आसगाव',
                    organizer: 'ग्रामपंचायत आसगाव',
                    badge: 'गावातील कार्यक्रम',
                    description: '',
                    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
                  });
                }}
                className="px-3 py-1.5 bg-[#166534] text-white text-[12px] font-bold rounded-xl hover:bg-[#052e16] transition-colors flex items-center gap-1 shrink-0"
              >
                <LucideIcon name="add" className="text-[16px]" />
                <span>नवीन जोडा</span>
              </button>
            </div>

            {loadingEvents ? (
              <div className="p-8 text-center text-[#707974] bg-white rounded-2xl border border-[#e8e2d9]">
                <div className="w-8 h-8 border-3 border-[#006a4e] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                कार्यक्रम लोड होत आहेत...
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-[#e8e2d9] text-center flex flex-col items-center justify-center gap-2">
                <LucideIcon name="event_busy" className="text-[42px] text-[#707974]" />
                <p className="text-[14px] font-bold text-[#166534]">अद्याप कोणताही कार्यक्रम जोडलेला नाही</p>
                <p className="text-[12px] text-[#707974]">उजवीकडील फॉर्म वापरून पहिला कार्यक्रम जोडा.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className={`bg-white rounded-2xl border p-4 shadow-xs transition-all flex flex-col sm:flex-row gap-4 ${editingEvent?.id === evt.id ? 'border-[#006a4e] ring-2 ring-[#006a4e]/20' : 'border-[#e8e2d9] hover:border-[#006a4e]/40'
                      }`}
                  >
                    <img
                      src={evt.imageUrl || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80"}
                      alt={evt.title}
                      className="w-full sm:w-32 h-28 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-[10px] font-black uppercase px-2 py-0.5 rounded">
                            {evt.badge || 'गावातील कार्यक्रम'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f3ede4] text-[#404945]">
                            {evt.category === 'religious' ? 'धार्मिक / यात्रा' :
                              evt.category === 'health' ? 'आरोग्य शिबीर' :
                                evt.category === 'agriculture' ? 'शेती कार्यशाळा' :
                                  evt.category === 'sports' ? 'क्रीडा स्पर्धा' : evt.category}
                          </span>
                          <span className="text-[11px] font-semibold text-[#c2410c] ml-auto">
                            {evt.eventDate} • {evt.eventTime}
                          </span>
                        </div>
                        <h3 className="font-heading font-extrabold text-[15px] text-[#166534] mb-1">
                          {evt.title}
                        </h3>
                        <p className="text-[12px] text-[#55605a] line-clamp-2 mb-2 leading-relaxed">
                          {evt.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#f3ede4] pt-2 text-[11px]">
                        <div className="flex items-center gap-3 text-[#707974]">
                          <span className="flex items-center gap-1 text-[#c2410c] font-medium">
                            <LucideIcon name="location_on" className="text-[14px]" />
                            {evt.location}
                          </span>
                          <span>{evt.organizer}</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEvent(evt);
                              setEventForm({
                                title: evt.title || '',
                                category: evt.category || 'religious',
                                eventDate: evt.eventDate || '',
                                eventTime: evt.eventTime || '10:00 AM — 05:00 PM',
                                location: evt.location || '',
                                organizer: evt.organizer || '',
                                badge: evt.badge || 'गावातील कार्यक्रम',
                                description: evt.description || '',
                                imageUrl: evt.imageUrl || ''
                              });
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#166534] font-bold text-[11px] transition-colors flex items-center gap-1"
                          >
                            <LucideIcon name="edit" className="text-[14px]" />
                            <span>संपादित</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#fef3c7]/40 hover:bg-[#fef3c7] text-[#ba1a1a] font-bold text-[11px] transition-colors flex items-center gap-1"
                          >
                            <LucideIcon name="delete" className="text-[14px]" />
                            <span>हटवा</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Create / Edit Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs sticky top-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-heading font-extrabold text-[16px] text-[#166534] flex items-center gap-2">
                <LucideIcon name={editingEvent ? 'edit_note' : 'add_circle'} className=" text-[20px] text-[#c2410c]" />
                <span>{editingEvent ? 'कार्यक्रम संपादित करा' : 'नवीन कार्यक्रम किंवा जत्रा जोडा'}</span>
              </h2>
              {editingEvent && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setEventForm({
                      title: '',
                      category: 'religious',
                      eventDate: '',
                      eventTime: '10:00 AM — 05:00 PM',
                      location: 'खंडोबा मंदिर प्रांगण, आसगाव',
                      organizer: 'ग्रामपंचायत आसगाव',
                      badge: 'गावातील कार्यक्रम',
                      description: '',
                      imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
                    });
                  }}
                  className="text-[11px] text-[#ba1a1a] font-bold hover:underline"
                >
                  रद्द करा
                </button>
              )}
            </div>
            <p className="text-[12px] text-[#707974] mb-4">
              येथे नोंदवलेला कार्यक्रम थेट सर्व गावकऱ्यांच्या 'गावातील कार्यक्रम' पेजवर दिसतो.
            </p>

            <form onSubmit={handleSaveEvent} className="flex flex-col gap-3 text-[12px]">
              <div>
                <label className="font-bold text-[#166534] block mb-1">कार्यक्रमाचे नाव *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="उदा. श्री खंडोबा महाराज यात्रा / मोफत आरोग्य शिबीर"
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">श्रेणी  *</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                  >
                    <option value="religious">धार्मिक उत्सव / यात्रा</option>
                    <option value="health">आरोग्य शिबीर </option>
                    <option value="agriculture">शेती कार्यशाळा </option>
                    <option value="sports">क्रीडा व युवक स्पर्धा</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">विशेष बॅज </label>
                  <input
                    type="text"
                    value={eventForm.badge}
                    onChange={(e) => setEventForm({ ...eventForm, badge: e.target.value })}
                    placeholder="उदा. वार्षिक उत्सव / मोफत सेवा"
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">तारीख *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.eventDate}
                    onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                    placeholder="उदा. 15 Nov 2025"
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">वेळ</label>
                  <input
                    type="text"
                    value={eventForm.eventTime}
                    onChange={(e) => setEventForm({ ...eventForm, eventTime: e.target.value })}
                    placeholder="उदा. 10:00 AM — 05:00 PM"
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#166534] block mb-1">स्थळ / ठिकाण *</label>
                <input
                  type="text"
                  required
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="उदा. खंडोबा मंदिर प्रांगण, आसगाव"
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#166534] block mb-1">आयोजक</label>
                <input
                  type="text"
                  value={eventForm.organizer}
                  onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                  placeholder="उदा. ग्रामपंचायत आसगाव / देवस्थान ट्रस्ट"
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#166534] block mb-1">फोटो लिंक </label>
                <input
                  type="url"
                  value={eventForm.imageUrl}
                  onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#166534] block mb-1">कार्यक्रमाचा तपशील व वर्णन </label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="कार्यक्रमाची वेळ, उपस्थित पाहुणे, महाप्रसाद किंवा आवश्यक सूचना..."
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingEvent}
                className="w-full py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-1 disabled:opacity-50"
              >
                {savingEvent ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>जतन करत आहे...</span>
                  </>
                ) : (
                  <>
                    <LucideIcon name="save" className="text-[18px]" />
                    <span>{editingEvent ? 'बदल जतन करा' : 'कार्यक्रम जोडा'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB: SHIKSHA & EDUCATION MANAGEMENT */}
      {activeTab === 'shiksha' && (
        <div className="space-y-6">
          {/* Sub-tab Navigation */}
          <div className="bg-white p-3 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => { setEditingSchool(null); setShikshaSubTab('schools'); }}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${shikshaSubTab === 'schools'
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <LucideIcon name="account_balance" className="text-[18px]" />
              <span>शाळा व महाविद्यालये ({shikshaSchools.length})</span>
            </button>

            <button
              type="button"
              onClick={() => { setEditingScholarship(null); setShikshaSubTab('scholarships'); }}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${shikshaSubTab === 'scholarships'
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <LucideIcon name="workspace_premium" className="text-[18px]" />
              <span>शिष्यवृत्ती योजना ({shikshaScholarships.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShikshaSubTab('abhyasika')}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${shikshaSubTab === 'abhyasika'
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <LucideIcon name="local_library" className="text-[18px]" />
              <span>अभ्यासिका नियंत्रण ({shikshaAbhyasika.availableDesks}/{shikshaAbhyasika.totalDesks} जागा)</span>
            </button>

            <button
              type="button"
              onClick={() => { setEditingTutor(null); setShikshaSubTab('tutors'); }}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${shikshaSubTab === 'tutors'
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <LucideIcon name="cast_for_education" className="text-[18px]" />
              <span>शिकवणी व कौशल्य ({shikshaTutors.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShikshaSubTab('requests')}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${shikshaSubTab === 'requests'
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <LucideIcon name="book_online" className="text-[18px]" />
              <span>विद्यार्थी आरक्षण अर्ज ({deskRequests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShikshaSubTab('notice')}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${shikshaSubTab === 'notice'
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <LucideIcon name="campaign" className="text-[18px]" />
              <span>थेट सूचना पट्टी</span>
            </button>
          </div>

          {/* SUBTAB 1: SCHOOLS & COLLEGES */}
          {shikshaSubTab === 'schools' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-heading font-extrabold text-[16px] text-[#166534] flex items-center gap-2">
                    <LucideIcon name={editingSchool ? 'edit' : 'add_circle'} className=" text-[20px] text-[#006a4e]" />
                    <span>{editingSchool ? 'शाळेची माहिती बदला' : 'नवीन शाळा / संस्था जोडा'}</span>
                  </h2>
                  {editingSchool && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSchool(null);
                        setSchoolForm({
                          name: '',
                          badge: 'Govt Approved',
                          category: 'High School & Jr College',
                          grades: '1st – 12th',
                          medium: 'मराठी व सेमी-इंग्रजी',
                          description: '',
                          tagsString: 'शासन मान्यताप्राप्त, मोफत सायकल योजना, मध्यान्ह भोजन',
                          principalName: '',
                          contactPhone: '',
                          address: 'आसगाव',
                          imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
                        });
                      }}
                      className="text-[12px] text-red-600 hover:underline font-bold"
                    >
                      रद्द करा
                    </button>
                  )}
                </div>
                <p className="text-[12px] text-[#707974] mb-4">
                  आसगाव व परिसरातील शाळांची माहिती पालक व विद्यार्थ्यांसाठी अद्ययावत ठेवा.
                </p>

                <form onSubmit={handleSaveSchool} className="space-y-3 text-[13px]">
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">शाळेचे नाव *</label>
                    <input
                      type="text"
                      required
                      value={schoolForm.name}
                      onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                      placeholder="उदा. जि. प. उच्च प्राथमिक शाळा, आसगाव"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">प्रवर्ग </label>
                      <select
                        value={schoolForm.category}
                        onChange={(e) => setSchoolForm({ ...schoolForm, category: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                      >
                        <option value="High School & Jr College">हायस्कूल व कनिष्ठ महाविद्यालय</option>
                        <option value="Primary School">प्राथमिक शाळा / अंगणवाडी</option>
                        <option value="Technical & ITI">तांत्रिक व आय.टी.आय.</option>
                        <option value="Hostel & Lodging">वसतिगृह</option>
                        <option value="Other Institute">इतर शैक्षणिक संस्था</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">लेबल </label>
                      <input
                        type="text"
                        value={schoolForm.badge}
                        onChange={(e) => setSchoolForm({ ...schoolForm, badge: e.target.value })}
                        placeholder="उदा. शासनमान्य, अनुदानित"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">वर्ग / इयत्ता </label>
                      <input
                        type="text"
                        value={schoolForm.grades}
                        onChange={(e) => setSchoolForm({ ...schoolForm, grades: e.target.value })}
                        placeholder="उदा. १ ली ते १० वी"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">माध्यम </label>
                      <input
                        type="text"
                        value={schoolForm.medium}
                        onChange={(e) => setSchoolForm({ ...schoolForm, medium: e.target.value })}
                        placeholder="उदा. मराठी व सेमी-इंग्रजी"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">मुख्याध्यापक / संपर्क व्यक्ती</label>
                      <input
                        type="text"
                        value={schoolForm.principalName}
                        onChange={(e) => setSchoolForm({ ...schoolForm, principalName: e.target.value })}
                        placeholder="नाव व पद"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">संपर्क फोन नंबर</label>
                      <input
                        type="text"
                        value={schoolForm.contactPhone}
                        onChange={(e) => setSchoolForm({ ...schoolForm, contactPhone: e.target.value })}
                        placeholder="१० अंकी फोन"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">पत्ता </label>
                    <input
                      type="text"
                      value={schoolForm.address}
                      onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                      placeholder="उदा. ग्रामपंचायत जवळ, आसगाव"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">वैशिष्ट्ये / टॅग्ज (स्वल्पविरामाने वेगळे करा)</label>
                    <input
                      type="text"
                      value={schoolForm.tagsString}
                      onChange={(e) => setSchoolForm({ ...schoolForm, tagsString: e.target.value })}
                      placeholder="उदा. PM पोषण आहार, मोफत सायकल योजना, संगणक कक्ष"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">फोटो लिंक </label>
                    <input
                      type="url"
                      value={schoolForm.imageUrl}
                      onChange={(e) => setSchoolForm({ ...schoolForm, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">सविस्तर माहिती </label>
                    <textarea
                      rows={2}
                      value={schoolForm.description}
                      onChange={(e) => setSchoolForm({ ...schoolForm, description: e.target.value })}
                      placeholder="शाळेची प्रमुख वैशिष्ट्ये, निकालाची टक्केवारी किंवा सुविधा..."
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
                  >
                    <LucideIcon name="save" className="text-[18px]" />
                    <span>{editingSchool ? 'बदल जतन करा ' : 'शाळा जोडा '}</span>
                  </button>
                </form>
              </div>

              {/* School List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-[15px] text-[#166534]">
                    नोंदणीकृत शाळा व महाविद्यालये ({shikshaSchools.length})
                  </h3>
                  <span className="text-[11px] text-[#707974] bg-[#f4efe8] px-2.5 py-1 rounded-full">
                    विद्यार्थी पोर्टलवर थेट दिसतील
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {shikshaSchools.map((school) => (
                    <div
                      key={school.id}
                      className="p-4 bg-white rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-[#006a4e]/40 transition-all"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <img
                          src={school.imageUrl}
                          alt={school.name}
                          className="w-16 h-16 rounded-xl object-cover border border-[#e8e2d9] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[10px] uppercase font-black bg-[#166534]/10 text-[#166534] px-2 py-0.5 rounded-full">
                              {school.badge}
                            </span>
                            <span className="text-[11px] text-[#707974]">
                              {school.grades} • {school.medium}
                            </span>
                          </div>
                          <h4 className="font-bold text-[14px] text-[#166534] truncate">{school.name}</h4>
                          <p className="text-[12px] text-[#555] line-clamp-1">{school.description}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#707974]">
                            {school.principalName && (
                              <span className="flex items-center gap-1">
                                <LucideIcon name="person" className="text-[13px]" />
                                {school.principalName}
                              </span>
                            )}
                            {school.contactPhone && (
                              <span className="flex items-center gap-1 font-mono">
                                <LucideIcon name="call" className="text-[13px]" />
                                {school.contactPhone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSchool(school);
                            setSchoolForm({
                              name: school.name,
                              badge: school.badge,
                              category: school.category,
                              grades: school.grades,
                              medium: school.medium,
                              description: school.description,
                              tagsString: school.tags.join(', '),
                              principalName: school.principalName,
                              contactPhone: school.contactPhone,
                              address: school.address,
                              imageUrl: school.imageUrl,
                            });
                          }}
                          className="p-2 rounded-lg bg-[#f0eee8] text-[#166534] hover:bg-[#166534] hover:text-white transition-colors"
                          title="संपादित करा"
                        >
                          <LucideIcon name="edit" className="text-[18px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSchool(school.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="हटवा"
                        >
                          <LucideIcon name="delete" className="text-[18px]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: SCHOLARSHIPS & STUDENT SCHEMES */}
          {shikshaSubTab === 'scholarships' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-heading font-extrabold text-[16px] text-[#166534] flex items-center gap-2">
                    <LucideIcon name={editingScholarship ? 'edit' : 'add_circle'} className=" text-[20px] text-[#c2410c]" />
                    <span>{editingScholarship ? 'शिष्यवृत्ती संपादित करा' : 'नवीन शिष्यवृत्ती योजना नोंदवा'}</span>
                  </h2>
                  {editingScholarship && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingScholarship(null);
                        setScholarshipForm({
                          title: '',
                          badge: 'POST-MATRIC (11th & Higher)',
                          deadline: '15 Nov 2026',
                          description: '',
                          benefit: '100% फी सवलत + मासिक निर्वाह भत्ता',
                          incomeLimit: '≤ ₹2,50,000 / वर्ष',
                          department: 'सामाजिक न्याय व विशेष सहाय्य विभाग',
                          officialUrl: 'https://mahadbt.maharashtra.gov.in',
                          eligibility: 'आधार संलग्न बँक खाते, जात प्रमाणपत्र, उत्पन्न दाखला',
                        });
                      }}
                      className="text-[12px] text-red-600 hover:underline font-bold"
                    >
                      रद्द करा
                    </button>
                  )}
                </div>
                <p className="text-[12px] text-[#707974] mb-4">
                  विद्यार्थ्यांना वेळेत अर्ज करता यावा म्हणून शासनाच्या शिष्यवृत्ती योजनांची मुदत व पात्रता भरा.
                </p>

                <form onSubmit={handleSaveScholarship} className="space-y-3 text-[13px]">
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">शिष्यवृत्तीचे नाव *</label>
                    <input
                      type="text"
                      required
                      value={scholarshipForm.title}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, title: e.target.value })}
                      placeholder="उदा. महाडीबीटी पोस्ट-मॅट्रिक शिष्यवृत्ती"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">प्रवर्ग / टॅग </label>
                      <input
                        type="text"
                        value={scholarshipForm.badge}
                        onChange={(e) => setScholarshipForm({ ...scholarshipForm, badge: e.target.value })}
                        placeholder="उदा. POST-MATRIC, GIRLS SCHOLARSHIP"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">अंतिम मुदत </label>
                      <input
                        type="text"
                        value={scholarshipForm.deadline}
                        onChange={(e) => setScholarshipForm({ ...scholarshipForm, deadline: e.target.value })}
                        placeholder="उदा. 15 Nov 2026 किंवा चालू योजना"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">मिळणारा लाभ / रक्कम </label>
                      <input
                        type="text"
                        value={scholarshipForm.benefit}
                        onChange={(e) => setScholarshipForm({ ...scholarshipForm, benefit: e.target.value })}
                        placeholder="उदा. ₹1,200/महिना + फी माफी"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">उत्पन्न मर्यादा </label>
                      <input
                        type="text"
                        value={scholarshipForm.incomeLimit}
                        onChange={(e) => setScholarshipForm({ ...scholarshipForm, incomeLimit: e.target.value })}
                        placeholder="उदा. ≤ ₹2,50,000 / वर्ष"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">विभाग / शासन संस्था </label>
                    <input
                      type="text"
                      value={scholarshipForm.department}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, department: e.target.value })}
                      placeholder="उदा. सामाजिक न्याय व विशेष सहाय्य विभाग"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">अधिकृत वेबसाईट लिंक </label>
                    <input
                      type="url"
                      value={scholarshipForm.officialUrl}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, officialUrl: e.target.value })}
                      placeholder="https://mahadbt.maharashtra.gov.in"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">पात्रता निकष </label>
                    <input
                      type="text"
                      value={scholarshipForm.eligibility}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, eligibility: e.target.value })}
                      placeholder="उदा. आधार बँक लिंक, जातीचा दाखला, उत्पन्न दाखला"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">तपशील व मार्गदर्शक माहिती </label>
                    <textarea
                      rows={2}
                      value={scholarshipForm.description}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, description: e.target.value })}
                      placeholder="योजनेचे प्रमुख नियम, अर्ज करण्याची पद्धत..."
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
                  >
                    <LucideIcon name="save" className="text-[18px]" />
                    <span>{editingScholarship ? 'बदल जतन करा ' : 'शिष्यवृत्ती जोडा '}</span>
                  </button>
                </form>
              </div>

              {/* Scholarship List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-[15px] text-[#166534]">
                    प्रसिद्ध शिष्यवृत्ती योजना ({shikshaScholarships.length})
                  </h3>
                  <span className="text-[11px] text-[#707974] bg-[#f4efe8] px-2.5 py-1 rounded-full">
                    विद्यार्थी थेट MahaDBT वर अर्ज करू शकतात
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {shikshaScholarships.map((sch) => (
                    <div
                      key={sch.id}
                      className="p-4 bg-white rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col justify-between hover:border-[#c2410c]/40 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-black uppercase bg-[#c2410c]/10 text-[#c2410c] px-2 py-0.5 rounded-full">
                            {sch.badge}
                          </span>
                          <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                            <LucideIcon name="alarm" className="text-[13px]" />
                            {sch.deadline}
                          </span>
                        </div>
                        <h4 className="font-bold text-[14px] text-[#166534] mb-1">{sch.title}</h4>
                        <p className="text-[12px] text-[#555] line-clamp-2 mb-2">{sch.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#fcfbf9] border border-[#f0eee8] text-[11px] mb-2">
                          <div>
                            <span className="text-[#707974] block">लाभ / सहाय्य:</span>
                            <span className="font-bold text-[#006a4e]">{sch.benefit}</span>
                          </div>
                          <div>
                            <span className="text-[#707974] block">उत्पन्न मर्यादा:</span>
                            <span className="font-bold text-[#2d312e]">{sch.incomeLimit}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#f0eee8] mt-1">
                        <a
                          href={sch.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-[#006a4e] hover:underline flex items-center gap-1"
                        >
                          <span>पोर्टल लिंक</span>
                          <LucideIcon name="open_in_new" className="text-[12px]" />
                        </a>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingScholarship(sch);
                              setScholarshipForm({
                                title: sch.title,
                                badge: sch.badge,
                                deadline: sch.deadline,
                                description: sch.description,
                                benefit: sch.benefit,
                                incomeLimit: sch.incomeLimit,
                                department: sch.department,
                                officialUrl: sch.officialUrl,
                                eligibility: sch.eligibility,
                              });
                            }}
                            className="p-1.5 rounded-lg bg-[#f0eee8] text-[#166534] hover:bg-[#166534] hover:text-white transition-colors"
                            title="संपादित करा"
                          >
                            <LucideIcon name="edit" className="text-[16px]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteScholarship(sch.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                            title="हटवा"
                          >
                            <LucideIcon name="delete" className="text-[16px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: ABHYASIKA CONFIGURATION */}
          {shikshaSubTab === 'abhyasika' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Settings Form */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
                <h2 className="font-heading font-extrabold text-[16px] text-[#166534] mb-1 flex items-center gap-2">
                  <LucideIcon name="tune" className="text-[20px] text-[#006a4e]" />
                  <span>ग्रामपंचायत अभ्यासिका नियंत्रण केंद्र </span>
                </h2>
                <p className="text-[12px] text-[#707974] mb-4">
                  विद्यार्थ्यांना स्पर्धा परीक्षा व अभ्यासासाठी उपलब्ध जागांची संख्या व वेळ येथे त्वरित बदला.
                </p>

                <form onSubmit={handleSaveAbhyasikaConfig} className="space-y-4 text-[13px]">
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">अभ्यासिका नाव / शीर्षक</label>
                    <input
                      type="text"
                      value={shikshaAbhyasika.title}
                      onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-[#f8f6f0] border border-[#e8e2d9]">
                      <label className="block font-bold text-[#166534] mb-1">एकूण जागा / टेबल्स </label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={shikshaAbhyasika.totalDesks}
                        onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, totalDesks: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 rounded-lg border border-[#d8d2c6] bg-white font-mono font-bold text-[16px] text-[#166534]"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <label className="block font-bold text-emerald-900 mb-1">उपलब्ध रिकाम्या जागा </label>
                      <input
                        type="number"
                        min="0"
                        max={shikshaAbhyasika.totalDesks}
                        value={shikshaAbhyasika.availableDesks}
                        onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, availableDesks: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 rounded-lg border border-emerald-300 bg-white font-mono font-bold text-[16px] text-emerald-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">वेळ </label>
                      <input
                        type="text"
                        value={shikshaAbhyasika.timings}
                        onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, timings: e.target.value })}
                        placeholder="उदा. 06:00 AM – 11:00 PM"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">इंटरनेट / वायफाय गती </label>
                      <input
                        type="text"
                        value={shikshaAbhyasika.wifiSpeed}
                        onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, wifiSpeed: e.target.value })}
                        placeholder="उदा. 100 Mbps BSNL Optical Fiber"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">पुस्तकांची संख्या </label>
                      <input
                        type="text"
                        value={shikshaAbhyasika.bookCount}
                        onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, bookCount: e.target.value })}
                        placeholder="उदा. 3,200+ Books & Journals"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">व्यवस्थापक / सेवक नाव </label>
                      <input
                        type="text"
                        value={shikshaAbhyasika.caretakerName}
                        onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, caretakerName: e.target.value })}
                        placeholder="उदा. श्री. निलकंठ मेश्राम"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">व्यवस्थापक पद </label>
                    <input
                      type="text"
                      value={shikshaAbhyasika.caretakerRole}
                      onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, caretakerRole: e.target.value })}
                      placeholder="उदा. ग्रामपंचायत कार्यालय सेवक व ग्रंथपाल"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">अभ्यासिका नियम / सूचना पट्टी मजकूर</label>
                    <textarea
                      rows={2}
                      value={shikshaAbhyasika.noticeText}
                      onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, noticeText: e.target.value })}
                      placeholder="उदा. सर्व आसगाव विद्यार्थ्यांना मोफत प्रवेश. ग्रंथालयात शांतता राखावी."
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <LucideIcon name="save" className="text-[18px]" />
                    <span>अभ्यासिका बदल जतन करा </span>
                  </button>
                </form>
              </div>

              {/* Live Preview Card */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-heading font-extrabold text-[15px] text-[#166534]">
                  विद्यार्थ्यांना दिसणारे स्वरूप 
                </h3>
                <div className="p-6 bg-gradient-to-br from-[#166534] to-[#00523e] text-white rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-[11px] font-bold backdrop-blur-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      थेट स्थिती 
                    </span>
                    <span className="text-[12px] opacity-80">{shikshaAbhyasika.timings}</span>
                  </div>

                  <h3 className="font-heading font-black text-[18px] mb-2">{shikshaAbhyasika.title}</h3>
                  <p className="text-[12px] opacity-80 mb-5 leading-relaxed">{shikshaAbhyasika.noticeText}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <span className="text-[11px] opacity-75 block">उपलब्ध जागा</span>
                      <span className="font-mono text-[22px] font-black text-emerald-300">
                        {shikshaAbhyasika.availableDesks} / {shikshaAbhyasika.totalDesks}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <span className="text-[11px] opacity-75 block">हाय-स्पीड इंटरनेट</span>
                      <span className="text-[12px] font-bold text-white block mt-1">{shikshaAbhyasika.wifiSpeed}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] opacity-85">
                    <span>व्यवस्थापक: {shikshaAbhyasika.caretakerName}</span>
                    <span>{shikshaAbhyasika.bookCount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 4: TUTORS & SKILL CENTERS */}
          {shikshaSubTab === 'tutors' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-heading font-extrabold text-[16px] text-[#166534] flex items-center gap-2">
                    <LucideIcon name={editingTutor ? 'edit' : 'add_circle'} className=" text-[20px] text-[#006a4e]" />
                    <span>{editingTutor ? 'शिकवणी वर्ग संपादित करा' : 'नवीन शिकवणी / कौशल्य केंद्र जोडा'}</span>
                  </h2>
                  {editingTutor && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTutor(null);
                        setTutorForm({
                          name: '',
                          category: 'इ. ५ वी ते १० वी शिकवणी',
                          subjects: 'गणित, विज्ञान, इंग्रजी',
                          timing: 'सकाळी ०६:३० ते ०८:३०',
                          phone: '',
                          address: 'आसगाव',
                          feesInfo: '₹400 / महिना',
                        });
                      }}
                      className="text-[12px] text-red-600 hover:underline font-bold"
                    >
                      रद्द करा
                    </button>
                  )}
                </div>
                <p className="text-[12px] text-[#707974] mb-4">
                  गावातील खाजगी शिकवण्या, संगणक केंद्र किंवा कौशल्य विकास वर्गांची नोंद ठेवा.
                </p>

                <form onSubmit={handleSaveTutor} className="space-y-3 text-[13px]">
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">वर्ग / संस्थेचे नाव  *</label>
                    <input
                      type="text"
                      required
                      value={tutorForm.name}
                      onChange={(e) => setTutorForm({ ...tutorForm, name: e.target.value })}
                      placeholder="उदा. ज्ञानदीप कोचिंग क्लासेस किंवा PMKVY केंद्र"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">प्रवर्ग / गट </label>
                      <input
                        type="text"
                        value={tutorForm.category}
                        onChange={(e) => setTutorForm({ ...tutorForm, category: e.target.value })}
                        placeholder="उदा. इ. ५ ते १० वी, कौशल्य केंद्र"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">फी रचना </label>
                      <input
                        type="text"
                        value={tutorForm.feesInfo}
                        onChange={(e) => setTutorForm({ ...tutorForm, feesInfo: e.target.value })}
                        placeholder="उदा. ₹400 / महिना किंवा शासनमान्य मोफत"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">शिकवले जाणारे विषय / अभ्यासक्रम</label>
                    <input
                      type="text"
                      value={tutorForm.subjects}
                      onChange={(e) => setTutorForm({ ...tutorForm, subjects: e.target.value })}
                      placeholder="उदा. गणित, विज्ञान, इंग्रजी, बेसिक कोडिंग..."
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">वर्गाची वेळ </label>
                      <input
                        type="text"
                        value={tutorForm.timing}
                        onChange={(e) => setTutorForm({ ...tutorForm, timing: e.target.value })}
                        placeholder="उदा. 06:30 AM - 08:30 AM"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">संपर्क नंबर </label>
                      <input
                        type="text"
                        value={tutorForm.phone}
                        onChange={(e) => setTutorForm({ ...tutorForm, phone: e.target.value })}
                        placeholder="१० अंकी फोन"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">पत्ता </label>
                    <input
                      type="text"
                      value={tutorForm.address}
                      onChange={(e) => setTutorForm({ ...tutorForm, address: e.target.value })}
                      placeholder="उदा. बस स्थानक जवळ, आसगाव"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
                  >
                    <LucideIcon name="save" className="text-[18px]" />
                    <span>{editingTutor ? 'बदल जतन करा ' : 'वर्ग जोडा '}</span>
                  </button>
                </form>
              </div>

              {/* Tutors List */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-heading font-extrabold text-[15px] text-[#166534]">
                  नोंदणीकृत शिकवणी व कौशल्य केंद्रे ({shikshaTutors.length})
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {shikshaTutors.map((tut) => (
                    <div
                      key={tut.id}
                      className="p-4 bg-white rounded-2xl border border-[#e8e2d9] shadow-xs flex items-start justify-between gap-3 hover:border-[#006a4e]/40 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold bg-[#f4efe8] text-[#555] px-2 py-0.5 rounded-full">
                            {tut.category}
                          </span>
                          <span className="text-[11px] font-bold text-[#006a4e]">{tut.feesInfo}</span>
                        </div>
                        <h4 className="font-bold text-[14px] text-[#166534]">{tut.name}</h4>
                        <p className="text-[12px] text-[#555] mt-0.5">{tut.subjects}</p>
                        <div className="flex items-center gap-4 mt-2 text-[11px] text-[#707974]">
                          <span className="flex items-center gap-1">
                            <LucideIcon name="schedule" className="text-[13px]" />
                            {tut.timing}
                          </span>
                          {tut.phone && (
                            <span className="flex items-center gap-1 font-mono font-bold">
                              <LucideIcon name="call" className="text-[13px]" />
                              {tut.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTutor(tut);
                            setTutorForm({
                              name: tut.name,
                              category: tut.category,
                              subjects: tut.subjects,
                              timing: tut.timing,
                              phone: tut.phone,
                              address: tut.address,
                              feesInfo: tut.feesInfo,
                            });
                          }}
                          className="p-1.5 rounded-lg bg-[#f0eee8] text-[#166534] hover:bg-[#166534] hover:text-white transition-colors"
                          title="संपादित करा"
                        >
                          <LucideIcon name="edit" className="text-[16px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTutor(tut.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="हटवा"
                        >
                          <LucideIcon name="delete" className="text-[16px]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 5: STUDENT DESK RESERVATIONS */}
          {shikshaSubTab === 'requests' && (
            <div className="bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading font-extrabold text-[16px] text-[#166534] flex items-center gap-2">
                    <LucideIcon name="book_online" className="text-[20px] text-[#006a4e]" />
                    <span>विद्यार्थी अभ्यासिका आरक्षण अर्ज </span>
                  </h2>
                  <p className="text-[12px] text-[#707974] mt-0.5">
                    पोर्टलवरून विद्यार्थ्यांनी नोंदवलेले अभ्यासिका डेस्क अर्ज.
                  </p>
                </div>
                <span className="text-[12px] font-bold bg-[#f4efe8] px-3 py-1 rounded-full text-[#166534]">
                  एकूण अर्ज: {deskRequests.length}
                </span>
              </div>

              {deskRequests.length === 0 ? (
                <div className="text-center py-12 text-[#707974]">
                  <LucideIcon name="event_seat" className=" text-[48px] text-[#ccc] mb-2 block" />
                  <p className="font-bold text-[14px]">अद्याप कोणतेही डेस्क आरक्षण अर्ज आलेले नाहीत</p>
                  <p className="text-[12px] mt-1">विद्यार्थी /shiksha पेजवरून डेस्क बुक करतात तेव्हा ते येथे दिसतील.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[12px] min-w-[650px]">
                    <thead className="bg-[#fcfbf9] text-[#707974] uppercase text-[11px] font-black border-b border-[#e8e2d9]">
                      <tr>
                        <th className="p-3">विद्यार्थ्याचे नाव</th>
                        <th className="p-3">परीक्षा / ध्येय</th>
                        <th className="p-3">वेळ </th>
                        <th className="p-3">डेस्क क्र.</th>
                        <th className="p-3">मोबाईल नंबर</th>
                        <th className="p-3">तारीख</th>
                        <th className="p-3">कृती </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0eee8]">
                      {deskRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-[#fcfbf9]">
                          <td className="p-3 font-bold text-[#166534]">{req.studentName}</td>
                          <td className="p-3">{req.exam}</td>
                          <td className="p-3">{req.timeSlot}</td>
                          <td className="p-3 font-mono font-bold text-[#006a4e]">डेस्क #{req.deskNumber}</td>
                          <td className="p-3 font-mono">{req.phone || '—'}</td>
                          <td className="p-3 text-[#707974]">{req.date}</td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() => handleClearDeskRequest(req.id)}
                              className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-bold text-[11px] transition-colors"
                            >
                              पूर्ण / हटवा
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SUBTAB 6: LIVE EDUCATION NOTICE BANNER */}
          {shikshaSubTab === 'notice' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
                <h2 className="font-heading font-extrabold text-[16px] text-[#166534] mb-1 flex items-center gap-2">
                  <LucideIcon name="campaign" className="text-[20px] text-[#006a4e]" />
                  <span>शिक्षण सूचना पट्टी संपादन </span>
                </h2>
                <p className="text-[12px] text-[#707974] mb-4">
                  ही सूचना /shiksha पानाच्या सर्वात वरती ठळकपणे प्रदर्शित केली जाईल.
                </p>

                <form onSubmit={handleSaveShikshaNotice} className="space-y-4 text-[13px]">
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">मुख्य ठळक सूचना  *</label>
                    <input
                      type="text"
                      required
                      value={shikshaNotice.headline}
                      onChange={(e) => setShikshaNotice({ ...shikshaNotice, headline: e.target.value })}
                      placeholder="उदा. MahaDBT अर्ज मुदत वाढवून १५ नोव्हेंबर केली"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">दुय्यम माहिती / उपशीर्षक </label>
                    <input
                      type="text"
                      value={shikshaNotice.subtext}
                      onChange={(e) => setShikshaNotice({ ...shikshaNotice, subtext: e.target.value })}
                      placeholder="उदा. ग्रामपंचायत हॉलमध्ये मोफत अभ्यासिका डेस्क उपलब्ध (४० जागा)"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">बटन मजकूर </label>
                    <input
                      type="text"
                      value={shikshaNotice.actionLabel}
                      onChange={(e) => setShikshaNotice({ ...shikshaNotice, actionLabel: e.target.value })}
                      placeholder="उदा. सविस्तर माहिती / View Details"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f6f0] border border-[#e8e2d9]">
                    <input
                      type="checkbox"
                      id="noticeActiveToggle"
                      checked={shikshaNotice.isActive}
                      onChange={(e) => setShikshaNotice({ ...shikshaNotice, isActive: e.target.checked })}
                      className="w-4 h-4 text-[#166534] rounded"
                    />
                    <label htmlFor="noticeActiveToggle" className="font-bold text-[#2d312e] cursor-pointer">
                      पानावर ही सूचना पट्टी सक्रिय ठेवा 
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <LucideIcon name="save" className="text-[18px]" />
                    <span>सूचना जतन करा </span>
                  </button>
                </form>
              </div>

              {/* Notice Preview */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="font-heading font-extrabold text-[15px] text-[#166534]">
                  थेट सूचना पट्टीचे थेट स्वरूप 
                </h3>
                {shikshaNotice.isActive ? (
                  <div className="bg-[#166534] text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <LucideIcon name="notifications_active" className="text-[18px] text-amber-300" />
                      </div>
                      <div>
                        <div className="font-bold text-[13px]">{shikshaNotice.headline}</div>
                        <div className="text-[11px] opacity-80">{shikshaNotice.subtext}</div>
                      </div>
                    </div>
                    {shikshaNotice.actionLabel && (
                      <span className="px-3 py-1.5 bg-white text-[#166534] rounded-xl text-[12px] font-black shrink-0">
                        {shikshaNotice.actionLabel}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#707974] bg-white rounded-2xl border border-dashed border-[#ccc]">
                    <LucideIcon name="visibility_off" className="text-[36px] mb-2 block" />
                    <p className="font-bold text-[13px]">सूचना पट्टी सध्या निष्क्रिय  आहे</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: TRANSPORT & MSRTC BUS MANAGEMENT */}
      {activeTab === 'transport' && (
        <div className="space-y-6">
          {/* Sub-tab Navigation */}
          <div className="bg-white p-3 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={() => { setEditingBus(null); setTransportSubTab('buses'); }}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${transportSubTab === 'buses'
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                  }`}
              >
                <LucideIcon name="directions_bus" className="text-[18px]" />
                <span>एसटी बसेस वेळापत्रक ({transportBuses.length})</span>
              </button>

              <button
                type="button"
                onClick={() => { setEditingAuto(null); setTransportSubTab('autos'); }}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${transportSubTab === 'autos'
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                  }`}
              >
                <LucideIcon name="local_taxi" className="text-[18px]" />
                <span>गावातील रिक्षा व टॅक्सी चालक ({transportAutos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setTransportSubTab('depots')}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${transportSubTab === 'depots'
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                  }`}
              >
                <LucideIcon name="call" className="text-[18px]" />
                <span>आगार संपर्क क्रमांक ({transportDepots.length})</span>
              </button>
            </div>

            {transportSubTab === 'buses' && (
              <button
                type="button"
                onClick={handleResetBuses}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#707974] text-[11px] font-bold flex items-center gap-1.5 transition-colors border border-stone-200"
                title="मूळ अधिकृत बसेस रीसेट करा"
              >
                <LucideIcon name="restart_alt" className="text-[16px]" />
                <span>डिफॉल्ट बसेस रीसेट करा</span>
              </button>
            )}
          </div>

          {/* SUBTAB 1: BUSES MANAGEMENT */}
          {transportSubTab === 'buses' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Column */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
                <h2 className="font-heading font-extrabold text-[16px] text-[#166534] mb-1 flex items-center gap-2">
                  <LucideIcon name={editingBus ? 'edit_calendar' : 'add_circle'} className=" text-[20px] text-[#006a4e]" />
                  <span>{editingBus ? 'बस फेरी संपादित करा' : 'नवीन एसटी बस फेरी जोडा'}</span>
                </h2>
                <p className="text-[12px] text-[#707974] mb-4">
                  पवनी, भंडारा, नागपूर किंवा साकोली मार्गावरील नवीन बस फेरी येथे नोंदवा.
                </p>

                <form onSubmit={handleSaveBus} className="space-y-3.5 text-[13px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">बस क्रमांक (वाहन क्र.)</label>
                      <input
                        type="text"
                        value={busForm.busNumber}
                        onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })}
                        placeholder="उदा. MH40-Y-5412"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">बस प्रकार  *</label>
                      <select
                        value={busForm.busType}
                        onChange={(e) => setBusForm({ ...busForm, busType: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-bold"
                      >
                        <option value="Lalpari">साधी लालपरी </option>
                        <option value="Asiad">निमआराम </option>
                        <option value="Shivshahi">शिवशाही </option>
                        <option value="Ordinary">स्थानिक लोकल फेरी</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">सुरुवात  *</label>
                      <input
                        type="text"
                        required
                        value={busForm.sourceMarathi}
                        onChange={(e) => setBusForm({ ...busForm, sourceMarathi: e.target.value, source: e.target.value })}
                        placeholder="उदा. आसगाव"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">गंतव्य  *</label>
                      <input
                        type="text"
                        required
                        value={busForm.destinationMarathi}
                        onChange={(e) => setBusForm({ ...busForm, destinationMarathi: e.target.value, destination: e.target.value })}
                        placeholder="उदा. पवनी / भंडारा"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">सुटण्याची वेळ *</label>
                      <input
                        type="text"
                        required
                        value={busForm.departureTime}
                        onChange={(e) => setBusForm({ ...busForm, departureTime: e.target.value })}
                        placeholder="06:45 AM"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">24-तास वेळ (HH:MM)</label>
                      <input
                        type="text"
                        required
                        value={busForm.departureTime24}
                        onChange={(e) => setBusForm({ ...busForm, departureTime24: e.target.value })}
                        placeholder="06:45"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">पोहोच वेळ</label>
                      <input
                        type="text"
                        required
                        value={busForm.approxArrivalTime}
                        onChange={(e) => setBusForm({ ...busForm, approxArrivalTime: e.target.value })}
                        placeholder="07:20 AM"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">मार्गावरील थांबे (Via Stops - स्वल्पविरामाने द्या) *</label>
                    <input
                      type="text"
                      required
                      value={busForm.viaMarathiString}
                      onChange={(e) => setBusForm({ ...busForm, viaMarathiString: e.target.value })}
                      placeholder="उदा. आसगाव फाटा, कोंढा, पवनी बस स्थानक"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">एसटी आगार  *</label>
                      <input
                        type="text"
                        required
                        value={busForm.depotMarathi}
                        onChange={(e) => setBusForm({ ...busForm, depotMarathi: e.target.value, depot: e.target.value })}
                        placeholder="उदा. पवनी आगार / भंडारा आगार"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">आसगाव थांबा स्थान *</label>
                      <input
                        type="text"
                        required
                        value={busForm.boardingPointMarathi}
                        onChange={(e) => setBusForm({ ...busForm, boardingPointMarathi: e.target.value })}
                        placeholder="उदा. आसगाव ग्रामपंचायत चौक"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  {/* Fares */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9]">
                    <div>
                      <label className="block font-bold text-[#2d312e] text-xs mb-1">पूर्ण भाडे (₹)</label>
                      <input
                        type="number"
                        required
                        value={busForm.fareGeneral}
                        onChange={(e) => {
                          const fg = Number(e.target.value) || 0;
                          setBusForm({ ...busForm, fareGeneral: fg, fareMahila: Math.round(fg / 2) });
                        }}
                        className="w-full p-2 rounded-lg border border-[#e8e2d9] font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#c2410c] text-xs mb-1">महिला (५०%)</label>
                      <input
                        type="number"
                        required
                        value={busForm.fareMahila}
                        onChange={(e) => setBusForm({ ...busForm, fareMahila: Number(e.target.value) || 0 })}
                        className="w-full p-2 rounded-lg border border-[#e8e2d9] font-bold text-center text-[#c2410c]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#006a4e] text-xs mb-1">ज्येष्ठ (७५+)</label>
                      <input
                        type="number"
                        value={busForm.fareSenior}
                        onChange={(e) => setBusForm({ ...busForm, fareSenior: Number(e.target.value) || 0 })}
                        className="w-full p-2 rounded-lg border border-[#e8e2d9] font-bold text-center text-[#006a4e]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      <LucideIcon name="save" className="text-[18px]" />
                      <span>{editingBus ? 'बदल सेव्ह करा' : 'बस फेरी जोडा'}</span>
                    </button>
                    {editingBus && (
                      <button
                        type="button"
                        onClick={() => setEditingBus(null)}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                      >
                        रद्द करा
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List Column */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-[15px] text-[#166534]">
                    नोंदणीकृत एसटी बसेस ({transportBuses.length})
                  </h3>
                  <span className="text-xs text-[#707974]">वेळेनुसार स्वयंचलित क्रमवारी</span>
                </div>

                <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                  {transportBuses.map((bus) => (
                    <div
                      key={bus.id}
                      className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#006a4e] transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-sm bg-[#166534] text-[#a7f3d0] px-2.5 py-0.5 rounded-lg">
                            {bus.departureTime}
                          </span>
                          <span className="text-xs font-bold text-[#006a4e] bg-[#e6f7f0] px-2 py-0.5 rounded">
                            {bus.busTypeMarathi}
                          </span>
                          <span className="text-xs text-[#707974]">({bus.depotMarathi})</span>
                        </div>
                        <div className="font-bold text-[#1d1b16] text-[15px] flex items-center gap-1.5 mt-1">
                          <span>{bus.sourceMarathi}</span>
                          <span className="text-[#c2410c]">➜</span>
                          <span className="text-[#c2410c]">{bus.destinationMarathi}</span>
                          <span className="text-xs font-normal text-[#707974] ml-2">~{bus.approxArrivalTime}</span>
                        </div>
                        <div className="text-[11px] text-[#707974] mt-1">
                          थांबे: {(bus.viaMarathi || []).join(' • ')}
                        </div>
                        <div className="text-[11px] font-bold text-[#166534] mt-1 flex gap-3">
                          <span>भाडे: ₹{bus.fareGeneral}</span>
                          <span className="text-[#c2410c]">महिला ५०%: ₹{bus.fareMahila}</span>
                          <span className="text-[#006a4e]">ज्येष्ठ: {bus.fareSenior === 0 ? 'मोफत' : `₹${bus.fareSenior}`}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBus(bus);
                            setBusForm({
                              busNumber: bus.busNumber || 'MH40-Y-',
                              source: bus.source,
                              destination: bus.destination,
                              sourceMarathi: bus.sourceMarathi,
                              destinationMarathi: bus.destinationMarathi,
                              viaMarathiString: (bus.viaMarathi || []).join(', '),
                              departureTime: bus.departureTime,
                              departureTime24: bus.departureTime24,
                              approxArrivalTime: bus.approxArrivalTime,
                              durationMinutes: bus.durationMinutes || 35,
                              busType: bus.busType,
                              depot: bus.depot,
                              depotMarathi: bus.depotMarathi,
                              fareGeneral: bus.fareGeneral,
                              fareMahila: bus.fareMahila,
                              fareSenior: bus.fareSenior,
                              frequencyMarathi: bus.frequencyMarathi,
                              boardingPointMarathi: bus.boardingPointMarathi
                            });
                            window.scrollTo({ top: 380, behavior: 'smooth' });
                          }}
                          className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                          title="संपादित करा"
                        >
                          <LucideIcon name="edit" className="text-[18px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBus(bus.id)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="हटवा"
                        >
                          <LucideIcon name="delete" className="text-[18px]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: AUTOS MANAGEMENT */}
          {transportSubTab === 'autos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
                <h2 className="font-heading font-extrabold text-[16px] text-[#166534] mb-1 flex items-center gap-2">
                  <LucideIcon name={editingAuto ? 'edit' : 'add_circle'} className=" text-[20px] text-[#006a4e]" />
                  <span>{editingAuto ? 'चालक माहिती संपादन' : 'नवीन रिक्षा / टॅक्सी चालक जोडा'}</span>
                </h2>
                <p className="text-[12px] text-[#707974] mb-4">
                  आसगाव चौकातील स्थानिक रिक्षा किंवा व्हॅन चालकाचा नंबर व भाडे येथे नोंदवा.
                </p>

                <form onSubmit={handleSaveAuto} className="space-y-3.5 text-[13px]">
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">चालकाचे नाव  *</label>
                    <input
                      type="text"
                      required
                      value={autoForm.nameMarathi}
                      onChange={(e) => setAutoForm({ ...autoForm, nameMarathi: e.target.value, name: e.target.value })}
                      placeholder="उदा. संजय मेश्राम"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">वाहन क्रमांक (MH36-...) *</label>
                      <input
                        type="text"
                        required
                        value={autoForm.vehicleNumber}
                        onChange={(e) => setAutoForm({ ...autoForm, vehicleNumber: e.target.value })}
                        placeholder="उदा. MH36-V-4182"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">वाहन प्रकार *</label>
                      <select
                        value={autoForm.vehicleType}
                        onChange={(e) => setAutoForm({ ...autoForm, vehicleType: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-bold"
                      >
                        <option value="Auto Rickshaw">रिक्षा </option>
                        <option value="Maxi Cab / 4-Wheeler">मॅक्सी कॅब / जीप</option>
                        <option value="Eco Van">इको व्हॅन </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">मोबाईल नंबर *</label>
                    <input
                      type="text"
                      required
                      value={autoForm.phone}
                      onChange={(e) => setAutoForm({ ...autoForm, phone: e.target.value })}
                      placeholder="उदा. +919822341029"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">मुख्य थांबा स्थान *</label>
                    <input
                      type="text"
                      required
                      value={autoForm.standLocationMarathi}
                      onChange={(e) => setAutoForm({ ...autoForm, standLocationMarathi: e.target.value })}
                      placeholder="उदा. आसगाव मुख्य बस स्टँड चौक"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">मुख्य मार्ग *</label>
                    <input
                      type="text"
                      required
                      value={autoForm.primaryRouteMarathi}
                      onChange={(e) => setAutoForm({ ...autoForm, primaryRouteMarathi: e.target.value })}
                      placeholder="उदा. आसगाव ⇄ पवनी (शेअरिंग किंवा स्पेशल)"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">अंदाजे भाडे दर *</label>
                    <input
                      type="text"
                      required
                      value={autoForm.estimatedFare}
                      onChange={(e) => setAutoForm({ ...autoForm, estimatedFare: e.target.value })}
                      placeholder="उदा. ₹30 प्रति सीट / ₹180 स्पेशल"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoAvailable"
                      checked={autoForm.isAvailable}
                      onChange={(e) => setAutoForm({ ...autoForm, isAvailable: e.target.checked })}
                      className="w-4 h-4 accent-[#166534]"
                    />
                    <label htmlFor="autoAvailable" className="font-bold text-[#166534] text-xs cursor-pointer">
                      सध्या सेवेत उपलब्ध 
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      <LucideIcon name="save" className="text-[18px]" />
                      <span>{editingAuto ? 'चालक सेव्ह करा' : 'नवीन चालक जोडा'}</span>
                    </button>
                    {editingAuto && (
                      <button
                        type="button"
                        onClick={() => setEditingAuto(null)}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                      >
                        रद्द करा
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-7 space-y-3">
                <h3 className="font-heading font-extrabold text-[15px] text-[#166534]">
                  गावातील स्थानिक चालक सूची ({transportAutos.length})
                </h3>

                <div className="space-y-2.5">
                  {transportAutos.map((driver) => (
                    <div
                      key={driver.id}
                      className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[15px] text-[#166534]">{driver.nameMarathi}</span>
                          <span className="text-xs font-mono font-bold text-[#707974]">({driver.vehicleNumber})</span>
                          <button
                            type="button"
                            onClick={() => handleToggleAutoAvailable(driver.id)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${driver.isAvailable
                                ? 'bg-[#e6f7f0] text-[#006a4e] border border-[#b8ebd5]'
                                : 'bg-stone-100 text-stone-500 border border-stone-200'
                              }`}
                          >
                            {driver.isAvailable ? '✓ उपलब्ध' : '✗ व्यस्त'}
                          </button>
                        </div>
                        <div className="text-xs text-[#404945] mt-1">
                          {driver.vehicleType} • {driver.standLocationMarathi}
                        </div>
                        <div className="text-xs font-bold text-[#c2410c] mt-0.5">
                          {driver.estimatedFare} • फोन: <span className="font-mono">{driver.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAuto(driver);
                            setAutoForm({
                              name: driver.name,
                              nameMarathi: driver.nameMarathi,
                              vehicleNumber: driver.vehicleNumber,
                              vehicleType: driver.vehicleType,
                              phone: driver.phone,
                              standLocationMarathi: driver.standLocationMarathi,
                              primaryRouteMarathi: driver.primaryRouteMarathi,
                              estimatedFare: driver.estimatedFare,
                              isAvailable: driver.isAvailable
                            });
                          }}
                          className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                          title="संपादित करा"
                        >
                          <LucideIcon name="edit" className="text-[18px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAuto(driver.id)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="हटवा"
                        >
                          <LucideIcon name="delete" className="text-[18px]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: DEPOTS MANAGEMENT */}
          {transportSubTab === 'depots' && (
            <div className="bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs space-y-4">
              <h2 className="font-heading font-extrabold text-[16px] text-[#166534] mb-1 flex items-center gap-2">
                <LucideIcon name="phone_in_talk" className="text-[20px] text-[#006a4e]" />
                <span>एसटी आगार व मदत केंद्र दूरध्वनी व्यवस्थापन</span>
              </h2>
              <p className="text-[12px] text-[#707974]">
                पवनी व भंडारा एसटी आगार तसेच २४×७ नियंत्रण कक्षाचे थेट फोन क्रमांक येथे संपादित करा.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {transportDepots.map((depot, idx) => (
                  <div key={idx} className="bg-[#f9f3ea] p-4 rounded-2xl border border-[#e8e2d9] space-y-3">
                    <h3 className="font-bold text-[#166534] text-[14px]">{depot.depotNameMarathi}</h3>
                    <div>
                      <label className="block text-[11px] font-bold text-[#707974] mb-1">चौकशी फोन क्रमांक</label>
                      <input
                        type="text"
                        value={depot.phone}
                        onChange={(e) => {
                          const updated = [...transportDepots];
                          updated[idx] = { ...updated[idx], phone: e.target.value };
                          setTransportDepots(updated);
                        }}
                        className="w-full p-2 bg-white rounded-xl border border-[#e8e2d9] font-mono text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#707974] mb-1">कंट्रोलर डेस्क</label>
                      <input
                        type="text"
                        value={depot.controllerDesk}
                        onChange={(e) => {
                          const updated = [...transportDepots];
                          updated[idx] = { ...updated[idx], controllerDesk: e.target.value };
                          setTransportDepots(updated);
                        }}
                        className="w-full p-2 bg-white rounded-xl border border-[#e8e2d9] font-mono text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('dg_transport_depots', JSON.stringify(transportDepots));
                    window.dispatchEvent(new Event('dg_transport_updated'));
                    alert('आगार संपर्क यशस्वीरित्या सेव्ह केले!');
                  }}
                  className="px-5 py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 text-xs"
                >
                  <LucideIcon name="save" className="text-[18px]" />
                  <span>सर्व आगार संपर्क सेव्ह करा</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: BLOGS & KNOWLEDGE ARTICLES MANAGEMENT */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-extrabold text-[18px] text-[#166534] flex items-center gap-2">
                <LucideIcon name="menu_book" className="text-[22px] text-[#006a4e]" />
                <span>ब्लॉग व माहिती लेख व्यवस्थापन </span>
              </h2>
              <p className="text-xs text-[#707974] mt-0.5">
                योजनांचे नियम, डिजिटल सातबारा, पीक सल्ला व शासकीय सेवांवर एसईओ-फ्रेंडली  यूआरएलसह लेख प्रसिद्ध करा.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetBlogs}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#707974] text-xs font-bold flex items-center gap-1.5 transition-colors border border-stone-200 shrink-0"
              title="मूळ अधिकृत लेख पूर्ववत करा"
            >
              <LucideIcon name="restart_alt" className="text-[16px]" />
              <span>डिफॉल्ट लेख रीसेट करा</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
              <h3 className="font-heading font-extrabold text-[16px] text-[#166534] mb-1 flex items-center gap-2">
                <LucideIcon name={editingBlog ? 'edit_note' : 'post_add'} className=" text-[20px] text-[#006a4e]" />
                <span>{editingBlog ? 'लेख संपादित करा' : 'नवीन माहिती लेख तयार करा'}</span>
              </h3>
              <p className="text-xs text-[#707974] mb-4">
                प्रत्येक लेखाला आयडी ऐवजी शीर्षकावर आधारित शोध-अनुकूल  URL नाव दिले जाते.
              </p>

              <form onSubmit={handleSaveBlog} className="space-y-3.5 text-[13px]">
                <div>
                  <label className="block font-bold text-[#2d312e] mb-1">मराठी मुख्य शीर्षक  *</label>
                  <input
                    type="text"
                    required
                    value={blogForm.titleMarathi}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBlogForm({
                        ...blogForm,
                        titleMarathi: val,
                        title: blogForm.title || val,
                        slug: blogForm.slug || generateSlugFromTitle(val)
                      });
                    }}
                    placeholder="उदा. घरकुल योजना २०२६: अर्ज पद्धत व पात्रता"
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2d312e] mb-1">इंग्रजी शीर्षक </label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => {
                      const engTitle = e.target.value;
                      setBlogForm({
                        ...blogForm,
                        title: engTitle,
                        slug: blogForm.slug || generateSlugFromTitle(engTitle)
                      });
                    }}
                    placeholder="उदा. Gharkul Yojana 2026 Online Application Guide"
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>

                {/* SEO Friendly URL Slug (Instead of ID) */}
                <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9]">
                  <label className="block font-bold text-[#166534] text-xs mb-1 flex items-center gap-1">
                    <LucideIcon name="link" className="text-[16px]" />
                    <span>URL नाव / स्लग (SEO Slug - ID ऐवजी शीर्षकाचे नाव) *</span>
                  </label>
                  <div className="flex items-center gap-1 text-xs font-mono text-[#707974] mb-1">
                    <span>https://asgaon.digital/blogs/</span>
                    <strong className="text-[#c2410c]">{blogForm.slug || 'your-url-name'}</strong>
                  </div>
                  <input
                    type="text"
                    required
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: generateSlugFromTitle(e.target.value) })}
                    placeholder="उदा. gharkul-yojana-2026-online-form-asgaon"
                    className="w-full p-2 rounded-lg border border-[#e8e2d9] font-mono text-xs focus:border-[#006a4e] outline-none bg-white font-bold text-[#166534]"
                  />
                  <div className="text-[11px] text-[#707974] mt-1">
                    Google शोध परिणामांमध्ये  वर येण्यासाठी आयडी ऐवजी शीर्षकातील कीवर्ड्स वापरा.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">विभाग  *</label>
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-bold"
                    >
                      <option value="General">सामान्य / इतर </option>
                      <option value="Schemes">शासकीय योजना </option>
                      <option value="Agriculture">कृषी व शेती </option>
                      <option value="Governance">प्रशासन व सेवा </option>
                      <option value="Education">शिक्षण व करिअर </option>
                      <option value="Health">आरोग्य व पोषण </option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">लेखक </label>
                    <input
                      type="text"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      placeholder="उदा. ग्रामसेवक कार्यालय, आसगाव"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#2d312e] mb-1">कव्हर फोटो लिंक </label>
                  <input
                    type="url"
                    value={blogForm.coverImage}
                    onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2d312e] mb-1">थोडक्यात सारांश  *</label>
                  <textarea
                    rows={2}
                    required
                    value={blogForm.excerptMarathi}
                    onChange={(e) => setBlogForm({ ...blogForm, excerptMarathi: e.target.value })}
                    placeholder="वाचकांसाठी २-३ ओळींत लेखाचा मुख्य हेतू..."
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2d312e] mb-1">सविस्तर मजकूर  *</label>
                  <textarea
                    rows={7}
                    required
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    placeholder="मथळे देण्यासाठी '### मथळा' आणि यादीसाठी '- मुद्दा' वापरा..."
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-mono text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2d312e] mb-1">SEO कीवर्ड्स व टॅग्ज (स्वल्पविरामाने द्या)</label>
                  <input
                    type="text"
                    value={blogForm.tagsMarathiString}
                    onChange={(e) => setBlogForm({ ...blogForm, tagsMarathiString: e.target.value })}
                    placeholder="उदा. घरकुल योजना, रमाई आवास, आसगाव कागदपत्रे"
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="blogFeatured"
                    checked={blogForm.isFeatured}
                    onChange={(e) => setBlogForm({ ...blogForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#166534]"
                  />
                  <label htmlFor="blogFeatured" className="font-bold text-[#166534] text-xs cursor-pointer">
                    ठळक लेख म्हणून मुख्य पानावर दाखवा 
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#166534] hover:bg-[#052e16] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <LucideIcon name="publish" className="text-[18px]" />
                    <span>{editingBlog ? 'बदल सेव्ह करा' : 'लेख प्रसिद्ध करा '}</span>
                  </button>
                  {editingBlog && (
                    <button
                      type="button"
                      onClick={() => setEditingBlog(null)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                    >
                      रद्द करा
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-[15px] text-[#166534]">
                  प्रसिद्ध झालेले लेख ({villageBlogs.length})
                </h3>
                <span className="text-xs text-[#707974]">सर्व लेख SEO-अनुकूल शीर्षकाने उपलब्ध</span>
              </div>

              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {villageBlogs.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs hover:border-[#006a4e] transition-all flex flex-col sm:flex-row gap-3 justify-between"
                  >
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                        <img src={b.coverImage} alt={b.titleMarathi} className="w-full h-full object-cover" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#006a4e] bg-[#e6f7f0] px-2 py-0.5 rounded">
                            {b.categoryMarathi}
                          </span>
                          {b.isFeatured && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                              ★ Featured
                            </span>
                          )}
                          <span className="text-[11px] text-[#707974]">{b.publishDate}</span>
                        </div>

                        <h4 className="font-bold text-[#166534] text-[14px] leading-snug mt-1 line-clamp-1">
                          {b.titleMarathi}
                        </h4>

                        <div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-[#c2410c] bg-[#f9f3ea] px-2 py-0.5 rounded w-fit">
                          <LucideIcon name="link" className="text-[13px]" />
                          <span>/blogs/{b.slug}</span>
                        </div>

                        <div className="text-[11px] text-[#707974] mt-1">
                          लेखक: {b.author} • {b.readTimeMinutes} मिनिटे वाचन
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <a
                        href={`/blogs/${b.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-stone-100 text-[#166534] hover:bg-stone-200 transition-colors"
                        title="थेट लेख पहा "
                      >
                        <LucideIcon name="open_in_new" className="text-[18px]" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBlog(b);
                          setBlogForm({
                            title: b.title,
                            titleMarathi: b.titleMarathi,
                            slug: b.slug,
                            excerptMarathi: b.excerptMarathi,
                            content: b.content,
                            category: b.category,
                            author: b.author,
                            authorRoleMarathi: b.authorRoleMarathi,
                            coverImage: b.coverImage,
                            tagsMarathiString: (b.tagsMarathi || []).join(', '),
                            seoKeywords: b.seoKeywords,
                            isFeatured: !!b.isFeatured
                          });
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                        title="संपादित करा"
                      >
                        <LucideIcon name="edit" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlog(b.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="हटवा"
                      >
                        <LucideIcon name="delete" className="text-[18px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[16px] text-[#166534] mb-1 flex items-center gap-2">
              <LucideIcon name={editingAnnouncement ? 'edit_note' : 'add_circle'} className=" text-[20px] text-[#c2410c]" />
              <span>{editingAnnouncement ? 'सूचना संपादित करा' : 'नवीन सूचना किंवा ठराव प्रसिद्ध करा'}</span>
            </h2>
            <p className="text-[12px] text-[#707974] mb-4">
              ग्रामपंचायतीतून मिळालेली नोटीस, परिपत्रक किंवा ग्रामसभेचा निर्णय येथे नोंदवा.
            </p>

            {noticeStatusFeedback && (
              <div className="mb-4 p-3 rounded-xl bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-[12px] font-bold flex items-center gap-2">
                <LucideIcon name="check_circle" className="text-[18px]" />
                <span>{noticeStatusFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSaveNotice} className="flex flex-col gap-3">
              <div>
                <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                  सूचनेचे शीर्षक *
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="उदा. ग्रामसभा बैठक - १५ ऑक्टोबर रोजी सकाळी १० वाजता"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9] focus:outline-none focus:ring-1 focus:ring-[#166534]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">वर्गवारी </label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                  >
                    <option value="ग्रामपंचायत">ग्रामपंचायत </option>
                    <option value="ग्रामसभा">ग्रामसभा </option>
                    <option value="पाणी पुरवठा">पाणी पुरवठा </option>
                    <option value="वीज भारनियमन">वीज भारनियमन </option>
                    <option value="कर व घरपट्टी">कर व घरपट्टी </option>
                    <option value="कृषी व शेती">कृषी व शेती </option>
                    <option value="आरोग्य शिबीर">आरोग्य शिबीर </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">प्राधान्य </label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value)}
                    className="w-full p-2.5 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                  >
                    <option value="NORMAL">सामान्य </option>
                    <option value="URGENT">🚨 तातडीचे </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                  सविस्तर माहिती / ठराव मजकूर *
                </label>
                <textarea
                  required
                  rows={4}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="ग्रामसभेचा विषय, ठिकाण किंवा पाणी पुरवठा बंद राहण्याची वेळ सविस्तर लिहा..."
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9] focus:outline-none focus:ring-1 focus:ring-[#166534]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                  माहिती स्त्रोत / अधिकारी 
                </label>
                <input
                  type="text"
                  value={noticeAuthor}
                  onChange={(e) => setNoticeAuthor(e.target.value)}
                  placeholder="उदा. ग्रामसेवक एस. एन. जाधव / सरपंच कार्यालय"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#166534] text-white font-bold text-[13px] hover:bg-[#052e16] transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <LucideIcon name="publish" className="text-[18px]" />
                  <span>{editingAnnouncement ? 'बदल जतन करा' : 'सूचना प्रसिद्ध करा'}</span>
                </button>
                {editingAnnouncement && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAnnouncement(null);
                      setNoticeTitle('');
                      setNoticeMessage('');
                    }}
                    className="px-4 py-3 rounded-xl bg-[#f3ede4] text-[#1d1b16] font-bold text-[13px]"
                  >
                    रद्द
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List of current notices */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-[16px] text-[#166534]">
                सध्या सक्रिय असलेल्या सूचना ({announcements.length})
              </h2>
              <button
                type="button"
                onClick={loadData}
                className="text-[12px] text-[#006a4e] font-bold hover:underline flex items-center gap-1"
              >
                <LucideIcon name="refresh" className="text-[16px]" />
                <span>रीफ्रेश करा</span>
              </button>
            </div>

            {loadingAnnouncements ? (
              <div className="p-8 text-center text-[#707974] bg-white rounded-2xl border border-[#e8e2d9]">
                माहिती लोड होत आहे...
              </div>
            ) : announcements.length === 0 ? (
              <div className="p-8 text-center text-[#707974] bg-white rounded-2xl border border-[#e8e2d9]">
                अद्याप कोणत्याही सूचना प्रसिद्ध केलेल्या नाहीत. डावीकडील फॉर्म वापरून पहिली सूचना जोडा.
              </div>
            ) : (
              announcements.map((a: any) => (
                <div
                  key={a.id}
                  className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col gap-2 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${a.priority === 'URGENT' ? 'bg-[#fef3c7] text-[#ba1a1a]' : 'bg-[#f3ede4] text-[#404945]'
                        }`}>
                        {a.priority === 'URGENT' ? '🚨 तातडीचे' : a.category || 'सूचना'}
                      </span>
                      <span className="text-[11px] text-[#707974]">
                        स्त्रोत: {a.authorName || 'ग्रामपंचायत कार्यालय'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditNotice(a)}
                        className="p-1.5 rounded-lg text-[#166534] hover:bg-[#f3ede4]"
                        title="संपादित करा"
                      >
                        <LucideIcon name="edit" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNotice(a.id)}
                        className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#fef3c7]/40"
                        title="हटवा"
                      >
                        <LucideIcon name="delete" className="text-[18px]" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-[14px] text-[#1d1b16]">{a.title}</h3>
                  <p className="text-[12px] text-[#404945] line-clamp-3">{a.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: WATER SCHEDULE */}
      {activeTab === 'water' && (
        <div className="flex flex-col gap-6">
          <div className="bg-[#e8f1ec] border border-[#006a4e]/20 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LucideIcon name="water_drop" className="text-[32px] text-[#006a4e]" />
              <div>
                <strong className="text-[14px] text-[#002117] block">
                  आसगाव पाणी पुरवठा थेट नियंत्रण 
                </strong>
                <p className="text-[12px] text-[#166534]">
                  ग्रामपंचायत जलकुंभ व वॉर्डनिहाय वेळा येथे बदला, जेणेकरून गावकऱ्यांना नळाला पाणी कधी येईल हे स्पष्ट समजेल.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {waterSchedules.map((w) => (
              <div key={w.id} className="bg-white p-5 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[15px] text-[#166534]">{w.ward}</h3>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${w.status === 'NORMAL'
                        ? 'bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]'
                        : w.status === 'LOW_PRESSURE'
                          ? 'bg-[#fed7aa] text-[#c2410c]'
                          : 'bg-[#fef3c7] text-[#ba1a1a]'
                      }`}>
                      {w.status === 'NORMAL' ? 'सुरळीत पुरवठा' : w.status === 'LOW_PRESSURE' ? 'कमी दाब' : 'दुरुस्ती चालू'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingWaterWard({ ...w })}
                    className="px-3 py-1.5 rounded-xl bg-[#f9f3ea] hover:bg-[#166534] hover:text-white text-[12px] font-bold text-[#166534] transition-all flex items-center gap-1 border border-[#e8e2d9]"
                  >
                    <LucideIcon name="edit" className="text-[16px]" />
                    <span>वेळ बदला</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] p-3 rounded-xl bg-[#f9f3ea]">
                  <div>
                    <span className="text-[#707974] block text-[11px]">सकाळची वेळ:</span>
                    <strong className="text-[#1d1b16]">{w.morningTime}</strong>
                  </div>
                  <div>
                    <span className="text-[#707974] block text-[11px]">संध्याकाळची वेळ:</span>
                    <strong className="text-[#1d1b16]">{w.eveningTime}</strong>
                  </div>
                </div>

                <div className="text-[12px] text-[#404945]">
                  <span className="text-[#707974]">नोंद: </span>
                  <span>{w.notes}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to edit ward timing */}
          {editingWaterWard && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#e8e2d9]">
                <h3 className="font-heading font-extrabold text-[16px] text-[#166534] mb-3">
                  {editingWaterWard.ward} - वेळ व स्थिती बदला
                </h3>
                <form onSubmit={handleSaveWaterWard} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[12px] font-bold mb-1">सकाळची वेळ (उदा. ०६:३० AM - ०८:०० AM)</label>
                    <input
                      type="text"
                      value={editingWaterWard.morningTime}
                      onChange={(e) => setEditingWaterWard({ ...editingWaterWard, morningTime: e.target.value })}
                      className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-1">संध्याकाळची वेळ</label>
                    <input
                      type="text"
                      value={editingWaterWard.eveningTime}
                      onChange={(e) => setEditingWaterWard({ ...editingWaterWard, eveningTime: e.target.value })}
                      className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-1">पाणी पुरवठा स्थिती</label>
                    <select
                      value={editingWaterWard.status}
                      onChange={(e) => setEditingWaterWard({ ...editingWaterWard, status: e.target.value as any })}
                      className="w-full p-2.5 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                    >
                      <option value="NORMAL">सुरळीत </option>
                      <option value="LOW_PRESSURE">कमी दाब </option>
                      <option value="MAINTENANCE">पाईपलाईन दुरुस्ती </option>
                      <option value="OFF">पाणी पुरवठा बंद </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-1">गावकऱ्यांसाठी सूचना / टीप</label>
                    <input
                      type="text"
                      value={editingWaterWard.notes}
                      onChange={(e) => setEditingWaterWard({ ...editingWaterWard, notes: e.target.value })}
                      className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-[#166534] text-white font-bold text-[13px]"
                    >
                      जतन करा व प्रकाशित करा
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingWaterWard(null)}
                      className="px-4 py-3 rounded-xl bg-[#f3ede4] text-[#1d1b16] font-bold text-[13px]"
                    >
                      रद्द
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SCHEMES MANAGER */}
      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[16px] text-[#166534] mb-1 flex items-center gap-2">
              <LucideIcon name="post_add" className="text-[20px] text-[#c2410c]" />
              <span>{editingScheme ? 'योजना संपादित करा' : 'नवीन सरकारी / कृषी योजना जोडा'}</span>
            </h2>
            <p className="text-[12px] text-[#707974] mb-4">
              कृषी सहाय्यक किंवा ग्रामसेवकाकडून मिळालेल्या योजनेची माहिती, कागदपत्रे व मुदत येथे भरा.
            </p>

            <form onSubmit={handleSaveScheme} className="flex flex-col gap-3">
              <div>
                <label className="block text-[12px] font-bold mb-1">योजनेचे नाव  *</label>
                <input
                  type="text"
                  required
                  value={schemeForm.title}
                  onChange={(e) => setSchemeForm({ ...schemeForm, title: e.target.value })}
                  placeholder="उदा. मागेल त्याला शेततळे योजना"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold mb-1">लाभार्थी वर्ग</label>
                  <select
                    value={schemeForm.category}
                    onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                  >
                    <option value="Farmer">शेतकरी </option>
                    <option value="Student">विद्यार्थी </option>
                    <option value="Solar">सौर ऊर्जा / कुसुम </option>
                    <option value="Women">महिला व बालकल्याण </option>
                    <option value="Health">आरोग्य </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1">योजनेचा फायदा / अनुदान रक्कम </label>
                <input
                  type="text"
                  value={schemeForm.benefits}
                  onChange={(e) => setSchemeForm({ ...schemeForm, benefits: e.target.value })}
                  placeholder="उदा. ₹५०,००० थेट बँक खात्यात अनुदान"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1">पात्रता निकष </label>
                <input
                  type="text"
                  value={schemeForm.eligibility}
                  onChange={(e) => setSchemeForm({ ...schemeForm, eligibility: e.target.value })}
                  placeholder="उदा. स्वतःच्या नावावर किमान ०.६० हेक्टर जमीन असणे आवश्यक"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1">लागणारी कागदपत्रे (अल्पविरामाने वेगळी करा)</label>
                <input
                  type="text"
                  value={schemeForm.documentsRequired}
                  onChange={(e) => setSchemeForm({ ...schemeForm, documentsRequired: e.target.value })}
                  placeholder="७/१२ उतारा, ८-अ, आधार कार्ड, बँक पासबुक, रेशन कार्ड"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1">अर्ज कोठे करावा / अधिकृत लिंक</label>
                <input
                  type="text"
                  value={schemeForm.officialUrl}
                  onChange={(e) => setSchemeForm({ ...schemeForm, officialUrl: e.target.value })}
                  placeholder="https://mahadbt.maharashtra.gov.in किंवा ग्रामपंचायत / सेतू केंद्र"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#166534] text-white font-bold text-[13px]"
                >
                  {editingScheme ? 'बदल जतन करा' : 'योजना प्रकाशित करा'}
                </button>
                {editingScheme && (
                  <button
                    type="button"
                    onClick={() => setEditingScheme(null)}
                    className="px-4 py-3 rounded-xl bg-[#f3ede4] text-[#1d1b16] font-bold text-[13px]"
                  >
                    रद्द
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-3">
            <h2 className="font-heading font-bold text-[16px] text-[#166534]">
              पोर्टलवरील योजनांची यादी ({schemes.length})
            </h2>
            {schemes.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#f3ede4] text-[#166534]">
                      {s.category}
                    </span>
                    <h3 className="font-bold text-[14px] text-[#1d1b16] mt-1">{s.title}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingScheme(s);
                        setSchemeForm({
                          title: s.title,
                          category: s.category || 'Farmer',
                          description: s.description || '',
                          benefits: s.benefits || '',
                          eligibility: s.eligibility || '',
                          documentsRequired: Array.isArray(s.documentsRequired) ? s.documentsRequired.join(', ') : '',
                          officialUrl: s.officialUrl || '',
                          actionLabel: s.actionLabel || 'Check'
                        });
                      }}
                      className="p-1.5 rounded-lg text-[#166534] hover:bg-[#f3ede4]"
                      title="संपादित करा"
                    >
                      <LucideIcon name="edit" className="text-[18px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteScheme(s.id)}
                      className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#fef3c7]/40"
                      title="हटवा"
                    >
                      <LucideIcon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </div>
                <p className="text-[12px] text-[#404945]"><strong>फायदा:</strong> {s.benefits}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VILLAGE CONTACTS */}
      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[16px] text-[#166534] mb-1 flex items-center gap-2">
              <LucideIcon name="person_add" className="text-[20px] text-[#c2410c]" />
              <span>{editingContact ? 'संपर्क संपादित करा' : 'नवीन अधिकारी / कर्मचारी संपर्क जोडा'}</span>
            </h2>
            <p className="text-[12px] text-[#707974] mb-4">
              ग्रामसेवक, तलाठी, आशा वर्कर, लाईनमन किंवा डॉक्टरांचा फोन नंबर गावकऱ्यांसाठी उपलब्ध करा.
            </p>

            <form onSubmit={handleSaveContact} className="flex flex-col gap-3">
              <div>
                <label className="block text-[12px] font-bold mb-1">पूर्ण नाव *</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="उदा. श्री. एस. एन. जाधव"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1">पद / हुद्दा  *</label>
                <input
                  type="text"
                  required
                  value={contactForm.designation}
                  onChange={(e) => setContactForm({ ...contactForm, designation: e.target.value })}
                  placeholder="उदा. ग्रामसेवक "
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold mb-1">मोबाईल नंबर *</label>
                  <input
                    type="tel"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="९८२२१०४५०१"
                    className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold mb-1">वर्ग</label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value as any })}
                    className="w-full p-2.5 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                  >
                    <option value="Administration">प्रशासन </option>
                    <option value="Water & Power">पाणी व वीज </option>
                    <option value="Health & Anganwadi">आरोग्य व अंगणवाडी</option>
                    <option value="Agriculture">कृषी </option>
                    <option value="Police & Security">पोलीस व सुरक्षा</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1">कार्यालयीन वेळ / भेटण्याची वेळ</label>
                <input
                  type="text"
                  value={contactForm.officeHours}
                  onChange={(e) => setContactForm({ ...contactForm, officeHours: e.target.value })}
                  placeholder="सकाळी १० ते दुपारी २ (सोमवार ते शुक्रवार)"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1">कार्यालय पत्ता</label>
                <input
                  type="text"
                  value={contactForm.address}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                  placeholder="ग्रामपंचायत कार्यालय, आसगाव"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#166534] text-white font-bold text-[13px]"
                >
                  {editingContact ? 'बदल जतन करा' : 'संपर्क जतन करा'}
                </button>
                {editingContact && (
                  <button
                    type="button"
                    onClick={() => setEditingContact(null)}
                    className="px-4 py-3 rounded-xl bg-[#f3ede4] text-[#1d1b16] font-bold text-[13px]"
                  >
                    रद्द
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-3">
            <h2 className="font-heading font-bold text-[16px] text-[#166534]">
              गावातील महत्त्वाचे संपर्क ({contacts.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contacts.map((c) => (
                <div key={c.id} className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <strong className="text-[14px] text-[#166534] block">{c.name}</strong>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingContact(c);
                            setContactForm({
                              name: c.name,
                              designation: c.designation,
                              phone: c.phone,
                              category: c.category,
                              officeHours: c.officeHours,
                              address: c.address || 'आसगाव'
                            });
                          }}
                          className="p-1 rounded text-[#166534] hover:bg-[#f3ede4]"
                        >
                          <LucideIcon name="edit" className="text-[16px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('हा संपर्क हटवायचा आहे का?')) {
                              saveContacts(contacts.filter((x) => x.id !== c.id));
                            }
                          }}
                          className="p-1 rounded text-[#ba1a1a] hover:bg-[#fef3c7]/40"
                        >
                          <LucideIcon name="delete" className="text-[16px]" />
                        </button>
                      </div>
                    </div>
                    <span className="text-[12px] text-[#c2410c] font-semibold block">{c.designation}</span>
                    <span className="text-[11px] text-[#707974] block mt-1">{c.officeHours}</span>
                  </div>

                  <a
                    href={`tel:${c.phone}`}
                    className="mt-3 py-1.5 px-3 rounded-xl bg-[#f9f3ea] hover:bg-[#166534] hover:text-white text-[#166534] font-bold text-[12px] flex items-center justify-center gap-1.5 transition-colors border border-[#e8e2d9]"
                  >
                    <LucideIcon name="call" className="text-[15px]" />
                    <span>{c.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: VILLAGE DEVELOPMENT WORKS */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[16px] text-[#166534] mb-1 flex items-center gap-2">
              <LucideIcon name="construction" className="text-[20px] text-[#c2410c]" />
              <span>{editingProject ? 'विकासकाम अद्ययावत करा' : 'नवीन विकासकाम किंवा प्रकल्प जोडा'}</span>
            </h2>
            <p className="text-[12px] text-[#707974] mb-4">
              रस्ते काँक्रीटीकरण, गटार लाईन, सोलर दिवे किंवा शाळा दुरुस्तीच्या निधी व कामाची स्थिती गावकऱ्यांना दाखवा.
            </p>

            <form onSubmit={handleSaveProject} className="flex flex-col gap-3">
              <div>
                <label className="block text-[12px] font-bold mb-1">कामाचे नाव  *</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="उदा. मुख्य बाजार रस्ता सिमेंट काँक्रीटीकरण"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold mb-1">मंजूर निधी रक्कम</label>
                  <input
                    type="text"
                    value={projectForm.sanctionedAmount}
                    onChange={(e) => setProjectForm({ ...projectForm, sanctionedAmount: e.target.value })}
                    placeholder="उदा. ₹१२,५०,०००"
                    className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold mb-1">निधी स्त्रोत / योजना</label>
                  <input
                    type="text"
                    value={projectForm.fundSource}
                    onChange={(e) => setProjectForm({ ...projectForm, fundSource: e.target.value })}
                    placeholder="१५ वा वित्त आयोग / DPDC"
                    className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold mb-1">प्रगती टक्केवारी: {projectForm.progressPercent}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={projectForm.progressPercent}
                    onChange={(e) => setProjectForm({ ...projectForm, progressPercent: Number(e.target.value) })}
                    className="w-full accent-[#166534]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold mb-1">सद्यस्थिती </label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                    className="w-full p-2 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                  >
                    <option value="PLANNING">नियोजन / मंजुरी टप्पा </option>
                    <option value="IN_PROGRESS">काम चालू </option>
                    <option value="COMPLETED">काम पूर्ण </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1">अपेक्षित पूर्ण होण्याची तारीख</label>
                <input
                  type="text"
                  value={projectForm.targetDate}
                  onChange={(e) => setProjectForm({ ...projectForm, targetDate: e.target.value })}
                  placeholder="१५ नोव्हेंबर २०२६"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#166534] text-white font-bold text-[13px]"
                >
                  {editingProject ? 'बदल जतन करा' : 'विकासकाम जतन करा'}
                </button>
                {editingProject && (
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-3 rounded-xl bg-[#f3ede4] text-[#1d1b16] font-bold text-[13px]"
                  >
                    रद्द
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-3">
            <h2 className="font-heading font-bold text-[16px] text-[#166534]">
              गावातील विकासकामे व पारदर्शकता ट्रॅकर ({projects.length})
            </h2>
            {projects.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${p.status === 'COMPLETED' ? 'bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]' : 'bg-[#fed7aa] text-[#c2410c]'
                      }`}>
                      {p.status === 'COMPLETED' ? 'पूर्ण' : 'काम चालू'}
                    </span>
                    <h3 className="font-bold text-[14px] text-[#1d1b16] mt-1">{p.title}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(p);
                        setProjectForm({
                          title: p.title,
                          category: p.category,
                          sanctionedAmount: p.sanctionedAmount,
                          fundSource: p.fundSource,
                          executingAgency: p.executingAgency,
                          progressPercent: p.progressPercent,
                          status: p.status,
                          targetDate: p.targetDate
                        });
                      }}
                      className="p-1 rounded text-[#166534] hover:bg-[#f3ede4]"
                    >
                      <LucideIcon name="edit" className="text-[16px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('हे विकासकाम हटवायचे आहे का?')) {
                          saveProjects(projects.filter((x) => x.id !== p.id));
                        }
                      }}
                      className="p-1 rounded text-[#ba1a1a] hover:bg-[#fef3c7]/40"
                    >
                      <LucideIcon name="delete" className="text-[16px]" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[12px] text-[#707974]">
                  <span>निधी: <strong>{p.sanctionedAmount}</strong> ({p.fundSource})</span>
                  <span>प्रगती: <strong>{p.progressPercent}%</strong></span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#f3ede4] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#166534] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${p.progressPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: GRIEVANCES RESOLUTION */}
      {activeTab === 'complaints' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-heading font-bold text-[16px] text-[#166534]">
              गावकऱ्यांनी दाखल केलेल्या तक्रारी व अर्ज ({complaints.length})
            </h2>
            <div className="flex items-center gap-2">
              {['ALL', 'SUBMITTED', 'IN_PROGRESS', 'RESOLVED'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setComplaintFilter(f)}
                  className={`px-3 py-1 rounded-lg text-[12px] font-bold ${complaintFilter === f ? 'bg-[#166534] text-white' : 'bg-[#f3ede4] text-[#404945]'
                    }`}
                >
                  {f === 'ALL' ? 'सर्व' : f === 'SUBMITTED' ? 'नवीन अर्ज' : f === 'IN_PROGRESS' ? 'काम चालू' : 'निवारण झाले'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaints.filter((c) => complaintFilter === 'ALL' || c.status === complaintFilter).map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-black uppercase text-[#c2410c]">{c.trackingNumber || 'KS-REG'}</span>
                      <h3 className="font-bold text-[14px] text-[#1d1b16]">{c.title}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${c.status === 'RESOLVED' ? 'bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]' : 'bg-[#fef3c7] text-[#ba1a1a]'
                      }`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#55605a] mt-2">{c.description}</p>
                  <div className="mt-2 text-[11px] text-[#707974]">
                    गावकऱ्याचे नाव: <strong>{c.citizenName || 'नागरिक'}</strong> • वॉर्ड: <strong>{c.ward || 'वॉर्ड २'}</strong>
                  </div>
                  {c.resolutionNote && (
                    <div className="mt-2 p-2 rounded-lg bg-[#f9f3ea] text-[11px] text-[#166534] border border-[#e8e2d9]">
                      <strong>व्यवस्थापक टीप: </strong> {c.resolutionNote}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedComplaint(c);
                    setResolutionStatus(c.status || 'IN_PROGRESS');
                    setResolutionNote(c.resolutionNote || '');
                  }}
                  className="py-2 px-3 rounded-xl bg-[#166534] text-white text-[12px] font-bold flex items-center justify-center gap-1.5"
                >
                  <LucideIcon name="edit_note" className="text-[16px]" />
                  <span>स्थिती बदला व ग्रामपंचायत कृती नोंदवा</span>
                </button>
              </div>
            ))}
          </div>

          {selectedComplaint && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#e8e2d9]">
                <h3 className="font-heading font-extrabold text-[16px] text-[#166534] mb-3">
                  तक्रार निवारण कृती: {selectedComplaint.title}
                </h3>
                <form onSubmit={handleUpdateComplaintStatus} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[12px] font-bold mb-1">नवीन स्थिती </label>
                    <select
                      value={resolutionStatus}
                      onChange={(e) => setResolutionStatus(e.target.value)}
                      className="w-full p-2.5 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                    >
                      <option value="SUBMITTED">नोंद झाली </option>
                      <option value="IN_PROGRESS">ग्रामपंचायतीत अर्ज दिला / काम चालू </option>
                      <option value="RESOLVED">तक्रार निवारण झाले </option>
                      <option value="REJECTED">रद्द </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold mb-1">गावकऱ्यासाठी माहिती / कृती टीप</label>
                    <textarea
                      rows={3}
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="उदा. ग्रामसेवकांशी चर्चा केली; वायरमनला घटनास्थळी पाठवून काम पूर्ण केले."
                      className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="submit"
                      disabled={updatingComplaint}
                      className="flex-1 py-3 rounded-xl bg-[#166534] text-white font-bold text-[13px]"
                    >
                      {updatingComplaint ? 'जतन होत आहे...' : 'जतन करा'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedComplaint(null)}
                      className="px-4 py-3 rounded-xl bg-[#f3ede4] text-[#1d1b16] font-bold text-[13px]"
                    >
                      रद्द
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: URGENT BROADCAST (PUSH ALERT) */}
      {activeTab === 'broadcast' && (
        <div className="max-w-2xl bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs mx-auto w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#fef3c7] text-[#ba1a1a] flex items-center justify-center shrink-0">
              <LucideIcon name="cell_tower" className="text-[28px]" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-[18px] text-[#166534]">
                तातडीची दवंडी 
              </h2>
              <p className="text-[12px] text-[#707974]">
                सर्व नोंदणीकृत गावकऱ्यांच्या मोबाईल स्क्रीनवर तात्काळ पॉप-अप सूचना पाठवा.
              </p>
            </div>
          </div>

          {pushFeedback && (
            <div className="mb-4 p-3 rounded-xl bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-[12px] font-bold flex items-center gap-2">
              <LucideIcon name="campaign" className="text-[18px]" />
              <span>{pushFeedback}</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="flex flex-col gap-3">
            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">अलर्टचे शीर्षक *</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="🚨 आसगाव तातडीची सूचना..."
                className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">अलर्ट वर्गवारी </label>
              <select
                value={broadcastCategory}
                onChange={(e) => setBroadcastCategory(e.target.value)}
                className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
              >
                <option value="पाणी पुरवठा">पाणी पुरवठा </option>
                <option value="ग्रामसभा">ग्रामसभा बैठक </option>
                <option value="वीज पुरवठा">वीज पुरवठा </option>
                <option value="कृषी सल्ला">कृषी सल्ला व हवामान </option>
                <option value="आरोग्य">आरोग्य शिबीर </option>
                <option value="आपत्कालीन">आपत्कालीन सूचना </option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">अलर्ट मजकूर *</label>
              <textarea
                required
                rows={4}
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                placeholder="गावकऱ्यांना तात्काळ समजण्यासाठी मोजका व स्पष्ट मजकूर लिहा..."
                className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
              />
            </div>

            <button
              type="submit"
              disabled={pushSending}
              className="py-3.5 px-4 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-md transition-all mt-2"
            >
              <LucideIcon name="send" className="text-[20px]" />
              <span>{pushSending ? 'अलर्ट पाठवला जात आहे...' : 'सर्व गावकऱ्यांच्या मोबाईलवर पाठवा'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 9: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-heading font-bold text-[16px] text-[#166534]">
              नोंदणीकृत नागरिक ({users.length})
            </h2>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="नाव किंवा फोन नंबर शोधा..."
              className="p-2 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9] min-w-[220px]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] min-w-[500px]">
              <thead className="bg-[#f9f3ea] text-[#707974] font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">नाव</th>
                  <th className="p-3">फोन</th>
                  <th className="p-3">वॉर्ड</th>
                  <th className="p-3 rounded-r-xl">भूमिका</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3ede4]">
                {users
                  .filter((u) => !userSearch || (u.fullName && u.fullName.toLowerCase().includes(userSearch.toLowerCase())) || (u.phone && u.phone.includes(userSearch)))
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-[#fef9ee]">
                      <td className="p-3 font-semibold text-[#1d1b16]">{u.fullName || 'नागरिक'}</td>
                      <td className="p-3 text-[#55605a]">{u.phone || '-'}</td>
                      <td className="p-3 text-[#55605a]">{u.wardNumber || 'वॉर्ड २'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]">
                          {u.roles ? Array.from(u.roles).join(', ') : 'CITIZEN'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 14: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <AdminLogsSection currentUser={currentUser} />
      )}

      {/* TAB 15: HERO BANNERS & SLIDER CAROUSEL */}
      {activeTab === 'banners' && (
        <AdminBannerManager />
      )}

      {/* TAB 15B: VILLAGE PHOTO GALLERY & SLIDERS */}
      {activeTab === 'gallery' && (
        <AdminGalleryManager />
      )}

      {/* TAB 16: SUPER ADMIN ACCESS CONTROL & ADMIN MANAGEMENT */}
      {activeTab === 'admin_management' && (
        isSuperAdmin ? (
          <AdminManagementSection
            currentUser={currentUser}
            onAuditLog={(action, details) => {
              console.log('Super Admin Action:', action, details);
            }}
          />
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-[#fef3c7] text-center flex flex-col items-center gap-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#fef3c7]/40 text-[#ba1a1a] flex items-center justify-center">
              <LucideIcon name="lock" className="text-[32px]" />
            </div>
            <h3 className="font-heading font-black text-lg text-[#ba1a1a]">मर्यादित प्रवेश </h3>
            <p className="text-xs text-[#55605a] max-w-md leading-relaxed">
              हे पृष्ठ केवळ चीफ सुपर अॅडमिन  साठी राखीव आहे. अतिरिक्त पृष्ठ अधिकारांसाठी मुख्य प्रशासकाशी संपर्क साधा.
            </p>
            <button
              onClick={() => setActiveTab('overview')}
              className="mt-2 px-4 py-2 bg-[#166534] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              📊 मुख्य आढावा पृष्ठावर जा
            </button>
          </div>
        )
      )}
    </div>
  );
};
