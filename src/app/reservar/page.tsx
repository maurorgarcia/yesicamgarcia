'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { BookingManager } from '@/components/booking/BookingManager';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReservarPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto mb-10">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-muted hover:text-primary transition-colors mb-8 group"
            >
              <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">
                Agenda de Turnos
              </span>
              <h1 className="text-4xl md:text-5xl font-serif leading-[1.15] tracking-tight text-foreground mb-6">
                Comenzá tu proceso <br />
                <span className="italic text-foreground/40 font-light">de transformación.</span>
              </h1>
              <p className="text-editorial max-w-xl text-base">
                Seleccioná el día y horario que mejor se adapte a tu rutina. 
                Las sesiones pueden ser presenciales u online según tu preferencia.
              </p>
            </motion.div>
          </div>

          {/* Booking Container */}
          <div className="max-w-6xl mx-auto premium-glass overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
            {/* Sidebar con Info Contextual */}
            <div className="w-full lg:w-[320px] bg-foreground/[0.01] p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-foreground/5 flex flex-col justify-between">
              <div>
                <div className="text-[8px] uppercase tracking-[0.4em] text-primary font-bold mb-10">Modalidades de Atención</div>
                <div className="space-y-10">
                  <div className="group cursor-default">
                    <div className="text-xl font-serif italic mb-2 group-hover:text-primary transition-colors">Presencial</div>
                    <p className="text-[9px] text-foreground/40 uppercase tracking-widest font-bold mb-1">Centro CEMIR</p>
                    <p className="text-[9px] text-foreground/40 uppercase tracking-widest font-bold">Gimnasio XTREME</p>
                  </div>
                  <div className="group cursor-default">
                    <div className="text-xl font-serif italic mb-2 group-hover:text-primary transition-colors">Online</div>
                    <p className="text-[9px] text-foreground/40 uppercase tracking-widest font-bold">Plataforma Digital</p>
                    <p className="text-[9px] text-foreground/40 uppercase tracking-widest font-bold">Desde cualquier lugar</p>
                  </div>
                </div>

                <div className="mt-16 space-y-4">
                  <div className="p-5 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-[8px] uppercase tracking-widest font-bold text-primary mb-2">Nota importante</p>
                    <p className="text-[10px] leading-relaxed text-primary/70 font-medium">
                      Al finalizar la reserva, se abrirá un chat de WhatsApp para confirmar los detalles finales de tu turno.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-foreground/10">
                <div className="flex items-center gap-3 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                  <div className="w-6 h-6 rounded-full bg-foreground/10" />
                  <span className="text-[7px] uppercase tracking-[0.2em] font-bold">Protocolo de Salud <br />& Confidencialidad</span>
                </div>
              </div>
            </div>

            {/* Booking Component Area */}
            <div className="flex-1 p-6 md:p-12 lg:p-16 bg-background/40">
              <BookingManager />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
