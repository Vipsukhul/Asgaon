import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { UserProfileData } from './ProfilePage';
import { Breadcrumb } from '../components/Breadcrumb';
import { sendTestPushNotification } from '../services/pushNotifications';
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
  const [activeTab, setActiveTab] = useState<
    'overview' | 'events' | 'shiksha' | 'transport' | 'blogs' | 'notices' | 'water' | 'schemes' | 'contacts' | 'projects' | 'complaints' | 'broadcast' | 'users'
  >('overview');

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
      Shivshahi: 'शिवशाही (AC)',
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
    sponsoringAgency: 'महाराष्ट्र शासन / केंद्र शासन',
    deadlineText: 'चालू योजना (Active)',
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
  const [adminPhone, setAdminPhone] = useState('9999999999');
  const [adminPassword, setAdminPassword] = useState('Admin@123');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ROLE_SUPER_ADMIN';
  const isAdmin = isSuperAdmin || currentUser.role === 'ADMIN' || currentUser.role === 'ROLE_ADMIN';

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

  // Direct 1-Click Coordinator Activation
  const handleActivateCoordinatorMode = () => {
    localStorage.setItem('dg_auth_token', 'coordinator-dev-token');
    const coordUser = {
      fullName: 'माहिती प्रतिनिधी (Coordinator)',
      phone: '9822104500',
      role: 'ADMIN',
      roles: ['ROLE_ADMIN'],
      ward: 'वॉर्ड २ (गावठाण)',
      village: 'आसगाव, पवनी'
    };
    localStorage.setItem('dg_user', JSON.stringify(coordUser));
    onLoginAsAdmin?.('ADMIN', '9822104500', 'माहिती प्रतिनिधी (Coordinator)');
    setActiveTab('overview');
  };

  // Standard Admin Login
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await api.login(adminPhone.trim(), adminPassword.trim());
      if (res && res.token) {
        localStorage.setItem('dg_auth_token', res.token);
        localStorage.setItem('dg_user', JSON.stringify(res));
        const role = (res.roles && res.roles.length > 0) ? res.roles[0].replace('ROLE_', '') : 'ADMIN';
        onLoginAsAdmin?.(role, res.phone || adminPhone, res.fullName || 'Asgaon Admin');
        setActiveTab('overview');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please check credentials or use 1-click coordinator mode.');
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
      sponsoringAgency: schemeForm.sponsoringAgency.trim(),
      deadlineText: schemeForm.deadlineText.trim(),
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
        sponsoringAgency: 'महाराष्ट्र शासन / केंद्र शासन',
        deadlineText: 'चालू योजना (Active)',
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

  // Unauthenticated / Non-Admin Welcome Screen
  if (!isAdmin) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-[#e8e2d9] p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#003629] text-[#baeed9] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[32px]">edit_calendar</span>
              </div>
              {onExit && (
                <button
                  type="button"
                  onClick={onExit}
                  className="px-3 py-1.5 rounded-xl bg-[#f9f3ea] text-[12px] font-bold text-[#707974] hover:text-[#003629] flex items-center gap-1 border border-[#e8e2d9]"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>सार्वजनिक पोर्टलवर परत जा</span>
                </button>
              )}
            </div>

            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#baeed9] text-[#002117] inline-block mb-2">
              गावकऱ्यांसाठी स्वतंत्र माहिती मंच
            </span>
            <h2 className="font-heading font-extrabold text-[24px] sm:text-[26px] text-[#003629] mb-2">
              आसगाव ग्राम माहिती व डेटा व्यवस्थापन केंद्र
            </h2>
            <p className="text-[13px] text-[#404945] mb-6 leading-relaxed">
              हे व्यासपीठ सरकारी अधिकारी नसून <strong>गावकऱ्यांच्या जनजागृतीसाठी</strong> सुरू केलेले आहे. आपण स्वतः ग्रामपंचायत, पाणी पुरवठा कक्ष किंवा कृषी कार्यालयात जाऊन आणलेली सर्व माहिती, सूचना व योजना येथे सहज भरा व अद्ययावत करा.
            </p>

            {/* Quick 1-Click Action for User */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#f9f3ea] to-[#fff8f0] border border-[#e8e2d9] mb-6 shadow-inner">
              <h3 className="font-bold text-[14px] text-[#003629] mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#a63b00]">bolt</span>
                <span>थेट व्यवस्थापक प्रवेश (1-Click Field Entry)</span>
              </h3>
              <p className="text-[12px] text-[#55605a] mb-3">
                ग्रामपंचायतीत असताना पासवर्ड टाइप न करता थेट माहिती भरण्यासाठी खालील बटण दाबा:
              </p>
              <button
                type="button"
                onClick={handleActivateCoordinatorMode}
                className="w-full py-3.5 px-4 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                <span>माहिती व्यवस्थापन सुरू करा (Enter Portal Manager)</span>
              </button>
            </div>

            {/* Collapsible standard password login */}
            <details className="text-[12px] text-[#707974] cursor-pointer">
              <summary className="font-semibold text-[#003629] hover:underline mb-3">
                किंवा फोन नंबर व पासवर्डने लॉग इन करा
              </summary>
              <div className="mt-3 pt-3 border-t border-[#e8e2d9]">
                {loginError && (
                  <div className="mb-3 p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[12px] font-bold">
                    {loginError}
                  </div>
                )}
                <form onSubmit={handleAdminLoginSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full bg-[#f9f3ea] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9]"
                  />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-[#f9f3ea] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9]"
                  />
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="py-2.5 rounded-xl bg-[#a63b00] text-white font-bold text-[13px]"
                  >
                    {loginLoading ? 'पडताळणी चालू...' : 'लॉग इन करा'}
                  </button>
                </form>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'मुख्य पृष्ठ (Home)', onClick: onExit },
          { label: 'माहिती व डेटा व्यवस्थापन केंद्र (Admin Portal)', active: true }
        ]}
      />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#003629] via-[#004d3b] to-[#1b4d3e] text-white rounded-2xl p-6 shadow-sm border border-[#baeed9]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#baeed9] shadow-inner shrink-0">
            <span className="material-symbols-outlined text-[28px]">edit_note</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-[22px] sm:text-[24px] text-white leading-tight">
                आसगाव ग्राम माहिती व डेटा व्यवस्थापन केंद्र
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#baeed9] text-[#002117]">
                व्यवस्थापक (Coordinator)
              </span>
            </div>
            <p className="text-[12px] text-[#baeed9] font-medium mt-0.5">
              ग्रामपंचायतीतून मिळणारी खरी माहिती गावकऱ्यांपर्यंत पोहोचवणारा स्वतंत्र मंच
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {onExit && (
            <button
              onClick={onExit}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[12px] transition-all flex items-center gap-1.5 border border-white/20"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>सार्वजनिक दृश्य पहा</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-[#ffdad6]/20 hover:bg-[#ffdad6]/30 text-[#ffb4ab] font-bold text-[12px] transition-all flex items-center gap-1.5 border border-[#ffb4ab]/30"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>बाहेर पडा</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#e8e2d9] scrollbar-none">
        {[
          { id: 'overview', icon: 'analytics', label: 'आढावा (Overview)' },
          { id: 'events', icon: 'event', label: `कार्यक्रम व जत्रा (${events.length})` },
          { id: 'shiksha', icon: 'school', label: `शिक्षण व शाळा (${shikshaSchools.length})` },
          { id: 'transport', icon: 'directions_bus', label: `वाहतूक व बसेस (${transportBuses.length})` },
          { id: 'blogs', icon: 'menu_book', label: `ब्लॉग व लेख (${villageBlogs.length})` },
          { id: 'notices', icon: 'campaign', label: `सूचना फलक (${announcements.length})` },
          { id: 'water', icon: 'water_drop', label: 'पाणी पुरवठा' },
          { id: 'schemes', icon: 'description', label: `योजना व्यवस्थापन (${schemes.length})` },
          { id: 'contacts', icon: 'contacts', label: `महत्त्वाचे संपर्क (${contacts.length})` },
          { id: 'projects', icon: 'construction', label: `विकासकामे (${projects.length})` },
          { id: 'complaints', icon: 'support_agent', label: `गावकऱ्यांच्या तक्रारी (${complaints.length})` },
          { id: 'broadcast', icon: 'cell_tower', label: 'तातडीची दवंडी (Push Alert)' },
          { id: 'users', icon: 'group', label: 'गावकऱ्यांची यादी' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3.5 py-2 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${activeTab === t.id
                ? 'bg-[#003629] text-[#baeed9] shadow-xs'
                : 'text-[#55605a] hover:bg-[#f3ede4]'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            <span>{t.label}</span>
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
              <span className="font-heading font-black text-[26px] text-[#003629]">
                {announcements.length}
              </span>
              <span className="text-[10px] text-[#006a4e] block mt-1 font-semibold">सक्रिय सूचना</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#707974] block mb-1">
                सरकारी योजना
              </span>
              <span className="font-heading font-black text-[26px] text-[#a63b00]">
                {schemes.length}
              </span>
              <span className="text-[10px] text-[#a63b00] block mt-1 font-semibold">शेतकरी व नागरिक</span>
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
              <span className="font-heading font-black text-[26px] text-[#003629]">
                {stats.totalCitizens || 1420}
              </span>
              <span className="text-[10px] text-[#006a4e] block mt-1 font-semibold">गावातील लोकसंख्या</span>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-white rounded-2xl border border-[#e8e2d9] p-6 shadow-xs">
            <h2 className="font-heading font-bold text-[16px] text-[#003629] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#a63b00]">bolt</span>
              <span>ग्रामपंचायत भेट दिल्यावर त्वरित करण्याचे काम (Quick Data Entry Shortcuts)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <button
                type="button"
                onClick={() => { setEditingEvent(null); setActiveTab('events'); }}
                className="p-4 rounded-xl bg-[#f9f3ea] hover:bg-[#003629] hover:text-white transition-all text-left group border border-[#e8e2d9]"
              >
                <span className="material-symbols-outlined text-[24px] text-[#006a4e] group-hover:text-[#baeed9] mb-2 block">
                  event
                </span>
                <strong className="block text-[13px] mb-1">नवीन कार्यक्रम / जत्रा जोडा</strong>
                <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                  यात्रा, महाप्रसाद, आरोग्य शिबीर किंवा क्रीडा स्पर्धा
                </p>
              </button>

              <button
                type="button"
                onClick={() => { setEditingSchool(null); setActiveTab('shiksha'); }}
                className="p-4 rounded-xl bg-[#f9f3ea] hover:bg-[#003629] hover:text-white transition-all text-left group border border-[#e8e2d9]"
              >
                <span className="material-symbols-outlined text-[24px] text-[#006a4e] group-hover:text-[#baeed9] mb-2 block">
                  school
                </span>
                <strong className="block text-[13px] mb-1">शाळा व शिक्षण व्यवस्थापन</strong>
                <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                  शाळा, शिष्यवृत्ती, अभ्यासिका व शिकवणी वर्ग
                </p>
              </button>

              <button
                type="button"
                onClick={() => { setEditingAnnouncement(null); setActiveTab('notices'); }}
                className="p-4 rounded-xl bg-[#f9f3ea] hover:bg-[#003629] hover:text-white transition-all text-left group border border-[#e8e2d9]"
              >
                <span className="material-symbols-outlined text-[24px] text-[#003629] group-hover:text-[#baeed9] mb-2 block">
                  campaign
                </span>
                <strong className="block text-[13px] mb-1">नवीन नोटीस / ठराव टाका</strong>
                <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                  ग्रामसभा बैठक, कर भरणा अथवा वीज भारनियमन सूचना
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('water')}
                className="p-4 rounded-xl bg-[#f9f3ea] hover:bg-[#003629] hover:text-white transition-all text-left group border border-[#e8e2d9]"
              >
                <span className="material-symbols-outlined text-[24px] text-[#006a4e] group-hover:text-[#baeed9] mb-2 block">
                  water_drop
                </span>
                <strong className="block text-[13px] mb-1">पाणी पुरवठा वेळ बदला</strong>
                <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                  वॉर्डनिहाय वेळ, टाकीतील पाणी साठा व दुरुस्ती स्थिती
                </p>
              </button>

              <button
                type="button"
                onClick={() => { setEditingScheme(null); setActiveTab('schemes'); }}
                className="p-4 rounded-xl bg-[#f9f3ea] hover:bg-[#003629] hover:text-white transition-all text-left group border border-[#e8e2d9]"
              >
                <span className="material-symbols-outlined text-[24px] text-[#a63b00] group-hover:text-[#baeed9] mb-2 block">
                  description
                </span>
                <strong className="block text-[13px] mb-1">नवीन सरकारी योजना जोडा</strong>
                <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                  कागदपत्रे यादी, अनुदान रक्कम व शेवटची तारीख
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('broadcast')}
                className="p-4 rounded-xl bg-[#f9f3ea] hover:bg-[#003629] hover:text-white transition-all text-left group border border-[#e8e2d9]"
              >
                <span className="material-symbols-outlined text-[24px] text-[#ba1a1a] group-hover:text-[#baeed9] mb-2 block">
                  cell_tower
                </span>
                <strong className="block text-[13px] mb-1">तातडीची दवंडी (Push Alert)</strong>
                <p className="text-[11px] text-[#707974] group-hover:text-white/80">
                  सर्व गावकऱ्यांच्या मोबाईलवर लगेच अलर्ट पाठवा
                </p>
              </button>
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
                <h2 className="font-heading font-extrabold text-[17px] text-[#003629] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[22px] text-[#a63b00]">celebration</span>
                  <span>गावातील कार्यक्रम व जत्रा ({events.length})</span>
                </h2>
                <p className="text-[12px] text-[#707974] mt-0.5">
                  येथील सर्व कार्यक्रम थेट दिनदर्शिका (Events) पानावर व होमपेजवर दिसतात.
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
                className="px-3 py-1.5 bg-[#003629] text-white text-[12px] font-bold rounded-xl hover:bg-[#1b4d3e] transition-colors flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
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
                <span className="material-symbols-outlined text-[42px] text-[#707974]">event_busy</span>
                <p className="text-[14px] font-bold text-[#003629]">अद्याप कोणताही कार्यक्रम जोडलेला नाही</p>
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
                          <span className="bg-[#baeed9] text-[#002117] text-[10px] font-black uppercase px-2 py-0.5 rounded">
                            {evt.badge || 'गावातील कार्यक्रम'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f3ede4] text-[#404945]">
                            {evt.category === 'religious' ? 'धार्मिक / यात्रा' :
                              evt.category === 'health' ? 'आरोग्य शिबीर' :
                                evt.category === 'agriculture' ? 'शेती कार्यशाळा' :
                                  evt.category === 'sports' ? 'क्रीडा स्पर्धा' : evt.category}
                          </span>
                          <span className="text-[11px] font-semibold text-[#a63b00] ml-auto">
                            {evt.eventDate} • {evt.eventTime}
                          </span>
                        </div>
                        <h3 className="font-heading font-extrabold text-[15px] text-[#003629] mb-1">
                          {evt.title}
                        </h3>
                        <p className="text-[12px] text-[#55605a] line-clamp-2 mb-2 leading-relaxed">
                          {evt.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#f3ede4] pt-2 text-[11px]">
                        <div className="flex items-center gap-3 text-[#707974]">
                          <span className="flex items-center gap-1 text-[#a63b00] font-medium">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
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
                            className="px-2.5 py-1 rounded-lg bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#003629] font-bold text-[11px] transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                            <span>संपादित</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a] font-bold text-[11px] transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
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
              <h2 className="font-heading font-extrabold text-[16px] text-[#003629] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#a63b00]">
                  {editingEvent ? 'edit_note' : 'add_circle'}
                </span>
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
                <label className="font-bold text-[#003629] block mb-1">कार्यक्रमाचे नाव (Event Title) *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="उदा. श्री खंडोबा महाराज यात्रा / मोफत आरोग्य शिबीर"
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#003629] block mb-1">श्रेणी (Category) *</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                  >
                    <option value="religious">धार्मिक उत्सव / यात्रा (Religious)</option>
                    <option value="health">आरोग्य शिबीर (Health Camp)</option>
                    <option value="agriculture">शेती कार्यशाळा (Agriculture)</option>
                    <option value="sports">क्रीडा व युवक स्पर्धा (Sports)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#003629] block mb-1">विशेष बॅज (Badge)</label>
                  <input
                    type="text"
                    value={eventForm.badge}
                    onChange={(e) => setEventForm({ ...eventForm, badge: e.target.value })}
                    placeholder="उदा. वार्षिक उत्सव / मोफत सेवा"
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#003629] block mb-1">तारीख (Event Date) *</label>
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
                  <label className="font-bold text-[#003629] block mb-1">वेळ (Event Time)</label>
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
                <label className="font-bold text-[#003629] block mb-1">स्थळ / ठिकाण (Location) *</label>
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
                <label className="font-bold text-[#003629] block mb-1">आयोजक (Organizer)</label>
                <input
                  type="text"
                  value={eventForm.organizer}
                  onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                  placeholder="उदा. ग्रामपंचायत आसगाव / देवस्थान ट्रस्ट"
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#003629] block mb-1">फोटो लिंक (Image URL)</label>
                <input
                  type="url"
                  value={eventForm.imageUrl}
                  onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#003629] block mb-1">कार्यक्रमाचा तपशील व वर्णन (Description)</label>
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
                className="w-full py-2.5 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-1 disabled:opacity-50"
              >
                {savingEvent ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>जतन करत आहे...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>{editingEvent ? 'बदल जतन करा (Update)' : 'कार्यक्रम जोडा (Publish to Calendar)'}</span>
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
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              <span>शाळा व महाविद्यालये ({shikshaSchools.length})</span>
            </button>

            <button
              type="button"
              onClick={() => { setEditingScholarship(null); setShikshaSubTab('scholarships'); }}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${shikshaSubTab === 'scholarships'
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              <span>शिष्यवृत्ती योजना ({shikshaScholarships.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShikshaSubTab('abhyasika')}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${shikshaSubTab === 'abhyasika'
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">local_library</span>
              <span>अभ्यासिका नियंत्रण ({shikshaAbhyasika.availableDesks}/{shikshaAbhyasika.totalDesks} जागा)</span>
            </button>

            <button
              type="button"
              onClick={() => { setEditingTutor(null); setShikshaSubTab('tutors'); }}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${shikshaSubTab === 'tutors'
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">cast_for_education</span>
              <span>शिकवणी व कौशल्य ({shikshaTutors.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShikshaSubTab('requests')}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${shikshaSubTab === 'requests'
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">book_online</span>
              <span>विद्यार्थी आरक्षण अर्ज ({deskRequests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShikshaSubTab('notice')}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${shikshaSubTab === 'notice'
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">campaign</span>
              <span>थेट सूचना पट्टी</span>
            </button>
          </div>

          {/* SUBTAB 1: SCHOOLS & COLLEGES */}
          {shikshaSubTab === 'schools' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-heading font-extrabold text-[16px] text-[#003629] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#006a4e]">
                      {editingSchool ? 'edit' : 'add_circle'}
                    </span>
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
                    <label className="block font-bold text-[#2d312e] mb-1">शाळेचे नाव (School Name) *</label>
                    <input
                      type="text"
                      required
                      value={schoolForm.name}
                      onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                      placeholder="उदा. जि. प. उच्च प्राथमिक शाळा, आसगाव"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">प्रवर्ग (Category)</label>
                      <select
                        value={schoolForm.category}
                        onChange={(e) => setSchoolForm({ ...schoolForm, category: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                      >
                        <option value="High School & Jr College">हायस्कूल व कनिष्ठ महाविद्यालय</option>
                        <option value="Primary School">प्राथमिक शाळा / अंगणवाडी</option>
                        <option value="Technical & ITI">तांत्रिक व आय.टी.आय. (ITI)</option>
                        <option value="Hostel & Lodging">वसतिगृह (Hostel)</option>
                        <option value="Other Institute">इतर शैक्षणिक संस्था</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">लेबल (Badge)</label>
                      <input
                        type="text"
                        value={schoolForm.badge}
                        onChange={(e) => setSchoolForm({ ...schoolForm, badge: e.target.value })}
                        placeholder="उदा. शासनमान्य, अनुदानित"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">वर्ग / इयत्ता (Grades)</label>
                      <input
                        type="text"
                        value={schoolForm.grades}
                        onChange={(e) => setSchoolForm({ ...schoolForm, grades: e.target.value })}
                        placeholder="उदा. १ ली ते १० वी"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">माध्यम (Medium)</label>
                      <input
                        type="text"
                        value={schoolForm.medium}
                        onChange={(e) => setSchoolForm({ ...schoolForm, medium: e.target.value })}
                        placeholder="उदा. मराठी व सेमी-इंग्रजी"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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
                    <label className="block font-bold text-[#2d312e] mb-1">पत्ता (Address)</label>
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
                    <label className="block font-bold text-[#2d312e] mb-1">फोटो लिंक (Image URL)</label>
                    <input
                      type="url"
                      value={schoolForm.imageUrl}
                      onChange={(e) => setSchoolForm({ ...schoolForm, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">सविस्तर माहिती (Description)</label>
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
                    className="w-full py-2.5 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>{editingSchool ? 'बदल जतन करा (Update)' : 'शाळा जोडा (Publish to Portal)'}</span>
                  </button>
                </form>
              </div>

              {/* School List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-[15px] text-[#003629]">
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
                            <span className="text-[10px] uppercase font-black bg-[#003629]/10 text-[#003629] px-2 py-0.5 rounded-full">
                              {school.badge}
                            </span>
                            <span className="text-[11px] text-[#707974]">
                              {school.grades} • {school.medium}
                            </span>
                          </div>
                          <h4 className="font-bold text-[14px] text-[#003629] truncate">{school.name}</h4>
                          <p className="text-[12px] text-[#555] line-clamp-1">{school.description}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#707974]">
                            {school.principalName && (
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">person</span>
                                {school.principalName}
                              </span>
                            )}
                            {school.contactPhone && (
                              <span className="flex items-center gap-1 font-mono">
                                <span className="material-symbols-outlined text-[13px]">call</span>
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
                          className="p-2 rounded-lg bg-[#f0eee8] text-[#003629] hover:bg-[#003629] hover:text-white transition-colors"
                          title="संपादित करा"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSchool(school.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="हटवा"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
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
                  <h2 className="font-heading font-extrabold text-[16px] text-[#003629] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#a63b00]">
                      {editingScholarship ? 'edit' : 'add_circle'}
                    </span>
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
                    <label className="block font-bold text-[#2d312e] mb-1">शिष्यवृत्तीचे नाव (Title) *</label>
                    <input
                      type="text"
                      required
                      value={scholarshipForm.title}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, title: e.target.value })}
                      placeholder="उदा. महाडीबीटी पोस्ट-मॅट्रिक शिष्यवृत्ती"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">प्रवर्ग / टॅग (Badge)</label>
                      <input
                        type="text"
                        value={scholarshipForm.badge}
                        onChange={(e) => setScholarshipForm({ ...scholarshipForm, badge: e.target.value })}
                        placeholder="उदा. POST-MATRIC, GIRLS SCHOLARSHIP"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">अंतिम मुदत (Deadline)</label>
                      <input
                        type="text"
                        value={scholarshipForm.deadline}
                        onChange={(e) => setScholarshipForm({ ...scholarshipForm, deadline: e.target.value })}
                        placeholder="उदा. 15 Nov 2026 किंवा चालू योजना"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">मिळणारा लाभ / रक्कम (Benefit)</label>
                      <input
                        type="text"
                        value={scholarshipForm.benefit}
                        onChange={(e) => setScholarshipForm({ ...scholarshipForm, benefit: e.target.value })}
                        placeholder="उदा. ₹1,200/महिना + फी माफी"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">उत्पन्न मर्यादा (Income Limit)</label>
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
                    <label className="block font-bold text-[#2d312e] mb-1">विभाग / शासन संस्था (Department)</label>
                    <input
                      type="text"
                      value={scholarshipForm.department}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, department: e.target.value })}
                      placeholder="उदा. सामाजिक न्याय व विशेष सहाय्य विभाग"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">अधिकृत वेबसाईट लिंक (Official URL)</label>
                    <input
                      type="url"
                      value={scholarshipForm.officialUrl}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, officialUrl: e.target.value })}
                      placeholder="https://mahadbt.maharashtra.gov.in"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">पात्रता निकष (Eligibility)</label>
                    <input
                      type="text"
                      value={scholarshipForm.eligibility}
                      onChange={(e) => setScholarshipForm({ ...scholarshipForm, eligibility: e.target.value })}
                      placeholder="उदा. आधार बँक लिंक, जातीचा दाखला, उत्पन्न दाखला"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">तपशील व मार्गदर्शक माहिती (Description)</label>
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
                    className="w-full py-2.5 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>{editingScholarship ? 'बदल जतन करा (Update)' : 'शिष्यवृत्ती जोडा (Publish)'}</span>
                  </button>
                </form>
              </div>

              {/* Scholarship List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-[15px] text-[#003629]">
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
                      className="p-4 bg-white rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col justify-between hover:border-[#a63b00]/40 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-black uppercase bg-[#a63b00]/10 text-[#a63b00] px-2 py-0.5 rounded-full">
                            {sch.badge}
                          </span>
                          <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">alarm</span>
                            {sch.deadline}
                          </span>
                        </div>
                        <h4 className="font-bold text-[14px] text-[#003629] mb-1">{sch.title}</h4>
                        <p className="text-[12px] text-[#555] line-clamp-2 mb-2">{sch.description}</p>

                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#fcfbf9] border border-[#f0eee8] text-[11px] mb-2">
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
                          <span className="material-symbols-outlined text-[12px]">open_in_new</span>
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
                            className="p-1.5 rounded-lg bg-[#f0eee8] text-[#003629] hover:bg-[#003629] hover:text-white transition-colors"
                            title="संपादित करा"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteScholarship(sch.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                            title="हटवा"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
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
                <h2 className="font-heading font-extrabold text-[16px] text-[#003629] mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#006a4e]">tune</span>
                  <span>ग्रामपंचायत अभ्यासिका नियंत्रण केंद्र (Digital Study Room)</span>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-[#f8f6f0] border border-[#e8e2d9]">
                      <label className="block font-bold text-[#003629] mb-1">एकूण जागा / टेबल्स (Total Desks)</label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={shikshaAbhyasika.totalDesks}
                        onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, totalDesks: parseInt(e.target.value) || 0 })}
                        className="w-full p-2 rounded-lg border border-[#d8d2c6] bg-white font-mono font-bold text-[16px] text-[#003629]"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <label className="block font-bold text-emerald-900 mb-1">उपलब्ध रिकाम्या जागा (Open Desks)</label>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">वेळ (Daily Timings)</label>
                      <input
                        type="text"
                        value={shikshaAbhyasika.timings}
                        onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, timings: e.target.value })}
                        placeholder="उदा. 06:00 AM – 11:00 PM"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">इंटरनेट / वायफाय गती (Wi-Fi)</label>
                      <input
                        type="text"
                        value={shikshaAbhyasika.wifiSpeed}
                        onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, wifiSpeed: e.target.value })}
                        placeholder="उदा. 100 Mbps BSNL Optical Fiber"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">पुस्तकांची संख्या (Books Count)</label>
                      <input
                        type="text"
                        value={shikshaAbhyasika.bookCount}
                        onChange={(e) => setShikshaAbhyasika({ ...shikshaAbhyasika, bookCount: e.target.value })}
                        placeholder="उदा. 3,200+ Books & Journals"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">व्यवस्थापक / सेवक नाव (Caretaker)</label>
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
                    <label className="block font-bold text-[#2d312e] mb-1">व्यवस्थापक पद (Role)</label>
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
                    className="w-full py-2.5 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>अभ्यासिका बदल जतन करा (Save Study Room Config)</span>
                  </button>
                </form>
              </div>

              {/* Live Preview Card */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-heading font-extrabold text-[15px] text-[#003629]">
                  विद्यार्थ्यांना दिसणारे स्वरूप (Live Preview)
                </h3>
                <div className="p-6 bg-gradient-to-br from-[#003629] to-[#00523e] text-white rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-[11px] font-bold backdrop-blur-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      थेट स्थिती (Live Status)
                    </span>
                    <span className="text-[12px] opacity-80">{shikshaAbhyasika.timings}</span>
                  </div>

                  <h3 className="font-heading font-black text-[18px] mb-2">{shikshaAbhyasika.title}</h3>
                  <p className="text-[12px] opacity-80 mb-5 leading-relaxed">{shikshaAbhyasika.noticeText}</p>

                  <div className="grid grid-cols-2 gap-3 mb-5">
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
                  <h2 className="font-heading font-extrabold text-[16px] text-[#003629] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#006a4e]">
                      {editingTutor ? 'edit' : 'add_circle'}
                    </span>
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
                    <label className="block font-bold text-[#2d312e] mb-1">वर्ग / संस्थेचे नाव (Name) *</label>
                    <input
                      type="text"
                      required
                      value={tutorForm.name}
                      onChange={(e) => setTutorForm({ ...tutorForm, name: e.target.value })}
                      placeholder="उदा. ज्ञानदीप कोचिंग क्लासेस किंवा PMKVY केंद्र"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">प्रवर्ग / गट (Category)</label>
                      <input
                        type="text"
                        value={tutorForm.category}
                        onChange={(e) => setTutorForm({ ...tutorForm, category: e.target.value })}
                        placeholder="उदा. इ. ५ ते १० वी, कौशल्य केंद्र"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">फी रचना (Fees Info)</label>
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">वर्गाची वेळ (Timings)</label>
                      <input
                        type="text"
                        value={tutorForm.timing}
                        onChange={(e) => setTutorForm({ ...tutorForm, timing: e.target.value })}
                        placeholder="उदा. 06:30 AM - 08:30 AM"
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">संपर्क नंबर (Phone)</label>
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
                    <label className="block font-bold text-[#2d312e] mb-1">पत्ता (Address)</label>
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
                    className="w-full py-2.5 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>{editingTutor ? 'बदल जतन करा (Update)' : 'वर्ग जोडा (Publish)'}</span>
                  </button>
                </form>
              </div>

              {/* Tutors List */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-heading font-extrabold text-[15px] text-[#003629]">
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
                        <h4 className="font-bold text-[14px] text-[#003629]">{tut.name}</h4>
                        <p className="text-[12px] text-[#555] mt-0.5">{tut.subjects}</p>
                        <div className="flex items-center gap-4 mt-2 text-[11px] text-[#707974]">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">schedule</span>
                            {tut.timing}
                          </span>
                          {tut.phone && (
                            <span className="flex items-center gap-1 font-mono font-bold">
                              <span className="material-symbols-outlined text-[13px]">call</span>
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
                          className="p-1.5 rounded-lg bg-[#f0eee8] text-[#003629] hover:bg-[#003629] hover:text-white transition-colors"
                          title="संपादित करा"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTutor(tut.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="हटवा"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
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
                  <h2 className="font-heading font-extrabold text-[16px] text-[#003629] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#006a4e]">book_online</span>
                    <span>विद्यार्थी अभ्यासिका आरक्षण अर्ज (Desk Reservations)</span>
                  </h2>
                  <p className="text-[12px] text-[#707974] mt-0.5">
                    पोर्टलवरून विद्यार्थ्यांनी नोंदवलेले अभ्यासिका डेस्क अर्ज.
                  </p>
                </div>
                <span className="text-[12px] font-bold bg-[#f4efe8] px-3 py-1 rounded-full text-[#003629]">
                  एकूण अर्ज: {deskRequests.length}
                </span>
              </div>

              {deskRequests.length === 0 ? (
                <div className="text-center py-12 text-[#707974]">
                  <span className="material-symbols-outlined text-[48px] text-[#ccc] mb-2 block">
                    event_seat
                  </span>
                  <p className="font-bold text-[14px]">अद्याप कोणतेही डेस्क आरक्षण अर्ज आलेले नाहीत</p>
                  <p className="text-[12px] mt-1">विद्यार्थी /shiksha पेजवरून डेस्क बुक करतात तेव्हा ते येथे दिसतील.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[12px]">
                    <thead className="bg-[#fcfbf9] text-[#707974] uppercase text-[11px] font-black border-b border-[#e8e2d9]">
                      <tr>
                        <th className="p-3">विद्यार्थ्याचे नाव</th>
                        <th className="p-3">परीक्षा / ध्येय</th>
                        <th className="p-3">वेळ (Time Slot)</th>
                        <th className="p-3">डेस्क क्र.</th>
                        <th className="p-3">मोबाईल नंबर</th>
                        <th className="p-3">तारीख</th>
                        <th className="p-3">कृती (Action)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0eee8]">
                      {deskRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-[#fcfbf9]">
                          <td className="p-3 font-bold text-[#003629]">{req.studentName}</td>
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
                <h2 className="font-heading font-extrabold text-[16px] text-[#003629] mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#006a4e]">campaign</span>
                  <span>शिक्षण सूचना पट्टी संपादन (Live Notice Banner)</span>
                </h2>
                <p className="text-[12px] text-[#707974] mb-4">
                  ही सूचना /shiksha पानाच्या सर्वात वरती ठळकपणे प्रदर्शित केली जाईल.
                </p>

                <form onSubmit={handleSaveShikshaNotice} className="space-y-4 text-[13px]">
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">मुख्य ठळक सूचना (Headline) *</label>
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
                    <label className="block font-bold text-[#2d312e] mb-1">दुय्यम माहिती / उपशीर्षक (Subtext)</label>
                    <input
                      type="text"
                      value={shikshaNotice.subtext}
                      onChange={(e) => setShikshaNotice({ ...shikshaNotice, subtext: e.target.value })}
                      placeholder="उदा. ग्रामपंचायत हॉलमध्ये मोफत अभ्यासिका डेस्क उपलब्ध (४० जागा)"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">बटन मजकूर (Action Button Label)</label>
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
                      className="w-4 h-4 text-[#003629] rounded"
                    />
                    <label htmlFor="noticeActiveToggle" className="font-bold text-[#2d312e] cursor-pointer">
                      पानावर ही सूचना पट्टी सक्रिय ठेवा (Show on Shiksha Page)
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>सूचना जतन करा (Save & Publish)</span>
                  </button>
                </form>
              </div>

              {/* Notice Preview */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="font-heading font-extrabold text-[15px] text-[#003629]">
                  थेट सूचना पट्टीचे थेट स्वरूप (Preview)
                </h3>
                {shikshaNotice.isActive ? (
                  <div className="bg-[#003629] text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px] text-amber-300">notifications_active</span>
                      </div>
                      <div>
                        <div className="font-bold text-[13px]">{shikshaNotice.headline}</div>
                        <div className="text-[11px] opacity-80">{shikshaNotice.subtext}</div>
                      </div>
                    </div>
                    {shikshaNotice.actionLabel && (
                      <span className="px-3 py-1.5 bg-white text-[#003629] rounded-xl text-[12px] font-black shrink-0">
                        {shikshaNotice.actionLabel}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#707974] bg-white rounded-2xl border border-dashed border-[#ccc]">
                    <span className="material-symbols-outlined text-[36px] mb-2 block">visibility_off</span>
                    <p className="font-bold text-[13px]">सूचना पट्टी सध्या निष्क्रिय (Hidden) आहे</p>
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
                    ? 'bg-[#003629] text-white shadow-xs'
                    : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                <span>एसटी बसेस वेळापत्रक ({transportBuses.length})</span>
              </button>

              <button
                type="button"
                onClick={() => { setEditingAuto(null); setTransportSubTab('autos'); }}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${transportSubTab === 'autos'
                    ? 'bg-[#003629] text-white shadow-xs'
                    : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">local_taxi</span>
                <span>गावातील रिक्षा व टॅक्सी चालक ({transportAutos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setTransportSubTab('depots')}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${transportSubTab === 'depots'
                    ? 'bg-[#003629] text-white shadow-xs'
                    : 'bg-[#f4efe8] text-[#555] hover:bg-[#eae2d7]'
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
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
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>डिफॉल्ट बसेस रीसेट करा</span>
              </button>
            )}
          </div>

          {/* SUBTAB 1: BUSES MANAGEMENT */}
          {transportSubTab === 'buses' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Column */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
                <h2 className="font-heading font-extrabold text-[16px] text-[#003629] mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#006a4e]">
                    {editingBus ? 'edit_calendar' : 'add_circle'}
                  </span>
                  <span>{editingBus ? 'बस फेरी संपादित करा' : 'नवीन एसटी बस फेरी जोडा'}</span>
                </h2>
                <p className="text-[12px] text-[#707974] mb-4">
                  पवनी, भंडारा, नागपूर किंवा साकोली मार्गावरील नवीन बस फेरी येथे नोंदवा.
                </p>

                <form onSubmit={handleSaveBus} className="space-y-3.5 text-[13px]">
                  <div className="grid grid-cols-2 gap-3">
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
                      <label className="block font-bold text-[#2d312e] mb-1">बस प्रकार (Type) *</label>
                      <select
                        value={busForm.busType}
                        onChange={(e) => setBusForm({ ...busForm, busType: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-bold"
                      >
                        <option value="Lalpari">साधी लालपरी (Ordinary ST)</option>
                        <option value="Asiad">निमआराम (Asiad / Semi-Luxury)</option>
                        <option value="Shivshahi">शिवशाही (Shivshahi AC)</option>
                        <option value="Ordinary">स्थानिक लोकल फेरी</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">सुरुवात (Source Marathi) *</label>
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
                      <label className="block font-bold text-[#2d312e] mb-1">गंतव्य (Destination Marathi) *</label>
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

                  <div className="grid grid-cols-3 gap-2">
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#2d312e] mb-1">एसटी आगार (Depot) *</label>
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
                  <div className="grid grid-cols-3 gap-2 bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9]">
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
                      <label className="block font-bold text-[#a63b00] text-xs mb-1">महिला (५०%)</label>
                      <input
                        type="number"
                        required
                        value={busForm.fareMahila}
                        onChange={(e) => setBusForm({ ...busForm, fareMahila: Number(e.target.value) || 0 })}
                        className="w-full p-2 rounded-lg border border-[#e8e2d9] font-bold text-center text-[#a63b00]"
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
                      className="flex-1 py-2.5 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">save</span>
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
                  <h3 className="font-heading font-extrabold text-[15px] text-[#003629]">
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
                          <span className="font-mono font-bold text-sm bg-[#003629] text-[#baeed9] px-2.5 py-0.5 rounded-lg">
                            {bus.departureTime}
                          </span>
                          <span className="text-xs font-bold text-[#006a4e] bg-[#e6f7f0] px-2 py-0.5 rounded">
                            {bus.busTypeMarathi}
                          </span>
                          <span className="text-xs text-[#707974]">({bus.depotMarathi})</span>
                        </div>
                        <div className="font-bold text-[#1d1b16] text-[15px] flex items-center gap-1.5 mt-1">
                          <span>{bus.sourceMarathi}</span>
                          <span className="text-[#a63b00]">➜</span>
                          <span className="text-[#a63b00]">{bus.destinationMarathi}</span>
                          <span className="text-xs font-normal text-[#707974] ml-2">~{bus.approxArrivalTime}</span>
                        </div>
                        <div className="text-[11px] text-[#707974] mt-1">
                          थांबे: {(bus.viaMarathi || []).join(' • ')}
                        </div>
                        <div className="text-[11px] font-bold text-[#003629] mt-1 flex gap-3">
                          <span>भाडे: ₹{bus.fareGeneral}</span>
                          <span className="text-[#a63b00]">महिला ५०%: ₹{bus.fareMahila}</span>
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
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBus(bus.id)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="हटवा"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
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
                <h2 className="font-heading font-extrabold text-[16px] text-[#003629] mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#006a4e]">
                    {editingAuto ? 'edit' : 'add_circle'}
                  </span>
                  <span>{editingAuto ? 'चालक माहिती संपादन' : 'नवीन रिक्षा / टॅक्सी चालक जोडा'}</span>
                </h2>
                <p className="text-[12px] text-[#707974] mb-4">
                  आसगाव चौकातील स्थानिक रिक्षा किंवा व्हॅन चालकाचा नंबर व भाडे येथे नोंदवा.
                </p>

                <form onSubmit={handleSaveAuto} className="space-y-3.5 text-[13px]">
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">चालकाचे नाव (Marathi) *</label>
                    <input
                      type="text"
                      required
                      value={autoForm.nameMarathi}
                      onChange={(e) => setAutoForm({ ...autoForm, nameMarathi: e.target.value, name: e.target.value })}
                      placeholder="उदा. संजय मेश्राम"
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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
                        <option value="Auto Rickshaw">रिक्षा (Auto Rickshaw)</option>
                        <option value="Maxi Cab / 4-Wheeler">मॅक्सी कॅब / जीप</option>
                        <option value="Eco Van">इको व्हॅन (Eco Van)</option>
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
                      className="w-4 h-4 accent-[#003629]"
                    />
                    <label htmlFor="autoAvailable" className="font-bold text-[#003629] text-xs cursor-pointer">
                      सध्या सेवेत उपलब्ध (Available)
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">save</span>
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
                <h3 className="font-heading font-extrabold text-[15px] text-[#003629]">
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
                          <span className="font-bold text-[15px] text-[#003629]">{driver.nameMarathi}</span>
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
                        <div className="text-xs font-bold text-[#a63b00] mt-0.5">
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
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAuto(driver.id)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="हटवा"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
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
              <h2 className="font-heading font-extrabold text-[16px] text-[#003629] mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#006a4e]">phone_in_talk</span>
                <span>एसटी आगार व मदत केंद्र दूरध्वनी व्यवस्थापन</span>
              </h2>
              <p className="text-[12px] text-[#707974]">
                पवनी व भंडारा एसटी आगार तसेच २४×७ नियंत्रण कक्षाचे थेट फोन क्रमांक येथे संपादित करा.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {transportDepots.map((depot, idx) => (
                  <div key={idx} className="bg-[#f9f3ea] p-4 rounded-2xl border border-[#e8e2d9] space-y-3">
                    <h3 className="font-bold text-[#003629] text-[14px]">{depot.depotNameMarathi}</h3>
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
                  className="px-5 py-2.5 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 text-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
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
              <h2 className="font-heading font-extrabold text-[18px] text-[#003629] flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-[#006a4e]">menu_book</span>
                <span>ब्लॉग व माहिती लेख व्यवस्थापन (Knowledge Articles & Guides)</span>
              </h2>
              <p className="text-xs text-[#707974] mt-0.5">
                योजनांचे नियम, डिजिटल सातबारा, पीक सल्ला व शासकीय सेवांवर एसईओ-फ्रेंडली (SEO-Friendly) यूआरएलसह लेख प्रसिद्ध करा.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetBlogs}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#707974] text-xs font-bold flex items-center gap-1.5 transition-colors border border-stone-200 shrink-0"
              title="मूळ अधिकृत लेख पूर्ववत करा"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>डिफॉल्ट लेख रीसेट करा</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
              <h3 className="font-heading font-extrabold text-[16px] text-[#003629] mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#006a4e]">
                  {editingBlog ? 'edit_note' : 'post_add'}
                </span>
                <span>{editingBlog ? 'लेख संपादित करा' : 'नवीन माहिती लेख तयार करा'}</span>
              </h3>
              <p className="text-xs text-[#707974] mb-4">
                प्रत्येक लेखाला आयडी ऐवजी शीर्षकावर आधारित शोध-अनुकूल (SEO Friendly) URL नाव दिले जाते.
              </p>

              <form onSubmit={handleSaveBlog} className="space-y-3.5 text-[13px]">
                <div>
                  <label className="block font-bold text-[#2d312e] mb-1">मराठी मुख्य शीर्षक (Marathi Title) *</label>
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
                  <label className="block font-bold text-[#2d312e] mb-1">इंग्रजी शीर्षक (English / SEO Title)</label>
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
                  <label className="block font-bold text-[#003629] text-xs mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">link</span>
                    <span>URL नाव / स्लग (SEO Slug - ID ऐवजी शीर्षकाचे नाव) *</span>
                  </label>
                  <div className="flex items-center gap-1 text-xs font-mono text-[#707974] mb-1">
                    <span>https://asgaon.digital/blogs/</span>
                    <strong className="text-[#a63b00]">{blogForm.slug || 'your-url-name'}</strong>
                  </div>
                  <input
                    type="text"
                    required
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: generateSlugFromTitle(e.target.value) })}
                    placeholder="उदा. gharkul-yojana-2026-online-form-asgaon"
                    className="w-full p-2 rounded-lg border border-[#e8e2d9] font-mono text-xs focus:border-[#006a4e] outline-none bg-white font-bold text-[#003629]"
                  />
                  <div className="text-[11px] text-[#707974] mt-1">
                    Google शोध परिणामांमध्ये (SEO) वर येण्यासाठी आयडी ऐवजी शीर्षकातील कीवर्ड्स वापरा.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">विभाग (Category) *</label>
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-bold"
                    >
                      <option value="General">सामान्य / इतर (General)</option>
                      <option value="Schemes">शासकीय योजना (Schemes)</option>
                      <option value="Agriculture">कृषी व शेती (Agriculture)</option>
                      <option value="Governance">प्रशासन व सेवा (Governance)</option>
                      <option value="Education">शिक्षण व करिअर (Education)</option>
                      <option value="Health">आरोग्य व पोषण (Health)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#2d312e] mb-1">लेखक (Author)</label>
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
                  <label className="block font-bold text-[#2d312e] mb-1">कव्हर फोटो लिंक (Cover Image URL)</label>
                  <input
                    type="url"
                    value={blogForm.coverImage}
                    onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#006a4e] outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2d312e] mb-1">थोडक्यात सारांश (Short Excerpt) *</label>
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
                  <label className="block font-bold text-[#2d312e] mb-1">सविस्तर मजकूर (Full Article Content) *</label>
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
                    className="w-4 h-4 accent-[#003629]"
                  />
                  <label htmlFor="blogFeatured" className="font-bold text-[#003629] text-xs cursor-pointer">
                    ठळक लेख म्हणून मुख्य पानावर दाखवा (Featured Spotlight)
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">publish</span>
                    <span>{editingBlog ? 'बदल सेव्ह करा' : 'लेख प्रसिद्ध करा (Publish)'}</span>
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
                <h3 className="font-heading font-extrabold text-[15px] text-[#003629]">
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

                        <h4 className="font-bold text-[#003629] text-[14px] leading-snug mt-1 line-clamp-1">
                          {b.titleMarathi}
                        </h4>

                        <div className="mt-1 flex items-center gap-1 font-mono text-[11px] text-[#a63b00] bg-[#f9f3ea] px-2 py-0.5 rounded w-fit">
                          <span className="material-symbols-outlined text-[13px]">link</span>
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
                        className="p-2 rounded-xl bg-stone-100 text-[#003629] hover:bg-stone-200 transition-colors"
                        title="थेट लेख पहा (Preview URL)"
                      >
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
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
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlog(b.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="हटवा"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
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
            <h2 className="font-heading font-extrabold text-[16px] text-[#003629] mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#a63b00]">
                {editingAnnouncement ? 'edit_note' : 'add_circle'}
              </span>
              <span>{editingAnnouncement ? 'सूचना संपादित करा' : 'नवीन सूचना किंवा ठराव प्रसिद्ध करा'}</span>
            </h2>
            <p className="text-[12px] text-[#707974] mb-4">
              ग्रामपंचायतीतून मिळालेली नोटीस, परिपत्रक किंवा ग्रामसभेचा निर्णय येथे नोंदवा.
            </p>

            {noticeStatusFeedback && (
              <div className="mb-4 p-3 rounded-xl bg-[#baeed9] text-[#002117] text-[12px] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{noticeStatusFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSaveNotice} className="flex flex-col gap-3">
              <div>
                <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                  सूचनेचे शीर्षक (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="उदा. ग्रामसभा बैठक - १५ ऑक्टोबर रोजी सकाळी १० वाजता"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9] focus:outline-none focus:ring-1 focus:ring-[#003629]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">वर्गवारी (Category)</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                  >
                    <option value="ग्रामपंचायत">ग्रामपंचायत (General)</option>
                    <option value="ग्रामसभा">ग्रामसभा (Gram Sabha)</option>
                    <option value="पाणी पुरवठा">पाणी पुरवठा (Water Supply)</option>
                    <option value="वीज भारनियमन">वीज भारनियमन (Power/MSEDCL)</option>
                    <option value="कर व घरपट्टी">कर व घरपट्टी (Taxation)</option>
                    <option value="कृषी व शेती">कृषी व शेती (Agriculture)</option>
                    <option value="आरोग्य शिबीर">आरोग्य शिबीर (Health Camp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">प्राधान्य (Priority)</label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value)}
                    className="w-full p-2.5 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                  >
                    <option value="NORMAL">सामान्य (Normal)</option>
                    <option value="URGENT">🚨 तातडीचे (Urgent Alert)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                  सविस्तर माहिती / ठराव मजकूर (Message) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="ग्रामसभेचा विषय, ठिकाण किंवा पाणी पुरवठा बंद राहण्याची वेळ सविस्तर लिहा..."
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9] focus:outline-none focus:ring-1 focus:ring-[#003629]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                  माहिती स्त्रोत / अधिकारी (Author / Source)
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
                  className="flex-1 py-3 rounded-xl bg-[#003629] text-white font-bold text-[13px] hover:bg-[#1b4d3e] transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">publish</span>
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
              <h2 className="font-heading font-bold text-[16px] text-[#003629]">
                सध्या सक्रिय असलेल्या सूचना ({announcements.length})
              </h2>
              <button
                type="button"
                onClick={loadData}
                className="text-[12px] text-[#006a4e] font-bold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
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
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${a.priority === 'URGENT' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#f3ede4] text-[#404945]'
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
                        className="p-1.5 rounded-lg text-[#003629] hover:bg-[#f3ede4]"
                        title="संपादित करा"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNotice(a.id)}
                        className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                        title="हटवा"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
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
          <div className="bg-[#baeed9]/40 border border-[#006a4e]/20 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[32px] text-[#006a4e]">water_drop</span>
              <div>
                <strong className="text-[14px] text-[#002117] block">
                  आसगाव पाणी पुरवठा थेट नियंत्रण (Water Rostering Manager)
                </strong>
                <p className="text-[12px] text-[#003629]">
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
                    <h3 className="font-bold text-[15px] text-[#003629]">{w.ward}</h3>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${w.status === 'NORMAL'
                        ? 'bg-[#baeed9] text-[#002117]'
                        : w.status === 'LOW_PRESSURE'
                          ? 'bg-[#ffdbce] text-[#a63b00]'
                          : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}>
                      {w.status === 'NORMAL' ? 'सुरळीत पुरवठा' : w.status === 'LOW_PRESSURE' ? 'कमी दाब' : 'दुरुस्ती चालू'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingWaterWard({ ...w })}
                    className="px-3 py-1.5 rounded-xl bg-[#f9f3ea] hover:bg-[#003629] hover:text-white text-[12px] font-bold text-[#003629] transition-all flex items-center gap-1 border border-[#e8e2d9]"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    <span>वेळ बदला</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[12px] p-3 rounded-xl bg-[#f9f3ea]">
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
                <h3 className="font-heading font-extrabold text-[16px] text-[#003629] mb-3">
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
                      <option value="NORMAL">सुरळीत (Normal Pressure)</option>
                      <option value="LOW_PRESSURE">कमी दाब (Low Pressure / Valve Issue)</option>
                      <option value="MAINTENANCE">पाईपलाईन दुरुस्ती (Maintenance)</option>
                      <option value="OFF">पाणी पुरवठा बंद (Off)</option>
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
                      className="flex-1 py-3 rounded-xl bg-[#003629] text-white font-bold text-[13px]"
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
            <h2 className="font-heading font-extrabold text-[16px] text-[#003629] mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#a63b00]">post_add</span>
              <span>{editingScheme ? 'योजना संपादित करा' : 'नवीन सरकारी / कृषी योजना जोडा'}</span>
            </h2>
            <p className="text-[12px] text-[#707974] mb-4">
              कृषी सहाय्यक किंवा ग्रामसेवकाकडून मिळालेल्या योजनेची माहिती, कागदपत्रे व मुदत येथे भरा.
            </p>

            <form onSubmit={handleSaveScheme} className="flex flex-col gap-3">
              <div>
                <label className="block text-[12px] font-bold mb-1">योजनेचे नाव (Scheme Title) *</label>
                <input
                  type="text"
                  required
                  value={schemeForm.title}
                  onChange={(e) => setSchemeForm({ ...schemeForm, title: e.target.value })}
                  placeholder="उदा. मागेल त्याला शेततळे योजना"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold mb-1">लाभार्थी वर्ग</label>
                  <select
                    value={schemeForm.category}
                    onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                  >
                    <option value="Farmer">शेतकरी (Farmer)</option>
                    <option value="Student">विद्यार्थी (Student)</option>
                    <option value="Solar">सौर ऊर्जा / कुसुम (Solar)</option>
                    <option value="Women">महिला व बालकल्याण (Women)</option>
                    <option value="Health">आरोग्य (Health)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold mb-1">शेवटची तारीख / मुदत</label>
                  <input
                    type="text"
                    value={schemeForm.deadlineText}
                    onChange={(e) => setSchemeForm({ ...schemeForm, deadlineText: e.target.value })}
                    placeholder="उदा. ३१ ऑक्टोबर २०२६"
                    className="w-full p-2.5 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1">योजनेचा फायदा / अनुदान रक्कम (Benefits)</label>
                <input
                  type="text"
                  value={schemeForm.benefits}
                  onChange={(e) => setSchemeForm({ ...schemeForm, benefits: e.target.value })}
                  placeholder="उदा. ₹५०,००० थेट बँक खात्यात अनुदान"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold mb-1">पात्रता निकष (Eligibility)</label>
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
                  className="flex-1 py-3 rounded-xl bg-[#003629] text-white font-bold text-[13px]"
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
            <h2 className="font-heading font-bold text-[16px] text-[#003629]">
              पोर्टलवरील योजनांची यादी ({schemes.length})
            </h2>
            {schemes.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#f3ede4] text-[#003629]">
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
                          sponsoringAgency: s.sponsoringAgency || '',
                          deadlineText: s.deadlineText || '',
                          description: s.description || '',
                          benefits: s.benefits || '',
                          eligibility: s.eligibility || '',
                          documentsRequired: Array.isArray(s.documentsRequired) ? s.documentsRequired.join(', ') : '',
                          officialUrl: s.officialUrl || '',
                          actionLabel: s.actionLabel || 'Check'
                        });
                      }}
                      className="p-1.5 rounded-lg text-[#003629] hover:bg-[#f3ede4]"
                      title="संपादित करा"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteScheme(s.id)}
                      className="p-1.5 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                      title="हटवा"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-[12px] text-[#404945]"><strong>फायदा:</strong> {s.benefits}</p>
                <div className="text-[11px] text-[#707974]">
                  मुदत: <strong>{s.deadlineText}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VILLAGE CONTACTS */}
      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[16px] text-[#003629] mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#a63b00]">person_add</span>
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
                <label className="block text-[12px] font-bold mb-1">पद / हुद्दा (Designation) *</label>
                <input
                  type="text"
                  required
                  value={contactForm.designation}
                  onChange={(e) => setContactForm({ ...contactForm, designation: e.target.value })}
                  placeholder="उदा. ग्रामसेवक (Gram Sevak)"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    <option value="Administration">प्रशासन (Admin)</option>
                    <option value="Water & Power">पाणी व वीज (Water/Power)</option>
                    <option value="Health & Anganwadi">आरोग्य व अंगणवाडी</option>
                    <option value="Agriculture">कृषी (Agriculture)</option>
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
                  className="flex-1 py-3 rounded-xl bg-[#003629] text-white font-bold text-[13px]"
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
            <h2 className="font-heading font-bold text-[16px] text-[#003629]">
              गावातील महत्त्वाचे संपर्क ({contacts.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contacts.map((c) => (
                <div key={c.id} className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <strong className="text-[14px] text-[#003629] block">{c.name}</strong>
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
                          className="p-1 rounded text-[#003629] hover:bg-[#f3ede4]"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('हा संपर्क हटवायचा आहे का?')) {
                              saveContacts(contacts.filter((x) => x.id !== c.id));
                            }
                          }}
                          className="p-1 rounded text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                    <span className="text-[12px] text-[#a63b00] font-semibold block">{c.designation}</span>
                    <span className="text-[11px] text-[#707974] block mt-1">{c.officeHours}</span>
                  </div>

                  <a
                    href={`tel:${c.phone}`}
                    className="mt-3 py-1.5 px-3 rounded-xl bg-[#f9f3ea] hover:bg-[#003629] hover:text-white text-[#003629] font-bold text-[12px] flex items-center justify-center gap-1.5 transition-colors border border-[#e8e2d9]"
                  >
                    <span className="material-symbols-outlined text-[15px]">call</span>
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
            <h2 className="font-heading font-extrabold text-[16px] text-[#003629] mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#a63b00]">construction</span>
              <span>{editingProject ? 'विकासकाम अद्ययावत करा' : 'नवीन विकासकाम किंवा प्रकल्प जोडा'}</span>
            </h2>
            <p className="text-[12px] text-[#707974] mb-4">
              रस्ते काँक्रीटीकरण, गटार लाईन, सोलर दिवे किंवा शाळा दुरुस्तीच्या निधी व कामाची स्थिती गावकऱ्यांना दाखवा.
            </p>

            <form onSubmit={handleSaveProject} className="flex flex-col gap-3">
              <div>
                <label className="block text-[12px] font-bold mb-1">कामाचे नाव (Work Title) *</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="उदा. मुख्य बाजार रस्ता सिमेंट काँक्रीटीकरण"
                  className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold mb-1">प्रगती टक्केवारी: {projectForm.progressPercent}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={projectForm.progressPercent}
                    onChange={(e) => setProjectForm({ ...projectForm, progressPercent: Number(e.target.value) })}
                    className="w-full accent-[#003629]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold mb-1">सद्यस्थिती (Status)</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                    className="w-full p-2 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                  >
                    <option value="PLANNING">नियोजन / मंजुरी टप्पा (Planning)</option>
                    <option value="IN_PROGRESS">काम चालू (In Progress)</option>
                    <option value="COMPLETED">काम पूर्ण (Completed)</option>
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
                  className="flex-1 py-3 rounded-xl bg-[#003629] text-white font-bold text-[13px]"
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
            <h2 className="font-heading font-bold text-[16px] text-[#003629]">
              गावातील विकासकामे व पारदर्शकता ट्रॅकर ({projects.length})
            </h2>
            {projects.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${p.status === 'COMPLETED' ? 'bg-[#baeed9] text-[#002117]' : 'bg-[#ffdbce] text-[#a63b00]'
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
                      className="p-1 rounded text-[#003629] hover:bg-[#f3ede4]"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('हे विकासकाम हटवायचे आहे का?')) {
                          saveProjects(projects.filter((x) => x.id !== p.id));
                        }
                      }}
                      className="p-1 rounded text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
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
                    className="bg-[#003629] h-2 rounded-full transition-all duration-500"
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
            <h2 className="font-heading font-bold text-[16px] text-[#003629]">
              गावकऱ्यांनी दाखल केलेल्या तक्रारी व अर्ज ({complaints.length})
            </h2>
            <div className="flex items-center gap-2">
              {['ALL', 'SUBMITTED', 'IN_PROGRESS', 'RESOLVED'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setComplaintFilter(f)}
                  className={`px-3 py-1 rounded-lg text-[12px] font-bold ${complaintFilter === f ? 'bg-[#003629] text-white' : 'bg-[#f3ede4] text-[#404945]'
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
                      <span className="text-[11px] font-black uppercase text-[#a63b00]">{c.trackingNumber || 'KS-REG'}</span>
                      <h3 className="font-bold text-[14px] text-[#1d1b16]">{c.title}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${c.status === 'RESOLVED' ? 'bg-[#baeed9] text-[#002117]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#55605a] mt-2">{c.description}</p>
                  <div className="mt-2 text-[11px] text-[#707974]">
                    गावकऱ्याचे नाव: <strong>{c.citizenName || 'नागरिक'}</strong> • वॉर्ड: <strong>{c.ward || 'वॉर्ड २'}</strong>
                  </div>
                  {c.resolutionNote && (
                    <div className="mt-2 p-2 rounded-lg bg-[#f9f3ea] text-[11px] text-[#003629] border border-[#e8e2d9]">
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
                  className="py-2 px-3 rounded-xl bg-[#003629] text-white text-[12px] font-bold flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  <span>स्थिती बदला व ग्रामपंचायत कृती नोंदवा</span>
                </button>
              </div>
            ))}
          </div>

          {selectedComplaint && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#e8e2d9]">
                <h3 className="font-heading font-extrabold text-[16px] text-[#003629] mb-3">
                  तक्रार निवारण कृती: {selectedComplaint.title}
                </h3>
                <form onSubmit={handleUpdateComplaintStatus} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[12px] font-bold mb-1">नवीन स्थिती (Status)</label>
                    <select
                      value={resolutionStatus}
                      onChange={(e) => setResolutionStatus(e.target.value)}
                      className="w-full p-2.5 bg-[#f9f3ea] text-[12px] rounded-xl border border-[#e8e2d9]"
                    >
                      <option value="SUBMITTED">नोंद झाली (Submitted)</option>
                      <option value="IN_PROGRESS">ग्रामपंचायतीत अर्ज दिला / काम चालू (In Progress)</option>
                      <option value="RESOLVED">तक्रार निवारण झाले (Resolved)</option>
                      <option value="REJECTED">रद्द (Rejected)</option>
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
                      className="flex-1 py-3 rounded-xl bg-[#003629] text-white font-bold text-[13px]"
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
            <div className="w-12 h-12 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">cell_tower</span>
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-[18px] text-[#003629]">
                तातडीची दवंडी (Instant Web Push Broadcast)
              </h2>
              <p className="text-[12px] text-[#707974]">
                सर्व नोंदणीकृत गावकऱ्यांच्या मोबाईल स्क्रीनवर तात्काळ पॉप-अप सूचना पाठवा.
              </p>
            </div>
          </div>

          {pushFeedback && (
            <div className="mb-4 p-3 rounded-xl bg-[#baeed9] text-[#002117] text-[12px] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">campaign</span>
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
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">अलर्ट वर्गवारी (Category)</label>
              <select
                value={broadcastCategory}
                onChange={(e) => setBroadcastCategory(e.target.value)}
                className="w-full p-2.5 bg-[#f9f3ea] text-[13px] rounded-xl border border-[#e8e2d9]"
              >
                <option value="पाणी पुरवठा">पाणी पुरवठा (Water Alert)</option>
                <option value="ग्रामसभा">ग्रामसभा बैठक (Gram Sabha)</option>
                <option value="वीज पुरवठा">वीज पुरवठा (Power / MSEDCL)</option>
                <option value="कृषी सल्ला">कृषी सल्ला व हवामान (Agri Alert)</option>
                <option value="आरोग्य">आरोग्य शिबीर (Health Alert)</option>
                <option value="आपत्कालीन">आपत्कालीन सूचना (Emergency)</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">अलर्ट मजकूर (Message) *</label>
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
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span>{pushSending ? 'अलर्ट पाठवला जात आहे...' : 'सर्व गावकऱ्यांच्या मोबाईलवर पाठवा'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 9: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-heading font-bold text-[16px] text-[#003629]">
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
            <table className="w-full text-left text-[12px]">
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
                    <tr key={u.id} className="hover:bg-[#fff8f0]">
                      <td className="p-3 font-semibold text-[#1d1b16]">{u.fullName || 'नागरिक'}</td>
                      <td className="p-3 text-[#55605a]">{u.phone || '-'}</td>
                      <td className="p-3 text-[#55605a]">{u.wardNumber || 'वॉर्ड २'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#baeed9] text-[#002117]">
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
    </div>
  );
};
