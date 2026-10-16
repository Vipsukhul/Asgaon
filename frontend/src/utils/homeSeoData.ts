/**
 * Home Page SEO Metadata and Schema.org Structured Data
 * Multi-lingual (Marathi + English) optimized for Google Search, Local SEO, and WhatsApp preview
 */

export function getHomeSeoMetadata(isMr: boolean) {
  const title = isMr
    ? 'आपलं डिजिटल आसगाव | ग्रामपंचायत, शासकीय योजना, कृषी बाजारभाव व नागरी सेवा'
    : 'Digital Asgaon | Village Civic Portal, Sarkari Yojana, Mandi Rates & Services';

  const description = isMr
    ? 'आसगाव (पवनी, जि. भंडारा - ४४१९१०) गावकऱ्यांसाठी अधिकृत नागरी मंच. ग्रामपंचायत सूचना, घरकुल व लाडकी बहीण योजना, पवनी APMC थेट बाजारभाव, एसटी बस वेळापत्रक व स्थानिक सेवा एकाच ठिकाणी.'
    : 'Official civic portal for Asgaon village, Pauni, Bhandara (441910). Direct access to Sarkari Yojana, live Pauni APMC mandi rates, ST bus timings, health center, and verified local businesses.';

  const keywords = isMr
    ? 'आसगाव, Asgaon, आसगाव ग्रामपंचायत, Gram Panchayat Asgaon, पवनी, भंडारा, Pauni, Bhandara, 441910, घरकुल योजना, लाडकी बहीण योजना, पवनी APMC बाजारभाव, महाडीबीटी, एसटी बस वेळापत्रक आसगाव, पीएम किसान, डिजिटल गाव'
    : 'Asgaon, Asgaon Village, Gram Panchayat Asgaon, Pauni, Bhandara, 441910, Sarkari Yojana, PM Kisan, Gharkul Yojana, Ladki Bahin Yojana, Pauni APMC Mandi Rates, ST Bus Timetable Asgaon, Maharashtra Rural Portal';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': isMr ? 'आसगाव गाव कोणत्या तालुक्यात आणि जिल्ह्यात येते?' : 'Which taluka and district does Asgaon belong to?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': isMr
            ? 'आसगाव हे गाव महाराष्ट्र राज्यातील भंडारा जिल्ह्यातील पवनी तालुक्यात येते. गावाचा पिनकोड ४४१९१० (441910) आहे.'
            : 'Asgaon is a village situated in Pauni Taluka of Bhandara District in Maharashtra, India. The pincode is 441910.'
        }
      },
      {
        '@type': 'Question',
        'name': isMr ? 'आसगाव ग्रामपंचायतीत शासकीय योजनांचा लाभ कसा घ्यावा?' : 'How to apply for government welfare schemes in Asgaon?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': isMr
            ? 'गावातील नागरिक रमाई आवास, शबरी आवास, पीएम किसान आणि लाडकी बहीण योजनेसाठी आसगाव ग्राम सचिवालय किंवा स्थानिक CSC केंद्रावर थेट अर्ज करू शकतात.'
            : 'Citizens can apply for PM Awas, Gharkul, PM-Kisan, and Ladki Bahin Yojana at the Asgaon Gram Sachivalaya or the local CSC guidance kiosk.'
        }
      },
      {
        '@type': 'Question',
        'name': isMr ? 'पवनी कृषी उत्पन्न बाजार समिती (APMC) चे ताजे भाव कुठे मिळतील?' : 'Where can farmers check live Pauni APMC mandi commodity rates?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': isMr
            ? 'आसगाव डिजिटल पोर्टलवर धान (धान्य), सोयाबीन, तूर व इतर शेतीमालाचे अधिकृत बाजारभाव दररोज थेट अपडेट केले जातात.'
            : 'Live modal prices for paddy (dhan), soybean, pigeon pea (tur), and other crops from Pauni APMC are updated daily on the Asgaon Portal.'
        }
      },
      {
        '@type': 'Question',
        'name': isMr ? 'आसगाव बस स्थानकावरून एसटी बसचे वेळापत्रक कसे तपासावे?' : 'How to check Maharashtra ST bus timings for Asgaon bus stop?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': isMr
            ? 'पोर्टलवरील "एसटी बस वेळापत्रक" विभागात पवनी, भंडारा, नागपूर आणि उमरेड कडे जाणाऱ्या सर्व फेऱ्यांची अचूक वेळ उपलब्ध आहे.'
            : 'Real-time schedules for buses traveling to Pauni, Bhandara, Nagpur, and Umred are listed under the Transport module.'
        }
      }
    ]
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': ['CivicStructure', 'GovernmentOrganization'],
    'name': isMr ? 'ग्रामपंचायत आसगाव (पवनी, भंडारा)' : 'Gram Panchayat Asgaon (Pauni, Bhandara)',
    'url': 'https://asgaon.vercel.app/',
    'logo': 'https://asgaon.vercel.app/asgaon-logo.png',
    'image': 'https://res.cloudinary.com/dl5bq3ejh/image/upload/v1791660305/asgaon/seo/ccc45725-5d89-44b3-ac8c-a113f34f5df3.png',
    'telephone': '+91-9822104500',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Gram Sachivalaya, Main Market Road',
      'addressLocality': 'Asgaon',
      'addressRegion': 'Maharashtra',
      'postalCode': '441910',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 20.8084579,
      'longitude': 79.7242461
    },
    'areaServed': {
      '@type': 'AdministrativeArea',
      'name': 'Asgaon Village, Pauni Taluka, Bhandara District'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': isMr ? 'आपलं डिजिटल आसगाव' : 'Digital Asgaon Civic Portal',
    'alternateName': 'Asgaon Portal',
    'url': 'https://asgaon.vercel.app/',
    'inLanguage': isMr ? 'mr-IN' : 'en-IN',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://asgaon.vercel.app/?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl: 'https://asgaon.vercel.app/',
    ogImage: 'https://res.cloudinary.com/dl5bq3ejh/image/upload/v1791660305/asgaon/seo/ccc45725-5d89-44b3-ac8c-a113f34f5df3.png',
    ogImageAlt: title,
    structuredData: [websiteSchema, orgSchema, faqSchema]
  };
}
