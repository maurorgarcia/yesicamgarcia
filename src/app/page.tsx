'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { AboutMe } from '@/components/landing/AboutMe';
import { Services } from '@/components/landing/Services';
import { FAQ } from '@/components/landing/FAQ';
import { WhatsAppWidget } from '@/components/landing/WhatsAppWidget';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CalendarCheck, UserRound, ClipboardCheck } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutMe />
        <Services />

        {/* ——— Proceso: 3 pasos ——— */}
        <section className="section-spacing bg-secondary/[0.02] relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none" />

          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-24">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-primary text-[11px] uppercase tracking-[0.4em] font-bold mb-6 block"
              >
                Tu camino al cambio
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="title-editorial text-foreground"
              >
                ¿Cómo es el proceso<br />
                <span className="text-secondary">con Yesica?</span>
              </motion.h2>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  icon: CalendarCheck,
                  title: 'Reservá tu turno',
                  desc: 'Elegí la modalidad (Online o Presencial en San Nicolás) y el horario que mejor se adapte a tu rutina.',
                },
                {
                  icon: UserRound,
                  title: 'La consulta',
                  desc: 'Charlamos sobre tus metas y analizamos tu situación clínica para entender qué necesita tu cuerpo.',
                },
                {
                  icon: ClipboardCheck,
                  title: 'Tu plan personal',
                  desc: 'Recibís una estrategia nutricional única, basada en ciencia y diseñada para ser sostenible en el tiempo.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  className="relative group p-12 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-700"
                >
                  {/* Step Number Badge */}
                  <div className="absolute top-10 right-10 text-4xl font-bold text-slate-50 group-hover:text-primary/5 transition-colors duration-700 pointer-events-none">
                    0{i + 1}
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                    <item.icon size={28} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-500">{item.title}</h3>
                  <p className="text-base text-muted font-light leading-relaxed opacity-80">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ——— Coberturas ——— */}
    <section id="coberturas" className="section-spacing bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-[11px] uppercase tracking-[0.4em] font-bold mb-8 block"
          >
            Cobertura Disponible
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="title-editorial mb-10"
          >
            Obras Sociales <br />
            <span className="text-secondary">y Prepagas</span>
          </motion.h2>
          <p className="text-editorial max-w-2xl mx-auto">
            Atiendo con más de 37 coberturas médicas para que el costo nunca sea un obstáculo para tu salud.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
        >
          {[
            'Apsot', 'Ospsip', 'Dasuten', 'Galeno', 'Medicus', 
            'Medife', 'Ospat', 'Omint', 'Osjera', 'Ospedyc', 
            'Sancor', 'Avalian', 'Union Personal', 'Uta', 'William Hope',
            'Luis Pasteur', 'La Pequeña Familia', 'Fiplasto', 'Grupo San Nicolás',
            'Ceramistas', 'Famyl S.A', 'FSST', 'Guincheros', 'Hemisferio Salud',
            'Marina Mercante', 'Personal Papel', 'Isspica', 'Maestranza', 'Osdipp',
            'Osmata', 'Ospacarp', 'Ospatca', 'Ospena', 'Ospep', 'Ospif', 'Osseg', 'Visitar SRL'
          ].map((obra) => (
            <div 
              key={obra}
              className="p-5 border border-slate-100 bg-secondary/[0.02] text-[10px] uppercase tracking-[0.15em] font-bold text-foreground/40 text-center rounded-2xl hover:border-secondary/20 hover:bg-white hover:text-secondary hover:shadow-xl hover:shadow-secondary/5 transition-all duration-500"
            >
              {obra}
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    <FAQ />

    <section className="section-spacing bg-secondary/[0.03]">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto p-16 md:p-32 bg-white border border-slate-100 rounded-[4rem] text-center shadow-2xl shadow-secondary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 -mr-32 -mt-32 rounded-full blur-3xl pointer-events-none" />
          
          <span className="text-primary text-[11px] uppercase tracking-[0.4em] font-bold mb-10 block">
            Primera Consulta
          </span>
          <h2 className="title-editorial mb-12">
            ¿Empezamos a trabajar<br />
            <span className="text-secondary">juntos?</span>
          </h2>
          <p className="text-editorial max-w-xl mx-auto mb-16">
            Reservá tu turno con Yesica y recibí un plan nutricional hecho a tu medida, sin plantillas ni atajos.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
            <Link href="/reservar">
              <Button 
                className="rounded-full px-14 py-8 text-xs font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 border-none hover:scale-105 transition-all duration-500"
              >
                Agendar mi consulta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
