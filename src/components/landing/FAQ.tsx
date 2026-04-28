'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: '¿Cómo es la primera consulta?',
    answer: 'Es una entrevista clínica donde charlamos sobre tu historia, tus hábitos y lo que querés mejorar. Si es presencial, también hacemos una evaluación antropométrica. La idea es que yo entienda tu situación antes de diseñar cualquier plan.'
  },
  {
    question: '¿Atendés por obra social?',
    answer: 'Sí. Trabajo con más de 37 obras sociales y prepagas. Si tu cobertura no está en la lista, podés consultar igual — muchas veces se puede gestionar el reintegro.'
  },
  {
    question: '¿Qué necesito para la primera consulta?',
    answer: 'Si tenés análisis de sangre recientes (últimos 6 meses), es ideal que los traigas o los mandes antes. No es obligatorio, pero ayuda a tener un panorama más completo desde el primer día.'
  },
  {
    question: '¿La consulta online funciona igual?',
    answer: 'Sí. Trabajo con pacientes de todo el país de forma online con la misma metodología. No hacemos antropometría física, pero usamos otros indicadores de progreso muy precisos.'
  },
  {
    question: '¿Con qué frecuencia son los seguimientos?',
    answer: 'Depende del caso y los objetivos. En general, el primer control es a las 3-4 semanas. Después ajustamos la frecuencia según cómo vayas avanzando.'
  },
  {
    question: '¿Puedo consultar por WhatsApp entre sesiones?',
    answer: 'Sí, tengo un canal de comunicación para dudas puntuales entre consultas. No reemplaza la sesión, pero si surgió algo importante, hablamos.'
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-spacing bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-primary text-[11px] uppercase tracking-[0.4em] font-bold mb-6 block">Preguntas Frecuentes</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Todo lo que <span className="text-secondary">necesitás saber</span></h2>
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
