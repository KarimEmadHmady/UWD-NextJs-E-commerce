import { RootState } from '../../store';

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartIsOpen = (state: RootState) => state.cart.isOpen;
export const selectCartSubtotal = (state: RootState) => state.cart.subtotal;
export const selectCartShipping = (state: RootState) => state.cart.shipping;
export const selectCartTax = (state: RootState) => state.cart.tax;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartItemsCount = (state: RootState) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartIsLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectServerCartCount = (state: RootState) => state.cart.serverCartCount;
export const selectServerCartTotal = (state: RootState) => state.cart.serverCartTotal;