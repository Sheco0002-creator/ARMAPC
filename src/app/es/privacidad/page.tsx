import type { Metadata } from "next";
import { PrivacidadVista } from "@/components/vistas/PrivacidadVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Política de Privacidad | ARMAPC (EE.UU. & Global)",
  description:
    "Política de privacidad de ArmaPC conforme a normativas de Estados Unidos (CCPA/CPRA, COPPA) y estándares globales de protección de datos y Google AdSense.",
  alternates: alternativas("privacidad", "es"),
};

export default function PrivacidadPage() {
  return <PrivacidadVista lang="es" />;
}
