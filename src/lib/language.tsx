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
  'لوحة إدارة المنتجات': 'Product Management', 'أضف المنتجات وعدّل الأسعار والتوفر من داخل الموقع': 'Add products and manage prices and availability from the website',
  'إعدادات المتجر': 'Store Settings', 'غيّر بيانات المتجر التي تظهر للزبائن بدون تعديل الكود': 'Change the store information shown to customers without editing code',
  'اللون الرئيسي للموقع': 'Website Primary Color', 'اختر لون هوية المتجر': 'Choose your store brand color', 'ثيم ألوان الموقع': 'Website Color Theme', 'اختر ثيمًا جاهزًا لتتناسق الخلفية والأزرار تلقائيًا': 'Choose a ready-made theme so the background and buttons match automatically', 'وردي': 'Pink', 'بيج وبني': 'Beige & Brown', 'أخضر': 'Green', 'أزرق': 'Blue',
  'اسم المتجر': 'Store Name', 'الشعار النصي': 'Tagline', 'شعار المتجر': 'Store Logo', 'جارٍ رفع الشعار...': 'Uploading logo...', 'اختر شعارًا من الجهاز': 'Choose Logo from Device', 'إزالة الشعار': 'Remove Logo', 'يفضل PNG بخلفية شفافة': 'PNG with transparent background is recommended', 'رقم واتساب': 'WhatsApp Number', 'البريد الإلكتروني': 'Email', 'اسم إنستغرام': 'Instagram Username', 'رابط إنستغرام': 'Instagram URL',
  'الموقع': 'Location', 'العملة': 'Currency', 'اسم العملة': 'Currency Name', 'ساعات العمل - السبت إلى الخميس': 'Working Hours - Saturday to Thursday', 'ساعات العمل - الجمعة': 'Working Hours - Friday',
  'وصف المتجر في أسفل الموقع': 'Store Description in Footer', 'حفظ إعدادات المتجر': 'Save Store Settings', 'تم حفظ إعدادات المتجر بنجاح': 'Store settings saved successfully',
  'خروج': 'Sign Out', 'إضافة منتج': 'Add Product', 'الجمعة: 4:00 مساءً - 10:00 مساءً': 'Friday: 4:00 PM - 10:00 PM', 'السبت إلى الخميس: 9:00 صباحًا - 10:00 مساءً': 'Saturday to Thursday: 9:00 AM - 10:00 PM',
  'ريال قطري': 'Qatari Riyal', 'الدوحة، قطر': 'Doha, Qatar',
  'حذف الصورة': 'Delete Image', 'معاينة المنتج': 'Product Preview', 'اكتب اسم المنتج': 'Enter product name', 'اختر صورة أو عدة صور': 'Choose one or more images',
  'جارٍ رفع الصور...': 'Uploading images...', 'تمت إضافة المنتج بنجاح': 'Product added successfully', 'تم تعديل المنتج بنجاح': 'Product updated successfully', 'تم حذف المنتج': 'Product deleted',
  'تمت إضافة المنتج إلى السلة': 'Product added to cart', 'تمت إضافة المنتج إلى المفضلة': 'Product added to wishlist', 'تمت إزالة المنتج من المفضلة': 'Product removed from wishlist',
  'تواصل عبر واتساب': 'Contact via WhatsApp', 'العودة للأعلى': 'Back to top', 'مسار التنقل': 'Breadcrumb',
  'بوكسات هدايا فاخرة لكل المناسبات': 'Luxury gift boxes for every occasion', 'باقات وبوكسات ورد طبيعي منعش': 'Fresh natural flower bouquets and boxes',
  'شوكولاتة فاخرة بتصاميم راقية': 'Luxury chocolates with elegant designs', 'دمى ناعمة مع هدايا وورود': 'Soft plush toys with gifts and flowers',
  'عطور فاخرة بروائح مميزة': 'Luxury perfumes with distinctive scents', 'صمم هديتك بنفسك بلمسة خاصة': 'Design your own gift with a personal touch',
  'احتفل بالتخرج بأسلوب مميز': 'Celebrate graduation in a special way', 'هدايا أعياد الميلاد المميزة': 'Special birthday gifts',
  'هدايا الخطوبة والزواج الفاخرة': 'Luxury engagement and wedding gifts', 'هدايا استقبال المولود الجديد': 'New baby welcome gifts',
  'متجر هدايا فاخر يقدم تشكيلة مميزة من الهدايا لكل المناسبات بلمسة راقية.': 'A luxury gift store offering a distinctive selection of gifts for every occasion with an elegant touch.',
  'في لمسة هدية نؤمن أن الهدية ليست مجرد شيء يُقدّم، بل رسالة ومشاعر وذكرى تبقى. نقدم لكم تشكيلة فاخرة من الهدايا المميزة لكل المناسبات.': 'At Lamsa Hedaya, we believe a gift is more than an item—it is a message, a feeling, and a lasting memory. We offer a premium selection of gifts for every occasion.',
  '© 2026 لمسة هدية - جميع الحقوق محفوظة': '© 2026 Lamsa Hedaya - All rights reserved',
  'إمكانية تخصيص الهدية': 'Gift Personalization', 'الاهتمام بالتفاصيل': 'Attention to Detail', 'جودة المنتجات': 'Product Quality', 'خدمة العملاء': 'Customer Service',
  'منتجات مختارة بأعلى معايير الجودة': 'Carefully selected products with high quality standards',
  'تغليف راقٍ يليق بمناسباتكم المميزة': 'Elegant wrapping worthy of your special occasions',
  'توصيل في نفس اليوم داخل قطر': 'Same-day delivery within Qatar', 'خدمة عملاء عبر واتساب': 'Customer service via WhatsApp',
  'تخصيص كامل': 'Full Customization', 'تشكيلة واسعة تناسب كل المناسبات': 'A wide selection for every occasion',
  'نختار كل منتج بعناية فائقة من أجود المصادر، لنضمن لكم جودة عالية تستحق مناسباتكم المميزة. كل تفصيلة في منتجاتنا مدروسة بعناية.': 'We carefully select every product from trusted sources to deliver the quality your special occasions deserve. Every detail is thoughtfully considered.',
  'نقدم لكم إمكانية تخصيص الهدايا بالأسماء والرسائل وألوان التغليف، لتكون هديتك فريدة تمامًا وتحمل لمستك الشخصية الخاصة.': 'Personalize gifts with names, messages, and wrapping colors to create a truly unique gift with your personal touch.',
  'من اختيار المنتج إلى التغليف والتوصيل، نهتم بأدق التفاصيل لنضمن لكم تجربة استثنائية تليق بمن تحبون.': 'From product selection to wrapping and delivery, we care about every detail to create an exceptional gifting experience.',
  'فريقنا متاح عبر واتساب لمساعدتكم في اختيار الهدية المثالية وتخصيصها. نحن هنا لخدمتكم في كل خطوة.': 'Our team is available on WhatsApp to help you choose and personalize the perfect gift. We are here for you every step of the way.',
  'طلبت هدية تخرج وكانت النتيجة رائعة جدًا. الورد كان طازج والتغليف فخم. شكرًا لمسة هدية على الذوق الرفيع.': 'I ordered a graduation gift and the result was wonderful. The flowers were fresh and the wrapping was luxurious. Thank you, Lamsa Hedaya, for the beautiful taste.',
  'التغليف كان أجمل من الصور ووصل الطلب في الوقت المحدد. تجربة راقية بكل المقاييس وسأكررها بالتأكيد.': 'The wrapping was even better than the photos and the order arrived on time. A truly elegant experience that I will definitely repeat.',
  'خدمة ممتازة وتعامل سريع عبر واتساب. ساعدوني في اختيار الهدية المناسبة ووصلت في نفس اليوم. تعامل راقٍ ومميز.': 'Excellent service and fast communication via WhatsApp. They helped me choose the right gift and it arrived the same day.',
  'طلبت بوكس خطوبة وكان فوق التوقعات. الجودة عالية والتفاصيل دقيقة. جعلت المناسبة أكثر تميزًا. أنصح به بشدة.': 'I ordered an engagement box and it exceeded expectations. The quality was high and the details were beautiful. Highly recommended.',
  'أحمد الكواري': 'Ahmed Al-Kuwari', 'خالد المري': 'Khalid Al-Marri', 'سارة المهندي': 'Sara Al-Mohannadi', 'نورة العبدالله': 'Noura Al-Abdullah', 'عميل سعيد': 'Happy Customer',
  'بوكس احتفالي متكامل لعيد ميلاد لا يُنسى': 'A complete celebration box for an unforgettable birthday',
  'تشكيلة شوكولاتة بلجيكية فاخرة في علبة أنيقة': 'A selection of premium Belgian chocolates in an elegant box',
  'باقة ورد أبيض أنيقة بلمسة راقية': 'An elegant white rose bouquet with a refined touch',
  'باقة ورد وردي رومانطقية بتصميم ساحر': 'A romantic pink rose bouquet with a charming design',
  'بوكس احتفالي مميز للاحتفال بالتخرج': 'A special celebration box for graduation',
  'بوكس فاخر للخطوبة يجمع الورد والحلويات': 'A luxury engagement box combining flowers and sweets',
  'عطر فاخر مع شوكولاتة راقية في بوكس أنيق': 'Luxury perfume with fine chocolate in an elegant box',
  'ورد طبيعي مع شوكولاتة فاخرة في بوكس راقٍ': 'Fresh flowers with premium chocolate in an elegant box',
  'تشكيلة منتجات عناية فاخرة للعناية بالبشرة': 'A selection of premium skincare products',
  'تشكيلة قهوة مختارة مع حلويات لذيذة': 'Selected coffee with delicious sweets',
  'بوكس فاخر للاحتفال بالمناسبات والذكريات': 'A luxury box for special occasions and memories',
  'بوكس مفاجئة بمحتويات متنوعة ومميزة': 'A surprise box with varied and special contents',
  'هدية مخصصة بالاسم مع نقش احترافي': 'A personalized name gift with professional engraving',
  'صندوق هدية قابل للتخصيص بالكامل حسب رغبتك': 'A fully customizable gift box designed your way',
  'بوكس الورد الملكي عبارة عن مجموعة فاخرة تجمع بين الورد الأحمر الطبيعي الطازج وشوكولاتة فاخرة، مع إمكانية إضافة بطاقة إهداء مخصصة. مصمم بعناية ليكون الهدية المثالية للتعبير عن أسمى مشاعر الحب والتقدير في المناسبات الخاصة.': 'The Royal Rose Box combines fresh natural red roses with premium chocolate and an optional personalized gift card. Carefully designed for special occasions.',
  'بوكس شوكولاتة فاخر يحتوي على تشكيلة مختارة من الشوكولاتة البلجيكية الفاخرة بأنواعها المختلفة، مصممة في علبة أنيقة تصلح كهدية راقية لمحبي الشوكولاتة في كل المناسبات.': 'A luxury chocolate box featuring a selected assortment of premium Belgian chocolates in an elegant presentation, perfect for every occasion.',
  'بوكس عيد ميلاد مميز يحتوي على ورد طبيعي وشوكولاتة وحلويات احتفالية مع بطاقة تهنئة مخصصة. مصمم بألوان مبهجة ليضيف لمسة فرح وسرور على عيد ميلاد من تحب.': 'A special birthday box with fresh flowers, chocolate, celebration sweets, and a personalized greeting card, designed to add joy to a loved one’s birthday.',
  'دبدوب ناعم عالي الجودة مع باقة ورد وردي طبيعي، هدية مثالية للتعبير عن المشاعر الرقيقة. يجمع بين الدفء والجمال ليكون هدية لا تُنسى لمن تحب.': 'A soft high-quality teddy bear with a bouquet of natural pink roses, combining warmth and beauty for an unforgettable gift.',
  'بوكس تخرج مصمم خصيصًا للاحتفال بإنجاز التخرج، يحتوي على ورد وحلويات وبطاقة تهنئة قابلة للتخصيص. الهدية المثالية لتهنئة الخريجين بهذا الإنجاز الكبير.': 'A graduation box designed to celebrate achievement, with flowers, sweets, and a customizable greeting card.',
  'بوكيه ورد أبيض أنيق مصمم بعناية فائقة، يرمز للنقاء والصفاء. خيار مثالي للمناسبات الراقية والتعبير عن الاحترام والتقدير بأسلوب راقٍ.': 'An elegant white rose bouquet symbolizing purity and serenity, ideal for refined occasions and expressions of appreciation.',
  'بوكيه ورد وردي رومانطقية مصمم بعناية، يرمز للحب والرقة. خيار مثالي للتعبير عن المشاعر النبيلة بأسلوب راقٍ وأنيق.': 'A carefully designed romantic pink rose bouquet symbolizing love and tenderness.',
  'بوكس خطوبة فاخر مصمم خصيصًا لمناسبات الخطوبة، يحتوي على ورد أحمر فاخر وحلويات راقية مع إمكانية إضافة رسالة مخصصة. اجعل لحظة الخطوبة لا تُنسى.': 'A luxury engagement box with premium red roses, elegant sweets, and an optional personalized message.',
  'بوكس يجمع بين العطر الفاخر والشوكولاتة الراقية، هدية مثالية لمن يستحق الأفضل. تصميم أنيق ومحتوى متميز يجعلها هدية لا تُنسى.': 'A box combining luxury perfume and fine chocolate in an elegant presentation for an unforgettable gift.',
  'بوكس يجمع بين الورد الطبيعي الفاخر والشوكولاتة البلجيكية، هدية كلاسيكية راقية تناسب كل المناسبات. تصميم أنيق ومحتوى متميز يضمن رضا من يهديها.': 'A classic elegant box combining fresh premium flowers and Belgian chocolate, suitable for every occasion.',
  'بوكس عناية شخصية يحتوي على تشكيلة مختارة من منتجات العناية الفاخرة بالبشرة، هدية مثالية لمن يستحق الرعاية والاهتمام. منتجات طبيعية بجودة عالية.': 'A personal care box with selected premium skincare products, a thoughtful gift made with high-quality natural products.',
  'بوكس قهوة وحلويات يحتوي على تشكيلة مختارة من أجود أنواع القهوة مع حلويات شهية، هدية مثالية لمحبي القهوة. تصميم أنيق ومحتوى راقٍ يجعلها هدية مميزة.': 'A coffee and sweets box featuring selected quality coffee and delicious treats in an elegant presentation.',
  'بوكس ذكرى خاصة مصمم للاحتفال بالمناسبات والذكريات المميزة، يحتوي على ورد فاخر وشوكولاتة وهدية تذكارية. اجعل ذكرياتك لا تُنسى بهذا البوكس الراقي.': 'A special memory box with premium flowers, chocolate, and a keepsake, designed to celebrate meaningful moments.',
  'بوكس مفاجئة يحتوي على تشكيلة متنوعة من الهدايا المميزة، مصمم لإحداث عنصر المفاجأة والفرح. اختر هذا البوكس إذا كنت تريد هدية مليئة بالبهجة والإثارة.': 'A surprise box filled with a varied selection of special gifts, designed to bring excitement and joy.',
  'هدية فريدة مخصصة بالاسم مع إمكانية النقش الاحترافي، مثالية للمناسبات الخاصة التي تحتاج لمسة شخصية. اجعل هديتك لا تُنسى باسم من تحب.': 'A unique personalized name gift with professional engraving, perfect for occasions that deserve a personal touch.',
  'صندوق هدية مخصص يمكنك تصميمه حسب رغبتك، اختر محتوياته ولون التغليف والرسالة. مثالي لمن يريد هدية فريدة تعكس شخصيته وشخصية من يهديها.': 'A custom gift box you can design your way—choose the contents, wrapping color, and message for a truly personal gift.',
  'مثال: 059xxxxxxx': 'Example: 059xxxxxxx', 'مثال: وقت التوصيل أو أي تفاصيل إضافية': 'Example: delivery time or any additional details',
  'مثال: بوكس ورد فاخر': 'Example: Luxury Rose Box', 'مثال: بوكس ورد فاخر مع شوكولاتة وبطاقة إهداء': 'Example: Luxury rose box with chocolate and a gift card',
  'مثال: أحمر وذهبي': 'Example: Red and gold', 'مثال: كل عام وأنتِ بخير': 'Example: Wishing you a wonderful year',
  'مثال: 200 - 300 ريال': 'Example: 200 - 300 QAR', 'أي تفاصيل أخرى تريد إضافتها': 'Any other details you would like to add',
  'أي ملاحظات أخرى تريد إضافتها': 'Any other notes you would like to add', 'اكتب اسم الشخص المراد إهداء الهدية له': 'Enter the recipient’s name',
  'اسم الشخص المراد إهداء الهدية له': 'Recipient Name', 'اكتب رسالتك التي ستُرفق مع الهدية': 'Write the message to include with the gift',
  'اكتب رسالتك هنا...': 'Write your message here...', 'اكتب وصف الهدية ومحتوياتها...': 'Describe the gift and its contents...',
  'بدون تغليف': 'No Wrapping', 'تغليف بسيط': 'Simple Wrapping', 'تغليف أنيق': 'Elegant Wrapping', 'تغليف فاخر': 'Luxury Wrapping',
  'بوكس أنيق': 'Elegant Box', 'بوكس خشبي': 'Wooden Box', 'صندوق مبطن': 'Lined Box', 'شريط حرير': 'Silk Ribbon',
  'بطاقة إهداء': 'Gift Card', 'بطاقة إهداء مجانية': 'Free Gift Card', 'بطاقة تهنئة': 'Greeting Card', 'رسالة مخصصة': 'Personalized Message',
  'ورد طبيعي': 'Fresh Flowers', 'ورد طبيعي طازج': 'Fresh Natural Flowers', 'ورد أحمر فاخر': 'Premium Red Roses', 'ورد وردي طبيعي': 'Natural Pink Roses',
  'ورد أبيض طبيعي': 'Natural White Roses', 'شوكولاتة بلجيكية': 'Belgian Chocolate', 'شوكولاتة فاخرة': 'Premium Chocolate',
  'شوكولاتة وحلويات': 'Chocolate & Sweets', 'حلويات راقية': 'Fine Sweets', 'حلويات شهية': 'Delicious Sweets',
  'عطر فاخر': 'Luxury Perfume', 'قهوة مختارة': 'Selected Coffee', 'منتجات طبيعية': 'Natural Products', 'هدية تذكارية': 'Keepsake',
  'تصميم أنيق': 'Elegant Design', 'تصميم احتفالي': 'Celebration Design', 'تصميم رومانطقي': 'Romantic Design', 'تصميم شخصي': 'Personal Design',
  'تصميم فريد': 'Unique Design', 'جودة عالية': 'High Quality', 'طازج مضمون': 'Guaranteed Fresh', 'مقاس مثالي': 'Perfect Size',
  'خيارات متعددة': 'Multiple Options', 'خيارات متنوعة': 'Varied Options', 'تشكيلة مختارة': 'Selected Assortment', 'تشكيلة متنوعة': 'Varied Selection',
  'محتويات متنوعة': 'Varied Contents', 'عنصر مفاجأة': 'Surprise Element', 'هدية مثالية': 'Perfect Gift', 'هدية عملية': 'Practical Gift',
  'ظاهر': 'Visible', 'مخفي': 'Hidden', 'متوفر': 'Available', 'نفد': 'Out of Stock', 'إزالة': 'Remove',
  'أخرى': 'Other', 'زفاف': 'Wedding', 'ذكرى سنوية': 'Anniversary', 'حلويات': 'Sweets', 'الدوحة': 'Doha', 'الريان': 'Al Rayyan', 'الوكرة': 'Al Wakrah',
  'مرحبا، أريد الاستفسار': 'Hello, I would like to ask a question', 'مرحبا، أريد الاستفسار عن هدية': 'Hello, I would like to ask about a gift',
  'مرحبا، أريد طلب هدية عبر واتساب': 'Hello, I would like to order a gift via WhatsApp'
};


Object.assign(exact, {
  'إعدادات الصفحة الرئيسية': 'Homepage Settings',
  'تحكم في واجهة الصفحة الرئيسية بدون تعديل الكود': 'Manage the homepage without editing code',
  'الشارة أعلى العنوان': 'Badge Above Title',
  'العنوان الرئيسي': 'Main Title',
  'الوصف الرئيسي': 'Main Description',
  'صورة الغلاف': 'Hero Image',
  'اختر صورة من الجهاز': 'Choose an Image',
  'جارٍ رفع الصورة...': 'Uploading image...',
  'إظهار وإخفاء أقسام الصفحة': 'Show or Hide Homepage Sections',
  'التصنيفات': 'Categories',
  'الأكثر طلبًا': 'Best Sellers',
  'المناسبات': 'Occasions',
  'لماذا لمسة هدية؟': 'Why Lamsa Hedaya?',
  'آراء العملاء': 'Customer Reviews',
  'صمم هديتك': 'Design Your Gift',
  'حفظ إعدادات الصفحة': 'Save Homepage Settings',
  'إلغاء': 'Cancel',
  'إضافة منتج': 'Add Product',
  'خروج': 'Sign Out',
  'لوحة إدارة المنتجات': 'Product Management',
  'أضف المنتجات وعدّل الأسعار والتوفر من داخل الموقع': 'Add products and manage prices and availability from the website',
  'JPG أو PNG أو WEBP — بحد أقصى 5 MB': 'JPG, PNG, or WEBP — up to 5 MB',
  'صورة الغلاف': 'Hero Image',

  'في لمسة هدية نؤمن أن الهدية ليست مجرد شيء يُقدّم، بل رسالة ومشاعر وذكرى تبقى.': 'At Lamsa Hedaya, we believe a gift is more than an item. It is a message, a feeling, and a lasting memory.',
  'التخصيص': 'Personalization',
  'اكتب اسم المتجر': 'Enter store name',
  'اكتب رقم واتساب صحيحًا': 'Enter a valid WhatsApp number',
  'اكتب كل ميزة في سطر منفصل\nتغليف فاخر\nبطاقة إهداء مجانية\nتوصيل سريع': 'Enter each feature on a separate line\nPremium wrapping\nFree gift card\nFast delivery',
  'إضافة إلى المفضلة': 'Add to Wishlist',
  'نحن هنا لخدمتك. تواصل معنا في أي وقت.': 'We are here to help. Contact us anytime.',
  'معلومات التواصل': 'Contact Information',
  'رقم الهاتف': 'Phone Number',
  'واتساب': 'WhatsApp',
  'البريد الإلكتروني': 'Email',
  'إنستغرام': 'Instagram',
  'الموقع': 'Location',
  'ساعات العمل': 'Working Hours',
  'السبت إلى الخميس': 'Saturday to Thursday',
  '9:00 صباحًا - 10:00 مساءً': '9:00 AM - 10:00 PM',
  'الجمعة': 'Friday',
  '4:00 مساءً - 10:00 مساءً': '4:00 PM - 10:00 PM',
  'موقعنا': 'Our Location',
  'خريطة الموقع - الدوحة، قطر': 'Location Map - Doha, Qatar',
  'يمكن إضافة خريطة تفاعلية لاحقًا': 'An interactive map can be added later',
  'أرسل لنا رسالة': 'Send Us a Message',
  'املأ النموذج التالي وسنتواصل معك عبر واتساب في أقرب وقت.': 'Fill in the form below and we will contact you on WhatsApp as soon as possible.',
  'الاسم': 'Name',
  'الرسالة': 'Message',
  'إرسال عبر واتساب': 'Send via WhatsApp',
  'سيتم تحويلك إلى واتساب لإرسال رسالتك': 'You will be redirected to WhatsApp to send your message',
  'تسوق الآن': 'Shop Now',
  'تسوق حسب التصنيف': 'Shop by Category',
  'اختر هديتك المميزة واجعل كل مناسبة ذكرى لا تُنسى.': 'Choose a special gift and make every occasion unforgettable.',
  'اختر من تشكيلتنا الواسعة': 'Choose from our wide selection',
  'الهدايا الأكثر شعبية لدى عملائنا': 'Our customers’ most popular gifts',
  'تصنيفات متنوعة': 'Different Categories',
  'عميل سعيد': 'Happy Customers',
  '+500 عميل سعيد': '+500 Happy Customers',
  'تقييم 4.9': '4.9 Rating',
  'تقييم العملاء': 'Customer Rating',
  'فكرة المتجر': 'Our Story',
  'هدية تم تقديمها': 'Gifts Delivered',
  'لنجعل مناسبتك ذكرى لا تُنسى': 'Let’s make your occasion unforgettable',
  'تواصل معنا الآن وسنساعدك في اختيار أو تصميم الهدية المثالية.': 'Contact us now and we will help you choose or design the perfect gift.',
  'اختر تفاصيل هديتك وسنساعدك في تحويلها إلى شيء مميز.': 'Choose your gift details and we will help turn them into something special.',
  'هديتك المميزة بين يديك': 'Your Special Gift, Your Way',
  'املأ النموذج التالي بتفاصيل هديتك وسنقوم بتصميمها خصيصًا لك وفق رغبتك.': 'Fill in your gift details and we will design it especially for you.',
  'اختر نوع الهدية': 'Choose Gift Type',
  'اختر نوع التغليف': 'Choose Wrapping Type',
  'النص المطلوب طباعته': 'Text to Print',
  'أرسل طلب التصميم عبر واتساب': 'Send Design Request via WhatsApp',
  'سيتم تحويلك إلى واتساب لإرسال تفاصيل طلب التصميم': 'You will be redirected to WhatsApp to send your design request',
  'في لمسة هدية نؤمن أن الهدية ليست مجرد شيء يُقدّم، بل رسالة ومشاعر وذكرى تبقى. لذلك نسعى لتقديم هدايا فريدة تعبّر عن ما يعجز الكلام عن التعبير عنه.': 'At Lamsa Hedaya, we believe a gift is more than an item. It is a message, a feeling, and a lasting memory. We create unique gifts that express what words cannot.',
  'بدأت رحلة لمسة هدية من شغف بسيط بجمال الهدايا وقيمتها المعنوية. نؤمن أن الهدية الحقيقية ليست في قيمتها المادية، بل في المشاعر التي تحملها والذكرى التي تخلقها. لذلك نسعى دائمًا لتقديم تشكيلة فاخرة ومميزة من الهدايا التي تناسب كل المناسبات، مع إمكانية تخصيصها لتكون فريدة تمامًا.': 'Lamsa Hedaya began with a simple passion for beautiful, meaningful gifts. We believe the true value of a gift lies in the feelings it carries and the memories it creates. That is why we offer a premium selection for every occasion, with personalization options to make each gift truly unique.',
  'فريقنا متاح عبر واتساب لمساعدتكم في اختيار الهدية المثالية وتخصيصها. نحن هنا لخدمتكم في كل خطوة.': 'Our team is available on WhatsApp to help you choose and personalize the perfect gift. We are here for you every step of the way.',
  'طلبت هدية تخرج وكانت النتيجة رائعة جدًا. الورد كان طازج والتغليف فخم. شكرًا لمسة هدية على الذوق الرفيع.': 'I ordered a graduation gift and the result was wonderful. The flowers were fresh and the wrapping was luxurious. Thank you, Lamsa Hedaya.',
  'التغليف كان أجمل من الصور ووصل الطلب في الوقت المحدد. تجربة راقية بكل المقاييس وسأكررها بالتأكيد.': 'The wrapping looked even better than the photos and the order arrived on time. A truly elegant experience that I will definitely repeat.',
  'طلبت بوكس خطوبة وكان فوق التوقعات. الجودة عالية والتفاصيل دقيقة. جعلت المناسبة أكثر تميزًا. أنصح به بشدة.': 'I ordered an engagement box and it exceeded expectations. The quality was excellent and the details were beautiful. Highly recommended.',
  'خدمة ممتازة وتعامل سريع عبر واتساب. ساعدوني في اختيار الهدية المناسبة ووصلت في نفس اليوم. تعامل راقٍ ومميز.': 'Excellent service and fast support on WhatsApp. They helped me choose the right gift and it arrived the same day.',
  'أحمد الكواري': 'Ahmed Al-Kuwari',
  'سارة المهندي': 'Sara Al-Mohannadi',
  'خالد المري': 'Khalid Al-Marri',
  'نورة العبدالله': 'Noura Al-Abdullah',
  'دخول إدارة المتجر': 'Store Admin Login',
  'هذه الصفحة مخصصة لصاحب المتجر فقط': 'This page is for the store owner only',
  'كلمة المرور': 'Password',
  'البريد الإلكتروني أو كلمة المرور غير صحيحة': 'Incorrect email or password',
  'لوحة إدارة المنتجات': 'Product Management',
  'أضف المنتجات وعدّل الأسعار والتوفر من داخل الموقع': 'Add products and manage prices and availability from the website.',
  'إضافة منتج': 'Add Product',
  'خروج': 'Sign Out',
  'اسم المنتج *': 'Product Name *',
  'السعر الحالي *': 'Current Price *',
  'السعر القديم (اختياري)': 'Old Price (Optional)',
  'التصنيف': 'Category',
  'صور المنتج': 'Product Images',
  'رابط الصورة الرئيسية (اختياري)': 'Main Image URL (Optional)',
  'اضغط «اجعلها الرئيسية» لتغيير صورة الغلاف': 'Tap “Make Main” to change the cover image',
  'اجعلها الرئيسية': 'Make Main',
  'الوصف المختصر': 'Short Description',
  'الشارة': 'Badge',
  'بدون شارة': 'No Badge',
  'المميزات': 'Features',
  'ظاهر للزبائن': 'Visible to Customers',
  'إلغاء': 'Cancel',
  'لا توجد منتجات بعد': 'No products yet',
  '+ أضف أول منتج': '+ Add First Product',
  'ظاهر': 'Visible',
  'مخفي': 'Hidden',
  'متوفر': 'Available',
  'نفد': 'Out of Stock',
  'إزالة': 'Remove',
  'أدخل سعرًا صحيحًا': 'Enter a valid price',
  'السعر القديم غير صحيح': 'Old price is invalid',
  'أخرى': 'Other',
  'زفاف': 'Wedding',
  'ذكرى سنوية': 'Anniversary',
  'شريط حرير': 'Silk Ribbon',
  'بوكس خشبي': 'Wooden Box',
  'صندوق مبطن': 'Lined Box',
  'بدون تغليف': 'No Wrapping',
  'تغليف بسيط': 'Simple Wrapping',
  'صندوق هدية قابل للتخصيص بالكامل حسب رغبتك': 'A fully customizable gift box made your way',
  'بوكس هدايا': 'Gift Box',
  'بوكس هدية فاخر': 'Luxury Gift Box',
  'تشكيلة فاخرة من الهدايا لكل المناسبات': 'A premium selection of gifts for every occasion',
  'نحن هنا لمساعدتك في أي وقت': 'We are here to help anytime',
  '© 2026 لمسة هدية - جميع الحقوق محفوظة': '© 2026 Lamsa Hedaya - All rights reserved'
});

const partial: Array<[RegExp, string]> = [
  [/هدايا /g, 'Gifts for '], [/ ريال/g, ' QAR'], [/اسم المنتج/g, 'Product Name'], [/السعر/g, 'Price'], [/الكمية/g, 'Quantity'],
  [/إجمالي المنتج/g, 'Item Total'], [/إجمالي الطلب/g, 'Order Total'], [/لون التغليف/g, 'Wrapping Color'], [/الاسم المخصص/g, 'Custom Name'],
  [/الملاحظات/g, 'Notes'], [/جميع الحقوق محفوظة/g, 'All rights reserved'], [/نوع التغليف/g, 'Wrapping Type'], [/الميزانية/g, 'Budget'], [/الألوان المفضلة/g, 'Preferred Colors'], [/تاريخ التسليم/g, 'Delivery Date']
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

    // Translate only newly inserted elements. We intentionally do NOT observe
    // characterData because translating a text node changes characterData itself,
    // which can create an expensive feedback loop and freeze the page.
    const observer = new MutationObserver((mutations) => {
      if (language !== 'en') return;
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          translateNode(node);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({ language, toggleLanguage: () => setLanguage((v) => v === 'ar' ? 'en' : 'ar') }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
