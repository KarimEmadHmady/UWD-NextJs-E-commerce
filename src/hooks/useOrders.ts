import { useSelector, useDispatch } from 'react-redux';
import { selectOrders, selectOrderLoading, selectOrderError } from '@/redux/features/order/orderSelectors';
import { addOrder } from '@/redux/features/order/orderSlice';

export const useOrders = () => {
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);
  const dispatch = useDispatch();

  const createOrder = (order: any) => {
    dispatch(addOrder(order));
  };

  return {
    orders,
    loading,
    error,
    createOrder,
  };
}; 