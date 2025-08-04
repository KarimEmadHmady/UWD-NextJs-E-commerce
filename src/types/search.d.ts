// src/types/search.d.ts
import type { Product } from './product';

export interface SearchFilters {
  category?: string;
  price_min?: number;
  price_max?: number;
  rating?: number;
  in_stock?: boolean;
  sort_by?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating' | 'newest';
}

export interface SearchResult {
  products: Product[];
  total_results: number;
  current_page: number;
  total_pages: number;
  filters: SearchFilters;
}

export interface SearchSuggestion {
  id: number;
  name: string;
  type: 'product' | 'category' | 'brand';
  relevance: number;
} 