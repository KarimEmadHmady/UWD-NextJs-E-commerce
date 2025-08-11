"use client";
import { useGlobalLoading } from '@/hooks/useGlobalLoading';

export default function GlobalLoadingOverlay() {
  const { loading } = useGlobalLoading();
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 border-4 bg-white shadow-lg" />
    </div>
  );
} 