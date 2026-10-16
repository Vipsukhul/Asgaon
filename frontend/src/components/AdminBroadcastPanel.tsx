import React, { useState, useRef } from 'react';
import { LucideIcon } from './LucideIcon';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { sendTestPushNotification } from '../services/pushNotifications';

interface AdminBroadcastPanelProps {
  currentUser?: any;
}

export const AdminBroadcastPanel: React.FC<AdminBroadcastPanelProps> = () => {
  const { lang } = useLanguage();
  const toast = useToast();
  const isMr = lang === 'MR';

  // Form State - strictly Title, Description, Image Upload & Channel
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [actionUrl, setActionUrl] = useState('/announcements');
  const [category, setCategory] = useState<'URGENT' | 'WATER' | 'POWER' | 'GRAMSABHA' | 'GENERAL'>('URGENT');
  
  // Delivery Mode: 'push' | 'email' | 'both'
  const [deliveryMode, setDeliveryMode] = useState<'push' | 'email' | 'both'>('push');
  const [emailSubject, setEmailSubject] = useState('');

  // UI state
  const [previewTab, setPreviewTab] = useState<'phone' | 'email'>('phone');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [imageFileName, setImageFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Broadcast History (cached in localStorage)
  const [history, setHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('dg_broadcast_history');
      return saved ? JSON.parse(saved) : [
        {
          id: 'b-1',
          title: 'प्रभाग क्र. २ पाणी पुरवठा दुरुस्ती',
          message: 'पाईपलाईन दुरुस्तीच्या कामामुळे उद्या सकाळी पाणी पुरवठा बंद राहील.',
          imageUrl: '',
          mode: 'push',
          timestamp: 'काल दुपारी ३:३०',
          sentCount: 142
        }
      ];
    } catch {
      return [];
    }
  });

  // Handle local image file upload & instant base64 preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warning(isMr ? 'प्रतिमेचा आकार ५ एमबी पेक्षा कमी असावा.' : 'Image size must be less than 5MB.');
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageUrl(result);
      toast.success(isMr ? 'छायाचित्र यशस्वीरीत्या जोडले.' : 'Image uploaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImageFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Quick preset helper
  const applyPreset = (presetTitle: string, presetDesc: string, presetCat: any) => {
    setTitle(presetTitle);
    setMessage(presetDesc);
    setCategory(presetCat);
  };

  // 1. Send Local Instant Test to Admin's Device
  const handleSendTest = async () => {
    if (!title.trim()) {
      toast.warning(isMr ? 'कृपया आधी शीर्षक प्रविष्ट करा.' : 'Please enter a title first.');
      return;
    }
    setIsTesting(true);
    try {
      await sendTestPushNotification(
        title.trim(),
        message.trim() || (isMr ? 'आसगाव ग्रामपंचायत थेट सूचना चाचणी' : 'Asgaon Gram Panchayat notification test'),
        actionUrl || '/'
      );
      toast.success(isMr ? 'तुमच्या स्क्रीनवर चाचणी सूचना पाठवली आहे!' : 'Test notification displayed on your screen!');
    } catch (err: any) {
      toast.error(err?.message || (isMr ? 'चाचणी सूचना पाठवता आली नाही.' : 'Failed to send test alert.'));
    } finally {
      setIsTesting(false);
    }
  };

  // 2. Broadcast to all registered subscribers / emails
  const handleBroadcast = async () => {
    if (!title.trim() || !message.trim()) {
      toast.warning(isMr ? 'कृपया शीर्षक आणि तपशील दोन्ही भरा.' : 'Please enter both title and message.');
      return;
    }

    const confirmMsg = isMr
      ? `तुम्ही ही सूचना सर्व नोंदणीकृत गावकऱ्यांना पाठवू इच्छिता का?\n\nशीर्षक: "${title}"\nप्रकार: ${deliveryMode.toUpperCase()}`
      : `Broadcast this announcement to all village citizens?\n\nTitle: "${title}"\nMode: ${deliveryMode.toUpperCase()}`;

    if (!window.confirm(confirmMsg)) return;

    setIsBroadcasting(true);
    try {
      const payload: any = {
        title: title.trim(),
        message: message.trim(),
        url: actionUrl || '/',
        category: category,
        imageUrl: imageUrl || '',
        sendEmail: deliveryMode === 'email' || deliveryMode === 'both',
        emailSubject: emailSubject.trim() || title.trim()
      };

      const res = await api.broadcastNotification(payload);

      const newRecord = {
        id: `b-${Date.now()}`,
        title: title.trim(),
        message: message.trim(),
        imageUrl: imageUrl,
        mode: deliveryMode,
        timestamp: new Date().toLocaleTimeString(isMr ? 'mr-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        sentCount: res?.data?.totalReached || res?.data?.pushSentCount || 1
      };

      const updatedHistory = [newRecord, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      try {
        localStorage.setItem('dg_broadcast_history', JSON.stringify(updatedHistory));
      } catch {}

      toast.success(
        isMr
          ? `दवंडी प्रसारित झाली! एकूण पोहोच: ${res?.data?.totalReached || 'यशस्वी'}`
          : `Broadcast dispatched! Reached: ${res?.data?.totalReached || 'Success'}`
      );

      // Clean form after broadcast
      setTitle('');
      setMessage('');
      setImageUrl('');
      setImageFileName('');
      setEmailSubject('');
    } catch (err: any) {
      toast.error(err?.message || (isMr ? 'दवंडी पाठवताना त्रुटी आली.' : 'Failed to broadcast.'));
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shadow-xs">
                <LucideIcon name="cell_tower" className="text-[20px] text-amber-300" />
              </span>
              <h2 className="text-xl md:text-2xl font-black font-heading tracking-wide">
                {isMr ? 'डिजिटल दवंडी व थेट सूचना केंद्र' : 'Civic Push & Email Broadcast Center'}
              </h2>
            </div>
            <p className="text-emerald-100 text-xs md:text-sm max-w-2xl leading-relaxed">
              {isMr
                ? 'गावातील नागरिकांच्या मोबाईल लॉक-स्क्रीनवर व ई-मेलवर थेट शासकीय सूचना, पाणी पुरवठा व तातडीचे अलर्ट एका क्लिकमध्ये पाठवा.'
                : 'Send instant lock-screen mobile push notifications and official circular emails directly to village residents.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-center">
              <div className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">
                {isMr ? 'थेट पोहोच' : 'Delivery Speed'}
              </div>
              <div className="text-sm font-black text-amber-300">
                ⚡ {isMr ? 'तात्काळ' : 'Instant'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-center">
              <div className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">
                {isMr ? 'स्थिती' : 'Service Status'}
              </div>
              <div className="text-sm font-black text-emerald-300 flex items-center gap-1 justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isMr ? 'सक्रिय' : 'Live'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Form) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-[#e7dece] shadow-xs space-y-5">
            {/* Delivery Channel Selector */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">
                {isMr ? '१. सूचना माध्यम निवडा (Broadcast Channel)' : '1. Select Broadcast Channel'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMode('push');
                    setPreviewTab('phone');
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    deliveryMode === 'push'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs ring-2 ring-emerald-600/20'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <LucideIcon name="notifications_active" className={`text-[18px] ${deliveryMode === 'push' ? 'text-emerald-700' : ''}`} />
                  <span>{isMr ? 'थेट पुश सूचना' : 'Push Notification'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMode('email');
                    setPreviewTab('email');
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    deliveryMode === 'email'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs ring-2 ring-emerald-600/20'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <LucideIcon name="mail" className={`text-[18px] ${deliveryMode === 'email' ? 'text-emerald-700' : ''}`} />
                  <span>{isMr ? 'ई-मेल ब्रॉडकास्ट' : 'Email Broadcast'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMode('both')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                    deliveryMode === 'both'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs ring-2 ring-emerald-600/20'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <LucideIcon name="share_2" className={`text-[18px] ${deliveryMode === 'both' ? 'text-emerald-700' : ''}`} />
                  <span>{isMr ? 'पुश + ई-मेल (दोन्ही)' : 'Push + Email Both'}</span>
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-stone-500">
                  {isMr ? 'तातडीचे विषय (Quick Presets):' : 'Quick Presets:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset(
                    '🚰 प्रभाग पाणी पुरवठा सूचना',
                    'उद्या सकाळी ७ ते ९ वाजता जलवाहिनी दुरुस्तीमुळे पाणी पुरवठा कमी दाबाने होईल. कृपया सहकार्य करावे.',
                    'WATER'
                  )}
                  className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  🚰 पाणी पुरवठा
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(
                    '⚡ महावितरण वीज दुरुस्ती अलर्ट',
                    'उद्या सकाळी १० ते दुपारी २ या वेळेत ट्रान्सफॉर्मर देखभालीमुळे वीज खंडित राहील.',
                    'POWER'
                  )}
                  className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  ⚡ वीज दुरुस्ती
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(
                    '🏛️ ग्रामपंचायत विशेष ग्रामसभा',
                    'सर्व ग्रामस्थांना कळविण्यात येते की ग्रामपंचायतीची विशेष ग्रामसभा उद्या दुपारी २ वाजता आयोजित केली आहे.',
                    'GRAMSABHA'
                  )}
                  className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  🏛️ ग्रामसभा
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(
                    '🌾 कृषी बाजारभाव व खत वितरण',
                    'सोसायटीमध्ये युरिया व डीएपी खतांचा नवीन साठा उपलब्ध झाला आहे. टोकन घेऊन वाटप सुरू आहे.',
                    'GENERAL'
                  )}
                  className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  🌾 कृषी अपडेट
                </button>
              </div>
            </div>

            {/* Title Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="broadcast-title" className="text-xs font-black text-stone-800">
                  {isMr ? 'सूचनेचे शीर्षक (Title)' : 'Notification Title'} <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-stone-400 font-mono">
                  {title.length}/65
                </span>
              </div>
              <input
                id="broadcast-title"
                type="text"
                maxLength={65}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isMr ? 'उदा. तातडीची सूचना: उद्या पाणी पुरवठा बंद राहील' : 'e.g. Urgent Notice: Water supply disruption'}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm font-bold text-stone-900 placeholder:text-stone-400 outline-hidden transition-all"
              />
            </div>

            {/* Email Subject override (only if email enabled) */}
            {(deliveryMode === 'email' || deliveryMode === 'both') && (
              <div>
                <label htmlFor="broadcast-email-subject" className="block text-xs font-black text-stone-800 mb-1.5">
                  {isMr ? 'ई-मेल विषय (Email Subject - पर्यायी)' : 'Email Subject (Optional)'}
                </label>
                <input
                  id="broadcast-email-subject"
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder={title || (isMr ? 'ग्रामपंचायत आसगाव अधिकृत परिपत्रक' : 'Gram Panchayat Asgaon Official Notice')}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 text-xs font-medium text-stone-800 placeholder:text-stone-400 outline-hidden"
                />
              </div>
            )}

            {/* Description Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="broadcast-desc" className="text-xs font-black text-stone-800">
                  {isMr ? 'सूचनेचा तपशील (Description / Message)' : 'Description / Message'} <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-stone-400 font-mono">
                  {message.length}/280
                </span>
              </div>
              <textarea
                id="broadcast-desc"
                rows={4}
                maxLength={280}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isMr ? 'सविस्तर संदेश येथे लिहा. हा संदेश थेट नागरिकांच्या स्क्रीनवर दिसेल...' : 'Enter clear message. This will appear on citizen device screens...'}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-xs leading-relaxed text-stone-800 placeholder:text-stone-400 outline-hidden transition-all resize-y"
              />
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5">
                {isMr ? 'छायाचित्र किंवा बॅनर (Image Upload - पर्यायी)' : 'Banner Image (Optional)'}
              </label>

              {imageUrl ? (
                <div className="relative rounded-2xl border border-emerald-200 bg-emerald-50/40 p-2.5 flex items-center gap-3">
                  <img
                    src={imageUrl}
                    alt="Uploaded Banner Preview"
                    className="w-20 h-16 object-cover rounded-xl border border-stone-200 shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-900 truncate">
                      {imageFileName || 'प्रतिमा जोडली (Image attached)'}
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      ✓ {isMr ? 'थेट प्रिव्ह्यूमध्ये सक्रिय' : 'Active in live preview'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 transition-colors cursor-pointer"
                    title={isMr ? 'प्रतिमा काढा' : 'Remove Image'}
                  >
                    <LucideIcon name="trash" className="text-[16px]" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-emerald-50/30 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-2xl bg-white group-hover:bg-emerald-100 text-stone-500 group-hover:text-emerald-700 mx-auto flex items-center justify-center transition-colors shadow-2xs mb-2">
                    <LucideIcon name="image_plus" className="text-[20px]" />
                  </div>
                  <div className="text-xs font-bold text-stone-800">
                    {isMr ? 'प्रतिमा अपलोड करण्यासाठी येथे क्लिक करा' : 'Click to upload notification image'}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {isMr ? 'PNG, JPG, WebP (कमाल ५ एमबी)' : 'PNG, JPG, WebP (Max 5MB)'}
                  </div>
                </div>
              )}
            </div>

            {/* Action URL / Destination */}
            <div>
              <label htmlFor="broadcast-url" className="block text-xs font-black text-stone-800 mb-1.5">
                {isMr ? 'टॅप केल्यावर उघडणारे पान (Destination Link)' : 'Destination Link on Tap'}
              </label>
              <div className="flex gap-2">
                <input
                  id="broadcast-url"
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="/announcements"
                  className="flex-1 px-4 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 text-xs font-mono text-stone-800 outline-hidden"
                />
                <select
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-700 outline-hidden cursor-pointer"
                >
                  <option value="/announcements">{isMr ? '📢 सूचना फलक' : 'Notices'}</option>
                  <option value="/water">{isMr ? '🚰 पाणी वेळापत्रक' : 'Water'}</option>
                  <option value="/schemes">{isMr ? '📜 शासकीय योजना' : 'Schemes'}</option>
                  <option value="/krishi">{isMr ? '🌾 कृषी व मंडी दर' : 'Krishi'}</option>
                  <option value="/">{isMr ? '🏠 मुख्य पान' : 'Home'}</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSendTest}
                disabled={isTesting || !title.trim()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <LucideIcon name={isTesting ? 'sync' : 'cell_tower'} className={`text-[15px] ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? (isMr ? 'चाचणी पाठवत आहे...' : 'Testing...') : (isMr ? '🧪 स्वतः चाचणी पहा' : 'Send Test To Me')}</span>
              </button>

              <button
                type="button"
                onClick={handleBroadcast}
                disabled={isBroadcasting || !title.trim() || !message.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <LucideIcon name={isBroadcasting ? 'sync' : 'send'} className={`text-[16px] ${isBroadcasting ? 'animate-spin' : ''}`} />
                <span>
                  {isBroadcasting
                    ? (isMr ? 'प्रसारित करत आहे...' : 'Broadcasting...')
                    : (isMr ? '🚀 सर्व गावकऱ्यांना पाठवा' : 'Broadcast to All Citizens')}
                </span>
              </button>
            </div>
          </div>

          {/* Broadcast History */}
          <div className="bg-white rounded-3xl p-5 border border-[#e7dece] shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2 font-black text-xs text-stone-900">
                <LucideIcon name="history" className="text-[16px] text-stone-500" />
                <span>{isMr ? 'नुकत्याच पाठवलेल्या दवंडी नोंदी' : 'Recent Broadcasts'}</span>
              </div>
              <span className="text-[10px] font-bold text-stone-400">
                {history.length} {isMr ? 'नोंदी' : 'records'}
              </span>
            </div>

            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="p-3 rounded-2xl bg-[#faf6ee] border border-[#efe7dc] flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-bold text-stone-900 truncate">{item.title}</div>
                    <div className="text-[11px] text-stone-500 truncate">{item.message}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      {item.timestamp} • {item.mode === 'both' ? 'Push + Email' : item.mode}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 shrink-0">
                    ✓ {item.sentCount} {isMr ? 'पोहोचले' : 'reached'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Live Previews) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          {/* Live Preview Switcher Header */}
          <div className="bg-stone-100 p-1 rounded-2xl flex items-center gap-1 border border-stone-200">
            <button
              type="button"
              onClick={() => setPreviewTab('phone')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                previewTab === 'phone'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LucideIcon name="smartphone" className="text-[14px]" />
              <span>{isMr ? 'मोबाईल लॉक-स्क्रीन प्रिव्ह्यू' : 'Phone Lock-Screen'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('email')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                previewTab === 'email'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LucideIcon name="mail" className="text-[14px]" />
              <span>{isMr ? 'ई-मेल इनबॉक्स प्रिव्ह्यू' : 'Email View'}</span>
            </button>
          </div>

          {/* 1. Phone Lock-Screen Preview */}
          {previewTab === 'phone' && (
            <div className="relative mx-auto w-full max-w-[340px] rounded-[40px] bg-stone-900 p-3 shadow-2xl border-4 border-stone-800 text-white animate-fadeIn">
              {/* Notch */}
              <div className="w-24 h-4 bg-black rounded-full mx-auto mb-3" />

              {/* Lock Screen Header Clock */}
              <div className="text-center py-2">
                <div className="text-4xl font-light tracking-tight font-sans">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
                <div className="text-[11px] text-stone-300 mt-0.5">
                  {new Date().toLocaleDateString(isMr ? 'mr-IN' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
              </div>

              {/* Realistic Notification Banner Card */}
              <div className="mt-4 bg-white/95 backdrop-blur-md text-stone-900 rounded-3xl p-3.5 shadow-xl border border-white/20 transition-all">
                {/* Notification Top Bar */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <img
                      src="/asgaon-logo.png"
                      alt="Logo"
                      className="w-5 h-5 rounded-md object-contain bg-emerald-800 p-0.5"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="font-extrabold text-[11px] text-emerald-950">
                      आसगाव थेट सूचना
                    </span>
                  </div>
                  <span className="text-[9px] text-stone-400 font-bold">आताच</span>
                </div>

                {/* Notification Title & Body */}
                <div className="font-black text-[13px] text-stone-950 leading-tight mb-1">
                  {title || (isMr ? 'येथे शीर्षकाचा प्रिव्ह्यू दिसेल...' : 'Notification Title Preview...')}
                </div>
                <div className="text-[11px] text-stone-600 leading-snug line-clamp-3">
                  {message || (isMr ? 'येथे तुमच्या सूचनेचा तपशील दिसेल. नागरिक लॉक स्क्रीनवरून ही सूचना लगेच वाचू शकतात.' : 'Your notification message preview will appear here in real time...')}
                </div>

                {/* Optional Hero Image Banner */}
                {imageUrl && (
                  <div className="mt-2.5 rounded-2xl overflow-hidden border border-stone-200">
                    <img
                      src={imageUrl}
                      alt="Attached Banner"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-end gap-2">
                  <span className="text-[10px] font-bold text-stone-500 px-2 py-0.5 rounded-md bg-stone-100">
                    {isMr ? 'रद्द करा' : 'Dismiss'}
                  </span>
                  <span className="text-[10px] font-black text-emerald-800 px-2.5 py-0.5 rounded-md bg-emerald-100 flex items-center gap-0.5">
                    <span>{isMr ? 'उघडा' : 'Open'}</span>
                    <LucideIcon name="chevron_right" className="text-[10px]" />
                  </span>
                </div>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-28 h-1 bg-white/40 rounded-full mx-auto mt-6 mb-1" />
            </div>
          )}

          {/* 2. Email Inbox View Preview */}
          {previewTab === 'email' && (
            <div className="bg-white rounded-3xl border border-[#e7dece] shadow-xl overflow-hidden text-xs animate-fadeIn">
              {/* Fake Email Client Toolbar */}
              <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between text-stone-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[11px] font-bold text-stone-500">
                  {isMr ? 'नागरिक ई-मेल प्रिव्ह्यू' : 'Citizen Email Inbox View'}
                </span>
                <LucideIcon name="mail" className="text-[14px] text-stone-400" />
              </div>

              {/* Email Meta */}
              <div className="p-4 bg-stone-50/70 border-b border-stone-200 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] uppercase font-bold text-stone-400 w-12">{isMr ? 'प्रेषक' : 'From'}:</span>
                  <span className="font-bold text-stone-800">ग्रामपंचायत आसगाव &lt;asgaon.panchayat@gov.in&gt;</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] uppercase font-bold text-stone-400 w-12">{isMr ? 'प्राप्तकर्ता' : 'To'}:</span>
                  <span className="text-stone-600">सर्व नोंदणीकृत नागरिक (All Registered Citizens)</span>
                </div>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 w-12">{isMr ? 'विषय' : 'Subject'}:</span>
                  <span className="font-black text-emerald-950 text-xs">
                    {emailSubject || title || (isMr ? 'ग्रामपंचायत आसगाव अधिकृत परिपत्रक' : 'Gram Panchayat Asgaon Circular')}
                  </span>
                </div>
              </div>

              {/* Email Body Template */}
              <div className="p-5 space-y-4">
                {/* Panchayat Header Band */}
                <div className="text-center pb-3 border-b-2 border-emerald-700">
                  <div className="font-black text-sm text-emerald-900 flex items-center justify-center gap-1.5">
                    <span>🏛️</span>
                    <span>ग्रामपंचायत आसगाव</span>
                  </div>
                  <div className="text-[10px] text-stone-500">
                    अधिकृत नागरिक सूचना व प्रसिद्धी पत्रक
                  </div>
                </div>

                {/* Banner Image */}
                {imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-stone-200">
                    <img
                      src={imageUrl}
                      alt="Email Banner"
                      className="w-full h-36 object-cover"
                    />
                  </div>
                )}

                {/* Email Title & Message */}
                <div>
                  <h4 className="font-black text-stone-900 text-sm mb-1.5">
                    {title || (isMr ? 'सूचनेचे शीर्षक' : 'Notice Heading')}
                  </h4>
                  <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-xs">
                    {message || (isMr ? 'सूचनेचा संपूर्ण तपशील येथे नागरिकांना सुवाच्य फॉन्टमध्ये दिसेल.' : 'Full message body will be clearly visible here to email recipients.')}
                  </p>
                </div>

                {/* Call to action button */}
                <div className="text-center pt-2">
                  <span className="inline-block px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold text-[11px] shadow-xs">
                    {isMr ? 'सविस्तर पहा (View Details)' : 'View Details'}
                  </span>
                </div>

                {/* Email Footer */}
                <div className="pt-3 border-t border-stone-100 text-center text-[10px] text-stone-400 leading-tight">
                  ग्रामपंचायत कार्यालय आसगाव, ता. पवनी, जि. भंडारा - ४४१९१०<br />
                  हे स्वयंचलित ई-मेल पत्रक आहे.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
