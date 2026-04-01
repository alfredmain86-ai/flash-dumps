'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label={`Rating: ${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform p-0.5`}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`${starSize} ${
              star <= value
                ? 'fill-[#FFB800] text-[#FFB800]'
                : 'fill-transparent text-white/20'
            }`}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}
