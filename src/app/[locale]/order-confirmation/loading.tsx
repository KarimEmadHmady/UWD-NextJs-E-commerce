import Skeleton from '@/components/common/Skeleton';

/**
 * Loading component - Displays skeleton loaders for the order confirmation page while data is loading.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow p-8 flex flex-col gap-8">
        {/* Confirmation Message Skeleton */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton width="80px" height="80px" borderRadius="50%" />
          <Skeleton width="60%" height="28px" />
          <Skeleton width="40%" height="18px" />
        </div>
        {/* Order Summary Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton width="50%" height="20px" />
          <Skeleton width="30%" height="16px" />
        </div>
        {/* Product List Skeleton */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <Skeleton width="64px" height="64px" borderRadius="12px" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton width="60%" height="16px" />
                <Skeleton width="40%" height="14px" />
              </div>
              <Skeleton width="60px" height="16px" />
            </div>
          ))}
        </div>
        {/* Total Skeleton */}
        <div className="flex justify-end">
          <Skeleton width="120px" height="32px" borderRadius="8px" />
        </div>
      </div>
    </div>
  );
} 