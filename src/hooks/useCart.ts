// src/hooks/useCart.ts
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
} from '@/redux/features/cart/cartSlice';
import {
  selectCartItems,
  selectCartIsOpen,
  selectCartSubtotal,
  selectCartShipping,
  selectCartTax,
  selectCartTotal,
  selectCartItemsCount,
} from '@/redux/features/cart/cartSelectors';
import type { CartItem, Product } from '@/types/common';

/**
 * Custom hook for managing the shopping cart state and actions.
 * Handles adding, removing, updating items, syncing with localStorage, and toggling the cart UI.
 */
export const useCart = () => {
  const dispatch = useAppDispatch();
  
  const items = useAppSelector(selectCartItems);
  const isOpen = useAppSelector(selectCartIsOpen);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = useAppSelector(selectCartShipping);
  const tax = useAppSelector(selectCartTax);
  const total = useAppSelector(selectCartTotal);
  const itemsCount = useAppSelector(selectCartItemsCount);

  // Sync cart items from localStorage to Redux on mount
  useEffect(() => {
    if (items.length === 0) {
      const stored = localStorage.getItem('cart_items');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: CartItem) => {
              dispatch(addToCart(item));
            });
          }
        } catch {}
      }
    }
    // eslint-disable-next-line
  }, []);

  // Sync cart items from Redux to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      images: product.images,
      stock: product.stock,
      brand: product.brand,
      tags: product.tags,
      description: product.description,
      category: product.category
    };
    dispatch(addToCart(cartItem));
  }, [dispatch]);

  const removeItem = useCallback((id: number) => {
    dispatch(removeFromCart(id));
  }, [dispatch]);

  const updateItemQuantity = useCallback((id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  return {
    items,
    isOpen,
    subtotal,
    shipping,
    tax,
    total,
    itemsCount,
    addItem,
    removeItem,
    updateItemQuantity,
    clear,
    toggle,
  };
};