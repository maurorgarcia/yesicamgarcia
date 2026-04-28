'use client';

import { motion } from 'framer-motion';
import { BookOpen, Utensils, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const resources = [
  {
    title: 'Guía de Nutrición Deportiva',
    description: 'Protocolos de hidratación y suplementación basados en la ciencia para deportistas de alto rendimiento.',
    category: 'Educación',
    icon: BookOpen,
  },
  {
    title: 'Recetas Clínicas Saludables',
    description: 'Preparaciones nutricionalmente densas y equilibradas diseñadas por profesionales de la salud.',
    category: 'Recetas',
    icon: Utensils,
  },
  {
    title: 'Mitos de la Nutrición',
    description: 'Desmitificando tendencias populares mediante evidencia científica y rigor profesional.',
    category: 'Artículos',
    icon: Lightbulb,
  },
];

export const Resources = () => {
  return (
    <section id="recursos" className="section-spacing bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-[11px] uppercase tracking-[0.4em] font-bold mb-6 block"
          >
            Centro de Conocimiento
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-foreground">
            Recursos & <br />
            <span className="italic text-primary">Evidencia Nutricional</span>
          </h2>
          <p className="text-lg text-muted font-sans">
            Información rigurosa y herramientas prácticas para potenciar tu proceso de cambio con respaldo profesional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <item.icon size={24} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300 group-hover:text-primary transition-colors">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold mb-4 text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted font-sans leading-relaxed mb-8">
                  {item.description}
                </p>
                <button className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest group/btn">
                  Acceder al recurso
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-primary rounded-3xl text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-3xl font-serif font-bold mb-6">¿Buscás un plan de nutrición clínica personalizado?</h3>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
              Iniciá hoy tu proceso basado en ciencia con un diagnóstico integral de tu estado nutricional y metabólico.
            </p>
            <Button 
              variant="outline" 
              className="bg-white text-primary hover:bg-slate-50 border-white rounded-full px-10 py-7 text-base"
              onClick={() => document.getElementById('reservar')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Solicitar Turno Profesional
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};