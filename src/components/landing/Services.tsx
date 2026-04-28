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
    <section id="servicios" className="section-spacing bg-secondary/[0.02]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-[12px] uppercase tracking-[0.6em] font-bold mb-10 block"
          >
            Mis Especialidades
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-black mb-12 text-foreground leading-[0.95]"
          >
            Abordaje <br />
            <span className="italic text-secondary font-light font-serif">Integrativo</span>
          </motion.h2>
          <p className="text-xl text-muted font-sans max-w-2xl mx-auto leading-relaxed font-light">
            Soluciones personalizadas con respaldo científico para potenciar tu salud, rendimiento y relación con la comida.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="group p-14 bg-white border border-slate-100 rounded-[3rem] hover:shadow-[0_50px_100px_-20px_rgba(59,82,51,0.08)] hover:border-secondary/20 transition-all duration-700 flex flex-col items-start relative overflow-hidden"
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform duration-700" />
              
              <div className="w-16 h-16 bg-secondary/5 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-secondary group-hover:text-white transition-all duration-500 group-hover:rotate-12 shadow-inner">
                <service.icon size={28} className="text-secondary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-3xl font-serif font-black mb-6 text-foreground group-hover:text-secondary transition-colors duration-500 leading-tight">{service.title}</h3>
              <p className="text-base leading-relaxed text-muted font-sans font-light opacity-80 group-hover:opacity-100 transition-opacity">
                {service.description}
              </p>
              <div className="mt-12 pt-10 border-t border-slate-50 w-full flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-secondary">Ver detalles</span>
                <div className="w-12 h-[2px] bg-secondary/20" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
