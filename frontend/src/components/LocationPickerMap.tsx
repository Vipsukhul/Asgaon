import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onChangeLocation: (lat: number, lng: number) => void;
  height?: string;
}

const ASGAON_CENTER: [number, number] = [20.7850, 79.6350];

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  latitude,
  longitude,
  onChangeLocation,
  height = '220px'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [latitude || ASGAON_CENTER[0], longitude || ASGAON_CENTER[1]],
        zoom: 16,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      // Gram Panchayat Landmark indicator
      const gpIcon = L.divIcon({
        className: 'picker-gp-marker',
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
      L.marker(ASGAON_CENTER, { icon: gpIcon })
        .bindPopup('<b>ग्रामपंचायत आसगाव (Gram Panchayat HQ)</b>')
        .addTo(map);

      // Main Draggable Pin Icon
      const pinIcon = L.divIcon({
        className: 'picker-pin-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: grab;">
            <div style="
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: #a63b00;
              color: white;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span class="material-symbols-outlined" style="font-size: 20px;">storefront</span>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 7px solid #a63b00;
              margin-top: -2px;
            "></div>
          </div>
        `,
        iconSize: [36, 43],
        iconAnchor: [18, 43]
      });

      const marker = L.marker([latitude || ASGAON_CENTER[0], longitude || ASGAON_CENTER[1]], {
        icon: pinIcon,
        draggable: true
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChangeLocation(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        onChangeLocation(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
      });

      mapRef.current = map;
      markerRef.current = marker;
    } else {
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      }
      mapRef.current.panTo([latitude, longitude]);
    }

    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 250);

    return () => clearTimeout(timer);
  }, [latitude, longitude, onChangeLocation]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#e8e2d9] shadow-inner bg-[#f3ede4]" style={{ height }}>
      <div ref={containerRef} className="w-full h-full z-0" />
      <div className="absolute bottom-2 left-2 z-10 bg-black/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-1 rounded-md shadow-xs pointer-events-none">
        💡 नकाशावर क्लिक करा किंवा पिन ड्रॅग करून दुकानाची अचूक जागा निवडा
      </div>
    </div>
  );
};
