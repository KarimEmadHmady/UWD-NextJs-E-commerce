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
  // Loyalty info captured at order time
  redeemedRewards?: Array<{
    id: string;
    name: string;
    type: 'discount' | 'freeShipping' | 'product';
    value?: number;
    isPercent?: boolean;
    image?: string;
    productId?: number;
    redeemedAt?: string;
  }>;
} 