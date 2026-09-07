import { CheckCircle, Info, XCircle } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

export default function ToastContainer() {
  const { toasts } = useStore();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle size={20} className="text-sage-400" />,
          info: <Info size={20} className="text-gold-400" />,
          error: <XCircle size={20} className="text-rose-400" />,
        };
        return (
          <div
            key={toast.id}
            className="bg-white shadow-lg rounded-xl px-4 py-3 flex items-center gap-3 border border-beige-200 animate-toast-in pointer-events-auto"
          >
            {icons[toast.type]}
            <span className="text-sm font-medium text-brown-700 flex-1">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
