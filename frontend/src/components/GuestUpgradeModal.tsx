import { LucideIcon } from './LucideIcon';
import React from 'react';

interface GuestUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToLogin: () => void;
  actionTitle?: string;
}

export const GuestUpgradeModal: React.FC<GuestUpgradeModalProps> = ({
  isOpen,
  onClose,
  onProceedToLogin,
  actionTitle = 'Perform this action'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e8e2d9] overflow-hidden p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[#f9f3ea] text-[#c2410c] flex items-center justify-center mx-auto mb-3 border border-[#e8e2d9]">
          <LucideIcon name="lock_open" className="text-[30px]" />
        </div>

        <h3 className="font-heading font-extrabold text-[20px] text-[#166534] mb-1">
          Sign-In Required
        </h3>
        <p className="text-[13px] text-[#404945] mb-4">
          To <span className="font-bold text-[#c2410c]">{actionTitle}</span>, please sign in.
        </p>

        <div className="bg-[#f9f3ea] p-3.5 rounded-xl border border-[#e8e2d9] text-left mb-5 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#166534]">
            Authenticated Privileges:
          </div>
          <div className="text-[12px] text-[#1d1b16] flex items-center gap-2">
            <LucideIcon name="bookmark" className="text-[16px] text-[#376757]" />
            <span>Bookmark favorite businesses, jobs &amp; schemes</span>
          </div>
          <div className="text-[12px] text-[#1d1b16] flex items-center gap-2">
            <LucideIcon name="history" className="text-[16px] text-[#376757]" />
            <span>Track complaint status and job application replies</span>
          </div>
          <div className="text-[12px] text-[#1d1b16] flex items-center gap-2">
            <LucideIcon name="notifications" className="text-[16px] text-[#376757]" />
            <span>Get emergency SMS broadcasts directly to your phone</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onProceedToLogin}
            className="w-full py-2.5 rounded-xl bg-[#166534] text-white text-[13px] font-bold hover:bg-[#052e16] transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <LucideIcon name="login" className="text-[18px]" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-[#f3ede4] text-[#1d1b16] text-[12px] font-bold hover:bg-[#e8e2d9] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
