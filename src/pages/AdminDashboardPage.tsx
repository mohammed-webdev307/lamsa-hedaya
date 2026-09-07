import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Plus, Pencil, Trash2, Package, X, Upload, Save, Search } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/data/store';

interface AdminProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category: string | null;
  image_url: string | null;
  available: boolean;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  old_price: string;
  category: string;
  image_url: string;
  available: boolean;
  visible: boolean;
}

const EMPTY_FORM: ProductForm = {
  name: '',
  description: '',
  price: '',
  old_price: '',
  category: 'boxes',
  image_url: '',
  available: true,
  visible: true,
};

function formatMoney(value: number) {
  return `${Number(value).toLocaleString('en-US')} ر.ق`;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingAuth(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('id,name,description,price,old_price,category,image_url,available,visible,created_at,updated_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(`تعذر تحميل المنتجات: ${fetchError.message}`);
      setProducts([]);
    } else {
      setProducts((data ?? []) as AdminProduct[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session) fetchProducts();
  }, [session, fetchProducts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.category ?? '').toLowerCase().includes(q));
  }, [products, search]);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function openEdit(product: AdminProduct) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? '',
      price: String(product.price ?? ''),
      old_price: product.old_price == null ? '' : String(product.old_price),
      category: product.category ?? 'boxes',
      image_url: product.image_url ?? '',
      available: product.available,
      visible: product.visible,
    });
    setError('');
    setSuccess('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('اختر ملف صورة فقط');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setUploading(true);
    setError('');
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadError) {
      setError('تعذر رفع الصورة. شغّل ملف supabase-storage-setup.sql مرة واحدة في Supabase ثم حاول مجددًا.');
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    setUploading(false);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const price = Number(form.price);
    const oldPrice = form.old_price.trim() ? Number(form.old_price) : null;
    if (!form.name.trim()) {
      setError('اكتب اسم المنتج');
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError('أدخل سعرًا صحيحًا');
      return;
    }
    if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice < 0)) {
      setError('السعر القديم غير صحيح');
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      old_price: oldPrice,
      category: form.category,
      image_url: form.image_url.trim(),
      available: form.available,
      visible: form.visible,
      updated_at: new Date().toISOString(),
    };

    const response = editingId
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert(payload);

    setSaving(false);
    if (response.error) {
      setError(`تعذر حفظ المنتج: ${response.error.message}`);
      return;
    }

    setSuccess(editingId ? 'تم تعديل المنتج بنجاح' : 'تمت إضافة المنتج بنجاح');
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    await fetchProducts();
  }

  async function handleDelete(product: AdminProduct) {
    if (!window.confirm(`هل تريد حذف «${product.name}» نهائيًا؟`)) return;
    setError('');
    setSuccess('');
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id);
    if (deleteError) {
      setError(`تعذر حذف المنتج: ${deleteError.message}`);
      return;
    }
    setSuccess('تم حذف المنتج');
    await fetchProducts();
  }

  async function toggleField(product: AdminProduct, field: 'available' | 'visible') {
    setError('');
    const { error: updateError } = await supabase
      .from('products')
      .update({ [field]: !product[field], updated_at: new Date().toISOString() })
      .eq('id', product.id);
    if (updateError) {
      setError(`تعذر تعديل المنتج: ${updateError.message}`);
      return;
    }
    await fetchProducts();
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  }

  if (checkingAuth) {
    return <div className="min-h-screen pt-28 text-center text-brown-400">جارٍ التحقق من تسجيل الدخول...</div>;
  }
  if (!session) return <Navigate to="/admin/login" replace state={{ from: '/admin' }} />;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-cream-50">
      <div className="container-lux">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brown-700">لوحة إدارة المنتجات</h1>
            <p className="text-sm text-brown-400 mt-1">أضف المنتجات وعدّل الأسعار والتوفر من داخل الموقع</p>
          </div>
          <div className="flex gap-2">
            <button onClick={openAdd} className="btn-primary"><Plus size={18} /> إضافة منتج</button>
            <button onClick={signOut} className="btn-outline"><LogOut size={18} /> خروج</button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-500">{error}</div>}
        {success && <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700">{success}</div>}

        {showForm && (
          <form onSubmit={handleSave} className="bg-white border border-beige-100 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-brown-700">{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-2 text-brown-400 hover:text-brown-700"><X size={20} /></button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-lux">اسم المنتج *</label>
                <input className="input-lux" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: بوكس ورد فاخر" />
              </div>
              <div>
                <label className="label-lux">السعر الحالي *</label>
                <input className="input-lux" type="number" min="0" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="150" />
              </div>
              <div>
                <label className="label-lux">السعر القديم (اختياري)</label>
                <input className="input-lux" type="number" min="0" step="0.01" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} placeholder="180" />
              </div>
              <div>
                <label className="label-lux">التصنيف</label>
                <select className="input-lux" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label-lux">صورة المنتج</label>
                <label className="btn-outline w-full cursor-pointer">
                  <Upload size={18} /> {uploading ? 'جارٍ رفع الصورة...' : 'اختر صورة من الجهاز'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleImageUpload} />
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="label-lux">أو رابط الصورة</label>
                <input dir="ltr" className="input-lux text-left" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </div>
              {form.image_url && (
                <div className="sm:col-span-2">
                  <img src={form.image_url} alt="معاينة المنتج" className="w-28 h-28 object-cover rounded-xl border border-beige-100" />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="label-lux">وصف المنتج</label>
                <textarea className="input-lux resize-none" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="اكتب وصف الهدية ومحتوياتها..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-cream-50 rounded-xl p-3">
                <input type="checkbox" className="accent-gold-500" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
                <span className="text-sm text-brown-600">متوفر في المخزون</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-cream-50 rounded-xl p-3">
                <input type="checkbox" className="accent-gold-500" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />
                <span className="text-sm text-brown-600">ظاهر للزبائن</span>
              </label>
            </div>

            <div className="flex gap-2 mt-6">
              <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-60"><Save size={18} /> {saving ? 'جارٍ الحفظ...' : 'حفظ المنتج'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">إلغاء</button>
            </div>
          </form>
        )}

        <div className="bg-white border border-beige-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-beige-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-brown-700 font-bold"><Package size={19} /> المنتجات ({products.length})</div>
            <div className="relative sm:w-72">
              <Search size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-300" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-lux pr-9" placeholder="ابحث عن منتج..." />
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-brown-400">جارٍ تحميل المنتجات...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <Package size={42} className="mx-auto text-beige-300 mb-3" />
              <p className="text-brown-500 font-medium">لا توجد منتجات بعد</p>
              <button onClick={openAdd} className="mt-3 text-gold-600 font-medium">+ أضف أول منتج</button>
            </div>
          ) : (
            <div className="divide-y divide-beige-100">
              {filtered.map((product) => (
                <div key={product.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-xl bg-cream-100 overflow-hidden shrink-0">
                      {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <Package className="m-5 text-beige-300" size={24} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-brown-700 truncate">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="font-bold text-gold-600">{formatMoney(product.price)}</span>
                        {product.old_price != null && <span className="text-xs text-brown-300 line-through">{formatMoney(product.old_price)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => toggleField(product, 'available')} className={`text-xs px-3 py-2 rounded-lg font-medium ${product.available ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-500'}`}>{product.available ? 'متوفر' : 'نفد'}</button>
                    <button onClick={() => toggleField(product, 'visible')} className={`text-xs px-3 py-2 rounded-lg font-medium ${product.visible ? 'bg-gold-50 text-gold-700' : 'bg-gray-100 text-gray-500'}`}>{product.visible ? 'ظاهر' : 'مخفي'}</button>
                    <button onClick={() => openEdit(product)} className="p-2.5 rounded-lg border border-beige-200 text-brown-500 hover:border-gold-300 hover:text-gold-600" aria-label="تعديل"><Pencil size={17} /></button>
                    <button onClick={() => handleDelete(product)} className="p-2.5 rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50" aria-label="حذف"><Trash2 size={17} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
