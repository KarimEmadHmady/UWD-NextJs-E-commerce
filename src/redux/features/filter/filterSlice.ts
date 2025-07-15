import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  selectedCategories: string[];
  selectedQuantities: string[];
  selectedSizes: string[];
  selectedBrands: string[];
  // يمكنك إضافة المزيد من الفلاتر هنا حسب الحاجة
}

const initialState: FilterState = {
  selectedCategories: [],
  selectedQuantities: [],
  selectedSizes: [],
  selectedBrands: [],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<string[]>) {
      state.selectedCategories = action.payload;
    },
    setQuantities(state, action: PayloadAction<string[]>) {
      state.selectedQuantities = action.payload;
    },
    setSizes(state, action: PayloadAction<string[]>) {
      state.selectedSizes = action.payload;
    },
    setBrands(state, action: PayloadAction<string[]>) {
      state.selectedBrands = action.payload;
    },
    clearFilters(state) {
      state.selectedCategories = [];
      state.selectedQuantities = [];
      state.selectedSizes = [];
      state.selectedBrands = [];
    },
  },
});

export const { setCategories, setQuantities, setSizes, setBrands, clearFilters } = filterSlice.actions;
export default filterSlice.reducer; 