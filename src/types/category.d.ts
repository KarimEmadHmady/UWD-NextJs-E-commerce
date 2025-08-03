// src/types/category.d.ts
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

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: string;
  stock_quantity: number | null;
  short_description: string;
  description: string;
  categories: string[];
  image: string;
  gallery: string[];
  permalink: string;
} 