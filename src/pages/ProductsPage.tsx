import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PRODUCTS, CATEGORIES, OCCASIONS, PRICE_RANGES, SORT_OPTIONS } from '@/data/store';
import type { SortOptionId } from '@/data/store';
import type { CategoryId, OccasionId } from '@/types';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') ?? '';
  const categoryFilter = (searchParams.get('category') ?? 'all') as string;
  const occasionFilter = (searchParams.get('occasion') ?? 'all') as string;
  const priceFilter = searchParams.get('price') ?? 'all';
  const sortOption = (searchParams.get('sort') ?? 'newest') as SortOptionId;

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === (categoryFilter as CategoryId));
    }

    if (occasionFilter !== 'all') {
      result = result.filter((p) => p.occasions.includes(occasionFilter as OccasionId));
    }

    if (priceFilter !== 'all') {
      const range = PRICE_RANGES.find((r) => r.id === priceFilter);
      if (range) {
        result = result.filter((p) => p.price >= range.min && p.price <= range.max);
      }
    }

    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'bestselling':
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      default:
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [searchQuery, categoryFilter, occasionFilter, priceFilter, sortOption]);

  const activeFiltersCount =
    (categoryFilter !== 'all' ? 1 : 0) +
    (occasionFilter !== 'all' ? 1 : 0) +
    (priceFilter !== 'all' ? 1 : 0);

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="container-lux">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'المنتجات' },
          ]}
        />

        <div className="my-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-brown-700 mb-2">جميع المنتجات</h1>
          <p className="text-brown-400">تشكيلة فاخرة من الهدايا لكل المناسبات</p>
        </div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateParam('search', searchInput);
            }}
            className="relative flex-1"
          >
            <Search size={18} className="absolute top-1/2 right-3 -translate-y-1/2 text-brown-300" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث عن هدية..."
              className="input-lux pr-10"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateParam('search', '');
                }}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-brown-300 hover:text-brown-500"
              >
                <X size={18} />
              </button>
            )}
          </form>

          <select
            value={sortOption}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="input-lux sm:w-48 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline sm:hidden relative"
          >
            <SlidersHorizontal size={18} />
            فلترة
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-gold-400 text-brown-900 text-xs font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
            <div className="bg-white rounded-2xl border border-beige-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-brown-700">الفلاتر</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setSearchParams(new URLSearchParams());
                      setSearchInput('');
                    }}
                    className="text-xs text-gold-600 hover:text-gold-700 font-medium"
                  >
                    مسح الكل
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="label-lux">نوع الهدية</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={categoryFilter === 'all'}
                      onChange={() => updateParam('category', 'all')}
                      className="accent-gold-500"
                    />
                    <span className="text-sm text-brown-600">كل الأنواع</span>
                  </label>
                  {CATEGORIES.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={categoryFilter === cat.id}
                        onChange={() => updateParam('category', cat.id)}
                        className="accent-gold-500"
                      />
                      <span className="text-sm text-brown-600">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasion Filter */}
              <div className="mb-6">
                <h4 className="label-lux">المناسبة</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="occasion"
                      checked={occasionFilter === 'all'}
                      onChange={() => updateParam('occasion', 'all')}
                      className="accent-gold-500"
                    />
                    <span className="text-sm text-brown-600">كل المناسبات</span>
                  </label>
                  {OCCASIONS.map((occ) => (
                    <label key={occ.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="occasion"
                        checked={occasionFilter === occ.id}
                        onChange={() => updateParam('occasion', occ.id)}
                        className="accent-gold-500"
                      />
                      <span className="text-sm text-brown-600">{occ.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="label-lux">نطاق السعر</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={priceFilter === range.id}
                        onChange={() => updateParam('price', range.id)}
                        className="accent-gold-500"
                      />
                      <span className="text-sm text-brown-600">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <p className="text-sm text-brown-400 mb-4">
              عدد المنتجات: <span className="font-bold text-brown-600">{filteredProducts.length}</span>
            </p>
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center mb-4">
                  <Search size={32} className="text-brown-300" />
                </div>
                <h3 className="text-lg font-bold text-brown-600 mb-2">لا توجد منتجات</h3>
                <p className="text-brown-400 text-sm">لم نجد منتجات تطابق بحثك. جرب تعديل الفلاتر.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
