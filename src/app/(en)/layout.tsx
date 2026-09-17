import type { Metadata } from "next";
import { IdiomaProvider } from "@/i18n/Idioma";
import { SITIO_URL } from "@/i18n/rutas";

// Rama inglesa (idioma principal): las secciones traducidas, sin prefijo en la dirección.
// El grupo (en) no aparece en la URL; sólo reúne las páginas que comparten este idioma.
export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
  keywords: ["Gaming PC", "PC build", "PC builder", "Hardware", "CPU", "GPU", "PC compatibility", "Gaming PC budget", "2026"],
  openGraph: { locale: "en_US", alternateLocale: ["es_US"] },
};

export default function RamaInglesa({ children }: { children: React.ReactNode }) {
  return <IdiomaProvider lang="en">{children}</IdiomaProvider>;
}
