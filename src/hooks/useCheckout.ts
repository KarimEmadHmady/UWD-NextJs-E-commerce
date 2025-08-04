import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from './useNotifications';
import { createOrderApi } from '@/services/orderService';
import type { CheckoutRequest } from '@/types';
import {
  selectCheckoutAddress,
  selectCheckoutShippingMethod,
  selectCheckoutPaymentMethod,
  selectCheckoutReview,
} from '../redux/features/checkout/checkoutSelectors';

/**
 * Custom hook for managing checkout state and actions.
 * Provides address, shipping, payment, and review info for checkout process.
 */
export const useCheckout = () => {
  const { notify } = useNotifications();
  const address = useSelector(selectCheckoutAddress);
  const shippingMethod = useSelector(selectCheckoutShippingMethod);
  const paymentMethod = useSelector(selectCheckoutPaymentMethod);
  const review = useSelector(selectCheckoutReview);

  // Mutation for creating order
  const createOrderMutation = useMutation({
    mutationFn: (checkoutData: CheckoutRequest) => createOrderApi(checkoutData),
    onSuccess: (data) => {
      notify('success', data.message);
      // Redirect to payment URL or order confirmation
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    },
    onError: (error: any) => {
      notify('error', 'Failed to create order');
      console.error('Checkout error:', error);
    },
  });

  const createOrder = (checkoutData: CheckoutRequest) => {
    createOrderMutation.mutate(checkoutData);
  };

  return { 
    address, 
    shippingMethod, 
    paymentMethod, 
    review,
    createOrder,
    createOrderMutation
  };
}; 