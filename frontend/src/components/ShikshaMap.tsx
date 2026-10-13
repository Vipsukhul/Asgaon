import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../context/LanguageContext';

export interface EducationMapItem {
  id: string;
  name: string;
  nameEnglish: string;
  category: 'school' | 'library' | 'technical' | 'hostel';
  categoryLabelMarathi: string;
  categoryLabelEnglish: string;
  address: string;
  landmark: string;
  inCharge: string;
  phone: string;
  timings: string;
  highlights: string[];
  latitude: number;
  longitude: number;
  icon: string;
  color: string;
}

// Exact Coordinates of Asgaon: 20°47'06.0"N 79°38'06.0"E
const ASGAON_CENTER: [number, number] = [20.8084579, 79.7242461];

export const EDUCATION_INSTITUTES: EducationMapItem[] = [
  {
    id: 'edu-library',
    name: 'डॉ. एपीजे अब्दुल कलाम ग्राम वाचनालय व अभ्यासिका',
    nameEnglish: 'Dr. APJ Abdul Kalam Gram Library & Abhyasika',
    category: 'library',
    categoryLabelMarathi: 'ग्राम वाचनालय व अभ्यासिका',
    categoryLabelEnglish: 'Public Library & Study Hall',
    address: 'ग्राम सचिवालय संकुल, आसगाव (पवनी)',
    landmark: 'मध्यवर्ती ग्रामपंचायत चौक',
    inCharge: 'श्री. नीलकंठ मेश्राम (वाचनालय प्रमुख)',
    phone: '9822104500',
    timings: 'सकाळी ०६:०० ते रात्री ११:०० (सर्व दिवस)',
    highlights: ['४० अभ्यासिका सीट्स', '१०० Mbps मोफत वाय-फाय', '३,२००+ संदर्भ पुस्तके व वृत्तपत्रे', 'MPSC/UPSC तयारी कक्ष'],
    latitude: 20.7850,
    longitude: 79.6350,
    icon: 'local_library',
    color: '#006a4e'
  },
  {
    id: 'edu-zp-school',
    name: 'जि. प. हायस्कूल व कनिष्ठ महाविद्यालय, आसगाव',
    nameEnglish: 'Zilla Parishad High School & Jr College, Asgaon',
    category: 'school',
    categoryLabelMarathi: 'हायस्कूल व कनिष्ठ महाविद्यालय',
    categoryLabelEnglish: 'High School & Jr College',
    address: 'ग्रामपंचायत कार्यालय परिसर, आसगाव',
    landmark: 'पवनी-भंडारा मेन रोड, आसगाव',
    inCharge: 'मुख्याध्यापक श्री. आर. व्ही. गायकवाड',
    phone: '9422811204',
    timings: 'सकाळी १०:०० ते संध्या. ०५:००',
    highlights: ['इयत्ता १ ली ते १२ वी', 'मराठी व सेमी-इंग्रजी', 'कला, वाणिज्य व विज्ञान शाखा', 'मुलींसाठी मोफत सायकल योजना'],
    latitude: 20.7858,
    longitude: 79.6345,
    icon: 'school',
    color: '#166534'
  },
  {
    id: 'edu-saraswati',
    name: 'सरस्वती विद्या मंदिर प्राथमिक शाळा, आसगाव',
    nameEnglish: 'Saraswati Vidya Mandir Primary School',
    category: 'school',
    categoryLabelMarathi: 'प्राथमिक शाळा (१ ली ते ७ वी)',
    categoryLabelEnglish: 'Primary School (1st to 7th)',
    address: 'टेंभुर्णे वॉर्ड क्र. ३, जुन्या तलावाजवळ, आसगाव',
    landmark: 'जुना तलाव रोड, वॉर्ड ३',
    inCharge: 'मुख्याध्यापिका श्रीमती एस. पी. मेश्राम',
    phone: '9822104500',
    timings: 'सकाळी १०:३० ते दुपारी ०४:३०',
    highlights: ['बालवाडी ते ७ वी वर्ग', 'स्मार्ट प्रोजेक्टर वर्गखोली', 'पीएम पोषण आहार', 'क्रीडा व संगणक प्रयोगशाळा'],
    latitude: 20.7842,
    longitude: 79.6360,
    icon: 'child_care',
    color: '#c2410c'
  },
  {
    id: 'edu-iti-pauni',
    name: 'शासकीय औद्योगिक प्रशिक्षण संस्था (ITI), पवनी रोड',
    nameEnglish: 'Govt Industrial Training Institute (ITI)',
    category: 'technical',
    categoryLabelMarathi: 'तांत्रिक व व्यावसायिक प्रशिक्षण',
    categoryLabelEnglish: 'Technical Vocational ITI',
    address: 'पवनी बायपास रोड (आसगाव हद्द)',
    landmark: 'पवनी-आसगाव मुख्य जोड रस्ता',
    inCharge: 'प्राचार्य, शासकीय आयटीआय',
    phone: '07185222019',
    timings: 'सकाळी ०९:३० ते संध्या. ०५:३०',
    highlights: ['फिटर, इलेक्ट्रिशियन, वेल्डर, COPA', 'नागपूर MIDC थेट अप्रेंटिसशिप', '१० वी नंतर १ ते २ वर्षे डिप्लोमा', 'मोफत टूल किट वाटप'],
    latitude: 20.7910,
    longitude: 79.6395,
    icon: 'precision_manufacturing',
    color: '#8c5000'
  },
  {
    id: 'edu-hostel',
    name: 'डॉ. बाबासाहेब आंबेडकर सामाजिक न्याय वसतिगृह',
    nameEnglish: 'Dr. Babasaheb Ambedkar Social Welfare Hostel',
    category: 'hostel',
    categoryLabelMarathi: 'विद्यार्थी वसतिगृह व भोजन व्यवस्था',
    categoryLabelEnglish: 'Social Welfare Students Hostel',
    address: 'समाज कल्याण संकुल, आसगाव-पवनी मार्ग',
    landmark: 'पवनी रोड, आसगाव परिसर',
    inCharge: 'गृहपाल श्री. डी. एन. कांबळे',
    phone: '07185223300',
    timings: '२४/७ निवासी व्यवस्था',
    highlights: ['१२० विद्यार्थी क्षमता', 'पात्र विद्यार्थ्यांसाठी मोफत निवास व भोजन', 'स्वतंत्र वाचनालय व संगणक कक्ष', 'वैद्यकीय तपासणी सुविधा'],
    latitude: 20.7865,
    longitude: 79.6335,
    icon: 'hotel',
    color: '#002873'
  }
];

interface ShikshaMapProps {
  height?: string;
}

export const ShikshaMap: React.FC<ShikshaMapProps> = ({ height = '500px' }) => {
  const { lang } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [selectedItem, setSelectedItem] = useState<EducationMapItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter items
  const filteredItems = activeCategory === 'all'
    ? EDUCATION_INSTITUTES
    : EDUCATION_INSTITUTES.filter(item => item.category === activeCategory);

  // Initialize Leaflet Map
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

      // OpenStreetMap Street Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('&copy; OpenStreetMap • Asgaon School & Library GIS')
        .addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    // Add marker for each institute
    filteredItems.forEach(item => {
      const isSelected = selectedItem?.id === item.id;
      // Custom Clean HTML Marker: Circular pin icon with active selection effect
      const customIcon = L.divIcon({
        className: 'custom-shiksha-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s;">
            <!-- Outer Pulsing halo if selected -->
            ${isSelected ? `
              <div style="
                position: absolute;
                top: -6px;
                width: 52px;
                height: 52px;
                border-radius: 50%;
                background: ${item.color};
                opacity: 0.25;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
            ` : ''}

            <!-- Icon Pin Circle -->
            <div style="
              width: ${isSelected ? '44px' : '38px'};
              height: ${isSelected ? '44px' : '38px'};
              border-radius: 50%;
              background-color: ${item.color};
              color: #ffffff;
              border: 3px solid #ffffff;
              box-shadow: 0 4px 14px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              transition: all 0.2s ease;
            ">
              <span class="material-symbols-outlined" style="font-size: ${isSelected ? '24px' : '20px'};">${item.icon}</span>
            </div>

            <!-- Pin Bottom Arrow Point -->
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid ${item.color};
              margin-top: -2px;
            "></div>

          </div>
        `,
        iconSize: [42, 46],
        iconAnchor: [21, 44],
        popupAnchor: [0, -42]
      });

      const marker = L.marker([item.latitude, item.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedItem(item);
        map.setView([item.latitude, item.longitude], 16, { animate: true });
      });

      markersRef.current[item.id] = marker;
    });
  }, [filteredItems, selectedItem, lang]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(ASGAON_CENTER, 15, { animate: true });
      setSelectedItem(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-[#e8e2d9] shadow-sm flex flex-col">
      {/* Top Header & Filter Controls */}
      <div className="p-4 sm:p-5 border-b border-[#e8e2d9] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[#fdfbf7]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              {lang === 'MR' ? 'आसगाव शैक्षणिक नकाशा (GIS)' : 'Asgaon Education GIS Map'}
            </span>
            
          </div>
          <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#166534]">
            {lang === 'MR' ? 'शाळा, कनिष्ठ महाविद्यालय व अभ्यासिका नकाशा' : 'Schools, Colleges & Village Library Map'}
          </h3>
          <p className="text-xs text-stone-600">
            {lang === 'MR'
              ? 'आसगाव परिसरातील शाळा, हायस्कूल, वाचनालय आणि वसतिगृहांची अचूक ठिकाणे व दिशा.'
              : 'Interactive locations, contacts and directions for all educational institutions in Asgaon.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: lang === 'MR' ? 'सर्व संस्था' : 'All' },
            { id: 'school', label: lang === 'MR' ? 'शाळा' : 'Schools' },
            { id: 'library', label: lang === 'MR' ? 'वाचनालय / अभ्यासिका' : 'Library' },
            { id: 'technical', label: lang === 'MR' ? 'ITI' : 'ITI' },
            { id: 'hostel', label: lang === 'MR' ? 'वसतिगृह' : 'Hostel' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id);
                setSelectedItem(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeCategory === tab.id
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={handleRecenter}
            className="p-1.5 bg-white hover:bg-stone-100 text-[#166534] rounded-xl border border-stone-200 transition-all cursor-pointer"
            title={lang === 'MR' ? 'आसगाव केंद्रावर पुन्हा या' : 'Recenter to Asgaon'}
          >
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </button>
        </div>
      </div>

      {/* Map & Detail Sidebar Layout */}
      <div className="relative w-full flex flex-col lg:flex-row">
        {/* Leaflet Map Canvas */}
        <div
          ref={mapContainerRef}
          style={{ height }}
          className="w-full flex-1 relative z-0 min-h-[380px]"
        />

        {/* Selected Institute Info Card (Overlay or Right Panel) */}
        {selectedItem && (
          <div className="w-full lg:w-96 bg-white p-5 border-t lg:border-t-0 lg:border-l border-[#e8e2d9] flex flex-col justify-between shadow-lg lg:shadow-none animate-in fade-in slide-in-from-right duration-200">
            <div>
              {/* Category Badge & Close */}
              <div className="flex items-center justify-between mb-2">
                <span
                  style={{ backgroundColor: `${selectedItem.color}15`, color: selectedItem.color, borderColor: `${selectedItem.color}30` }}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border"
                >
                  {lang === 'MR' ? selectedItem.categoryLabelMarathi : selectedItem.categoryLabelEnglish}
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Title */}
              <h4 className="font-heading font-extrabold text-base text-[#1d1b16] mb-1">
                {lang === 'MR' ? selectedItem.name : selectedItem.nameEnglish}
              </h4>
              <p className="text-xs text-stone-500 mb-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-amber-700">pin_drop</span>
                <span>{selectedItem.address}</span>
              </p>

              {/* In-Charge & Timings */}
              <div className="bg-[#fdfbf7] p-3 rounded-xl border border-[#f0eae0] flex flex-col gap-2 text-xs mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">{lang === 'MR' ? 'प्रमुख / मुख्याध्यापक:' : 'In-Charge:'}</span>
                  <span className="font-bold text-stone-800">{selectedItem.inCharge}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">{lang === 'MR' ? 'वेळ:' : 'Timings:'}</span>
                  <span className="font-bold text-emerald-800">{selectedItem.timings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">{lang === 'MR' ? 'संपर्क क्रमांक:' : 'Phone:'}</span>
                  <a href={`tel:${selectedItem.phone}`} className="font-bold text-[#166534] hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    <span>{selectedItem.phone}</span>
                  </a>
                </div>
              </div>

              {/* Highlights Chips */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-stone-700 block mb-1.5">
                  {lang === 'MR' ? 'महत्त्वपूर्ण वैशिष्ट्ये:' : 'Key Facilities:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedItem.highlights.map((h, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Google Maps Navigation Button */}
            <div className="pt-3 border-t border-stone-200 flex items-center gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedItem.latitude},${selectedItem.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#166534] hover:bg-[#052e16] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">navigation</span>
                <span>{lang === 'MR' ? 'गूगल मॅपवर दिशा पहा' : 'Get Directions'}</span>
              </a>

              <a
                href={`tel:${selectedItem.phone}`}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl border border-amber-200 transition-all"
                title="कॉल करा"
              >
                <span className="material-symbols-outlined text-[18px]">phone_enabled</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
