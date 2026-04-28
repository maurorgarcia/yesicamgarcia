'use client';

import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Carolina P.',
    text: 'La precisión en el diagnóstico y el seguimiento clínico fueron fundamentales para mi recuperación metabólica. Una profesional excepcional.',
    role: 'Nutrición Clínica'
  },
  {
    name: 'Juan Manuel R.',
    text: 'Gracias a la evaluación antropométrica y el plan deportivo, logré optimizar mi rendimiento en competencia. Metodología 100% científica.',
    role: 'Nutrición Deportiva'
  },
  {
    name: 'Sofía M.',
    text: 'Excelente abordaje terapéutico. Por primera vez encuentro un plan nutricional basado en evidencia que se adapta a mis necesidades médicas.',
    role: 'Patologías Metabólicas'
  },
];

export const Reviews = () => {
  return (
    <section id="opiniones" className="section-spacing bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block"
          >
            Casos de Éxito
          </motion.span>
          <h2 className="title-editorial mb-6 text-foreground">
            Resultados con <br />
            <span className="italic text-primary font-light">Respaldo Clínico</span>
          </h2>
          <p className="text-base text-muted font-sans max-w-xl mx-auto">
            Experiencias de pacientes que han transformado su salud mediante un abordaje nutricional riguroso y personalizado.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="group p-10 bg-accent/5 border border-slate-100 rounded-[1.5rem] hover:bg-white hover:shadow-2xl hover:border-primary/20 transition-all duration-700"
            >
              <div className="flex gap-1 mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm font-sans leading-relaxed mb-10 text-muted group-hover:text-foreground transition-colors italic font-light">
                "{review.text}"
              </p>
              <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-foreground">{review.name}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold mt-1 opacity-60">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
