import { LucideIcon } from './LucideIcon';
import React, { useState, useEffect } from 'react';
import { type BlogPost, slugifyTitle } from '../data/blogData';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

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

export const WriteBlogModal: React.FC<WriteBlogModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  currentUser
}) => {
  const { lang } = useLanguage();
  const isMr = lang === 'MR';

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('Agriculture');
  const [authorName, setAuthorName] = useState(currentUser?.fullName || (isMr ? 'आसगाव ग्रामस्थ' : 'Asgaon Citizen'));
  const [authorRole, setAuthorRole] = useState(
    currentUser?.ward
      ? (isMr ? `प्रभाग ${currentUser.ward} नागरिक` : `Ward ${currentUser.ward} Citizen`)
      : (currentUser?.role || (isMr ? 'स्थानिक शेतकरी व नागरिक' : 'Local Resident'))
  );
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(isMr ? 'आसगाव, शेती, माहिती' : 'Asgaon, Agriculture, Village');

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setSlug(slugifyTitle(newTitle));
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploadingCover(true);
    try {
      const url = await api.uploadImage(file, 'blogs');
      if (url) {
        setCoverImageUrl(url);
        return;
      }
      throw new Error('Upload returned empty');
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingCover(false);
    }
  };

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
    if (!title.trim() || !content.trim()) {
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

    const finalSlug = slugifyTitle(slug || title) || 'untitled-post';
    const tagsArr = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const now = new Date();
    const marathiMonths = [
      'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
      'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
    ];

    const fallbackCover = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80';

    const newPost: BlogPost = {
      id: finalSlug,
      slug: finalSlug,
      title: title.trim(),
      titleMarathi: title.trim(),
      excerpt: excerpt.trim() || content.substring(0, 140) + '...',
      excerptMarathi: excerpt.trim() || content.substring(0, 140) + '...',
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
      coverImage: coverImageUrl.trim() || fallbackCover,
      tags: tagsArr,
      tagsMarathi: tagsArr,
      seoTitle: `${title.trim()} | Asgaon Village Blog`,
      seoDescription: excerpt.trim() || content.substring(0, 150),
      seoKeywords: tags,
      likesCount: 1,
      commentsCount: 0,
      viewCount: 1
    };

    onPublish(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#166534] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <LucideIcon name="edit_note" className="text-[20px]" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[16px] text-white">
                {isMr ? 'नवीन माहिती लेख प्रसिद्ध करा' : 'Publish Knowledge Article'}
              </h3>
              <p className="text-[11px] text-emerald-200">
                {isMr
                  ? 'गावातील शेतकरी व नागरिकांसाठी स्वतःचा अनुभव, पीक सल्ला किंवा माहिती लिहा.'
                  : 'Share farming tips, scheme guidance, or village updates.'}
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
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LucideIcon name="verified_user" className="text-emerald-700 text-[20px]" />
                <div>
                  <div className="text-xs font-bold text-emerald-950">
                    {isMr ? `प्रसिद्ध करणारे: ${currentUser.fullName}` : `Publishing as: ${currentUser.fullName}`}
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    {isMr
                      ? `अधिकृत नागरिक खाते (${currentUser.ward || currentUser.role || 'आसगाव'})`
                      : `Verified Citizen Account (${currentUser.ward || currentUser.role || 'Asgaon'})`}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-emerald-900 border border-emerald-300">
                {isMr ? 'सत्यापित लेखक' : 'Verified Author'}
              </span>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-900">
              <LucideIcon name="info" className="text-[18px] text-amber-700" />
              <span>
                {isMr
                  ? 'तुम्ही अतिथी म्हणून लेख लिहीत आहात. कृपया खाली तुमचे नाव अचूक भरा.'
                  : 'Drafting as guest. Please enter your name accurately below.'}
              </span>
            </div>
          )}

          {/* Article Title */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">
              {isMr ? 'लेखाचे शीर्षक *' : 'Article Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={isMr ? 'उदा. कापूस वेचणी व भाव: आसगाव शेतकऱ्यांचा प्रत्यक्ष अनुभव' : 'e.g. Asgaon Cotton Harvest and Market Update'}
              className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-emerald-700 outline-none font-bold text-[14px]"
            />
          </div>

          {/* Category & Cover Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {isMr ? 'विभाग *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-emerald-700 outline-none font-bold text-xs bg-white"
              >
                <option value="Agriculture">{isMr ? 'कृषी व शेती' : 'Agriculture & Farming'}</option>
                <option value="Schemes">{isMr ? 'शासकीय योजना' : 'Government Schemes'}</option>
                <option value="Governance">{isMr ? 'प्रशासन व गाव सेवा' : 'Governance & Civic Services'}</option>
                <option value="Education">{isMr ? 'शिक्षण व युवक' : 'Education & Youth'}</option>
                <option value="Health">{isMr ? 'आरोग्य व पोषण' : 'Health & Nutrition'}</option>
                <option value="General">{isMr ? 'सामान्य / इतर' : 'General / Other'}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {isMr ? 'कव्हर फोटो (पर्यायी)' : 'Cover Image (Optional)'}
              </label>
              {coverImageUrl ? (
                <div className="rounded-xl overflow-hidden border border-stone-200 h-10 flex items-center justify-between px-2 bg-stone-50">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img src={coverImageUrl} alt="Cover" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                    <span className="text-[11px] text-emerald-800 font-bold truncate">
                      {isMr ? 'फोटो जोडला आहे' : 'Photo Attached'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl('')}
                    className="text-stone-400 hover:text-red-600 p-1"
                    title={isMr ? 'काढून टाका' : 'Remove'}
                  >
                    <LucideIcon name="close" className="text-[14px]" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border border-dashed border-stone-300 hover:border-emerald-700 text-stone-700 hover:text-emerald-800 text-xs font-bold transition-all bg-stone-50 hover:bg-emerald-50/50">
                    <LucideIcon name="upload" className="text-[14px] text-emerald-700" />
                    <span>{isMr ? 'डिव्हाइस' : 'Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                  </label>
                  <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border border-dashed border-stone-300 hover:border-emerald-700 text-stone-700 hover:text-emerald-800 text-xs font-bold transition-all bg-stone-50 hover:bg-emerald-50/50">
                    <LucideIcon name="camera" className="text-[14px] text-emerald-700" />
                    <span>{isMr ? 'कॅमेरा' : 'Camera'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCoverFileUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
              {uploadingCover && (
                <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 mt-1 animate-pulse">
                  <LucideIcon name="refresh" className="animate-spin text-[12px]" />
                  {isMr ? 'फोटो अपलोड होत आहे...' : 'Uploading...'}
                </span>
              )}
            </div>
          </div>

          {/* Author Name (if not logged in) */}
          {!currentUser?.isLoggedIn && (
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {isMr ? 'लेखकाचे नाव *' : 'Author Name *'}
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={isMr ? 'उदा. रमेश देशमुख' : 'e.g. Ramesh Deshmukh'}
                className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-emerald-700 outline-none text-xs"
              />
            </div>
          )}

          {/* Excerpt */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              {isMr ? 'थोडक्यात सारांश (पर्यायी)' : 'Short Excerpt (Optional)'}
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder={isMr ? 'लेखाचा १-२ ओळींत थोडक्यात सारांश द्या...' : 'Provide a 1-line summary...'}
              className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-emerald-700 outline-none text-xs"
            />
          </div>

          {/* Full Article Content */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              {isMr ? 'सविस्तर मजकूर (Markdown) *' : 'Full Article Content (Markdown) *'}
            </label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isMr
                  ? 'तुमचा सविस्तर लेख येथे लिहा. प्रत्यक्ष अनुभव, माहिती किंवा शेती सल्ला सविस्तरपणे मांडा...\n\n### मुख्य मुद्दे\n- पहिला मुद्दा\n- दुसरा मुद्दा'
                  : 'Write your detailed article here in Markdown...\n\n### Key Highlights\n- Point 1\n- Point 2'
              }
              className="w-full p-3 rounded-xl border border-stone-200 focus:border-emerald-700 outline-none text-xs leading-relaxed font-sans"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              {isMr ? 'टॅग्ज (स्वल्पविरामाने वेगळे करा)' : 'Tags (Comma-separated)'}
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={isMr ? 'उदा. कापूस, आसगाव, भाव, शेती' : 'e.g. Cotton, Asgaon, Mandi, Agriculture'}
              className="w-full p-2.5 rounded-xl border border-stone-200 focus:border-emerald-700 outline-none text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold text-xs"
            >
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#14532d] text-emerald-100 font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <LucideIcon name="publish" className="text-[16px]" />
              <span>{isMr ? 'प्रसिद्ध करा' : 'Publish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
