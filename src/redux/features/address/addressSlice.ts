import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserAddresses } from '@/services/addressService';

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  country: string;
  notes?: string;
  isDefault?: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
  label?: string;
}

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};

export const fetchUserAddressesAsync = createAsyncThunk(
  'address/fetchUserAddresses',
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await fetchUserAddresses(token);
      return Array.isArray(data) ? data : data.addresses || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch addresses');
    }
  }
);

/**
 * addressSlice - Redux slice for managing user addresses state.
 * Handles adding, updating, deleting, setting default, and error/loading state for addresses.
 */
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Address>) {
      // إذا كان العنوان الجديد افتراضي، أزل الافتراضية عن الباقي
      if (action.payload.isDefault) {
        state.addresses.forEach(addr => addr.isDefault = false);
      }
      state.addresses.unshift(action.payload);
    },
    updateAddress(state, action: PayloadAction<Address>) {
      const idx = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (idx !== -1) {
        // إذا كان التحديث افتراضي، أزل الافتراضية عن الباقي
        if (action.payload.isDefault) {
          state.addresses.forEach(addr => addr.isDefault = false);
        }
        state.addresses[idx] = action.payload;
      }
    },
    deleteAddress(state, action: PayloadAction<string>) {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
    },
    setDefaultAddress(state, action: PayloadAction<string>) {
      state.addresses.forEach(addr => addr.isDefault = false);
      const idx = state.addresses.findIndex(addr => addr.id === action.payload);
      if (idx !== -1) {
        state.addresses[idx].isDefault = true;
      }
    },
    setAddresses(state, action: PayloadAction<Address[]>) {
      state.addresses = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearAddresses(state) {
      state.addresses = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserAddressesAsync.fulfilled, (state, action) => {
      state.addresses = action.payload;
    });
  },
});

export const { addAddress, updateAddress, deleteAddress, setDefaultAddress, setAddresses, setLoading, setError, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer; 