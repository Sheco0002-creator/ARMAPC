import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
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

// Título y descripción de cada página: en su page.tsx de app/(en) o app/es (Guías incluida desde el 17-09-2026).
export const metadata: Metadata = {
  title: "ARMAPC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Placeholder para Google AdSense - Configura tu client id cuando esté aprobado:
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
        */}
      </head>
      <body className="min-h-screen bg-[#08090a] text-white font-sans antialiased selection:bg-white selection:text-black">
        {/* Video de Fondo Centralizado para Todo el Sitio (Velo 30%) */}
        <StaticBackgroundVideo
          src={mediaAssets.finalPage.videoUrl}
          overlayOpacity="bg-black/30"
          showGradient={false}
        />
        {children}
      </body>
    </html>
  );
}
