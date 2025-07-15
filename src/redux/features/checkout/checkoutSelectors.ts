import { RootState } from '../../store';

export const selectCheckoutAddress = (state: RootState) => state.checkout.address;
export const selectCheckoutShippingMethod = (state: RootState) => state.checkout.shippingMethod;
export const selectCheckoutPaymentMethod = (state: RootState) => state.checkout.paymentMethod;
export const selectCheckoutReview = (state: RootState) => state.checkout.review; 