import { useSelector } from 'react-redux';
import { selectSearchQuery, selectSearchResults, selectSearchLoading, selectSearchError } from '../redux/features/search/searchSelectors';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../redux/features/search/searchSlice';

/**
 * Custom hook for managing search state and recent searches.
 * Handles search query, results, loading, error, and syncing recent searches with localStorage.
 */
export const useSearch = () => {
  const query = useSelector(selectSearchQuery);
  const results = useSelector(selectSearchResults);
  const loading = useSelector(selectSearchLoading);
  const error = useSelector(selectSearchError);
  const dispatch = useDispatch();

  // Sync recent searches to localStorage when query changes
  useEffect(() => {
    if (query && query.trim() !== '') {
      let history = [];
      try {
        history = JSON.parse(localStorage.getItem('search_history') || '[]');
      } catch {}
      history = history.filter((item: string) => item !== query);
      history.unshift(query);
      history = history.slice(0, 5);
      localStorage.setItem('search_history', JSON.stringify(history));
    }
  }, [query]);

  const getRecentSearches = (): string[] => {
    try {
      return JSON.parse(localStorage.getItem('search_history') || '[]');
    } catch {
      return [];
    }
  };

  const setQuery = (q: string) => {
    dispatch(setSearchQuery(q));
  };

  return { query, results, loading, error, setQuery, getRecentSearches };
}; 