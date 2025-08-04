// src/types/language.d.ts
export interface Language {
  code: string;
  name: string;
  native_name: string;
  flag?: string;
  direction: 'ltr' | 'rtl';
}

export interface LanguageState {
  current: string;
  available: Language[];
  messages: Record<string, any>;
} 