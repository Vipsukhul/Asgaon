export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleMarathi: string;
  excerpt: string;
  excerptMarathi: string;
  content: string; // Markdown or rich structured text
  contentMarathi: string;
  category: 'Schemes' | 'Agriculture' | 'Education' | 'Governance' | 'Health' | 'General';
  categoryMarathi: string;
  author: string;
  authorRole: string;
  authorRoleMarathi: string;
  publishDate: string;
  publishDateISO: string;
  readTimeMinutes: number;
  coverImage: string;
  tags: string[];
  tagsMarathi: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  isFeatured?: boolean;
  viewCount?: number;
  likesCount?: number;
  commentsCount?: number;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export function slugifyTitle(title: string): string {
  if (!title) return '';
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled-post';
}

export interface BlogComment {
  id: string;
  blogSlug: string;
  authorName: string;
  authorRole?: string;
  content: string;
  timestamp: string;
  timestampISO: string;
  likesCount: number;
}

// All mock blog articles and comments emptied - populated via backend database/API
export const DEFAULT_BLOG_COMMENTS: Record<string, BlogComment[]> = {};

export const INITIAL_BLOG_POSTS: BlogPost[] = [];
