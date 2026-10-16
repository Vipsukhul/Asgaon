import { LucideIcon } from '../components/LucideIcon';
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
        <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6 animate-pulse">
          <div className="w-32 h-5 bg-stone-200 rounded" />
          <div className="h-56 sm:h-72 w-full bg-stone-200 rounded-3xl" />
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                <div className="w-24 h-5 bg-stone-200 rounded-full" />
                <div className="w-2/3 h-8 bg-stone-200 rounded" />
                <div className="w-1/2 h-4 bg-stone-100 rounded" />
              </div>
              <div className="w-24 h-10 bg-stone-100 rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#f3ede4]">
              <div className="h-16 bg-stone-100 rounded-xl" />
              <div className="h-16 bg-stone-100 rounded-xl" />
              <div className="h-16 bg-stone-100 rounded-xl" />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full py-16 text-center">
        <h2 className="text-xl font-bold text-[#166534]">
          {lang === 'MR' ? 'दुकान आढळले नाही' : 'Business not found'}
        </h2>
        <button
          onClick={onNavigateBack}
          className="mt-4 px-4 py-2 bg-[#166534] text-white rounded-xl font-bold text-sm"
        >
          {lang === 'MR' ? 'परत जा' : 'Back'}
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
            { label: t('nav_businesses'), onClick: onNavigateBack },
            { label: business.name, active: true }
          ]}
        />

        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[12px] font-bold transition-colors border border-[#e8e2d9]"
        >
          <LucideIcon name="arrow_back" className="text-[16px]" />
          <span>{lang === 'MR' ? 'निर्देशिकेकडे परत जा' : 'Back to Directory'}</span>
        </button>
      </div>

      {/* 3. Hero Header Banner */}
      <header className="bg-white rounded-2xl overflow-hidden border border-[#e8e2d9] shadow-xs">
        <div className="relative h-48 sm:h-64 w-full bg-[#052e16]">
          <img
            src={business.imageUrl}
            alt={business.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]">
              {category}
            </span>
            {business.isVerified && (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#002873] text-white flex items-center gap-1">
                <LucideIcon name="verified" className="text-[14px]" />
                <span>{lang === 'MR' ? 'सत्यापित व्यापारी' : (business.verificationBadge || 'Verified Merchant')}</span>
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div>
              <h1 className="font-heading font-extrabold text-[24px] sm:text-[32px] leading-tight text-white drop-shadow-md">
                {business.name}
              </h1>
              <div className="flex items-center gap-2 text-[13px] text-white/90 mt-1">
                <LucideIcon name="location_on" className="text-[16px] text-[#a7f3d0]" />
                <span>{business.address} ({business.landmark})</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md text-amber-300 font-bold text-sm border border-white/20 self-start sm:self-auto">
              <span>★</span>
              <span>{(liveRating ?? business.rating ?? 4.8).toFixed(1)}</span>
              <span className="text-white/80 text-xs font-normal">({liveCount ?? business.ratingCount ?? 0})</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 sm:p-5 bg-white flex flex-wrap items-center justify-between gap-3 border-t border-[#f3ede4]">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${business.phone}`}
              className="px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <LucideIcon name="call" className="text-[18px]" />
              <span>{lang === 'MR' ? 'फोन' : 'Call'}</span>
            </a>

            <a
              href={`https://wa.me/91${business.whatsapp || business.phone}?text=Hello%20${encodeURIComponent(business.name)},%20I%20found%20your%20shop%20on%20Asgaon%20Portal`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25d366] hover:bg-[#20ba5a] text-white text-[13px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <LucideIcon name="chat" className="text-[18px]" />
              <span>{lang === 'MR' ? 'व्हॉट्सॲप' : 'WhatsApp'}</span>
            </a>

            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2.5 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[13px] font-bold flex items-center gap-1.5 transition-colors border border-[#e8e2d9]"
            >
              <LucideIcon name="share" className="text-[18px]" />
              <span>{lang === 'MR' ? 'शेअर करा' : 'Share'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[#707974]">
            <LucideIcon name="schedule" className="text-[16px] text-[#376757]" />
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
            <h2 className="font-heading font-extrabold text-[18px] text-[#166534] mb-3 flex items-center gap-2">
              <LucideIcon name="storefront" className="text-[#376757]" />
              <span>{lang === 'MR' ? `${business.name} विषयी माहिती` : `About ${business.name}`}</span>
            </h2>
            <p className="text-[14px] text-[#404945] leading-relaxed">
              {business.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-[#f3ede4] text-[12px]">
              <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9]">
                <strong className="text-[#166534] block mb-0.5">{lang === 'MR' ? 'चौकापासून अंतर:' : 'Distance from Chowk:'}</strong>
                <span className="text-[#1d1b16]">{business.distanceKm || '0.4 km'}</span>
              </div>
              <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9]">
                <strong className="text-[#166534] block mb-0.5">{lang === 'MR' ? 'पडताळणी:' : 'Verification:'}</strong>
                <span className="text-[#1d1b16]">{lang === 'MR' ? 'सत्यापित स्थानिक व्यापारी' : 'Verified Merchant'}</span>
              </div>
              <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9]">
                <strong className="text-[#166534] block mb-0.5">{lang === 'MR' ? 'डिलिव्हरी सेवा:' : 'Delivery Support:'}</strong>
                <span className="text-[#1d1b16]">{lang === 'MR' ? 'स्थानिक शेत / घरपोच सेवा' : 'Local Farm / Village Delivery'}</span>
              </div>
            </div>
          </section>

          {/* Interactive Shop Location Map */}
          <section className="bg-white rounded-2xl p-6 border border-[#e8e2d9] shadow-xs">
            <h2 className="font-heading font-extrabold text-[18px] text-[#166534] mb-2 flex items-center gap-2">
              <LucideIcon name="pin_drop" className="text-[#c2410c]" />
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
              <h2 className="font-heading font-extrabold text-[17px] text-[#166534] mb-3">
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
                    <div className="mt-3 text-[11px] font-bold text-[#c2410c] flex items-center gap-1">
                      <span>{lang === 'MR' ? 'दुकान पहा' : 'View Store'}</span>
                      <LucideIcon name="arrow_forward" className="text-[13px]" />
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
            <h3 className="font-heading font-extrabold text-[16px] text-[#166534]">
              {lang === 'MR' ? 'संपर्क माहिती' : 'Contact Details'}
            </h3>

            <div className="space-y-3 text-[13px]">
              <div className="flex items-start gap-2.5">
                <LucideIcon name="call" className="text-[18px] text-[#166534] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-[#707974] font-medium">{lang === 'MR' ? 'मुख्य फोन' : 'Primary Phone'}</div>
                  <a href={`tel:${business.phone}`} className="font-bold text-[#1d1b16] hover:underline">
                    +91 {business.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <LucideIcon name="chat" className="text-[18px] text-[#25d366] shrink-0 mt-0.5" />
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
                <LucideIcon name="schedule" className="text-[18px] text-[#c2410c] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-[#707974] font-medium">{lang === 'MR' ? 'दुकान वेळ' : 'Working Hours'}</div>
                  <div className="font-bold text-[#1d1b16]">{business.openingHours}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <LucideIcon name="store" className="text-[18px] text-[#002873] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-[#707974] font-medium">{lang === 'MR' ? 'पत्ता' : 'Address'}</div>
                  <div className="font-bold text-[#1d1b16]">{business.address}</div>
                </div>
              </div>
            </div>

            <a
              href={`tel:${business.phone}`}
              className="mt-2 w-full py-2.5 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <LucideIcon name="call" className="text-[16px]" />
              <span>{lang === 'MR' ? 'संपर्क साधा' : 'Call Now'}</span>
            </a>
          </div>

          {/* Local Merchant Registry Card */}
          <div className="bg-[#f9f3ea] rounded-2xl p-5 border border-[#e8e2d9] shadow-xs">
            <div className="flex items-center gap-2 text-[#166534] font-bold text-[13px] mb-1">
              <LucideIcon name="verified_user" className="text-[18px]" />
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
