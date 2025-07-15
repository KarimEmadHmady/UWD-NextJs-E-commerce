import Skeleton from '@/components/common/Skeleton';

/**
 * Loading component - Displays skeleton loaders for wishlist items while data is loading.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow">
              <Skeleton height="160px" borderRadius="16px" />
              <Skeleton width="60%" height="20px" />
              <Skeleton width="40%" height="16px" />
              <Skeleton width="80%" height="16px" />
              <Skeleton width="100px" height="36px" borderRadius="8px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 