import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '@/redux/features/wishlist/wishlistSlice';
import {
  selectWishlistItems,
  selectWishlistCount,
} from '@/redux/features/wishlist/wishlistSelectors';
import type { CartProduct, Product } from '@/types/product';
import { convertProductToCartProduct } from '@/components/product/product-data';

/**
 * Custom hook for managing the wishlist state and actions.
 * Handles adding, removing, clearing wishlist, and syncing with localStorage.
 */
export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);

  // Sync wishlist items from localStorage to Redux on mount
  useEffect(() => {
    if (items.length === 0) {
      const stored = localStorage.getItem('wishlist_items');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: Product | CartProduct) => {
              // Check if item is Product type (from API) and convert to CartProduct
              if ('slug' in item && 'regular_price' in item) {
                // This is a Product type, convert to CartProduct
                const cartProduct = convertProductToCartProduct(item as Product);
                dispatch(addToWishlist(cartProduct));
              } else {
                // This is already a CartProduct type
                dispatch(addToWishlist(item as CartProduct));
              }
            });
          }
        } catch {}
      }
    }
    // eslint-disable-next-line
  }, []);

  // Sync wishlist items from Redux to localStorage on change
  useEffect(() => {
    localStorage.setItem('wishlist_items', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: CartProduct) => {
    dispatch(addToWishlist(product));
  }, [dispatch]);

  const removeItem = useCallback((id: number) => {
    dispatch(removeFromWishlist(id));
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearWishlist());
  }, [dispatch]);

  return {
    items,
    count,
    addItem,
    removeItem,
    clear,
  };
}; 