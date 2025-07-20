import { useSelector } from 'react-redux';
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
  const address = useSelector(selectCheckoutAddress);
  const shippingMethod = useSelector(selectCheckoutShippingMethod);
  const paymentMethod = useSelector(selectCheckoutPaymentMethod);
  const review = useSelector(selectCheckoutReview);

  return { address, shippingMethod, paymentMethod, review };
}; 