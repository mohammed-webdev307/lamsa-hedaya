import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { PRODUCTS } from '@/data/store';
import { formatPrice } from '@/utils/whatsapp';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  const wishlistProducts = wishlist
    .map((item) => PRODUCTS.find((p) => p.id === item.productId))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (wishlistProducts.length === 0) {
    return (
      <div className="pt-20 pb-12 min-h-screen">
        <div className="container-lux">
          <Breadcrumbs items={[{ label: 'الرئيسية', to: '/' }, { label: 'المفضلة' }]} />
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-cream-100 flex items-center justify-center mb-6">
              <Heart size={40} className="text-brown-300" />
            </div>
            <h2 className="text-xl font-bold text-brown-700 mb-2">قائمة المفضلة فارغة</h2>
            <p className="text-brown-400 mb-6">لم تقم بإضافة أي منتجات إلى المفضلة بعد.</p>
            <Link to="/products" className="btn-primary">
              تصفح المنتجات
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="container-lux">
        <Breadcrumbs items={[{ label: 'الرئيسية', to: '/' }, { label: 'المفضلة' }]} />

        <div className="my-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-brown-700">المفضلة</h1>
          <p className="text-brown-400 mt-2">المنتجات التي أعجبتك ({wishlistProducts.length})</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="card-lux flex flex-col">
              <Link to={`/product/${product.id}`} className="relative overflow-hidden aspect-square block">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-brown-700 hover:text-gold-500 transition-colors line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-brown-400 line-clamp-2 mb-3 flex-1">{product.shortDescription}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-brown-700">{formatPrice(product.price)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="px-3 py-2 text-sm font-medium bg-brown-500 text-cream-50 rounded-lg transition-all hover:bg-brown-600 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <ShoppingBag size={15} />
                      أضف
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="w-9 h-9 flex items-center justify-center text-rose-400 hover:bg-rose-50 rounded-lg transition-all active:scale-95"
                      aria-label="إزالة من المفضلة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
