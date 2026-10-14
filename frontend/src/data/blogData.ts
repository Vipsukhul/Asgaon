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

const GHARKUL_COMMENTS: BlogComment[] = [
  {
    id: 'c-1',
    blogSlug: 'a8d4e2f9',
    authorName: 'ज्ञानेश्वर बावणकर',
    authorRole: 'शेतकरी, प्रभाग १',
    content: 'खूप उपयुक्त माहिती! ग्रामपंचायतीत नमुना ८-अ उतारा काढण्यासाठी काय शुल्क लागते का?',
    timestamp: '२ तासांपूर्वी',
    timestampISO: '2026-10-07T14:30:00Z',
    likesCount: 6
  },
  {
    id: 'c-2',
    blogSlug: 'a8d4e2f9',
    authorName: 'ग्रामसेवक कार्यालय आसगाव',
    authorRole: 'अधिकृत प्रतिनिधी',
    content: 'ज्ञानेश्वरजी, ग्रामपंचायत कार्यालयात नाममात्र ₹२० शासकीय पावतीवर नमुना ८-अ संगणकीय प्रत दिली जाते. सोमवार किंवा गुरुवारी कार्यालयात यावे.',
    timestamp: '१ तासापूर्वी',
    timestampISO: '2026-10-07T15:15:00Z',
    likesCount: 14
  }
];

const SATBARA_COMMENTS: BlogComment[] = [
  {
    id: 'c-3',
    blogSlug: 'b3f7a1c8',
    authorName: 'अतुल मेश्राम',
    authorRole: 'विद्यार्थी व तरुण शेतकरी',
    content: 'मी महाभूमी पोर्टलवरून ₹१५ भरून ७/१२ डाऊनलोड केला, बँक ऑफ इंडियाने पीक कर्जासाठी तात्काळ स्वीकारला!',
    timestamp: 'काल',
    timestampISO: '2026-10-06T10:00:00Z',
    likesCount: 19
  }
];

const BUS_COMMENTS: BlogComment[] = [
  {
    id: 'c-4',
    blogSlug: '9e2d6b4a',
    authorName: 'मंगलाताई भोयर',
    authorRole: 'आसगाव नागरिक',
    content: 'सकाळी ०६:४५ ची पवनी बस वेळेवर येते. महिला सन्मान योजनेमुळे फक्त १० रुपयात पवनी पोहोचता येते.',
    timestamp: '३ दिवसांपूर्वी',
    timestampISO: '2026-10-04T08:30:00Z',
    likesCount: 11
  }
];

export const DEFAULT_BLOG_COMMENTS: Record<string, BlogComment[]> = {
  'c7f9e2b1': [],
  'how-to-write-and-publish-community-blogs': [],
  'a8d4e2f9': GHARKUL_COMMENTS,
  'gharkul-yojana-2026-online-form-eligibility-asgaon': GHARKUL_COMMENTS,
  'b3f7a1c8': SATBARA_COMMENTS,
  'how-to-download-digital-712-satbara-mahabhumi-guide': SATBARA_COMMENTS,
  '9e2d6b4a': BUS_COMMENTS,
  'pauni-bhandara-msrtc-bus-schedule-pass-concessions': BUS_COMMENTS
};

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'c7f9e2b1',
    slug: 'how-to-write-and-publish-community-blogs',
    title: 'How to Write and Publish Community Blogs on Asgaon Portal: Complete Author Guide',
    titleMarathi: 'आसगाव पोर्टलवर माहिती लेख व ब्लॉग कसा लिहावा? संपूर्ण लेखक मार्गदर्शक व पद्धत',
    excerpt: 'Step-by-step guide for Asgaon citizens, farmers, youth, and village leaders on how to write, format, and publish  with zero complexity.',
    excerptMarathi: 'आसगाव गावातील शेतकरी, विद्यार्थी व ग्रामस्थांसाठी पोर्टलवर स्वतःचे शेती सल्ले, अनुभव व माहिती लेख कसे लिहावेत? साधी पद्धत, नियम व लेखनाची संपूर्ण माहिती.',
    content: `
### आसगाव पोर्टलवर लेख का लिहावा? (Why Write on Asgaon Portal?)
आसगाव हे डिजिटल ग्रामपंचायत व स्वावलंबी गाव म्हणून पुढे येत आहे. गावातील शेतकऱ्यांचा प्रत्यक्ष अनुभव, खरीप-रब्बी पिकांचे चालू भाव, शासकीय योजना मिळवताना आलेले अनुभव किंवा गावातील उपयुक्त उपक्रम इतर गावकऱ्यांपर्यंत पोहोचवण्यासाठी हे खुले ज्ञानपीठ सुरू करण्यात आले आहे.

---

### कोणकोणत्या विषयांवर तुम्ही लेख लिहू शकता? (Topics You Can Write On)
1. **कृषी व शेती सल्ला (Agriculture & Crops):**
   - धान, कापूस, सोयाबीन, मिरची लागवड व फवारणीचे स्वतःचे प्रत्यक्ष अनुभव.
   - पवनी व भंडारा कृषी उत्पन्न बाजार समितीतील (APMC Mandi) चालू बाजारभाव व विक्री अनुभव.
2. **शासकीय योजनांचा मार्गदर्शक (Govt Schemes Guidance):**
   - घरकुल योजना (PMAY, रमाई, मोदी आवास), लाडकी बहीण योजना, पीएम किसान, नमो शेतकरी योजनांचा प्रत्यक्ष लाभ कसा घेतला?
3. **प्रशासन व गाव सेवा (Gram Panchayat & Civic Life):**
   - ग्रामसभा ठराव, गाव स्वच्छता, नळ पाणी योजना, डिजिटल सातबारा व ग्रामपंचायत नमुना ८-अ उतारा काढण्याची सोपी माहिती.
4. **शिक्षण, करिअर व युवक (Education & Youth):**
   - पवनी व भंडारा परिसरातील शाळा-कॉलेज प्रवेश, शिष्यवृत्ती, स्पर्धा परीक्षा व स्थानिक रोजगाराच्या संधी.
5. **गाव संस्कृती, सण व क्रीडा (Village Heritage & Sports):**
   - आसगावची मंडई, पोळा सण, गावच्या क्रीडा स्पर्धा व गुणवंत विद्यार्थ्यांचे कौतुक.

---

### लेख कसा लिहावा? (Simple Step-by-Step Writing Process)
1. **पोर्टलवर 'नवीन लेख लिहा' बटणावर क्लिक करा:**
   - ब्लॉग्स पेजवर किंवा होमपेजवरून थेट **"नवीन लेख लिहा (Write Blog)"** पेज उघडा.
2. **मराठी शीर्षक टाका (Title):**
   - वाचकाला लगेच समजेल असे साधे व स्पष्ट शीर्षक लिहा (उदा. *कापूस वेचणी व भाव: आसगाव शेतकऱ्यांचा प्रत्यक्ष अनुभव*).
3. **विभाग निवडा (Choose Category):**
   - शेती, शासकीय योजना, प्रशासन, शिक्षण किंवा आरोग्य यापैकी योग्य पर्याय निवडा.
4. **कव्हर फोटो निवडा (Cover Photo):**
   - दिलेल्या सुंदर फोटोंमधून एक फोटो निवडा किंवा स्वतःचा फोटो लिंक टाका.
5. **मजकूर सोप्या भाषेत लिहा (Write Content):**
   - मुख्य मुद्द्यांचे मथळे देण्यासाठी \`### मथळा\` वापरा.
   - मुद्द्यांसाठी \`- मुद्दा\` किंवा \`1. क्रमांक\` वापरा.
   - महत्त्वाची सूचना देण्यासाठी \`> सूचना\` वापरा.
6. **'लेख प्रसिद्ध करा' बटण दाबा:**
   - एका सेकंदात तुमचा लेख प्रसिद्ध होतो आणि गावातील सर्व नागरिकांना वाचण्यासाठी उपलब्ध होतो!

---

### नियम व आचारसंहिता (Community Guidelines):
- **सत्य व प्रामाणिक माहिती द्या:** कोणत्याही अफवा, खोटी माहिती किंवा कोणाची बदनामी करणारा मजकूर लिहू नये.
- **सर्व ग्रामस्थांसाठी आदरयुक्त भाषा वापरा:** गावातील एकता व विकास वाढवणारे विचार मांडा.
- **अधिकृत लॉगिन जोडा:** लॉगिन करून लेख लिहिल्यास तुमच्या नावापुढे अधिकृत सत्यापनाचे चिन्ह (Verified Citizen) दिसते.

> **तयार आहात?** आजच तुमचा पहिला लेख लिहून गावाच्या प्रगतीमध्ये तुमचे योगदान द्या! ब्लॉग्स पेजवरील 'नवीन लेख लिहा' बटणावर क्लिक करा.
`,
    contentMarathi: `
### आसगाव पोर्टलवर लेख का लिहावा?
आसगाव हे डिजिटल ग्रामपंचायत व स्वावलंबी गाव म्हणून पुढे येत आहे. गावातील शेतकऱ्यांचा प्रत्यक्ष अनुभव, खरीप-रब्बी पिकांचे चालू भाव, शासकीय योजना मिळवताना आलेले अनुभव किंवा गावातील उपयुक्त उपक्रम इतर गावकऱ्यांपर्यंत पोहोचवण्यासाठी हे खुले ज्ञानपीठ सुरू करण्यात आले आहे.

---

### कोणकोणत्या विषयांवर तुम्ही लेख लिहू शकता?
१. **कृषी व शेती सल्ला:** धान, कापूस, सोयाबीन, मिरची लागवड व फवारणीचे स्वतःचे प्रत्यक्ष अनुभव.
२. **शासकीय योजनांचा मार्गदर्शक:** घरकुल योजना (PMAY, रमाई, मोदी आवास), लाडकी बहीण योजना, पीएम किसान, नमो शेतकरी योजनांचा प्रत्यक्ष लाभ कसा घेतला?
३. **प्रशासन व गाव सेवा:** ग्रामसभा ठराव, गाव स्वच्छता, नळ पाणी योजना, डिजिटल सातबारा व ग्रामपंचायत नमुना ८-अ उतारा काढण्याची सोपी माहिती.
४. **शिक्षण, करिअर व युवक:** पवनी व भंडारा परिसरातील शाळा-कॉलेज प्रवेश, शिष्यवृत्ती, स्पर्धा परीक्षा व स्थानिक रोजगाराच्या संधी.
५. **गाव संस्कृती, सण व क्रीडा:** आसगावची मंडई, पोळा सण, गावच्या क्रीडा स्पर्धा व गुणवंत विद्यार्थ्यांचे कौतुक.

---

### लेख कसा लिहावा? साधी पद्धत:
१. पोर्टलवर **'नवीन लेख लिहा'** बटणावर क्लिक करा.
२. लेखाचे मराठी शीर्षक टाका.
३. शेती, योजना किंवा इतर योग्य विभाग निवडा.
४. कव्हर फोटो निवडा.
५. तुमचा अनुभव किंवा माहिती सविस्तर लिहा.
६. 'लेख प्रसिद्ध करा' वर क्लिक करा. तुमचा लेख लगेच प्रसिद्ध होईल!

---

### नियम व आचारसंहिता:
- केवळ सत्य व प्रामाणिक माहिती द्या. कोणत्याही अफवा पसरवू नका.
- गावातील शेतकरी व नागरिकांना उपयोगी पडेल असाच मजकूर लिहा.
`,
    category: 'Governance',
    categoryMarathi: 'प्रशासन व सेवा',
    author: 'आसगाव डिजिटल मंच संपादक मंडळ',
    authorRole: 'Editorial Team',
    authorRoleMarathi: 'संपादक कक्ष, आसगाव',
    publishDate: '०८ ऑक्टोबर २०२६',
    publishDateISO: '2026-10-08',
    readTimeMinutes: 3,
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    tags: ['How to write blog', 'Asgaon author guide', 'ब्लॉग कसा लिहावा', 'आसगाव लेखक मार्गदर्शक'],
    tagsMarathi: ['ब्लॉग कसा लिहावा', 'लेखक मार्गदर्शक', 'आसगाव माहिती', 'नागरिक संपादन'],
    seoTitle: 'How to Write Blogs on Asgaon Portal | आसगाव माहिती लेख कसा लिहावा?',
    seoDescription: 'आसगाव ग्रामस्थांसाठी पोर्टलवर स्वतःचे शेती सल्ले, अनुभव व माहिती लेख कसे लिहावेत? साधी पद्धत, नियम व लेखनाची संपूर्ण माहिती.',
    seoKeywords: 'How to write blog Asgaon, Village blogging guide, आसगाव लेख कसा लिहावा, माहिती लेख नियम',
    isFeatured: true,
    viewCount: 2450
  },
  {
    id: 'a8d4e2f9',
    slug: 'gharkul-yojana-2026-online-form-eligibility-asgaon',
    title: 'Gharkul Housing Scheme 2026: Complete Application Guide & Document Checklist for Asgaon',
    titleMarathi: 'घरकुल योजना २०२६: आसगाव ग्रामस्थांसाठी संपूर्ण अर्ज प्रक्रिया, पात्रता व कागदपत्रे',
    excerpt: 'Step-by-step guide on how rural beneficiaries in Asgaon (Pauni, Bhandara) can apply for Ramai, Shabari, Modi Awas, and PMAY-G housing schemes with zero middlemen.',
    excerptMarathi: 'रमाई, शबरी, मोदी आवास व प्रधानमंत्री आवास योजना-ग्रामीण (PMAY-G) अंतर्गत ₹१.५७ लाख घरकुल अनुदान कसे मिळवावे? संपूर्ण अर्ज पद्धती व कागदपत्रांची यादी.',
    content: `
### Overview of Gharkul Housing Schemes in Asgaon
Every homeless family and those living in kutcha (mud/thatch) houses in Asgaon Gram Panchayat are entitled to concrete housing under Maharashtra Rural Housing Mission. Under Central & State convergence, eligible families receive up to **₹1,57,000 in total financial benefits**:
- **₹1,20,000 to ₹1,30,000**: Direct DBT grant credited in 4 construction milestones (Plinth, Lintel, Roof slab, Completion).
- **₹25,000+**: 90 days of guaranteed labor wages under MGNREGA (मनरेगा).
- **₹12,000**: Swachh Bharat Mission (ग्रामीण शौचालय) individual latrine grant.

---

### Which Scheme is Applicable to You?
1. **रमाई आवास योजना (Ramai Awas):** For Scheduled Caste (SC / नवबौद्ध) families having annual income up to ₹1,00,000.
2. **शबरी आदिवासी घरकुल (Shabari Awas):** For Scheduled Tribe (ST) beneficiaries living in rural hamlet settlements.
3. **मोदी आवास घरकुल योजना (Modi Awas):** Specially launched for Other Backward Class (OBC / विमुक्त जाती / भटक्या जमाती) families without pukka houses.
4. **PMAY-Gramin (प्रधानमंत्री आवास ग्रामीण):** Based on SECC deprivation census list verified by Gram Sabha.

---

### Mandatory Documents Required (कागदपत्रे):
- **नमुना ८-अ उतारा (Gram Panchayat Property Register Extract)** issued by Asgaon Gram Sevak.
- **सहमती पत्र किंवा जागा मालकी पुरावा** (Self-owned plot or Gram Panchayat land allotment certificate).
- **आधार कार्ड व मतदान ओळखपत्र** (Family head and spouse).
- **सक्षम अधिकाऱ्याचा जातीचा दाखला** (Sub-Divisional Officer / Tehsildar Caste Certificate).
- **तहसीलदार उत्पन्नाचा दाखला** (Income certificate below ₹1.2 Lakh).
- **बँक पासबुक झेरॉक्स** (Aadhaar Seeded / NPCI Direct Benefit Transfer enabled account).
- **सध्याच्या कच्च्या घराचा जिओ-टॅग फोटो** (Current kutcha house photograph with GPS coordinates).

---

### How to Apply in Asgaon Gram Panchayat:
1. **Visit the Gram Panchayat Office:** Contact the Gram Sevak (ग्रामसेवक) or Sarpanch on Monday or Thursday village office hours.
2. **Gram Sabha Verification (ग्रामसभा ठराव):** The Gram Sabha scrutinizes the beneficiary priority list (प्रतीक्षा यादी).
3. **Online Geo-Tagging:** The Village Housing Officer takes geo-tagged photos of your site using the AwaasApp.
4. **Direct DBT Credit:** Installment payments are transferred directly into your Bank of India / Bhandara DCC Bank account.

> **महत्त्वाची सूचना:** घरकुल मंजूर करण्यासाठी कोणालाही एक रुपयाही लाच देऊ नका. कोणतीही अडचण आल्यास बीडीओ (BDO) कार्यालय, पंचायत समिती पवनी किंवा जिल्हा ग्रामीण विकास यंत्रणा (DRDA) भंडारा येथे तक्रार नोंदवा.
`,
    contentMarathi: `
### आसगाव ग्रामपंचायत घरकुल योजना आढावा
आसगाव (ता. पवनी, जि. भंडारा) मधील बेघर व कच्च्या घरात राहणाऱ्या प्रत्येक कुटुंबासाठी हक्काचे पक्के घर उपलब्ध करून देण्यासाठी केंद्र व राज्य शासनाच्या विविध योजना कार्यरत आहेत. या योजनेतून लाभार्थ्याला एकूण **₹१,५७,०००** पर्यंत आर्थिक मदत थेट बँक खात्यात मिळते:
- **₹१,२०,००० ते ₹१,३०,०००:** घरकुल बांधकाम अनुदान (४ टप्प्यांत थेट DBT).
- **₹२५,०००+:** मनरेगा अंतर्गत ९० दिवसांची मजुरी हजेरी.
- **₹१२,०००:** स्वच्छ भारत मिशन ग्रामीण शौचालय बांधकाम अनुदान.

---

### कोणती योजना कोणासाठी आहे?
१. **रमाई आवास योजना:** अनुसूचित जाती (SC) व नवबौद्ध प्रवर्गातील कुटुंबांसाठी.
२. **शबरी आदिवासी घरकुल:** अनुसूचित जमाती (ST) प्रवर्गातील आदिवासी कुटुंबांसाठी.
३. **मोदी आवास योजना:** इतर मागास प्रवर्ग (OBC), भटके विमुक्त प्रवर्गासाठी विशेष घरकुल योजना.
४. **PMAY-ग्रामीण:** सामाजिक व आर्थिक जनगणनेतील पात्र कुटुंबांसाठी.

---

### आवश्यक कागदपत्रांची यादी:
१. ग्रामपंचायत नमुना ८-अ उतारा (घरपट्टी पावतीसह).
२. स्वतःच्या जागेचा पुरावा किंवा ग्रामपंचायत संमती पत्र.
३. आधार कार्ड व रेशन कार्ड झेरॉक्स.
४. तहसीलदार यांचा जातीचा दाखला व चालू वर्षाचा उत्पन्नाचा दाखला.
५. राष्ट्रीयकृत किंवा जिल्हा मध्यवर्ती बँकेचे पासबुक (आधार लिंक असलेले).
६. सध्याच्या कच्च्या घराचा फोटो.

---

### अर्ज कसा करावा?
- आसगाव ग्रामपंचायत कार्यालयात ग्रामसेवक यांच्याकडे विहित नमुन्यातील अर्ज सादर करावा.
- ग्रामसभेत नाव मंजूर झाल्यानंतर 'आवास सॉफ्ट' (AwaasSoft) वर नोंदणी होते व पहिला हप्ता मिळतो.
`,
    category: 'Schemes',
    categoryMarathi: 'शासकीय योजना',
    author: 'ग्रामसेवक कार्यालय, आसगाव',
    authorRole: 'Village Development Officer',
    authorRoleMarathi: 'ग्राम विकास अधिकारी, आसगाव',
    publishDate: '०५ ऑक्टोबर २०२६',
    publishDateISO: '2026-10-05',
    readTimeMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gharkul Yojana', 'Ramai Awas', 'PMAY-G', 'Modi Awas', 'Asgaon Housing'],
    tagsMarathi: ['घरकुल योजना', 'रमाई आवास', 'मोदी आवास', 'आसगाव घरकुल', 'कागदपत्रे'],
    seoTitle: 'Gharkul Yojana 2026 Asgaon: Eligibility, Online Form, Documents | घरकुल योजना',
    seoDescription: 'आसगाव ग्रामपंचायत घरकुल योजना २०२६ - रमाई आवास, शबरी, मोदी आवास व PMAY-G अंतर्गत ₹१.५७ लाख अनुदान मिळवण्यासाठी पात्रता, कागदपत्रे व संपूर्ण अर्ज पद्धत.',
    seoKeywords: 'Gharkul yojana Asgaon, Ramai awas yojana Bhandara, Modi awas form Pauni, PMAY Gramin eligibility Maharashtra, घरकुल योजना आसगाव कागदपत्रे',
    isFeatured: true,
    viewCount: 1420,
    faqs: [
      {
        question: 'घरकुल योजनेत एकूण किती अनुदान मिळते?',
        answer: 'घरकुल बांधकामासाठी ₹१,२०,००० ते ₹१,३०,००० थेट अनुदान, मनरेगा मजुरी ₹२५,००० आणि शौचालय अनुदान ₹१२,००० मिळून एकूण ₹१.५७ लाखांपर्यंत सहाय्य मिळते.'
      },
      {
        question: 'आसगावमध्ये घरकुलासाठी अर्ज कोणाकडे करावा?',
        answer: 'आसगाव ग्रामपंचायत कार्यालयात ग्रामसेवक किंवा संगणक परिचालक यांच्याकडे विहित नमुन्यात कागदपत्रांसह अर्ज सादर करावा लागतो.'
      }
    ]
  },
  {
    id: 'b3f7a1c8',
    slug: 'how-to-download-digital-712-satbara-mahabhumi-guide',
    title: 'How to Download Digital 7/12 & 8-A Utara in Asgaon: Mahabhumi Step-by-Step Guide',
    titleMarathi: 'डिजिटल ७/१२ व ८-अ उतारा मोबाईलवर कसा डाऊनलोड करावा? महाभूमी संपूर्ण मार्गदर्शक',
    excerpt: 'Comprehensive guide for Asgaon farmers on downloading digitally signed 7/12 (Satbara) & 8-A land records from Mahabhumi without visiting the Talathi office.',
    excerptMarathi: 'आसगाव व परिसरातील शेतकऱ्यांसाठी तलाठी कार्यालयात न जाता मोबाईलवरून डिजिटल स्वाक्षरीत ७/१२, ८-अ व फेरफार उतारा कसा डाऊनलोड करावा याची सोपी पद्धत.',
    content: `
### Digital Satbara (डिजिटल स्वाक्षरीत ७/१२) Overview
In Maharashtra, farmers no longer need to stand in queues at the Talathi office to get a certified 7/12 extract for crop loans (पीक कर्ज), PM-Kisan verification, or court matters. 

The Revenue Department of Maharashtra issues **Digitally Signed 7/12 (डिजिटल स्वाक्षरीत ७/१२)** via the Mahabhumi portal (\`digitalsatbara.mahabhumi.gov.in\`). This PDF contains an encrypted digital signature of the Sub-Divisional Land Records Officer and is **100% legally valid across all banks, courts, and government departments** under Section 4 of the Information Technology Act.

---

### Administrative Hierarchy for Asgaon (महसूल तपशील):
When selecting your village on Mahabhumi, choose:
- **विभाग (Division):** नागपूर (Nagpur)
- **जिल्हा (District):** भंडारा (Bhandara)
- **तालुका (Taluka):** पवनी (Pauni)
- **गाव (Village):** आसगाव (Asgaon)

---

### Method 1: Free View (बिनस्वाक्षरीत ७/१२ - ₹०)
If you only need to check your land records, crop entries (पिकांची नोंद), or boundary names:
1. Visit the official MahaBhulekh portal: \`bhulekh.mahabhumi.gov.in\`.
2. Select **नागपूर विभाग** and click Proceed.
3. Select **भंडारा** district, **पवनी** taluka, and **आसगाव** village.
4. Search by:
   - **सर्व्हे नंबर / गट नंबर** (Survey / Gat Number)
   - **पहिले नाव / आडनाव** (First Name / Last Name)
5. Enter the Captcha code to view your 7/12 extract instantly on your mobile screen.

---

### Method 2: Official Certified 7/12 PDF (डिजिटल स्वाक्षरीत - ₹१५)
For bank loans, subsidy schemes, or registry work:
1. Open \`digitalsatbara.mahabhumi.gov.in\`.
2. Create a free citizen login using your mobile number and OTP.
3. Recharge your citizen wallet with ₹15 via UPI (PhonePe, GPay, Paytm).
4. Select **जिल्हा: भंडारा, तालुका: पवनी, गाव: आसगाव**.
5. Enter your **Gat Number (गट क्र.)**.
6. Click **Download 7/12**. A QR-coded, digitally signed PDF is downloaded instantly to your phone.

---

### Assistance in Asgaon:
If you need physical printouts or facing difficulty with online OTPs, visit:
- **साई समर्थ महा-ई-सेवा केंद्र (Sai Samarth CSC Center)**, Main Bazaar Chowk, Asgaon.
- **तलाठी कार्यालय (Talathi Office), आसगाव सज्जा**.
`,
    contentMarathi: `
### डिजिटल ७/१२ व ८-अ उतारा का महत्त्वाचा?
महाराष्ट्र शासनाने भूमी अभिलेख विभागामार्फत सर्व शेतजमिनींचे रेकॉर्ड्स संगणकीकृत केले आहेत. आता पीक कर्ज, शासकीय योजना (पीएम-किसान, नमो शेतकरी) किंवा न्यायालयीन कामासाठी तलाठ्यांची सही घेण्याची गरज उरलेली नाही.

**डिजिटल स्वाक्षरीत ७/१२ व ८-अ उतारा** हा कायदेशीरदृष्ट्या १००% वैध मानला जातो.

---

### आसगावसाठी महसूल माहिती:
- **विभाग:** नागपूर विभाग
- **जिल्हा:** भंडारा
- **तालुका:** पवनी
- **गाव:** आसगाव

---

### मोफत ७/१२ पाहण्याची पद्धत (महाभूलेख):
१. \`bhulekh.mahabhumi.gov.in\` या संकेतस्थळावर जा.
२. 'नागपूर विभाग' निवडून जिल्हा 'भंडारा', तालुका 'पवनी' व गाव 'आसगाव' निवडा.
३. आपला गट नंबर किंवा नाव टाकून मोफत ७/१२ तपासा.

---

### अधिकृत कायदेशीर ७/१२ डाऊनलोड (रु. १५):
१. \`digitalsatbara.mahabhumi.gov.in\` वर मोबाईल नंबरने लॉगिन करा.
२. १५ रुपये UPI द्वारे भरून आसगाव गावाचा गट नंबर टाका.
३. डिजिटल स्वाक्षरी असलेला QR कोडयुक्त ७/१२ डाऊनलोड करा.
`,
    category: 'Agriculture',
    categoryMarathi: 'कृषी व शेती',
    author: 'आसगाव महसूल सहाय्य कक्ष',
    authorRole: 'Revenue Helpdesk',
    authorRoleMarathi: 'महसूल माहिती कक्ष, आसगाव',
    publishDate: '०२ ऑक्टोबर २०२६',
    publishDateISO: '2026-10-02',
    readTimeMinutes: 4,
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    tags: ['Digital 7/12', 'Satbara Utara', 'Mahabhumi', 'Asgaon Farmers', 'Pauni Land Records'],
    tagsMarathi: ['डिजिटल ७/१२', 'सातबारा उतारा', 'महाभूमी', 'आसगाव शेतकरी', 'पवनी जमीन'],
    seoTitle: 'How to Download Digital 7/12 Satbara Asgaon Pauni: Mahabhumi Guide',
    seoDescription: 'आसगाव (पवनी, भंडारा) डिजिटल ७/१२ व ८-अ उतारा मोबाईलवर डाऊनलोड कसा करावा? महाभूमी पोर्टल, गट नंबर शोध व कायदेशीर डिजिटल स्वाक्षरी माहिती.',
    seoKeywords: 'Digital 7 12 Asgaon, Satbara utara download Bhandara, Mahabhumi Pauni, 8A utara online, डिजिटल सातबारा आसगाव',
    isFeatured: true,
    viewCount: 2180,
    faqs: [
      {
        question: 'डिजिटल स्वाक्षरीत ७/१२ ला तलाठ्यांच्या सहीची गरज असते का?',
        answer: 'नाही. डिजिटल स्वाक्षरीत ७/१२ वर इलेक्ट्रॉनिक क्यूआर कोड व डिजिटल स्वाक्षरी असते, ज्यामुळे तो सर्व बँका, न्यायालये व शासकीय कार्यालयात तलाठ्यांच्या प्रत्यक्ष सहीशिवाय १००% कायदेशीर वैध असतो.'
      },
      {
        question: 'डिजिटल ७/१२ चे शासकीय शुल्क किती आहे?',
        answer: 'शासकीय महाभूमी पोर्टलवरून डिजिटल स्वाक्षरीत प्रत डाऊनलोड करण्यासाठी केवळ ₹१५ शासकीय शुल्क आकारले जाते.'
      }
    ]
  },
  {
    id: '9e2d6b4a',
    slug: 'pauni-bhandara-msrtc-bus-schedule-pass-concessions',
    title: 'Asgaon to Pauni & Bhandara MSRTC ST Bus Guide: Timetable, Passes & 50% Women Discount',
    titleMarathi: 'आसगाव ते पवनी व भंडारा एसटी बस मार्गदर्शक: वेळापत्रक, मासिक पास व महिला ५०% सवलत',
    excerpt: 'All daily MSRTC bus timings connecting Asgaon to Pauni, Bhandara, and Nagpur with student monthly pass rules and 75+ free travel guidelines.',
    excerptMarathi: 'आसगाव ते पवनी, भंडारा, साकोली व नागपूर एसटी बसेसची अचूक वेळ, महिला सन्मान योजना ५०% तिकीट, अहिल्याबाई होळकर विद्यार्थिनी मोफत पास नियम.',
    content: `
### Rural Connectivity from Asgaon
Located in Pauni tehsil of Bhandara district, Asgaon is well-connected by Maharashtra State Road Transport Corporation (MSRTC / एसटी महामंडळ) buses operated primarily from **Pauni Depot (पवनी आगार)** and **Bhandara Central Depot (भंडारा मध्यवर्ती आगार)**.

Whether you are a student traveling daily to Pauni junior college, a farmer visiting Bhandara APMC, or an employee commuting to Nagpur, this guide covers complete route timings and government bus concession schemes.

---

### Popular Daily Bus Routes from Asgaon:
- **Asgaon ➜ Pauni (आसगाव ते पवनी):** 
  - Morning trips: **06:45 AM**, **10:30 AM**
  - Evening trips: **05:15 PM**
  - Fare: ₹20 (General) | ₹10 (Mahila 50% discount)
- **Asgaon ➜ Bhandara (आसगाव ते भंडारा):** 
  - Morning college special: **07:15 AM**
  - Afternoon trip: **12:15 PM**
  - Evening return: **06:30 PM**
  - Fare: ₹50 (General) | ₹25 (Mahila)
- **Asgaon ➜ Nagpur Ganeshpeth (आसगाव ते नागपूर):** 
  - Express trips: **08:00 AM**, **02:00 PM**
  - Night Shivshahi AC: **08:15 PM**
  - Fare: ₹115–₹180

---

### MSRTC Government Travel Concessions:
1. **महिला सन्मान योजना (Mahila Samman Yojana):**
   - 50% ticket discount on all Ordinary, Semi-Luxury (Asiad), and Express buses across Maharashtra.
   - No advance pass required; conductor issues discount ticket on spot.
2. **अमृत ज्येष्ठ नागरिक योजना (75+ Years):**
   - 100% free bus travel for all senior citizens aged 75 or above. Carry Aadhaar Card or Voter ID.
3. **अहिल्याबाई होळकर विद्यार्थिनी मोफत पास योजना:**
   - Free monthly pass for village girl students studying from 5th to 12th standard traveling from Asgaon to Pauni schools.
4. **कॉलेज विद्यार्थी सवलत पास (66.6% Discount):**
   - College & ITI students pay only 33.3% of monthly fare for daily study commute.

---

### MSRTC Contact Numbers:
- **पवनी आगार चौकशी (Pauni Depot Desk):** 07185-255342
- **भंडारा आगार (Bhandara Depot):** 07184-252431
- **महाराष्ट्र एसटी हेल्पलाइन (Toll-Free):** 1800-22-1250
`,
    contentMarathi: `
### आसगाव बस प्रवाशांसाठी संपूर्ण माहिती
आसगाव हे पवनी व भंडारा शहरांशी एसटी महामंडळाच्या बसेसने जोडलेले आहे. विद्यार्थी, शेतकरी व नोकरदारांसाठी एसटी ही सर्वात सुरक्षित व स्वस्त सार्वजनिक वाहतूक आहे.

---

### मुख्य मार्गांची वेळ:
- **आसगाव ते पवनी:** सकाळी ०६:४५, १०:३० व सायंकाळी ०५:१५ (भाडे: ₹२०, महिला: ₹१०).
- **आसगाव ते भंडारा:** सकाळी ०७:१५ (कॉलेज विशेष), दुपारी १२:१५, सायंकाळी ०६:३० (भाडे: ₹५०, महिला: ₹२५).
- **आसगाव ते नागपूर:** सकाळी ०८:००, दुपारी ०२:०० व रात्री ०८:१५ (शिवशाही एसी).

---

### शासकीय प्रवास सवलती:
१. **महिला सन्मान योजना:** सर्व महिलांना एसटी प्रवासात ५०% तिकीट सवलत.
२. **अमृत ज्येष्ठ नागरिक:** ७५ वर्षांवरील ज्येष्ठांना १००% मोफत प्रवास (आधार कार्ड आवश्यक).
३. **शालेय मुलींना मोफत पास:** इ. ५ वी ते १२ वी पर्यंतच्या विद्यार्थिनींना घर ते शाळा १००% मोफत मासिक पास.
`,
    category: 'Governance',
    categoryMarathi: 'प्रशासन व सेवा',
    author: 'आसगाव वाहतूक समन्वय कक्ष',
    authorRole: 'Transport Coordinator',
    authorRoleMarathi: 'वाहतूक कक्ष, आसगाव',
    publishDate: '२८ सप्टेंबर २०२६',
    publishDateISO: '2026-09-28',
    readTimeMinutes: 4,
    coverImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    tags: ['MSRTC Bus', 'Asgaon Pauni Bus', 'Mahila Samman ST Pass', 'Bhandara ST Timetable'],
    tagsMarathi: ['एसटी वेळापत्रक', 'आसगाव पवनी बस', 'महिला सन्मान एसटी', 'भंडारा एसटी'],
    seoTitle: 'Asgaon to Pauni ST Bus Time Table: Bhandara Nagpur Schedule | एसटी वेळापत्रक',
    seoDescription: 'आसगाव ते पवनी, भंडारा व नागपूर एसटी बस वेळापत्रक, तिकीट दर, महिला सन्मान ५०% सवलत आणि शालेय विद्यार्थी मोफत पास संपूर्ण माहिती.',
    seoKeywords: 'Asgaon to Pauni bus time table, MSRTC Pauni depot Bhandara, Asgaon ST bus pass, आसगाव एसटी वेळापत्रक',
    isFeatured: false,
    viewCount: 1890,
    faqs: [
      {
        question: 'महिला सन्मान योजनेसाठी वेगळा पास काढावा लागतो का?',
        answer: 'नाही, कोणत्याही पासची गरज नसते. एसटी बसमध्ये चढल्यावर कंडक्टरकडे तिकीट मागताना महिलांसाठी थेट ५०% सवलतीचे तिकीट दिले जाते.'
      }
    ]
  },
  {
    id: '5c1f8a7e',
    slug: 'majhi-ladki-bahin-yojana-installment-aadhaar-seeding-asgaon',
    title: 'Mukhyamantri Majhi Ladki Bahin Yojana: Installment Status & Aadhaar Seeding in Asgaon',
    titleMarathi: 'मुख्यमंत्री माझी लाडकी बहीण योजना: हप्ता जमा स्टेटस व आधार सीडिंग माहिती',
    excerpt: 'Complete resolution guide for women in Asgaon whose ₹1,500 monthly installment was rejected due to NPCI bank seeding or pending e-KYC.',
    excerptMarathi: 'आसगावमधील ज्या भगिनींचे ₹१,५०० चे हप्ते बँक खात्यात जमा झाले नाहीत, त्यांचे आधार बँक सीडिंग व ई-केवायसी कसे दुरुस्त करावे याची संपूर्ण माहिती.',
    content: `
### Mukhyamantri Majhi Ladki Bahin Yojana in Asgaon
Under the flagship welfare program of the Government of Maharashtra, eligible women in Asgaon aged 21 to 65 years receive **₹1,500 every month** (₹18,000 annually) directly through Direct Benefit Transfer (DBT).

While hundreds of women in Asgaon have received multiple installments, many applications are pending or facing transaction failure. Here is the official troubleshooting guide to resolve all issues.

---

### Top Reasons Why ₹1,500 Installment Was Not Credited:
1. **Aadhaar Not Seeded with NPCI (आधार बँक सीडिंग नसणे):**
   - Merely linking Aadhaar to your bank account is not enough; your bank account must be mapped to the **NPCI DBT Payment Gateway**.
2. **Account in Minor or Inactive Status:**
   - Savings accounts with zero transactions for more than 12 months get locked.
3. **Name Mismatch on Ration Card & Aadhaar:**
   - Maiden name vs married surname spelling discrepancy.

---

### Step-by-Step Resolution in Asgaon:
1. **Check NPCI Mapping Status:**
   - Check online via UIDAI portal or visit your home bank branch (Bank of India Pauni / Bhandara DCC Bank Asgaon).
   - Submit the **NPCI Aadhaar Mandate Form (डीबीटी संमती पत्र)** to enable direct government transfer.
2. **IPPB Account Quick Fix (जलद उपाय):**
   - If your existing bank branch is far or taking time, visit the **Asgaon Post Office (डाकघर)**.
   - Open an India Post Payments Bank (IPPB) zero-balance account within 5 minutes using biometric fingerprint. IPPB accounts are auto-seeded with NPCI.
3. **Visit Asgaon Anganwadi Sevika (अंगणवाडी सेविका):**
   - Anganwadi Sevikas in Ward 1, 2, and 3 maintain the official municipal status tracker to re-upload rejected ration card documents.
`,
    contentMarathi: `
### लाडकी बहीण योजना हप्ता समस्या व उपाय
महाराष्ट्र शासनाच्या मुख्यमंत्री माझी लाडकी बहीण योजनेअंतर्गत आसगावमधील पात्र महिलांना दरमहा **₹१,५००** अनुदान थेट बँक खात्यात दिले जाते.

ज्या महिलांचे हप्ते अद्याप जमा झालेले नाहीत त्यांनी खालील बाबींची तपासणी करावी:
१. **आधार बँक सीडिंग (NPCI Mapping):** बँकेत जाऊन आधार डीबीटी संलग्न असल्याचे सुनिश्चित करा.
२. **डाकघर खाते (IPPB):** आसगाव पोस्ट ऑफिसमध्ये ५ मिनिटांत फिंगरप्रिंट देऊन खाते उघडा; येथे हप्ता विनाविलंब जमा होतो.
३. **अंगणवाडी सेविका संपर्क:** कागदपत्रांमध्ये त्रुटी असल्यास अंगणवाडी सेविकेमार्फत 'नारी शक्ती दूत' ॲपवर दुरुस्ती करून घ्या.
`,
    category: 'Schemes',
    categoryMarathi: 'शासकीय योजना',
    author: 'महिला व बालविकास कक्ष, आसगाव',
    authorRole: 'Women & Child Development Cell',
    authorRoleMarathi: 'महिला व बालकल्याण कक्ष',
    publishDate: '२५ सप्टेंबर २०२६',
    publishDateISO: '2026-09-25',
    readTimeMinutes: 4,
    coverImage: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1200&q=80',
    tags: ['Ladki Bahin Yojana', 'Asgaon Women', 'Aadhaar Seeding', 'DBT Installment'],
    tagsMarathi: ['लाडकी बहीण योजना', 'आसगाव महिला', 'आधार सीडिंग', 'डीबीटी हप्ता'],
    seoTitle: 'Majhi Ladki Bahin Yojana Asgaon: Installment Status & Bank Seeding | लाडकी बहीण',
    seoDescription: 'मुख्यमंत्री माझी लाडकी बहीण योजना आसगाव - ₹१५०० हप्ता बँक खात्यात जमा न झाल्यास आधार सीडिंग (NPCI) व अंगणवाडी सेविका मदत संपूर्ण माहिती.',
    seoKeywords: 'Ladki bahin yojana status Asgaon, Aadhaar bank seeding Pauni, Nari shakti doot app Bhandara, लाडकी बहीण योजना आसगाव',
    isFeatured: false,
    viewCount: 3120,
    faqs: [
      {
        question: 'हप्ता जमा झाला की नाही हे कसे तपासावे?',
        answer: 'आपल्या बँकेच्या पासबुकमध्ये किंवा नोंदणीकृत मोबाईलवरील एसएमएसमध्ये PFMS / DBT क्रेडिट तपासावे, अथवा अंगणवाडी सेविकेकडे लाभार्थी यादी पहावी.'
      }
    ]
  },
  {
    id: '7a4d9e2b',
    slug: 'cotton-paddy-kharif-crop-disease-management-asgaon',
    title: 'Kharif Paddy & Cotton Pest Control: Vidarbha Agricultural Advisory for Asgaon Farmers',
    titleMarathi: 'धान व कापूस पीक रोग नियंत्रण: आसगाव व पवनी परिसरातील शेतकऱ्यांसाठी कृषी सल्ला',
    excerpt: 'Expert organic and scientific pest management tips for Blast disease in paddy (धान करपा) and Pink Bollworm in cotton (गुलाबी बोंडअळी) from Krishi Vigyan Kendra.',
    excerptMarathi: 'धानावरील करपा, तुडतुडे व खोडकिडा तसेच कपाशीवरील गुलाबी बोंडअळीच्या नियंत्रणासाठी कृषी विज्ञान केंद्र (KVK) साकोली यांचा अधिकृत सल्ला.',
    content: `
### Agricultural Landscape in Asgaon
Asgaon farmers cultivate primarily **Paddy (धान/भात)** and **Cotton (कापूस)** as principal Kharif crops in the fertile Wainganga river basin. 

During the mid-to-late monsoon phase, humidity and fluctuating temperatures often trigger pest attacks. Here is the integrated pest management (IPM) schedule recommended by agricultural scientists for Bhandara district.

---

### 1. Paddy (धान) Key Diseases & Remedies:
- **Blast Disease (करपा रोग):**
  - *Symptoms:* Diamond-shaped lesions with grey centers on leaves and neck rot.
  - *Spray:* Tricyclazole 75% WP @ 0.6 grams per liter of water OR Isoprothiolane 40% EC @ 1.5 ml per liter.
- **Brown Plant Hopper (तपकिरी तुडतुडे):**
  - *Remedy:* Maintain alleyways (चार ओळींनंतर एक मोकळी ओळ ठेवा). Spray Pymetrozine 50% WG @ 0.6 g/L or Triflumezopyrim 10% SC.
- **Stem Borer (खोडकिडा):**
  - *Remedy:* Install pheromone traps @ 5 per acre. Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/L.

---

### 2. Cotton (कापूस) Pest Management:
- **Pink Bollworm (गुलाबी बोंडअळी):**
  - Install yellow sticky traps and pheromone traps (कामगंध सापळे) @ 8 per acre to monitor moth activity.
  - Apply Neem oil (निंबोळी अर्क ५%) at initial square formation stage.
  - Spray Emamectin Benzoate 5% SG @ 4 grams per 10 liters of water.

---

### Soil Testing & Fertilizer Availability:
Do not apply excessive chemical urea, which makes crops vulnerable to pest attacks. Get your soil tested at **शिवाजी कृषी सेवा केंद्र (Shivaji Krishi Seva Kendra), Asgaon Chowk** or contact the Taluka Agriculture Officer (तालुका कृषी अधिकारी), Pauni.
`,
    contentMarathi: `
### आसगाव परिसरातील पिकांचे संरक्षण
आसगाव व पवनी परिसरातील प्रमुख खरीप पिके असलेल्या **धान (भात)** व **कापूस** पिकांवर हवामानातील बदलांमुळे रोगांचा प्रादुर्भाव होऊ शकतो.

---

### धानावरील रोग व उपाय:
१. **करपा रोग (Blast):** ट्रायसायक्लॅझोल ७५% डब्ल्यूपी ०.६ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारावे.
२. **तुडतुडे (BPH):** शेतात हवा खेळती राहण्यासाठी पिकात बोथ ठेवावे. पायमेट्रोझिन ५०% डब्ल्यूजी फवारावे.
३. **खोडकिडा:** एकरी ५ कामगंध सापळे लावावेत.

---

### कपाशीवरील उपाय:
- गुलाबी बोंडअळीसाठी एकरी ८ कामगंध सापळे लावावेत.
- सुरुवातीला ५% निंबोळी अर्काची फवारणी करावी.
`,
    category: 'Agriculture',
    categoryMarathi: 'कृषी व शेती',
    author: 'कृषी सहाय्यक, आसगाव',
    authorRole: 'Agricultural Assistant',
    authorRoleMarathi: 'कृषी सहाय्यक, आसगाव',
    publishDate: '२० सप्टेंबर २०२६',
    publishDateISO: '2026-09-20',
    readTimeMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Kharif Crop Pest Control', 'Paddy Blast Disease', 'Cotton Advisory Asgaon', 'Bhandara Agriculture'],
    tagsMarathi: ['धान करपा रोग', 'कापूस सल्ला', 'आसगाव कृषी', 'पवनी शेती'],
    seoTitle: 'Paddy & Cotton Crop Advisory Asgaon Pauni: Pest Management | धान व कापूस सल्ला',
    seoDescription: 'आसगाव व पवनी परिसरातील धान व कापूस पिकांवरील करपा रोग, तुडतुडे व बोंडअळी नियंत्रणासाठी कृषी तज्ज्ञांचा अधिकृत कीड व्यवस्थापन सल्ला.',
    seoKeywords: 'Paddy crop disease Bhandara, Cotton pest control Pauni, Asgaon Krishi advisory, धान करपा नियंत्रण',
    isFeatured: false,
    viewCount: 1650,
    faqs: [
      {
        question: 'धान पिकात खतांचा समतोल वापर कसा करावा?',
        answer: 'केवळ युरियाचा अतिरेकी वापर टाळावा. नत्र, स्फुरद व पालाश (NPK) खतांचा माती परीक्षणानुसार समतोल वापर केल्यास कीड व रोगांचा प्रादुर्भाव ३०% कमी होतो.'
      }
    ]
  },
  {
    id: 'd2e8b6a3',
    slug: 'asgaon-gram-sabha-tharaav-and-tax-payment-guide',
    title: 'Gram Sabha Resolutions, Village Budget & House Tax (Gharpatti) Payment Guide',
    titleMarathi: 'ग्रामसभा ठराव, गावचा अर्थसंकल्प व घरपट्टी-पाणीपट्टी कर भरणा मार्गदर्शक',
    excerpt: 'How villagers in Asgaon can inspect Gram Panchayat public spending, participate in Gram Sabhas, and pay property tax with verified digital receipts.',
    excerptMarathi: 'आसगाव ग्रामपंचायत विकास आराखडा, १५ वा वित्त आयोग खर्च, ग्रामसभेत लोकाभिमुख निर्णय आणि घरपट्टी-पाणीपट्टी भरण्याची सुलभ पद्धत.',
    content: `
### Transparency in Village Governance
Under the Maharashtra Village Panchayats Act, the **Gram Sabha (ग्रामसभा)** is the supreme decision-making body of Asgaon. Every resident who is registered on the electoral roll is an official member of the Gram Sabha.

Participating in Gram Sabhas ensures that developmental funds (15th Finance Commission, DPDC grants, and Village Fund) are spent on authentic priority works such as concrete roads, clean drinking water pipelines, and LED street lighting.

---

### Key Gram Sabha Dates in Asgaon:
1. **२६ जानेवारी (Republic Day Gram Sabha):** Annual review and budget discussion.
2. **०१ मे (Maharashtra Day Gram Sabha):** Labor budget and MGNREGA planning.
3. **१५ ऑगस्ट (Independence Day):** Development works progress review.
4. **०२ ऑक्टोबर (Gandhi Jayanti):** Sanitation, water security, and welfare scheme audits.

---

### Why Paying House Tax (घरपट्टी) & Water Tax (पाणीपट्टी) Matters:
- **Proof of Residence & Ownership:** The Gram Panchayat Tax Receipt (नमुना ९ पावती) is legally accepted as residential address proof and property possession document for bank loans and electricity connections.
- **Village Amenities:** Local tax funds are directly utilized for daily water pumping electricity bills, sanitation staff salaries, and drain desilting.

---

### How to Pay Taxes in Asgaon:
1. Visit the **Gram Panchayat Office**, Gaothan Ward 2, Asgaon.
2. Provide your Property Assessment Number (मालमत्ता क्र.) or family head name.
3. Pay via Cash or UPI QR Code directly to the Gram Panchayat bank account.
4. Collect the official stamped **Computerized Receipt (संगणकीय पावती)** from the Gram Sevak or Village Data Operator.
`,
    contentMarathi: `
### आसगाव ग्रामसभा व पारदर्शक कारभार
ग्रामसभा ही लोकशाहीची खरी ताकद आहे. आसगाव ग्रामपंचायतीच्या प्रत्येक नागरिकाला गावातील विकासकामे, खर्च आणि ठराव जाणून घेण्याचा पूर्ण अधिकार आहे.

---

### वर्षातील ४ महत्त्वाच्या वैधानिक ग्रामसभा:
१. **२६ जानेवारी:** वार्षिक विकास आढावा.
२. **१ मे (महाराष्ट्र दिन):** मनरेगा रोजगार व कृषी नियोजन.
३. **१५ ऑगस्ट:** विकासकामांची पाहणी व ऑडिट.
४. **२ ऑक्टोबर:** स्वच्छ भारत व पाणीपुरवठा आढावा.

---

### घरपट्टी व पाणीपट्टी कर भरण्याचे फायदे:
- ग्रामपंचायत कर पावती हा घराचा व वास्तव्याचा कायदेशीर पुरावा मानला जातो.
- जमा झालेला कर थेट गावातील पाणीपुरवठा वीजबिल, पथदिवे दुरुस्ती व स्वच्छतेसाठी वापरला जातो.
`,
    category: 'Governance',
    categoryMarathi: 'प्रशासन व सेवा',
    author: 'आसगाव ग्रामपंचायत सचिवालय',
    authorRole: 'Gram Panchayat Secretariat',
    authorRoleMarathi: 'ग्रामपंचायत सचिवालय, आसगाव',
    publishDate: '१५ सप्टेंबर २०२६',
    publishDateISO: '2026-09-15',
    readTimeMinutes: 3,
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gram Sabha Asgaon', 'Gharpatti Tax Receipt', 'Panchayat Governance', 'Bhandara Village'],
    tagsMarathi: ['ग्रामसभा आसगाव', 'घरपट्टी पावती', 'ग्रामपंचायत प्रशासन', 'पवनी गाव'],
    seoTitle: 'Asgaon Gram Sabha Resolutions & Gharpatti Tax Guide | ग्रामसभा ठराव',
    seoDescription: 'आसगाव ग्रामपंचायत ग्रामसभा ठराव, १५ वा वित्त आयोग खर्च, घरपट्टी व पाणीपट्टी पावती कर भरणा आणि पारदर्शक कारभार संपूर्ण मार्गदर्शक.',
    seoKeywords: 'Asgaon Gram sabha dates, Gharpatti tax receipt Bhandara, Pauni gram panchayat rules, आसगाव घरपट्टी पावती',
    isFeatured: false,
    viewCount: 1120,
    faqs: [
      {
        question: 'घरपट्टी भरल्याची पावती कशासाठी उपयोगी पडते?',
        answer: 'घरपट्टी पावती ही विजेचे मीटर मिळवण्यासाठी, बँकेतून तारण कर्ज घेण्यासाठी आणि स्वतःच्या घराच्या अधिकृत वास्तव्याचा पुरावा म्हणून सर्वत्र वैध असते.'
      }
    ]
  }
];
