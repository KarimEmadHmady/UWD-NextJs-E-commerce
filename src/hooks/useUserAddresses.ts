import { useEffect, useState } from 'react';
import { fetchUserAddresses } from '@/services/addressService';

export function useUserAddresses(token: string | null) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchUserAddresses(token)
      .then(data => {
        setAddresses(Array.isArray(data) ? data : data.addresses || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch addresses');
        setLoading(false);
      });
  }, [token]);

  return { addresses, loading, error };
} 