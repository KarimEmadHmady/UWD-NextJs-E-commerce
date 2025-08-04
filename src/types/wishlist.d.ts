// src/types/wishlist.d.ts
export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  added_at: string;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  items: WishlistItem[];
  total_items: number;
} 