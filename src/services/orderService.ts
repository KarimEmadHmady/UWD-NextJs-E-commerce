// src/services/orderService.ts
import { apiFetch } from '@/lib/api';
import type { Order } from '@/types/order';

export async function getOrders() {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}orders`, { useAuthToken: true });
}

export async function getOrderById(id: number) {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}orders/${id}`, { useAuthToken: true });
} 