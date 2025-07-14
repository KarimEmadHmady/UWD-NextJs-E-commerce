import { useCallback } from 'react';
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
import type { Product } from '@/types/common';

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);

  const addItem = useCallback((product: Product) => {
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