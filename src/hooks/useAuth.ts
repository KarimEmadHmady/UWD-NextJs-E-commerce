import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { 
  checkLocationAsync, 
  registerUserAsync,
  loginUserAsync,
  loadUserFromStorage,
  clearLocationError,
  clearRegistrationError,
  setUserLocation,
  logout
} from '@/redux/features/auth/authSlice';
import { 
  selectUser,
  selectIsAuthenticated,
  selectLocationCheckLoading,
  selectLocationCheckError,
  selectIsWithinCoverage,
  selectRegistrationLoading,
  selectRegistrationError,
  selectRegistrationSuccess,
  selectUserLocation
} from '@/redux/features/auth/authSelectors';
import { LocationData } from '@/services/authService';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  // تحميل المستخدم من localStorage عند أول تحميل
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // Selectors
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const locationCheckLoading = useSelector(selectLocationCheckLoading);
  const locationCheckError = useSelector(selectLocationCheckError);
  const isWithinCoverage = useSelector(selectIsWithinCoverage);
  const registrationLoading = useSelector(selectRegistrationLoading);
  const registrationError = useSelector(selectRegistrationError);
  const registrationSuccess = useSelector(selectRegistrationSuccess);
  const userLocation = useSelector(selectUserLocation);

  // lat/long from first address if available
  let userLatLong: { lat: number; long: number } | null = null;
  if (user) {
    const addr = (user.addresses && user.addresses[0]) || (user.adresses && user.adresses[0]);
    if (addr && typeof addr.lat === 'number' && typeof addr.long === 'number') {
      userLatLong = { lat: addr.lat, long: addr.long };
    }
  }

  // Actions
  const checkLocation = (location: LocationData) => {
    return dispatch(checkLocationAsync(location));
  };

  const registerUser = (userData: {
    username: string;
    email: string;
    password: string;
    phone_number: string;
    city: string;
    states: string;
    lat: number;
    long: number;
    address: string;
    address_1?: string;
  }) => {
    return dispatch(registerUserAsync(userData));
  };

  const login = (loginData: { username: string; password: string }) => {
    return dispatch(loginUserAsync(loginData));
  };

  const clearLocationErrorAction = () => {
    dispatch(clearLocationError());
  };

  const clearRegistrationErrorAction = () => {
    dispatch(clearRegistrationError());
  };

  const setUserLocationAction = (location: { lat: number; long: number; city: string; states: string }) => {
    dispatch(setUserLocation(location));
  };

  const logoutAction = () => {
    dispatch(logout());
  };

  return {
    // State
    user, // يحتوي على address
    isAuthenticated,
    locationCheckLoading,
    locationCheckError,
    isWithinCoverage,
    registrationLoading,
    registrationError,
    registrationSuccess,
    userLocation,
    userLatLong, // أضف هذا

    // Actions
    checkLocation,
    registerUser,
    login,
    clearLocationError: clearLocationErrorAction,
    clearRegistrationError: clearRegistrationErrorAction,
    setUserLocation: setUserLocationAction,
    logout: logoutAction,
  };
}; 