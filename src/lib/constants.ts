export const SITE_CONFIG = {
  name: 'Lic. Yesica M. García',
  profession: 'Nutricionista',
  mp: '7250',
  whatsappNumber: '5493364671229',
  instagram: 'lic.yesicamgarcia',
  email: 'lic.yesicamgarcia@gmail.com', // Updated for consistency
  locations: {
    cemir: {
      name: 'Centro CEMIR',
      address: 'Pellegrini 291, San Nicolás de Los Arroyos',
      mapUrl: 'https://maps.app.goo.gl/P6nF8vXzG9H2', // Placeholder for correct search
      schedules: 'Martes (8-12h) y Jueves (desde el mediodía)'
    },
    xtreme: {
      name: 'XTREME',
      address: 'Av. Hipólito Irigoyen 874, San Nicolás de Los Arroyos',
      mapUrl: 'https://maps.app.goo.gl/P6nF8vXzG9H3', // Placeholder for correct search
      schedules: 'Lunes, Miércoles y Viernes (A coordinar)'
    }
  }
};

export const SCHEDULES: Record<number, string[]> = {
  1: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'], // Lunes
  2: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'], // Martes (Cemir)
  3: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'], // Miércoles
  4: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'], // Jueves (Cemir)
  5: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'], // Viernes
};
