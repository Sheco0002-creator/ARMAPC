import type { Metadata } from "next";
import { IdiomaProvider } from "@/i18n/Idioma";
import { SITIO_URL } from "@/i18n/rutas";

// Rama española: las mismas vistas que la inglesa, bajo /es y con palabras en español.
export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
  openGraph: { locale: "es_US", alternateLocale: ["en_US"] },
};

export default function RamaEspanola({ children }: { children: React.ReactNode }) {
  return <IdiomaProvider lang="es">{children}</IdiomaProvider>;
}
