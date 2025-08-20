// src/hooks/useCart.ts
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartLoading,
  setCartError,
  setServerCartData,
  syncCartFromServer,
} from '@/redux/features/cart/cartSlice';
import {
  selectCartItems,
  selectCartIsOpen,
  selectCartSubtotal,
  selectCartShipping,
  selectCartTax,
  selectCartTotal,
  selectCartItemsCount,
  selectCartIsLoading,
  selectCartError,
  selectServerCartCount,
  selectServerCartTotal,
} from '@/redux/features/cart/cartSelectors';
import type { CartItem, CartProduct, CartItemResponse } from '@/types';
import { 
  addToCartApi, 
  getCartItemsApi, 
  updateCartItemApi, 
  removeFromCartApi
} from '@/services/cartService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from './useNotifications';

// Constants
const DEFAULT_STOCK = 999;
const VAT_RATE = 0.14; // 14% VAT for Egypt

// Utility functions
const parsePrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  return parseFloat(price) || 0;
};

/**
 * Custom hook for managing the shopping cart state and actions.
 * Handles adding, removing, updating items, syncing with server, and toggling the cart UI.
 */
export const useCart = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { notify } = useNotifications();
  
  const items = useAppSelector(selectCartItems);
  const isOpen = useAppSelector(selectCartIsOpen);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = useAppSelector(selectCartShipping);
  const tax = useAppSelector(selectCartTax);
  const total = useAppSelector(selectCartTotal);
  const itemsCount = useAppSelector(selectCartItemsCount);
  const isLoading = useAppSelector(selectCartIsLoading);
  const error = useAppSelector(selectCartError);
  const serverCartCount = useAppSelector(selectServerCartCount);
  const serverCartTotal = useAppSelector(selectServerCartTotal);

  // React Query for fetching cart data from server
  const { data: serverCart, isLoading: cartLoading, error: cartError, refetch: refetchCart } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartItemsApi,
    enabled: false, // Enable if you want automatic server sync
  });

  // Mutation for adding product to cart
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity, productData }: { productId: number; quantity: number; productData?: CartProduct }) =>
      addToCartApi(productId, quantity),
    onMutate: async ({ productId, quantity, productData }) => {
      // Optimistic update for immediate UI feedback
      const currentCount = serverCartCount || itemsCount;
      dispatch(setServerCartData({ 
        count: currentCount + quantity, 
        total: serverCartTotal 
      }));

      // Add product to Redux store immediately (optimistic)
      const optimisticItem: CartItem = {
        id: productId,
        key: `temp_${Date.now()}`,
        name: productData?.name || `Product ${productId}`,
        quantity: quantity,
        price: productData?.price || 0,
        images: productData?.images || [],
        description: productData?.description || '',
        category: productData?.category || '',
        stock: productData?.stock || DEFAULT_STOCK,
        brand: productData?.brand || '',
        tags: productData?.tags || [],
      };
      
      dispatch(addToCart(optimisticItem));
    },
    onSuccess: (data) => {
      notify('success', data.message);
      
      // Update cart item key if provided
      if (data.cart_item_key) {
        // TODO: Implement key update logic if needed
      }
    },
    onError: (error: Error) => {
      // Rollback optimistic update
      const currentCount = serverCartCount || itemsCount;
      dispatch(setServerCartData({ 
        count: Math.max(0, currentCount - 1), 
        total: serverCartTotal 
      }));
      dispatch(setCartError(error.message));
      notify('error', 'Failed to add product to cart');
    },
    onSettled: () => {
      dispatch(setCartLoading(false));
    },
  });

  // Mutation for updating product quantity
  const updateCartMutation = useMutation({
    mutationFn: ({ key, quantity }: { key: string; quantity: number }) =>
      updateCartItemApi(key, quantity),
    onMutate: async ({ key, quantity }) => {
      // Optimistic update for immediate UI feedback
      const itemToUpdate = items.find(item => item.key === key);
      if (itemToUpdate) {
        dispatch(updateQuantity({ id: itemToUpdate.id, quantity }));
      }
    },
    onSuccess: (data) => {
      notify('success', data.message);
    },
    onError: (error: Error) => {
      dispatch(setCartError(error.message));
      notify('error', 'Failed to update quantity');
    },
  });

  // Mutation for removing product from cart
  const removeFromCartMutation = useMutation({
    mutationFn: (key: string) => removeFromCartApi(key),
    onMutate: async (key) => {
      // Optimistic update
      const currentCount = serverCartCount || itemsCount;
      const itemToRemove = items.find(item => item.key === key);
      const quantityToRemove = itemToRemove?.quantity || 1;
      
      dispatch(setServerCartData({ 
        count: Math.max(0, currentCount - quantityToRemove), 
        total: serverCartTotal 
      }));

      // Remove item from Redux immediately (optimistic)
      if (itemToRemove) {
        dispatch(removeFromCart(itemToRemove.id));
      }
    },
    onSuccess: () => {
      notify('success', 'Product removed from cart');
    },
    onError: (error: Error) => {
      // Rollback optimistic update
      const currentCount = serverCartCount || itemsCount;
      const itemToRemove = items.find(item => item.key === (error as any).key);
      const quantityToRemove = itemToRemove?.quantity || 1;
      
      dispatch(setServerCartData({ 
        count: currentCount + quantityToRemove, 
        total: serverCartTotal 
      }));
      dispatch(setCartError(error.message));
      notify('error', 'Failed to remove product');
    },
    onSettled: () => {
      dispatch(setCartLoading(false));
    },
  });

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
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
        }
      }
    }
  }, [dispatch]);

  // Sync cart items from Redux to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  // Sync server cart data when it changes
  useEffect(() => {
    if (serverCart) {
      // Don't update if server returns empty data
      if (serverCart.total_items === 0 && serverCart.items.length === 0) {
        return;
      }
      
      // Parse total price from new format
      const totalPrice = parsePrice(serverCart.total_price);
      
      dispatch(setServerCartData({ 
        count: serverCart.total_items, 
        total: totalPrice.toString()
      }));

      // Convert server cart items to local format
      const localCartItems: CartItem[] = serverCart.items.map((item: CartItemResponse) => ({
        id: item.product_id,
        key: item.key,
        name: item.name,
        quantity: item.quantity,
        price: parsePrice(item.price),
        images: [], // Will be populated from product data
        description: '',
        category: '',
        stock: DEFAULT_STOCK,
        brand: '',
        tags: [],
      }));
      
      dispatch(syncCartFromServer(localCartItems));
    }
  }, [serverCart, dispatch]);

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    dispatch(setCartLoading(true));
    addToCartMutation.mutate({ productId: product.id, quantity, productData: product });
  }, [addToCartMutation, dispatch]);

  const removeItem = useCallback((key: string) => {
    dispatch(setCartLoading(true));
    removeFromCartMutation.mutate(key);
  }, [removeFromCartMutation, dispatch]);

  const updateItemQuantity = useCallback((key: string, quantity: number) => {
    updateCartMutation.mutate({ key, quantity });
  }, [updateCartMutation]);

  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  const fetchCartFromServer = useCallback(() => {
    refetchCart();
  }, [refetchCart]);

  // Add a custom item locally (used for loyalty free products)
  const addCustomItem = useCallback((product: CartProduct, quantity = 1) => {
    const customItem: any = {
      id: product.id,
      key: `reward_${product.id}_${Date.now()}`,
      name: product.name,
      quantity,
      price: product.price,
      images: product.images || [],
      description: product.description || '',
      category: product.category || 'Reward',
      stock: product.stock || 999,
      brand: product.brand || '',
      tags: product.tags || ['reward'],
    };
    dispatch(addToCart(customItem));
  }, [dispatch]);

  return {
    items,
    isOpen,
    subtotal,
    shipping,
    tax,
    total,
    itemsCount,
    isLoading,
    error,
    serverCartCount,
    serverCartTotal,
    addItem,
    removeItem,
    updateItemQuantity,
    clear,
    toggle,
    fetchCartFromServer,
    addCustomItem,
    addToCartMutation,
    updateCartMutation,
    removeFromCartMutation,
  };
};