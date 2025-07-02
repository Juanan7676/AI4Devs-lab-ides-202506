import { Request } from 'express';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface JwtPayload {
  userId: number;
  username: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
} 