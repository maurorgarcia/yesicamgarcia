'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: '¿Cómo es la primera consulta?',
    answer: 'La primera sesión es una entrevista clínica profunda donde evaluamos tu historia médica, hábitos actuales y objetivos. Si la consulta es presencial, también realizamos una medición antropométrica inicial.'
  },
  {
    question: '¿Atendés por obra social?',
    answer: 'Sí, atiendo a través de una amplia red de obras sociales y prepagas. También podés realizar la consulta de forma particular y solicitar el recibo para gestionar el reintegro con tu cobertura.'
  },
  {
    question: '¿Qué necesito para la primera vez?',
    answer: 'Si tenés análisis de sangre recientes (últimos 6 meses), es ideal que los traigas o los envíes previamente. No es excluyente, pero ayuda a tener un panorama clínico más completo.'
  },
  {
    question: '¿La modalidad online es efectiva?',
    answer: 'Absolutamente. La base de un buen plan es la educación y el diseño de la estrategia. Si bien no realizamos antropometría física, usamos otros indicadores de progreso muy precisos.'
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-spacing bg-slate-50/30">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Preguntas comunes</span>
            <h2 className="text-4xl font-serif font-bold">Resolvé tus dudas</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-primary/5 overflow-hidden shadow-sm hover:shadow-md transition-all duration-500"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center group"
                >
                  <span className="font-serif font-bold text-foreground group-hover:text-primary transition-colors">{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-primary/40 transition-transform duration-500 ${openIndex === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <div className="p-6 pt-0 text-sm text-muted leading-relaxed font-sans border-t border-slate-50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
