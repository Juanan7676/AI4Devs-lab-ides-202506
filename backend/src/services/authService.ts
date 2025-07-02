import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { JWT_SECRET, JWT_EXPIRES_IN, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { UserCreate, UserLogin, AuthResponse, JwtPayload } from '../types/auth';
import { createError } from '../middleware/errorHandler';

export class AuthService {
  static async register(userData: UserCreate): Promise<AuthResponse> {
    const { username, email, password, role = 'recruiter' } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      throw createError(ERROR_MESSAGES.USER_ALREADY_EXISTS, 409);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      user,
      token
    };
  }

  static async login(credentials: UserLogin): Promise<AuthResponse> {
    const { username, password } = credentials;

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      }
    });

    if (!user) {
      throw createError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Generate JWT token
    const token = this.generateToken(user);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  static async getUserById(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw createError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    return user;
  }

  static async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw createError(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw createError('La contraseña actual es incorrecta', 400);
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });
  }

  private static generateToken(user: { id: number; username: string; role: string }): string {
    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw createError('Token inválido', 401);
    }
  }
} 