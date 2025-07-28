// src/types/cart.d.ts 
export interface CartItem {
  id: number;
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