import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { checkLocation, registerUser, LocationData, loginUser } from '@/services/authService';

// Async thunks
export const checkLocationAsync = createAsyncThunk(
  'auth/checkLocation',
  async (location: LocationData, { rejectWithValue }) => {
    try {
      const response = await checkLocation(location);
      console.log('Redux checkLocation response:', response);
      
      if (response.success) {
        return response;
      } else {
        console.log('Redux checkLocation rejected with:', response.message);
        return rejectWithValue(response.message);
      }
    } catch (error) {
      console.error('Redux checkLocation error:', error);
      return rejectWithValue('An error occurred while checking location');
    }
  }
);

export const registerUserAsync = createAsyncThunk(
  'auth/registerUser',
  async (userData: {
    username: string;
    email: string;
    password: string;
    phone_number: string;
    city: string;
    states: string;
    lat: number;
    long: number;
    address: string;
  }, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      console.log('Redux registerUser response:', response);
      
      if (response.success) {
        return response;
      } else {
        console.log('Redux registerUser rejected with:', response.message);
        return rejectWithValue(response.message);
      }
    } catch (error) {
      console.error('Redux registerUser error:', error);
      return rejectWithValue('An error occurred during registration');
    }
  }
);

export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async (loginData: {
    username: string;
    password: string;
  }, { rejectWithValue }) => {
    try {
      const response = await loginUser(loginData);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue('An error occurred during login');
    }
  }
);

// تحميل المستخدم من localStorage
export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async () => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
);

// State interface
interface AuthState {
  user: {
    id?: string;
    name?: string; // أضف هذا
    username?: string;
    email?: string;
    phone_number?: string;
    city?: string;
    states?: string;
    lat?: number;
    long?: number;
    address?: string;
    addresses?: any[]; // addresses من backend
    adresses?: any[]; // دعم التسمية الأخرى
  } | null;
  isAuthenticated: boolean;
  locationCheck: {
    loading: boolean;
    error: string | null;
    isWithinCoverage: boolean;
  };
  registration: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  locationCheck: {
    loading: false,
    error: null,
    isWithinCoverage: false,
  },
  registration: {
    loading: false,
    error: null,
    success: false,
  },
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearLocationError: (state) => {
      state.locationCheck.error = null;
    },
    clearRegistrationError: (state) => {
      state.registration.error = null;
      state.registration.success = false;
    },
    setUserLocation: (state, action: PayloadAction<{ lat: number; long: number; city: string; states: string; }>) => {
      if (state.user) {
        state.user.lat = action.payload.lat;
        state.user.long = action.payload.long;
        state.user.city = action.payload.city;
        state.user.states = action.payload.states;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.locationCheck.isWithinCoverage = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },
  },
  extraReducers: (builder) => {
    // Location check
    builder
      .addCase(checkLocationAsync.pending, (state) => {
        state.locationCheck.loading = true;
        state.locationCheck.error = null;
      })
      .addCase(checkLocationAsync.fulfilled, (state, action) => {
        state.locationCheck.loading = false;
        state.locationCheck.isWithinCoverage = true;
        state.locationCheck.error = null;
      })
      .addCase(checkLocationAsync.rejected, (state, action) => {
        state.locationCheck.loading = false;
        state.locationCheck.isWithinCoverage = false;
        state.locationCheck.error = action.payload as string;
      });

    // Registration
    builder
      .addCase(registerUserAsync.pending, (state) => {
        state.registration.loading = true;
        state.registration.error = null;
        state.registration.success = false;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.registration.loading = false;
        state.registration.success = true;
        state.registration.error = null;
        // Set user data if registration includes user info
        if (action.payload.data?.user) {
          const backendUser = action.payload.data.user;
          state.user = {
            id: backendUser.id || action.meta.arg.email || action.meta.arg.username || "",
            name: backendUser.name || action.meta.arg.username || "", // أضف هذا
            username: backendUser.username || action.meta.arg.username || "",
            email: backendUser.email || action.meta.arg.email || "",
            phone_number: backendUser.phone_number || action.meta.arg.phone_number || "",
            city: backendUser.city || action.meta.arg.city || "",
            states: backendUser.states || action.meta.arg.states || "",
            lat: backendUser.lat || action.meta.arg.lat || (backendUser.adresses?.[0]?.lat ?? backendUser.addresses?.[0]?.lat ?? 0),
            long: backendUser.long || action.meta.arg.long || (backendUser.adresses?.[0]?.long ?? backendUser.addresses?.[0]?.long ?? 0),
            address: backendUser.address || action.meta.arg.address || (backendUser.adresses?.[0]?.address_1 ?? backendUser.addresses?.[0]?.address_1 ?? ""),
            addresses: backendUser.addresses || backendUser.adresses || [],
            adresses: backendUser.adresses || undefined,
          };
          state.isAuthenticated = true;
        } else {
          state.user = {
            name: action.meta.arg.username, // أضف هذا
            username: action.meta.arg.username,
            email: action.meta.arg.email,
            phone_number: action.meta.arg.phone_number,
            city: action.meta.arg.city,
            states: action.meta.arg.states,
            lat: action.meta.arg.lat,
            long: action.meta.arg.long,
            address: action.meta.arg.address,
            addresses: [],
          };
          state.isAuthenticated = true;
        }
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.registration.loading = false;
        state.registration.success = false;
        state.registration.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.user = null; // Clear user on new login attempt
        state.isAuthenticated = false;
        state.registration.error = null; // Clear previous registration errors
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        const backendUser = action.payload.data.data?.user || {};
        const token = action.payload.data.data?.token;
        state.user = {
          id: backendUser.id || backendUser.email || backendUser.username || "",
          name: backendUser.name || backendUser.username || "", // أضف هذا
          username: backendUser.username || "",
          email: backendUser.email || "",
          phone_number: backendUser.phone_number || "",
          city: backendUser.city || "",
          states: backendUser.states || "",
          lat: backendUser.lat || (backendUser.adresses?.[0]?.lat ?? backendUser.addresses?.[0]?.lat ?? 0),
          long: backendUser.long || (backendUser.adresses?.[0]?.long ?? backendUser.addresses?.[0]?.long ?? 0),
          address: backendUser.address || (backendUser.adresses?.[0]?.address_1 ?? backendUser.addresses?.[0]?.address_1 ?? ""),
          addresses: backendUser.addresses || backendUser.adresses || [],
          adresses: backendUser.adresses || undefined,
        };
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
          if (token) {
            localStorage.setItem('token', token);
          }
        }
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.registration.error = action.payload as string;
      });

    // Load user from storage
    builder
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      });
  },
});

export const { 
  clearLocationError, 
  clearRegistrationError, 
  setUserLocation, 
  logout 
} = authSlice.actions;

export default authSlice.reducer; 