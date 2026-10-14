import type { VillageContact, WaterScheduleItem, VillageProject } from '../types';

/**
 * Official Asgaon Gram Panchayat Administrative Directory & Public Utility Schedules
 */

export const VILLAGE_CONTACTS: VillageContact[] = [
  {
    id: 'vc1',
    name: 'श्री. एस. एन. जाधव',
    designation: 'ग्रामसेवक',
    phone: '9822104501',
    category: 'Administration',
    officeHours: 'सकाळी १० ते दुपारी २ (सोमवार ते शुक्रवार)',
    address: 'ग्रामपंचायत कार्यालय, आसगाव'
  },
  {
    id: 'vc2',
    name: 'सौ. सरिताताई पाटील',
    designation: 'सरपंच',
    phone: '9822104502',
    category: 'Administration',
    officeHours: 'सकाळी ९ ते ११ व दुपारी ४ ते ६',
    address: 'वॉर्ड २, मुख्य चौक, आसगाव'
  },
  {
    id: 'vc3',
    name: 'श्री. रमेश बोरकर',
    designation: 'तलाठी (महसूल विभाग)',
    phone: '9822104503',
    category: 'Administration',
    officeHours: 'मंगळवार व गुरुवार: सकाळी ११ ते दुपारी ३',
    address: 'सजा कार्यालय, आसगाव'
  },
  {
    id: 'vc4',
    name: 'श्री. विष्णू कांबळे',
    designation: 'पाणी पुरवठा व्यवस्थापक',
    phone: '9822081100',
    category: 'Water & Power',
    officeHours: 'सकाळी ६ ते १० व संध्याकाळी ४ ते ८',
    address: 'मुख्य जलकुंभ, आसगाव'
  },
  {
    id: 'vc5',
    name: 'श्री. गजानन म्हात्रे',
    designation: 'महावितरण वायरमन',
    phone: '9422998877',
    category: 'Water & Power',
    officeHours: '२४ तास ऑन-कॉल (आपत्कालीन वीज सेवा)',
    address: 'महावितरण सब-स्टेशन, पवनी रोड'
  },
  {
    id: 'vc6',
    name: 'डॉ. स्नेहल झाळके',
    designation: 'वैद्यकीय अधिकारी (प्रा. आ. केंद्र)',
    phone: '9422001102',
    category: 'Health & Anganwadi',
    officeHours: 'सकाळी १० ते २ व संध्याकाळी ५ ते ९',
    address: 'प्राथमिक आरोग्य केंद्र, शाळा शेजारी'
  },
  {
    id: 'vc7',
    name: 'सौ. छायाबाई वाघमारे',
    designation: 'आशा स्वयंसेविका',
    phone: '9765432111',
    category: 'Health & Anganwadi',
    officeHours: 'सकाळी ९ ते दुपारी ३',
    address: 'वॉर्ड १, आसगाव'
  },
  {
    id: 'vc8',
    name: 'श्री. नितीन देशमुख',
    designation: 'कृषी सहाय्यक',
    phone: '9822334455',
    category: 'Agriculture',
    officeHours: 'सोमवार व बुधवार: सकाळी १० ते दुपारी २',
    address: 'कृषी सेवा केंद्र शेजारी'
  }
];

export const WATER_SCHEDULE: WaterScheduleItem[] = [
  {
    id: 'ws1',
    ward: 'वॉर्ड क्र. १ (बाजार पेठ व विठ्ठल मंदिर परिसर)',
    morningTime: '०६:३० AM - ०८:०० AM',
    eveningTime: '०५:३० PM - ०६:३० PM',
    status: 'NORMAL',
    tankLevelPercent: 85,
    notes: 'नियमित सुरळीत पाणीपुरवठा चालू आहे'
  },
  {
    id: 'ws2',
    ward: 'वॉर्ड क्र. २ (गावठाण व शाळा परिसर)',
    morningTime: '०८:०० AM - ०९:३० AM',
    eveningTime: '०६:३० PM - ०७:३० PM',
    status: 'NORMAL',
    tankLevelPercent: 85,
    notes: 'सर्व नळांना चांगला दाब उपलब्ध'
  },
  {
    id: 'ws3',
    ward: 'वॉर्ड क्र. ३ (हनुमान नगर व पूर्व वस्ती)',
    morningTime: '०६:०० AM - ०७:३० AM',
    eveningTime: '०५:०० PM - ०६:०० PM',
    status: 'LOW_PRESSURE',
    tankLevelPercent: 60,
    notes: 'मुख्य व्हॉल्व्ह तपासणी चालू असल्याने मध्यम दाब'
  },
  {
    id: 'ws4',
    ward: 'वॉर्ड क्र. ४ (नवीन कॉलनी व शेतवस्ती)',
    morningTime: '०९:३० AM - ११:०० AM',
    eveningTime: '०७:३० PM - ०८:३० PM',
    status: 'NORMAL',
    tankLevelPercent: 85,
    notes: 'टँकर राखीव व्यवस्था उपलब्ध (संपर्क: ९८२२०८११००)'
  }
];

export const VILLAGE_PROJECTS: VillageProject[] = [
  {
    id: 'vp1',
    title: 'मुख्य बाजार रस्ता सिमेंट काँक्रीटीकरण',
    category: 'Road & Transport',
    sanctionedAmount: '₹१२,५०,०००',
    fundSource: '१५ वा वित्त आयोग',
    executingAgency: 'ग्रामपंचायत आसगाव',
    progressPercent: 75,
    status: 'IN_PROGRESS',
    targetDate: '१५ नोव्हेंबर २०२६'
  },
  {
    id: 'vp2',
    title: 'भूमिगत गटार लाईन व सांडपाणी व्यवस्थापन प्रकल्प',
    category: 'Water & Sanitation',
    sanctionedAmount: '₹८,००,०००',
    fundSource: 'स्वच्छ भारत मिशन (ग्रामीण)',
    executingAgency: 'जि. प. बांधकाम विभाग',
    progressPercent: 40,
    status: 'IN_PROGRESS',
    targetDate: '३० डिसेंबर २०२६'
  },
  {
    id: 'vp3',
    title: 'गावातील सर्व मुख्य चौकात २० सोलर हायमास्ट दिवे',
    category: 'Electricity & Solar',
    sanctionedAmount: '₹४,२०,०००',
    fundSource: 'जिल्हा नियोजन निधी',
    executingAgency: 'महाऊर्जा अधिकृत कंत्राटदार',
    progressPercent: 100,
    status: 'COMPLETED',
    targetDate: 'पूर्ण झाले'
  },
  {
    id: 'vp4',
    title: 'जि. प. प्राथमिक शाळा डिजिटल वर्गखोल्या व रंगरंगोटी',
    category: 'Education',
    sanctionedAmount: '₹२,८०,०००',
    fundSource: 'समग्र शिक्षा अभियान व ग्राम निधी',
    executingAgency: 'शाळा व्यवस्थापन समिती',
    progressPercent: 100,
    status: 'COMPLETED',
    targetDate: 'पूर्ण झाले'
  }
];
