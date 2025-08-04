// src/types/cartApi.d.ts
export interface AddToCartResponse {
  success: boolean;
  message: string;
  cart_item_key: string;
  cart_count: number;
  cart_total: string;
}

export interface CartItemResponse {
  key: string;
  product_id: number;
  name: string;
  quantity: number;
  price: string;
  total: string;
}

export interface CartResponse {
  total_items: number;
  total_price: string;
  items: CartItemResponse[];
}

export interface UpdateCartResponse {
  success: boolean;
  message: string;
  cart: Record<string, any>;
} 