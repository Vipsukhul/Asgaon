import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_BLOG_POSTS, DEFAULT_BLOG_COMMENTS, type BlogPost, type BlogComment } from '../data/blogData';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumb } from '../components/Breadcrumb';
import { MarkdownContent } from '../components/MarkdownContent';
import { api } from '../services/api';

interface BlogDetailPageProps {
  slug: string;
  onNavigateBack: () => void;
  onSelectBlog: (slug: string) => void;
  onNavigateHome: () => void;
  currentUser?: {
    fullName: string;
    ward?: string;
    role?: string;
    isLoggedIn?: boolean;
  };
  onRequireLogin?: () => void;
  onWriteBlog?: () => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  slug,
  onNavigateBack,
  onSelectBlog,
  onNavigateHome,
  currentUser,
  onRequireLogin,
  onWriteBlog
}) => {
  // Load all blogs (to find active post & allow updating likes/comments)
  const [allPosts, setAllPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('dg_village_blogs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: BlogPost) => (p.id || p.slug).toLowerCase()));
          const missing = INITIAL_BLOG_POSTS.filter((p) => !existingIds.has(p.id.toLowerCase()) && !existingIds.has(p.slug.toLowerCase()));
          return [...missing, ...parsed];
        }
      } catch {
        /* ignore */
      }
    }
    return INITIAL_BLOG_POSTS;
  });

  const post = useMemo(() => {
    const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();
    return (
      allPosts.find(
        (p) =>
          p.slug.toLowerCase() === decodedSlug ||
          p.id.toLowerCase() === decodedSlug ||
          p.slug.toLowerCase() === slug.toLowerCase() ||
          (p.id === 'c7f9e2b1' && (decodedSlug === 'post-100' || decodedSlug === 'write-guide')) ||
          (p.id === 'a8d4e2f9' && decodedSlug === 'blog-01') ||
          (p.id === 'b3f7a1c8' && decodedSlug === 'blog-02') ||
          (p.id === '9e2d6b4a' && decodedSlug === 'blog-03') ||
          (p.id === '5c1f8a7e' && decodedSlug === 'blog-04') ||
          (p.id === '7a4d9e2b' && decodedSlug === 'blog-05') ||
          (p.id === 'd2e8b6a3' && decodedSlug === 'blog-06')
      ) || allPosts[0]
    );
  }, [allPosts, slug]);

  // Likes state
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    return localStorage.getItem(`dg_blog_liked_${post.slug}`) === 'true';
  });
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 12);
  const [likeToast, setLikeToast] = useState<string | null>(null);

  useEffect(() => {
    setIsLiked(localStorage.getItem(`dg_blog_liked_${post.slug}`) === 'true');
    setLikesCount(post.likesCount || 12);

    // Record view in backend
    if (post.slug) {
      api.viewBlog(post.slug).catch(() => {});
    }
  }, [post.slug, post.likesCount]);

  // Sync blogs list from backend
  useEffect(() => {
    api.getBlogs()
      .then((res) => {
        if (res && res.length > 0) {
          const mapped: BlogPost[] = res.map((b: any) => ({
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
            author: b.author || 'आसगाव ग्रामस्थ',
            authorRole: b.authorRole || b.author_role || 'Contributor',
            authorRoleMarathi: b.authorRoleMarathi || b.author_role_marathi || 'स्थानिक नागरिक',
            publishDate: b.publishDate || b.publish_date || 'ऑक्टोबर २०२६',
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
          setAllPosts(mapped);
          localStorage.setItem('dg_village_blogs', JSON.stringify(mapped));
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleLike = () => {
    const newLiked = !isLiked;
    const newCount = newLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setIsLiked(newLiked);
    setLikesCount(newCount);
    localStorage.setItem(`dg_blog_liked_${post.slug}`, String(newLiked));

    if (newLiked) {
      api.likeBlog(post.slug).catch(() => {});
    }

    // Update in allPosts & localStorage
    const updated = allPosts.map((p) =>
      p.slug === post.slug ? { ...p, likesCount: newCount } : p
    );
    setAllPosts(updated);
    localStorage.setItem('dg_village_blogs', JSON.stringify(updated));
    window.dispatchEvent(new Event('dg_blogs_updated'));

    if (newLiked) {
      setLikeToast('❤️ तुम्हाला हा लेख आवडला! धन्यवाद.');
      setTimeout(() => setLikeToast(null), 3000);
    }
  };

  // Comments state
  const [comments, setComments] = useState<BlogComment[]>(() => {
    const saved = localStorage.getItem(`dg_blog_comments_${post.slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* ignore */
      }
    }
    return DEFAULT_BLOG_COMMENTS[post.slug] || [
      {
        id: `c-default-${post.slug}`,
        blogSlug: post.slug,
        authorName: 'आसगाव ग्रामस्थ',
        authorRole: 'नागरिक',
        content: 'गावातील सर्व शेतकरी व नागरिकांसाठी अतिशय उपयुक्त आणि सविस्तर माहिती!',
        timestamp: '१ दिवसापूर्वी',
        timestampISO: new Date().toISOString(),
        likesCount: 5
      }
    ];
  });

  // Comment Content Input (No name input needed as user authentication is used)
  const [commentContentInput, setCommentContentInput] = useState('');
  const [commentSuccessMsg, setCommentSuccessMsg] = useState<string | null>(null);

  // Sync comments if slug changes
  useEffect(() => {
    const saved = localStorage.getItem(`dg_blog_comments_${post.slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setComments(parsed);
          return;
        }
      } catch {
        /* ignore */
      }
    }
    setComments(
      DEFAULT_BLOG_COMMENTS[post.slug] || [
        {
          id: `c-default-${post.slug}`,
          blogSlug: post.slug,
          authorName: 'आसगाव ग्रामस्थ',
          authorRole: 'नागरिक',
          content: 'गावातील सर्व शेतकरी व नागरिकांसाठी अतिशय उपयुक्त आणि सविस्तर माहिती!',
          timestamp: '१ दिवसापूर्वी',
          timestampISO: new Date().toISOString(),
          likesCount: 5
        }
      ]
    );
  }, [post.slug]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.isLoggedIn) {
      if (onRequireLogin) onRequireLogin();
      return;
    }

    if (!commentContentInput.trim()) {
      alert('कृपया तुमची प्रतिक्रिया प्रविष्ट करा.');
      return;
    }

    const authorRoleText = currentUser.ward
      ? `प्रभाग ${currentUser.ward} नागरिक`
      : (currentUser.role || 'आसगाव ग्रामस्थ');

    const newComment: BlogComment = {
      id: `comment-${Date.now()}`,
      blogSlug: post.slug,
      authorName: currentUser.fullName,
      authorRole: authorRoleText,
      content: commentContentInput.trim(),
      timestamp: 'आत्ताच',
      timestampISO: new Date().toISOString(),
      likesCount: 0
    };

    // Persist comment to backend
    api.addBlogComment(post.slug, {
      authorName: currentUser.fullName,
      authorRole: authorRoleText,
      content: commentContentInput.trim(),
      timestampStr: 'आत्ताच',
      timestampIso: new Date().toISOString()
    }).catch(() => {});

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`dg_blog_comments_${post.slug}`, JSON.stringify(updatedComments));

    // Update post comments count
    const updatedPosts = allPosts.map((p) =>
      p.slug === post.slug ? { ...p, commentsCount: updatedComments.length } : p
    );
    setAllPosts(updatedPosts);
    localStorage.setItem('dg_village_blogs', JSON.stringify(updatedPosts));
    window.dispatchEvent(new Event('dg_blogs_updated'));

    setCommentContentInput('');
    setCommentSuccessMsg('✅ तुमची प्रतिक्रिया यशस्वीरीत्या नोंदवली गेली आहे!');
    setTimeout(() => setCommentSuccessMsg(null), 4000);
  };

  const handleLikeComment = (commentId: string) => {
    const updated = comments.map((c) =>
      c.id === commentId ? { ...c, likesCount: c.likesCount + 1 } : c
    );
    setComments(updated);
    localStorage.setItem(`dg_blog_comments_${post.slug}`, JSON.stringify(updated));
  };

  const relatedPosts = useMemo(() => {
    return allPosts
      .filter((p) => p.slug !== post.slug)
      .slice(0, 3);
  }, [allPosts, post]);

  const postShareUrl = `${window.location.origin}/blogs/${post.id || post.slug}`;

  const handleShareWhatsApp = () => {
    const text = `📖 *${post.titleMarathi}*\n\n${post.excerptMarathi}\n\n👉 संपूर्ण लेख येथे वाचा: ${postShareUrl}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.titleMarathi,
          text: post.excerptMarathi,
          url: postShareUrl
        });
      } catch {
        /* ignore */
      }
    } else {
      handleShareWhatsApp();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postShareUrl).then(() => {
      setLikeToast('🔗 लेखाची थेट आयडी लिंक कॉपी केली!');
      setTimeout(() => setLikeToast(null), 2500);
    });
  };

  // Structured Data (BlogPosting, BreadcrumbList) - FAQs omitted as community blogs are written by citizens
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://asgaon.digital/blogs/${post.slug}`
      },
      headline: post.titleMarathi,
      alternativeHeadline: post.title,
      description: post.seoDescription || post.excerptMarathi,
      image: post.coverImage,
      datePublished: post.publishDateISO,
      dateModified: post.publishDateISO,
      author: {
        '@type': 'Person',
        name: post.author,
        jobTitle: post.authorRoleMarathi || post.authorRole
      },
      publisher: {
        '@type': 'Organization',
        name: 'Asgaon Digital Gram Panchayat Portal',
        logo: {
          '@type': 'ImageObject',
          url: 'https://asgaon.digital/asgaon-logo.png'
        }
      },
      keywords: post.seoKeywords,
      articleSection: post.categoryMarathi
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'मुख्य पृष्ठ (Home)',
          item: 'https://asgaon.digital/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'ब्लॉग्स (Blogs)',
          item: 'https://asgaon.digital/blogs'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.titleMarathi,
          item: `https://asgaon.digital/blogs/${post.slug}`
        }
      ]
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <SEOHead
        title={`${post.titleMarathi} | Asgaon Village Blog`}
        description={post.seoDescription || post.excerptMarathi}
        keywords={post.seoKeywords}
        canonicalUrl={`https://asgaon.digital/blogs/${post.id || post.slug}`}
        ogType="article"
        ogImage={post.coverImage}
        articleAuthor={post.author}
        articlePublishedTime={post.publishDateISO}
        articleSection={post.categoryMarathi}
        articleTags={post.tagsMarathi}
        structuredData={structuredData}
      />

      {/* 1. Breadcrumbs & Return Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: 'Home', onClick: onNavigateHome },
            { label: 'Village Knowledge Hub & Blogs (माहिती लेख)', onClick: onNavigateBack },
            { label: post.titleMarathi, active: true }
          ]}

        />

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onWriteBlog && (
            <button
              onClick={onWriteBlog}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#003629] text-[#baeed9] hover:bg-[#00261d] font-bold text-xs shadow-2xs transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>लेख लिहा</span>
            </button>
          )}

          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#e8e2d9] text-[#003629] font-bold text-xs hover:bg-[#f9f3ea] shadow-2xs transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>मागे जा (Back)</span>
          </button>
        </div>
      </div>

      {/* 2. Article Header Card */}
      <header className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-[#003629] text-[#baeed9] text-[11px] font-bold uppercase tracking-wider">
            {post.categoryMarathi}
          </span>
          <span className="text-[#707974] flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[15px]">calendar_today</span>
            <span>{post.publishDate}</span>
          </span>
          <span className="text-[#707974]">•</span>
          <span className="text-[#707974] flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            <span>{post.readTimeMinutes} मिनिटे वाचन</span>
          </span>
          <span className="text-[#707974]">•</span>
          <span className="text-[#707974] flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[15px]">visibility</span>
            <span>{post.viewCount || 120} वाचक</span>
          </span>
        </div>

        <div>
          <h1 className="font-heading font-extrabold text-[24px] sm:text-[32px] text-[#003629] leading-tight mb-2">
            {post.titleMarathi}
          </h1>
          {post.title && post.title !== post.titleMarathi && (
            <p className="font-heading font-semibold text-[14px] sm:text-[16px] text-[#a63b00]">
              {post.title}
            </p>
          )}
        </div>

        {/* Excerpt Box */}
        <div className="bg-[#fff8f0] border-l-4 border-[#a63b00] p-4 rounded-r-xl text-[13px] sm:text-[14px] text-[#7a2b00] font-medium leading-relaxed">
          {post.excerptMarathi}
        </div>

        {/* Author Details & Interactive Likes/Share Action Bar */}
        <div className="p-4 rounded-xl bg-[#fcfaf7] border border-[#e8e2d9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#003629] text-[#baeed9] flex items-center justify-center font-extrabold text-base shrink-0 shadow-2xs">
              {post.author.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#1d1b16] flex items-center gap-1.5">
                <span>{post.author}</span>
                <span className="material-symbols-outlined text-[16px] text-[#006a4e]">verified</span>
              </div>
              <div className="text-xs text-[#707974] font-medium">
                {post.authorRoleMarathi || post.authorRole || 'आसगाव ग्रामस्थ'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Interactive Like Button */}
            <button
              onClick={handleToggleLike}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs border ${isLiked
                  ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 scale-102'
                  : 'bg-white border-[#e8e2d9] text-[#404945] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                }`}
              title={isLiked ? 'पसंती मागे घ्या' : 'मला हा लेख आवडला'}
            >
              <span className={`material-symbols-outlined text-[18px] transition-transform ${isLiked ? 'text-rose-600 scale-110' : ''}`}>
                {isLiked ? 'favorite' : 'favorite_border'}
              </span>
              <span>{likesCount} पसंती</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>WhatsApp</span>
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white border border-[#e8e2d9] hover:bg-[#f9f3ea] text-[#404945] text-xs font-bold transition-all shadow-2xs"
              title="लेखाची लिंक कॉपी करा"
            >
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
            </button>

            {/* Native Share Button */}
            <button
              onClick={handleNativeShare}
              className="p-2 rounded-xl bg-white border border-[#e8e2d9] hover:bg-[#f9f3ea] text-[#404945] text-xs font-bold transition-all shadow-2xs"
              title="इतर माध्यमातून शेअर करा"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
          </div>
        </div>

        {likeToast && (
          <div className="bg-[#e6f7f0] border border-[#b8ebd5] text-[#006a4e] text-xs font-bold px-4 py-2 rounded-xl animate-fade-in flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{likeToast}</span>
          </div>
        )}

        {/* Prominent Clean Hash ID Permalink Bar */}
        <div className="bg-[#f9f5ed] border border-[#e5decb] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
            <span className="w-9 h-9 rounded-xl bg-[#003629] text-[#baeed9] flex items-center justify-center shrink-0 shadow-2xs font-mono font-bold text-sm">
              #
            </span>
            <div className="overflow-hidden min-w-0">
              <div className="text-[11px] font-bold text-[#707974] flex items-center gap-2 mb-0.5">
                <span>लेखाची कायमस्वरूपी वेब लिंक (Direct Hash ID):</span>
                <span className="px-2 py-0.5 rounded-md bg-[#003629] text-[#baeed9] text-[11px] font-mono font-black tracking-wider">
                  #{post.id || post.slug}
                </span>
              </div>
              <div className="font-mono text-xs sm:text-sm font-extrabold text-[#003629] truncate select-all">
                {window.location.origin}/blogs/{post.id || post.slug}
              </div>
            </div>
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#003629] text-[#003629] hover:text-[#baeed9] border border-[#d8cfbe] text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>लिंक कॉपी करा (Copy)</span>
          </button>
        </div>

        {/* Cover Photo - Sleek compact banner */}
        <div className="rounded-2xl overflow-hidden border border-[#e8e2d9] shadow-2xs bg-stone-100 h-48 sm:h-60 md:h-64 max-h-[260px] w-full relative">
          <img
            src={post.coverImage}
            alt={post.titleMarathi}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </header>

      {/* 3. Main Article Content Card */}
      <main className="bg-white rounded-2xl p-6 sm:p-10 border border-[#e8e2d9] shadow-xs space-y-6">
        <article className="max-w-none">
          <MarkdownContent content={post.contentMarathi || post.content} />
        </article>

        {/* Tags */}
        <div className="pt-6 border-t border-[#f0eee8] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#707974] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">label</span>
            <span>टॅग्ज (Keywords):</span>
          </span>
          {(post.tagsMarathi || []).map((tag, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-lg bg-[#f4efe8] text-[#003629] font-bold border border-[#e8e2d9]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </main>

      {/* 4. Citizen Comments & Community Discussion Section */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#f0eee8] pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#006a4e]">forum</span>
            <h3 className="font-heading font-extrabold text-[18px] sm:text-[20px] text-[#003629]">
              प्रतिक्रिया व ग्राम संवाद
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#baeed9] text-[#002117] text-xs font-bold">
              {comments.length}
            </span>
          </div>
          <span className="text-xs text-[#707974] font-medium hidden sm:inline">
            फक्त आसगाव नागरिकांच्या सत्यापित प्रतिक्रिया
          </span>
        </div>

        {/* Comment Form: If logged in -> show user badge + textarea directly (NO NAME INPUT). If not logged in -> show login prompt. */}
        {currentUser?.isLoggedIn ? (
          <form onSubmit={handleSubmitComment} className="bg-[#fcfaf7] p-5 rounded-2xl border border-[#e8e2d9] space-y-4">
            {/* Authenticated user indicator */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#e8e2d9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#003629] text-[#baeed9] flex items-center justify-center font-bold text-xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#003629] flex items-center gap-1">
                    <span>{currentUser.fullName}</span>
                    <span className="material-symbols-outlined text-[15px] text-[#006a4e]">verified</span>
                  </div>
                  <div className="text-[11px] text-[#707974]">
                    {currentUser.ward || currentUser.role || 'आसगाव नागरिक'} म्हणून प्रतिक्रिया देत आहात
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold text-[#006a4e] bg-[#e6f7f0] px-2.5 py-1 rounded-full border border-[#b8ebd5]">
                लॉगिन केलेले खाते
              </span>
            </div>

            {commentSuccessMsg && (
              <div className="bg-[#e6f7f0] border border-[#b8ebd5] text-[#006a4e] text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{commentSuccessMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#707974] mb-1.5">
                तुमची प्रतिक्रिया किंवा प्रश्न (Your Comment) *
              </label>
              <textarea
                required
                rows={3}
                value={commentContentInput}
                onChange={(e) => setCommentContentInput(e.target.value)}
                placeholder="या लेखाबद्दल तुमचे मत, शंका किंवा इतर शेतकऱ्यांसाठी उपयुक्त अनुभव येथे लिहा..."
                className="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs sm:text-sm border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#003629] leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#707974]">
                * कोणतीही खोटी माहिती किंवा गैरवर्तन टाळण्यासाठी सर्व प्रतिक्रिया थेट तुमच्या खात्याशी जोडल्या जातात.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#003629] hover:bg-[#00261d] text-[#baeed9] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>प्रतिक्रिया नोंदवा</span>
              </button>
            </div>
          </form>
        ) : (
          /* Login prompt when not authenticated */
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#fbf8f3] to-[#f4eee4] border border-[#e8e2d9] text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#003629]/10 text-[#003629] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">lock</span>
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-[15px] sm:text-[17px] text-[#003629]">
                प्रतिक्रिया देण्यासाठी कृपया लॉगिन करा
              </h4>
              <p className="text-xs text-[#707974] max-w-md mx-auto mt-1 leading-relaxed">
                आसगाव डिजिटल पोर्टलवर बनावट किंवा अनामिक प्रतिक्रिया रोखण्यासाठी लॉगिन आवश्यक आहे. लॉगिन केल्यानंतर तुमचे नाव आपोआप जोडले जाते, त्यामुळे नाव भरण्याची गरज नाही.
              </p>
            </div>
            <button
              type="button"
              onClick={onRequireLogin}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#003629] hover:bg-[#00261d] text-[#baeed9] text-xs font-bold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>लॉगिन करा (Login to Join Discussion)</span>
            </button>
          </div>
        )}

        {/* Existing Comments Feed */}
        <div className="space-y-3 pt-2">
          {comments.length === 0 ? (
            <p className="text-xs text-[#707974] text-center py-6">
              अद्याप कोणतीही प्रतिक्रिया नाही. पहिली प्रतिक्रिया तुम्ही नोंदवा!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-xl border border-[#e8e2d9] bg-white shadow-2xs hover:border-[#1b4d3e] transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#f4efe8] text-[#003629] font-bold text-xs flex items-center justify-center border border-[#e8e2d9]">
                      {comment.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1d1b16] flex items-center gap-1.5">
                        <span>{comment.authorName}</span>
                        {comment.authorRole && (
                          <span className="text-[10px] font-semibold text-[#006a4e] bg-[#e6f7f0] px-2 py-0.2 rounded-md">
                            {comment.authorRole}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#707974]">{comment.timestamp}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fcfaf7] hover:bg-rose-50 text-[11px] font-bold text-[#707974] hover:text-rose-600 border border-[#e8e2d9] transition-colors"
                    title="पसंत करा"
                  >
                    <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                    <span>{comment.likesCount}</span>
                  </button>
                </div>

                <p className="text-xs text-[#2d312e] leading-relaxed pl-10">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. WhatsApp & Citizen Community Callout */}
      <section className="bg-gradient-to-r from-[#003629] to-[#0f533f] text-white rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm border border-[#00261d]">
        <div>
          <h3 className="text-[16px] sm:text-[18px] font-extrabold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#baeed9]">share</span>
            <span>हा लेख इतर ग्रामस्थांना उपयुक्त वाटेल का?</span>
          </h3>
          <p className="text-xs sm:text-[13px] text-[#d6eee4] mt-1 font-medium">
            आसगाव गावातील मित्र, शेतकरी व कुटुंबियांच्या माहितीसाठी हा लेख WhatsApp ग्रुपवर नक्की पाठवा.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>WhatsApp वर शेअर करा</span>
          </button>
        </div>
      </section>

      {/* 6. Related Articles Grid */}
      {relatedPosts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-[18px] text-[#003629]">
              इतर संबंधित माहिती लेख (Related Knowledge Articles)
            </h3>
            <button
              onClick={onNavigateBack}
              className="text-xs font-bold text-[#006a4e] hover:underline"
            >
              सर्व लेख पहा →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectBlog(rel.slug)}
                className="bg-white rounded-2xl p-4 border border-[#e8e2d9] shadow-2xs hover:shadow-md hover:border-[#1b4d3e] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 w-full rounded-xl overflow-hidden mb-3 bg-stone-100">
                    <img
                      src={rel.coverImage}
                      alt={rel.titleMarathi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#006a4e] bg-[#e6f7f0] px-2 py-0.5 rounded">
                    {rel.categoryMarathi}
                  </span>
                  <a
                    href={`/blogs/${rel.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectBlog(rel.slug);
                    }}
                    className="block font-bold text-xs sm:text-sm text-[#003629] group-hover:text-[#a63b00] mt-1.5 leading-snug line-clamp-2 transition-colors"
                  >
                    {rel.titleMarathi}
                  </a>
                </div>

                <div className="mt-3 pt-2 border-t border-[#f0eee8] flex items-center justify-between text-[11px] text-[#707974]">
                  <span>{rel.readTimeMinutes} मि. वाचन</span>
                  <span className="text-[#003629] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>वाचा</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
