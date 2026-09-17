import type { Metadata } from "next";
import { ContactoVista } from "@/components/vistas/ContactoVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Contact | ARMAPC 2026",
  description:
    "Questions about PC part compatibility, outdated US prices or guide suggestions? Write to the ArmaPC tech team.",
  alternates: alternativas("contacto", "en"),
};

export default function ContactPage() {
  return <ContactoVista />;
}
