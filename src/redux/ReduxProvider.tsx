'use client';
// src/redux/ReduxProvider.tsx
import { Provider } from 'react-redux';
import { store } from './store';
 
/**
 * ReduxProvider component - Wraps the app with Redux Provider to enable global state management.
 */
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
} 