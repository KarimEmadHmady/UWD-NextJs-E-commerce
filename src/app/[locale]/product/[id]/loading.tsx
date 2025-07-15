import Skeleton from '@/components/common/Skeleton';

/**
 * Loading component - Displays skeleton loaders for product details while data is loading.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow p-8 flex flex-col md:flex-row gap-8">
        {/* Image Skeleton */}
        <Skeleton width="320px" height="320px" borderRadius="20px" className="mx-auto md:mx-0" />
        <div className="flex-1 flex flex-col gap-4">
          <Skeleton width="60%" height="32px" />
          <Skeleton width="30%" height="24px" />
          <Skeleton width="80%" height="20px" />
          <Skeleton width="90%" height="16px" />
          <Skeleton width="70%" height="16px" />
          <div className="flex gap-2 mt-4">
            <Skeleton width="120px" height="40px" borderRadius="8px" />
            <Skeleton width="120px" height="40px" borderRadius="8px" />
          </div>
        </div>
      </div>
    </div>
  );
} 