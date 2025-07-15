import Skeleton from '@/components/common/Skeleton';

/**
 * Loading component - Displays skeleton loaders for the account/profile page while data is loading.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center gap-6 mb-6">
          <Skeleton width="80px" height="80px" borderRadius="50%" />
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Skeleton width="70%" height="28px" />
            <Skeleton width="50%" height="18px" />
            <Skeleton width="40%" height="14px" />
          </div>
        </div>
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="80px" borderRadius="16px" />
          ))}
        </div>
        {/* Tabs Skeleton */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="100px" height="32px" borderRadius="8px" />
          ))}
        </div>
        {/* Tab Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton height="180px" borderRadius="16px" />
          <Skeleton height="180px" borderRadius="16px" />
        </div>
      </div>
    </div>
  );
} 