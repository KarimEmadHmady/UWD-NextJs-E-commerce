import { RootState } from '../../store';

export const selectOrders = (state: RootState) => state.order.orders;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error; 