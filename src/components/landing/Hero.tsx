'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 bg-background overflow-hidden">
      {/* User Palette Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="premium-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#D4A373" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#premium-grid)" />
        </svg>
      </div>
      
      {/* Background Accents with New Palette */}
      <div className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-primary/5 rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[35vw] h-[35vw] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-[55%] text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-[0.2em] mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Consulta Presencial y Online
              </div>
              
              <h1 className="title-editorial mb-8 text-foreground">
                Potenciá tu salud con <br />
                <span className="text-primary italic font-light">Ciencia y Consciencia</span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed text-muted max-w-xl mb-12 font-sans font-light">
                Soy la <span className="text-foreground font-medium">Lic. Yesica M. García</span> y diseño estrategias nutricionales únicas, basadas en evidencia y adaptadas a tu ritmo de vida.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Link href="/reservar">
                  <Button 
                    size="lg" 
                    className="rounded-full px-10 py-7 text-sm font-bold shadow-2xl shadow-primary/20 bg-primary hover:bg-primary-hover transition-all duration-500 scale-105 hover:scale-110"
                  >
                    Agendar mi consulta
                  </Button>
                </Link>
                <div className="flex flex-col gap-1 px-4 py-2 border-l border-primary/10 ml-2">
                  <p className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">
                    Reserva online
                  </p>
                  <p className="text-[10px] text-muted font-medium">Fácil, rápido y seguro</p>
                </div>
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-primary/10">
                <div>
                  <div className="text-2xl font-serif font-black text-secondary">MP 7250</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted font-bold mt-1 opacity-60">Matrícula Profesional</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-black text-secondary">ISAK II</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted font-bold mt-1 opacity-60">Certificación Internacional</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-black text-secondary">EVIDENCIA</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted font-bold mt-1 opacity-60">Respaldo Científico</div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block w-[45%]"
          >
            <div className="relative">
              {/* Colored Glow behind image */}
              <div className="absolute -inset-10 bg-gradient-to-tr from-primary/20 to-secondary/10 rounded-full blur-[100px] opacity-60" />
              
              <div className="relative aspect-[4/5] rounded-[3rem] bg-white border border-white/40 shadow-2xl overflow-hidden group">
                <Image 
                  src="/fotoNutri.png" 
                  alt="Lic. Yesica M. García" 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out" 
                />
                
                {/* Artistic overlay with color */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-transparent to-transparent opacity-60 pointer-events-none" />
                
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl border border-white/50 z-20">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shrink-0 shadow-lg shadow-secondary/20">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground leading-tight">Enfoque Deportivo</p>
                      <p className="text-xs text-secondary font-semibold mt-1 uppercase tracking-wider">Rendimiento & Salud</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
