import type { Metadata } from "next";
import { SetupVista } from "@/components/vistas/SetupVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Full Setup 2026 — Monitor, Peripherals & Ergonomics | ARMAPC",
  description:
    "Match your monitor, keyboard, mouse, audio, chair and streaming kit to your PC's level, with real models and US prices. Your PC and setup add up in one list.",
  alternates: alternativas("setup", "en"),
};

export default function FullSetupPage() {
  return <SetupVista />;
}
