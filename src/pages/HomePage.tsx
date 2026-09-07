import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Gift,
  Palette,
  Truck,
  Award,
  LayoutGrid,
  MessageCircle,
  Cake,
  Flower2,
  Cookie,
  Heart,
  Sparkles,
  GraduationCap,
  Baby,
  Star,
  ChevronLeft,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import StarRating from '@/components/StarRating';
import { CATEGORIES, PRODUCTS, TESTIMONIALS, WHY_US, OCCASIONS } from '@/data/store';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

const ICON_MAP: Record<string, typeof Gift> = {
  Gift,
  Flower2,
  Cookie,
  Heart,
  Sparkles,
  Palette,
  GraduationCap,
  Cake,
  Baby,
  Truck,
  Award,
  LayoutGrid,
  MessageCircle,
};

export default function HomePage() {
  const bestSellers = PRODUCTS.filter((p) => p.badge === 'bestseller').slice(0, 4);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    } else {
      setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    }
  };

  return (
    <div className="pt-14 sm:pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-cream-100 via-cream-50 to-beige-100">
        <div className="container-lux py-8 sm:py-14 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Text */}
            <div className="text-center lg:text-right order-2 lg:order-1 animate-fade-in-up">
              <span className="badge bg-gold-100 text-gold-700 mb-3 sm:mb-4">متجر هدايا فاخر</span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-brown-700 leading-tight mb-3 sm:mb-4 text-balance">
                هدية صغيرة.. تصنع ذكرى كبيرة
              </h1>
              <p className="text-sm sm:text-lg text-brown-400 mb-5 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                اختر هديتك المميزة واجعل كل مناسبة ذكرى لا تُنسى.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center lg:justify-start max-w-sm sm:max-w-none mx-auto">
                <Link to="/products" className="btn-primary text-sm sm:text-base">
                  تسوق الآن
                  <ArrowLeft size={18} />
                </Link>
                <a
                  href={buildWhatsAppUrl('مرحبا، أريد طلب هدية عبر واتساب')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-sm sm:text-base"
                >
                  <MessageCircle size={18} />
                  اطلب عبر واتساب
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="relative animate-fade-in-up order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl aspect-[4/3] sm:aspect-square">
                <img
                  src="https://images.pexels.com/photos/30632274/pexels-photo-30632274.png?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="بوكس هدية فاخر"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-900/30 to-transparent" />
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 hidden xs:flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold-100 flex items-center justify-center">
                  <Star className="fill-gold-400 text-gold-400" size={20} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-brown-700">تقييم 4.9</p>
                  <p className="text-[10px] sm:text-xs text-brown-400">+500 عميل سعيد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Horizontal scroll on mobile, grid on desktop */}
      <section className="py-8 sm:py-16">
        <div className="container-lux">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-brown-700">تسوق حسب التصنيف</h2>
              <p className="text-brown-400 text-sm sm:text-base mt-1 hidden sm:block">اختر من تشكيلتنا الواسعة</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-gold-600 hover:text-gold-700 font-medium text-sm transition-colors shrink-0"
            >
              عرض الكل
              <ChevronLeft size={16} />
            </Link>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:hidden pb-2">
            {CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.icon] ?? Gift;
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="group relative rounded-xl overflow-hidden shrink-0 w-28 h-36 shadow-sm border border-beige-100 transition-all hover:shadow-md hover:border-gold-200"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-2 text-center">
                    <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center mb-1.5">
                      <Icon className="text-brown-600" size={16} />
                    </div>
                    <h3 className="text-cream-50 font-bold text-xs">{cat.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop: grid */}
          <div className="hidden sm:grid grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.icon] ?? Gift;
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-sm border border-beige-100 transition-all hover:shadow-xl hover:border-gold-200"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                      <Icon className="text-brown-600" size={20} />
                    </div>
                    <h3 className="text-cream-50 font-bold text-sm sm:text-base">{cat.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best Sellers - Only 4 products on homepage */}
      <section className="py-8 sm:py-16 bg-cream-100/50">
        <div className="container-lux">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-brown-700">الأكثر طلبًا</h2>
              <p className="text-brown-400 text-sm sm:text-base mt-1 hidden sm:block">الهدايا الأكثر شعبية لدى عملائنا</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-gold-600 hover:text-gold-700 font-medium text-sm transition-colors shrink-0"
            >
              عرض الكل
              <ChevronLeft size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <Link to="/products" className="btn-outline text-sm">
              عرض جميع المنتجات
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Occasions - Compact */}
      <section className="py-8 sm:py-16">
        <div className="container-lux">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-brown-700">هدايا حسب المناسبة</h2>
              <p className="text-brown-400 text-sm sm:text-base mt-1 hidden sm:block">احتفل بكل مناسبة بهدية مميزة</p>
            </div>
            <Link
              to="/occasions"
              className="flex items-center gap-1 text-gold-600 hover:text-gold-700 font-medium text-sm transition-colors shrink-0"
            >
              عرض الكل
              <ChevronLeft size={16} />
            </Link>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:hidden pb-2">
            {OCCASIONS.map((occ) => {
              const Icon = ICON_MAP[occ.icon] ?? Heart;
              return (
                <Link
                  key={occ.id}
                  to="/occasions"
                  className="group flex flex-col items-center justify-center gap-2 shrink-0 w-20 h-20 bg-white rounded-xl border border-beige-100 transition-all hover:border-gold-200 hover:shadow-md"
                >
                  <div className="w-9 h-9 rounded-full bg-cream-100 flex items-center justify-center transition-all group-hover:bg-gold-100">
                    <Icon className="text-brown-500" size={18} />
                  </div>
                  <span className="text-xs font-medium text-brown-600 text-center px-1">{occ.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop: grid */}
          <div className="hidden sm:grid grid-cols-3 lg:grid-cols-9 gap-3">
            {OCCASIONS.map((occ) => {
              const Icon = ICON_MAP[occ.icon] ?? Heart;
              return (
                <Link
                  key={occ.id}
                  to="/occasions"
                  className="group flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl border border-beige-100 transition-all hover:border-gold-200 hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-full bg-cream-100 flex items-center justify-center transition-all group-hover:bg-gold-100">
                    <Icon className="text-brown-500" size={24} />
                  </div>
                  <span className="text-sm font-medium text-brown-600 text-center">{occ.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Us - Compact on mobile */}
      <section className="py-10 sm:py-20 bg-brown-800 text-cream-100">
        <div className="container-lux">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-bold text-cream-50">لماذا لمسة هدية؟</h2>
            <p className="text-cream-200/70 mt-2 sm:mt-3 text-sm sm:text-base">نقدم لكم تجربة هدايا لا تُنسى</p>
          </div>

          {/* Mobile: 2 columns compact */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
            {WHY_US.map((item) => {
              const Icon = ICON_MAP[item.icon] ?? Gift;
              return (
                <div
                  key={item.title}
                  className="bg-brown-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center transition-all hover:bg-brown-700 hover:shadow-lg"
                >
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gold-400/20 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <Icon className="text-gold-300" size={20} />
                  </div>
                  <h3 className="font-bold text-cream-50 text-sm sm:text-lg mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-cream-200/70 leading-relaxed hidden sm:block">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials - Carousel on mobile, grid on desktop */}
      <section className="py-8 sm:py-16">
        <div className="container-lux">
          <h2 className="text-xl sm:text-3xl font-bold text-brown-700 text-center mb-4 sm:mb-8">آراء عملائنا</h2>

          {/* Mobile: single carousel */}
          {isMobile ? (
            <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <div className="card-lux p-5 mx-auto max-w-sm">
                <StarRating rating={TESTIMONIALS[activeTestimonial].rating} size={18} />
                <p className="text-sm text-brown-500 leading-relaxed my-4">
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-beige-100">
                  <img
                    src={TESTIMONIALS[activeTestimonial].avatar}
                    alt={TESTIMONIALS[activeTestimonial].name}
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-brown-700 text-sm">{TESTIMONIALS[activeTestimonial].name}</p>
                    <p className="text-xs text-brown-400">{TESTIMONIALS[activeTestimonial].location}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-1.5 mt-4">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === activeTestimonial ? 'bg-gold-400 w-6' : 'bg-beige-300'
                    }`}
                    aria-label={`رأي ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.id} className="card-lux p-6 flex flex-col">
                  <StarRating rating={testimonial.rating} size={18} />
                  <p className="text-sm text-brown-500 leading-relaxed my-4 flex-1">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-beige-100">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-brown-700 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-brown-400">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 sm:py-16">
        <div className="container-lux">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-l from-brown-600 to-brown-500 p-6 sm:p-12 text-center">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-gold-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-xl sm:text-3xl font-bold text-cream-50 mb-2 sm:mb-3">صمم هديتك المميزة</h2>
              <p className="text-cream-200/80 mb-5 sm:mb-6 max-w-xl mx-auto text-sm sm:text-base">
                اختر تفاصيل هديتك وسنساعدك في تحويلها إلى شيء مميز يليق بمن تحب.
              </p>
              <Link to="/custom-gift" className="btn-gold inline-flex text-sm sm:text-base">
                <Palette size={18} />
                ابدأ التصميم الآن
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
