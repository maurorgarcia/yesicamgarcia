'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export const AboutMe = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImg]);

  return (
    <section id="sobre-mi" className="section-spacing bg-white relative overflow-hidden">
      {/* Organic Background Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="w-full lg:w-[45%]"
          >
            <div className="relative">
              {/* Premium image frame with color */}
              <div className="absolute -inset-6 border border-primary/20 rounded-[3rem] translate-x-4 translate-y-4 pointer-events-none" />
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-secondary/5 border border-primary/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] flex items-center justify-center p-24 group">
                <Image 
                  src="/logo.png" 
                  alt="Identity" 
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-contain opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-[3s] grayscale brightness-0 p-24" 
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-transparent" />
              </div>
              
              {/* Floating credential badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -bottom-10 -right-10 p-10 bg-white shadow-2xl rounded-[2rem] border border-slate-100 hidden md:block"
              >
                <div className="text-center">
                  <div className="text-4xl font-serif font-black text-primary italic leading-none">YMG</div>
                  <div className="text-[10px] uppercase tracking-[0.4em] text-secondary font-bold mt-2">Sello Profesional</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            className="w-full lg:w-[55%]"
          >
            <div className="space-y-14">
              <div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-4 text-primary text-[12px] uppercase tracking-[0.6em] font-bold mb-10"
                >
                  <span className="w-16 h-[2px] bg-primary/20" />
                  Trayectoria Profesional
                </motion.span>
                <h2 className="text-5xl md:text-7xl font-serif font-black leading-[1.05] text-foreground mb-12">
                  Ciencia aplicada a tu <br />
                  <span className="text-secondary italic font-light">Bienestar Diario</span>
                </h2>
                <div className="space-y-10 text-lg text-muted font-sans leading-relaxed">
                  <p className="text-2xl text-foreground/80 font-serif font-medium italic border-l-4 border-primary/30 pl-10 py-4 bg-primary/[0.02] rounded-r-2xl">
                    "Mi enfoque trasciende las dietas genéricas para diseñar un sistema que funcione con vos."
                  </p>
                  <p className="font-light">
                    Como <span className="text-foreground font-semibold">Licenciada en Nutrición</span> especializada en Deporte y Salud Metabólica, transformo la evidencia científica en hábitos prácticos y placenteros.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 pt-14 border-t border-slate-100">
                {[
                  { label: "Matrícula Profesional", value: "MP 7250", color: "text-primary" },
                  { label: "Especialización", value: "Nutrición Deportiva", color: "text-secondary" },
                  { label: "Certificación", value: "ISAK II", color: "text-foreground" },
                  { label: "Metodología", value: "Bio-Individualidad", color: "text-muted" }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <p className={`text-2xl md:text-3xl font-serif font-black ${item.color} group-hover:translate-x-2 transition-transform duration-500 inline-block`}>
                      {item.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold mt-3 opacity-60">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* New Titles Section with Lightbox */}
        <div className="mt-40 pt-20 border-t border-primary/5">
          <div className="text-center mb-16">
            <span className="text-primary text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Respaldo Profesional</span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold italic">Credenciales & Certificaciones</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { img: '/isak1_titulo.png', title: 'Antropometrista ISAK I', desc: 'Perfil Restringido' },
              { img: '/isak2_titulo.png', title: 'Antropometrista ISAK II', desc: 'Perfil Completo' },
              { img: '/nutricionDeportiva_certificado.png', title: 'Nutrición Deportiva', desc: 'Especialización Avanzada' }
            ].map((cert, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImg(cert.img)}
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-primary/10 bg-accent/5 mb-6 group-hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-xl relative">
                  <Image 
                    src={cert.img} 
                    alt={cert.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-primary transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h4 className="text-sm font-serif font-bold text-foreground mb-1">{cert.title}</h4>
                <p className="text-[11px] text-muted font-bold uppercase tracking-tighter opacity-60">{cert.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center p-6 md:p-12"
          >
            <motion.button
              className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors"
              onClick={() => setSelectedImg(null)}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full aspect-auto bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={selectedImg} 
                alt="Credential" 
                width={1200}
                height={800}
                className="w-full h-full object-contain max-h-[85vh]" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
