import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => {
  return (
    <div
      role="status"
      aria-label="Loading page content"
      className="min-h-[60vh] flex flex-col items-center justify-center p-8"
    >
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin absolute" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse tracking-wide">
        Curating Luxury Experience...
      </p>
    </div>
  );
};

export default LoadingFallback;
