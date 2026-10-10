export interface SchoolItem {
  id: string;
  name: string;
  badge: string;
  category: string;
  grades: string;
  medium: string;
  description: string;
  tags: string[];
  principalName: string;
  contactPhone: string;
  address: string;
  imageUrl: string;
}

export interface ScholarshipItem {
  id: string;
  title: string;
  badge: string;
  deadline: string;
  description: string;
  benefit: string;
  incomeLimit: string;
  department: string;
  officialUrl: string;
  eligibility: string;
}

export interface AbhyasikaConfig {
  title: string;
  totalDesks: number;
  availableDesks: number;
  timings: string;
  caretakerName: string;
  caretakerRole: string;
  wifiSpeed: string;
  bookCount: string;
  noticeText: string;
}

export interface TutorCenterItem {
  id: string;
  name: string;
  category: string;
  subjects: string;
  timing: string;
  phone: string;
  address: string;
  feesInfo: string;
}

export interface ShikshaNotice {
  headline: string;
  subtext: string;
  actionLabel: string;
  isActive: boolean;
}

export interface DeskReservation {
  id: string;
  studentName: string;
  exam: string;
  timeSlot: string;
  phone: string;
  deskNumber: number;
  date: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

export const DEFAULT_SHIKSHA_NOTICE: ShikshaNotice = {
  headline: 'MahaDBT Update: Post-Matric & Pre-Matric verification deadline extended to 15 Nov',
  subtext: 'Free MPSC & UPSC study desks open at ZP Hall (40 Seats)',
  actionLabel: 'View Details',
  isActive: true,
};

export const DEFAULT_SCHOOLS: SchoolItem[] = [
  {
    id: 'sch-1',
    name: 'Zilla Parishad High School & Junior College, Asgaon',
    badge: 'Govt Approved',
    category: 'High School & Jr College',
    grades: '1st – 12th',
    medium: 'Marathi & Semi-English Medium',
    description: 'Co-educational • Marathi & Semi-English Medium • Arts, Science & Commerce Streams available.',
    tags: [
      'Total Enrollment: 642',
      'Mid-Day Meal: PM POSHAN',
      'Girls Free Bicycle Scheme',
      '94.2% Pass Percentage (10th/12th)'
    ],
    principalName: 'Shri. R. V. Gaikwad',
    contactPhone: '9422811204',
    address: 'Near Gram Panchayat Office, Asgaon',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sch-2',
    name: 'Saraswati Vidya Mandir Primary School',
    badge: 'Primary School',
    category: 'Primary School',
    grades: 'Balwadi to 7th Standard',
    medium: 'Marathi Medium',
    description: 'Child-centric foundational classes with dedicated Anganwadi connection, smart projector classroom, and eco-purified drinking water plant.',
    tags: [
      'Government Aided',
      'Smart Projector Classroom',
      'Nutritious Diet',
      'Sports & Yoga'
    ],
    principalName: 'Smt. S. P. Meshram',
    contactPhone: '9822104500',
    address: 'Tembhurne Ward No. 3, Near Old Talav, Asgaon',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sch-3',
    name: 'Govt Industrial Training Institute (ITI), Pauni',
    badge: 'Technical Government',
    category: 'Technical & ITI',
    grades: 'Post 10th (1 to 2 Years)',
    medium: 'Marathi / English Tech',
    description: 'Fitter, Electrician, Wireman, Welder, COPA (Computer Operator & Programming Assistant). In partnership with Nagpur MIDC & Balharshah.',
    tags: [
      'Centralized DVET Admissions',
      'Apprenticeship Linked',
      'Nagpur MIDC Tie-up',
      'Free Tools Kit'
    ],
    principalName: 'Principal ITI Pauni',
    contactPhone: '07185222019',
    address: 'Pauni Bypass Road, Pauni (2.8 km from Asgaon)',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sch-4',
    name: 'Dr. Babasaheb Ambedkar Social Welfare Hostel',
    badge: 'Social Welfare Hostel',
    category: 'Hostel & Lodging',
    grades: 'College & Degree Students',
    medium: 'Residential Facility',
    description: 'Free residential lodgings, balanced nutritious meals, and reading room for SC/ST/OBC college boys & girls enrolled in Pauni/Bhandara degree colleges.',
    tags: [
      'Capacity: 120 Beds',
      'Zero Fees for Eligible Wards',
      'Mess & Nutritious Meals',
      'In-house Study Library'
    ],
    principalName: 'Warden Shri. D. N. Kamble',
    contactPhone: '07185223300',
    address: 'Samaj Kalyan Sankul, Pauni Road',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
  },
];

export const DEFAULT_SCHOLARSHIPS: ScholarshipItem[] = [
  {
    id: 'sch-opt-1',
    title: 'MahaDBT Post-Matric Scholarship for SC/ST/VJNT/OBC/SBC',
    badge: 'POST-MATRIC (11th & Higher)',
    deadline: '15 Nov 2026',
    description: 'Provides comprehensive financial support for college fees, professional, and general university degree streams.',
    benefit: '100% Fee Waiver + ₹1,200/mo',
    incomeLimit: '≤ ₹2,50,000 / year',
    department: 'Social Justice & Tribal Dev',
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    eligibility: 'Aadhaar-seeded bank account, Caste Validity, Family Income Certificate',
  },
  {
    id: 'sch-opt-2',
    title: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti',
    badge: 'GENERAL / EWS (Open Category)',
    deadline: '30 Nov 2026',
    description: 'Reimbursement of tuition and exam fees for economically backward class students admitted to diploma, degree, and PG courses.',
    benefit: '50% Tuition Fee Reimbursement',
    incomeLimit: '≤ ₹8,00,000 / year',
    department: 'Higher & Technical Education',
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    eligibility: 'CAP round admission, Maharashtra domicile, Non-Creamy Layer / Income proof',
  },
  {
    id: 'sch-opt-3',
    title: 'Savitribai Phule Kanya Dattak Yojana & Stipend',
    badge: 'GIRLS EDUCATION ENCOURAGEMENT',
    deadline: 'Ongoing (Through School)',
    description: 'Special state incentive to prevent drop-outs of female students studying in Std 8th to 10th in rural Zilla Parishad schools.',
    benefit: '₹1,000 / year + Free Uniforms & Bicycle',
    incomeLimit: 'BPL / Single Parent Wards',
    department: 'School Education & Sports Dept',
    officialUrl: 'https://education.maharashtra.gov.in',
    eligibility: 'Girls enrolled in Zilla Parishad schools from Std 8 to 10',
  },
  {
    id: 'sch-opt-4',
    title: 'National Means-cum-Merit Scholarship (NMMS)',
    badge: 'MERIT BASED SCHOLARSHIP (EXAM)',
    deadline: 'December 2026 Assessment',
    description: 'Prestigious master-exam grants for academically gifted students clearing the state NMMS assessment in Class VIII.',
    benefit: '₹12,000 / year (till 12th Std)',
    incomeLimit: '≤ ₹3,50,000 / year',
    department: 'Ministry of Education (Govt of India)',
    officialUrl: 'https://scholarships.gov.in',
    eligibility: 'Class 8 students appearing for MAT & SAT state evaluation',
  },
];

export const DEFAULT_ABHYASIKA: AbhyasikaConfig = {
  title: 'Dr. APJ Abdul Kalam Gram Panchayat Abhyasika',
  totalDesks: 40,
  availableDesks: 14,
  timings: '06:00 AM – 11:00 PM (All 7 Days)',
  caretakerName: 'Shri. Nilkanth Meshram',
  caretakerRole: 'Gram Panchayat Office Peon & Library In-Charge',
  wifiSpeed: '100 Mbps BSNL Optical Fiber',
  bookCount: '3,200+ Books & Journals',
  noticeText: 'Free entry for all Asgaon students with smart card. Silence strictly observed in cubicles.',
};

export const DEFAULT_TUTORS: TutorCenterItem[] = [
  {
    id: 'tut-1',
    name: 'Dnyandeep Coaching Classes',
    category: 'Class 5th to 10th',
    subjects: 'Mathematics, Science, and English specialty. Weekly mock tests.',
    timing: '06:30 AM - 08:30 AM & 05:00 PM - 07:00 PM',
    phone: '9822100111',
    address: 'Near Pauni Bus Stand, Ward 2',
    feesInfo: '₹400 / month',
  },
  {
    id: 'tut-2',
    name: 'PM Kaushal Vikas Kendra (PMKVY)',
    category: '100% Govt Sponsored Skill',
    subjects: 'Solar Panel Technician, Tally Prime Financial Accounting, Electrician.',
    timing: '10:00 AM - 04:00 PM (Mon to Fri)',
    phone: '07185224410',
    address: 'Pauni Main Road, Near Tahsil Karyalaya',
    feesInfo: 'Free + Stipend Provided',
  },
  {
    id: 'tut-3',
    name: 'Spoken English & Coding Club',
    category: 'Youth Self Help',
    subjects: 'Every Saturday 2 hrs: Basic python coding, resume building & soft skills.',
    timing: 'Every Saturday 03:00 PM - 05:00 PM',
    phone: '9422811204',
    address: 'Conducted at ZP School Science Room',
    feesInfo: 'Free Community Initiative',
  },
];
