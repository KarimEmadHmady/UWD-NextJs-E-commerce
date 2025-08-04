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
import type { WishlistItem } from '@/types/wishlist';
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
            parsed.forEach((item: any) => {
              if (item.images || item.gallery || item.slug) {
                return;
              }
              if (item.id && item.name && item.image && item.inStock !== undefined) {
                dispatch(addToWishlist(item as WishlistItem));
              }
            });
          }
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error);
        }
      }
    }
    // eslint-disable-next-line
  }, []);

  // Sync wishlist items from Redux to localStorage on change
  useEffect(() => {
    localStorage.setItem('wishlist_items', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: CartProduct) => {
    const wishlistItem: WishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.svg',
      category: product.category,
      inStock: product.stock > 0,
      added_at: new Date().toISOString(),
    };
    dispatch(addToWishlist(wishlistItem));
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