/**
 * ==============================================================================
 * ARMAPC // CONFIGURACIÓN DE PÁGINA "CONTACTO" (contactConfig.ts)
 * ==============================================================================
 * Puedes editar aquí los motivos del formulario, correos y notas de atención.
 * ==============================================================================
 */

export const contactConfig = {
  // 1. Correo de Recepción
  destinationEmail: "contacto@tupcgamer.com",

  // 2. Tiempos de Respuesta y Horarios
  responseTime: {
    es: "Respondemos usualmente en menos de 24 horas hábiles.",
    en: "We typically respond within 24 business hours.",
  },

  // 3. Motivos de Consulta (Desplegable del formulario)
  // Agrega o modifica opciones en español e inglés
  topics: [
    {
      id: "compatibility",
      es: "Consulta técnica sobre compatibilidad o ensamble",
      en: "Technical inquiry on compatibility or build",
    },
    {
      id: "pricing",
      es: "Reporte de precio o stock desactualizado (Amazon, Newegg, Best Buy, etc.)",
      en: "Outdated price or stock report (Amazon, Newegg, Best Buy, etc.)",
    },
    {
      id: "guide-suggestion",
      es: "Sugerencia para nueva guía educativa o componente",
      en: "Suggestion for a new guide or hardware component",
    },
    {
      id: "legal",
      es: "Notificaciones legales / Solicitud de Privacidad CCPA / DMCA",
      en: "Legal notices / CCPA privacy request / DMCA",
    },
    {
      id: "partnership",
      es: "Propuesta comercial, prensa o colaboración editorial",
      en: "Business proposal, press or editorial partnership",
    },
  ],

  // 4. Encabezados de la Página
  header: {
    badgeEs: "[ COMUNICACIÓN DIRECTA // ATENCIÓN EE.UU. & GLOBAL ]",
    badgeEn: "[ DIRECT CONTACT // US & GLOBAL SUPPORT ]",
    titleEs: "Escríbenos. Leemos cada mensaje.",
    titleEn: "Write to us. We read every message.",
    subtitleEs:
      "¿Tienes una duda técnica sobre compatibilidad, encontraste un precio desactualizado en tiendas de EE.UU. o deseas sugerir una nueva guía? Nuestro equipo técnico está a tu disposición.",
    subtitleEn:
      "Have a technical question about compatibility, found an outdated price at a US store, or want to suggest a new guide? Our tech team is here to help.",
  },
};
