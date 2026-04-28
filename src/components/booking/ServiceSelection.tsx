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
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[9px] uppercase tracking-[0.3em] text-primary font-bold mb-6">
          Paso 01
        </div>
        <h3 className="text-4xl font-serif font-bold text-foreground mb-4">¿Cómo puedo ayudarte?</h3>
        <p className="text-base text-muted font-light max-w-md mx-auto">Elegí el servicio que buscás para que podamos empezar.</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {services.map((service, index) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            onClick={() => onSelect(service)}
            className="w-full group relative flex items-center gap-6 p-8 bg-accent/20 border border-white rounded-[2.5rem] hover:bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700 text-left"
          >
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0 border border-slate-100">
              <service.icon size={28} />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{service.name}</h4>
                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-100 group-hover:border-primary/20 transition-colors">
                  <Banknote size={12} className="text-primary" />
                  <span className="text-xs font-bold text-foreground">{service.price}</span>
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-muted font-bold">{service.description}</p>
              
              <div className="flex items-center gap-6 mt-4 opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span className="text-xs text-muted font-medium">{service.duration}</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex w-12 h-12 rounded-full bg-white border border-slate-100 items-center justify-center text-slate-300 group-hover:border-primary group-hover:text-primary group-hover:shadow-md transition-all duration-500">
              <ChevronRight size={20} />
            </div>

            {/* Subtle selection overlay on hover */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.01] rounded-[2.5rem] pointer-events-none transition-colors duration-700" />
          </motion.button>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-sm rounded-full border border-white/50 text-[10px] uppercase tracking-widest text-muted font-bold">
          <Info size={14} className="text-primary" />
          ¿Tenés dudas? Escribinos por WhatsApp
        </div>
      </div>
    </div>
  );
};
