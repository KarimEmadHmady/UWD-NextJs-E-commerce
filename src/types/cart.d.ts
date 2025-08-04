// src/types/cart.d.ts 
export interface CartItem {
  id: number;
  key?: string; // Server cart item key
  name: string;
  price: number;
  quantity: number;
  images: string[];
  description: string;
  category: string;
  stock: number;
  brand: string;
  tags: string[];
  rating?: number;
} 