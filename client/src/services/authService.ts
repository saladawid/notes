import { http } from './http';
import type { AuthResponse } from '../types';

export const authService = {
  register: (name: string, email: string, password: string) =>
    http.post<AuthResponse>('/api/auth/register', { name, email, password }),

  login: (email: string, password: string) =>
    http.post<AuthResponse>('/api/auth/login', { email, password }),
};
