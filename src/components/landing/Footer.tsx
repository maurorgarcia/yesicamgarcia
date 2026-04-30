'use client';

import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import Image from 'next/image';

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
    <footer className="py-24 bg-secondary text-white border-t border-white/10 relative overflow-hidden">
      {/* Decorative texture for footer */}
      <div className="absolute inset-0 opacity-10 pointer-events-none grayscale brightness-200" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="group flex items-center gap-4 mb-10">
              <div className="relative w-24 h-24 overflow-hidden group-hover:scale-105 transition-all duration-500">
                <Image 
                  src="/logo.png" 
                  alt={SITE_CONFIG.name} 
                  fill
                  sizes="96px"
                  className="object-contain" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-black tracking-tight text-white leading-tight">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mt-1">
                  Matrícula Profesional 7250
                </span>
              </div>
            </Link>
            <p className="text-base text-white/60 max-w-sm leading-relaxed mb-12 font-light">
              Transformando la nutrición a través de la evidencia científica, el respeto por la individualidad y la búsqueda constante del bienestar integral.
            </p>
            <div className="flex items-center gap-4">
              <a href={`https://instagram.com/${SITE_CONFIG.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-500 shadow-xl">
                <InstagramIcon size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.5em] font-black text-accent/40 mb-12">Atención Clínica</h4>
            <ul className="space-y-12">
              <li>
                <a 
                  href={SITE_CONFIG.locations.cemir.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="flex items-center gap-4 mb-4 text-white group-hover:text-accent transition-colors">
                    <MapPin size={20} className="text-accent/60" />
                    <span className="text-[12px] font-bold uppercase tracking-[0.2em]">{SITE_CONFIG.locations.cemir.name}</span>
                  </div>
                  <p className="pl-9 text-sm text-white/50 leading-relaxed font-light">{SITE_CONFIG.locations.cemir.address}</p>
                  <p className="pl-9 text-[10px] text-accent font-black mt-3 uppercase tracking-widest">{SITE_CONFIG.locations.cemir.schedules}</p>
                </a>
              </li>
              <li>
                <a 
                  href={SITE_CONFIG.locations.xtreme.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="flex items-center gap-4 mb-4 text-white group-hover:text-accent transition-colors">
                    <MapPin size={20} className="text-accent/60" />
                    <span className="text-[12px] font-bold uppercase tracking-[0.2em]">{SITE_CONFIG.locations.xtreme.name}</span>
                  </div>
                  <p className="pl-9 text-sm text-white/50 leading-relaxed font-light">{SITE_CONFIG.locations.xtreme.address}</p>
                  <p className="pl-9 text-[10px] text-accent font-black mt-3 uppercase tracking-widest">{SITE_CONFIG.locations.xtreme.schedules}</p>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.5em] font-black text-accent/40 mb-12">Contacto</h4>
            <ul className="space-y-10">
              <li className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-[1.2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40 mb-1">Email</p>
                  <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{SITE_CONFIG.email}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-bold">
            © {new Date().getFullYear()} Lic. Yesica M. García — Nutrición de Precisión
          </p>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <Link 
              href="/admin/login" 
              className="text-[9px] uppercase tracking-[0.3em] text-white/10 hover:text-accent font-bold transition-colors duration-500"
            >
              Acceso Profesional
            </Link>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            {/* Developer Branding - Exact Match to Screenshot */}
            <div className="flex flex-col gap-1 items-end md:items-start group cursor-default">
              <div className="flex justify-end w-full md:w-auto">
                <span className="font-mono text-[9px] text-white/70 font-bold tracking-tighter transition-all group-hover:text-white">&lt;mrgdev/&gt;</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[1px] h-4 bg-white/10 group-hover:bg-primary/40 transition-colors" />
                <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-white/20 group-hover:text-white/40 transition-colors">Developed by</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
