import { LucideIcon } from './LucideIcon';
import React, { useState, useEffect, useMemo } from 'react';
import type { UserProfileData } from '../pages/ProfilePage';
import { api } from '../services/api';

export type AdminModuleId =
  | 'overview'
  | 'businesses'
  | 'reviews'
  | 'banners'
  | 'gallery'
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
  | 'logs'
  | 'transparency';

export interface AdminModuleConfig {
  id: AdminModuleId;
  labelMarathi: string;
  labelEnglish: string;
  icon: string;
  category: 'CORE' | 'SERVICES' | 'CONTENT' | 'SYSTEM';
  description: string;
}

export const ADMIN_MODULES_LIST: AdminModuleConfig[] = [
  {
    id: 'overview',
    labelMarathi: 'मुख्य डॅशबोर्ड',
    labelEnglish: 'Main Overview',
    icon: 'dashboard',
    category: 'CORE',
    description: 'सर्व विभाग व गाव सांख्यिकीचा एकत्रित आढावा'
  },
  {
    id: 'schemes',
    labelMarathi: 'शासकीय योजना',
    labelEnglish: 'Govt Schemes',
    icon: 'assignment',
    category: 'SERVICES',
    description: 'संजय गांधी, नरेगा, आवास योजना व इतर अनुदान माहिती व्यवस्थापन'
  },
  {
    id: 'water',
    labelMarathi: 'पाणी पुरवठा वेळापत्रक',
    labelEnglish: 'Water Supply Schedule',
    icon: 'water_drop',
    category: 'SERVICES',
    description: 'दररोजचे पाणी पुरवठा नियोजन, टँकर नोंद व पाण्याची गुणवत्ता'
  },
  {
    id: 'complaints',
    labelMarathi: 'तक्रार निवारण मंच',
    labelEnglish: 'Grievance Redressal',
    icon: 'support_agent',
    category: 'SERVICES',
    description: 'गावकऱ्यांच्या ऑनलाइन तक्रारींचे निवारण व स्थिती बदल'
  },
  {
    id: 'projects',
    labelMarathi: 'ग्राम विकास कामे',
    labelEnglish: 'Village Projects',
    icon: 'engineering',
    category: 'SERVICES',
    description: 'रस्ते, सिमेंट काँक्रीट, दिवाबत्ती व विकास कामांची प्रगती'
  },
  {
    id: 'broadcast',
    labelMarathi: 'आपत्कालीन दवंडी व अलर्ट',
    labelEnglish: 'Emergency Alerts',
    icon: 'notifications_active',
    category: 'SERVICES',
    description: 'तातडीच्या सूचना, पूर/हवामान इशारा व ग्रामसभा दवंडी'
  },
  {
    id: 'businesses',
    labelMarathi: 'स्थानिक व्यवसाय व बाजार',
    labelEnglish: 'Local Businesses',
    icon: 'storefront',
    category: 'SERVICES',
    description: 'गावातील दुकाने, कृषी सेवा केंद्र व स्थानिक उद्योगांची नोंदणी'
  },
  {
    id: 'reviews',
    labelMarathi: 'नागरिक अभिप्राय व रेटिंग',
    labelEnglish: 'Citizen Feedback',
    icon: 'rate_review',
    category: 'SERVICES',
    description: 'ग्रामपंचायत सेवांवरील गावकऱ्यांच्या प्रतिक्रिया व समाधान निर्देशांक'
  },
  {
    id: 'contacts',
    labelMarathi: 'महत्त्वाचे संपर्क व अधिकारी',
    labelEnglish: 'Directory & Helplines',
    icon: 'contact_phone',
    category: 'SERVICES',
    description: 'तलाठी, आरोग्य सेविका, सरपंच, वीज मंडळ व पोलीस संपर्क'
  },
  {
    id: 'transport',
    labelMarathi: 'बस व वाहतूक वेळापत्रक',
    labelEnglish: 'Transport Schedules',
    icon: 'directions_bus',
    category: 'SERVICES',
    description: 'पवनी-आसगाव एसटी बसेस, ऑटो रिक्षा व रेल्वे वेळापत्रक'
  },
  {
    id: 'shiksha',
    labelMarathi: 'शिक्षण व अभ्यास दालन',
    labelEnglish: 'Education & Library',
    icon: 'school',
    category: 'SERVICES',
    description: 'शाळा, वाचनालय, स्पर्धा परीक्षा तयारी व विद्यार्थी उपक्रम'
  },
  {
    id: 'gallery',
    labelMarathi: 'ग्राम छायाचित्र दालन',
    labelEnglish: 'Village Photo Gallery',
    icon: 'photo_library',
    category: 'CONTENT',
    description: 'गावातील सण, उत्सव, विकासकामे व ऐतिहासिक क्षणचित्रे'
  },
  {
    id: 'events',
    labelMarathi: 'ग्राम दिनदर्शिका व कार्यक्रम',
    labelEnglish: 'Events Calendar',
    icon: 'event',
    category: 'CONTENT',
    description: 'ग्रामसभा, आरोग्य शिबीर, लसीकरण व सांस्कृतिक कार्यक्रम'
  },
  {
    id: 'banners',
    labelMarathi: 'मुखपृष्ठ बॅनर व जाहिराती',
    labelEnglish: 'Home Banners',
    icon: 'view_carousel',
    category: 'CONTENT',
    description: 'वेबसाईटच्या पहिल्या पानावर दिसणारे महत्त्वाचे बॅनर'
  },
  {
    id: 'blogs',
    labelMarathi: 'ग्राम वार्ता व यशोगाथा',
    labelEnglish: 'Village Blogs & Stories',
    icon: 'menu_book',
    category: 'CONTENT',
    description: 'गावाचा इतिहास, प्रगतशील शेतकरी यशोगाथा व लेख प्रसिद्ध करणे'
  },
  {
    id: 'notices',
    labelMarathi: 'सूचना फलक व जाहीर परिपत्रके',
    labelEnglish: 'Public Announcements',
    icon: 'campaign',
    category: 'CONTENT',
    description: 'अधिकृत ग्रामपंचायत दवंडी, ग्रामसभा सूचना व परिपत्रके'
  },
  {
    id: 'users',
    labelMarathi: 'नागरिक व वापरकर्ता नोंदणी',
    labelEnglish: 'Citizen Directory',
    icon: 'group',
    category: 'SYSTEM',
    description: 'नोंदणीकृत गावकऱ्यांची खाती, आधार पडताळणी व वॉर्ड माहिती'
  },
  {
    id: 'logs',
    labelMarathi: 'ऑडिट लॉग व सुरक्षा नोंदी',
    labelEnglish: 'System Audit Logs',
    icon: 'security',
    category: 'SYSTEM',
    description: 'सर्व प्रशासकीय कृती, बदल व लॉगिन इतिहासाच्या नोंदी'
  },
  {
    id: 'transparency',
    labelMarathi: 'ग्रामपंचायत पारदर्शकता व बजेट',
    labelEnglish: 'Panchayat Transparency',
    icon: 'account_balance',
    category: 'SYSTEM',
    description: '१५ वा वित्त आयोग, ग्रामनिधी जमा-खर्च व सार्वजनिक हिशोब'
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

const PERMISSIONS_STORAGE_KEY = 'dg_admin_module_permissions_v2';

export const getStoredPermissionsMap = (): Record<string, AdminModuleId[]> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
};

export const saveStoredPermissionsMap = (map: Record<string, AdminModuleId[]>) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(map));
  }
};

export const getStoredManagedAdmins = (): ManagedAdminUser[] => {
  // Purge obsolete dummy key
  if (typeof window !== 'undefined' && localStorage.getItem('dg_managed_admin_users_v1')) {
    localStorage.removeItem('dg_managed_admin_users_v1');
  }

  const permissionsMap = getStoredPermissionsMap();
  let userList: any[] = [];
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('dg_users_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (parsed.some((u: any) => String(u.id).startsWith('usr-root') || String(u.id).startsWith('usr-sevak') || String(u.id).startsWith('usr-sarpanch'))) {
            localStorage.removeItem('dg_users_cache');
          } else {
            userList = parsed;
          }
        }
      } catch {}
    }
  }

  const adminUsers = userList.filter((u) => {
    const rawRoles = Array.isArray(u.roles) ? u.roles.map(String) : [];
    return (
      rawRoles.some((r: string) => r.includes('ADMIN') || r.includes('SUPER_ADMIN')) ||
      u.role === 'ADMIN' ||
      u.role === 'SUPER_ADMIN'
    );
  });

  if (adminUsers.length === 0) {
    return [];
  }

  return adminUsers.map((u) => {
    const rawRoles = Array.isArray(u.roles) ? u.roles.map(String) : [];
    const isSuper =
      rawRoles.some((r: string) => r.includes('SUPER_ADMIN')) ||
      u.role === 'SUPER_ADMIN';
    const role: 'ADMIN' | 'SUPER_ADMIN' = isSuper ? 'SUPER_ADMIN' : 'ADMIN';
    const cleanPhone = (u.phone || '').trim();

    return {
      id: String(u.id),
      fullName: u.fullName || (isSuper ? 'Super Admin' : 'प्रशासक'),
      phone: u.phone,
      email: u.email || undefined,
      role,
      wardOrDept: u.wardNumber || u.occupation || 'ग्रामपंचायत प्रशासन',
      isActive: u.isActive !== false,
      isRoot: Boolean(u.isRoot),
      allowedModules: isSuper
        ? ADMIN_MODULES_LIST.map((m) => m.id)
        : permissionsMap[cleanPhone] || [
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
      createdDate: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString('mr-IN', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'नोंदणीकृत',
      lastLogin: 'सक्रिय',
      notes: u.occupation || undefined
    };
  });
};

export const DEFAULT_MANAGED_ADMINS = getStoredManagedAdmins();

export const saveStoredManagedAdmins = (admins: ManagedAdminUser[]) => {
  const map = getStoredPermissionsMap();
  admins.forEach((a) => {
    if (a.phone) {
      map[a.phone.trim()] = a.allowedModules;
    }
  });
  saveStoredPermissionsMap(map);
};

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

  const cleanPhone = (userPhone || '').trim();
  const permissionsMap = getStoredPermissionsMap();
  if (cleanPhone && permissionsMap[cleanPhone]) {
    return permissionsMap[cleanPhone];
  }

  const admins = getStoredManagedAdmins();
  const matched = admins.find(
    (a) => a.phone === userPhone || a.phone.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, '')
  );

  if (matched && Array.isArray(matched.allowedModules) && matched.allowedModules.length > 0) {
    return matched.allowedModules;
  }

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
  users?: any[];
  onRefreshUsers?: () => void;
}

export const AdminManagementSection: React.FC<AdminManagementSectionProps> = ({
  currentUser,
  onAuditLog,
  users: propUsers,
  onRefreshUsers
}) => {
  // Clean up any stale dummy storage
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('dg_managed_admin_users_v1')) {
      localStorage.removeItem('dg_managed_admin_users_v1');
    }
  }, []);

  const [internalUsers, setInternalUsers] = useState<any[]>(() => {
    if (propUsers && propUsers.length > 0) return propUsers;
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('dg_users_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return [];
  });

  useEffect(() => {
    if (propUsers && propUsers.length > 0) {
      setInternalUsers(propUsers);
    }
  }, [propUsers]);

  useEffect(() => {
    if (internalUsers.length === 0) {
      api.getAdminUsers()
        .then((res) => {
          if (res && Array.isArray(res) && res.length > 0) {
            setInternalUsers(res);
            localStorage.setItem('dg_users_cache', JSON.stringify(res));
          }
        })
        .catch(() => {});
    }
  }, []);

  const [permissionsMap, setPermissionsMap] = useState<Record<string, AdminModuleId[]>>(() => getStoredPermissionsMap());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'SUPER_ADMIN'>('ALL');
  const [selectedAdmin, setSelectedAdmin] = useState<ManagedAdminUser | null>(null);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<'SELECT_EXISTING' | 'CREATE_NEW'>('SELECT_EXISTING');
  const [selectedCitizenId, setSelectedCitizenId] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Derived real admins from the database/user directory
  const admins: ManagedAdminUser[] = useMemo(() => {
    const adminUserRecords = internalUsers.filter((u) => {
      const roles = Array.isArray(u.roles) ? u.roles.map(String) : [];
      return (
        roles.some((r: string) => r.includes('ADMIN') || r.includes('SUPER_ADMIN')) ||
        u.role === 'ADMIN' ||
        u.role === 'SUPER_ADMIN'
      );
    });

    if (adminUserRecords.length === 0) {
      return getStoredManagedAdmins();
    }

    return adminUserRecords.map((u) => {
      const roles = Array.isArray(u.roles) ? u.roles.map(String) : [];
      const isSuper =
        roles.some((r: string) => r.includes('SUPER_ADMIN')) ||
        u.role === 'SUPER_ADMIN';

      const userRole: 'ADMIN' | 'SUPER_ADMIN' = isSuper ? 'SUPER_ADMIN' : 'ADMIN';
      const cleanPhone = (u.phone || '').trim();

      const userAllowedModules = isSuper
        ? ADMIN_MODULES_LIST.map((m) => m.id)
        : permissionsMap[cleanPhone] || [
            'overview',
            'reviews',
            'notices',
            'water',
            'schemes',
            'complaints',
            'contacts',
            'projects',
            'broadcast'
          ];

      return {
        id: String(u.id),
        fullName: u.fullName || (isSuper ? 'Super Admin' : 'प्रशासक'),
        phone: u.phone,
        email: u.email || undefined,
        role: userRole,
        wardOrDept: u.wardNumber || u.occupation || 'ग्रामपंचायत प्रशासन',
        isActive: u.isActive !== false,
        isRoot: Boolean(u.isRoot),
        allowedModules: userAllowedModules,
        lastLogin: u.phone === currentUser?.phone ? 'आत्ताच सक्रिय (चालू सत्र)' : 'सक्रिय',
        createdDate: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString('mr-IN', { day: '2-digit', month: 'long', year: 'numeric' })
          : 'नोंदणीकृत',
        notes: u.occupation || undefined
      };
    });
  }, [internalUsers, permissionsMap, currentUser]);

  // Citizens available for promotion (excluding existing admins)
  const availableCitizens = useMemo(() => {
    return internalUsers.filter((u) => {
      const roles = Array.isArray(u.roles) ? u.roles.map(String) : [];
      const isAlreadyAdmin =
        roles.some((r: string) => r.includes('ADMIN') || r.includes('SUPER_ADMIN')) ||
        u.role === 'ADMIN' ||
        u.role === 'SUPER_ADMIN';
      return !isAlreadyAdmin;
    });
  }, [internalUsers]);

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
      targetModules = ['overview'];
    }

    setSelectedAdmin({
      ...selectedAdmin,
      allowedModules: targetModules
    });
  };

  // Save Permissions to Admin
  const handleSavePermissions = () => {
    if (!selectedAdmin) return;

    const cleanPhone = (selectedAdmin.phone || '').trim();
    const newMap = {
      ...permissionsMap,
      [cleanPhone]: selectedAdmin.allowedModules
    };
    setPermissionsMap(newMap);
    saveStoredPermissionsMap(newMap);

    if (onAuditLog) {
      onAuditLog(
        'अधिकार बदलले',
        `${currentUser?.fullName || 'सुपर अॅडमिन'} यांनी ${selectedAdmin.fullName} (${selectedAdmin.phone}) यांचे पृष्ठ अधिकार (${selectedAdmin.allowedModules.length} मॉड्यूल्स) अद्ययावत केले.`
      );
    }
    setIsEditingPermissions(false);
    showFeedback(`✅ ${selectedAdmin.fullName} यांचे प्रवेश अधिकार यशस्वीरीत्या जतन केले!`);
  };

  // Toggle Active/Inactive
  const handleToggleStatus = async (admin: ManagedAdminUser) => {
    if (admin.phone === currentUser?.phone) {
      alert('चालू सत्रात स्वतःचे खाते निष्क्रिय करता येत नाही.');
      return;
    }
    const updatedStatus = !admin.isActive;
    try {
      await api.updateAdminUser(admin.id, { isActive: updatedStatus });
    } catch {}

    setInternalUsers((prev) =>
      prev.map((u) => (String(u.id) === admin.id ? { ...u, isActive: updatedStatus } : u))
    );
    if (onAuditLog) {
      onAuditLog(
        `खाते ${updatedStatus ? 'सक्रिय' : 'निष्क्रिय'} केले`,
        `${currentUser?.fullName || 'सुपर अॅडमिन'} यांनी ${admin.fullName} यांचे अॅडमिन खाते ${updatedStatus ? 'सक्रिय' : 'निष्क्रिय'} केले.`
      );
    }
    showFeedback(`खाते ${updatedStatus ? 'सक्रिय' : 'निष्क्रिय'} करण्यात आले.`);
    onRefreshUsers?.();
  };

  // Toggle Role (ADMIN ⇄ SUPER_ADMIN)
  const handleToggleRole = async (admin: ManagedAdminUser) => {
    if (admin.phone === currentUser?.phone) {
      alert('चालू सत्रात स्वतःची भूमिका बदलता येत नाही.');
      return;
    }
    const newRole: 'ADMIN' | 'SUPER_ADMIN' = admin.role === 'ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';
    try {
      await api.updateUserRole(admin.id, newRole);
    } catch {}

    setInternalUsers((prev) =>
      prev.map((u) => (String(u.id) === admin.id ? { ...u, role: newRole, roles: [newRole] } : u))
    );
    if (onAuditLog) {
      onAuditLog(
        'अॅडमिन भूमिका बदलली',
        `${currentUser?.fullName || 'सुपर अॅडमिन'} यांनी ${admin.fullName} यांची भूमिका ${newRole} केली.`
      );
    }
    showFeedback(`भूमिका ${newRole === 'SUPER_ADMIN' ? 'सुपर अॅडमिन' : 'नियमित अॅडमिन'} मध्ये बदलली.`);
    onRefreshUsers?.();
  };

  // Delete Admin (Demote to CITIZEN)
  const handleDeleteAdmin = async (admin: ManagedAdminUser) => {
    if (admin.phone === currentUser?.phone) {
      alert('चालू सत्रात स्वतःचे खाते काढता येत नाही.');
      return;
    }
    if (!window.confirm(`तुम्हाला खात्री आहे की "${admin.fullName}" यांचे अॅडमिन अधिकार काढायचे आहेत? (हे खाते नियमित नागरिक स्तरावर बदलले जाईल)`)) {
      return;
    }
    try {
      await api.updateUserRole(admin.id, 'CITIZEN');
    } catch {}

    setInternalUsers((prev) =>
      prev.map((u) => (String(u.id) === admin.id ? { ...u, role: 'CITIZEN', roles: ['CITIZEN'] } : u))
    );

    const cleanPhone = (admin.phone || '').trim();
    if (permissionsMap[cleanPhone]) {
      const copy = { ...permissionsMap };
      delete copy[cleanPhone];
      setPermissionsMap(copy);
      saveStoredPermissionsMap(copy);
    }

    if (onAuditLog) {
      onAuditLog(
        'अॅडमिन अधिकार काढले',
        `${currentUser?.fullName || 'सुपर अॅडमिन'} यांनी ${admin.fullName} (${admin.phone}) यांचे अॅडमिन अधिकार काढले.`
      );
    }
    showFeedback(`🗑️ ${admin.fullName} यांचे अॅडमिन अधिकार काढण्यात आले.`);
    onRefreshUsers?.();
  };

  // Add Admin Submit (Promote citizen OR Create new)
  const handleCreateAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (addMode === 'SELECT_EXISTING') {
      const citizen = availableCitizens.find((c) => String(c.id) === selectedCitizenId);
      if (!citizen) {
        alert('कृपया नोंदणीकृत नागरिकांमधून एकाची निवड करा.');
        return;
      }

      try {
        await api.updateUserRole(citizen.id, newAdminForm.role);
      } catch {}

      const cleanPhone = (citizen.phone || '').trim();
      const updatedModules =
        newAdminForm.role === 'SUPER_ADMIN'
          ? ADMIN_MODULES_LIST.map((m) => m.id)
          : newAdminForm.selectedModules;

      const newMap = { ...permissionsMap, [cleanPhone]: updatedModules };
      setPermissionsMap(newMap);
      saveStoredPermissionsMap(newMap);

      setInternalUsers((prev) =>
        prev.map((u) =>
          String(u.id) === String(citizen.id)
            ? { ...u, role: newAdminForm.role, roles: [newAdminForm.role] }
            : u
        )
      );

      if (onAuditLog) {
        onAuditLog(
          'नागरिकाला अॅडमिन बनवले',
          `${currentUser?.fullName || 'सुपर अॅडमिन'} यांनी ${citizen.fullName} (${citizen.phone}) यांना ${newAdminForm.role} अधिकार बहाल केले.`
        );
      }

      setIsAddModalOpen(false);
      setSelectedCitizenId('');
      showFeedback(`🎉 "${citizen.fullName}" यांना यशस्वीरीत्या प्रशासक अधिकार देण्यात आले!`);
      onRefreshUsers?.();
      return;
    }

    // CREATE_NEW Mode
    if (!newAdminForm.fullName.trim() || !newAdminForm.phone.trim()) {
      alert('कृपया नाव व मोबाईल नंबर प्रविष्ट करा.');
      return;
    }

    const cleanPhone = newAdminForm.phone.trim();
    if (admins.some((a) => a.phone === cleanPhone)) {
      alert('या मोबाईल नंबरसह आधीच एक व्यवस्थापक नोंदणीकृत आहे.');
      return;
    }

    let createdUser: any = null;
    try {
      const res = await api.createAdminUser({
        fullName: newAdminForm.fullName.trim(),
        phone: cleanPhone,
        email: newAdminForm.email.trim() || undefined,
        role: newAdminForm.role,
        wardNumber: newAdminForm.wardOrDept.trim() || 'वॉर्ड २ (गावठाण)',
        occupation: 'प्रशासकीय अधिकारी',
        isActive: true,
        isVerified: true
      });
      createdUser = res?.data || res;
    } catch {}

    const updatedModules: AdminModuleId[] =
      newAdminForm.role === 'SUPER_ADMIN'
        ? ADMIN_MODULES_LIST.map((m) => m.id)
        : newAdminForm.selectedModules.length > 0
          ? newAdminForm.selectedModules
          : ['overview', 'schemes', 'complaints', 'contacts'];

    const newMap = { ...permissionsMap, [cleanPhone]: updatedModules };
    setPermissionsMap(newMap);
    saveStoredPermissionsMap(newMap);

    const newUserObj = createdUser || {
      id: `adm-${Date.now()}`,
      fullName: newAdminForm.fullName.trim(),
      phone: cleanPhone,
      email: newAdminForm.email.trim() || undefined,
      role: newAdminForm.role,
      roles: [newAdminForm.role],
      wardNumber: newAdminForm.wardOrDept.trim() || 'ग्रामपंचायत प्रशासन',
      occupation: 'प्रशासकीय अधिकारी',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setInternalUsers((prev) => [newUserObj, ...prev]);

    if (onAuditLog) {
      onAuditLog(
        'नवीन अॅडमिन जोडला',
        `${currentUser?.fullName || 'सुपर अॅडमिन'} यांनी ${newUserObj.fullName} (${newUserObj.phone}) यांना ${newUserObj.role} म्हणून नियुक्त केले.`
      );
    }

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
    showFeedback(`🎉 नवीन व्यवस्थापक "${newUserObj.fullName}" यशस्वीरीत्या जोडले गेले!`);
    onRefreshUsers?.();
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
            <span className="px-2.5 py-0.5 rounded-full bg-[#166534] text-[#a7f3d0] text-[10px] font-black uppercase tracking-wider">
              Super Admin
            </span>
            <span className="text-xs text-[#707974] font-medium">
              व्यवस्थापक व पृष्ठ अधिकार • {currentUser?.fullName || 'प्रशासक'} {currentUser?.phone ? `(${currentUser.phone})` : ''}
            </span>
          </div>
          <h2 className="font-heading font-black text-xl sm:text-2xl text-[#1d1b16] mt-1">
            प्रशासक व्यवस्थापन 
          </h2>
          <p className="text-xs text-[#55605a] mt-1">
            नोंदणीकृत प्रशासकांची खाती, भूमिका व त्यांना उपलब्ध असलेले पृष्ठ अधिकार नियंत्रित करा.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCitizenId('');
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
        >
          <LucideIcon name="person_add" className="text-[18px]" />
          <span>नवा अॅडमिन जोडा</span>
        </button>
      </div>

      {/* Real-time Feedback Banner */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <LucideIcon name="check_circle" className="text-[18px] text-[#059669]" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#e8f1ec] text-[#006a4e] flex items-center justify-center shrink-0">
            <LucideIcon name="manage_accounts" className="text-[22px]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#707974] uppercase tracking-wider">
              एकूण व्यवस्थापक
            </div>
            <div className="font-heading font-black text-xl text-[#1d1b16]">
              {totalAdminsCount}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#fff8e1] text-[#7c4d00] flex items-center justify-center shrink-0">
            <LucideIcon name="military_tech" className="text-[22px]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#707974] uppercase tracking-wider">
              सुपर अॅडमिन
            </div>
            <div className="font-heading font-black text-xl text-[#1d1b16]">
              {superAdminsCount}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#e8e2d9] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#e0f2fe] text-[#0369a1] flex items-center justify-center shrink-0">
            <LucideIcon name="verified_user" className="text-[22px]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#707974] uppercase tracking-wider">
              सक्रिय खाती
            </div>
            <div className="font-heading font-black text-xl text-[#1d1b16]">
              {activeAdminsCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#e8e2d9] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <LucideIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#707974]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाव, मोबाईल, विभाग किंवा ईमेलने शोधा..."
            className="w-full pl-9 pr-4 py-2 bg-[#fcfbf9] rounded-xl text-xs border border-[#e8e2d9] focus:border-[#166534] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#707974] hover:text-[#1d1b16]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#f3ede4] p-1 rounded-xl shrink-0">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'ALL'
                ? 'bg-white text-[#166534] shadow-xs'
                : 'text-[#55605a] hover:text-[#1d1b16]'
            }`}
          >
            सर्व ({totalAdminsCount})
          </button>
          <button
            onClick={() => setRoleFilter('SUPER_ADMIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'SUPER_ADMIN'
                ? 'bg-white text-[#166534] shadow-xs'
                : 'text-[#55605a] hover:text-[#1d1b16]'
            }`}
          >
            सुपर अॅडमिन ({superAdminsCount})
          </button>
          <button
            onClick={() => setRoleFilter('ADMIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'ADMIN'
                ? 'bg-white text-[#166534] shadow-xs'
                : 'text-[#55605a] hover:text-[#1d1b16]'
            }`}
          >
            नियमित ({totalAdminsCount - superAdminsCount})
          </button>
        </div>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAdmins.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-[#e8e2d9] text-center text-[#707974] text-xs">
            कोणतेही व्यवस्थापक सापडले नाहीत.
          </div>
        )}

        {filteredAdmins.map((admin) => {
          const isSuper = admin.role === 'SUPER_ADMIN';
          const allowedCount = admin.allowedModules.length;

          return (
            <div
              key={admin.id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                isSuper
                  ? 'border-[#ffecb3] bg-gradient-to-br from-white via-white to-[#fffdf5]'
                  : 'border-[#e8e2d9]'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 relative ${
                        isSuper
                          ? 'bg-[#166534] text-white shadow-xs'
                          : 'bg-[#e8f1ec] text-[#006a4e]'
                      }`}
                    >
                      {admin.fullName.charAt(0) || 'अ'}
                      {admin.isRoot && (
                        <span
                          title="मूळ सुपर अॅडमिन"
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#eab308] text-white flex items-center justify-center text-[10px]"
                        >
                          ★
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-heading font-extrabold text-[14px] sm:text-[15px] text-[#1d1b16] truncate">
                          {admin.fullName}
                        </h3>
                        {isSuper && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#ffecb3] text-[#7c4d00] flex items-center gap-0.5 shrink-0">
                            <LucideIcon name="star" className="text-[11px]" />
                            SUPER
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#707974] flex items-center gap-1.5 mt-0.5 truncate">
                        <LucideIcon name="call" className="text-[13px] text-[#006a4e]" />
                        <strong className="text-[#166534] font-mono">{admin.phone}</strong>
                        {admin.email && <span>• {admin.email}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                      admin.isActive
                        ? 'bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]'
                        : 'bg-[#fef3c7] text-[#ba1a1a]'
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
                    <span className="text-[#166534] flex items-center gap-1">
                      <LucideIcon name="vpn_key" className="text-[14px] text-[#006a4e]" />
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
                        सर्व पानांचा अधिकार 
                      </span>
                    ) : (
                      admin.allowedModules.map((modId) => {
                        const m = ADMIN_MODULES_LIST.find((item) => item.id === modId);
                        return (
                          <span
                            key={modId}
                            className="px-2 py-0.5 rounded-md bg-[#f3ede4] text-[#166534] text-[10px] font-medium flex items-center gap-1"
                          >
                            <LucideIcon name={m?.icon || 'tag'} className="text-[11px] text-[#006a4e]" />
                            <span>{m?.labelMarathi || modId}</span>
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-3 border-t border-[#f0eee8] flex items-center justify-between gap-2 flex-wrap mt-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Configure Permissions Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenPermissionModal(admin)}
                    className="px-3 py-1.5 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    <LucideIcon name="tune" className="text-[14px]" />
                    <span>अधिकार बदला</span>
                  </button>

                  {/* Toggle Role Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleRole(admin)}
                    title="भूमिका बदला"
                    className="px-2.5 py-1.5 rounded-xl bg-[#f5ede3] hover:bg-[#e8ded3] text-[#166534] text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <LucideIcon name={isSuper ? 'arrow_downward' : 'arrow_upward'} className=" text-[14px]" />
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
                        ? 'text-[#55605a] hover:bg-[#f3ede4] hover:text-[#c2410c]'
                        : 'text-[#006a4e] bg-[#e8f1ec] hover:bg-[#a7f3d0]'
                    }`}
                  >
                    <LucideIcon name={admin.isActive ? 'block' : 'check_circle'} className=" text-[17px]" />
                  </button>

                  {/* Delete / Demote Admin */}
                  <button
                    type="button"
                    onClick={() => handleDeleteAdmin(admin)}
                    title="अॅडमिन अधिकार काढून टाका"
                    className="p-1.5 rounded-xl text-[#ba1a1a] hover:bg-[#fef3c7]/40 transition-all cursor-pointer"
                  >
                    <LucideIcon name="delete" className="text-[17px]" />
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
                <span className="px-2.5 py-0.5 rounded-full bg-[#166534] text-[#a7f3d0] text-[10px] font-black uppercase">
                  पृष्ठ अधिकार
                </span>
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#166534] mt-1">
                  {selectedAdmin.fullName} — पाने ठरवा
                </h3>
                <p className="text-xs text-[#55605a] mt-0.5">
                  मोबाईल: <strong className="text-[#166534] font-mono">{selectedAdmin.phone}</strong> • विभाग: {selectedAdmin.wardOrDept}
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
                साचे :
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('all')}
                  className="px-2.5 py-1 rounded-xl bg-[#166534] text-white text-[11px] font-bold hover:bg-[#052e16] transition-all cursor-pointer"
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
              <div className="flex items-center justify-between text-xs font-bold text-[#166534]">
                <span>उपलब्ध मॉड्यूल्स ({ADMIN_MODULES_LIST.length}):</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] font-black text-[11px]">
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
                          ? 'border-[#166534] bg-[#f0fdf4] shadow-xs'
                          : 'border-[#e8e2d9] bg-white hover:bg-[#fcfbf9]'
                      }`}
                    >
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded-md accent-[#166534] cursor-pointer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <LucideIcon name={mod.icon} className={` text-[17px] ${isChecked ? 'text-[#006a4e]' : 'text-[#707974]'}`} />
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
                  className="px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
                >
                  <LucideIcon name="save" className="text-[16px]" />
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
                <span className="px-2.5 py-0.5 rounded-full bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-[10px] font-black uppercase">
                  नवीन अॅडमिन
                </span>
                <h3 className="font-heading font-black text-lg text-[#166534] mt-1">
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

            {/* Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-[#f0eee8] rounded-xl">
              <button
                type="button"
                onClick={() => setAddMode('SELECT_EXISTING')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  addMode === 'SELECT_EXISTING'
                    ? 'bg-white text-[#166534] shadow-xs'
                    : 'text-[#55605a] hover:text-[#1d1b16]'
                }`}
              >
                गावकऱ्यांमधून निवडा ({availableCitizens.length})
              </button>
              <button
                type="button"
                onClick={() => setAddMode('CREATE_NEW')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  addMode === 'CREATE_NEW'
                    ? 'bg-white text-[#166534] shadow-xs'
                    : 'text-[#55605a] hover:text-[#1d1b16]'
                }`}
              >
                नवीन ऍडमिन थेट जोडा
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateAdminSubmit} className="flex flex-col gap-3">
              {addMode === 'SELECT_EXISTING' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#166534]">
                    नोंदणीकृत नागरिक निवडा *
                  </label>
                  {availableCitizens.length === 0 ? (
                    <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                      सध्या सर्व नागरिक आधीच प्रशासक आहेत किंवा नागरिक यादी उपलब्ध नाही. &apos;नवीन ऍडमिन थेट जोडा&apos; पर्याय वापरा.
                    </p>
                  ) : (
                    <select
                      required
                      value={selectedCitizenId}
                      onChange={(e) => setSelectedCitizenId(e.target.value)}
                      className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs font-bold text-[#1d1b16] border border-[#e8e2d9] focus:border-[#166534] outline-none"
                    >
                      <option value="">-- नागरिक निवडा --</option>
                      {availableCitizens.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.fullName} - {c.phone} ({c.wardNumber || c.occupation || 'गावकरी'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[#166534]">पूर्ण नाव *</label>
                      <input
                        type="text"
                        required
                        value={newAdminForm.fullName}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, fullName: e.target.value })}
                        placeholder="उदा. राहुल देशमुख"
                        className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs border border-[#e8e2d9] focus:border-[#166534] outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[#166534]">मोबाईल नंबर *</label>
                      <input
                        type="tel"
                        required
                        value={newAdminForm.phone}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                        placeholder="उदा. 9823456789"
                        className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs border border-[#e8e2d9] focus:border-[#166534] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[#166534]">ईमेल (ऐच्छिक)</label>
                      <input
                        type="email"
                        value={newAdminForm.email}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                        placeholder="उदा. rahul@asgaon.in"
                        className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs border border-[#e8e2d9] focus:border-[#166534] outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[#166534]">विभाग / जबाबदारी</label>
                      <input
                        type="text"
                        value={newAdminForm.wardOrDept}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, wardOrDept: e.target.value })}
                        placeholder="उदा. पाणी पुरवठा / नागरी सेवा"
                        className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs border border-[#e8e2d9] focus:border-[#166534] outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Role Select */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#166534]">भूमिका निवडा *</label>
                <select
                  value={newAdminForm.role}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value as any })}
                  className="p-2.5 bg-[#fcfbf9] rounded-xl text-xs font-bold text-[#166534] border border-[#e8e2d9] focus:border-[#166534] outline-none"
                >
                  <option value="ADMIN">नियमित अॅडमिन (विशिष्ट पृष्ठ अधिकार)</option>
                  <option value="SUPER_ADMIN">सुपर अॅडमिन (सर्व पानांचा पूर्ण अधिकार)</option>
                </select>
              </div>

              {/* Initial Permissions Info */}
              <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#cadbcf] text-[11px] text-[#166534]">
                {newAdminForm.role === 'SUPER_ADMIN'
                  ? '✨ सुपर अॅडमिनला मुख्य डॅशबोर्ड, पारदर्शकता, वॉर्ड व इतर सर्व पानांचे सर्वोच्च अधिकार मिळतील.'
                  : 'ℹ️ नियमित अॅडमिनची नियुक्ती झाल्यावर आपण \'अधिकार बदला\' बटणावरून त्यांना नेमकी कोणती पाने दिसावीत ते ठरवू शकता.'}
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
                  disabled={addMode === 'SELECT_EXISTING' && !selectedCitizenId}
                  className="px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#052e16] disabled:bg-gray-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
                >
                  <LucideIcon name="check" className="text-[16px]" />
                  <span>{addMode === 'SELECT_EXISTING' ? 'अधिकार प्रदान करा' : 'अॅडमिन जोडा'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
