import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogImageAlt?: string;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

export function useSEO({
  title,
  description,
  keywords,
  canonicalPath,
  ogImage = 'https://res.cloudinary.com/dl5bq3ejh/image/upload/v1791660305/asgaon/seo/ccc45725-5d89-44b3-ac8c-a113f34f5df3.png',
  ogImageAlt,
  structuredData
}: SEOProps) {
  const { lang } = useLanguage();

  useEffect(() => {
    // 1. Dynamic Page Title
    const basePortal = lang === 'MR'
      ? 'आपलं डिजिटल आसगाव'
      : 'Digital Asgaon Civic Portal';
    
    const fullTitle = title ? `${title} | ${basePortal}` : `${basePortal} | आसगाव (पवनी, भंडारा)`;
    document.title = fullTitle;

    // Helper for meta tags
    const setMeta = (attr: string, key: string, val: string) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', val);
    };

    // 2. Dynamic Description & Keywords
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    if (keywords) {
      setMeta('name', 'keywords', keywords);
    }

    // 3. Social OpenGraph & Twitter Cards
    setMeta('property', 'og:title', fullTitle);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'Asgaon Civic Portal | आसगाव ग्राम मंच');
    setMeta('property', 'og:locale', lang === 'MR' ? 'mr_IN' : 'en_IN');
    setMeta('name', 'twitter:card', 'summary_large_image');

    if (ogImage) {
      const fullImg = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;
      setMeta('property', 'og:image', fullImg);
      setMeta('property', 'og:image:secure_url', fullImg);
      setMeta('name', 'twitter:image', fullImg);
      setMeta('property', 'og:image:alt', ogImageAlt || fullTitle);
      setMeta('property', 'og:image:width', '1200');
      setMeta('property', 'og:image:height', '630');
    }

    // 4. Dynamic Canonical URL
    const cleanPath = canonicalPath || window.location.pathname;
    const fullCanonical = `https://asgaon.vercel.app${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
    
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', fullCanonical);

    setMeta('property', 'og:url', fullCanonical);
    setMeta('name', 'twitter:url', fullCanonical);

    // 5. Update html lang tag
    document.documentElement.lang = lang === 'MR' ? 'mr' : 'en';

    // 6. JSON-LD Structured Data
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
  }, [title, description, keywords, canonicalPath, ogImage, ogImageAlt, structuredData, lang]);
}
