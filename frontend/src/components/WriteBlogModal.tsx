import { LucideIcon } from './LucideIcon';
import React, { useState, useEffect } from 'react';
import type { BlogPost } from '../data/blogData';
import { useLanguage } from '../context/LanguageContext';

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
  { labelMr: 'शेती व कृषी', labelEn: 'Farming & Agriculture', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80' },
  { labelMr: 'शासकीय योजना', labelEn: 'Govt Schemes & Subsidies', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80' },
  { labelMr: 'गाव व ग्रामपंचायत', labelEn: 'Village Life & Panchayat', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80' },
  { labelMr: 'शिक्षण व शाळा', labelEn: 'Education & Youth', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80' },
  { labelMr: 'वाहतूक व बस', labelEn: 'Transport & Travel', url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80' },
  { labelMr: 'आरोग्य व पोषण', labelEn: 'Health & Nutrition', url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80' }
];

export const WriteBlogModal: React.FC<WriteBlogModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  currentUser
}) => {
  const { lang } = useLanguage();
  const isMr = lang === 'MR';

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
  const [authorName, setAuthorName] = useState(currentUser?.fullName || (isMr ? 'आसगाव ग्रामस्थ' : 'Asgaon Citizen'));
  const [authorRole, setAuthorRole] = useState(
    currentUser?.ward ? (isMr ? `प्रभाग ${currentUser.ward} नागरिक` : `Ward ${currentUser.ward} Citizen`) : (currentUser?.role || (isMr ? 'स्थानिक शेतकरी व नागरिक' : 'Local Resident'))
  );
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [customCover, setCustomCover] = useState('');
  const [excerptMarathi, setExcerptMarathi] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(isMr ? 'आसगाव, शेती, माहिती' : 'Asgaon, Agriculture, Village');

  // Update author details if currentUser changes
  useEffect(() => {
    if (currentUser?.fullName) {
      setAuthorName(currentUser.fullName);
    }
    if (currentUser?.ward) {
      setAuthorRole(isMr ? `प्रभाग ${currentUser.ward} नागरिक` : `Ward ${currentUser.ward} Citizen`);
    } else if (currentUser?.role) {
      setAuthorRole(currentUser.role);
    }
  }, [currentUser, isMr]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMarathi.trim() || !content.trim()) {
      alert(isMr ? 'कृपया लेखाचे शीर्षक व सविस्तर मजकूर पूर्ण भरा.' : 'Please fill in both the title and content.');
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
      authorRole: authorRole || (isMr ? 'आसगाव ग्रामस्थ' : 'Asgaon Citizen'),
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
        <div className="bg-[#166534] text-white px-6 py-4 flex items-center justify-between border-b border-[#052e16]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#a7f3d0] text-[#166534] flex items-center justify-center font-bold">
              <LucideIcon name="edit_note" className="text-[20px]" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[16px] text-white">
                {isMr ? 'नवीन माहिती लेख प्रसिद्ध करा' : 'Publish Community Knowledge Article'}
              </h3>
              <p className="text-[11px] text-[#a7f3d0]">
                {isMr
                  ? 'गावातील शेतकरी व नागरिकांच्या माहितीसाठी स्वतःचा अनुभव, पीक सल्ला किंवा मार्गदर्शन लिहा.'
                  : 'Share farming tips, scheme guidance, or village updates with fellow residents.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
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
                <LucideIcon name="verified_user" className="text-[#006a4e] text-[20px]" />
                <div>
                  <div className="text-xs font-bold text-[#166534]">
                    {isMr ? `प्रसिद्ध करणारे: ${currentUser.fullName}` : `Publishing as: ${currentUser.fullName}`}
                  </div>
                  <div className="text-[11px] text-[#006a4e]">
                    {isMr
                      ? `अधिकृत नागरिक खाते (${currentUser.ward || currentUser.role || 'आसगाव'})`
                      : `Verified Citizen Account (${currentUser.ward || currentUser.role || 'Asgaon'})`}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]">
                {isMr ? 'सत्यापित लेखक' : 'Verified Author'}
              </span>
            </div>
          ) : (
            <div className="p-3 bg-[#fef9ee] rounded-xl border border-[#ffeed4] flex items-center gap-2 text-xs text-[#c2410c]">
              <LucideIcon name="info" className="text-[18px]" />
              <span>
                {isMr
                  ? 'तुम्ही अतिथी म्हणून लेख लिहीत आहात. कृपया खाली तुमचे नाव व प्रभाग अचूक भरा.'
                  : 'Drafting as guest. Please enter your name and ward accurately below.'}
              </span>
            </div>
          )}

          {/* Marathi Title */}
          <div>
            <label className="block font-bold text-[#166534] mb-1">
              {isMr ? 'लेखाचे मराठी शीर्षक  *' : 'Marathi Title (लेखाचे शीर्षक) *'}
            </label>
            <input
              type="text"
              required
              value={titleMarathi}
              onChange={(e) => setTitleMarathi(e.target.value)}
              placeholder={isMr ? 'उदा. कापूस वेचणी व भाव: आसगाव शेतकऱ्यांचा प्रत्यक्ष अनुभव' : 'उदा. कापूस वेचणी व भाव: आसगाव शेतकऱ्यांचा प्रत्यक्ष अनुभव'}
              className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#166534] focus:ring-1 focus:ring-[#166534] outline-none font-bold text-[14px]"
            />
          </div>

          {/* English / Alternative Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2d312e] mb-1">
                {isMr ? 'इंग्रजी शीर्षक ' : 'English Title / Search Keywords'}
              </label>
              <input
                type="text"
                value={titleEng}
                onChange={(e) => setTitleEng(e.target.value)}
                placeholder="e.g. Asgaon Cotton Harvest and Market Update"
                className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2d312e] mb-1">
                {isMr ? 'विभाग  *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none font-bold text-xs"
              >
                <option value="General">{isMr ? 'सामान्य / इतर ' : 'General / Other'}</option>
                <option value="Agriculture">{isMr ? 'कृषी व शेती ' : 'Agriculture & Farming'}</option>
                <option value="Schemes">{isMr ? 'शासकीय योजना ' : 'Government Schemes'}</option>
                <option value="Governance">{isMr ? 'प्रशासन व गाव सेवा ' : 'Governance & Civic Services'}</option>
                <option value="Education">{isMr ? 'शिक्षण व युवक ' : 'Education & Youth'}</option>
                <option value="Health">{isMr ? 'आरोग्य व पोषण' : 'Health & Nutrition'}</option>
              </select>
            </div>
          </div>

          {/* Simple Clean ID-Based URL Badge */}
          <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-[#166534] flex items-center gap-1">
                <LucideIcon name="link" className="text-[15px] text-[#006a4e]" />
                <span>{isMr ? 'लेखाची कायमस्वरूपी वेब लिंक :' : 'Direct Permalink (Short ID):'}</span>
              </div>
              <div className="text-xs font-mono font-bold text-[#166534]">
                https://asgaon.digital/blogs/<span className="text-[#c2410c]">{postId}</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#006a4e] bg-[#e6f7f0] px-2.5 py-1 rounded-full border border-[#b8ebd5]">
              {isMr ? '✓ युनिक आयडी लिंक' : '✓ Unique ID Link'}
            </span>
          </div>

          {/* Author Name and Role (if not logged in) */}
          {!currentUser?.isLoggedIn && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#2d312e] mb-1">
                  {isMr ? 'लेखकाचे नाव  *' : 'Author Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={isMr ? 'उदा. रमेश देशमुख' : 'e.g. Ramesh Deshmukh'}
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2d312e] mb-1">
                  {isMr ? 'हुद्दा किंवा प्रभाग ' : 'Role / Ward in Asgaon'}
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder={isMr ? 'उदा. शेतकरी, प्रभाग क्र. २' : 'e.g. Farmer, Ward No. 2'}
                  className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none text-xs"
                />
              </div>
            </div>
          )}

          {/* Cover Photo Selection */}
          <div>
            <label className="block font-bold text-[#2d312e] mb-1.5">
              {isMr ? 'कव्हर फोटो निवडा ' : 'Select Cover Image'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {PRESET_COVERS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCoverImage(preset.url);
                    setCustomCover('');
                  }}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all p-1 text-center ${coverImage === preset.url && !customCover
                      ? 'border-[#166534] ring-2 ring-[#166534]/20'
                      : 'border-[#e8e2d9] hover:border-stone-400'
                    }`}
                >
                  <img src={preset.url} alt={isMr ? preset.labelMr : preset.labelEn} className="w-full h-10 object-cover rounded-lg mb-1" />
                  <span className="text-[9px] font-bold text-[#555] block truncate">
                    {isMr ? preset.labelMr : preset.labelEn}
                  </span>
                </div>
              ))}
            </div>

            <input
              type="url"
              value={customCover}
              onChange={(e) => setCustomCover(e.target.value)}
              placeholder={isMr ? 'किंवा स्वतःचा फोटो URL टाका (उदा. https://...)' : 'Or enter custom photo URL (e.g. https://...)'}
              className="w-full p-2 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none text-xs"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block font-bold text-[#2d312e] mb-1">
              {isMr ? 'थोडक्यात सारांश  *' : 'Short Excerpt *'}
            </label>
            <textarea
              rows={2}
              required
              value={excerptMarathi}
              onChange={(e) => setExcerptMarathi(e.target.value)}
              placeholder={isMr ? 'लेखाचा २ ओळींत थोडक्यात सारांश द्या...' : 'Provide a 2-line summary...'}
              className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Full Article Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#2d312e]">
                {isMr ? 'सविस्तर मजकूर  *' : 'Full Article Content (Markdown) *'}
              </label>
              <span className="text-[10px] text-[#707974]">
                {isMr ? 'मथळा:' : 'Heading:'} <code className="bg-stone-100 px-1 py-0.5 rounded">### H3</code> | {isMr ? 'यादी:' : 'List:'} <code className="bg-stone-100 px-1 py-0.5 rounded">- item</code>
              </span>
            </div>
            <textarea
              rows={7}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isMr
                  ? 'तुमचा सविस्तर लेख येथे लिहा. आसगावमधील ग्रामस्थ व शेतकऱ्यांना उपयुक्त ठरेल असा प्रत्यक्ष अनुभव, माहिती किंवा उपाय सविस्तरपणे मांडा...'
                  : 'Write your full article here. Share practical tips, experiences, or knowledge for fellow villagers...'
              }
              className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none text-xs leading-relaxed font-sans"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-[#2d312e] mb-1">
              {isMr ? 'टॅग्ज (Tags - स्वल्पविरामाने वेगळे करा)' : 'Tags (Comma-separated)'}
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={isMr ? 'उदा. कापूस, आसगाव, भाव, शेती' : 'e.g. Cotton, Asgaon, Mandi, Agriculture'}
              className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none text-xs"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-[#f0eee8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e8e2d9] text-[#707974] hover:bg-stone-50 text-xs font-bold transition-colors cursor-pointer"
            >
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#166534] hover:bg-[#052e16] text-[#a7f3d0] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <LucideIcon name="publish" className="text-[18px]" />
              <span>{isMr ? 'लेख प्रसिद्ध करा' : 'Publish Article'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
