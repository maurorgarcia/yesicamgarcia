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
  is_paid: boolean;
  payment_method?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  icon_name?: string;
}
