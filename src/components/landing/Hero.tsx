'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-32 pb-20 bg-background overflow-hidden">
      {/* User Palette Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="premium-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#D4A373" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#premium-grid)" />
        </svg>
      </div>
      
      {/* Background Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-primary/5 rounded-full pointer-events-none z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-[55%] text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-secondary/5 text-secondary text-[9px] font-bold uppercase tracking-[0.25em] mb-8 border border-secondary/10">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Lic. Yesica M. García · MP 7250
              </div>
              
              <h1 className="title-editorial mb-8 text-foreground">
                Tu nutricionista <br />
                <span className="text-primary">de cabecera</span>
              </h1>

              <p className="text-base md:text-lg leading-relaxed text-muted max-w-xl mb-12 font-sans font-light">
                Diseño planes nutricionales adaptados a <em>tu</em> vida, con el rigor técnico de una especialista en nutrición clínica y deportiva. Presencial en San Nicolás · Online para todo el país.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <Link href="/reservar">
                  <Button 
                    className="rounded-full px-10 py-7 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-secondary/10 bg-secondary hover:bg-secondary/90 text-white transition-all duration-500"
                  >
                    Agendar mi consulta
                  </Button>
                </Link>
                <div className="flex flex-col gap-0.5 px-5 py-1.5 border-l border-primary/20">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">
                    Atención Integral
                  </p>
                  <p className="text-[10px] text-muted font-medium opacity-60">Gestión Online</p>
                </div>
              </div>

              {/* Refined Trust Indicators */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
                <div>
                  <div className="text-2xl font-bold text-secondary">MP 7250</div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold mt-2 opacity-50">Matrícula Profesional</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">ISAK II</div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold mt-2 opacity-50">Certificación Internacional</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">CIENCIA</div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold mt-2 opacity-50">Evidencia Clínica</div>
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
              <div className="absolute -inset-10 bg-gradient-to-tr from-secondary/5 to-primary/5 rounded-full blur-[100px] opacity-40" />
              
              <div className="relative aspect-[4/5] rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl overflow-hidden group">
                <Image 
                  src="/fotoNutri.png" 
                  alt="Lic. Yesica M. García" 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[4s] ease-out" 
                />
                
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-[2rem] border border-white/50 z-20">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground leading-tight">Yesica M. García</p>
                      <p className="text-[10px] text-secondary font-semibold mt-1 uppercase tracking-[0.1em]">Nutricionista · San Nicolás</p>
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
