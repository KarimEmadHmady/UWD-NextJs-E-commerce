// src/types/common.d.ts
// Common utility types and interfaces

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  per_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  total_pages: number;
  per_page: number;
}