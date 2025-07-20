import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  // أضف أي بيانات أخرى حسب الحاجة
}

interface UserState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks (جاهزة للربط مع API لاحقاً)
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    // هنا سيتم استدعاء API لاحقاً
    // const response = await api.login(credentials);
    // return response.data;
    return { id: '1', name: 'Demo User', email: credentials.email };
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, thunkAPI) => {
    // const response = await api.getUser();
    // return response.data;
    return { id: '1', name: 'Demo User', email: 'demo@email.com' };
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    // await api.logout();
    return null;
  }
);

/**
 * userSlice - Redux slice for managing user authentication and user state.
 * Handles login, logout, fetch user, and user info.
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // يمكن إضافة تحديث بيانات المستخدم هنا
  },
  extraReducers: (builder) => {
    builder
      // تسجيل الدخول
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // جلب بيانات المستخدم
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fetch user failed';
      })
      // تسجيل الخروج
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export default userSlice.reducer; 