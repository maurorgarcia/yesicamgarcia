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
    <section id="faq" className="section-spacing bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-primary text-[11px] uppercase tracking-[0.5em] font-bold mb-6 block">Preguntas frecuentes</span>
            <h2 className="text-5xl md:text-6xl font-serif font-black text-foreground">Despejá tus <span className="text-secondary italic font-light">dudas</span></h2>
          </div>
 
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-secondary/[0.02] rounded-[2rem] border border-secondary/5 overflow-hidden hover:border-secondary/20 hover:bg-white hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-500"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-8 text-left flex justify-between items-center group"
                >
                  <span className="text-xl font-serif font-bold text-foreground group-hover:text-secondary transition-colors leading-snug">{faq.question}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === index ? 'bg-secondary text-white rotate-180' : 'bg-secondary/5 text-secondary'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <div className="p-8 pt-0 text-base text-muted leading-relaxed font-sans font-light border-t border-secondary/5 mt-2">
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
