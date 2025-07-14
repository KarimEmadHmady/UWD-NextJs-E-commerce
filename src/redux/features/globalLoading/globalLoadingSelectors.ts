import { RootState } from '../../store';

export const selectGlobalLoading = (state: RootState) => state.globalLoading.loading; 