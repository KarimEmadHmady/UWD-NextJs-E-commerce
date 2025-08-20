// src/redux/features/loyalty/loyaltySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LoyaltyRewardType = 'discount' | 'freeShipping' | 'product';

export interface RedeemedReward {
  id: string;
  name: string;
  type: LoyaltyRewardType;
  pointsCost: number;
  value?: number; // used for discount amount
}

export interface LoyaltyState {
  points: number;
  redeemed: RedeemedReward[];
}

const loadState = (): LoyaltyState | null => {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem('loyalty_state');
    if (!raw) return null;
    return JSON.parse(raw) as LoyaltyState;
  } catch {
    return null;
  }
};

const persistState = (state: LoyaltyState) => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('loyalty_state', JSON.stringify(state));
  } catch {}
};

const initialState: LoyaltyState = loadState() || {
  points: 1250,
  redeemed: [],
};

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    setPoints: (state, action: PayloadAction<number>) => {
      state.points = Math.max(0, action.payload);
      persistState(state);
    },
    addPoints: (state, action: PayloadAction<number>) => {
      state.points = Math.max(0, state.points + action.payload);
      persistState(state);
    },
    redeemReward: (state, action: PayloadAction<RedeemedReward>) => {
      const reward = action.payload;
      if (state.points >= reward.pointsCost && !state.redeemed.some(r => r.id === reward.id)) {
        state.points -= reward.pointsCost;
        state.redeemed.push(reward);
        persistState(state);
      }
    },
    clearRedeemed: (state) => {
      state.redeemed = [];
      persistState(state);
    },
  },
});

export const { setPoints, addPoints, redeemReward, clearRedeemed } = loyaltySlice.actions;
export default loyaltySlice.reducer;


