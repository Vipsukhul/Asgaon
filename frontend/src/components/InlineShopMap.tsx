import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InlineShopMapProps {
  latitude: number;
  longitude: number;
  shopName: string;
  categoryKey?: string;
  address?: string;
  onOpenFullMap?: () => void;
  onOpenModal?: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; icon: string }> = {
  seeds: { bg: '#006a4e', icon: 'agriculture' },
  clinic: { bg: '#ba1a1a', icon: 'local_hospital' },
  machinery: { bg: '#c2410c', icon: 'precision_manufacturing' },
  dairy: { bg: '#002873', icon: 'egg' },
  hardware: { bg: '#404945', icon: 'construction' },
  csc: { bg: '#14532d', icon: 'desk' },
  kirana: { bg: '#d97706', icon: 'storefront' }
};

export const InlineShopMap: React.FC<InlineShopMapProps> = ({
  latitude,
  longitude,
  shopName,
  categoryKey = 'kirana',
  address,
  onOpenFullMap,
  onOpenModal
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [latitude, longitude],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      mapRef.current = map;
    } else {
      mapRef.current.setView([latitude, longitude], 16);
    }

    const map = mapRef.current;

    // Clear old markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const catConfig = CATEGORY_COLORS[categoryKey] || CATEGORY_COLORS.kirana;

    const icon = L.divIcon({
      className: 'inline-shop-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: ${catConfig.bg};
            color: white;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span class="material-symbols-outlined" style="font-size: 18px;">${catConfig.icon}</span>
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid ${catConfig.bg};
            margin-top: -2px;
          "></div>
        </div>
      `,
      iconSize: [32, 40],
      iconAnchor: [16, 38]
    });

    const marker = L.marker([latitude, longitude], { icon }).addTo(map);
    marker.bindPopup(`<b>${shopName}</b><br/>${address || ''}`);

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [latitude, longitude, shopName, categoryKey, address]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <div className="w-full mt-3 rounded-xl overflow-hidden border border-[#e8e2d9] bg-[#f9f3ea] animate-fadeIn relative z-0 isolate">
      <div className="relative h-44 w-full bg-[#f3ede4] z-0">
        <div ref={containerRef} className="w-full h-full z-0" />
        <div className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur-xs text-[#166534] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px] text-[#c2410c]">pin_drop</span>
          <span>{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</span>
        </div>
      </div>

      <div className="p-2.5 bg-white flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1 text-[#707974]">
          <span className="material-symbols-outlined text-[14px] text-[#c2410c]">location_on</span>
          <span className="truncate max-w-[200px]">{address || shopName}</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenModal && (
            <button
              type="button"
              onClick={onOpenModal}
              className="px-2 py-1 rounded-md bg-[#fef9ee] text-[#c2410c] font-bold border border-[#fed7aa] hover:bg-[#fed7aa] transition-colors"
            >
              मोठ्या आकारात (Enlarge)
            </button>
          )}

          {onOpenFullMap && (
            <button
              type="button"
              onClick={onOpenFullMap}
              className="px-2 py-1 rounded-md bg-[#f3ede4] text-[#166534] font-bold hover:bg-[#e8e2d9] transition-colors"
            >
              मुख्य नकाशा (Live Map)
            </button>
          )}

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-md bg-[#166534] text-white font-bold hover:bg-[#052e16] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">navigation</span>
            <span>Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
