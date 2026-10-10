import type { HeroSlide } from '../types';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-welcome',
    type: 'welcome',
    showTextOverlay: true,
    isActive: true,
    order: 1
  },
  {
    id: 'slide-gosikhurd',
    type: 'custom',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    showTextOverlay: true,
    badgeMarathi: 'कृषी व जलसिंचन प्रकल्प',
    badgeEnglish: 'Irrigation & Agriculture',
    titleMarathi: 'गोसीखुर्द धरण व समृद्ध आसगाव शिवार',
    titleEnglish: 'Gosikhurd Project & Lush Green Asgaon',
    subtitleMarathi: 'पवनी तालुक्यातील बागायती शेती • मुबलक पाणी पुरवठा व आधुनिक कृषी योजनांचा थेट लाभ.',
    subtitleEnglish: 'Perennial irrigation, bountiful harvest, and direct DBT farmer support.',
    ctaTextMarathi: 'कृषी योजना व दर पहा',
    ctaTextEnglish: 'Explore Krishi Desk',
    ctaLink: 'krishi',
    isActive: true,
    order: 2
  },
  {
    id: 'slide-culture',
    type: 'custom',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
    showTextOverlay: true,
    badgeMarathi: 'ग्राम संस्कृती व उत्सव',
    badgeEnglish: 'Culture & Heritage',
    titleMarathi: 'ग्रामदैवत खंडोबा व आसगाव ग्रामसंस्कृती',
    titleEnglish: 'Heritage & Gramotsav Celebrations',
    subtitleMarathi: 'पारंपरिक वारसा, वार्षिक जत्रा आणि सामाजिक ऐक्य • गावातील सर्व चालू कार्यक्रम पहा.',
    subtitleEnglish: 'Rich cultural legacy, folk celebrations, and community harmony.',
    ctaTextMarathi: 'गावातील कार्यक्रम पहा',
    ctaTextEnglish: 'View Events',
    ctaLink: 'events',
    isActive: true,
    order: 3
  },
  {
    id: 'slide-nature-blank',
    type: 'custom',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80',
    showTextOverlay: false,
    badgeMarathi: '',
    badgeEnglish: '',
    titleMarathi: '',
    titleEnglish: '',
    subtitleMarathi: '',
    subtitleEnglish: '',
    ctaTextMarathi: '',
    ctaTextEnglish: '',
    ctaLink: '',
    isActive: true,
    order: 4
  }
];

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
