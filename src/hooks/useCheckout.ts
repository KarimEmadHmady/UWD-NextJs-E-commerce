import { useSelector } from 'react-redux';
import {
  selectCheckoutAddress,
  selectCheckoutShippingMethod,
  selectCheckoutPaymentMethod,
  selectCheckoutReview,
} from '../redux/features/checkout/checkoutSelectors';

export const useCheckout = () => {
  const address = useSelector(selectCheckoutAddress);
  const shippingMethod = useSelector(selectCheckoutShippingMethod);
  const paymentMethod = useSelector(selectCheckoutPaymentMethod);
  const review = useSelector(selectCheckoutReview);

  return { address, shippingMethod, paymentMethod, review };
}; 