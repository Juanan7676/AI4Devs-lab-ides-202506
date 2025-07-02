import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, ERROR_MESSAGES } from '../utils/constants';
import { JwtPayload, AuthenticatedRequest } from '../types/auth';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED,
      error: 'Token no proporcionado'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: ERROR_MESSAGES.FORBIDDEN,
      error: 'Token inválido o expirado'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        error: 'Usuario no autenticado'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
        error: 'No tienes permisos para realizar esta acción'
      });
      return;
    }

    next();
  };
};

export const isAdmin = requireRole(['admin']);
export const isRecruiter = requireRole(['recruiter', 'admin']); 