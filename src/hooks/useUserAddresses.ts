import { useEffect, useState, useCallback } from 'react';
import { fetchUserAddresses } from '@/services/addressService';

function normalizeAddresses(addresses: any[]): any[] {
  return addresses.map(addr => {
    const keys = Object.keys(addr);
    // إذا كان فيه مفتاح رقمي (مثل "0")، استخدمه
    if (keys.length === 2 && keys.includes("0")) {
      return { ...addr["0"], id: addr.id || addr["0"].id };
    }
    return addr;
  });
}

export function useUserAddresses(token: string | null) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetchUserAddresses(token)
      .then(data => {
        // Normalize addresses before setting
        const normalized = Array.isArray(data) ? normalizeAddresses(data) : normalizeAddresses(data.addresses || []);
        setAddresses(normalized);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch addresses');
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return { addresses, loading, error, refetch: fetchAddresses };
} 