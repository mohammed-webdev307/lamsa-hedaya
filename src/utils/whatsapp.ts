import { STORE_CONFIG } from '@/data/store';
import type { CartItem, Product, ProductCustomization } from '@/types';
import { getCurrentLanguage, translateText } from '@/lib/language';

export function formatPrice(price: number): string {
  return `${price.toLocaleString('en-US')} ${STORE_CONFIG.currency}`;
}

export function getDefaultCustomization(): ProductCustomization {
  return {
    wrappingColor: 'default',
    recipientName: '',
    giftMessage: '',
    occasion: '',
    notes: '',
  };
}

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encoded}`;
}

export function buildProductWhatsAppMessage(
  product: Product,
  quantity: number,
  customization: ProductCustomization,
): string {
  const lines = [
    '🛍️ طلب جديد من لمسة هدية',
    '',
    '🎁 المنتج',
    '',
    `اسم المنتج: ${product.name}`,
    `السعر: ${formatPrice(product.price)}`,
    `الكمية: ${quantity}`,
    `💰 إجمالي الطلب: ${formatPrice(product.price * quantity)}`,
  ];

  if (customization.wrappingColor && customization.wrappingColor !== 'default') {
    lines.push(`🎨 لون التغليف: ${customization.wrappingColor}`);
  }
  if (customization.recipientName) {
    lines.push(`👤 الاسم المخصص: ${customization.recipientName}`);
  }
  if (customization.giftMessage) {
    lines.push(`💌 رسالة الإهداء: ${customization.giftMessage}`);
  }
  if (customization.occasion) {
    lines.push(`🎉 المناسبة: ${customization.occasion}`);
  }
  if (customization.notes) {
    lines.push(`📝 الملاحظات: ${customization.notes}`);
  }

  return (getCurrentLanguage() === 'en' ? lines.map(translateText) : lines).join('\n');
}

export function buildCartWhatsAppMessage(items: CartItem[]): string {
  const lines = [
    '🛍️ طلب جديد من لمسة هدية',
    '',
    '🎁 المنتجات',
    '',
  ];

  let total = 0;

  items.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    total += itemTotal;

    lines.push(`${index + 1}. ${item.product.name}`);
    lines.push(`   الكمية: ${item.quantity}`);
    lines.push(`   السعر: ${formatPrice(item.product.price)}`);

    if (item.quantity > 1) {
      lines.push(`   إجمالي المنتج: ${formatPrice(itemTotal)}`);
    }

    if (item.customization.wrappingColor && item.customization.wrappingColor !== 'default') {
      lines.push(`   🎨 لون التغليف: ${item.customization.wrappingColor}`);
    }
    if (item.customization.recipientName) {
      lines.push(`   👤 الاسم المخصص: ${item.customization.recipientName}`);
    }
    if (item.customization.giftMessage) {
      lines.push(`   💌 رسالة الإهداء: ${item.customization.giftMessage}`);
    }
    if (item.customization.occasion) {
      lines.push(`   🎉 المناسبة: ${item.customization.occasion}`);
    }
    if (item.customization.notes) {
      lines.push(`   📝 الملاحظات: ${item.customization.notes}`);
    }

    lines.push('');
  });

  lines.push(`💰 إجمالي الطلب: ${formatPrice(total)}`);

  return (getCurrentLanguage() === 'en' ? lines.map(translateText) : lines).join('\n');
}

export function buildCustomGiftWhatsAppMessage(data: Record<string, string>): string {
  const lines = ['🎁 طلب تصميم هدية مخصصة من لمسة هدية', ''];

  const labels: Record<string, string> = {
    giftType: 'نوع الهدية',
    occasion: 'المناسبة',
    budget: 'الميزانية',
    colors: 'الألوان المفضلة',
    wrapping: 'نوع التغليف',
    recipientName: 'الاسم المطلوب',
    printText: 'النص المطلوب طباعته',
    message: 'رسالة الإهداء',
    deliveryDate: 'تاريخ التسليم',
    notes: 'ملاحظات إضافية',
  };

  Object.entries(labels).forEach(([key, label]) => {
    if (data[key]) {
      lines.push(`${label}: ${data[key]}`);
    }
  });

  return (getCurrentLanguage() === 'en' ? lines.map(translateText) : lines).join('\n');
}

export function buildContactWhatsAppMessage(name: string, message: string): string {
  return getCurrentLanguage() === 'en' ? `Hello, I’m ${name}.\n\n${message}` : `مرحبا، أنا ${name}.\n\n${message}`;
}

