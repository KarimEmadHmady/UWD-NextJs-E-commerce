import { RootState } from '../../store';

// RootState يجب أن يحتوي على products: ProductsState
export const selectProducts = (state: RootState) => state.products?.products ?? [];
export const selectProductsLoading = (state: RootState) => state.products?.loading ?? false;
export const selectProductsError = (state: RootState) => state.products?.error ?? null; 