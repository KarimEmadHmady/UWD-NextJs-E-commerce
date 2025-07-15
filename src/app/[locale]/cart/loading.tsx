import Skeleton from '@/components/common/Skeleton';

/**
 * Loading component - Displays skeleton loaders for cart items and summary while data is loading.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white rounded-xl shadow">
                <Skeleton width="100px" height="100px" borderRadius="12px" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton width="60%" height="20px" />
                  <Skeleton width="40%" height="16px" />
                  <Skeleton width="30%" height="16px" />
                  <Skeleton width="80%" height="16px" />
                </div>
              </div>
            ))}
            <Skeleton width="180px" height="40px" borderRadius="8px" className="mt-4" />
          </div>
          {/* Cart Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white rounded-xl shadow flex flex-col gap-4">
              <Skeleton width="60%" height="24px" />
              <Skeleton width="40%" height="18px" />
              <Skeleton width="80%" height="18px" />
              <Skeleton width="100%" height="40px" borderRadius="8px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 