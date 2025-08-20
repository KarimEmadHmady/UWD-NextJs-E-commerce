// src/services/cartService.ts 
import { apiFetch } from '@/lib/api';
import type { 
  AddToCartResponse, 
  CartItemResponse, 
  CartResponse, 
  UpdateCartResponse 
} from '@/types';

export async function addToCartApi(productId: number, quantity: number, variations?: any[]): Promise<AddToCartResponse> {
  // Backend expects JSON body. Support both simple and variations payloads.
  const body = variations && Array.isArray(variations) && variations.length > 0
    ? { product_id: productId, variations }
    : { product_id: productId, quantity };
  const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    useAuthToken: true,
  });
  return response;
}

export async function getCartItemsApi(): Promise<CartResponse> {
  const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
    useAuthToken: true,
  });
  return response;
}

export async function updateCartItemApi(key: string, quantity: number): Promise<UpdateCartResponse> {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/update?key=${key}&quantity=${quantity}`, {
    method: 'PUT',
    useAuthToken: true,
  });
}

export async function removeFromCartApi(key: string) {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove?key=${key}`, {
    method: 'DELETE',
    useAuthToken: true,
  });
} 

export async function clearCartApi() {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear`, {
    method: 'POST',
    useAuthToken: true,
  });
}