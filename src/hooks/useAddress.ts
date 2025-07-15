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

export const useAddress = () => {
  const addresses = useSelector(selectAddresses);
  const defaultAddress = useSelector(selectDefaultAddress);
  const loading = useSelector(selectAddressLoading);
  const error = useSelector(selectAddressError);
  const dispatch = useDispatch();

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