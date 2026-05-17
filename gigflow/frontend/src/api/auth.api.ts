import api from './axios';
import { ApiResponse, LoginForm, RegisterForm, User } from '../types';

interface AuthData {
  token: string;
  user: User;
}

export const authApi = {
  register: (data: RegisterForm) =>
    api.post<ApiResponse<AuthData>>('/auth/register', data),

  login: (data: LoginForm) =>
    api.post<ApiResponse<AuthData>>('/auth/login', data),

  getMe: () =>
    api.get<ApiResponse<User>>('/auth/me'),
};
