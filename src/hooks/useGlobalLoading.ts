import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { startLoading, stopLoading, setLoading } from '@/redux/features/globalLoading/globalLoadingSlice';
import { selectGlobalLoading } from '@/redux/features/globalLoading/globalLoadingSelectors';

export const useGlobalLoading = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectGlobalLoading);

  const start = () => dispatch(startLoading());
  const stop = () => dispatch(stopLoading());
  const set = (value: boolean) => dispatch(setLoading(value));

  return {
    loading,
    start,
    stop,
    set,
  };
}; 