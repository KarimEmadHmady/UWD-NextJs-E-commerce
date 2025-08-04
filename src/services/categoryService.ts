// src/services/categoryService.ts
import { apiFetch } from '@/lib/api';
import type { Category, CategoriesResponse, CategoryProductsResponse } from '@/types/category';

export async function getCategories(): Promise<CategoriesResponse> {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/products/categories`, {});
}

export async function getCategoryById(id: number): Promise<CategoryProductsResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/category/${id}`;
  return apiFetch(url, {});
}

export async function getCategoryBySlug(slug: string): Promise<CategoryProductsResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/products/category/${slug}`;
  return apiFetch(url, {});
}

// Helper function to get all categories (for backward compatibility)
export async function getAllCategories(): Promise<Category[]> {
  const response = await getCategories();
  return response;
} 