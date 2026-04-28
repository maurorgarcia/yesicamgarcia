'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BookingFormProps {
  selectedService: {
    id: string;
    name: string;
    price: string;
    duration: string;
    description: string;
  } | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  onSubmit: (formData: any) => void;
  isSubmitting: boolean;
}

export const BookingForm = ({ selectedService, selectedDate, selectedTime, onSubmit, isSubmitting }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    modality: 'Particular',
    location: 'Online'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Resumen de Cita - Súper Compacto */}
      <div className="mb-6 bg-accent/20 rounded-[2rem] p-5 md:p-6 border border-white shadow-sm text-left">
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <p className="text-[8px] uppercase tracking-widest text-primary font-bold">Servicio</p>
            <h4 className="text-base md:text-lg font-serif font-bold text-slate-800 leading-tight">
              {selectedService?.name}
            </h4>
            <p className="text-[9px] text-muted font-medium">{selectedService?.description} • {selectedService?.duration}</p>
          </div>
          
          <div className="text-right space-y-1">
            <p className="text-[8px] uppercase tracking-widest text-primary font-bold">Cita</p>
            <p className="text-sm font-bold text-slate-800 capitalize">
              {selectedDate && format(selectedDate, "eee d 'de' MMM", { locale: es })} • {selectedTime}
            </p>
            <p className="text-base md:text-lg font-serif font-bold text-primary">{selectedService?.price}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-1 text-left">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-serif font-bold text-foreground mb-1">Tus datos de contacto</h3>
          <p className="text-[10px] text-muted font-light">Completá esta info para registrar tu turno.</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-1">Nombre completo</label>
            <input
              id="name"
              required
              type="text"
              placeholder="Ej: María García"
              className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all duration-500 outline-none font-bold text-sm text-slate-800 placeholder:text-slate-300"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-1">WhatsApp</label>
              <input
                id="phone"
                required
                type="tel"
                placeholder="336 4..."
                className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all duration-500 outline-none font-bold text-sm text-slate-800 placeholder:text-slate-300"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-1">Email</label>
              <input
                id="email"
                required
                type="email"
                placeholder="tu@email.com"
                className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all duration-500 outline-none font-bold text-sm text-slate-800 placeholder:text-slate-300"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 text-center block">¿Cómo abonás?</label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Particular', 'Reintegro', 'Obra Social'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFormData({ ...formData, modality: m })}
                  className={`py-2.5 px-1 border text-[7px] uppercase tracking-[0.1em] font-bold transition-all duration-500 rounded-xl ${
                    formData.modality === m 
                      ? 'border-primary text-primary bg-primary/5 shadow-inner' 
                      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {m === 'Obra Social' ? 'O. Social' : m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 text-center block">¿Dónde nos vemos?</label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Online', 'CEMIR', 'XTREME'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setFormData({ ...formData, location: l })}
                  className={`py-2.5 px-1 border text-[7px] uppercase tracking-[0.1em] font-bold transition-all duration-500 rounded-xl ${
                    formData.location === l 
                      ? 'border-primary text-primary bg-primary/5 shadow-inner' 
                      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
          </button>
          <p className="text-center mt-4 text-[8px] uppercase tracking-[0.2em] text-muted font-bold opacity-60">
            Tus datos están protegidos por protocolos de confidencialidad.
          </p>
        </div>
      </form>
    </div>
  );
};
