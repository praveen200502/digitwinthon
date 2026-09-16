'use client';

export interface LoadingSkeletonProps {
  count?: number;
  variant?: 'card' | 'row' | 'text';
}

export default function LoadingSkeleton({
  count = 3,
  variant = 'card',
}: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full animate-pulse"></div>
      ))}
    </div>
  );
}
