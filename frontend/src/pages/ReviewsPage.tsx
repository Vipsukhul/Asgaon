import React, { useState, useEffect, useMemo } from 'react';
import type { Business } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEOHead } from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

export interface PublicReview {
  id: string | number;
  businessId: string | number;
  businessName: string;
  businessSlug?: string;
  userName: string;
  wardOrArea: string;
  rating: number;
  date: string;
  comment: string;
  verifiedCitizen: boolean;
}

const SEED_REVIEWS: PublicReview[] = [
  {
    id: 'rev-1',
    businessId: '1',
    businessName: 'खडके किराणा आणि जनरल स्टोअर्स (Khadke Kirana)',
    businessSlug: 'khadke-kirana',
    userName: 'रमेश पाटील (Rameshwar Patil)',
    wardOrArea: 'वॉर्ड २ (गावठाण)',
    rating: 5,
    date: 'काल (Yesterday)',
    comment: 'उत्कृष्ट सेवा आणि वाजवी दर. वेळेवर सर्व धान्य व किराणा माल उपलब्ध असतो. गावातच अशी दर्जेदार सोय असल्याने पवनीला जाण्याची गरज भासत नाही.',
    verifiedCitizen: true
  },
  {
    id: 'rev-2',
    businessId: '2',
    businessName: 'पाटील कृषी केंद्र (Patil Krishi Kendra)',
    businessSlug: 'patil-krishi-kendra',
    userName: 'सुनीता झाळके (Sunita Zalke)',
    wardOrArea: 'आंबेडकर वॉर्ड १',
    rating: 5,
    date: '३ दिवसांपूर्वी (3 days ago)',
    comment: 'अतिशय नम्र बोलणे आणि खात्रीशीर बियाणे. रासायनिक व सेंद्रिय खतांचा योग्य सल्ला देतात. सर्व शेतकरी बांधवांना नक्की शिफारस करतो.',
    verifiedCitizen: true
  },
  {
    id: 'rev-3',
    businessId: '3',
    businessName: 'सोनवणे मेडिकल व क्लिनिक (Sonone Medical)',
    businessSlug: 'sonone-medical',
    userName: 'विठ्ठल मेश्राम (Vitthal Meshram)',
    wardOrArea: 'विठ्ठल मंदिर परिसर वॉर्ड ३',
    rating: 5,
    date: '१ आठवड्यापूर्वी (1 week ago)',
    comment: 'तातडीच्या वेळी रात्रीही आवश्यक औषधे उपलब्ध करून दिली. बीपी व शुगर तपासणी मोफत केली जाते. अतिशय तत्पर सेवा.',
    verifiedCitizen: true
  },
  {
    id: 'rev-4',
    businessId: '4',
    businessName: 'गायत्री झेरॉक्स व सीएससी केंद्र (Gayatri CSC Center)',
    businessSlug: 'gayatri-csc',
    userName: 'प्रशांत चौधरी (Prashant Choudhari)',
    wardOrArea: 'वॉर्ड ४ (शिवार)',
    rating: 4,
    date: '२ आठवड्यांपूर्वी (2 weeks ago)',
    comment: 'लाडकी बहीण योजना व पीएम किसान ई-केवायसीचे काम अगदी कमी वेळेत करून दिले. डिजिटल प्रिंटिंगची सोय उत्तम आहे.',
    verifiedCitizen: true
  },
  {
    id: 'rev-5',
    businessId: '1',
    businessName: 'खडके किराणा आणि जनरल स्टोअर्स (Khadke Kirana)',
    businessSlug: 'khadke-kirana',
    userName: 'संजय कापसे (Sanjay Kapse)',
    wardOrArea: 'गावठाण वॉर्ड २',
    rating: 5,
    date: '२ आठवड्यांपूर्वी (2 weeks ago)',
    comment: 'स्वच्छ किराणा, डिजिटल यूपीआय पेमेंट व घरपोच सेवा. आसगावमधील सर्वात विश्वासू दुकान!',
    verifiedCitizen: true
  },
  {
    id: 'rev-6',
    businessId: '5',
    businessName: 'माऊली ट्रॅक्टर व कृषी अवजारे (Mauli Tractors)',
    businessSlug: 'mauli-tractors',
    userName: 'अनिल भोंगाडे (Anil Bhongade)',
    wardOrArea: 'वॉर्ड ३ (मंदिर चौक)',
    rating: 5,
    date: '३ आठवड्यांपूर्वी (3 weeks ago)',
    comment: 'नांगरणी व रोटाव्हेटरचे काम वेळेत पूर्ण केले. डिझेलचे दर आणि अवजारांचे भाडे अतिशय वाजवी आहे.',
    verifiedCitizen: true
  }
];

interface ReviewsPageProps {
  businesses?: Business[];
  onNavigateHome?: () => void;
  onSelectBusiness?: (biz: any) => void;
  onSelectBusinessSlug?: (slug: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  businesses = [],
  onNavigateHome,
  onSelectBusiness,
  onSelectBusinessSlug
}) => {
  const { lang } = useLanguage();
  const isMr = lang === 'MR';

  const [allReviews, setAllReviews] = useState<PublicReview[]>(() => {
    const saved = localStorage.getItem('dg_all_public_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return SEED_REVIEWS;
  });

  const [selectedBusinessFilter, setSelectedBusinessFilter] = useState<string>('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');

  // Write Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetBizId, setTargetBizId] = useState<string>('');
  const [targetBizName, setTargetBizName] = useState<string>('');
  const [formName, setFormName] = useState('');
  const [formWard, setFormWard] = useState('वॉर्ड २ (गावठाण)');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync reviews with localStorage
  const saveReviews = (newList: PublicReview[]) => {
    setAllReviews(newList);
    localStorage.setItem('dg_all_public_reviews', JSON.stringify(newList));
  };

  // Pre-populate business name when targetBizId changes
  useEffect(() => {
    if (targetBizId) {
      const found = businesses.find((b) => String(b.id) === String(targetBizId));
      if (found) {
        setTargetBizName(found.name);
      }
    }
  }, [targetBizId, businesses]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const total = allReviews.length;
    if (total === 0) return { avg: 5.0, count: 0, fiveStar: 0, percentPositive: 100 };
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / total).toFixed(1));
    const fiveStar = allReviews.filter((r) => r.rating === 5).length;
    const positive = allReviews.filter((r) => r.rating >= 4).length;
    const percentPositive = Math.round((positive / total) * 100);
    return { avg, count: total, fiveStar, percentPositive };
  }, [allReviews]);

  // Filtered & Sorted Reviews
  const filteredReviews = useMemo(() => {
    return allReviews
      .filter((rev) => {
        const matchesBiz = selectedBusinessFilter === 'all' || String(rev.businessId) === String(selectedBusinessFilter);
        const matchesRating = selectedRatingFilter === 'all' || rev.rating === selectedRatingFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          rev.userName.toLowerCase().includes(q) ||
          rev.businessName.toLowerCase().includes(q) ||
          rev.comment.toLowerCase().includes(q) ||
          rev.wardOrArea.toLowerCase().includes(q);
        return matchesBiz && matchesRating && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'lowest') return a.rating - b.rating;
        return 0; // default recent
      });
  }, [allReviews, selectedBusinessFilter, selectedRatingFilter, searchQuery, sortBy]);

  // Handle Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) {
      alert(isMr ? 'कृपया नाव आणि अभिप्राय दोन्ही लिहा.' : 'Please enter your name and review comment.');
      return;
    }

    setIsSubmitting(true);
    const finalBizName = targetBizName || (businesses.length > 0 ? businesses[0].name : 'आसगाव स्थानिक व्यवसाय');
    const finalBizId = targetBizId || (businesses.length > 0 ? String(businesses[0].id) : '1');

    const newRev: PublicReview = {
      id: 'rev-' + Date.now(),
      businessId: finalBizId,
      businessName: finalBizName,
      userName: formName.trim(),
      wardOrArea: formWard,
      rating: formRating,
      date: isMr ? 'आत्ताच (Just now)' : 'Just now',
      comment: formComment.trim(),
      verifiedCitizen: Boolean(formPhone.trim())
    };

    // Save to all public reviews list
    const updated = [newRev, ...allReviews];
    saveReviews(updated);

    // Also sync to individual business storage key for seamless backward compatibility
    try {
      const bizKey = `dg_biz_reviews_${finalBizId}`;
      const existing = localStorage.getItem(bizKey);
      const bizList = existing ? JSON.parse(existing) : [];
      bizList.unshift({
        id: newRev.id,
        userName: newRev.userName,
        wardOrArea: newRev.wardOrArea,
        rating: newRev.rating,
        date: newRev.date,
        comment: newRev.comment,
        verifiedCitizen: newRev.verifiedCitizen
      });
      localStorage.setItem(bizKey, JSON.stringify(bizList));
    } catch { /* ignore */ }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsModalOpen(false);
      setFormName('');
      setFormComment('');
      setFormPhone('');
      setFormRating(5);
    }, 1200);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-[#ef9f27]">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`material-symbols-outlined text-[18px] ${
              star <= rating ? 'font-fill text-[#ef9f27]' : 'text-[#d6d0c4]'
            }`}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#1d1b16] pb-24">
      <SEOHead
        title="आसगाव ग्राहक व नागरिक अभिप्राय मंच | Asgaon Business Reviews & Customer Ratings"
        description="आसगाव परिसरातील दुकाने, कृषी केंद्र, दवाखाने व सेवांसाठी गावकऱ्यांचे थेट व पारदर्शक अभिप्राय. ५-स्टार मानांकन व विश्वसनीय स्थानिक व्यापार मंच."
        keywords="Asgaon reviews, Asgaon business ratings, Asgaon customer feedback, आसगाव ग्राहक अभिप्राय, पवनी दुकाने रेटिंग"
        canonicalUrl="https://asgaon.vercel.app/reviews"
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#003629] via-[#004d3b] to-[#1b4d3e] text-white relative overflow-hidden border-b border-[#00261d]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 relative z-10">
          <Breadcrumb
            items={[
              { label: isMr ? 'मुख्य पृष्ठ' : 'Home', onClick: onNavigateHome },
              { label: isMr ? 'स्थानिक दुकाने' : 'Businesses', onClick: () => onNavigateHome?.() },
              { label: isMr ? 'नागरिक अभिप्राय मंच' : 'Community Reviews', active: true }
            ]}
          />

          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#baeed9]/20 text-[#baeed9] border border-[#baeed9]/30 text-[11px] font-bold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>{isMr ? '१००% पारदर्शक व सत्यापित नागरी अभिप्राय' : '100% Verified Community Feedback'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {isMr ? 'आसगाव ग्राहक व नागरिक अभिप्राय मंच' : 'Asgaon Community Reviews & Ratings'}
              </h1>
              <p className="mt-2 text-[#d6eee4]/90 text-xs sm:text-sm leading-relaxed">
                {isMr
                  ? 'गावातील दुकाने, कृषी केंद्र, दवाखाने व कारागिरांच्या सेवेबद्दल गावकऱ्यांचे अनुभव वाचा आणि स्वतःचा अभिप्राय नोंदवून इतरांना मदत करा.'
                  : 'Transparent reviews and ratings for local enterprises, agro stores, health clinics, and services in Asgaon.'}
              </p>
            </div>

            <button
              onClick={() => {
                if (businesses.length > 0 && !targetBizId) {
                  setTargetBizId(String(businesses[0].id));
                  setTargetBizName(businesses[0].name);
                }
                setIsModalOpen(true);
              }}
              className="px-5 py-3 rounded-xl bg-[#baeed9] hover:bg-[#a3e2c9] text-[#003629] font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">rate_review</span>
              <span>{isMr ? 'नवीन अभिप्राय नोंदवा' : 'Write a Review'}</span>
            </button>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-[#baeed9] font-black text-2xl sm:text-3xl flex items-center justify-center gap-1">
                <span>{stats.avg}</span>
                <span className="material-symbols-outlined text-[20px] text-[#ef9f27] font-fill">star</span>
              </div>
              <div className="text-[11px] text-[#d6eee4]/80 font-bold mt-1 uppercase tracking-wider">
                {isMr ? 'सरासरी मानांकन' : 'Average Rating'}
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-white font-black text-2xl sm:text-3xl">
                {stats.count}
              </div>
              <div className="text-[11px] text-[#d6eee4]/80 font-bold mt-1 uppercase tracking-wider">
                {isMr ? 'एकूण अभिप्राय' : 'Verified Reviews'}
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-[#baeed9] font-black text-2xl sm:text-3xl">
                {stats.percentPositive}%
              </div>
              <div className="text-[11px] text-[#d6eee4]/80 font-bold mt-1 uppercase tracking-wider">
                {isMr ? 'सकारात्मक प्रतिसाद' : 'Positive Rating'}
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-white font-black text-2xl sm:text-3xl">
                {businesses.length || 6}
              </div>
              <div className="text-[11px] text-[#d6eee4]/80 font-bold mt-1 uppercase tracking-wider">
                {isMr ? 'नोंदणीकृत दुकाने' : 'Local Businesses'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#e8e2d9] p-4 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707974] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isMr
                  ? 'दुकान, ग्राहक नाव किंवा शब्दाने शोधा (उदा. खडके किराणा, खते)...'
                  : 'Search by shop, customer name or keyword...'
              }
              className="w-full pl-9 pr-3 py-2 bg-[#f9f3ea]/60 rounded-xl text-xs sm:text-sm text-[#1d1b16] placeholder-[#707974] border border-[#e8e2d9] focus:border-[#006a4e] focus:bg-white outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Business Dropdown Filter */}
            <select
              value={selectedBusinessFilter}
              onChange={(e) => setSelectedBusinessFilter(e.target.value)}
              className="p-2 rounded-xl bg-white border border-[#e8e2d9] text-xs font-bold text-[#003629] focus:outline-none focus:border-[#006a4e] cursor-pointer"
            >
              <option value="all">{isMr ? 'सर्व दुकाने (All Shops)' : 'All Businesses'}</option>
              {businesses.map((b) => (
                <option key={b.id} value={String(b.id)}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={String(selectedRatingFilter)}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedRatingFilter(val === 'all' ? 'all' : Number(val));
              }}
              className="p-2 rounded-xl bg-white border border-[#e8e2d9] text-xs font-bold text-[#003629] focus:outline-none focus:border-[#006a4e] cursor-pointer"
            >
              <option value="all">{isMr ? 'सर्व स्टार (All Ratings)' : 'All Stars'}</option>
              <option value="5">⭐⭐⭐⭐⭐ (५ स्टार)</option>
              <option value="4">⭐⭐⭐⭐ (४ स्टार)</option>
              <option value="3">⭐⭐⭐ (३ स्टार)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-2 rounded-xl bg-[#f9f3ea] border border-[#e8e2d9] text-xs font-bold text-[#55605a] focus:outline-none focus:border-[#006a4e] cursor-pointer"
            >
              <option value="recent">{isMr ? 'नवीनतम (Recent)' : 'Most Recent'}</option>
              <option value="highest">{isMr ? 'उच्च मानांकन (Highest)' : 'Highest Rated'}</option>
              <option value="lowest">{isMr ? 'कमी मानांकन (Lowest)' : 'Lowest Rated'}</option>
            </select>
          </div>
        </div>

        {/* Reviews Listing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#55605a] px-1">
            <span>
              {isMr ? `अभिप्राय निकाल: ${filteredReviews.length}` : `Showing ${filteredReviews.length} Reviews`}
            </span>
            {(selectedBusinessFilter !== 'all' || selectedRatingFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedBusinessFilter('all');
                  setSelectedRatingFilter('all');
                  setSearchQuery('');
                }}
                className="text-[#006a4e] hover:underline cursor-pointer"
              >
                {isMr ? 'फिल्टर काढा (Reset)' : 'Reset Filters'}
              </button>
            )}
          </div>

          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e8e2d9] p-12 text-center shadow-xs">
              <span className="material-symbols-outlined text-[48px] text-[#707974] mb-3 block">
                search_off
              </span>
              <h3 className="font-heading font-extrabold text-base text-[#1d1b16]">
                {isMr ? 'एकही अभिप्राय सापडला नाही' : 'No Reviews Found'}
              </h3>
              <p className="text-xs text-[#707974] mt-1 max-w-sm mx-auto">
                {isMr
                  ? 'तुम्ही शोधत असलेल्या निकषानुसार अभिप्राय उपलब्ध नाहीत. कृपया दुसरे शब्द किंवा फिल्टर वापरून पहा.'
                  : 'Try adjusting your search query or filters to find community reviews.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-5 border border-[#e8e2d9] hover:border-[#006a4e]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: User & Rating */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#003629] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-heading font-bold text-xs sm:text-sm text-[#1d1b16]">
                              {rev.userName}
                            </span>
                            {rev.verifiedCitizen && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#baeed9]/40 text-[#006a4e] text-[10px] font-bold">
                                <span className="material-symbols-outlined text-[11px]">verified</span>
                                <span>{isMr ? 'सत्यापित' : 'Verified'}</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#707974] block">
                            {rev.wardOrArea} • {rev.date}
                          </span>
                        </div>
                      </div>

                      {renderStars(rev.rating)}
                    </div>

                    {/* Target Business Tag */}
                    <div className="mb-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f9f3ea] text-[#003629] text-[11px] font-bold border border-[#e8e2d9]">
                        <span className="material-symbols-outlined text-[13px] text-[#a63b00]">storefront</span>
                        <span>{rev.businessName}</span>
                      </span>
                    </div>

                    {/* Review Body */}
                    <p className="text-xs sm:text-[13px] text-[#404945] leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 mt-3 border-t border-[#f3ede4] flex items-center justify-between text-[11px] text-[#707974]">
                    <span className="flex items-center gap-1 text-[#006a4e] font-semibold">
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                      <span>{isMr ? 'उपयुक्त अभिप्राय' : 'Helpful Review'}</span>
                    </span>

                    <button
                      onClick={() => {
                        if (rev.businessSlug && onSelectBusinessSlug) {
                          onSelectBusinessSlug(rev.businessSlug);
                        } else {
                          const found = businesses.find((b) => String(b.id) === String(rev.businessId));
                          if (found && onSelectBusiness) onSelectBusiness(found);
                        }
                      }}
                      className="text-[#003629] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{isMr ? 'दुकान पहा' : 'View Shop'}</span>
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#e8e2d9] shadow-xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#707974] hover:text-[#1d1b16] p-1 rounded-full hover:bg-[#f3ede4] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#006a4e] text-[24px]">rate_review</span>
              <div>
                <h3 className="font-heading font-extrabold text-[16px] text-[#003629]">
                  {isMr ? 'नवीन नागरी अभिप्राय नोंदवा' : 'Submit Citizen Review'}
                </h3>
                <span className="text-[11px] text-[#707974]">
                  {isMr ? 'आसगावच्या इतर गावकऱ्यांना तुमचा अनुभव सांगा' : 'Share your real experience with Asgaon community'}
                </span>
              </div>
            </div>

            {submitSuccess ? (
              <div className="p-6 text-center bg-[#baeed9]/20 rounded-xl border border-[#baeed9] my-4">
                <span className="material-symbols-outlined text-[#006a4e] text-[36px] mb-2 block">
                  check_circle
                </span>
                <strong className="text-sm text-[#003629] block">
                  {isMr ? 'अभिप्राय यशस्वीरीत्या नोंदवला गेला!' : 'Review Submitted Successfully!'}
                </strong>
                <p className="text-xs text-[#006a4e] mt-1">
                  {isMr ? 'तुमचा अभिप्राय मंचवर लगेच प्रसिद्ध झाला आहे.' : 'Thank you for helping our village community.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
                {/* Select Business */}
                <div>
                  <label className="font-bold text-[#003629] block mb-1">
                    {isMr ? 'दुकान किंवा व्यवसाय निवडा *' : 'Select Business *'}
                  </label>
                  <select
                    value={targetBizId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setTargetBizId(id);
                      const f = businesses.find((b) => String(b.id) === String(id));
                      if (f) setTargetBizName(f.name);
                    }}
                    required
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white font-semibold"
                  >
                    {businesses.map((b) => (
                      <option key={b.id} value={String(b.id)}>
                        {b.name}
                      </option>
                    ))}
                    {businesses.length === 0 && (
                      <option value="1">खडके किराणा आणि जनरल स्टोअर्स (Khadke Kirana)</option>
                    )}
                  </select>
                </div>

                {/* Rating Stars Picker */}
                <div>
                  <label className="font-bold text-[#003629] block mb-1">
                    {isMr ? 'मानांकन द्या (Star Rating) *' : 'Your Rating *'}
                  </label>
                  <div className="flex items-center gap-2 p-2 bg-[#f9f3ea] rounded-xl border border-[#e8e2d9]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className="cursor-pointer focus:outline-none p-1 hover:scale-110 transition-transform"
                      >
                        <span
                          className={`material-symbols-outlined text-[26px] ${
                            star <= formRating ? 'font-fill text-[#ef9f27]' : 'text-[#d6d0c4]'
                          }`}
                        >
                          star
                        </span>
                      </button>
                    ))}
                    <span className="ml-auto text-[11px] font-bold text-[#003629]">
                      {formRating === 5 && (isMr ? 'उत्कृष्ट (5 Star)' : 'Excellent')}
                      {formRating === 4 && (isMr ? 'खूप छान (4 Star)' : 'Very Good')}
                      {formRating === 3 && (isMr ? 'चांगले (3 Star)' : 'Average')}
                      {formRating === 2 && (isMr ? 'साधारण (2 Star)' : 'Fair')}
                      {formRating === 1 && (isMr ? 'असमाधानकारक (1 Star)' : 'Poor')}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="font-bold text-[#003629] block mb-1">
                    {isMr ? 'तुमचे पूर्ण नाव *' : 'Your Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={isMr ? 'उदा. रमेश पाटील / स्नेहा देशमुख' : 'e.g. Ramesh Patil'}
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                  />
                </div>

                {/* Ward */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#003629] block mb-1">
                      {isMr ? 'आसगाव वॉर्ड' : 'Ward / Area'}
                    </label>
                    <select
                      value={formWard}
                      onChange={(e) => setFormWard(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none bg-white"
                    >
                      <option value="वॉर्ड १ (आंबेडकर चौक)">वॉर्ड १ (आंबेडकर चौक)</option>
                      <option value="वॉर्ड २ (गावठाण)">वॉर्ड २ (गावठाण)</option>
                      <option value="वॉर्ड ३ (विठ्ठल मंदिर परिसर)">वॉर्ड ३ (विठ्ठल मंदिर)</option>
                      <option value="वॉर्ड ४ (दक्षिण शिवार)">वॉर्ड ४ (शिवार)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#003629] block mb-1">
                      {isMr ? 'मोबाईल नंबर (ऐच्छिक)' : 'Mobile (Optional)'}
                    </label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="सत्यापित चिन्हासाठी"
                      className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none"
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="font-bold text-[#003629] block mb-1">
                    {isMr ? 'तुमचा अभिप्राय / अनुभव लिहा *' : 'Your Detailed Review *'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder={
                      isMr
                        ? 'दुकानदाराचे बोलणे, वस्तूंची गुणवत्ता, वाजवी दर व सेवेबद्दल तुमचे मत लिहा...'
                        : 'Write about quality, pricing, behavior, and services...'
                    }
                    className="w-full p-2.5 rounded-lg border border-[#e8e2d9] focus:border-[#006a4e] outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f3ede4]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#f3ede4] text-[#1d1b16] font-bold hover:bg-[#e8e2d9] cursor-pointer"
                  >
                    {isMr ? 'रद्द करा' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white font-bold shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting
                      ? (isMr ? 'नोंदवत आहे...' : 'Saving...')
                      : (isMr ? 'अभिप्राय जतन करा' : 'Submit Review')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
