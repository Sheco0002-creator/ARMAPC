import type { Metadata } from "next";
import { GuiasView } from "@/components/GuiasView";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Guía PC Gamer 2026 | Arquitectura de Hardware, Compatibilidad y Presupuestos | ARMAPC",
  description:
    "Aprende a armar tu propia PC Gamer paso a paso. Consulta compatibilidad de sockets, estimación de wattage, costos reales sin sobreprecio y explicaciones didácticas de CPU, GPU, RAM y Placas Base.",
  keywords: ["PC Gamer", "Armar PC", "Hardware", "CPU", "GPU", "Compatibilidad PC", "Presupuesto PC Gamer", "Guía de Hardware 2026"],
  alternates: alternativas("guias", "es"),
};

export default function GuiasPage() {
  return <GuiasView isRoot={true} />;
}
