import type { Metadata } from "next";
import { ContactoVista } from "@/components/vistas/ContactoVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Contacto | ARMAPC 2026",
  description:
    "¿Dudas de compatibilidad de piezas, precios desactualizados en EE.UU. o sugerencias de guías? Escribe al equipo técnico de ArmaPC.",
  alternates: alternativas("contacto", "es"),
};

export default function ContactoPage() {
  return <ContactoVista />;
}
