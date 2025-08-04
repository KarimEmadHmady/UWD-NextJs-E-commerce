// src/types/category.d.ts
import type { Product } from './product';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: number;
  image: string | null;
}

export interface CategoriesResponse extends Array<Category> {}

export interface CategoryProductsResponse {
  category: string;
  category_id: number;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  products: Product[];
} 