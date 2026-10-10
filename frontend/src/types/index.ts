export interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryId: number;
  description: string;
  address: string;
  landmark: string;
  phone: string;
  whatsapp: string;
  openingHours: string;
  imageUrl: string;
  isVerified: boolean;
  verificationBadge: string;
  rating: number;
  ratingCount: number;
  distanceKm?: string;
  latitude?: number;
  longitude?: number;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  employerName: string;
  employmentType: 'Daily Wage' | 'Full-Time Staff' | 'Contract / Technical' | 'Part-Time';
  salaryRange: string;
  location: string;
  description: string;
  requirements: string;
  contactPhone: string;
  status: 'ACTIVE' | 'FILLED' | 'EXPIRED';
  postedAgo: string;
  expiresAt: string;
}

export interface Scheme {
  id: string;
  title: string;
  slug: string;
  category: 'Farmer' | 'Student' | 'Solar' | 'Women' | 'Health' | 'Housing' | string;
  sponsoringAgency: string;
  deadlineText: string;
  description: string;
  benefits: string;
  eligibility: string;
  documentsRequired: string[];
  officialUrl: string;
  actionLabel: string;
  badgeText?: string;
}

export interface MandiPrice {
  id: number;
  commodityName: string;
  variety: string;
  marketName: string;
  modalPrice: number;
  unit: string;
  priceChange: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Grievance {
  id: string;
  trackingNumber: string;
  category: string;
  title: string;
  description: string;
  wardOrArea: string;
  contactPhone: string;
  status: 'RESOLVED' | 'IN_PROGRESS' | 'SUBMITTED';
  statusBadge: string;
  reportedBy: string;
  progressPercent: number;
  actionTimeline: string;
  isVerifiedClosed?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  role: 'CITIZEN' | 'FARMER' | 'STUDENT' | 'BUSINESS_OWNER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';
  village: string;
  token?: string;
}

export interface VillageContact {
  id: string;
  name: string;
  designation: string;
  phone: string;
  category: 'Administration' | 'Water & Power' | 'Health & Anganwadi' | 'Agriculture' | 'Police & Security';
  officeHours: string;
  address?: string;
}

export interface WaterScheduleItem {
  id: string;
  ward: string;
  morningTime: string;
  eveningTime: string;
  status: 'NORMAL' | 'LOW_PRESSURE' | 'MAINTENANCE' | 'OFF';
  tankLevelPercent: number;
  notes: string;
}

export interface VillageProject {
  id: string;
  title: string;
  category: 'Road & Transport' | 'Water & Sanitation' | 'Education' | 'Electricity & Solar' | 'Community Hall';
  sanctionedAmount: string;
  fundSource: string;
  executingAgency: string;
  progressPercent: number;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';
  targetDate: string;
}

export interface HeroSlide {
  id: string;
  type: 'welcome' | 'custom';
  imageUrl?: string;
  showTextOverlay: boolean;
  titleMarathi?: string;
  titleEnglish?: string;
  subtitleMarathi?: string;
  subtitleEnglish?: string;
  badgeMarathi?: string;
  badgeEnglish?: string;
  ctaTextMarathi?: string;
  ctaTextEnglish?: string;
  ctaLink?: string;
  isActive: boolean;
  order: number;
}
