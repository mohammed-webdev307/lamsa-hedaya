import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/whatsapp';
import { useStore } from '@/store/StoreContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInWishlist, toggleWishlist } = useStore();
  const navigate = useNavigate();
  const inWishlist = isInWishlist(product.id);

  const badgeConfig: Record<string, { label: string; className: string }> = {
    new: { label: 'جديد', className: 'bg-sage-400 text-white' },
    bestseller: { label: 'الأكثر طلبًا', className: 'bg-gold-400 text-brown-900' },
    sale: { label: 'تخفيض', className: 'bg-rose-400 text-white' },
  };

  return (
    <div className="card-lux group flex flex-col h-full">
      {/* Image */}
      <div
        className="relative overflow-hidden aspect-square cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && badgeConfig[product.badge] && (
          <span className={`badge absolute top-2 right-2 sm:top-3 sm:right-3 ${badgeConfig[product.badge].className}`}>
            {badgeConfig[product.badge].label}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-all hover:bg-white hover:scale-110 active:scale-95"
          aria-label={inWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart
            className={`transition-colors ${inWishlist ? 'fill-rose-400 text-rose-400' : 'text-brown-400'}`}
            size={16}
          />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-brown-900/40 flex items-center justify-center">
            <span className="badge bg-white text-brown-700 text-sm px-4 py-2">نفد المخزون</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        {/* Rating - compact on mobile */}
        <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
          <Star className="fill-gold-400 text-gold-400 shrink-0" size={14} />
          <span className="text-xs sm:text-sm text-brown-400 font-medium">{product.rating}</span>
          <span className="text-[10px] sm:text-xs text-brown-300">({product.reviewsCount})</span>
        </div>

        {/* Name */}
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-bold text-brown-700 text-sm sm:text-base mb-1 hover:text-gold-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description - hidden on very small screens to save space */}
        <p className="text-xs sm:text-sm text-brown-400 line-clamp-2 mb-2 sm:mb-3 flex-1 hidden sm:block">
          {product.shortDescription}
        </p>
        <p className="text-xs text-brown-400 line-clamp-1 mb-2 flex-1 sm:hidden">
          {product.shortDescription}
        </p>

        {/* Price - prominent */}
        <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
          <span className="text-base sm:text-lg font-bold text-brown-700">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs sm:text-sm text-brown-300 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        {/* Buttons - stacked on mobile, side by side on desktop */}
        <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 mt-auto">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="w-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium border border-brown-300 text-brown-600 rounded-lg transition-all hover:bg-brown-50 hover:border-brown-500 active:scale-95"
          >
            عرض التفاصيل
          </button>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="w-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium bg-brown-500 text-cream-50 rounded-lg transition-all hover:bg-brown-600 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={15} />
            أضف للسلة
          </button>
        </div>
      </div>
    </div>
  );
}
