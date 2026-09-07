import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cream-50 to-beige-100">
      <div className="text-center px-4">
        <div className="relative inline-block mb-8">
          <h1 className="text-8xl sm:text-9xl font-bold text-gold-400/30">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center">
              <Search size={36} className="text-gold-500" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-brown-700 mb-3">الصفحة غير موجودة</h2>
        <p className="text-brown-400 mb-8 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة للصفحة الرئيسية.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={18} />
            العودة للرئيسية
          </Link>
          <Link to="/products" className="btn-outline">
            <Search size={18} />
            تصفح المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
