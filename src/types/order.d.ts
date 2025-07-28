// src/types/order.d.ts
import type { CartItem } from './cart';

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
} 