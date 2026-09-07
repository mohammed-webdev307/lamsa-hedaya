import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '@/store/StoreContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ToastContainer from '@/components/ToastContainer';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollToTopOnNavigate from '@/components/ScrollToTopOnNavigate';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import WishlistPage from '@/pages/WishlistPage';
import OccasionsPage from '@/pages/OccasionsPage';
import CustomGiftPage from '@/pages/CustomGiftPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTopOnNavigate />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/occasions" element={<OccasionsPage />} />
              <Route path="/custom-gift" element={<CustomGiftPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <FloatingWhatsApp />
        <ToastContainer />
        <ScrollToTop />
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
