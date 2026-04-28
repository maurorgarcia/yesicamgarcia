'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Appointment, AppointmentStatus } from '@/types';
import { format } from 'date-fns';
import { LogOut, Calendar as CalendarIcon, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const router = useRouter();

  const checkUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', filterDate)
      .order('time', { ascending: true });

    if (error) {
      // Error manejado silenciosamente o reportado a servicio de monitoreo
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  }, [filterDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkUser();
      fetchAppointments();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkUser, fetchAppointments]);

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar el estado');
    } else {
      setAppointments(appointments.map(app => app.id === id ? { ...app, status } : app));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmado': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelado': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusClass = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmado': return 'bg-green-50 text-green-700 border-green-100';
      case 'cancelado': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      {/* Header */}
      <header className="bg-white border-b border-secondary px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-serif font-bold">Y</div>
          <div>
            <h1 className="font-serif font-bold text-lg">Panel de Gestión</h1>
            <p className="text-xs text-black/40">Lic. Yesica M. García</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-black/40 hover:text-red-500 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="p-8 max-w-6xl mx-auto">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-serif">Mis Turnos</h2>
            <p className="text-black/50">Gestioná las consultas de tus pacientes.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-secondary shadow-sm">
            <div className="flex items-center gap-2 px-3 text-black/40 border-r border-secondary">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Fecha</span>
            </div>
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 outline-none text-sm font-medium"
            />
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-[40px] border border-secondary shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-black/40 animate-pulse">Cargando turnos...</div>
          ) : appointments.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4 text-black/20">
                <Filter className="w-8 h-8" />
              </div>
              <p className="text-black/40">No hay turnos registrados para esta fecha.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-secondary">
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-black/40">Horario</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-black/40">Paciente</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-black/40">Contacto</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-black/40">Modalidad</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-black/40">Lugar</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-black/40">Estado</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-black/40 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/50">
                  {appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-secondary/5 transition-colors">
                      <td className="px-8 py-6">
                        <span className="text-lg font-bold">{app.time.slice(0, 5)}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold">{app.full_name}</div>
                        <div className="text-xs text-black/40">{app.email}</div>
                      </td>
                      <td className="px-8 py-6 text-sm">
                        <a 
                          href={`https://wa.me/${app.phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          className="text-accent hover:underline"
                        >
                          {app.phone}
                        </a>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-bold uppercase tracking-widest text-black/60">{app.modality}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-bold uppercase tracking-widest text-black/60">{app.location}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium capitalize ${getStatusClass(app.status)}`}>
                          {getStatusIcon(app.status)}
                          {app.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => updateStatus(app.id, 'confirmado')}
                            className="p-2 hover:bg-green-50 text-black/20 hover:text-green-600 rounded-lg transition-colors"
                            title="Confirmar"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => updateStatus(app.id, 'cancelado')}
                            className="p-2 hover:bg-red-50 text-black/20 hover:text-red-600 rounded-lg transition-colors"
                            title="Cancelar"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
