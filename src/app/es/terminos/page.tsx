import type { Metadata } from "next";
import { TerminosVista } from "@/components/vistas/TerminosVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Términos y Condiciones (T&C) | ARMAPC (EE.UU. & Global)",
  description:
    "Términos y condiciones de uso de ArmaPC. Marco legal para EE.UU. y mercado internacional, avisos de afiliados FTC, compatibilidad de hardware y DMCA.",
  alternates: alternativas("terminos", "es"),
};

export default function TerminosPage() {
  return <TerminosVista lang="es" />;
}
