import { RootState } from '../../store';

// Basic selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

// Location check selectors
export const selectLocationCheckLoading = (state: RootState) => state.auth.locationCheck.loading;
export const selectLocationCheckError = (state: RootState) => state.auth.locationCheck.error;
export const selectIsWithinCoverage = (state: RootState) => state.auth.locationCheck.isWithinCoverage;

// Registration selectors
export const selectRegistrationLoading = (state: RootState) => state.auth.registration.loading;
export const selectRegistrationError = (state: RootState) => state.auth.registration.error;
export const selectRegistrationSuccess = (state: RootState) => state.auth.registration.success;

// Combined selectors
export const selectAuthState = (state: RootState) => state.auth;
// Location info from user
export const selectUserLocation = (state: RootState) => state.auth.user ? {
  lat: state.auth.user.lat,
  long: state.auth.user.long,
  city: state.auth.user.city,
  states: state.auth.user.states,
  address: `${state.auth.user.city}, ${state.auth.user.states}`
} : null; 