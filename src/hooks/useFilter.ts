import { useSelector } from 'react-redux';
import {
  selectSelectedCategories,
  selectSelectedQuantities,
  selectSelectedSizes,
  selectSelectedBrands,
} from '../redux/features/filter/filterSelectors';

export const useFilter = () => {
  const selectedCategories = useSelector(selectSelectedCategories);
  const selectedQuantities = useSelector(selectSelectedQuantities);
  const selectedSizes = useSelector(selectSelectedSizes);
  const selectedBrands = useSelector(selectSelectedBrands);

  return { selectedCategories, selectedQuantities, selectedSizes, selectedBrands };
}; 