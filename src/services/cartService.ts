// src/services/cartService.ts 
import { apiFetch } from '@/lib/api';
import type { CartItem } from '@/types/cart';

export async function addToCartApi(item: CartItem) {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}cart/add`, {
    method: 'POST',
    body: JSON.stringify(item),
    headers: { 'Content-Type': 'application/json' },
    useAuthToken: true,
  });
}

export async function removeFromCartApi(id: number) {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}cart/remove/${id}`, {
    method: 'DELETE',
    useAuthToken: true,
  });
}

export async function getCartItemsApi() {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}cart`, {
    useAuthToken: true,
  });
} 