// src/services/productService.ts 
import { apiFetch } from '@/lib/api';
import type { Product } from '@/types/product';

export async function getProducts(): Promise<Product[]> {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}products`, {});
}

export async function getProductById(id: number): Promise<Product> {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}products/${id}`, {});
} 