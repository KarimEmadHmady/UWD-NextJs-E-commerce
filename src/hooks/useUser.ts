import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginUser, fetchUser, logoutUser } from '@/redux/features/user/userSlice';
import { selectUser, selectIsAuthenticated, selectUserLoading, selectUserError } from '@/redux/features/user/userSelectors';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  const login = (email: string, password: string) => dispatch(loginUser({ email, password }));
  const fetch = () => dispatch(fetchUser());
  const logout = () => dispatch(logoutUser());

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    fetch,
    logout,
  };
}; 