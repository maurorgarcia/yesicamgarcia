'use client';

import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const WhatsAppWidget = () => {
  const message = encodeURIComponent(`Hola Lic. Yesica, quería hacerle una consulta sobre...`);
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 group"
      aria-label="Contactar por WhatsApp"
    >
      <div className="relative flex items-center gap-3">
        {/* Tooltip */}
        <div className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl shadow-xl border border-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 pointer-events-none whitespace-nowrap">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">¿Tenés dudas? Escribime</p>
        </div>
        
        {/* Button */}
        <div className="w-14 h-14 bg-white border border-primary/20 rounded-full flex items-center justify-center text-primary shadow-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:scale-110">
          <MessageCircle size={28} />
          
          {/* Ping animation */}
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-40" />
        </div>
      </div>
    </a>
  );
};
