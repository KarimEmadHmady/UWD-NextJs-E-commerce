// src/types/globalLoading.d.ts
export interface GlobalLoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface LoadingAction {
  type: 'start' | 'stop' | 'update';
  message?: string;
  progress?: number;
} 