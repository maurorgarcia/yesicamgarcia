'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center pt-32 pb-16 bg-background overflow-hidden">
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
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-[62%] text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              {/* Mobile Profile Photo (Visible only on mobile/tablet) */}
              <div className="lg:hidden mb-10 relative inline-block">
                <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl" />
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary/20 p-1.5 bg-white shadow-xl">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image 
                      src="/fotoNutri.png" 
                      alt="Lic. Yesica M. García" 
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-secondary/5 text-secondary text-[9px] font-bold uppercase tracking-[0.25em] mb-8 border border-secondary/10">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Lic. Yesica M. García · MP 7250
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-foreground leading-[1.1]">
                Tu nutricionista <br />
                <span className="text-primary">de cabecera</span>
              </h1>

              <p className="text-base leading-relaxed text-muted max-w-xl mb-10 font-sans font-light mx-auto lg:mx-0">
                Diseño planes nutricionales adaptados a <em>tu</em> vida, con el rigor técnico de una especialista en nutrición clínica y deportiva. Presencial en San Nicolás · Online para todo el país.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-center lg:items-start justify-center lg:justify-start">
                <Link href="/reservar">
                  <Button 
                    className="rounded-full px-10 py-7 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-primary/10 bg-primary hover:bg-primary/90 text-white transition-all duration-500 hover:scale-105"
                  >
                    Agendar mi consulta
                  </Button>
                </Link>
                <div className="flex flex-col gap-0.5 px-5 py-1.5 border-l-0 sm:border-l border-primary/20 text-center sm:text-left">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">
                    Atención Integral
                  </p>
                  <p className="text-[10px] text-muted font-medium opacity-60">Gestión Online</p>
                </div>
              </div>

              {/* Refined Trust Indicators */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 pt-10 border-t border-slate-100">
                <div className="text-center lg:text-left">
                  <div className="text-xl md:text-2xl font-bold text-secondary">MP 7250</div>
                  <div className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted font-bold mt-2 opacity-50">Matrícula Profesional</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl md:text-2xl font-bold text-secondary">ISAK II</div>
                  <div className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted font-bold mt-2 opacity-50">Certificación Internacional</div>
                </div>
                <div className="text-center lg:text-left col-span-2 md:col-span-1 border-t md:border-t-0 pt-6 md:pt-0">
                  <div className="text-xl md:text-2xl font-bold text-secondary uppercase tracking-tight">Ciencia</div>
                  <div className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted font-bold mt-2 opacity-50">Evidencia Clínica</div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block w-[38%]"
          >
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-tr from-secondary/5 to-primary/5 rounded-full blur-[80px] opacity-40" />
              
              <div className="relative aspect-[5/6] rounded-[3rem] bg-white border border-slate-100 shadow-2xl overflow-hidden group">
                <Image 
                  src="/fotoNutri.png" 
                  alt="Lic. Yesica M. García" 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[4s] ease-out" 
                />
                
                <div className="absolute bottom-4 left-4 right-4 p-5 bg-white/95 backdrop-blur-sm shadow-xl rounded-[1.5rem] border border-white/50 z-20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">Yesica M. García</p>
                      <p className="text-[9px] text-secondary font-semibold mt-1 uppercase tracking-[0.1em]">Nutricionista</p>
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
