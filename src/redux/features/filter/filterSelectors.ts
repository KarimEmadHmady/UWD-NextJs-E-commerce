import { RootState } from '../../store';

export const selectSelectedCategories = (state: RootState) => state.filter.selectedCategories;
export const selectSelectedQuantities = (state: RootState) => state.filter.selectedQuantities;
export const selectSelectedSizes = (state: RootState) => state.filter.selectedSizes;
export const selectSelectedBrands = (state: RootState) => state.filter.selectedBrands;
export const selectPriceRange = (state: RootState) => state.filter.priceRange; 