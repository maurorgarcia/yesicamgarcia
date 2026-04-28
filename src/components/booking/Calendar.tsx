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


  useEffect(() => {
    setCurrentMonth(new Date());
    setToday(startOfToday());
  }, []);


  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-12">
        <h3 className="text-2xl font-serif italic capitalize text-foreground">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="flex gap-4">
          <button
            onClick={prevMonth}
            disabled={isSameMonth(currentMonth, today)}
            className="p-3 hover:bg-foreground/5 border border-foreground/5 rounded-full disabled:opacity-10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-4 h-4 text-foreground/60" />
          </button>
          <button
            onClick={nextMonth}
            className="p-3 hover:bg-foreground/5 border border-foreground/5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-4 h-4 text-foreground/60" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return (
      <div className="grid grid-cols-7 mb-6">
        {days.map((day) => (
          <div key={day} className="text-center text-[10px] uppercase tracking-widest font-bold text-foreground/30">
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
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const isDisabled = !isSameMonth(day, monthStart) || isBefore(day, today);
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        days.push(
          <button
            key={day.toString()}
            disabled={isDisabled}
            onClick={() => onDateSelect(cloneDay)}
            aria-label={format(day, "PPPP", { locale: es })}
            aria-pressed={isSelected || false}
            className={`
              h-12 w-full flex items-center justify-center text-sm transition-all duration-500 relative group
              ${isDisabled ? 'text-foreground/10 cursor-not-allowed' : 'text-foreground/60 hover:text-primary'}
              ${isSelected ? 'text-primary font-bold' : ''}
            `}
          >
            <span className="relative z-10">{formattedDate}</span>
            {isSelected && (
              <motion.div 
                layoutId="activeDay"
                className="absolute inset-2 bg-primary/5 rounded-full z-0"
              />
            )}
            {!isDisabled && !isSelected && (
              <div className="absolute inset-2 bg-foreground/5 rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            {isSameDay(day, today) && !isSelected && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary/40 rounded-full" />
            )}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
