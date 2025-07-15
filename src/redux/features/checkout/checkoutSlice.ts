import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CheckoutState {
  address: {
    name: string;
    phone: string;
    street: string;
    city: string;
    region: string;
    notes?: string;
  } | null;
  shippingMethod: string | null;
  paymentMethod: 'card' | 'cash' | 'pickup' | null;
  review: {
    comment?: string;
    rating?: number;
  } | null;
}

const initialState: CheckoutState = {
  address: null,
  shippingMethod: null,
  paymentMethod: null,
  review: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setAddress(state, action: PayloadAction<CheckoutState['address']>) {
      state.address = action.payload;
    },
    setShippingMethod(state, action: PayloadAction<string>) {
      state.shippingMethod = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<'card' | 'cash' | 'pickup'>) {
      state.paymentMethod = action.payload;
    },
    setReview(state, action: PayloadAction<CheckoutState['review']>) {
      state.review = action.payload;
    },
    clearCheckout(state) {
      state.address = null;
      state.shippingMethod = null;
      state.paymentMethod = null;
      state.review = null;
    },
  },
});

export const { setAddress, setShippingMethod, setPaymentMethod, setReview, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer; 