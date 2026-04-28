'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section detection
      const sections = ['sobre-mi', 'servicios', 'coberturas', 'faq'];
      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });
      setActiveSection(current ?? '');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Perfil', href: '#sobre-mi', id: 'sobre-mi' },
    { name: 'Especialidades', href: '#servicios', id: 'servicios' },
    { name: 'Obras Sociales', href: '#coberturas', id: 'coberturas' },
    { name: 'FAQ', href: '#faq', id: 'faq' },
  ];

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'py-2' : 'py-4'
      }`}>
        {/* Gold accent line — always visible at top, stays on scroll */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

        {/* Background: subtle glass always, solid on scroll */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          scrolled
            ? 'bg-white/97 backdrop-blur-xl border-b border-slate-100/80 shadow-[0_2px_20px_rgba(0,0,0,0.05)]'
            : 'bg-white/75 backdrop-blur-md border-b border-slate-100/40'
        }`} />

        <div className="container mx-auto px-6 relative flex justify-between items-center">
          {/* Brand */}
          <Link href="/" onClick={scrollToTop} className="group flex items-center gap-3">
            <div className={`relative overflow-hidden transition-all duration-500 ${
              scrolled ? 'w-9 h-9' : 'w-11 h-11'
            } bg-white rounded-xl p-1.5 shadow-sm border border-slate-100`}>
              <Image
                src="/logo.png"
                alt={SITE_CONFIG.name}
                fill
                sizes="44px"
                className="object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight text-foreground leading-tight">
                {SITE_CONFIG.name}
              </span>
              <span className="text-[7px] uppercase tracking-[0.2em] text-primary font-bold mt-0.5">
                Nutricionista · MP 7250
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className={`text-[10px] uppercase tracking-[0.16em] font-bold transition-colors duration-200 relative group ${
                    isActive ? 'text-secondary' : 'text-foreground/35 hover:text-secondary'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-0.5 left-0 h-px bg-secondary/60 transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              );
            })}

            {/* Divider */}
            <div className="w-px h-4 bg-slate-200" />

            <Link href="/reservar">
              <Button className="rounded-full px-6 py-4 bg-primary hover:bg-primary/90 text-white border-none text-[9px] uppercase tracking-widest font-bold shadow-md shadow-primary/15 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]">
                Agendar Turno
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-foreground/50 hover:text-secondary transition-colors focus:outline-none rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            className="md:hidden fixed inset-0 z-[9999] bg-white w-full h-full flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Gold accent line at top */}
            <div className="h-[2px] w-full bg-primary shrink-0" />

            {/* Mobile Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9">
                  <Image src="/logo.png" alt="Logo" fill sizes="36px" className="object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">Lic. Yesica M. García</span>
                  <span className="text-[8px] uppercase tracking-widest text-primary font-bold">MP 7250</span>
                </div>
              </div>
              <button
                className="p-2 text-foreground/30 hover:text-secondary transition-colors rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col px-8 pt-10 flex-1">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-5 border-b border-slate-50 group"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      const id = link.href.replace('#', '');
                      setTimeout(() => {
                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                      }, 350);
                    }}
                  >
                    <span className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors">
                      {link.name}
                    </span>
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-lg">→</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-8 pb-12 pt-8">
              <Link href="/reservar" className="block" onClick={() => setIsOpen(false)}>
                <Button className="w-full py-7 text-sm font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl border-none uppercase tracking-widest shadow-xl shadow-primary/15">
                  Agendar mi consulta
                </Button>
              </Link>
              <p className="text-center mt-6 text-[9px] uppercase tracking-[0.3em] font-bold text-foreground/20">
                Presencial en San Nicolás · Online para todo el país
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
