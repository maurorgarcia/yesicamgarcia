'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Appointment, AppointmentStatus } from '@/types';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths, addMonths, isSameMonth, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import { 
  LogOut, 
  Calendar as CalendarIcon, 
  Users, 
  CreditCard, 
  Settings, 
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  ChevronRight,
  CheckCircle,
  XCircle,
  Menu,
  X,
  Search,
  Plus,
  Mail,
  Phone,
  ArrowUpRight,
  UserCheck,
  MessageCircle,
  ExternalLink,
  History,
  User,
  Apple,
  Clock,
  Ruler,
  FileText,
  Loader2,
  List,
  FileIcon,
  Upload,
  ChevronLeft,
  Trash2,
  ImageIcon,
  Carrot,
  Salad,
  Utensils,
  Scale,
  Activity,
  Dumbbell,
  Droplets,
  HeartPulse,
  Stethoscope,
  ClipboardList,
  Leaf,
  Flame,
  Baby,
  Info,
  Coffee,
  Moon,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

type DashboardSection = 'overview' | 'agenda' | 'pacientes' | 'pagos' | 'ajustes';

interface DayAvailability {
  day: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

const defaultAvailability: DayAvailability[] = [
  { day: 'Lunes', isActive: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Martes', isActive: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Miércoles', isActive: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Jueves', isActive: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Viernes', isActive: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Sábado', isActive: false, startTime: '10:00', endTime: '14:00' },
  { day: 'Domingo', isActive: false, startTime: '10:00', endTime: '14:00' },
];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [agendaStatusFilter, setAgendaStatusFilter] = useState<AppointmentStatus | 'todos'>('todos');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic Services State (Now synced with Supabase)
  const [services, setServices] = useState<any[]>([]);
  const [editingService, setEditingService] = useState<any>(null);
  const [ajustesTab, setAjustesTab] = useState<'servicios' | 'perfil' | 'disponibilidad'>('servicios');
  
  // Disponibilidad State
  const [disponibilidad, setDisponibilidad] = useState<DayAvailability[]>(defaultAvailability);
  const [isMounted, setIsMounted] = useState(false);

  const handleToggleDay = (dayName: string) => {
    setDisponibilidad(prev => prev.map(d => 
      d.day === dayName ? { ...d, isActive: !d.isActive } : d
    ));
  };

  const handleTimeChange = (dayName: string, field: 'startTime' | 'endTime', value: string) => {
    setDisponibilidad(prev => prev.map(d => 
      d.day === dayName ? { ...d, [field]: value } : d
    ));
  };
  const getPriceForAppointment = (modality: string) => {
    const service = services.find(s => modality.toLowerCase().includes(s.id.toLowerCase()) || modality.toLowerCase().includes(s.name.toLowerCase()));
    return service ? Number(service.price) : 40000;
  };

  const router = useRouter();

  const checkUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchServices = useCallback(async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('price', { ascending: true });
    
    if (!error && data) {
      setServices(data);
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: false })
      .order('time', { ascending: true });

    if (!error) {
      setAppointments(data || []);
    }
    setLoading(false);
  }, []);

  const fetchAvailability = useCallback(async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'availability')
      .single();
    
    if (!error && data) {
      setDisponibilidad(data.value);
    }
  }, []);

  useEffect(() => {
    checkUser();
    fetchServices();
    fetchAppointments();
    fetchAvailability();
    setIsMounted(true);
  }, [checkUser, fetchServices, fetchAppointments, fetchAvailability]);

  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientModalTab, setPatientModalTab] = useState('perfil');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // DERIVED DATA
  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    
    const startOfLastMonth = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const endOfLastMonth = endOfMonth(startOfLastMonth);
    
    const todayCount = appointments.filter(a => a.date === today).length;
    
    const confirmedAppointments = appointments.filter(a => a.status === 'confirmado');
    const paidAppointments = appointments.filter(a => a.is_paid);
    
    const totalProjected = confirmedAppointments.reduce((acc, a) => acc + getPriceForAppointment(a.modality), 0);
    const totalPaid = paidAppointments.reduce((acc, a) => acc + getPriceForAppointment(a.modality), 0);
    
    const revenueThisMonth = appointments
      .filter(a => a.status === 'confirmado' && new Date(a.date) >= startOfThisMonth)
      .reduce((acc, a) => acc + getPriceForAppointment(a.modality), 0);

    const paidThisMonth = appointments
      .filter(a => a.is_paid && new Date(a.date) >= startOfThisMonth)
      .reduce((acc, a) => acc + getPriceForAppointment(a.modality), 0);

    const revenueLastMonth = appointments
      .filter(a => a.status === 'confirmado' && isWithinInterval(new Date(a.date), { start: startOfLastMonth, end: endOfLastMonth }))
      .reduce((acc, a) => acc + getPriceForAppointment(a.modality), 0);

    const revenueGrowth = revenueLastMonth > 0 
      ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100) 
      : 0;
    
    const uniqueEmails = Array.from(new Set(appointments.map(a => a.email)));
    
    const newPatientsThisMonth = uniqueEmails.filter(email => {
      const patientAppointments = appointments.filter(a => a.email === email).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return patientAppointments.length > 0 && new Date(patientAppointments[0].date) >= startOfThisMonth;
    }).length;

    const confirmedRatio = appointments.length > 0 ? (confirmedAppointments.length / appointments.length) : 0;
    
    return {
      today: todayCount,
      patients: uniqueEmails.length,
      newPatientsThisMonth,
      revenue: totalPaid.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
      projected: totalProjected.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }),
      revenueGrowth,
      efficiency: Math.round(confirmedRatio * 100),
      isGrowing: revenueGrowth >= 0
    };
  }, [appointments, services]);

  const chartData = useMemo(() => {
    // Generate last 7 days of revenue data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return format(d, 'yyyy-MM-dd');
    });

    return last7Days.map(day => {
      const dailyRevenue = appointments
        .filter(a => a.date === day && a.status === 'confirmado')
        .reduce((acc, a) => acc + getPriceForAppointment(a.modality), 0);
      
      return {
        date: format(new Date(day + 'T12:00:00'), 'dd/MM'),
        monto: dailyRevenue
      };
    });
  }, [appointments, services]);

  const handleUpdateService = async (id: string, updates: any) => {
    const { error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setServices(services.map(s => s.id === id ? { ...s, ...updates } : s));
      setEditingService(null);
    } else {
      alert('Error al actualizar el servicio');
    }
  };

  const sendWhatsApp = (phone: string, name: string, time?: string, date?: string) => {
    let message = `Hola ${name}, te contacto desde el consultorio de la Lic. Yesica García. ¿Cómo estás?`;
    
    if (time && date && date !== 'hoy' && date !== 'consulta') {
      try {
        message = `Hola ${name}, te recuerdo tu turno el día ${format(new Date(date + 'T12:00:00'), 'dd/MM')} a las ${time.slice(0, 5)}hs con la Lic. Yesica García. ¡Te esperamos!`;
      } catch (e) {
        console.error("Error formatting date", e);
      }
    }
    
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const uniquePatients = useMemo(() => {
    const patientsMap = new Map();
    appointments.forEach(app => {
      if (!patientsMap.has(app.email)) {
        patientsMap.set(app.email, {
          name: app.full_name,
          email: app.email,
          phone: app.phone,
          lastVisit: app.date,
          totalVisits: 1,
          location: app.location
        });
      } else {
        const p = patientsMap.get(app.email);
        p.totalVisits += 1;
        if (new Date(app.date) > new Date(p.lastVisit)) p.lastVisit = app.date;
      }
    });
    return Array.from(patientsMap.values()).filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [appointments, searchQuery]);

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
  const togglePayment = async (id: string, currentPaid: boolean) => {
    const { error } = await supabase
      .from('appointments')
      .update({ is_paid: !currentPaid, payment_method: !currentPaid ? 'Efectivo' : null })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar el pago');
    } else {
      setAppointments(appointments.map(app => app.id === id ? { ...app, is_paid: !currentPaid } : app));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPatient) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${selectedPatient.id}-${Math.random()}.${fileExt}`;
    const filePath = `patient-${selectedPatient.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('patient-files')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error al subir el archivo. Verificá que el bucket "patient-files" exista en Supabase.');
      setLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('patient-files')
      .getPublicUrl(filePath);

    const newFile = {
      name: file.name,
      type: file.type.split('/')[1].toUpperCase(),
      date: format(new Date(), 'dd/MM/yyyy'),
      url: publicUrl,
      path: filePath
    };

    const updatedFiles = [...(selectedPatient.files || []), newFile];
    setSelectedPatient({ ...selectedPatient, files: updatedFiles });
    
    // Auto-save to DB
    await supabase
      .from('patients')
      .update({ files: updatedFiles })
      .eq('email', selectedPatient.email);

    setLoading(false);
  };

  const handleDeleteFile = async (fileToDelete: any) => {
    if (!selectedPatient || !confirm('¿Estás seguro de eliminar este archivo?')) return;

    setLoading(true);
    
    // 1. Delete from Storage (if path exists)
    if (fileToDelete.path) {
      await supabase.storage
        .from('patient-files')
        .remove([fileToDelete.path]);
    }

    // 2. Update DB
    const updatedFiles = (selectedPatient.files || []).filter((f: any) => f.url !== fileToDelete.url);
    setSelectedPatient({ ...selectedPatient, files: updatedFiles });

    await supabase
      .from('patients')
      .update({ files: updatedFiles })
      .eq('email', selectedPatient.email);

    setLoading(false);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setLoading(true);
    const { error } = await supabase
      .from('services')
      .upsert({
        id: editingService.id || undefined,
        name: editingService.name,
        price: Number(editingService.price),
        duration: editingService.duration,
        icon_name: editingService.icon_name || 'Apple'
      });

    if (error) {
      alert('Error al guardar el servicio');
    } else {
      setEditingService(null);
      fetchServices();
    }
    setLoading(false);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error al eliminar el servicio');
    } else {
      fetchServices();
    }
    setLoading(false);
  };

  const handleSaveAvailability = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'availability',
        value: disponibilidad
      }, { onConflict: 'key' });

    if (error) {
      alert('Error al guardar la disponibilidad: ' + error.message);
    } else {
      alert('Disponibilidad guardada correctamente');
    }
    setLoading(false);
  };

  const openPatientFile = async (patient: any) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('email', patient.email)
      .single();

    if (!error && data) {
      setSelectedPatient(data);
    } else {
      // If doesn't exist, create a draft matching SQL columns
      setSelectedPatient({
        email: patient.email,
        full_name: patient.name,
        phone: patient.phone,
        medical_data: { diseases: {}, med_supp_text: "", family_history: {} },
        nutritional_evaluation: { hydration: "", sleep: "", active_life: "", habits: {} },
        recall_24h: { typical_day: {}, weekend_text: "" },
        anthropometric_data: {},
        current_notes: "",
        current_plan: { objectives: "", important_points: "", breakfast_options: "", lunch_dinner_options: "", strategies: "" },
        nutritional_math: { requirements: { fa: 1.5 }, exchanges: {}, distribution: {} },
        files: []
      });
    }
    setPatientModalTab('plan');
    setIsPatientModalOpen(true);
    setLoading(false);
  };

  const availableIcons = [
    { name: 'Apple', icon: Apple },
    { name: 'Carrot', icon: Carrot },
    { name: 'Salad', icon: Salad },
    { name: 'Utensils', icon: Utensils },
    { name: 'Leaf', icon: Leaf },
    { name: 'Scale', icon: Scale },
    { name: 'Ruler', icon: Ruler },
    { name: 'Dumbbell', icon: Dumbbell },
    { name: 'Activity', icon: Activity },
    { name: 'Flame', icon: Flame },
    { name: 'Droplets', icon: Droplets },
    { name: 'HeartPulse', icon: HeartPulse },
    { name: 'Stethoscope', icon: Stethoscope },
    { name: 'ClipboardList', icon: ClipboardList },
    { name: 'Baby', icon: Baby },
  ];

  const savePatientFile = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('patients')
      .upsert(selectedPatient, { onConflict: 'email' });

    if (!error) {
      setIsPatientModalOpen(false);
    } else {
      alert('Error al guardar la ficha clínica');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const renderPatientModal = () => {
    if (!selectedPatient) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8">
        <div className="absolute inset-0 bg-secondary/70 backdrop-blur-md" onClick={() => setIsPatientModalOpen(false)} />
        <div className="relative bg-[#FDFCFB] w-full md:max-w-6xl h-full md:h-[95vh] overflow-hidden md:rounded-[3rem] shadow-[0_30px_90px_rgb(0,0,0,0.3)] border-t md:border border-white/20 flex flex-col animate-in fade-in slide-in-from-bottom-8 md:zoom-in-95 duration-700">
          
          {/* Header Premium */}
          <div className="px-8 md:px-12 py-8 md:py-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-white sticky top-0 z-20">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-serif text-2xl md:text-3xl font-bold border border-primary/10 shadow-sm">
                  {selectedPatient.full_name?.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-800">{selectedPatient.full_name}</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-bold uppercase tracking-widest border border-primary/10">ID: {selectedPatient.id?.slice(0, 5)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold flex items-center gap-1.5">
                    <FileText size={12} className="text-primary" /> Expediente Clínico Digital
                  </p>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold flex items-center gap-1.5">
                    <CalendarIcon size={12} className="text-primary" /> Última sesión: {format(new Date(), 'dd/MM/yy')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button onClick={savePatientFile} disabled={loading} className="flex-1 md:flex-none bg-secondary text-white hover:bg-slate-800 rounded-2xl px-8 h-14 md:h-12 uppercase tracking-widest text-[10px] font-bold shadow-xl shadow-secondary/20 transition-all active:scale-95">
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Guardar Historial'}
              </Button>
              <button onClick={() => setIsPatientModalOpen(false)} className="w-14 h-14 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all border border-slate-100">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tabs Navigation - Floating Pill Style */}
          <div className="px-6 md:px-12 py-4 bg-white border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar sticky top-[108px] z-20 backdrop-blur-md bg-white/90">
            {[
              { id: 'plan', label: 'Plan', icon: Apple },
              { id: 'clinico', label: 'Cálculos', icon: Ruler },
              { id: 'notas', label: 'Evolución', icon: TrendingUp },
              { id: 'perfil', label: 'Anamnesis', icon: User },
              { id: 'alimentacion', label: 'Hábitos', icon: Coffee },
              { id: 'recordatorio', label: '24 Horas', icon: Clock },
              { id: 'archivos', label: 'Archivos', icon: FileIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPatientModalTab(tab.id)}
                className={`py-2.5 px-5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2.5 shrink-0 border ${
                  patientModalTab === tab.id 
                    ? 'bg-primary/10 border-primary/20 text-primary shadow-sm' 
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-slate-50/40">
            {patientModalTab === 'perfil' && (
              <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-primary/30" /> Datos Personales
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Nacimiento</label>
                        <input type="date" value={selectedPatient.birth_date || ''} onChange={e => setSelectedPatient({...selectedPatient, birth_date: e.target.value})} className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Ocupación</label>
                        <input type="text" value={selectedPatient.occupation || ''} onChange={e => setSelectedPatient({...selectedPatient, occupation: e.target.value})} className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Actividad Física</label>
                        <textarea rows={3} value={selectedPatient.physical_activity || ''} onChange={e => setSelectedPatient({...selectedPatient, physical_activity: e.target.value})} className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none" placeholder="Tipo de ejercicio, frecuencia, intensidad..." />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-primary/30" /> Motivo & Objetivos
                    </h4>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Motivo de Consulta</label>
                        <textarea rows={3} value={selectedPatient.consultation_reason || ''} onChange={e => setSelectedPatient({...selectedPatient, consultation_reason: e.target.value})} className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Objetivos Generales</label>
                        <textarea rows={3} value={selectedPatient.objectives || ''} onChange={e => setSelectedPatient({...selectedPatient, objectives: e.target.value})} className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none" placeholder="¿Qué buscamos lograr en este proceso?" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-10 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-primary/30" /> Antecedentes Familiares & Médicos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-6">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-800 border-b border-slate-50 pb-2 block">Patologías</label>
                      <div className="grid grid-cols-1 gap-4">
                        {['Diabetes', 'Hipertensión', 'Celiaquía', 'Hipotiroidismo', 'Asma'].map(d => (
                          <label key={d} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-primary/5 cursor-pointer transition-all border border-transparent hover:border-primary/10">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{d}</span>
                            <input type="checkbox" checked={selectedPatient.medical_data?.diseases?.[d.toLowerCase()] || false} onChange={e => {
                              const diseases = {...(selectedPatient.medical_data?.diseases || {})};
                              diseases[d.toLowerCase()] = e.target.checked;
                              setSelectedPatient({...selectedPatient, medical_data: {...selectedPatient.medical_data, diseases}});
                            }} className="w-5 h-5 rounded-lg border-slate-200 text-primary focus:ring-primary/20 transition-all" />
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2 space-y-6">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-800 border-b border-slate-50 pb-2 block">Medicación & Suplementación Actual</label>
                      <textarea rows={8} placeholder="Detallar medicamentos, dosis, frecuencia..." value={selectedPatient.medical_data?.med_supp_text || ''} onChange={e => setSelectedPatient({...selectedPatient, medical_data: {...selectedPatient.medical_data, med_supp_text: e.target.value}})} className="w-full bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none leading-relaxed" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {patientModalTab === 'alimentacion' && (
              <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Hidratación', key: 'hydration', icon: Droplets, placeholder: 'Litros, tipo de bebidas...' },
                    { label: 'Descanso', key: 'sleep', icon: Moon, placeholder: 'Horas, calidad del sueño...' },
                    { label: 'Vida Activa', key: 'active_life', icon: Activity, placeholder: 'Pasos diarios, caminatas...' },
                  ].map(item => (
                    <div key={item.key} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-primary/10 rounded-xl text-primary"><item.icon size={16} /></div>
                         <label className="text-[10px] uppercase tracking-widest text-primary font-bold">{item.label}</label>
                      </div>
                      <textarea rows={3} placeholder={item.placeholder} value={selectedPatient.nutritional_evaluation?.[item.key] || ''} onChange={e => setSelectedPatient({...selectedPatient, nutritional_evaluation: {...selectedPatient.nutritional_evaluation, [item.key]: e.target.value}})} className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-sm outline-none focus:border-primary transition-all resize-none" />
                    </div>
                  ))}
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-10 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-primary/30" /> Hábitos & Preferencias
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Alimentos que NO consume</label>
                      <textarea rows={5} value={selectedPatient.nutritional_evaluation?.exclude_foods || ''} onChange={e => setSelectedPatient({...selectedPatient, nutritional_evaluation: {...selectedPatient.nutritional_evaluation, exclude_foods: e.target.value}})} className="w-full bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 text-sm outline-none focus:border-primary transition-all resize-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Frecuencia de Consumo (Alcohol, Snacks, etc)</label>
                      <textarea rows={5} value={selectedPatient.nutritional_evaluation?.habits_frequency || ''} onChange={e => setSelectedPatient({...selectedPatient, nutritional_evaluation: {...selectedPatient.nutritional_evaluation, habits_frequency: e.target.value}})} className="w-full bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 text-sm outline-none focus:border-primary transition-all resize-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {patientModalTab === 'recordatorio' && (
              <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h4 className="text-lg font-serif font-medium text-slate-800 mb-10 border-b border-slate-50 pb-6 flex items-center gap-3">
                     <Clock className="text-primary" size={20} /> Recordatorio de 24 Horas (Día Tipo)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { label: 'Desayuno', key: 'desayuno', icon: Coffee },
                      { label: 'Almuerzo', key: 'almuerzo', icon: Utensils },
                      { label: 'Merienda', key: 'merienda', icon: Apple },
                      { label: 'Cena', key: 'cena', icon: Moon },
                    ].map(meal => (
                      <div key={meal.key} className="space-y-3 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-white rounded-xl text-primary group-hover:scale-110 transition-transform"><meal.icon size={16} /></div>
                           <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{meal.label}</label>
                        </div>
                        <textarea rows={5} value={selectedPatient.recall_24h?.typical_day?.[meal.key] || ''} onChange={e => {
                          const typical_day = {...(selectedPatient.recall_24h?.typical_day || {})};
                          typical_day[meal.key] = e.target.value;
                          setSelectedPatient({...selectedPatient, recall_24h: {...selectedPatient.recall_24h, typical_day}});
                        }} className="w-full bg-transparent p-0 border-none text-sm outline-none resize-none leading-relaxed" placeholder={`Describir ${meal.label.toLowerCase()}...`} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-secondary p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-lg font-serif font-medium mb-6 flex items-center gap-3">
                       <Sparkles size={20} className="text-primary" /> Variaciones del Fin de Semana
                    </h4>
                    <textarea rows={4} placeholder="Detallar cómo cambia la alimentación los sábados y domingos..." value={selectedPatient.recall_24h?.weekend_text || ''} onChange={e => setSelectedPatient({...selectedPatient, recall_24h: {...selectedPatient.recall_24h, weekend_text: e.target.value}})} className="w-full bg-white/5 p-6 rounded-[2rem] border border-white/10 text-sm outline-none focus:border-primary/50 text-white placeholder:text-white/20 resize-none leading-relaxed" />
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                </div>
              </div>
            )}

            {patientModalTab === 'clinico' && (
              <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                {/* Requirements Calculator Premium */}
                <div className="bg-secondary p-10 md:p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-white/10">
                  <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-12">
                    <div className="space-y-10 flex-1">
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-2">Harris-Benedict Calculator</h4>
                        <h2 className="text-2xl font-serif font-medium">Cálculo de Requerimientos Energéticos</h2>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {[
                          { label: 'Peso (kg)', key: 'weight' },
                          { label: 'Talla (cm)', key: 'height' },
                          { label: 'Edad', key: 'age' },
                        ].map(f => (
                          <div key={f.key} className="space-y-3">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">{f.label}</label>
                            <input 
                              type="number" 
                              value={selectedPatient.anthropometric_data?.[f.key] || ''} 
                              onChange={e => {
                                const data = {...(selectedPatient.anthropometric_data || {})};
                                data[f.key] = e.target.value;
                                setSelectedPatient({...selectedPatient, anthropometric_data: data});
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 text-white font-bold transition-all"
                            />
                          </div>
                        ))}
                        <div className="space-y-3">
                          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Actividad (FA)</label>
                          <select 
                            value={selectedPatient.nutritional_math?.requirements?.fa || 1.2}
                            onChange={e => setSelectedPatient({...selectedPatient, nutritional_math: {...selectedPatient.nutritional_math, requirements: {...selectedPatient.nutritional_math?.requirements, fa: Number(e.target.value)}}})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 text-white font-bold cursor-pointer transition-all"
                          >
                            <option value={1.2} className="bg-slate-900 text-white">1.2 - Sedentario</option>
                            <option value={1.375} className="bg-slate-900 text-white">1.375 - Ligero</option>
                            <option value={1.55} className="bg-slate-900 text-white">1.55 - Moderado</option>
                            <option value={1.725} className="bg-slate-900 text-white">1.725 - Intenso</option>
                            <option value={1.9} className="bg-slate-900 text-white">1.9 - Muy Intenso</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:w-80 bg-white/5 rounded-[2.5rem] p-10 border border-white/10 backdrop-blur-md flex flex-col justify-center items-center text-center shadow-inner group transition-all hover:bg-white/10">
                      <div className="p-4 bg-primary/20 rounded-full text-primary mb-6 animate-pulse shadow-[0_0_20px_rgb(197,160,89,0.3)]">
                        <Activity size={32} />
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-2">Gasto Calórico Total</p>
                      <div className="text-6xl font-serif font-bold text-primary mb-2 transition-transform group-hover:scale-110 duration-500">
                        {Math.round(
                          ((655.1 + (9.563 * (Number(selectedPatient.anthropometric_data?.weight) || 0)) + (1.85 * (Number(selectedPatient.anthropometric_data?.height) || 0)) - (4.676 * (Number(selectedPatient.anthropometric_data?.age) || 0)))) * 
                          (selectedPatient.nutritional_math?.requirements?.fa || 1.2)
                        )}
                      </div>
                      <span className="text-xs uppercase tracking-widest text-white/60 font-bold">Kilocalorías / día</span>
                      <p className="text-[9px] text-white/30 mt-8 leading-tight max-w-[180px] italic">Harris-Benedict Protocol (Women)</p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none -ml-10 -mb-10" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Exchange Table Premium */}
                  <div className="lg:col-span-2 bg-white p-10 md:p-12 rounded-[3rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                      <h4 className="text-lg font-serif font-medium text-slate-800 flex items-center gap-3">
                         <div className="p-2 bg-primary/10 rounded-xl text-primary"><Utensils size={18} /></div>
                         Sistema de Intercambios
                      </h4>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">Plan de Porciones</div>
                    </div>
                    <div className="overflow-x-auto -mx-2">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            <th className="pb-6 px-4">Grupo de Alimento</th>
                            <th className="pb-6 text-center">Cant.</th>
                            <th className="pb-6 text-right">Kcal</th>
                            <th className="pb-6 text-right">HC (g)</th>
                            <th className="pb-6 text-right">PR (g)</th>
                            <th className="pb-6 text-right">GR (g)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {[
                            { name: 'Almidones', kcal: 70, hc: 15, pr: 2, gr: 0 },
                            { name: 'Legumbres', kcal: 90, hc: 15, pr: 7, gr: 1 },
                            { name: 'Frutas', kcal: 60, hc: 15, pr: 0, gr: 0 },
                            { name: 'Verduras', kcal: 25, hc: 5, pr: 2, gr: 0 },
                            { name: 'Lácteos (Desc)', kcal: 80, hc: 12, pr: 8, gr: 0 },
                            { name: 'Proteínas (BG)', kcal: 55, hc: 0, pr: 7, gr: 3 },
                            { name: 'Proteínas (MG)', kcal: 75, hc: 0, pr: 7, gr: 5 },
                            { name: 'Grasas', kcal: 45, hc: 0, pr: 0, gr: 5 },
                          ].map(group => {
                            const count = Number(selectedPatient.nutritional_math?.exchanges?.[group.name] || 0);
                            return (
                              <tr key={group.name} className="hover:bg-slate-50/80 transition-all group">
                                <td className="py-5 px-4">
                                  <div className="text-sm font-bold text-slate-700">{group.name}</div>
                                  <div className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter mt-1">{group.kcal} kcal/ic</div>
                                </td>
                                <td className="py-4 text-center">
                                  <input 
                                    type="number" 
                                    step="0.5"
                                    value={selectedPatient.nutritional_math?.exchanges?.[group.name] || ''}
                                    onChange={e => {
                                      const exchanges = {...(selectedPatient.nutritional_math?.exchanges || {})};
                                      exchanges[group.name] = e.target.value;
                                      setSelectedPatient({...selectedPatient, nutritional_math: {...selectedPatient.nutritional_math, exchanges}});
                                    }}
                                    className="w-16 bg-white border border-slate-200 rounded-xl p-2.5 text-center font-bold text-slate-800 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm" 
                                  />
                                </td>
                                <td className="py-4 text-right font-serif font-bold text-slate-500">{Math.round(count * group.kcal)}</td>
                                <td className="py-4 text-right font-serif font-bold text-slate-400">{Math.round(count * group.hc)}</td>
                                <td className="py-4 text-right font-serif font-bold text-slate-400">{Math.round(count * group.pr)}</td>
                                <td className="py-4 text-right font-serif font-bold text-slate-400">{Math.round(count * group.gr)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-primary/5 font-bold border-t border-primary/20">
                            <td className="py-6 px-6 text-primary uppercase tracking-[0.2em] text-[10px]">Totales Reales</td>
                            <td className="text-center text-primary text-base">
                              {Object.values(selectedPatient.nutritional_math?.exchanges || {}).reduce((acc, v) => acc + Number(v), 0)}
                            </td>
                            <td className="text-right text-primary text-xl font-serif">
                              {Object.entries(selectedPatient.nutritional_math?.exchanges || {}).reduce((acc, [name, v]) => {
                                const group = [
                                  { name: 'Almidones', kcal: 70 }, { name: 'Legumbres', kcal: 90 }, { name: 'Frutas', kcal: 60 },
                                  { name: 'Verduras', kcal: 25 }, { name: 'Lácteos (Desc)', kcal: 80 }, { name: 'Proteínas (BG)', kcal: 55 },
                                  { name: 'Proteínas (MG)', kcal: 75 }, { name: 'Grasas', kcal: 45 }
                                ].find(g => g.name === name);
                                return acc + (Number(v) * (group?.kcal || 0));
                              }, 0)}
                            </td>
                            <td colSpan={3} className="text-right px-8">
                               <div className="flex flex-col items-end gap-1">
                                  <div className="text-[10px] text-primary/60 uppercase tracking-[0.2em]">Macronutrientes</div>
                                  <div className="text-sm text-slate-800 font-bold">
                                    {Object.entries(selectedPatient.nutritional_math?.exchanges || {}).reduce((acc, [name, v]) => acc + (Number(v) * ([{ name: 'Almidones', hc: 15 }, { name: 'Legumbres', hc: 15 }, { name: 'Frutas', hc: 15 }, { name: 'Verduras', hc: 5 }, { name: 'Lácteos (Desc)', hc: 12 }].find(g => g.name === name)?.hc || 0)), 0)}g HC / 
                                    {Object.entries(selectedPatient.nutritional_math?.exchanges || {}).reduce((acc, [name, v]) => acc + (Number(v) * ([{ name: 'Almidones', pr: 2 }, { name: 'Legumbres', pr: 7 }, { name: 'Verduras', pr: 2 }, { name: 'Lácteos (Desc)', pr: 8 }, { name: 'Proteínas (BG)', pr: 7 }, { name: 'Proteínas (MG)', pr: 7 }].find(g => g.name === name)?.pr || 0)), 0)}g PR
                                  </div>
                               </div>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                      <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-primary/30" /> Distribución Diaria
                      </h4>
                      <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-[10px] text-left border-collapse">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-50">
                              <th className="pb-4 pr-2 font-bold uppercase tracking-widest">Grupo</th>
                              {['Des', 'Alm', 'Mer', 'Cen', 'Col'].map(m => (
                                <th key={m} className="pb-4 text-center font-bold uppercase tracking-widest">{m}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50/50">
                            {['Almidones', 'Legumbres', 'Frutas', 'Verduras', 'Lácteos', 'Pro BG', 'Pro MG', 'Grasas'].map(group => (
                              <tr key={group} className="hover:bg-slate-50/30 transition-colors">
                                <td className="py-2.5 font-bold text-slate-500 uppercase tracking-tighter">{group}</td>
                                {['des', 'alm', 'mer', 'cen', 'col'].map(m => (
                                  <td key={m} className="py-1 px-1">
                                    <input 
                                      type="number" 
                                      step="0.5"
                                      value={selectedPatient.nutritional_math?.distribution?.[`${group}_${m}`] || ''}
                                      onChange={e => {
                                        const dist = {...(selectedPatient.nutritional_math?.distribution || {})};
                                        dist[`${group}_${m}`] = e.target.value;
                                        setSelectedPatient({...selectedPatient, nutritional_math: {...selectedPatient.nutritional_math, distribution: dist}});
                                      }}
                                      className="w-full bg-slate-50/50 border border-slate-100 rounded-lg text-center p-2 text-xs font-bold outline-none focus:border-primary transition-all shadow-sm"
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                      <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-primary/30" /> Antropometría
                      </h4>
                      <div className="grid grid-cols-2 gap-6">
                        {[
                          { label: 'Peso Usual (kg)', key: 'usual_weight' },
                          { label: 'Peso Máx (kg)', key: 'max_weight' },
                          { label: 'Peso Mín (kg)', key: 'min_weight' },
                          { label: 'Cintura (cm)', key: 'waist' },
                          { label: 'Cadera (cm)', key: 'hips' },
                        ].map(field => (
                          <div key={field.key} className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">{field.label}</label>
                            <input type="text" value={selectedPatient.anthropometric_data?.[field.key] || ''} onChange={e => {
                              const data = {...(selectedPatient.anthropometric_data || {})};
                              data[field.key] = e.target.value;
                              setSelectedPatient({...selectedPatient, anthropometric_data: data});
                            }} className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700 outline-none focus:border-primary transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                      <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-primary/30" /> Laboratorio
                      </h4>
                      <textarea rows={6} placeholder="Ingresar resultados de análisis clínicos relevantes..." value={selectedPatient.lab_results_text || ''} onChange={e => setSelectedPatient({...selectedPatient, lab_results_text: e.target.value})} className="w-full bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 text-[11px] font-mono leading-relaxed outline-none focus:border-primary transition-all resize-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {patientModalTab === 'plan' && (
              <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-br from-secondary to-slate-800 p-8 md:p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-3">
                       <div className="p-3 bg-primary/20 rounded-2xl text-primary"><Apple size={24} /></div>
                       <h3 className="text-2xl font-serif font-medium">Plan de Alimentación</h3>
                    </div>
                    <p className="text-white/40 text-sm max-w-md ml-1.5">Generá un documento profesional y envialo directamente al paciente.</p>
                  </div>
                  <Button 
                    onClick={() => {
                      const plan = selectedPatient.current_plan;
                      const text = `*PLAN DE ALIMENTACIÓN - Lic. Yesica García*\n\n` +
                                   `*OBJETIVOS:*\n${plan?.objectives || ''}\n\n` +
                                   `*PUNTOS IMPORTANTES:*\n${plan?.important_points || ''}\n\n` +
                                   `*OPCIONES DE COMIDAS:*\n${plan?.breakfast_options || ''}\n\n` +
                                   `*ALMUERZO Y CENA:*\n${plan?.lunch_dinner_options || ''}\n\n` +
                                   `*ESTRATEGIAS:*\n${plan?.strategies || ''}`;
                      const url = `https://wa.me/${selectedPatient.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
                      window.open(url, '_blank');
                    }}
                    className="relative z-10 w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-[11px] uppercase tracking-[0.2em] h-14 px-10 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 transition-all active:scale-95"
                  >
                    <MessageCircle size={18} /> Enviar Vía WhatsApp
                  </Button>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                </div>

                <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-12">
                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-[0.3em] text-primary font-bold flex items-center gap-3">
                      <TrendingUp size={16} /> Objetivos del Plan
                    </label>
                    <textarea rows={3} placeholder="Definir los pilares del tratamiento para esta etapa..." value={selectedPatient.current_plan?.objectives || ''} onChange={e => setSelectedPatient({...selectedPatient, current_plan: {...selectedPatient.current_plan, objectives: e.target.value}})} className="w-full bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none leading-relaxed" />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Puntos Clave</label>
                    <textarea rows={4} placeholder="Proteína en todas las comidas, hidratación, marcas sugeridas..." value={selectedPatient.current_plan?.important_points || ''} onChange={e => setSelectedPatient({...selectedPatient, current_plan: {...selectedPatient.current_plan, important_points: e.target.value}})} className="w-full bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 text-base outline-none focus:border-primary transition-all resize-none leading-relaxed" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <label className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Desayunos & Meriendas</label>
                      <textarea rows={12} placeholder="Opción 1: ... Opción 2: ..." value={selectedPatient.current_plan?.breakfast_options || ''} onChange={e => setSelectedPatient({...selectedPatient, current_plan: {...selectedPatient.current_plan, breakfast_options: e.target.value}})} className="w-full bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 text-base outline-none focus:border-primary transition-all resize-none leading-relaxed" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Almuerzos & Cenas</label>
                      <textarea rows={12} placeholder="Estructura del plato, combinaciones..." value={selectedPatient.current_plan?.lunch_dinner_options || ''} onChange={e => setSelectedPatient({...selectedPatient, current_plan: {...selectedPatient.current_plan, lunch_dinner_options: e.target.value}})} className="w-full bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 text-base outline-none focus:border-primary transition-all resize-none leading-relaxed" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Suplementación & Extras</label>
                    <textarea rows={4} placeholder="Dosis, marcas recomendadas, horarios..." value={selectedPatient.current_plan?.strategies || ''} onChange={e => setSelectedPatient({...selectedPatient, current_plan: {...selectedPatient.current_plan, strategies: e.target.value}})} className="w-full bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 text-base outline-none focus:border-primary transition-all resize-none leading-relaxed" />
                  </div>
                </div>
              </div>
            )}

            {patientModalTab === 'notas' && (
              <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                    <h4 className="text-lg font-serif font-medium text-slate-800 flex items-center gap-3">
                       <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><FileText size={18} /></div>
                       Evolución del Paciente
                    </h4>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-4 py-2 bg-slate-50 rounded-xl">Bitácora de Sesión</div>
                  </div>
                  <textarea rows={18} placeholder="Registrar observaciones de la sesión actual, cambios, dudas del paciente..." value={selectedPatient.current_notes || ''} onChange={e => setSelectedPatient({...selectedPatient, current_notes: e.target.value})} className="w-full bg-slate-50/30 p-10 rounded-[2.5rem] border border-slate-100 text-base outline-none focus:bg-white focus:border-primary transition-all resize-none leading-relaxed shadow-inner" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mt-20 -mr-20 pointer-events-none" />
                </div>
              </div>
            )}

            {patientModalTab === 'archivos' && (
              <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div>
                      <h4 className="text-xl font-serif font-medium text-slate-800">Galería de Documentos</h4>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Análisis, PDFs y Registros
                      </p>
                    </div>
                    <div className="w-full md:w-auto">
                      <input 
                        type="file" 
                        id="file-upload" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                      <Button 
                        onClick={() => document.getElementById('file-upload')?.click()}
                        disabled={loading}
                        className="w-full md:w-auto bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 rounded-2xl h-14 px-10 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 shadow-sm transition-all"
                      >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />} Subir Documento
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(selectedPatient.files || []).length === 0 ? (
                      <div className="col-span-full py-24 text-center border-4 border-dashed border-slate-50 rounded-[3rem] flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                          <FileIcon size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-serif italic text-slate-300">No hay archivos en la nube.</h3>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-2">Cargá estudios clínicos o fotos de progreso.</p>
                      </div>
                    ) : (
                      selectedPatient.files.map((file: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl hover:border-primary/20 transition-all duration-500">
                          <div className="flex items-center gap-5">
                            <div className="p-4 bg-white rounded-2xl text-primary shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                              {file.type === 'PDF' ? <FileText size={22} /> : <ImageIcon size={22} />}
                            </div>
                            <div className="max-w-[180px] md:max-w-[220px]">
                              <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">{file.type} • {file.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a 
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="p-3 text-slate-400 hover:text-primary bg-white rounded-xl shadow-sm border border-slate-100 transition-all"
                              title="Ver archivo"
                            >
                              <ExternalLink size={18} />
                            </a>
                            <button 
                              onClick={() => handleDeleteFile(file)}
                              className="p-3 text-slate-400 hover:text-red-500 bg-white rounded-xl shadow-sm border border-slate-100 transition-all"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Turnos Hoy', value: stats.today, trend: '+0%', icon: CalendarIcon, color: 'text-primary' },
          { label: 'Pacientes Totales', value: stats.patients, trend: `+${stats.newPatientsThisMonth}`, icon: Users, color: 'text-emerald-700' },
          { label: 'Caja Real', value: stats.revenue, trend: `Proyectado: ${stats.projected}`, icon: DollarSign, color: 'text-green-600', isRevenue: true },
          { label: 'Asistencia', value: `${stats.efficiency}%`, trend: 'Normal', icon: TrendingUp, color: 'text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mt-16 -mr-16 group-hover:bg-primary/10 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-3 rounded-[1rem] bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all ${stat.color}`}>
                <stat.icon size={20} strokeWidth={1.5} />
              </div>
              <div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg ${
                stat.isRevenue ? (stats.isGrowing ? 'text-green-700 bg-green-50/80' : 'text-red-700 bg-red-50/80') : 'text-slate-500 bg-slate-50'
              }`}>
                {stat.isRevenue && <ArrowUpRight size={10} />} {stat.trend}
              </div>
            </div>
            <div className="relative z-10">
              <h4 className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-medium mb-1.5">{stat.label}</h4>
              <div className="text-3xl font-serif font-medium text-slate-800">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
            <div>
              <h3 className="text-xl font-serif font-medium text-slate-800">Agenda Inmediata</h3>
              <p className="text-sm text-slate-500 font-light mt-1">Próximos compromisos del día</p>
            </div>
            <button 
              onClick={() => setActiveSection('agenda')}
              className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors bg-primary/5 px-4 py-2.5 rounded-xl hover:bg-primary/10"
            >
              Ver completa <ChevronRight size={12} />
            </button>
          </div>
          
          <div className="space-y-3">
            {appointments.filter(a => a.date === format(new Date(), 'yyyy-MM-dd')).slice(0, 4).map((app, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 md:p-5 rounded-2xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100 group">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-50 text-primary group-hover:scale-110 transition-transform">
                    <Clock size={16} />
                  </div>
                  <div className="text-xl font-serif font-medium text-slate-800 w-16">{app.time.slice(0, 5)}</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-800 text-sm md:text-base">{app.full_name}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">{app.modality}</div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[9px] uppercase tracking-[0.2em] font-bold w-fit ${
                  app.status === 'confirmado' ? 'bg-green-50 text-green-700 border border-green-100' : 
                  app.status === 'cancelado' ? 'bg-red-50 text-red-700 border border-red-100' :
                  'bg-yellow-50 text-yellow-700 border border-yellow-100'
                }`}>
                  {app.status}
                </div>
              </div>
            ))}
            {appointments.filter(a => a.date === format(new Date(), 'yyyy-MM-dd')).length === 0 && (
              <div className="text-center py-16 flex flex-col items-center gap-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-300">
                  <CalendarIcon size={24} strokeWidth={1.5} />
                </div>
                <p className="text-slate-400 font-serif italic text-base">No hay compromisos para hoy.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-secondary rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-[0_8px_30px_rgb(27,63,57,0.4)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mt-16 -mr-16" />
          <div className="relative z-10">
            <h3 className="text-xl font-serif font-medium mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgb(197,160,89)]" />
              Estado Clínico
            </h3>
            <div className="space-y-8">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <p className="text-white/80 text-sm font-light leading-relaxed">
                  {stats.efficiency > 80 
                    ? "La efectividad de asistencia es excelente. La agenda está optimizada y el rendimiento financiero es estable." 
                    : "Hay margen para mejorar la asistencia. Considerar ajustar los recordatorios o la política de comunicación."}
                </p>
              </div>
              <div className="flex items-center gap-4 text-primary bg-primary/10 p-4 rounded-2xl border border-primary/20 w-fit">
                <div className="p-2.5 bg-primary/20 rounded-xl text-primary">
                  <UserCheck size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{stats.newPatientsThisMonth} ingresos este mes</span>
              </div>
            </div>
          </div>
          <Button className="w-full bg-white text-secondary hover:bg-slate-50 border-none rounded-xl py-5 uppercase tracking-[0.2em] text-[9px] font-bold mt-8 shadow-sm transition-all relative z-10">
            Generar Reporte
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => {
    const start = startOfMonth(currentCalendarDate);
    const end = endOfMonth(start);
    const days = eachDayOfInterval({ 
      start: startOfWeek(start, { weekStartsOn: 0 }), 
      end: endOfWeek(end, { weekStartsOn: 0 }) 
    });

    return (
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
          <h3 className="font-serif font-medium text-2xl text-slate-800 capitalize">
            {format(currentCalendarDate, 'MMMM yyyy', { locale: es })}
          </h3>
          <div className="flex gap-2">
            <button onClick={() => setCurrentCalendarDate(subMonths(currentCalendarDate, 1))} className="p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-400 shadow-sm"><ChevronLeft size={20} /></button>
            <button onClick={() => setCurrentCalendarDate(new Date())} className="px-5 py-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-[10px] uppercase tracking-widest font-bold text-primary shadow-sm bg-white/50">Hoy</button>
            <button onClick={() => setCurrentCalendarDate(addMonths(currentCalendarDate, 1))} className="p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-400 shadow-sm"><ChevronRight size={20} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 border-b border-slate-100">
          {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(d => (
            <div key={d} className="py-4 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 bg-slate-50/50">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-slate-50/20">
          {days.map((day, i) => {
            const isSelected = format(day, 'yyyy-MM-dd') === filterDate;
            const isCurrentMonth = isSameMonth(day, start);
            const dayAppointments = appointments.filter(a => a.date === format(day, 'yyyy-MM-dd'));
            
            return (
              <div 
                key={i} 
                onClick={() => {
                  setFilterDate(format(day, 'yyyy-MM-dd'));
                  if (dayAppointments.length > 0) setViewMode('list');
                }}
                className={`min-h-[140px] p-4 border-b border-r border-slate-100 cursor-pointer transition-all hover:bg-primary/5 group relative ${
                  !isCurrentMonth ? 'bg-slate-50/50 grayscale-[30%]' : 'bg-white'
                } ${isSelected ? 'bg-primary/5 ring-inset ring-2 ring-primary/20' : ''}`}
              >
                <div className={`text-sm font-medium mb-3 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isSelected ? 'bg-primary text-white shadow-md shadow-primary/30 scale-110' : 
                  isToday(day) ? 'bg-secondary text-white shadow-md' : 
                  isCurrentMonth ? 'text-slate-700 bg-slate-50 group-hover:bg-primary group-hover:text-white' : 'text-slate-300'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1.5">
                  {dayAppointments.slice(0, 3).map((app, idx) => (
                    <div key={idx} className={`text-[9px] p-2 rounded-lg truncate font-bold uppercase tracking-tighter transition-all ${
                      app.status === 'confirmado' ? 'bg-green-50/80 text-green-700 border border-green-100' : 'bg-yellow-50/80 text-yellow-700 border border-yellow-100'
                    }`}>
                      {app.time.slice(0, 5)} <span className="ml-1 opacity-80">{app.full_name.split(' ')[0]}</span>
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-[9px] text-slate-400 font-bold pl-2 mt-2">+ {dayAppointments.length - 3} más</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAgenda = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-medium text-slate-800">Agenda de Turnos</h2>
          <p className="text-slate-500 text-sm font-light mt-1">Gestión operativa de citas y estados.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-2xl border border-slate-100 p-1.5 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <List size={14} /> Lista
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <CalendarIcon size={14} /> Calendario
            </button>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="flex items-center gap-2 px-3 text-slate-400 border-r border-slate-100">
              <CalendarIcon size={14} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Día</span>
            </div>
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-1.5 outline-none text-xs font-medium text-slate-700 bg-transparent cursor-pointer"
            />
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? renderCalendar() : (
        <div className="space-y-6">
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {appointments
              .filter(a => a.date === filterDate)
              .filter(a => agendaStatusFilter === 'todos' || a.status === agendaStatusFilter)
              .map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mt-10 -mr-10" />
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-serif font-bold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-xl">{app.time.slice(0, 5)}</div>
                    <div className={`px-3 py-1.5 rounded-xl text-[9px] uppercase tracking-[0.2em] font-bold border ${
                      app.status === 'confirmado' ? 'bg-green-50/80 text-green-700 border-green-100' : 
                      app.status === 'cancelado' ? 'bg-red-50/80 text-red-700 border-red-100' :
                      'bg-yellow-50/80 text-yellow-700 border-yellow-100'
                    }`}>
                      {app.status}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => togglePayment(app.id, app.is_paid)} 
                      className={`p-3 rounded-xl transition-all ${app.is_paid ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}`}
                    >
                      <DollarSign size={16} />
                    </button>
                    <button 
                      onClick={() => sendWhatsApp(app.phone, app.full_name, app.time, app.date)}
                      className="p-3 bg-green-50 text-green-600 rounded-xl transition-all border border-green-100 hover:bg-green-100"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>

                <div className="relative z-10">
                  <h4 className="text-lg font-serif font-bold text-slate-800">{app.full_name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                    <Apple size={12} /> {app.modality}
                  </p>
                </div>

                <div className="flex gap-3 pt-3 relative z-10 border-t border-slate-50">
                  <button onClick={() => updateStatus(app.id, 'confirmado')} className="flex-1 bg-secondary text-white h-12 rounded-2xl text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all">
                    Confirmar
                  </button>
                  <button onClick={() => updateStatus(app.id, 'cancelado')} className="flex-1 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 h-12 rounded-2xl text-[10px] uppercase tracking-widest font-bold text-slate-500 transition-all">
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Hora</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Paciente</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Servicio</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center">Estado</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {appointments
                    .filter(a => a.date === filterDate)
                    .filter(a => agendaStatusFilter === 'todos' || a.status === agendaStatusFilter)
                    .map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <div className="font-serif font-medium text-xl text-slate-800 bg-white shadow-sm border border-slate-100 rounded-xl px-3 py-1.5 w-fit">
                          {app.time.slice(0, 5)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-medium text-slate-800 text-base flex items-center gap-3">
                          {app.full_name}
                          <button 
                            onClick={() => sendWhatsApp(app.phone, app.full_name, app.time, app.date)}
                            className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 border border-green-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Enviar recordatorio WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1.5">
                          <Phone size={12} /> {app.phone}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mt-4">
                        <Apple size={14} className="text-primary" /> {app.modality}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] uppercase tracking-[0.2em] font-bold border ${
                          app.status === 'confirmado' ? 'bg-green-50/80 text-green-700 border-green-100' : 
                          app.status === 'cancelado' ? 'bg-red-50/80 text-red-700 border-red-100' :
                          'bg-yellow-50/80 text-yellow-700 border-yellow-100'
                        }`}>
                          {app.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <button 
                            onClick={() => togglePayment(app.id, app.is_paid)} 
                            className={`p-2 rounded-xl transition-all ${app.is_paid ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-400'}`}
                            title={app.is_paid ? "Ver pago" : "Marcar como pagado"}
                          >
                            <DollarSign size={16} />
                          </button>
                          <button onClick={() => updateStatus(app.id, 'confirmado')} className="p-2 bg-white border border-slate-200 hover:border-secondary hover:text-secondary hover:bg-secondary/5 text-slate-400 rounded-xl transition-all" title="Confirmar">
                            <CheckCircle size={16} />
                          </button>
                          <button onClick={() => updateStatus(app.id, 'cancelado')} className="p-2 bg-white border border-slate-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50 text-slate-400 rounded-xl transition-all" title="Cancelar">
                            <XCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {appointments.filter(a => a.date === filterDate).length === 0 && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-16 flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <CalendarIcon size={24} strokeWidth={1.5} />
               </div>
              <p className="text-slate-400 font-serif italic text-base">No hay turnos para esta fecha.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderPacientes = () => (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2 tracking-tight">Directorio de Pacientes</h2>
          <p className="text-slate-400 text-sm font-light">Gestioná la historia clínica y el progreso de tu comunidad.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-[0_4px_15px_rgb(0,0,0,0.02)] focus:shadow-md transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {uniquePatients.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
            <Users size={36} />
          </div>
          <h3 className="text-xl font-serif font-medium text-slate-800 mb-2">No hay pacientes que coincidan</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">Probá con otro nombre o verificá que el paciente tenga al menos un turno agendado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {uniquePatients.map((p, i) => (
            <div 
              key={i}
              className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_45px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mt-16 -mr-16 group-hover:bg-primary/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-serif text-2xl font-bold shadow-sm border border-primary/5 group-hover:scale-110 transition-transform duration-500">
                    {p.name?.charAt(0)}
                  </div>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => sendWhatsApp(p.phone, p.name)}
                      className="p-3 bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-green-600 rounded-xl transition-all border border-transparent hover:border-green-100 shadow-sm"
                      title="WhatsApp"
                    >
                      <MessageCircle size={18} />
                    </button>
                    <button 
                      onClick={() => openPatientFile(p)}
                      className="p-3 bg-secondary text-white hover:bg-slate-800 rounded-xl shadow-lg shadow-secondary/20 transition-all group-hover:scale-105"
                      title="Ver Ficha"
                    >
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 mb-8">
                  <h3 className="text-xl font-serif font-bold text-slate-800 group-hover:text-primary transition-colors truncate">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                    <Mail size={12} className="text-primary/60" />
                    <span className="truncate">{p.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1.5">Teléfono</div>
                    <div className="text-xs font-bold text-slate-700 truncate">{p.phone || 'N/A'}</div>
                  </div>
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1.5">Última Visita</div>
                    <div className="text-xs font-bold text-slate-700">{format(new Date(p.lastVisit + 'T12:00:00'), 'dd MMM yy', { locale: es })}</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300">Historia Clínica</span>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-bold border border-primary/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgb(197,160,89)]" />
                  Activo
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPagos = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-800">Control Financiero</h2>
          <p className="text-slate-500 text-sm font-light mt-1">Monitoreo de ingresos por turnos confirmados.</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgb(34,197,94)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Actualización en tiempo real</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-lg font-serif font-medium text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <TrendingUp size={18} />
                </div>
                Evolución de Ingresos
              </h3>
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">Últimos 7 días</div>
            </div>
            
            <div className="h-[300px] w-full relative min-h-[300px]">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 500}} 
                    dy={15}
                  />
                  <YAxis 
                    hide 
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', fontSize: '12px', padding: '15px'}}
                    itemStyle={{fontWeight: 'bold', color: '#1B3F39'}}
                    cursor={{stroke: '#C5A059', strokeWidth: 2, strokeDasharray: '5 5'}}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Ingresos']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="monto" 
                    stroke="#C5A059" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorMonto)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10">
            <h3 className="text-lg font-serif font-medium text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <History size={18} />
              </div>
              Historial de Cobros
            </h3>
            <div className="space-y-4">
              {appointments
                .filter(a => a.status === 'confirmado')
                .slice(0, 5)
                .map((app, i) => {
                const finalPrice = getPriceForAppointment(app.modality);

                return (
                  <div key={i} className="flex justify-between items-center p-5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group shadow-sm hover:shadow-md bg-white">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-green-50 text-green-600 border border-green-100 group-hover:scale-110 transition-transform">
                        <DollarSign size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-base">{app.full_name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">{format(new Date(app.date + 'T12:00:00'), 'dd MMM yyyy', { locale: es })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-bold text-slate-800 text-lg">
                        ${finalPrice.toLocaleString('es-AR')}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-bold uppercase tracking-widest mt-1">
                         <CheckCircle size={10} /> Recibido
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8 flex flex-col">
          <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center flex-1 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mt-16" />
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-6 relative z-10">Total Recaudado</h4>
            <div className="text-5xl font-serif font-bold text-slate-800 mb-4 relative z-10">{stats.revenue}</div>
            <div className="h-1.5 w-20 bg-primary/20 rounded-full mx-auto mb-6 relative z-10">
              <div className="h-full bg-primary rounded-full w-2/3 shadow-[0_0_8px_rgb(197,160,89)]" />
            </div>
            <p className="text-slate-400 text-[11px] font-medium leading-relaxed max-w-[200px] mx-auto mt-2 relative z-10">
              Ingresos basados exclusivamente en turnos confirmados.
            </p>
          </div>
          
          <div className="bg-secondary p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(27,63,57,0.3)] text-white text-center flex-1 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
            
            <div className="relative z-10">
              <h4 className="text-[11px] uppercase tracking-[0.3em] text-white/40 font-bold mb-6">Proyección Mensual</h4>
              <div className="text-4xl font-serif font-bold mb-4 text-primary">
                {stats.revenueThisMonth}
              </div>
              <div className="px-5 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest w-fit mx-auto mt-4 backdrop-blur-sm">
                Recaudación del mes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAjustes = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-medium text-slate-800">Ajustes Generales</h2>
          <p className="text-slate-500 text-sm font-light mt-1">Configurá las preferencias de tu consultorio.</p>
        </div>
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
          {(['servicios', 'perfil', 'disponibilidad'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setAjustesTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${
                ajustesTab === tab
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {ajustesTab === 'servicios' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif font-medium text-slate-800">Servicios Activos</h3>
            <Button 
              onClick={() => setEditingService({ name: '', price: '', duration: '', icon_name: 'Apple' })}
              className="bg-primary text-white hover:bg-primary/90 rounded-xl px-5 py-4 text-[10px] uppercase tracking-widest font-bold shadow-md shadow-primary/20 flex items-center gap-2"
            >
              <Plus size={14} /> Añadir
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    {(() => {
                      const IconObj = availableIcons.find(i => i.name === service.icon_name)?.icon || Apple;
                      return <IconObj size={20} className="text-primary" />;
                    })()}
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setEditingService(service)}
                      className="p-2 text-slate-300 hover:text-primary transition-colors"
                      title="Editar"
                    >
                      <Settings size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="font-serif font-medium text-xl text-slate-800 mb-2">{service.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-secondary">${service.price}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">ARS</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <Clock size={12} /> {service.duration}
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mb-16 -mr-16 group-hover:bg-primary/10 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}

      {ajustesTab === 'perfil' && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden max-w-3xl">
          <div className="bg-gradient-to-r from-primary/10 to-transparent p-8 md:p-10 border-b border-slate-100">
            <h3 className="text-xl font-serif font-medium text-slate-800 mb-2">Información del Perfil</h3>
            <p className="text-sm text-slate-500 font-light">Actualizá tus datos públicos para el turnero y la plataforma.</p>
          </div>
          
          <div className="p-8 md:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-slate-50">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative">
                   <Image src="/fotoNutri.png" alt="Profile" fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload size={20} className="text-white" />
                </div>
              </div>
              <div>
                <Button variant="outline" className="text-[10px] uppercase tracking-widest font-bold rounded-xl border-slate-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all">
                  Subir nueva foto
                </Button>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Recomendado: 500x500px (JPG o PNG). Max 2MB.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">Nombre Completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" defaultValue="Lic. Yesica M. García" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-11 pr-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-700 font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">Especialidad</label>
                <div className="relative">
                  <Apple size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" defaultValue="Nutrición Clínica y Deportiva" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-11 pr-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-700 font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">Matrícula</label>
                <div className="relative">
                  <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" defaultValue="MP 7250" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-11 pr-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-700 font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">WhatsApp de Contacto</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" defaultValue="5493364239851" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-11 pr-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-700 font-medium" />
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-end">
              <Button className="bg-primary text-white hover:bg-primary/90 rounded-2xl px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-bold shadow-xl shadow-primary/20 transition-transform hover:-translate-y-0.5">
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}

      {ajustesTab === 'disponibilidad' && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden max-w-3xl">
          <div className="bg-gradient-to-r from-secondary/5 to-transparent p-8 md:p-10 border-b border-slate-100">
            <h3 className="text-xl font-serif font-medium text-slate-800 mb-2">Días y Horarios Laborables</h3>
            <p className="text-sm text-slate-500 font-light">Definí las franjas horarias en las que permitís que los pacientes reserven turnos.</p>
          </div>
          
          <div className="p-8 md:p-10">
            <div className="space-y-3">
              {disponibilidad.map((day) => (
                <div 
                  key={day.day} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[1.5rem] border transition-all duration-300 ${
                    day.isActive 
                      ? 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5' 
                      : 'border-slate-100 bg-slate-50/50 opacity-60 grayscale-[50%]'
                  }`}
                >
                  <div className="flex items-center gap-4 w-32">
                    <button 
                      onClick={() => handleToggleDay(day.day)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${day.isActive ? 'bg-primary' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${day.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className={`font-medium text-sm ${day.isActive ? 'text-slate-800' : 'text-slate-500'}`}>{day.day}</span>
                  </div>
                  
                  {day.isActive ? (
                    <div className="flex-1 flex items-center justify-center sm:justify-end gap-3">
                      <div className="relative group">
                        <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" />
                        <input 
                          type="time" 
                          value={day.startTime}
                          onChange={(e) => handleTimeChange(day.day, 'startTime', e.target.value)}
                          className="bg-slate-50/80 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-700 font-medium w-full sm:w-auto" 
                        />
                      </div>
                      <span className="text-slate-300 font-medium">a</span>
                      <div className="relative group">
                        <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" />
                        <input 
                          type="time" 
                          value={day.endTime}
                          onChange={(e) => handleTimeChange(day.day, 'endTime', e.target.value)}
                          className="bg-slate-50/80 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-700 font-medium w-full sm:w-auto" 
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-end">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-2 bg-slate-100 rounded-lg">Cerrado</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-10 flex justify-end">
              <Button 
                onClick={handleSaveAvailability}
                disabled={loading}
                className="bg-primary text-white hover:bg-primary/90 rounded-2xl px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-bold shadow-xl shadow-primary/20 transition-transform hover:-translate-y-0.5"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Guardar Disponibilidad'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {editingService && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm" onClick={() => setEditingService(null)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-serif font-medium text-slate-800 mb-8">
              {editingService.id ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Nombre del Servicio</label>
                <input 
                  type="text" 
                  value={editingService.name}
                  onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm outline-none focus:border-primary/50 transition-all"
                  placeholder="Ej: Primera Consulta"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Precio ($)</label>
                  <input 
                    type="number" 
                    value={editingService.price}
                    onChange={(e) => setEditingService({...editingService, price: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm outline-none focus:border-primary/50 transition-all"
                    placeholder="40000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Duración</label>
                  <input 
                    type="text" 
                    value={editingService.duration}
                    onChange={(e) => setEditingService({...editingService, duration: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm outline-none focus:border-primary/50 transition-all"
                    placeholder="60 min"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Seleccionar Icono</label>
                <div className="grid grid-cols-5 gap-2">
                  {availableIcons.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setEditingService({...editingService, icon_name: item.name})}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
                        editingService.icon_name === item.name 
                          ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                          : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <item.icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1 bg-primary text-white hover:bg-primary/90 h-14 rounded-2xl text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-primary/10">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : 'Guardar Cambios'}
                </Button>
                <Button type="button" onClick={() => setEditingService(null)} variant="outline" className="flex-1 h-14 rounded-2xl text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex font-sans selection:bg-primary/20 selection:text-primary">
      {/* Sidebar Navigation - Sleeker */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-secondary text-white transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 border-r border-slate-800
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col py-8 px-6">
          <div className="flex items-center gap-4 px-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 border border-slate-50">
              <Image src="/logo.png" alt="Logo" width={40} height={40} priority className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-white/90 text-sm tracking-tight">Lic. Yesica M. García</span>
              <span className="text-[9px] uppercase tracking-widest text-primary font-bold">Nutrición & Bienestar</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'agenda', label: 'Agenda', icon: CalendarIcon },
              { id: 'pacientes', label: 'Directorio', icon: Users },
              { id: 'pagos', label: 'Finanzas', icon: CreditCard },
              { id: 'ajustes', label: 'Ajustes', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id as DashboardSection);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium
                  ${activeSection === item.id 
                    ? 'bg-white/10 text-white border border-white/5 shadow-sm' 
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
              >
                <item.icon size={16} className={`${activeSection === item.id ? 'text-primary' : 'text-white/40'}`} />
                <span className="tracking-wide">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-black/20 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-serif text-xs font-medium shrink-0">
                YG
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-white/90 truncate">Yesica G.</div>
                <div className="text-[8px] text-white/40 uppercase tracking-widest font-bold truncate">Nutrición</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium border border-transparent hover:border-red-500/20"
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>

          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Subtle top blur gradient */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-10" />

        <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-100 p-5 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-lg p-1 flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={24} height={24} priority className="brightness-0 invert opacity-90" />
            </div>
            <span className="font-serif font-medium text-slate-800">Clinical Suite</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-8 md:p-10 lg:p-12 scroll-smooth">
          <div className="max-w-[1200px] mx-auto pb-12">
            {activeSection === 'overview' && renderOverview()}
            {activeSection === 'agenda' && renderAgenda()}
            {activeSection === 'pacientes' && renderPacientes()}
            {activeSection === 'pagos' && renderPagos()}
            {activeSection === 'ajustes' && renderAjustes()}
          </div>
        </main>
      </div>

      {isPatientModalOpen && renderPatientModal()}
    </div>
  );
}
