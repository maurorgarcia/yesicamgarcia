'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ChevronLeft, MapPin, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

// Carga dinámica del BookingManager sin SSR para evitar errores de hidratación
const BookingManager = dynamic(
  () => import('@/components/booking/BookingManager').then((mod) => mod.BookingManager),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold animate-pulse">Cargando agenda...</p>
      </div>
    )
  }
);

export default function ReservarPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
        {/* Luz de fondo sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Encabezado Personal */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-bold text-muted hover:text-primary transition-all duration-500 mb-10 group"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-foreground mb-6">
                Mi agenda <span className="text-primary italic font-light">de turnos</span>
              </h1>
              <p className="text-base md:text-lg text-muted font-sans font-light max-w-xl mx-auto leading-relaxed">
                Elegí el servicio y el horario que mejor te quede. <br className="hidden md:block" />
                Trabajemos juntos para lograr tus objetivos.
              </p>
            </motion.div>
          </div>

          {/* Contenedor de Reserva */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="max-w-4xl mx-auto bg-white border border-slate-50 rounded-[3rem] shadow-2xl shadow-primary/5 p-8 md:p-14 lg:p-20 relative"
          >
            <BookingManager />

            {/* Información al pie */}
            <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center text-primary">
                  <MapPin size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-foreground">San Nicolás</p>
                  <p className="text-[9px] text-muted">Centro CEMIR · Gimnasio XTREME</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center text-primary">
                  <Globe size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-foreground">Consulta Online</p>
                  <p className="text-[9px] text-muted">Desde cualquier lugar</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                  <ShieldCheck size={18} />
                </div>
                <div className="text-left">
                  <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-foreground">Privacidad <br />Garantizada</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-12 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-medium">
              Lic. Yesica M. García · Nutricionista · MP 7250
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
