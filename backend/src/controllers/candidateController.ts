import { Request, Response } from 'express';
import { CandidateService } from '../services/candidateService';
import { FileService } from '../services/fileService';
import { asyncHandler } from '../middleware/errorHandler';
import { SUCCESS_MESSAGES } from '../utils/constants';
import { CandidateCreate, CandidateUpdate } from '../types/candidate';
import { AuthenticatedRequest } from '../types/auth';

export class CandidateController {
  static getAllCandidates = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await CandidateService.getAllCandidates(page, limit, search);
    
    res.status(200).json({
      success: true,
      data: result
    });
  });

  static getCandidateById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    const candidate = await CandidateService.getCandidateById(id);
    
    res.status(200).json({
      success: true,
      data: candidate
    });
  });

  static createCandidate = asyncHandler(async (req: Request, res: Response) => {
    const candidateData: CandidateCreate = req.body;
    
    const candidate = await CandidateService.createCandidate(candidateData);
    
    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.CANDIDATE_CREATED,
      data: candidate
    });
  });

  static updateCandidate = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updateData: CandidateUpdate = req.body;
    
    const candidate = await CandidateService.updateCandidate(id, updateData);
    
    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.CANDIDATE_UPDATED,
      data: candidate
    });
  });

  static deleteCandidate = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    await CandidateService.deleteCandidate(id);
    
    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.CANDIDATE_DELETED
    });
  });

  static uploadCV = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    // Validate file
    FileService.validateFile(req.file);
    
    const candidate = await CandidateService.uploadCV(id, req.file);
    
    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.CV_UPLOADED,
      data: {
        candidate,
        fileInfo: {
          originalName: req.file.originalname,
          size: FileService.getFileSizeInMB(req.file.size),
          mimetype: req.file.mimetype
        }
      }
    });
  });

  static getCV = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    const cvData = await CandidateService.getCV(id);
    
    res.setHeader('Content-Type', cvData.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${cvData.fileName}"`);
    res.send(cvData.file);
  });

  static deleteCV = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    const candidate = await CandidateService.deleteCV(id);
    
    res.status(200).json({
      success: true,
      message: 'CV eliminado exitosamente',
      data: candidate
    });
  });

  static addEducation = asyncHandler(async (req: Request, res: Response) => {
    const candidateId = parseInt(req.params.id);
    const educationData = req.body;
    
    const candidate = await CandidateService.addEducation(candidateId, educationData);
    
    res.status(201).json({
      success: true,
      message: 'Educación agregada exitosamente',
      data: candidate
    });
  });

  static addExperience = asyncHandler(async (req: Request, res: Response) => {
    const candidateId = parseInt(req.params.id);
    const experienceData = req.body;
    
    const candidate = await CandidateService.addExperience(candidateId, experienceData);
    
    res.status(201).json({
      success: true,
      message: 'Experiencia agregada exitosamente',
      data: candidate
    });
  });

  static getCandidatesStats = asyncHandler(async (req: Request, res: Response) => {
    // This would be implemented in the service layer
    // For now, returning a placeholder
    res.status(200).json({
      success: true,
      data: {
        totalCandidates: 0,
        candidatesWithCV: 0,
        candidatesThisMonth: 0,
        averageExperience: 0
      }
    });
  });
} 