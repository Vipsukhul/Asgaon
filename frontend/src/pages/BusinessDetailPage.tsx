import React, { useMemo, useState } from 'react';
import type { Business } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { SEOHead } from '../components/SEOHead';
import { InlineShopMap } from '../components/InlineShopMap';
import { BusinessRatingCard } from '../components/BusinessRatingCard';
import { useLanguage } from '../context/LanguageContext';

interface BusinessDetailPageProps {
  slug: string;
  businesses: Business[];
  onNavigateBack: () => void;
  onSelectBusiness: (slug: string) => void;
  onNavigateHome: () => void;
}

export const BusinessDetailPage: React.FC<BusinessDetailPageProps> = ({
  slug,
  businesses,
  onNavigateBack,
  onSelectBusiness,
  onNavigateHome
}) => {
  const { lang, t } = useLanguage();
  const business = useMemo(() => {
    return businesses.find(
      (b) => b.slug === slug || b.id === slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    ) || businesses[0];
  }, [slug, businesses]);

  const [liveRating, setLiveRating] = useState<number | null>(null);
  const [liveCount, setLiveCount] = useState<number | null>(null);

  if (!business) {
    if (businesses.length === 0) {
      return (
        <div className="w-full py-28 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-3 border-[#003629] border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] font-bold text-[#003629]">
            {lang === 'MR' ? 'माहिती लोड होत आहे...' : 'Loading shop details...'}
          </p>
        </div>
      );
    }
    return (
      <div className="w-full py-16 text-center">
        <h2 className="text-xl font-bold text-[#003629]">
          {lang === 'MR' ? 'दुकान आढळले नाही' : 'Business not found'}
        </h2>
        <button
          onClick={onNavigateBack}
          className="mt-4 px-4 py-2 bg-[#003629] text-white rounded-xl font-bold text-sm"
        >
          {lang === 'MR' ? 'निर्देशिकेकडे परत जा' : 'Back to Directory'}
        </button>
      </div>
    );
  }

  const category = business.category || 'Local Shop';
  const pageUrl = `${window.location.origin}/businesses/${business.slug}`;
  const seoTitle = `${business.name} — संपर्क, पत्ता, वेळ व दुकानाची माहिती | Asgaon Directory`;
  const seoDescription = `${business.name} (${category}) in Asgaon, Pauni: ${business.description}. Phone: ${business.phone}. Opening hours: ${business.openingHours}. Landmark: ${business.landmark}.`;

  const relatedBusinesses = businesses
    .filter((b) => b.slug !== business.slug && b.category === business.category)
    .slice(0, 3);

  // Schema.org LocalBusiness / Store structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: window.location.origin
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Local Businesses',
            item: `${window.location.origin}/businesses`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: business.name,
            item: pageUrl
          }
        ]
      },
      {
        '@type': 'LocalBusiness',
        name: business.name,
        description: business.description,
        image: business.imageUrl,
        telephone: business.phone,
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: business.address,
          addressLocality: 'Asgaon, Pauni',
          addressRegion: 'Maharashtra',
          postalCode: '441910',
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: business.latitude || 20.7858,
          longitude: business.longitude || 79.6346
        },
        openingHours: business.openingHours,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: business.rating || 4.8,
          reviewCount: business.ratingCount || 100
        },
        url: pageUrl
      }
    ]
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*${business.name}* (${category})\n${business.description}\nपत्ता: ${business.address}\nफोन: +91 ${business.phone}\n\nदुकान व सेवांची माहिती पाहण्यासाठी:\n${pageUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* 1. SEO Head Meta & Structured Data */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={`${business.name}, ${category}, Asgaon shops, Pauni, Bhandara, स्थानिक दुकाने, व्यापारी, संपर्क नंबर, पत्ता`}
        canonicalUrl={pageUrl}
        ogType="article"
        ogImage={business.imageUrl}
        structuredData={structuredData}
      />

      {/* 2. Breadcrumbs & Return Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: t('nav_home'), onClick: onNavigateHome },
            { label: lang === 'MR' ? 'स्थानिक व्यवसाय निर्देशिका' : 'Local Businesses Directory', onClick: onNavigateBack },
            { label: business.name, active: true }
          ]}
        />

        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[12px] font-bold transition-colors border border-[#e8e2d9]"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{lang === 'MR' ? 'निर्देशिकेकडे परत जा' : 'Back to Directory'}</span>
        </button>
      </div>

      {/* 3. Hero Header Banner */}
      <header className="bg-white rounded-2xl overflow-hidden border border-[#e8e2d9] shadow-xs">
        <div className="relative h-48 sm:h-64 w-full bg-[#1b4d3e]">
          <img
            src={business.imageUrl}
            alt={business.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#baeed9] text-[#002117]">
              {category}
            </span>
            {business.isVerified && (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#002873] text-white flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>{lang === 'MR' ? 'सत्यापित स्थानिक व्यापारी' : (business.verificationBadge || 'Verified Merchant')}</span>
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div>
              <h1 className="font-heading font-extrabold text-[24px] sm:text-[32px] leading-tight text-white drop-shadow-md">
                {business.name}
              </h1>
              <div className="flex items-center gap-2 text-[13px] text-white/90 mt-1">
                <span className="material-symbols-outlined text-[16px] text-[#baeed9]">location_on</span>
                <span>{business.address} ({business.landmark})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shrink-0">
              <span className="text-[#f59e0b] font-extrabold text-[16px]">★ {liveRating ?? business.rating ?? 4.8}</span>
              <span className="text-[12px] text-white/80">({liveCount ?? business.ratingCount ?? 120} {lang === 'MR' ? 'अभिप्राय' : 'Reviews'})</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 sm:p-5 bg-white flex flex-wrap items-center justify-between gap-3 border-t border-[#f3ede4]">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${business.phone}`}
              className="px-4 py-2.5 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>{lang === 'MR' ? 'थेट फोन करा' : `Call: +91 ${business.phone}`}</span>
            </a>

            <a
              href={`https://wa.me/91${business.whatsapp || business.phone}?text=Hello%20${encodeURIComponent(business.name)},%20I%20found%20your%20shop%20on%20Asgaon%20Portal`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white text-[13px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>{lang === 'MR' ? 'व्हॉट्सॲप मेसेज' : 'WhatsApp Message'}</span>
            </a>

            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2.5 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[13px] font-bold flex items-center gap-1.5 transition-colors border border-[#e8e2d9]"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>{lang === 'MR' ? 'दुकान शेअर करा' : 'Share Store'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[#707974]">
            <span className="material-symbols-outlined text-[16px] text-[#376757]">schedule</span>
            <span><strong>{lang === 'MR' ? 'वेळ:' : 'Hours:'}</strong> {business.openingHours}</span>
          </div>
        </div>
      </header>

      {/* 4. Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Map (2 cols wide) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* About / Description */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[18px] text-[#003629] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#376757]">storefront</span>
              <span>{lang === 'MR' ? `${business.name} विषयी माहिती` : `About ${business.name}`}</span>
            </h2>
            <p className="text-[14px] text-[#404945] leading-relaxed">
              {business.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-[#f3ede4] text-[12px]">
              <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9]">
                <strong className="text-[#003629] block mb-0.5">{lang === 'MR' ? 'चौकापासून अंतर:' : 'Distance from Chowk:'}</strong>
                <span className="text-[#1d1b16]">{business.distanceKm || '0.4 km'}</span>
              </div>
              <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9]">
                <strong className="text-[#003629] block mb-0.5">{lang === 'MR' ? 'पडताळणी:' : 'Verification:'}</strong>
                <span className="text-[#1d1b16]">{lang === 'MR' ? 'सत्यापित स्थानिक व्यापारी' : 'Verified Merchant'}</span>
              </div>
              <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9]">
                <strong className="text-[#003629] block mb-0.5">{lang === 'MR' ? 'डिलिव्हरी सेवा:' : 'Delivery Support:'}</strong>
                <span className="text-[#1d1b16]">{lang === 'MR' ? 'स्थानिक शेत / घरपोच सेवा' : 'Local Farm / Village Delivery'}</span>
              </div>
            </div>
          </section>

          {/* Interactive Shop Location Map */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[18px] text-[#003629] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a63b00]">pin_drop</span>
              <span>{lang === 'MR' ? 'स्थान व दिशा (नकाशा)' : 'Location & Directions'}</span>
            </h2>
            <p className="text-[12px] text-[#707974] mb-4">
              {business.address} • {lang === 'MR' ? 'लँडमार्क:' : 'Landmark:'} {business.landmark}
            </p>

            <div className="w-full rounded-xl overflow-hidden relative z-0 isolate">
              <InlineShopMap
                shopName={business.name}
                address={business.address}
                latitude={business.latitude || 20.7858}
                longitude={business.longitude || 79.6346}
              />
            </div>
          </section>

          {/* Citizen Reviews & Rating Section */}
          <BusinessRatingCard
            business={business}
            onRatingUpdated={(newRating, newCount) => {
              setLiveRating(newRating);
              setLiveCount(newCount);
            }}
          />

          {/* Related Businesses */}
          {relatedBusinesses.length > 0 && (
            <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
              <h2 className="font-heading font-extrabold text-[17px] text-[#003629] mb-3">
                {lang === 'MR' ? `याच वर्गातील इतर दुकाने (${category})` : `More in ${category}`}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedBusinesses.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => {
                      onSelectBusiness(rel.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-xl bg-[#f9f3ea] hover:bg-[#f3ede4] border border-[#e8e2d9] text-left transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#002873] bg-[#dbe1ff] px-2 py-0.5 rounded">
                        {rel.category}
                      </span>
                      <h3 className="font-heading font-bold text-[13px] text-[#1d1b16] mt-2 line-clamp-2">
                        {rel.name}
                      </h3>
                      <p className="text-[11px] text-[#707974] mt-1 line-clamp-1">{rel.address}</p>
                    </div>
                    <div className="mt-3 text-[11px] font-bold text-[#a63b00] flex items-center gap-1">
                      <span>{lang === 'MR' ? 'दुकान पहा' : 'View Store'}</span>
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar: Contact & Quick Info (1 col wide) */}
        <aside className="flex flex-col gap-5">
          {/* Quick Contact Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs flex flex-col gap-3">
            <h3 className="font-heading font-extrabold text-[16px] text-[#003629]">
              {lang === 'MR' ? 'संपर्क माहिती' : 'Contact Details'}
            </h3>

            <div className="space-y-3 text-[13px]">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#003629] shrink-0 mt-0.5">call</span>
                <div>
                  <div className="text-[11px] text-[#707974] font-medium">{lang === 'MR' ? 'मुख्य फोन' : 'Primary Phone'}</div>
                  <a href={`tel:${business.phone}`} className="font-bold text-[#1d1b16] hover:underline">
                    +91 {business.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#25d366] shrink-0 mt-0.5">chat</span>
                <div>
                  <div className="text-[11px] text-[#707974] font-medium">{lang === 'MR' ? 'व्हॉट्सॲप ऑर्डर' : 'WhatsApp Orders'}</div>
                  <a
                    href={`https://wa.me/91${business.whatsapp || business.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#1d1b16] hover:underline"
                  >
                    +91 {business.whatsapp || business.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#a63b00] shrink-0 mt-0.5">schedule</span>
                <div>
                  <div className="text-[11px] text-[#707974] font-medium">{lang === 'MR' ? 'दुकान वेळ' : 'Working Hours'}</div>
                  <div className="font-bold text-[#1d1b16]">{business.openingHours}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#002873] shrink-0 mt-0.5">store</span>
                <div>
                  <div className="text-[11px] text-[#707974] font-medium">{lang === 'MR' ? 'पत्ता' : 'Address'}</div>
                  <div className="font-bold text-[#1d1b16]">{business.address}</div>
                </div>
              </div>
            </div>

            <a
              href={`tel:${business.phone}`}
              className="mt-2 w-full py-2.5 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>{lang === 'MR' ? 'व्यापाऱ्याशी संपर्क साधा' : 'Call Merchant Now'}</span>
            </a>
          </div>

          {/* Local Merchant Registry Card */}
          <div className="bg-[#f9f3ea] rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center gap-2 text-[#003629] font-bold text-[13px] mb-1">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>{lang === 'MR' ? 'स्थानिक व्यवसाय नोंदणी' : 'Civic Business Registry'}</span>
            </div>
            <p className="text-[12px] text-[#404945] leading-relaxed mb-3">
              {lang === 'MR'
                ? 'हा व्यवसाय आसगाव स्थानिक व्यापारी निर्देशिकेत नोंदणीकृत व पडताळणी केलेला आहे.'
                : 'This business is registered and verified in the Asgaon local merchant directory.'}
            </p>
            <div className="text-[11px] text-[#707974]">
              {lang === 'MR' ? 'व्यापारी ओळख क्रमांक:' : 'Trade Desk ID:'} <strong>ASG-BIZ-{(business.id || '101').toUpperCase()}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
