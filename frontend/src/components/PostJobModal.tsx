import { useState } from 'react';
import type { Job } from '../types';
import { api } from '../services/api';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: Job) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onAddJob }) => {
  const [title, setTitle] = useState('');
  const [employer, setEmployer] = useState('');
  const [type, setType] = useState<'Daily Wage' | 'Full-Time Staff' | 'Contract / Technical'>('Daily Wage');
  const [salary, setSalary] = useState('');
  const [phone, setPhone] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.createJob({
        title,
        employerName: employer,
        employmentType: type,
        salaryRange: salary || 'Negotiable',
        location: 'Asgaon Ward Area',
        description: desc || 'Local job vacancy in village.',
        requirements: 'Experience in respective trade.',
        contactPhone: phone
      });

      const newJob: Job = {
        id: res.id || ('j-' + Date.now()),
        title: res.title || title,
        slug: res.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        employerName: res.employerName || employer,
        employmentType: res.employmentType || type,
        salaryRange: res.salaryRange || salary || 'Negotiable',
        location: res.location || 'Asgaon Ward Area',
        description: res.description || desc || 'Local job vacancy in village.',
        requirements: res.requirements || 'Experience in respective trade.',
        contactPhone: res.contactPhone || phone,
        status: res.status || 'ACTIVE',
        postedAgo: 'Posted Just Now',
        expiresAt: '2026-11-30'
      };

      onAddJob(newJob);
      alert('Job posting published on Gramin Rojgar Manch!');
      onClose();
    } catch {
      const newJob: Job = {
        id: 'j-' + Date.now(),
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        employerName: employer,
        employmentType: type,
        salaryRange: salary || 'Negotiable',
        location: 'Asgaon Ward Area',
        description: desc || 'Local job vacancy in village.',
        requirements: 'Experience in respective trade.',
        contactPhone: phone,
        status: 'ACTIVE',
        postedAgo: 'Posted Just Now',
        expiresAt: '2026-11-30'
      };

      onAddJob(newJob);
      alert('Job posting published on Gramin Rojgar Manch!');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e8e2d9] overflow-hidden p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#f3ede4] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003629] text-[24px]">post_add</span>
            <div>
              <h3 className="font-heading font-bold text-[18px] text-[#1d1b16]">
                Post Free Job Vacancy (रोजगार जाहिरात)
              </h3>
              <p className="text-[11px] text-[#707974]">Direct hiring • Zero brokerage fees</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#707974] hover:text-[#1d1b16]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              Job Title (कामाचे नाव)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tractor Driver / Shop Assistant / Electrician"
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#003629]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              Employer / Business Name (मालक / संस्थेचे नाव)
            </label>
            <input
              type="text"
              required
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              placeholder="e.g. Kisan Agro Center / Dr. Clinic"
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#003629]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                Employment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#003629]"
              >
                <option value="Daily Wage">Daily Wage (रोजंदारी)</option>
                <option value="Full-Time Staff">Full-Time Staff (पूर्ण वेळ)</option>
                <option value="Contract / Technical">Contract / Technical</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                Wage / Salary (वेतन)
              </label>
              <input
                type="text"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. ₹800 / Day or ₹15,000 / Mo"
                className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#003629]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              Contact Phone (संपर्क मोबाईल)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit number"
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#003629]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              Job Description (कामाचे स्वरूप)
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe tasks, working hours, meals or requirements..."
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#003629]"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2 pt-2 border-t border-[#f3ede4]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#f3ede4] text-[#1d1b16] text-[13px] font-bold hover:bg-[#e8e2d9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#003629] text-white text-[13px] font-bold hover:bg-[#1b4d3e] transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Publish Job Vacancy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
