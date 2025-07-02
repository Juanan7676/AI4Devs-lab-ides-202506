import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { asyncHandler } from '../middleware/errorHandler';
import { SUCCESS_MESSAGES } from '../utils/constants';
import { UserCreate, UserLogin, AuthenticatedRequest } from '../types/auth';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const userData: UserCreate = req.body;
    
    const result = await AuthService.register(userData);
    
    res.status(201).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_CREATED,
      data: result
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const credentials: UserLogin = req.body;
    
    const result = await AuthService.login(credentials);
    
    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_LOGGED_IN,
      data: result
    });
  });

  static getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const user = await AuthService.getUserById(req.user.userId);
    
    res.status(200).json({
      success: true,
      data: user
    });
  });

  static changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
    
    await AuthService.changePassword(req.user.userId, currentPassword, newPassword);
    
    res.status(200).json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });
  });

  static verifyToken = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    try {
      const payload = AuthService.verifyToken(token);
      const user = await AuthService.getUserById(payload.userId);
      
      res.status(200).json({
        success: true,
        data: {
          user,
          token: token
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  });
} 