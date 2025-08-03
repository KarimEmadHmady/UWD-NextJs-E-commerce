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
import type { CartProduct } from '@/types/product';

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
            parsed.forEach((item: CartProduct) => {
              dispatch(addToWishlist(item));
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