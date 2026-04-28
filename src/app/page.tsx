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
        
        {/* Obras Sociales Section */}
        <section id="coberturas" className="section-spacing bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-primary text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block"
              >
                Atención por Cobertura Médica
              </motion.span>
              <h2 className="title-editorial mb-8 text-4xl md:text-6xl">
                Obras Sociales <br />
                <span className="italic text-foreground/40 font-light">y prepagas.</span>
              </h2>
              <p className="text-muted max-w-2xl mx-auto text-base font-sans leading-relaxed">
                Trabajo con una amplia red de coberturas para facilitar tu acceso a una nutrición de calidad. También podés atenderte de forma particular y solicitar reintegro.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                'Apsot', 'Ospsip', 'Dasuten', 'Galeno', 'Medicus', 
                'Medife', 'Ospat', 'Omint', 'Osjera', 'Ospedyc', 
                'Sancor', 'Avalian', 'Union Personal', 'Uta', 'William Hope',
                'Luis Pasteur', 'La Pequeña Familia', 'Fiplasto', 'Grupo San Nicolás',
                'Ceramistas', 'Famyl S.A', 'FSST', 'Guincheros', 'Hemisferio Salud',
                'Marina Mercante', 'Personal Papel', 'Isspica', 'Maestranza', 'Osdipp',
                'Osmata', 'Ospacarp', 'Ospatca', 'Ospena', 'Ospep', 'Ospif', 'Osseg', 'Visitar SRL'
              ].map((obra, i) => (
                <motion.div 
                  key={obra}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02 }}
                  className="p-4 border border-primary/5 bg-accent/5 text-xs uppercase tracking-widest font-bold text-foreground/60 text-center hover:border-primary/30 hover:bg-white hover:text-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-xl cursor-default"
                >
                  {obra}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <FAQ />

        <section className="section-spacing bg-white relative overflow-hidden">
          {/* Decorative elements for premium feel */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-1/2" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto p-12 md:p-24 bg-accent/10 border border-primary/10 rounded-[3rem] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-8 block"
              >
                Atención Clínica
              </motion.span>
              <h2 className="text-4xl md:text-6xl font-serif leading-[1.1] tracking-tight mb-10 text-foreground">
                ¿Listo para transformar <br />
                <span className="italic text-primary font-light">tu relación con la comida?</span>
              </h2>
              <p className="text-lg text-muted max-w-xl mx-auto mb-16 font-sans leading-relaxed">
                Agendá tu primera consulta y diseñemos juntos un plan basado en ciencia, adaptado a tus objetivos y estilo de vida.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link href="/reservar">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="rounded-full px-12 py-8 text-base shadow-xl shadow-primary/20"
                  >
                    Agendar mi consulta
                  </Button>
                </Link>
                <div className="flex items-center gap-4 text-muted group cursor-default">
                  <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Presencial & Online</span>
                </div>
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
