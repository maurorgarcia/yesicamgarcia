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
      
      {/* Warm Palette Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[35vw] h-[35vw] bg-secondary/15 rounded-full blur-[80px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-[55%] text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Consulta Presencial y Online
              </div>
              
              <h1 className="title-editorial mb-6 text-foreground">
                Te ayudo a potenciar tu salud a través de la <span className="text-primary italic font-light">evidencia científica</span>
              </h1>

              <p className="text-base md:text-lg leading-relaxed text-muted max-w-xl mb-10 font-sans font-light">
                Soy la Lic. Yesica M. García y mi objetivo es diseñar con vos un plan nutricional único, basado en ciencia y adaptado 100% a tus objetivos y estilo de vida.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link href="/reservar">
                  <Button 
                    size="lg" 
                    className="rounded-full px-8 py-6 text-sm shadow-xl shadow-primary/10"
                  >
                    Agendar mi consulta
                  </Button>
                </Link>
                <div className="flex flex-col gap-1 px-4 py-1">
                  <div className="flex -space-x-3 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-accent flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-primary/20" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest opacity-80">
                    Reserva tu turno online
                  </p>
                </div>
              </div>

              {/* Compact Trust Indicators */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                <div>
                  <div className="text-xl font-bold text-foreground">MP 7250</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted font-bold opacity-50">Matrícula Profesional</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">ISAK II</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted font-bold opacity-50">Certificación Internacional</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">EVIDENCIA</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted font-bold opacity-50">Respaldo Científico</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual element with the new palette */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block w-[45%]"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-accent/20 rounded-3xl blur-2xl opacity-40" />
              <div className="relative aspect-[4/5] rounded-[2.5rem] bg-white border border-white/40 shadow-2xl overflow-hidden group">
                <Image 
                  src="/fotoNutri.png" 
                  alt="Lic. Yesica M. García" 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" 
                />
                
                {/* Artistic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-40 pointer-events-none" />
                
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-4 sm:p-5 bg-white shadow-xl rounded-2xl border border-foreground/5 z-20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">Enfoque Deportivo</p>
                      <p className="text-[11px] text-muted font-medium mt-0.5">Rendimiento & Bienestar</p>
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
