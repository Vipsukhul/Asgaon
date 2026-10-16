import { useEffect } from 'react';

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogImageAlt?: string;
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleSection?: string;
  articleTags?: string[];
  structuredData?: Record<string, any> | Array<Record<string, any>>;
  lang?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://res.cloudinary.com/dl5bq3ejh/image/upload/v1791660305/asgaon/seo/ccc45725-5d89-44b3-ac8c-a113f34f5df3.png',
  ogImageAlt,
  articleAuthor,
  articlePublishedTime,
  articleSection,
  articleTags,
  structuredData,
  lang
}) => {
  useEffect(() => {
    // 1. Update document title & HTML lang
    const prevTitle = document.title;
    document.title = title;
    if (lang) {
      document.documentElement.lang = lang.toLowerCase();
    }

    // Helper to get or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attributeName, attributeValue);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'bingbot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'author', articleAuthor || 'Asgaon Gram Panchayat & Citizens');

    // 3. OpenGraph Meta Tags (WhatsApp, Facebook, Twitter, LinkedIn)
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'Asgaon Digital Portal | आसगाव डिजिटल ग्राम मंच');
    setMetaTag('property', 'og:locale', 'mr_IN');
    setMetaTag('property', 'og:locale:alternate', 'en_IN');

    const fullImg = ogImage?.startsWith('http')
      ? ogImage
      : `${window.location.origin}${ogImage || '/asgaon-logo.png'}`;
    setMetaTag('property', 'og:image', fullImg);
    setMetaTag('property', 'og:image:secure_url', fullImg);
    setMetaTag('property', 'og:image:alt', ogImageAlt || title);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');

    const currentUrl = canonicalUrl || window.location.href;
    setMetaTag('property', 'og:url', currentUrl);

    // Article Specific OpenGraph Tags
    if (ogType === 'article') {
      if (articlePublishedTime) {
        setMetaTag('property', 'article:published_time', articlePublishedTime);
      }
      if (articleAuthor) {
        setMetaTag('property', 'article:author', articleAuthor);
      }
      if (articleSection) {
        setMetaTag('property', 'article:section', articleSection);
      }
      if (articleTags && articleTags.length > 0) {
        setMetaTag('property', 'article:tag', articleTags.join(', '));
      }
    }

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullImg);
    setMetaTag('name', 'twitter:image:alt', ogImageAlt || title);

    // 6. Canonical Link Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentUrl);

    // 7. JSON-LD Structured Data
    let jsonLdScript = document.getElementById('seo-structured-data') as HTMLScriptElement | null;
    if (structuredData) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'seo-structured-data';
        jsonLdScript.type = 'application/ld+json';
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(structuredData);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }

    return () => {
      document.title = prevTitle;
    };
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogType,
    ogImage,
    ogImageAlt,
    articleAuthor,
    articlePublishedTime,
    articleSection,
    articleTags,
    structuredData
  ]);

  return null;
};
