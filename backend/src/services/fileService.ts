import multer from 'multer';
import { ALLOWED_FILE_TYPES, FILE_SIZE_LIMIT, ERROR_MESSAGES } from '../utils/constants';
import { createError } from '../middleware/errorHandler';

export class FileService {
  static validateFile(file: Express.Multer.File): void {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      throw createError(ERROR_MESSAGES.INVALID_FILE_TYPE, 400);
    }

    // Check file size
    if (file.size > FILE_SIZE_LIMIT) {
      throw createError(ERROR_MESSAGES.FILE_TOO_LARGE, 413);
    }
  }

  static getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.')).toLowerCase();
  }

  static isValidFileType(mimetype: string): boolean {
    return ALLOWED_FILE_TYPES.includes(mimetype);
  }

  static isFileSizeValid(size: number): boolean {
    return size <= FILE_SIZE_LIMIT;
  }

  static getFileSizeInMB(size: number): number {
    return Math.round((size / (1024 * 1024)) * 100) / 100;
  }

  static sanitizeFileName(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
  }
}

// Multer configuration for CV uploads
export const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: FILE_SIZE_LIMIT
  },
  fileFilter: (req, file, cb) => {
    if (FileService.isValidFileType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(ERROR_MESSAGES.INVALID_FILE_TYPE));
    }
  }
}).single('cv');

// Error handling for multer
export const handleMulterError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: ERROR_MESSAGES.FILE_TOO_LARGE,
        error: `El archivo excede el límite de ${FileService.getFileSizeInMB(FILE_SIZE_LIMIT)}MB`
      });
    }
  } else if (error.message === ERROR_MESSAGES.INVALID_FILE_TYPE) {
    return res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_FILE_TYPE,
      error: 'Solo se permiten archivos PDF, DOCX y DOC'
    });
  }

  next(error);
}; 