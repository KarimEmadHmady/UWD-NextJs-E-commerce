// src/types/order.d.ts
import type { CartItem } from './cart';

export interface Order {
  id: number | string;
  userId?: number | string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: string;
  address?: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
  paymentMethod?: string;
  shippingMethod?: string;
} 