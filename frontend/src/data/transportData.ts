export interface BusSchedule {
  id: string;
  busNumber?: string;
  source: string;
  destination: string;
  sourceMarathi: string;
  destinationMarathi: string;
  via: string[];
  viaMarathi: string[];
  departureTime: string; // "06:30 AM" or 24-hr format "06:30"
  departureTime24: string; // "06:30"
  approxArrivalTime: string; // "07:15 AM"
  durationMinutes: number;
  busType: 'Lalpari' | 'Asiad' | 'Shivshahi' | 'Ordinary';
  busTypeMarathi: string;
  depot: string;
  depotMarathi: string;
  fareGeneral: number;
  fareMahila: number; // 50% under Mahila Samman Yojana
  fareSenior: number; // 0 for 75+ (Amrut), 50% for 65+
  frequency: 'Daily' | 'Except Sunday' | 'Market Days (Sun/Wed)';
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
  vehicleType: 'Auto Rickshaw' | 'Maxi Cab / 4-Wheeler' | 'Eco Van';
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

export const BUS_SCHEDULES: BusSchedule[] = [
  // Morning Buses to Pauni & Bhandara
  {
    id: 'bus-01',
    busNumber: 'MH40-Y-5412',
    source: 'Asgaon',
    destination: 'Pauni',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'पवनी',
    via: ['Asgaon Phata', 'Kondha', 'Pauni Bus Stand'],
    viaMarathi: ['आसगाव फाटा', 'कोंढा', 'पवनी बस स्थानक'],
    departureTime: '06:45 AM',
    departureTime24: '06:45',
    approxArrivalTime: '07:20 AM',
    durationMinutes: 35,
    busType: 'Lalpari',
    busTypeMarathi: 'साधी लालपरी',
    depot: 'Pauni Depot',
    depotMarathi: 'पवनी आगार',
    fareGeneral: 20,
    fareMahila: 10,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज',
    boardingPointAtAsgaon: 'Asgaon Gram Panchayat Chowk',
    boardingPointMarathi: 'आसगाव ग्रामपंचायत चौक',
    isPopular: true
  },
  {
    id: 'bus-02',
    busNumber: 'MH36-AA-1209',
    source: 'Asgaon',
    destination: 'Bhandara',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'भंडारा',
    via: ['Kondha Phata', 'Pauni Bypass', 'Bela', 'Kardi', 'Bhandara ST Stand'],
    viaMarathi: ['कोंढा फाटा', 'पवनी बायपास', 'बेला', 'कार्डी', 'भंडारा बस स्थानक'],
    departureTime: '07:15 AM',
    departureTime24: '07:15',
    approxArrivalTime: '08:30 AM',
    durationMinutes: 75,
    busType: 'Lalpari',
    busTypeMarathi: 'साधी लालपरी',
    depot: 'Bhandara Depot',
    depotMarathi: 'भंडारा आगार',
    fareGeneral: 50,
    fareMahila: 25,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज (शाळा/कॉलेज विशेष)',
    boardingPointAtAsgaon: 'Asgaon Bus Stand',
    boardingPointMarathi: 'आसगाव मुख्य बस स्थानक',
    isPopular: true
  },
  {
    id: 'bus-03',
    busNumber: 'MH40-AQ-8840',
    source: 'Asgaon',
    destination: 'Nagpur',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'नागपूर (गणेशपेठ)',
    via: ['Pauni Stand', 'Umred', 'Dighori', 'Nagpur Ganeshpeth'],
    viaMarathi: ['पवनी स्थानक', 'उमरेड', 'दिघोरी', 'नागपूर गणेशपेठ'],
    departureTime: '08:00 AM',
    departureTime24: '08:00',
    approxArrivalTime: '10:30 AM',
    durationMinutes: 150,
    busType: 'Asiad',
    busTypeMarathi: 'निमआराम (Asian/Express)',
    depot: 'Pauni Depot',
    depotMarathi: 'पवनी आगार',
    fareGeneral: 135,
    fareMahila: 68,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज',
    boardingPointAtAsgaon: 'Asgaon Phata',
    boardingPointMarathi: 'आसगाव फाटा',
    isPopular: true
  },
  {
    id: 'bus-04',
    busNumber: 'MH36-F-7744',
    source: 'Asgaon',
    destination: 'Sakoli',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'साकोली',
    via: ['Pauni', 'Lakhandur', 'Sakoli Stand'],
    viaMarathi: ['पवनी', 'लाखांदूर', 'साकोली बस स्थानक'],
    departureTime: '09:00 AM',
    departureTime24: '09:00',
    approxArrivalTime: '10:45 AM',
    durationMinutes: 105,
    busType: 'Lalpari',
    busTypeMarathi: 'साधी लालपरी',
    depot: 'Sakoli Depot',
    depotMarathi: 'साकोली आगार',
    fareGeneral: 65,
    fareMahila: 33,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज',
    boardingPointAtAsgaon: 'Asgaon Bus Stand',
    boardingPointMarathi: 'आसगाव मुख्य बस स्थानक'
  },
  {
    id: 'bus-05',
    busNumber: 'MH40-Y-6621',
    source: 'Asgaon',
    destination: 'Pauni',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'पवनी (कोर्ट/तहसील)',
    via: ['Asgaon Phata', 'Nilaj', 'Pauni Court'],
    viaMarathi: ['आसगाव फाटा', 'निळाज', 'पवनी कोर्ट'],
    departureTime: '10:30 AM',
    departureTime24: '10:30',
    approxArrivalTime: '11:05 AM',
    durationMinutes: 35,
    busType: 'Ordinary',
    busTypeMarathi: 'स्थानिक फेरी',
    depot: 'Pauni Depot',
    depotMarathi: 'पवनी आगार',
    fareGeneral: 20,
    fareMahila: 10,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज (तहसील/बाजार फेरी)',
    boardingPointAtAsgaon: 'Asgaon Gram Panchayat Chowk',
    boardingPointMarathi: 'आसगाव ग्रामपंचायत चौक'
  },
  {
    id: 'bus-06',
    busNumber: 'MH36-AA-3321',
    source: 'Asgaon',
    destination: 'Bhandara',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'भंडारा',
    via: ['Pauni Bypass', 'Bela', 'Shahapur Phata', 'Bhandara ST Stand'],
    viaMarathi: ['पवनी बायपास', 'बेला', 'शहापूर फाटा', 'भंडारा बस स्थानक'],
    departureTime: '12:15 PM',
    departureTime24: '12:15',
    approxArrivalTime: '01:30 PM',
    durationMinutes: 75,
    busType: 'Lalpari',
    busTypeMarathi: 'साधी लालपरी',
    depot: 'Bhandara Depot',
    depotMarathi: 'भंडारा आगार',
    fareGeneral: 50,
    fareMahila: 25,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज',
    boardingPointAtAsgaon: 'Asgaon Bus Stand',
    boardingPointMarathi: 'आसगाव मुख्य बस स्थानक'
  },
  {
    id: 'bus-07',
    busNumber: 'MH40-AQ-9011',
    source: 'Asgaon',
    destination: 'Nagpur',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'नागपूर (गणेशपेठ)',
    via: ['Pauni', 'Umred', 'Nagpur Ganeshpeth'],
    viaMarathi: ['पवनी', 'उमरेड', 'नागपूर गणेशपेठ'],
    departureTime: '02:00 PM',
    departureTime24: '14:00',
    approxArrivalTime: '04:30 PM',
    durationMinutes: 150,
    busType: 'Lalpari',
    busTypeMarathi: 'साधी लालपरी',
    depot: 'Pauni Depot',
    depotMarathi: 'पवनी आगार',
    fareGeneral: 115,
    fareMahila: 58,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज',
    boardingPointAtAsgaon: 'Asgaon Phata',
    boardingPointMarathi: 'आसगाव फाटा',
    isPopular: true
  },
  {
    id: 'bus-08',
    busNumber: 'MH36-AA-5582',
    source: 'Asgaon',
    destination: 'Bramhapuri',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'ब्रह्मपुरी',
    via: ['Pauni', 'Lakhandur', 'Vadsa Phata', 'Bramhapuri Stand'],
    viaMarathi: ['पवनी', 'लाखांदूर', 'वडसा फाटा', 'ब्रह्मपुरी बस स्थानक'],
    departureTime: '03:45 PM',
    departureTime24: '15:45',
    approxArrivalTime: '05:40 PM',
    durationMinutes: 115,
    busType: 'Lalpari',
    busTypeMarathi: 'साधी लालपरी',
    depot: 'Bramhapuri Depot',
    depotMarathi: 'ब्रह्मपुरी आगार',
    fareGeneral: 75,
    fareMahila: 38,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज',
    boardingPointAtAsgaon: 'Asgaon Bus Stand',
    boardingPointMarathi: 'आसगाव मुख्य बस स्थानक'
  },
  {
    id: 'bus-09',
    busNumber: 'MH40-Y-4190',
    source: 'Asgaon',
    destination: 'Pauni',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'पवनी',
    via: ['Asgaon Phata', 'Kondha', 'Pauni Stand'],
    viaMarathi: ['आसगाव फाटा', 'कोंढा', 'पवनी स्थानक'],
    departureTime: '05:15 PM',
    departureTime24: '17:15',
    approxArrivalTime: '05:50 PM',
    durationMinutes: 35,
    busType: 'Ordinary',
    busTypeMarathi: 'सायंकालीन लोकल',
    depot: 'Pauni Depot',
    depotMarathi: 'पवनी आगार',
    fareGeneral: 20,
    fareMahila: 10,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज (सायंकालीन फेरी)',
    boardingPointAtAsgaon: 'Asgaon Gram Panchayat Chowk',
    boardingPointMarathi: 'आसगाव ग्रामपंचायत चौक',
    isPopular: true
  },
  {
    id: 'bus-10',
    busNumber: 'MH36-F-8119',
    source: 'Asgaon',
    destination: 'Bhandara',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'भंडारा',
    via: ['Pauni Bypass', 'Bela', 'Bhandara Stand'],
    viaMarathi: ['पवनी बायपास', 'बेला', 'भंडारा स्थानक'],
    departureTime: '06:30 PM',
    departureTime24: '18:30',
    approxArrivalTime: '07:45 PM',
    durationMinutes: 75,
    busType: 'Lalpari',
    busTypeMarathi: 'साधी लालपरी',
    depot: 'Bhandara Depot',
    depotMarathi: 'भंडारा आगार',
    fareGeneral: 50,
    fareMahila: 25,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज',
    boardingPointAtAsgaon: 'Asgaon Bus Stand',
    boardingPointMarathi: 'आसगाव मुख्य बस स्थानक'
  },
  {
    id: 'bus-11',
    busNumber: 'MH40-Y-9912',
    source: 'Asgaon',
    destination: 'Nagpur',
    sourceMarathi: 'आसगाव',
    destinationMarathi: 'नागपूर (रात्रीची बस)',
    via: ['Pauni Stand', 'Umred', 'Nagpur Ganeshpeth'],
    viaMarathi: ['पवनी स्थानक', 'उमरेड', 'नागपूर गणेशपेठ'],
    departureTime: '08:15 PM',
    departureTime24: '20:15',
    approxArrivalTime: '10:45 PM',
    durationMinutes: 150,
    busType: 'Shivshahi',
    busTypeMarathi: 'शिवशाही (AC / आरामशीर)',
    depot: 'Pauni Depot',
    depotMarathi: 'पवनी आगार',
    fareGeneral: 180,
    fareMahila: 90,
    fareSenior: 90,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज (रात्रीची फेरी)',
    boardingPointAtAsgaon: 'Asgaon Phata',
    boardingPointMarathi: 'आसगाव फाटा',
    isPopular: true
  },

  // Incoming Buses Returning to Asgaon
  {
    id: 'bus-in-01',
    busNumber: 'MH40-Y-2211',
    source: 'Pauni',
    destination: 'Asgaon',
    sourceMarathi: 'पवनी',
    destinationMarathi: 'आसगाव (आगमन)',
    via: ['Pauni Stand', 'Kondha', 'Asgaon Phata'],
    viaMarathi: ['पवनी स्थानक', 'कोंढा', 'आसगाव फाटा'],
    departureTime: '08:15 AM',
    departureTime24: '08:15',
    approxArrivalTime: '08:50 AM',
    durationMinutes: 35,
    busType: 'Ordinary',
    busTypeMarathi: 'स्थानिक फेरी',
    depot: 'Pauni Depot',
    depotMarathi: 'पवनी आगार',
    fareGeneral: 20,
    fareMahila: 10,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज',
    boardingPointAtAsgaon: 'Pauni Stand Platform 3',
    boardingPointMarathi: 'पवनी बस स्थानक फलाट ३'
  },
  {
    id: 'bus-in-02',
    busNumber: 'MH36-AA-6523',
    source: 'Bhandara',
    destination: 'Asgaon',
    sourceMarathi: 'भंडारा',
    destinationMarathi: 'आसगाव (आगमन)',
    via: ['Bhandara ST Stand', 'Bela', 'Pauni Bypass', 'Asgaon'],
    viaMarathi: ['भंडारा स्थानक', 'बेला', 'पवनी बायपास', 'आसगाव'],
    departureTime: '01:30 PM',
    departureTime24: '13:30',
    approxArrivalTime: '02:45 PM',
    durationMinutes: 75,
    busType: 'Lalpari',
    busTypeMarathi: 'साधी लालपरी',
    depot: 'Bhandara Depot',
    depotMarathi: 'भंडारा आगार',
    fareGeneral: 50,
    fareMahila: 25,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज',
    boardingPointAtAsgaon: 'Bhandara ST Stand Platform 4',
    boardingPointMarathi: 'भंडारा बस स्थानक फलाट ४'
  },
  {
    id: 'bus-in-03',
    busNumber: 'MH40-AQ-9811',
    source: 'Nagpur',
    destination: 'Asgaon',
    sourceMarathi: 'नागपूर (गणेशपेठ)',
    destinationMarathi: 'आसगाव (आगमन)',
    via: ['Nagpur Ganeshpeth', 'Umred', 'Pauni Stand', 'Asgaon'],
    viaMarathi: ['नागपूर गणेशपेठ', 'उमरेड', 'पवनी स्थानक', 'आसगाव'],
    departureTime: '04:30 PM',
    departureTime24: '16:30',
    approxArrivalTime: '07:00 PM',
    durationMinutes: 150,
    busType: 'Asiad',
    busTypeMarathi: 'निमआराम',
    depot: 'Pauni Depot',
    depotMarathi: 'पवनी आगार',
    fareGeneral: 135,
    fareMahila: 68,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज',
    boardingPointAtAsgaon: 'Nagpur Ganeshpeth Stand',
    boardingPointMarathi: 'नागपूर गणेशपेठ बस स्थानक',
    isPopular: true
  },
  {
    id: 'bus-in-04',
    busNumber: 'MH40-Y-7732',
    source: 'Pauni',
    destination: 'Asgaon',
    sourceMarathi: 'पवनी',
    destinationMarathi: 'आसगाव (रात्रीची शेवटची फेरी)',
    via: ['Pauni Bus Stand', 'Kondha', 'Asgaon Chowk'],
    viaMarathi: ['पवनी बस स्थानक', 'कोंढा', 'आसगाव चौक'],
    departureTime: '07:30 PM',
    departureTime24: '19:30',
    approxArrivalTime: '08:05 PM',
    durationMinutes: 35,
    busType: 'Lalpari',
    busTypeMarathi: 'साधी लालपरी',
    depot: 'Pauni Depot',
    depotMarathi: 'पवनी आगार',
    fareGeneral: 20,
    fareMahila: 10,
    fareSenior: 0,
    frequency: 'Daily',
    frequencyMarathi: 'दररोज',
    boardingPointAtAsgaon: 'Pauni Stand Platform 2',
    boardingPointMarathi: 'पवनी बस स्थानक फलाट २',
    isPopular: true
  }
];

export const AUTO_DRIVERS: AutoDriver[] = [
  {
    id: 'auto-01',
    name: 'Sanjay Meshram',
    nameMarathi: 'संजय मेश्राम',
    vehicleNumber: 'MH36-V-4182',
    vehicleType: 'Auto Rickshaw',
    phone: '+919822341029',
    standLocation: 'Asgaon Main Bus Stand Chowk',
    standLocationMarathi: 'आसगाव मुख्य बस स्टँड चौक',
    primaryRoute: 'Asgaon ⇄ Pauni (Shared / Special)',
    primaryRouteMarathi: 'आसगाव ⇄ पवनी (शेअरिंग किंवा स्पेशल)',
    estimatedFare: '₹30 प्रति सीट (शेअरिंग) / ₹180 (स्पेशल)',
    isAvailable: true
  },
  {
    id: 'auto-02',
    name: 'Rameshwar Wankhede',
    nameMarathi: 'रामेश्वर वानखेडे',
    vehicleNumber: 'MH36-E-9041',
    vehicleType: 'Auto Rickshaw',
    phone: '+919423871142',
    standLocation: 'Gram Panchayat Office Stop',
    standLocationMarathi: 'ग्रामपंचायत कार्यालय थांबा',
    primaryRoute: 'Asgaon ⇄ Kondha Phata & Pauni',
    primaryRouteMarathi: 'आसगाव ⇄ कोंढा फाटा व पवनी',
    estimatedFare: '₹30 प्रति सीट / ₹170 स्पेशल',
    isAvailable: true
  },
  {
    id: 'auto-03',
    name: 'Pravin Tembhurne (Eco Van)',
    nameMarathi: 'प्रविण टेंभुर्णे (इको व्हॅन)',
    vehicleNumber: 'MH36-AC-3105',
    vehicleType: 'Eco Van',
    phone: '+919921456201',
    standLocation: 'Weekly Bazaar Square',
    standLocationMarathi: 'आठवडी बाजार चौक, आसगाव',
    primaryRoute: 'Asgaon ⇄ Bhandara / Nagpur (Special Booking)',
    primaryRouteMarathi: 'आसगाव ⇄ भंडारा / नागपूर (फॅमिली व लग्न स्पेशल)',
    estimatedFare: '₹12 प्रति कि.मी. (स्पेशल गाडी)',
    isAvailable: true
  },
  {
    id: 'auto-04',
    name: 'Vilas Bhoyar',
    nameMarathi: 'विलास भोयर',
    vehicleNumber: 'MH36-T-8871',
    vehicleType: 'Auto Rickshaw',
    phone: '+919765431890',
    standLocation: 'Asgaon Phata',
    standLocationMarathi: 'आसगाव फाटा',
    primaryRoute: 'Asgaon ⇄ Pauni Court & Rural Hospital',
    primaryRouteMarathi: 'आसगाव ⇄ पवनी कोर्ट व ग्रामीण रुग्णालय',
    estimatedFare: '₹30 प्रति सीट (शेअरिंग)',
    isAvailable: true
  }
];

export const DEPOT_CONTACTS: DepotContact[] = [
  {
    depotName: 'Pauni MSRTC Bus Depot',
    depotNameMarathi: 'पवनी एसटी बस आगार',
    phone: '07185-255342',
    controllerDesk: '07185-255342',
    address: 'Near Pauni Fort, Old ST Stand Road, Pauni, Dist. Bhandara 441910',
    addressMarathi: 'पवनी किल्ला परिसर, जुना एसटी स्टँड रोड, पवनी, जि. भंडारा ४४१९१०',
    distanceFromAsgaon: '१४ कि.मी.'
  },
  {
    depotName: 'Bhandara Central MSRTC Depot',
    depotNameMarathi: 'भंडारा मध्यवर्ती एसटी आगार',
    phone: '07184-252431',
    controllerDesk: '07184-252432',
    address: 'National Highway 53, Bus Stand Complex, Bhandara 441904',
    addressMarathi: 'राष्ट्रीय महामार्ग ५३, बस स्थानक परिसर, भंडारा ४४१९०४',
    distanceFromAsgaon: '३६ कि.मी.'
  },
  {
    depotName: 'MSRTC Maharashtra State Helpline',
    depotNameMarathi: 'एसटी महामंडळ २४×७ मदत केंद्र (टोल फ्री)',
    phone: '1800-22-1250',
    controllerDesk: '022-23075252',
    address: 'Maharashtra State Road Transport Corp, Central Office, Mumbai',
    addressMarathi: 'महाराष्ट्र राज्य मार्ग परिवहन महामंडळ, मध्यवर्ती कार्यालय, मुंबई',
    distanceFromAsgaon: 'राज्यस्तरीय'
  }
];

export const MSRTC_CONCESSIONS = [
  {
    title: 'महिला सन्मान योजना (Mahila Samman Yojana)',
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
