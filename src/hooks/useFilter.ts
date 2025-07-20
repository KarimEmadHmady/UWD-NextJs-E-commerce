import { useSelector } from 'react-redux';
import {
  selectSelectedCategories,
  selectSelectedQuantities,
  selectSelectedSizes,
  selectSelectedBrands,
  selectPriceRange,
} from '../redux/features/filter/filterSelectors';

/**
 * Custom hook for accessing filter state from Redux.
 * Provides selected categories, quantities, sizes, brands, and price range.
 */
export const useFilter = () => {
  const selectedCategories = useSelector(selectSelectedCategories);
  const selectedQuantities = useSelector(selectSelectedQuantities);
  const selectedSizes = useSelector(selectSelectedSizes);
  const selectedBrands = useSelector(selectSelectedBrands);
  const priceRange = useSelector(selectPriceRange);

  return { selectedCategories, selectedQuantities, selectedSizes, selectedBrands, priceRange };
}; 