import React, { useState, useEffect } from 'react';
import { LucideIcon } from './LucideIcon';
import { useLanguage } from '../context/LanguageContext';

export const InstallPwaBanner: React.FC = () => {
  const { lang } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // Check if user previously dismissed banner in last 24 hours
    const dismissedAt = localStorage.getItem('asgaon_pwa_dismissed');
    if (dismissedAt) {
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - Number(dismissedAt) < oneDay) {
        return;
      }
    }

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);

    if (isIosDevice && isSafari) {
      setIsIos(true);
      // Show prompt after a slight delay
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // Check if deferredPrompt was already captured globally
    if ((window as any).__deferredPwaPrompt) {
      setDeferredPrompt((window as any).__deferredPwaPrompt);
      setIsVisible(true);
    }

    // Android / Chrome / Edge PWA prompt listener
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as any).__deferredPwaPrompt = e;
      setDeferredPrompt(e);
      // Show install banner
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    const promptEvent = deferredPrompt || (window as any).__deferredPwaPrompt;

    if (!promptEvent) {
      setShowIosGuide(true);
      return;
    }

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
    (window as any).__deferredPwaPrompt = null;
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('asgaon_pwa_dismissed', String(Date.now()));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Bottom App Installation Banner */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-[#166534] text-white p-4 rounded-2xl shadow-2xl border border-emerald-600/40 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/asgaon-logo.png"
              alt="Asgaon Logo"
              className="w-11 h-11 rounded-xl bg-white p-1 object-contain shrink-0 shadow-sm border border-emerald-700/50"
            />
            <div className="min-w-0">
              <h4 className="font-heading font-extrabold text-[13px] leading-tight truncate">
                {lang === 'MR' ? 'आसगाव ॲप इन्स्टॉल करा' : 'Install Asgaon Village App'}
              </h4>
              <p className="text-[11px] text-emerald-200/90 leading-snug mt-0.5 truncate">
                {lang === 'MR'
                  ? 'मोबाईलवर जलद प्रवेश व ऑफलाइन सेवा'
                  : 'Fast mobile access & offline alerts'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-white text-[#166534] hover:bg-emerald-50 active:scale-95 text-[11px] font-black rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              {lang === 'MR' ? 'इन्स्टॉल करा' : 'Install'}
            </button>
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              title={lang === 'MR' ? 'बंद करा' : 'Dismiss'}
            >
              <LucideIcon name="close" className="text-[16px]" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200 text-stone-900 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/asgaon-logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
                <h3 className="font-heading font-extrabold text-[15px] text-[#166534]">
                  {lang === 'MR' ? 'iPhone वर ॲप कसे इन्स्टॉल करावे?' : 'Install on iPhone'}
                </h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="w-7 h-7 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500"
              >
                <LucideIcon name="close" className="text-base" />
              </button>
            </div>

            <ol className="text-[13px] text-stone-700 space-y-2.5 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#166534] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Safari ब्राउझरच्या खालील <strong>शेअर बटणावर (Share <LucideIcon name="share" className="inline text-[13px]" />)</strong> टॅप करा.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#166534] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>खाली स्क्रोल करून <strong>'Add to Home Screen' (+ होम स्क्रीनवर जोडा)</strong> निवडा.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#166534] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>वर उजव्या कोपऱ्यात <strong>'Add'</strong> दाबा. ॲप तुमच्या स्क्रीनवर तयार होईल!</span>
              </li>
            </ol>

            <button
              onClick={() => {
                setShowIosGuide(false);
                setIsVisible(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white text-[13px] font-bold transition-colors"
            >
              {lang === 'MR' ? 'समजले' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
