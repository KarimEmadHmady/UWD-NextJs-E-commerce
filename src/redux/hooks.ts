// src/redux/hooks.ts
/**
 * Custom Redux hooks for typed useDispatch and useSelector.
 * useAppDispatch: returns the app's dispatch function.
 * useAppSelector: returns a typed selector for the app's state.
 */
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
 
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 