import type { Metadata } from "next";
import { SobreVista } from "@/components/vistas/SobreVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "About Us — Hardware Architecture & Mission | ARMAPC 2026",
  description:
    "Why ArmaPC exists: the independent hardware guide to build your PC in the United States and worldwide, with real USD prices and no markups.",
  alternates: alternativas("sobre", "en"),
};

export default function AboutPage() {
  return <SobreVista lang="en" />;
}
