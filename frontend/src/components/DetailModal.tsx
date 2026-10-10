import type { Business, Job, Scheme } from '../types';
import { BusinessRatingCard } from './BusinessRatingCard';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Business | Job | Scheme | null;
  type: 'business' | 'job' | 'scheme' | null;
  onBookmark: (item: any) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  data,
  type,
  onBookmark
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e8e2d9] overflow-hidden max-h-[92vh] overflow-y-auto p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#f3ede4] mb-4">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#a63b00] bg-[#f9f3ea] px-2.5 py-1 rounded-md">
            {type?.toUpperCase()} DETAILS
          </span>
          <button onClick={onClose} className="text-[#707974] hover:text-[#1d1b16] p-1">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Business View */}
        {type === 'business' && (() => {
          const b = data as Business;
          return (
            <div>
              <div className="h-52 w-full rounded-xl overflow-hidden mb-4 relative bg-[#f3ede4]">
                <img src={b.imageUrl} alt={b.name} className="w-full h-full object-cover" />
                {b.isVerified && (
                  <span className="absolute top-3 right-3 bg-[#baeed9] text-[#002117] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {b.verificationBadge}
                  </span>
                )}
              </div>
              <h3 className="font-heading font-extrabold text-[22px] text-[#003629] mb-1">
                {b.name}
              </h3>
              <p className="text-[12px] font-bold text-[#a63b00] mb-3">{b.category} • {b.landmark}</p>
              <p className="text-[14px] text-[#404945] mb-4 leading-relaxed">{b.description}</p>

              <div className="bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9] space-y-2.5 mb-6 text-[13px]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#a63b00]">location_on</span>
                    <span>{b.address} {b.landmark ? `• ${b.landmark}` : ''}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${b.latitude || 20.7850},${b.longitude || 79.6350}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-[#fff8f0] text-[#a63b00] hover:bg-[#a63b00] hover:text-white transition-colors text-[11px] font-bold border border-[#ffdbce] shrink-0 flex items-center gap-1 shadow-2xs"
                    title="Google Maps दिशानिर्देश (Get Directions)"
                  >
                    <span className="material-symbols-outlined text-[14px]">navigation</span>
                    <span>नकाशावर पहा</span>
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#003629]">schedule</span>
                  <span>{b.openingHours}</span>
                </div>
              </div>

              {/* Comprehensive Citizen Rating & Reviews Card */}
              <BusinessRatingCard business={b} />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f3ede4]">
                <button
                  type="button"
                  onClick={() => onBookmark(b)}
                  className="px-4 py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[13px] font-bold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#003629]">bookmark_border</span>
                  <span>Save</span>
                </button>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${b.latitude || 20.7850},${b.longitude || 79.6350}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#fff8f0] text-[#a63b00] hover:bg-[#a63b00] hover:text-white text-[13px] font-bold flex items-center gap-1.5 border border-[#ffdbce] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px]">place</span>
                    <span>दुकान स्थान</span>
                  </a>
                  <a
                    href={`tel:${b.phone}`}
                    className="px-4 py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[13px] font-bold flex items-center gap-1.5 border border-[#e8e2d9]"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#003629]">call</span>
                    <span>Call Shop</span>
                  </a>
                  <a
                    href={`https://wa.me/91${b.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#003629] text-white text-[13px] font-bold hover:bg-[#1b4d3e] flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#baeed9]">chat</span>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Job View */}
        {type === 'job' && (() => {
          const j = data as Job;
          return (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#baeed9] text-[#002117] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {j.employmentType}
                </span>
                <span className="text-[12px] text-[#707974]">{j.postedAgo}</span>
              </div>
              <h3 className="font-heading font-extrabold text-[22px] text-[#003629] mb-1">
                {j.title}
              </h3>
              <p className="text-[13px] font-bold text-[#a63b00] mb-4">{j.employerName} • {j.location}</p>

              <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] mb-4 flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#404945]">Offered Wages</span>
                <span className="font-heading font-extrabold text-[18px] text-[#003629]">{j.salaryRange}</span>
              </div>

              <div className="space-y-3 mb-6 text-[13px] text-[#404945]">
                <div>
                  <h4 className="font-bold text-[#1d1b16] mb-1">Job Overview</h4>
                  <p>{j.description}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#1d1b16] mb-1">Required Skills / Eligibility</h4>
                  <p>{j.requirements}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#f3ede4]">
                <button
                  type="button"
                  onClick={() => onBookmark(j)}
                  className="px-4 py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[13px] font-bold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#003629]">bookmark_border</span>
                  <span>Save Job</span>
                </button>
                <a
                  href={`tel:${j.contactPhone}`}
                  className="px-6 py-2 rounded-xl bg-[#003629] text-white text-[13px] font-bold hover:bg-[#1b4d3e] flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Contact Employer ({j.contactPhone})</span>
                </a>
              </div>
            </div>
          );
        })()}

        {/* Scheme View */}
        {type === 'scheme' && (() => {
          const s = data as Scheme;
          return (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#dbe1ff] text-[#002873] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {s.sponsoringAgency}
                </span>
                <span className="text-[11px] font-bold text-[#ba1a1a]">{s.deadlineText}</span>
              </div>
              <h3 className="font-heading font-extrabold text-[22px] text-[#003629] mb-2">
                {s.title}
              </h3>
              <p className="text-[13px] text-[#404945] mb-4 leading-relaxed">{s.description}</p>

              <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9] mb-4">
                <h4 className="text-[12px] font-bold text-[#003629] uppercase tracking-wider mb-2">
                  Checklist of Required Documents
                </h4>
                <ul className="space-y-1.5">
                  {s.documentsRequired.map((doc, idx) => (
                    <li key={idx} className="text-[13px] text-[#1d1b16] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#376757]">check_circle</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#f3ede4]">
                <button
                  type="button"
                  onClick={() => onBookmark(s)}
                  className="px-4 py-2 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[13px] font-bold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#003629]">bookmark_border</span>
                  <span>Save Scheme</span>
                </button>
                <a
                  href={s.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-xl bg-[#002873] text-white text-[13px] font-bold hover:bg-[#00174b] flex items-center gap-1.5 shadow-xs"
                >
                  <span>Open Official Govt Portal</span>
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
