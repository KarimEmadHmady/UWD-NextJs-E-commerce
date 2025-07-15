import { useSelector } from 'react-redux';
import { selectCategories, selectCategoriesLoading, selectCategoriesError } from '../redux/features/category/categorySelectors';

export const useCategory = () => {
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  return { categories, loading, error };
}; 