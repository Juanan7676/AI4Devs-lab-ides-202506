import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ERROR_MESSAGES } from '../utils/constants';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  error: AppError | Prisma.PrismaClientKnownRequestError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message: string = ERROR_MESSAGES.INTERNAL_ERROR;
  let details: any = null;

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'El registro ya existe';
        details = { field: error.meta?.target };
        break;
      case 'P2025':
        statusCode = 404;
        message = ERROR_MESSAGES.NOT_FOUND;
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Error de referencia en la base de datos';
        break;
      default:
        statusCode = 400;
        message = 'Error en la base de datos';
    }
  }
  // JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }
  // Validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = ERROR_MESSAGES.VALIDATION_ERROR;
  }
  // Custom app errors
  else if (error instanceof Error && 'statusCode' in error) {
    statusCode = (error as AppError).statusCode || 500;
    message = error.message;
  }
  // File upload errors
  else if (error.message.includes('File too large')) {
    statusCode = 413;
    message = ERROR_MESSAGES.FILE_TOO_LARGE;
  }
  else if (error.message.includes('Invalid file type')) {
    statusCode = 400;
    message = ERROR_MESSAGES.INVALID_FILE_TYPE;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      user: (req as any).user
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    details,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: ERROR_MESSAGES.NOT_FOUND,
    error: `Ruta ${req.originalUrl} no encontrada`,
    timestamp: new Date().toISOString()
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 