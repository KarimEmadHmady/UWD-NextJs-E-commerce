import Skeleton from '@/components/common/Skeleton';

/**
 * Loading component - Displays skeleton loaders for the checkout steps and summary while data is loading.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Steps Skeleton */}
        <div className="flex flex-col gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 bg-white rounded-xl shadow p-4">
              <Skeleton width="60px" height="60px" borderRadius="50%" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton width="40%" height="20px" />
                <Skeleton width="60%" height="16px" />
                <Skeleton width="80%" height="16px" />
              </div>
            </div>
          ))}
        </div>
        {/* Summary Skeleton */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <Skeleton width="60%" height="24px" />
          <Skeleton width="40%" height="18px" />
          <Skeleton width="80%" height="18px" />
          <Skeleton width="100%" height="40px" borderRadius="8px" />
        </div>
      </div>
    </div>
  );
} 