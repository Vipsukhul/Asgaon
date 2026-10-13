import React, { useState, useEffect } from 'react';
import type { BlogPost } from '../data/blogData';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumb } from '../components/Breadcrumb';
import { MarkdownContent } from '../components/MarkdownContent';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

interface WriteBlogPageProps {
  onNavigateBack: () => void;
  onNavigateHome: () => void;
  onPublishSuccess: (slug: string) => void;
  currentUser?: {
    fullName: string;
    ward?: string;
    role?: string;
    isLoggedIn?: boolean;
  };
  onRequireLogin?: () => void;
}

const PRESET_COVERS = [
  { labelMr: 'शेती व कृषी (Farming)', labelEn: 'Farming & Agriculture', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80' },
  { labelMr: 'शासकीय योजना (Schemes)', labelEn: 'Govt Schemes & Subsidies', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80' },
  { labelMr: 'गाव व ग्रामपंचायत (Village)', labelEn: 'Village Life & Panchayat', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80' },
  { labelMr: 'शिक्षण व शाळा (Education)', labelEn: 'Education & Youth', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80' },
  { labelMr: 'वाहतूक व बस (Transport)', labelEn: 'Transport & Travel', url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80' },
  { labelMr: 'आरोग्य व पोषण (Health)', labelEn: 'Health & Nutrition', url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80' }
];

export const WriteBlogPage: React.FC<WriteBlogPageProps> = ({
  onNavigateBack,
  onNavigateHome,
  onPublishSuccess,
  currentUser,
  onRequireLogin
}) => {
  const { lang, t } = useLanguage();
  const isMr = lang === 'MR';
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Generate an authentic 8-character hash ID (like YouTube / Medium / Git commit short hash)
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

  // Auto-sync authenticated user details
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

  const handleInsertSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('blog-content-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || 'मजकूर';
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMarathi.trim() || !content.trim()) {
      alert(isMr ? 'कृपया लेखाचे शीर्षक व सविस्तर मजकूर पूर्ण भरा.' : 'Please fill in both the article title and content.');
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
      seoTitle: `${titleMarathi} | Asgaon Knowledge Studio`,
      seoDescription: excerptMarathi || content.substring(0, 150),
      seoKeywords: tags,
      likesCount: 1,
      commentsCount: 0,
      viewCount: 1
    };

    // Persist to PostgreSQL backend database
    try {
      const res = await api.createBlog({
        slug: newPost.slug,
        title: newPost.title,
        titleMarathi: newPost.titleMarathi,
        excerpt: newPost.excerpt,
        excerptMarathi: newPost.excerptMarathi,
        content: newPost.content,
        contentMarathi: newPost.contentMarathi,
        category: newPost.category,
        categoryMarathi: newPost.categoryMarathi,
        author: newPost.author,
        authorRole: newPost.authorRole,
        authorRoleMarathi: newPost.authorRoleMarathi,
        publishDate: newPost.publishDate,
        publishDateISO: newPost.publishDateISO,
        readTimeMinutes: newPost.readTimeMinutes,
        coverImage: newPost.coverImage,
        tags: tagsArr.join(', '),
        tagsMarathi: tagsArr.join(', '),
        seoTitle: newPost.seoTitle,
        seoDescription: newPost.seoDescription,
        seoKeywords: newPost.seoKeywords
      });
      if (res && res.slug) {
        newPost.id = res.id || newPost.id;
        newPost.slug = res.slug;
      }
    } catch (e: any) {
      console.warn('Backend blog create notice:', e.message);
    }

    // Save to local cache & notify
    const saved = localStorage.getItem('dg_village_blogs');
    let postsList: BlogPost[] = [];
    if (saved) {
      try {
        postsList = JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    const updated = [newPost, ...postsList];
    localStorage.setItem('dg_village_blogs', JSON.stringify(updated));
    window.dispatchEvent(new Event('dg_blogs_updated'));

    onPublishSuccess(newPost.slug);
  };

  const activeCover = customCover.trim() || coverImage;

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <SEOHead
        title={isMr ? "नवीन लेख लिहा (Write Blog) | Asgaon Knowledge Studio" : "Write Village Article | Asgaon Knowledge Studio"}
        description={
          isMr
            ? "आसगाव ग्रामस्थांसाठी स्वतःचा शेती अनुभव, शासकीय योजना मार्गदर्शन किंवा माहिती लेख प्रसिद्ध करण्याचे व्यासपीठ."
            : "Platform for Asgaon citizens to share agricultural insights, scheme guides, and community knowledge."
        }
        keywords="Write blog Asgaon, Village article writer Pauni, Asgaon Krishi advisory post, आसगाव लेख लेखन, शेती सल्ला ब्लॉग"
        canonicalUrl="https://asgaon.vercel.app/blogs/write"
        ogType="website"
        ogImage={activeCover || "https://res.cloudinary.com/dl5bq3ejh/image/upload/v1791660305/asgaon/seo/ccc45725-5d89-44b3-ac8c-a113f34f5df3.png"}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: isMr ? 'Asgaon Village Blog Studio | आसगाव माहिती लेख लेखन मंच' : 'Asgaon Citizen Knowledge Studio',
          description: isMr ? 'आसगाव नागरिकांसाठी लेख प्रसिद्ध करण्याचे डिजिटल पोर्टल.' : 'Digital knowledge portal for Asgaon community articles.',
          url: 'https://asgaon.vercel.app/blogs/write'
        }}
      />

      {/* 1. Breadcrumbs & Return Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: t('nav_home') || (isMr ? 'मुख्य पृष्ठ' : 'Home'), onClick: onNavigateHome },
            { label: isMr ? 'माहिती व ज्ञान केंद्र (ब्लॉग्स)' : 'Village Knowledge Hub & Blogs', onClick: onNavigateBack },
            { label: isMr ? 'नवीन लेख लिहा (Write Article)' : 'Write Article', active: true }
          ]}
        />

        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#e8e2d9] text-[#166534] font-bold text-xs hover:bg-[#f9f3ea] shadow-2xs transition-all shrink-0 self-end sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{isMr ? 'मागे जा (Back)' : 'Back'}</span>
        </button>
      </div>

      {/* 2. Top Banner with Tab Navigation */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e8e2d9] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#166534] text-[#bbf7d0] text-[10px] font-black uppercase">
              Blog Studio
            </span>
            <span className="text-xs text-[#707974] font-medium">Asgaon Citizen Publishing</span>
          </div>
          <h1 className="font-heading font-extrabold text-[22px] sm:text-[26px] text-[#166534] leading-tight">
            {isMr ? 'नवीन माहिती लेख तयार करा' : 'Create Knowledge Article'}
          </h1>
          <p className="text-xs sm:text-[13px] text-[#404945] mt-1 max-w-xl">
            {isMr
              ? 'तुमचा शेती सल्ला, शासकीय योजनेचा अनुभव किंवा गावासाठी उपयुक्त माहिती लिहा. लेख प्रसिद्ध होताच तो गावकर्‍यांसाठी उपलब्ध होईल.'
              : 'Share farming tips, scheme experiences, or useful village insights. Once published, your article will be live for all citizens.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-2xl bg-[#f4efe8] p-1.5 border border-[#e8e2d9] shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'editor'
                ? 'bg-[#166534] text-[#bbf7d0] shadow-xs'
                : 'text-[#555] hover:text-[#166534]'
              }`}
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>{isMr ? 'लेखन (Editor)' : 'Editor'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'preview'
                ? 'bg-[#166534] text-[#bbf7d0] shadow-xs'
                : 'text-[#555] hover:text-[#166534]'
              }`}
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>{isMr ? 'थेट प्रिव्ह्यू' : 'Live Preview'}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Body based on Tab */}
      {activeTab === 'editor' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-6">
          {/* Authenticated user indicator */}
          {currentUser?.isLoggedIn ? (
            <div className="p-3.5 bg-[#e6f7f0] rounded-2xl border border-[#b8ebd5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#166534] text-[#bbf7d0] flex items-center justify-center font-bold text-sm shadow-2xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#166534] flex items-center gap-1.5">
                    <span>{currentUser.fullName}</span>
                    <span className="material-symbols-outlined text-[16px] text-[#006a4e]">verified</span>
                  </div>
                  <div className="text-[11px] text-[#006a4e]">
                    {isMr
                      ? `अधिकृत नागरिक खाते (${currentUser.ward || currentUser.role || 'आसगाव'}) • लेखक म्हणून जोडले जाईल`
                      : `Verified Citizen Account (${currentUser.ward || currentUser.role || 'Asgaon'}) • Connected as author`}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#bbf7d0] text-[#002117] hidden sm:inline">
                {isMr ? 'सत्यापित लेखक' : 'Verified Author'}
              </span>
            </div>
          ) : (
            <div className="p-4 bg-[#fef9ee] rounded-2xl border border-[#ffeed4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#c2410c]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">info</span>
                <span>
                  {isMr
                    ? 'तुम्ही सध्या अतिथी म्हणून लेख तयार करत आहात. अधिकृत ओळखीसाठी कृपया लॉगिन करा.'
                    : 'You are currently drafting as a guest. Please sign in to link your verified citizen profile.'}
                </span>
              </div>
              {onRequireLogin && (
                <button
                  type="button"
                  onClick={onRequireLogin}
                  className="px-3.5 py-1.5 rounded-xl bg-[#166534] text-[#bbf7d0] font-bold text-xs shrink-0"
                >
                  {isMr ? 'लॉगिन करा' : 'Sign In'}
                </button>
              )}
            </div>
          )}

          {/* Marathi Title */}
          <div>
            <label className="block font-bold text-[#166534] text-sm mb-1.5">
              {isMr ? 'लेखाचे मराठी शीर्षक (Marathi Title) *' : 'Marathi Title (लेखाचे शीर्षक) *'}
            </label>
            <input
              type="text"
              required
              value={titleMarathi}
              onChange={(e) => setTitleMarathi(e.target.value)}
              placeholder={isMr ? 'उदा. कापूस वेचणी व भाव: आसगाव शेतकऱ्यांचा प्रत्यक्ष अनुभव' : 'उदा. कापूस वेचणी व भाव: आसगाव शेतकऱ्यांचा प्रत्यक्ष अनुभव'}
              className="w-full p-3.5 rounded-2xl border border-[#e8e2d9] focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 outline-none font-bold text-[15px]"
            />
          </div>

          {/* English Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#2d312e] text-xs mb-1.5">
                {isMr ? 'इंग्रजी शीर्षक / शोध कीवर्ड्स (English Title / Search Keywords)' : 'English Title / Search Keywords'}
              </label>
              <input
                type="text"
                value={titleEng}
                onChange={(e) => setTitleEng(e.target.value)}
                placeholder="e.g. Asgaon Cotton Harvest and Market Update"
                className="w-full p-3 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2d312e] text-xs mb-1.5">
                {isMr ? 'विभाग (Category) *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none font-bold text-xs bg-white"
              >
                <option value="General">{isMr ? 'सामान्य / इतर (General)' : 'General / Other'}</option>
                <option value="Agriculture">{isMr ? 'कृषी व शेती (Agriculture)' : 'Agriculture & Farming'}</option>
                <option value="Schemes">{isMr ? 'शासकीय योजना (Govt Schemes)' : 'Government Schemes'}</option>
                <option value="Governance">{isMr ? 'प्रशासन व गाव सेवा (Governance)' : 'Governance & Civic Services'}</option>
                <option value="Education">{isMr ? 'शिक्षण व युवक (Education)' : 'Education & Youth'}</option>
                <option value="Health">{isMr ? 'आरोग्य व पोषण (Health)' : 'Health & Nutrition'}</option>
              </select>
            </div>
          </div>

          {/* Author Name and Role (if not logged in) */}
          {!currentUser?.isLoggedIn && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#2d312e] text-xs mb-1.5">
                  {isMr ? 'लेखकाचे नाव (Author Name) *' : 'Author Name *'}
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
                <label className="block font-bold text-[#2d312e] text-xs mb-1.5">
                  {isMr ? 'हुद्दा किंवा प्रभाग (Role / Ward)' : 'Role / Ward in Asgaon'}
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
            <label className="block font-bold text-[#2d312e] text-xs mb-2">
              {isMr ? 'कव्हर फोटो निवडा (Cover Photo)' : 'Select Cover Photo'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mb-2.5">
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
                  <img src={preset.url} alt={isMr ? preset.labelMr : preset.labelEn} className="w-full h-12 object-cover rounded-lg mb-1" />
                  <span className="text-[10px] font-bold text-[#555] block truncate">
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
              className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none text-xs"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block font-bold text-[#2d312e] text-xs mb-1.5">
              {isMr
                ? 'थोडक्यात सारांश (Short Excerpt - Meta Description साठी वापरला जाईल) *'
                : 'Short Excerpt (Used for search & card previews) *'}
            </label>
            <textarea
              rows={2}
              required
              value={excerptMarathi}
              onChange={(e) => setExcerptMarathi(e.target.value)}
              placeholder={isMr ? 'लेखाचा २ ओळींत थोडक्यात सारांश द्या...' : 'Provide a concise 2-sentence summary...'}
              className="w-full p-3 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Markdown Formatting Toolbar & Full Article Content */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="font-bold text-[#2d312e] text-xs">
                {isMr ? 'सविस्तर मजकूर (Full Article Content) *' : 'Full Article Content (Markdown) *'}
              </label>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 bg-[#f4efe8] p-1 rounded-xl border border-[#e8e2d9]">
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('### ')}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-white hover:bg-stone-100 text-[#166534] border border-[#e8e2d9]"
                  title={isMr ? 'मथळा (Heading)' : 'Heading'}
                >
                  {isMr ? 'H3 मथळा' : 'H3 Heading'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('**', '**')}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-white hover:bg-stone-100 text-[#166534] border border-[#e8e2d9]"
                  title={isMr ? 'ठळक (Bold)' : 'Bold'}
                >
                  <strong>B</strong> {isMr ? 'ठळक' : 'Bold'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('- ')}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-white hover:bg-stone-100 text-[#166534] border border-[#e8e2d9]"
                  title={isMr ? 'मुद्दे / यादी (Bullet List)' : 'Bullet List'}
                >
                  • {isMr ? 'यादी' : 'Bullet'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('1. ')}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-white hover:bg-stone-100 text-[#166534] border border-[#e8e2d9]"
                  title={isMr ? 'क्रमांक (Numbered List)' : 'Numbered List'}
                >
                  1. {isMr ? 'क्रमांक' : 'Number'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('> ')}
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-white hover:bg-stone-100 text-[#c2410c] border border-[#e8e2d9]"
                  title={isMr ? 'सूचना बॉक्स (Quote Box)' : 'Quote Box'}
                >
                  " {isMr ? 'सूचना' : 'Quote'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('`', '`')}
                  className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white hover:bg-stone-100 text-[#166534] border border-[#e8e2d9]"
                  title={isMr ? 'कोड (Code)' : 'Code'}
                >
                  `{isMr ? 'कोड' : 'code'}`
                </button>
              </div>
            </div>

            <textarea
              id="blog-content-textarea"
              rows={12}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isMr
                  ? 'तुमचा सविस्तर लेख येथे लिहा. आसगावमधील शेतकरी व नागरिकांना उपयोगी पडेल असा प्रत्यक्ष अनुभव, माहिती किंवा उपाय सविस्तरपणे मांडा...'
                  : 'Write your detailed article here in Markdown. Share helpful experiences, advisories, or information for fellow citizens...'
              }
              className="w-full p-4 rounded-2xl border border-[#e8e2d9] focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 outline-none text-xs sm:text-sm leading-relaxed font-sans"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-[#2d312e] text-xs mb-1.5">
              {isMr ? 'टॅग्ज / कीवर्ड्स (Tags - स्वल्पविरामाने वेगळे करा)' : 'Tags / Keywords (Comma-separated)'}
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={isMr ? 'उदा. कापूस, आसगाव, भाव, शेती, पीक सल्ला' : 'e.g. Cotton, Asgaon, Mandi, Agriculture, Farming'}
              className="w-full p-2.5 rounded-xl border border-[#e8e2d9] focus:border-[#166534] outline-none text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#f0eee8] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="px-4 py-2.5 rounded-xl bg-[#f4efe8] hover:bg-[#eae2d7] text-[#166534] text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>{isMr ? 'प्रिव्ह्यू पहा (Preview)' : 'Preview'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onNavigateBack}
                className="px-4 py-2.5 rounded-xl border border-[#e8e2d9] text-[#707974] hover:bg-stone-50 text-xs font-bold transition-colors"
              >
                {isMr ? 'रद्द करा (Cancel)' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#166534] hover:bg-[#052e16] text-[#bbf7d0] text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">publish</span>
                <span>{isMr ? 'लेख प्रसिद्ध करा (Publish Article)' : 'Publish Article'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 4. Live Article Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#e6f7f0] border border-[#b8ebd5] rounded-2xl flex items-center justify-between text-xs text-[#006a4e] font-medium">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>
                {isMr
                  ? 'हा तुमच्या लेखाचा थेट प्रिव्ह्यू आहे. लेख प्रसिद्ध झाल्यानंतर तो वाचकांना असा दिसेल.'
                  : 'This is a live preview of how your article will appear once published.'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('editor')}
              className="px-3 py-1 rounded-lg bg-[#166534] text-[#bbf7d0] font-bold text-xs"
            >
              {isMr ? 'संपादनात परत जा' : 'Back to Editor'}
            </button>
          </div>

          {/* Article Header Preview */}
          <header className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#166534] text-[#bbf7d0] text-[11px] font-bold uppercase">
                {category}
              </span>
              <span className="text-[#707974]">
                {isMr ? 'आज' : 'Today'} • {Math.max(2, Math.round(content.length / 500))} {isMr ? 'मि. वाचन' : 'min read'}
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-[22px] sm:text-[28px] text-[#166534] leading-tight">
              {titleMarathi || (isMr ? 'लेखाचे मराठी शीर्षक येथे दिसेल' : 'Article Title Preview')}
            </h2>

            {titleEng && (
              <p className="font-heading font-semibold text-sm text-[#c2410c]">{titleEng}</p>
            )}

            {excerptMarathi && (
              <div className="bg-[#fef9ee] border-l-4 border-[#c2410c] p-4 rounded-r-xl text-xs sm:text-sm text-[#7a2b00] font-medium">
                {excerptMarathi}
              </div>
            )}

            {/* Author */}
            <div className="flex items-center gap-3 p-3 bg-[#fcfaf7] rounded-xl border border-[#e8e2d9]">
              <div className="w-10 h-10 rounded-xl bg-[#166534] text-[#bbf7d0] flex items-center justify-center font-bold text-sm">
                {(authorName || 'अ').charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-[#1d1b16] flex items-center gap-1">
                  <span>{authorName || (isMr ? 'आसगाव ग्रामस्थ' : 'Asgaon Citizen')}</span>
                  <span className="material-symbols-outlined text-[15px] text-[#006a4e]">verified</span>
                </div>
                <div className="text-[11px] text-[#707974]">
                  {authorRole || (isMr ? 'स्थानिक नागरिक' : 'Local Resident')}
                </div>
              </div>
            </div>

            {/* Cover Image Preview */}
            <div className="rounded-2xl overflow-hidden border border-[#e8e2d9] h-48 sm:h-60 max-h-[260px] w-full bg-stone-100">
              <img src={activeCover} alt="Cover Preview" className="w-full h-full object-cover" />
            </div>
          </header>

          {/* Article Content Preview */}
          <main className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e8e2d9] shadow-xs">
            {content.trim() ? (
              <MarkdownContent content={content} />
            ) : (
              <p className="text-xs text-[#707974] italic text-center py-8">
                {isMr
                  ? 'अद्याप कोणताही मजकूर लिहिलेला नाही. संपादकामध्ये जाऊन लेख टाईप करा.'
                  : 'No content written yet. Switch to the Editor tab to compose your article.'}
              </p>
            )}
          </main>
        </div>
      )}
    </div>
  );
};
