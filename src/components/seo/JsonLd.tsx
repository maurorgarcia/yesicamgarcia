export default function JsonLd() {
  const businessData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Lic. Yesica M. García | Nutrición Clínica & Deportiva",
    "image": "https://licyesicamgarcia.com/fotoNutri.png",
    "@id": "https://licyesicamgarcia.com",
    "url": "https://licyesicamgarcia.com",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "San Nicolás de los Arroyos",
      "addressLocality": "San Nicolás",
      "addressRegion": "Buenos Aires",
      "postalCode": "2900",
      "addressCountry": "AR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -33.3333,
      "longitude": -60.2167
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.instagram.com/lic.yesicamgarcia"
    ],
    "description": "Especialista en Nutrición Clínica y Deportiva. Antropometría ISAK II. Planes personalizados basados en evidencia científica."
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }}
    />
  )
}
