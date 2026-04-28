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

import { ServiceSelection } from './ServiceSelection';

export const BookingManager = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
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
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate, fetchBookedSlots]);

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleBackToServices = () => setStep(1);
  const handleBackToCalendar = () => setStep(2);
  const handleBackToSlots = () => setStep(3);

  const handleFormSubmit = async (formData: { name: string; phone: string; email: string; modality: string; location: string }) => {
    if (!selectedDate || !selectedTime || !selectedService) return;

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
          service_name: selectedService.name + ' (' + selectedService.description + ')',
          price: selectedService.price,
          status: 'pendiente',
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      
      // Abrir WhatsApp con más info
      const dateStr = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });
      const serviceText = `${selectedService.name} - ${selectedService.description} (${selectedService.price})`;
      const message = formatWhatsAppMessage(formData.name, dateStr, selectedTime, formData.modality, formData.location, serviceText);
      const whatsappUrl = getWhatsAppUrl(SITE_CONFIG.whatsappNumber, message);
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);

    } catch (err) {
      console.error(err);
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
        <p className="text-foreground/50 font-serif italic text-xl mb-6 max-w-sm mx-auto leading-relaxed">
          Tu cita para el {selectedDate && format(selectedDate, "d 'de' MMMM", { locale: es })} a las {selectedTime} ya está en mi agenda.
        </p>
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-12">
          Servicio: {selectedService?.name}
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
      <div className="flex items-center justify-center gap-6 mb-16">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-6">
            <div 
              className={`text-[10px] font-bold tracking-widest transition-all duration-700 ${
                step === s ? 'text-primary' : 'text-foreground/20'
              }`}
            >
              0{s}
            </div>
            {s < 4 && <div className="w-6 h-[1px] bg-foreground/10" />}
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
            <ServiceSelection onSelect={handleServiceSelect} />
          )}
          {step === 2 && (
            <div className="max-w-4xl mx-auto">
              <button 
                onClick={handleBackToServices}
                className="mb-12 text-[10px] uppercase tracking-[0.3em] text-foreground/40 hover:text-primary flex items-center gap-4 transition-all group"
              >
                <span className="w-8 h-[1px] bg-foreground/10 group-hover:bg-primary transition-colors" />
                Cambiar servicio
              </button>
              <Calendar 
                selectedDate={selectedDate} 
                onDateSelect={handleDateSelect} 
              />
            </div>
          )}
          {step === 3 && (
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
          {step === 4 && (
            <div className="max-w-md mx-auto">
              <button 
                onClick={handleBackToSlots}
                className="mb-12 text-[10px] uppercase tracking-[0.3em] text-foreground/40 hover:text-primary flex items-center gap-4 transition-all group"
              >
                <span className="w-8 h-[1px] bg-foreground/10 group-hover:bg-primary transition-colors" />
                Volver a horarios
              </button>
              
              <div className="mb-10 p-8 rounded-3xl border border-primary/10 bg-primary/[0.02] flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-primary font-bold">Servicio</p>
                    <p className="font-serif italic text-xl text-foreground">{selectedService?.name}</p>
                    <p className="text-[10px] text-muted font-medium">{selectedService?.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-serif text-primary">{selectedService?.price}</p>
                    <p className="text-[9px] text-muted uppercase mt-1">{selectedService?.duration}</p>
                  </div>
                </div>
                
                <div className="h-[1px] bg-primary/10 w-full" />
                
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-primary font-bold">Cita</p>
                    <p className="font-serif text-base text-foreground">
                      {selectedDate && format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-serif text-foreground">{selectedTime}</p>
                  </div>
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
