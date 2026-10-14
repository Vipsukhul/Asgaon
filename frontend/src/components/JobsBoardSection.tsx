import { LucideIcon } from './LucideIcon';
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
            <LucideIcon name="work" className="text-blue-700 text-[28px]" />
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
          className="px-4 py-2 rounded-xl bg-white text-blue-900 border-2 border-blue-800 text-[13px] font-extrabold hover:bg-blue-800 hover:text-white transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <LucideIcon name="post_add" className="text-[18px]" />
          <span>{lang === 'MR' ? 'मोफत कामगार / नोकरी जाहिरात टाका' : 'Post Free Job Vacancy'}</span>
        </button>
      </div>

      {/* 3 Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="group bg-white rounded-2xl p-5 shadow-xs hover:shadow-xl hover:shadow-blue-900/10 border border-stone-200/80 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                  {job.employmentType}
                </span>
                <span className="text-[11px] font-semibold text-stone-500">
                  {job.postedAgo}
                </span>
              </div>

              {/* Title & Employer */}
              <h3 className="font-heading font-extrabold text-[17px] text-stone-900 group-hover:text-blue-900 mb-1 transition-colors">
                {job.title}
              </h3>
              <div className="text-[12px] font-bold text-orange-700 mb-3 flex items-center gap-1">
                <LucideIcon name="apartment" className="text-[15px]" />
                <span className="truncate">{job.employerName}</span>
              </div>

              {/* Compensation Box */}
              <div className="bg-[#faf6ee] p-2.5 rounded-xl border border-[#efe7dc] mb-3 flex items-center justify-between shadow-2xs">
                <span className="text-[11px] font-bold text-stone-600">{lang === 'MR' ? 'वेतन / मोबदला' : 'Compensation'}</span>
                <span className="font-heading font-black text-[16px] text-emerald-700">
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
                <LucideIcon name="verified" className="text-[15px] text-emerald-700" />
                <span>{lang === 'MR' ? 'थेट मालक' : 'Direct Employer'}</span>
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${job.contactPhone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 rounded-lg bg-[#faf6ee] text-stone-800 hover:bg-[#f3ede4] text-[12px] font-bold transition-all flex items-center gap-1 border border-[#efe7dc] shadow-2xs"
                >
                  <LucideIcon name="call" className="text-[14px] text-emerald-800" />
                  <span>{lang === 'MR' ? 'कॉल करा' : 'Call'}</span>
                </a>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyJob(job);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-700 text-white hover:bg-blue-800 text-[12px] font-extrabold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <span>{lang === 'MR' ? 'अर्ज करा' : 'Apply Now'}</span>
                  <LucideIcon name="arrow_forward" className="text-[14px]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
