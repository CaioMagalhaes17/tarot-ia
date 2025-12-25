import { apiClient } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  GoogleLoginRequest,
  GoogleLoginResponse,
} from './types';

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.request<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async loginWithGoogle(data: GoogleLoginRequest): Promise<GoogleLoginResponse> {
    return apiClient.request<GoogleLoginResponse>('/users/login/google', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.request<RegisterResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiClient.request<{ message: string }>(`/users/verify-email?token=${token}`, {
      method: 'GET',
    });
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.request<User>('/users/me');
  },
};

