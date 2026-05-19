import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lic. Yesica M. García | Turnero Nutrición Online San Nicolás",
  description:
    "Sacá tu turno online en 3 simples pasos con la Lic. Yesica M. García. Consulta Nutricional, Antropometría y planes personalizados en San Nicolás.",
  keywords: [
    "nutricionista san nicolas",
    "turnera yesica garcia",
    "lic yesica garcia",
    "antropometria san nicolas",
    "consulta nutricional online",
    "nutricion integral san nicolas",
    "sacar turno nutricionista",
  ],
  authors: [{ name: "Lic. Yesica M. García" }],
  creator: "Lic. Yesica M. García",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Lic. Yesica M. García | Turnero Nutrición Online",
    description:
      "Reservá tu consulta de nutrición o antropometría de forma rápida y cómoda. Consultorios en Cemir, GO Zona Sur y Xtreme.",
    siteName: "Turnero Lic. Yesica M. García",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Lic. Yesica M. García | Turnero Nutrición",
    description: "Sacá tu turno online de forma rápida y sencilla.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
