// src/redux/features/loyalty/loyaltySelectors.ts
import type { RootState } from '@/redux/store';

export const selectLoyaltyPoints = (state: RootState) => state.loyalty.points;
export const selectRedeemedRewards = (state: RootState) => state.loyalty.redeemed;
export const selectLoyaltyUserId = (state: RootState) => state.loyalty.currentUserId;
export const selectSessionRedeemedRewards = (state: RootState) => state.loyalty.sessionRedeemed;


