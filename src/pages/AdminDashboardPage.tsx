import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Plus, Pencil, Trash2, Package, X, Upload, Save, Search, Settings, Home } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/data/store';
import { saveStoreSettings, type StoreSettings } from '@/lib/storeSettings';
import { useStoreSettings } from '@/store/StoreSettingsContext';

interface AdminProduct {
  id: number;
  name: string;
  description: string | null;
  short_description: string | null;
  price: number;
  old_price: number | null;
  category: string | null;
  image_url: string | null;
  gallery: string[] | null;
  badge: string | null;
  features: string[] | null;
  occasions: string[] | null;
  available: boolean;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ProductForm {
  name: string;
  description: string;
  short_description: string;
  price: string;
  old_price: string;
  category: string;
  image_url: string;
  gallery: string[];
  badge: string;
  features: string;
  occasions: string[];
  available: boolean;
  visible: boolean;
}

const EMPTY_FORM: ProductForm = {
  name: '',
  description: '',
  short_description: '',
  price: '',
  old_price: '',
  category: 'boxes',
  image_url: '',
  gallery: [],
  badge: '',
  features: '',
  occasions: [],
  available: true,
  visible: true,
};

function formatMoney(value: number) {
  return `${Number(value).toLocaleString('en-US')} ر.ق`;
}

function normalizeImages(imageUrl: string, gallery: string[]) {
  const cleaned = gallery.map((url) => url.trim()).filter(Boolean);
  const main = imageUrl.trim();

  if (!main) {
    return Array.from(new Set(cleaned));
  }

  return Array.from(new Set([main, ...cleaned.filter((url) => url !== main)]));
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { settings, refresh: refreshStoreSettings } = useStoreSettings();
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
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [showStoreSettings, setShowStoreSettings] = useState(false);
  const [showHomeSettings, setShowHomeSettings] = useState(false);
  const [savingStoreSettings, setSavingStoreSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);


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
      .select('id,name,description,short_description,price,old_price,category,image_url,gallery,badge,features,occasions,available,visible,created_at,updated_at')
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

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q),
    );
  }, [products, search]);

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, gallery: [] });
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function openEdit(product: AdminProduct) {
    const gallery = normalizeImages(
      product.image_url ?? '',
      Array.isArray(product.gallery) ? product.gallery : [],
    );

    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? '',
      short_description: product.short_description ?? '',
      price: String(product.price ?? ''),
      old_price: product.old_price == null ? '' : String(product.old_price),
      category: product.category ?? 'boxes',
      image_url: product.image_url ?? gallery[0] ?? '',
      gallery,
      badge: product.badge ?? '',
      features: Array.isArray(product.features) ? product.features.join('\n') : '',
      occasions: Array.isArray(product.occasions) ? product.occasions : [],
      available: product.available,
      visible: product.visible,
    });

    setError('');
    setSuccess('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const invalidType = files.find((file) => !file.type.startsWith('image/'));
    if (invalidType) {
      setError(`الملف "${invalidType.name}" ليس صورة`);
      e.target.value = '';
      return;
    }

    const tooLarge = files.find((file) => file.size > 5 * 1024 * 1024);
    if (tooLarge) {
      setError(`الصورة "${tooLarge.name}" أكبر من 5 ميجابايت`);
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError('');

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${extension}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        setError(`تعذر رفع "${file.name}": ${uploadError.message}`);
        setUploading(false);
        e.target.value = '';
        return;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    setForm((prev) => {
      const existing = normalizeImages(prev.image_url, prev.gallery);
      const nextGallery = Array.from(new Set([...existing, ...uploadedUrls]));
      const nextMain = prev.image_url.trim() || nextGallery[0] || '';

      return {
        ...prev,
        image_url: nextMain,
        gallery: nextGallery,
      };
    });

    setUploading(false);
    e.target.value = '';
  }

  async function handleHeroImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(`الملف "${file.name}" ليس صورة`);
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(`الصورة "${file.name}" أكبر من 5 ميجابايت`);
      e.target.value = '';
      return;
    }

    setUploadingHero(true);
    setError('');

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = `homepage/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      setError(`تعذر رفع الصورة: ${uploadError.message}`);
      setUploadingHero(false);
      e.target.value = '';
      return;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    setSettingsForm((prev) => ({ ...prev, heroImage: data.publicUrl }));
    setUploadingHero(false);
    e.target.value = '';
  }

  async function handleLogoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(`الملف "${file.name}" ليس صورة`);
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(`الصورة "${file.name}" أكبر من 5 ميجابايت`);
      e.target.value = '';
      return;
    }

    setUploadingLogo(true);
    setError('');

    const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = `branding/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      setError(`تعذر رفع الشعار: ${uploadError.message}`);
      setUploadingLogo(false);
      e.target.value = '';
      return;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    setSettingsForm((prev) => ({ ...prev, logoUrl: data.publicUrl }));
    setUploadingLogo(false);
    e.target.value = '';
  }

  function makeMainImage(url: string) {
    setForm((prev) => ({
      ...prev,
      image_url: url,
      gallery: normalizeImages(url, prev.gallery),
    }));
  }

  function removeImage(url: string) {
    setForm((prev) => {
      const nextGallery = prev.gallery.filter((img) => img !== url);
      const nextMain =
        prev.image_url === url
          ? nextGallery[0] ?? ''
          : prev.image_url;

      return {
        ...prev,
        image_url: nextMain,
        gallery: normalizeImages(nextMain, nextGallery),
      };
    });
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

    const gallery = normalizeImages(form.image_url, form.gallery);
    const mainImage = form.image_url.trim() || gallery[0] || '';

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      short_description: form.short_description.trim(),
      price,
      old_price: oldPrice,
      category: form.category,
      image_url: mainImage,
      gallery,
      badge: form.badge || null,
      features: form.features
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      occasions: form.occasions,
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
    setForm({ ...EMPTY_FORM, gallery: [] });
    await fetchProducts();
  }

  async function handleDelete(product: AdminProduct) {
    if (!window.confirm(`هل تريد حذف «${product.name}» نهائيًا؟`)) return;

    setError('');
    setSuccess('');

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

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
      .update({
        [field]: !product[field],
        updated_at: new Date().toISOString(),
      })
      .eq('id', product.id);

    if (updateError) {
      setError(`تعذر تعديل المنتج: ${updateError.message}`);
      return;
    }

    await fetchProducts();
  }

  async function handleStoreSettingsSave(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!settingsForm.name.trim()) {
      setError('اكتب اسم المتجر');
      return;
    }
    if (!settingsForm.whatsappNumber.replace(/[^0-9]/g, '')) {
      setError('اكتب رقم واتساب صحيحًا');
      return;
    }

    setSavingStoreSettings(true);
    const { error: settingsError } = await saveStoreSettings(settingsForm);
    setSavingStoreSettings(false);

    if (settingsError) {
      setError(`تعذر حفظ إعدادات المتجر: ${settingsError.message}. تأكد من تشغيل ملف migration الخاص بإعدادات المتجر في Supabase.`);
      return;
    }

    await refreshStoreSettings();
    setSuccess('تم حفظ إعدادات المتجر بنجاح');
    setShowStoreSettings(false);
    setShowHomeSettings(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen pt-28 text-center text-brown-400">
        جارٍ التحقق من تسجيل الدخول...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: '/admin' }} />;
  }

  const previewImages = normalizeImages(form.image_url, form.gallery);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-cream-50">
      <div className="container-lux">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brown-700">
              لوحة إدارة المنتجات
            </h1>
            <p className="text-sm text-brown-400 mt-1">
              أضف المنتجات وعدّل الأسعار والتوفر من داخل الموقع
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setSettingsForm(settings);
                setShowStoreSettings((prev) => !prev);
                setShowForm(false);
              }}
              className="btn-outline"
            >
              <Settings size={18} />
              إعدادات المتجر
            </button>

            <button
              onClick={() => {
                setSettingsForm(settings);
                setShowHomeSettings((prev) => !prev);
                setShowStoreSettings(false);
                setShowForm(false);
              }}
              className="btn-outline"
            >
              <Home size={18} />
              إعدادات الصفحة الرئيسية
            </button>

            <button onClick={openAdd} className="btn-primary">
              <Plus size={18} />
              إضافة منتج
            </button>

            <button onClick={signOut} className="btn-outline">
              <LogOut size={18} />
              خروج
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-500">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {showHomeSettings && (
          <form
            onSubmit={handleStoreSettingsSave}
            className="bg-white border border-beige-100 rounded-2xl shadow-sm p-4 sm:p-6 mb-6"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="font-bold text-brown-700 text-xl flex items-center gap-2"><Home size={20} /> إعدادات الصفحة الرئيسية</h2>
                <p className="text-sm text-brown-400 mt-1">تحكم في واجهة الصفحة الرئيسية بدون تعديل الكود</p>
              </div>
              <button type="button" onClick={() => setShowHomeSettings(false)} className="p-2 text-brown-400"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label-lux">الشارة أعلى العنوان</label><input className="input-lux" value={settingsForm.heroBadge} onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })} /></div>
              <div><label className="label-lux">العنوان الرئيسي</label><input className="input-lux" value={settingsForm.heroTitle} onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="label-lux">الوصف الرئيسي</label><textarea rows={3} className="input-lux resize-none" value={settingsForm.heroDescription} onChange={(e) => setSettingsForm({ ...settingsForm, heroDescription: e.target.value })} /></div>
              <div className="sm:col-span-2">
                <label className="label-lux">صورة الغلاف</label>
                <label className="mt-1 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-beige-200 bg-beige-50 p-4 text-center hover:bg-beige-100">
                  <Upload size={22} />
                  <span className="text-sm font-medium text-brown-600">{uploadingHero ? 'جارٍ رفع الصورة...' : 'اختر صورة من الجهاز'}</span>
                  <span className="text-xs text-brown-400">JPG أو PNG أو WEBP — بحد أقصى 5 MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} disabled={uploadingHero} />
                </label>
                {settingsForm.heroImage && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-beige-100">
                    <img src={settingsForm.heroImage} alt="صورة الغلاف" className="h-40 w-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <h3 className="font-bold text-brown-700 mt-6 mb-3">إظهار وإخفاء أقسام الصفحة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                ['showCategories', 'التصنيفات'], ['showBestSellers', 'الأكثر طلبًا'], ['showOccasions', 'المناسبات'],
                ['showWhyUs', 'لماذا لمسة هدية؟'], ['showTestimonials', 'آراء العملاء'], ['showCustomGiftCta', 'صمم هديتك']
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-xl border border-beige-100 p-3 cursor-pointer">
                  <input type="checkbox" checked={Boolean(settingsForm[key as keyof StoreSettings])} onChange={(e) => setSettingsForm({ ...settingsForm, [key]: e.target.checked })} />
                  <span className="text-sm font-medium text-brown-600">{label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <button type="submit" disabled={savingStoreSettings} className="btn-primary"><Save size={18} />{savingStoreSettings ? 'جارٍ الحفظ...' : 'حفظ إعدادات الصفحة'}</button>
              <button type="button" onClick={() => setShowHomeSettings(false)} className="btn-outline">إلغاء</button>
            </div>
          </form>
        )}

        {showStoreSettings && (
          <form
            onSubmit={handleStoreSettingsSave}
            className="bg-white border border-beige-100 rounded-2xl shadow-sm p-4 sm:p-6 mb-6"
          >
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="font-bold text-brown-700 text-xl flex items-center gap-2">
                  <Settings size={20} />
                  إعدادات المتجر
                </h2>
                <p className="text-sm text-brown-400 mt-1">
                  غيّر بيانات المتجر التي تظهر للزبائن بدون تعديل الكود
                </p>
              </div>
              <button type="button" onClick={() => setShowStoreSettings(false)} className="p-2 text-brown-400">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-lux">اسم المتجر</label>
                <input className="input-lux" value={settingsForm.name} onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })} />
              </div>
              <div>
                <label className="label-lux">الشعار النصي</label>
                <input className="input-lux" value={settingsForm.tagline} onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label-lux">شعار المتجر</label>
                <label className="mt-1 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-beige-200 bg-beige-50 p-4 text-center hover:bg-beige-100">
                  <Upload size={22} />
                  <span className="text-sm font-medium text-brown-600">{uploadingLogo ? 'جارٍ رفع الشعار...' : 'اختر شعارًا من الجهاز'}</span>
                  <span className="text-xs text-brown-400">PNG أو JPG أو WEBP — يفضل PNG بخلفية شفافة</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
                </label>
                {settingsForm.logoUrl && (
                  <div className="mt-3 flex items-center gap-4 rounded-xl border border-beige-100 bg-white p-3">
                    <img src={settingsForm.logoUrl} alt="شعار المتجر" className="h-20 max-w-[220px] object-contain" />
                    <button type="button" className="btn-outline !py-2" onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '' })}>إزالة الشعار</button>
                  </div>
                )}
              </div>
              <div>
                <label className="label-lux">رقم واتساب</label>
                <input dir="ltr" className="input-lux text-left" value={settingsForm.whatsappNumber} onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })} placeholder="974XXXXXXXX" />
              </div>
              <div>
                <label className="label-lux">رقم الهاتف</label>
                <input dir="ltr" className="input-lux text-left" value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="label-lux">البريد الإلكتروني</label>
                <input dir="ltr" type="email" className="input-lux text-left" value={settingsForm.email} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} />
              </div>
              <div>
                <label className="label-lux">اسم إنستغرام</label>
                <input dir="ltr" className="input-lux text-left" value={settingsForm.instagram} onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })} placeholder="lamsahadiya" />
              </div>
              <div>
                <label className="label-lux">رابط إنستغرام</label>
                <input dir="ltr" className="input-lux text-left" value={settingsForm.instagramUrl} onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })} placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className="label-lux">الموقع</label>
                <input className="input-lux" value={settingsForm.location} onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })} />
              </div>
              <div>
                <label className="label-lux">العملة</label>
                <input dir="ltr" className="input-lux text-left" value={settingsForm.currency} onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })} placeholder="QAR" />
              </div>
              <div>
                <label className="label-lux">اسم العملة</label>
                <input className="input-lux" value={settingsForm.currencyName} onChange={(e) => setSettingsForm({ ...settingsForm, currencyName: e.target.value })} />
              </div>
              <div>
                <label className="label-lux">ساعات العمل - السبت إلى الخميس</label>
                <input className="input-lux" value={settingsForm.weekdaysHours} onChange={(e) => setSettingsForm({ ...settingsForm, weekdaysHours: e.target.value })} />
              </div>
              <div>
                <label className="label-lux">ساعات العمل - الجمعة</label>
                <input className="input-lux" value={settingsForm.fridayHours} onChange={(e) => setSettingsForm({ ...settingsForm, fridayHours: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label-lux">وصف المتجر في أسفل الموقع</label>
                <textarea rows={3} className="input-lux resize-none" value={settingsForm.footerDescription} onChange={(e) => setSettingsForm({ ...settingsForm, footerDescription: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button type="submit" disabled={savingStoreSettings} className="btn-primary disabled:opacity-60">
                <Save size={18} />
                {savingStoreSettings ? 'جارٍ الحفظ...' : 'حفظ إعدادات المتجر'}
              </button>
              <button type="button" onClick={() => setShowStoreSettings(false)} className="btn-outline">إلغاء</button>
            </div>
          </form>
        )}

        {showForm && (
          <form
            onSubmit={handleSave}
            className="bg-white border border-beige-100 rounded-2xl p-5 sm:p-6 shadow-sm mb-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-brown-700">
                {editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-2 text-brown-400 hover:text-brown-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-lux">اسم المنتج *</label>
                <input
                  className="input-lux"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: بوكس ورد فاخر"
                />
              </div>

              <div>
                <label className="label-lux">السعر الحالي *</label>
                <input
                  className="input-lux"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="150"
                />
              </div>

              <div>
                <label className="label-lux">السعر القديم (اختياري)</label>
                <input
                  className="input-lux"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.old_price}
                  onChange={(e) => setForm({ ...form, old_price: e.target.value })}
                  placeholder="180"
                />
              </div>

              <div>
                <label className="label-lux">التصنيف</label>
                <select
                  className="input-lux"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-lux">صور المنتج</label>
                <label className="btn-outline w-full cursor-pointer">
                  <Upload size={18} />
                  {uploading ? 'جارٍ رفع الصور...' : 'اختر صورة أو عدة صور'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={uploading}
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="label-lux">رابط الصورة الرئيسية (اختياري)</label>
                <input
                  dir="ltr"
                  className="input-lux text-left"
                  value={form.image_url}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image_url: e.target.value,
                    })
                  }
                  placeholder="https://..."
                />
              </div>

              {previewImages.length > 0 && (
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label className="label-lux mb-0">
                      صور المنتج ({previewImages.length})
                    </label>
                    <span className="text-xs text-brown-400">
                      اضغط «اجعلها الرئيسية» لتغيير صورة الغلاف
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previewImages.map((url) => {
                      const isMain = form.image_url === url;

                      return (
                        <div
                          key={url}
                          className={`relative rounded-xl overflow-hidden border-2 bg-cream-50 ${
                            isMain ? 'border-gold-400' : 'border-beige-100'
                          }`}
                        >
                          <img
                            src={url}
                            alt="معاينة المنتج"
                            className="w-full aspect-square object-cover"
                          />

                          {isMain && (
                            <span className="absolute top-2 right-2 text-[11px] px-2 py-1 rounded-full bg-gold-400 text-brown-900 font-bold">
                              الرئيسية
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 text-rose-500 flex items-center justify-center shadow"
                            aria-label="حذف الصورة"
                          >
                            <X size={16} />
                          </button>

                          {!isMain && (
                            <button
                              type="button"
                              onClick={() => makeMainImage(url)}
                              className="w-full px-2 py-2 text-xs font-medium text-brown-600 bg-white hover:bg-gold-50"
                            >
                              اجعلها الرئيسية
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="label-lux">الوصف المختصر</label>
                <input
                  className="input-lux"
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  placeholder="مثال: بوكس ورد فاخر مع شوكولاتة وبطاقة إهداء"
                />
              </div>

              <div>
                <label className="label-lux">الشارة</label>
                <select
                  className="input-lux"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                >
                  <option value="">بدون شارة</option>
                  <option value="new">جديد</option>
                  <option value="bestseller">الأكثر طلبًا</option>
                  <option value="sale">تخفيض</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="label-lux">المميزات</label>
                <textarea
                  className="input-lux resize-none"
                  rows={4}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder={"اكتب كل ميزة في سطر منفصل\nتغليف فاخر\nبطاقة إهداء مجانية\nتوصيل سريع"}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="label-lux">المناسبات</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    ['birthday', 'عيد ميلاد'],
                    ['anniversary', 'ذكرى سنوية'],
                    ['wedding', 'زفاف'],
                    ['engagement', 'خطوبة'],
                    ['graduation', 'تخرج'],
                    ['thanks', 'شكر'],
                    ['apology', 'اعتذار'],
                    ['surprise', 'مفاجأة'],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 cursor-pointer bg-cream-50 rounded-xl p-3"
                    >
                      <input
                        type="checkbox"
                        className="accent-gold-500"
                        checked={form.occasions.includes(value)}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            occasions: e.target.checked
                              ? Array.from(new Set([...prev.occasions, value]))
                              : prev.occasions.filter((item) => item !== value),
                          }))
                        }
                      />
                      <span className="text-sm text-brown-600">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="label-lux">وصف المنتج</label>
                <textarea
                  className="input-lux resize-none"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="اكتب وصف الهدية ومحتوياتها..."
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-cream-50 rounded-xl p-3">
                <input
                  type="checkbox"
                  className="accent-gold-500"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                />
                <span className="text-sm text-brown-600">متوفر في المخزون</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-cream-50 rounded-xl p-3">
                <input
                  type="checkbox"
                  className="accent-gold-500"
                  checked={form.visible}
                  onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                />
                <span className="text-sm text-brown-600">ظاهر للزبائن</span>
              </label>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="submit"
                disabled={saving || uploading}
                className="btn-primary disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? 'جارٍ الحفظ...' : 'حفظ المنتج'}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-outline"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        <div className="bg-white border border-beige-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-beige-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-brown-700 font-bold">
              <Package size={19} />
              المنتجات ({products.length})
            </div>

            <div className="relative sm:w-72">
              <Search
                size={17}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-300"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-lux pr-9"
                placeholder="ابحث عن منتج..."
              />
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-brown-400">
              جارٍ تحميل المنتجات...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <Package size={42} className="mx-auto text-beige-300 mb-3" />
              <p className="text-brown-500 font-medium">لا توجد منتجات بعد</p>
              <button
                onClick={openAdd}
                className="mt-3 text-gold-600 font-medium"
              >
                + أضف أول منتج
              </button>
            </div>
          ) : (
            <div className="divide-y divide-beige-100">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-xl bg-cream-100 overflow-hidden shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="m-5 text-beige-300" size={24} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-brown-700 truncate">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="font-bold text-gold-600">
                          {formatMoney(product.price)}
                        </span>

                        {product.old_price != null && (
                          <span className="text-xs text-brown-300 line-through">
                            {formatMoney(product.old_price)}
                          </span>
                        )}

                        {Array.isArray(product.gallery) && product.gallery.length > 1 && (
                          <span className="text-xs text-brown-400">
                            {product.gallery.length} صور
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => toggleField(product, 'available')}
                      className={`text-xs px-3 py-2 rounded-lg font-medium ${
                        product.available
                          ? 'bg-green-50 text-green-700'
                          : 'bg-rose-50 text-rose-500'
                      }`}
                    >
                      {product.available ? 'متوفر' : 'نفد'}
                    </button>

                    <button
                      onClick={() => toggleField(product, 'visible')}
                      className={`text-xs px-3 py-2 rounded-lg font-medium ${
                        product.visible
                          ? 'bg-gold-50 text-gold-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {product.visible ? 'ظاهر' : 'مخفي'}
                    </button>

                    <button
                      onClick={() => openEdit(product)}
                      className="p-2.5 rounded-lg border border-beige-200 text-brown-500 hover:border-gold-300 hover:text-gold-600"
                      aria-label="تعديل"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(product)}
                      className="p-2.5 rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50"
                      aria-label="حذف"
                    >
                      <Trash2 size={17} />
                    </button>
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
