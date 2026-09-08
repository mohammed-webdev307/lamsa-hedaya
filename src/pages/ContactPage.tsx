import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, Send } from 'lucide-react';
import { useStoreSettings } from '@/store/StoreSettingsContext';
import { buildWhatsAppUrl, buildContactWhatsAppMessage } from '@/utils/whatsapp';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ContactPage() {
  const { settings } = useStoreSettings();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = buildContactWhatsAppMessage(name, message);
    window.open(buildWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="container-lux">
        <Breadcrumbs items={[{ label: 'الرئيسية', to: '/' }, { label: 'تواصل معنا' }]} />

        <div className="my-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-brown-700 mb-2">تواصل معنا</h1>
          <p className="text-brown-400">نحن هنا لخدمتك. تواصل معنا في أي وقت.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-beige-100 p-6">
              <h2 className="font-bold text-brown-700 text-lg mb-4">معلومات التواصل</h2>

              <div className="space-y-4">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 text-brown-500 hover:text-gold-600 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-xs text-brown-400">رقم الهاتف</p>
                    <p className="font-medium" dir="ltr">{settings.phone}</p>
                  </div>
                </a>

                <a
                  href={buildWhatsAppUrl('مرحبا، أريد الاستفسار')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-brown-500 hover:text-gold-600 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center shrink-0">
                    <MessageCircle size={18} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-xs text-brown-400">واتساب</p>
                    <p className="font-medium">{settings.whatsappNumber}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 text-brown-500 hover:text-gold-600 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-xs text-brown-400">البريد الإلكتروني</p>
                    <p className="font-medium" dir="ltr">{settings.email}</p>
                  </div>
                </a>

                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-brown-500 hover:text-gold-600 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center shrink-0">
                    <Instagram size={18} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-xs text-brown-400">إنستغرام</p>
                    <p className="font-medium">@{settings.instagram}</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-brown-500">
                  <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-xs text-brown-400">الموقع</p>
                    <p className="font-medium">{settings.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-2xl border border-beige-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-gold-500" />
                <h2 className="font-bold text-brown-700 text-lg">ساعات العمل</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-beige-100">
                  <span className="text-brown-500 font-medium">السبت إلى الخميس</span>
                  <span className="text-brown-400 text-sm">{settings.weekdaysHours.replace(/^.*?:\s*/, '')}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-brown-500 font-medium">الجمعة</span>
                  <span className="text-brown-400 text-sm">{settings.fridayHours.replace(/^.*?:\s*/, '')}</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl border border-beige-100 p-6">
              <h2 className="font-bold text-brown-700 text-lg mb-4">موقعنا</h2>
              <div className="aspect-video bg-cream-100 rounded-xl flex items-center justify-center border-2 border-dashed border-beige-200">
                <div className="text-center">
                  <MapPin size={32} className="text-brown-300 mx-auto mb-2" />
                  <p className="text-sm text-brown-400">خريطة الموقع - {settings.location}</p>
                  <p className="text-xs text-brown-300 mt-1">يمكن إضافة خريطة تفاعلية لاحقًا</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-beige-100 p-6 sm:p-8">
            <h2 className="font-bold text-brown-700 text-lg mb-4">أرسل لنا رسالة</h2>
            <p className="text-sm text-brown-400 mb-6">
              املأ النموذج التالي وسنتواصل معك عبر واتساب في أقرب وقت.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-lux">الاسم</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اكتب اسمك"
                  className="input-lux"
                  required
                />
              </div>

              <div>
                <label className="label-lux">الرسالة</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  rows={6}
                  className="input-lux resize-none"
                  required
                />
              </div>

              <button type="submit" className="btn-whatsapp w-full">
                <Send size={18} />
                إرسال عبر واتساب
              </button>

              <p className="text-xs text-brown-300 text-center">
                سيتم تحويلك إلى واتساب لإرسال رسالتك
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
