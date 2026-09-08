import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { CATEGORIES } from '@/data/store';
import { useStoreSettings } from '@/store/StoreSettingsContext';

export default function Footer() {
  const { settings } = useStoreSettings();
  return (
    <footer className="bg-brown-800 text-cream-100 mt-10 sm:mt-20">
      <div className="container-lux py-8 sm:py-12">
        {/* Mobile: compact stacked layout */}
        <div className="sm:hidden space-y-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <span className="text-brown-900 font-bold">ل</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-cream-50">{settings.name}</h3>
                <p className="text-[10px] text-cream-200/70">{settings.tagline}</p>
              </div>
            </div>
            <p className="text-xs text-cream-200/80 leading-relaxed">
              {settings.footerDescription}
            </p>
          </div>

          {/* Quick Links + Categories - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-cream-50 text-sm mb-3">روابط سريعة</h4>
              <ul className="space-y-1.5">
                <li><Link to="/" className="text-xs text-cream-200/80 hover:text-gold-300 transition-colors">الرئيسية</Link></li>
                <li><Link to="/products" className="text-xs text-cream-200/80 hover:text-gold-300 transition-colors">المنتجات</Link></li>
                <li><Link to="/occasions" className="text-xs text-cream-200/80 hover:text-gold-300 transition-colors">المناسبات</Link></li>
                <li><Link to="/custom-gift" className="text-xs text-cream-200/80 hover:text-gold-300 transition-colors">صمم هديتك</Link></li>
                <li><Link to="/about" className="text-xs text-cream-200/80 hover:text-gold-300 transition-colors">من نحن</Link></li>
                <li><Link to="/contact" className="text-xs text-cream-200/80 hover:text-gold-300 transition-colors">تواصل معنا</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-cream-50 text-sm mb-3">التصنيفات</h4>
              <ul className="space-y-1.5">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/products?category=${cat.id}`} className="text-xs text-cream-200/80 hover:text-gold-300 transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact - compact */}
          <div>
            <h4 className="font-bold text-cream-50 text-sm mb-3">تواصل معنا</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-cream-200/80">
                <Phone size={14} className="text-gold-300 shrink-0" />
                <span dir="ltr">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-cream-200/80">
                <MessageCircle size={14} className="text-gold-300 shrink-0" />
                <span>واتساب: {settings.whatsappNumber}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-cream-200/80">
                <Mail size={14} className="text-gold-300 shrink-0" />
                <span dir="ltr">{settings.email}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-cream-200/80">
                <MapPin size={14} className="text-gold-300 shrink-0" />
                <span>{settings.location}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-cream-200/80">
                <Instagram size={14} className="text-gold-300 shrink-0" />
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 transition-colors">
                  @{settings.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop: full layout */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <span className="text-brown-900 font-bold text-lg">ل</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-cream-50">{settings.name}</h3>
                <p className="text-xs text-cream-200/70">{settings.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-cream-200/80 leading-relaxed">
              {settings.footerDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-cream-50 mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-cream-200/80 hover:text-gold-300 transition-colors">الرئيسية</Link></li>
              <li><Link to="/products" className="text-sm text-cream-200/80 hover:text-gold-300 transition-colors">المنتجات</Link></li>
              <li><Link to="/occasions" className="text-sm text-cream-200/80 hover:text-gold-300 transition-colors">المناسبات</Link></li>
              <li><Link to="/custom-gift" className="text-sm text-cream-200/80 hover:text-gold-300 transition-colors">صمم هديتك</Link></li>
              <li><Link to="/about" className="text-sm text-cream-200/80 hover:text-gold-300 transition-colors">من نحن</Link></li>
              <li><Link to="/contact" className="text-sm text-cream-200/80 hover:text-gold-300 transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-cream-50 mb-4">التصنيفات</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.id}`} className="text-sm text-cream-200/80 hover:text-gold-300 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-cream-50 mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-cream-200/80">
                <Phone size={16} className="text-gold-300 shrink-0" />
                <span dir="ltr">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-cream-200/80">
                <MessageCircle size={16} className="text-gold-300 shrink-0" />
                <span>واتساب: {settings.whatsappNumber}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-cream-200/80">
                <Mail size={16} className="text-gold-300 shrink-0" />
                <span dir="ltr">{settings.email}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-cream-200/80">
                <MapPin size={16} className="text-gold-300 shrink-0" />
                <span>{settings.location}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-cream-200/80">
                <Instagram size={16} className="text-gold-300 shrink-0" />
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 transition-colors">
                  @{settings.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-brown-700">
        <div className="container-lux py-3 sm:py-4 text-center">
          <p className="text-xs sm:text-sm text-cream-200/60">© 2026 {settings.name} - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
