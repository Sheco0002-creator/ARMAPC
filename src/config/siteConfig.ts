/**
 * ==============================================================================
 * ARMAPC // CONFIGURACIÓN MAESTRA DEL SITIO WEB (siteConfig.ts)
 * ==============================================================================
 * Este archivo centraliza la información global de la web.
 * Puedes editar aquí textos, enlaces de redes sociales, anuncios superiores,
 * correos de contacto y opciones de navegación sin tocar componentes de código.
 * ==============================================================================
 */

export interface NavItemConfig {
  id: string;
  rutaKey: "guias" | "presupuestos" | "configurador" | "setup" | "sobre" | "contacto";
  labelEs: string;
  labelEn: string;
  badge?: {
    textEs: string;
    textEn: string;
    color?: string;
  };
}

export interface SocialLinkConfig {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
}

export const siteConfig = {
  // 1. Identidad de la Marca
  branding: {
    name: "ArmaPC",
    domain: "tupcgamer.com",
    url: "https://tupcgamer.com",
    tagline: {
      es: "Guía didáctica y arquitectura de hardware 2026",
      en: "Hands-on hardware guide and PC architecture 2026",
    },
    subtitle: {
      es: "Ensambla tu computadora sin cuellos de botella y verifica compatibilidades sin pagar sobreprecio.",
      en: "Build your computer without bottlenecks and check compatibility without overpaying.",
    },
  },

  // 2. Barra de Anuncio Superior (Banner opcional arriba del menú)
  // Cambia `enabled: true` para mostrar un anuncio a todos los visitantes.
  announcement: {
    enabled: true,
    badge: {
      es: "ACTUALIZADO 2026",
      en: "UPDATED 2026",
    },
    text: {
      es: "Auditoría de precios en vivo y compatibilidad para CPU, Placas, RAM y GPU",
      en: "Live market prices & compatibility audit for CPU, Motherboards, RAM and GPU",
    },
    linkRutaKey: "configurador" as const,
    linkText: {
      es: "Abrir Configurador →",
      en: "Open Configurator →",
    },
  },

  // 3. Información de Contacto
  contact: {
    email: "contacto@tupcgamer.com",
    supportResponseTime: {
      es: "Respondemos en menos de 24 horas",
      en: "We respond within 24 hours",
    },
    location: {
      es: "Estados Unidos & Internacional",
      en: "United States & Worldwide",
    },
  },

  // 4. Redes Sociales
  // Coloca la URL de tus perfiles y pon `enabled: true` para que aparezcan en el pie de página.
  socialLinks: [
    {
      id: "discord",
      name: "Discord",
      url: "https://discord.gg",
      enabled: false,
    },
    {
      id: "youtube",
      name: "YouTube",
      url: "https://youtube.com",
      enabled: false,
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      url: "https://x.com",
      enabled: false,
    },
    {
      id: "instagram",
      name: "Instagram",
      url: "https://instagram.com",
      enabled: false,
    },
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com/Sheco0002-creator/ARMAPC",
      enabled: true,
    },
  ] as SocialLinkConfig[],

  // 5. Navegación Principal (Enlaces del menú superior)
  navigation: [
    {
      id: "guias",
      rutaKey: "guias",
      labelEs: "Guías",
      labelEn: "Guides",
    },
    {
      id: "presupuestos",
      rutaKey: "presupuestos",
      labelEs: "Presupuestos",
      labelEn: "Budgets",
    },
    {
      id: "configurador",
      rutaKey: "configurador",
      labelEs: "Configurador",
      labelEn: "Configurator",
      badge: {
        textEs: "PRO",
        textEn: "PRO",
        color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      },
    },
    {
      id: "setup",
      rutaKey: "setup",
      labelEs: "Setup Completo",
      labelEn: "Full Setup",
    },
    {
      id: "sobre",
      rutaKey: "sobre",
      labelEs: "Sobre",
      labelEn: "About",
    },
  ] as NavItemConfig[],

  // 6. Pie de Página (Footer)
  footer: {
    copyright: {
      es: "© 2026 ARMAPC // GUÍA TÉCNICA DE HARDWARE INDEPENDIENTE",
      en: "© 2026 ARMAPC // INDEPENDENT HARDWARE GUIDE",
    },
    badge: {
      es: "OPTIMIZADO PARA EE.UU. & GLOBAL // CERO CUELLOS DE BOTELLA",
      en: "OPTIMIZED FOR US & GLOBAL MARKET // ZERO BOTTLENECKS",
    },
    legalNotice: {
      es: "* AVISO LEGAL & EDITORIAL: Todas las marcas comerciales, logotipos, nombres de productos e imágenes de hardware (AMD, Intel, NVIDIA, ASUS, Corsair, MSI, etc.) pertenecen a sus respectivos fabricantes y se exhiben con fines ilustrativos, didácticos y de referencia comparativa bajo la doctrina de uso nominativo. ARMAPC es un portal informativo independiente.",
      en: "* LEGAL & EDITORIAL NOTICE: All trademarks, logos, product names and hardware images (AMD, Intel, NVIDIA, ASUS, Corsair, MSI, etc.) belong to their respective manufacturers and are shown for illustrative, educational and comparative reference purposes under the nominative fair use doctrine. ARMAPC is an independent informational site.",
    },
  },
};
