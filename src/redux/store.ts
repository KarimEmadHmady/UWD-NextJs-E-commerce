// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';
import langReducer from './features/lang/langSlice';
import userReducer from './features/user/userSlice';
import notificationReducer from './features/notifications/notificationSlice';
import globalLoadingReducer from './features/globalLoading/globalLoadingSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    lang: langReducer,
    user: userReducer,
    notifications: notificationReducer,
    globalLoading: globalLoadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;