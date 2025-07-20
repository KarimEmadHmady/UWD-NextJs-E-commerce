import { useSelector, useDispatch } from 'react-redux';
import {
  selectAddresses,
  selectDefaultAddress,
  selectAddressLoading,
  selectAddressError
} from '@/redux/features/address/addressSelectors';
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  setAddresses
} from '@/redux/features/address/addressSlice';
import { Address } from '@/redux/features/address/addressSlice';
import { useEffect } from 'react';

/**
 * Custom hook for managing user addresses state and actions.
 * Handles adding, updating, removing, setting default, and syncing with localStorage.
 */
export const useAddress = () => {
  const addresses = useSelector(selectAddresses);
  const defaultAddress = useSelector(selectDefaultAddress);
  const loading = useSelector(selectAddressLoading);
  const error = useSelector(selectAddressError);
  const dispatch = useDispatch();

  // Sync addresses from localStorage to Redux on mount
  useEffect(() => {
    if (addresses.length === 0) {
      const stored = localStorage.getItem('addresses');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            dispatch(setAddresses(parsed));
          }
        } catch {}
      }
    }
    // eslint-disable-next-line
  }, []);

  // Sync addresses from Redux to localStorage on change
  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  const add = (address: Address) => dispatch(addAddress(address));
  const update = (address: Address) => dispatch(updateAddress(address));
  const remove = (id: string) => dispatch(deleteAddress(id));
  const setDefault = (id: string) => dispatch(setDefaultAddress(id));
  const setAll = (addresses: Address[]) => dispatch(setAddresses(addresses));

  return {
    addresses,
    defaultAddress,
    loading,
    error,
    add,
    update,
    remove,
    setDefault,
    setAll,
  };
}; 