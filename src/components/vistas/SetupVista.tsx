"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import {
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RotateCcw,
  Search,
  Share2,
  Printer,
  Sparkles,
  Info,
  X,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Gauge,
  Database,
  Layers,
  Sparkle,
  Zap,
  ExternalLink,
  Video,
  Droplets,
  Plus,
} from "lucide-react";
import { useConfiguratorStore, TierType } from "@/store/useConfiguratorStore";
import { setupPeripheralsData } from "@/data/setupPeripherals";
import { AvisoPrecios, textoPreciosConFechas } from "@/components/AvisoPrecios";
import { VistaPreviaFlotante, vistaPrevia, ampliarAlTocar } from "@/components/VistaPreviaProducto";
import { InformeEquipo } from "@/components/InformeEquipo";
// Periféricos reales, precios y la PC guardada: compartidos con el configurador y presupuestos
import {
  SETUP_PRODUCTS,
  productosDe,
  precioModulo,
  hayAlternativas,
  usd,
  MODULOS_SETUP,
  nombreModulo,
  nombreNivelSetup,
  tipoDe,
  totalSetup as calcularTotalSetup,
  totalStreaming as calcularTotalStreaming,
  totalLiquidos as calcularTotalLiquidos,
  productosPorDefecto,
  calcularTotalProductos,
  lineasSetupSeleccionado,
  lineasSetup,
  piezasPc,
  CATEGORIAS_OBLIGATORIAS,
  totalPc,
  precioPiezaTexto,
  useEquipo,
  useCargarEquipo,
  useSemillaAzar,
  indiceAlAzar,
} from "@/lib/equipoCompleto";
import { useIdioma } from "@/i18n/Idioma";
import type { Lang } from "@/i18n/rutas";
import { capituloEnIdioma } from "@/data/setupPeripherals.en";

// Definición de los módulos que componen el Setup Completo
// (el nombre corto y si es opcional, que no entra en el total, vienen de MODULOS_SETUP)
interface SetupModuleDef {
  id: string;
  order: string;
  title: string;
  titleEn: string;
  icon: React.ElementType;
  role: string;
  roleEn: string;
  synergyAspect: string;
  keyMetrics: string[];
  keyMetricsEn: string[];
}

const FICHAS_MODULO: SetupModuleDef[] = [
  {
    id: "monitor",
    order: "01",
    title: "Monitor Gamer de Alta Tasa de Refresco",
    titleEn: "High Refresh Rate Gaming Monitor",
    icon: Monitor,
    role: "La ventana de visualización: transmite cada cuadro generado por la GPU sin tearing ni latencia.",
    roleEn: "Your window into the game: it shows every frame the GPU makes, with no tearing and no lag.",
    synergyAspect: "Sincronización FPS vs Hz y densidad de píxeles (PPI)",
    keyMetrics: ["Resolución nativa", "Tasa de refresco (Hz)", "Tipo de panel (IPS / OLED)", "Tiempo de respuesta GtG"],
    keyMetricsEn: ["Native resolution", "Refresh rate (Hz)", "Panel type (IPS / OLED)", "GtG response time"],
  },
  {
    id: "keyboard",
    order: "02",
    title: "Teclado Mecánico / Magnético de Alto Rendimiento",
    titleEn: "High-Performance Mechanical / Magnetic Keyboard",
    icon: Keyboard,
    role: "La interfaz de entrada táctil: accionamiento milimétrico sin efecto rebote ni fatiga.",
    roleEn: "Your touch interface: precise actuation with no chatter and no fatigue.",
    synergyAspect: "Latencia de escaneo y liberación de espacio en escritorio",
    keyMetrics: ["Tipo de switches", "Polling rate (1KHz - 8KHz)", "Rapid Trigger", "Factor de forma (75% / TKL)"],
    keyMetricsEn: ["Switch type", "Polling rate (1KHz - 8KHz)", "Rapid Trigger", "Form factor (75% / TKL)"],
  },
  {
    id: "mouse",
    order: "03",
    title: "Ratón Ultra-Ligero & Superficie de Precisión",
    titleEn: "Ultra-Light Mouse & Precision Surface",
    icon: Mouse,
    role: "El apuntado milimétrico: cero aceleración, fricción controlada y seguimiento 1:1.",
    roleEn: "Pinpoint aim: zero acceleration, controlled friction and 1:1 tracking.",
    synergyAspect: "Sinergia de micropuntería y libertad de movimiento",
    keyMetrics: ["Peso neto (<55g)", "Sensor óptico (DPI/IPS)", "Frecuencia inalámbrica (4K/8K)", "Superficie de deslizamiento"],
    keyMetricsEn: ["Net weight (<55g)", "Optical sensor (DPI/IPS)", "Wireless polling (4K/8K)", "Glide surface"],
  },
  {
    id: "audio",
    order: "04",
    title: "Sistema de Audio Espacial & Micrófono de Estudio",
    titleEn: "Spatial Audio System & Studio Microphone",
    icon: Headphones,
    role: "El posicionamiento acústico: detección de pasos 3D y comunicación clara con tu equipo.",
    roleEn: "Positional sound: hear footsteps in 3D and talk to your team clearly.",
    synergyAspect: "Amplitud de escena sonora y aislamiento de ruido exterior",
    keyMetrics: ["Drivers / Transductores", "Audio espacial (Dolby / Hi-Res)", "Cápsula de micrófono", "DAC/Amp amplificador"],
    keyMetricsEn: ["Drivers", "Spatial audio (Dolby / Hi-Res)", "Mic capsule", "DAC/amp"],
  },
  {
    id: "ergonomics",
    order: "05",
    title: "Estación Ergonómica Postural & Soporte Activo",
    titleEn: "Ergonomic Station & Active Support",
    icon: Layers,
    role: "La base física del jugador: soporte de columna vertebral y regulación de altura para evitar lesiones.",
    roleEn: "The player's physical base: spine support and height adjustment to avoid injury.",
    synergyAspect: "Preservación postural y circulación durante sesiones extensas",
    keyMetrics: ["Mecanismo sincrónico lumbar", "Malla transpirable", "Escritorio Sit-Stand motorizado", "Capacidad de carga"],
    keyMetricsEn: ["Synchro-tilt lumbar", "Breathable mesh", "Motorized sit-stand desk", "Load capacity"],
  },
  {
    id: "accessories",
    order: "06",
    title: "Brazos VESA, Iluminación Circadiana & Hubs",
    titleEn: "VESA Arms, Circadian Lighting & Hubs",
    icon: Zap,
    role: "El orden del ecosistema: elevación de pantallas, luz sin reflejos y cero cables a la vista.",
    roleEn: "Order in your setup: screens lifted off the desk, glare-free light and no cables in sight.",
    synergyAspect: "Organización de cables y confort visual circadiano",
    keyMetrics: ["Brazo mecánico a gas VESA", "Lightbar asimétrica", "Canalización de cables", "Dock USB-C de alta velocidad"],
    keyMetricsEn: ["VESA gas arm", "Asymmetric light bar", "Cable management", "High-speed USB-C dock"],
  },
  {
    id: "streaming",
    order: "07",
    title: "Cámara, Micrófono, Luz & Control para Streamers",
    titleEn: "Camera, Microphone, Light & Control for Streamers",
    icon: Video,
    role: "Sólo si transmites o grabas: cámara para tu cara, voz limpia, luz que te ilumine y botones para cambiar de escena sin salir del juego. No entra en el total del setup.",
    roleEn: "Only if you stream or record: a camera for your face, clean voice, light on you and buttons to switch scenes without leaving the game. Not counted in the setup total.",
    synergyAspect: "Calidad de imagen y voz en el directo sin tocar el rendimiento del juego",
    keyMetrics: ["Webcam 1080p60 / 4K", "Stream Deck", "Key Light", "Micrófono dinámico", "Capturadora"],
    keyMetricsEn: ["1080p60 / 4K webcam", "Stream Deck", "Key Light", "Dynamic microphone", "Capture card"],
  },
  {
    id: "coolant",
    order: "08",
    title: "Líquidos para Refrigeración en Pecera",
    titleEn: "Coolants for Fishbowl Builds",
    icon: Droplets,
    role: "Sólo si montas refrigeración líquida de circuito abierto en una pecera: el líquido se ve a través del vidrio y forma parte del diseño. Los AIO no lo necesitan. No entra en el total del setup.",
    roleEn: "Only if you build a custom liquid cooling loop in a fishbowl case: the coolant shows through the glass and is part of the look. AIOs don't need it. Not counted in the setup total.",
    synergyAspect: "Color a la vista con el mínimo mantenimiento posible",
    keyMetrics: ["Agua destilada + aditivo", "Premezcla transparente", "Pastel (opaco)", "Con brillo", "Kit de limpieza"],
    keyMetricsEn: ["Distilled water + additive", "Clear premix", "Pastel (opaque)", "Shimmer", "Cleaning kit"],
  },
];

const SETUP_MODULES = FICHAS_MODULO.map((f) => ({ ...MODULOS_SETUP.find((m) => m.id === f.id)!, ...f }));

// Por qué de cada gama en módulos que no tienen capítulo en setupPeripherals.ts
const NOTAS_MODULO: Record<Lang, Record<string, Record<TierType, string>>> = {
  es: {
    streaming: {
      entrada:
        "Para empezar: webcam 1080p y micrófono USB. En OBS usa el codificador de la gráfica (NVENC en la RTX 5060, AMF en la RX 9060 XT) para no restar FPS al juego.",
      media:
        "Cámara 1080p60 con control manual, una luz frontal que evita la imagen granulada y un Stream Deck para cambiar de escena sin salir del juego.",
      alta:
        "Imagen 4K60, micrófono dinámico que no capta el teclado ni los ventiladores y un brazo que lo deja fuera de cámara.",
      extrema:
        "Cámara de lentes intercambiables conectada por Cam Link 4K: fondo desenfocado de verdad. La RTX 5080 codifica el directo en AV1 sin tocar el rendimiento del juego.",
    },
    coolant: {
      entrada:
        "Lo más barato y lo que mejor enfría: agua de alta pureza con un aditivo que evita algas y corrosión. Es transparente, así que el color lo ponen los tubos y la iluminación.",
      media:
        "Premezcla transparente lista para verter: casi no deja residuos y es la opción más fácil de mantener para una primera pecera.",
      alta:
        "Blanco pastel para la pecera blanca: un concentrado opaco que se mezcla con agua destilada. Pide revisar el circuito cada pocos meses.",
      extrema:
        "Líquido con brillo que forma remolinos al fluir, el más vistoso a través del vidrio, con kit de limpieza para cada cambio de líquido.",
    },
  },
  en: {
    streaming: {
      entrada:
        "To get started: a 1080p webcam and a USB microphone. In OBS, use the GPU encoder (NVENC on the RTX 5060, AMF on the RX 9060 XT) so the game keeps its FPS.",
      media:
        "A 1080p60 camera with manual control, a front light that keeps the image from looking grainy, and a Stream Deck to switch scenes without leaving the game.",
      alta:
        "4K60 image, a dynamic microphone that ignores your keyboard and fans, and an arm that keeps it out of frame.",
      extrema:
        "An interchangeable-lens camera through a Cam Link 4K: real background blur. The RTX 5080 encodes the stream in AV1 without touching game performance.",
    },
    coolant: {
      entrada:
        "The cheapest option and the one that cools best: high-purity water with an additive that stops algae and corrosion. It's clear, so the tubing and lighting provide the color.",
      media:
        "A clear premix ready to pour: it leaves almost no residue and is the easiest option to maintain for a first fishbowl build.",
      alta:
        "Pastel white for a white fishbowl build: an opaque concentrate you mix with distilled water. Check the loop every few months.",
      extrema:
        "A shimmer coolant that swirls as it flows, the most eye-catching through the glass, plus a cleaning kit for every coolant change.",
    },
  },
};

type PresetInfo = {
  name: string;
  targetRig: string;
  resolution: string;
  refreshRate: string;
  polling: string;
  audioTier: string;
  ergonomicsTier: string;
  synergySummary: string;
};

const PRESETS_POR_IDIOMA: Record<Lang, Record<TierType, PresetInfo>> = {
  es: {
    entrada: {
      name: nombreNivelSetup("entrada", "es"),
      targetRig: "Rig 1080p eSports (RTX 5060 / RX 9060 XT)",
      resolution: "1920 x 1080 (FHD)",
      refreshRate: "180Hz Fast IPS",
      polling: "1000Hz Inalámbrico",
      audioTier: "Drivers 53mm + Mic Desmontable",
      ergonomicsTier: "Silla de Malla con Soporte Lumbar",
      synergySummary:
        "Optimizada para máxima fluidez en 1080p sin gastar de más. Cada dólar va directo al refresco del monitor y a lo que tocas al jugar.",
    },
    media: {
      name: nombreNivelSetup("media", "es"),
      targetRig: "Rig 1440p Sweet Spot (RTX 5070 / RX 9070)",
      resolution: "2560 x 1440 (2K QHD)",
      refreshRate: "180Hz IPS o 280Hz QD-OLED",
      polling: "Inalámbrico Ultra-ligero (55g)",
      audioTier: "Inalámbricos + Micrófono USB",
      ergonomicsTier: "Silla de Malla con Lumbar Dinámico",
      synergySummary:
        "El punto dulce del hardware moderno. Nitidez 2K para distinguir enemigos a distancia y libertad inalámbrica con latencia imperceptible.",
    },
    alta: {
      name: nombreNivelSetup("alta", "es"),
      targetRig: "Rig Entusiasta 1440p 360Hz (RTX 5070 Ti / RX 9070 XT)",
      resolution: "2560 x 1440 QD-OLED",
      refreshRate: "360Hz QD-OLED (0.03ms GtG)",
      polling: "8000Hz Inalámbrico (54g)",
      audioTier: "Abiertos Planar + DAC/Amp R2R",
      ergonomicsTier: "Silla Ergonómica + Escritorio Eléctrico",
      synergySummary:
        "Panel OLED de contraste infinito y velocidad instantánea. Desaparece el ghosting por completo y el sonido abierto sitúa cada pisada en el espacio.",
    },
    extrema: {
      name: nombreNivelSetup("extrema", "es"),
      targetRig: "Rig 4K de Alta Tasa (RTX 5080 16GB)",
      resolution: "3840 x 2160 (4K Nativo) QD-OLED",
      refreshRate: "240Hz QD-OLED (0.03ms GtG)",
      polling: "8000Hz + Alfombrilla de Vidrio",
      audioTier: "Planar Magnéticos + Micrófono USB",
      ergonomicsTier: "Herman Miller Embody + Escritorio 4 Patas",
      synergySummary:
        "El techo del setup: 4K a 240Hz en OLED, audio planar de gama audiófila y una silla pensada para jornadas largas.",
    },
  },
  en: {
    entrada: {
      name: nombreNivelSetup("entrada", "en"),
      targetRig: "1080p eSports rig (RTX 5060 / RX 9060 XT)",
      resolution: "1920 x 1080 (FHD)",
      refreshRate: "180Hz Fast IPS",
      polling: "1000Hz wireless",
      audioTier: "53mm drivers + detachable mic",
      ergonomicsTier: "Mesh chair with lumbar support",
      synergySummary:
        "Tuned for maximum smoothness at 1080p without overspending. Every dollar goes to monitor refresh rate and to what your hands touch.",
    },
    media: {
      name: nombreNivelSetup("media", "en"),
      targetRig: "1440p sweet spot rig (RTX 5070 / RX 9070)",
      resolution: "2560 x 1440 (2K QHD)",
      refreshRate: "180Hz IPS or 280Hz QD-OLED",
      polling: "Ultra-light wireless (55g)",
      audioTier: "Wireless headset + USB microphone",
      ergonomicsTier: "Mesh chair with dynamic lumbar",
      synergySummary:
        "The sweet spot of modern hardware. 2K sharpness to pick out distant enemies, and wireless freedom with latency you can't feel.",
    },
    alta: {
      name: nombreNivelSetup("alta", "en"),
      targetRig: "Enthusiast 1440p 360Hz rig (RTX 5070 Ti / RX 9070 XT)",
      resolution: "2560 x 1440 QD-OLED",
      refreshRate: "360Hz QD-OLED (0.03ms GtG)",
      polling: "8000Hz wireless (54g)",
      audioTier: "Open-back planar + R2R DAC/amp",
      ergonomicsTier: "Ergonomic chair + electric desk",
      synergySummary:
        "An OLED panel with infinite contrast and instant response. Ghosting disappears entirely, and open-back sound places every footstep in space.",
    },
    extrema: {
      name: nombreNivelSetup("extrema", "en"),
      targetRig: "High refresh 4K rig (RTX 5080 16GB)",
      resolution: "3840 x 2160 (native 4K) QD-OLED",
      refreshRate: "240Hz QD-OLED (0.03ms GtG)",
      polling: "8000Hz + glass mousepad",
      audioTier: "Planar magnetic + USB microphone",
      ergonomicsTier: "Herman Miller Embody + 4-leg desk",
      synergySummary:
        "The ceiling of the setup: 4K at 240Hz on OLED, audiophile planar sound and a chair built for long days.",
    },
  },
};

export function SetupVista() {
  const { lang, tr, ruta } = useIdioma();
  const PRESETS_INFO = PRESETS_POR_IDIOMA[lang];
  const nombreCorto = (tier: TierType) => PRESETS_INFO[tier].name.replace(tr("Nivel ", " Level"), "");
  const { selectedTier, selectTier } = useConfiguratorStore();

  // Módulo abierto en el acordeón (por defecto el Monitor)
  const [activeModuleId, setActiveModuleId] = useState<string>("monitor");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLista, setCopiedLista] = useState(false);

  // "Reset" deja la página sin nivel para que el usuario elija (15-09-2026; antes volvía a Media).
  // Es estado local: el nivel del store lo comparten otras páginas y no admite "ninguno".
  const [sinNivel, setSinNivel] = useState(false);
  const nivel: TierType | null = sinNivel ? null : selectedTier;

  // Selección interactiva de periféricos (18-09-2026):
  // Permite elegir uno, mantener ambos o quitar opciones para que sumen a la build real
  const setupProductosGuardados = useEquipo((s) => s.setupProductos);
  const guardarSetupProductos = useEquipo((s) => s.guardarSetupProductos);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const elegirNivel = (tier: TierType) => {
    setSinNivel(false);
    selectTier(tier, true);
    const def = productosPorDefecto(tier);
    setSelectedProductIds(def);
    guardarSetupProductos(def);
  };

  const handleReset = () => {
    setSinNivel(true);
    setSelectedProductIds([]);
    guardarSetupProductos([]);
  };

  // Alternar selección de un producto individual (sumar o quitar de la build)
  const toggleProducto = (id: string) => {
    setSelectedProductIds((prev) => {
      const existe = prev.includes(id);
      const siguiente = existe ? prev.filter((x) => x !== id) : [...prev, id];
      guardarSetupProductos(siguiente);
      return siguiente;
    });
  };

  // Acciones en lote para un módulo: elegir todos o deseleccionar todos
  const seleccionarTodosDelModulo = (ids: string[]) => {
    setSelectedProductIds((prev) => {
      const set = new Set(prev);
      ids.forEach((id) => set.add(id));
      const siguiente = Array.from(set);
      guardarSetupProductos(siguiente);
      return siguiente;
    });
  };

  const deseleccionarTodosDelModulo = (ids: string[]) => {
    setSelectedProductIds((prev) => {
      const set = new Set(ids);
      const siguiente = prev.filter((id) => !set.has(id));
      guardarSetupProductos(siguiente);
      return siguiente;
    });
  };

  // El configurador abre la PC guardada; si no hay, el preset del nivel
  const enlaceConfigurador = nivel ? `${ruta("configurador")}?nivel=${nivel}` : ruta("configurador");

  // La PC elegida en el configurador o en presupuestos (guardada en el navegador) y, de vuelta, el
  // nivel de este setup, para que el configurador también sume los periféricos
  const equipoListo = useCargarEquipo();
  const pcGuardada = useEquipo((s) => s.pc);
  const guardarSetupNivel = useEquipo((s) => s.guardarSetupNivel);

  useEffect(() => {
    if (equipoListo) {
      guardarSetupNivel(nivel);
      if (setupProductosGuardados && setupProductosGuardados.length > 0) {
        setSelectedProductIds(setupProductosGuardados);
      } else if (nivel) {
        const def = productosPorDefecto(nivel);
        setSelectedProductIds(def);
        guardarSetupProductos(def);
      }
    }
  }, [equipoListo]);

  useEffect(() => {
    if (equipoListo) guardarSetupNivel(nivel);
  }, [equipoListo, nivel, guardarSetupNivel]);

  const pc = pcGuardada && Object.keys(pcGuardada.componentes).length > 0 ? pcGuardada : null;
  const piezas = pc ? piezasPc(pc.componentes, lang) : [];
  const precioPc = pc ? totalPc(pc.componentes) : 0;
  const origenPc = pc
    ? pc.origen === "presupuestos"
      ? tr(`de Presupuestos${pc.nombre ? `: ${pc.nombre}` : ""}`, `from Budgets${pc.nombre ? `: ${pc.nombre}` : ""}`)
      : tr("del Configurador", "from the Configurator")
    : "";

  // Miniatura de cada módulo: uno de sus productos al azar (cambia en cada visita y de nivel)
  const semillaAzar = useSemillaAzar();
  const fotoModulo = (moduleId: string) => {
    if (!nivel) return null;
    const conFoto = productosDe(moduleId, nivel).filter((p) => p.image);
    return conFoto.length ? conFoto[indiceAlAzar(semillaAzar, `${moduleId}-${nivel}`, conFoto.length)] : null;
  };

  // Información del preset actual
  const currentPreset = PRESETS_INFO[selectedTier] || PRESETS_INFO.media;

  // Total del setup: suma dinámica de todos los periféricos seleccionados por el usuario
  const totalSetup = useMemo(() => {
    if (selectedProductIds.length > 0) {
      return calcularTotalProductos(selectedProductIds);
    }
    return nivel ? calcularTotalSetup(nivel) : 0;
  }, [selectedProductIds, nivel]);

  const totalStreaming = useMemo(() => {
    const idSet = new Set(selectedProductIds);
    return SETUP_PRODUCTS.filter((p) => p.module === "streaming" && idSet.has(p.id)).reduce(
      (s, p) => s + p.price,
      0
    );
  }, [selectedProductIds]);

  const totalLiquidos = useMemo(() => {
    const idSet = new Set(selectedProductIds);
    return SETUP_PRODUCTS.filter((p) => p.module === "liquidos" && idSet.has(p.id)).reduce(
      (s, p) => s + p.price,
      0
    );
  }, [selectedProductIds]);

  // Copiar la lista completa: la PC guardada y los periféricos elegidos, con el total exacto de ambos
  const handleCopyLista = () => {
    const lineas = [
      tr("=== MI SETUP COMPLETO 2026 · PC + PERIFÉRICOS ===", "=== MY FULL SETUP 2026 · PC + PERIPHERALS ==="),
      tr(
        `Total PC + setup: ${usd(precioPc + totalSetup)} USD (${textoPreciosConFechas(lang)}; no son el precio exacto)`,
        `PC + setup total: ${usd(precioPc + totalSetup)} USD (${textoPreciosConFechas(lang)}; not the exact price)`
      ),
      "",
      ...(pc
        ? [
            `--- PC (${origenPc}): ${usd(precioPc)} USD ---`,
            ...piezas.map((p) => `• ${p.categoria}: ${p.item.name} (${precioPiezaTexto(p.item, lang)})`),
          ]
        : [
            tr(
              `--- PC: aún sin armar (configúrala en ${ruta("configurador")}) ---`,
              `--- PC: not built yet (build it at ${ruta("configurador")}) ---`
            ),
          ]),
      "",
      ...(selectedProductIds.length > 0
        ? lineasSetupSeleccionado(selectedProductIds, nivel, lang)
        : nivel
        ? lineasSetup(nivel, lang)
        : [tr("--- SETUP COMPLETO: sin nivel elegido ---", "--- FULL SETUP: no level chosen ---")]),
      "",
      `${tr("Verificado en", "Checked at")} https://tupcgamer.com${ruta("setup")}`,
    ];
    navigator.clipboard.writeText(lineas.join("\n"));
    setCopiedLista(true);
    setTimeout(() => setCopiedLista(false), 2500);
  };

  // Filtrado de módulos según la búsqueda didáctica
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return SETUP_MODULES;
    const q = searchQuery.toLowerCase();
    return SETUP_MODULES.filter((m) =>
      [m.title, m.titleEn, m.label, m.labelEn, m.role, m.roleEn, ...m.keyMetrics, ...m.keyMetricsEn].some((t) =>
        t.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);

  // Manejador para copiar enlace del setup
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Manejador para imprimir / PDF
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col selection:bg-white selection:text-black overflow-x-hidden">
      <SiteHeader />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-14 pb-28 lg:pb-14 w-full print:p-0">
        {/* Breadcrumb */}
        <div className="mb-6 print:hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[10px] font-mono tracking-widest text-gray-500 uppercase">
            <Link href={ruta("guias")} className="hover:text-white transition-colors">
              {tr("Guías", "Guides")}
            </Link>
            <span>/</span>
            <Link href={ruta("configurador")} className="hover:text-white transition-colors">
              {tr("Configurador PC", "PC Configurator")}
            </Link>
            <span>/</span>
            <span className="text-gray-300">{tr("Setup Completo 2026", "Full Setup 2026")}</span>
          </div>
        </div>

        {/* Intro & Header del Ecosistema */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[11px] font-mono tracking-[0.25em] text-emerald-400 uppercase mb-3">
              <CheckCircle2 size={14} /> {tr("[ ARQUITECTURA DE ECOSISTEMA & PERIFÉRICOS ]", "[ ECOSYSTEM & PERIPHERALS ARCHITECTURE ]")}
            </div>
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-3">
              {tr("Configura tu Setup Completo.", "Build your full setup.")}
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-3xl font-sans font-light leading-relaxed">
              {tr(
                "Un PC potente pierde su valor si juegas en un monitor lento o con periféricos que agregan latencia. Aquí sintonizamos pantalla, switches, sensor óptico, acústica y ergonomía con el nivel de tu equipo para eliminar cualquier cuello de botella sensorial.",
                "A powerful PC loses its value if you play on a slow monitor or with peripherals that add latency. Here we match screen, switches, optical sensor, sound and ergonomics to your rig's level, so nothing holds your senses back."
              )}
            </p>
          </div>

          {/* Selector de Nivel de Rig para Periféricos */}
          {/* Selector de Nivel de Rig para Periféricos */}
          <div className="flex items-center gap-1.5 mt-2 lg:mt-0 print:hidden shrink-0">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mr-1 hidden sm:inline-block">
              {tr("Nivel de Rig:", "Rig level:")}
            </span>
            <div className="flex flex-wrap items-center bg-[#08090a]/80 backdrop-blur-sm border border-white/10 p-0.5 rounded-lg shadow-inner">
              {(["entrada", "media", "alta", "extrema"] as TierType[]).map((tierKey) => {
                const isSelected = nivel === tierKey;
                return (
                  <button
                    key={tierKey}
                    onClick={() => elegirNivel(tierKey)}
                    className={`px-3.5 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white text-black font-bold shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {nombreCorto(tierKey)}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleReset}
              title={tr("Limpiar selección", "Reset selection")}
              className="ml-2 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#08090a]/80 backdrop-blur-sm border border-white/10 text-gray-400 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Global Toolbar: Búsqueda y Estado del Catálogo */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#08090a]/70 backdrop-blur-md border border-white/10 mb-8 print:hidden shadow-lg">
          {/* Barra de Búsqueda */}
          <div className="relative w-full md:w-96">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr(
                "Explorar módulos (ej. OLED, Rapid Trigger, 4KHz, VESA)...",
                "Search modules (e.g. OLED, Rapid Trigger, 4KHz, VESA)..."
              )}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Badge Informativo de Recaudación de Datos */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>{tr("Modelos reales con precio en EE.UU.", "Real models with US prices")}</span>
            </div>
            <span className="text-[11px] font-mono text-gray-400">
              {SETUP_PRODUCTS.length} {tr("periféricos", "peripherals")} · {SETUP_MODULES.length}{" "}
              {tr("módulos", "modules")}
            </span>
          </div>
        </div>

        {/* Main Grid: Módulos del Setup (Izquierda 65%) + Resumen Sticky (Derecha 35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Acordeón de Módulos del Setup */}
          <div className="lg:col-span-8 space-y-6">
            {filteredModules.map((mod) => {
              const Icon = mod.icon;
              const isOpen = activeModuleId === mod.id;
              const chapterBase = setupPeripheralsData.find((p) => p.id === mod.id);
              const chapterData = chapterBase ? capituloEnIdioma(chapterBase, lang) : undefined;
              const tierRec = nivel ? chapterData?.recommendations[nivel] : undefined;
              const productos = nivel ? productosDe(mod.id, nivel) : [];
              const prodsModSeleccionados = productos.filter((p) => selectedProductIds.includes(p.id));
              const totalModSeleccionado = prodsModSeleccionados.reduce((s, p) => s + p.price, 0);
              const foto = fotoModulo(mod.id);
              const nombreFoto = foto ? `${foto.brand} ${foto.model}` : "";

              return (
                <div
                  key={mod.id}
                  id={`modulo-${mod.id}`}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-[#08090a]/70 backdrop-blur-md border-white/20 shadow-2xl ring-1 ring-white/10"
                      : "bg-[#08090a]/50 backdrop-blur-md border-white/10 hover:border-white/20 hover:bg-[#08090a]/65"
                  }`}
                >
                  {/* Header de Categoría Clickeable */}
                  <div
                    onClick={() => setActiveModuleId(isOpen ? "" : mod.id)}
                    className="p-5 md:p-6 flex items-center justify-between cursor-pointer select-none"
                    {...vistaPrevia(foto?.image ?? undefined, nombreFoto)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {foto?.image ? (
                        <div
                          className={`w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center border shrink-0 bg-white p-1 transition-colors ${
                            isOpen ? "border-white ring-1 ring-white/60 shadow-md" : "border-white/10"
                          }`}
                        >
                          <img
                            src={foto.image}
                            alt={nombreFoto}
                            className="max-w-full max-h-full object-contain touch-manipulation"
                            {...ampliarAlTocar(foto.image, nombreFoto)}
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-colors ${
                            isOpen
                              ? "bg-white text-black border-white shadow-md"
                              : "bg-white/[0.04] text-gray-300 border-white/10"
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                            {tr("MÓDULO", "MODULE")} {mod.order}
                          </span>
                          <span className="text-gray-600 font-mono text-xs">//</span>
                          <span className="text-[10px] font-mono text-gray-400 uppercase">
                            {nombreModulo(mod, lang)}
                          </span>
                        </div>
                        <h2 className="text-base md:text-lg font-medium text-white truncate">
                          {lang === "en" ? mod.titleEn : mod.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {productos.length > 0 && (
                        <span
                          className={`hidden sm:inline-block text-[10px] font-mono px-2.5 py-1 rounded border uppercase transition-colors ${
                            prodsModSeleccionados.length > 0
                              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold"
                              : "bg-white/[0.04] border-white/10 text-gray-400"
                          }`}
                        >
                          {prodsModSeleccionados.length > 0
                            ? `${usd(totalModSeleccionado)} (${prodsModSeleccionados.length})`
                            : `${tr("Desde", "From")} ${usd(precioModulo(productos))}`}
                        </span>
                      )}
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-white" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Contenido Desplegable del Módulo */}
                  {isOpen && (
                    <div className="px-5 md:px-6 pb-6 pt-2 border-t border-white/10 space-y-6">
                      {/* Descripción del Rol de este Periférico */}
                      <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans font-light">
                        {lang === "en" ? mod.roleEn : mod.role}
                      </p>

                      {/* Sin nivel (tras "Reset"): se pide elegirlo aquí mismo */}
                      {!nivel && (
                        <div className="p-4 md:p-5 rounded-xl bg-white/[0.02] border border-dashed border-white/15 space-y-3">
                          <p className="text-xs text-gray-300 leading-relaxed">
                            {tr(
                              "Elige un nivel de rig para ver los modelos recomendados de este módulo.",
                              "Pick a rig level to see the recommended models for this module."
                            )}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(["entrada", "media", "alta", "extrema"] as TierType[]).map((tierKey) => (
                              <button
                                key={tierKey}
                                type="button"
                                onClick={() => elegirNivel(tierKey)}
                                className="px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider bg-white/[0.04] border border-white/15 text-gray-300 hover:text-white hover:border-white/40 transition-all cursor-pointer"
                              >
                                {nombreCorto(tierKey)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Panel Didáctico de Sinergia Recomendada para el Nivel Seleccionado */}
                      {nivel && (
                      <div className="p-4 md:p-5 rounded-xl bg-gradient-to-r from-emerald-950/20 via-black/40 to-black/30 border border-emerald-500/20 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                            <Sparkles size={13} />
                            {tr("Sinergia Recomendada para", "Recommended match for")} {currentPreset.name}
                          </div>
                          {productos.length > 0 && (
                            <div className="text-xs font-mono">
                              {prodsModSeleccionados.length > 0 ? (
                                <span className="text-emerald-400 font-semibold">
                                  {tr("En tu build:", "In your build:")} {usd(totalModSeleccionado)}{" "}
                                  <span className="text-gray-400 font-normal">
                                    ({prodsModSeleccionados.length}{" "}
                                    {prodsModSeleccionados.length === 1
                                      ? tr("opción", "option")
                                      : tr("opciones", "options")})
                                  </span>
                                </span>
                              ) : (
                                <span className="text-gray-400 font-semibold">
                                  {tr("Precio del módulo: desde", "Module price: from")} {usd(precioModulo(productos))}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Con modelos reales sólo se muestra el porqué de la gama: título y fichas
                            de setupPeripherals describen un producto genérico y no deben contradecirlos */}
                        {productos.length > 0 && (tierRec || NOTAS_MODULO[lang][mod.id]) && (
                          <p className="text-xs text-gray-300 leading-relaxed font-light">
                            {tierRec?.synergyNotice ?? NOTAS_MODULO[lang][mod.id]?.[nivel]}
                          </p>
                        )}
                        {tierRec && productos.length === 0 && (
                          <>
                            <div className="text-sm font-medium text-white">
                              {tierRec.title}
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-light">
                              {tierRec.synergyNotice}
                            </p>
                            <div className="text-xs text-gray-400 leading-relaxed italic">
                              {tierRec.didacticExplanation}
                            </div>

                            {/* Fichas Técnicas Objetivo */}
                            {tierRec.keySpecs && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
                                {tierRec.keySpecs.map((spec, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono"
                                  >
                                    <div className="text-gray-400 text-[10px] uppercase">
                                      {spec.label}
                                    </div>
                                    <div className="text-white font-medium text-[11px] mt-0.5 truncate">
                                      {spec.value}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      )}

                      {/* Modelos reales de este módulo para la gama elegida */}
                      {productos.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                            <span className="flex items-center gap-1.5">
                              <Database size={12} />
                              {tr("Modelos recomendados", "Recommended models")} · {currentPreset.name}
                            </span>
                            <div className="flex flex-wrap items-center gap-3">
                              {prodsModSeleccionados.length > 0 ? (
                                <span className="normal-case tracking-normal text-emerald-400 flex items-center gap-1 font-medium">
                                  <CheckCircle2 size={12} />
                                  {prodsModSeleccionados.length}{" "}
                                  {prodsModSeleccionados.length === 1
                                    ? tr("elegido", "selected")
                                    : tr("elegidos", "selected")}{" "}
                                  ({usd(totalModSeleccionado)})
                                </span>
                              ) : (
                                <span className="normal-case tracking-normal text-amber-400/90 flex items-center gap-1 font-medium">
                                  <Info size={12} />
                                  {tr("Elige uno o mantén ambos", "Pick one or keep both")}
                                </span>
                              )}
                              {productos.length > 1 && (
                                <div className="flex items-center gap-1.5 normal-case tracking-normal">
                                  <button
                                    type="button"
                                    onClick={() => seleccionarTodosDelModulo(productos.map((p) => p.id))}
                                    className="text-[10px] text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                                  >
                                    {tr("Elegir ambos", "Keep both")}
                                  </button>
                                  <span className="text-gray-600">·</span>
                                  <button
                                    type="button"
                                    onClick={() => deseleccionarTodosDelModulo(productos.map((p) => p.id))}
                                    className="text-[10px] text-gray-500 hover:text-gray-300 underline cursor-pointer"
                                  >
                                    {tr("Quitar módulo", "Remove all")}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {productos.map((p) => {
                              const isSelected = selectedProductIds.includes(p.id);
                              return (
                                <div
                                  key={p.id}
                                  onClick={() => toggleProducto(p.id)}
                                  role="checkbox"
                                  aria-checked={isSelected}
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      toggleProducto(p.id);
                                    }
                                  }}
                                  className={`relative rounded-xl border transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group select-none ${
                                    isSelected
                                      ? "border-emerald-500/70 bg-emerald-500/[0.04] ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/5"
                                      : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
                                  }`}
                                >
                                  {/* Badge superior de estado en build */}
                                  <div className="absolute top-2.5 right-2.5 z-10">
                                    {isSelected ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-mono font-bold shadow-md">
                                        <Check size={12} strokeWidth={3} />
                                        {tr("EN TU BUILD", "IN YOUR BUILD")}
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 text-[10px] font-mono text-gray-300 group-hover:text-white group-hover:border-white/40 transition-colors">
                                        <Plus size={11} />
                                        {tr("Añadir", "Add")}
                                      </span>
                                    )}
                                  </div>

                                  <div className="h-52 bg-white flex items-center justify-center p-3 relative">
                                    {p.image ? (
                                      <img
                                        src={p.image}
                                        alt={`${p.brand} ${p.model}`}
                                        loading="lazy"
                                        className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                                      />
                                    ) : (
                                      <Icon size={40} className="text-gray-300" />
                                    )}
                                  </div>
                                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                                    <div>
                                      {p.kind && (
                                        <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-0.5">
                                          {tipoDe(p, lang)}
                                        </div>
                                      )}
                                      <div className="text-sm font-medium text-white leading-snug group-hover:text-emerald-300 transition-colors">
                                        {p.brand} {p.model}
                                      </div>
                                    </div>
                                    <div className="space-y-1 text-[11px] font-mono">
                                      {(lang === "en" && p.specsEn ? p.specsEn : p.specs).map((s) => (
                                        <div key={s.label} className="flex justify-between gap-3">
                                          <span className="text-gray-500 shrink-0">{s.label}</span>
                                          <span className="text-gray-200 text-right">{s.value}</span>
                                        </div>
                                      ))}
                                    </div>
                                    {(lang === "en" ? p.noteEn : p.note) && (
                                      <p className="text-[11px] text-gray-400 leading-relaxed italic">
                                        {lang === "en" ? p.noteEn : p.note}
                                      </p>
                                    )}
                                    <div className="mt-auto pt-3 border-t border-white/10 flex items-end justify-between gap-3">
                                      <div>
                                        <div className="text-lg font-mono font-medium text-white">{usd(p.price)}</div>
                                        <div className="text-[10px] font-mono text-gray-500">
                                          {lang === "en" ? p.storeEn ?? p.store : p.store}
                                          {p.stock && p.stock !== "disponible"
                                            ? ` · ${lang === "en" ? p.stockEn ?? p.stock : p.stock}`
                                            : ""}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleProducto(p.id);
                                          }}
                                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                                            isSelected
                                              ? "bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300"
                                              : "bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white"
                                          }`}
                                        >
                                          {isSelected ? (
                                            <>
                                              <Check size={11} className="text-emerald-400" />
                                              <span>{tr("Quitar", "Remove")}</span>
                                            </>
                                          ) : (
                                            <>
                                              <Plus size={11} />
                                              <span>{tr("Elegir", "Pick")}</span>
                                            </>
                                          )}
                                        </button>

                                        <a
                                          href={p.url}
                                          target="_blank"
                                          rel="noopener noreferrer nofollow"
                                          onClick={(e) => e.stopPropagation()}
                                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded border border-white/15 text-[10px] font-mono uppercase tracking-wider text-gray-400 hover:text-white hover:border-white/40 transition-colors print:hidden"
                                          title={tr("Abrir en tienda oficial", "Open in official store")}
                                        >
                                          <ExternalLink size={11} />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Botón Siguiente Módulo */}
                      <div className="flex justify-end pt-2">
                        {mod.id !== SETUP_MODULES[SETUP_MODULES.length - 1].id ? (
                          <button
                            type="button"
                            onClick={() => {
                              const nextModIndex = SETUP_MODULES.findIndex((m) => m.id === mod.id) + 1;
                              if (nextModIndex < SETUP_MODULES.length) {
                                setActiveModuleId(SETUP_MODULES[nextModIndex].id);
                              }
                            }}
                            className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-mono text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-all cursor-pointer"
                          >
                            <span>{tr("Siguiente Módulo", "Next module")}</span>
                            <ArrowRight size={14} />
                          </button>
                        ) : (
                          <a
                            href="#resumen-setup"
                            className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-mono text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-all cursor-pointer"
                          >
                            <span>{tr("Ver Resumen de Ecosistema", "See setup summary")}</span>
                            <ArrowRight size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Columna Derecha: Resumen Sticky del Ecosistema */}
          <div id="resumen-setup" className="lg:col-span-4 lg:sticky lg:top-6 space-y-6 scroll-mt-24">
            <div className="p-5 md:p-7 bg-[#08090a]/75 backdrop-blur-md border border-white/10 rounded-2xl space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono tracking-widest text-gray-400 uppercase">
                  {tr("RESUMEN DE SETUP COMPLETO", "FULL SETUP SUMMARY")}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Sparkles size={12} /> 2026 ECOSYSTEM
                </span>
              </div>

              {/* Tarjeta de Sinergia de Periféricos con el Rig */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-black/40 to-white/[0.02] border border-emerald-500/25 space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>{tr("Sinergia Sensorial Calibrada", "Calibrated sensory match")}</span>
                </div>
                {nivel ? (
                  <>
                    <div className="text-gray-300 leading-relaxed font-sans text-xs">
                      {currentPreset.synergySummary}
                    </div>
                    <div className="text-[10px] text-gray-400 pt-1 border-t border-white/5">
                      {tr("Base recomendada:", "Recommended base:")} <span className="text-white">{currentPreset.targetRig}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-300 leading-relaxed font-sans text-xs">
                    {tr(
                      "Elige un nivel de rig (Entrada, Media, Alta o Extrema) para calibrar el setup.",
                      "Pick a rig level (Entry, Mid, High or Extreme) to calibrate the setup."
                    )}
                  </div>
                )}
              </div>

              {/* Métricas Visuales y Sensoriales Clave */}
              {nivel && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 text-xs font-mono">
                <div className="flex justify-between items-center text-gray-400">
                  <span>{tr("Resolución Objetivo:", "Target resolution:")}</span>
                  <span className="text-white font-semibold">{currentPreset.resolution}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>{tr("Tasa de Refresco:", "Refresh rate:")}</span>
                  <span className="text-emerald-400 font-semibold">{currentPreset.refreshRate}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>{tr("Polling Entrada:", "Input polling:")}</span>
                  <span className="text-white font-semibold">{currentPreset.polling}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>{tr("Acústica Sugerida:", "Suggested audio:")}</span>
                  <span className="text-gray-300 text-right truncate max-w-[180px]">{currentPreset.audioTier}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 pt-1 border-t border-white/5">
                  <span>{tr("Ergonomía:", "Ergonomics:")}</span>
                  <span className="text-gray-300 text-right truncate max-w-[180px]">{currentPreset.ergonomicsTier}</span>
                </div>
              </div>
              )}

              {/* Desglose de los Módulos Arquitectónicos */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block">
                  {tr("Módulos Arquitectónicos:", "Setup modules:")}
                </span>
                {SETUP_MODULES.map((mod) => {
                  const prodsMod = SETUP_PRODUCTS.filter(
                    (p) => p.module === mod.id && selectedProductIds.includes(p.id)
                  );
                  const totalMod = prodsMod.reduce((s, p) => s + p.price, 0);
                  const tieneSeleccion = prodsMod.length > 0;

                  return (
                    <div
                      key={mod.id}
                      className="flex justify-between items-center text-gray-300 py-1.5 border-b border-white/[0.03] text-xs font-mono"
                    >
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <span className="text-gray-600">{mod.order}</span>
                        <span>{nombreModulo(mod, lang)}:</span>
                      </span>
                      <span
                        className={`text-[11px] ${
                          tieneSeleccion
                            ? "text-emerald-400 font-semibold"
                            : mod.optional
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        {tieneSeleccion
                          ? `${usd(totalMod)}${prodsMod.length > 1 ? ` (${prodsMod.length})` : ""}`
                          : nivel
                          ? mod.optional
                            ? tr("Opcional", "Optional")
                            : tr("Sin elegir", "None")
                          : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Rango de Inversión Estimada */}
              <div className="pt-4 border-t border-white/10 space-y-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      {tr("Setup Seleccionado", "Selected Setup")}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      {selectedProductIds.length}{" "}
                      {selectedProductIds.length === 1
                        ? tr("periférico en tu build", "peripheral in build")
                        : tr("periféricos en tu build", "peripherals in build")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-medium font-mono text-emerald-400">
                      {usd(totalSetup)}
                    </div>
                  </div>
                </div>
                {totalStreaming > 0 && (
                  <div className="flex justify-between items-baseline text-[11px] font-mono text-gray-400">
                    <span>{tr("Incluye kit de streaming:", "Includes streaming kit:")}</span>
                    <span className="text-gray-200">{usd(totalStreaming)}</span>
                  </div>
                )}
                {totalLiquidos > 0 && (
                  <div className="flex justify-between items-baseline text-[11px] font-mono text-gray-400">
                    <span>{tr("Incluye refrigerante pecera:", "Includes fishbowl coolant:")}</span>
                    <span className="text-gray-200">{usd(totalLiquidos)}</span>
                  </div>
                )}
              </div>

              {/* Tu PC (del configurador o de presupuestos) y el total de los dos */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-baseline gap-3">
                  <span className="text-[10px] tracking-widest uppercase text-gray-400">{tr("Tu PC", "Your PC")}</span>
                  <span className="text-white font-semibold">{pc ? usd(precioPc) : "—"}</span>
                </div>
                {pc ? (
                  <>
                    <div className="text-[11px] text-gray-300 leading-snug">
                      {origenPc} · {tr(
                        `${pc ? CATEGORIAS_OBLIGATORIAS.filter((id) => pc.componentes[id]).length : 0} de ${CATEGORIAS_OBLIGATORIAS.length} piezas`,
                        `${pc ? CATEGORIAS_OBLIGATORIAS.filter((id) => pc.componentes[id]).length : 0} of ${CATEGORIAS_OBLIGATORIAS.length} parts`
                      )}
                    </div>
                    <Link href={ruta("configurador")} className="text-[11px] text-gray-400 hover:text-white underline">
                      {tr("Cambiar piezas en el configurador", "Change parts in the configurator")}
                    </Link>
                  </>
                ) : (
                  <div className="text-[11px] text-gray-400 leading-snug">
                    {tr("Aún no has armado tu PC.", "You haven't built your PC yet.")}{" "}
                    <Link href={ruta("configurador")} className="text-white underline">
                      {tr("Ármala en el configurador", "Build it in the configurator")}
                    </Link>{" "}
                    {tr("o elige una en", "or pick one in")}{" "}
                    <Link href={ruta("presupuestos")} className="text-white underline">
                      {tr("Presupuestos", "Budgets")}
                    </Link>
                    .
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                  <span className="text-[10px] tracking-widest uppercase text-emerald-400">
                    {tr("PC + Setup total", "Total PC + Setup")}
                  </span>
                  <span className="text-2xl font-medium text-white">{usd(precioPc + totalSetup)}</span>
                </div>
                <AvisoPrecios className="block text-[10px] leading-snug text-gray-500" />
              </div>

              {/* Botones de Acción */}
              <div className="space-y-2 pt-2 border-t border-white/10 print:hidden">
                <button
                  type="button"
                  onClick={handleCopyLista}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
                >
                  {copiedLista ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedLista ? tr("¡Lista Copiada!", "List copied!") : tr("Copiar Lista PC + Setup", "Copy PC + Setup list")}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                  <span>{copiedLink ? tr("¡Enlace Copiado!", "Link copied!") : tr("Compartir Setup", "Share setup")}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center justify-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white py-2 rounded-lg font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>{tr("Imprimir / PDF", "Print / PDF")}</span>
                  </button>

                  <Link
                    href={enlaceConfigurador}
                    className="inline-flex items-center justify-center gap-1.5 bg-white text-black hover:bg-gray-200 py-2 rounded-lg font-mono text-[11px] uppercase tracking-wider font-semibold transition-all"
                  >
                    <SlidersHorizontal size={13} />
                    <span>{tr("Configurar PC", "Configure PC")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <VistaPreviaFlotante soloIzquierda />
      <InformeEquipo
        componentes={pc?.componentes ?? null}
        origenPc={origenPc}
        setupNivel={nivel}
        setupProductos={selectedProductIds}
      />

      {/* Barra Fija Inferior para Móviles */}
      <div className="lg:hidden print:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#0d0f12]/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base font-mono font-medium text-white leading-tight">
              {nivel ? currentPreset.name : tr("Sin nivel", "No level")}
            </div>
            <div className="text-[10px] font-mono text-emerald-400 truncate">
              {nivel
                ? tr(`PC + setup: ${usd(precioPc + totalSetup)}`, `PC + setup: ${usd(precioPc + totalSetup)}`)
                : tr("Elige un nivel de rig", "Pick a rig level")}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={enlaceConfigurador}
              className="inline-flex items-center gap-1 bg-white text-black px-3.5 py-2 rounded font-mono text-xs uppercase font-semibold tracking-wider hover:bg-gray-200 transition-colors"
            >
              <SlidersHorizontal size={12} />
              <span>{tr("Armar PC", "Build PC")}</span>
            </Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
