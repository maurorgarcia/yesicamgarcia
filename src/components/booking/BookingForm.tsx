'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface BookingFormProps {
  onSubmit: (data: { name: string; phone: string; email: string; modality: string; location: string }) => void;
  isLoading: boolean;
}

export const BookingForm = ({ onSubmit, isLoading }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    modality: 'Particular',
    location: 'Online',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-10">
      <div className="text-center">
        <h3 className="text-3xl font-serif mb-3">Tus datos de contacto</h3>
        <p className="text-[11px] text-foreground/40 font-sans tracking-wide">Completá esta info para que pueda registrar tu turno.</p>
      </div>
      
      <div className="space-y-8">
        <div className="space-y-3">
          <label htmlFor="name" className="text-[9px] uppercase tracking-[0.4em] font-bold text-primary ml-1">Nombre completo</label>
          <input
            id="name"
            required
            type="text"
            placeholder="Ej: María García"
            className="w-full px-0 py-3 bg-transparent border-b border-foreground/10 focus:border-primary transition-all duration-500 outline-none font-serif text-xl placeholder:text-foreground/10 text-foreground"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label htmlFor="phone" className="text-[9px] uppercase tracking-[0.4em] font-bold text-primary ml-1">Tu WhatsApp</label>
            <input
              id="phone"
              required
              type="tel"
              placeholder="336 4..."
              className="w-full px-0 py-3 bg-transparent border-b border-foreground/10 focus:border-primary transition-all duration-500 outline-none font-serif text-xl placeholder:text-foreground/10 text-foreground"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="email" className="text-[9px] uppercase tracking-[0.4em] font-bold text-primary ml-1">Email</label>
            <input
              id="email"
              required
              type="email"
              placeholder="tu@email.com"
              className="w-full px-0 py-3 bg-transparent border-b border-foreground/10 focus:border-primary transition-all duration-500 outline-none font-serif text-xl placeholder:text-foreground/10 text-foreground"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-10 pt-2">
        <div className="space-y-5">
          <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-primary ml-1">¿Cómo vas a abonar?</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['Particular', 'Reintegro', 'Obra Social'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFormData({ ...formData, modality: m })}
                className={`py-3 px-2 border text-[8px] uppercase tracking-[0.2em] font-bold transition-all duration-500 rounded-lg ${
                  formData.modality === m 
                    ? 'border-primary text-primary bg-primary/5 shadow-inner' 
                    : 'border-foreground/5 text-foreground/30 hover:border-foreground/10 hover:text-foreground/50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-primary ml-1">¿Dónde nos vemos?</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['Online', 'CEMIR', 'XTREME'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setFormData({ ...formData, location: l })}
                className={`py-3 px-2 border text-[8px] uppercase tracking-[0.2em] font-bold transition-all duration-500 rounded-lg ${
                  formData.location === l 
                    ? 'border-primary text-primary bg-primary/5 shadow-inner' 
                    : 'border-foreground/5 text-foreground/30 hover:border-foreground/10 hover:text-foreground/50'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8">
        <Button 
          type="submit" 
          variant="primary"
          size="lg"
          className="w-full py-6 rounded-2xl group relative overflow-hidden shadow-xl shadow-primary/10" 
          disabled={isLoading}
        >
          <span className="relative z-10 text-xs">{isLoading ? 'Procesando...' : 'Confirmar Reserva'}</span>
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </Button>
        <p className="mt-8 text-[9px] uppercase tracking-[0.2em] text-foreground/30 text-center font-bold">
          Tus datos están protegidos bajo protocolos de confidencialidad.
        </p>
      </div>
    </form>
  );
};
