import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, CheckCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface SchemeEligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchemeSlug?: (slug: string) => void;
}

export const SchemeEligibilityModal: React.FC<SchemeEligibilityModalProps> = ({
  isOpen,
  onClose,
  onSelectSchemeSlug
}) => {
  const { lang } = useLanguage();
  const isMr = lang === 'MR';

  const [category, setCategory] = useState<'woman' | 'farmer' | 'youth' | 'senior' | null>(null);
  const [income, setIncome] = useState<'low' | 'mid' | 'high' | null>(null);
  const [hasLand, setHasLand] = useState<'yes' | 'no' | null>(null);
  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  const handleReset = () => {
    setCategory(null);
    setIncome(null);
    setHasLand(null);
    setStep(1);
  };

  // Determine eligible schemes based on inputs
  const getEligibleSchemes = () => {
    const list: Array<{
      title: string;
      benefit: string;
      slug: string;
      badge: string;
      docs: string;
    }> = [];

    // Housing assistance for low income or kutcha house
    if (hasLand === 'yes' || hasLand === 'no' || income === 'low') {
      list.push({
        title: isMr ? 'प्रधानमंत्री / रमाई आवास घरकुल योजना' : 'Pradhan Mantri / Ramai Awas Yojana',
        benefit: isMr ? 'पक्के घर बांधकामासाठी ₹२.५ लाखांपर्यंत थेट अनुदान' : 'Up to ₹2.5 Lakhs grant for pucca house',
        slug: 'ramai-awas-gharkul-yojana',
        badge: isMr ? 'घरकुल अनुदान' : 'Housing Aid',
        docs: isMr ? 'जातीचा दाखला, उत्पन्नाचा दाखला, ग्रामपंचायत नमुना ८' : 'Caste Cert, Income Cert, Form 8'
      });
    }

    if (category === 'woman') {
      list.push({
        title: isMr ? 'मुख्यमंत्री माझी लाडकी बहीण योजना' : 'Majhi Ladki Bahin Yojana',
        benefit: isMr ? 'दरमहा ₹१,५०० थेट बँक खात्यात' : '₹1,500/month direct to bank',
        slug: 'mukhyamantri-ladki-bahin-yojana',
        badge: isMr ? 'महिला कल्याण' : 'Women Welfare',
        docs: isMr ? 'आधार कार्ड, बँक पासबुक, रेशन कार्ड' : 'Aadhaar, Bank Passbook, Ration Card'
      });
      list.push({
        title: isMr ? 'लेक लाडकी योजना' : 'Lek Ladki Yojana',
        benefit: isMr ? 'मुलीच्या जन्मापासून शिक्षणापर्यंत ₹१ लाख १ हजार' : 'Up to ₹1,01,000 for girl child education',
        slug: 'lek-ladki-yojana',
        badge: isMr ? 'मुलींचे शिक्षण' : 'Girl Child',
        docs: isMr ? 'जन्म दाखला, पिवळे/केशरी रेशन कार्ड' : 'Birth Certificate, Ration Card'
      });
    }

    if (category === 'farmer') {
      list.push({
        title: isMr ? 'नमो शेतकरी महासन्मान निधी' : 'Namo Shetkari Mahasanman Nidhi',
        benefit: isMr ? 'वार्षिक ₹६,००० (हप्त्यांमध्ये)' : '₹6,000/year in installments',
        slug: 'namo-shetkari-mahasanman-nidhi',
        badge: isMr ? 'शेतकरी थेट मदत' : 'Farmer Assistance',
        docs: isMr ? '७/१२, ८-अ उतारा, आधार लिंक बँक खाते' : '7/12 Extract, Aadhaar linked Bank'
      });
      list.push({
        title: isMr ? 'प्रधानमंत्री पीक विमा योजना (१ रुपयात)' : 'PM Fasal Bima (₹1 Scheme)',
        benefit: isMr ? 'नैसर्गिक आपत्तीत पिकांचे १००% विमा संरक्षण' : '100% crop insurance at just ₹1 premium',
        slug: 'pm-fasal-bima-yojana',
        badge: isMr ? 'पीक विमा' : 'Crop Insurance',
        docs: isMr ? 'पिक पेरा नोंदणी, बँक खाते, आधार' : 'Sowing Certificate, Aadhaar'
      });
    }

    if (category === 'youth') {
      list.push({
        title: isMr ? 'मुख्यमंत्री युवा कार्यप्रशिक्षण योजना' : 'CM Youth Apprenticeship Scheme',
        benefit: isMr ? 'दरमहा ₹६,००० ते ₹१०,००० विद्यावेतन' : 'Stipend ₹6,000 to ₹10,000/month',
        slug: 'yuva-karya-prashikshan-yojana',
        badge: isMr ? 'रोजगार व प्रशिक्षण' : 'Youth Training',
        docs: isMr ? '१०वी/१२वी/पदवी प्रमाणपत्र, आधार कार्ड' : 'Education Certificate, Aadhaar'
      });
    }

    if (category === 'senior') {
      list.push({
        title: isMr ? 'श्रावणबाळ सेवा राज्य निवृत्तीवेतन योजना' : 'Shravanbal Pension Scheme',
        benefit: isMr ? 'दरमहा ₹१,५०० वृद्धापकाळ पेन्शन' : '₹1,500/month senior citizen pension',
        slug: 'shravanbal-pension-yojana',
        badge: isMr ? 'ज्येष्ठ नागरिक' : 'Senior Citizens',
        docs: isMr ? 'वय दाखला (६५+ वर्षे), उत्पन्न दाखला' : 'Age Proof (65+), Income Certificate'
      });
    }

    // Common universal health scheme
    list.push({
      title: isMr ? 'महात्मा ज्योतिराव फुले जन आरोग्य योजना' : 'MJPJAY Free Health Treatment',
      benefit: isMr ? 'कुटुंबास ₹५ लाखांपर्यंत मोफत कॅशलेस उपचार' : 'Free treatment up to ₹5 Lakhs cashless',
      slug: 'mjpjay-ayushman-bharat-asgaon',
      badge: isMr ? 'मोफत आरोग्य' : 'Free Health',
      docs: isMr ? 'रेशन कार्ड (कोणतेही) व आधार कार्ड' : 'Ration Card & Aadhaar'
    });

    return list;
  };

  const eligibleSchemes = getEligibleSchemes();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-extrabold shadow-sm">
              <Sparkles className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[17px] sm:text-[19px] leading-tight">
                {isMr ? 'माझी योजना शोधक (३ सोपे प्रश्न)' : 'My Scheme Eligibility Finder'}
              </h3>
              <p className="text-[11px] text-emerald-200">
                {isMr ? 'तुमच्या पात्रतेनुसार शासनाच्या सर्व थेट लाभ योजना शोधा' : 'Discover all welfare schemes you qualify for in 3 steps'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {isMr ? 'पायरी १/३ : तुम्ही कोण आहात?' : 'Step 1/3: Who are you?'}
                </span>
                <span className="text-xs text-stone-500 font-semibold">१/३</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'woman', label: isMr ? 'महिला / बहीण 👩' : 'Woman / Mother 👩', desc: isMr ? 'लाडकी बहीण, लेक लाडकी' : 'Ladki Bahin, SHG' },
                  { id: 'farmer', label: isMr ? 'शेतकरी 🌾' : 'Farmer 🌾', desc: isMr ? 'पीएम किसान, नमो शेतकरी, पीक विमा' : 'PM Kisan, Crop Aid' },
                  { id: 'youth', label: isMr ? 'तरुण / विद्यार्थी 🎓' : 'Youth / Student 🎓', desc: isMr ? 'शिष्यवृत्ती, कार्यप्रशिक्षण' : 'Scholarships, Training' },
                  { id: 'senior', label: isMr ? 'ज्येष्ठ नागरिक 👴' : 'Senior Citizen 👴', desc: isMr ? 'श्रावणबाळ पेन्शन, आरोग्य' : 'Pensions, Health' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCategory(item.id as any);
                      setStep(2);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      category === item.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/30'
                        : 'border-stone-200 hover:border-emerald-500 hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="font-heading font-extrabold text-[14px] mb-1">{item.label}</div>
                    <div className="text-[11px] text-stone-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {isMr ? 'पायरी २/३ : कुटुंबाचे वार्षिक उत्पन्न?' : 'Step 2/3: Annual Family Income?'}
                </span>
                <span className="text-xs text-stone-500 font-semibold">२/३</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'low', label: isMr ? '₹२.५ लाखांपेक्षा कमी (पिवळे/केशरी रेशन कार्ड)' : 'Less than ₹2.5 Lakhs (BPL / Orange Card)' },
                  { id: 'mid', label: isMr ? '₹२.५ लाख ते ₹५ लाख (मध्यमवर्गीय)' : '₹2.5 Lakhs - ₹5 Lakhs (Middle Income)' },
                  { id: 'high', label: isMr ? '₹५ लाखांपेक्षा जास्त' : 'Above ₹5 Lakhs' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setIncome(item.id as any);
                      setStep(3);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left font-bold text-xs sm:text-[13px] transition-all cursor-pointer flex items-center justify-between ${
                      income === item.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                        : 'border-stone-200 hover:border-emerald-500 hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-800" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {isMr ? 'पायरी ३/३ : शेतजमीन किंवा घरकुल स्थिती?' : 'Step 3/3: Land or Housing Status?'}
                </span>
                <span className="text-xs text-stone-500 font-semibold">३/३</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'yes', label: isMr ? 'होय, गावात स्वतःची शेतजमीन किंवा कचे घर आहे' : 'Yes, have farm land or semi-pucca house' },
                  { id: 'no', label: isMr ? 'नाही, भूमिहीन शेतमजूर किंवा इतर व्यवसाय' : 'No land / Daily wage earner' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setHasLand(item.id as any);
                      setStep(4);
                    }}
                    className="w-full p-3.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-[13px] text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <CheckCircle className="w-4 h-4 text-emerald-800" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
                <div>
                  <div className="font-heading font-extrabold text-[15px]">
                    🎉 {isMr ? `अभिनंदन! तुमच्यासाठी ${eligibleSchemes.length} योजना सापडल्या:` : `Congratulations! Found ${eligibleSchemes.length} matching schemes:`}
                  </div>
                  <div className="text-[11px] text-emerald-800 mt-0.5">
                    {isMr ? 'खालील योजनांसाठी तुम्ही थेट अर्ज करू शकता किंवा सीएससी केंद्रात जाऊ शकता.' : 'You can apply online or visit your local CSC kiosk.'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-bold text-emerald-900 hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
                  title="पुन्हा तपासा"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isMr ? 'पुन्हा' : 'Reset'}</span>
                </button>
              </div>

              {/* Eligible schemes list */}
              <div className="space-y-3">
                {eligibleSchemes.map((scheme, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                          {scheme.badge}
                        </span>
                        <h4 className="font-heading font-extrabold text-[14px] text-stone-900">
                          {scheme.title}
                        </h4>
                      </div>

                      <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <span>💰 {scheme.benefit}</span>
                      </div>

                      <div className="text-[11px] text-stone-500">
                        📄 {isMr ? 'कागदपत्रे: ' : 'Docs: '}{scheme.docs}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onSelectSchemeSlug) {
                          onSelectSchemeSlug(scheme.slug);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>{isMr ? 'माहिती व अर्ज' : 'View & Apply'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="text-xs font-bold text-stone-600 hover:underline cursor-pointer"
            >
              ← {isMr ? 'मागील पायरी' : 'Back'}
            </button>
          ) : (
            <span className="text-[11px] text-stone-500">
              💡 {isMr ? 'आसगाव सीएससी केंद्रात मोफत अर्ज मदत उपलब्ध' : 'Free application assistance at Asgaon CSC'}
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-800 hover:bg-stone-100 cursor-pointer shadow-2xs"
          >
            {isMr ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
