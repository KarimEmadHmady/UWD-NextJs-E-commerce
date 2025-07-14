// src/hooks/useCart.ts
import { useCallback } from 'react';
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

export const useCart = () => {
  const dispatch = useAppDispatch();
  
  const items = useAppSelector(selectCartItems);
  const isOpen = useAppSelector(selectCartIsOpen);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = useAppSelector(selectCartShipping);
  const tax = useAppSelector(selectCartTax);
  const total = useAppSelector(selectCartTotal);
  const itemsCount = useAppSelector(selectCartItemsCount);

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