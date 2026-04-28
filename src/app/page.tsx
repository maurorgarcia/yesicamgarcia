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
        
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-primary text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">
            Atención por Cobertura Médica
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">
            Obras Sociales y prepagas.
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-base">
            Trabajo con una amplia red de coberturas para facilitar tu acceso a una nutrición de calidad.
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
          ].map((obra) => (
            <div 
              key={obra}
              className="p-4 border border-slate-100 bg-slate-50 text-[10px] uppercase tracking-widest font-bold text-foreground/60 text-center rounded-xl"
            >
              {obra}
            </div>
          ))}
        </div>
      </div>
    </section>

    <FAQ />

    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto p-12 md:p-24 bg-white border border-slate-200 rounded-[2rem] text-center">
          <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-8 block">
            Atención Clínica
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-10 text-foreground">
            ¿Listo para transformar tu relación con la comida?
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto mb-16">
            Agendá tu primera consulta y diseñemos juntos un plan basado en ciencia.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link href="/reservar">
              <Button variant="primary" size="lg" className="rounded-full px-12 py-8">
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
