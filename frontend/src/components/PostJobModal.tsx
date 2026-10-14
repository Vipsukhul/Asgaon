import { LucideIcon } from './LucideIcon';
import { useState } from 'react';
import type { Job } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: Job) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onAddJob }) => {
  const { lang } = useLanguage();
  const isMr = lang === 'MR';
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
      alert(isMr ? 'रोजगार जाहिरात ग्रामीण रोजगार मंचावर प्रसिद्ध केली!' : 'Job posting published on Gramin Rojgar Manch!');
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
      alert(isMr ? 'रोजगार जाहिरात ग्रामीण रोजगार मंचावर प्रसिद्ध केली!' : 'Job posting published on Gramin Rojgar Manch!');
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
            <LucideIcon name="post_add" className="text-[#166534] text-[24px]" />
            <div>
              <h3 className="font-heading font-bold text-[18px] text-[#1d1b16]">
                {isMr ? 'नवीन रोजगार किंवा काम द्या' : 'Post Free Job Vacancy'}
              </h3>
              <p className="text-[11px] text-[#707974]">
                {isMr ? 'थेट भरती • कोणतीही दलाली किंवा फी नाही' : 'Direct hiring • Zero brokerage fees'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#707974] hover:text-[#1d1b16]">
            <LucideIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              {isMr ? 'कामाचे नाव / पद *' : 'Job Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isMr ? 'उदा. ट्रॅक्टर चालक, दुकान मदतनीस, वायरमन' : 'e.g. Tractor Driver, Shop Assistant, Electrician'}
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              {isMr ? 'मालक / आस्थापनेचे नाव *' : 'Employer / Business Name *'}
            </label>
            <input
              type="text"
              required
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              placeholder={isMr ? 'उदा. किसान ॲग्रो सेंटर किंवा डॉ. क्लिनिक' : 'e.g. Kisan Agro Center or Dr. Clinic'}
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                {isMr ? 'कामाचा प्रकार' : 'Employment Type'}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
              >
                <option value="Daily Wage">{isMr ? 'रोजंदारी' : 'Daily Wage'}</option>
                <option value="Full-Time Staff">{isMr ? 'पूर्ण वेळ' : 'Full-Time Staff'}</option>
                <option value="Contract / Technical">{isMr ? 'कंत्राटी / तांत्रिक' : 'Contract / Technical'}</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                {isMr ? 'वेतन / मानधन *' : 'Wage / Salary *'}
              </label>
              <input
                type="text"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder={isMr ? 'उदा. ₹८०० / दिवस किंवा ₹१५,००० / महिना' : 'e.g. ₹800 / Day or ₹15,000 / Mo'}
                className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              {isMr ? 'संपर्क मोबाईल क्रमांक *' : 'Contact Phone *'}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit number"
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              {isMr ? 'कामाचे स्वरूप / सविस्तर माहिती' : 'Job Description'}
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={isMr ? 'कामाचे तास, अनुभव किंवा इतर अटींबद्दल थोडक्यात लिहा...' : 'Describe tasks, working hours, meals or requirements...'}
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2 pt-2 border-t border-[#f3ede4]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#f3ede4] text-[#1d1b16] text-[13px] font-bold hover:bg-[#e8e2d9] transition-colors"
            >
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#166534] text-white text-[13px] font-bold hover:bg-[#052e16] transition-colors shadow-xs disabled:opacity-50"
            >
              {loading
                ? (isMr ? 'नोंदणी होत आहे...' : 'Posting...')
                : (isMr ? 'जाहिरात प्रसिद्ध करा' : 'Publish Job Vacancy')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
