import type { Metadata } from "next";
import { PrivacidadVista } from "@/components/vistas/PrivacidadVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Privacy Policy | ARMAPC (US & Global)",
  description:
    "ArmaPC privacy policy under US regulations (CCPA/CPRA, COPPA) and global data protection and Google AdSense standards.",
  alternates: alternativas("privacidad", "en"),
};

export default function PrivacyPage() {
  return <PrivacidadVista lang="en" />;
}
