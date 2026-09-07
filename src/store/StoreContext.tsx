import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product, ProductCustomization, ToastMessage, WishlistItem } from '@/types';
import { getDefaultCustomization } from '@/utils/whatsapp';

const CART_STORAGE_KEY = 'lamsa_hadiya_cart';
const WISHLIST_STORAGE_KEY = 'lamsa_hadiya_wishlist';

interface StoreContextValue {
  cart: CartItem[];
  wishlist: WishlistItem[];
  toasts: ToastMessage[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number, customization?: ProductCustomization) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: number) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

let toastId = 0;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage<CartItem[]>(CART_STORAGE_KEY, []));
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() =>
    loadFromStorage<WishlistItem[]>(WISHLIST_STORAGE_KEY, []),
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'error' = 'success') => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    [],
  );

  const addToCart = useCallback(
    (product: Product, quantity = 1, customization?: ProductCustomization) => {
      const custom = customization ?? getDefaultCustomization();
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          );
        }
        return [...prev, { product, quantity, customization: custom }];
      });
      showToast('تمت إضافة المنتج إلى السلة');
    },
    [showToast],
  );

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const isInWishlist = useCallback((productId: number) => wishlist.some((item) => item.productId === productId), [
    wishlist,
  ]);

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlist((prev) => {
        const exists = prev.some((item) => item.productId === product.id);
        if (exists) {
          showToast('تمت إزالة المنتج من المفضلة', 'info');
          return prev.filter((item) => item.productId !== product.id);
        }
        showToast('تمت إضافة المنتج إلى المفضلة');
        return [...prev, { productId: product.id, addedAt: Date.now() }];
      });
    },
    [showToast],
  );

  const removeFromWishlist = useCallback(
    (productId: number) => {
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
      showToast('تمت إزالة المنتج من المفضلة', 'info');
    },
    [showToast],
  );

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      wishlist,
      toasts,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      showToast,
      dismissToast,
    }),
    [
      cart,
      wishlist,
      toasts,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      showToast,
      dismissToast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
