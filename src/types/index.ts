export type AppointmentStatus = 'pendiente' | 'confirmado' | 'cancelado';

export interface Appointment {
  id: string;
  created_at: string;
  date: string;
  time: string;
  full_name: string;
  phone: string;
  email: string;
  modality: string;
  location: string;
  status: AppointmentStatus;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price?: string;
}
