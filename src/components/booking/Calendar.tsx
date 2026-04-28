'use client';

import { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore,
  startOfToday
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const Calendar = ({ selectedDate, onDateSelect }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2024, 0, 1)); // Stable initial date
  const [today, setToday] = useState<Date>(new Date(2024, 0, 1)); // Stable initial date
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCurrentMonth(new Date());
    setToday(startOfToday());
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[400px] w-full bg-accent/5 animate-pulse rounded-[2.5rem]" />;

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex flex-col text-left">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-1">Seleccioná una fecha</p>
          <h3 className="text-3xl font-serif font-bold text-foreground capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            disabled={isSameMonth(currentMonth, today)}
            className="w-12 h-12 flex items-center justify-center hover:bg-primary hover:text-white border border-slate-200 rounded-2xl disabled:opacity-5 transition-all duration-300"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="w-12 h-12 flex items-center justify-center hover:bg-primary hover:text-white border border-slate-200 rounded-2xl transition-all duration-300"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return (
      <div className="grid grid-cols-7 mb-4 border-b border-slate-100 pb-4">
        {days.map((day) => (
          <div key={day} className="text-center text-[11px] uppercase tracking-[0.1em] font-bold text-slate-500">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isDisabled = !isSameMonth(day, monthStart) || isBefore(day, today);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isToday = isSameDay(day, today);

        days.push(
          <button
            key={day.toString()}
            disabled={isDisabled}
            onClick={() => onDateSelect(cloneDay)}
            className={`
              relative h-14 md:h-16 w-full flex flex-col items-center justify-center transition-all duration-500 group
              ${isDisabled ? 'opacity-[0.15] cursor-not-allowed' : 'hover:z-10'}
            `}
          >
            {/* Selection Background */}
            {isSelected && (
              <motion.div 
                layoutId="calendarSelect"
                className="absolute inset-1.5 bg-primary rounded-2xl shadow-lg shadow-primary/20 z-0"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            {/* Today indicator circle */}
            {isToday && !isSelected && (
              <div className="absolute inset-1.5 border-2 border-primary/20 rounded-2xl z-0" />
            )}

            {/* Hover Background */}
            {!isDisabled && !isSelected && (
              <div className="absolute inset-1.5 bg-primary/5 rounded-2xl z-0 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100" />
            )}

            <span className={`
              relative z-10 text-sm md:text-base font-bold transition-colors duration-300
              ${isSelected ? 'text-white' : 'text-slate-800 group-hover:text-primary'}
              ${isToday && !isSelected ? 'text-primary' : ''}
            `}>
              {format(day, 'd')}
            </span>
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="divide-y divide-slate-50/50">{rows}</div>;
  };

  return (
    <div className="w-full">
      {renderHeader()}
      <div className="bg-white rounded-[2.5rem] p-4 md:p-8 border border-slate-50 shadow-sm">
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
};
