import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { StaticBackgroundVideo } from "@/components/StaticBackgroundVideo";
import { mediaAssets } from "@/data/mediaAssets";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Título y descripción base para todo el dominio tupcgamer.com
export const metadata: Metadata = {
  metadataBase: new URL("https://tupcgamer.com"),
  title: {
    default: "TuPCGamer — Arma tu PC Gamer Paso a Paso y Configurador",
    template: "%s | TuPCGamer",
  },
  description:
    "Guía interactiva de ensamblaje de PC gamer paso a paso, configurador de piezas con verificación de compatibilidad automática y presupuestos optimizados.",
  keywords: [
    "PC Gamer",
    "Armar PC",
    "Configurador de PC",
    "Guía de ensamblaje PC",
    "Presupuestos gamer",
    "Compatibilidad PC",
    "Gaming PC build",
  ],
  authors: [{ name: "TuPCGamer" }],
  creator: "TuPCGamer",
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: "en_US",
    url: "https://tupcgamer.com",
    siteName: "TuPCGamer",
    title: "TuPCGamer — Arma tu PC Gamer Paso a Paso y Configurador",
    description:
      "Guía interactiva de ensamblaje de PC gamer paso a paso, configurador con verificación de compatibilidad y presupuestos gamer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TuPCGamer — Arma tu PC Gamer Paso a Paso",
    description: "Guía interactiva de ensamblaje de PC gamer paso a paso y configurador de componentes.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#08090a] text-white font-sans antialiased selection:bg-white selection:text-black">
        {/* Video de Fondo Centralizado para Todo el Sitio (Velo 30%) */}
        <StaticBackgroundVideo
          src={mediaAssets.finalPage.videoUrl}
          overlayOpacity="bg-black/30"
          showGradient={false}
        />
        {children}
        {/* Métricas de tráfico y rendimiento de Vercel en tiempo real */}
        <Analytics />
        <SpeedInsights />
        {/* Google Analytics 4 oficial de Next.js */}
        <GoogleAnalytics gaId="G-GH7D533JHR" />
      </body>
    </html>
  );
}
