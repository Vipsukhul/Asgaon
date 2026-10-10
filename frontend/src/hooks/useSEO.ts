import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
}

export function useSEO({ title, description, canonicalPath }: SEOProps) {
  const { lang } = useLanguage();

  useEffect(() => {
    // 1. Dynamic Page Title
    const basePortal = lang === 'MR'
      ? 'आसगाव ग्राम माहिती व जनजागृती मंच'
      : 'Asgaon Village Civic Portal';
    
    document.title = title ? `${title} | ${basePortal}` : `${basePortal} | Asgaon (Pauni, Bhandara)`;

    // 2. Dynamic Description Meta Tag
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Open Graph Description
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);

      // Twitter Description
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', description);
    }

    // 3. Dynamic Canonical URL
    const cleanPath = canonicalPath || window.location.pathname;
    const fullCanonical = `https://asgaon.vercel.app${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
    
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', fullCanonical);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', fullCanonical);

    const twUrl = document.querySelector('meta[name="twitter:url"]');
    if (twUrl) twUrl.setAttribute('content', fullCanonical);

    // 4. Update html lang tag
    document.documentElement.lang = lang === 'MR' ? 'mr' : 'en';
  }, [title, description, canonicalPath, lang]);
}
