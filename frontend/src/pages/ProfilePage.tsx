import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Scheme } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { isPushSubscribed, subscribeUserToPush, unsubscribeUserFromPush } from '../services/pushNotifications';

export interface UserProfileData {
  fullName: string;
  phone: string;
  role: string;
  ward: string;
  village: string;
  isLoggedIn: boolean;
  avatarInitials: string;
  occupation?: string;
  landHolding?: string;
  shopName?: string;
}

interface ProfilePageProps {
  onNavigateHome: () => void;
  onOpenGrievanceModal: () => void;
  onOpenLoginModal?: () => void;
  currentUser?: UserProfileData;
  onUpdateUser?: (updated: UserProfileData) => void;
  onLogout?: () => void;
  schemes?: Scheme[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateHome,
  onOpenGrievanceModal,
  onOpenLoginModal,
  currentUser = {
    fullName: 'Asgaon Citizen',
    phone: '9822104500',
    role: 'FARMER',
    ward: 'Ward 2 (Gaothan)',
    village: 'Asgaon, Pauni (PIN 441910)',
    isLoggedIn: false,
    avatarInitials: 'AC'
  },
  onUpdateUser,
  onLogout,
  schemes = []
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'grievances' | 'saved' | 'broadcasts'>('overview');
  const [showRosterAlert, setShowRosterAlert] = useState(true);

  // Live Complaints from Backend
  const [userComplaints, setUserComplaints] = useState<any[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);

  // Track Token Search
  const [trackInput, setTrackInput] = useState('');
  const [trackResult, setTrackResult] = useState<any | null>(null);
  const [trackError, setTrackError] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Edit Profile Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser.fullName);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editWard, setEditWard] = useState(currentUser.ward);
  const [editRole, setEditRole] = useState(currentUser.role);
  const [editOccupation, setEditOccupation] = useState(currentUser.occupation || 'Farmer / Cultivator');

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
        alert(res.message);
        setPushEnabled(false);
      } else {
        const res = await subscribeUserToPush(currentUser.phone, currentUser.role);
        alert(res.message);
        if (res.success) setPushEnabled(true);
      }
    } finally {
      setPushToggling(false);
    }
  };

  // Saved items list
  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      type: 'Govt Subsidy Scheme',
      title: 'PM-KUSUM Component-B 90% Solar Pump Subsidy',
      sub: 'Grant: 90% capital subsidy directly to bank',
      icon: 'solar_power',
      iconColor: 'bg-[#baeed9] text-[#002117]',
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

  // Fetch real complaints on mount
  useEffect(() => {
    setLoadingComplaints(true);
    api.getAllComplaints()
      .then((data) => {
        if (data && data.length > 0) {
          setUserComplaints(data);
        }
      })
      .catch((err) => console.log('Complaints load notice:', err.message))
      .finally(() => setLoadingComplaints(false));
  }, []);

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
      occupation: editOccupation
    };

    onUpdateUser?.(updated);
    localStorage.setItem('dg_user', JSON.stringify({
      fullName: editName,
      phone: editPhone,
      roles: ['ROLE_' + editRole],
      ward: editWard,
      occupation: editOccupation
    }));
    setEditModalOpen(false);
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    setTrackingLoading(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const res = await api.trackComplaint(trackInput.trim());
      if (res) {
        setTrackResult(res);
      } else {
        setTrackError(`Token [${trackInput.trim()}] is registered and under routine Gram Sevak review.`);
      }
    } catch {
      setTrackError(`No active record found for [${trackInput.trim()}]. Please double-check the token code.`);
    } finally {
      setTrackingLoading(false);
    }
  };

  const removeSavedItem = (id: number) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Citizen Profile & Grievances (माझे नागरिक खाते)', active: true }
        ]}
      />

      {/* 1. Rotational Canal Water Alert Banner */}
      {showRosterAlert && (
        <div className="w-full bg-[#ffdad6] text-[#93000a] py-2.5 px-4 rounded-xl shadow-xs border border-[#ffb4ab] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-[20px] text-[#ba1a1a] shrink-0">water_drop</span>
            <div className="truncate">
              <span className="font-heading font-extrabold text-[13px] text-[#ba1a1a] mr-2">
                Asgaon Canal Water Roster:
              </span>
              <span className="text-[13px] font-semibold text-[#93000a]">
                Rotational irrigation release from Khadakwasla canal commences tomorrow at 06:00 AM for Sector 2 &amp; 3.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-extrabold bg-[#ba1a1a] text-white px-2 py-0.5 rounded uppercase tracking-wider">
              OFFICIAL NOTICE
            </span>
            <button
              onClick={() => setShowRosterAlert(false)}
              className="text-[12px] font-bold text-[#93000a] hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 2. Dynamic Citizen Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e8e2d9] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#003629] to-[#006a4e] text-[#baeed9] flex items-center justify-center font-heading font-black text-[28px] border-2 border-[#baeed9] shadow-sm">
              {currentUser.avatarInitials}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#003629] text-[#baeed9] flex items-center justify-center border-2 border-white shadow-xs" title="Verified Asgaon Citizen">
              <span className="material-symbols-outlined text-[15px]">verified</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-heading font-extrabold text-[24px] text-[#1d1b16] tracking-tight">
                {currentUser.fullName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#baeed9] text-[#002117] text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[13px]">
                  {currentUser.role === 'BUSINESS_OWNER' ? 'storefront' : currentUser.role === 'ADMIN' ? 'shield_person' : currentUser.role === 'STUDENT' ? 'school' : 'agriculture'}
                </span>
                <span>{currentUser.role}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#707974] mt-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#a63b00]">location_on</span>
                <span>{currentUser.ward || 'Ward 2'}, Asgaon (PIN 441910)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#003629]">smartphone</span>
                <span className="font-semibold text-[#1d1b16]">
                  {currentUser.phone ? `+91 ${currentUser.phone}` : 'Unregistered Mobile'}
                </span>
                <span className="text-[10px] text-[#376757] font-bold bg-[#baeed9] px-1.5 py-0.2 rounded ml-1">
                  Active
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setEditName(currentUser.fullName);
              setEditPhone(currentUser.phone);
              setEditWard(currentUser.ward);
              setEditRole(currentUser.role);
              setEditOccupation(currentUser.occupation || 'Farmer / Cultivator');
              setEditModalOpen(true);
            }}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>Edit Profile</span>
          </button>

          {currentUser.isLoggedIn ? (
            <button
              onClick={onLogout}
              className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-[#ffdad6]/60 hover:bg-[#ffdad6] text-[#ba1a1a] text-[13px] font-bold flex items-center justify-center gap-1.5 border border-[#ffb4ab] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <nav className="flex items-center gap-2 whitespace-nowrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${activeTab === 'overview'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>Citizen Dossier</span>
          </button>

          <button
            onClick={() => setActiveTab('grievances')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${activeTab === 'grievances'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            <span>My Grievances &amp; Tracking</span>
            <span className="bg-[#ffdbce] text-[#a63b00] text-[11px] px-1.5 py-0.2 rounded-full font-bold">
              {userComplaints.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${activeTab === 'saved'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            <span>Saved Schemes</span>
            <span className="bg-[#baeed9] text-[#002117] text-[11px] px-1.5 py-0.2 rounded-full font-bold">
              {savedItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all ${activeTab === 'broadcasts'
                ? 'bg-[#003629] text-white shadow-xs'
                : 'bg-white text-[#404945] hover:bg-[#f3ede4] border border-[#e8e2d9]'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">cell_tower</span>
            <span>SMS &amp; Broadcast Alerts</span>
          </button>
        </nav>
      </div>

      {/* 4. Four Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-[#707974]">Logged Grievances</div>
            <div className="font-heading font-extrabold text-[26px] text-[#003629] mt-0.5">
              {userComplaints.length}
            </div>
            <div className="text-[11px] text-[#376757] font-semibold mt-0.5">Live in Neon Database</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#baeed9] text-[#002117] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">assignment</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-[#707974]">Village Schemes</div>
            <div className="font-heading font-extrabold text-[26px] text-[#a63b00] mt-0.5">
              {schemes.length > 0 ? schemes.length : 3}
            </div>
            <div className="text-[11px] text-[#a63b00] font-semibold mt-0.5">DBT Verified Support</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#ffdbce] text-[#a63b00] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">policy</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-[#707974]">Village Jurisdiction</div>
            <div className="font-heading font-extrabold text-[20px] text-[#002873] mt-0.5">Asgaon</div>
            <div className="text-[11px] text-[#002873] font-semibold mt-0.5">Pauni Taluka • Bhandara</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#dbe1ff] text-[#002873] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">account_balance</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-[#707974]">Saved Bookmarks</div>
            <div className="font-heading font-extrabold text-[26px] text-[#1d1b16] mt-0.5">
              {savedItems.length}
            </div>
            <div className="text-[11px] text-[#707974] font-semibold mt-0.5">One-Touch Access</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#f3ede4] text-[#1d1b16] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">bookmark</span>
          </div>
        </div>
      </div>

      {/* 5. Main Content Tabs */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
            <div>
              <h3 className="font-heading font-extrabold text-[18px] text-[#003629] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#a63b00]">badge</span>
                <span>Asgaon Citizen Record &amp; Digital Dossier</span>
              </h3>
              <p className="text-[12px] text-[#707974]">Authenticated village citizen registry data</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Full Legal Name</div>
                <div className="font-heading font-extrabold text-[15px] text-[#003629] mt-0.5">
                  {currentUser.fullName}
                </div>
                <div className="text-[11px] text-[#707974] mt-0.5">Asgaon Gram Panchayat Electoral Roll</div>
              </div>

              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Contact Phone</div>
                <div className="font-heading font-extrabold text-[15px] text-[#003629] mt-0.5">
                  +91 {currentUser.phone || '9822104500'}
                </div>
                <div className="text-[11px] text-[#376757] font-semibold mt-0.5">SMS Notification Subscribed</div>
              </div>

              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Ward &amp; Settlement</div>
                <div className="font-heading font-extrabold text-[15px] text-[#003629] mt-0.5">
                  {currentUser.ward || 'Ward 2 (Gaothan)'}
                </div>
                <div className="text-[11px] text-[#707974] mt-0.5">Gram Sevak Sector: Zone B</div>
              </div>

              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9]">
                <div className="text-[11px] uppercase font-bold text-[#707974]">Civic Role / Profile</div>
                <div className="font-heading font-extrabold text-[15px] text-[#a63b00] mt-0.5">
                  {currentUser.role}
                </div>
                <div className="text-[11px] text-[#707974] mt-0.5">Active Civic Portal User</div>
              </div>
            </div>

            <div className="p-4 bg-[#baeed9]/40 border border-[#006a4e]/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[24px] text-[#006a4e]">verified_user</span>
                <div>
                  <h4 className="font-bold text-[13px] text-[#003629]">DBT Direct-to-Bank Enrolment Active</h4>
                  <p className="text-[11px] text-[#404945]">NPCI Aadhaar mapping linked for PM-Kisan &amp; State Subsidies.</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#006a4e] bg-white px-2.5 py-1 rounded-lg border border-[#006a4e]/20 shrink-0">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-[16px] text-[#003629] flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#006a4e]">support_agent</span>
                <span>Panchayat CSC Desk</span>
              </h3>
              <p className="text-[12px] text-[#404945] leading-relaxed mb-4">
                Need to apply for 7/12 land extract, income certificates, caste validity, or submit manual documentation?
              </p>
              <div className="space-y-2 text-[12px]">
                <div className="flex items-center gap-2 text-[#707974]">
                  <span className="material-symbols-outlined text-[16px] text-[#003629]">store</span>
                  <span>VLE Kiosk: Asgaon Panchayat Bhawan</span>
                </div>
                <div className="flex items-center gap-2 text-[#707974]">
                  <span className="material-symbols-outlined text-[16px] text-[#003629]">schedule</span>
                  <span>Timings: Mon - Sat, 09:30 AM — 05:30 PM</span>
                </div>
                <div className="flex items-center gap-2 text-[#707974]">
                  <span className="material-symbols-outlined text-[16px] text-[#003629]">call</span>
                  <span>Helpline: +91 98221 04500</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenGrievanceModal}
              className="mt-6 w-full py-2.5 rounded-xl bg-[#a63b00] hover:bg-[#852f00] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">campaign</span>
              <span>Lodge a Grievance Ticket</span>
            </button>
          </div>
        </div>
      )}

      {/* Grievances Tab */}
      {activeTab === 'grievances' && (
        <div className="flex flex-col gap-6">
          {/* Tracking Search Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <h3 className="font-heading font-bold text-[16px] text-[#003629] mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a63b00]">search</span>
              <span>Track Any Grievance Token (तक्रार स्थिती तपासा)</span>
            </h3>
            <p className="text-[12px] text-[#707974] mb-3">
              Enter your tracking ticket number (e.g. ASG-2026-XXXXX or KS-6181) to inspect resolution notes directly from the database.
            </p>

            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                required
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="Enter Token e.g. ASG-2026-41513, KS-6181..."
                className="flex-1 bg-[#f9f3ea] p-2.5 rounded-xl border border-[#e8e2d9] text-[13px] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#003629]"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="px-5 py-2.5 bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold rounded-xl text-[13px] flex items-center gap-1 shrink-0 disabled:opacity-50"
              >
                {trackingLoading ? 'Checking...' : 'Check Status'}
              </button>
            </form>

            {trackResult && (
              <div className="mt-4 p-4 rounded-xl bg-[#baeed9]/40 border border-[#006a4e] flex flex-col gap-2 animate-fadeIn text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#003629] text-[15px]">
                    Ticket: {trackResult.trackingNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${trackResult.status === 'RESOLVED' ? 'bg-[#baeed9] text-[#002117]' :
                      trackResult.status === 'IN_PROGRESS' ? 'bg-[#dbe1ff] text-[#002873]' :
                        'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}>
                    {trackResult.status}
                  </span>
                </div>
                <div className="font-bold text-[#1d1b16]">{trackResult.title}</div>
                <p className="text-[#404945] text-[12px]">{trackResult.description}</p>
                <div className="text-[11px] text-[#707974]">
                  Ward: {trackResult.wardOrArea} • Lodged: {new Date(trackResult.createdAt).toLocaleString()}
                </div>
              </div>
            )}

            {trackError && (
              <div className="mt-3 p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[12px] font-bold">
                {trackError}
              </div>
            )}
          </div>

          {/* List of Live Complaints */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-[18px] text-[#003629]">
                  Live Village Grievances ({userComplaints.length})
                </h3>
                <p className="text-[12px] text-[#707974]">Synced directly from Neon PostgreSQL</p>
              </div>

              <button
                onClick={onOpenGrievanceModal}
                className="px-3.5 py-2 rounded-xl bg-[#a63b00] hover:bg-[#852f00] text-white text-[12px] font-bold flex items-center gap-1 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Lodge New Grievance</span>
              </button>
            </div>

            {loadingComplaints ? (
              <div className="text-center py-8 text-[#707974] text-[13px]">
                Loading grievances from database...
              </div>
            ) : userComplaints.length === 0 ? (
              <div className="text-center py-8 text-[#707974] text-[13px]">
                No grievances on record. Use the button above to report a civic issue.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {userComplaints.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-xs transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-[#ba1a1a] bg-white px-2 py-0.5 rounded text-[11px] border border-[#e8e2d9]">
                          {item.trackingNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-[#707974]">
                          {item.category || 'General'} • {item.wardOrArea || 'Asgaon'}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-[14px] text-[#1d1b16]">
                        {item.title}
                      </h4>
                      <p className="text-[12px] text-[#404945] mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${item.status === 'RESOLVED' ? 'bg-[#baeed9] text-[#002117]' :
                          item.status === 'IN_PROGRESS' ? 'bg-[#dbe1ff] text-[#002873]' :
                            'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Items Tab */}
      {activeTab === 'saved' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
          <h3 className="font-heading font-extrabold text-[18px] text-[#003629] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a63b00]">bookmarks</span>
            <span>Saved Welfare Schemes &amp; Subsidies ({savedItems.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#f9f3ea] rounded-xl p-4 border border-[#e8e2d9] flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.iconColor}`}>
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#707974]">{item.type}</div>
                      <h4 className="font-heading font-bold text-[14px] text-[#1d1b16] mt-0.5">{item.title}</h4>
                      <p className="text-[12px] text-[#404945] mt-1">{item.sub}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeSavedItem(item.id)}
                    className="text-[#707974] hover:text-[#ba1a1a] p-1 shrink-0"
                    title="Remove from saved"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-[#e8e2d9] flex items-center justify-between text-[12px]">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#003629] hover:underline flex items-center gap-1"
                  >
                    <span>Apply on Portal</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                  <span className="text-[10px] font-semibold text-[#376757] bg-[#baeed9] px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broadcasts Tab */}
      {activeTab === 'broadcasts' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs max-w-2xl">
          <h3 className="font-heading font-extrabold text-[18px] text-[#003629] mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a63b00]">tune</span>
            <span>SMS &amp; Broadcast Advisory Subscriptions</span>
          </h3>
          <p className="text-[12px] text-[#707974] mb-4">
            Automated alerts sent directly to +91 {currentUser.phone || '9822104500'}
          </p>

          {/* Web Push Notification Device Card */}
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-[#003629]/10 via-[#baeed9]/20 to-[#003629]/5 border border-[#006a4e]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#003629] text-[#baeed9] flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">
                  {pushEnabled ? 'notifications_active' : 'notifications'}
                </span>
              </div>
              <div>
                <div className="font-heading font-extrabold text-[14px] text-[#003629] flex items-center gap-1.5">
                  <span>Device Push Notifications</span>
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                    pushEnabled ? 'bg-[#baeed9] text-[#002117]' : 'bg-[#f3ede4] text-[#707974]'
                  }`}>
                    {pushEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="text-[11px] text-[#55605a]">
                  Instant lock-screen alerts for APMC rates, canal water release, and power rosters.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleWebPush}
              disabled={pushToggling}
              className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all shrink-0 shadow-xs flex items-center gap-1.5 ${
                pushEnabled
                  ? 'bg-white hover:bg-[#ffdad6] text-[#ba1a1a] border border-[#ffdad6]'
                  : 'bg-[#003629] hover:bg-[#1b4d3e] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {pushToggling ? 'sync' : pushEnabled ? 'notifications_off' : 'notifications_active'}
              </span>
              <span>{pushToggling ? 'Updating...' : pushEnabled ? 'Turn Off Alerts' : 'Enable Device Push'}</span>
            </button>
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#003629]">trending_up</span>
                <div>
                  <div className="font-bold text-[#1d1b16]">Daily Mandi Price SMS</div>
                  <div className="text-[11px] text-[#707974]">Pauni &amp; Haveli APMC modal rates</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={mandiSms}
                onChange={(e) => setMandiSms(e.target.checked)}
                className="w-4 h-4 accent-[#003629] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#002873]">cloud</span>
                <div>
                  <div className="font-bold text-[#1d1b16]">Weather Advisories &amp; Canal Water Alerts</div>
                  <div className="text-[11px] text-[#707974]">Khadakwasla release rosters &amp; rainfall forecasts</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={weatherAlerts}
                onChange={(e) => setWeatherAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#003629] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#a63b00]">groups</span>
                <div>
                  <div className="font-bold text-[#1d1b16]">Gram Sabha Agenda &amp; Meeting Alerts</div>
                  <div className="text-[11px] text-[#707974]">Monthly village council agendas &amp; public audits</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={gramSabhaSms}
                onChange={(e) => setGramSabhaSms(e.target.checked)}
                className="w-4 h-4 accent-[#003629] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#707974]">bolt</span>
                <div>
                  <div className="font-bold text-[#1d1b16]">Agri Feeder Power Schedule</div>
                  <div className="text-[11px] text-[#707974]">MSEDCL 3-Phase day/night supply roster</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={powerSchedule}
                onChange={(e) => setPowerSchedule(e.target.checked)}
                className="w-4 h-4 accent-[#003629] cursor-pointer"
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
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1a1c1b] p-1 rounded-full hover:bg-[#f3ede4]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#006a4e] text-[24px]">edit_note</span>
              <div>
                <h3 className="font-heading font-extrabold text-[17px] text-[#003629]">
                  Edit Citizen Profile
                </h3>
                <span className="text-[11px] text-[#707974]">Update your Asgaon portal identity</span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3 text-[12px]">
              <div>
                <label className="font-bold text-[#003629] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Ramesh Patil / Sneha Deshmukh"
                  className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#003629] block mb-1">Mobile Number</label>
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
                  <label className="font-bold text-[#003629] block mb-1">Ward in Asgaon</label>
                  <select
                    value={editWard}
                    onChange={(e) => setEditWard(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                  >
                    <option value="Ward 1 (Bazaar Chowk)">Ward 1 (Bazaar Chowk)</option>
                    <option value="Ward 2 (Gaothan)">Ward 2 (Gaothan)</option>
                    <option value="Ward 3 (Vitthal Mandir)">Ward 3 (Vitthal Mandir)</option>
                    <option value="Ward 4 (South Shivar)">Ward 4 (South Shivar)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#003629] block mb-1">Civic Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                  >
                    <option value="FARMER">Farmer (शेतकरी)</option>
                    <option value="BUSINESS_OWNER">Business Owner (व्यापारी)</option>
                    <option value="STUDENT">Student (विद्यार्थी)</option>
                    <option value="SELLER">Seller / Vendor</option>
                    <option value="CITIZEN">General Resident</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#003629] block mb-1">Occupation / Bio</label>
                <input
                  type="text"
                  value={editOccupation}
                  onChange={(e) => setEditOccupation(e.target.value)}
                  placeholder="e.g. Cultivator of Soybean & Cotton / Grocery Store Owner"
                  className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f3ede4] mt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#f3ede4] text-[#1d1b16] font-bold hover:bg-[#e8e2d9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold shadow-xs"
                >
                  Save Profile
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
          className="text-[13px] text-[#003629] font-bold hover:underline inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Return to Village Homepage &amp; Public Civic Directory</span>
        </button>
      </div>
    </div>
  );
};
