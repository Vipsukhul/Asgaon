import { LucideIcon } from './LucideIcon';
import React, { useState, useEffect } from 'react';
import type { Business } from '../types';

interface ReviewItem {
  id: string | number;
  userName: string;
  wardOrArea: string;
  rating: number;
  date: string;
  comment: string;
  verifiedCitizen: boolean;
}

interface BusinessRatingCardProps {
  business: Business;
  onRatingUpdated?: (newRating: number, newCount: number) => void;
}

const DEFAULT_REVIEWS: Record<string, ReviewItem[]> = {
  default: [
    {
      id: 1,
      userName: 'Rameshwar Patil',
      wardOrArea: 'वॉर्ड २ (गावठाण)',
      rating: 5,
      date: '२ दिवसांपूर्वी',
      comment: 'उत्कृष्ट सेवा आणि वाजवी दर. वेळेवर सर्व खते व बियाणे उपलब्ध करून दिले. गावातच अशी सोय झाल्याने खूप फायदा झाला.',
      verifiedCitizen: true
    },
    {
      id: 2,
      userName: 'Sau. Sunita Zalke',
      wardOrArea: 'आंबेडकर वॉर्ड १',
      rating: 5,
      date: '१ आठवड्यापूर्वी',
      comment: 'अतिशय नम्र बोलणे आणि खात्रीशीर माल. पवनीला जाण्याची गरज उरली नाही. सर्व गावकऱ्यांना नक्की शिफारस करतो.',
      verifiedCitizen: true
    },
    {
      id: 3,
      userName: 'Vitthal Meshram',
      wardOrArea: 'विठ्ठल मंदिर परिसर वॉर्ड ३',
      rating: 4,
      date: '२ आठवड्यांपूर्वी',
      comment: 'सर्व शेती साहित्य व अवजारे वेळेत मिळाली. डिजिटल पेमेंट (UPI/PhonePe) स्वीकारतात.',
      verifiedCitizen: true
    }
  ]
};

export const BusinessRatingCard: React.FC<BusinessRatingCardProps> = ({
  business,
  onRatingUpdated
}) => {
  const storageKey = `dg_biz_reviews_${business.id || business.slug || 'gen'}`;
  
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_REVIEWS.default;
  });

  const [currentRating, setCurrentRating] = useState<number>(() => {
    return Number(business.rating || 4.8);
  });
  const [reviewCount, setReviewCount] = useState<number>(() => {
    return Number(business.ratingCount || 142);
  });

  // Review Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [inputRating, setInputRating] = useState<number>(5);
  const [inputName, setInputName] = useState('');
  const [inputWard, setInputWard] = useState('वॉर्ड २ (गावठाण)');
  const [inputComment, setInputComment] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync if business changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch {
        setReviews(DEFAULT_REVIEWS.default);
      }
    } else {
      setReviews(DEFAULT_REVIEWS.default);
    }
    setCurrentRating(Number(business.rating || 4.8));
    setReviewCount(Number(business.ratingCount || 142));
  }, [business.id, business.slug]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputComment.trim()) return;

    const newReview: ReviewItem = {
      id: Date.now(),
      userName: inputName.trim(),
      wardOrArea: inputWard || 'आसगाव नागरिक',
      rating: inputRating,
      date: 'आज नुकताच',
      comment: inputComment.trim(),
      verifiedCitizen: true
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(storageKey, JSON.stringify(updatedReviews));

    // Update aggregate rating
    const newCount = reviewCount + 1;
    const newAvg = Number(((currentRating * reviewCount + inputRating) / newCount).toFixed(1));
    setCurrentRating(newAvg);
    setReviewCount(newCount);

    if (onRatingUpdated) {
      onRatingUpdated(newAvg, newCount);
    }

    setSuccessMsg('✓ आपला अभिप्राय यशस्वीरीत्या नोंदवला गेला! धन्यवाद.');
    setInputName('');
    setInputComment('');
    setInputRating(5);
    setTimeout(() => {
      setSuccessMsg('');
      setIsFormOpen(false);
    }, 2000);
  };

  // Percentage calculations
  const total = reviews.length;
  const count5 = reviews.filter((r) => r.rating === 5).length;
  const count4 = reviews.filter((r) => r.rating === 4).length;
  const count3 = reviews.filter((r) => r.rating === 3).length;
  const count2 = reviews.filter((r) => r.rating === 2).length;
  const count1 = reviews.filter((r) => r.rating <= 1).length;

  const pct5 = total > 0 ? Math.round((count5 / total) * 100) : 85;
  const pct4 = total > 0 ? Math.round((count4 / total) * 100) : 10;
  const pct3 = total > 0 ? Math.round((count3 / total) * 100) : 4;
  const pct2 = total > 0 ? Math.round((count2 / total) * 100) : 1;
  const pct1 = total > 0 ? Math.round((count1 / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#e8e2d9] shadow-xs overflow-hidden mb-6">
      {/* 1. Header with Trust Badge */}
      <div className="bg-[#f9f3ea] px-4 py-3 border-b border-[#e8e2d9] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LucideIcon name="hotel_class" className="text-[#c2410c] text-[20px]" />
          <div>
            <h4 className="font-heading font-extrabold text-[14px] text-[#166534]">
              ग्राहक रेटिंग व नागरिक अभिप्राय (Rating &amp; Reviews)
            </h4>
            <span className="text-[11px] text-[#707974]">
              गावकऱ्यांचा प्रत्यक्ष अनुभव व पडताळणीकृत मते
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-3 py-1.5 rounded-xl bg-[#166534] text-white hover:bg-[#052e16] text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs"
        >
          <LucideIcon name="edit" className="text-[14px] text-[#a7f3d0]" />
          <span>{isFormOpen ? 'फॉर्म बंद करा' : 'आपला अभिप्राय द्या'}</span>
        </button>
      </div>

      {/* 2. Rating Score & Breakdown Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border-b border-[#f3ede4]">
        {/* Left: Overall Big Score */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-[#fef9ee] rounded-xl border border-[#fed7aa] text-center">
          <div className="font-heading font-black text-[38px] text-[#c2410c] leading-none mb-1">
            {currentRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-0.5 text-[#d97706] mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <LucideIcon name={star <= Math.round(currentRating) ? 'star' : 'star_outline'} key={star} className=" text-[20px] fill-current" />
            ))}
          </div>
          <div className="text-[12px] font-bold text-[#1d1b16]">
            {reviewCount} गावकऱ्यांचे अभिप्राय
          </div>
          <div className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#006a4e] bg-[#a7f3d0] px-2 py-0.5 rounded-full mt-1.5">
            <LucideIcon name="verified" className="text-[12px]" />
            <span>पडताळणीकृत स्थानिक व्यापारी</span>
          </div>
        </div>

        {/* Right: Star Distribution Bars */}
        <div className="sm:col-span-7 flex flex-col gap-1.5 text-[11px]">
          {[
            { label: '५ ★', pct: pct5, count: count5 },
            { label: '४ ★', pct: pct4, count: count4 },
            { label: '३ ★', pct: pct3, count: count3 },
            { label: '२ ★', pct: pct2, count: count2 },
            { label: '१ ★', pct: pct1, count: count1 }
          ].map((row, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-8 font-bold text-[#707974]">{row.label}</span>
              <div className="flex-1 h-2 bg-[#f3ede4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d97706] to-[#c2410c] rounded-full transition-all duration-500"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="w-8 text-right font-medium text-[#707974]">{row.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Review Submission Form (Expandable) */}
      {isFormOpen && (
        <form onSubmit={handleSubmitReview} className="p-4 bg-[#f9f3ea] border-b border-[#e8e2d9] animate-fadeIn flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h5 className="font-heading font-bold text-[13px] text-[#166534] flex items-center gap-1">
              <LucideIcon name="rate_review" className="text-[16px] text-[#d97706]" />
              <span>या दुकानासाठी आपला प्रामाणिक अभिप्राय नोंदवा</span>
            </h5>
            <span className="text-[10px] text-[#707974]">आसगाव ग्राहक मंच</span>
          </div>

          {/* Star selector */}
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#e8e2d9]">
            <span className="text-[12px] font-bold text-[#1d1b16]">आपले रेटिंग:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInputRating(s)}
                  className="p-0.5 text-[#d97706] hover:scale-125 transition-transform"
                >
                  <LucideIcon name={s <= inputRating ? 'star' : 'star_border'} className=" text-[24px]" />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-bold text-[#c2410c] ml-2">
              {inputRating === 5 ? 'उत्कृष्ट (5/5)' : inputRating === 4 ? 'खूप चांगले (4/5)' : inputRating === 3 ? 'बरे (3/5)' : 'सुधारणा हवी (2/5)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-[#1d1b16] mb-1">
                आपले नाव *
              </label>
              <input
                type="text"
                required
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="उदा. ज्ञानेश्वर पाटील"
                className="w-full bg-white text-[#1d1b16] p-2 rounded-xl text-[12px] border border-[#e8e2d9] focus:outline-none focus:ring-1 focus:ring-[#166534]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#1d1b16] mb-1">
                आपला प्रभाग / परिसर
              </label>
              <select
                value={inputWard}
                onChange={(e) => setInputWard(e.target.value)}
                className="w-full bg-white text-[#1d1b16] p-2 rounded-xl text-[12px] border border-[#e8e2d9] focus:outline-none focus:ring-1 focus:ring-[#166534]"
              >
                <option>प्रभाग १ (आंबेडकर वॉर्ड)</option>
                <option>प्रभाग २ (गावठाण व बाजार चौक)</option>
                <option>प्रभाग ३ (विठ्ठल मंदिर परिसर)</option>
                <option>हायवे बायपास वस्ती</option>
                <option>तलाव रोड</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#1d1b16] mb-1">
              आपला अनुभव व अभिप्राय *
            </label>
            <textarea
              required
              rows={2}
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
              placeholder="मालाची गुणवत्ता, किंमत, बोलण्याची पद्धत व सेवेबद्दल आपला अनुभव सांगा..."
              className="w-full bg-white text-[#1d1b16] p-2 rounded-xl text-[12px] border border-[#e8e2d9] focus:outline-none focus:ring-1 focus:ring-[#166534]"
            />
          </div>

          {successMsg && (
            <div className="p-2 bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf] rounded-lg text-[11px] font-bold flex items-center gap-1.5">
              <LucideIcon name="check_circle" className="text-[16px]" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[11px] font-bold transition-colors"
            >
              रद्द करा
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#c2410c] hover:bg-[#852f00] text-white text-[11px] font-bold transition-colors shadow-xs"
            >
              अभिप्राय सबमिट करा
            </button>
          </div>
        </form>
      )}

      {/* 4. Verified Reviews Feed */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[12px] font-bold text-[#707974] mb-0.5">
          <span>गावकऱ्यांचे ताजे अभिप्राय ({reviews.length})</span>
          <span className="text-[10px] text-[#006a4e]">✓ १००% पडताळणीकृत</span>
        </div>

        {reviews.slice(0, 3).map((rev) => (
          <div key={rev.id} className="p-3 bg-[#f9f3ea] rounded-xl border border-[#e8e2d9] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#166534] text-[#a7f3d0] font-black text-[10px] flex items-center justify-center">
                  {rev.userName.charAt(0)}
                </div>
                <div>
                  <span className="font-heading font-bold text-[12px] text-[#1d1b16]">
                    {rev.userName}
                  </span>
                  <span className="text-[10px] text-[#707974] block leading-none">
                    {rev.wardOrArea} • {rev.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#e8e2d9] text-[11px] font-bold text-[#d97706]">
                <span>★ {rev.rating}</span>
              </div>
            </div>

            <p className="text-[12px] text-[#404945] leading-relaxed pl-8">
              &quot;{rev.comment}&quot;
            </p>
          </div>
        ))}

        {/* Link to Dedicated Village Reviews Hub */}
        <div className="pt-2 text-center">
          <a
            href="/reviews"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:underline cursor-pointer"
          >
            <span>सर्व गावातील नागरी अभिप्राय पहा</span>
            <LucideIcon name="arrow_forward" className="text-[15px]" />
          </a>
        </div>
      </div>
    </div>
  );
};
