import type { Scheme } from '../types';

interface GovtSchemesSectionProps {
  schemes: Scheme[];
  onOpenCSC: () => void;
  onSaveScheme: (scheme: Scheme) => void;
  onSelectScheme?: (slug: string) => void;
}

export const GovtSchemesSection: React.FC<GovtSchemesSectionProps> = ({
  schemes,
  onOpenCSC,
  onSaveScheme,
  onSelectScheme
}) => {
  return (
    <section id="govt-schemes" className="w-full mb-12 scroll-mt-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="font-heading font-extrabold text-[22px] text-[#003629] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002873]">verified_user</span>
            <span>Sarkari Yojana Guidance Desk (Direct Welfare)</span>
          </h2>
          <p className="text-[13px] text-[#404945]">
            Apply for govt subsidies &amp; scholarships at CSC Kiosk or official portal links
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCSC}
          className="px-4 py-2 rounded-xl bg-[#002873] text-white text-[13px] font-bold hover:bg-[#00174b] transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">contact_support</span>
          <span>Visit CSC Kiosk for Enrolment</span>
        </button>
      </div>

      {/* 3 Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border border-[#e8e2d9] flex flex-col justify-between"
          >
            <div>
              {/* Sponsoring Agency & Deadline */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dbe1ff] text-[#002873]">
                  {scheme.sponsoringAgency}
                </span>
                <span className="text-[11px] font-bold text-[#ba1a1a]">
                  {scheme.deadlineText}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-[17px] text-[#1d1b16] mb-2 hover:text-[#003629] transition-colors">
                {onSelectScheme ? (
                  <button
                    type="button"
                    onClick={() => onSelectScheme(scheme.slug)}
                    className="text-left hover:underline"
                  >
                    {scheme.title}
                  </button>
                ) : (
                  scheme.title
                )}
              </h3>

              {/* Description */}
              <p className="text-[12px] text-[#404945] mb-4 leading-relaxed">
                {scheme.description}
              </p>

              {/* Documents Required Checklist */}
              <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] mb-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#003629] mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">task_alt</span>
                  <span>Required Documents</span>
                </div>
                <ul className="space-y-1.5">
                  {scheme.documentsRequired.map((doc, idx) => (
                    <li key={idx} className="text-[12px] text-[#1d1b16] flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#a63b00] shrink-0"></span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-2 pt-3 border-t border-[#f3ede4] flex items-center justify-between gap-2">
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#002873] font-bold hover:underline flex items-center gap-0.5"
              >
                <span>{scheme.actionLabel}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>

              <div className="flex items-center gap-2">
                {scheme.badgeText && (
                  <span className="text-[11px] font-semibold text-[#376757] bg-[#baeed9] px-2 py-0.5 rounded">
                    {scheme.badgeText}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onSaveScheme(scheme)}
                  title="Bookmark this Scheme"
                  className="p-1 rounded-lg text-[#707974] hover:text-[#003629] hover:bg-[#f3ede4] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
