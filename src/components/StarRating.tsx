import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
}

export default function StarRating({ rating, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating);
        const half = !filled && star <= Math.ceil(rating) && rating % 1 >= 0.5;
        return (
          <Star
            key={star}
            size={size}
            className={
              filled
                ? 'fill-gold-400 text-gold-400'
                : half
                  ? 'fill-gold-200 text-gold-300'
                  : 'fill-beige-200 text-beige-300'
            }
          />
        );
      })}
    </div>
  );
}
