import apiService from './api';
import { Candidate, CandidateFormData, CandidateListResponse } from '../types/candidate';
import { notification } from 'antd';

class CandidateService {
  async getCandidates(page: number = 1, limit: number = 10, search?: string): Promise<CandidateListResponse> {
    try {
      const params: any = { page, limit };
      if (search) {
        params.search = search;
      }
      
      const response = await apiService.get<{ success: boolean; data: CandidateListResponse }>('/candidates', params);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getCandidate(id: number): Promise<Candidate> {
    try {
      const response = await apiService.get<{ success: boolean; data: Candidate }>(`/candidates/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async createCandidate(candidateData: CandidateFormData): Promise<Candidate> {
    try {
      // Prepare JSON payload for basic candidate data
      const candidatePayload = {
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
        phone: candidateData.phone,
        address: candidateData.address,
      };
      
      // Create candidate with basic info
      const response = await apiService.post<{ success: boolean; data: Candidate }>('/candidates', candidatePayload);
      const candidate = response.data.data;
      
      // If CV file is present, upload it separately
      if (candidateData.cvFile) {
        await this.uploadCV(candidate.id!, candidateData.cvFile);
      }
      
      // If education data is present, add it separately
      if (candidateData.education && candidateData.education.length > 0) {
        for (const education of candidateData.education) {
          // Map frontend field names to backend field names
          const educationPayload = {
            title: education.degree,
            institution: education.institution,
            year: education.graduationYear,
            level: education.level,
          };
          await apiService.post(`/candidates/${candidate.id}/education`, educationPayload);
        }
      }
      
      // If experience data is present, add it separately
      if (candidateData.experience && candidateData.experience.length > 0) {
        for (const experience of candidateData.experience) {
          // Map frontend field names to backend field names and handle date conversion
          const experiencePayload = {
            company: experience.company,
            position: experience.position,
            startDate: new Date(experience.startDate),
            endDate: experience.isCurrentPosition ? null : (experience.endDate ? new Date(experience.endDate) : null),
            description: experience.description,
          };
          await apiService.post(`/candidates/${candidate.id}/experience`, experiencePayload);
        }
      }
      
      notification.success({
        message: 'Candidate Created',
        description: `${candidateData.firstName} ${candidateData.lastName} has been successfully added to the system.`,
        duration: 4.5,
      });
      
      return candidate;
    } catch (error) {
      throw error;
    }
  }

  async updateCandidate(id: number, candidateData: Partial<CandidateFormData>): Promise<Candidate> {
    try {
      // Prepare JSON payload for basic candidate data
      const updatePayload: any = {};
      if (candidateData.firstName) updatePayload.firstName = candidateData.firstName;
      if (candidateData.lastName) updatePayload.lastName = candidateData.lastName;
      if (candidateData.email) updatePayload.email = candidateData.email;
      if (candidateData.phone) updatePayload.phone = candidateData.phone;
      if (candidateData.address) updatePayload.address = candidateData.address;
      
      // Update candidate with basic info
      const response = await apiService.put<{ success: boolean; data: Candidate }>(`/candidates/${id}`, updatePayload);
      const candidate = response.data.data;
      
      // If CV file is present, upload it separately
      if (candidateData.cvFile) {
        await this.uploadCV(id, candidateData.cvFile);
      }
      
      // Note: Education and experience updates would need separate endpoints
      // For now, we'll only handle basic info and CV updates
      
      notification.success({
        message: 'Candidate Updated',
        description: 'Candidate information has been successfully updated.',
        duration: 4.5,
      });
      
      return candidate;
    } catch (error) {
      throw error;
    }
  }

  async deleteCandidate(id: number): Promise<void> {
    try {
      await apiService.delete(`/candidates/${id}`);
      
      notification.success({
        message: 'Candidate Deleted',
        description: 'Candidate has been successfully removed from the system.',
        duration: 4.5,
      });
    } catch (error) {
      throw error;
    }
  }

  async uploadCV(id: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('cv', file);
    await apiService.upload(`/candidates/${id}/cv`, formData);
  }

  async downloadCV(id: number): Promise<Blob> {
    try {
      const response = await apiService.get(`/candidates/${id}/cv`, {
        responseType: 'blob',
      });
      return response.data as Blob;
    } catch (error) {
      throw error;
    }
  }

  async getCandidateStats(): Promise<{
    total: number;
    recent: number;
    byStatus: Record<string, number>;
  }> {
    try {
      const response = await apiService.get<{ success: boolean; data: any }>('/candidates/stats');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async searchCandidates(query: string): Promise<Candidate[]> {
    try {
      const response = await apiService.get<{ success: boolean; data: CandidateListResponse }>('/candidates', { search: query });
      return response.data.data.candidates;
    } catch (error) {
      throw error;
    }
  }
}

export const candidateService = new CandidateService();
export default candidateService; 