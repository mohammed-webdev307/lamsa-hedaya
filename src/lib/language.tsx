import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'ar' | 'en';
const STORAGE_KEY = 'lamsa-language';

export function getCurrentLanguage(): Language {
  return (localStorage.getItem(STORAGE_KEY) as Language) || 'ar';
}

const exact: Record<string, string> = {
  'ل': 'L', 'لمسة هدية': 'Lamsa Hedaya', 'هدية صغيرة.. تصنع ذكرى كبيرة': 'A small gift... a lasting memory',
  'الرئيسية': 'Home', 'المنتجات': 'Products', 'المناسبات': 'Occasions', 'صمم هديتك': 'Design Your Gift', 'من نحن': 'About Us', 'تواصل معنا': 'Contact Us',
  'بحث': 'Search', 'المفضلة': 'Wishlist', 'السلة': 'Cart', 'اطلب الآن': 'Order Now', 'القائمة': 'Menu', 'إغلاق': 'Close',
  'ابحث عن هدية...': 'Search for a gift...', 'ابحث عن منتج...': 'Search for a product...', 'عرض التفاصيل': 'View Details',
  'أضف للسلة': 'Add to Cart', 'أضف إلى السلة': 'Add to Cart', 'أضف للمفضلة': 'Add to Wishlist', 'أضف إلى المفضلة': 'Add to Wishlist',
  'إزالة من المفضلة': 'Remove from Wishlist', 'في المفضلة': 'In Wishlist', 'نفد المخزون': 'Out of Stock', 'متوفر في المخزون': 'In Stock',
  'جديد': 'New', 'الأكثر طلبًا': 'Bestseller', 'تخفيض': 'Sale', 'عرض الكل': 'View All', 'عرض جميع المنتجات': 'View All Products',
  'جارٍ تحميل المنتجات...': 'Loading products...', 'لا توجد منتجات حاليًا': 'No products available right now', 'جميع المنتجات': 'All Products',
  'تشكيلة فاخرة من الهدايا لكل المناسبات': 'A premium selection of gifts for every occasion', 'فلترة': 'Filter', 'الفلاتر': 'Filters',
  'مسح الكل': 'Clear All', 'نوع الهدية': 'Gift Type', 'كل الأنواع': 'All Types', 'المناسبة': 'Occasion', 'كل المناسبات': 'All Occasions',
  'نطاق السعر': 'Price Range', 'لا توجد منتجات': 'No Products', 'لم نجد منتجات تطابق بحثك. جرب تعديل الفلاتر.': 'We couldn’t find products matching your search. Try adjusting the filters.',
  'هدايا حسب المناسبة': 'Gifts by Occasion', 'احتفل بكل مناسبة بهدية مميزة': 'Celebrate every occasion with a special gift',
  'اختر المناسبة واعرض الهدايا المناسبة': 'Choose an occasion to see matching gifts', 'عرض كل المناسبات': 'View All Occasions',
  'لا توجد منتجات متاحة لهذه المناسبة حاليًا.': 'No products are currently available for this occasion.', 'تصفح كل المنتجات': 'Browse All Products',
  'اختر مناسبة من الأعلى لعرض الهدايا المناسبة': 'Choose an occasion above to view suitable gifts',
  'لماذا لمسة هدية؟': 'Why Lamsa Hedaya?', 'نقدم لكم تجربة هدايا لا تُنسى': 'We create an unforgettable gifting experience', 'آراء عملائنا': 'What Our Customers Say',
  'صمم هديتك المميزة': 'Design Your Special Gift', 'اختر تفاصيل هديتك وسنساعدك في تحويلها إلى شيء مميز يليق بمن تحب.': 'Choose your gift details and we’ll help turn them into something special.',
  'ابدأ التصميم الآن': 'Start Designing Now', 'الصفحة غير موجودة': 'Page Not Found', 'العودة للرئيسية': 'Back to Home', 'تصفح المنتجات': 'Browse Products',
  'جارٍ تحميل المنتج...': 'Loading product...', 'تعذر تحميل المنتج': 'Unable to load product', 'حدث خطأ أثناء تحميل بيانات المنتج': 'An error occurred while loading the product',
  'العودة للمنتجات': 'Back to Products', 'المنتج غير موجود': 'Product Not Found', 'لا توجد صورة للمنتج': 'No product image', 'الكمية': 'Quantity',
  'خيارات التخصيص': 'Customization Options', 'لون التغليف': 'Wrapping Color', 'اسم الشخص': 'Recipient Name', 'رسالة الإهداء': 'Gift Message',
  'ملاحظات إضافية': 'Additional Notes', 'اختر المناسبة': 'Choose an occasion', 'اطلب عبر واتساب': 'Order via WhatsApp', 'توصيل سريع': 'Fast Delivery',
  'جودة مضمونة': 'Guaranteed Quality', 'تغليف فاخر': 'Premium Wrapping', 'وصف المنتج': 'Product Description', 'منتجات مشابهة': 'Similar Products',
  'قائمة المفضلة فارغة': 'Your Wishlist is Empty', 'لم تقم بإضافة أي منتجات إلى المفضلة بعد.': 'You haven’t added any products to your wishlist yet.',
  'المنتجات التي أعجبتك': 'Products you liked', 'أضف': 'Add', 'كل الأسعار': 'All Prices', 'أقل من 150 ريال': 'Under 150 QAR',
  '150 - 200 ريال': '150 - 200 QAR', '200 - 300 ريال': '200 - 300 QAR', 'أكثر من 300 ريال': 'Over 300 QAR', 'الأحدث': 'Newest',
  'الأقل سعرًا': 'Price: Low to High', 'الأعلى سعرًا': 'Price: High to Low', 'اللون الافتراضي': 'Default', 'أحمر': 'Red', 'وردي': 'Pink', 'أبيض': 'White', 'ذهبي': 'Gold', 'بني': 'Brown', 'أخضر': 'Green',
  'بوكسات هدايا': 'Gift Boxes', 'ورد': 'Flowers', 'شوكولاتة': 'Chocolate', 'دمى': 'Plush Toys', 'عطور': 'Perfumes', 'هدايا مخصصة': 'Custom Gifts',
  'هدايا تخرج': 'Graduation Gifts', 'أعياد ميلاد': 'Birthdays', 'خطوبة وزواج': 'Engagement & Wedding', 'مولود جديد': 'New Baby',
  'عيد ميلاد': 'Birthday', 'تخرج': 'Graduation', 'خطوبة': 'Engagement', 'زواج': 'Wedding', 'ذكرى زواج': 'Anniversary', 'اعتذار': 'Apology', 'شكر': 'Thank You', 'مفاجأة': 'Surprise',
  'بوكس الورد الملكي': 'Royal Rose Box', 'بوكس شوكولاتة فاخر': 'Luxury Chocolate Box', 'بوكس عيد ميلاد مميز': 'Special Birthday Box',
  'دبدوب مع ورد': 'Teddy Bear with Flowers', 'بوكس تخرج': 'Graduation Box', 'بوكيه ورد أبيض': 'White Rose Bouquet', 'بوكيه ورد وردي': 'Pink Rose Bouquet',
  'بوكس خطوبة فاخر': 'Luxury Engagement Box', 'بوكس عطر وشوكولاتة': 'Perfume & Chocolate Box', 'بوكس ورد وشوكولاتة': 'Flowers & Chocolate Box',
  'بوكس عناية شخصية': 'Personal Care Box', 'بوكس قهوة وحلويات': 'Coffee & Sweets Box', 'بوكس ذكرى خاصة': 'Special Memory Box', 'بوكس مفاجأة': 'Surprise Box',
  'هدية باسم مخصص': 'Personalized Name Gift', 'صندوق هدية مخصص': 'Custom Gift Box',
  'روابط سريعة': 'Quick Links', 'التصنيفات': 'Categories', 'واتساب:': 'WhatsApp:', 'الدوحة، قطر': 'Doha, Qatar',
  'سلة التسوق فارغة': 'Your Cart is Empty', 'لم تقم بإضافة أي منتجات بعد. تصفح تشكيلتنا الفاخرة.': 'You haven’t added any products yet. Browse our premium collection.',
  'سلة التسوق': 'Shopping Cart', 'إفراغ السلة': 'Clear Cart', 'متابعة التسوق': 'Continue Shopping', 'ملخص الطلب': 'Order Summary',
  'اسم الزبون': 'Customer Name', 'اكتب اسمك': 'Enter your name', 'رقم الهاتف': 'Phone Number', 'ملاحظات الطلب': 'Order Notes',
  'تحديد موقع التوصيل': 'Set Delivery Location', 'تحديث موقع التوصيل': 'Update Delivery Location', 'جاري تحديد موقعك...': 'Getting your location...',
  'تم تحديد موقعك بنجاح ✅': 'Location set successfully ✅', 'المتصفح لا يدعم تحديد الموقع': 'Your browser does not support location services',
  'تعذر تحديد الموقع، تأكد من السماح بالوصول للموقع': 'Unable to get your location. Please allow location access.',
  'إرسال الطلب عبر واتساب': 'Send Order via WhatsApp', 'سيتم تحويلك إلى واتساب لتأكيد الطلب': 'You will be redirected to WhatsApp to confirm your order',
  'تسجيل الدخول': 'Login', 'جارٍ تسجيل الدخول...': 'Signing in...', 'إظهار كلمة المرور': 'Show password', 'إخفاء كلمة المرور': 'Hide password',
  'إضافة منتج جديد': 'Add New Product', 'تعديل المنتج': 'Edit Product', 'حفظ المنتج': 'Save Product', 'جارٍ الحفظ...': 'Saving...', 'حذف': 'Delete', 'تعديل': 'Edit',
  'حذف الصورة': 'Delete Image', 'معاينة المنتج': 'Product Preview', 'اكتب اسم المنتج': 'Enter product name', 'اختر صورة أو عدة صور': 'Choose one or more images',
  'جارٍ رفع الصور...': 'Uploading images...', 'تمت إضافة المنتج بنجاح': 'Product added successfully', 'تم تعديل المنتج بنجاح': 'Product updated successfully', 'تم حذف المنتج': 'Product deleted',
  'تمت إضافة المنتج إلى السلة': 'Product added to cart', 'تمت إضافة المنتج إلى المفضلة': 'Product added to wishlist', 'تمت إزالة المنتج من المفضلة': 'Product removed from wishlist',
  'تواصل عبر واتساب': 'Contact via WhatsApp', 'العودة للأعلى': 'Back to top', 'مسار التنقل': 'Breadcrumb',
  'بوكسات هدايا فاخرة لكل المناسبات': 'Luxury gift boxes for every occasion', 'باقات وبوكسات ورد طبيعي منعش': 'Fresh natural flower bouquets and boxes',
  'شوكولاتة فاخرة بتصاميم راقية': 'Luxury chocolates with elegant designs', 'دمى ناعمة مع هدايا وورود': 'Soft plush toys with gifts and flowers',
  'عطور فاخرة بروائح مميزة': 'Luxury perfumes with distinctive scents', 'صمم هديتك بنفسك بلمسة خاصة': 'Design your own gift with a personal touch',
  'احتفل بالتخرج بأسلوب مميز': 'Celebrate graduation in a special way', 'هدايا أعياد الميلاد المميزة': 'Special birthday gifts',
  'هدايا الخطوبة والزواج الفاخرة': 'Luxury engagement and wedding gifts', 'هدايا استقبال المولود الجديد': 'New baby welcome gifts'
};

const partial: Array<[RegExp, string]> = [
  [/هدايا /g, 'Gifts for '], [/ ريال/g, ' QAR'], [/اسم المنتج/g, 'Product Name'], [/السعر/g, 'Price'], [/الكمية/g, 'Quantity'],
  [/إجمالي المنتج/g, 'Item Total'], [/إجمالي الطلب/g, 'Order Total'], [/لون التغليف/g, 'Wrapping Color'], [/الاسم المخصص/g, 'Custom Name'],
  [/الملاحظات/g, 'Notes'], [/نوع التغليف/g, 'Wrapping Type'], [/الميزانية/g, 'Budget'], [/الألوان المفضلة/g, 'Preferred Colors'], [/تاريخ التسليم/g, 'Delivery Date']
];

export function translateText(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return value;
  if (exact[trimmed]) return value.replace(trimmed, exact[trimmed]);
  let out = value;
  for (const [pattern, replacement] of partial) out = out.replace(pattern, replacement);
  return out;
}

type LanguageContextValue = { language: Language; toggleLanguage: () => void };
const LanguageContext = createContext<LanguageContextValue>({ language: 'ar', toggleLanguage: () => {} });

function translateNode(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') continue;
    const original = (node as Node & { __arOriginal?: string }).__arOriginal ?? node.nodeValue ?? '';
    if (/[\u0600-\u06ff]/.test(original)) {
      (node as Node & { __arOriginal?: string }).__arOriginal = original;
      node.nodeValue = translateText(original);
    }
  }
  if (root instanceof Element) {
    const elements = [root, ...Array.from(root.querySelectorAll('*'))];
    for (const element of elements) {
      for (const attr of ['placeholder', 'aria-label', 'title']) {
        const value = element.getAttribute(attr);
        if (!value) continue;
        const dataAttr = `data-ar-${attr.replace('-', '')}`;
        const original = element.getAttribute(dataAttr) || value;
        if (/[\u0600-\u06ff]/.test(original)) {
          element.setAttribute(dataAttr, original);
          element.setAttribute(attr, translateText(original));
        }
      }
    }
  }
}

function restoreNode(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const original = (node as Node & { __arOriginal?: string }).__arOriginal;
    if (original) node.nodeValue = original;
  }
  if (root instanceof Element) {
    const elements = [root, ...Array.from(root.querySelectorAll('*'))];
    for (const element of elements) {
      for (const attr of ['placeholder', 'aria-label', 'title']) {
        const original = element.getAttribute(`data-ar-${attr.replace('-', '')}`);
        if (original) element.setAttribute(attr, original);
      }
    }
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => getCurrentLanguage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.body.dir = dir;

    const apply = () => language === 'en' ? translateNode(document.body) : restoreNode(document.body);
    requestAnimationFrame(apply);

    const observer = new MutationObserver((mutations) => {
      if (language !== 'en') return;
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) translateNode(node);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({ language, toggleLanguage: () => setLanguage((v) => v === 'ar' ? 'en' : 'ar') }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
