// src/services/productService.ts 
import { apiFetch } from '@/lib/api';
import type { Product, ProductsResponse } from '@/types/product';

export async function getProducts(): Promise<ProductsResponse> {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {});
}

export async function getProductById(id: number): Promise<Product> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`;
  console.log('API URL for product:', url);
  return apiFetch(url, {});
}

// Helper function to get all products (for backward compatibility)
export async function getAllProducts(): Promise<Product[]> {
  const response = await getProducts();
  return response.products;
} 