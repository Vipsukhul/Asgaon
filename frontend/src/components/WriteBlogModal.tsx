import React, { useState, useEffect } from 'react';
import type { BlogPost } from '../data/blogData';

interface WriteBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newPost: BlogPost) => void;
  currentUser?: {
    fullName: string;
    ward?: string;
    role?: string;
    isLoggedIn?: boolean;
  };
}

const PRESET_COVERS = [
  { label: 'शेती व कृषी (Farming)', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80' },
  { label: 'शासकीय योजना (Schemes)', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80' },
  { label: 'गाव व ग्रामपंचायत (Village)', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'शिक्षण व शाळा (Education)', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'वाहतूक व बस (Transport)', url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'आरोग्य व पोषण (Health)', url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80' }
];

export const WriteBlogModal: React.FC<WriteBlogModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  currentUser
}) => {
  const [postId] = useState(() => {
    const hex = 'abcdef0123456789';
    let hash = '';
    for (let i = 0; i < 8; i++) {
      hash += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return hash;
  });
  const [titleMarathi, setTitleMarathi] = useState('');
  const [titleEng, setTitleEng] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('Agriculture');
  const [authorName, setAuthorName] = useState(currentUser?.fullName || 'आसगाव ग्रामस्थ');
  const [authorRole, setAuthorRole] = useState(
    currentUser?.ward ? `प्रभाग ${currentUser.ward} नागरिक` : (currentUser?.role || 'स्थानिक शेतकरी व नागरिक')
  );
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [customCover, setCustomCover] = useState('');
  const [excerptMarathi, setExcerptMarathi] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('आसगाव, शेती, माहिती');

  // Update author details if currentUser changes
  useEffect(() => {
    if (currentUser?.fullName) {
      setAuthorName(currentUser.fullName);
    }
    if (currentUser?.ward) {
      setAuthorRole(`प्रभाग ${currentUser.ward} नागरिक`);
    } else if (currentUser?.role) {
      setAuthorRole(currentUser.role);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMarathi.trim() || !content.trim()) {
      alert('कृपया लेखाचे शीर्षक व सविस्तर मजकूर पूर्ण भरा.');
      return;
    }

    const categoryMap: Record<string, string> = {
      General: 'सामान्य / इतर',
      Schemes: 'शासकीय योजना',
      Agriculture: 'कृषी व शेती',
      Governance: 'प्रशासन व सेवा',
      Education: 'शिक्षण व करिअर',
      Health: 'आरोग्य व पोषण'
    };

    const tagsArr = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const now = new Date();
    const marathiMonths = [
      'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
      'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
    ];

    const activeCover = customCover.trim() || coverImage;

    const newPost: BlogPost = {
      id: postId,
      slug: postId,
      title: titleEng || titleMarathi,
      titleMarathi,
      excerpt: excerptMarathi || content.substring(0, 140) + '...',
      excerptMarathi: excerptMarathi || content.substring(0, 140) + '...',
      content,
      contentMarathi: content,
      category,
      categoryMarathi: categoryMap[category] || 'माहिती',
      author: currentUser?.fullName || authorName,
      authorRole: authorRole || 'आसगाव ग्रामस्थ',
      authorRoleMarathi: authorRole || 'आसगाव ग्रामस्थ',
      publishDate: `${now.getDate()} ${marathiMonths[now.getMonth()]} ${now.getFullYear()}`,
      publishDateISO: now.toISOString().split('T')[0],
      readTimeMinutes: Math.max(2, Math.round(content.length / 500)),
      coverImage: activeCover,
      tags: tagsArr,
      tagsMarathi: tagsArr,
      seoTitle: `${titleMarathi} | Asgaon Village Blog`,
      seoDescription: excerptMarathi || content.substring(0, 150),
      seoKeywords: tags,
      likesCount: 1,
      commentsCount: 0,
      viewCount: 1
    };

    onPublish(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#e8e2d9] overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#003629] text-white px-6 py-4 flex items-center justify-between border-b border-[#00261d]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#baeed9] text-[#003629] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[16px] text-white">
                नवीन माहिती लेख प्रसिद्ध करा (Publish Village Blog)
              </h3>
              <p className="text-[11px] text-[#baeed9]">
                गावातील शेतकरी व नागरिकांच्या माहितीसाठी स्वतःचा अनुभव, पीक सल्ला किंवा मार्गदर्शन लिहा.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-[13px]">
          {/* Authenticated Author Badge */}
          {currentUser?.isLoggedIn ? (
            <div className="p-3 bg-[#e6f7f0] rounded-xl border border-[#b8ebd5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#006a4e] text-[20px]">verified_user</span>
                <div>
                  <div className="text-xs font-bold text-[#003629]">
                    प्रसिद्ध करणारे: {currentUser.fullName}
                  </div>
                  <div className="text-[11px] text-[#006a4e]">
                    अधिकृत नागरिक खाते ({currentUser.ward || currentUser.role || 'आसगाव'})
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#baeed9] text-[#002117]">
                सत्यापित लेखक
              </span>
            </div>
          ) : (
            <div className="p-3 bg-[#fff8f0] rounded-xl border border-[#ffeed4] flex items-center gap-2 text-xs text-[#a63b00]">
              <span className="material-symbols-outlined text-[18px]">info</span>
              <span>तुम्ही अतिथी म्हणून लेख लिहीत आहात. कृपया खाली तुमचे नाव व प्रभाग अचूक भरा.</span>
            </div>
          )}

          {/* Marathi Title */}
          <div>
            <label className="block font-bold text-[#003629] mb-1">
              लेखाचे मराठी शीर्षक (Marathi Title) *
            </label>
            <input
              type="text"
              required
              value={titleMarathi}
              onChange={(e) => setTitleMarathi(e.target.value)}
              placeholder="उदा. कापूस वेचणी व भाव: आसगाव शेतकऱ्यांचा प्रत्यक्ष अनुभव"
              className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#003629] focus:ring-1 focus:ring-[#003629] outline-none font-bold text-[14px]"
            />
          </div>

          {/* English / Alternative Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2d312e] mb-1">
                इंग्रजी शीर्षक (English Title / Search Keywords)
              </label>
              <input
                type="text"
                value={titleEng}
                onChange={(e) => setTitleEng(e.target.value)}
                placeholder="उदा. Asgaon Cotton Harvest and Market Update"
                className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#003629] outline-none text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2d312e] mb-1">विभाग (Category) *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#003629] outline-none font-bold text-xs"
              >
                <option value="General">सामान्य / इतर (General)</option>
                <option value="Agriculture">कृषी व शेती (Agriculture)</option>
                <option value="Schemes">शासकीय योजना (Govt Schemes)</option>
                <option value="Governance">प्रशासन व गाव सेवा (Governance)</option>
                <option value="Education">शिक्षण व युवक (Education)</option>
                <option value="Health">आरोग्य व पोषण (Health)</option>
              </select>
            </div>
          </div>

          {/* Simple Clean ID-Based URL Badge */}
          <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-[#003629] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#006a4e]">link</span>
                <span>लेखाची कायमस्वरूपी वेब लिंक (Direct Post Link):</span>
              </div>
              <div className="text-xs font-mono font-bold text-[#003629]">
                https://asgaon.digital/blogs/<span className="text-[#a63b00]">{postId}</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#006a4e] bg-[#e6f7f0] px-2.5 py-1 rounded-full border border-[#b8ebd5]">
              ✓ युनिक आयडी लिंक
            </span>
          </div>

          {/* Author Name and Role (if not logged in) */}
          {!currentUser?.isLoggedIn && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#2d312e] mb-1">लेखकाचे नाव (Author Name) *</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="उदा. रमेश देशमुख"
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#003629] outline-none text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2d312e] mb-1">हुद्दा किंवा प्रभाग (Role / Ward)</label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="उदा. शेतकरी, प्रभाग क्र. २"
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#003629] outline-none text-xs"
                />
              </div>
            </div>
          )}

          {/* Cover Photo Selection */}
          <div>
            <label className="block font-bold text-[#2d312e] mb-1.5">कव्हर फोटो निवडा (Cover Image)</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {PRESET_COVERS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCoverImage(preset.url);
                    setCustomCover('');
                  }}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all p-1 text-center ${coverImage === preset.url && !customCover
                      ? 'border-[#003629] ring-2 ring-[#003629]/20'
                      : 'border-[#e8e2d9] hover:border-stone-400'
                    }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-10 object-cover rounded-lg mb-1" />
                  <span className="text-[9px] font-bold text-[#555] block truncate">{preset.label}</span>
                </div>
              ))}
            </div>

            <input
              type="url"
              value={customCover}
              onChange={(e) => setCustomCover(e.target.value)}
              placeholder="किंवा स्वतःचा फोटो URL टाका (उदा. https://...)"
              className="w-full p-2 rounded-xl border border-[#e8e2d9] focus:border-[#003629] outline-none text-xs"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block font-bold text-[#2d312e] mb-1">थोडक्यात सारांश (Short Excerpt) *</label>
            <textarea
              rows={2}
              required
              value={excerptMarathi}
              onChange={(e) => setExcerptMarathi(e.target.value)}
              placeholder="लेखाचा २ ओळींत थोडक्यात सारांश द्या..."
              className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#003629] outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Full Article Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#2d312e]">सविस्तर मजकूर (Full Article Content) *</label>
              <span className="text-[10px] text-[#707974]">
                मथळा: <code className="bg-stone-100 px-1 py-0.5 rounded">### मथळा</code> | यादी: <code className="bg-stone-100 px-1 py-0.5 rounded">- मुद्दा</code>
              </span>
            </div>
            <textarea
              rows={7}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="तुमचा सविस्तर लेख येथे लिहा. आसगावमधील ग्रामस्थ व शेतकऱ्यांना उपयुक्त ठरेल असा प्रत्यक्ष अनुभव, माहिती किंवा उपाय सविस्तरपणे मांडा..."
              className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#003629] outline-none text-xs leading-relaxed font-sans"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-[#2d312e] mb-1">टॅग्ज (Tags - स्वल्पविरामाने वेगळे करा)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="उदा. कापूस, आसगाव, भाव, शेती"
              className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#003629] outline-none text-xs"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-[#f0eee8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e8e2d9] text-[#707974] hover:bg-stone-50 text-xs font-bold transition-colors"
            >
              रद्द करा (Cancel)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#003629] hover:bg-[#00261d] text-[#baeed9] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>लेख प्रसिद्ध करा (Publish Post)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
