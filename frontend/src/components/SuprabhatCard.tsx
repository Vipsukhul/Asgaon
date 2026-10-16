import React, { useState, useEffect } from 'react';
import { LucideIcon } from './LucideIcon';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Share2, Check } from 'lucide-react';
import { fetchLiveWeather, type LiveWeatherData } from '../services/weatherService';

interface SuprabhatCardProps {
  onExploreMandi?: () => void;
}

export const SuprabhatCard: React.FC<SuprabhatCardProps> = ({ onExploreMandi }) => {
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);

  useEffect(() => {
    fetchLiveWeather().then(setWeather).catch(() => {});
  }, []);

  const isMr = lang === 'MR';

  const today = new Date();
  const marathiMonths = [
    'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
    'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
  ];
  const marathiDays = ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const formattedDate = isMr
    ? `${today.getDate()} ${marathiMonths[today.getMonth()]} ${today.getFullYear()} (${marathiDays[today.getDay()]})`
    : today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const DAILY_THOUGHTS = [
    { mr: '“शेतकऱ्यांची मेहनत आणि गावाची एकी, हीच खरी आसगावची खरी समृद्धी आहे.”', en: '“Hard work of farmers and unity of the village is the true prosperity of Asgaon.”' },
    { mr: '“शिक्षण आणि स्वाभिमान हीच गावाच्या नव्या पिढीची खरी ताकद आहे — डॉ. बाबासाहेब आंबेडकर.”', en: '“Education and self-respect are the true strength of our next generation.”' },
    { mr: '“एकमेका साह्य करू, अवघे धरू सुपंथ — संत तुकाराम महाराज.”', en: '“Support one another and walk the righteous path together.”' },
    { mr: '“झाडे लावा, जल संवर्धन करा, आपले आसगाव सुजलाम् सुफलाम् बनवा.”', en: '“Plant trees, conserve water, make our village green and prosperous.”' },
    { mr: '“मातीवर निष्ठा आणि कष्टावर विश्वास, हाच शेतकरी बांधवांचा खरा श्वास.”', en: '“Faith in the soil and honest labor is the spirit of our farmers.”' },
    { mr: '“स्वच्छ गाव, निरोगी गाव, समृद्धीच्या दिशेने डिजिटल आसगाव.”', en: '“Clean village, healthy village, progressive Digital Asgaon.”' },
    { mr: '“विद्या विना मती गेली, मती विना नीती गेली — शिक्षणानेच गावाची प्रगती होईल — महात्मा जोतीराव फुले.”', en: '“True prosperity of a village comes from universal education and awareness.”' }
  ];

  const thoughtIndex = today.getDate() % DAILY_THOUGHTS.length;
  const dailyThought = isMr ? DAILY_THOUGHTS[thoughtIndex].mr : DAILY_THOUGHTS[thoughtIndex].en;

  const weatherText = weather 
    ? `${weather.weatherIcon} ${Math.round(weather.temperature)}°C, ${isMr ? weather.weatherTextMr : weather.weatherTextEn} • ${isMr ? 'पाऊस' : 'Rain'} ${weather.precipitationProb}%`
    : '🌤️ २९°C, निरभ्र आकाश • पाऊस ०%';

  const handleShareWhatsApp = () => {
    const shareText = isMr
      ? `🌅 *सुप्रभात आसगाव!* 🌾\n📅 *तारीख:* ${formattedDate}\n🌤️ *हवामान (पवनी/आसगाव):* ${weatherText}\n🌾 *आजचा भाव (पवनी बाजार):* धान ₹२,५४० | सोयाबीन ₹४,७२०\n💡 *आजचा सुविचार:* ${dailyThought}\n\n👉 *गावाच्या सर्व बातम्या व योजना:* https://asgaon.digital\n#डिजिटल_आसगाव #ग्रामपंचायत`
      : `🌅 *Good Morning Asgaon!* 🌾\n📅 *Date:* ${formattedDate}\n🌤️ *Weather (Pauni/Asgaon):* ${weatherText}\n🌾 *Pauni Mandi:* Paddy ₹2,540 | Soybean ₹4,720\n💡 *Thought:* ${dailyThought}\n\n👉 *Village Hub:* https://asgaon.digital\n#DigitalAsgaon`;

    if (navigator.share) {
      navigator.share({
        title: isMr ? 'सुप्रभात आसगाव' : 'Good Morning Asgaon',
        text: shareText,
        url: window.location.origin
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      showToast(isMr ? 'व्हॉट्सॲप मेसेज कॉपी झाला! स्टेटसवर पेस्ट करा.' : 'Status copied! Paste in your WhatsApp Status.', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-emerald-600/5 to-emerald-950/10 border border-amber-200/80 p-5 sm:p-6 shadow-sm">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left: Greeting & Thought */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[12px] font-extrabold shadow-xs">
              <span>🌅</span>
              <span>{isMr ? 'सुप्रभात आसगाव' : 'Good Morning Asgaon'}</span>
            </span>

            <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
              <LucideIcon name="calendar_today" className="text-[14px] text-amber-700" />
              <span>{formattedDate}</span>
            </span>
          </div>

          <p className="text-[14px] sm:text-[15px] font-heading font-bold text-emerald-950 italic">
            {dailyThought}
          </p>

          {/* Quick Weather & Mandi Snapshot Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] sm:text-[12px] font-semibold text-stone-700">
            <span className="inline-flex items-center gap-1 bg-white/90 border border-amber-200 px-2.5 py-1 rounded-lg shadow-2xs">
              <span>{weather?.weatherIcon || '🌤️'}</span>
              <span>
                {weather
                  ? (isMr ? `पवनी हवामान: ${Math.round(weather.temperature)}°C (${weather.weatherTextMr})` : `Weather: ${Math.round(weather.temperature)}°C (${weather.weatherTextEn})`)
                  : (isMr ? 'पवनी हवामान: २९°C (निरभ्र)' : 'Weather: 29°C (Clear)')}
              </span>
            </span>

            <span 
              onClick={onExploreMandi}
              className="inline-flex items-center gap-1 bg-white/90 border border-emerald-200 px-2.5 py-1 rounded-lg shadow-2xs hover:border-emerald-500 cursor-pointer text-emerald-900 transition-colors"
            >
              <span>🌾</span>
              <span>{isMr ? 'धान भाव (पवनी): ₹२,५४०/क्विं ↗' : 'Paddy (Pauni): ₹2,540/Qtl ↗'}</span>
            </span>
          </div>
        </div>

        {/* Right: WhatsApp Share Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] active:scale-95 text-white text-[13px] font-extrabold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
            title={isMr ? 'व्हॉट्सॲप स्टेटसवर शेअर करा' : 'Share to WhatsApp Status'}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>{isMr ? 'कॉपी झाले!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-white" />
                <span>{isMr ? 'WhatsApp स्टेटसवर ठेवा 📲' : 'Share on WhatsApp 📲'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
