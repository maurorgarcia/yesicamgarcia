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
      <div className="text-left mb-10 px-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-1">Paso 03</p>
        <h3 className="text-3xl font-serif font-bold text-foreground capitalize">
          Horarios disponibles
        </h3>
      </div>

      <div className="bg-white rounded-[2.5rem] p-4 md:p-8 border border-slate-50 shadow-sm">
        {availableSlots.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-foreground/10 rounded-3xl">
            <p className="text-sm text-foreground/40 italic">No hay turnos disponibles para este día.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                className={`
                  relative py-4 px-6 rounded-2xl text-sm font-bold transition-all duration-500 group overflow-hidden border
                  ${isSelected 
                    ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' 
                    : isBooked
                      ? 'border-slate-50 bg-slate-50 text-slate-200 cursor-not-allowed line-through'
                      : 'border-slate-100 bg-accent/20 text-slate-800 hover:border-primary/40 hover:bg-white hover:shadow-md'
                  }
                `}
              >
                <span className="relative z-10">{time}</span>
              </motion.button>
            );
          })}
        </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-4 opacity-50">
          <div className="w-8 h-[1px] bg-primary/20" />
          <p className="text-[9px] uppercase tracking-widest font-bold text-foreground flex items-center gap-2">
            Sesión de 45-60 min aprox.
          </p>
          <div className="w-8 h-[1px] bg-primary/20" />
        </div>
      </div>
    </div>
  );
};
