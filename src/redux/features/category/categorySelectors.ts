import { RootState } from '../../store';

export const selectCategories = (state: RootState) => state.category.categories;
export const selectCategoriesLoading = (state: RootState) => state.category.loading;
export const selectCategoriesError = (state: RootState) => state.category.error; 