import { RootState } from '../../store';

export const selectAddresses = (state: RootState) => state.address.addresses;
export const selectDefaultAddress = (state: RootState) => state.address.addresses.find(addr => addr.isDefault);
export const selectAddressLoading = (state: RootState) => state.address.loading;
export const selectAddressError = (state: RootState) => state.address.error; 