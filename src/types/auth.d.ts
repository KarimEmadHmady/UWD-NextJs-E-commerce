// src/types/auth.d.ts

export interface User {
  id: number;
  username: string;
  email: string;
  phone_number?: string;
  city?: string;
  states?: string;
  lat?: number;
  long?: number;
  address?: string;
  avatar?: string;
  role?: 'user' | 'admin';
} 