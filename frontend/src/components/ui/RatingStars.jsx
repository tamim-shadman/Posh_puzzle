import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, size = 'sm', showScore = true, count, className = '' }) => {
  const stars = [1, 2, 3, 4, 5];
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-amber-400">
        {stars.map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;

          return (
            <Star
              key={star}
              className={`${sizeMap[size]} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          ({count})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
