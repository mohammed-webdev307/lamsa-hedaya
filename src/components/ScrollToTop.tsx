import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-5 right-5 z-40 w-11 h-11 bg-brown-500 text-cream-50 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:bg-brown-600 active:scale-95 animate-fade-in"
      aria-label="العودة للأعلى"
    >
      <ArrowUp size={20} />
    </button>
  );
}
