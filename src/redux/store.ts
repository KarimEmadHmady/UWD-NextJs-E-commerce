// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';
import langReducer from './features/lang/langSlice';
import userReducer from './features/user/userSlice';
import notificationReducer from './features/notifications/notificationSlice';
import globalLoadingReducer from './features/globalLoading/globalLoadingSlice';
import productsReducer from './features/products/productsSlice';
import categoryReducer from './features/category/categorySlice';
import searchReducer from './features/search/searchSlice';
import filterReducer from './features/filter/filterSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    lang: langReducer,
    user: userReducer,
    notifications: notificationReducer,
    globalLoading: globalLoadingReducer,
    products: productsReducer,
    category: categoryReducer,
    search: searchReducer,
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;