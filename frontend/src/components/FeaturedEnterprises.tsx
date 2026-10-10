import type { Business } from '../types';

interface FeaturedEnterprisesProps {
  businesses: Business[];
  onRegisterShop: () => void;
  onSelectBusiness: (biz: Business) => void;
}

export const FeaturedEnterprises: React.FC<FeaturedEnterprisesProps> = ({
  businesses,
  onRegisterShop,
  onSelectBusiness
}) => {
  return (
    <section id="businesses" className="w-full mb-12 scroll-mt-28">
      {/* Header with Title and Free Listing CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="font-heading font-extrabold text-[22px] text-[#003629] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a63b00]">storefront</span>
            <span>Featured Village Enterprises</span>
          </h2>
          <p className="text-[13px] text-[#404945]">
            Asgaon&apos;s trusted rural economy • Verified by Gram Panchayat Ward Officers
          </p>
        </div>

        <button
          type="button"
          onClick={onRegisterShop}
          className="px-4 py-2 rounded-xl bg-[#a63b00] text-white text-[13px] font-bold hover:bg-[#852f00] transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add_business</span>
          <span>List Your Shop Free (आपला व्यापार)</span>
        </button>
      </div>

      {/* Grid of Enterprise Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {businesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all border border-[#e8e2d9] flex flex-col justify-between group"
          >
            {/* Image Thumbnail with Floating Tags */}
            <div className="relative h-44 w-full overflow-hidden bg-[#f3ede4]">
              <img
                src={biz.imageUrl}
                alt={biz.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Landmark location pill with direct map navigation */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${biz.latitude || 20.7850},${biz.longitude || 79.6350}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-2.5 left-2.5 bg-black/75 hover:bg-[#003629] backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors border border-white/20"
                title="नकाशावर ठिकाण पहा (View on Map / Directions)"
              >
                <span className="material-symbols-outlined text-[13px] text-[#ff793f]">location_on</span>
                <span>{biz.landmark} • नकाशा ↗</span>
              </a>

              {/* Verification badge pill */}
              {biz.isVerified && (
                <div className="absolute top-2.5 right-2.5 bg-[#baeed9] text-[#002117] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <span className="material-symbols-outlined text-[12px] text-[#002117]">verified</span>
                  <span>{biz.verificationBadge}</span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#a63b00] mb-1">
                {biz.category}
              </span>
              <h3
                onClick={() => onSelectBusiness(biz)}
                className="font-heading font-bold text-[16px] text-[#1d1b16] hover:text-[#003629] cursor-pointer transition-colors leading-snug line-clamp-1"
              >
                {biz.name}
              </h3>
              <p className="text-[12px] text-[#404945] mt-1.5 line-clamp-2 leading-relaxed flex-1">
                {biz.description}
              </p>

              {/* Timing */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#707974] bg-[#f9f3ea] px-2 py-1 rounded-lg">
                <span className="material-symbols-outlined text-[14px] text-[#003629]">schedule</span>
                <span className="truncate">{biz.openingHours}</span>
              </div>

              {/* Action Buttons: Call, WhatsApp & Map Location */}
              <div className="mt-4 pt-3 border-t border-[#f3ede4] flex items-center gap-2">
                <a
                  href={`tel:${biz.phone}`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#f3ede4] text-[#1d1b16] hover:bg-[#e8e2d9] transition-colors text-[12px] font-bold border border-[#e8e2d9]"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#003629]">call</span>
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/91${biz.whatsapp}?text=Hello%20${encodeURIComponent(biz.name)},%20I%20saw%20your%20listing%20on%20Digital%20Gaon%20Asgaon.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-[#003629] text-white hover:bg-[#1b4d3e] transition-colors text-[12px] font-bold shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#baeed9]">chat</span>
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${biz.latitude || 20.7850},${biz.longitude || 79.6350}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#fff8f0] text-[#a63b00] hover:bg-[#a63b00] hover:text-white transition-colors border border-[#ffdbce]"
                  title="Google Maps वर ठिकाण पहा (View on Map)"
                >
                  <span className="material-symbols-outlined text-[17px]">location_on</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
