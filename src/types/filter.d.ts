// src/types/filter.d.ts
export interface FilterOption {
  id: string;
  label: string;
  value: string | number;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'select';
  options: FilterOption[];
  selected?: string | number | (string | number)[];
}

export interface FilterState {
  categories: string[];
  price_range: [number, number];
  rating: number;
  in_stock: boolean;
  sort_by: string;
  page: number;
  per_page: number;
} 