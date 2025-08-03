import { useSelector } from 'react-redux';
import { selectCategories, selectCategoriesLoading, selectCategoriesError } from '../redux/features/category/categorySelectors';

/**
 * Custom hook for fetching and managing categories state.
 * Provides categories, loading, and error info.
 */
export const useCategory = () => {
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  return { categories, loading, error };
}; 