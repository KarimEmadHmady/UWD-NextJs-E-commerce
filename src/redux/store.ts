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
import checkoutReducer from './features/checkout/checkoutSlice';
import orderReducer from './features/order/orderSlice';
import addressReducer from './features/address/addressSlice';
import authReducer from './features/auth/authSlice';
import loyaltyReducer from './features/loyalty/loyaltySlice';

/**
 * Redux store configuration for the e-commerce app.
 * Combines all feature reducers into a single store.
 */
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
    checkout: checkoutReducer,
    address: addressReducer,
    order: orderReducer,
    auth: authReducer,
    loyalty: loyaltyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;