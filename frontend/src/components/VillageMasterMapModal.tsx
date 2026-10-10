import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_COLORS } from './LiveBusinessMap';
import { EDUCATION_INSTITUTES } from './ShikshaMap';
import type { Business } from '../types';

// Asgaon Gram Panchayat & Village Center: 20°47'06.0"N 79°38'06.0"E
const ASGAON_CENTER: [number, number] = [20.7850, 79.6350];

interface MasterMapPin {
  id: string;
  name: string;
  nameMr?: string;
  category: 'gp' | 'business' | 'education' | 'health';
  categoryLabel: string;
  categoryLabelMr: string;
  latitude: number;
  longitude: number;
  address?: string;
  landmark?: string;
  phone?: string;
  whatsapp?: string;
  rating?: number;
  image?: string;
  icon: string;
  color: string;
  openingHours?: string;
  facilities?: string[];
  slug?: string;
}

interface VillageMasterMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: Business[];
  onSelectBusiness?: (business: Business) => void;
}

export const VillageMasterMapModal: React.FC<VillageMasterMapModalProps> = ({
  isOpen,
  onClose,
  businesses,
  onSelectBusiness,
}) => {
  const { lang } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [activeCategory, setActiveCategory] = useState<'all' | 'gp' | 'business' | 'education' | 'health'>('all');
  const [activePin, setActivePin] = useState<MasterMapPin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Assemble all village GIS landmarks
  const allPins: MasterMapPin[] = React.useMemo(() => {
    const list: MasterMapPin[] = [];

    // 1. Gram Panchayat Asgaon HQ (Center Point)
    list.push({
      id: 'pin-gp-hq',
      name: 'Asgaon Gram Panchayat Central Secretariat',
      nameMr: 'ग्रामपंचायत आसगाव मध्यवर्ती प्रशासकीय सचिवालय',
      category: 'gp',
      categoryLabel: 'Gram Panchayat HQ',
      categoryLabelMr: 'ग्रामपंचायत मुख्यालय',
      latitude: ASGAON_CENTER[0],
      longitude: ASGAON_CENTER[1],
      address: 'Central Gaothan, Ward 2, Asgaon, Pauni (PIN 441910)',
      landmark: 'मध्यवर्ती ग्रामपंचायत चौक',
      phone: '07185224410',
      whatsapp: '9422811204',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
      icon: 'account_balance',
      color: '#003629',
      openingHours: '10:00 AM - 05:30 PM (सोमवार - शनिवार)',
      facilities: ['नागरिक सेवा केंद्र', 'दाखले कक्ष', 'पाणी पुरवठा नियंत्रण कक्ष', 'लोक तक्रार निवारण']
    });

    // 2. Schools, Colleges & Library
    EDUCATION_INSTITUTES.forEach((edu) => {
      list.push({
        id: edu.id,
        name: edu.nameEnglish,
        nameMr: edu.name,
        category: 'education',
        categoryLabel: edu.categoryLabelEnglish,
        categoryLabelMr: edu.categoryLabelMarathi,
        latitude: edu.latitude,
        longitude: edu.longitude,
        address: edu.address,
        landmark: edu.landmark,
        phone: edu.phone,
        rating: 4.8,
        icon: edu.icon,
        color: edu.color,
        openingHours: edu.timings,
        facilities: edu.highlights
      });
    });

    // 3. Local Businesses, Shops & Clinics
    businesses.forEach((biz, index) => {
      // Default to slightly offset coordinates around village center if exact GPS not set
      const defaultOffsets = [
        [0.0018, 0.0012],
        [-0.0015, -0.0008],
        [0.0011, -0.0019],
        [-0.0009, 0.0021],
        [0.0022, -0.0006],
        [-0.0018, 0.0016],
        [0.0007, 0.0025],
        [-0.0021, -0.0017],
        [0.0026, 0.0018],
        [-0.0005, -0.0028]
      ];
      const offset = defaultOffsets[index % defaultOffsets.length];
      const lat = biz.latitude || (ASGAON_CENTER[0] + offset[0]);
      const lng = biz.longitude || (ASGAON_CENTER[1] + offset[1]);

      const catKey = (biz as any).categoryKey || 'kirana';
      const catConfig = CATEGORY_COLORS[catKey] || CATEGORY_COLORS.kirana;
      const isHealth = catKey === 'health' || (biz.category || '').toLowerCase().includes('health') || (biz.name || '').toLowerCase().includes('clinic') || (biz.name || '').toLowerCase().includes('hospital');

      list.push({
        id: String(biz.id || 'b-' + index),
        name: biz.name,
        nameMr: biz.name,
        category: isHealth ? 'health' : 'business',
        categoryLabel: biz.category || 'Local Business',
        categoryLabelMr: biz.category || 'स्थानिक दुकान',
        latitude: lat,
        longitude: lng,
        address: biz.address || 'Asgaon Village Road',
        landmark: biz.landmark || 'Village Area',
        phone: biz.phone,
        whatsapp: biz.whatsapp || biz.phone,
        rating: biz.rating || 4.7,
        image: biz.imageUrl,
        icon: isHealth ? 'medical_services' : catConfig.icon,
        color: isHealth ? '#b3261e' : catConfig.bg,
        openingHours: biz.openingHours || '08:00 AM - 08:00 PM',
        slug: biz.slug
      });
    });

    return list;
  }, [businesses]);

  // Filtered pins
  const filteredPins = allPins.filter((pin) => {
    if (activeCategory !== 'all' && pin.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = pin.name.toLowerCase().includes(q) || (pin.nameMr && pin.nameMr.toLowerCase().includes(q));
      const matchAddr = (pin.address || '').toLowerCase().includes(q) || (pin.landmark || '').toLowerCase().includes(q);
      const matchCat = pin.categoryLabel.toLowerCase().includes(q) || pin.categoryLabelMr.toLowerCase().includes(q);
      return matchName || matchAddr || matchCat;
    }
    return true;
  });

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: ASGAON_CENTER,
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('&copy; OpenStreetMap • Asgaon Gram Panchayat GIS')
        .addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Render Clean Icon Pins (NO black backgrounds, NO overlapping text bubbles)
    filteredPins.forEach((pin) => {
      const isSelected = activePin?.id === pin.id;

      const customIcon = L.divIcon({
        className: 'custom-master-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s;">
            ${isSelected ? `
              <div style="
                position: absolute;
                top: -6px;
                width: ${pin.category === 'gp' ? '54px' : '48px'};
                height: ${pin.category === 'gp' ? '54px' : '48px'};
                border-radius: 50%;
                background: ${pin.color};
                opacity: 0.3;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
            ` : ''}
            <div style="
              width: ${isSelected ? '46px' : (pin.category === 'gp' ? '42px' : '36px')};
              height: ${isSelected ? '46px' : (pin.category === 'gp' ? '42px' : '36px')};
              border-radius: 50%;
              background-color: ${pin.color};
              color: #ffffff;
              border: 3px solid ${pin.category === 'gp' ? '#ffd700' : '#ffffff'};
              box-shadow: 0 4px 14px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              transition: all 0.2s ease;
            ">
              <span class="material-symbols-outlined" style="font-size: ${isSelected ? '24px' : (pin.category === 'gp' ? '22px' : '19px')};">
                ${pin.icon}
              </span>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid ${pin.color};
              margin-top: -2px;
            "></div>
          </div>
        `,
        iconSize: [38, 46],
        iconAnchor: [19, 44],
        popupAnchor: [0, -42],
      });

      const marker = L.marker([pin.latitude, pin.longitude], { icon: customIcon });

      marker.on('click', () => {
        setActivePin(pin);
        map.flyTo([pin.latitude, pin.longitude], 16, { animate: true, duration: 0.8 });
      });

      marker.addTo(map);
      markersRef.current[pin.id] = marker;
    });

    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => clearTimeout(resizeTimer);
  }, [isOpen, filteredPins, activePin?.id]);

  // Clean up on unmount
  useEffect(() => {
    if (!isOpen && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFlyToCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(ASGAON_CENTER, 15, { animate: true, duration: 0.8 });
      const gp = allPins.find((p) => p.category === 'gp');
      if (gp) setActivePin(gp);
    }
  };

  const handlePinSelect = (pin: MasterMapPin) => {
    setActivePin(pin);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([pin.latitude, pin.longitude], 17, { animate: true, duration: 0.8 });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="village-map-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[860px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e8e2d9] overflow-hidden flex flex-col">
        {/* 1. Modal Top Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#003629] via-[#004d3b] to-[#1b4d3e] text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#baeed9] shadow-inner shrink-0">
              <span className="material-symbols-outlined text-[24px]">explore</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="village-map-modal-title" className="font-heading font-extrabold text-[17px] sm:text-[19px] text-white leading-tight">
                  आसगाव समग्र ग्राम नकाशा (Village GIS Map)
                </h3>
                <span className="hidden sm:inline bg-[#baeed9] text-[#002117] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live GIS
                </span>
              </div>
              <p className="text-[11px] sm:text-[12px] text-[#baeed9]/90 font-medium">
                केंद्र बिंदू: ग्रामपंचायत आसगाव (20°47'06.0"N, 79°38'06.0"E) • {allPins.length} नोंदणीकृत ठिकाणे
              </p>
            </div>
          </div>

          {/* Controls: Search, Center & Close */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-56">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-white/60">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="नकाशावर ठिकाण शोधा..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/10 text-white placeholder:text-white/60 text-[12px] border border-white/20 focus:outline-none focus:bg-white/20 transition-all"
              />
              {searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white text-[#1d1b16] rounded-xl shadow-xl border border-[#e8e2d9] overflow-hidden z-30 max-h-48 overflow-y-auto">
                  {filteredPins.length === 0 ? (
                    <div className="p-2.5 text-[11px] text-[#707974] text-center">कोणतेही ठिकाण सापडले नाही</div>
                  ) : (
                    filteredPins.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          handlePinSelect(p);
                          setSearchQuery('');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#f9f3ea] flex items-center justify-between text-[11px] border-b border-[#f3ede4] last:border-0"
                      >
                        <span className="font-bold text-[#003629] truncate">{lang === 'MR' && p.nameMr ? p.nameMr : p.name}</span>
                        <span className="text-[#a63b00] shrink-0 text-[10px]">{p.categoryLabelMr}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleFlyToCenter}
              className="px-3 py-1.5 rounded-lg bg-[#baeed9] hover:bg-[#a3e5cd] text-[#002117] text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all shrink-0"
              title="ग्रामपंचायत केंद्रस्थानी जा (Center GP)"
            >
              <span className="material-symbols-outlined text-[16px]">my_location</span>
              <span className="hidden sm:inline">गाव केंद्र</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-[#ba1a1a] text-white transition-colors shrink-0"
              title="नकाशा बंद करा"
              aria-label="Close map"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* 2. Filter Pills Strip */}
        <div className="px-4 py-2.5 bg-[#f9f3ea] border-b border-[#e8e2d9] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-[11px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#707974] shrink-0">
            वर्गीकरण:
          </span>
          {[
            { id: 'all', label: `सर्व ठिकाणे (${allPins.length})`, icon: 'apps' },
            { id: 'gp', label: 'ग्रामपंचायत HQ', icon: 'account_balance' },
            { id: 'business', label: 'दुकाने व व्यवसाय', icon: 'storefront' },
            { id: 'education', label: 'शाळा व अभ्यासिका', icon: 'school' },
            { id: 'health', label: 'आरोग्य व दवाखाने', icon: 'medical_services' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#003629] text-white shadow-xs'
                  : 'bg-white text-[#404945] hover:bg-[#e8e2d9] border border-[#d0dcd5]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 3. Main Map View with Floating Selected Card */}
        <div className="relative flex-1 w-full z-0 isolate overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Active Card Floating Drawer (Like in Image 2) */}
          {activePin && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-20 bg-white/98 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-[#e8e2d9] animate-fadeIn">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {activePin.image ? (
                    <img
                      src={activePin.image}
                      alt={activePin.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#e8e2d9] shrink-0"
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: activePin.color }}
                    >
                      <span className="material-symbols-outlined text-[26px]">{activePin.icon}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-heading font-extrabold text-[15px] text-[#003629] leading-tight">
                      {lang === 'MR' && activePin.nameMr ? activePin.nameMr : activePin.name}
                    </h4>
                    <p className="text-[11px] text-[#707974] mt-0.5 line-clamp-1">
                      {activePin.landmark ? `${activePin.landmark}, ` : ''}{activePin.address || 'आसगाव परिसर'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#a63b00] font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        <span>{activePin.rating || 4.8}</span>
                      </span>
                      <span className="text-[10px] bg-[#baeed9]/60 text-[#002117] font-semibold px-2 py-0.5 rounded-full">
                        {lang === 'MR' ? activePin.categoryLabelMr : activePin.categoryLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePin(null)}
                  className="p-1 rounded-full text-[#707974] hover:text-[#1d1b16] hover:bg-[#f3ede4] transition-colors"
                  title="कार्ड बंद करा"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#f3ede4]">
                {activePin.phone ? (
                  <a
                    href={`tel:${activePin.phone}`}
                    className="py-2 px-2 bg-[#003629] hover:bg-[#00281e] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors text-center shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">call</span>
                    <span>कॉल करा</span>
                  </a>
                ) : (
                  <div className="py-2 px-2 bg-gray-100 text-gray-400 text-[11px] font-bold rounded-xl flex items-center justify-center text-center">
                    संपर्क नाही
                  </div>
                )}

                {activePin.whatsapp ? (
                  <a
                    href={`https://wa.me/91${activePin.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-2 bg-[#25d366] hover:bg-[#1faa54] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors text-center shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">chat</span>
                    <span>व्हॉट्सअॅप</span>
                  </a>
                ) : (
                  <a
                    href="https://wa.me/919422811204"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-2 bg-[#25d366] hover:bg-[#1faa54] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors text-center shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">chat</span>
                    <span>व्हॉट्सअॅप</span>
                  </a>
                )}

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activePin.latitude},${activePin.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-2 bg-[#fff8f0] hover:bg-[#f9f3ea] text-[#a63b00] border border-[#ffe0cc] text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors text-center"
                >
                  <span className="material-symbols-outlined text-[15px]">navigation</span>
                  <span>रस्ता पहा</span>
                </a>
              </div>

              {/* View Full Details Button */}
              {activePin.category === 'business' && onSelectBusiness && (
                <button
                  type="button"
                  onClick={() => {
                    const found = businesses.find((b) => String(b.id) === String(activePin.id));
                    if (found) {
                      onClose();
                      onSelectBusiness(found);
                    }
                  }}
                  className="w-full mt-2 text-center text-[11px] font-bold text-[#006a4e] hover:underline flex items-center justify-center gap-1 py-1"
                >
                  <span>सविस्तर माहिती पहा (View Full Details)</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
