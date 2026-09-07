import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { STORE_CONFIG } from '@/data/store';

const NAV_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/products', label: 'المنتجات' },
  { to: '/occasions', label: 'المناسبات' },
  { to: '/custom-gift', label: 'صمم هديتك' },
  { to: '/about', label: 'من نحن' },
  { to: '/contact', label: 'تواصل معنا' },
];

export default function Header() {
  const { cartCount, wishlist } = useStore();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-md py-2' : 'bg-cream-50/80 backdrop-blur-sm py-3'
        }`}
      >
        <div className="container-lux">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-brown-500 flex items-center justify-center">
                <span className="text-cream-50 font-bold text-lg">ل</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-brown-700 text-lg leading-tight">{STORE_CONFIG.name}</h1>
                <p className="text-xs text-brown-400 leading-tight">{STORE_CONFIG.tagline}</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      isActive ? 'text-gold-600 bg-gold-50' : 'text-brown-600 hover:text-gold-500 hover:bg-cream-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 flex items-center justify-center text-brown-600 hover:text-gold-500 hover:bg-cream-100 rounded-lg transition-all"
                aria-label="بحث"
              >
                <Search size={20} />
              </button>

              <Link
                to="/wishlist"
                className="relative w-10 h-10 flex items-center justify-center text-brown-600 hover:text-gold-500 hover:bg-cream-100 rounded-lg transition-all"
                aria-label="المفضلة"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-rose-400 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative w-10 h-10 flex items-center justify-center text-brown-600 hover:text-gold-500 hover:bg-cream-100 rounded-lg transition-all"
                aria-label="السلة"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-gold-400 text-brown-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to="/custom-gift" className="hidden sm:inline-flex btn-gold !py-2 !px-4 text-sm">
                اطلب الآن
              </Link>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-brown-600 hover:bg-cream-100 rounded-lg transition-all"
                aria-label="القائمة"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="mt-3 animate-fade-in">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن هدية..."
                  autoFocus
                  className="input-lux"
                />
                <button type="submit" className="btn-primary shrink-0">
                  <Search size={18} />
                  بحث
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brown-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-80 max-w-[85%] bg-cream-50 shadow-2xl animate-slide-in flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-beige-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-brown-500 flex items-center justify-center">
                  <span className="text-cream-50 font-bold">ل</span>
                </div>
                <span className="font-bold text-brown-700">{STORE_CONFIG.name}</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center text-brown-600 hover:bg-cream-100 rounded-lg"
                aria-label="إغلاق"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 text-base font-medium rounded-lg transition-all ${
                      isActive ? 'text-gold-600 bg-gold-50' : 'text-brown-600 hover:bg-cream-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-beige-200">
              <Link
                to="/custom-gift"
                onClick={() => setMobileOpen(false)}
                className="btn-gold w-full"
              >
                اطلب الآن
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
