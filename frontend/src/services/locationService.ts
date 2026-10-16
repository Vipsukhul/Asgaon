// Comprehensive Geolocation & Reverse Geocoding Service for Asgaon Digital Portal

export interface LocationAddressResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  road?: string;
  suburb?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  postcode?: string;
  isApproximate?: boolean;
}

export interface VillageLandmark {
  name: string;
  nameMr: string;
  latitude: number;
  longitude: number;
  ward: string;
  category: 'gov' | 'school' | 'health' | 'temple' | 'market';
}

export const ASGAON_VILLAGE_LANDMARKS: VillageLandmark[] = [
  {
    name: 'Gram Panchayat Bhavan, Asgaon',
    nameMr: 'ग्रामपंचायत भवन, आसगाव',
    latitude: 20.807884,
    longitude: 79.722796,
    ward: 'Ward 2 (Gaothan)',
    category: 'gov'
  },
  {
    name: 'Zilla Parishad High School & Jr College',
    nameMr: 'जिल्हा परिषद हायस्कूल व कनिष्ठ महाविद्यालय',
    latitude: 20.7858,
    longitude: 79.6345,
    ward: 'Ward 2 (Gaothan)',
    category: 'school'
  },
  {
    name: 'Saraswati Vidya Mandir Primary School',
    nameMr: 'सरस्वती विद्या मंदिर प्राथमिक शाळा',
    latitude: 20.7842,
    longitude: 79.6360,
    ward: 'Ward 3 (Tembhurne)',
    category: 'school'
  },
  {
    name: 'Primary Health Sub-Centre (PHC)',
    nameMr: 'प्राथमिक आरोग्य उपकेंद्र, आसगाव',
    latitude: 20.7835,
    longitude: 79.6355,
    ward: 'Ward 2 (Gaothan)',
    category: 'health'
  },
  {
    name: 'Khandoba Mandir Chowk',
    nameMr: 'खंडोबा मंदिर चौक',
    latitude: 20.7865,
    longitude: 79.6338,
    ward: 'Ward 1 (Bazaar Chowk)',
    category: 'temple'
  },
  {
    name: 'Asgaon Bazaar Chowk (Main Market)',
    nameMr: 'आसगाव आठवडी बाजार चौक',
    latitude: 20.7852,
    longitude: 79.6348,
    ward: 'Ward 1 (Bazaar Chowk)',
    category: 'market'
  },
  {
    name: 'Pauni Bus Stand Junction',
    nameMr: 'पवनी बस स्थानक जंक्शन (२.५ किमी)',
    latitude: 20.7915,
    longitude: 79.6390,
    ward: 'Pauni Bypass',
    category: 'gov'
  }
];

/**
 * 1. Fetch current GPS device coordinates with fallback & timeout
 */
export async function getCurrentCoordinates(): Promise<{ latitude: number; longitude: number; accuracy?: number }> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser or device.');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
          accuracy: pos.coords.accuracy
        });
      },
      (err) => {
        let message = 'Unable to fetch current device location.';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'Location access permission was denied. Please allow location in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            message = 'GPS signal is currently unavailable. Please verify GPS is enabled.';
            break;
          case err.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000
      }
    );
  });
}

/**
 * 2. Reverse Geocode latitude/longitude to a structured street/village address
 */
export async function reverseGeocodeLocation(lat: number, lon: number): Promise<LocationAddressResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'mr,en',
          'User-Agent': 'AsgaonDigitalPortal/1.0 (info@asgaon.digitalgaon.in)'
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const road = addr.road || addr.pedestrian || addr.street;
      const suburb = addr.suburb || addr.neighbourhood || addr.residential;
      const village = addr.village || addr.town || addr.city || addr.hamlet || 'Asgaon';
      const taluka = addr.county || addr.state_district || 'Pauni';
      const district = addr.state_district || 'Bhandara';
      const state = addr.state || 'Maharashtra';
      const postcode = addr.postcode || '441910';

      const parts = [road, suburb, village, taluka, district, postcode].filter(Boolean);
      const formattedAddress = parts.join(', ') || data.display_name || `${lat}, ${lon}`;

      return {
        latitude: lat,
        longitude: lon,
        formattedAddress,
        road,
        suburb,
        village,
        taluka,
        district,
        state,
        postcode
      };
    }
  } catch (err) {
    console.warn('External reverse geocoding unavailable, using local landmark matcher:', err);
  }

  // Fallback: match closest Asgaon village landmark
  const nearest = findNearestLandmark(lat, lon);
  return {
    latitude: lat,
    longitude: lon,
    formattedAddress: `${nearest.nameMr} (${nearest.ward}), आसगाव, पवनी, भंडारा ४४१९१०`,
    village: 'Asgaon',
    taluka: 'Pauni',
    district: 'Bhandara',
    state: 'Maharashtra',
    postcode: '441910',
    isApproximate: true
  };
}

/**
 * 3. Find closest known village landmark using haversine approximation
 */
export function findNearestLandmark(lat: number, lon: number): VillageLandmark {
  let closest = ASGAON_VILLAGE_LANDMARKS[0];
  let minDistance = Infinity;

  for (const landmark of ASGAON_VILLAGE_LANDMARKS) {
    const dLat = landmark.latitude - lat;
    const dLon = landmark.longitude - lon;
    const distSq = dLat * dLat + dLon * dLon;
    if (distSq < minDistance) {
      minDistance = distSq;
      closest = landmark;
    }
  }

  return closest;
}

/**
 * 4. Combined helper: Detect current GPS + reverse geocode address in one shot
 */
export async function detectCurrentLocationWithAddress(): Promise<LocationAddressResult> {
  const coords = await getCurrentCoordinates();
  return reverseGeocodeLocation(coords.latitude, coords.longitude);
}
