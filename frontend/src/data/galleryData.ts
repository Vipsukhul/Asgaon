import type { GalleryItem } from '../types';

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    titleMarathi: 'गोसीखुर्द कालवा व आसगाव हरित शिवार',
    titleEnglish: 'Gosikhurd Canal & Lush Green Asgaon',
    category: 'agriculture',
    descriptionMarathi: 'पवनी तालुक्यातील बारमाही कालवा आवर्तन. रब्बी आणि खरीप हंगामासाठी मुबलक जलसिंचन व बागायती शेतीची समृद्धी.',
    descriptionEnglish: 'Perennial irrigation release from Khadakwasla / Gosikhurd canals empowering double-crop farming across Asgaon.',
    location: 'आसगाव शिवार, सेक्टर २',
    date: 'जानेवारी २०२६',
    credit: 'ग्रामपंचायत संकलन',
    isFeatured: true,
    order: 1
  },
  {
    id: 'gal-2',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
    titleMarathi: 'वार्षिक खंडोबा यात्रा व सांस्कृतिक महोत्सव',
    titleEnglish: 'Annual Khandoba Yatra & Cultural Festival',
    category: 'festival',
    descriptionMarathi: 'गावातील शतकानुशतके चालत आलेली पारंपरिक यात्रा, लोककला, भजन कीर्तन आणि सामाजिक एकात्मतेचा भव्य सोहळा.',
    descriptionEnglish: 'Centuries-old village temple fair celebrating regional folk culture, bhajans, and community solidarity.',
    location: 'ग्रामदैवत खंडोबा मंदिर परिसर',
    date: 'डिसेंबर २०२५',
    credit: 'ग्राम सांस्कृतिक समिती',
    isFeatured: true,
    order: 2
  },
  {
    id: 'gal-3',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80',
    titleMarathi: 'आधुनिक ग्राम सचिवालय व नागरी सुविधा केंद्र',
    titleEnglish: 'Modern Gram Sachivalaya & CSC Hub',
    category: 'development',
    descriptionMarathi: 'सौर ऊर्जेवर चालणारी संगणकीकृत इमारत, डिजिटल ७/१२ दाखले, हाय-स्पीड वायफाय व वातानुकूलित अभ्यासिका कक्ष.',
    descriptionEnglish: 'Solar-powered smart Panchayat Bhavan providing 100% digital citizen certs, Wi-Fi, and public e-library.',
    location: 'मध्यवर्ती चौक, आसगाव',
    date: 'ऑक्टोबर २०२५',
    credit: 'ग्रामविकास विभाग',
    isFeatured: true,
    order: 3
  },
  {
    id: 'gal-4',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80',
    titleMarathi: 'सुवर्ण धान्याची कापणी व समृद्ध शेतकरी',
    titleEnglish: 'Golden Paddy Harvest Season',
    category: 'agriculture',
    descriptionMarathi: 'पवनी परिसरातील उच्च प्रतीचा वाण भात व हरभरा पीक. आधुनिक यंत्रसामग्रीद्वारे सामुदायिक कापणीची लगबग.',
    descriptionEnglish: 'High-yield aromatic rice and grain cultivation harvested using modern tractor and combine harvester machinery.',
    location: 'पूर्वेकडील शिवार',
    date: 'नोव्हेंबर २०२५',
    credit: 'कृषी सहाय्यक केंद्र',
    isFeatured: true,
    order: 4
  },
  {
    id: 'gal-5',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
    titleMarathi: 'जिल्हा परिषद डिजिटल स्मार्ट प्राथमिक शाळा',
    titleEnglish: 'Zilla Parishad Digital Smart School',
    category: 'community',
    descriptionMarathi: 'इंटरॅक्टिव्ह स्मार्ट बोर्ड, सौर ऊर्जा, क्रीडांगण व मोफत संगणक शिक्षणाने सुसज्ज असलेली आसगावची आदर्श शाळा.',
    descriptionEnglish: 'Interactive smart boards, green playground, and digital education desk empowering young village students.',
    location: 'शाळा परिसर, वॉर्ड क्र. १',
    date: 'फेब्रुवारी २०२६',
    credit: 'शिक्षण समिती आसगाव',
    isFeatured: true,
    order: 5
  },
  {
    id: 'gal-6',
    imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=80',
    titleMarathi: 'वैनगंगा खोऱ्यातील विहंगम सायंकाळ व निसर्ग',
    titleEnglish: 'Wainganga Basin Scenic Sunset & Nature',
    category: 'nature',
    descriptionMarathi: 'आसगावच्या सीमेवरून वाहणाऱ्या वैनगंगा नदीचे पाणलोट क्षेत्र व विहंगम निसर्गसौंदर्य. शांत व निसर्गरम्य परिसर.',
    descriptionEnglish: 'Tranquil evening sunset over the natural wetlands and river basin flanking the scenic boundary of Asgaon.',
    location: 'वैनगंगा पाणलोट क्षेत्र',
    date: 'जानेवारी २०२६',
    credit: 'निसर्ग मित्र मंडळ',
    isFeatured: true,
    order: 6
  }
];

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
