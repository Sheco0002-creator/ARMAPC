"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, SlidersHorizontal, BookOpen, Layers, Info, Mail, Shield, Home, Monitor } from "lucide-react";

import { ArmaPcLogo } from "@/components/ArmaPcLogo";
import { SelectorIdioma } from "@/components/SelectorIdioma";
import { useIdioma } from "@/i18n/Idioma";
import { siteConfig } from "@/config/siteConfig";

interface SiteHeaderProps {
  onOpenCalculator?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  guias: BookOpen,
  presupuestos: Layers,
  configurador: SlidersHorizontal,
  setup: Monitor,
  sobre: Info,
  contacto: Mail,
};

export function SiteHeader({ onOpenCalculator }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { tr, ruta } = useIdioma();

  const navLinks = siteConfig.navigation.map((item) => ({
    href: ruta(item.rutaKey),
    label: tr(item.labelEs, item.labelEn),
    badge: item.badge ? tr(item.badge.textEs, item.badge.textEn) : undefined,
    badgeColor: item.badge?.color,
    icon: ICON_MAP[item.id] || BookOpen,
  }));

  return (
    <header className="relative w-full z-40 bg-[#08090a]/90 backdrop-blur-md border-b border-white/10 text-white">
      {/* Barra de Anuncio Superior Configurable */}
      {siteConfig.announcement.enabled && (
        <aside aria-label={tr("Aviso del sitio", "Site announcement")} className="bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-1.5 text-[11px] font-mono text-center flex items-center justify-center gap-2 flex-wrap text-emerald-200">
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-bold text-emerald-300">
            {tr(siteConfig.announcement.badge.es, siteConfig.announcement.badge.en)}
          </span>
          <span>{tr(siteConfig.announcement.text.es, siteConfig.announcement.text.en)}</span>
          <Link
            href={ruta(siteConfig.announcement.linkRutaKey)}
            className="underline hover:text-white transition-colors font-semibold text-emerald-300 ml-1"
          >
            {tr(siteConfig.announcement.linkText.es, siteConfig.announcement.linkText.en)}
          </Link>
        </aside>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo con animación arquitectónica */}
        <Link href={ruta("guias")} className="group flex items-center select-none" aria-label={tr("ARMAPC - Guías", "ARMAPC - Guides")}>
          <ArmaPcLogo animated className="h-4 sm:h-[18px] w-auto" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-[11px] font-mono tracking-[0.18em] uppercase">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 relative flex items-center gap-1.5 ${
                  isActive ? "text-white font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[8px] font-mono px-1 py-0.2 rounded font-bold ${link.badgeColor || "bg-white/10 text-gray-300"}`}>
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-white"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Open Modal or Mobile Menu */}
        <div className="flex items-center gap-3">
          <SelectorIdioma />
          {onOpenCalculator && (
            <button
              onClick={onOpenCalculator}
              className="hidden md:inline-flex items-center gap-2 bg-white text-black text-[10px] font-mono tracking-widest uppercase font-semibold px-4 py-2 rounded hover:bg-gray-200 transition-all cursor-pointer shadow-sm"
            >
              <SlidersHorizontal size={12} />
              <span>Simulador USD</span>
            </button>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={tr("Abrir menú", "Open menu")}
            className="lg:hidden p-2 text-white focus:outline-none cursor-pointer"
          >
            <div className="flex flex-col gap-[5px] w-6">
              <span
                className={`h-[1.5px] bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-[6.5px]" : ""
                }`}
              />
              <span
                className={`h-[1.5px] bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[1.5px] bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#0d0f12]/98 border-b border-gray-800 px-6 py-6 space-y-4 font-mono text-xs tracking-widest uppercase shadow-2xl"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2 border-b border-gray-900 ${
                    isActive ? "text-white font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={14} />
                    {link.label}
                  </span>
                  <ArrowRight size={12} className="text-gray-600" />
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href={ruta("configurador")}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full inline-flex justify-center items-center gap-2 bg-white text-black py-2.5 rounded font-mono text-xs uppercase font-semibold"
              >
                <SlidersHorizontal size={13} />
                {tr("Ir al Configurador", "Go to Configurator")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
