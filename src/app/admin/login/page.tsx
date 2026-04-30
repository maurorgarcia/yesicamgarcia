'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin/dashboard');
      }
    };
    checkSession();
  }, [router]);

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
    <div className="min-h-screen flex bg-background overflow-hidden font-sans">
      {/* Left Panel: Cinematic Brand Experience */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden">
        <Image 
          src="/fotoNutri.png" 
          alt="Consultorio" 
          fill 
          sizes="50vw"
          className="object-cover scale-105 animate-slow-zoom" 
        />
        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-[1px]" />
        
        {/* Content on Left Panel */}
        <div className="relative z-10 w-full h-full p-20 flex flex-col justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="w-56 h-24 relative">
              <Image src="/logo.png" alt="Logo" fill sizes="224px" loading="eager" className="object-contain object-left opacity-90" />
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              <h1 className="text-5xl xl:text-6xl font-serif font-bold text-white leading-tight">
                Gestioná con <br /> 
                <span className="italic font-light text-primary tracking-wide">Excelencia.</span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
              className="text-white text-lg font-light max-w-sm leading-relaxed italic"
            >
              "La nutrición es la ciencia de la individualidad."
            </motion.p>
          </div>

          <div className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-bold">
            © {new Date().getFullYear()} Lic. Yesica M. García
          </div>
        </div>
      </div>

      {/* Right Panel: Integrated Access Form */}
      <div className="w-full lg:w-[50%] bg-background flex flex-col justify-center px-8 md:px-20 lg:px-28 relative h-screen overflow-hidden">
        {/* Subtle background texture for mobile */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(197,160,89,0.08),_transparent)] lg:hidden" />
        
        <div className="max-w-sm w-full mx-auto relative z-10 py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Mobile Logo & Back Link Row */}
            <div className="flex justify-between items-center mb-12 lg:mb-20">
              <div className="w-44 h-16 lg:hidden relative">
                <Image src="/logo.png" alt="Logo" fill sizes="176px" loading="eager" className="object-contain object-left" />
              </div>
              <Link 
                href="/" 
                className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-secondary/30 hover:text-primary transition-all"
              >
                <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                Inicio
              </Link>
            </div>

            <header className="mb-10 lg:mb-16">
              <h3 className="text-4xl font-serif font-bold text-secondary mb-3 tracking-tight">Iniciar Sesión</h3>
              <p className="text-secondary/40 text-sm font-medium">Panel Administrativo</p>
            </header>

            <form onSubmit={handleLogin} className="space-y-10 lg:space-y-12">
              <div className="space-y-10 lg:space-y-14">
                <div className="group relative">
                  <input
                    required
                    type="email"
                    className="w-full py-3 bg-transparent border-b border-secondary/10 focus:border-primary outline-none transition-all text-secondary font-bold placeholder:text-transparent peer text-base"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label 
                    htmlFor="email"
                    className="absolute left-0 top-3 text-[9px] uppercase tracking-[0.3em] font-black text-primary pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-secondary/60 peer-[:not(:placeholder-shown)]:-top-6"
                  >
                    Email Profesional
                  </label>
                </div>

                <div className="group relative">
                  <input
                    required
                    type="password"
                    className="w-full py-3 bg-transparent border-b border-secondary/10 focus:border-primary outline-none transition-all text-secondary font-bold placeholder:text-transparent peer text-base"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label 
                    htmlFor="password"
                    className="absolute left-0 top-3 text-[9px] uppercase tracking-[0.3em] font-black text-primary pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-secondary/60 peer-[:not(:placeholder-shown)]:-top-6"
                  >
                    Contraseña
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="peer appearance-none w-5 h-5 rounded border border-secondary/20 checked:bg-secondary checked:border-secondary transition-all cursor-pointer"
                    />
                    <div className="absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-white">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-black text-secondary/30 group-hover:text-secondary transition-colors">Recordar sesión</span>
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-500 text-[10px] font-bold rounded-2xl border border-red-100 uppercase tracking-widest text-center shadow-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full py-7 rounded-full bg-secondary hover:bg-primary text-white font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl shadow-secondary/10 transition-all duration-700 active:scale-95"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar al Panel'}
              </Button>
            </form>

            <footer className="mt-14 lg:mt-24 pt-8 border-t border-secondary/5">
              <p className="text-[9px] text-secondary/20 uppercase tracking-[0.5em] font-black">
                Acceso Privado · Lic. Yesica M. García
              </p>
            </footer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
