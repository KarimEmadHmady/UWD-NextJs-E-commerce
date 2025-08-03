import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductById, getAllProducts } from '@/services/productService';
import type { Product, ProductsResponse } from '@/types/product';

// Hook for paginated products
export function useProducts(page: number = 1, per_page: number = 10) {
  return useQuery({
    queryKey: ['products', page, per_page],
    queryFn: () => getProducts(),
  });
}

// Hook for all products (backward compatibility)
export function useAllProducts() {
  return useQuery({
    queryKey: ['all-products'],
    queryFn: getAllProducts,
  });
}

// Hook for single product
export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

// Default export for backward compatibility
export default function useProductsLegacy() {
  return useAllProducts();
} 