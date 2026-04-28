'use client';

import { motion } from 'framer-motion';
import { Clock, Banknote, ChevronRight, UserPlus, RefreshCcw, Ruler, PlusCircle, History, Info } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  icon: any;
  description: string;
}

const services: Service[] = [
  {
    id: 'primera-vez',
    name: 'Consulta Nutricional',
    description: 'Primera vez',
    price: '$40.000',
    duration: '1 hora aprox.',
    icon: UserPlus
  },
  {
    id: 'control',
    name: 'Consulta Nutricional',
    description: 'Control y seguimiento',
    price: '$30.000',
    duration: '30 min aprox.',
    icon: RefreshCcw
  },
  {
    id: 'antropometria',
    name: 'Antropometría',
    description: 'Evaluación física completa',
    price: '$50.000',
    duration: '45 min - 1 hora',
    icon: Ruler
  },
  {
    id: 'completa-primera',
    name: 'Consulta + Antropometría',
    description: 'Abordaje integral inicial',
    price: '$50.000',
    duration: '2 horas aprox.',
    icon: PlusCircle
  },
  {
    id: 'completa-control',
    name: 'Consulta + Antropometría',
    description: 'Control integral',
    price: '$40.000',
    duration: '45 min aprox.',
    icon: History
  }
];

interface ServiceSelectionProps {
  onSelect: (service: Service) => void;
}

export const ServiceSelection = ({ onSelect }: ServiceSelectionProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-[8px] uppercase tracking-[0.3em] text-primary font-bold mb-6">
          Paso 01
        </div>
        <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">¿Cómo puedo ayudarte?</h3>
        <p className="text-sm text-muted font-light max-w-xs mx-auto">Elegí el servicio que buscás para que podamos empezar.</p>
      </div>

      <div className="space-y-2">
        {services.map((service, index) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.6 }}
            onClick={() => onSelect(service)}
            className="w-full group relative flex items-center gap-4 md:gap-5 p-4 md:p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 text-left"
          >
            {/* Icono más sutil y compacto */}
            <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center text-primary/60 group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
              <service.icon size={18} strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {service.name}
                </h4>
                <span className="text-xs md:text-sm font-serif font-bold text-primary shrink-0">
                  {service.price}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-[8px] uppercase tracking-widest text-muted font-bold truncate pr-4">
                  {service.description}
                </p>
                <div className="flex items-center gap-1.5 opacity-40 shrink-0">
                  <Clock size={9} />
                  <span className="text-[8px] font-medium">{service.duration}</span>
                </div>
              </div>
            </div>
            {/* Indicador de flecha muy fino */}
            <div className="hidden md:flex opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500 text-primary">
              <ChevronRight size={14} />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[9px] uppercase tracking-widest text-muted font-bold flex items-center justify-center gap-2">
          <span className="w-1 h-1 rounded-full bg-primary/40" />
          Precios expresados en Pesos Argentinos
          <span className="w-1 h-1 rounded-full bg-primary/40" />
        </p>
      </div>
    </div>
  );
};
