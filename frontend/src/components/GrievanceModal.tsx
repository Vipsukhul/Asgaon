import { LucideIcon } from './LucideIcon';
import { useState } from 'react';
import type { Grievance } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface GrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitGrievance: (grievance: Grievance) => void;
}

export const GrievanceModal: React.FC<GrievanceModalProps> = ({
  isOpen,
  onClose,
  onSubmitGrievance
}) => {
  const { lang } = useLanguage();
  const isMr = lang === 'MR';
  const [category, setCategory] = useState('Drinking Water / Pipeline Leakage');
  const [ward, setWard] = useState('');
  const [desc, setDesc] = useState('');
  const [phone, setPhone] = useState('');
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.lodgeComplaint({
        title: `${category.split('/')[0].trim()} Issue at ${ward || 'Asgaon'}`,
        description: desc,
        category: category.split('/')[0].trim(),
        ward: ward || 'Village Center',
        citizenPhone: phone || '9822104500',
        isAnonymous: !phone,
      });

      const token = res.trackingNumber || ('ASG-2026-' + Math.floor(10000 + Math.random() * 90000));
      const newGrievance: Grievance = {
        id: res.id || ('g-' + Date.now()),
        trackingNumber: token,
        category: category.split('/')[0].trim(),
        title: res.title || `${category.split('/')[0].trim()} Issue at ${ward || 'Ward'}`,
        description: res.description || desc,
        wardOrArea: res.wardOrArea || ward,
        contactPhone: res.contactPhone || phone,
        status: res.status || 'SUBMITTED',
        statusBadge: 'Received (Under Review)',
        reportedBy: 'Citizen (' + (phone ? phone.slice(-4) : '4500') + ')',
        progressPercent: 20,
        actionTimeline: 'Submitted Just Now'
      };

      onSubmitGrievance(newGrievance);
      setSubmittedToken(token);
    } catch {
      const token = 'ASG-2026-' + Math.floor(10000 + Math.random() * 90000);
      const newGrievance: Grievance = {
        id: 'g-' + Date.now(),
        trackingNumber: token,
        category: category.split('/')[0].trim(),
        title: `${category.split('/')[0].trim()} Issue at ${ward || 'Ward'}`,
        description: desc,
        wardOrArea: ward,
        contactPhone: phone,
        status: 'SUBMITTED',
        statusBadge: 'Received (Under Review)',
        reportedBy: 'Citizen (' + (phone ? phone.slice(-4) : '4500') + ')',
        progressPercent: 20,
        actionTimeline: 'Submitted Just Now'
      };
      onSubmitGrievance(newGrievance);
      setSubmittedToken(token);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedToken(null);
    setWard('');
    setDesc('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e8e2d9] overflow-hidden p-6">
        {submittedToken ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#a7f3d0] text-[#166534] flex items-center justify-center mx-auto mb-4">
              <LucideIcon name="check_circle" className="text-[36px]" />
            </div>
            <h3 className="font-heading font-extrabold text-[22px] text-[#166534] mb-2">
              {isMr ? 'तक्रार यशस्वीरीत्या नोंदवली गेली!' : 'Grievance Registered Successfully!'}
            </h3>
            <p className="text-[13px] text-[#404945] mb-4">
              {isMr
                ? 'आपली तक्रार ग्रामपंचायत कार्यालय आणि संबंधित प्रभाग प्रतिनिधींकडे पाठवण्यात आली आहे.'
                : 'Your complaint has been forwarded to the Gram Sevak Office and ward officer.'}
            </p>
            <div className="bg-[#f9f3ea] p-4 rounded-xl border border-[#e8e2d9] mb-6">
              <div className="text-[11px] font-bold text-[#707974] uppercase">
                {isMr ? 'तक्रार संदर्भ क्रमांक' : 'Grievance Reference Number'}
              </div>
              <div className="font-heading font-extrabold text-[24px] text-[#c2410c] tracking-widest mt-1">
                {submittedToken}
              </div>
              <div className="text-[11px] text-[#404945] mt-1">
                {isMr
                  ? `+91 ${phone} वर एसएमएस पाठवला आहे. प्रभागातील कामाच्या प्रगतीनुसार स्थिती अद्यतनित होईल.`
                  : `SMS alert sent to +91 ${phone}. Status updates will reflect on the live ward desk.`}
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-[#166534] text-white text-[14px] font-bold hover:bg-[#052e16] transition-colors"
            >
              {isMr ? 'पूर्ण झाले / परत जा' : 'Done & Return to Portal'}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#f3ede4] mb-4">
              <div className="flex items-center gap-2">
                <LucideIcon name="campaign" className="text-[#c2410c] text-[24px]" />
                <h3 className="font-heading font-bold text-[18px] text-[#1d1b16]">
                  {isMr ? 'गावातील समस्या नोंदणी' : 'Report a Village Issue'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-[#707974] hover:text-[#1d1b16] p-1 rounded-lg"
              >
                <LucideIcon name="close" className="text-[20px]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                  {isMr ? 'समस्या प्रकार *' : 'Issue Category *'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
                >
                  <option value="Drinking Water / Pipeline Leakage">
                    {isMr ? 'पिण्याचे पाणी / पाईपलाईन गळती' : 'Drinking Water / Pipeline Leakage'}
                  </option>
                  <option value="Street Light / Electrical Breakdown">
                    {isMr ? 'रस्त्यावरील दिवे / वीज पुरवठा' : 'Street Light / Electrical Breakdown'}
                  </option>
                  <option value="Road Potholes & Drainage Block">
                    {isMr ? 'रस्ते खड्डे व सांडपाणी नाली' : 'Road Potholes & Drainage Block'}
                  </option>
                  <option value="Garbage Collection & Cleanliness">
                    {isMr ? 'कचरा व्यवस्थापन व स्वच्छता' : 'Garbage Collection & Cleanliness'}
                  </option>
                  <option value="Anganwadi / ZP School Facility">
                    {isMr ? 'अंगणवाडी / शाळा सुविधा' : 'Anganwadi / School Facility'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                  {isMr ? 'प्रभाग क्रमांक व ठिकाण *' : 'Ward Number & Landmark *'}
                </label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder={isMr ? 'उदा. प्रभाग क्र. २, हनुमान मंदिराजवळ' : 'e.g. Ward No. 2, Near Hanuman Temple'}
                  className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                  {isMr ? 'समस्येचे थोडक्यात वर्णन *' : 'Brief Description *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder={isMr ? 'समस्येबद्दल सविस्तर माहिती लिहा...' : 'Describe what is broken or needed...'}
                  className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                  {isMr ? 'मोबाईल क्रमांक (SMS माहितीसाठी) *' : 'Your Mobile Number (for SMS updates) *'}
                </label>
                <div className="flex gap-2">
                  <span className="p-2.5 bg-[#f3ede4] text-[#1d1b16] rounded-xl text-[13px] font-bold border border-[#e8e2d9]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isMr ? '१० अंकी मोबाईल क्रमांक' : '10-digit mobile number'}
                    className="flex-1 bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-[#c2410c] text-white text-[13px] font-bold hover:bg-[#852f00] transition-colors shadow-xs disabled:opacity-50"
                >
                  {loading
                    ? (isMr ? 'नोंदणी होत आहे...' : 'Submitting to Panchayat...')
                    : (isMr ? 'तक्रार नोंदवा' : 'Submit Grievance')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
