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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Perfil', href: '#sobre-mi' },
    { name: 'Especialidades', href: '#servicios' },
    { name: 'Obras Sociales', href: '#coberturas' },
    { name: 'FAQ', href: '#faq' },
  ];

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md py-2 border-b border-slate-100 shadow-sm' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" onClick={scrollToTop} className="group flex items-center gap-3">
          <div className="relative w-12 h-12 overflow-hidden">
            <Image 
              src="/logo.png" 
              alt={SITE_CONFIG.name} 
              fill
              sizes="48px"
              className="object-contain group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-serif font-bold tracking-tight text-foreground leading-tight">
              {SITE_CONFIG.name}
            </span>
            <span className="text-[7px] uppercase tracking-[0.2em] text-primary font-bold">
              Nutrición Clínica & Deportiva
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] font-bold text-muted hover:text-primary transition-all relative group"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link href="/reservar">
            <Button 
              variant="primary"
              size="sm" 
              className="rounded-full px-6 shadow-md shadow-primary/10"
            >
              Agenda Clínica
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-foreground/60 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>

      {/* Mobile Menu Overlay - Outside nav for total independence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-[9999] bg-white w-full h-full"
            style={{ backgroundColor: '#FFFFFF', opacity: 1 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-col h-full w-full p-8 pt-32 overflow-y-auto">
              <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10">
                    <Image src="/logo.png" alt="Logo" fill sizes="40px" className="object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-serif font-bold text-foreground">Lic. Yesica M. García</span>
                  </div>
                </div>
                <button 
                  className="p-2 text-foreground/40 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={32} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-8 mt-4">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <Link
                      href={link.href}
                      className="text-4xl font-serif italic text-foreground block py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                        const target = document.querySelector(link.href);
                        if (target) {
                          // Small timeout to allow menu close animation before jumping
                          setTimeout(() => {
                            target.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }
                      }}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="mt-auto pt-10 border-t border-primary/5 pb-8">
                <Link href="/reservar" className="w-full">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full py-7 text-base shadow-xl shadow-primary/10 rounded-2xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Agendar mi consulta
                  </Button>
                </Link>
                <p className="text-center mt-6 text-[10px] uppercase tracking-[0.3em] font-bold text-primary opacity-40">
                  Atención Presencial & Online
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
