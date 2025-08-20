// src/redux/features/loyalty/loyaltySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LoyaltyRewardType = 'discount' | 'freeShipping' | 'product';

export interface RedeemedReward {
  id: string;
  name: string;
  type: LoyaltyRewardType;
  pointsCost: number;
  value?: number; // used for discount amount
  isPercent?: boolean;
  image?: string;
  productId?: number;
  redeemedAt: string;
  orderId?: string;
}

export interface LoyaltyState {
  currentUserId: string;
  points: number;
  redeemed: RedeemedReward[];
  lastOrderId?: string;
  lastOrderAt?: string;
  sessionRedeemed: RedeemedReward[];
}

const readLoyaltyForUser = (userId: string): Pick<LoyaltyState, 'points' | 'redeemed'> | null => {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(`loyalty_state_${userId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { points: number; redeemed: any[] };
    const safeRedeemed: RedeemedReward[] = Array.isArray(parsed.redeemed)
      ? parsed.redeemed.map((r) => ({
          id: r.id,
          name: r.name,
          type: r.type,
          pointsCost: r.pointsCost ?? 0,
          value: r.value,
          image: r.image,
          productId: r.productId,
          redeemedAt: r.redeemedAt && !isNaN(Date.parse(r.redeemedAt))
            ? r.redeemedAt
            : new Date().toISOString(),
        }))
      : [];
    return { points: parsed.points ?? 0, redeemed: safeRedeemed };
  } catch {
    return null;
  }
};

const readSessionForUser = (userId: string): RedeemedReward[] => {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(`loyalty_session_${userId}`);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr as RedeemedReward[];
  } catch { return []; }
};

const persistState = (state: LoyaltyState) => {
  try {
    if (typeof window === 'undefined') return;
    const key = `loyalty_state_${state.currentUserId || 'guest'}`;
    const payload = { points: state.points, redeemed: state.redeemed };
    window.localStorage.setItem(key, JSON.stringify(payload));
    const sessionKey = `loyalty_session_${state.currentUserId || 'guest'}`;
    window.localStorage.setItem(sessionKey, JSON.stringify(state.sessionRedeemed || []));
  } catch {}
};

const initialState: LoyaltyState = {
  currentUserId: 'guest',
  points: 300,
  redeemed: [],
  lastOrderId: undefined,
  lastOrderAt: undefined,
  sessionRedeemed: [],
};

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    setActiveUser: (state, action: PayloadAction<string | null | undefined>) => {
      const userId = action.payload || 'guest';
      state.currentUserId = userId;
      const loaded = readLoyaltyForUser(userId);
      if (loaded) {
        state.points = loaded.points;
        state.redeemed = loaded.redeemed;
      } else {
        state.points = 300;
        state.redeemed = [];
      }
      state.sessionRedeemed = readSessionForUser(userId);
      persistState(state);
    },
    setPoints: (state, action: PayloadAction<number>) => {
      state.points = Math.max(0, action.payload);
      persistState(state);
    },
    addPoints: (state, action: PayloadAction<number>) => {
      state.points = Math.max(0, state.points + action.payload);
      persistState(state);
    },
    redeemReward: (state, action: PayloadAction<Omit<RedeemedReward, 'redeemedAt'>>) => {
      const reward = action.payload as any;
      // Prevent duplicate of the same reward within the current session only
      const alreadyInSession = state.sessionRedeemed.some(r => r.id === reward.id);
      if (state.points >= (reward.pointsCost ?? 0) && !alreadyInSession) {
        state.points = Math.max(0, state.points - (reward.pointsCost ?? 0));
        const entry = { ...reward, redeemedAt: new Date().toISOString() } as RedeemedReward;
        state.redeemed.push(entry);
        state.sessionRedeemed.push(entry);
        persistState(state);
      }
    },
    attachOrderIdToCurrentRedeemed: (state, action: PayloadAction<string | number>) => {
      const orderId = String(action.payload);
      state.redeemed = state.redeemed.map(r => r.orderId ? r : { ...r, orderId });
      state.lastOrderId = orderId;
      state.lastOrderAt = new Date().toISOString();
      // clear session after order placement
      state.sessionRedeemed = [];
      persistState(state);
    },
    unredeemReward: (state, action: PayloadAction<string>) => {
      // only allow undo for current session (before order)
      const sessionIndex = state.sessionRedeemed.findIndex(r => r.id === action.payload);
      if (sessionIndex === -1) return;
      const reward = state.sessionRedeemed[sessionIndex];
      // restore points
      state.points = Math.max(0, state.points + (reward.pointsCost || 0));
      // remove one matching pending (no orderId) from full history
      const fullIdx = state.redeemed.findIndex(r => r.id === reward.id && !r.orderId);
      if (fullIdx !== -1) {
        state.redeemed.splice(fullIdx, 1);
      }
      // remove from session list
      state.sessionRedeemed.splice(sessionIndex, 1);
      persistState(state);
    },
    clearRedeemed: (state) => {
      state.redeemed = [];
      persistState(state);
    },
  },
});

export const { setActiveUser, setPoints, addPoints, redeemReward, unredeemReward, clearRedeemed, attachOrderIdToCurrentRedeemed } = loyaltySlice.actions;
export default loyaltySlice.reducer;


