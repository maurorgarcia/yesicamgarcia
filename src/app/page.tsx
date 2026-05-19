'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Horarios disponibles por día de semana (0=Dom, 1=Lun, 2=Mar, ...)
const HORARIOS: Record<number, string[]> = {
  1: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'],
  2: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
  3: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'],
  4: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'],
  5: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'],
};

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface TipoConsultaDetalle {
  id: string;
  nombre: string;
  etiqueta?: string;
  duracion: string;
  precioParticular: string;
  precioObraSocial: string;
}

const TIPOS_DETALLE: TipoConsultaDetalle[] = [
  {
    id: 'Consulta nutricional por primera vez',
    nombre: 'Consulta Nutricional',
    etiqueta: 'Primera Vez',
    duracion: '1 hora aprox.',
    precioParticular: '$40.000',
    precioObraSocial: 'Bono / Token'
  },
  {
    id: 'Consulta nutricional control',
    nombre: 'Consulta Nutricional',
    etiqueta: 'Control',
    duracion: '30 min aprox.',
    precioParticular: '$30.000',
    precioObraSocial: 'Bono / Token'
  },
  {
    id: 'Antropometría primera vez',
    nombre: 'Antropometría',
    etiqueta: 'Primera Vez',
    duracion: '1 hora aprox.',
    precioParticular: '$50.000',
    precioObraSocial: 'Bono / Token + $20.000'
  },
  {
    id: 'Antropometría control',
    nombre: 'Antropometría',
    etiqueta: 'Control',
    duracion: '30 - 45 min aprox.',
    precioParticular: '$40.000',
    precioObraSocial: 'Bono / Token + $20.000'
  },
  {
    id: 'Consulta nutricional + antropometría',
    nombre: 'Consulta + Antropometría',
    etiqueta: 'Primera Vez',
    duracion: '2 horas aprox.',
    precioParticular: '$50.000',
    precioObraSocial: 'Bono / Token + $20.000'
  },
  {
    id: 'Consulta nutricional + antropometría control',
    nombre: 'Consulta + Antropometría',
    etiqueta: 'Control',
    duracion: '45 min aprox.',
    precioParticular: '$40.000',
    precioObraSocial: 'Bono / Token + $20.000'
  }
];

// Genera los próximos 30 días hábiles (Lun-Vie) desde mañana
function getAvailableDates(): { value: string; label: string }[] {
  const dates: { value: string; label: string }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let current = new Date(today);
  current.setDate(current.getDate() + 1); // Empezar desde mañana

  while (dates.length < 30) {
    const day = current.getDay();
    if (day >= 1 && day <= 5) { // Solo Lunes a Viernes
      const value = current.toISOString().split('T')[0];
      const label = `${DIAS[day]} ${current.getDate()}/${current.getMonth() + 1}`;
      dates.push({ value, label });
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

type Estado = 'form' | 'loading' | 'success' | 'error';

export default function Home() {
  const [paso, setPaso] = useState(1);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cobertura, setCobertura] = useState<'particular' | 'obra_social'>('particular');
  const [tipoConsulta, setTipoConsulta] = useState('Consulta nutricional por primera vez');
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 210;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [estado, setEstado] = useState<Estado>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [turnosOcupados, setTurnosOcupados] = useState<{ fecha: string; hora: string }[]>([]);
  const [availableDates] = useState(() => getAvailableDates());

  // Obtener info detallada de la consulta elegida
  const consultaElegida = TIPOS_DETALLE.find(t => t.id === tipoConsulta) || TIPOS_DETALLE[0];

  // Día de semana del date seleccionado (para saber qué horarios mostrar)
  const diaSemana = fecha
    ? new Date(fecha + 'T12:00:00').getDay()
    : null;
  const horariosDia = diaSemana !== null ? (HORARIOS[diaSemana] ?? []) : [];

  // Horarios que ya están tomados para la fecha seleccionada
  const horasOcupadas = turnosOcupados
    .filter(t => t.fecha === fecha)
    .map(t => t.hora.slice(0, 5)); // "HH:MM"

  // Cargar turnos ocupados cuando se selecciona una fecha
  useEffect(() => {
    if (!fecha) return;
    supabase
      .from('turns')
      .select('fecha, hora')
      .eq('fecha', fecha)
      .then(({ data }) => {
        if (data) setTurnosOcupados(data);
      });
  }, [fecha]);

  // Reset hora cuando cambia la fecha
  useEffect(() => {
    setHora('');
  }, [fecha]);

  // Validaciones locales por paso
  function irAPaso2() {
    if (!nombre.trim() || !telefono.trim()) {
      setErrorMsg('Por favor completá tu nombre y teléfono.');
      return;
    }
    setErrorMsg('');
    setPaso(2);
  }

  function seleccionarCobertura(cob: 'particular' | 'obra_social') {
    setCobertura(cob);
    setErrorMsg('');
    setPaso(3);
  }

  function irAPaso4(tipoId: string) {
    setTipoConsulta(tipoId);
    setErrorMsg('');
    setPaso(4);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim() || !tipoConsulta || !fecha || !hora) {
      setErrorMsg('Por favor completá todos los campos.');
      return;
    }
    setErrorMsg('');
    setEstado('loading');

    const coberturaLabel = cobertura === 'particular' ? 'Particular' : 'Obra Social';
    const fullConsultaLabel = `${consultaElegida.nombre} (${consultaElegida.etiqueta || ''}) - ${coberturaLabel}`;

    const { error } = await supabase.from('turns').insert({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      tipo_consulta: fullConsultaLabel,
      fecha,
      hora,
    });

    if (error) {
      setEstado('error');
    } else {
      setEstado('success');
    }
  }

  function formatFechaLabel(value: string) {
    const found = availableDates.find(d => d.value === value);
    return found ? found.label : value;
  }

  if (estado === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
        <div className="animate-fade-up max-w-md w-full text-center">
          {/* Ícono de check */}
          <div className="mx-auto mb-8 w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(225,166,90,0.08)' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--secondary)' }}>
            ¡Turno confirmado!
          </h1>
          <p className="text-lg mb-2" style={{ color: 'var(--muted)' }}>
            Te esperamos el
          </p>
          <div className="py-6 px-8 rounded-3xl mb-8 text-center"
            style={{ background: 'var(--accent)', border: '1px solid var(--border)' }}>
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              {formatFechaLabel(fecha)}
            </p>
            <p className="text-3xl font-bold mb-3" style={{ color: 'var(--secondary)' }}>
              {hora} hs
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--secondary)' }}>
              {consultaElegida.nombre} ({consultaElegida.etiqueta})
            </div>
            <p className="text-sm font-semibold mt-2" style={{ color: 'var(--muted)' }}>
              {cobertura === 'particular' ? consultaElegida.precioParticular : consultaElegida.precioObraSocial} · {consultaElegida.duracion}
            </p>
          </div>

          <p className="text-base mb-8" style={{ color: 'var(--muted)' }}>
            Si necesitás cancelar o cambiar el turno, comunicáte por WhatsApp.
          </p>

          <a
            href={`https://wa.me/5493364671229?text=${encodeURIComponent(`Hola Yesi! Saqué turno para: \n*${consultaElegida.nombre} (${consultaElegida.etiqueta})*\nCobertura: ${cobertura === 'particular' ? 'Particular' : 'Obra Social'}\nValor: ${cobertura === 'particular' ? consultaElegida.precioParticular : consultaElegida.precioObraSocial}\n\nFecha: ${formatFechaLabel(fecha)}\nHora: ${hora} hs\nNombre: ${nombre}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105"
            style={{ background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.3)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Avisar por WhatsApp
          </a>

          <div className="mt-8">
            <button
              onClick={() => {
                setNombre(''); setTelefono(''); setFecha(''); setHora('');
                setTipoConsulta('Consulta nutricional por primera vez');
                setPaso(1);
                setEstado('form');
              }}
              className="text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: 'var(--muted)' }}
            >
              Sacar otro turno
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Header con Logo */}
      <header className="py-4 px-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', background: 'white' }}>
        {paso > 1 ? (
          <button
            onClick={() => setPaso(prev => prev - 1)}
            className="p-2 rounded-full transition-all hover:bg-black/5 flex items-center justify-center"
            title="Volver"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--foreground)" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
        ) : (
          <div className="w-8" />
        )}
        
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Lic. Yesica M. García" className="h-10 w-auto object-contain" />
          <p className="text-[9px] font-bold tracking-wider mt-1 text-muted">MP 7250</p>
        </div>

        <div className="w-8" />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-lg animate-fade-up">

          {/* Indicador de pasos */}
          <div className="flex justify-center items-center gap-2 mb-5">
            {[1, 2, 3, 4].map(p => (
              <div
                key={p}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: paso === p ? '32px' : '8px',
                  background: paso === p ? 'var(--primary)' : paso > p ? 'var(--secondary)' : 'var(--border)',
                }}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4.5">

            {/* PASO 1: Datos Personales */}
            {paso === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-3.5 mb-4 border-b pb-3.5" style={{ borderColor: 'rgba(61,39,16,0.08)' }}>
                  {/* Foto Profesional de Yesica (Compacta) */}
                  <div className="relative p-0.5 rounded-full border-2 flex-shrink-0" style={{ borderColor: 'var(--primary)', background: 'white', boxShadow: '0 0 0 3px rgba(225,166,90,0.08)' }}>
                    <img 
                      src="/fotoNutri.png" 
                      alt="Lic. Yesica M. García" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h1 className="text-xl font-bold leading-tight" style={{ color: 'var(--secondary)' }}>
                      Lic. Yesica M. García
                    </h1>
                    <p className="text-[9px] font-bold tracking-widest uppercase text-muted" style={{ color: 'var(--primary)' }}>
                      Nutricionista · MP 7250
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      Ingresá tus datos de contacto para reservar
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    Nombre y apellido
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Ej: Angelica Stuardo"
                    autoComplete="name"
                    className="w-full px-5 py-4 rounded-2xl text-base outline-none transition-all duration-200"
                    style={{
                      background: 'white',
                      border: '1.5px solid var(--border)',
                      color: 'var(--foreground)',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    Teléfono / WhatsApp
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    value={telefono}
                    onChange={e => setTelefono(e.target.value)}
                    placeholder="Ej: 3364 123456"
                    autoComplete="tel"
                    className="w-full px-5 py-4 rounded-2xl text-base outline-none transition-all duration-200"
                    style={{
                      background: 'white',
                      border: '1.5px solid var(--border)',
                      color: 'var(--foreground)',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>

                 {/* Agenda e Información de Consultorios */}
                <div className="p-5 rounded-2xl border text-sm space-y-4"
                  style={{ background: 'var(--accent)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--secondary)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Sedes y Horarios de Atención</span>
                  </div>
                  
                  <div className="space-y-4 text-xs" style={{ color: 'var(--muted)' }}>
                    {/* Xtreme */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b pb-3" style={{ borderColor: 'rgba(61,39,16,0.08)' }}>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-secondary min-w-[85px] uppercase tracking-wide flex-shrink-0">Xtreme:</span>
                        <span>Lunes y viernes todo el día · Miércoles (tarde a coordinar)</span>
                      </div>
                      <a
                        href="https://maps.app.goo.gl/CRwidwDzXPatnXxy6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold underline hover:opacity-75 transition-opacity sm:self-center self-start flex-shrink-0"
                        style={{ color: 'var(--primary)' }}
                      >
                        Ver ubicación
                      </a>
                    </div>

                    {/* Cemir */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b pb-3" style={{ borderColor: 'rgba(61,39,16,0.08)' }}>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-secondary min-w-[85px] uppercase tracking-wide flex-shrink-0">Cemir:</span>
                        <span>Martes de 8 a 12 hs · Jueves a partir del mediodía</span>
                      </div>
                      <a
                        href="https://maps.app.goo.gl/tp5tCSE4yh1r51px5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold underline hover:opacity-75 transition-opacity sm:self-center self-start flex-shrink-0"
                        style={{ color: 'var(--primary)' }}
                      >
                        Ver ubicación
                      </a>
                    </div>

                    {/* Grupo Oroño */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-secondary min-w-[85px] uppercase tracking-wide flex-shrink-0">GO Zona Sur:</span>
                        <span>Martes de 14 a 18 hs · Miércoles de 8 a 12 hs</span>
                      </div>
                      <a
                        href="https://maps.app.goo.gl/U8neupw8bNHm7vhJ7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold underline hover:opacity-75 transition-opacity sm:self-center self-start flex-shrink-0"
                        style={{ color: 'var(--primary)' }}
                      >
                        Ver ubicación
                      </a>
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-sm text-center animate-fade-in" style={{ color: '#e53e3e' }}>
                    {errorMsg}
                  </p>
                )}

                <button
                  type="button"
                  onClick={irAPaso2}
                  className="w-full py-5 rounded-2xl font-bold text-base transition-all duration-300 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background: 'var(--primary)',
                    color: 'var(--secondary)',
                    boxShadow: '0 8px 24px rgba(225, 166, 90, 0.25)',
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLButtonElement).style.background = 'var(--primary-hover)';
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.background = 'var(--primary)';
                  }}
                >
                  Continuar
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            )}

            {/* PASO 2: Elegir Cobertura */}
            {paso === 2 && (
              <div className="space-y-6 animate-fade-in text-center">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold mb-1 animate-fade-in" style={{ color: 'var(--secondary)' }}>
                    ¿Cómo vas a abonar?
                  </h1>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    Seleccioná tu tipo de consulta para ver las opciones disponibles.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto">
                  <button
                    type="button"
                    onClick={() => seleccionarCobertura('particular')}
                    className="p-6 rounded-3xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white group hover:scale-[1.02] hover:shadow-md"
                    style={{
                      borderColor: 'var(--border)',
                      boxShadow: '0 4px 20px rgba(61,39,16,0.02)',
                    }}
                  >
                    <div className="p-3.5 rounded-full transition-colors duration-300 bg-accent group-hover:bg-[#f6efe7]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <span className="text-base font-extrabold block leading-none" style={{ color: 'var(--secondary)' }}>
                        Particular
                      </span>
                      <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
                        Pago privado
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => seleccionarCobertura('obra_social')}
                    className="p-6 rounded-3xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white group hover:scale-[1.02] hover:shadow-md"
                    style={{
                      borderColor: 'var(--border)',
                      boxShadow: '0 4px 20px rgba(61,39,16,0.02)',
                    }}
                  >
                    <div className="p-3.5 rounded-full transition-colors duration-300 bg-accent group-hover:bg-[#f6efe7]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <span className="text-base font-extrabold block leading-none" style={{ color: 'var(--secondary)' }}>
                        Obra Social
                      </span>
                      <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
                        Bono o Token
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: Elegir Servicio */}
            {paso === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center mb-4">
                  <h1 className="text-3xl font-bold mb-1 animate-fade-in" style={{ color: 'var(--secondary)' }}>
                    Elegí tu Consulta
                  </h1>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    Seleccioná la consulta o evaluación que deseás realizarte.
                  </p>
                </div>

                {/* Mensaje Informativo si es Obra Social */}
                {cobertura === 'obra_social' && (
                  <div className="p-3.5 rounded-xl border text-[11px] leading-relaxed animate-fade-in flex items-start gap-2"
                    style={{ background: 'rgba(225,166,90,0.04)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <svg className="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <span>
                      <strong>Importante:</strong> Debés presentar el <strong>bono o token</strong> de tu cobertura médica. Algunas prácticas tienen un adicional.
                    </span>
                  </div>
                )}

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {TIPOS_DETALLE.map(t => {
                    const seleccionado = tipoConsulta === t.id;
                    const precioActual = cobertura === 'particular' ? t.precioParticular : t.precioObraSocial;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => irAPaso4(t.id)}
                        className="w-full text-left p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between gap-4 border cursor-pointer"
                        style={{
                          background: seleccionado ? 'rgba(225,166,90,0.04)' : 'white',
                          borderColor: seleccionado ? 'var(--primary)' : 'var(--border)',
                          borderWidth: seleccionado ? '2px' : '1.5px',
                          boxShadow: seleccionado ? '0 4px 16px rgba(225,166,90,0.06)' : 'none',
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="font-semibold text-xs md:text-sm" style={{ color: 'var(--foreground)' }}>
                              {t.nombre}
                            </span>
                            {t.etiqueta && (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                                style={{ background: 'var(--accent)', color: 'var(--secondary)' }}>
                                {t.etiqueta}
                              </span>
                            )}
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                              style={{ 
                                background: cobertura === 'particular' ? 'rgba(225,166,90,0.06)' : '#f0fdf4',
                                color: cobertura === 'particular' ? 'var(--secondary)' : '#16a34a',
                                border: cobertura === 'particular' ? '1px solid rgba(225,166,90,0.15)' : '1px solid #bbf7d0'
                              }}>
                              {cobertura === 'particular' ? 'Particular' : 'Obra Social'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
                            <span className="flex items-center gap-1">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                              </svg>
                              {t.duracion}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm md:text-base font-bold whitespace-nowrap" style={{ color: 'var(--secondary)' }}>
                            {precioActual}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PASO 4: Fecha y Horario */}
            {paso === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center mb-6 animate-fade-in">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ background: 'var(--accent)', color: 'var(--secondary)' }}>
                    {consultaElegida.nombre} ({consultaElegida.etiqueta})
                  </div>
                  <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--secondary)' }}>
                    Día y Horario
                  </h1>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Elegí la fecha para ver los turnos disponibles.
                  </p>
                </div>

                {/* Selección Día */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      Seleccioná el día
                    </label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => scrollCarousel('left')}
                        className="w-7 h-7 rounded-full border bg-white text-muted hover:text-secondary hover:border-secondary transition-all flex items-center justify-center cursor-pointer"
                        style={{ borderColor: 'var(--border)' }}
                        title="Días anteriores"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollCarousel('right')}
                        className="w-7 h-7 rounded-full border bg-white text-muted hover:text-secondary hover:border-secondary transition-all flex items-center justify-center cursor-pointer"
                        style={{ borderColor: 'var(--border)' }}
                        title="Siguientes días"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div
                    ref={carouselRef}
                    className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}>
                    {availableDates.map(d => {
                      const [y, m, dayNum] = d.value.split('-').map(Number);
                      const dateObj = new Date(y, m - 1, dayNum);
                      const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][dateObj.getDay()];
                      const monthName = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][dateObj.getMonth()];
                      const seleccionado = fecha === d.value;

                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setFecha(d.value)}
                          className="flex-shrink-0 w-[68px] py-3 rounded-2xl border text-center transition-all duration-200 snap-start flex flex-col items-center justify-center cursor-pointer"
                          style={{
                            background: seleccionado ? 'rgba(225,166,90,0.08)' : 'white',
                            borderColor: seleccionado ? 'var(--primary)' : 'var(--border)',
                            borderWidth: seleccionado ? '2px' : '1.5px',
                            boxShadow: seleccionado ? '0 4px 12px rgba(225, 166, 90, 0.06)' : 'none',
                          }}
                        >
                          <span className="text-[9px] uppercase font-bold tracking-wider"
                            style={{ color: seleccionado ? 'var(--secondary)' : 'var(--muted)' }}>
                            {dayName}
                          </span>
                          <span className="text-xl font-bold my-0.5"
                            style={{ color: seleccionado ? 'var(--secondary)' : 'var(--foreground)' }}>
                            {dayNum}
                          </span>
                          <span className="text-[8px] font-bold uppercase opacity-85"
                            style={{ color: seleccionado ? 'var(--primary)' : 'var(--muted)' }}>
                            {monthName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selección Horarios */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    Horarios disponibles
                  </label>
                  {!fecha ? (
                    <div className="w-full px-5 py-4 rounded-2xl text-center text-sm"
                      style={{ background: 'var(--accent)', border: '1.5px solid var(--border)', color: 'var(--muted)' }}>
                      Elegí un día arriba para ver los horarios
                    </div>
                  ) : horariosDia.length === 0 ? (
                    <div className="w-full px-5 py-4 rounded-2xl text-center text-sm"
                      style={{ background: 'var(--accent)', border: '1.5px solid var(--border)', color: 'var(--muted)' }}>
                      No hay horarios disponibles para este día
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {horariosDia.map(h => {
                        const ocupado = horasOcupadas.includes(h);
                        const seleccionado = hora === h;
                        return (
                          <button
                            key={h}
                            type="button"
                            disabled={ocupado}
                            onClick={() => setHora(h)}
                            className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{
                              background: ocupado
                                ? 'var(--accent)'
                                : seleccionado
                                ? 'var(--primary)'
                                : 'white',
                              color: ocupado
                                ? 'var(--muted)'
                                : seleccionado
                                ? 'white'
                                : 'var(--foreground)',
                              border: seleccionado
                                ? '1.5px solid var(--primary)'
                                : '1.5px solid var(--border)',
                              opacity: ocupado ? 0.5 : 1,
                              cursor: ocupado ? 'not-allowed' : 'pointer',
                              textDecoration: ocupado ? 'line-through' : 'none',
                            }}
                          >
                            {h}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <p className="text-sm text-center animate-fade-in" style={{ color: '#e53e3e' }}>
                    {errorMsg}
                  </p>
                )}
                {estado === 'error' && (
                  <p className="text-sm text-center animate-fade-in" style={{ color: '#e53e3e' }}>
                    Ocurrió un error. Por favor intentá de nuevo.
                  </p>
                )}

                <button
                  id="btn-sacar-turno"
                  type="submit"
                  disabled={estado === 'loading' || !hora}
                  className="w-full py-5 rounded-2xl font-bold text-base transition-all duration-300 mt-2"
                  style={{
                    background: estado === 'loading' || !hora
                      ? 'var(--border)'
                      : 'var(--primary)',
                    color: estado === 'loading' || !hora ? 'var(--muted)' : 'var(--secondary)',
                    boxShadow: estado === 'loading' || !hora ? 'none' : '0 8px 24px rgba(225, 166, 90, 0.25)',
                    cursor: estado === 'loading' || !hora ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (estado !== 'loading' && hora) (e.target as HTMLButtonElement).style.background = 'var(--primary-hover)';
                  }}
                  onMouseLeave={e => {
                    if (estado !== 'loading' && hora) (e.target as HTMLButtonElement).style.background = 'var(--primary)';
                  }}
                >
                  {estado === 'loading' ? 'Confirmando...' : 'Confirmar turno'}
                </button>
              </div>
            )}
          </form>

          {/* Footer mini con botón oculto de admin y firma MRG Dev */}
          <footer className="mt-7 text-center text-xs space-y-2.5" style={{ color: 'var(--muted)' }}>
            <p>
              Para cancelar o consultar,{' '}
              <a
                href="https://wa.me/5493364671229"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                style={{ color: 'var(--primary)', fontWeight: '600' }}
              >
                escribí por WhatsApp
              </a>
            </p>
            
            <div className="pt-2 flex items-center justify-center gap-4 text-[10px] opacity-70 hover:opacity-100 transition-all duration-300">
              <span className="flex items-center gap-1.5 font-medium tracking-wide" style={{ color: 'var(--muted)' }}>
                Hecho por
                <a 
                  href="https://mrgarciadev.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:scale-105 transition-transform flex items-center cursor-pointer"
                  title="Visitar sitio de MRG Dev"
                >
                  <img 
                    src="/logoMrgDeve.png" 
                    alt="MRG Dev" 
                    className="h-3.5 w-auto object-contain" 
                    style={{ filter: 'invert(1)' }}
                  />
                </a>
              </span>
              <span style={{ color: 'rgba(225, 166, 90, 0.25)' }}>|</span>
              <Link
                href="/admin"
                className="hover:scale-105 transition-transform cursor-pointer flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--primary)' }}
                title="Acceso Administración"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Acceso Seguro</span>
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
