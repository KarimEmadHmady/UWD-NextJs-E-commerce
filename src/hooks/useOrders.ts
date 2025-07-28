import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/services/orderService';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '@/redux/features/order/orderSlice';
import { selectOrders } from '@/redux/features/order/orderSelectors';

export default function useOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const createOrder = (order: any) => {
    dispatch(addOrder(order));
  };
  return {
    orders,
    createOrder,
  };
} 