import { LucideIcon } from './LucideIcon';
import React, { useState } from 'react';
import { api } from '../services/api';
import { getStoredHeroSlides, saveStoredHeroSlides, DEFAULT_HERO_SLIDES } from '../data/heroSlidesData';
import type { HeroSlide } from '../types';

export const AdminBannerManager: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(() => getStoredHeroSlides());
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    imageUrl: string;
    showTextOverlay: boolean;
    titleMarathi: string;
    titleEnglish: string;
    subtitleMarathi: string;
    subtitleEnglish: string;
    badgeMarathi: string;
    badgeEnglish: string;
    ctaTextMarathi: string;
    ctaTextEnglish: string;
    ctaLink: string;
    isActive: boolean;
  }>({
    imageUrl: '',
    showTextOverlay: true,
    titleMarathi: '',
    titleEnglish: '',
    subtitleMarathi: '',
    subtitleEnglish: '',
    badgeMarathi: '',
    badgeEnglish: '',
    ctaTextMarathi: '',
    ctaTextEnglish: '',
    ctaLink: 'schemes',
    isActive: true
  });

  // Handle Cloudinary Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const secureUrl = await api.uploadImage(file, 'banners');
      setFormData(prev => ({ ...prev, imageUrl: secureUrl }));
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingSlide(null);
    setFormData({
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
      showTextOverlay: true,
      titleMarathi: '',
      titleEnglish: '',
      subtitleMarathi: '',
      subtitleEnglish: '',
      badgeMarathi: 'विशेष घोषणा',
      badgeEnglish: 'Special Announcement',
      ctaTextMarathi: 'तपशील पहा',
      ctaTextEnglish: 'View Details',
      ctaLink: 'schemes',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide: HeroSlide) => {
    if (slide.type === 'welcome') {
      alert('मुख्य शोध व स्वागत स्लायडर नेहमी पूर्वनिर्धारित असतो. तुम्ही त्याचे स्थान वर/खाली करू शकता.');
      return;
    }
    setEditingSlide(slide);
    setFormData({
      imageUrl: slide.imageUrl || '',
      showTextOverlay: slide.showTextOverlay ?? true,
      titleMarathi: slide.titleMarathi || '',
      titleEnglish: slide.titleEnglish || '',
      subtitleMarathi: slide.subtitleMarathi || '',
      subtitleEnglish: slide.subtitleEnglish || '',
      badgeMarathi: slide.badgeMarathi || '',
      badgeEnglish: slide.badgeEnglish || '',
      ctaTextMarathi: slide.ctaTextMarathi || '',
      ctaTextEnglish: slide.ctaTextEnglish || '',
      ctaLink: slide.ctaLink || 'schemes',
      isActive: slide.isActive
    });
    setIsModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl.trim()) {
      alert('कृपया फोटो निवडा किंवा अपलोड करा.');
      return;
    }

    let updatedSlides: HeroSlide[];

    if (editingSlide) {
      updatedSlides = slides.map(s => (s.id === editingSlide.id ? {
        ...s,
        ...formData
      } : s));
      api.updateHeroBanner(editingSlide.id, {
        slideType: editingSlide.type || 'custom',
        imageUrl: formData.imageUrl,
        showTextOverlay: formData.showTextOverlay,
        titleMarathi: formData.titleMarathi,
        titleEnglish: formData.titleEnglish,
        subtitleMarathi: formData.subtitleMarathi,
        subtitleEnglish: formData.subtitleEnglish,
        badgeMarathi: formData.badgeMarathi,
        badgeEnglish: formData.badgeEnglish,
        ctaTextMarathi: formData.ctaTextMarathi,
        ctaTextEnglish: formData.ctaTextEnglish,
        ctaLink: formData.ctaLink,
        isActive: formData.isActive
      }).catch(err => console.error('Failed to update banner in DB:', err));
    } else {
      const newSlide: HeroSlide = {
        id: 'slide-' + Date.now(),
        type: 'custom',
        order: slides.length + 1,
        ...formData
      };
      updatedSlides = [...slides, newSlide];
      api.createHeroBanner({
        slideType: 'custom',
        imageUrl: formData.imageUrl,
        showTextOverlay: formData.showTextOverlay,
        titleMarathi: formData.titleMarathi,
        titleEnglish: formData.titleEnglish,
        subtitleMarathi: formData.subtitleMarathi,
        subtitleEnglish: formData.subtitleEnglish,
        badgeMarathi: formData.badgeMarathi,
        badgeEnglish: formData.badgeEnglish,
        ctaTextMarathi: formData.ctaTextMarathi,
        ctaTextEnglish: formData.ctaTextEnglish,
        ctaLink: formData.ctaLink,
        isActive: formData.isActive,
        displayOrder: updatedSlides.length
      }).catch(err => console.error('Failed to create banner in DB:', err));
    }

    setSlides(updatedSlides);
    saveStoredHeroSlides(updatedSlides);
    setIsModalOpen(false);
  };

  const handleDeleteSlide = (id: string) => {
    if (!window.confirm('हा स्लायडर कायमचा काढायचा आहे का?')) return;
    const updated = slides.filter(s => s.id !== id);
    setSlides(updated);
    saveStoredHeroSlides(updated);
    api.deleteHeroBanner(id).catch(err => console.error('Failed to delete banner in DB:', err));
  };

  const handleToggleActive = (id: string) => {
    const updated = slides.map(s => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setSlides(updated);
    saveStoredHeroSlides(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const copy = [...slides];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    setSlides(copy);
    saveStoredHeroSlides(copy);
  };

  const handleResetToDefault = () => {
    if (window.confirm('सर्व स्लायडर्स मूळ स्थितीत रिसेट करायचे आहेत का?')) {
      setSlides(DEFAULT_HERO_SLIDES);
      saveStoredHeroSlides(DEFAULT_HERO_SLIDES);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e8e2d9] shadow-xs">
        <div>
          
          <h2 className="font-heading font-extrabold text-xl text-[#166534]">
            हिरो स्लायडर व बॅनर व्यवस्थापन
          </h2>
          <p className="text-xs text-stone-600">
            मुख्यपृष्ठावरील फोटो, जाहिराती, शासकीय योजनांचे बॅनर आणि मजकूर येथे व्यवस्थापित करा.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-stone-200"
            title="मूळ स्लायडर्स पूर्ववत करा"
          >
            रिसेट करा
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-[#166534] hover:bg-[#052e16] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <LucideIcon name="add_photo_alternate" className="text-[18px]" />
            <span>नवीन स्लायडर जोडा</span>
          </button>
        </div>
      </div>

      {/* List of Slides */}
      <div className="grid grid-cols-1 gap-3">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`bg-white rounded-2xl p-4 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs ${
              slide.isActive ? 'border-[#e8e2d9]' : 'border-dashed border-stone-300 opacity-60 bg-stone-50'
            }`}
          >
            {/* Thumbnail & Title Info */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Order number */}
              <div className="flex flex-col gap-1 items-center justify-center shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                  className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 text-stone-600 flex items-center justify-center text-xs cursor-pointer"
                >
                  ▲
                </button>
                <span className="text-xs font-black text-stone-700">{index + 1}</span>
                <button
                  type="button"
                  disabled={index === slides.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 text-stone-600 flex items-center justify-center text-xs cursor-pointer"
                >
                  ▼
                </button>
              </div>

              {/* Preview Thumbnail */}
              <div className="w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200 relative">
                {slide.type === 'welcome' ? (
                  <div className="w-full h-full bg-[#f9f3ea] flex flex-col items-center justify-center p-2 text-center text-[#166534]">
                    <LucideIcon name="travel_explore" className="text-lg" />
                    <span className="text-[9px] font-bold mt-0.5">मुख्य शोध हब</span>
                  </div>
                ) : (
                  <img
                    src={slide.imageUrl}
                    alt={slide.titleEnglish || 'Slide'}
                    className="w-full h-full object-cover"
                  />
                )}
                {!slide.showTextOverlay && slide.type === 'custom' && (
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-bold rounded">
                    फक्त फोटो
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {slide.type === 'welcome' ? (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold rounded-md border border-emerald-200">
                      पूर्वनिर्धारित मुख्य हब
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-extrabold rounded-md border border-amber-200">
                      {slide.showTextOverlay ? 'मजकुरासह बॅनर' : 'फक्त फोटो '}
                    </span>
                  )}

                  {slide.badgeMarathi && (
                    <span className="text-[10px] font-bold text-stone-500 truncate">
                      • {slide.badgeMarathi}
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-bold text-sm sm:text-base text-stone-900 truncate">
                  {slide.type === 'welcome'
                    ? 'आपल्या गावाची सर्व माहिती, एकाच ठिकाणी'
                    : (slide.titleMarathi || slide.titleEnglish || 'फोटो बॅनर')}
                </h3>

                {slide.type === 'custom' && (
                  <p className="text-xs text-stone-500 truncate max-w-md">
                    {slide.subtitleMarathi || slide.imageUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 self-end md:self-center">
              {/* Active / Inactive switch */}
              <button
                type="button"
                onClick={() => handleToggleActive(slide.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  slide.isActive
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                }`}
              >
                {slide.isActive ? 'सक्रिय' : 'बंद'}
              </button>

              {slide.type === 'custom' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(slide)}
                    className="p-2 text-stone-600 hover:text-[#166534] hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
                    title="संपादन करा"
                  >
                    <LucideIcon name="edit" className="text-[18px]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    title="हटवा"
                  >
                    <LucideIcon name="delete" className="text-[18px]" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================
          ADD / EDIT SLIDE MODAL
          ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#e8e2d9] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#166534] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {editingSlide ? 'स्लायडर संपादन करा' : 'नवीन फोटो स्लायडर जोडा'}
                </h3>
                <p className="text-xs text-emerald-200/80">
                  Cloudinary वर फोटो अपलोड करा आणि मजकूर पर्याय ठरवा.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveSlide} className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-stone-700">
              {/* 1. Image Upload via Cloudinary */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-stone-900 flex items-center justify-between">
                  <span>फोटो निवडा </span>
                  <span className="text-[11px] font-normal text-stone-500">JPG, PNG किंवा WebP</span>
                </label>

                <div className="flex items-center gap-3">
                  <label className="flex-1 border-2 border-dashed border-[#166534]/30 hover:border-[#166534] p-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer bg-[#f9fbf9] transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <LucideIcon name="add_photo_alternate" className="text-emerald-700" />
                    <span className="font-bold text-emerald-900">
                      {uploading ? 'Cloudinary वर अपलोड होत आहे...' : 'कॉम्प्युटर / मोबाईलवरून फोटो निवडा'}
                    </span>
                  </label>
                </div>

                {uploadError && (
                  <p className="text-red-600 text-[11px] font-semibold">{uploadError}</p>
                )}

                {/* Direct URL input fallback */}
                <div className="mt-1">
                  <span className="text-[11px] text-stone-500 block mb-1">किंवा थेट इमेज URL पेस्ट करा:</span>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs focus:outline-[#166534]"
                  />
                </div>

                {/* Live Preview Box */}
                {formData.imageUrl && (
                  <div className="mt-2 w-full h-36 rounded-2xl overflow-hidden border border-stone-300 relative bg-stone-900">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {formData.showTextOverlay ? (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-end text-white">
                        {formData.badgeMarathi && (
                          <span className="text-[10px] font-bold text-amber-300">{formData.badgeMarathi}</span>
                        )}
                        <span className="font-bold text-sm">{formData.titleMarathi || 'शीर्षक पूर्वावलोकन'}</span>
                      </div>
                    ) : (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded">
                        फक्त फोटो 
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Text Overlay Toggle (Optionable) */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900 text-sm block">
                    फोटोवर मजकूर दाखवायचा आहे का? 
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    जर नको असेल, तर हा पर्याय बंद करा. मुख्यपृष्ठावर फक्त सुंदर फोटो दिसेल.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showTextOverlay}
                  onChange={(e) => setFormData(prev => ({ ...prev, showTextOverlay: e.target.checked }))}
                  className="w-5 h-5 accent-[#166534] cursor-pointer"
                />
              </div>

              {/* 3. Conditional Text Fields */}
              {formData.showTextOverlay && (
                <div className="flex flex-col gap-3 p-4 bg-[#fdfbf7] rounded-2xl border border-[#f0eae0]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">मुख्य शीर्षक (मराठी)</label>
                      <input
                        type="text"
                        value={formData.titleMarathi}
                        onChange={(e) => setFormData(prev => ({ ...prev, titleMarathi: e.target.value }))}
                        placeholder="उदा. गोसीखुर्द धरण व समृद्ध शिवार"
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">शीर्षक </label>
                      <input
                        type="text"
                        value={formData.titleEnglish}
                        onChange={(e) => setFormData(prev => ({ ...prev, titleEnglish: e.target.value }))}
                        placeholder="e.g. Gosikhurd Dam & Agriculture"
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-800 block mb-1">उपशीर्षक / माहिती (मराठी)</label>
                    <textarea
                      rows={2}
                      value={formData.subtitleMarathi}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitleMarathi: e.target.value }))}
                      placeholder="उदा. पवनी तालुक्यात मुबलक पाणी व आधुनिक कृषी योजनांचा थेट लाभ..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">बॅज / टॅग (मराठी)</label>
                      <input
                        type="text"
                        value={formData.badgeMarathi}
                        onChange={(e) => setFormData(prev => ({ ...prev, badgeMarathi: e.target.value }))}
                        placeholder="उदा. विशेष घोषणा"
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">बटन मजकूर </label>
                      <input
                        type="text"
                        value={formData.ctaTextMarathi}
                        onChange={(e) => setFormData(prev => ({ ...prev, ctaTextMarathi: e.target.value }))}
                        placeholder="उदा. अधिक माहिती पहा"
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">बटन लिंक (विभाग)</label>
                      <select
                        value={formData.ctaLink}
                        onChange={(e) => setFormData(prev => ({ ...prev, ctaLink: e.target.value }))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white cursor-pointer"
                      >
                        <option value="schemes">शासकीय योजना </option>
                        <option value="krishi">कृषी व बाजारभाव </option>
                        <option value="events">गावातील कार्यक्रम </option>
                        <option value="announcements">सूचना व परिपत्रके </option>
                        <option value="businesses">स्थानिक दुकाने </option>
                        <option value="jobs">रोजगार मंच </option>
                        <option value="emergency">आपत्कालीन मदत </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#166534] text-white hover:bg-[#052e16] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {editingSlide ? 'बदल जतन करा' : 'स्लायडर जोडा'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
