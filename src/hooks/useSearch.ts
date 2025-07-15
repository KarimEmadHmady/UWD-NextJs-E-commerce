import { useSelector } from 'react-redux';
import { selectSearchQuery, selectSearchResults, selectSearchLoading, selectSearchError } from '../redux/features/search/searchSelectors';

export const useSearch = () => {
  const query = useSelector(selectSearchQuery);
  const results = useSelector(selectSearchResults);
  const loading = useSelector(selectSearchLoading);
  const error = useSelector(selectSearchError);

  return { query, results, loading, error };
}; 