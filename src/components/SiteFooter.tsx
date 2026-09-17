"use client";

import React from "react";
import Link from "next/link";
import { ArmaPcLogo } from "@/components/ArmaPcLogo";
import { useIdioma } from "@/i18n/Idioma";

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className = "bg-[#08090a]" }: SiteFooterProps) {
  const { tr, ruta } = useIdioma();
  return (
    <footer className={`relative z-10 w-full text-white border-t border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-white/10">
          <div>
            <Link href={ruta("guias")} className="group inline-block select-none" aria-label={tr("ARMAPC - Guías", "ARMAPC - Guides")}>
              <ArmaPcLogo className="h-5 sm:h-6 w-auto" />
            </Link>
            <p className="text-xs text-gray-400 mt-2 max-w-md leading-relaxed font-mono">
              {tr(
                "Guía didáctica y arquitectura de hardware 2026. Ensambla tu computadora sin cuellos de botella y verifica compatibilidades sin pagar sobreprecio.",
                "A hands-on hardware guide for 2026. Build your computer without bottlenecks and check compatibility without overpaying."
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px] font-mono tracking-widest uppercase text-gray-400">
            <Link href={ruta("guias")} className="hover:text-white transition-colors">
              {tr("Guías", "Guides")}
            </Link>
            <Link href={ruta("presupuestos")} className="hover:text-white transition-colors">
              {tr("Presupuestos", "Budgets")}
            </Link>
            <Link href={ruta("configurador")} className="hover:text-white transition-colors">
              {tr("Configurador", "Configurator")}
            </Link>
            <Link href={ruta("setup")} className="hover:text-white transition-colors">
              {tr("Setup Completo", "Full Setup")}
            </Link>
            <Link href={ruta("sobre")} className="hover:text-white transition-colors">
              {tr("Sobre Nosotros", "About Us")}
            </Link>
            <Link href={ruta("contacto")} className="hover:text-white transition-colors">
              {tr("Contacto", "Contact")}
            </Link>
            <Link href={ruta("privacidad")} className="hover:text-white transition-colors">
              {tr("Privacidad", "Privacy")}
            </Link>
            <Link href={ruta("terminos")} className="hover:text-white transition-colors">
              {tr("T&C", "Terms")}
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] font-mono tracking-widest uppercase text-gray-400 gap-4">
          <span>{tr("(C) 2026 ARMAPC // GUÍA TÉCNICA DE HARDWARE INDEPENDIENTE", "(C) 2026 ARMAPC // INDEPENDENT HARDWARE GUIDE")}</span>
          <span className="text-gray-400">
            {tr("OPTIMIZADO PARA GOOGLE ADSENSE // CERO CUELLOS DE BOTELLA", "OPTIMIZED FOR GOOGLE ADSENSE // ZERO BOTTLENECKS")}
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-mono text-gray-500 leading-relaxed">
          {tr(
            "* AVISO LEGAL & EDITORIAL: Todas las marcas comerciales, logotipos, nombres de productos e imágenes de hardware (AMD, Intel, NVIDIA, ASUS, Corsair, MSI, etc.) pertenecen a sus respectivos fabricantes y se exhiben con fines ilustrativos, didácticos y de referencia comparativa bajo la doctrina de uso nominativo. ARMAPC es un portal informativo independiente.",
            "* LEGAL & EDITORIAL NOTICE: All trademarks, logos, product names and hardware images (AMD, Intel, NVIDIA, ASUS, Corsair, MSI, etc.) belong to their respective manufacturers and are shown for illustrative, educational and comparative reference purposes under the nominative fair use doctrine. ARMAPC is an independent informational site."
          )}
        </div>
      </div>
    </footer>
  );
}
