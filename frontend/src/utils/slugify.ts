/**
 * Utility for generating SEO-friendly, clean URL slugs for blogs and articles.
 * Supports Marathi (Devanagari) transliteration to clean Romanized English slugs.
 */

// Common Marathi words mapped to clean English terms for readable URLs
const MARATHI_WORD_MAP: Record<string, string> = {
  घरकुल: 'gharkul',
  योजना: 'yojana',
  आसगाव: 'asgaon',
  शेतकरी: 'shetkari',
  शेती: 'sheti',
  कृषी: 'krishi',
  कापूस: 'kapus',
  धान: 'dhan',
  भात: 'bhat',
  पवनी: 'pauni',
  भंडारा: 'bhandara',
  सातबारा: 'satbara',
  उतारा: 'utara',
  माहिती: 'mahiti',
  ग्रामपंचायत: 'grampanchayat',
  ग्रामसभा: 'gramsabha',
  पाणी: 'pani',
  रस्ता: 'rasta',
  आरोग्य: 'arogya',
  शिक्षण: 'shikshan',
  बँक: 'bank',
  कर्ज: 'karja',
  बाजार: 'bazaar',
  भाव: 'bhav',
  लाडकी: 'ladki',
  बहीण: 'bahin',
  एसटी: 'st',
  बस: 'bus',
  वेळापत्रक: 'timetable',
  अनुदान: 'anudan',
  अर्ज: 'arja',
  दस्तऐवज: 'documents',
  कागदपत्रे: 'documents',
  रोग: 'disease',
  नियंत्रण: 'control',
  खते: 'fertilizer',
  पीक: 'crop',
  सल्ला: 'advisory',
  मार्गदर्शक: 'guide',
  नवीन: 'new',
  नियम: 'rules',
  पात्रता: 'eligibility',
  मदत: 'help'
};

// Character-by-character transliteration for Marathi / Devanagari
const DEVANAGARI_CHAR_MAP: Record<string, string> = {
  // Vowels
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
  'ऋ': 'ru', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah',
  // Consonants
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h', 'ळ': 'l',
  'क्ष': 'ksh', 'ज्ञ': 'dny',
  // Matras (Vowel signs)
  'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ru',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'm', '्': '', 'ः': 'h',
  'ॅ': 'a', 'ॉ': 'o'
};

/**
 * Converts a title (Marathi, English, or mixed) into a clean, human-readable URL slug.
 * Example: "घरकुल योजना २०२६: आसगाव" -> "gharkul-yojana-2026-asgaon"
 */
export function generateBlogSlug(title: string, options?: { appendHash?: boolean }): string {
  if (!title || !title.trim()) {
    return `blog-${Date.now().toString().slice(-6)}`;
  }

  let text = title.trim();

  // 1. Replace known common Marathi words with standard English equivalents
  for (const [marathiWord, englishWord] of Object.entries(MARATHI_WORD_MAP)) {
    const regex = new RegExp(marathiWord, 'g');
    text = text.replace(regex, ` ${englishWord} `);
  }

  // 2. Character-level transliteration for remaining Devanagari characters
  let transliterated = '';
  for (const char of text) {
    if (DEVANAGARI_CHAR_MAP[char]) {
      transliterated += DEVANAGARI_CHAR_MAP[char];
    } else {
      transliterated += char;
    }
  }

  // 3. Normalize English and numbers
  let slug = transliterated
    .toLowerCase()
    // Replace non-alphanumeric characters with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Replace consecutive hyphens with single hyphen
    .replace(/-+/g, '-')
    // Trim hyphens from start and end
    .replace(/^-+|-+$/g, '');

  // 4. Ensure it's not empty and reasonable length
  if (!slug || slug.length < 3) {
    slug = `asgaon-blog-${Date.now().toString().slice(-6)}`;
  } else if (slug.length > 70) {
    // Truncate cleanly at a word boundary
    slug = slug.substring(0, 70).replace(/-[^-]*$/, '');
  }

  // 5. Optionally append a short unique hash for collision avoidance
  if (options?.appendHash) {
    const hash = Math.random().toString(36).substring(2, 6);
    slug = `${slug}-${hash}`;
  }

  return slug;
}
