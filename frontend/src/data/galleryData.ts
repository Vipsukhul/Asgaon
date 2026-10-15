import type { GalleryItem } from '../types';
import { api } from '../services/api';

// Sync directly from PostgreSQL Database on application start
if (typeof window !== 'undefined') {
  api.getGalleryImages().then((res: any) => {
    const list = Array.isArray(res) ? res : (res?.data || []);
    if (list.length > 0) {
      const items: GalleryItem[] = list.map((g: any) => ({
        id: g.id,
        imageUrl: g.imageUrl,
        titleMarathi: g.titleMarathi,
        titleEnglish: g.titleEnglish || '',
        category: g.category,
        descriptionMarathi: g.descriptionMarathi || '',
        descriptionEnglish: g.descriptionEnglish || '',
        location: g.location || '',
        date: g.eventDate || '',
        credit: g.credit || '',
        isFeatured: g.isFeatured ?? true,
        order: g.displayOrder || 1
      }));
      localStorage.setItem('dg_gallery_items', JSON.stringify(items));
      window.dispatchEvent(new CustomEvent('dg:gallery-updated', { detail: items }));
    }
  }).catch(() => {});
}

// Default array emptied - data loaded dynamically from PostgreSQL database via /api/v1/gallery
export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [];

export function getStoredGalleryItems(): GalleryItem[] {
  const saved = localStorage.getItem('dg_gallery_items');
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
  return DEFAULT_GALLERY_ITEMS;
}

export function saveStoredGalleryItems(items: GalleryItem[]): void {
  localStorage.setItem('dg_gallery_items', JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('dg:gallery-updated', { detail: items }));
}
