'use client';

import { motion } from 'framer-motion';

export const AboutMe = () => {
  return (
    <section id="sobre-mi" className="section-spacing bg-white relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/[0.03] -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* LEFT: Credential Panel — unique, no photo */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="w-full lg:w-[45%]"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-secondary rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-secondary/20">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-[0.06]">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="dots-about" width="24" height="24" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots-about)" />
                  </svg>
                </div>
                
                {/* Top label */}
                <div className="relative z-10 mb-10">
                  <p className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-bold mb-2">Lic. Yesica M. García</p>
                  <p className="text-2xl font-bold text-white leading-tight">Nutrición Clínica<br />y Deportiva</p>
                  <p className="text-sm text-primary font-bold mt-2">San Nicolás, Bs. As. · Online</p>
                </div>
                
                {/* Stats grid */}
                <div className="relative z-10 grid grid-cols-2 gap-4 mb-8">
                  {[
                    { num: "MP 7250", label: "Matrícula" },
                    { num: "ISAK II", label: "Certificación" },
                    { num: "CIENCIA", label: "Basada en Evidencia" },
                    { num: "37+", label: "Obras Sociales" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/10 rounded-2xl p-5">
                      <p className="text-2xl font-bold text-white leading-none">{stat.num}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-[0.15em] font-bold mt-2">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Bottom badges */}
                <div className="relative z-10 flex flex-wrap gap-3">
                  {["Nutrición Deportiva", "Composición Corporal", "Salud Metabólica"].map((tag) => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-white/70 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Small floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -bottom-6 -right-6 bg-white border border-slate-100 shadow-xl rounded-2xl p-5 hidden md:block"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60 mb-1">Modalidad</p>
                <p className="text-sm font-bold text-foreground">Presencial & Online</p>
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
                  className="inline-flex items-center gap-4 text-primary text-[11px] uppercase tracking-[0.4em] font-bold mb-10"
                >
                  <span className="w-16 h-[2px] bg-primary/20" />
                  Metodología Clínica
                </motion.span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-foreground mb-12">
                  Rigor técnico para <br />
                  <span className="text-secondary">objetivos reales</span>
                </h2>
                <div className="space-y-10 text-lg text-muted font-sans leading-relaxed">
                  <p className="text-xl text-foreground/80 font-medium border-l-4 border-primary/20 pl-10 py-4 bg-secondary/[0.02] rounded-r-2xl">
                    “No creo en las dietas de moda. Creo en entender cómo funciona <em>tu</em> cuerpo.”
                  </p>
                  <p className="font-light">
                    Me recibí en 2023 con orientación en <span className="text-foreground font-semibold">Deporte y Salud Metabólica</span>. Hoy acompaño a mis pacientes con herramientas reales, sin recetas genéricas ni restricciones sin sentido.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 pt-14 border-t border-slate-100">
                {[
                  { label: "N° Matrícula", value: "MP 7250", color: "text-primary" },
                  { label: "Antropometrista", value: "ISAK II", color: "text-secondary" },
                  { label: "Formación", value: "Especialista", color: "text-foreground" },
                  { label: "Enfoque", value: "Bio-Individual", color: "text-muted" }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <p className={`text-2xl font-bold ${item.color} transition-colors duration-500 inline-block`}>
                      {item.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold mt-3 opacity-60">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
