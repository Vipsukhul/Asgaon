import type { Grievance } from '../types';

interface GrievanceDeskSectionProps {
  grievances: Grievance[];
  onOpenReportModal: () => void;
  onTrackComplaint: () => void;
}

export const GrievanceDeskSection: React.FC<GrievanceDeskSectionProps> = ({
  grievances,
  onOpenReportModal,
  onTrackComplaint
}) => {
  return (
    <section id="complaints" className="w-full mb-12 scroll-mt-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="font-heading font-extrabold text-[22px] text-[#003629] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a63b00]">report_problem</span>
            <span>Public Grievance &amp; Ward Resolution Desk</span>
          </h2>
          <p className="text-[13px] text-[#404945]">
            Track community issues in real-time. Notice boards are updated every 24 hours by the Gram Sevak Office.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTrackComplaint}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#e8e2d9] text-[#1d1b16] text-[13px] font-bold hover:bg-[#f3ede4] transition-colors"
          >
            Track Status
          </button>
          <button
            type="button"
            onClick={onOpenReportModal}
            className="px-4 py-2 rounded-xl bg-[#a63b00] text-white text-[13px] font-bold hover:bg-[#852f00] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            <span>Report a Village Issue / समस्या नोंदवा</span>
          </button>
        </div>
      </div>

      {/* 3 Grievance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {grievances.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border border-[#e8e2d9] flex flex-col justify-between"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    item.status === 'RESOLVED'
                      ? 'bg-[#baeed9] text-[#002117]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  {item.statusBadge}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#707974] bg-[#f3ede4] px-2 py-0.5 rounded">
                  Token: {item.trackingNumber}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-[16px] text-[#1d1b16] mb-2 leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[12px] text-[#404945] mb-4 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            {/* Bottom Status Trail */}
            <div className="pt-3 border-t border-[#f3ede4] flex items-center justify-between text-[11px] text-[#707974]">
              <span className="truncate">Reported: {item.reportedBy}</span>
              <span
                className={`font-bold ${
                  item.status === 'RESOLVED' ? 'text-[#003629]' : 'text-[#a63b00]'
                }`}
              >
                {item.actionTimeline}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
