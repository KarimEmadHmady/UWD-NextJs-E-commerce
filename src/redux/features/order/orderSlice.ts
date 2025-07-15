import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  address: string;
  status: string;
  createdAt: string;
}

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