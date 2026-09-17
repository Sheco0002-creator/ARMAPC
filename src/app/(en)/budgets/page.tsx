import type { Metadata } from "next";
import { PresupuestosVista } from "@/components/vistas/PresupuestosVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "PC Budgets by Level 2026 — Real Prices in USD | ARMAPC",
  description:
    "Tested gaming, streaming and local AI builds for every budget, with real US prices in USD and no bottlenecks.",
  alternates: alternativas("presupuestos", "en"),
};

export default function BudgetsPage() {
  return <PresupuestosVista />;
}
