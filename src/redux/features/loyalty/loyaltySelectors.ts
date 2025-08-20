// src/redux/features/loyalty/loyaltySelectors.ts
import type { RootState } from '@/redux/store';

export const selectLoyaltyPoints = (state: RootState) => state.loyalty.points;
export const selectRedeemedRewards = (state: RootState) => state.loyalty.redeemed;


