import type { Metadata } from "next";
import { SetupVista } from "@/components/vistas/SetupVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Setup Completo 2026 — Monitor, Periféricos y Ergonomía | ARMAPC",
  description:
    "Sintoniza monitor, teclado, ratón, audio, silla y kit de streaming con el nivel de tu PC, con modelos reales y precios de EE.UU. Tu PC y tu setup se suman en una sola lista.",
  alternates: alternativas("setup", "es"),
};

export default function SetupCompletoPage() {
  return <SetupVista />;
}
