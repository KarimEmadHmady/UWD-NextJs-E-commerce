import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isLoading: boolean;
  error: string | null;
  serverCartCount: number;
  serverCartTotal: string;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  isLoading: false,
  error: null,
  serverCartCount: 0,
  serverCartTotal: '0',
};

/**
 * cartSlice - Redux slice for managing shopping cart state.
 * Handles adding, removing, updating items, clearing cart, and toggling cart UI.
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        if (existingItem.quantity > action.payload.stock) {
          existingItem.quantity = action.payload.stock;
        }
      } else {
        state.items.push({
          ...action.payload,
          quantity: Math.min(action.payload.quantity, action.payload.stock)
        });
      }
      state.subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.tax = state.subtotal * 0.14; // 14% VAT for Egypt
      state.shipping = 0;
      state.total = state.subtotal + state.tax + state.shipping;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.tax = state.subtotal * 0.14;
      state.shipping = 0;
      state.total = state.subtotal + state.tax + state.shipping;
    },
    removeFromCartByKey: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.key !== action.payload);
      state.subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.tax = state.subtotal * 0.14;
      state.shipping = 0;
      state.total = state.subtotal + state.tax + state.shipping;
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.min(action.payload.quantity, item.stock);
      }
      state.subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.tax = state.subtotal * 0.14;
      state.shipping = 0;
      state.total = state.subtotal + state.tax + state.shipping;
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.shipping = 0;
      state.total = 0;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    // New actions for server integration
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setServerCartData: (state, action: PayloadAction<{ count: number; total: string }>) => {
      state.serverCartCount = action.payload.count;
      state.serverCartTotal = action.payload.total;
    },
    syncCartFromServer: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      state.tax = state.subtotal * 0.14;
      state.shipping = 0;
      state.total = state.subtotal + state.tax + state.shipping;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  removeFromCartByKey,
  updateQuantity, 
  clearCart, 
  toggleCart,
  setCartLoading,
  setCartError,
  setServerCartData,
  syncCartFromServer
} = cartSlice.actions;

export default cartSlice.reducer;