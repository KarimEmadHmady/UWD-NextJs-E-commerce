import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  selectedCategories: string[];
  selectedQuantities: string[];
  selectedSizes: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  // يمكنك إضافة المزيد من الفلاتر هنا حسب الحاجة
}

const initialState: FilterState = {
  selectedCategories: [],
  selectedQuantities: [],
  selectedSizes: [],
  selectedBrands: [],
  priceRange: [0, 5000],
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
    setPriceRange(state, action: PayloadAction<[number, number]>) {
      state.priceRange = action.payload;
    },
    clearFilters(state) {
      state.selectedCategories = [];
      state.selectedQuantities = [];
      state.selectedSizes = [];
      state.selectedBrands = [];
      state.priceRange = [0, 5000];
    },
  },
});

export const { setCategories, setQuantities, setSizes, setBrands, setPriceRange, clearFilters } = filterSlice.actions;
export default filterSlice.reducer; 