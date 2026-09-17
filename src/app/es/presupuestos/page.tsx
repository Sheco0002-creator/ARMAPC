import type { Metadata } from "next";
import { PresupuestosVista } from "@/components/vistas/PresupuestosVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Presupuestos de PC por Nivel 2026 — Precios reales en USD | ARMAPC",
  description:
    "Configuraciones probadas de gaming, streaming e IA local para cada presupuesto, con precios reales de EE.UU. en USD y sin cuellos de botella.",
  alternates: alternativas("presupuestos", "es"),
};

export default function PresupuestosPage() {
  return <PresupuestosVista />;
}
