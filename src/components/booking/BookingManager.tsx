'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from './Calendar';
import { TimeSlots } from './TimeSlots';
import { BookingForm } from './BookingForm';
import { supabase } from '@/lib/supabase';
import { formatWhatsAppMessage, getWhatsAppUrl } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import { CheckCircle2, Loader2 } from 'lucide-react';

export const BookingManager = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const fetchBookedSlots = useCallback(async (date: Date) => {
    setLoadingSlots(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', format(date, 'yyyy-MM-dd'))
        .neq('status', 'cancelado');

      if (error) throw error;
      setBookedSlots(data?.map(app => app.time) || []);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const timer = setTimeout(() => {
        fetchBookedSlots(selectedDate);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedDate, fetchBookedSlots]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleBackToSlots = () => {
    setStep(2);
  };

  const handleBackToCalendar = () => {
    setStep(1);
    setSelectedTime(null);
  };

  const handleFormSubmit = async (formData: { name: string; phone: string; email: string; modality: string; location: string }) => {
    if (!selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('appointments').insert([
        {
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          full_name: formData.name,
          phone: formData.phone,
          email: formData.email,
          modality: formData.modality,
          location: formData.location,
          status: 'pendiente',
        },
      ]);

      if (error) throw error;

      // Éxito
      setIsSuccess(true);
      
      // Abrir WhatsApp
      const dateStr = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });
      const message = formatWhatsAppMessage(formData.name, dateStr, selectedTime, formData.modality, formData.location);
      const whatsappUrl = getWhatsAppUrl(SITE_CONFIG.whatsappNumber, message);
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);

    } catch {
      alert('Hubo un error al guardar tu turno. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-24"
      >
        <div className="w-24 h-24 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-12">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-5xl font-serif mb-6">¡Reserva registrada!</h3>
        <p className="text-foreground/50 font-serif italic text-xl mb-12 max-w-sm mx-auto leading-relaxed">
          Tu cita para el {selectedDate && format(selectedDate, "d 'de' MMMM", { locale: es })} a las {selectedTime} ha sido confirmada en nuestro sistema.
        </p>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-[1px] bg-foreground/10" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold animate-pulse">
            Redirigiendo a WhatsApp...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-6 mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-6">
            <div 
              className={`text-[9px] font-bold tracking-widest transition-all duration-700 ${
                step === s ? 'text-primary' : 'text-foreground/20'
              }`}
            >
              0{s}
            </div>
            {s < 3 && <div className="w-6 h-[1px] bg-foreground/10" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          {step === 1 && (
            <Calendar 
              selectedDate={selectedDate} 
              onDateSelect={handleDateSelect} 
            />
          )}
          {step === 2 && (
            <div className="max-w-md mx-auto">
              <button 
                onClick={handleBackToCalendar}
                className="mb-12 text-[10px] uppercase tracking-[0.3em] text-foreground/40 hover:text-primary flex items-center gap-4 transition-all group"
              >
                <span className="w-8 h-[1px] bg-foreground/10 group-hover:bg-primary transition-colors" />
                Volver al calendario
              </button>
              {loadingSlots ? (
                <div className="flex flex-col items-center justify-center py-24 text-foreground/20">
                  <Loader2 className="w-8 h-8 animate-spin mb-6 text-primary/40" />
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Buscando disponibilidad</p>
                </div>
              ) : (
                <TimeSlots 
                  selectedTime={selectedTime} 
                  onTimeSelect={handleTimeSelect}
                  bookedSlots={bookedSlots}
                  selectedDate={selectedDate}
                />
              )}
            </div>
          )}
          {step === 3 && (
            <div className="max-w-md mx-auto">
              <button 
                onClick={handleBackToSlots}
                className="mb-12 text-[10px] uppercase tracking-[0.3em] text-foreground/40 hover:text-primary flex items-center gap-4 transition-all group"
              >
                <span className="w-8 h-[1px] bg-foreground/10 group-hover:bg-primary transition-colors" />
                Volver a horarios
              </button>
              
              <div className="mb-10 p-6 border border-foreground/5 bg-foreground/[0.02] flex justify-between items-end">
                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/40 font-bold">Cita Seleccionada</p>
                  <p className="font-serif italic text-xl text-foreground">
                    {selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-serif text-primary">{selectedTime}</p>
                </div>
              </div>

              <BookingForm onSubmit={handleFormSubmit} isLoading={loading} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
