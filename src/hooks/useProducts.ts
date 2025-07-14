import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProducts } from '@/redux/features/products/productsSlice';
import { selectProducts, selectProductsLoading, selectProductsError } from '@/redux/features/products/productsSelectors';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  const fetchAll = () => dispatch(fetchProducts());

  return {
    products,
    loading,
    error,
    fetchAll,
  };
}; 