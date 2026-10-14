import { LucideIcon } from '../components/LucideIcon';
import React, { useState, useEffect } from 'react';
import { type BlogPost, slugifyTitle } from '../data/blogData';
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

  // Form states - Simple Hashnode-style clean writer
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('Agriculture');
  const [tags, setTags] = useState('आसगाव, शेती, माहिती');
  const [content, setContent] = useState('');

  // Author details
  const [authorName, setAuthorName] = useState(currentUser?.fullName || (isMr ? 'आसगाव ग्रामस्थ' : 'Asgaon Resident'));
  const [authorRole, setAuthorRole] = useState(
    currentUser?.ward
      ? (isMr ? `प्रभाग ${currentUser.ward} नागरिक` : `Ward ${currentUser.ward} Citizen`)
      : (currentUser?.role || (isMr ? 'स्थानिक शेतकरी व नागरिक' : 'Local Resident'))
  );

  // Auto-sync slug from title under the hood
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setSlug(slugifyTitle(newTitle));
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploadingCover(true);
    setUploadError('');
    try {
      const url = await api.uploadImage(file, 'blogs');
      if (url) {
        setCoverImageUrl(url);
        return;
      }
      throw new Error('Upload returned empty');
    } catch {
      // Graceful fallback to FileReader DataURL
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

  // Auto-sync authenticated user details
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

  const handleInsertSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('blog-content-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || (isMr ? 'मजकूर' : 'text');
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
    if (!title.trim() || !content.trim()) {
      alert(isMr ? 'कृपया लेखाचे शीर्षक व सविस्तर मजकूर पूर्ण भरा.' : 'Please enter both an article title and content.');
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
      excerpt: subtitle.trim() || content.substring(0, 140) + '...',
      excerptMarathi: subtitle.trim() || content.substring(0, 140) + '...',
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
      seoTitle: `${title.trim()} | Asgaon Knowledge Studio`,
      seoDescription: subtitle.trim() || content.substring(0, 150),
      seoKeywords: tags,
      likesCount: 1,
      commentsCount: 0,
      viewCount: 1
    };

    // Persist to backend database
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
        newPost.slug = res.slug;
        newPost.id = res.id || res.slug;
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
    const updated = [newPost, ...postsList.filter((p) => (p.slug || p.id) !== newPost.slug)];
    localStorage.setItem('dg_village_blogs', JSON.stringify(updated));
    window.dispatchEvent(new Event('dg_blogs_updated'));

    onPublishSuccess(newPost.slug);
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans max-w-5xl mx-auto pb-16">
      <SEOHead
        title={isMr ? "नवीन लेख लिहा | आसगाव ब्लॉग्स" : "Write Article | Asgaon Blogs"}
        description={
          isMr
            ? "आसगाव ग्रामस्थांसाठी स्वतःचा शेती अनुभव, शासकीय योजना मार्गदर्शन किंवा माहिती लेख प्रसिद्ध करण्याचे साधे व्यासपीठ."
            : "Clean, simple blogging platform for Asgaon citizens to share agricultural insights and knowledge."
        }
        keywords="Write blog Asgaon, Village article writer Pauni, Asgaon Krishi advisory post, आसगाव लेख लेखन"
        canonicalUrl="https://asgaon.digital/blogs/write"
        ogType="website"
      />

      {/* 1. Header with Breadcrumb and Hashnode-style Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Breadcrumb
          items={[
            { label: t('nav_home'), onClick: onNavigateHome },
            { label: t('nav_blogs'), onClick: onNavigateBack },
            { label: isMr ? 'नवीन लेख' : 'New Article', active: true }
          ]}
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Write / Preview Tab Switcher */}
          <div className="inline-flex rounded-xl bg-stone-200/70 p-1 border border-stone-300/80">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LucideIcon name="edit" className="text-[14px]" />
              <span>{isMr ? 'लेखन' : 'Write'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LucideIcon name="visibility" className="text-[14px]" />
              <span>{isMr ? 'प्रिव्ह्यू' : 'Preview'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#14532d] text-emerald-100 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
          >
            <LucideIcon name="publish" className="text-[16px]" />
            <span>{isMr ? 'प्रसिद्ध करा' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Guest notice if not logged in */}
      {!currentUser?.isLoggedIn && (
        <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <LucideIcon name="info" className="text-[18px] text-amber-700 shrink-0" />
            <span>
              {isMr
                ? 'तुम्ही अतिथी म्हणून लेख लिहीत आहात. अधिकृत लेखक बॅजसाठी कृपया लॉगिन करा.'
                : 'Writing as guest. Sign in to link your verified citizen author profile.'}
            </span>
          </div>
          {onRequireLogin && (
            <button
              type="button"
              onClick={onRequireLogin}
              className="px-3 py-1 rounded-lg bg-emerald-800 text-emerald-100 font-bold text-xs shrink-0 self-end sm:self-auto"
            >
              {isMr ? 'लॉगिन करा' : 'Sign In'}
            </button>
          )}
        </div>
      )}

      {/* 2. Main Editor Canvas (Hashnode-inspired clean layout) */}
      {activeTab === 'editor' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-7">
          
          {/* Cover Photo Header: Device Upload & Camera capture (No external URLs / Unsplash links) */}
          <div>
            {coverImageUrl ? (
              <div className="relative group rounded-2xl overflow-hidden border border-stone-200 max-h-72 w-full bg-stone-100 mb-2 shadow-xs">
                <img
                  src={coverImageUrl}
                  alt="Cover Preview"
                  className="w-full h-56 sm:h-72 object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-stone-950/80 backdrop-blur-xs p-1.5 rounded-xl shadow-lg">
                  <label className="cursor-pointer px-2.5 py-1 text-xs font-bold text-white hover:text-emerald-300 transition-colors flex items-center gap-1">
                    <LucideIcon name="upload" className="text-[14px]" />
                    <span>{isMr ? 'डिव्हाइस' : 'Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                  </label>
                  <label className="cursor-pointer px-2.5 py-1 text-xs font-bold text-white hover:text-emerald-300 transition-colors flex items-center gap-1">
                    <LucideIcon name="camera" className="text-[14px]" />
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
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl('')}
                    className="px-2.5 py-1 text-xs font-bold text-red-300 hover:text-red-100 transition-colors flex items-center gap-1 ml-1 pl-2 border-l border-white/20"
                  >
                    <LucideIcon name="close" className="text-[14px]" />
                    <span>{isMr ? 'काढा' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-stone-300 hover:border-emerald-700 text-stone-700 hover:text-emerald-800 text-xs font-bold transition-all bg-stone-50/70 hover:bg-emerald-50/50 shadow-2xs">
                    <LucideIcon name="upload" className="text-[16px] text-emerald-700" />
                    <span>{isMr ? 'डिव्हाइसवरून कव्हर फोटो जोडा' : 'Upload Cover from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                  </label>

                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-stone-300 hover:border-emerald-700 text-stone-700 hover:text-emerald-800 text-xs font-bold transition-all bg-stone-50/70 hover:bg-emerald-50/50 shadow-2xs">
                    <LucideIcon name="camera" className="text-[16px] text-emerald-700" />
                    <span>{isMr ? 'कॅमेऱ्याने फोटो काढा' : 'Take Photo (Camera)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCoverFileUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                  </label>

                  {uploadingCover && (
                    <span className="text-xs text-emerald-800 font-bold flex items-center gap-1.5 animate-pulse ml-1">
                      <LucideIcon name="refresh" className="animate-spin text-[14px]" />
                      {isMr ? 'फोटो अपलोड होत आहे...' : 'Uploading cover...'}
                    </span>
                  )}
                </div>
                {uploadError && (
                  <p className="text-xs text-red-600 font-medium">{uploadError}</p>
                )}
              </div>
            )}
          </div>

          {/* Clean Distraction-Free Article Title (No slug input/preview client-side) */}
          <div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={isMr ? 'लेखाचे शीर्षक येथे लिहा...' : 'Article Title...'}
              className="w-full text-2xl sm:text-4xl font-extrabold text-stone-900 placeholder:text-stone-300 border-none outline-none bg-transparent font-heading tracking-tight"
            />
          </div>

          {/* Subtitle / Excerpt */}
          <div>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder={isMr ? 'थोडक्यात उपशीर्षक किंवा सारांश (पर्यायी)...' : 'Write a subtitle or brief excerpt (optional)...'}
              className="w-full text-sm sm:text-base text-stone-600 placeholder:text-stone-300 border-none outline-none bg-transparent font-medium"
            />
          </div>

          <hr className="border-stone-100" />

          {/* Category & Tags Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">
                {isMr ? 'विभाग / कॅटेगरी *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:border-emerald-700 outline-none text-xs font-bold text-stone-800"
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
              <label className="block text-xs font-bold text-stone-600 mb-1.5">
                {isMr ? 'टॅग्ज (स्वल्पविरामाने वेगळे करा)' : 'Tags (Comma-separated)'}
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={isMr ? 'उदा. कापूस, आसगाव, भाव, शेती' : 'e.g. Cotton, Asgaon, Mandi, Agriculture'}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:border-emerald-700 outline-none text-xs text-stone-800"
              />
            </div>
          </div>

          {/* Author Name (if not logged in) */}
          {!currentUser?.isLoggedIn && (
            <div className="pt-1">
              <label className="block text-xs font-bold text-stone-600 mb-1.5">
                {isMr ? 'लेखकाचे नाव *' : 'Author Name *'}
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={isMr ? 'उदा. रमेश देशमुख' : 'e.g. Ramesh Deshmukh'}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:border-emerald-700 outline-none text-xs text-stone-800"
              />
            </div>
          )}

          {/* Hashnode-style Markdown Formatting Toolbar */}
          <div className="space-y-2 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-stone-700">
                {isMr ? 'मजकूर (Markdown)' : 'Article Content (Markdown)'}
              </label>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('## ')}
                  className="px-2 py-1 rounded text-xs font-bold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('### ')}
                  className="px-2 py-1 rounded text-xs font-bold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200"
                  title="Heading 3"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('**', '**')}
                  className="px-2 py-1 rounded text-xs font-bold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200"
                  title="Bold"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('*', '*')}
                  className="px-2 py-1 rounded text-xs font-bold italic bg-white hover:bg-stone-50 text-stone-700 border border-stone-200"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('- ')}
                  className="px-2 py-1 rounded text-xs font-bold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200"
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('1. ')}
                  className="px-2 py-1 rounded text-xs font-bold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200"
                  title="Numbered List"
                >
                  1. List
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('> ')}
                  className="px-2 py-1 rounded text-xs font-bold bg-white hover:bg-stone-50 text-amber-700 border border-stone-200"
                  title="Quote Box"
                >
                  " Quote
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSyntax('`', '`')}
                  className="px-2 py-1 rounded text-xs font-mono font-bold bg-white hover:bg-stone-50 text-emerald-800 border border-stone-200"
                  title="Inline Code"
                >
                  `Code`
                </button>
              </div>
            </div>

            <textarea
              id="blog-content-textarea"
              rows={14}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isMr
                  ? 'तुमचा सविस्तर लेख येथे लिहा. आसगावमधील शेतकरी व नागरिकांना उपयोगी पडेल असा प्रत्यक्ष अनुभव, माहिती किंवा उपाय सविस्तरपणे मांडा...\n\n### मुख्य मुद्दे\n- पहिला मुद्दा\n- दुसरा मुद्दा\n\n> महत्त्वाची सूचना येथे लिहू शकता.'
                  : 'Write your article here using Markdown...\n\n### Main Points\n- Point 1\n- Point 2\n\n> Important quote or callout.'
              }
              className="w-full p-4 rounded-2xl border border-stone-200 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 outline-none text-sm leading-relaxed font-sans text-stone-800 placeholder:text-stone-300 min-h-[320px]"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LucideIcon name="visibility" className="text-[16px]" />
              <span>{isMr ? 'प्रिव्ह्यू पहा' : 'Preview'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onNavigateBack}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold transition-colors"
              >
                {isMr ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-emerald-100 text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <LucideIcon name="publish" className="text-[18px]" />
                <span>{isMr ? 'प्रसिद्ध करा' : 'Publish'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 3. Live Article Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
         
          <article className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
            {/* Cover image in preview */}
            {coverImageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-80 w-full bg-stone-100">
                <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-800 text-emerald-100 text-[11px] font-bold">
                  {category}
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-stone-900 leading-tight">
                {title || (isMr ? 'लेखाचे शीर्षक येथे दिसेल' : 'Article Title Preview')}
              </h1>

              {subtitle && (
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* Author badge */}
              <div className="flex items-center gap-3 pt-2 text-xs text-stone-600">
                <div className="w-9 h-9 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold">
                  {(authorName || 'A').charAt(0)}
                </div>
                <div className="font-bold text-stone-900">{authorName}</div>
              </div>
            </div>

            <hr className="border-stone-100" />

            {/* Markdown content preview */}
            <div>
              {content.trim() ? (
                <MarkdownContent content={content} />
              ) : (
                <p className="text-xs text-stone-400 italic py-10 text-center">
                  {isMr ? 'अद्याप कोणताही मजकूर नाही.' : 'No content written yet.'}
                </p>
              )}
            </div>
          </article>
        </div>
      )}
    </div>
  );
};
