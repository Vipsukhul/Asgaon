import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapBusinessItem {
  id: string | number;
  name: string;
  categoryKey?: string;
  categoryLabel?: string;
  address?: string;
  distance?: string;
  phone?: string;
  whatsapp?: string;
  hours?: string;
  image?: string;
  rating?: string | number;
  ratingCount?: number;
  latitude: number;
  longitude: number;
  tags?: string[];
}

interface LiveBusinessMapProps {
  businesses: MapBusinessItem[];
  selectedBusinessId?: string | number | null;
  onSelectBusiness?: (biz: any) => void;
  height?: string;
  onClose?: () => void;
}

const ASGAON_CENTER: [number, number] = [20.8084579, 79.7242461];

export const CATEGORY_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  seeds: { bg: '#006a4e', border: '#baeed9', icon: 'agriculture' },
  clinic: { bg: '#ba1a1a', border: '#ffdad6', icon: 'local_hospital' },
  machinery: { bg: '#a63b00', border: '#ffdbce', icon: 'precision_manufacturing' },
  dairy: { bg: '#002873', border: '#dbe1ff', icon: 'egg' },
  hardware: { bg: '#404945', border: '#e8e2d9', icon: 'construction' },
  csc: { bg: '#004d3b', border: '#8abda9', icon: 'desk' },
  kirana: { bg: '#d97706', border: '#fef3c7', icon: 'storefront' }
};

export const LiveBusinessMap: React.FC<LiveBusinessMapProps> = ({
  businesses,
  selectedBusinessId,
  onSelectBusiness,
  height = '540px',
  onClose
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [activeItem, setActiveItem] = useState<MapBusinessItem | null>(null);
  const [mapSearch, setMapSearch] = useState('');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: ASGAON_CENTER,
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile layer
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      });
      streetLayer.addTo(map);

      // Attribution small
      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> • Asgaon GIS')
        .addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Add markers for all businesses
    businesses.forEach((biz) => {
      const catConfig = CATEGORY_COLORS[biz.categoryKey || 'kirana'] || CATEGORY_COLORS.kirana;
      const isSelected = (selectedBusinessId && String(biz.id) === String(selectedBusinessId)) || (activeItem && String(biz.id) === String(activeItem.id));

      // Custom HTML Pin Icon (clean circular icon pin without cluttering text labels)
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s;">
            ${isSelected ? `
              <div style="
                position: absolute;
                top: -5px;
                width: 46px;
                height: 46px;
                border-radius: 50%;
                background: ${catConfig.bg};
                opacity: 0.3;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
            ` : ''}
            <div style="
              width: ${isSelected ? '44px' : '36px'};
              height: ${isSelected ? '44px' : '36px'};
              border-radius: 50%;
              background-color: ${catConfig.bg};
              color: white;
              border: 3px solid ${isSelected ? '#ffffff' : 'white'};
              box-shadow: 0 4px 14px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              transition: all 0.2s ease;
            ">
              <span class="material-symbols-outlined" style="font-size: ${isSelected ? '24px' : '20px'};">${catConfig.icon}</span>
            </div>
            <div style="
              width: 0; 
              height: 0; 
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid ${catConfig.bg};
              margin-top: -2px;
            "></div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([biz.latitude, biz.longitude], { icon: customIcon });

      // Click on marker
      marker.on('click', () => {
        setActiveItem(biz);
        map.flyTo([biz.latitude, biz.longitude], 16, { animate: true, duration: 0.8 });
      });

      marker.addTo(map);
      markersRef.current[String(biz.id)] = marker;
    });

    // If specific business selected, pan to it
    if (selectedBusinessId && markersRef.current[String(selectedBusinessId)]) {
      const target = businesses.find((b) => String(b.id) === String(selectedBusinessId));
      if (target) {
        setActiveItem(target);
        map.flyTo([target.latitude, target.longitude], 17, { animate: true, duration: 1.0 });
      }
    }

    // Refresh size
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => clearTimeout(timer);
  }, [businesses, selectedBusinessId, activeItem?.id]);

  // Handle fly to searched business
  const handleFlyTo = (biz: MapBusinessItem) => {
    setActiveItem(biz);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([biz.latitude, biz.longitude], 17, { animate: true, duration: 0.8 });
    }
  };

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(ASGAON_CENTER, 15, { animate: true, duration: 0.8 });
      setActiveItem(null);
    }
  };

  const filteredPins = businesses.filter((b) =>
    !mapSearch.trim() ||
    b.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
    (b.address && b.address.toLowerCase().includes(mapSearch.toLowerCase()))
  );

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#e8e2d9] shadow-md bg-white flex flex-col">
      {/* 1. Map Top Control Header */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-[#003629] to-[#004d3b] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#baeed9]">
            <span className="material-symbols-outlined text-[22px]">map</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-[15px] sm:text-[16px] text-white">
                आसगाव थेट व्यवसाय नकाशा (Live Village Map)
              </h3>
            </div>
            <p className="text-[11px] text-[#baeed9]">
              गावातील दुकाने, कृषी केंद्र, दवाखाने व सेवा थेट नकाशावर पहा व दिशा मिळवा (Turn-by-turn navigation)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Quick search input on map */}
          <div className="relative flex-1 sm:w-60">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[17px] text-white/60">
              search
            </span>
            <input
              type="text"
              value={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
              placeholder="नकाशावर दुकान शोधा..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/10 text-white placeholder:text-white/60 text-[12px] border border-white/20 focus:outline-none focus:bg-white/20"
            />
            {mapSearch.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white text-[#1d1b16] rounded-xl shadow-xl border border-[#e8e2d9] overflow-hidden z-30 max-h-48 overflow-y-auto">
                {filteredPins.length === 0 ? (
                  <div className="p-2.5 text-[11px] text-[#707974] text-center">कोणतेही दुकान सापडले नाही</div>
                ) : (
                  filteredPins.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        handleFlyTo(b);
                        setMapSearch('');
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-[#f9f3ea] flex items-center justify-between text-[11px] border-b border-[#f3ede4] last:border-0"
                    >
                      <span className="font-bold text-[#003629] truncate">{b.name}</span>
                      <span className="text-[#a63b00] shrink-0 text-[10px]">{b.distance || ''}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetCenter}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
            title="आसगाव केंद्रस्थानी जा (Center Map)"
          >
            <span className="material-symbols-outlined text-[19px]">my_location</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-[#ba1a1a] text-white transition-colors"
              title="नकाशा बंद करा"
            >
              <span className="material-symbols-outlined text-[19px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Map Canvas Container & Overlays */}
      <div className="relative w-full z-0 isolate" style={{ height }}>
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Selected Business Card Drawer (Floating Popup at Bottom) */}
        {activeItem && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-20 bg-white/98 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-[#e8e2d9] animate-fadeIn">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {activeItem.image ? (
                  <img
                    src={activeItem.image}
                    alt={activeItem.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#e8e2d9] shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#003629] text-[#baeed9] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[26px]">storefront</span>
                  </div>
                )}
                <div>
                  <h4 className="font-heading font-extrabold text-[15px] text-[#003629] leading-tight">
                    {activeItem.name}
                  </h4>
                  <p className="text-[11px] text-[#707974] mt-0.5">
                    {activeItem.address || 'आसगाव, पवनी'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center text-[11px] font-bold text-[#a63b00]">
                      ★ {activeItem.rating || '4.8'}
                    </span>
                    <span className="text-[10px] text-[#006a4e] font-semibold bg-[#baeed9]/50 px-1.5 py-0.2 rounded">
                      {activeItem.distance || '0.4 km'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="text-[#707974] hover:text-[#1d1b16] p-1"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#f3ede4]">
              {activeItem.phone && (
                <a
                  href={`tel:${activeItem.phone}`}
                  className="py-2 px-2 rounded-xl bg-[#003629] text-white hover:bg-[#1b4d3e] text-[11px] font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">call</span>
                  <span>कॉल करा</span>
                </a>
              )}

              {activeItem.whatsapp && (
                <a
                  href={`https://wa.me/91${activeItem.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 rounded-xl bg-[#25d366] text-white hover:bg-[#1ebc59] text-[11px] font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">chat</span>
                  <span>व्हॉट्सॲप</span>
                </a>
              )}

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeItem.latitude},${activeItem.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2 rounded-xl bg-[#f9f3ea] hover:bg-[#e8e2d9] text-[#003629] text-[11px] font-bold flex items-center justify-center gap-1 transition-colors border border-[#e8e2d9]"
                title="Google Maps दिशानिर्देश उघडा"
              >
                <span className="material-symbols-outlined text-[15px] text-[#a63b00]">navigation</span>
                <span>रस्ता पहा</span>
              </a>
            </div>

            {onSelectBusiness && (
              <button
                type="button"
                onClick={() => onSelectBusiness(activeItem)}
                className="w-full mt-2 py-1.5 text-center text-[11px] text-[#003629] font-bold hover:underline"
              >
                सविस्तर माहिती पहा (View Full Details) &rarr;
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Bottom Quick Legend */}
      <div className="px-4 py-2.5 bg-[#f9f3ea] border-t border-[#e8e2d9] flex flex-wrap items-center justify-between text-[11px] text-[#55605a] gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-[#1d1b16]">नकाशा संकेत (Legend):</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006a4e]"></span> कृषी व बी-बियाणे
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span> दवाखाने व मेडिकल
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a63b00]"></span> ट्रॅक्टर व यंत्रसामग्री
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#002873]"></span> दुग्ध व्यवसाय
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span> किराणा व जनरल
          </span>
        </div>

        <span className="text-[10px] text-[#707974]">
          आसगाव (पवनी, भंडारा ४४१९१०)
        </span>
      </div>
    </div>
  );
};
