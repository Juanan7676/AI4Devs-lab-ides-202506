import { prisma } from '../config/database';
import { CandidateCreate, CandidateUpdate, CandidateWithRelations } from '../types/candidate';
import { createError } from '../middleware/errorHandler';
import { ERROR_MESSAGES } from '../utils/constants';
import { getPaginationParams, createPaginationResponse } from '../utils/helpers';

export class CandidateService {
  static async getAllCandidates(page: number = 1, limit: number = 10, search?: string) {
    const { offset } = getPaginationParams({ query: { page: page.toString(), limit: limit.toString() } } as any);

    const whereClause = search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where: whereClause,
        include: {
          education: true,
          experience: true
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.candidate.count({ where: whereClause })
    ]);

    return createPaginationResponse(candidates, total, page, limit);
  }

  static async getCandidateById(id: number): Promise<CandidateWithRelations> {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        education: true,
        experience: true
      }
    });

    if (!candidate) {
      throw createError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return candidate as CandidateWithRelations;
  }

  static async createCandidate(candidateData: CandidateCreate): Promise<CandidateWithRelations> {
    // Check if candidate with same email already exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email: candidateData.email }
    });

    if (existingCandidate) {
      throw createError(ERROR_MESSAGES.CANDIDATE_ALREADY_EXISTS, 409);
    }

    const candidate = await prisma.candidate.create({
      data: candidateData,
      include: {
        education: true,
        experience: true
      }
    });

    return candidate as CandidateWithRelations;
  }

  static async updateCandidate(id: number, updateData: CandidateUpdate): Promise<CandidateWithRelations> {
    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!existingCandidate) {
      throw createError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    // If email is being updated, check if it's already taken
    if (updateData.email && updateData.email !== existingCandidate.email) {
      const emailExists = await prisma.candidate.findUnique({
        where: { email: updateData.email }
      });

      if (emailExists) {
        throw createError(ERROR_MESSAGES.CANDIDATE_ALREADY_EXISTS, 409);
      }
    }

    const candidate = await prisma.candidate.update({
      where: { id },
      data: updateData,
      include: {
        education: true,
        experience: true
      }
    });

    return candidate as CandidateWithRelations;
  }

  static async deleteCandidate(id: number): Promise<void> {
    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      throw createError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    await prisma.candidate.delete({
      where: { id }
    });
  }

  static async uploadCV(id: number, file: Express.Multer.File): Promise<CandidateWithRelations> {
    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      throw createError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        cvFile: file.buffer,
        cvFileName: file.originalname,
        cvFileType: file.mimetype
      },
      include: {
        education: true,
        experience: true
      }
    });

    return updatedCandidate as CandidateWithRelations;
  }

  static async getCV(id: number): Promise<{ file: Buffer; fileName: string; fileType: string }> {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      select: {
        cvFile: true,
        cvFileName: true,
        cvFileType: true
      }
    });

    if (!candidate) {
      throw createError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    if (!candidate.cvFile) {
      throw createError('El candidato no tiene un CV subido', 404);
    }

    return {
      file: candidate.cvFile,
      fileName: candidate.cvFileName!,
      fileType: candidate.cvFileType!
    };
  }

  static async deleteCV(id: number): Promise<CandidateWithRelations> {
    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      throw createError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        cvFile: null,
        cvFileName: null,
        cvFileType: null
      },
      include: {
        education: true,
        experience: true
      }
    });

    return updatedCandidate as CandidateWithRelations;
  }

  static async addEducation(candidateId: number, educationData: any): Promise<CandidateWithRelations> {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      throw createError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    await prisma.education.create({
      data: {
        ...educationData,
        candidateId
      }
    });

    return this.getCandidateById(candidateId);
  }

  static async addExperience(candidateId: number, experienceData: any): Promise<CandidateWithRelations> {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      throw createError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    await prisma.experience.create({
      data: {
        ...experienceData,
        candidateId
      }
    });

    return this.getCandidateById(candidateId);
  }
} 