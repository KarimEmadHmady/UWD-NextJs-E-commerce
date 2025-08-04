// src/types/product.d.ts 
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  regular_price?: string;
  sale_price?: string;
  stock_status?: string;
  stock_quantity?: number | null;
  short_description?: string;
  description: string;
  categories?: string[];
  image?: string;
  gallery?: string[];
  permalink?: string;
  rating?: number;
  brand?: string;
  tags?: string[];
  stock?: number;
}

export interface ProductsResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  products: Product[];
}

// Interface for cart and wishlist compatibility
export interface CartProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  stock: number;
  brand: string;
  tags: string[];
}

// Legacy interface for backward compatibility
export interface LegacyProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  stock: number;
  brand: string;
  tags: string[];
} 