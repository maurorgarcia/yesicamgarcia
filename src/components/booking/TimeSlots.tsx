'use client';

import { motion } from 'framer-motion';
import { getDay } from 'date-fns';
import { SCHEDULES } from '@/lib/constants';

interface TimeSlotsProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  bookedSlots?: string[];
  selectedDate: Date | null;
}

export const TimeSlots = ({ selectedTime, onTimeSelect, bookedSlots = [], selectedDate }: TimeSlotsProps) => {
  const dayOfWeek = selectedDate ? getDay(selectedDate) : 0;
  const availableSlots = SCHEDULES[dayOfWeek] || [];

  return (
    <div className="w-full">
      <h3 className="text-3xl font-serif text-center mb-12 italic text-foreground/40">Horarios disponibles</h3>
      {availableSlots.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-foreground/10">
          <p className="text-sm text-foreground/40 italic">No hay turnos disponibles para este día.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4" role="listbox" aria-label="Seleccionar horario">
          {availableSlots.map((time, index) => {
          const isBooked = bookedSlots.includes(time) || bookedSlots.includes(`${time}:00`);
          const isSelected = selectedTime === time;

          return (
            <motion.button
              key={time}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              disabled={isBooked}
              onClick={() => onTimeSelect(time)}
              role="option"
              aria-selected={isSelected}
              className={`
                py-4 px-6 border text-sm font-sans transition-all duration-500 relative group overflow-hidden
                ${isSelected 
                  ? 'border-primary text-primary font-bold' 
                  : isBooked
                    ? 'border-foreground/5 text-foreground/10 cursor-not-allowed line-through'
                    : 'border-foreground/5 text-foreground/40 hover:border-primary/40 hover:text-primary'
                }
              `}
            >
              <span className="relative z-10">{time}</span>
              {isSelected && (
                <motion.div 
                  layoutId="activeSlot"
                  className="absolute inset-0 bg-primary/5 z-0"
                />
              )}
              {!isBooked && !isSelected && (
                <div className="absolute inset-0 bg-foreground/5 z-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              )}
            </motion.button>
          );
        })}
      </div>
      )}
      <div className="mt-12 flex items-center justify-center gap-4">
        <div className="w-8 h-[1px] bg-foreground/10" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-medium">
          Sesión de 45-60 min aprox.
        </p>
        <div className="w-8 h-[1px] bg-foreground/10" />
      </div>
    </div>
  );
};
