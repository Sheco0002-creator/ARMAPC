import type { Metadata } from "next";
import { TerminosVista } from "@/components/vistas/TerminosVista";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Terms and Conditions | ARMAPC (US & Global)",
  description:
    "ArmaPC terms of use. Legal framework for the US and international market, FTC affiliate disclosures, hardware compatibility and DMCA.",
  alternates: alternativas("terminos", "en"),
};

export default function TermsPage() {
  return <TerminosVista lang="en" />;
}
