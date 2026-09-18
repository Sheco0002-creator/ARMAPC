/**
 * ==============================================================================
 * ARMAPC // CONFIGURACIÓN DE PÁGINA "SOBRE NOSOTROS" (aboutConfig.ts)
 * ==============================================================================
 * Puedes editar aquí las estadísticas, pilares editoriales y textos de misión.
 * ==============================================================================
 */

export const aboutConfig = {
  // 1. Estadísticas Destacadas
  metrics: [
    {
      id: "components",
      value: "329",
      labelEs: "Componentes Verificados",
      labelEn: "Verified Components",
      subEs: "Fichas técnicas auditadas",
      subEn: "Audited spec sheets",
    },
    {
      id: "builds",
      value: "44",
      labelEs: "Presupuestos Equilibrados",
      labelEn: "Balanced Builds",
      subEs: "Gaming, Streaming e IA",
      subEn: "Gaming, Streaming & AI",
    },
    {
      id: "coverage",
      value: "100%",
      labelEs: "Independencia Editorial",
      labelEn: "Editorial Independence",
      subEs: "Cero recomendaciones pagadas",
      subEn: "Zero paid placements",
    },
    {
      id: "pricing",
      value: "$0",
      labelEs: "Acceso Libre y Gratuito",
      labelEn: "Free Open Access",
      subEs: "Sin suscripciones ni barreras",
      subEn: "No paywalls or fees",
    },
  ],

  // 2. Pilares Fundamentales
  pillars: [
    {
      id: "presupuestos",
      numero: "01",
      tituloEs: "Presupuestos Reales en USD",
      tituloEn: "Real Budgets in USD",
      textoEs:
        "Configuraciones balanceadas por nivel para gaming, streaming e IA local, basadas en precios oficiales MSRP y minoristas de referencia en EE.UU. (Amazon, Newegg, Best Buy, Micro Center).",
      textoEn:
        "Balanced builds for every level, for gaming, streaming and local AI, based on official MSRP and reference US retailers (Amazon, Newegg, Best Buy, Micro Center).",
    },
    {
      id: "configurador",
      numero: "02",
      tituloEs: "Configurador Inteligente",
      tituloEn: "Smart Configurator",
      textoEs:
        "Motor interactivo que valida en tiempo real sockets, dimensiones de tarjeta gráfica frente al gabinete y demanda eléctrica en watts para evitar fuentes cortas.",
      textoEn:
        "An interactive engine that checks sockets, graphics card size against the case, and power draw in watts in real time, so your power supply is never too small.",
    },
    {
      id: "guias",
      numero: "03",
      tituloEs: "Guías Didácticas Claras",
      tituloEn: "Clear, Practical Guides",
      textoEs:
        "Explicaciones técnicas rigurosas redactadas en lenguaje llano y directo, sin dar por sentado que ya eres ingeniero ni abrumarte con tecnicismos vacíos.",
      textoEn:
        "Rigorous technical explanations in plain, direct language, without assuming you're already an engineer or burying you in empty jargon.",
    },
    {
      id: "setup",
      numero: "04",
      tituloEs: "Setup Completo",
      tituloEn: "Full Setup",
      textoEs:
        "Monitor, teclado, ratón, audio, silla y kit de streaming a la altura de tu PC, con modelos reales por nivel. Tu PC y tu setup se suman en una sola lista y un solo PDF.",
      textoEn:
        "Monitor, keyboard, mouse, audio, chair and streaming kit to match your PC, with real models for each level. Your PC and your setup add up in one list and one PDF.",
    },
  ],

  // 3. Manifiesto
  manifesto: {
    badgeEs: "[ MANIFIESTO EDITORIAL // EE.UU. & MERCADO GLOBAL ]",
    badgeEn: "[ EDITORIAL MANIFESTO // US & GLOBAL MARKET ]",
    headlineEs: "Armar tu propia PC gamer no debería ser un privilegio de expertos.",
    headlineEn: "Building your own gaming PC shouldn't be a privilege for experts.",
    leadEs:
      "Con la información correcta, cualquiera puede hacerlo: aprovechando la transparencia del mercado de hardware en Estados Unidos y a nivel mundial, ahorrando dinero y entendiendo con exactitud cada componente que compras.",
    leadEn:
      "With the right information, anyone can do it: taking advantage of how transparent the hardware market is in the United States and worldwide, saving money and understanding exactly every part you buy.",
  },
};
