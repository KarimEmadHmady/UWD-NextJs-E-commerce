import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLang } from '@/redux/features/lang/langSlice';
import { selectLang } from '@/redux/features/lang/langSelectors';

export const useLang = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLang);

  //  localStorage <-> Redux
  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored && (stored === 'ar' || stored === 'en')) {
      if (lang !== stored) {
        dispatch(setLang(stored as 'ar' | 'en'));
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const changeLang = useCallback((newLang: 'ar' | 'en') => {
    dispatch(setLang(newLang));
  }, [dispatch]);

  return { lang, setLang: changeLang };
}; 