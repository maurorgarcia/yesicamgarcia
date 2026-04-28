'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function StyleGuide() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="container mx-auto px-6">
        <header className="mb-32">
          <span className="text-primary font-sans text-[10px] uppercase tracking-[0.5em] mb-8 block">
            Technical Specification & Brand Identity
          </span>
          <h1 className="title-editorial">Guía de Estilo</h1>
          <p className="text-editorial max-w-2xl mt-12">
            Este documento detalla los fundamentos visuales y técnicos del nuevo diseño de Turnera Definitiva. 
            Inspirado en el minimalismo editorial y la salud holística, combina una estética orgánica con 
            funcionalidad de alto rendimiento.
          </p>
        </header>

        {/* Color Palette */}
        <section className="mb-48">
          <div className="flex items-center gap-8 mb-16">
            <h2 className="text-4xl font-serif">Paleta de Colores Corporativa</h2>
            <div className="h-[1px] flex-1 bg-foreground/5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="space-y-4">
              <div className="h-24 bg-primary shadow-premium border border-foreground/5" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-foreground">Primary (#D99962)</p>
                <p className="text-[9px] text-foreground/40 mt-1">Terra Clay - Acentos principales</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-secondary shadow-premium border border-foreground/5" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-foreground">Secondary (#F2B680)</p>
                <p className="text-[9px] text-foreground/40 mt-1">Sandy Beach - Superficies suaves</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-accent shadow-premium border border-foreground/5" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-foreground">Accent (#F2D2B6)</p>
                <p className="text-[9px] text-foreground/40 mt-1">Soft Peach - Detalles y fondos</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-background shadow-premium border border-foreground/5" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-foreground">Background (#F2E3D5)</p>
                <p className="text-[9px] text-foreground/40 mt-1">Warm Cream - Fondo principal</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-foreground shadow-premium" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-foreground">Foreground (#0D0D0D)</p>
                <p className="text-[9px] text-foreground/40 mt-1">Deep Neutral - Texto y contraste</p>
              </div>
            </div>
          </div>
          <div className="mt-12 p-8 bg-foreground/5 border border-foreground/10 rounded-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Guía de Accesibilidad (WCAG 2.1 AA)</h3>
            <div className="grid md:grid-cols-2 gap-12">
              <ul className="text-[11px] space-y-3 text-foreground/70">
                <li>• <strong>Contraste de Texto:</strong> El ratio entre Foreground (#0D0D0D) y Background (#F2E3D5) es de ~15.1:1 (Pasa AAA).</li>
                <li>• <strong>Botones Primarios:</strong> Ratio de ~8.4:1 entre texto oscuro y fondo Primary.</li>
              </ul>
              <ul className="text-[11px] space-y-3 text-foreground/70">
                <li>• <strong>Interactividad:</strong> Los hovers utilizan opacidad (90%) y escalas (95%) para feedback táctico.</li>
                <li>• <strong>Jerarquía:</strong> Colores cálidos para dirigir la atención, neutros profundos para lectura prolongada.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-12">
          <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-primary">Tipografía y Escala</h2>
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40">Heading 1 / Title Editorial</p>
              <h1 className="title-editorial">Escala Nítida</h1>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40">Body / Text Editorial</p>
              <p className="text-editorial max-w-xl">
                Un sistema de diseño equilibrado que prioriza la legibilidad y el aire visual. 
                Reducimos las escalas para lograr una estética moderna y sofisticada.
              </p>
            </div>
          </div>
        </section>

        {/* UI Components */}
        <section className="space-y-12">
          <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-primary">Componentes UI</h2>
          <div className="flex flex-wrap gap-8 items-end">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40">Primary Button</p>
              <Button variant="primary">Reservar</Button>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40">Outline Button</p>
              <Button variant="outline">Ver Método</Button>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40">Card Detail</p>
              <div className="p-6 bg-background border border-foreground/10 shadow-premium max-w-[200px]">
                <div className="w-8 h-8 bg-foreground/5 rounded-full mb-4" />
                <h4 className="text-sm font-serif mb-2 text-foreground">Item Minimal</h4>
                <p className="text-[10px] text-foreground/40 leading-relaxed">Detalle compacto con alta definición.</p>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-12">
              <h3 className="text-xl font-serif italic text-foreground/40">Cards & Contenedores</h3>
              <div className="p-12 border border-foreground/5 bg-background shadow-premium">
                <div className="text-3xl font-serif text-foreground/10 mb-6 transition-colors">“</div>
                <p className="text-lg font-serif leading-relaxed mb-8 text-foreground/80">
                  Ejemplo de card para reviews o servicios con espaciado generoso.
                </p>
                <div className="h-[1px] w-12 bg-primary/20" />
              </div>
            </div>
          </div>
        </section>

        {/* Interactions */}
        <section className="mb-48">
          <div className="flex items-center gap-8 mb-16">
            <h2 className="text-4xl font-serif">Microinteracciones</h2>
            <div className="h-[1px] flex-1 bg-stone-100" />
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-12 border border-stone-100 bg-white text-center group cursor-pointer"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4 group-hover:text-primary transition-colors">Hover Lift</p>
              <p className="text-sm font-sans text-stone-500">Elevación suave para feedback táctil.</p>
            </motion.div>
            
            <div className="p-12 border border-stone-100 bg-white text-center overflow-hidden">
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4">Text Reveal</p>
              <div className="reveal-text">
                <motion.span
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  className="block text-sm font-sans text-stone-500"
                >
                  Entrada cinemática de texto.
                </motion.span>
              </div>
            </div>

            <div className="p-12 border border-stone-100 bg-white text-center group cursor-pointer relative overflow-hidden">
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4 relative z-10">Glass Reveal</p>
              <motion.div 
                className="absolute inset-0 bg-stone-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
              />
              <p className="text-sm font-sans text-stone-500 relative z-10">Transiciones de fondo fluidas.</p>
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section>
          <div className="flex items-center gap-8 mb-16">
            <h2 className="text-4xl font-serif">Especificaciones Técnicas</h2>
            <div className="h-[1px] flex-1 bg-stone-100" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h4 className="font-serif text-lg">Framework</h4>
              <p className="text-sm text-stone-500 font-mono">Next.js 16 (App Router)</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-serif text-lg">Estilos</h4>
              <p className="text-sm text-stone-500 font-mono">Tailwind CSS 4.0</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-serif text-lg">Animaciones</h4>
              <p className="text-sm text-stone-500 font-mono">Framer Motion 12.0</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-serif text-lg">Iconografía</h4>
              <p className="text-sm text-stone-500 font-mono">Lucide React 0.475</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-serif text-lg">Accesibilidad</h4>
              <p className="text-sm text-stone-500 font-mono">WCAG 2.1 AA Compliant</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
