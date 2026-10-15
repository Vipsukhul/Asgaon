export interface BusSchedule {
  id: string;
  busNumber?: string;
  source: string;
  destination: string;
  sourceMarathi: string;
  destinationMarathi: string;
  via: string[];
  viaMarathi: string[];
  departureTime: string;
  departureTime24: string;
  approxArrivalTime: string;
  durationMinutes: number;
  busType: 'Lalpari' | 'Asiad' | 'Shivshahi' | 'Ordinary' | 'ManavVikas' | string;
  busTypeMarathi: string;
  depot: string;
  depotMarathi: string;
  fareGeneral: number;
  fareMahila: number;
  fareSenior: number;
  frequency: string;
  frequencyMarathi: string;
  boardingPointAtAsgaon: string;
  boardingPointMarathi: string;
  isPopular?: boolean;
}

export interface AutoDriver {
  id: string;
  name: string;
  nameMarathi: string;
  vehicleNumber: string;
  vehicleType: string;
  phone: string;
  standLocation: string;
  standLocationMarathi: string;
  primaryRoute: string;
  primaryRouteMarathi: string;
  estimatedFare: string;
  isAvailable: boolean;
}

export interface DepotContact {
  depotName: string;
  depotNameMarathi: string;
  phone: string;
  controllerDesk: string;
  address: string;
  addressMarathi: string;
  distanceFromAsgaon: string;
}

// Default arrays emptied - all data is loaded dynamically from database via /api/v1/transport/*
export const BUS_SCHEDULES: BusSchedule[] = [];

export const AUTO_DRIVERS: AutoDriver[] = [];

export const DEPOT_CONTACTS: DepotContact[] = [];

export const MSRTC_CONCESSIONS = [
  {
    title: 'महिला सन्मान योजना',
    benefit: '५०% तिकीट सवलत (अर्धे तिकीट)',
    eligibility: 'महाराष्ट्रातील सर्व महिला व विद्यार्थिनींसाठी सर्व साध्या व निमआराम बसेसमध्ये लागू.',
    requirement: 'कोणत्याही विशेष पासची गरज नाही; कंडक्टरकडे थेट महिला तिकीट मिळते.'
  },
  {
    title: 'अमृत ज्येष्ठ नागरिक योजना (७५+ वर्षे)',
    benefit: '१००% मोफत प्रवास',
    eligibility: '७५ वर्षे किंवा त्याहून अधिक वयाच्या सर्व ज्येष्ठ नागरिकांसाठी.',
    requirement: 'आधार कार्ड, मतदार ओळखपत्र किंवा ज्येष्ठ नागरिक ओळखपत्र सोबत असणे आवश्यक.'
  },
  {
    title: '६५ ते ७५ वयोगटातील ज्येष्ठ नागरिक सवलत',
    benefit: '५०% तिकीट सवलत',
    eligibility: '६५ ते ७४ वयोगटातील ज्येष्ठ नागरिकांना सर्व बसेसमध्ये (साधी, निमआराम, शिवशाही).',
    requirement: 'वयाचा पुरावा (आधार कार्ड किंवा मतदान ओळखपत्र).'
  },
  {
    title: 'अहिल्याबाई होळकर विद्यार्थिनी मोफत पास',
    benefit: 'शालेय विद्यार्थिनींना १००% मोफत मासिक पास',
    eligibility: 'इयत्ता ५ वी ते १२ वी पर्यंत शिक्षण घेणाऱ्या गावातील मुलींसाठी घर ते शाळा प्रवासासाठी.',
    requirement: 'शाळेचे मुख्याध्यापक शिफारस पत्र व पवनी आगारात अर्ज.'
  },
  {
    title: 'शालेय व महाविद्यालयीन विद्यार्थी सवलत पास',
    benefit: '६६.६% सवलत (फक्त ३३.३% मासिक भाडे)',
    eligibility: 'मान्यताप्राप्त शाळा, आयटीआय, डी.एड., पॉलिटेक्निक व कॉलेज विद्यार्थ्यांसाठी.',
    requirement: 'पवनी आगारात संस्था प्रमुखांच्या सहीचा अर्ज सादर करणे.'
  }
];
