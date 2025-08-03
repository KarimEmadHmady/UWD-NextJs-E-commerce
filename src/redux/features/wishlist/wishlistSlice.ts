import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartProduct } from '@/types/product';

interface WishlistState {
  items: CartProduct[];
}

const initialState: WishlistState = {
  items: [],
};

/**
 * wishlistSlice - Redux slice for managing wishlist state.
 * Handles adding, removing, and clearing wishlist items.
 */
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<CartProduct>) => {
      if (!state.items.find(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer; 