import { LucideIcon } from '../components/LucideIcon';
import React, { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';
import { INITIAL_BLOG_POSTS, type BlogPost } from '../data/blogData';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumb } from '../components/Breadcrumb';
import { WriteBlogModal } from '../components/WriteBlogModal';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface BlogsPageProps {
  onSelectBlogSlug: (slug: string) => void;
  onNavigateHome: () => void;
  onNavigateToWriteBlog?: () => void;
  currentUser?: {
    fullName: string;
    ward?: string;
    role?: string;
    isLoggedIn?: boolean;
  };
  onRequireLogin?: () => void;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({
  onSelectBlogSlug,
  onNavigateHome,
  onNavigateToWriteBlog,
  currentUser,
  onRequireLogin
}) => {
  const { lang, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('dg_village_blogs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map((p: BlogPost) => {
            if (p.id === 'c7f9e2b1' && p.slug === 'c7f9e2b1') {
              return { ...p, slug: 'how-to-write-and-publish-community-blogs' };
            }
            return p;
          });
          const existingIds = new Set(normalized.map((p: BlogPost) => (p.slug || p.id).toLowerCase()));
          const missing = INITIAL_BLOG_POSTS.filter((p) => !existingIds.has((p.slug || p.id).toLowerCase()) && !existingIds.has(p.id.toLowerCase()));
          return [...missing, ...normalized];
        }
      } catch {
        /* ignore */
      }
    }
    return INITIAL_BLOG_POSTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'views'>('latest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [writeModalOpen, setWriteModalOpen] = useState(false);

  // Sync when Admin or User publishes new blog or on mount from API
  useEffect(() => {
    const fetchBlogs = () => {
      api.getBlogs()
        .then((res: any) => {
          const list = res?.data || (Array.isArray(res) ? res : []);
          if (list && list.length > 0) {
            const mapped: BlogPost[] = list.map((b: any) => ({
              id: b.id,
              slug: b.slug,
              title: b.title,
              titleMarathi: b.titleMarathi || b.title_marathi || b.title,
              excerpt: b.excerpt || '',
              excerptMarathi: b.excerptMarathi || b.excerpt_marathi || b.excerpt || '',
              content: b.content || '',
              contentMarathi: b.contentMarathi || b.content_marathi || b.content || '',
              category: b.category || 'General',
              categoryMarathi: b.categoryMarathi || b.category_marathi || 'सामान्य / इतर',
              author: b.author || (lang === 'MR' ? 'आसगाव ग्रामस्थ' : 'Asgaon Resident'),
              authorRole: b.authorRole || b.author_role || 'Contributor',
              authorRoleMarathi: b.authorRoleMarathi || b.author_role_marathi || 'स्थानिक नागरिक',
              publishDate: b.publishDate || b.publish_date || (lang === 'MR' ? 'ऑक्टोबर २०२६' : 'October 2026'),
              publishDateISO: b.publishDateISO || b.publish_date_iso || new Date().toISOString(),
              readTimeMinutes: b.readTimeMinutes || b.read_time_minutes || 3,
              coverImage: b.coverImage || b.cover_image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
              tags: typeof b.tags === 'string' ? b.tags.split(',').map((t: string) => t.trim()) : (b.tags || []),
              tagsMarathi: typeof b.tagsMarathi === 'string' ? b.tagsMarathi.split(',').map((t: string) => t.trim()) : (b.tagsMarathi || []),
              seoTitle: b.seoTitle || b.seo_title || b.title,
              seoDescription: b.seoDescription || b.seo_description || b.excerpt,
              seoKeywords: b.seoKeywords || b.seo_keywords || '',
              isFeatured: b.isFeatured ?? b.is_featured,
              viewCount: b.viewCount ?? b.view_count ?? 1,
              likesCount: b.likesCount ?? b.likes_count ?? 0,
              commentsCount: b.commentsCount ?? b.comments_count ?? 0
            }));
            setPosts(mapped);
            localStorage.setItem('dg_village_blogs', JSON.stringify(mapped));
          }
        })
        .catch((e) => console.log('Notice: Blogs API fetch notice:', e.message));
    };

    fetchBlogs();

    window.addEventListener('dg_blogs_updated', fetchBlogs);
    window.addEventListener('storage', fetchBlogs);
    return () => {
      window.removeEventListener('dg_blogs_updated', fetchBlogs);
      window.removeEventListener('storage', fetchBlogs);
    };
  }, [lang]);

  const categories = [
    { id: 'all', label: lang === 'MR' ? 'सर्व लेख' : 'All Blogs', count: posts.length },
    { id: 'General', label: lang === 'MR' ? 'सामान्य / इतर' : 'General / Civic', count: posts.filter((p) => p.category === 'General').length },
    { id: 'Schemes', label: lang === 'MR' ? 'शासकीय योजना' : 'Govt Schemes', count: posts.filter((p) => p.category === 'Schemes').length },
    { id: 'Agriculture', label: lang === 'MR' ? 'कृषी व शेती' : 'Agriculture', count: posts.filter((p) => p.category === 'Agriculture').length },
    { id: 'Governance', label: lang === 'MR' ? 'प्रशासन व सेवा' : 'Civic Services', count: posts.filter((p) => p.category === 'Governance').length },
    { id: 'Education', label: lang === 'MR' ? 'शिक्षण व करिअर' : 'Education & Career', count: posts.filter((p) => p.category === 'Education').length },
    { id: 'Health', label: lang === 'MR' ? 'आरोग्य व पोषण' : 'Health & Nutrition', count: posts.filter((p) => p.category === 'Health').length }
  ];

  const filteredPosts = useMemo(() => {
    let result = posts.filter((post) => {
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (post.title || '').toLowerCase().includes(q) || (post.titleMarathi || '').toLowerCase().includes(q);
        const matchExcerpt = (post.excerpt || '').toLowerCase().includes(q) || (post.excerptMarathi || '').toLowerCase().includes(q);
        const matchTags = (post.tags || []).some((t) => t.toLowerCase().includes(q)) || (post.tagsMarathi || []).some((t) => t.toLowerCase().includes(q));
        const matchAuthor = (post.author || '').toLowerCase().includes(q);
        if (!matchTitle && !matchExcerpt && !matchTags && !matchAuthor) return false;
      }

      return true;
    });

    if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    } else if (sortBy === 'views') {
      result = [...result].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    }

    return result;
  }, [posts, selectedCategory, searchQuery, sortBy]);

  const featuredPost = useMemo(() => {
    return posts.find((p) => p.isFeatured) || posts[0];
  }, [posts]);

  const handleShare = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    const url = `${window.location.origin}/blogs/${post.slug || post.id}`;
    const text = `📖 *${post.titleMarathi}*\n\n${post.excerptMarathi}\n\n👉 संपूर्ण लेख येथे वाचा: ${url}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleOpenWriteModal = () => {
    if (!currentUser?.isLoggedIn) {
      if (onRequireLogin) {
        onRequireLogin();
        return;
      }
    }
    if (onNavigateToWriteBlog) {
      onNavigateToWriteBlog();
    } else {
      setWriteModalOpen(true);
    }
  };

  const handlePublishNewPost = (newPost: BlogPost) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('dg_village_blogs', JSON.stringify(updated));
    window.dispatchEvent(new Event('dg_blogs_updated'));
    onSelectBlogSlug(newPost.slug);
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Asgaon Digital Village Blog & Knowledge Hub | आसगाव माहिती लेख',
    description: 'अधिकृत शासकीय योजना, शेती सल्ला, डिजिटल सातबारा, एसटी बस वेळापत्रक आणि आसगाव ग्रामपंचायत कारभारावरील मार्गदर्शक लेख.',
    url: 'https://asgaon.digital/blogs',
    hasPart: posts.map((p, i) => ({
      '@type': 'BlogPosting',
      position: i + 1,
      headline: p.titleMarathi,
      url: `https://asgaon.digital/blogs/${p.slug}`,
      datePublished: p.publishDateISO,
      description: p.excerptMarathi,
      image: p.coverImage
    }))
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <SEOHead
        title="Asgaon Village Blogs & Knowledge Hub | आसगाव माहिती लेख व ब्लॉग्स"
        description="आसगाव ग्रामपंचायत अधिकृत माहिती लेख - घरकुल योजना अर्ज, डिजिटल सातबारा, लाडकी बहीण स्टेटस, एसटी बस वेळापत्रक आणि खरीप पीक संरक्षण सविस्तर माहिती."
        keywords="Asgaon village blogs, Gharkul yojana guide Asgaon, Digital 7 12 Mahabhumi Pauni, Ladki bahin installment status Bhandara, आसगाव ब्लॉग, माहिती लेख"
        canonicalUrl="https://asgaon.digital/blogs"
        structuredData={collectionSchema}
      />

      {/* 1. Breadcrumbs & Mobile Title Header */}
      <div className="flex flex-col gap-1.5">
        <Breadcrumb
          items={[
            { label: t('nav_home'), onClick: onNavigateHome },
            { label: t('nav_blogs'), active: true }
          ]}
        />

        {/* Mobile Clean Title Header (Compact and closely grouped with breadcrumbs) */}
        <div className="md:hidden flex flex-col gap-0.5 pt-0.5">
          <h1 className="font-heading font-black text-xl text-stone-900 tracking-tight leading-tight">
            {lang === 'MR' ? 'आसगाव माहिती लेख' : 'Asgaon Village Blogs'}
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            {posts.length} {lang === 'MR' ? 'एकूण लेख • सर्व नागरिकांसाठी व्यासपीठ' : 'Total Articles • Open Platform'}
          </p>
        </div>
      </div>

      {/* 2. Desktop Community Blog Hero & Write Action Banner (Hidden on Mobile) */}
      <section className="hidden md:block bg-gradient-to-r from-[#166534] via-[#084535] to-[#0f533f] text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#052e16] relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <h1 className="font-heading font-extrabold text-[22px] sm:text-[28px] text-white leading-tight">
              {lang === 'MR' ? 'आसगाव माहिती लेख' : 'Asgaon Village Blogs'}
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#a7f3d0] font-medium">
              <span className="flex items-center gap-1">
                <LucideIcon name="menu_book" className="text-[16px]" />
                <span>{posts.length} {lang === 'MR' ? 'एकूण लेख' : 'Total Articles'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <LucideIcon name="group" className="text-[16px]" />
                <span>{lang === 'MR' ? 'सर्व नागरिकांसाठी खुले व्यासपीठ' : 'Open platform for all citizens'}</span>
              </span>
            </div>
          </div>

          {/* Write Article Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleOpenWriteModal}
              className="px-6 py-3.5 rounded-2xl bg-[#a7f3d0] hover:bg-[#a0e4c8] text-[#002117] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <LucideIcon name="edit_note" className="text-[20px]" />
              <span>{lang === 'MR' ? 'नवीन लेख लिहा' : 'Write New Article'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Featured Spotlight Card */}
      {!searchQuery && selectedCategory === 'all' && featuredPost && (
        <section
          onClick={() => onSelectBlogSlug(featuredPost.slug || featuredPost.id)}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md border border-[#e8e2d9] hover:border-[#052e16] cursor-pointer group flex flex-col lg:flex-row items-center gap-6 transition-all"
        >
          <div className="lg:w-1/2 rounded-2xl overflow-hidden bg-stone-100 max-h-[280px] w-full">
            <img
              src={featuredPost.coverImage}
              alt={lang === 'MR' ? (featuredPost.titleMarathi || featuredPost.title) : featuredPost.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="lg:w-1/2 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#166534] text-[#a7f3d0] text-[10px] font-black uppercase">
                  {lang === 'MR' ? 'ठळक लेख' : 'Featured Spotlight'}
                </span>
                <span className="text-xs text-[#707974] font-medium">{featuredPost.publishDate}</span>
                <span className="text-xs text-[#707974]">•</span>
                <span className="text-xs text-[#707974] font-medium">
                  {featuredPost.readTimeMinutes} {lang === 'MR' ? 'मि. वाचन' : 'min read'}
                </span>
              </div>

              <h2 className="font-heading font-extrabold text-[20px] sm:text-[24px] text-[#166534] leading-tight group-hover:text-[#c2410c] transition-colors">
                {lang === 'MR' ? (featuredPost.titleMarathi || featuredPost.title) : featuredPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#404945] mt-2 leading-relaxed line-clamp-3">
                {lang === 'MR' ? (featuredPost.excerptMarathi || featuredPost.excerpt) : featuredPost.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#f0eee8]">
              <div className="text-xs text-[#707974]">
                {lang === 'MR' ? 'लेखक: ' : 'Author: '}
                <strong className="text-[#1d1b16]">{featuredPost.author}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleShare(e, featuredPost)}
                  className="px-3 py-1.5 rounded-xl bg-[#e6f7f0] hover:bg-[#d0f0e3] text-[#006a4e] text-xs font-bold transition-all border border-[#b8ebd5] flex items-center gap-1"
                >
                  <LucideIcon name="share" className="text-[16px]" />
                  <span>{lang === 'MR' ? 'शेअर' : 'Share'}</span>
                </button>
                <span className="px-4 py-1.5 rounded-xl bg-[#166534] text-[#a7f3d0] group-hover:bg-[#052e16] text-xs font-bold flex items-center gap-1 transition-colors">
                  <span>{lang === 'MR' ? 'वाचा' : 'Read'}</span>
                  <LucideIcon name="arrow_forward" className="text-[16px]" />
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. SEARCH & UNIFIED FILTER BAR */}
      <div id="blogs-list-container" className="bg-white rounded-2xl p-3 sm:p-4 border border-[#e8e2d9] shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1">
            <LucideIcon name="search" className="absolute left-3 top-2.5 text-[#707974] text-[18px]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'MR'
                  ? 'शोध: लेख, योजना, पीक किंवा लेखक...'
                  : 'Search blogs by title, crop, author...'
              }
              className="w-full pl-9 sm:pl-10 pr-9 py-2.5 bg-[#f9f3ea] text-[#1d1b16] rounded-xl text-xs sm:text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 p-0.5 text-[#707974] hover:text-[#1d1b16]"
                aria-label="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Corporate Filter Icon Button in Flex */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className={`relative shrink-0 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all shadow-xs ${
              selectedCategory !== 'all'
                ? 'bg-[#166534] text-white border-[#166534] ring-2 ring-[#166534]/20'
                : 'bg-[#f4efe8] text-[#1d1b16] border-[#e8e2d9] hover:bg-[#eae2d7]'
            }`}
            aria-label="Filter Blogs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'MR' ? 'फिल्टर' : 'Filter'}</span>
            {selectedCategory !== 'all' && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-stone-900 text-[10px] sm:text-[11px] font-black flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Chips (Micro Row) */}
        {selectedCategory !== 'all' && (
          <div className="pt-2 border-t border-[#f0eee8] flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] font-medium text-[#707974]">
              {lang === 'MR' ? 'सक्रिय फिल्टर्स:' : 'Active:'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#e8f1ec] text-[#14532d] font-bold text-[11px] border border-[#cadbcf]">
              {categories.find((c) => c.id === selectedCategory)?.label}
              <button onClick={() => setSelectedCategory('all')} className="hover:opacity-70 ml-0.5" aria-label="Clear category">
                <X className="w-3 h-3" />
              </button>
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-[11px] font-bold text-[#c2410c] hover:underline ml-1"
            >
              {lang === 'MR' ? 'सर्व काढा' : 'Clear all'}
            </button>
          </div>
        )}
      </div>

      {/* Corporate Filter Modal / Bottom Sheet */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#e8e2d9] flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#e8e2d9] flex items-center justify-between bg-[#fdfbf7]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e8f1ec] text-[#166534] flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1d1b16]">
                    {lang === 'MR' ? 'ब्लॉग व लेख फिल्टर्स' : 'Filter Blog Articles'}
                  </h3>
                  <p className="text-[11px] text-[#707974]">
                    {lang === 'MR' ? 'विषय विभाग व क्रमवारीनुसार लेख निवडा' : 'Filter by topic and sort order'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f4efe8] hover:bg-[#eae2d7] text-[#707974] hover:text-[#1d1b16] flex items-center justify-center transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-sm">
              {/* Category Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-[#1d1b16] uppercase tracking-wider">
                    {lang === 'MR' ? '१. लेख विभाग' : '1. Article Category'}
                  </span>
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="text-[11px] text-[#c2410c] font-semibold hover:underline"
                    >
                      {lang === 'MR' ? 'सर्व दाखवा' : 'Reset'}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-[#166534] text-white border-[#166534] shadow-xs'
                            : 'bg-[#fdfbf7] text-[#404945] border-[#e8e2d9] hover:bg-[#f4efe8]'
                        }`}
                      >
                        <span className="truncate">{cat.label} ({cat.count})</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort By Section */}
              <div>
                <span className="text-xs font-bold text-[#1d1b16] uppercase tracking-wider block mb-2">
                  {lang === 'MR' ? '२. क्रमवारी (Sort By)' : '2. Sort By'}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-xs font-bold border border-[#e8e2d9] focus:outline-none"
                >
                  <option value="latest">{lang === 'MR' ? 'नवीनतम लेख' : 'Latest First'}</option>
                  <option value="popular">{lang === 'MR' ? 'सर्वाधिक पसंती (Most Liked)' : 'Most Liked'}</option>
                  <option value="views">{lang === 'MR' ? 'सर्वाधिक वाचलेले (Most Viewed)' : 'Most Viewed'}</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#e8e2d9] bg-[#f9f3ea] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                disabled={selectedCategory === 'all'}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory !== 'all'
                    ? 'text-[#c2410c] hover:bg-orange-100/60'
                    : 'text-stone-400 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'MR' ? 'सर्व रीसेट' : 'Clear All'}</span>
              </button>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#166534] text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-[#14532d] transition-all flex items-center justify-center gap-2"
              >
                <span>
                  {lang === 'MR'
                    ? `लेख दाखवा (${filteredPosts.length})`
                    : `Show ${filteredPosts.length} Articles`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Blog Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#e8e2d9] shadow-xs">
          <LucideIcon name="menu_book" className="text-[48px] text-[#707974] mb-3 block" />
          <h3 className="font-heading font-extrabold text-lg text-[#1d1b16]">
            {lang === 'MR' ? 'कोणताही लेख आढळला नाही' : 'No articles found'}
          </h3>
          <p className="text-xs text-[#707974] mt-1">
            {lang === 'MR'
              ? 'शोध शब्द बदला किंवा सर्व विभाग निवडून पुन्हा प्रयत्न करा.'
              : 'Try changing search keywords or select all categories.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold"
          >
            {lang === 'MR' ? 'सर्व लेख दाखवा' : 'Show All Blogs'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.slug || post.id}
              onClick={() => onSelectBlogSlug(post.slug || post.id)}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-emerald-800 transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={post.coverImage}
                    alt={lang === 'MR' ? (post.titleMarathi || post.title) : post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#166534]/95 text-[#a7f3d0] text-[11px] font-bold shadow-sm">
                      {lang === 'MR' ? (post.categoryMarathi || post.category) : post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                    <LucideIcon name="schedule" className="text-[13px]" />
                    <span>{post.readTimeMinutes} {lang === 'MR' ? 'मि.' : 'min'}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-[#707974] mb-2">
                    <span>{post.publishDate}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-red-700 font-bold">
                        <span>❤️</span>
                        <span>{post.likesCount || 12}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[#006a4e] font-bold">
                        <span>💬</span>
                        <span>{post.commentsCount || 2}</span>
                      </span>
                    </div>
                  </div>

                  <a
                    href={`/blogs/${post.slug || post.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectBlogSlug(post.slug || post.id);
                    }}
                    className="block font-heading font-extrabold text-[16px] text-[#166534] group-hover:text-[#c2410c] leading-snug line-clamp-2 mb-2 transition-colors"
                  >
                    {lang === 'MR' ? (post.titleMarathi || post.title) : post.title}
                  </a>

                  <p className="text-xs text-[#404945] leading-relaxed line-clamp-2 mb-3">
                    {lang === 'MR' ? (post.excerptMarathi || post.excerpt) : post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {((lang === 'MR' ? post.tagsMarathi : post.tags) || post.tagsMarathi || []).slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#f4efe8] text-[#555]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-[#f0eee8] flex items-center justify-between gap-2">
                <div className="text-[11px] text-[#707974] truncate">
                  {lang === 'MR' ? 'लेखक: ' : 'Author: '}
                  <strong className="text-[#1d1b16]">{post.author}</strong>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => handleShare(e, post)}
                    className="p-1.5 rounded-lg bg-[#e6f7f0] text-[#006a4e] hover:bg-[#d0f0e3] transition-colors"
                    title={lang === 'MR' ? 'WhatsApp वर पाठवा' : 'Share on WhatsApp'}
                  >
                    <LucideIcon name="share" className="text-[16px]" />
                  </button>
                  <span className="p-1.5 rounded-lg bg-[#f4efe8] text-[#166534] group-hover:bg-[#166534] group-hover:text-white transition-colors">
                    <LucideIcon name="arrow_forward" className="text-[16px]" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Write Blog Modal */}
      <WriteBlogModal
        isOpen={writeModalOpen}
        onClose={() => setWriteModalOpen(false)}
        onPublish={handlePublishNewPost}
        currentUser={currentUser}
      />

      {/* Circular Theme-Colored Sticky Floating Action Button with Floating Text Above (Mobile Only) */}
      <div className="md:hidden fixed bottom-6 right-5 z-40 flex flex-col items-center gap-1.5 pointer-events-none">
        {/* Text floating above the button without background */}
        <span className="text-[11px] font-extrabold text-emerald-950 tracking-tight whitespace-nowrap select-none drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">
          {lang === 'MR' ? 'नवीन लेख लिहा ✍️' : 'Write Article ✍️'}
        </span>

        {/* Circular Button matching Theme Color */}
        <button
          type="button"
          onClick={handleOpenWriteModal}
          className="w-13 h-13 rounded-full bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white shadow-xl shadow-emerald-950/25 border-2 border-white flex items-center justify-center transition-all cursor-pointer select-none group pointer-events-auto"
          aria-label={lang === 'MR' ? 'नवीन लेख लिहा' : 'Write New Article'}
          title={lang === 'MR' ? 'नवीन लेख लिहा' : 'Write New Article'}
        >
          <LucideIcon name="edit" className="text-[22px] text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};
