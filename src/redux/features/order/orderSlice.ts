import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Order } from '@/types';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

/**
 * orderSlice - Redux slice for managing orders state.
 * Handles adding, setting, clearing orders, and error/loading state.
 */
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
    },
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearOrders(state) {
      state.orders = [];
    },
  },
});

export const { addOrder, setOrders, setLoading, setError, clearOrders } = orderSlice.actions;
export default orderSlice.reducer; 