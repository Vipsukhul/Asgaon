import { LucideIcon } from './LucideIcon';
import React, { useState, useEffect } from 'react';
import type { UserProfileData } from '../pages/ProfilePage';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  actorPhone?: string;
  category: 'COMPLAINTS' | 'SCHEMES' | 'BROADCAST' | 'USERS' | 'SECURITY' | 'SHIKSHA' | 'CONTENT';
  action: string;
  details: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  ipAddress?: string;
}

const STORAGE_KEY = 'dg_admin_audit_logs';

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    actorName: 'सरपंच ',
    actorRole: 'SARPANCH',
    actorPhone: '9822081100',
    category: 'BROADCAST',
    action: 'तातडीची दवंडी  पाठवली',
    details: 'हवामान इशारा व वादळी पावसाबाबत सर्व १,४२० गावकऱ्यांच्या मोबाईलवर थेट अलर्ट प्रसारित केला.',
    severity: 'CRITICAL',
    ipAddress: '192.168.1.104 (GP Office)'
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actorName: 'ग्रामसेवक ',
    actorRole: 'GRAM_SEVAK',
    actorPhone: '9421890123',
    category: 'COMPLAINTS',
    action: 'तक्रार #GP-2026-44 निकाली काढली ',
    details: 'वॉर्ड क्र. ३ मधील पिण्याच्या पाण्याच्या पाईपलाईनची गळती दुरुस्त करून तक्रार बंद केली.',
    severity: 'INFO',
    ipAddress: '192.168.1.108 (GP Office)'
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    actorName: 'संगणक परिचालक ',
    actorRole: 'CSC_VLE',
    actorPhone: '9850123456',
    category: 'SCHEMES',
    action: 'नवीन योजना जोडली: पीएम किसान १८वा हप्ता',
    details: 'पीएम किसान सन्मान निधी १८ व्या हप्त्यासाठी ई-केवायसी नोंदणीची माहिती व अर्ज लिंक अद्ययावत केली.',
    severity: 'INFO',
    ipAddress: '10.0.4.12 (Aaple Sarkar Seva)'
  },
  {
    id: 'log-104',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    actorName: 'जल मित्र ',
    actorRole: 'WATER_ADMIN',
    actorPhone: '9822081102',
    category: 'CONTENT',
    action: 'पाणी पुरवठा वेळापत्रक अद्ययावत केले',
    details: 'उन्हाळी नियोजनानुसार वॉर्ड १ व वॉर्ड ४ चे पाणी सोडण्याचे तास सकाळी ६:३० ते ८:०० असे निश्चित केले.',
    severity: 'INFO',
    ipAddress: 'Mobile App'
  },
  {
    id: 'log-105',
    timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    actorName: 'सिस्टम प्रशासक ',
    actorRole: 'SUPER_ADMIN',
    category: 'SECURITY',
    action: 'प्रशासक लॉगिन यशस्वी ',
    details: 'आसगाव ग्राम माहिती व जनजागृती मंच प्रशासन पॅनेलमध्ये सुरक्षित दोन-टप्प्यांच्या पडताळणीसह प्रवेश.',
    severity: 'INFO',
    ipAddress: 'Admin Web Portal'
  },
  {
    id: 'log-106',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    actorName: 'ग्रामसेवक ',
    actorRole: 'GRAM_SEVAK',
    actorPhone: '9421890123',
    category: 'USERS',
    action: 'नागरिक पडताळणी मंजूर: राहुल मेश्राम (वॉर्ड २)',
    details: 'मतदार यादी व आधार पडताळणीनुसार नागरिक खात्यास "प्रमाणित ग्रामस्थ"  दर्जा मंजूर केला.',
    severity: 'INFO',
    ipAddress: '192.168.1.108 (GP Office)'
  }
];

export const recordAdminLog = (
  actor: { name: string; role: string; phone?: string },
  category: AuditLogItem['category'],
  action: string,
  details: string,
  severity: AuditLogItem['severity'] = 'INFO'
) => {
  const newEntry: AuditLogItem = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actorName: actor.name || 'प्रशासक',
    actorRole: actor.role || 'ADMIN',
    actorPhone: actor.phone,
    category,
    action,
    details,
    severity,
    ipAddress: 'Web Portal Session'
  };

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const parsed: AuditLogItem[] = existing ? JSON.parse(existing) : INITIAL_AUDIT_LOGS;
    const updated = [newEntry, ...parsed].slice(0, 500); // keep last 500 logs
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
};

interface AdminLogsSectionProps {
  currentUser?: UserProfileData;
  lang?: 'MR' | 'EN';
}

export const AdminLogsSection: React.FC<AdminLogsSectionProps> = ({ currentUser: _currentUser, lang = 'MR' }) => {
  const [logs, setLogs] = useState<AuditLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch {
      // ignore
    }
  }, [logs]);

  const filteredLogs = logs.filter((item) => {
    const matchesSearch =
      !search ||
      item.action.toLowerCase().includes(search.toLowerCase()) ||
      item.details.toLowerCase().includes(search.toLowerCase()) ||
      item.actorName.toLowerCase().includes(search.toLowerCase()) ||
      (item.actorPhone && item.actorPhone.includes(search));

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor Name', 'Role', 'Category', 'Severity', 'Action', 'Details', 'Source'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.actorName.replace(/"/g, '""')}"`,
      `"${l.actorRole}"`,
      `"${l.category}"`,
      `"${l.severity}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress || 'Web'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `asgaon_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearLogs = () => {
    if (window.confirm(lang === 'MR' ? 'तुम्हाला खात्री आहे का? सर्व जुन्या ऑडिट नोंदी हटवल्या जातील.' : 'Are you sure you want to clear old logs?')) {
      setLogs([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getSeverityBadge = (sev: AuditLogItem['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#fef3c7] text-[#ba1a1a] border border-[#fde68a]">CRITICAL (तातडीची)</span>;
      case 'WARN':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffeed2] text-[#8c5000] border border-[#ffdcb2]">WARNING</span>;
      case 'INFO':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] border border-[#83d4b4]">INFO (माहिती)</span>;
    }
  };

  const getCategoryLabel = (cat: AuditLogItem['category']) => {
    switch (cat) {
      case 'BROADCAST':
        return lang === 'MR' ? 'दवंडी / अलर्ट' : 'Broadcast';
      case 'COMPLAINTS':
        return lang === 'MR' ? 'तक्रार निवारण' : 'Complaints';
      case 'SCHEMES':
        return lang === 'MR' ? 'योजना' : 'Schemes';
      case 'USERS':
        return lang === 'MR' ? 'नागरिक यादी' : 'Users';
      case 'SECURITY':
        return lang === 'MR' ? 'सुरक्षा / लॉगिन' : 'Security';
      case 'CONTENT':
        return lang === 'MR' ? 'ग्राम माहिती' : 'Content';
      case 'SHIKSHA':
        return lang === 'MR' ? 'शिक्षण' : 'Education';
      default:
        return cat;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-[#e8e2d9] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LucideIcon name="manage_history" className="text-[24px] text-[#006a4e]" />
            <h2 className="text-xl font-black text-[#166534]">
              {lang === 'MR' ? 'ग्रामपंचायत ऑडिट व कृती नोंदी ' : 'Gram Panchayat System Audit & Activity Logs'}
            </h2>
          </div>
          <p className="text-xs text-[#707974] mt-1">
            {lang === 'MR'
              ? 'ग्रामपंचायत प्रशासन, दवंडी, योजना, तक्रार निवारण आणि नागरिक पडताळणीच्या सर्व अधिकृत नोंदींची नोंदवही.'
              : 'Complete transparent audit trail of administrative actions, alerts, grievances, and schemes.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#166534] text-white hover:bg-[#052e16] text-[12px] font-bold transition-all shadow-xs"
          >
            <LucideIcon name="download" className="text-[16px]" />
            <span>{lang === 'MR' ? 'नोंदवही डाऊनलोड करा ' : 'Export Logs '}</span>
          </button>
          <button
            type="button"
            onClick={handleClearLogs}
            className="px-3 py-2 rounded-xl text-[12px] font-semibold text-[#707974] hover:text-[#ba1a1a] hover:bg-[#fef3c7]/30 transition-colors"
          >
            {lang === 'MR' ? 'नोंदी साफ करा' : 'Clear'}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#e8e2d9]">
          <span className="text-[11px] font-bold text-[#707974] uppercase block">एकूण नोंदी </span>
          <span className="text-2xl font-black text-[#166534] mt-0.5 block">{logs.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#e8e2d9]">
          <span className="text-[11px] font-bold text-[#ba1a1a] uppercase block">तातडीच्या कृती </span>
          <span className="text-2xl font-black text-[#ba1a1a] mt-0.5 block">
            {logs.filter((l) => l.severity === 'CRITICAL').length}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#e8e2d9]">
          <span className="text-[11px] font-bold text-[#006a4e] uppercase block">तक्रार सोडवणूक </span>
          <span className="text-2xl font-black text-[#006a4e] mt-0.5 block">
            {logs.filter((l) => l.category === 'COMPLAINTS').length}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#e8e2d9]">
          <span className="text-[11px] font-bold text-[#c2410c] uppercase block">प्रसारित दवंडी </span>
          <span className="text-2xl font-black text-[#c2410c] mt-0.5 block">
            {logs.filter((l) => l.category === 'BROADCAST').length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-[#e8e2d9] p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <LucideIcon name="search" className="text-[18px] text-[#707974] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'MR' ? 'कृती, अधिकारी, फोन नंबर किंवा तपशील शोधा...' : 'Search action, actor, phone or details...'}
            className="w-full bg-[#f9f3ea] text-[#1d1b16] text-[12px] pl-9 pr-3 py-2 rounded-xl border border-[#e8e2d9] focus:outline-none focus:border-[#006a4e]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#f9f3ea] text-[12px] font-medium text-[#1d1b16] py-2 px-3 rounded-xl border border-[#e8e2d9] focus:outline-none"
          >
            <option value="ALL">{lang === 'MR' ? 'सर्व विभाग ' : 'All Modules'}</option>
            <option value="BROADCAST">{lang === 'MR' ? 'दवंडी / अलर्ट' : 'Broadcasts'}</option>
            <option value="COMPLAINTS">{lang === 'MR' ? 'तक्रार निवारण' : 'Complaints'}</option>
            <option value="SCHEMES">{lang === 'MR' ? 'योजना व्यवस्थापन' : 'Schemes'}</option>
            <option value="USERS">{lang === 'MR' ? 'नागरिक यादी' : 'Users'}</option>
            <option value="SECURITY">{lang === 'MR' ? 'सुरक्षा व लॉगिन' : 'Security'}</option>
            <option value="CONTENT">{lang === 'MR' ? 'ग्राम माहिती व वेळापत्रक' : 'Content & Schedule'}</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#f9f3ea] text-[12px] font-medium text-[#1d1b16] py-2 px-3 rounded-xl border border-[#e8e2d9] focus:outline-none"
          >
            <option value="ALL">{lang === 'MR' ? 'सर्व दर्जा ' : 'All Severity'}</option>
            <option value="INFO">INFO (सर्वसाधारण)</option>
            <option value="WARN">WARNING (दक्षता)</option>
            <option value="CRITICAL">CRITICAL (तातडीची)</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-[#e8e2d9] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#f9f3ea] text-[#707974] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">वेळ / दिनांक</th>
                <th className="p-3.5">अधिकारी / प्रशासक</th>
                <th className="p-3.5">विभाग</th>
                <th className="p-3.5">कृती व निर्णय</th>
                <th className="p-3.5">दर्जा</th>
                <th className="p-3.5 text-right">तपशील</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede4]">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-[#fef9ee] transition-colors">
                    <td className="p-3.5 text-[#55605a] whitespace-nowrap">
                      <div className="font-semibold text-[#1d1b16]">
                        {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-[#707974]">
                        {new Date(l.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-bold text-[#166534] flex items-center gap-1.5">
                        <span>{l.actorName}</span>
                      </div>
                      <div className="text-[10px] text-[#707974] font-medium">
                        {l.actorRole} {l.actorPhone ? `• ${l.actorPhone}` : ''}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#f3ede4] text-[#404945]">
                        {getCategoryLabel(l.category)}
                      </span>
                    </td>

                    <td className="p-3.5 max-w-md">
                      <div className="font-bold text-[#1d1b16] truncate">{l.action}</div>
                      <div className="text-[11px] text-[#55605a] line-clamp-1">{l.details}</div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">{getSeverityBadge(l.severity)}</td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(l)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#006a4e] hover:bg-[#e8f1ec] border border-[#006a4e]/20 transition-colors"
                      >
                        तपशील
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#707974]">
                    कोणतीही नोंद सापडली नाही .
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#e8e2d9] shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-3">
              <div className="flex items-center gap-2">
                <LucideIcon name="verified_user" className="text-[20px] text-[#006a4e]" />
                <h3 className="font-black text-[#166534] text-base">ऑडिट नोंद तपशील </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-[#707974] hover:text-[#1d1b16] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 text-[12px]">
              <div>
                <span className="text-[#707974] font-bold uppercase text-[10px] block">कृती </span>
                <p className="font-black text-[#166534] text-sm mt-0.5">{selectedLog.action}</p>
              </div>

              <div>
                <span className="text-[#707974] font-bold uppercase text-[10px] block">सविस्तर माहिती </span>
                <p className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] text-[#1d1b16] leading-relaxed mt-0.5">
                  {selectedLog.details}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[#707974] font-bold uppercase text-[10px] block">अधिकारी </span>
                  <p className="font-bold text-[#1d1b16] mt-0.5">{selectedLog.actorName}</p>
                  <p className="text-[10px] text-[#707974]">{selectedLog.actorRole}</p>
                </div>
                <div>
                  <span className="text-[#707974] font-bold uppercase text-[10px] block">वेळ व दिनांक </span>
                  <p className="font-semibold text-[#1d1b16] mt-0.5">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#f3ede4]">
                <div>
                  <span className="text-[#707974] font-bold uppercase text-[10px] block">विभाग </span>
                  <span className="font-bold text-[#006a4e]">{selectedLog.category}</span>
                </div>
                <div>
                  <span className="text-[#707974] font-bold uppercase text-[10px] block">प्रणाली स्रोत </span>
                  <span className="text-[#55605a]">{selectedLog.ipAddress || 'Web Session'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e8e2d9] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-[#166534] text-white text-[12px] font-bold hover:bg-[#052e16] transition-colors"
              >
                बंद करा 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
