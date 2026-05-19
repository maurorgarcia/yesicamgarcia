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
  const [turnoAEliminar, setTurnoAEliminar] = useState<string | null>(null);

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

  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
        <div className="w-full max-w-sm animate-fade-up">
          <div className="text-center mb-10">
            <img src="/logo.png" alt="Lic. Yesica M. García" className="mx-auto mb-4 h-16 w-auto object-contain" />
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--secondary)' }}>
              Panel de Turnos
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Ingresá la contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              id="password-admin"
              type="password"
              value={inputPass}
              onChange={e => { setInputPass(e.target.value); setPassError(false); }}
              placeholder="Contraseña"
              autoComplete="current-password"
              className="w-full px-5 py-4 rounded-2xl text-base outline-none transition-all duration-200"
              style={{
                background: 'white',
                border: `1.5px solid ${passError ? '#e53e3e' : 'var(--border)'}`,
                color: 'var(--foreground)',
              }}
            />
            {passError && (
              <p className="text-sm text-center animate-fade-in" style={{ color: '#e53e3e' }}>
                Contraseña incorrecta
              </p>
            )}
            <button
              id="btn-login-admin"
              type="submit"
              className="w-full py-4 rounded-2xl font-bold transition-all duration-300 cursor-pointer"
              style={{
                background: 'var(--primary)',
                color: 'var(--secondary)',
                boxShadow: '0 8px 24px rgba(225, 166, 90, 0.2)',
              }}
              onMouseEnter={e => (e.target as HTMLButtonElement).style.background = 'var(--primary-hover)'}
              onMouseLeave={e => (e.target as HTMLButtonElement).style.background = 'var(--primary)'}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const turnosFiltrados = filtroFecha
    ? turnos.filter(t => t.fecha === filtroFecha)
    : turnos;

  const hoy = new Date().toISOString().split('T')[0];
  const turnosHoy = turnos.filter(t => t.fecha === hoy).length;
  const proximos = turnos.filter(t => t.fecha >= hoy).length;

  const grupos = agruparPorFecha(turnosFiltrados);
  const fechasOrdenadas = Object.keys(grupos).sort();

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 px-4 md:px-8 py-4 border-b backdrop-blur-md"
        style={{ borderColor: 'var(--border)', background: 'rgba(252,251,249,0.92)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
            <div className="w-px h-6" style={{ background: 'var(--border)' }} />
            <div>
              <h1 className="text-sm font-bold leading-tight" style={{ color: 'var(--secondary)' }}>
                Panel de Turnos
              </h1>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
                Administración
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={cargarTurnos}
              disabled={cargando}
              title="Actualizar"
              className="p-2.5 rounded-xl transition-all duration-200 hover:opacity-70"
              style={{ background: 'var(--accent)', border: '1px solid var(--border)' }}
            >
              <svg className={cargando ? 'animate-spin-slow' : ''} width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="var(--secondary)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80"
              style={{ background: 'var(--accent)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total de turnos', value: turnos.length, icon: '📋' },
            { label: 'Hoy', value: turnosHoy, icon: '📅' },
            { label: 'Próximos', value: proximos, icon: '⏳' },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-2xl text-center animate-fade-up"
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 12px rgba(27,63,57,0.06)',
                animationDelay: `${i * 0.08}s`,
              }}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--secondary)' }}>{stat.value}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filtro por fecha */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="date"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
            style={{
              background: 'white',
              border: '1.5px solid var(--border)',
              color: 'var(--foreground)',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--secondary)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          {filtroFecha && (
            <button
              onClick={() => setFiltroFecha('')}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-70"
              style={{ background: 'var(--accent)', border: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              Ver todos
            </button>
          )}
          <span className="text-sm ml-auto" style={{ color: 'var(--muted)' }}>
            {turnosFiltrados.length} turno{turnosFiltrados.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Sin turnos */}
        {cargando ? (
          <div className="text-center py-20">
            <svg className="animate-spin-slow mx-auto mb-4" width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
            </svg>
            <p style={{ color: 'var(--muted)' }}>Cargando turnos...</p>
          </div>
        ) : turnosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🗓️</div>
            <p className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>No hay turnos</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {filtroFecha ? 'No hay turnos para la fecha seleccionada.' : 'Aún no se sacaron turnos.'}
            </p>
          </div>
        ) : (
          /* Grupos por fecha */
          <div className="space-y-8 animate-fade-up">
            {fechasOrdenadas.map(fecha => (
              <div key={fecha}>
                {/* Cabecera de fecha */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="px-4 py-1.5 rounded-full text-sm font-bold"
                    style={{
                      background: fecha === hoy ? 'var(--secondary)' : 'var(--accent)',
                      color: fecha === hoy ? 'white' : 'var(--foreground)',
                      border: fecha === hoy ? 'none' : '1px solid var(--border)',
                    }}>
                    {fecha === hoy ? '📅 Hoy' : formatFecha(fecha)}
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>
                    {grupos[fecha].length} turno{grupos[fecha].length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Tarjetas de turnos */}
                <div className="space-y-3">
                  {grupos[fecha].map((turno, idx) => (
                    <div
                      key={turno.id}
                      className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:shadow-md"
                      style={{
                        background: 'white',
                        border: '1px solid var(--border)',
                        animationDelay: `${idx * 0.04}s`,
                      }}
                    >
                      {/* Hora */}
                      <div className="w-16 text-center flex-shrink-0">
                        <div className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                          {formatHora(turno.hora)}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--muted)' }}>hs</div>
                      </div>

                      {/* Separador vertical */}
                      <div className="w-px h-12 flex-shrink-0" style={{ background: 'var(--border)' }} />

                      {/* Datos del paciente */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-bold text-base truncate" style={{ color: 'var(--foreground)' }}>
                            {turno.nombre}
                          </p>
                          <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                            style={{
                              background: turno.tipo_consulta?.toLowerCase().includes('antropometría') || turno.tipo_consulta?.toLowerCase().includes('combo')
                                ? 'rgba(225,166,90,0.15)' 
                                : 'var(--accent)',
                              color: 'var(--secondary)'
                            }}>
                            {turno.tipo_consulta ? (turno.tipo_consulta.includes('(') ? turno.tipo_consulta.replace(/.*?\((.*?)\)/g, '$1') : 'Consulta') : 'Consulta'}
                          </span>
                        </div>
                        
                        {/* Tipo de consulta detalle completo */}
                        <div className="text-xs font-semibold text-muted truncate max-w-[280px] md:max-w-md mb-2">
                          {turno.tipo_consulta || 'Consulta Nutricional'}
                        </div>

                        <a
                          href={`https://wa.me/${turno.telefono.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1.5 w-fit px-2.5 py-1.5 rounded-xl border transition-all font-bold"
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
                          WhatsApp: {turno.telefono}
                        </a>
                      </div>

                      {/* Tiempo relativo + acción */}
                      <div className="flex-shrink-0 text-right flex flex-col items-end gap-3">
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>
                          {tiempoRelativo(turno.created_at)}
                        </span>
                        <button
                          onClick={() => setTurnoAEliminar(turno.id)}
                          title="Eliminar turno"
                          className="p-1.5 rounded-lg transition-all hover:opacity-70"
                          style={{ color: '#e53e3e' }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal confirmación */}
      {turnoAEliminar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setTurnoAEliminar(null)}
        >
          <div
            className="w-full max-w-sm p-8 rounded-3xl text-center animate-fade-up"
            style={{ background: 'white' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              ¿Eliminar turno?
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setTurnoAEliminar(null)}
                className="flex-1 py-3 rounded-2xl font-semibold transition-all hover:opacity-70"
                style={{ background: 'var(--accent)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminarTurno(turnoAEliminar)}
                className="flex-1 py-3 rounded-2xl font-semibold text-white transition-all hover:opacity-80"
                style={{ background: '#e53e3e' }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
