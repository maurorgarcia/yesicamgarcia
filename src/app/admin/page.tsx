'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Contraseña simple para el panel
const ADMIN_PASSWORD = 'yesica2025';

type Turno = {
  id: string;
  created_at: string;
  fecha: string;
  hora: string;
  nombre: string;
  telefono: string;
  tipo_consulta?: string;
  estado?: 'pendiente' | 'confirmado' | 'atendido' | 'cancelado';
};

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatFecha(fechaStr: string) {
  const [y, m, d] = fechaStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${DIAS[date.getDay()]} ${d} ${MESES[m - 1]}`;
}

function formatHora(horaStr: string) {
  return horaStr.slice(0, 5); // "HH:MM"
}

function tiempoRelativo(isoStr: string) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'recién ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hs = Math.floor(mins / 60);
  if (hs < 24) return `hace ${hs} h`;
  const dias = Math.floor(hs / 24);
  return `hace ${dias} día${dias > 1 ? 's' : ''}`;
}

// Mapea exactamente los precios de consulta y antropometría de la nutri
function obtenerMontoTurno(tipoConsulta: string): number {
  const t = tipoConsulta.toLowerCase();
  const esParticular = t.includes('particular');
  
  if (t.includes('consulta nutricional primera vez') || t.includes('consulta primera vez')) {
    return esParticular ? 40000 : 0; // Particular: 40k, Obra Social: Bono/Token ($0 en efectivo)
  }
  if (t.includes('consulta nutricional control') || t.includes('consulta control')) {
    return esParticular ? 30000 : 0; // Particular: 30k, Obra Social: Bono/Token ($0 en efectivo)
  }
  if (t.includes('antropometría primera vez') || t.includes('antropometria primera vez')) {
    return esParticular ? 50000 : 20000; // Particular: 50k, Obra Social: 20k + Bono/Token
  }
  if (t.includes('antropometría control') || t.includes('antropometria control')) {
    return esParticular ? 40000 : 20000; // Particular: 40k, Obra Social: 20k + Bono/Token
  }
  if (t.includes('consulta + antro primera vez') || t.includes('combo primera vez')) {
    return esParticular ? 50000 : 20000; // Particular: 50k, Obra Social: 20k + Bono/Token
  }
  if (t.includes('consulta + antro control') || t.includes('combo control')) {
    return esParticular ? 40000 : 20000; // Particular: 40k, Obra Social: 20k + Bono/Token
  }
  
  // Fallbacks de seguridad por si hay algún texto diferente
  if (esParticular) {
    if (t.includes('antropomet') || t.includes('antro')) return 40000;
    return 30000;
  } else {
    if (t.includes('antropomet') || t.includes('antro')) return 20000;
    return 0;
  }
}

// Agrupa turnos por fecha
function agruparPorFecha(turnos: Turno[]) {
  const grupos: Record<string, Turno[]> = {};
  for (const t of turnos) {
    if (!grupos[t.fecha]) grupos[t.fecha] = [];
    grupos[t.fecha].push(t);
  }
  return grupos;
}

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [inputPass, setInputPass] = useState('');
  const [passError, setPassError] = useState(false);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [cargando, setCargando] = useState(false);
  const [filtroFecha, setFiltroFecha] = useState(''); // "YYYY-MM-DD" o '' para todos
  const [busqueda, setBusqueda] = useState(''); // Filtro de búsqueda por nombre o teléfono
  const [turnoAEliminar, setTurnoAEliminar] = useState<string | null>(null);
  
  // Nueva pestaña activa: 'agenda' (lista de turnos y control) | 'finanzas' (calculadora y balances)
  const [pestanaActiva, setPestanaActiva] = useState<'agenda' | 'finanzas'>('agenda');
  
  // Modal de instrucción SQL en caso de que no tenga la columna
  const [mostrarModalSql, setMostrarModalSql] = useState(false);
  const [copiadoOk, setCopiadoOk] = useState(false);
  const [errorUpdateSql, setErrorUpdateSql] = useState(false);

  // Revisar si ya estaba autenticado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_auth');
      if (saved === ADMIN_PASSWORD) setAutenticado(true);
    }
  }, []);

  const cargarTurnos = useCallback(async () => {
    setCargando(true);
    let query = supabase
      .from('turns')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });

    if (filtroFecha) {
      query = query.eq('fecha', filtroFecha);
    }

    const { data, error } = await query;
    if (!error && data) setTurnos(data);
    setCargando(false);
  }, [filtroFecha]);

  useEffect(() => {
    if (autenticado) cargarTurnos();
  }, [autenticado, cargarTurnos]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (inputPass === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', ADMIN_PASSWORD);
      setAutenticado(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_auth');
    setAutenticado(false);
    setTurnos([]);
  }

  async function eliminarTurno(id: string) {
    const { error } = await supabase.from('turns').delete().eq('id', id);
    if (!error) {
      setTurnos(prev => prev.filter(t => t.id !== id));
    }
    setTurnoAEliminar(null);
  }

  // Modificar el estado del turno (Pendiente, Confirmado, Atendido, Cancelado)
  async function cambiarEstadoTurno(id: string, nuevoEstado: 'pendiente' | 'confirmado' | 'atendido' | 'cancelado') {
    // Actualización local optimista inmediata para que la interfaz vuele
    setTurnos(prev =>
      prev.map(t => (t.id === id ? { ...t, estado: nuevoEstado } : t))
    );

    // Intentar guardar en Supabase
    const { error } = await supabase
      .from('turns')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (error) {
      console.warn("La actualización falló. Es posible que falte la columna 'estado' en Supabase:", error);
      setErrorUpdateSql(true);
      // Ocultar alerta de error después de unos segundos
      setTimeout(() => setErrorUpdateSql(false), 8000);
    }
  }

  // Función para copiar código de migración SQL al portapapeles
  function copiarCodigoSql() {
    const sqlCode = `-- CÓDIGO DE ACTUALIZACIÓN TURNERA DEFINITIVA\n-- Copiar y ejecutar en Supabase > SQL Editor:\n\nALTER TABLE turns ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pendiente';\n\n-- Habilitar permisos de actualización (UPDATE)\nCREATE POLICY "Anyone can update turns" ON turns\n  FOR UPDATE USING (true) WITH CHECK (true);`;
    
    navigator.clipboard.writeText(sqlCode);
    setCopiadoOk(true);
    setTimeout(() => setCopiadoOk(false), 3000);
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--background)' }}>
        {/* Decoración premium de fondo */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.03] pointer-events-none" style={{ background: 'var(--primary)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.02] pointer-events-none" style={{ background: 'var(--secondary)' }} />

        <div className="w-full max-w-sm animate-fade-up relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block p-1 rounded-full border mb-4" style={{ borderColor: 'var(--border)', background: 'white' }}>
              <img src="/logo.png" alt="Lic. Yesica M. García" className="h-16 w-auto object-contain" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--secondary)' }}>
              Panel de Turnos
            </h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Área de administración y control
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-3xl border bg-white" style={{ borderColor: 'var(--border)', boxShadow: '0 12px 30px rgba(61,39,16,0.04)' }}>
            <div className="flex justify-center mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: 'var(--accent)', color: 'var(--secondary)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Acceso Administrador
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
                  Contraseña de acceso
                </label>
                <input
                  id="password-admin"
                  type="password"
                  value={inputPass}
                  onChange={e => { setInputPass(e.target.value); setPassError(false); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'white',
                    border: `1.5px solid ${passError ? '#e53e3e' : 'var(--border)'}`,
                    color: 'var(--foreground)',
                  }}
                />
              </div>

              {passError && (
                <p className="text-xs text-center font-semibold animate-fade-in" style={{ color: '#e53e3e' }}>
                  Contraseña incorrecta. Por favor, reintentá.
                </p>
              )}

              <button
                id="btn-login-admin"
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--secondary)',
                  boxShadow: '0 6px 20px rgba(225, 166, 90, 0.25)',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-hover)'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary)'}
              >
                Ingresar al Panel
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Filtrado de turnos cruzando fecha y motor de búsqueda
  const turnosFiltrados = turnos.filter(t => {
    const matchesFecha = !filtroFecha || t.fecha === filtroFecha;
    const matchesBusqueda = !busqueda.trim() || 
      t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.telefono.includes(busqueda);
    return matchesFecha && matchesBusqueda;
  });

  const hoy = new Date().toISOString().split('T')[0];
  const actualMes = new Date().getMonth(); // 0-11
  const actualAño = new Date().getFullYear();

  // Estadísticas básicas generales
  const turnosHoy = turnos.filter(t => t.fecha === hoy).length;
  const proximos = turnos.filter(t => t.fecha >= hoy).length;

  // Estadísticas financieras basadas ÚNICAMENTE en turnos marcados como 'atendido'
  const atendidos = turnos.filter(t => t.estado === 'atendido');
  const atendidosHoy = atendidos.filter(t => t.fecha === hoy);
  const atendidosMes = atendidos.filter(t => {
    const [y, m] = t.fecha.split('-').map(Number);
    return y === actualAño && (m - 1) === actualMes;
  });
  const atendidosAño = atendidos.filter(t => {
    const [y] = t.fecha.split('-').map(Number);
    return y === actualAño;
  });

  // Cálculo de montos ganados por períodos
  const gananciaHoy = atendidosHoy.reduce((sum, t) => sum + obtenerMontoTurno(t.tipo_consulta || ''), 0);
  const gananciaMes = atendidosMes.reduce((sum, t) => sum + obtenerMontoTurno(t.tipo_consulta || ''), 0);
  const gananciaAño = atendidosAño.reduce((sum, t) => sum + obtenerMontoTurno(t.tipo_consulta || ''), 0);

  // Clasificación por tipo de cobertura (Particular vs Obra Social) en el mes en curso
  const partMes = atendidosMes.filter(t => (t.tipo_consulta || '').toLowerCase().includes('particular'));
  const osMes = atendidosMes.filter(t => (t.tipo_consulta || '').toLowerCase().includes('obra social'));

  const gananciaPartMes = partMes.reduce((sum, t) => sum + obtenerMontoTurno(t.tipo_consulta || ''), 0);
  const gananciaOsMes = osMes.reduce((sum, t) => sum + obtenerMontoTurno(t.tipo_consulta || ''), 0);

  // Cantidad de bonos o tokens de obra social a presentar
  const bonosHoy = atendidosHoy.filter(t => (t.tipo_consulta || '').toLowerCase().includes('obra social')).length;
  const bonosMes = osMes.length;

  const grupos = agruparPorFecha(turnosFiltrados);
  const fechasOrdenadas = Object.keys(grupos).sort();

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--background)' }}>
      {/* Header Premium */}
      <header className="sticky top-0 z-20 px-4 md:px-8 py-3.5 border-b backdrop-blur-md"
        style={{ borderColor: 'var(--border)', background: 'rgba(252,251,249,0.94)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-0.5 rounded-full border bg-white flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
              <img src="/logo.png" alt="Logo" className="h-7.5 sm:h-9 w-auto object-contain" />
            </div>
            <div className="w-px h-6 bg-stone-200" />
            <div className="min-w-0">
              <h1 className="text-sm font-extrabold leading-none tracking-tight" style={{ color: 'var(--secondary)' }}>
                Panel de Turnos
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={cargarTurnos}
              disabled={cargando}
              title="Actualizar"
              className="p-2 rounded-xl border bg-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
              style={{ borderColor: 'var(--border)' }}
            >
              <svg className={cargando ? 'animate-spin-slow' : ''} width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="var(--secondary)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold border bg-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        {/* Banner de error o advertencia SQL */}
        {errorUpdateSql && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fade-in">
            <div>
              <p className="text-xs font-bold flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                ¿Aún no actualizaste Supabase?
              </p>
              <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                Los cambios de estado se ven en pantalla, pero para guardarse permanentemente en la base de datos debés agregar la columna <code className="bg-amber-100/60 px-1 py-0.5 rounded font-mono font-bold text-[10px]">estado</code>. Es muy simple.
              </p>
            </div>
            <button
              onClick={() => setMostrarModalSql(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-[10px] font-bold transition-all hover:bg-amber-700 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Habilitar en 1 Minuto
            </button>
          </div>
        )}

        {/* Stats Principales de Agenda */}
        <div className="grid grid-cols-3 gap-2.5 md:gap-4 mb-6">
          {[
            { 
              label: 'Total turnos', 
              value: turnos.length, 
              color: 'var(--primary)',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              )
            },
            { 
              label: 'Atendidos Hoy', 
              value: atendidosHoy.length, 
              color: '#319795',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#319795" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              )
            },
            { 
              label: 'Próximos', 
              value: proximos, 
              color: '#2b6cb0',
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              )
            },
          ].map((stat, i) => (
            <div key={i} className="p-2.5 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center animate-fade-up border-y border-r relative overflow-hidden bg-white"
              style={{
                borderColor: 'var(--border)',
                boxShadow: '0 4px 16px rgba(61,39,16,0.02)',
                animationDelay: `${i * 0.06}s`,
              }}>
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: stat.color }} />
              
              <div className="p-1.5 sm:p-2 rounded-full mb-1" style={{ background: 'var(--accent)' }}>
                {stat.icon}
              </div>
              <div className="text-base sm:text-2xl md:text-3xl font-extrabold leading-none tracking-tight" style={{ color: 'var(--secondary)' }}>
                {stat.value}
              </div>
              <div className="text-[7.5px] sm:text-[9px] font-bold uppercase tracking-widest mt-1 leading-tight truncate w-full" style={{ color: 'var(--muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Selector - Boutique Minimal */}
        <div className="flex p-1 rounded-2xl border mb-6 bg-white" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setPestanaActiva('agenda')}
            className="flex-1 py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer min-w-0"
            style={{
              background: pestanaActiva === 'agenda' ? 'var(--secondary)' : 'transparent',
              color: pestanaActiva === 'agenda' ? 'white' : 'var(--foreground)',
            }}
          >
            <svg className="flex-shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="truncate">
              <span className="hidden xs:inline">Agenda y Control</span>
              <span className="xs:hidden">Agenda</span>
            </span>
          </button>
          <button
            onClick={() => setPestanaActiva('finanzas')}
            className="flex-1 py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer min-w-0"
            style={{
              background: pestanaActiva === 'finanzas' ? 'var(--secondary)' : 'transparent',
              color: pestanaActiva === 'finanzas' ? 'white' : 'var(--foreground)',
            }}
          >
            <svg className="flex-shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span className="truncate">
              <span className="hidden xs:inline">Rendimiento y Caja</span>
              <span className="xs:hidden">Caja</span>
            </span>
          </button>
        </div>

        {/* CONTENIDO DE PESTAÑA: AGENDA */}
        {pestanaActiva === 'agenda' && (
          <div className="space-y-6">
            {/* Barra de Búsqueda y Filtros */}
            <div className="p-4 rounded-2xl border bg-white space-y-3" style={{ borderColor: 'var(--border)', boxShadow: '0 4px 16px rgba(61,39,16,0.02)' }}>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                Filtros y Búsqueda de Pacientes
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Buscador de texto */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar paciente por nombre o teléfono..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl text-xs outline-none transition-all duration-200"
                    style={{
                      background: 'var(--background)',
                      border: '1.5px solid var(--border)',
                      color: 'var(--foreground)',
                    }}
                  />
                  <svg className="absolute left-3 top-2.5 text-muted" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  {busqueda && (
                    <button
                      onClick={() => setBusqueda('')}
                      className="absolute right-2.5 top-2.5 text-muted hover:text-secondary transition-colors"
                      title="Limpiar búsqueda"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Selector de fecha */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:flex-initial">
                    <input
                      type="date"
                      value={filtroFecha}
                      onChange={e => setFiltroFecha(e.target.value)}
                      className="w-full sm:w-auto pl-3 pr-2 py-2 rounded-xl text-xs outline-none transition-all duration-200"
                      style={{
                        background: 'var(--background)',
                        border: '1.5px solid var(--border)',
                        color: 'var(--foreground)',
                      }}
                    />
                  </div>
                  
                  {(filtroFecha || busqueda) && (
                    <button
                      onClick={() => { setFiltroFecha(''); setBusqueda(''); }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all hover:bg-black/5 cursor-pointer whitespace-nowrap"
                      style={{ borderColor: 'var(--border)', color: 'var(--muted)', background: 'var(--background)' }}
                    >
                      Limpiar Filtros
                    </button>
                  )}
                </div>
              </div>

              <div className="text-[10px] font-semibold text-muted flex items-center justify-between pt-1 border-t" style={{ borderColor: 'rgba(61,39,16,0.04)' }}>
                <span>Mostrando {turnosFiltrados.length} turno{turnosFiltrados.length !== 1 ? 's' : ''}</span>
                {cargando && <span className="animate-pulse">Cargando base...</span>}
              </div>
            </div>

            {/* Lista agrupada */}
            {cargando ? (
              <div className="text-center py-20 bg-white rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
                <svg className="animate-spin-slow mx-auto mb-4" width="28" height="28" viewBox="0 0 24 24"
                  fill="none" stroke="var(--secondary)" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                </svg>
                <p className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Actualizando agenda en tiempo real...</p>
              </div>
            ) : turnosFiltrados.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border" style={{ borderColor: 'var(--border)', boxShadow: '0 4px 16px rgba(61,39,16,0.02)' }}>
                <div className="text-4xl mb-3">🗓️</div>
                <p className="font-bold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>No se encontraron turnos</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {filtroFecha || busqueda 
                    ? 'No hay registros que coincidan con la búsqueda o fecha elegida.' 
                    : 'Aún no tenés turnos programados en el sistema.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-up">
                {fechasOrdenadas.map(fecha => (
                  <div key={fecha} className="space-y-2.5">
                    {/* Cabecera de fecha */}
                    <div className="flex items-center gap-3">
                      <div className="px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
                        style={{
                          background: fecha === hoy ? 'var(--secondary)' : 'var(--accent)',
                          color: fecha === hoy ? 'white' : 'var(--foreground)',
                          border: fecha === hoy ? 'none' : '1px solid var(--border)',
                        }}>
                        {fecha === hoy ? (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            Hoy
                          </>
                        ) : formatFecha(fecha)}
                      </div>
                      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted flex-shrink-0">
                        {grupos[fecha].length} turno{grupos[fecha].length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Tarjetas de turnos */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {grupos[fecha].map((turno, idx) => {
                        const rawTipo = turno.tipo_consulta || 'Consulta Nutricional';
                        const esObraSocial = rawTipo.includes('Obra Social');
                        const esParticular = rawTipo.includes('Particular');
                        const displayTipo = rawTipo.replace(' - Particular', '').replace(' - Obra Social', '');
                        const subLabel = displayTipo.includes('(') ? displayTipo.replace(/.*?\((.*?)\)/g, '$1') : 'Consulta';

                        const estadoActual = turno.estado || 'pendiente';

                        return (
                          <div
                            key={turno.id}
                            className="p-4 rounded-2xl border bg-white group flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 transition-all duration-200 hover:shadow-md"
                            style={{
                              borderColor: 'var(--border)',
                              animationDelay: `${idx * 0.04}s`,
                            }}
                          >
                            {/* Lado Izquierdo: Info de Turno */}
                            <div className="flex items-start gap-3.5 min-w-0 flex-1">
                              {/* Hora */}
                              <div className="w-12 text-center flex-shrink-0">
                                <div className="text-sm md:text-base font-extrabold leading-none" style={{ color: 'var(--primary)' }}>
                                  {formatHora(turno.hora)}
                                </div>
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase px-1 rounded tracking-wide bg-accent mt-1.5 inline-block" style={{ color: 'var(--muted)' }}>
                                  hs
                                </span>
                              </div>

                              {/* Separador vertical */}
                              <div className="w-px h-12 bg-stone-200 flex-shrink-0" />

                              {/* Datos del paciente */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                  <p className="font-extrabold text-sm md:text-base leading-tight truncate" style={{ color: 'var(--foreground)' }}>
                                    {turno.nombre}
                                  </p>
                                  <span className="text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0"
                                    style={{
                                      background: displayTipo.toLowerCase().includes('antropometría') || displayTipo.toLowerCase().includes('combo')
                                        ? 'rgba(225,166,90,0.12)' 
                                        : 'var(--accent)',
                                      color: 'var(--secondary)'
                                    }}>
                                    {subLabel}
                                  </span>
                                  {esParticular && (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider flex-shrink-0"
                                      style={{ background: 'rgba(225,166,90,0.06)', color: 'var(--secondary)', borderColor: 'rgba(225,166,90,0.15)' }}>
                                      Particular
                                    </span>
                                  )}
                                  {esObraSocial && (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider flex-shrink-0"
                                      style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}>
                                      Obra Social
                                    </span>
                                  )}
                                  
                                  {/* Estado Actual Badge */}
                                  {estadoActual === 'confirmado' && (
                                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                                      <span className="h-1 w-1 rounded-full bg-blue-600 animate-pulse" />
                                      Confirmado
                                    </span>
                                  )}
                                  {estadoActual === 'atendido' && (
                                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                                      ✓ Atendido 🎉
                                    </span>
                                  )}
                                  {estadoActual === 'cancelado' && (
                                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100 uppercase tracking-wider flex-shrink-0">
                                      Cancelado
                                    </span>
                                  )}
                                </div>
                                
                                {/* Tipo de consulta detalle completo */}
                                <div className="text-xs font-medium text-muted truncate max-w-[280px] md:max-w-md mb-2">
                                  {displayTipo}
                                </div>

                                <div className="flex items-center gap-2">
                                  <a
                                    href={`https://wa.me/${turno.telefono.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-xl border transition-all font-bold"
                                    style={{ color: '#16a34a', borderColor: '#bbf7d0', background: '#f0fdf4' }}
                                    onMouseEnter={e => {
                                      (e.currentTarget as HTMLAnchorElement).style.background = '#e8fbe9';
                                    }}
                                    onMouseLeave={e => {
                                      (e.currentTarget as HTMLAnchorElement).style.background = '#f0fdf4';
                                    }}
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    WhatsApp
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* Separador de fila para mobile */}
                            <div className="h-px bg-stone-100 md:hidden w-full" />

                            {/* Fila Inferior / Lado Derecho: Controles de Acciones y Estados */}
                            <div className="flex flex-row md:flex-col items-center justify-between md:justify-end gap-3 md:gap-2.5 pt-1 md:pt-0 w-full md:w-auto">
                              {/* Botones de Cambio de Estado */}
                              <div className="flex items-center gap-1.5">
                                {estadoActual === 'pendiente' && (
                                  <>
                                    <button
                                      onClick={() => cambiarEstadoTurno(turno.id, 'confirmado')}
                                      className="px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 cursor-pointer transition-colors active:scale-95"
                                      title="Aceptar y confirmar turno"
                                    >
                                      ✓ Aceptar
                                    </button>
                                    <button
                                      onClick={() => cambiarEstadoTurno(turno.id, 'atendido')}
                                      className="px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 cursor-pointer transition-colors active:scale-95"
                                      title="Marcar como atendido y sumar a ganancias"
                                    >
                                      ✓ Atendido
                                    </button>
                                  </>
                                )}

                                {estadoActual === 'confirmado' && (
                                  <>
                                    <button
                                      onClick={() => cambiarEstadoTurno(turno.id, 'atendido')}
                                      className="px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer transition-colors active:scale-95"
                                      title="Marcar como atendido y sumar a ganancias"
                                    >
                                      ✓ Completar Sesión
                                    </button>
                                    <button
                                      onClick={() => cambiarEstadoTurno(turno.id, 'pendiente')}
                                      className="px-2 py-1 rounded text-[9px] font-bold text-muted hover:bg-black/5 cursor-pointer"
                                      title="Volver a pendiente"
                                    >
                                      Revertir
                                    </button>
                                  </>
                                )}

                                {estadoActual === 'atendido' && (
                                  <>
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1">
                                      <span>+ ${obtenerMontoTurno(turno.tipo_consulta || '').toLocaleString('es-AR')}</span>
                                      <span className="text-[7px] opacity-75">ARS</span>
                                    </span>
                                    <button
                                      onClick={() => cambiarEstadoTurno(turno.id, 'pendiente')}
                                      className="text-[9px] font-bold text-muted hover:text-foreground cursor-pointer px-1.5 py-0.5"
                                      title="Desmarcar como atendido"
                                    >
                                      Revertir
                                    </button>
                                  </>
                                )}
                              </div>

                              {/* Borrado clásico y tiempo relativo */}
                              <div className="flex items-center gap-2.5">
                                <span className="text-[10px] text-muted whitespace-nowrap sm:self-end">
                                  {tiempoRelativo(turno.created_at)}
                                </span>
                                <div className="w-px h-3.5 bg-stone-200 hidden md:block" />
                                <button
                                  onClick={() => setTurnoAEliminar(turno.id)}
                                  title="Eliminar turno de la agenda"
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer transition-all border border-transparent hover:border-red-100 flex items-center justify-center active:scale-95"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONTENIDO DE PESTAÑA: RENDIMIENTO Y FINANZAS */}
        {pestanaActiva === 'finanzas' && (
          <div className="space-y-6 animate-fade-up">
            {/* Aviso explicativo */}
            <div className="p-4.5 rounded-2xl border bg-emerald-50/50 border-emerald-100 text-emerald-950 text-xs leading-relaxed flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="font-bold mb-0.5">¿Cómo se calculan los montos?</p>
                <p className="opacity-90">
                  Las ganancias se calculan automáticamente basándose **únicamente en los turnos marcados con el estado "Atendido"**. De esta forma, el sistema solo cuenta el dinero real de las personas que efectivamente asistieron al consultorio en los diferentes períodos.
                </p>
              </div>
            </div>

            {/* Bloques de Rendimiento Financiero por Período */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bloque Hoy */}
              <div className="p-5 rounded-3xl border bg-white relative overflow-hidden" style={{ borderColor: 'var(--border)', boxShadow: '0 4px 20px rgba(61,39,16,0.03)' }}>
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Rendimiento Hoy</span>
                <div className="text-2xl md:text-3xl font-black mt-3 mb-1 text-emerald-600">
                  $ {gananciaHoy.toLocaleString('es-AR')}
                </div>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center justify-between">
                  <span>Pacientes Atendidos:</span>
                  <span className="font-extrabold text-secondary">{atendidosHoy.length}</span>
                </p>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center justify-between mt-1">
                  <span>Bonos OS a cobrar:</span>
                  <span className="font-extrabold text-secondary">{bonosHoy}</span>
                </p>
              </div>

              {/* Bloque Mes */}
              <div className="p-5 rounded-3xl border bg-white relative overflow-hidden" style={{ borderColor: 'var(--border)', boxShadow: '0 4px 20px rgba(61,39,16,0.03)' }}>
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">Mes en Curso</span>
                <div className="text-2xl md:text-3xl font-black mt-3 mb-1 text-blue-600">
                  $ {gananciaMes.toLocaleString('es-AR')}
                </div>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center justify-between">
                  <span>Pacientes Atendidos:</span>
                  <span className="font-extrabold text-secondary">{atendidosMes.length}</span>
                </p>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center justify-between mt-1">
                  <span>Bonos OS a cobrar:</span>
                  <span className="font-extrabold text-secondary">{bonosMes}</span>
                </p>
              </div>

              {/* Bloque Año */}
              <div className="p-5 rounded-3xl border bg-white relative overflow-hidden" style={{ borderColor: 'var(--border)', boxShadow: '0 4px 20px rgba(61,39,16,0.03)' }}>
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800">Acumulado Anual</span>
                <div className="text-2xl md:text-3xl font-black mt-3 mb-1 text-amber-700">
                  $ {gananciaAño.toLocaleString('es-AR')}
                </div>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center justify-between">
                  <span>Pacientes Atendidos:</span>
                  <span className="font-extrabold text-secondary">{atendidosAño.length}</span>
                </p>
              </div>
            </div>

            {/* Análisis y Desglose por Cobertura en el Mes */}
            <div className="p-6 rounded-3xl border bg-white" style={{ borderColor: 'var(--border)', boxShadow: '0 4px 20px rgba(61,39,16,0.02)' }}>
              <h3 className="text-sm font-extrabold uppercase tracking-wider mb-4" style={{ color: 'var(--secondary)' }}>
                Desglose Detallado del Mes ({MESES[actualMes]} {actualAño})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Desglose Particular */}
                <div className="p-4 rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-2 w-2 rounded-full" style={{ background: 'var(--primary)' }} />
                    <span className="text-xs font-bold text-foreground">Pacientes Particulares</span>
                  </div>
                  <div className="text-xl font-black mb-1" style={{ color: 'var(--secondary)' }}>
                    $ {gananciaPartMes.toLocaleString('es-AR')} ARS
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Facturado de forma privada y directa. Representa a **{partMes.length} pacientes** atendidos.
                  </p>
                </div>

                {/* Desglose Obra Social */}
                <div className="p-4 rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-foreground">Pacientes con Obra Social</span>
                  </div>
                  <div className="text-xl font-black mb-1" style={{ color: 'var(--secondary)' }}>
                    $ {gananciaOsMes.toLocaleString('es-AR')} ARS
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed mb-2">
                    Ingreso recaudado en concepto de co-pagos directos (por Antropometría/Combos). Representa a **{osMes.length} pacientes** atendidos.
                  </p>
                  
                  {/* Caja de Bonos OS */}
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs text-emerald-950 font-bold">
                    <span>Bonos/Tokens a reclamar a las Obras Sociales:</span>
                    <span className="px-2 py-1 rounded bg-white border text-emerald-700 text-xs font-black shadow-sm">
                      {bonosMes} bonos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Listado de Servicios Atendidos este mes para control */}
            <div className="p-6 rounded-3xl border bg-white" style={{ borderColor: 'var(--border)', boxShadow: '0 4px 20px rgba(61,39,16,0.02)' }}>
              <h3 className="text-sm font-extrabold uppercase tracking-wider mb-3" style={{ color: 'var(--secondary)' }}>
                Auditoría de Sesiones del Mes
              </h3>
              
              {atendidosMes.length === 0 ? (
                <p className="text-xs text-muted text-center py-4">Aún no hay pacientes marcados como "Atendido" en este mes.</p>
              ) : (
                <div className="divide-y text-xs" style={{ borderColor: 'var(--border)' }}>
                  {atendidosMes.map((turno, i) => (
                    <div key={turno.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <p className="font-bold" style={{ color: 'var(--foreground)' }}>{turno.nombre}</p>
                        <p className="text-[10px] text-muted mt-0.5">{formatFecha(turno.fecha)} a las {formatHora(turno.hora)} hs</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black" style={{ color: 'var(--secondary)' }}>
                          $ {obtenerMontoTurno(turno.tipo_consulta || '').toLocaleString('es-AR')}
                        </span>
                        <p className="text-[9px] text-muted uppercase font-bold mt-0.5">
                          {turno.tipo_consulta?.includes('Particular') ? 'Particular' : 'Bono + co-pago'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal confirmación Borrado Premium */}
      {turnoAEliminar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
          style={{ background: 'rgba(61,39,16,0.3)' }}
          onClick={() => setTurnoAEliminar(null)}
        >
          <div
            className="w-full max-w-sm p-6 md:p-8 rounded-3xl text-center animate-fade-up bg-white border"
            style={{ borderColor: 'var(--border)', boxShadow: '0 20px 50px rgba(61,39,16,0.1)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="inline-flex p-3 rounded-full bg-red-50 text-red-500 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              ¿Eliminar este turno?
            </h3>
            <p className="text-xs mb-6 leading-relaxed" style={{ color: 'var(--muted)' }}>
              Esta acción no se puede deshacer y liberará este horario en la agenda de reservas inmediatamente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setTurnoAEliminar(null)}
                className="flex-1 py-3 rounded-xl font-bold text-xs border bg-white transition-all hover:bg-black/5 cursor-pointer"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminarTurno(turnoAEliminar)}
                className="flex-1 py-3 rounded-xl font-bold text-xs text-white transition-all hover:scale-102 active:scale-98 cursor-pointer"
                style={{ background: '#e53e3e', boxShadow: '0 4px 12px rgba(229,62,62,0.2)' }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configuración SQL - Muy simple de copiar */}
      {mostrarModalSql && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
          style={{ background: 'rgba(61,39,16,0.3)' }}
          onClick={() => setMostrarModalSql(false)}
        >
          <div
            className="w-full max-w-lg p-6 md:p-8 rounded-3xl animate-fade-up bg-white border flex flex-col max-h-[90vh]"
            style={{ borderColor: 'var(--border)', boxShadow: '0 20px 50px rgba(61,39,16,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛠️</span>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-secondary leading-none">
                    Configuración de Base de Datos
                  </h3>
                  <p className="text-[10px] text-muted mt-1 uppercase font-bold tracking-wider">
                    Copiar y pegar en Supabase
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMostrarModalSql(false)}
                className="text-muted hover:text-secondary p-1 rounded hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs leading-relaxed text-foreground pr-1">
              <p>
                Para habilitar las funciones de **control de estados (Aceptar/Confirmar/Atendido)** y que se guarden permanentemente en la nube, debés ingresar al panel de control de Supabase y correr este pequeño script de SQL.
              </p>
              
              <div className="space-y-1.5">
                <p className="font-bold flex items-center gap-1">
                  <span>1.</span>
                  Ingresá a tu cuenta de Supabase, elegí este proyecto y hacé clic en **SQL Editor**.
                </p>
                <p className="font-bold flex items-center gap-1">
                  <span>2.</span>
                  Creá una nueva consulta (**New Query**), pegá el código de abajo y presioná **Run**.
                </p>
              </div>

              {/* Caja de Código SQL */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-200">
                <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center justify-between text-[10px] font-bold text-amber-800">
                  <span>MIGRATION_TURNS.sql</span>
                  <button
                    onClick={copiarCodigoSql}
                    className="px-2.5 py-1 rounded bg-white border border-amber-200 hover:bg-amber-100 transition-colors font-bold text-[9px] cursor-pointer"
                  >
                    {copiadoOk ? '¡Copiado! ✓' : 'Copiar Código'}
                  </button>
                </div>
                <pre className="bg-stone-900 text-stone-200 p-4 font-mono text-[10px] overflow-x-auto whitespace-pre leading-relaxed select-all">
{`ALTER TABLE turns ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pendiente';

-- Habilitar permisos de actualización (UPDATE)
CREATE POLICY "Anyone can update turns" ON turns
  FOR UPDATE USING (true) WITH CHECK (true);`}
                </pre>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 text-amber-950 font-bold border border-amber-100 flex items-start gap-2">
                <span>⚠️</span>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  Nota: El sistema tiene un fallback de seguridad inteligente. Si aún no corriste esta consulta, **el panel igual te dejará cambiar los estados e interactuar con la calculadora en tiempo real en la pantalla actual**, aunque al recargar la página volverán al estado pendiente hasta que apliques el script en Supabase.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t mt-4">
              <button
                onClick={() => setMostrarModalSql(false)}
                className="w-full py-3 rounded-xl bg-secondary text-white text-xs font-bold transition-all hover:opacity-90 active:scale-98 cursor-pointer"
              >
                Cerrar Instrucciones
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
