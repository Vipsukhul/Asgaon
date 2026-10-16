import { LucideIcon } from './LucideIcon';
import { useState } from 'react';
import type { Business } from '../types';
import { api } from '../services/api';
import { LocationPickerMap } from './LocationPickerMap';
import { useLanguage } from '../context/LanguageContext';

interface RegisterShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBusiness: (biz: Business) => void;
}

const ASGAON_PRESETS = [
  { label: 'निवडा: परिसरातील प्रसिद्ध चौक / खूण', lat: 20.807884, lng: 79.722796, name: '' },
  { label: '🏛️ ग्रामपंचायत चौक', lat: 20.807884, lng: 79.722796, name: 'Gram Panchayat Chowk' },
  { label: '🌾 मार्केट यार्ड चौक', lat: 20.8085, lng: 79.7220, name: 'Market Yard Chowk' },
  { label: '🏫 जि.प. प्राथमिक शाळा, वॉर्ड २', lat: 20.8065, lng: 79.7240, name: 'Near ZP Primary School, Ward 2' },
  { label: '🚜 बायपास हायवे रोड', lat: 20.8095, lng: 79.7255, name: 'Highway Bypass Road' },
  { label: '🥛 तलाव रोड दुग्ध संकलन परिसर', lat: 20.8055, lng: 79.7210, name: 'Talav Road Dairy Area' },
  { label: '🛠️ स्टेशन रोड मार्केट', lat: 20.8090, lng: 79.7200, name: 'Station Road Market' },
  { label: '🏡 आंबेडकर वॉर्ड १', lat: 20.8045, lng: 79.7235, name: 'Ward No. 1 Ambedkar Ward' },
  { label: '🛕 विठ्ठल मंदिर परिसर', lat: 20.8080, lng: 79.7248, name: 'Near Vitthal Mandir, Ward 3' },
  { label: '🌱 पवनी बायपास कृषी केंद्र', lat: 20.8105, lng: 79.7265, name: 'Pauni Bypass Agro Hub' },
];

export const RegisterShopModal: React.FC<RegisterShopModalProps> = ({
  isOpen,
  onClose,
  onAddBusiness
}) => {
  const { lang } = useLanguage();
  const isMr = lang === 'MR';
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
  const [latitude, setLatitude] = useState<number>(20.807884);
  const [longitude, setLongitude] = useState<number>(79.722796);
  const [locatingGps, setLocatingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);

  if (!isOpen) return null;

  const handleDetectGps = async () => {
    setLocatingGps(true);
    setGpsStatus('थेट GPS स्थान व पत्ता शोधत आहे...');
    try {
      const loc = await api.detectLocationWithAddress();
      setLatitude(loc.latitude);
      setLongitude(loc.longitude);
      setLocatingGps(false);
      setGpsStatus(`✓ अचूक GPS स्थान मिळाले! (${loc.latitude}, ${loc.longitude})`);
      if (loc.formattedAddress && !landmark) {
        setLandmark(loc.formattedAddress);
      }
      setShowMapPicker(true);
    } catch (err: any) {
      setLocatingGps(false);
      setGpsStatus(`GPS त्रुटी (${err.message || 'स्थान शोधण्यात अडचण'}). कृपया खालील पर्यायांमधून जागा निवडा.`);
      setShowMapPicker(true);
    }
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
      alert(isMr ? 'दुकान नोंदणी यशस्वी! आपले दुकान आता आसगाव नकाशावर आणि यादीमध्ये लाइव्ह आहे.' : 'Shop registered successfully! It is now visible on the village map and directory.');
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
      alert(isMr ? 'दुकान नोंदणी यशस्वी! आपले दुकान आता आसगाव नकाशावर आणि यादीमध्ये लाइव्ह आहे.' : 'Shop registered successfully! It is now visible on the village map and directory.');
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
            <LucideIcon name="storefront" className="text-[#c2410c] text-[24px]" />
            <div>
              <h3 className="font-heading font-bold text-[18px] text-[#1d1b16]">
                {isMr ? 'आपल्या दुकानाची मोफत नोंदणी करा' : 'Register Your Business for Free'}
              </h3>
              <p className="text-[11px] text-[#707974]">
                {isMr ? 'आसगावमधील १४,२८०+ नागरिकांपर्यंत थेट पोहोचा' : 'Connect directly with 14,280+ village residents'}
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
              {isMr ? 'दुकानाचे / व्यवसायाचे नाव *' : 'Shop / Enterprise Name *'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isMr ? 'उदा. ओम साई कृषी केंद्र किंवा खडके किराणा' : 'e.g. Om Sai Agro Center or Khadke Kirana'}
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              {isMr ? 'व्यवसाय वर्ग / कॅटेगरी *' : 'Category *'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            >
              <option value="Krishi & Agro Stores">{isMr ? 'कृषी व शेती केंद्र' : 'Krishi & Agro Stores'}</option>
              <option value="Clinics & Pharmacies">{isMr ? 'दवाखाना व मेडिकल' : 'Clinics & Pharmacies'}</option>
              <option value="Tractor & Machinery Rental">{isMr ? 'ट्रॅक्टर व कृषी यंत्रसामग्री' : 'Tractor & Machinery Rental'}</option>
              <option value="Dairy & Animal Husbandry">{isMr ? 'दुग्ध व्यवसाय व पशुधन' : 'Dairy & Animal Husbandry'}</option>
              <option value="Kirana & General Stores">{isMr ? 'किराणा व जनरल स्टोअर्स' : 'Kirana & General Stores'}</option>
              <option value="Electrical & Solar Tech">{isMr ? 'इलेक्ट्रिकल व सौर ऊर्जा' : 'Electrical & Solar Tech'}</option>
              <option value="Building & Hardware">{isMr ? 'बांधकाम व हार्डवेअर' : 'Building & Hardware'}</option>
              <option value="Tailoring & Textiles">{isMr ? 'कापड दुकान व टेलरिंग' : 'Tailoring & Textiles'}</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              {isMr ? 'दुकानाचा पत्ता' : 'Shop Address'}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={isMr ? 'उदा. मुख्य रस्ता, आसगाव' : 'e.g. Main Market Road, Asgaon'}
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                {isMr ? 'ठिकाण / जवळची खूण *' : 'Landmark *'}
              </label>
              <input
                type="text"
                required
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={isMr ? 'उदा. बस स्टँडजवळ' : 'e.g. Near Bus Stand'}
                className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
                {isMr ? 'मोबाईल / WhatsApp *' : 'Phone & WhatsApp *'}
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
                  <LucideIcon name="location_on" className="text-[16px] text-[#c2410c]" />
                  <span>{isMr ? 'नकाशावर दुकानाचे स्थान' : 'Shop location on map'}</span>
                </label>
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
                <LucideIcon name="my_location" className="text-[15px] text-[#a7f3d0]" />
                <span>{locatingGps ? (isMr ? 'GPS शोधत आहे...' : 'Locating GPS...') : (isMr ? 'स्थान मिळवा' : 'Detect Location')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMapPicker(!showMapPicker)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#f3ede4] text-[#c2410c] border border-[#fed7aa] text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <LucideIcon name="map" className="text-[15px]" />
                <span>{showMapPicker ? (isMr ? 'नकाशा लपवा' : 'Hide Map') : (isMr ? '🗺️ नकाशावर जागा निवडा' : '🗺️ Pick on Map')}</span>
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
                  ? 'bg-[#e8f1ec] text-[#14532d] border border-[#cadbcf]' 
                  : 'bg-[#fef3c7] text-[#ba1a1a]'
              }`}>
                <LucideIcon name={gpsStatus.startsWith('✓') ? 'check_circle' : 'info'} className=" text-[15px]" />
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
              {isMr ? 'दुकान उघडण्याची वेळ' : 'Opening Hours'}
            </label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder={isMr ? 'उदा. सकाळी ८:०० ते रात्री ८:००' : 'e.g. 8:00 AM - 8:00 PM'}
              className="w-full bg-[#f9f3ea] text-[#1d1b16] p-2.5 rounded-xl text-[13px] border border-[#e8e2d9] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          {/* Shop Photo Upload */}
          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              {isMr ? 'दुकानाचे छायाचित्र' : 'Shop Front / Board Photo'}
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#166534] text-white text-[12px] font-bold hover:bg-[#052e16] transition-colors shadow-xs">
                <LucideIcon name="add_a_photo" className="text-[18px]" />
                <span>{uploadingImage ? (isMr ? 'फोटो अपलोड होत आहे...' : 'Uploading photo...') : (isMr ? 'फोटो निवडा' : 'Upload Photo')}</span>
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
                    <LucideIcon name="check_circle" className="text-[15px]" />
                    {isMr ? 'जोडले' : 'Attached'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-[11px] text-[#ba1a1a] hover:underline font-semibold ml-1"
                  >
                    {isMr ? 'काढून टाका' : 'Remove'}
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-[#707974]">{isMr ? 'ऐच्छिक (नसल्यास प्रमाणित डीफॉल्ट फोटो दिसेल)' : 'Optional (Defaults to verified local photo)'}</span>
              )}
            </div>
            {uploadError && (
              <p className="text-[11px] text-[#ba1a1a] mt-1 font-semibold">{uploadError}</p>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1d1b16] mb-1">
              {isMr ? 'सेवा किंवा उत्पादनांचे वर्णन' : 'Description / Services Offered'}
            </label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={isMr ? 'आपल्या दुकानात कोणत्या वस्तू किंवा सेवा उपलब्ध आहेत ते लिहा...' : 'What goods or services do you provide to villagers?'}
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
              className="px-5 py-2 rounded-xl bg-[#c2410c] text-white text-[13px] font-bold hover:bg-[#852f00] transition-colors shadow-xs disabled:opacity-50"
            >
              {loading
                ? (isMr ? 'नोंदणी होत आहे...' : 'Registering...')
                : (isMr ? 'दुकान नोंदवा' : 'Publish Listing')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
