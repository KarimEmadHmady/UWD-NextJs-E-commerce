import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLang } from '@/redux/features/lang/langSlice';
import { selectLang } from '@/redux/features/lang/langSelectors';

/**
 * Custom hook for managing language state and switching between languages.
 * Handles syncing language with localStorage and Redux.
 */
export const useLang = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLang);

  // Sync language from localStorage to Redux on mount
  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored && (stored === 'ar' || stored === 'en')) {
      if (lang !== stored) {
        dispatch(setLang(stored as 'ar' | 'en'));
      }
    }
    // eslint-disable-next-line
  }, []);

  // Sync language from Redux to localStorage on change
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const changeLang = useCallback((newLang: 'ar' | 'en') => {
    dispatch(setLang(newLang));
  }, [dispatch]);

  return { lang, setLang: changeLang };
}; 