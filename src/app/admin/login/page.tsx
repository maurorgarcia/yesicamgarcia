'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-xl p-10 border border-secondary">
        <h1 className="text-3xl font-serif mb-2 text-center">Panel de Control</h1>
        <p className="text-black/40 text-center mb-10 text-sm italic">Exclusivo para Lic. Yesica M. García</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black/60 ml-1">Email</label>
            <input
              required
              type="email"
              className="w-full px-6 py-4 rounded-2xl bg-secondary/30 border-none focus:ring-2 focus:ring-accent transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black/60 ml-1">Contraseña</label>
            <input
              required
              type="password"
              className="w-full px-6 py-4 rounded-2xl bg-secondary/30 border-none focus:ring-2 focus:ring-accent transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full py-5" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>
        </form>
      </div>
    </div>
  );
}
