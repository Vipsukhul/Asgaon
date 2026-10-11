import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface ShopLocationData {
  id: string | number;
  name: string;
  categoryKey?: string;
  categoryLabel?: string;
  category?: string;
  address?: string;
  landmark?: string;
  distance?: string;
  phone?: string;
  whatsapp?: string;
  hours?: string;
  openingHours?: string;
  image?: string;
  imageUrl?: string;
  rating?: string | number;
  ratingCount?: number;
  latitude: number;
  longitude: number;
}

interface ShopLocationModalProps {
  business: ShopLocationData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenInFullVillageMap?: (bizId: string | number) => void;
}

const ASGAON_PANCHAYAT: [number, number] = [20.8084579, 79.7242461];

const CATEGORY_COLORS: Record<string, { bg: string; icon: string; label: string }> = {
  seeds: { bg: '#006a4e', icon: 'agriculture', label: 'कृषी व बी-बियाणे' },
  clinic: { bg: '#ba1a1a', icon: 'local_hospital', label: 'दवाखाना / आरोग्य' },
  machinery: { bg: '#a63b00', icon: 'precision_manufacturing', label: 'ट्रॅक्टर व अवजारे' },
  dairy: { bg: '#002873', icon: 'egg', label: 'दुग्ध व्यवसाय' },
  hardware: { bg: '#404945', icon: 'construction', label: 'हार्डवेअर व बांधकाम' },
  csc: { bg: '#004d3b', icon: 'desk', label: 'शासकीय ई-सेवा केंद्र' },
  kirana: { bg: '#d97706', icon: 'storefront', label: 'किराणा व जनरल स्टोअर' }
};

export const ShopLocationModal: React.FC<ShopLocationModalProps> = ({
  business,
  isOpen,
  onClose,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Initialize or re-center Leaflet Map
  useEffect(() => {
    if (!isOpen || !business || !mapContainerRef.current) return;

    const lat = business.latitude || ASGAON_PANCHAYAT[0];
    const lng = business.longitude || ASGAON_PANCHAYAT[1];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('&copy; OpenStreetMap • Asgaon Panchayat GIS')
        .addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lng], 16);
    }

    const map = mapInstanceRef.current;

    // Clear previous layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const catKey = business.categoryKey || 'kirana';
    const catConfig = CATEGORY_COLORS[catKey] || CATEGORY_COLORS.kirana;

    // 1. Custom Pin Marker for the Shop
    const shopIcon = L.divIcon({
      className: 'custom-shop-modal-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="
            position: absolute;
            top: -6px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: ${catConfig.bg};
            opacity: 0.25;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: ${catConfig.bg};
            color: #ffffff;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
          ">
            <span class="material-symbols-outlined" style="font-size: 22px;">${catConfig.icon}</span>
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid ${catConfig.bg};
            margin-top: -2px;
            z-index: 10;
          "></div>
        </div>
      `,
      iconSize: [42, 48],
      iconAnchor: [21, 46],
      popupAnchor: [0, -44]
    });

    const shopMarker = L.marker([lat, lng], { icon: shopIcon }).addTo(map);
    shopMarker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
        <strong style="font-size: 13px; color: #003629;">${business.name}</strong><br/>
        <span style="color: #666;">${business.address || 'Asgaon Village'}</span><br/>
        <span style="color: #a63b00; font-weight: bold;">${business.distance || business.landmark || 'Village Area'}</span>
      </div>
    `).openPopup();

    // 2. Reference Marker for Gram Panchayat Asgaon Square
    const gpIcon = L.divIcon({
      className: 'custom-gp-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #003629;
            color: #baeed9;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span class="material-symbols-outlined" style="font-size: 16px;">account_balance</span>
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 5px solid #003629;
            margin-top: -1px;
          "></div>
        </div>
      `,
      iconSize: [28, 34],
      iconAnchor: [14, 32],
      popupAnchor: [0, -30]
    });

    L.marker(ASGAON_PANCHAYAT, { icon: gpIcon })
      .bindPopup('<b>ग्रामपंचायत आसगाव (Gram Panchayat HQ)</b><br/>मध्यवर्ती चौक व प्रशासकीय कार्यालय')
      .addTo(map);

    // Dotted line connecting Gram Panchayat to Shop
    L.polyline([ASGAON_PANCHAYAT, [lat, lng]], {
      color: '#006a4e',
      weight: 2,
      dashArray: '5, 7',
      opacity: 0.7
    }).addTo(map);

    // Invalidate size to ensure proper tile rendering in modal
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(resizeTimer);
    };
  }, [isOpen, business]);

  // Clean up map instance on unmount or close
  useEffect(() => {
    if (!isOpen && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen || !business) return null;

  const lat = business.latitude || ASGAON_PANCHAYAT[0];
  const lng = business.longitude || ASGAON_PANCHAYAT[1];
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const hours = business.hours || business.openingHours || 'Open: 07:30 AM - 08:30 PM';
  const phone = business.phone || '';
  const whatsapp = business.whatsapp || phone || '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-location-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e8e2d9] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#f9f3ea] border-b border-[#e8e2d9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            
            <div>
              <div className="flex items-center gap-2">
                <h3 id="shop-location-title" className="font-heading font-extrabold text-[17px] sm:text-[19px] text-[#003629] leading-tight">
                  {business.name}
                </h3>
               
              </div>
             
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#707974] hover:text-[#1d1b16] hover:bg-[#e8e2d9] transition-colors"
            title="बंद करा (Close)"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Interactive Map Box */}
        <div className="relative w-full h-[320px] sm:h-[380px] bg-[#f3ede4]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

         

          {/* Gram Panchayat reference indicator */}
          <div className="absolute top-3 right-3 z-20 bg-[#003629]/95 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1.5 text-[10px] font-bold">
            <span className="material-symbols-outlined text-[13px] text-[#baeed9]">account_balance</span>
            <span>ग्रामपंचायतपासून: {business.distance || business.landmark || '0.3 km'}</span>
          </div>
        </div>

        {/* Shop Info & Action Bar */}
        <div className="p-4 sm:p-5 flex flex-col gap-3.5 overflow-y-auto">
          {/* Address & Timings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#f9f3ea] p-3 sm:p-3.5 rounded-xl border border-[#e8e2d9] text-[12px]">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#a63b00] shrink-0 mt-0.5">storefront</span>
              <div>
                <span className="text-[#707974] font-medium block">पत्ता व परिसर</span>
                <span className="text-[#1d1b16] font-bold">{business.address || 'Asgaon Market Road, Asgaon'}</span>
                {business.landmark && (
                  <span className="block text-[11px] text-[#003629] font-medium mt-0.5">खूण: {business.landmark}</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#003629] shrink-0 mt-0.5">schedule</span>
              <div>
                <span className="text-[#707974] font-medium block">वेळ:</span>
                <span className="text-[#1d1b16] font-bold">{hours}</span>
                <span className="block text-[11px] text-[#376757] font-medium mt-0.5">
                  अंतर: {business.distance || 'ग्रामपंचायत जवळ'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            {/* Navigation links */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Google Maps Directions */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#003629] hover:bg-[#1b4d3e] text-white text-[12px] sm:text-[13px] font-bold flex items-center gap-1.5 shadow-xs transition-all hover:shadow-md"
              >
                <span className="material-symbols-outlined text-[18px] text-[#baeed9]">navigation</span>
                <span>Google Maps</span>
              </a>

             
            </div>

            {/* Direct Contact links */}
            <div className="flex items-center gap-2">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="p-2.5 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#003629] text-[12px] font-bold flex items-center gap-1 border border-[#e8e2d9] transition-colors"
                  title="थेट कॉल करा"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span className="hidden sm:inline">कॉल</span>
                </a>
              )}

              {whatsapp && (
                <a
                  href={`https://wa.me/91${whatsapp}?text=Hello%20${encodeURIComponent(business.name)},%20I%20saw%20your%20shop%20location%20on%20Digital%20Gaon%20Asgaon.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#f3ede4] hover:bg-[#e8e2d9] text-[#25D366] text-[12px] font-bold flex items-center gap-1 border border-[#e8e2d9] transition-colors"
                  title="WhatsApp वर मेसेज करा"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span className="hidden sm:inline text-[#003629]">WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
