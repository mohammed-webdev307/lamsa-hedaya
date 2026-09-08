import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '@/utils/whatsapp';

export default function FloatingWhatsApp() {
  const url = buildWhatsAppUrl('مرحبا، أريد الاستفسار عن هدية');

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 left-5 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl active:scale-95"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle size={26} className="fill-white/20" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
    </a>
  );
}
