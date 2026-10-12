import React, { useState } from 'react';
import type { UserProfileData } from '../pages/ProfilePage';

export type AdminModuleId =
  | 'overview'
  | 'businesses'
  | 'reviews'
  | 'banners'
  | 'events'
  | 'shiksha'
  | 'transport'
  | 'blogs'
  | 'notices'
  | 'water'
  | 'schemes'
  | 'contacts'
  | 'projects'
  | 'complaints'
  | 'broadcast'
  | 'users'
  | 'logs';

export interface AdminModuleDefinition {
  id: AdminModuleId;
  labelMarathi: string;
  labelEnglish: string;
  icon: string;
  category: 'GOVERNANCE' | 'SERVICES' | 'CONTENT';
  description: string;
}

export const ADMIN_MODULES_LIST: AdminModuleDefinition[] = [
  // 1. Governance & Oversight
  {
    id: 'overview',
    labelMarathi: 'आढावा व आकडेवारी',
    labelEnglish: 'Dashboard Overview & KPIs',
    icon: 'analytics',
    category: 'GOVERNANCE',
    description: 'ग्रामपंचायत मुख्य मेट्रिक्स, सारांश व द्रुत कृती शॉर्टकट्स'
  },
  {
    id: 'broadcast',
    labelMarathi: 'तातडीची दवंडी (Push Alert)',
    labelEnglish: 'Emergency Push Alerts',
    icon: 'cell_tower',
    category: 'GOVERNANCE',
    description: 'सर्व गावकऱ्यांच्या मोबाईलवर आपत्कालीन व शासकीय संदेश पाठवणे'
  },
  {
    id: 'users',
    labelMarathi: 'गावकऱ्यांची यादी',
    labelEnglish: 'Citizen Directory',
    icon: 'group',
    category: 'GOVERNANCE',
    description: 'नोंदणीकृत गावकऱ्यांची माहिती, मतदार वॉर्ड व संपर्क'
  },
  {
    id: 'logs',
    labelMarathi: 'ऑडिट नोंदी (Audit Logs)',
    labelEnglish: 'Audit Logs & Security',
    icon: 'manage_history',
    category: 'GOVERNANCE',
    description: 'प्रशासकीय कृती, बदल व सुरक्षा नोंदींचे पुनरावलोकन'
  },

  // 2. Citizen Services & Grievances
  {
    id: 'complaints',
    labelMarathi: 'गावकऱ्यांच्या तक्रारी',
    labelEnglish: 'Citizen Grievances & Redressal',
    icon: 'support_agent',
    category: 'SERVICES',
    description: 'पाणी, वीज, रस्ते विषयक तक्रारींची स्थिती बदलणे व निवारण नोंदवणे'
  },
  {
    id: 'businesses',
    labelMarathi: 'दुकाने व व्यवसाय पडताळणी',
    labelEnglish: 'Business Directory & Verification',
    icon: 'storefront',
    category: 'SERVICES',
    description: 'नोंदणीकृत दुकानांची यादी, पडताळणी स्थिती, अधिकृत ट्रस्ट बॅज व नियमन'
  },
  {
    id: 'schemes',
    labelMarathi: 'योजना व्यवस्थापन',
    labelEnglish: 'Government Schemes',
    icon: 'description',
    category: 'SERVICES',
    description: 'संजय गांधी, पीएम किसान, शेतकरी व इतर योजना जोडणे व बदलणे'
  },
  {
    id: 'water',
    labelMarathi: 'पाणी पुरवठा वेळापत्रक',
    labelEnglish: 'Water Supply Timings',
    icon: 'water_drop',
    category: 'SERVICES',
    description: 'सर्व वॉर्डांचे पाणी पुरवठा वेळापत्रक, दाबाची स्थिती व सूचना'
  },
  {
    id: 'contacts',
    labelMarathi: 'महत्त्वाचे संपर्क',
    labelEnglish: 'Important Emergency Contacts',
    icon: 'contacts',
    category: 'SERVICES',
    description: 'सरपंच, तलाठी, आरोग्य केंद्र, पोलीस व आपत्कालीन क्रमांक'
  },
  {
    id: 'projects',
    labelMarathi: 'विकासकामे व निधी',
    labelEnglish: 'Development Projects',
    icon: 'construction',
    category: 'SERVICES',
    description: 'गावातील सिमेंट रस्ते, गटारे, शाळा दुरुस्ती व निधी खर्च प्रगती'
  },

  // 3. Public Info, Education & Content
  {
    id: 'reviews',
    labelMarathi: 'नागरिक अभिप्राय नियंत्रण',
    labelEnglish: 'Customer Reviews Moderation',
    icon: 'rate_review',
    category: 'CONTENT',
    description: 'स्थानिक दुकानांचे ग्राहक अभिप्राय, पडताळणी बॅज व संपादन'
  },
  {
    id: 'banners',
    labelMarathi: 'हिरो स्लायडर व बॅनर',
    labelEnglish: 'Hero Carousel & Banners',
    icon: 'view_carousel',
    category: 'CONTENT',
    description: 'मुख्य पृष्ठावरील मुख्य फोटो, घोषणा बॅनर व स्लायडर व्यवस्थापन'
  },
  {
    id: 'events',
    labelMarathi: 'कार्यक्रम व जत्रा',
    labelEnglish: 'Village Events & Festivals',
    icon: 'event',
    category: 'CONTENT',
    description: 'खंडोबा यात्रा, ग्रामसभा, आरोग्य शिबिर व सांस्कृतिक कार्यक्रम'
  },
  {
    id: 'shiksha',
    labelMarathi: 'शिक्षण, शाळा व अभ्यासिका',
    labelEnglish: 'Education, Library & Tutors',
    icon: 'school',
    category: 'CONTENT',
    description: 'शाळा, शिष्यवृत्ती, वाचनालय डेस्क आरक्षणे व स्थानिक ट्युटर्स'
  },
  {
    id: 'transport',
    labelMarathi: 'वाहतूक व बसेस',
    labelEnglish: 'Transport & Bus Schedules',
    icon: 'directions_bus',
    category: 'CONTENT',
    description: 'एसटी बस वेळापत्रक, ऑटो चालक संपर्क व आगार मदत क्रमांक'
  },
  {
    id: 'blogs',
    labelMarathi: 'ब्लॉग व यशोगाथा',
    labelEnglish: 'Village Blogs & Stories',
    icon: 'menu_book',
    category: 'CONTENT',
    description: 'गावाचा इतिहास, प्रगतशील शेतकरी यशोगाथा व लेख प्रसिद्ध करणे'
  },
  {
    id: 'notices',
    labelMarathi: 'सूचना फलक (Notices)',
    labelEnglish: 'Public Announcements',
    icon: 'campaign',
    category: 'CONTENT',
    description: 'अधिकृत ग्रामपंचायत दवंडी, ग्रामसभा सूचना व परिपत्रके'
  }
];

export interface ManagedAdminUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  wardOrDept: string;
  isActive: boolean;
  isRoot?: boolean;
  allowedModules: AdminModuleId[];
  lastLogin?: string;
  createdDate: string;
  notes?: string;
}

const STORAGE_KEY = 'dg_managed_admin_users_v1';

export const DEFAULT_MANAGED_ADMINS: ManagedAdminUser[] = [
  {
    id: 'adm-super-1',
    fullName: 'Chief Super Admin (मुख्य प्रशासक)',
    phone: '9999999999',
    email: 'superadmin@asgaon.in',
    role: 'SUPER_ADMIN',
    wardOrDept: 'ग्राम सचिवालय व मुख्य नियंत्रण कक्ष',
    isActive: true,
    isRoot: true,
    allowedModules: ADMIN_MODULES_LIST.map((m) => m.id),
    lastLogin: 'आत्ताच सक्रिय (Active Now)',
    createdDate: '०१ ऑक्टोबर २०२६',
    notes: 'सर्वोच्च तांत्रिक व प्रशासकीय नियंत्रण अधिकार (Full Root Access)'
  },
  {
    id: 'adm-sevak-2',
    fullName: 'ग्रामसेवक एस. एन. जाधव',
    phone: '9604331589',
    email: 'gramsevak@asgaon.gov.in',
    role: 'ADMIN',
    wardOrDept: 'ग्रामपंचायत प्रशासन (नागरी सेवा व तक्रार निवारण)',
    isActive: true,
    allowedModules: [
      'overview',
      'reviews',
      'notices',
      'water',
      'schemes',
      'complaints',
      'contacts',
      'projects',
      'broadcast'
    ],
    lastLogin: 'आज, सकाळी ०९:४०',
    createdDate: '०५ ऑक्टोबर २०२६',
    notes: 'प्रशासकीय योजना, तक्रार निवारण व दवंडी अधिकार'
  },
  {
    id: 'adm-sahayak-3',
    fullName: 'ग्रामपंचायत सहाय्यक व ऑपरेटर',
    phone: '9822104500',
    email: 'sahayak@asgaon.in',
    role: 'ADMIN',
    wardOrDept: 'आपले सरकार सेवा केंद्र व जनसंपर्क',
    isActive: true,
    allowedModules: [
      'overview',
      'banners',
      'events',
      'shiksha',
      'transport',
      'blogs',
      'notices',
      'contacts'
    ],
    lastLogin: 'काल, संध्याकाळी ०५:१५',
    createdDate: '०८ ऑक्टोबर २०२६',
    notes: 'माहिती व तंत्रज्ञान, शिक्षण मंच व बस वेळापत्रक व्यवस्थापक'
  },
  {
    id: 'adm-water-4',
    fullName: 'जल मित्र (पाणी पुरवठा ऑपरेटर)',
    phone: '9822104501',
    email: 'jalmitra@asgaon.in',
    role: 'ADMIN',
    wardOrDept: 'पाणी पुरवठा व स्वच्छता समिती',
    isActive: true,
    allowedModules: [
      'overview',
      'water',
      'complaints',
      'contacts'
    ],
    lastLogin: '२ दिवसांपूर्वी',
    createdDate: '१० ऑक्टोबर २०२६',
    notes: 'फक्त पाणी पुरवठा वेळ व गळती तक्रारी व्यवस्थापन अधिकार'
  }
];

export const getStoredManagedAdmins = (): ManagedAdminUser[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
  }
  return DEFAULT_MANAGED_ADMINS;
};

export const saveStoredManagedAdmins = (admins: ManagedAdminUser[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(admins));
};

/**
 * Returns allowed modules for a given user phone or role.
 * Super Admins ALWAYS get ALL modules.
 * Regular Admins get their explicitly saved module access list.
 */
export const getAllowedModulesForUser = (
  userPhone?: string,
  userRole?: string
): AdminModuleId[] => {
  const isSuper =
    userRole === 'SUPER_ADMIN' ||
    userRole === 'ROLE_SUPER_ADMIN';

  if (isSuper) {
    return ADMIN_MODULES_LIST.map((m) => m.id);
  }

  const admins = getStoredManagedAdmins();
  const matchedAdmin = admins.find(
    (a) => a.phone === userPhone || a.phone.replace(/[^0-9]/g, '') === (userPhone || '').replace(/[^0-9]/g, '')
  );

  if (matchedAdmin && Array.isArray(matchedAdmin.allowedModules) && matchedAdmin.allowedModules.length > 0) {
    return matchedAdmin.allowedModules;
  }

  // Default fallback for any newly assigned Admin
  return [
    'overview',
    'reviews',
    'notices',
    'water',
    'schemes',
    'complaints',
    'contacts'
  ];
};

interface AdminManagementSectionProps {
  currentUser: UserProfileData;
  onAuditLog?: (action: string, details: string) => void;
}

export const AdminManagementSection: React.FC<AdminManagementSectionProps> = ({
  currentUser,
  onAuditLog
}) => {
  const [admins, setAdmins] = useState<ManagedAdminUser[]>(() => getStoredManagedAdmins());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'SUPER_ADMIN'>('ALL');
  const [selectedAdmin, setSelectedAdmin] = useState<ManagedAdminUser | null>(null);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // New Admin Form State
  const [newAdminForm, setNewAdminForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    role: 'ADMIN' as 'ADMIN' | 'SUPER_ADMIN',
    wardOrDept: '',
    notes: '',
    preset: 'services' as 'all' | 'services' | 'content' | 'emergency' | 'custom',
    selectedModules: [
      'overview',
      'reviews',
      'notices',
      'water',
      'schemes',
      'complaints',
      'contacts'
    ] as AdminModuleId[]
  });

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Sync with localStorage
  const updateAdminsList = (updated: ManagedAdminUser[], logAction?: string, logDetails?: string) => {
    setAdmins(updated);
    saveStoredManagedAdmins(updated);
    if (logAction && onAuditLog) {
      onAuditLog(logAction, logDetails || '');
    }
  };

  // Open Permission Editor for an admin
  const handleOpenPermissionModal = (admin: ManagedAdminUser) => {
    setSelectedAdmin({ ...admin, allowedModules: [...admin.allowedModules] });
    setIsEditingPermissions(true);
  };

  // Toggle single module permission
  const handleToggleModule = (moduleId: AdminModuleId) => {
    if (!selectedAdmin) return;
    const exists = selectedAdmin.allowedModules.includes(moduleId);
    const updatedModules = exists
      ? selectedAdmin.allowedModules.filter((m) => m !== moduleId)
      : [...selectedAdmin.allowedModules, moduleId];

    setSelectedAdmin({
      ...selectedAdmin,
      allowedModules: updatedModules
    });
  };

  // Apply Quick Preset
  const handleApplyPreset = (preset: 'all' | 'services' | 'content' | 'emergency' | 'clear') => {
    if (!selectedAdmin) return;

    let targetModules: AdminModuleId[] = [];
    if (preset === 'all') {
      targetModules = ADMIN_MODULES_LIST.map((m) => m.id);
    } else if (preset === 'services') {
      targetModules = ['overview', 'schemes', 'complaints', 'water', 'contacts', 'projects'];
    } else if (preset === 'content') {
      targetModules = ['overview', 'reviews', 'banners', 'events', 'shiksha', 'transport', 'blogs', 'notices'];
    } else if (preset === 'emergency') {
      targetModules = ['overview', 'broadcast', 'notices', 'water', 'contacts'];
    } else if (preset === 'clear') {
      targetModules = ['overview']; // Always keep overview at least
    }

    setSelectedAdmin({
      ...selectedAdmin,
      allowedModules: targetModules
    });
  };

  // Save Permissions to Admin
  const handleSavePermissions = () => {
    if (!selectedAdmin) return;

    const updated = admins.map((a) =>
      a.id === selectedAdmin.id ? { ...selectedAdmin } : a
    );
    updateAdminsList(
      updated,
      'अधिकार बदलले (Permissions Updated)',
      `${selectedAdmin.fullName} (${selectedAdmin.phone}) यांचे पृष्ठ अधिकार (${selectedAdmin.allowedModules.length} मॉड्यूल्स) अद्ययावत केले.`
    );
    setIsEditingPermissions(false);
    showFeedback(`✅ ${selectedAdmin.fullName} यांचे प्रवेश अधिकार यशस्वीरीत्या जतन केले!`);
  };

  // Toggle Active/Inactive
  const handleToggleStatus = (admin: ManagedAdminUser) => {
    if (admin.isRoot || admin.id === 'adm-super-1') {
      alert('मुख्य सुपर अॅडमिन खाते निष्क्रिय केले जाऊ शकत नाही.');
      return;
    }
    const updatedStatus = !admin.isActive;
    const updated = admins.map((a) =>
      a.id === admin.id ? { ...a, isActive: updatedStatus } : a
    );
    updateAdminsList(
      updated,
      `खाते ${updatedStatus ? 'सक्रिय' : 'निष्क्रिय'} केले`,
      `${admin.fullName} यांचे अॅडमिन खाते ${updatedStatus ? 'सक्रिय (Active)' : 'निष्क्रिय (Disabled)'} केले.`
    );
    showFeedback(`खाते ${updatedStatus ? 'सक्रिय' : 'निष्क्रिय'} करण्यात आले.`);
  };

  // Toggle Role (ADMIN ⇄ SUPER_ADMIN)
  const handleToggleRole = (admin: ManagedAdminUser) => {
    if (admin.isRoot || admin.id === 'adm-super-1') {
      alert('मूळ सुपर अॅडमिनची भूमिका बदलता येत नाही.');
      return;
    }
    const newRole: 'ADMIN' | 'SUPER_ADMIN' = admin.role === 'ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';
    const updatedModules =
      newRole === 'SUPER_ADMIN'
        ? ADMIN_MODULES_LIST.map((m) => m.id)
        : admin.allowedModules;

    const updated = admins.map((a) =>
      a.id === admin.id ? { ...a, role: newRole, allowedModules: updatedModules } : a
    );
    updateAdminsList(
      updated,
      'अॅडमिन भूमिका बदलली',
      `${admin.fullName} यांची भूमिका ${newRole} करण्यात आली.`
    );
    showFeedback(`भूमिका ${newRole === 'SUPER_ADMIN' ? 'सुपर अॅडमिन' : 'नियमित अॅडमिन'} मध्ये बदलली.`);
  };

  // Delete Admin
  const handleDeleteAdmin = (admin: ManagedAdminUser) => {
    if (admin.isRoot || admin.id === 'adm-super-1') {
      alert('मुख्य सुपर अॅडमिन काढता येत नाही.');
      return;
    }
    if (!window.confirm(`तुम्हाला खात्री आहे की "${admin.fullName}" यांचे अॅडमिन अधिकार पूर्णपणे काढायचे आहेत?`)) {
      return;
    }
    const updated = admins.filter((a) => a.id !== admin.id);
    updateAdminsList(
      updated,
      'अॅडमिन हटवला',
      `${admin.fullName} (${admin.phone}) यांचे अॅडमिन अधिकार प्रणालीतून काढले.`
    );
    showFeedback(`🗑️ ${admin.fullName} यांचे अॅडमिन खाते काढण्यात आले.`);
  };

  // Add New Admin Submit
  const handleCreateAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminForm.fullName.trim() || !newAdminForm.phone.trim()) {
      alert('कृपया नाव व मोबाईल नंबर प्रविष्ट करा.');
      return;
    }

    const cleanPhone = newAdminForm.phone.trim();
    if (admins.some((a) => a.phone === cleanPhone)) {
      alert('या मोबाईल नंबरसह आधीच एक व्यवस्थापक नोंदणीकृत आहे.');
      return;
    }

    const newAdmin: ManagedAdminUser = {
      id: `adm-${Date.now()}`,
      fullName: newAdminForm.fullName.trim(),
      phone: cleanPhone,
      email: newAdminForm.email.trim() || undefined,
      role: newAdminForm.role,
      wardOrDept: newAdminForm.wardOrDept.trim() || 'ग्रामपंचायत प्रशासन',
      isActive: true,
      allowedModules:
        newAdminForm.role === 'SUPER_ADMIN'
          ? ADMIN_MODULES_LIST.map((m) => m.id)
          : newAdminForm.selectedModules.length > 0
            ? newAdminForm.selectedModules
            : ['overview', 'schemes', 'complaints', 'contacts'],
      createdDate: new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      notes: newAdminForm.notes.trim() || undefined
    };

    const updated = [...admins, newAdmin];
    updateAdminsList(
      updated,
      'नवीन अॅडमिन जोडला',
      `${newAdmin.fullName} (${newAdmin.phone}) यांना ${newAdmin.role} म्हणून नियुक्त केले.`
    );

    setIsAddModalOpen(false);
    setNewAdminForm({
      fullName: '',
      phone: '',
      email: '',
      role: 'ADMIN',
      wardOrDept: '',
      notes: '',
      preset: 'services',
      selectedModules: ['overview', 'reviews', 'notices', 'water', 'schemes', 'complaints', 'contacts']
    });
    showFeedback(`🎉 नवीन व्यवस्थापक "${newAdmin.fullName}" यशस्वीरीत्या जोडले गेले!`);
  };

  // Filtered List
  const filteredAdmins = admins.filter((a) => {
    const matchesRole = roleFilter === 'ALL' || a.role === roleFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.fullName.toLowerCase().includes(q) ||
      a.phone.includes(q) ||
      (a.wardOrDept && a.wardOrDept.toLowerCase().includes(q)) ||
      (a.email && a.email.toLowerCase().includes(q));
    return matchesRole && matchesSearch;
  });

  const totalAdminsCount = admins.length;
  const superAdminsCount = admins.filter((a) => a.role === 'SUPER_ADMIN').length;
  const activeAdminsCount = admins.filter((a) => a.isActive).length;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Clean Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#003629] text-[#baeed9] text-[10px] font-black uppercase tracking-wider">
              Super Admin
            </span>
            <span className="text-xs text-[#707974] font-medium">
              व्यवस्थापक व पृष्ठ अधिकार • {currentUser.fullName || 'Chief Super Admin'}
            </span>
          </div>
          <h2 className="font-heading font-black text-xl sm:text-2xl text-[#1d1b16] mt-1">
            प्रशासक व्यवस्थापन 
          </h2>
          <p className="text-xs text-[#55605a] mt-1">
            इतर अॅडमिन्सची खाती आणि त्यांना उपलब्ध असलेली पाने नियंत्रित करा.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>नवा अॅडमिन जोडा</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="bg-[#baeed9] border border-[#006a4e] text-[#002117] p-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs transition-all animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#006a4e]">check_circle</span>
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-[#002117]/60 hover:text-[#002117] cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#003629]/10 text-[#003629] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">groups</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#707974] block">एकूण अॅडमिन</span>
            <span className="font-heading font-black text-xl text-[#003629]">{totalAdminsCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ef9f27]/15 text-[#a63b00] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">shield_person</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#707974] block">सुपर अॅडमिन</span>
            <span className="font-heading font-black text-xl text-[#a63b00]">{superAdminsCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#baeed9]/40 text-[#006a4e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#707974] block">सक्रिय खाती</span>
            <span className="font-heading font-black text-xl text-[#006a4e]">{activeAdminsCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#002873]/10 text-[#002873] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#707974] block">एकूण मॉड्यूल्स</span>
            <span className="font-heading font-black text-xl text-[#002873]">{ADMIN_MODULES_LIST.length}</span>
          </div>
        </div>
      </div>

      {/* Admin Users Filter Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाव, मोबाईल क्र., किंवा विभाग शोधा..."
            className="w-full pl-9 pr-3 py-2 bg-[#fcfbf9] rounded-xl text-xs text-[#1d1b16] border border-[#e8e2d9] focus:border-[#003629] outline-none"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: `सर्व (${admins.length})` },
            { id: 'SUPER_ADMIN', label: `सुपर अॅडमिन (${superAdminsCount})` },
            { id: 'ADMIN', label: `नियमित अॅडमिन (${admins.length - superAdminsCount})` }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setRoleFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === f.id
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'bg-[#f5ede3] text-[#55605a] hover:bg-[#e8ded3]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Cards Grid (Responsive Mobile + Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAdmins.map((admin) => {
          const isSuper = admin.role === 'SUPER_ADMIN';
          const allowedCount = isSuper ? ADMIN_MODULES_LIST.length : admin.allowedModules.length;

          return (
            <div
              key={admin.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs flex flex-col justify-between gap-4 ${
                !admin.isActive
                  ? 'opacity-65 border-[#e8e2d9] bg-[#faf8f5]'
                  : isSuper
                    ? 'border-[#ef9f27]/40 ring-1 ring-[#ef9f27]/20'
                    : 'border-[#e8e2d9] hover:border-[#003629]/40'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm ${
                        isSuper
                          ? 'bg-gradient-to-br from-[#ef9f27] to-[#ba7200] text-white shadow-sm'
                          : 'bg-[#003629] text-[#baeed9]'
                      }`}
                    >
                      {isSuper ? (
                        <span className="material-symbols-outlined text-[22px]">shield_person</span>
                      ) : (
                        admin.fullName.charAt(0) || 'A'
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-heading font-extrabold text-[14px] sm:text-[15px] text-[#1d1b16] truncate">
                          {admin.fullName}
                        </h3>
                        {isSuper && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#ffecb3] text-[#7c4d00] flex items-center gap-0.5 shrink-0">
                            <span className="material-symbols-outlined text-[11px]">star</span>
                            SUPER
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#707974] flex items-center gap-1.5 mt-0.5 truncate">
                        <span className="material-symbols-outlined text-[13px] text-[#006a4e]">call</span>
                        <strong className="text-[#003629] font-mono">{admin.phone}</strong>
                        {admin.email && <span>• {admin.email}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                      admin.isActive
                        ? 'bg-[#baeed9] text-[#002117]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {admin.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </span>
                </div>

                {/* Dept & Notes */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#fcfbf9] border border-[#f0eee8] text-[11px] text-[#55605a] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span><strong>पद / विभाग:</strong> {admin.wardOrDept}</span>
                    <span className="text-[10px] text-[#707974]">{admin.lastLogin}</span>
                  </div>
                  {admin.notes && (
                    <div className="text-[10px] text-[#707974] italic">
                      टीप: {admin.notes}
                    </div>
                  )}
                </div>

                {/* Modules Granted Indicator */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                    <span className="text-[#003629] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006a4e]">vpn_key</span>
                      <span>पानांचे अधिकार:</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#e8f5e9] text-[#006a4e] text-[10px] font-black">
                      {isSuper ? 'सर्व मॉड्यूल्स' : `${allowedCount} / ${ADMIN_MODULES_LIST.length} मॉड्यूल्स`}
                    </span>
                  </div>

                  {/* Module Tags Pills */}
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto no-scrollbar">
                    {isSuper ? (
                      <span className="px-2 py-0.5 rounded-md bg-[#fff8e1] text-[#7c4d00] text-[10px] font-bold border border-[#ffe082]">
                        सर्व पानांचा अधिकार (Full Access)
                      </span>
                    ) : (
                      admin.allowedModules.map((modId) => {
                        const m = ADMIN_MODULES_LIST.find((item) => item.id === modId);
                        return (
                          <span
                            key={modId}
                            className="px-2 py-0.5 rounded-md bg-[#f3ede4] text-[#003629] text-[10px] font-medium flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[11px] text-[#006a4e]">{m?.icon || 'tag'}</span>
                            <span>{m?.labelMarathi || modId}</span>
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-3 border-t border-[#f0eee8] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Configure Permissions Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenPermissionModal(admin)}
                    className="px-3 py-1.5 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    <span className="material-symbols-outlined text-[14px]">tune</span>
                    <span>अधिकार बदला</span>
                  </button>

                  {/* Toggle Role Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleRole(admin)}
                    title="भूमिका बदला"
                    className="px-2.5 py-1.5 rounded-xl bg-[#f5ede3] hover:bg-[#e8ded3] text-[#003629] text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isSuper ? 'arrow_downward' : 'arrow_upward'}
                    </span>
                    <span>{isSuper ? 'अॅडमिन करा' : 'सुपर अॅडमिन करा'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {/* Toggle Active Status */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(admin)}
                    title={admin.isActive ? 'खाते निष्क्रिय करा' : 'खाते सक्रिय करा'}
                    className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                      admin.isActive
                        ? 'text-[#55605a] hover:bg-[#f3ede4] hover:text-[#a63b00]'
                        : 'text-[#006a4e] bg-[#baeed9]/40 hover:bg-[#baeed9]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      {admin.isActive ? 'block' : 'check_circle'}
                    </span>
                  </button>

                  {/* Delete Admin */}
                  <button
                    type="button"
                    onClick={() => handleDeleteAdmin(admin)}
                    title="खाते काढून टाका"
                    className="p-1.5 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: EDIT PAGE ACCESS PERMISSIONS */}
      {isEditingPermissions && selectedAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-[#e8e2d9] my-8 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#f0eee8] pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#003629] text-[#baeed9] text-[10px] font-black uppercase">
                  पृष्ठ अधिकार
                </span>
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#003629] mt-1">
                  {selectedAdmin.fullName} — पाने ठरवा
                </h3>
                <p className="text-xs text-[#55605a] mt-0.5">
                  मोबाईल: <strong className="text-[#003629] font-mono">{selectedAdmin.phone}</strong> • विभाग: {selectedAdmin.wardOrDept}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingPermissions(false)}
                className="w-8 h-8 rounded-full bg-[#f3ede4] hover:bg-[#e8ded3] flex items-center justify-center text-[#55605a] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Presets */}
            <div className="bg-[#fcfbf9] p-3 rounded-2xl border border-[#e8e2d9] flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#707974] block">
                साचे (Presets):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('all')}
                  className="px-2.5 py-1 rounded-xl bg-[#003629] text-white text-[11px] font-bold hover:bg-[#1b4d3e] transition-all cursor-pointer"
                >
                  सर्व पाने
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('services')}
                  className="px-2.5 py-1 rounded-xl bg-[#e0f2fe] text-[#0369a1] text-[11px] font-bold hover:bg-[#bae6fd] transition-all cursor-pointer"
                >
                  नागरिक सेवा
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('content')}
                  className="px-2.5 py-1 rounded-xl bg-[#fef3c7] text-[#92400e] text-[11px] font-bold hover:bg-[#fde68a] transition-all cursor-pointer"
                >
                  माहिती व सूचना
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('emergency')}
                  className="px-2.5 py-1 rounded-xl bg-[#fee2e2] text-[#991b1b] text-[11px] font-bold hover:bg-[#fecaca] transition-all cursor-pointer"
                >
                  दवंडी व संपर्क
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('clear')}
                  className="px-2.5 py-1 rounded-xl bg-[#f3ede4] text-[#55605a] text-[11px] font-bold hover:bg-[#e8ded3] transition-all cursor-pointer"
                >
                  सर्व काढा
                </button>
              </div>
            </div>

            {/* Modules Checkbox Grid */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#003629]">
                <span>उपलब्ध मॉड्यूल्स ({ADMIN_MODULES_LIST.length}):</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#baeed9] text-[#002117] font-black text-[11px]">
                  {selectedAdmin.allowedModules.length} निवडले
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[46vh] overflow-y-auto pr-1">
                {ADMIN_MODULES_LIST.map((mod) => {
                  const isChecked = selectedAdmin.allowedModules.includes(mod.id);
                  return (
                    <label
                      key={mod.id}
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleModule(mod.id);
                      }}
                      className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer select-none ${
                        isChecked
                          ? 'border-[#003629] bg-[#f0fdf4] shadow-xs'
                          : 'border-[#e8e2d9] bg-white hover:bg-[#fcfbf9]'
                      }`}
                    >
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent label
                          className="w-4 h-4 rounded-md accent-[#003629] cursor-pointer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`material-symbols-outlined text-[17px] ${isChecked ? 'text-[#006a4e]' : 'text-[#707974]'}`}>
                            {mod.icon}
                          </span>
                          <span className="font-bold text-[12px] text-[#1d1b16]">
                            {mod.labelMarathi}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#707974] mt-0.5 line-clamp-1">
                          {mod.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#f0eee8] flex items-center justify-between gap-3 flex-wrap">
              <div className="text-[11px] text-[#707974]">
                टीप: हे बदल लगेच प्रभावी होतील आणि अॅडमिनच्या मेन्यूमध्ये दिसतील.
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingPermissions(false)}
                  className="px-4 py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8ded3] text-[#55605a] font-bold text-xs cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="px-5 py-2 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>अधिकार जतन करा</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW ADMIN USER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-[#e8e2d9] my-8 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#f0eee8] pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#baeed9] text-[#002117] text-[10px] font-black uppercase">
                  नवीन अॅडमिन
                </span>
                <h3 className="font-heading font-black text-lg text-[#003629] mt-1">
                  नवा अॅडमिन जोडा
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f3ede4] hover:bg-[#e8ded3] flex items-center justify-center text-[#55605a] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateAdminSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#003629]">पूर्ण नाव *</label>
                  <input
                    type="text"
                    required
                    value={newAdminForm.fullName}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, fullName: e.target.value })}
                    placeholder="उदा. राहुल देशमुख"
                    className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs border border-[#e8e2d9] focus:border-[#003629] outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#003629]">मोबाईल नंबर *</label>
                  <input
                    type="tel"
                    required
                    value={newAdminForm.phone}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                    placeholder="उदा. 9823456789"
                    className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs border border-[#e8e2d9] focus:border-[#003629] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#003629]">ईमेल (ऐच्छिक)</label>
                  <input
                    type="email"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    placeholder="उदा. rahul@asgaon.in"
                    className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs border border-[#e8e2d9] focus:border-[#003629] outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#003629]">भूमिका</label>
                  <select
                    value={newAdminForm.role}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value as any })}
                    className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs font-bold text-[#003629] border border-[#e8e2d9] focus:border-[#003629] outline-none"
                  >
                    <option value="ADMIN">नियमित अॅडमिन (ADMIN)</option>
                    <option value="SUPER_ADMIN">सुपर अॅडमिन (SUPER ADMIN)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#003629]">विभाग / जबाबदारी</label>
                <input
                  type="text"
                  value={newAdminForm.wardOrDept}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, wardOrDept: e.target.value })}
                  placeholder="उदा. पाणी पुरवठा / आरोग्य समिती"
                  className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs border border-[#e8e2d9] focus:border-[#003629] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#003629]">शेरा (ऐच्छिक)</label>
                <textarea
                  rows={2}
                  value={newAdminForm.notes}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, notes: e.target.value })}
                  placeholder="काही नोंद असल्यास..."
                  className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs border border-[#e8e2d9] focus:border-[#003629] outline-none resize-none"
                />
              </div>

              {/* Initial Permissions Info */}
              <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-[11px] text-[#166534]">
                {newAdminForm.role === 'SUPER_ADMIN'
                  ? 'सुपर अॅडमिनला सर्व पानांचे अधिकार मिळतील.'
                  : 'नियमित अॅडमिनचे अधिकार खाते तयार झाल्यानंतर कधीही बदलता येतील.'}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8ded3] text-[#55605a] font-bold text-xs cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>अॅडमिन जोडा</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
