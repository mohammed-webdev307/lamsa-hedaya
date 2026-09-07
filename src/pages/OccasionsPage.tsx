import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cake, GraduationCap, Heart, Baby, MessageCircle, ThumbsUp, Sparkles, Palette, ArrowLeft } from 'lucide-react';
import { OCCASIONS, PRODUCTS } from '@/data/store';
import type { OccasionId } from '@/types';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';

const ICON_MAP: Record<string, typeof Cake> = {
  Cake,
  GraduationCap,
  Heart,
  Baby,
  MessageCircle,
  ThumbsUp,
  Sparkles,
  Palette,
};

export default function OccasionsPage() {
  const [selected, setSelected] = useState<OccasionId | null>(null);

  const filteredProducts = selected
    ? PRODUCTS.filter((p) => p.occasions.includes(selected))
    : [];

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="container-lux">
        <Breadcrumbs items={[{ label: 'الرئيسية', to: '/' }, { label: 'المناسبات' }]} />

        <div className="my-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-brown-700 mb-2">هدايا حسب المناسبة</h1>
          <p className="text-brown-400">اختر المناسبة واعرض الهدايا المناسبة</p>
        </div>

        {/* Occasions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {OCCASIONS.map((occ) => {
            const Icon = ICON_MAP[occ.icon] ?? Heart;
            const isActive = selected === occ.id;
            return (
              <button
                key={occ.id}
                onClick={() => setSelected(isActive ? null : occ.id)}
                className={`group relative rounded-2xl p-6 text-center transition-all border-2 ${
                  isActive
                    ? 'border-gold-400 bg-gold-50 shadow-md'
                    : 'border-beige-100 bg-white hover:border-gold-200 hover:shadow-md'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition-all ${
                    isActive ? 'bg-gold-400' : 'bg-cream-100 group-hover:bg-gold-100'
                  }`}
                >
                  <Icon className={isActive ? 'text-white' : 'text-brown-500'} size={26} />
                </div>
                <h3 className={`font-bold text-sm ${isActive ? 'text-gold-700' : 'text-brown-600'}`}>{occ.name}</h3>
              </button>
            );
          })}
        </div>

        {/* Products for selected occasion */}
        {selected ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brown-700">
                هدايا {OCCASIONS.find((o) => o.id === selected)?.name}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-sm text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1"
              >
                عرض كل المناسبات
                <ArrowLeft size={16} />
              </button>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-brown-400">لا توجد منتجات متاحة لهذه المناسبة حاليًا.</p>
                <Link to="/products" className="btn-outline mt-4 inline-flex">
                  تصفح كل المنتجات
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-brown-300" />
            </div>
            <p className="text-brown-400">اختر مناسبة من الأعلى لعرض الهدايا المناسبة</p>
          </div>
        )}
      </div>
    </div>
  );
}
