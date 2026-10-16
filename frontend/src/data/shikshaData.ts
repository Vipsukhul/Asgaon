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
  latitude?: number;
  longitude?: number;
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

export const DEFAULT_SCHOOLS: SchoolItem[] = [];

export const DEFAULT_SCHOLARSHIPS: ScholarshipItem[] = [];

export const DEFAULT_ABHYASIKA: AbhyasikaConfig = {
  title: 'Dr. APJ Abdul Kalam Gram Panchayat Abhyasika',
  totalDesks: 40,
  availableDesks: 14,
  timings: '06:00 AM – 11:00 PM',
  caretakerName: 'Shri. Nilkanth Meshram',
  caretakerRole: 'Gram Panchayat Library In-Charge',
  wifiSpeed: '100 Mbps BSNL Optical Fiber',
  bookCount: '3,200+ Books & MPSC/UPSC Journals',
  noticeText: 'Free entry for all Asgaon students with smart card. Silence strictly observed in cubicles.',
};

export const DEFAULT_TUTORS: TutorCenterItem[] = [];

