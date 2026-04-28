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
      <main className="min-h-screen bg-[#FDFCFB] relative overflow-hidden flex flex-col md:flex-row items-stretch">
        {/* Luz de fondo sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

        {/* Header Móvil (Solo visible en Celu) */}
        <div className="md:hidden w-full bg-white/80 backdrop-blur-md p-5 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50">
          <Link href="/" className="text-slate-400 hover:text-primary transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-900 leading-tight">Lic. Yesica M. García</p>
            <p className="text-[7px] uppercase tracking-[0.2em] text-primary font-bold">Reserva de Turnos</p>
          </div>
          <div className="w-5" /> {/* Espaciador para centrar el texto */}
        </div>

        <div className="w-full flex flex-col md:flex-row items-stretch relative z-10">
          {/* Columna Izquierda: Branding (Solo Desktop) */}
          <div className="hidden md:flex w-[380px] lg:w-[450px] bg-white p-12 lg:p-20 flex-col justify-between border-r border-slate-100 shadow-2xl shadow-slate-200/50">
            <div>
              <Link 
                href="/" 
                className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400 hover:text-primary transition-all duration-500 mb-20 group"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Volver al inicio
              </Link>
              
              <div className="space-y-4 mb-24">
                <div className="inline-block px-3 py-1 bg-primary/5 rounded-full text-[9px] uppercase tracking-[0.3em] text-primary font-bold">
                  Sistema de Reservas
                </div>
                <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-[1.1] text-slate-900">
                  Mi agenda <br />
                  <span className="text-primary italic font-light">de turnos</span>
                </h1>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <MapPin size={16} className="text-primary/40" />
                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-900">Ubicación</p>
                  <p className="text-[10px] text-slate-400 leading-tight">San Nicolás, Bs. As.</p>
                </div>
                <div className="space-y-2">
                  <Globe size={16} className="text-primary/40" />
                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-900">Modalidad</p>
                  <p className="text-[10px] text-slate-400 leading-tight">Presencial & Online</p>
                </div>
              </div>
              
              <div className="pt-8 border-t border-slate-50 flex items-center justify-between gap-4">
                <p className="text-[11px] font-serif italic text-slate-400">
                  Lic. Yesica M. García <br />
                  <span className="text-primary font-sans not-italic font-bold tracking-widest text-[8px] uppercase mt-1 block">Nutricionista · MP 7250</span>
                </p>
                <a 
                  href="https://godreamai.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="opacity-20 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0"
                >
                  <Image 
                    src="/logoMrgDeve.png" 
                    alt="MrgDeve Logo" 
                    width={28} 
                    height={28} 
                    className="object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Contenido dinámico */}
          <div className="flex-1 bg-transparent flex flex-col justify-center overflow-y-auto p-4 md:p-12 lg:p-20">
            <div className="max-w-2xl w-full mx-auto">
              <BookingManager />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
