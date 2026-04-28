'use client';

import { motion } from 'framer-motion';
import { Apple, Activity, ClipboardList, MonitorSmartphone, Target, ShieldCheck } from 'lucide-react';

const services = [
  {
    title: 'Nutrición Integral',
    description: 'Enfoque personalizado para mejorar tus hábitos alimentarios y alcanzar un bienestar óptimo mediante ciencia aplicada.',
    icon: ShieldCheck,
  },
  {
    title: 'Antropometría ISAK II',
    description: 'Evaluación técnica de la composición corporal (masa grasa, muscular y ósea) para un diagnóstico de precisión.',
    icon: Activity,
  },
  {
    title: 'Nutrición Deportiva',
    description: 'Optimización del rendimiento, recuperación y composición corporal para atletas y personas físicamente activas.',
    icon: Target,
  },
  {
    title: 'Planes Nutricionales',
    description: 'Diseño de estrategias alimentarias personalizadas con objetivos claros y seguimiento continuo.',
    icon: ClipboardList,
  },
  {
    title: 'Consultoría Online',
    description: 'Atención profesional remota con la misma rigurosidad, accesible desde cualquier ubicación.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Educación Alimentaria',
    description: 'Desarrollo de habilidades y conocimientos para la autogestión de una alimentación saludable y basada en evidencia.',
    icon: Apple,
  },
];

export const Services = () => {
  return (
    <section id="servicios" className="section-spacing bg-slate-50/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-[11px] uppercase tracking-[0.5em] font-bold mb-8 block"
          >
            Mis Especialidades
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif font-bold mb-10 text-foreground leading-tight"
          >
            Especialidades <br />
            <span className="italic text-foreground/40 font-light font-sans tracking-tight">Nutricionales</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl text-muted font-sans max-w-2xl mx-auto leading-relaxed"
          >
            Te acompaño con un abordaje integral y respaldo científico para potenciar tu salud y rendimiento físico mediante nutrición de precisión.
          </motion.p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="group p-12 bg-white border border-slate-100 rounded-[2rem] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:border-primary/10 transition-all duration-700 flex flex-col items-start"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary/10 transition-all duration-500 group-hover:rotate-6">
                <service.icon size={28} className="text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-6 text-foreground group-hover:text-primary transition-colors duration-500">{service.title}</h3>
              <p className="text-base leading-relaxed text-muted font-sans font-normal opacity-80 group-hover:opacity-100 transition-opacity">
                {service.description}
              </p>
              <div className="mt-10 pt-8 border-t border-slate-50 w-full flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Saber más</span>
                <div className="w-8 h-[1px] bg-primary/30" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
