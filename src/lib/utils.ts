import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatWhatsAppMessage = (name: string, date: string, time: string, modality?: string, location?: string, service?: string) => {
  const message = `Hola Yesica, me gustaría confirmar un turno.\n\n👤 Nombre: ${name}\n🏥 Servicio: ${service}\n📅 Fecha: ${date}\n⏰ Horario: ${time}${location ? `\n📍 Lugar: ${location}` : ''}${modality ? `\n💳 Pago: ${modality}` : ''}\n\n¡Muchas gracias!`;
  return encodeURIComponent(message);
};

export const getWhatsAppUrl = (phone: string, message: string) => {
  return `https://wa.me/${phone}?text=${message}`;
};
