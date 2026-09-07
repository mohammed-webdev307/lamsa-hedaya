import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, Minus, Plus, MessageCircle, ShoppingBag, Check, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { PRODUCTS, WRAPPING_COLORS, OCCASIONS } from '@/data/store';
import { formatPrice, buildWhatsAppUrl, buildProductWhatsAppMessage, getDefaultCustomization } from '@/utils/whatsapp';
import { useStore } from '@/store/StoreContext';
import Breadcrumbs from '@/components/Breadcrumbs';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';
import type { ProductCustomization } from '@/types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === Number(id));
  const { addToCart, isInWishlist, toggleWishlist } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [customization, setCustomization] = useState<ProductCustomization>(getDefaultCustomization());

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brown-700 mb-4">المنتج غير موجود</h2>
          <button onClick={() => navigate('/products')} className="btn-primary">
            العودة للمنتجات
          </button>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, customization);
  };

  const handleWhatsAppOrder = () => {
    const message = buildProductWhatsAppMessage(product, quantity, customization);
    window.open(buildWhatsAppUrl(message), '_blank');
  };

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="container-lux">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'المنتجات', to: '/products' },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
          {/* Gallery */}
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-square mb-4 bg-cream-100">
              <img
                src={product.gallery[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="badge absolute top-4 right-4 bg-gold-400 text-brown-900">
                  {product.badge === 'new' ? 'جديد' : product.badge === 'bestseller' ? 'الأكثر طلبًا' : 'تخفيض'}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    activeImage === idx ? 'border-gold-400 ring-1 ring-gold-400' : 'border-beige-200 hover:border-gold-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={product.rating} size={18} />
              <span className="text-sm text-brown-400 font-medium">{product.rating}</span>
              <span className="text-sm text-brown-300">({product.reviewsCount} تقييم)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-brown-700 mb-3">{product.name}</h1>
            <p className="text-brown-400 mb-4">{product.shortDescription}</p>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-brown-700">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-lg text-brown-300 line-through">{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-sage-500">
                  <Check size={16} />
                  متوفر في المخزون
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-medium text-rose-400">
                  <Minus size={16} />
                  نفد المخزون
                </span>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-brown-500">
                  <Check size={16} className="text-sage-400 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="label-lux">الكمية</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-beige-200 rounded-lg text-brown-600 hover:bg-cream-100 transition-all active:scale-95"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-brown-700 text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-beige-200 rounded-lg text-brown-600 hover:bg-cream-100 transition-all active:scale-95"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Customization */}
            <div className="bg-cream-50 rounded-2xl p-5 mb-6 border border-beige-100">
              <h3 className="font-bold text-brown-700 mb-4">خيارات التخصيص</h3>

              <div className="space-y-4">
                {/* Wrapping Color */}
                <div>
                  <label className="label-lux">لون التغليف</label>
                  <div className="flex flex-wrap gap-2">
                    {WRAPPING_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setCustomization((c) => ({ ...c, wrappingColor: color.id }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                          customization.wrappingColor === color.id
                            ? 'border-gold-400 bg-gold-50'
                            : 'border-beige-200 hover:border-gold-300'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-beige-300"
                          style={{ backgroundColor: color.color }}
                        />
                        <span className="text-sm text-brown-600">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient Name */}
                <div>
                  <label className="label-lux">اسم الشخص</label>
                  <input
                    type="text"
                    value={customization.recipientName}
                    onChange={(e) => setCustomization((c) => ({ ...c, recipientName: e.target.value }))}
                    placeholder="اكتب اسم الشخص المراد إهداء الهدية له"
                    className="input-lux"
                  />
                </div>

                {/* Gift Message */}
                <div>
                  <label className="label-lux">رسالة الإهداء</label>
                  <textarea
                    value={customization.giftMessage}
                    onChange={(e) => setCustomization((c) => ({ ...c, giftMessage: e.target.value }))}
                    placeholder="اكتب رسالتك التي ستُرفق مع الهدية"
                    rows={2}
                    className="input-lux resize-none"
                  />
                </div>

                {/* Occasion */}
                <div>
                  <label className="label-lux">المناسبة</label>
                  <select
                    value={customization.occasion}
                    onChange={(e) => setCustomization((c) => ({ ...c, occasion: e.target.value }))}
                    className="input-lux cursor-pointer"
                  >
                    <option value="">اختر المناسبة</option>
                    {OCCASIONS.map((occ) => (
                      <option key={occ.id} value={occ.name}>
                        {occ.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="label-lux">ملاحظات إضافية</label>
                  <textarea
                    value={customization.notes}
                    onChange={(e) => setCustomization((c) => ({ ...c, notes: e.target.value }))}
                    placeholder="أي ملاحظات أخرى تريد إضافتها"
                    rows={2}
                    className="input-lux resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                أضف إلى السلة
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`px-4 py-3 rounded-lg border-2 transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  inWishlist
                    ? 'border-rose-300 bg-rose-50 text-rose-400'
                    : 'border-beige-200 text-brown-500 hover:border-rose-300 hover:text-rose-400'
                }`}
              >
                <Heart size={18} className={inWishlist ? 'fill-rose-400' : ''} />
                {inWishlist ? 'في المفضلة' : 'أضف للمفضلة'}
              </button>
            </div>

            <button onClick={handleWhatsAppOrder} className="btn-whatsapp w-full">
              <MessageCircle size={18} />
              اطلب عبر واتساب
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-beige-100">
              <div className="text-center">
                <Truck size={24} className="text-gold-500 mx-auto mb-1" />
                <p className="text-xs text-brown-400">توصيل سريع</p>
              </div>
              <div className="text-center">
                <ShieldCheck size={24} className="text-gold-500 mx-auto mb-1" />
                <p className="text-xs text-brown-400">جودة مضمونة</p>
              </div>
              <div className="text-center">
                <RotateCcw size={24} className="text-gold-500 mx-auto mb-1" />
                <p className="text-xs text-brown-400">تغليف فاخر</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 bg-cream-50 rounded-2xl p-6 sm:p-8 border border-beige-100">
          <h2 className="text-xl font-bold text-brown-700 mb-4">وصف المنتج</h2>
          <p className="text-brown-500 leading-relaxed text-base">{product.description}</p>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-brown-700 mb-6">منتجات مشابهة</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
