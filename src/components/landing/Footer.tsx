'use client';

import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 16, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="py-20 bg-accent/5 text-foreground border-t border-primary/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="group flex items-center gap-3 mb-8">
              <div className="relative w-14 h-14 overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt={SITE_CONFIG.name} 
                  className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-serif font-bold tracking-tight text-foreground leading-tight">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-primary font-bold">
                  Matrícula Profesional 7250
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted max-w-sm leading-relaxed mb-10">
              Nutricionista dedicada al diagnóstico clínico, recomposición corporal y optimización del rendimiento basada en evidencia científica rigurosa.
            </p>
            <div className="flex items-center gap-4">
              <a href={`https://instagram.com/${SITE_CONFIG.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-500 shadow-sm">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 mb-10">Atención Clínica</h4>
            <ul className="space-y-10">
              <li>
                <a 
                  href={SITE_CONFIG.locations.cemir.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="flex items-center gap-3 mb-3 text-foreground group-hover:text-primary transition-colors">
                    <MapPin size={18} className="text-primary/40" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{SITE_CONFIG.locations.cemir.name}</span>
                  </div>
                  <p className="pl-8 text-xs text-muted leading-relaxed">{SITE_CONFIG.locations.cemir.address}</p>
                  <p className="pl-8 text-[9px] text-primary font-bold mt-2 uppercase tracking-tight">{SITE_CONFIG.locations.cemir.schedules}</p>
                </a>
              </li>
              <li>
                <a 
                  href={SITE_CONFIG.locations.xtreme.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="flex items-center gap-3 mb-3 text-foreground group-hover:text-secondary transition-colors">
                    <MapPin size={18} className="text-secondary/40" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{SITE_CONFIG.locations.xtreme.name}</span>
                  </div>
                  <p className="pl-8 text-xs text-muted leading-relaxed">{SITE_CONFIG.locations.xtreme.address}</p>
                  <p className="pl-8 text-[9px] text-secondary font-bold mt-2 uppercase tracking-tight">{SITE_CONFIG.locations.xtreme.schedules}</p>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40 mb-10">Contacto</h4>
            <ul className="space-y-8">
              <li className="flex items-center gap-5 text-muted group cursor-pointer hover:text-foreground transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-white border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">Email Profesional</p>
                  <p className="text-xs font-medium">{SITE_CONFIG.email}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">
            © {new Date().getFullYear()} Lic. Yesica M. García — Nutrición Basada en Evidencia
          </p>
          <div className="flex gap-10 text-[10px] uppercase tracking-[0.2em] text-muted font-bold">
            <Link href="#" className="hover:text-primary transition-colors">Aviso Legal</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
