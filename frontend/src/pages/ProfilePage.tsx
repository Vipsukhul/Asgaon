import { LucideIcon } from '../components/LucideIcon';
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import type { Scheme, Business, Job } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { isPushSubscribed, subscribeUserToPush, unsubscribeUserFromPush } from '../services/pushNotifications';

export interface UserProfileData {
  fullName: string;
  phone: string;
  role: string;
  ward: string;
  village: string;
  isLoggedIn: boolean;
  avatarInitials: string;
  profileImage?: string;
  occupation?: string;
  landHolding?: string;
  shopName?: string;
  preferredLanguage?: 'MR' | 'EN';
}

interface ProfilePageProps {
  onNavigateHome: () => void;
  onOpenLoginModal?: () => void;
  currentUser?: UserProfileData;
  onUpdateUser?: (updated: UserProfileData) => void;
  onLogout?: () => void;
  schemes?: Scheme[];
  businesses?: Business[];
  jobs?: Job[];
  onOpenRegisterShop?: () => void;
  onOpenPostJob?: () => void;
  onSelectBusinessSlug?: (slug: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateHome,
  onOpenLoginModal,
  currentUser = {
    fullName: 'Asgaon Citizen',
    phone: '9822104500',
    role: 'CITIZEN',
    ward: 'Gandhi Ward',
    village: 'Asgaon, Pauni (PIN 441910)',
    isLoggedIn: false,
    avatarInitials: 'AC',
    preferredLanguage: 'MR'
  },
  onUpdateUser,
  onLogout,
  schemes = [],
  businesses = [],
  jobs = [],
  onOpenRegisterShop,
  onOpenPostJob,
  onSelectBusinessSlug
}) => {
  const { lang, setLang, t } = useLanguage();
  const toast = useToast();
  const isMr = lang === 'MR';
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'my-listings' | 'broadcasts'>('overview');
  const [showRosterAlert, setShowRosterAlert] = useState(true);

  // Compute listings associated with current user's phone
  const userPhoneDigits = (currentUser?.phone || '').replace(/\D/g, '').slice(-10);

  const myBusinesses = useMemo(() => {
    if (!userPhoneDigits) return [];
    return businesses.filter((b) => {
      const bDigits = (b.phone || '').replace(/\D/g, '').slice(-10);
      return bDigits && bDigits === userPhoneDigits;
    });
  }, [businesses, userPhoneDigits]);

  const myJobs = useMemo(() => {
    if (!userPhoneDigits) return [];
    return jobs.filter((j) => {
      const jDigits = (j.contactPhone || '').replace(/\D/g, '').slice(-10);
      return jDigits && jDigits === userPhoneDigits;
    });
  }, [jobs, userPhoneDigits]);

  // Edit Profile Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser.fullName);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editWard, setEditWard] = useState(currentUser.ward);
  const [editRole, setEditRole] = useState(currentUser.role);
  const [editOccupation, setEditOccupation] = useState(currentUser.occupation || 'Farmer / Cultivator');
  const [editLang, setEditLang] = useState<'MR' | 'EN'>(currentUser.preferredLanguage || lang);

  // SMS Subscriptions state
  const [mandiSms, setMandiSms] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [gramSabhaSms, setGramSabhaSms] = useState(true);
  const [powerSchedule, setPowerSchedule] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushToggling, setPushToggling] = useState(false);

  useEffect(() => {
    isPushSubscribed().then(setPushEnabled);
  }, []);

  const handleToggleWebPush = async () => {
    setPushToggling(true);
    try {
      if (pushEnabled) {
        const res = await unsubscribeUserFromPush();
        toast.info(res.message, isMr ? 'पुश सूचना बंद' : 'Push Alerts Disabled');
        setPushEnabled(false);
      } else {
        const res = await subscribeUserToPush(currentUser.phone, currentUser.role);
        if (res.success) {
          toast.success(res.message, isMr ? 'पुश सूचना सक्रिय' : 'Push Alerts Enabled');
          setPushEnabled(true);
        } else {
          toast.warning(res.message, isMr ? 'सूचना' : 'Notification');
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      toast.error(errorMsg || (isMr ? 'पुश सूचना बदलताना त्रुटी आली' : 'Failed to update push notifications'));
    } finally {
      setPushToggling(false);
    }
  };

  const handleToggleMandiSms = (val: boolean) => {
    setMandiSms(val);
    toast.info(
      val
        ? (isMr ? 'दैनिक कृषी बाजारभाव (मंडी भाव) एसएमएस सुरू केले.' : 'Daily Mandi Price SMS enabled.')
        : (isMr ? 'दैनिक कृषी बाजारभाव एसएमएस बंद केले.' : 'Daily Mandi Price SMS disabled.')
    );
  };

  const handleToggleWeatherAlerts = (val: boolean) => {
    setWeatherAlerts(val);
    toast.info(
      val
        ? (isMr ? 'हवामान अंदाज व कालवा पाणी वाटप सूचना सुरू केल्या.' : 'Weather & Canal Water Alerts enabled.')
        : (isMr ? 'हवामान अंदाज सूचना बंद केल्या.' : 'Weather & Canal Water Alerts disabled.')
    );
  };

  const handleToggleGramSabhaSms = (val: boolean) => {
    setGramSabhaSms(val);
    toast.info(
      val
        ? (isMr ? 'ग्रामसभा विषयसूची व बैठक एसएमएस सुरू केले.' : 'Gram Sabha Agenda & Meeting Alerts enabled.')
        : (isMr ? 'ग्रामसभा बैठक एसएमएस बंद केले.' : 'Gram Sabha Alerts disabled.')
    );
  };

  const handleTogglePowerSchedule = (val: boolean) => {
    setPowerSchedule(val);
    toast.info(
      val
        ? (isMr ? 'शेती वीज पुरवठा वेळापत्रक सूचना सुरू केल्या.' : 'Agri Feeder Power Schedule Alerts enabled.')
        : (isMr ? 'शेती वीज पुरवठा सूचना बंद केल्या.' : 'Agri Feeder Power Schedule Alerts disabled.')
    );
  };

  // Saved items list
  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      type: 'Govt Subsidy Scheme',
      title: 'PM-KUSUM Component-B 90% Solar Pump Subsidy',
      sub: 'Grant: 90% capital subsidy directly to bank',
      icon: 'solar_power',
      iconColor: 'bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]',
      url: 'https://pmkusum.mahadiscom.in'
    },
    {
      id: 2,
      type: 'Irrigation & Farm Pond',
      title: 'Magel Tyala Shettale (मागेल त्याला शेततळे)',
      sub: 'Govt grant ₹50,000 for verified farm pond',
      icon: 'water_drop',
      iconColor: 'bg-[#dbe1ff] text-[#002873]',
      url: 'https://aaplesarkar.mahaonline.gov.in'
    }
  ]);

  const handleSetDefaultLanguage = (newLang: 'MR' | 'EN') => {
    setLang(newLang);
    setEditLang(newLang);
    const updated: UserProfileData = {
      ...currentUser,
      preferredLanguage: newLang
    };
    onUpdateUser?.(updated);
    const existing = localStorage.getItem('dg_user');
    let extra = {};
    if (existing) {
      try { extra = JSON.parse(existing); } catch {}
    }
    localStorage.setItem('dg_user', JSON.stringify({ ...extra, preferredLanguage: newLang }));
    toast.success(
      newLang === 'MR'
        ? 'पोर्टलची डीफॉल्ट भाषा मराठी (MR) म्हणून सेव्ह केली.'
        : 'Portal default language saved as English (EN).',
      isMr ? 'भाषा बदलली' : 'Language Updated'
    );
  };

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const applyNewProfileImage = (imageUrl: string) => {
    const updated: UserProfileData = {
      ...currentUser,
      profileImage: imageUrl
    };
    onUpdateUser?.(updated);
    const saved = localStorage.getItem('dg_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        localStorage.setItem('dg_user', JSON.stringify({ ...u, profileImage: imageUrl }));
      } catch {
        localStorage.setItem('dg_user', JSON.stringify(updated));
      }
    } else {
      localStorage.setItem('dg_user', JSON.stringify(updated));
    }
    toast.success(
      isMr ? 'प्रोफाइल फोटो यशस्वीरीत्या अद्ययावत केला!' : 'Profile picture updated successfully!',
      isMr ? 'यशस्वी' : 'Success'
    );
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploadingAvatar(true);
    try {
      const url = await api.uploadImage(file, 'profiles');
      if (url) {
        applyNewProfileImage(url);
        return;
      }
      throw new Error('Upload returned empty');
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          applyNewProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = editName.trim()
      ? editName.trim().split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
      : 'AC';

    const updated: UserProfileData = {
      ...currentUser,
      fullName: editName,
      phone: editPhone,
      ward: editWard,
      role: editRole,
      avatarInitials: initials,
      occupation: editOccupation,
      profileImage: currentUser?.profileImage,
      preferredLanguage: editLang
    };

    onUpdateUser?.(updated);
    setLang(editLang);
    const existing = localStorage.getItem('dg_user');
    let extra = {};
    if (existing) {
      try {
        extra = JSON.parse(existing);
      } catch {}
    }
    localStorage.setItem('dg_user', JSON.stringify({
      ...extra,
      fullName: editName,
      phone: editPhone,
      roles: currentUser.role ? [currentUser.role.startsWith('ROLE_') ? currentUser.role : 'ROLE_' + currentUser.role] : ['ROLE_CITIZEN'],
      ward: editWard,
      occupation: editOccupation,
      profileImage: currentUser?.profileImage,
      preferredLanguage: editLang
    }));
    setEditModalOpen(false);
    toast.success(
      isMr ? 'तुमची प्रोफाइल माहिती यशस्वीरीत्या जतन केली!' : 'Profile details updated successfully!',
      isMr ? 'प्रोफाइल जतन' : 'Profile Saved'
    );
  };

  const removeSavedItem = (id: number) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
    toast.info(
      isMr ? 'जतन केलेल्या यादीतून योजना काढली.' : 'Item removed from saved bookmarks.',
      isMr ? 'काढले' : 'Removed'
    );
  };

  const getRoleLabel = (role: string) => {
    const clean = (role || 'CITIZEN').replace('ROLE_', '');
    switch (clean) {
      case 'SUPER_ADMIN':
        return isMr ? 'मुख्य प्रशासक' : 'Super Admin';
      case 'ADMIN':
        return isMr ? 'प्रशासक' : 'Admin';
      case 'CITIZEN':
      default:
        return isMr ? 'नागरिक' : 'Citizen';
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <Breadcrumb
        items={[
          { label: t('nav_home'), onClick: onNavigateHome },
          { label: t('nav_profile'), active: true }
        ]}
      />

      {/* 1. Rotational Canal Water Alert Banner */}
      {showRosterAlert && (
        <div className="w-full bg-amber-50/90 text-amber-950 py-3 px-4 rounded-2xl shadow-xs border border-amber-200/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <LucideIcon name="water_drop" className="text-[20px] text-amber-700 shrink-0" />
            <div className="truncate">
              <span className="font-heading font-extrabold text-[13px] text-amber-900 mr-2">
                {isMr ? 'आसगाव कालवा पाणी वाटप रोस्टर:' : 'Asgaon Canal Water Roster:'}
              </span>
              <span className="text-[13px] font-semibold text-amber-950/80">
                {isMr
                  ? 'खडकवासला कालव्याचे सिंचन आवर्तन उद्या सकाळी ०६:०० वाजता सेक्टर २ व ३ साठी सुरू होईल.'
                  : 'Rotational irrigation release from Khadakwasla canal commences tomorrow at 06:00 AM for Sector 2 & 3.'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {isMr ? 'अधिकृत सूचना' : 'OFFICIAL NOTICE'}
            </span>
            <button
              onClick={() => setShowRosterAlert(false)}
              className="text-[12px] font-bold text-amber-900 hover:underline cursor-pointer"
            >
              {isMr ? 'बंद करा' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}

      {/* 2. Dynamic Citizen Profile Header Card (Clean & Proper Modern Design) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/90 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full lg:w-auto">
          {/* Prominent Circular Profile Avatar */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 text-emerald-100 flex items-center justify-center font-heading font-black text-3xl sm:text-4xl ring-4 ring-emerald-50 border-2 border-emerald-600/30 shadow-md">
              {currentUser.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{currentUser.avatarInitials}</span>
              )}
            </div>

            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-2xs">
                <LucideIcon name="refresh" className="animate-spin text-[24px]" />
              </div>
            )}
          </div>

          {/* Citizen Identity and Photo Action Buttons */}
          <div className="flex-1 text-center sm:text-left space-y-2.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                {currentUser.fullName}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                <LucideIcon name="verified" className="text-[14px] text-emerald-700" />
                <span>{getRoleLabel(currentUser.role)}</span>
              </span>
            </div>

            {/* Meta chips: Ward & Phone */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-stone-600">
              <span className="flex items-center gap-1.5">
                <LucideIcon name="location_on" className="text-[16px] text-amber-600" />
                <span>{currentUser.ward || (isMr ? 'प्रभाग २' : 'Ward 2')}, {isMr ? 'आसगाव (४४१९१०)' : 'Asgaon (441910)'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <LucideIcon name="smartphone" className="text-[16px] text-emerald-700" />
                <span className="font-semibold text-stone-800">
                  {currentUser.phone ? `+91 ${currentUser.phone}` : (isMr ? 'नोंदणी नसलेला मोबाईल' : 'Unregistered Mobile')}
                </span>
                <span className="text-[10px] text-emerald-800 font-extrabold bg-emerald-100 px-1.5 py-0.5 rounded-md">
                  {isMr ? 'सक्रिय' : 'Active'}
                </span>
              </span>
            </div>

            {/* Direct Profile Photo Upload & Camera Action Controls */}
            <div className="pt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-700 bg-stone-50 hover:bg-emerald-50/60 text-stone-700 hover:text-emerald-900 font-bold transition-all shadow-2xs">
                <LucideIcon name="upload" className="text-[14px] text-emerald-700" />
                <span>{isMr ? 'डिव्हाइसवरून फोटो जोडा' : 'Upload from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
              </label>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-700 bg-stone-50 hover:bg-emerald-50/60 text-stone-700 hover:text-emerald-900 font-bold transition-all shadow-2xs">
                <LucideIcon name="camera" className="text-[14px] text-emerald-700" />
                <span>{isMr ? 'कॅमेऱ्याने फोटो काढा' : 'Take with Camera'}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
              </label>

              {currentUser.profileImage && (
                <button
                  type="button"
                  onClick={() => applyNewProfileImage('')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-bold transition-all"
                  title={isMr ? "फोटो काढून टाका" : "Remove photo"}
                >
                  <LucideIcon name="close" className="text-[14px]" />
                  <span>{isMr ? 'काढा' : 'Remove'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Edit Profile & Sign Out */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
          <button
            onClick={() => {
              setEditName(currentUser.fullName);
              setEditPhone(currentUser.phone);
              setEditWard(currentUser.ward);
              setEditRole(currentUser.role);
              setEditOccupation(currentUser.occupation || 'Farmer / Cultivator');
              setEditModalOpen(true);
            }}
            className="flex-1 lg:flex-initial px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <LucideIcon name="edit" className="text-[16px]" />
            <span>{isMr ? 'माहिती बदला' : 'Edit Profile'}</span>
          </button>

          {currentUser.isLoggedIn ? (
            <button
              onClick={onLogout}
              className="flex-1 lg:flex-initial px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border border-stone-200 hover:border-red-200 transition-colors cursor-pointer"
            >
              <LucideIcon name="logout" className="text-[16px]" />
              <span>{isMr ? 'बाहेर पडा' : 'Sign Out'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex-1 lg:flex-initial px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <LucideIcon name="login" className="text-[16px]" />
              <span>{isMr ? 'गुगलने लॉगिन करा' : 'Sign In with Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <nav className="flex items-center gap-2 whitespace-nowrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'overview'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
              }`}
          >
            <LucideIcon name="badge" className="text-[18px]" />
            <span>{isMr ? 'नागरिक माहिती' : 'Citizen Overview'}</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'saved'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
              }`}
          >
            <LucideIcon name="bookmark" className="text-[18px]" />
            <span>{isMr ? 'जतन केलेल्या योजना' : 'Saved Schemes'}</span>
            <span className="bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-[11px] px-1.5 py-0.2 rounded-full font-bold">
              {savedItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('my-listings')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'my-listings'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
              }`}
          >
            <LucideIcon name="storefront" className="text-[18px]" />
            <span>{isMr ? 'माझे व्यवसाय व नोकऱ्या' : 'My Businesses & Jobs'}</span>
            {(myBusinesses.length > 0 || myJobs.length > 0) && (
              <span className="bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] text-[11px] px-1.5 py-0.2 rounded-full font-bold">
                {myBusinesses.length + myJobs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'broadcasts'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
              }`}
          >
            <LucideIcon name="cell_tower" className="text-[18px]" />
            <span>{isMr ? 'एसएमएस व प्रसारण सूचना' : 'SMS & Broadcast Alerts'}</span>
          </button>
        </nav>
      </div>

      {/* 4. Four Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => handleSetDefaultLanguage(lang === 'MR' ? 'EN' : 'MR')}
          className="bg-white card-hover-subtle rounded-2xl p-4 border border-[#e8e2d9] hover:border-emerald-600 shadow-xs flex items-center justify-between cursor-pointer group transition-all"
          title={isMr ? "भाषा बदलण्यासाठी क्लिक करा" : "Click to toggle default language"}
        >
          <div>
            <div className="text-[12px] font-bold text-[#707974] flex items-center gap-1">
              <span>{isMr ? 'डीफॉल्ट भाषा' : 'Default Language'}</span>
            </div>
            <div className="font-heading font-extrabold text-[22px] text-[#166534] mt-0.5">
              {lang === 'MR' ? 'मराठी' : 'English'}
            </div>
            <div className="text-[11px] text-[#376757] font-semibold mt-0.5 flex items-center gap-1">
              <span>{isMr ? 'बदलण्यासाठी टॅप करा' : 'Click to Toggle'}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] flex items-center justify-center group-hover:scale-110 transition-transform">
            <LucideIcon name="globe" className="text-[22px]" />
          </div>
        </div>

        <div className="bg-white card-hover-subtle rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-[#707974]">
              {isMr ? 'उपलब्ध ग्राम योजना' : 'Village Schemes'}
            </div>
            <div className="font-heading font-extrabold text-[26px] text-[#c2410c] mt-0.5">
              {schemes.length > 0 ? schemes.length : 3}
            </div>
            <div className="text-[11px] text-[#c2410c] font-semibold mt-0.5">
              {isMr ? 'डीबीटी थेट बँक लाभ' : 'DBT Verified Support'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#fed7aa] text-[#c2410c] flex items-center justify-center">
            <LucideIcon name="policy" className="text-[22px]" />
          </div>
        </div>

        <div className="bg-white card-hover-subtle rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-[#707974]">
              {isMr ? 'गाव अधिकार क्षेत्र' : 'Village Jurisdiction'}
            </div>
            <div className="font-heading font-extrabold text-[20px] text-[#002873] mt-0.5">
              {isMr ? 'आसगाव' : 'Asgaon'}
            </div>
            <div className="text-[11px] text-[#002873] font-semibold mt-0.5">
              {isMr ? 'पवनी तालुका • भंडारा' : 'Pauni Taluka • Bhandara'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#dbe1ff] text-[#002873] flex items-center justify-center">
            <LucideIcon name="account_balance" className="text-[22px]" />
          </div>
        </div>

        <div className="bg-white card-hover-subtle rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-[#707974]">
              {isMr ? 'जतन केलेल्या योजना' : 'Saved Bookmarks'}
            </div>
            <div className="font-heading font-extrabold text-[26px] text-[#1d1b16] mt-0.5">
              {savedItems.length}
            </div>
            <div className="text-[11px] text-[#707974] font-semibold mt-0.5">
              {isMr ? 'एक-क्लिक थेट प्रवेश' : 'One-Touch Access'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#f3ede4] text-[#1d1b16] flex items-center justify-center">
            <LucideIcon name="bookmark" className="text-[22px]" />
          </div>
        </div>
      </div>

      {/* 5. Main Content Tabs */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
            <div>
              <h3 className="font-heading font-extrabold text-[18px] text-[#166534] flex items-center gap-2">
                <LucideIcon name="badge" className="text-[#c2410c]" />
                <span>{isMr ? 'आसगाव नागरिक अभिलेख' : 'Asgaon Citizen Record & Profile'}</span>
              </h3>
              <p className="text-[12px] text-[#707974]">
                {isMr ? 'सत्यापित गाव नागरिक माहिती' : 'Verified village resident profile'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {isMr ? 'पूर्ण नाव' : 'Full Name'}
                </div>
                <div className="font-heading font-extrabold text-[15px] text-[#166534] mt-0.5">
                  {currentUser.fullName}
                </div>
                <div className="text-[11px] text-[#707974] mt-0.5">
                  {isMr ? 'आसगाव ग्रामस्थ नोंद' : 'Asgaon Village Resident'}
                </div>
              </div>

              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {isMr ? 'संपर्क मोबाईल' : 'Contact Phone'}
                </div>
                <div className="font-heading font-extrabold text-[15px] text-[#166534] mt-0.5">
                  +91 {currentUser.phone || '9822104500'}
                </div>
                <div className="text-[11px] text-[#376757] font-semibold mt-0.5">
                  {isMr ? 'एसएमएस सूचना जोडल्या आहेत' : 'SMS Notification Subscribed'}
                </div>
              </div>

              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {isMr ? 'प्रभाग व वस्ती' : 'Ward & Settlement'}
                </div>
                <div className="font-heading font-extrabold text-[15px] text-[#166534] mt-0.5">
                  {currentUser.ward || (isMr ? 'प्रभाग २ (गावठाण)' : 'Ward 2 (Gaothan)')}
                </div>
                <div className="text-[11px] text-[#707974] mt-0.5">
                  {isMr ? 'ग्रामसेवक कार्यक्षेत्र: झोन ब' : 'Gram Sevak Sector: Zone B'}
                </div>
              </div>

              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">
                  {isMr ? 'नागरी भूमिका / प्रोफाइल' : 'Civic Role / Profile'}
                </div>
                <div className="font-heading font-extrabold text-[15px] text-[#c2410c] mt-0.5">
                  {getRoleLabel(currentUser.role)}
                </div>
                <div className="text-[11px] text-[#707974] mt-0.5">
                  {isMr ? 'सक्रिय नागरिक पोर्टल सदस्य' : 'Active Civic Portal User'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#e8f1ec] border border-[#006a4e]/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <LucideIcon name="verified_user" className="text-[24px] text-[#006a4e]" />
                <div>
                  <h4 className="font-bold text-[13px] text-[#166534]">
                    {isMr ? 'डीबीटी थेट बँक खात्याशी जोडणी सक्रिय' : 'DBT Direct-to-Bank Enrolment Active'}
                  </h4>
                  <p className="text-[11px] text-[#404945]">
                    {isMr
                      ? 'पीएम-किसान व शासकीय अनुदानासाठी आधार जोडणी प्रमाणित.'
                      : 'NPCI Aadhaar mapping linked for PM-Kisan & State Subsidies.'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#006a4e] bg-white px-2.5 py-1 rounded-lg border border-[#006a4e]/20 shrink-0">
                {isMr ? 'सक्रिय' : 'ACTIVE'}
              </span>
            </div>
          </div>

          {/* Default Language Setting Section in Profile */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#166534] flex items-center gap-2">
                  <LucideIcon name="globe" className="text-[#006a4e]" />
                  <span>{isMr ? 'पोर्टलची डीफॉल्ट भाषा (Default Language)' : 'Portal Default Language'}</span>
                </h3>
                <p className="text-[12px] text-[#707974] mt-0.5">
                  {isMr
                    ? 'गावातील पोर्टल वापरण्यासाठी तुमची पसंतीची भाषा निवडा. ही निवड तुमच्या प्रोफाइलमध्ये कायम सेव्ह केली जाईल.'
                    : 'Choose your default language for browsing the village portal. This is saved to your profile and device.'}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 self-start sm:self-auto">
                {lang === 'MR' ? 'सध्याची भाषा: मराठी' : 'Current: English'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => handleSetDefaultLanguage('MR')}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                  lang === 'MR'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'border-[#e8e2d9] bg-white text-stone-700 hover:bg-[#faf6ee]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lang === 'MR' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'}`}>
                    <LucideIcon name="globe" className="text-[20px]" />
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-[15px] text-emerald-950">मराठी (Default)</div>
                    <div className="text-[11px] text-stone-500 font-medium">स्थानिक बोली व शासकीय परिभाषा</div>
                  </div>
                </div>
                {lang === 'MR' && (
                  <LucideIcon name="check_circle" className="text-[22px] text-emerald-800 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSetDefaultLanguage('EN')}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                  lang === 'EN'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'border-[#e8e2d9] bg-white text-stone-700 hover:bg-[#faf6ee]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lang === 'EN' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'}`}>
                    <LucideIcon name="globe" className="text-[20px]" />
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-[15px] text-emerald-950">English</div>
                    <div className="text-[11px] text-stone-500 font-medium">Standard civic portal layout</div>
                  </div>
                </div>
                {lang === 'EN' && (
                  <LucideIcon name="check_circle" className="text-[22px] text-emerald-800 shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Items Tab */}
      {activeTab === 'saved' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
          <h3 className="font-heading font-extrabold text-[18px] text-[#166534] mb-4 flex items-center gap-2">
            <LucideIcon name="bookmarks" className="text-[#c2410c]" />
            <span>{isMr ? `जतन केलेल्या शासकीय योजना (${savedItems.length})` : `Saved Welfare Schemes & Subsidies (${savedItems.length})`}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white card-hover-subtle rounded-xl p-4 border border-[#e8e2d9] flex flex-col justify-between shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.iconColor}`}>
                      <LucideIcon name={item.icon} className="text-[20px]" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#707974]">{item.type}</div>
                      <h4 className="font-heading font-bold text-[14px] text-[#1d1b16] mt-0.5">{item.title}</h4>
                      <p className="text-[12px] text-[#404945] mt-1">{item.sub}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeSavedItem(item.id)}
                    className="text-[#707974] hover:text-[#ba1a1a] p-1 shrink-0 cursor-pointer"
                    title={isMr ? "जतन सूचीतून काढा" : "Remove from saved"}
                  >
                    <LucideIcon name="close" className="text-[18px]" />
                  </button>
                </div>

                <div className="pt-2 border-t border-[#e8e2d9] flex items-center justify-between text-[12px]">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#166534] hover:underline flex items-center gap-1"
                  >
                    <span>{isMr ? 'पोर्टलवर अर्ज करा' : 'Apply on Portal'}</span>
                    <LucideIcon name="open_in_new" className="text-[14px]" />
                  </a>
                  <span className="text-[10px] font-semibold text-[#376757] bg-[#a7f3d0] px-2 py-0.5 rounded">
                    {isMr ? 'सत्यापित' : 'Verified'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Listings & Jobs Tab */}
      {activeTab === 'my-listings' && (
        <div className="flex flex-col gap-6">
          {/* Section A: My Registered Businesses */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#f0eae1]">
              <div>
                <h3 className="font-heading font-extrabold text-[18px] text-[#166534] flex items-center gap-2">
                  <LucideIcon name="storefront" className="text-[#c2410c]" />
                  <span>{isMr ? `माझे नोंदणीकृत व्यवसाय व दुकाने (${myBusinesses.length})` : `My Registered Businesses & Shops (${myBusinesses.length})`}</span>
                </h3>
                <p className="text-[12px] text-[#707974] mt-0.5">
                  {isMr
                    ? `मोबाईल क्रमांक +91 ${currentUser.phone || 'नोंदणीकृत'} शी जोडलेले व्यवसाय`
                    : `Enterprises associated with mobile +91 ${currentUser.phone || 'registered'}`}
                </p>
              </div>

              {onOpenRegisterShop && (
                <button
                  type="button"
                  onClick={onOpenRegisterShop}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <LucideIcon name="add_business" className="text-[16px]" />
                  <span>{isMr ? 'नवीन व्यवसाय नोंदणी करा' : 'Register New Shop'}</span>
                </button>
              )}
            </div>

            {myBusinesses.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl bg-[#faf6ee] border border-dashed border-[#e2d8c9] flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                  <LucideIcon name="store" className="text-[28px]" />
                </div>
                <h4 className="font-heading font-bold text-[16px] text-[#1d1b16]">
                  {isMr ? 'अद्याप कोणताही व्यवसाय नोंदणी केलेला नाही' : 'No Businesses Registered Yet'}
                </h4>
                <p className="text-[13px] text-[#707974] max-w-md mt-1.5 mb-4">
                  {isMr
                    ? 'आपले किराणा दुकान, कृषी केंद्र, गॅरेज, दुग्ध व्यवसाय किंवा इतर सेवा गावच्या अधिकृत डिजिटल डिरेक्टरीमध्ये मोफत नोंदवा.'
                    : 'List your shop, agriculture center, dairy, or local service in Asgaon’s official civic directory for free.'}
                </p>
                {onOpenRegisterShop && (
                  <button
                    type="button"
                    onClick={onOpenRegisterShop}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <LucideIcon name="add" className="text-[16px]" />
                    <span>{isMr ? 'आताच व्यवसाय नोंदणी करा' : 'Register Your Business Now'}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myBusinesses.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-xl p-4 border border-[#e8e2d9] hover:border-emerald-700 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.imageUrl || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80'}
                            alt={b.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#e8e2d9]"
                          />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                              {b.category}
                            </span>
                            <h4 className="font-heading font-extrabold text-[15px] text-[#1d1b16] mt-0.5">
                              {b.name}
                            </h4>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {b.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300">
                            <LucideIcon name="verified" className="text-[13px] text-emerald-700" />
                            <span>{isMr ? 'सत्यापित व सक्रिय' : 'Approved & Live'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-900 border border-amber-300">
                            <LucideIcon name="hourglass_empty" className="text-[13px] text-amber-700 animate-pulse" />
                            <span>{isMr ? 'पडताळणी प्रलंबित' : 'Pending Review'}</span>
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-[#525955] my-2.5">
                        <div className="flex items-center gap-1.5">
                          <LucideIcon name="location_on" className="text-[15px] text-[#c2410c] shrink-0" />
                          <span className="truncate">{b.address || 'आसगाव बाजारपेठ'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <LucideIcon name="schedule" className="text-[15px] text-[#166534] shrink-0" />
                          <span>{b.openingHours || 'सकाळी ८:०० ते रात्री ८:००'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <LucideIcon name="phone" className="text-[15px] text-[#002873] shrink-0" />
                          <span>+91 {b.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#f0eae1] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                        <LucideIcon name="star" className="text-[14px] fill-amber-500 text-amber-500" />
                        <span>{b.rating || 5.0}</span>
                        <span className="text-stone-400 font-normal">({b.ratingCount || 1} परीक्षणे)</span>
                      </div>

                      {onSelectBusinessSlug && (
                        <button
                          type="button"
                          onClick={() => onSelectBusinessSlug(b.slug)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                        >
                          <span>{isMr ? 'डिरेक्टरीमध्ये पहा' : 'View in Directory'}</span>
                          <LucideIcon name="arrow_forward" className="text-[14px]" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section B: My Job Postings */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#f0eae1]">
              <div>
                <h3 className="font-heading font-extrabold text-[18px] text-[#166534] flex items-center gap-2">
                  <LucideIcon name="work" className="text-[#002873]" />
                  <span>{isMr ? `माझ्या नोकरीच्या जाहिराती (${myJobs.length})` : `My Posted Job Openings (${myJobs.length})`}</span>
                </h3>
                <p className="text-[12px] text-[#707974] mt-0.5">
                  {isMr
                    ? 'गावातील कामगार, शेतकरी व तरुणांसाठी आपण दिलेल्या रोजगाराच्या संधी'
                    : 'Employment vacancies posted by you for local youth and laborers'}
                </p>
              </div>

              {onOpenPostJob && (
                <button
                  type="button"
                  onClick={onOpenPostJob}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#002873] hover:bg-[#001d52] text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <LucideIcon name="post_add" className="text-[16px]" />
                  <span>{isMr ? 'नवीन नोकरी पोस्ट करा' : 'Post New Job'}</span>
                </button>
              )}
            </div>

            {myJobs.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl bg-[#faf6ee] border border-dashed border-[#e2d8c9] flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                  <LucideIcon name="work_outline" className="text-[28px]" />
                </div>
                <h4 className="font-heading font-bold text-[16px] text-[#1d1b16]">
                  {isMr ? 'अद्याप कोणतीही नोकरी पोस्ट केलेली नाही' : 'No Jobs Posted Yet'}
                </h4>
                <p className="text-[13px] text-[#707974] max-w-md mt-1.5 mb-4">
                  {isMr
                    ? 'आपल्या शेतात, दुकानात किंवा उद्योगात मदतनीस, ट्रॅक्टर चालक, विक्री प्रतिनिधी किंवा कारागीर हवे असल्यास लगेच जाहिरात पोस्ट करा.'
                    : 'Need farm hands, shop staff, drivers, or skilled workers? Post a job notice for free to reach Asgaon youth.'}
                </p>
                {onOpenPostJob && (
                  <button
                    type="button"
                    onClick={onOpenPostJob}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002873] hover:bg-[#001d52] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <LucideIcon name="add" className="text-[16px]" />
                    <span>{isMr ? 'नोकरीची जाहिरात द्या' : 'Post a Job Vacancy'}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myJobs.map((j) => (
                  <div
                    key={j.id}
                    className="bg-white rounded-xl p-4 border border-[#e8e2d9] hover:border-blue-700 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200">
                            {j.employmentType || 'Full-Time'}
                          </span>
                          <h4 className="font-heading font-extrabold text-[15px] text-[#1d1b16] mt-1">
                            {j.title}
                          </h4>
                          <div className="text-xs text-stone-600 font-semibold mt-0.5">
                            {j.employerName}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black ${
                          j.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-stone-100 text-stone-700 border border-stone-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${j.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-stone-400'}`}></span>
                          <span>{j.status === 'ACTIVE' ? (isMr ? 'सक्रिय / भरती चालू' : 'Active') : (isMr ? 'मुदत संपली' : 'Closed')}</span>
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-[#525955] my-2.5">
                        <div className="flex items-center gap-1.5">
                          <LucideIcon name="payments" className="text-[15px] text-[#166534] shrink-0" />
                          <span className="font-bold text-stone-900">{j.salaryRange || 'वाजवी मानधन / दैनिक मजुरी'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <LucideIcon name="location_on" className="text-[15px] text-[#c2410c] shrink-0" />
                          <span>{j.location || 'आसगाव'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <LucideIcon name="phone" className="text-[15px] text-[#002873] shrink-0" />
                          <span>+91 {j.contactPhone}</span>
                        </div>
                      </div>

                      {j.description && (
                        <p className="text-xs text-stone-600 line-clamp-2 mt-2 bg-[#fcf9f5] p-2.5 rounded-lg border border-[#f0eae1]">
                          {j.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#f0eae1] flex items-center justify-between text-xs text-stone-500">
                      <span>{j.postedAgo || 'नुकतीच जोडली'}</span>
                      <span className="font-bold text-blue-900">{j.expiresAt ? `मुदत: ${j.expiresAt}` : '३० दिवसांसाठी वैध'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Broadcasts Tab */}
      {activeTab === 'broadcasts' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs max-w-2xl">
          <h3 className="font-heading font-extrabold text-[18px] text-[#166534] mb-1 flex items-center gap-2">
            <LucideIcon name="tune" className="text-[#c2410c]" />
            <span>{isMr ? 'एसएमएस व प्रसारण सूचना सदस्यता' : 'SMS & Broadcast Advisory Subscriptions'}</span>
          </h3>
          <p className="text-[12px] text-[#707974] mb-4">
            {isMr
              ? `+91 ${currentUser.phone || '9822104500'} क्रमांकावर स्वयंचलित सूचना पाठवल्या जातात`
              : `Automated alerts sent directly to +91 ${currentUser.phone || '9822104500'}`}
          </p>

          {/* Web Push Notification Device Card */}
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-[#166534]/10 via-[#a7f3d0]/20 to-[#166534]/5 border border-[#006a4e]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#166534] text-[#a7f3d0] flex items-center justify-center shrink-0 shadow-xs">
                <LucideIcon name={pushEnabled ? 'notifications_active' : 'notifications'} className=" text-[22px]" />
              </div>
              <div>
                <div className="font-heading font-extrabold text-[14px] text-[#166534] flex items-center gap-1.5">
                  <span>{isMr ? 'मोबाईल/डेस्कटॉप थेट पुश नोटिफिकेशन्स' : 'Device Push Notifications'}</span>
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                    pushEnabled ? 'bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]' : 'bg-[#f3ede4] text-[#707974]'
                  }`}>
                    {pushEnabled ? (isMr ? 'सक्रिय' : 'Active') : (isMr ? 'बंद' : 'Disabled')}
                  </span>
                </div>
                <div className="text-[11px] text-[#55605a]">
                  {isMr
                    ? 'बाजारभाव, कालवा पाणी सोडणे व वीज वेळापत्रकाच्या तात्काळ स्क्रीन सूचना.'
                    : 'Instant lock-screen alerts for APMC rates, canal water release, and power rosters.'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleWebPush}
              disabled={pushToggling}
              className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer ${
                pushEnabled
                  ? 'bg-white hover:bg-[#fef3c7] text-[#ba1a1a] border border-[#fef3c7]'
                  : 'bg-[#166534] hover:bg-[#052e16] text-white'
              }`}
            >
              <LucideIcon name={pushToggling ? 'sync' : pushEnabled ? 'notifications_off' : 'notifications_active'} className=" text-[16px]" />
              <span>
                {pushToggling
                  ? (isMr ? 'अद्ययावत करत आहे...' : 'Updating...')
                  : pushEnabled
                  ? (isMr ? 'सूचना बंद करा' : 'Turn Off Alerts')
                  : (isMr ? 'पुश सूचना सुरू करा' : 'Enable Device Push')}
              </span>
            </button>
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9]">
              <div className="flex items-center gap-2.5">
                <LucideIcon name="trending_up" className="text-[20px] text-[#166534]" />
                <div>
                  <div className="font-bold text-[#1d1b16]">
                    {isMr ? 'दैनिक कृषी बाजारभाव (मंडी भाव) एसएमएस' : 'Daily Mandi Price SMS'}
                  </div>
                  <div className="text-[11px] text-[#707974]">
                    {isMr ? 'पवनी व हवेली बाजार समितीचे दर' : 'Pauni & Haveli APMC modal rates'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={mandiSms}
                onChange={(e) => handleToggleMandiSms(e.target.checked)}
                className="w-4 h-4 accent-[#166534] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9]">
              <div className="flex items-center gap-2.5">
                <LucideIcon name="cloud" className="text-[20px] text-[#002873]" />
                <div>
                  <div className="font-bold text-[#1d1b16]">
                    {isMr ? 'हवामान अंदाज व कालवा पाणी वाटप सूचना' : 'Weather Advisories & Canal Water Alerts'}
                  </div>
                  <div className="text-[11px] text-[#707974]">
                    {isMr ? 'खडकवासला आवर्तन व पर्जन्यमान अंदाज' : 'Khadakwasla release rosters & rainfall forecasts'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={weatherAlerts}
                onChange={(e) => handleToggleWeatherAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#166534] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9]">
              <div className="flex items-center gap-2.5">
                <LucideIcon name="groups" className="text-[20px] text-[#c2410c]" />
                <div>
                  <div className="font-bold text-[#1d1b16]">
                    {isMr ? 'ग्रामसभा विषयसूची व बैठक सूचना' : 'Gram Sabha Agenda & Meeting Alerts'}
                  </div>
                  <div className="text-[11px] text-[#707974]">
                    {isMr ? 'मासिक ग्रामसभा अजेंडा व सार्वजनिक चर्चा' : 'Monthly village council agendas & public audits'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={gramSabhaSms}
                onChange={(e) => handleToggleGramSabhaSms(e.target.checked)}
                className="w-4 h-4 accent-[#166534] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9]">
              <div className="flex items-center gap-2.5">
                <LucideIcon name="bolt" className="text-[20px] text-[#707974]" />
                <div>
                  <div className="font-bold text-[#1d1b16]">
                    {isMr ? 'शेती वीज पुरवठा वेळापत्रक' : 'Agri Feeder Power Schedule'}
                  </div>
                  <div className="text-[11px] text-[#707974]">
                    {isMr ? 'महावितरण ३-फेज दिवस/रात्र वीज पुरवठा' : 'MSEDCL 3-Phase day/night supply roster'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={powerSchedule}
                onChange={(e) => handleTogglePowerSchedule(e.target.checked)}
                className="w-4 h-4 accent-[#166534] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4] cursor-pointer"
            >
              <LucideIcon name="close" className="text-[20px]" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <LucideIcon name="edit_note" className="text-[#006a4e] text-[24px]" />
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#166534]">
                  {isMr ? 'नागरिक प्रोफाइल संपादन' : 'Edit Citizen Profile'}
                </h3>
                <span className="text-[11px] text-[#707974]">
                  {isMr ? 'आसगाव पोर्टलवरील तुमची माहिती बदला' : 'Update your Asgaon portal profile'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5 text-[12px]">
              {/* Profile Photo Row inside Modal */}
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-600/30">
                  {currentUser.profileImage ? (
                    <img src={currentUser.profileImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentUser.avatarInitials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-bold text-stone-800 text-xs mb-1">
                    {isMr ? 'प्रोफाइल फोटो' : 'Profile Photo'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <label className="cursor-pointer py-1 px-2.5 rounded-lg bg-white border border-stone-200 hover:border-emerald-700 text-stone-700 hover:text-emerald-900 text-[11px] font-bold flex items-center gap-1 shadow-2xs">
                      <LucideIcon name="upload" className="text-[12px] text-emerald-700" />
                      <span>{isMr ? 'डिव्हाइस' : 'Device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                    </label>
                    <label className="cursor-pointer py-1 px-2.5 rounded-lg bg-white border border-stone-200 hover:border-emerald-700 text-stone-700 hover:text-emerald-900 text-[11px] font-bold flex items-center gap-1 shadow-2xs">
                      <LucideIcon name="camera" className="text-[12px] text-emerald-700" />
                      <span>{isMr ? 'कॅमेरा' : 'Camera'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                    </label>
                    {currentUser.profileImage && (
                      <button
                        type="button"
                        onClick={() => applyNewProfileImage('')}
                        className="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                        title={isMr ? "फोटो काढा" : "Remove"}
                      >
                        <LucideIcon name="close" className="text-[14px]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#166534] block mb-1">
                  {isMr ? 'पूर्ण नाव' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={isMr ? "उदा. रमेश पाटील / स्नेहा देशमुख" : "e.g. Ramesh Patil / Sneha Deshmukh"}
                  className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#166534] block mb-1">
                  {isMr ? 'मोबाईल नंबर' : 'Mobile Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {isMr ? 'आसगावमधील प्रभाग' : 'Ward in Asgaon'}
                  </label>
                  <select
                    value={editWard}
                    onChange={(e) => setEditWard(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                  >
                    <option value="Ward 1 (Bazaar Chowk)">{isMr ? 'प्रभाग १ (बाजार चौक)' : 'Ward 1 (Bazaar Chowk)'}</option>
                    <option value="Ward 2 (Gaothan)">{isMr ? 'प्रभाग २ (गावठाण)' : 'Ward 2 (Gaothan)'}</option>
                    <option value="Ward 3 (Vitthal Mandir)">{isMr ? 'प्रभाग ३ (विठ्ठल मंदिर)' : 'Ward 3 (Vitthal Mandir)'}</option>
                    <option value="Ward 4 (South Shivar)">{isMr ? 'प्रभाग ४ (दक्षिण शिवार)' : 'Ward 4 (South Shivar)'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    {isMr ? 'व्यवसाय / कार्यक्षेत्र' : 'Occupation / Profession'}
                  </label>
                  <select
                    value={editOccupation}
                    onChange={(e) => setEditOccupation(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white text-xs font-semibold"
                  >
                    <option value="Farmer / Cultivator">{isMr ? 'शेतकरी / कास्तकार' : 'Farmer / Cultivator'}</option>
                    <option value="Student / Scholar">{isMr ? 'विद्यार्थी / स्पर्धा परीक्षा' : 'Student / Scholar'}</option>
                    <option value="Local Merchant / Business">{isMr ? 'स्थानिक व्यापारी / दुकानदार' : 'Local Merchant / Business'}</option>
                    <option value="Artisan / Skilled Worker">{isMr ? 'कारागीर / तांत्रिक कामगार' : 'Artisan / Skilled Worker'}</option>
                    <option value="Self Help Group / Entrepreneur">{isMr ? 'महिला बचत गट / उद्योजिका' : 'Self Help Group / Entrepreneur'}</option>
                    <option value="Salaried / Professional">{isMr ? 'नोकरदार / कर्मचारी' : 'Salaried / Professional'}</option>
                    <option value="General Resident">{isMr ? 'इतर स्थानिक नागरिक' : 'General Resident'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#166534] block mb-1">
                  {isMr ? 'डीफॉल्ट भाषा (Default Language)' : 'Default Language Preference'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditLang('MR')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      editLang === 'MR'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                        : 'border-[#e8e2d9] bg-white text-stone-700 hover:bg-[#faf6ee]'
                    }`}
                  >
                    <LucideIcon name="globe" className="text-[14px] text-emerald-800" />
                    <span>मराठी (Default)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditLang('EN')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      editLang === 'EN'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                        : 'border-[#e8e2d9] bg-white text-stone-700 hover:bg-[#faf6ee]'
                    }`}
                  >
                    <LucideIcon name="globe" className="text-[14px] text-emerald-800" />
                    <span>English</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f3ede4] mt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#f3ede4] text-[#1d1b16] font-bold hover:bg-[#e8e2d9] cursor-pointer"
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white font-bold shadow-xs cursor-pointer"
                >
                  {isMr ? 'माहिती जतन करा' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return to Public Portal link */}
      <div className="text-center pt-2">
        <button
          onClick={onNavigateHome}
          className="text-[13px] text-[#166534] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <LucideIcon name="arrow_back" className="text-[16px]" />
          <span>{isMr ? 'मुख्य पृष्ठावर परत जा' : 'Return to Village Homepage'}</span>
        </button>
      </div>
    </div>
  );
};
