import type { Metadata } from "next";
import { ConfiguradorVista } from "@/components/vistas/ConfiguradorVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "PC Configurator 2026 — Compatibility & Wattage | ARMAPC",
  description:
    "Build your PC part by part with real-time checks: sockets, RAM type, case clearance, cables and power draw, with real US prices in USD.",
  alternates: alternativas("configurador", "en"),
};

export default function ConfiguratorPage() {
  return <ConfiguradorVista />;
}
