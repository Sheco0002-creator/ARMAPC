import type { Metadata } from "next";
import { ConfiguradorVista } from "@/components/vistas/ConfiguradorVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Configurador de PC 2026 — Compatibilidad y Wattage | ARMAPC",
  description:
    "Arma tu PC pieza por pieza con verificación en tiempo real: sockets, tipo de RAM, espacio en el gabinete, cables y consumo, con precios reales de EE.UU. en USD.",
  alternates: alternativas("configurador", "es"),
};

export default function ConfiguradorPage() {
  return <ConfiguradorVista />;
}
