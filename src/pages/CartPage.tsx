import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, MessageCircle, ArrowLeft, MapPin } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { formatPrice, buildWhatsAppUrl, buildCartWhatsAppMessage } from '@/utils/whatsapp';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getCurrentLanguage } from '@/lib/language';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart } = useStore();

  const [locationUrl, setLocationUrl] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('المتصفح لا يدعم تحديد الموقع');
      return;
    }

    setLocationStatus('جاري تحديد موقعك...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setLocationUrl(url);
        setLocationStatus('تم تحديد موقعك بنجاح ✅');
      },
      () => {
        setLocationStatus('تعذر تحديد الموقع، تأكد من السماح بالوصول للموقع');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleWhatsAppOrder = () => {
    let message = buildCartWhatsAppMessage(cart);
    const isEnglish = getCurrentLanguage() === 'en';

    if (customerName.trim()) {
      message += isEnglish
        ? `

👤 Customer name: ${customerName.trim()}`
        : `

👤 اسم الزبون: ${customerName.trim()}`;
    }

    if (customerPhone.trim()) {
      message += isEnglish
        ? `
📞 Phone number: ${customerPhone.trim()}`
        : `
📞 رقم الهاتف: ${customerPhone.trim()}`;
    }

    if (locationUrl) {
      message += isEnglish
        ? `
📍 Delivery location:
${locationUrl}`
        : `
📍 موقع التوصيل:
${locationUrl}`;
    }

    if (orderNotes.trim()) {
      message += isEnglish
        ? `
📝 Order notes: ${orderNotes.trim()}`
        : `
📝 ملاحظات الطلب: ${orderNotes.trim()}`;
    }

    window.open(buildWhatsAppUrl(message), '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="pt-20 pb-12 min-h-screen">
        <div className="container-lux">
          <Breadcrumbs items={[{ label: 'الرئيسية', to: '/' }, { label: 'السلة' }]} />
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-cream-100 flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-brown-300" />
            </div>
            <h2 className="text-xl font-bold text-brown-700 mb-2">سلة التسوق فارغة</h2>
            <p className="text-brown-400 mb-6">لم تقم بإضافة أي منتجات بعد. تصفح تشكيلتنا الفاخرة.</p>
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
        <Breadcrumbs items={[{ label: 'الرئيسية', to: '/' }, { label: 'السلة' }]} />

        <div className="my-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-brown-700">سلة التسوق</h1>
          <button
            onClick={clearCart}
            className="text-sm text-rose-400 hover:text-rose-500 font-medium flex items-center gap-1"
          >
            <Trash2 size={16} />
            إفراغ السلة
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl border border-beige-100 p-4 flex gap-4"
              >
                <Link to={`/product/${item.product.id}`} className="shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    loading="lazy"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-bold text-brown-700 hover:text-gold-500 transition-colors line-clamp-1">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-brown-400 line-clamp-1 mb-2">{item.product.shortDescription}</p>

                  {item.customization.wrappingColor && item.customization.wrappingColor !== 'default' && (
                    <p className="text-xs text-brown-400 mb-1">
                      لون التغليف: {item.customization.wrappingColor}
                    </p>
                  )}
                  {item.customization.recipientName && (
                    <p className="text-xs text-brown-400 mb-1">
                      الاسم: {item.customization.recipientName}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center border border-beige-200 rounded-lg text-brown-600 hover:bg-cream-100 transition-all active:scale-95 disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-brown-700 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-beige-200 rounded-lg text-brown-600 hover:bg-cream-100 transition-all active:scale-95"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-brown-700 text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-8 h-8 flex items-center justify-center text-rose-400 hover:bg-rose-50 rounded-lg transition-all active:scale-95"
                        aria-label="إزالة"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/products" className="inline-flex items-center gap-1 text-gold-600 hover:text-gold-700 font-medium text-sm transition-colors">
              <ArrowLeft size={16} />
              متابعة التسوق
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-beige-100 p-6 sticky top-24">
              <h2 className="font-bold text-brown-700 text-lg mb-4">ملخص الطلب</h2>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-brown-500 line-clamp-1">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-brown-600 font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-beige-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brown-400">Subtotal</span>
                  <span className="text-brown-600 font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-beige-100">
                  <span className="text-brown-700">Total</span>
                  <span className="text-brown-700">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-brown-600 mb-1">
                    اسم الزبون
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="اكتب اسمك"
                    className="w-full border border-beige-200 rounded-xl px-4 py-3 text-brown-700 outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-600 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="مثال: 059xxxxxxx"
                    className="w-full border border-beige-200 rounded-xl px-4 py-3 text-brown-700 outline-none focus:border-gold-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="w-full border border-beige-200 rounded-xl py-3 flex items-center justify-center gap-2 text-brown-600 hover:bg-cream-100 transition-all"
                >
                  <MapPin size={18} />
                  {locationUrl ? 'تحديث موقع التوصيل' : 'تحديد موقع التوصيل'}
                </button>

                {locationStatus && (
                  <p className="text-xs text-brown-400 text-center mt-2">
                    {locationStatus}
                  </p>
                )}

                <div>
                  <label className="block text-sm font-medium text-brown-600 mb-1">
                    ملاحظات الطلب
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="مثال: وقت التوصيل أو أي تفاصيل إضافية"
                    rows={3}
                    className="w-full border border-beige-200 rounded-xl px-4 py-3 text-brown-700 outline-none focus:border-gold-400 resize-none"
                  />
                </div>
              </div>

              <button onClick={handleWhatsAppOrder} className="btn-whatsapp w-full mt-4">
                <MessageCircle size={18} />
                إرسال الطلب عبر واتساب
              </button>

              <p className="text-xs text-brown-300 text-center mt-3">
                سيتم تحويلك إلى واتساب لتأكيد الطلب
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
