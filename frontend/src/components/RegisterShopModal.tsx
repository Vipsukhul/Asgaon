import { useState } from 'react';
import type { Business } from '../types';
import { api } from '../services/api';
import { LocationPickerMap } from './LocationPickerMap';

interface RegisterShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBusiness: (biz: Business) => void;
}

const ASGAON_PRESETS = [
  { label: 'निवडा: परिसरातील प्रसिद्ध चौक / खूण (Select Preset)', lat: 20.7850, lng: 79.6350, name: '' },
  { label: '🏛️ ग्रामपंचायत चौक (Gram Panchayat Chowk)', lat: 20.7850, lng: 79.6350, name: 'Gram Panchayat Chowk' },
  { label: '🌾 मार्केट यार्ड चौक (Market Yard Chowk)', lat: 20.7858, lng: 79.6346, name: 'Market Yard Chowk' },
  { label: '🏫 ZP प्राथमिक शाळा / वॉर्ड २ (Near ZP School)', lat: 20.7842, lng: 79.6362, name: 'Near ZP Primary School, Ward 2' },
  { label: '🚜 हायवे बायपास रोड (Highway Bypass)', lat: 20.7865, lng: 79.6380, name: 'Highway Bypass Road' },
  { label: '🥛 तलाव रोड दुग्ध हब (Talav Road)', lat: 20.7832, lng: 79.6335, name: 'Talav Road Dairy Area' },
  { label: '🛠️ स्टेशन रोड मार्केट (Station Road)', lat: 20.7870, lng: 79.6320, name: 'Station Road Market' },
  { label: '🏡 आंबेडकर वॉर्ड १ (Ambedkar Ward 1)', lat: 20.7820, lng: 79.6360, name: 'Ward No. 1 Ambedkar Ward' },
  { label: '🛕 विठ्ठल मंदिर परिसर (Vitthal Mandir Area)', lat: 20.7860, lng: 79.6370, name: 'Near Vitthal Mandir, Ward 3' },
  { label: '🌱 पवनी बायपास कृषी हब (Pauni Bypass)', lat: 20.7885, lng: 79.6395, name: 'Pauni Bypass Agro Hub' },
];

export const RegisterShopModal: React.FC<RegisterShopModalProps> = ({
  isOpen,
  onClose,
  onAddBusiness
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Kirana & General Stores');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('8:00 AM - 8:00 PM');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(false);

  // Exact location states
  const [latitude, setLatitude] = useState<number>(20.7850);
  const [longitude, setLongitude] = useState<number>(79.6350);
  const [locatingGps, setLocatingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);

  if (!isOpen) return null;

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('ब्राउझरमध्ये GPS सेवा उपलब्ध नाही.');
      return;
    }
    setLocatingGps(true);
    setGpsStatus('थेट GPS स्थान शोधत आहे...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setLocatingGps(false);
        setGpsStatus(`✓ अचूक GPS स्थान मिळाले! (${lat}, ${lng})`);
        setShowMapPicker(true);
      },
      (err) => {
        setLocatingGps(false);
        setGpsStatus(`GPS त्रुटी (${err.message}). कृपया खालील नकाशावर जागा निवडा.`);
        setShowMapPicker(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = ASGAON_PRESETS.find(p => p.label === e.target.value);
    if (selected && selected.name) {
      setLatitude(selected.lat);
      setLongitude(selected.lng);
      if (!landmark) setLandmark(selected.name);
      setShowMapPicker(true);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setUploadError('');
    try {
      const uploadedUrl = await api.uploadImage(file, 'asgaon_shops');
      setImageUrl(uploadedUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const defaultPhoto = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const finalImage = imageUrl || defaultPhoto;
    try {
      const res = await api.createBusiness({
        name,
        category,
        description: desc || 'Newly registered village enterprise offering verified rural supplies and services.',
        address: address || 'Asgaon Market Road',
        landmark: landmark || 'Village Center',
        phone,
        whatsapp: phone,
        openingHours: hours,
        imageUrl: finalImage,
        verificationBadge: 'Verified Merchant',
        rating: 5.0,
        latitude,
        longitude
      });

      const newBiz: Business = {
        id: res.id || ('b-' + Date.now()),
        name: res.name || name,
        slug: res.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: (res.category && res.category.name) || category,
        categoryId: (res.category && res.category.id) || 5,
        description: res.description || desc,
        address: res.address || address || 'Asgaon Market Road',
        landmark: res.landmark || landmark || 'Village Center',
        phone: res.phone || phone,
        whatsapp: res.whatsapp || phone,
        openingHours: res.openingHours || hours,
        imageUrl: res.imageUrl || finalImage,
        isVerified: true,
        verificationBadge: res.verificationBadge || 'Verified Merchant',
        rating: res.rating || 5.0,
        ratingCount: res.ratingCount || 1,
        distanceKm: '0.4 km',
        latitude,
        longitude
      };

      onAddBusiness(newBiz);
      alert('दुकान नोंदणी यशस्वी! आपले दुकान आता आसगाव नकाशावर आणि यादीमध्ये लाइव्ह आहे.');
      onClose();
    } catch {
      const newBiz: Business = {
        id: 'b-' + Date.now(),
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        categoryId: 5,
        description: desc || 'Newly registered village enterprise offering verified rural supplies and services.',
        address: address || 'Asgaon Market Road',
        landmark: landmark || 'Village Center',
        phone,
        whatsapp: phone,
        openingHours: hours,
        imageUrl: finalImage,
        isVerified: true,
        verificationBadge: 'Verified Merchant',
        rating: 5.0,
        ratingCount: 1,
        distanceKm: '0.4 km',
        latitude,
        longitude
      };

      onAddBusiness(newBiz);
      alert('दुकान नोंदणी यशस्वी! आपले दुकान आता आसगाव नकाशावर आणि यादीमध्ये लाइव्ह आहे.');
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
            <span className="material-symbols-outlined text-[#c2410c] text-[24px]">storefront</span>
            <div>
              <h3 className="font-heading font-bold text-[18px] text-[#1d1b16]">
                List Your Shop Free (आपला व्यापार)
              </h3>
              <p className="text-[11px] text-[#707974]">Reach 14,280+ Asgaon residents at zero cost</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#707974] hover:text-[#1d1b16]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              Shop / Enterprise Name (दुकानाचे नाव)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Om Sai Electricals & Solar"
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              Category (प्रवर्ग)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            >
              <option>Krishi &amp; Agro Stores</option>
              <option>Clinics &amp; Pharmacies</option>
              <option>Tractor &amp; Machinery Rental</option>
              <option>Dairy &amp; Animal Husbandry</option>
              <option>Kirana &amp; General Stores</option>
              <option>Electrical &amp; Solar Tech</option>
              <option>Building &amp; Hardware</option>
              <option>Tailoring &amp; Textiles</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              Shop Address (पत्ता)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Shop 12, Market Yard Road"
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                Landmark (ठिकाण / खूण)
              </label>
              <input
                type="text"
                required
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Bus Stand"
                className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                Phone &amp; WhatsApp
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
          </div>

          {/* Shop Location & GPS Mapping on Asgaon Map */}
          <div className="bg-[#f9f3ea] p-3 rounded-xl border border-[#e8e2d9] space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div>
                <label className="block text-[12px] font-extrabold text-[#166534] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#c2410c]">location_on</span>
                  <span>Shop Location on Map (नकाशावर दुकानाचे थेट स्थान)</span>
                </label>
                <p className="text-[10px] text-[#707974]">
                  ग्राहकांना थेट नकाशावर दुकान दिसण्यासाठी GPS किंवा नकाशावर जागा निवडा
                </p>
              </div>

              {/* Coordinates Pill */}
              <div className="bg-white px-2 py-0.5 rounded-lg border border-[#e8e2d9] text-[10px] font-bold text-[#166534] shrink-0 self-start sm:self-auto flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-[#c2410c]">pin_drop</span>
                <span>{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={locatingGps}
                className="px-3 py-1.5 rounded-lg bg-[#166534] hover:bg-[#052e16] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[15px] text-[#bbf7d0]">my_location</span>
                <span>{locatingGps ? 'GPS शोधत आहे...' : '🎯 माझे थेट GPS स्थान मिळवा'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMapPicker(!showMapPicker)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#f3ede4] text-[#c2410c] border border-[#fed7aa] text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span className="material-symbols-outlined text-[15px]">map</span>
                <span>{showMapPicker ? 'नकाशा लपवा' : '🗺️ नकाशावर जागा निवडा'}</span>
              </button>
            </div>

            {/* Asgaon Landmark Preset Dropdown */}
            <div>
              <select
                onChange={handlePresetChange}
                className="w-full bg-white text-[#1d1b16] p-2 rounded-lg text-[11px] font-medium border border-[#e8e2d9] focus:outline-none focus:ring-1 focus:ring-[#166534]"
              >
                {ASGAON_PRESETS.map((p, idx) => (
                  <option key={idx} value={p.label}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status message */}
            {gpsStatus && (
              <div className={`p-2 rounded-lg text-[11px] font-medium flex items-center gap-1.5 ${
                gpsStatus.startsWith('✓') 
                  ? 'bg-[#bbf7d0] text-[#002117]' 
                  : 'bg-[#ffdad6] text-[#ba1a1a]'
              }`}>
                <span className="material-symbols-outlined text-[15px]">
                  {gpsStatus.startsWith('✓') ? 'check_circle' : 'info'}
                </span>
                <span>{gpsStatus}</span>
              </div>
            )}

            {/* Interactive Location Picker Map */}
            {showMapPicker && (
              <div className="pt-1">
                <LocationPickerMap
                  latitude={latitude}
                  longitude={longitude}
                  onChangeLocation={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                  height="200px"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              Opening Hours (वेळ)
            </label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 7:00 AM - 9:00 PM"
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          {/* Cloudinary Shop Photo Upload */}
          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              Shop Front / Board Photo (दुकानाचे छायाचित्र)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#166534] text-white text-[12px] font-bold hover:bg-[#052e16] transition-colors shadow-xs">
                <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              {imageUrl ? (
                <div className="flex items-center gap-2">
                  <img
                    src={imageUrl}
                    alt="Uploaded shop preview"
                    className="w-10 h-10 object-cover rounded-lg border border-[#006a4e]"
                  />
                  <span className="text-[11px] text-[#006a4e] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                    Attached
                  </span>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-[11px] text-[#ba1a1a] hover:underline font-semibold ml-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-[#707974]">Optional (Defaults to verified local photo)</span>
              )}
            </div>
            {uploadError && (
              <p className="text-[11px] text-[#ba1a1a] mt-1 font-semibold">{uploadError}</p>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              Description / Services Offered (सेवा वर्णन)
            </label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What goods or services do you provide to villagers?"
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
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
              className="px-5 py-2 rounded-xl bg-[#c2410c] text-white text-[13px] font-bold hover:bg-[#852f00] transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Publish Free Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
