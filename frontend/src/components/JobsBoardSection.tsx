import React from 'react';
import type { Job } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface JobsBoardSectionProps {
  jobs: Job[];
  onPostJob: () => void;
  onApplyJob: (job: Job) => void;
}

export const JobsBoardSection: React.FC<JobsBoardSectionProps> = ({ jobs, onPostJob, onApplyJob }) => {
  const { lang } = useLanguage();

  return (
    <section id="jobs" className="w-full mb-12 scroll-mt-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="font-heading font-extrabold text-[22px] text-[#003629] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a63b00]">work</span>
            <span>{lang === 'MR' ? 'ग्रामीण रोजगार मंच • स्थानिक काम व नोकऱ्या' : 'Gramin Rojgar Manch • Village Jobs Board'}</span>
          </h2>
          <p className="text-[13px] text-[#404945]">
            {lang === 'MR'
              ? 'प्रमाणित मजुरी आणि थेट मालकाचा फोन क्रमांक. शून्य दलाली किंवा कमिशन.'
              : 'Verified wages & direct employer phone. Zero brokerage or middleman fees.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onPostJob}
          className="px-4 py-2 rounded-xl bg-white text-[#003629] border border-[#003629] text-[13px] font-bold hover:bg-[#003629] hover:text-white transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">post_add</span>
          <span>{lang === 'MR' ? 'मोफत कामगार / नोकरी जाहिरात टाका' : 'Post Free Job Vacancy'}</span>
        </button>
      </div>

      {/* 3 Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border border-[#e8e2d9] flex flex-col justify-between"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#baeed9] text-[#002117]">
                  {job.employmentType}
                </span>
                <span className="text-[11px] font-medium text-[#707974]">
                  {job.postedAgo}
                </span>
              </div>

              {/* Title & Employer */}
              <h3 className="font-heading font-bold text-[17px] text-[#1d1b16] mb-1">
                {job.title}
              </h3>
              <div className="text-[12px] font-semibold text-[#a63b00] mb-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">apartment</span>
                <span className="truncate">{job.employerName}</span>
              </div>

              {/* Compensation Box */}
              <div className="bg-[#f9f3ea] p-2.5 rounded-xl border border-[#e8e2d9] mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#404945]">{lang === 'MR' ? 'वेतन / मोबदला' : 'Compensation'}</span>
                <span className="font-heading font-extrabold text-[15px] text-[#003629]">
                  {job.salaryRange}
                </span>
              </div>

              {/* Description */}
              <p className="text-[12px] text-[#404945] line-clamp-3 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-[#f3ede4] flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-[#707974] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#376757]">verified</span>
                <span>{lang === 'MR' ? 'थेट मालक' : 'Direct Employer'}</span>
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${job.contactPhone}`}
                  className="px-3 py-1.5 rounded-lg bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#1d1b16] text-[12px] font-bold transition-colors flex items-center gap-1 border border-[#e8e2d9]"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#003629]">call</span>
                  <span>{lang === 'MR' ? 'कॉल करा' : 'Call'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => onApplyJob(job)}
                  className="px-3 py-1.5 rounded-lg bg-[#003629] text-white hover:bg-[#1b4d3e] text-[12px] font-bold transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>{lang === 'MR' ? 'अर्ज करा' : 'Apply Now'}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
