import type { Metadata } from "next";
import { GuiasView } from "@/components/GuiasView";
import { alternativas } from "@/i18n/rutas";

export const metadata: Metadata = {
  title: "Gaming PC Guide 2026 | Hardware, Compatibility & Budgets | ARMAPC",
  description:
    "Learn to build your own gaming PC step by step. Check socket compatibility, estimate wattage, see real prices without markup and get easy explanations of CPUs, GPUs, RAM and motherboards.",
  alternates: alternativas("guias", "en"),
};

export default function GuidesPage() {
  return <GuiasView isRoot={true} />;
}
