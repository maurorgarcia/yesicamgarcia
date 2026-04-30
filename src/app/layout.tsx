import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Lic. Yesica M. García | Nutrición Clínica & Deportiva Especializada",
  description: "Plataforma profesional de nutrición basada en evidencia. Planes personalizados, antropometría ISAK y consultoría nutricional especializada para deportistas y pacientes clínicos.",
  keywords: ["nutricionista", "nutrición deportiva", "nutrición clínica", "Yesica García", "planes de alimentación", "antropometría", "ISAK", "salud", "bienestar"],
  authors: [{ name: "Lic. Yesica M. García" }],
  creator: "Mauro Garcia (mrgdev)",
  publisher: "Lic. Yesica M. García",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://licyesicamgarcia.vercel.app"),
  alternates: {
    canonical: "/",
  },
  category: 'health',
  classification: 'Medical Nutrition',
  openGraph: {
    title: "Lic. Yesica M. García | Nutrición Clínica & Deportiva",
    description: "Planes nutricionales 100% personalizados basados en evidencia científica. Especialista en nutrición clínica, deportiva y antropometría ISAK II.",
    url: "https://licyesicamgarcia.com",
    siteName: "Lic. Yesica M. García - Nutricionista",
    images: [
      {
        url: "/fotoNutri.png",
        width: 1200,
        height: 630,
        alt: "Lic. Yesica M. García - Nutrición Profesional",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lic. Yesica M. García | Nutrición Clínica & Deportiva",
    description: "Nutrición basada en ciencia para deportistas y pacientes clínicos.",
    images: ["/fotoNutri.png"],
    creator: "@licyesicamgarcia",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

import JsonLd from "@/components/seo/JsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${plusJakarta.variable} ${outfit.variable} h-full antialiased overflow-x-hidden`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden" suppressHydrationWarning>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
