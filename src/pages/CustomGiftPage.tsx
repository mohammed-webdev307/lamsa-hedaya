import { useState } from 'react';
import { MessageCircle, Palette, Send } from 'lucide-react';
import { buildWhatsAppUrl, buildCustomGiftWhatsAppMessage } from '@/utils/whatsapp';
import Breadcrumbs from '@/components/Breadcrumbs';

const GIFT_TYPES = ['بوكس هدايا', 'ورد', 'شوكولاتة', 'عطور', 'دمى', 'هدايا مخصصة', 'أخرى'];
const OCCASIONS_LIST = ['عيد ميلاد', 'تخرج', 'خطوبة', 'زواج', 'مولود جديد', 'ذكرى زواج', 'اعتذار', 'شكر', 'مفاجأة'];
const WRAPPINGS = ['تغليف فاخر', 'تغليف بسيط', 'بوكس خشبي', 'صندوق مبطن', 'شريط حرير', 'بدون تغليف'];

export default function CustomGiftPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = buildCustomGiftWhatsAppMessage(formData);
    window.open(buildWhatsAppUrl(message), '_blank');
  };

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="container-lux">
        <Breadcrumbs items={[{ label: 'الرئيسية', to: '/' }, { label: 'صمم هديتك' }]} />

        <div className="my-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-brown-700 mb-2">صمم هديتك</h1>
          <p className="text-brown-400">اختر تفاصيل هديتك وسنساعدك في تحويلها إلى شيء مميز.</p>
        </div>

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-brown-500 to-brown-600 p-8 sm:p-12 mb-8 text-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gold-400/20 flex items-center justify-center mx-auto mb-4">
              <Palette size={32} className="text-gold-300" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-cream-50 mb-2">هديتك المميزة بين يديك</h2>
            <p className="text-cream-200/80 max-w-xl mx-auto">
              املأ النموذج التالي بتفاصيل هديتك وسنقوم بتصميمها خصيصًا لك وفق رغبتك.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-beige-100 p-6 sm:p-8 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Gift Type */}
            <div>
              <label className="label-lux">نوع الهدية</label>
              <select
                value={formData.giftType ?? ''}
                onChange={(e) => handleChange('giftType', e.target.value)}
                className="input-lux cursor-pointer"
                required
              >
                <option value="">اختر نوع الهدية</option>
                {GIFT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Occasion */}
            <div>
              <label className="label-lux">المناسبة</label>
              <select
                value={formData.occasion ?? ''}
                onChange={(e) => handleChange('occasion', e.target.value)}
                className="input-lux cursor-pointer"
                required
              >
                <option value="">اختر المناسبة</option>
                {OCCASIONS_LIST.map((occ) => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="label-lux">الميزانية</label>
              <input
                type="text"
                value={formData.budget ?? ''}
                onChange={(e) => handleChange('budget', e.target.value)}
                placeholder="مثال: 200 - 300 ريال"
                className="input-lux"
              />
            </div>

            {/* Colors */}
            <div>
              <label className="label-lux">الألوان المفضلة</label>
              <input
                type="text"
                value={formData.colors ?? ''}
                onChange={(e) => handleChange('colors', e.target.value)}
                placeholder="مثال: أحمر وذهبي"
                className="input-lux"
              />
            </div>

            {/* Wrapping */}
            <div>
              <label className="label-lux">نوع التغليف</label>
              <select
                value={formData.wrapping ?? ''}
                onChange={(e) => handleChange('wrapping', e.target.value)}
                className="input-lux cursor-pointer"
              >
                <option value="">اختر نوع التغليف</option>
                {WRAPPINGS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* Recipient Name */}
            <div>
              <label className="label-lux">الاسم المطلوب</label>
              <input
                type="text"
                value={formData.recipientName ?? ''}
                onChange={(e) => handleChange('recipientName', e.target.value)}
                placeholder="اسم الشخص المراد إهداء الهدية له"
                className="input-lux"
              />
            </div>

            {/* Print Text */}
            <div className="sm:col-span-2">
              <label className="label-lux">النص المطلوب طباعته</label>
              <input
                type="text"
                value={formData.printText ?? ''}
                onChange={(e) => handleChange('printText', e.target.value)}
                placeholder="مثال: كل عام وأنتِ بخير"
                className="input-lux"
              />
            </div>

            {/* Gift Message */}
            <div className="sm:col-span-2">
              <label className="label-lux">رسالة الإهداء</label>
              <textarea
                value={formData.message ?? ''}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="اكتب رسالتك التي ستُرفق مع الهدية"
                rows={2}
                className="input-lux resize-none"
              />
            </div>

            {/* Delivery Date */}
            <div>
              <label className="label-lux">تاريخ التسليم</label>
              <input
                type="date"
                value={formData.deliveryDate ?? ''}
                onChange={(e) => handleChange('deliveryDate', e.target.value)}
                className="input-lux"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="label-lux">ملاحظات إضافية</label>
              <input
                type="text"
                value={formData.notes ?? ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="أي تفاصيل أخرى تريد إضافتها"
                className="input-lux"
              />
            </div>
          </div>

          <button type="submit" className="btn-whatsapp w-full mt-6">
            <Send size={18} />
            أرسل طلب التصميم عبر واتساب
          </button>

          <p className="text-xs text-brown-300 text-center mt-3">
            سيتم تحويلك إلى واتساب لإرسال تفاصيل طلب التصميم
          </p>
        </form>
      </div>
    </div>
  );
}
