import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalLoadingState {
  loading: boolean;
}

const initialState: GlobalLoadingState = {
  loading: false,
};

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