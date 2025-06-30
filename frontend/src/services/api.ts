import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { notification } from 'antd';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleApiError(error: AxiosError): void {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          notification.error({
            message: 'Authentication Error',
            description: 'Please log in again.',
            duration: 4.5,
          });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        
        case 403:
          notification.error({
            message: 'Access Denied',
            description: 'You do not have permission to perform this action.',
            duration: 4.5,
          });
          break;
        
        case 404:
          notification.error({
            message: 'Not Found',
            description: 'The requested resource was not found.',
            duration: 4.5,
          });
          break;
        
        case 422:
          notification.error({
            message: 'Validation Error',
            description: (data as any)?.message || 'Please check your input and try again.',
            duration: 4.5,
          });
          break;
        
        case 500:
          notification.error({
            message: 'Server Error',
            description: 'An internal server error occurred. Please try again later.',
            duration: 4.5,
          });
          break;
        
        default:
          notification.error({
            message: 'Error',
            description: (data as any)?.message || 'An unexpected error occurred.',
            duration: 4.5,
          });
      }
    } else if (error.request) {
      notification.error({
        message: 'Network Error',
        description: 'Please check your internet connection and try again.',
        duration: 4.5,
      });
    } else {
      notification.error({
        message: 'Error',
        description: 'An unexpected error occurred.',
        duration: 4.5,
      });
    }
  }

  public get<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.api.get(url, { params });
  }

  public post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.api.post(url, data);
  }

  public put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.api.put(url, data);
  }

  public delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.api.delete(url);
  }

  public upload<T>(url: string, formData: FormData): Promise<AxiosResponse<T>> {
    return this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const apiService = new ApiService();
export default apiService; 