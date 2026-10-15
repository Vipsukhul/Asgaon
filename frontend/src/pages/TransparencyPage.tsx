import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEOHead } from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, Clock, ExternalLink, ThumbsUp, RefreshCw } from 'lucide-react';
import { dataGovService } from '../services/dataGovApi';

interface WorkItem {
  id: string;
  title: string;
  ward: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SANCTIONED';
  statusLabel: string;
  citizenConfirmCount: number;
}

interface GrantCategory {
  code: string;
  name: string;
  allocated: number;
  spent: number;
  balance: number;
  status: string;
}

interface TransparencyOverview {
  financialYear: string;
  panchayatName: string;
  lgdCode: string;
  totalAllocated: number;
  totalSpent: number;
  remainingBalance: number;
  progressPercent: number;
  grants?: GrantCategory[];
}

interface TransparencyPageProps {
  onNavigateHome?: () => void;
}

export const TransparencyPage: React.FC<TransparencyPageProps> = ({ onNavigateHome }) => {
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const isMr = lang === 'MR';

  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Dynamic state loaded from live API
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [overview, setOverview] = useState<TransparencyOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [votedWorks, setVotedWorks] = useState<Record<string, boolean>>({});

  const loadData = async (showNotification = false) => {
    try {
      if (showNotification) setIsSyncing(true);
      else setIsLoading(true);

      const [ovData, worksData] = await Promise.all([
        dataGovService.fetchTransparencyOverview(),
        dataGovService.fetchApprovedWorks()
      ]);

      if (ovData) setOverview(ovData);
      if (worksData && worksData.length > 0) {
        setWorks(worksData);
      }

      if (showNotification) {
        showToast(
          isMr
            ? 'सरकारी API व ई-ग्रामस्वराज डेटा यशस्वी अद्यतनित केला!'
            : 'Government API and eGramSwaraj data updated successfully!',
          'success'
        );
      }
    } catch (e: any) {
      console.error('Failed to load live transparency data:', e);
      if (showNotification) {
        showToast(isMr ? 'डेटा लोड करताना त्रुटी आली' : 'Failed to refresh API data', 'error');
      }
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalAllocated = overview?.totalAllocated ?? 2850000;
  const totalSpent = overview?.totalSpent ?? 2130000;
  const remainingBalance = overview?.remainingBalance ?? (totalAllocated - totalSpent);
  const overallProgress = overview?.progressPercent ?? Math.round((totalSpent / totalAllocated) * 100);

  const handleCitizenVerify = async (workId: string) => {
    if (votedWorks[workId]) {
      showToast(isMr ? 'तुम्ही या कामासाठी आधीच पडताळणी नोंदवली आहे!' : 'You already verified this work!', 'info');
      return;
    }

    const newCount = await dataGovService.verifyWork(workId);

    setWorks((prev) =>
      prev.map((w) =>
        w.id === workId
          ? { ...w, citizenConfirmCount: newCount !== null ? newCount : w.citizenConfirmCount + 1 }
          : w
      )
    );
    setVotedWorks((prev) => ({ ...prev, [workId]: true }));
    showToast(isMr ? 'धन्यवाद! तुमची नागरिक पडताळणी नोंदवली.' : 'Thank you! Citizen verification recorded.', 'success');
  };

  const filteredWorks = works.filter((w) => {
    if (selectedWard !== 'all' && w.ward !== selectedWard) return false;
    if (selectedStatus !== 'all' && w.status !== selectedStatus) return false;
    return true;
  });

  const lgdCode = dataGovService.getAsgaonConfig().lgdCode;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'GovernmentOrganization',
      name: 'Gram Panchayat Asgaon - eGramSwaraj Transparency Portal',
      alternateName: 'आसगाव ग्रामपंचायत १५ वा वित्त आयोग व ई-ग्रामस्वराज पारदर्शकता कक्ष',
      url: 'https://asgaon.digital/transparency',
      description: 'Public transparency portal for Gram Panchayat Asgaon, Pauni, Bhandara. Real-time 15th Finance Commission fund allocations, approved GPDP civil works and social audit.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Asgaon',
        addressRegion: 'Maharashtra',
        postalCode: '441910',
        addressCountry: 'IN'
      }
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-sans max-w-6xl mx-auto pb-16">
      {/* 1. SEO Head */}
      <SEOHead
        title={isMr ? 'ग्राम पारदर्शकता व १५ वा वित्त आयोग निधी | आसगाव' : 'Panchayat Transparency & 15th Finance Commission | Asgaon'}
        description={
          isMr
            ? 'आसगाव ग्रामपंचायतीचा १५ वा वित्त आयोग निधी, मंजूर कामे, खर्च व ई-ग्रामस्वराज पारदर्शकता डॅशबोर्ड. पवनी, भंडारा.'
            : 'Explore approved Gram Panchayat civil works, 15th Finance Commission fund allocation, expenditure breakdown, and citizen social audit for Asgaon village.'
        }
        keywords="eGramSwaraj Asgaon, 15th Finance Commission Pauni, Asgaon GPDP works, Gram Panchayat Budget, आसगाव १५ वा वित्त आयोग"
        canonicalUrl="https://asgaon.digital/transparency"
        structuredData={structuredData}
      />

      {/* 2. Breadcrumb */}
      <Breadcrumb
        items={[
          { label: isMr ? 'मुख्यपृष्ठ' : 'Home', onClick: onNavigateHome },
          { label: isMr ? 'ग्राम पारदर्शकता (ई-ग्रामस्वराज)' : 'Panchayat Transparency', active: true }
        ]}
      />

      {/* 3. Hero Header Banner */}
      <header className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-emerald-800">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-xs font-bold border border-white/20">
                LGD Code: {lgdCode} • {isMr ? 'पवनी, जि. भंडारा' : 'Pauni, Dist. Bhandara'}
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-[22px] sm:text-[28px] leading-tight text-white">
              {isMr ? '१५ वा वित्त आयोग निधी व विकासकामे पारदर्शकता' : '15th Finance Commission & Civil Works Transparency'}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              {isMr
                ? 'गावात आलेला निधी, झालेला खर्च आणि मंजूर विकासकामांचा थेट हिशोब.'
                : 'Direct insight into village grants received, expenditures, and approved projects on ground.'}
            </p>

            
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => loadData(true)}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="सरकारी API वरून थेट डेटा अपडेट करा"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? (isMr ? 'अद्यतनित होत आहे...' : 'Syncing...') : (isMr ? 'थेट API रिफ्रेश' : 'Sync Live API')}</span>
            </button>

            <a
              href="https://egramswaraj.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>eGramSwaraj</span>
              <ExternalLink className="w-3 h-3 text-emerald-800" />
            </a>
          </div>
        </div>
      </header>

      {/* 4. Essential Fund Overview Cards (३ मुख्य आकडे) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Allocated */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {isMr ? 'एकूण प्राप्त निधी (२०२५-२६)' : 'Total Sanctioned Fund'}
            </div>
            <div className="font-heading font-black text-[26px] text-emerald-950 mt-1">
              ₹{(totalAllocated / 100000).toFixed(2)} लाख
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-2 pt-2 border-t border-stone-100">
            १५ वा वित्त आयोग + राज्य शासन अनुदान
          </div>
        </div>

        {/* Spent */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {isMr ? 'झालेला प्रत्यक्ष खर्च' : 'Actual Funds Utilized'}
            </div>
            <div className="font-heading font-black text-[26px] text-stone-900 mt-1">
              ₹{(totalSpent / 100000).toFixed(2)} लाख
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-stone-100">
            <div className="flex justify-between text-[11px] font-bold text-stone-600 mb-1">
              <span>{isMr ? 'निधी वापर प्रगती' : 'Progress'}</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-700 h-full rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {isMr ? 'शिल्लक उपलब्ध निधी' : 'Remaining Balance'}
            </div>
            <div className="font-heading font-black text-[26px] text-amber-700 mt-1">
              ₹{(remainingBalance / 100000).toFixed(2)} लाख
            </div>
          </div>
          <div className="text-[11px] text-amber-800 font-semibold mt-2 pt-2 border-t border-stone-100">
            ग्रामपंचायत बँक खात्यात थेट उपलब्ध
          </div>
        </div>
      </section>

      {/* 5. Grant Allocation Breakdown (Tied vs Untied) */}
      <section className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <h2 className="font-heading font-extrabold text-[16px] text-emerald-950">
          {isMr ? 'निधी वाटप तपशील (बांधित व अबांधित)' : 'Grant Allocation Breakdown'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Tied Grant */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-emerald-950 text-sm">
                💧 {isMr ? 'बांधित निधी (Tied Grant - ८०%)' : 'Tied Grant (80%)'}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                पाणी व स्वच्छता
              </span>
            </div>
            <p className="text-xs text-stone-600 mb-3">
              {isMr ? 'केवळ पिण्याचे पाणी, विहीर दुरुस्ती, जल जीवन मिशन व सांडपाणी नालीवर खर्च बंधनकारक.' : 'Dedicated strictly for drinking water, sanitation & drainage.'}
            </p>
            <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-emerald-200/60">
              <span className="text-stone-600">मंजूर: <strong>₹२२.८० लाख</strong></span>
              <span className="text-emerald-800">खर्च: <strong>₹१७.१० लाख</strong></span>
              <span className="text-amber-700">शिल्लक: <strong>₹५.७० लाख</strong></span>
            </div>
          </div>

          {/* Untied Grant */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-amber-950 text-sm">
                💡 {isMr ? 'अबांधित निधी (Untied Grant - २०%)' : 'Untied Grant (20%)'}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                ग्राम विकास
              </span>
            </div>
            <p className="text-xs text-stone-600 mb-3">
              {isMr ? 'गावातील सिमेंट रस्ते, सौर पथदिवे, स्मशानभूमी दुरुस्ती व सार्वजनिक सोयींवर खर्च.' : 'Flexible civic needs: cement roads, solar street lights, crematorium.'}
            </p>
            <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-amber-200/60">
              <span className="text-stone-600">मंजूर: <strong>₹५.७० लाख</strong></span>
              <span className="text-emerald-800">खर्च: <strong>₹४.२० लाख</strong></span>
              <span className="text-amber-700">शिल्लक: <strong>₹१.५० लाख</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Approved Works List & Citizen Verification (मंजूर विकासकामे) */}
      <section className="space-y-4">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
          <div>
            <h2 className="font-heading font-extrabold text-[17px] text-emerald-950">
              {isMr ? 'मंजूर विकासकामे व सद्यस्थिती' : 'Approved Works & Current Status'}
            </h2>
            <p className="text-xs text-stone-500">
              {isMr ? 'गावकऱ्यांनी कामाची प्रत्यक्ष पाहणी करून डिजिटल पडताळणी नोंदवावी.' : 'Inspect projects on ground and record digital citizen verification.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Ward Filter */}
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="all">{isMr ? 'सर्व प्रभाग' : 'All Wards'}</option>
              <option value="प्रभाग १">प्रभाग १</option>
              <option value="प्रभाग २">प्रभाग २</option>
              <option value="प्रभाग ३">प्रभाग ३</option>
              <option value="सर्व प्रभाग">सर्व प्रभाग (गाव)</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="all">{isMr ? 'सर्व स्थिती' : 'All Status'}</option>
              <option value="COMPLETED">{isMr ? 'पूर्ण झालेली' : 'Completed'}</option>
              <option value="IN_PROGRESS">{isMr ? 'सुरू असलेली' : 'In Progress'}</option>
              <option value="SANCTIONED">{isMr ? 'नवीन मंजूर' : 'Sanctioned'}</option>
            </select>
          </div>
        </div>

        {/* Works Cards */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <RefreshCw className="w-6 h-6 text-emerald-700 animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-600">
                {isMr ? 'ई-ग्रामस्वराज व सरकारी API वरून विकासकामे लोड होत आहेत...' : 'Loading approved works from Government API...'}
              </p>
            </div>
          ) : filteredWorks.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs shadow-2xs">
              {isMr ? 'निवडलेल्या निकषांनुसार कोणतीही विकासकामे सापडली नाहीत.' : 'No projects match the selected filters.'}
            </div>
          ) : (
            filteredWorks.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[11px] font-bold">
                      {work.ward}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                      {work.category}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold self-start sm:self-auto ${
                      work.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : work.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                    }`}
                  >
                    {work.status === 'COMPLETED' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                    )}
                    <span>{work.statusLabel || work.status}</span>
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-[15px] sm:text-[16px] text-stone-900 leading-snug">
                  {work.title}
                </h3>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 font-semibold block text-[10px] uppercase">
                        {isMr ? 'मंजूर निधी' : 'Allocated'}
                      </span>
                      <span className="font-extrabold text-emerald-950 text-sm">
                        ₹{work.allocatedAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 font-semibold block text-[10px] uppercase">
                        {isMr ? 'झालेला खर्च' : 'Spent'}
                      </span>
                      <span className="font-extrabold text-stone-700 text-sm">
                        ₹{work.spentAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Citizen Verification Button */}
                  <button
                    type="button"
                    onClick={() => handleCitizenVerify(work.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      votedWorks[work.id]
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 shadow-2xs'
                    }`}
                    title={isMr ? 'काम पूर्ण झाल्याची प्रत्यक्ष खात्री नोंदवा' : 'Verify project on ground'}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isMr ? 'पडताळणी' : 'Verify'} ({work.citizenConfirmCount})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
