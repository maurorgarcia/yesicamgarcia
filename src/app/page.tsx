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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutMe />
        <Services />

        {/* ——— Proceso: 3 pasos ——— */}
        <section className="section-spacing bg-secondary/[0.02]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-primary text-[11px] uppercase tracking-[0.4em] font-bold mb-6 block"
              >
                El proceso
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="title-editorial text-foreground"
              >
                ¿Cómo es trabajar<br />
                <span className="text-secondary">con Yesica?</span>
              </motion.h2>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-10 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-secondary/10 z-0" />

              {[
                {
                  step: '01',
                  title: 'Reservá tu turno',
                  desc: 'Elegís el día y horario que mejor te quede, online o presencial en San Nicolás.',
                },
                {
                  step: '02',
                  title: 'Primera consulta',
                  desc: 'Charlamos sobre tu historia, hábitos y objetivos. Si es presencial, hacemos la evaluación antropométrica.',
                },
                {
                  step: '03',
                  title: 'Tu plan personalizado',
                  desc: 'Recibís un plan hecho para vos, con seguimiento real y ajustes según cómo vayas avanzando.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative z-10 bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col gap-6 shadow-sm hover:shadow-lg hover:border-secondary/20 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-sm text-muted font-light leading-relaxed">{item.desc}</p>
                  </div>
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
                className="rounded-full px-14 py-8 text-xs font-bold uppercase tracking-widest bg-secondary hover:bg-secondary/90 text-white shadow-2xl shadow-secondary/20 border-none hover:scale-105 transition-all duration-500"
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
