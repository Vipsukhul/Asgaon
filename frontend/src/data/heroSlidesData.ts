import type { HeroSlide } from '../types';
import { api } from '../services/api';

// Sync directly from PostgreSQL Database on application start
if (typeof window !== 'undefined') {
  api.getHeroBanners().then((res: any) => {
    const list = Array.isArray(res) ? res : (res?.data || []);
    if (list.length > 0) {
      const slides: HeroSlide[] = list.map((b: any) => ({
        id: b.id,
        type: b.slideType as any,
        imageUrl: b.imageUrl,
        showTextOverlay: b.showTextOverlay ?? true,
        badgeMarathi: b.badgeMarathi || '',
        badgeEnglish: b.badgeEnglish || '',
        titleMarathi: b.titleMarathi || '',
        titleEnglish: b.titleEnglish || '',
        subtitleMarathi: b.subtitleMarathi || '',
        subtitleEnglish: b.subtitleEnglish || '',
        ctaTextMarathi: b.ctaTextMarathi || '',
        ctaTextEnglish: b.ctaTextEnglish || '',
        ctaLink: b.ctaLink || '',
        isActive: b.isActive ?? true,
        order: b.displayOrder || 1
      }));
      localStorage.setItem('dg_hero_slides', JSON.stringify(slides));
      window.dispatchEvent(new CustomEvent('dg:hero-slides-updated', { detail: slides }));
    }
  }).catch(() => {});
}

// Default array emptied - slides loaded dynamically from PostgreSQL database via /api/v1/hero-banners
export const DEFAULT_HERO_SLIDES: HeroSlide[] = [];

export function getStoredHeroSlides(): HeroSlide[] {
  const saved = localStorage.getItem('dg_hero_slides');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore JSON parse error
    }
  }
  return DEFAULT_HERO_SLIDES;
}

export function saveStoredHeroSlides(slides: HeroSlide[]): void {
  localStorage.setItem('dg_hero_slides', JSON.stringify(slides));
  window.dispatchEvent(new CustomEvent('dg:hero-slides-updated', { detail: slides }));
}
