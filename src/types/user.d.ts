// src/types/user.d.ts
import type { Address } from './address';

export interface User {
  id: number;
  username?: string;
  name?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  phone_number?: string;
  avatar?: string;
  city?: string;
  states?: string;
  lat?: number;
  long?: number;
  address?: string;
  role?: 'user' | 'admin';
  adresses?: any;
  addresses?: Address[];
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
} 