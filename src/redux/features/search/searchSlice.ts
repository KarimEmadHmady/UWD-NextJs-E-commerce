import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchResult {
  id: string;
  name: string;
  image: string;
  price: number;
  isNew?: boolean;
  isSale?: boolean;
  category?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  originalPrice?: number;
}

interface SearchState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
};

/**
 * searchSlice - Redux slice for managing search state.
 * Handles search query, results, loading, and error state.
 */
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    fetchSearchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSearchSuccess(state, action: PayloadAction<SearchResult[]>) {
      state.results = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchSearchFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSearch(state) {
      state.query = '';
      state.results = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setSearchQuery, fetchSearchStart, fetchSearchSuccess, fetchSearchFailure, clearSearch } = searchSlice.actions;
export default searchSlice.reducer; 