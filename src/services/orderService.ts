// src/services/orderService.ts
import { apiFetch } from '@/lib/api';
import type { Order, CheckoutRequest, CheckoutResponse } from '@/types';

export async function getOrders() {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}orders`, { useAuthToken: true });
}

export async function getOrderById(id: number) {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}orders/${id}`, { useAuthToken: true });
}

export async function createOrderApi(checkoutData: CheckoutRequest): Promise<CheckoutResponse> {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
    method: 'POST',
    body: JSON.stringify(checkoutData),
    headers: { 'Content-Type': 'application/json' },
    useAuthToken: true,
  });
} 