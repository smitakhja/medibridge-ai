// Core TypeScript types for MediBridge AI

export type Role = 'user' | 'doctor' | 'admin';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'urgent';
export type ActionType = 'self-care' | 'routine' | 'doctor' | 'emergency';
export type Language = 'en' | 'hi' | 'gu' | 'mr' | 'bn' | 'ta' | 'te';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  age?: number;
  gender?: string;
  phone?: string;
  language?: Language;
  avatar?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface HealthAssessment {
  _id: string;
  userId: string;
  symptoms: string[];
  symptomsText?: string;
  lifestyle?: Lifestyle;
  medicalHistory?: MedicalHistory;
  basicInfo?: BasicInfo;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendations: Recommendations;
  aiSummary?: string;
  followUpDate?: string;
  createdAt: string;
}

export interface Recommendations {
  action: ActionType;
  specialty?: string;
  warningSigns: string[];
  possibleRiskFactors: string[];
  doctorQuestions: string[];
  homecareTips: string[];
  lifestyleTips: string[];
}

export interface Lifestyle {
  diet?: 'excellent' | 'good' | 'fair' | 'poor';
  sleep?: number;
  exercise?: 'daily' | 'weekly' | 'rarely' | 'never';
  smoking?: boolean;
  alcohol?: 'none' | 'occasional' | 'moderate' | 'heavy';
  stressLevel?: number;
}

export interface MedicalHistory {
  existingConditions?: string[];
  previousSurgeries?: string[];
  allergies?: string[];
  currentMedications?: string[];
  familyHistory?: string[];
}

export interface BasicInfo {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
}

export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  experience?: number;
  rating?: number;
  reviewCount?: number;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
  };
  isAvailableNow?: boolean;
  consultationType?: string[];
  hospital?: string;
  fee?: number;
  languages?: string[];
  photo?: string | null;
  bio?: string;
}

export interface HealthcareFacility {
  _id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'diagnostic';
  address?: string;
  city?: string;
  phone?: string;
  location: { lat: number; lng: number };
  isOpen24h: boolean;
  hasEmergency: boolean;
  rating?: number;
  distance?: number;
  openHours?: string;
  specialties?: string[];
  beds?: number;
}

export interface MedicalReport {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl?: string;
  fileType?: string;
  status: 'uploaded' | 'processing' | 'analyzed' | 'failed';
  extractedData?: ReportEntry[];
  aiSummary?: string;
  abnormalValues?: AbnormalValue[];
  reportDate?: string;
  labName?: string;
  createdAt: string;
}

export interface ReportEntry {
  testName: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  status: 'normal' | 'low' | 'high' | 'critical';
}

export interface AbnormalValue {
  testName: string;
  result: string;
  referenceRange?: string;
  explanation?: string;
}

export interface Appointment {
  _id: string;
  userId: string;
  doctorId: string | Doctor;
  date: string;
  time?: string;
  type: 'in-person' | 'online';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason?: string;
  notes?: string;
  doctorNotes?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface DashboardData {
  riskScore: number;
  riskLevel: RiskLevel;
  totalChecks: number;
  upcomingAppointments: Appointment[];
  recentAssessments: HealthAssessment[];
  recentReports: MedicalReport[];
  healthMetrics: {
    heartRate: number[];
    sleepHours: number[];
    steps: number[];
    weight: number[];
    systolic: number[];
    diastolic: number[];
  };
}
