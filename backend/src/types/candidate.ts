export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cvFile?: Buffer;
  cvFileName?: string;
  cvFileType?: string;
  createdAt: Date;
  updatedAt: Date;
  education?: Education[];
  experience?: Experience[];
}

export interface CandidateCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface CandidateUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Education {
  id: number;
  candidateId: number;
  title: string;
  institution: string;
  year: number;
  level: string;
}

export interface EducationCreate {
  title: string;
  institution: string;
  year: number;
  level: string;
}

export interface Experience {
  id: number;
  candidateId: number;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date | null;
  description: string;
}

export interface ExperienceCreate {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date | null;
  description: string;
}

export interface CandidateWithRelations extends Candidate {
  education: Education[];
  experience: Experience[];
} 