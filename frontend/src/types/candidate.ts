export interface Education {
  id?: number;
  degree: string;
  institution: string;
  graduationYear: number;
  level: 'high_school' | 'bachelor' | 'master' | 'phd' | 'certification' | 'other';
}

export interface Experience {
  id?: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrentPosition?: boolean;
}

export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: Education[];
  experience: Experience[];
  cvFile?: File;
  createdAt?: string;
  updatedAt?: string;
}

export interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: Education[];
  experience: Experience[];
  cvFile?: File;
}

export interface CandidateListResponse {
  candidates: Candidate[];
  total: number;
  page: number;
  limit: number;
} 