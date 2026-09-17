import type { Metadata } from "next";
import { SobreVista } from "@/components/vistas/SobreVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Sobre Nosotros — Arquitectura de Hardware & Misión | ARMAPC 2026",
  description:
    "Conoce por qué nació ArmaPC: la guía técnica independiente de hardware para armar tu PC en Estados Unidos y a nivel mundial en español, con precios reales en USD sin sobreprecio.",
  alternates: alternativas("sobre", "es"),
};

export default function SobreNosotrosPage() {
  return <SobreVista lang="es" />;
}
