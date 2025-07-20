import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalLoadingState {
  loading: boolean;
}

const initialState: GlobalLoadingState = {
  loading: false,
};

/**
 * globalLoadingSlice - Redux slice for managing global loading state.
 * Handles loading flag for showing/hiding global loading overlays.
 */
const globalLoadingSlice = createSlice({
  name: 'globalLoading',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { startLoading, stopLoading, setLoading } = globalLoadingSlice.actions;
export default globalLoadingSlice.reducer; 