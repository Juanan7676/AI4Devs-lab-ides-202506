import apiService from './api';
import { LoginCredentials, AuthResponse, User } from '../types/auth';
import { notification } from 'antd';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<{ success: boolean; message: string; data: AuthResponse }>('/auth/login', credentials);
      const { token, user } = response.data.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      notification.success({
        message: 'Login Successful',
        description: `Welcome back, ${user.firstName || user.username}!`,
        duration: 3,
      });
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      // await apiService.post('/auth/logout'); // No existe en backend
    } catch (error) {
      // Even if logout fails, clear local storage
      console.warn('Logout API call failed, but clearing local storage');
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      notification.info({
        message: 'Logged Out',
        description: 'You have been successfully logged out.',
        duration: 3,
      });
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // El backend usa /auth/profile
      const response = await apiService.get<{ success: boolean; data: User }>('/auth/profile');
      return response.data.data;
    } catch (error) {
      // If getting current user fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    // No implementado en backend
    return null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  hasRole(role: string): boolean {
    const user = this.getStoredUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getStoredUser();
    return user ? roles.includes(user.role) : false;
  }
}

export const authService = new AuthService();
export default authService; 