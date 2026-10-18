import React from 'react';

export const Skeleton = ({ className = '', rounded = 'rounded-xl' }) => {
  return (
    <div
      className={`skeleton-shimmer bg-slate-200 dark:bg-slate-800 ${rounded} ${className}`}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
      <Skeleton className="w-full h-48 rounded-xl" />
      <div className="flex justify-between items-center mt-1">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-12 h-4" />
      </div>
      <Skeleton className="w-full h-5" />
      <Skeleton className="w-2/3 h-5" />
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-9 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export default Skeleton;
