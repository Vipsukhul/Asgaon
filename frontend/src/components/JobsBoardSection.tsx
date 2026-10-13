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
          <h2 className="font-heading font-extrabold text-[24px] text-emerald-950 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c2410c] text-[28px]">work</span>
            <span>{lang === 'MR' ? 'ग्रामीण रोजगार मंच • स्थानिक काम व नोकऱ्या' : 'Gramin Rojgar Manch • Village Jobs Board'}</span>
          </h2>
          <p className="text-[13px] text-stone-600">
            {lang === 'MR'
              ? 'प्रमाणित मजुरी आणि थेट मालकाचा फोन क्रमांक. शून्य दलाली किंवा कमिशन.'
              : 'Verified wages & direct employer phone. Zero brokerage or middleman fees.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onPostJob}
          className="px-4 py-2 rounded-xl bg-white text-emerald-900 border-2 border-emerald-800 text-[13px] font-extrabold hover:bg-emerald-800 hover:text-white transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
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
            className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border border-[#efe7dc] hover:border-emerald-700 flex flex-col justify-between"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {job.employmentType}
                </span>
                <span className="text-[11px] font-semibold text-stone-500">
                  {job.postedAgo}
                </span>
              </div>

              {/* Title & Employer */}
              <h3 className="font-heading font-extrabold text-[17px] text-stone-900 mb-1">
                {job.title}
              </h3>
              <div className="text-[12px] font-bold text-[#c2410c] mb-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">apartment</span>
                <span className="truncate">{job.employerName}</span>
              </div>

              {/* Compensation Box */}
              <div className="bg-[#faf6ee] p-2.5 rounded-xl border border-[#efe7dc] mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-600">{lang === 'MR' ? 'वेतन / मोबदला' : 'Compensation'}</span>
                <span className="font-heading font-black text-[16px] text-emerald-800">
                  {job.salaryRange}
                </span>
              </div>

              {/* Description */}
              <p className="text-[12px] text-stone-600 line-clamp-3 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-[#efe7dc] flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-700">verified</span>
                <span>{lang === 'MR' ? 'थेट मालक' : 'Direct Employer'}</span>
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${job.contactPhone}`}
                  className="px-3 py-1.5 rounded-lg bg-[#faf6ee] hover:bg-[#f3ede4] text-stone-800 text-[12px] font-bold transition-colors flex items-center gap-1 border border-[#efe7dc]"
                >
                  <span className="material-symbols-outlined text-[14px] text-emerald-800">call</span>
                  <span>{lang === 'MR' ? 'कॉल करा' : 'Call'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => onApplyJob(job)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 text-[12px] font-extrabold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
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
