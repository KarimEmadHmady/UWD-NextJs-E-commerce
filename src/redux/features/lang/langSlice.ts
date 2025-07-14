import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LangState {
  lang: 'ar' | 'en';
}

const initialState: LangState = {
  lang: 'en',
};

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<'ar' | 'en'>) => {
      state.lang = action.payload;
    },
  },
});

export const { setLang } = langSlice.actions;
export default langSlice.reducer; 