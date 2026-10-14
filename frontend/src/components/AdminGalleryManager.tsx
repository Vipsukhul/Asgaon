import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';
import { api } from '../services/api';
import { getStoredGalleryItems, saveStoredGalleryItems } from '../data/galleryData';
import { useToast } from '../context/ToastContext';
import type { GalleryItem } from '../types';

export const AdminGalleryManager: React.FC = () => {
  const toast = useToast();
  const [items, setItems] = useState<GalleryItem[]>(() => getStoredGalleryItems());
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Form State
  const [formData, setFormData] = useState<Omit<GalleryItem, 'id'>>({
    imageUrl: '',
    titleMarathi: '',
    titleEnglish: '',
    category: 'agriculture',
    descriptionMarathi: '',
    descriptionEnglish: '',
    location: 'आसगाव, पवनी',
    date: 'ऑक्टोबर २०२६',
    credit: 'ग्रामपंचायत संकलन',
    isFeatured: true,
    order: 1
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
      titleMarathi: '',
      titleEnglish: '',
      category: 'agriculture',
      descriptionMarathi: '',
      descriptionEnglish: '',
      location: 'आसगाव, पवनी',
      date: 'ऑक्टोबर २०२६',
      credit: 'ग्रामपंचायत संकलन',
      isFeatured: true,
      order: items.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      imageUrl: item.imageUrl,
      titleMarathi: item.titleMarathi,
      titleEnglish: item.titleEnglish,
      category: item.category,
      descriptionMarathi: item.descriptionMarathi || '',
      descriptionEnglish: item.descriptionEnglish || '',
      location: item.location || '',
      date: item.date || '',
      credit: item.credit || '',
      isFeatured: item.isFeatured,
      order: item.order
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await api.uploadImage(file, 'gallery');
      if (url) {
        setFormData((prev) => ({ ...prev, imageUrl: url }));
        toast.success('छायाचित्र यशस्वीरीत्या अपलोड झाले!', 'Upload Complete');
      }
    } catch {
      // Fallback to FileReader base64 if server upload is unavailable
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, imageUrl: event.target?.result as string }));
          toast.success('छायाचित्र स्थानिक पातळीवर जोडले.', 'Local Image Loaded');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim() || !formData.titleMarathi.trim()) {
      toast.warning('कृपया छायाचित्राची लिंक/फाइल व शीर्षक भरा.', 'Validation');
      return;
    }

    if (editingItem) {
      const updated = items.map((i) =>
        i.id === editingItem.id ? { ...formData, id: editingItem.id } : i
      );
      setItems(updated);
      saveStoredGalleryItems(updated);
      toast.success('छायाचित्र यशस्वीरीत्या अद्ययावत केले!', 'Updated');
    } else {
      const newItem: GalleryItem = {
        ...formData,
        id: `gal-${Date.now()}`
      };
      const updated = [newItem, ...items];
      setItems(updated);
      saveStoredGalleryItems(updated);
      toast.success('नवीन छायाचित्र दालनात जोडले गेले!', 'Added');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('हे छायाचित्र दालनातून कायमचे हटवायचे आहे का?')) return;
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveStoredGalleryItems(updated);
    toast.info('छायाचित्र हटवले गेले.', 'Deleted');
  };

  const handleToggleFeatured = (id: string) => {
    const updated = items.map((i) => (i.id === id ? { ...i, isFeatured: !i.isFeatured } : i));
    setItems(updated);
    saveStoredGalleryItems(updated);
    toast.success('मुख्य स्लायडर स्थिती बदलली!', 'Status Changed');
  };

  const filteredItems = items.filter((i) => {
    const q = searchFilter.toLowerCase();
    return (
      i.titleMarathi.toLowerCase().includes(q) ||
      i.titleEnglish.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#efe7dc]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <LucideIcon name="image" className="text-[20px]" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-emerald-950">
                ग्राम छायाचित्र दालन व्यवस्थापक (Village Gallery & Slider)
              </h2>
              <p className="text-xs text-stone-500">
                मुख्यपृष्ठावरील मॉडर्न स्लायडर व दालनातील फोटो व्यवस्थापित करा ({items.length} एकूण फोटो)
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <LucideIcon name="add_a_photo" className="text-[17px]" />
          <span>नवीन फोटो जोडा</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <LucideIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="शीर्षक किंवा वर्गवारी शोधा..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#faf6ee] border border-[#efe7dc] text-stone-900 focus:outline-none focus:border-emerald-600 font-medium"
          />
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
          स्लायडरमध्ये सक्रिय: {items.filter((i) => i.isFeatured).length}
        </span>
      </div>

      {/* Photo List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#faf6ee] rounded-2xl overflow-hidden border border-[#efe7dc] shadow-2xs flex flex-col justify-between"
          >
            {/* Thumbnail Preview */}
            <div className="relative h-44 overflow-hidden bg-stone-900">
              <img
                src={item.imageUrl}
                alt={item.titleMarathi}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase backdrop-blur-md bg-stone-950/70 border border-white/20 text-emerald-300">
                  {item.category}
                </span>
                {item.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                    स्लायडरवर ✓
                  </span>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
              <div>
                <h3 className="font-heading font-black text-sm text-emerald-950 line-clamp-1">
                  {item.titleMarathi}
                </h3>
                <h4 className="text-xs font-semibold text-stone-500 line-clamp-1 mb-1">
                  {item.titleEnglish}
                </h4>
                <p className="text-[11px] text-stone-600 line-clamp-2">
                  {item.descriptionMarathi || item.descriptionEnglish}
                </p>
              </div>

              <div className="text-[10px] text-stone-500 flex items-center justify-between pt-2 border-t border-[#efe7dc]">
                <span>{item.location || 'आसगाव'}</span>
                <span>{item.date}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(item.id)}
                  className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    item.isFeatured
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      : 'bg-white border-[#efe7dc] text-stone-600 hover:bg-stone-50'
                  }`}
                  title="मुख्यपृष्ठ स्लायडरमध्ये चालू/बंद करा"
                >
                  {item.isFeatured ? 'स्लायडर ✓' : '+ स्लायडर'}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEditModal(item)}
                  className="py-1 px-2 rounded-lg bg-white border border-[#efe7dc] hover:border-emerald-600 text-emerald-950 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <LucideIcon name="edit" className="text-[12px]" />
                  <span>संपादित</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="py-1 px-2 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <LucideIcon name="delete" className="text-[12px]" />
                  <span>हटवा</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-[#e8e2d9] shadow-2xl relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1 rounded-full hover:bg-stone-100 cursor-pointer"
            >
              <LucideIcon name="close" className="text-[20px]" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <LucideIcon name={editingItem ? 'edit' : 'add_a_photo'} className="text-emerald-800 text-[24px]" />
              <div>
                <h3 className="font-heading font-black text-lg text-emerald-950">
                  {editingItem ? 'छायाचित्र संपादन' : 'नवीन छायाचित्र जोडा'}
                </h3>
                <p className="text-xs text-stone-500">
                  आसगाव ग्राम दालनासाठी फोटो व माहिती भरा
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-stone-800">
              {/* Image Preview & Upload */}
              <div>
                <label className="block mb-1.5 text-emerald-950">
                  छायाचित्र (Image File or URL) *
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    id="admin-gallery-file"
                    className="hidden"
                  />
                  <label
                    htmlFor="admin-gallery-file"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <LucideIcon name={uploading ? 'sync' : 'upload'} className={`text-[15px] ${uploading ? 'animate-spin' : ''}`} />
                    <span>{uploading ? 'अपलोड होत आहे...' : 'डिव्हाइस / कॅमेऱ्यातून फोटो निवडा'}</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="किंवा थेट इमेज URL पेस्ट करा (https://...)"
                  className="w-full p-2.5 rounded-xl bg-[#faf6ee] border border-[#efe7dc] focus:outline-none focus:border-emerald-600 font-medium text-xs"
                />

                {formData.imageUrl && (
                  <div className="mt-2 h-36 rounded-xl overflow-hidden border border-[#efe7dc] bg-stone-900 relative">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Title Marathi */}
              <div>
                <label className="block mb-1 text-emerald-950">शीर्षक (मराठी) *</label>
                <input
                  type="text"
                  value={formData.titleMarathi}
                  onChange={(e) => setFormData((prev) => ({ ...prev, titleMarathi: e.target.value }))}
                  placeholder="उदा. गोसीखुर्द कालवा व समृद्ध शिवार"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#faf6ee] border border-[#efe7dc] focus:outline-none focus:border-emerald-600 font-medium text-xs"
                />
              </div>

              {/* Title English */}
              <div>
                <label className="block mb-1 text-emerald-950">Title (English) *</label>
                <input
                  type="text"
                  value={formData.titleEnglish}
                  onChange={(e) => setFormData((prev) => ({ ...prev, titleEnglish: e.target.value }))}
                  placeholder="e.g. Gosikhurd Canal & Green Fields"
                  required
                  className="w-full p-2.5 rounded-xl bg-[#faf6ee] border border-[#efe7dc] focus:outline-none focus:border-emerald-600 font-medium text-xs"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-1 text-emerald-950">वर्गवारी (Category)</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as any }))}
                  className="w-full p-2.5 rounded-xl bg-[#faf6ee] border border-[#efe7dc] focus:outline-none focus:border-emerald-600 font-bold text-xs"
                >
                  <option value="agriculture">🌾 कृषी व जलसिंचन (Agriculture)</option>
                  <option value="festival">🎪 यात्रा व उत्सव (Festivals & Heritage)</option>
                  <option value="development">🏗️ ग्रामविकास कामे (Development)</option>
                  <option value="nature">🌿 निसर्ग व परिसर (Nature & Wainganga)</option>
                  <option value="community">👥 शिक्षण व समाज (Community & Education)</option>
                </select>
              </div>

              {/* Description Marathi */}
              <div>
                <label className="block mb-1 text-emerald-950">सविस्तर माहिती (मराठी)</label>
                <textarea
                  rows={2}
                  value={formData.descriptionMarathi}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descriptionMarathi: e.target.value }))}
                  placeholder="छायाचित्राबद्दल थोडक्यात माहिती..."
                  className="w-full p-2.5 rounded-xl bg-[#faf6ee] border border-[#efe7dc] focus:outline-none focus:border-emerald-600 font-medium text-xs"
                />
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-emerald-950">ठिकाण (Location)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="उदा. आसगाव, सेक्टर २"
                    className="w-full p-2.5 rounded-xl bg-[#faf6ee] border border-[#efe7dc] font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-emerald-950">महिना/वर्ष (Date)</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    placeholder="उदा. ऑक्टोबर २०२६"
                    className="w-full p-2.5 rounded-xl bg-[#faf6ee] border border-[#efe7dc] font-medium text-xs"
                  />
                </div>
              </div>

              {/* Feature in Home Slider Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf6ee] border border-[#efe7dc]">
                <div>
                  <div className="font-extrabold text-emerald-950">मुख्यपृष्ठ स्लायडरमध्ये दाखवा</div>
                  <div className="text-[11px] text-stone-500 font-normal">
                    होमपेजवरील मॉडर्न ॲस्थेटिक स्लायडरमध्ये हा फोटो झळकेल
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-5 h-5 accent-emerald-800 cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#efe7dc]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  {editingItem ? 'बदल सेव्ह करा' : 'फोटो जोडा'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
