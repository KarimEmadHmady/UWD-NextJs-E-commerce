import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLang } from '@/redux/features/lang/langSlice';
import { selectLang } from '@/redux/features/lang/langSelectors';

export const useLang = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLang);

  const changeLang = useCallback((newLang: 'ar' | 'en') => {
    dispatch(setLang(newLang));
  }, [dispatch]);

  return { lang, setLang: changeLang };
}; 