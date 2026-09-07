import { FormEvent, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setChecking(false);
    });
  }, []);

  if (!checking && signedIn) {
    const from = (location.state as { from?: string } | null)?.from ?? '/admin';
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      return;
    }

    navigate('/admin', { replace: true });
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-cream-50">
      <div className="container-lux max-w-md">
        <div className="bg-white rounded-3xl border border-beige-100 shadow-xl p-6 sm:p-8">
          <div className="w-14 h-14 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mx-auto mb-4">
            <LockKeyhole size={26} />
          </div>
          <h1 className="text-2xl font-bold text-brown-700 text-center mb-2">دخول إدارة المتجر</h1>
          <p className="text-sm text-brown-400 text-center mb-7">هذه الصفحة مخصصة لصاحب المتجر فقط</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-lux">البريد الإلكتروني</label>
              <div className="relative">
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-300" />
                <input
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-lux pr-10 text-left"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="label-lux">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-lux pl-10 text-left"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-300 hover:text-brown-500"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-500">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
