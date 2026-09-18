"use client";

import React from "react";
import Link from "next/link";
import { ArmaPcLogo } from "@/components/ArmaPcLogo";
import { useIdioma } from "@/i18n/Idioma";
import { siteConfig } from "@/config/siteConfig";

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className = "bg-[#08090a]" }: SiteFooterProps) {
  const { tr, ruta } = useIdioma();
  const activeSocials = siteConfig.socialLinks.filter((s) => s.enabled);

  return (
    <footer className={`relative z-10 w-full text-white border-t border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-white/10">
          <div>
            <Link href={ruta("guias")} className="group inline-block select-none" aria-label={tr("ARMAPC - Guías", "ARMAPC - Guides")}>
              <ArmaPcLogo className="h-5 sm:h-6 w-auto" />
            </Link>
            <p className="text-xs text-gray-400 mt-2 max-w-md leading-relaxed font-mono">
              {tr(siteConfig.branding.subtitle.es, siteConfig.branding.subtitle.en)}
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

        {/* Redes Sociales si están activas */}
        {activeSocials.length > 0 && (
          <div className="py-4 border-b border-white/5 flex items-center gap-3 text-xs font-mono text-gray-400">
            <span className="text-[10px] uppercase tracking-wider text-gray-500">{tr("Comunidad & Redes:", "Community & Social:")}</span>
            <div className="flex items-center gap-2 flex-wrap">
              {activeSocials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:border-white/30 hover:text-white transition-all text-[11px]"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] font-mono tracking-widest uppercase text-gray-400 gap-4">
          <span>{tr(siteConfig.footer.copyright.es, siteConfig.footer.copyright.en)}</span>
          <span className="text-gray-400">
            {tr(siteConfig.footer.badge.es, siteConfig.footer.badge.en)}
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-mono text-gray-500 leading-relaxed">
          {tr(siteConfig.footer.legalNotice.es, siteConfig.footer.legalNotice.en)}
        </div>
      </div>
    </footer>
  );
}
