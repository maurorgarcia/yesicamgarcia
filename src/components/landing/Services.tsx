'use client';

import { motion } from 'framer-motion';
import { Apple, Activity, ClipboardList, MonitorSmartphone, Target, ShieldCheck } from 'lucide-react';

const services = [
  {
    title: 'Nutrición Integral',
    description: 'Trabajo con vos para entender tu historia, tus hábitos y tus objetivos. Nada de plantillas; cada plan lo construyo desde cero según tu realidad.',
    icon: ShieldCheck,
  },
  {
    title: 'Antropometría ISAK II',
    description: 'Con mi certificación ISAK II evalúo tu composición corporal con precisión técnica — masa grasa, muscular y ósea — para un diagnóstico real, no estimado.',
    icon: Activity,
  },
  {
    title: 'Nutrición Deportiva',
    description: 'Ayudo a deportistas y personas activas a rendir mejor, recuperarse más rápido y sostener una composición corporal acorde a su entrenamiento.',
    icon: Target,
  },
  {
    title: 'Planes Personalizados',
    description: 'Diseño estrategias alimentarias con objetivos concretos y revisiones periódicas. El seguimiento es parte del proceso, no un extra.',
    icon: ClipboardList,
  },
  {
    title: 'Consulta Online',
    description: 'Atiendo pacientes de todo el país con la misma dedicación que en consultorio. La distancia no es una excusa para descuidar tu salud.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Educación Alimentaria',
    description: 'Mi objetivo es que aprendas a elegir bien sin depender siempre de mí. Te doy herramientas reales para tomar decisiones con criterio.',
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
            className="text-primary text-[11px] uppercase tracking-[0.4em] font-bold mb-10 block"
          >
            Áreas de Especialidad
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="title-editorial mb-12 text-foreground"
          >
            Soluciones a <br />
            <span className="text-secondary">tu medida</span>
          </motion.h2>
          <p className="text-editorial max-w-2xl mx-auto">
            Abordajes personalizados para potenciar tu salud física y optimizar tus hábitos alimentarios.
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
              className="group p-14 bg-white border border-slate-100 rounded-[3rem] hover:shadow-[0_40px_80px_-20px_rgba(27,63,57,0.05)] hover:border-secondary/20 transition-all duration-700 flex flex-col items-start relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-secondary/5 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-inner">
                <service.icon size={28} className="text-secondary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground group-hover:text-secondary transition-colors duration-500 leading-tight">{service.title}</h3>
              <p className="text-sm leading-relaxed text-muted font-sans font-light opacity-80">
                {service.description}
              </p>
              <div className="mt-12 pt-10 border-t border-slate-50 w-full flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-700">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-secondary">Más información</span>
                <div className="w-12 h-[2px] bg-secondary/20" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
